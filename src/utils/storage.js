// Safe localStorage helpers — storage can throw in private mode or when blocked.
export const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable — state still works for this session
  }
};

export const removeStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
};
