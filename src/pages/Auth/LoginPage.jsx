import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import AuthShell from '../../components/auth/AuthShell';
import GoogleButton from '../../components/auth/GoogleButton';
import FormField from '../../components/common/FormField';
import PasswordField from '../../components/common/PasswordField';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import { validateEmail } from '../../utils/validate';

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') || '/account';
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  if (isLoggedIn) return <Navigate to={next} replace />;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = { email: validateEmail(form.email), password: form.password ? '' : 'Password is required.' };
    setErrors(errs);
    if (errs.email || errs.password) return;
    const res = login(form.email, form.password);
    if (!res.ok) return setFormError(res.error);
    showToast('Signed in successfully!');
    return navigate(next, { replace: true });
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to track orders, save addresses and checkout faster."
      footer={
        <>
          New to AANI GEMAS? <Link to="/register">Create an account</Link>
        </>
      }
    >
      <GoogleButton
        onSuccess={() => {
          showToast('Signed in with Google');
          navigate(next, { replace: true });
        }}
      />
      <div className="auth-or">
        <span>or sign in with email</span>
      </div>
      <form className="auth-form-stack" onSubmit={handleSubmit} noValidate>
        {formError && (
          <p className="form-alert" role="alert">
            {formError}
          </p>
        )}
        <FormField id="login-email" label="Email" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        <PasswordField id="login-password" value={form.password} onChange={set('password')} error={errors.password} />
        <div className="auth-row">
          <label className="check">
            <input type="checkbox" defaultChecked /> Remember me
          </label>
          <Link to="/forgot-password" className="auth-link">
            Forgot password?
          </Link>
        </div>
        <button type="submit" className="btn-gold btn-full" data-magnetic>
          Sign In
        </button>
      </form>
      <p className="auth-demo">
        Demo account: <strong>demo@aanigems.com</strong> / <strong>Demo@1234</strong>
      </p>
    </AuthShell>
  );
}
