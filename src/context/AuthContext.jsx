import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEMO_USER, SEED_ORDERS } from '../data/orders';
import { readStorage, removeStorage, writeStorage } from '../utils/storage';
import { AuthContext } from './contexts';

// Mock authentication + orders. Everything lives in localStorage — there is no backend.
// Demo login: demo@aanigems.com / Demo@1234

const USERS_KEY = 'aani-users';
const SESSION_KEY = 'aani-session';
const ORDERS_KEY = 'aani-orders';
const RESET_KEY = 'aani-reset';

const normalize = (email) => email.trim().toLowerCase();
const publicUser = (u) => {
  if (!u) return null;
  const { password: _password, ...rest } = u;
  return rest;
};

const loadUsers = () => {
  const stored = readStorage(USERS_KEY, null);
  if (stored) return stored;
  writeStorage(USERS_KEY, [DEMO_USER]);
  return [DEMO_USER];
};

const loadOrders = () => {
  const stored = readStorage(ORDERS_KEY, null);
  if (stored) return stored;
  writeStorage(ORDERS_KEY, SEED_ORDERS);
  return SEED_ORDERS;
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers);
  const [sessionEmail, setSessionEmail] = useState(() => readStorage(SESSION_KEY, null));
  const [orders, setOrders] = useState(loadOrders);

  useEffect(() => writeStorage(USERS_KEY, users), [users]);
  useEffect(() => writeStorage(ORDERS_KEY, orders), [orders]);
  useEffect(() => {
    if (sessionEmail) writeStorage(SESSION_KEY, sessionEmail);
    else removeStorage(SESSION_KEY);
  }, [sessionEmail]);

  const user = useMemo(() => publicUser(users.find((u) => u.email === sessionEmail)), [users, sessionEmail]);

  // All auth methods return { ok: true } or { ok: false, error }.
  const login = useCallback(
    (email, password) => {
      const found = users.find((u) => u.email === normalize(email));
      if (!found) return { ok: false, error: 'No account found with this email.' };
      if (found.provider === 'google' && !found.password) {
        return { ok: false, error: 'This account uses Google. Please continue with Google.' };
      }
      if (found.password !== password) return { ok: false, error: 'Incorrect password. Please try again.' };
      setSessionEmail(found.email);
      return { ok: true };
    },
    [users],
  );

  const register = useCallback(
    ({ firstName, lastName, email, password }) => {
      const key = normalize(email);
      if (users.some((u) => u.email === key)) return { ok: false, error: 'An account with this email already exists.' };
      const created = {
        id: `u-${Date.now()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: key,
        password,
        phone: '',
        provider: 'password',
        addresses: [],
      };
      setUsers((prev) => [...prev, created]);
      setSessionEmail(key);
      return { ok: true };
    },
    [users],
  );

  // Simulated Google account chooser: signs in (or creates) the chosen account.
  const loginWithGoogle = useCallback(
    (account) => {
      const key = normalize(account.email);
      if (!users.some((u) => u.email === key)) {
        setUsers((prev) => [
          ...prev,
          { id: `g-${Date.now()}`, ...account, email: key, password: '', phone: '', provider: 'google', addresses: [] },
        ]);
      }
      setSessionEmail(key);
      return { ok: true };
    },
    [users],
  );

  const logout = useCallback(() => setSessionEmail(null), []);

  // Forgot password: stores a demo reset code (shown on screen because no email is sent).
  const sendResetCode = useCallback(
    (email) => {
      const key = normalize(email);
      if (!users.some((u) => u.email === key)) return { ok: false, error: 'No account found with this email.' };
      const code = String(Math.floor(100000 + Math.random() * 900000));
      writeStorage(RESET_KEY, { email: key, code });
      return { ok: true, code };
    },
    [users],
  );

  const resetPassword = useCallback((email, code, newPassword) => {
    const pending = readStorage(RESET_KEY, null);
    if (!pending || pending.email !== normalize(email) || pending.code !== code.trim()) {
      return { ok: false, error: 'Invalid or expired code.' };
    }
    setUsers((prev) => prev.map((u) => (u.email === pending.email ? { ...u, password: newPassword } : u)));
    removeStorage(RESET_KEY);
    return { ok: true };
  }, []);

  const updateUser = useCallback(
    (patch) => setUsers((prev) => prev.map((u) => (u.email === sessionEmail ? { ...u, ...patch } : u))),
    [sessionEmail],
  );

  const changePassword = useCallback(
    (current, next) => {
      const found = users.find((u) => u.email === sessionEmail);
      if (found?.password && found.password !== current) return { ok: false, error: 'Current password is incorrect.' };
      updateUser({ password: next });
      return { ok: true };
    },
    [users, sessionEmail, updateUser],
  );

  const saveAddress = useCallback(
    (address) => {
      const found = users.find((u) => u.email === sessionEmail);
      if (!found) return;
      let list = found.addresses.some((a) => a.id === address.id)
        ? found.addresses.map((a) => (a.id === address.id ? address : a))
        : [...found.addresses, { ...address, id: `a-${Date.now()}` }];
      if (address.isDefault || list.length === 1) {
        const keepId = address.id ?? list[list.length - 1].id;
        list = list.map((a) => ({ ...a, isDefault: a.id === keepId }));
      }
      updateUser({ addresses: list });
    },
    [users, sessionEmail, updateUser],
  );

  const deleteAddress = useCallback(
    (id) => {
      const found = users.find((u) => u.email === sessionEmail);
      if (found) updateUser({ addresses: found.addresses.filter((a) => a.id !== id) });
    },
    [users, sessionEmail, updateUser],
  );

  const placeOrder = useCallback(
    ({ items, totals, address, shippingMethod, email }) => {
      const order = {
        id: `AG-${Math.floor(Math.random() * 90000 + 10000)}`,
        email: normalize(email || sessionEmail || 'guest@aanigems.com'),
        createdAt: Date.now(),
        stage: 0,
        shippingMethod,
        address,
        items,
        totals,
      };
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    [sessionEmail],
  );

  const getOrder = useCallback((id) => orders.find((o) => o.id.toLowerCase() === String(id).trim().toLowerCase()), [orders]);

  const myOrders = useMemo(() => (user ? orders.filter((o) => o.email === user.email) : []), [orders, user]);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      login,
      register,
      loginWithGoogle,
      logout,
      sendResetCode,
      resetPassword,
      updateUser,
      changePassword,
      saveAddress,
      deleteAddress,
      orders,
      myOrders,
      placeOrder,
      getOrder,
    }),
    [user, login, register, loginWithGoogle, logout, sendResetCode, resetPassword, updateUser, changePassword, saveAddress, deleteAddress, orders, myOrders, placeOrder, getOrder],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
