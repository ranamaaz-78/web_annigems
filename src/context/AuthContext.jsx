import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, errorText, getToken, setToken } from '../api/client';
import { mapAddress, mapOrder, mapUser } from '../api/mappers';
import { DEMO_B2B_USER, SEED_B2B_ORDERS } from '../data/b2b';
import { COUNTRY_LIST, countryCode } from '../data/site';
import { readStorage, removeStorage, writeStorage } from '../utils/storage';
import { AuthContext } from './contexts';

// Customer accounts run on the Web Portal API (Bearer token):
//   auth/register, auth/login, auth/google, auth/forgot-password, auth/reset-password, auth/logout,
//   me, me/password, me/addresses, orders.
// The B2B (business) module has no backend yet, so its demo session and orders stay in localStorage.

const B2B_USERS_KEY = 'aani-users';
const B2B_SESSION_KEY = 'aani-session';
const B2B_ORDERS_KEY = 'aani-orders';

const normalize = (email) => email.trim().toLowerCase();
const publicUser = (u) => {
  if (!u) return null;
  const { password: _password, ...rest } = u;
  return rest;
};

// Adds seed records that an older stored copy is missing.
const withSeeds = (stored, seeds) => [...stored, ...seeds.filter((seed) => !stored.some((item) => item.id === seed.id))];
const loadB2BUsers = () => withSeeds(readStorage(B2B_USERS_KEY, []).filter((u) => u.accountType === 'b2b'), [DEMO_B2B_USER]);
const loadB2BOrders = () => withSeeds(readStorage(B2B_ORDERS_KEY, []).filter((o) => o.type === 'b2b'), SEED_B2B_ORDERS);

const ok = { ok: true };
const fail = (err) => ({ ok: false, error: errorText(err) });

/** Address form → API body. */
const addressBody = (a) => ({
  label: a.label || null,
  name: a.name,
  phone: a.phone || null,
  line1: a.line1,
  city: a.city,
  state: a.state || null,
  zip: a.zip,
  country_code: countryCode(a.country),
  is_default: Boolean(a.isDefault),
});

const deviceName = () => 'Web browser';

