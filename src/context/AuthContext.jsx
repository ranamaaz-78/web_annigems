import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, errorText, getToken, setToken } from '../api/client';
import { mapAddress, mapOrder, mapUser } from '../api/mappers';
import { COUNTRY_LIST, countryCode } from '../data/site';
import { AuthContext } from './contexts';

// Customer and business (B2B) accounts both run on the Web Portal API (Bearer token):
//   auth/login, auth/register, auth/google, auth/forgot-password, auth/reset-password, auth/logout,
//   me, me/password, me/addresses, orders.
// Business accounts are created by a sales person in the admin and sign in on /b2b/login.
// The catalogue is loaded once at start-up with the token, so the API returns business prices;
// signing a business in or out reloads the page to load the right prices everywhere.

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
  const [account, setAccount] = useState(null); // API user (mapped, without addresses)
  const [addresses, setAddresses] = useState([]);
  const [apiOrders, setApiOrders] = useState([]);
  const [loading, setLoading] = useState(() => Boolean(getToken()));
  const loadSeq = useRef(0);

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

  /** Loads the signed-in account (profile, addresses, orders). */
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

  const user = useMemo(() => (account ? { ...account, addresses } : null), [account, addresses]);
  const isB2B = account?.accountType === 'business';

  /** Signs in and returns the API payload; rejects (and signs out) when the account type does not match. */
  const signIn = useCallback(async (email, password, wantBusiness) => {
    const res = await api('auth/login', { method: 'POST', body: { email, password, device_name: deviceName() } });
    const business = res.data.user?.account_type === 'business';
    if (business !== wantBusiness) {
      // Do not keep a session of the wrong kind.
      api('auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${res.data.token}` } }).catch(() => {});
      throw new Error(business ? 'This is a business account. Please use the Business Login.' : 'This is not a business account. Please use the customer sign in.');
    }
    return res.data;
  }, []);

  // All auth methods resolve to { ok: true } or { ok: false, error }.
  const login = useCallback(
    async (email, password) => {
      try {
        await startSession(await signIn(email, password, false));
        return ok;
      } catch (err) {
        return fail(err);
      }
    },
    [signIn, startSession],
  );

  /**
   * Business sign-in. On success the token is stored and the caller reloads the page
   * (window.location) so the catalogue is fetched again with business prices.
   */
  const loginB2B = useCallback(
    async (email, password) => {
      try {
        const data = await signIn(email, password, true);
        setToken(data.token);
        return ok;
      } catch (err) {
        return fail(err);
      }
    },
    [signIn],
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

  // Google Identity Services ID token → POST auth/google (retail customers only).
  const loginWithGoogle = useCallback(
    async (idToken) => {
      try {
        const res = await api('auth/google', { method: 'POST', body: { id_token: idToken, device_name: deviceName() } });
        if (res.data.user?.account_type === 'business') {
          setToken(res.data.token);
          window.location.assign('/b2b');
          return ok;
        }
        await startSession(res.data);
        return ok;
      } catch (err) {
        return fail(err);
      }
    },
    [startSession],
  );

  const logout = useCallback(() => {
    const wasBusiness = isB2B;
    if (getToken()) api('auth/logout', { method: 'POST' }).catch(() => {});
    setToken(null);
    setAccount(null);
    setAddresses([]);
    setApiOrders([]);
    // Business prices are in the loaded catalogue: reload it with retail prices.
    if (wasBusiness) window.location.assign('/b2b/login');
  }, [isB2B]);

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

  // Profile update (first name, last name, phone).
  const updateUser = useCallback(
    async (patch) => {
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
    [account],
  );

  const changePassword = useCallback(async (current, next) => {
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
  }, []);

  const saveAddress = useCallback(
    async (address) => {
      try {
        if (address.id) await api(`me/addresses/${address.id}`, { method: 'PUT', body: addressBody(address) });
        else await api('me/addresses', { method: 'POST', body: addressBody(address) });
        await loadAddresses();
        return ok;
      } catch (err) {
        return fail(err);
      }
    },
    [loadAddresses],
  );

  const deleteAddress = useCallback(
    async (id) => {
      try {
        await api(`me/addresses/${id}`, { method: 'DELETE' });
        await loadAddresses();
        return ok;
      } catch (err) {
        return fail(err);
      }
    },
    [loadAddresses],
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

  const myOrders = useMemo(() => (account ? apiOrders : []), [account, apiOrders]);

  const getOrder = useCallback(
    (id) => {
      const key = String(id).trim().toLowerCase();
      return apiOrders.find((o) => String(o.id).toLowerCase() === key);
    },
    [apiOrders],
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
      myOrders,
      refreshOrders,
      fetchOrder,
      cacheOrder,
      getOrder,
    }),
    [user, loading, login, loginB2B, isB2B, register, loginWithGoogle, logout, sendResetCode, resetPassword, updateUser, changePassword, saveAddress, deleteAddress, myOrders, refreshOrders, fetchOrder, cacheOrder, getOrder],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
