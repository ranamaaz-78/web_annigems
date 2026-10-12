// Small form validation helpers — each returns an error string or '' when valid.
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export const validateEmail = (v) => {
  if (!v.trim()) return 'Email is required.';
  return isEmail(v) ? '' : 'Enter a valid email address.';
};

export const validateRequired = (v, name = 'This field') => (v.trim() ? '' : `${name} is required.`);

export const validatePassword = (v) => {
  if (!v) return 'Password is required.';
  if (v.length < 8) return 'Use at least 8 characters.';
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Include both letters and numbers.';
  return '';
};

export const validatePhone = (v) => (!v.trim() || /^[+\d][\d\s-]{6,}$/.test(v.trim()) ? '' : 'Enter a valid phone number.');

// score 0–4 for the strength meter
export const passwordStrength = (v = '') => {
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
  if (/\d/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) score++;
  return { score, label: ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][score] };
};

export const hasErrors = (errors) => Object.values(errors).some(Boolean);
