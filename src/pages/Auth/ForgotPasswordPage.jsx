import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../../components/auth/AuthShell';
import FormField from '../../components/common/FormField';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validate';

// Step 1 of the password flow: ask for the email, "send" a reset code, then go to /reset-password.
export default function ForgotPasswordPage() {
  const { sendResetCode } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(null); // { code }

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) return setError(err);
    const res = sendResetCode(email);
    if (!res.ok) return setError(res.error);
    setError('');
    return setSent({ code: res.code });
  };

  if (sent) {
    return (
      <AuthShell
        title="Check your inbox"
        subtitle={`We sent a 6-digit reset code to ${email}. It expires in 10 minutes.`}
        footer={
          <>
            Remembered it? <Link to="/login">Back to sign in</Link>
          </>
        }
      >
        <div className="demo-code">
          <span>Demo mode — no email is sent. Your code is:</span>
          <strong>{sent.code}</strong>
        </div>
        <button className="btn-gold btn-full" data-magnetic onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}>
          Enter Code &amp; Reset Password
        </button>
        <button className="btn-ghost btn-full" style={{ marginTop: 12 }} onClick={() => setSent(null)}>
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
        <button type="submit" className="btn-gold btn-full" data-magnetic>
          Send Reset Code
        </button>
      </form>
    </AuthShell>
  );
}
