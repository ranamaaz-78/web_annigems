import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthShell from '../../components/auth/AuthShell';
import FormField from '../../components/common/FormField';
import PasswordField from '../../components/common/PasswordField';
import { useAuth } from '../../hooks/useAuth';
import { hasErrors, validateEmail, validatePassword } from '../../utils/validate';

// Step 2 of the password flow: verify the code and set a new password.
export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ email: params.get('email') || '', code: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {
      email: validateEmail(form.email),
      code: /^\d{6}$/.test(form.code.trim()) ? '' : 'Enter the 6-digit code.',
      password: validatePassword(form.password),
      confirm: form.confirm === form.password ? '' : 'Passwords do not match.',
    };
    if (!hasErrors(errs)) {
      const res = resetPassword(form.email, form.code, form.password);
      if (!res.ok) errs.code = res.error;
    }
    setErrors(errs);
    if (!hasErrors(errs)) setDone(true);
  };

  if (done) {
    return (
      <AuthShell title="Password updated" subtitle="Your password has been changed. You can now sign in with your new password.">
        <div className="success-mark">✦</div>
        <Link to="/login" className="btn-gold btn-full" data-magnetic>
          Go to Sign In
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Enter the code we sent you and choose a new password."
      footer={
        <>
          Need a new code? <Link to="/forgot-password">Resend</Link>
        </>
      }
    >
      <form className="auth-form-stack" onSubmit={handleSubmit} noValidate>
        <FormField id="rp-email" name="email" label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} />
        <FormField id="rp-code" name="code" label="6-digit Code" inputMode="numeric" maxLength={6} placeholder="123456" value={form.code} onChange={set('code')} error={errors.code} />
        <PasswordField id="rp-password" label="New Password" value={form.password} onChange={set('password')} error={errors.password} showStrength />
        <PasswordField id="rp-confirm" label="Confirm New Password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
        <button type="submit" className="btn-gold btn-full" data-magnetic>
          Reset Password
        </button>
      </form>
    </AuthShell>
  );
}