export function AuthProvider({ children }) {
  // Customer (API) session
  const [account, setAccount] = useState(null); // API user (mapped, without addresses)
  const [addresses, setAddresses] = useState([]);
  const [apiOrders, setApiOrders] = useState([]);
  const [loading, setLoading] = useState(() => Boolean(getToken()));
  const loadSeq = useRef(0);

  // B2B demo session (local only)
  const [b2bUsers, setB2BUsers] = useState(loadB2BUsers);
  const [b2bEmail, setB2BEmail] = useState(() => readStorage(B2B_SESSION_KEY, null));
  const [b2bOrders, setB2BOrders] = useState(loadB2BOrders);

  useEffect(() => writeStorage(B2B_USERS_KEY, b2bUsers), [b2bUsers]);
  useEffect(() => writeStorage(B2B_ORDERS_KEY, b2bOrders), [b2bOrders]);
  useEffect(() => {
    if (b2bEmail) writeStorage(B2B_SESSION_KEY, b2bEmail);
    else removeStorage(B2B_SESSION_KEY);
  }, [b2bEmail]);

  const b2bAccount = useMemo(() => publicUser(b2bUsers.find((u) => u.email === b2bEmail)), [b2bUsers, b2bEmail]);

  const loadAddresses = useCallback(async () => {
    const res = await api('me/addresses');
    const list = res.data.map((a) => mapAddress(a, COUNTRY_LIST));
    setAddresses(list);
    return list;
  }, []);

  // Orders list + details (items, totals, timeline) for the account pages.
  const refreshOrders = useCallback(async () => {
    const list = await api('orders?per_page=50');
    const details = await Promise.all(list.data.map((o) => api(`orders/${o.number}`).then((r) => r.data).catch(() => o)));
    const mapped = details.map(mapOrder);
    setApiOrders(mapped);
    return mapped;
  }, []);

  /** Loads the signed-in customer (profile, addresses, orders). */
  const loadSession = useCallback(async () => {
    const seq = ++loadSeq.current;
    try {
      const me = await api('me');
      if (seq !== loadSeq.current) return;
      setAccount(mapUser(me.data));
      await Promise.all([loadAddresses(), refreshOrders()]);
    } catch {
      if (seq === loadSeq.current && !getToken()) setAccount(null);
    } finally {
      if (seq === loadSeq.current) setLoading(false);
    }
  }, [loadAddresses, refreshOrders]);

  useEffect(() => {
    if (getToken()) loadSession();
    const onUnauthorized = () => {
      setAccount(null);
      setAddresses([]);
      setApiOrders([]);
      setLoading(false);
    };
    window.addEventListener('aani:unauthorized', onUnauthorized);
    return () => window.removeEventListener('aani:unauthorized', onUnauthorized);
  }, [loadSession]);

  const startSession = useCallback(
    async (data) => {
      setB2BEmail(null);
      setToken(data.token);
      setAccount(mapUser(data.user));
      setLoading(false);
      try {
        await Promise.all([loadAddresses(), refreshOrders()]);
      } catch {
        // profile is already set; lists load again on the account pages
      }
    },
    [loadAddresses, refreshOrders],
  );

  const user = useMemo(() => (b2bAccount ? b2bAccount : account ? { ...account, addresses } : null), [b2bAccount, account, addresses]);
  const isB2B = b2bAccount?.accountType === 'b2b';

  // All auth methods resolve to { ok: true } or { ok: false, error }.
  const login = useCallback(
    async (email, password) => {
      if (b2bUsers.some((u) => u.email === normalize(email))) {
        return { ok: false, error: 'This is a business account. Please use the Business Login.' };
      }
      try {
        const res = await api('auth/login', { method: 'POST', body: { email, password, device_name: deviceName() } });
        await startSession(res.data);
        return ok;
      } catch (err) {
        return fail(err);
      }
    },
    [b2bUsers, startSession],
  );

  // Business accounts are created by the admin; this is their separate sign-in (demo, no backend yet).
  const loginB2B = useCallback(
    (email, password) => {
      const found = b2bUsers.find((u) => u.email === normalize(email));
      if (!found) return { ok: false, error: 'No business account found with this email.' };
      if (found.status === 'suspended') return { ok: false, error: 'This business account is suspended. Please contact us.' };
      if (found.password !== password) return { ok: false, error: 'Incorrect password. Please try again.' };
      setB2BEmail(found.email);
      return ok;
    },
    [b2bUsers],
  );

  const register = useCallback(
    async ({ firstName, lastName, email, password }) => {
      try {
        const res = await api('auth/register', {
          method: 'POST',
          body: { first_name: firstName.trim(), last_name: lastName.trim(), email, password, password_confirmation: password, terms: true, device_name: deviceName() },
        });
        await startSession(res.data);
        return ok;
      } catch (err) {
        return fail(err);
      }
    },
    [startSession],
  );

  // Google Identity Services ID token → POST auth/google.
  const loginWithGoogle = useCallback(
    async (idToken) => {
      try {
        const res = await api('auth/google', { method: 'POST', body: { id_token: idToken, device_name: deviceName() } });
        await startSession(res.data);
        return ok;
      } catch (err) {
        return fail(err);
      }
    },
    [startSession],
  );

  const logout = useCallback(() => {
    if (b2bAccount) {
      setB2BEmail(null);
      return;
    }
    if (getToken()) api('auth/logout', { method: 'POST' }).catch(() => {});
    setToken(null);
    setAccount(null);
    setAddresses([]);
    setApiOrders([]);
  }, [b2bAccount]);

  // Forgot password: the API emails a 6-digit code (valid 15 minutes).
  const sendResetCode = useCallback(async (email) => {
    try {
      const res = await api('auth/forgot-password', { method: 'POST', body: { email } });
      return { ok: true, message: res.message };
    } catch (err) {
      return fail(err);
    }
  }, []);

  const resetPassword = useCallback(async (email, code, newPassword) => {
    try {
      await api('auth/reset-password', {
        method: 'POST',
        body: { email, code: code.trim(), password: newPassword, password_confirmation: newPassword },
      });
      return ok;
    } catch (err) {
      return fail(err);
    }
  }, []);

  // Profile update (first name, last name, phone). Business demo accounts update locally.
  const updateUser = useCallback(
    async (patch) => {
      if (b2bAccount) {
        setB2BUsers((prev) => prev.map((u) => (u.email === b2bEmail ? { ...u, ...patch } : u)));
        return ok;
      }
      try {
        const res = await api('me', {
          method: 'PUT',
          body: {
            first_name: patch.firstName ?? account.firstName,
            last_name: patch.lastName ?? account.lastName,
            phone: (patch.phone ?? account.phone) || null,
            preferred_currency: account.preferredCurrency,
          },
        });
        setAccount(mapUser(res.data));
        return ok;
      } catch (err) {
        return fail(err);
      }
    },
    [b2bAccount, b2bEmail, account],
  );

  const changePassword = useCallback(
    async (current, next) => {
      if (b2bAccount) {
        const found = b2bUsers.find((u) => u.email === b2bEmail);
        if (found?.password && found.password !== current) return { ok: false, error: 'Current password is incorrect.' };
        setB2BUsers((prev) => prev.map((u) => (u.email === b2bEmail ? { ...u, password: next } : u)));
        return ok;
      }
      try {
        await api('me/password', {
          method: 'PUT',
          body: { ...(current ? { current_password: current } : {}), password: next, password_confirmation: next },
        });
        setAccount((a) => (a ? { ...a, hasPassword: true, provider: 'password' } : a));
        return ok;
      } catch (err) {
        return fail(err);
      }
    },
    [b2bAccount, b2bUsers, b2bEmail],
  );

  const saveAddress = useCallback(
    async (address) => {
      if (b2bAccount) {
        const found = b2bUsers.find((u) => u.email === b2bEmail);
        let list = found.addresses.some((a) => a.id === address.id)
          ? found.addresses.map((a) => (a.id === address.id ? address : a))
          : [...found.addresses, { ...address, id: `a-${Date.now()}` }];
        if (address.isDefault || list.length === 1) {
          const keepId = address.id ?? list[list.length - 1].id;
          list = list.map((a) => ({ ...a, isDefault: a.id === keepId }));
        }
        setB2BUsers((prev) => prev.map((u) => (u.email === b2bEmail ? { ...u, addresses: list } : u)));
        return ok;
      }
      try {
        if (address.id) await api(`me/addresses/${address.id}`, { method: 'PUT', body: addressBody(address) });
        else await api('me/addresses', { method: 'POST', body: addressBody(address) });
        await loadAddresses();
        return ok;
      } catch (err) {
        return fail(err);
      }
    },
    [b2bAccount, b2bUsers, b2bEmail, loadAddresses],
  );

  const deleteAddress = useCallback(
    async (id) => {
      if (b2bAccount) {
        setB2BUsers((prev) => prev.map((u) => (u.email === b2bEmail ? { ...u, addresses: u.addresses.filter((a) => a.id !== id) } : u)));
        return ok;
      }
      try {
        await api(`me/addresses/${id}`, { method: 'DELETE' });
        await loadAddresses();
        return ok;
      } catch (err) {
        return fail(err);
      }
    },
    [b2bAccount, b2bEmail, loadAddresses],
  );

  /** Stores an API order (raw resource) in the session cache and returns it mapped. */
  const cacheOrder = useCallback((raw) => {
    const order = mapOrder(raw);
    setApiOrders((prev) => (prev.some((o) => o.id === order.id) ? prev.map((o) => (o.id === order.id ? order : o)) : [order, ...prev]));
    return order;
  }, []);

  /** One order from the API (GET /orders/{number}), mapped. */
  const fetchOrder = useCallback(
    async (number) => {
      const res = await api(`orders/${encodeURIComponent(String(number).trim().toUpperCase())}`);
      return cacheOrder(res.data);
    },
    [cacheOrder],
  );

  // Business orders wait for admin approval before any payment happens (demo, local only).
  const placeB2BOrder = useCallback(
    ({ items, totals, address, shippingMethod, poNumber, notes }) => {
      const order = {
        id: `BG-${Math.floor(Math.random() * 90000 + 10000)}`,
        type: 'b2b',
        email: b2bEmail,
        company: b2bAccount?.company?.name ?? '',
        createdAt: Date.now(),
        stage: 0,
        approval: 'pending',
        payment: { method: null, status: 'unpaid' },
        poNumber: poNumber?.trim() ?? '',
        notes: notes?.trim() ?? '',
        shippingMethod,
        address,
        items,
        totals,
      };
      setB2BOrders((prev) => [order, ...prev]);
      return order;
    },
    [b2bAccount, b2bEmail],
  );

  // patch can be an object or (order) => object. Used by the B2B payment requests.
  const updateOrder = useCallback(
    (id, patch) =>
      setB2BOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...(typeof patch === 'function' ? patch(o) : patch) } : o))),
    [],
  );

  const myOrders = useMemo(
    () => (isB2B ? b2bOrders.filter((o) => o.email === b2bAccount.email) : account ? apiOrders : []),
    [isB2B, b2bOrders, b2bAccount, account, apiOrders],
  );

  const getOrder = useCallback(
    (id) => {
      const key = String(id).trim().toLowerCase();
      return [...apiOrders, ...b2bOrders].find((o) => String(o.id).toLowerCase() === key);
    },
    [apiOrders, b2bOrders],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isLoggedIn: Boolean(user),
      login,
      loginB2B,
      isB2B,
      register,
      loginWithGoogle,
      logout,
      sendResetCode,
      resetPassword,
      updateUser,
      changePassword,
      saveAddress,
      deleteAddress,
      orders: b2bOrders,
      myOrders,
      refreshOrders,
      fetchOrder,
      cacheOrder,
      placeB2BOrder,
      updateOrder,
      getOrder,
    }),
    [user, loading, login, loginB2B, isB2B, register, loginWithGoogle, logout, sendResetCode, resetPassword, updateUser, changePassword, saveAddress, deleteAddress, b2bOrders, myOrders, refreshOrders, fetchOrder, cacheOrder, placeB2BOrder, updateOrder, getOrder],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
