import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../../components/auth/AuthShell';
import FormField from '../../components/common/FormField';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validate';

// Step 1 of the password flow: ask for the email; the API emails a 6-digit code (POST auth/forgot-password).
export default function ForgotPasswordPage() {
  const { sendResetCode } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) return setError(err);
    setBusy(true);
    const res = await sendResetCode(email);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setError('');
    return setSent(true);
  };

  if (sent) {
    return (
      <AuthShell
        title="Check your inbox"
        subtitle={`If an account exists for ${email}, we sent a 6-digit reset code. It expires in 15 minutes.`}
        footer={
          <>
            Remembered it? <Link to="/login">Back to sign in</Link>
          </>
        }
      >
        <button className="btn-gold btn-full" data-magnetic onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}>
          Enter Code &amp; Reset Password
        </button>
        <button className="btn-ghost btn-full" style={{ marginTop: 12 }} onClick={() => setSent(false)}>
          Use a different email
        </button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="No problem. Enter your email and we will send you a code to reset it."
      footer={
        <>
          Remembered it? <Link to="/login">Back to sign in</Link>
        </>
      }
    >
      <form className="auth-form-stack" onSubmit={handleSubmit} noValidate>
        <FormField id="fp-email" name="email" label="Email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} error={error} autoComplete="email" />
        <button type="submit" className="btn-gold btn-full" data-magnetic disabled={busy}>
          {busy ? 'Sending…' : 'Send Reset Code'}
        </button>
      </form>
    </AuthShell>
  );
}
