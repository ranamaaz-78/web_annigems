import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthShell from '../../components/auth/AuthShell';
import GoogleButton from '../../components/auth/GoogleButton';
import FormField from '../../components/common/FormField';
import PasswordField from '../../components/common/PasswordField';
import { BRAND } from '../../data/site';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import { hasErrors, validateEmail, validatePassword, validateRequired } from '../../utils/validate';

export default function RegisterPage() {
  const { register, isLoggedIn } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '', terms: false });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  if (isLoggedIn) return <Navigate to="/account" replace />;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {
      firstName: validateRequired(form.firstName, 'First name'),
      lastName: validateRequired(form.lastName, 'Last name'),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirm: form.confirm === form.password ? '' : 'Passwords do not match.',
      terms: form.terms ? '' : 'Please accept the terms to continue.',
    };
    setErrors(errs);
    if (hasErrors(errs)) return;
    const res = register(form);
    if (!res.ok) return setFormError(res.error);
    showToast(`Welcome to ${BRAND.name}!`);
    return navigate('/account', { replace: true });
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join the atelier for order tracking, a saved wishlist and early access to new collections."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      <GoogleButton
        label="Sign up with Google"
        onSuccess={() => {
          showToast(`Welcome to ${BRAND.name}!`);
          navigate('/account', { replace: true });
        }}
      />
      <div className="auth-or">
        <span>or register with email</span>
      </div>
      <form className="auth-form-stack" onSubmit={handleSubmit} noValidate>
        {formError && (
          <p className="form-alert" role="alert">
            {formError}
          </p>
        )}
        <div className="form-r2">
          <FormField id="reg-first" name="firstName" label="First Name" placeholder="Priya" value={form.firstName} onChange={set('firstName')} error={errors.firstName} autoComplete="given-name" />
          <FormField id="reg-last" name="lastName" label="Last Name" placeholder="Mehta" value={form.lastName} onChange={set('lastName')} error={errors.lastName} autoComplete="family-name" />
        </div>
        <FormField id="reg-email" name="email" label="Email" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        <PasswordField id="reg-password" value={form.password} onChange={set('password')} error={errors.password} showStrength hint="8+ characters with letters and numbers" />
        <PasswordField id="reg-confirm" label="Confirm Password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
        <label className="check">
          <input type="checkbox" checked={form.terms} onChange={(e) => setForm((f) => ({ ...f, terms: e.target.checked }))} />
          <span>
            I agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy-policy">Privacy Policy</Link>
          </span>
        </label>
        {errors.terms && <span className="field-error">{errors.terms}</span>}
        <button type="submit" className="btn-gold btn-full" data-magnetic>
          Create Account
        </button>
      </form>
    </AuthShell>
  );
}
