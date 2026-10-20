import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import AuthShell from '../../components/auth/AuthShell';
import FormField from '../../components/common/FormField';
import PasswordField from '../../components/common/PasswordField';
import { WHOLESALE_PERKS } from '../../data/b2b';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import { validateEmail } from '../../utils/validate';

// Separate sign-in for business accounts. There is no register link: the admin creates these accounts.
export default function B2BLoginPage() {
  const { loginB2B, isB2B } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') || '/b2b';
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  if (isB2B) return <Navigate to={next} replace />;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = { email: validateEmail(form.email), password: form.password ? '' : 'Password is required.' };
    setErrors(errs);
    if (errs.email || errs.password) return;
    const res = loginB2B(form.email, form.password);
    if (!res.ok) return setFormError(res.error);
    showToast('Signed in to your business account');
    return navigate(next, { replace: true });
  };

  return (
    <AuthShell
      eyebrow="AANI GEMAS for Business"
      perks={WHOLESALE_PERKS}
      title="Business login"
      subtitle="Sign in with the credentials we issued to your business to see trade prices and manage orders."
      footer={
        <>
          No business account yet? <Link to="/wholesale">Request access</Link>
          <br />
          Shopping for yourself? <Link to="/login">Customer login</Link>
        </>
      }
    >
      <form className="auth-form-stack" onSubmit={handleSubmit} noValidate>
        {formError && (
          <p className="form-alert" role="alert">
            {formError}
          </p>
        )}
        <FormField id="b2b-email" label="Business Email" type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        <PasswordField id="b2b-password" value={form.password} onChange={set('password')} error={errors.password} />
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
        Demo business account: <strong>b2b@aanigems.com</strong> / <strong>Business@1234</strong>
      </p>
    </AuthShell>
  );
}
