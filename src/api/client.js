import { readStorage, removeStorage, writeStorage } from '../utils/storage';

// Thin fetch wrapper for the AANI GEMAS Web Portal API (/api/v1/web).
// - Sends the customer Bearer token when signed in.
// - Sends X-Currency (default EUR); the API prices everything server-side.
// - Throws ApiError with the API's user-friendly message and field errors.

const ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
export const API_BASE = `${ROOT}/api/v1/web`;

const TOKEN_KEY = 'aani-token';
const CURRENCY_KEY = 'aani-currency';

let token = readStorage(TOKEN_KEY, null);

export const getToken = () => token;

export function setToken(value) {
  token = value || null;
  if (token) writeStorage(TOKEN_KEY, token);
  else removeStorage(TOKEN_KEY);
}

export const getCurrency = () => readStorage(CURRENCY_KEY, import.meta.env.VITE_CURRENCY || 'EUR');

export class ApiError extends Error {
  constructor(message, { status = 0, errors = {}, data = null } = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.data = data;
  }

  /** First field error, or the general message. */
  get firstError() {
    const first = Object.values(this.errors || {})[0];
    return (Array.isArray(first) ? first[0] : first) || this.message;
  }
}

export async function api(path, { method = 'GET', body, headers = {}, signal } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}/${path.replace(/^\//, '')}`, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        'X-Currency': getCurrency(),
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err?.name === 'AbortError') throw err;
    throw new ApiError('We could not reach the store. Please check your connection and try again.');
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401 && token) {
      setToken(null);
      window.dispatchEvent(new CustomEvent('aani:unauthorized'));
    }
    const message =
      data?.message ||
      (res.status === 429 ? 'Too many attempts. Please wait a minute and try again.' : 'Something went wrong. Please try again.');
    throw new ApiError(message, { status: res.status, errors: data?.errors || {}, data });
  }
  return data;
}

/** Message to show for any thrown error. */
export const errorText = (err, fallback = 'Something went wrong. Please try again.') =>
  err instanceof ApiError ? err.firstError : err?.message || fallback;
