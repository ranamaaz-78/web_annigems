import { useEffect, useRef, useState } from 'react';
import { GOOGLE_CLIENT_ID } from '../../data/site';
import { useAuth } from '../../hooks/useAuth';

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
  </svg>
);

const GIS_SRC = 'https://accounts.google.com/gsi/client';
let gisPromise = null;

// Loads Google Identity Services once.
function loadGis() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (!gisPromise) {
    gisPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = GIS_SRC;
      script.async = true;
      script.onload = () => resolve(window.google);
      script.onerror = () => {
        gisPromise = null;
        reject(new Error('Google sign-in could not be loaded. Please try again.'));
      };
      document.head.appendChild(script);
    });
  }
  return gisPromise;
}

// "Continue with Google": opens the account dialog, which hosts Google's own sign-in button.
// The Google ID token is verified by the API (POST /auth/google).
export default function GoogleButton({ label = 'Continue with Google', onSuccess }) {
  const { loginWithGoogle } = useAuth();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const slot = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    if (!GOOGLE_CLIENT_ID) {
      setError('Google sign-in is not available right now. Please use your email instead.');
      return undefined;
    }
    let cancelled = false;
    setError('');
    loadGis()
      .then((google) => {
        if (cancelled || !slot.current) return;
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async ({ credential }) => {
            setBusy(true);
            const res = await loginWithGoogle(credential);
            setBusy(false);
            if (!res.ok) return setError(res.error);
            setOpen(false);
            return onSuccess?.();
          },
        });
        google.accounts.id.renderButton(slot.current, { theme: 'outline', size: 'large', shape: 'pill', text: 'continue_with', width: 300 });
      })
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [open, loginWithGoogle, onSuccess]);

  return (
    <>
      <button type="button" className="btn-google" onClick={() => setOpen(true)}>
        <GoogleLogo />
        {label}
      </button>
      {open && (
        <div className="g-bg" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="g-box" role="dialog" aria-modal="true" aria-label="Sign in with Google" data-lenis-prevent>
            <GoogleLogo />
            <h3>Choose an account</h3>
            <p>to continue to AANI GEMAS</p>
            <div className="g-other" style={{ alignItems: 'center', minHeight: 48 }}>
              <div ref={slot} />
              {busy && <span className="g-note">Signing you in…</span>}
            </div>
            {error && <span className="field-error">{error}</span>}
            <p className="g-note">Google shares your name, email address and profile picture with AANI GEMAS.</p>
            <button type="button" className="g-cancel" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
