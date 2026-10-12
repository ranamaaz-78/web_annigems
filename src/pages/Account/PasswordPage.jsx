import { useState } from 'react';
import PasswordField from '../../components/common/PasswordField';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import { hasErrors, validatePassword } from '../../utils/validate';

export default function PasswordPage() {
  const { user, changePassword } = useAuth();
  const { showToast } = useUI();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const needsCurrent = user.provider !== 'google';

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {
      current: needsCurrent && !form.current ? 'Enter your current password.' : '',
      next: validatePassword(form.next),
      confirm: form.confirm === form.next ? '' : 'Passwords do not match.',
    };
    if (!hasErrors(errs)) {
      const res = changePassword(form.current, form.next);
      if (!res.ok) errs.current = res.error;
    }
    setErrors(errs);
    if (!hasErrors(errs)) {
      setForm({ current: '', next: '', confirm: '' });
      showToast('Password updated');
    }
  };

  return (
    <div className="side-card" data-reveal="up">
      <h3 className="cs-title">Change password</h3>
      {!needsCurrent && <p className="muted">You signed in with Google. Set a password to also sign in with your email.</p>}
      <form className="co-form" onSubmit={handleSubmit} noValidate style={{ maxWidth: 440 }}>
        {needsCurrent && <PasswordField id="pw-current" label="Current Password" value={form.current} onChange={set('current')} error={errors.current} />}
        <PasswordField id="pw-next" label="New Password" value={form.next} onChange={set('next')} error={errors.next} showStrength />
        <PasswordField id="pw-confirm" label="Confirm New Password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
        <button type="submit" className="btn-gold">
          Update Password
        </button>
      </form>
    </div>
  );
}
