import { useState } from 'react';
import { passwordStrength } from '../../utils/validate';
import FormField from './FormField';

// Password input with a show/hide toggle and an optional strength meter.
export default function PasswordField({ id, label = 'Password', value, onChange, error, showStrength = false, ...props }) {
  const [visible, setVisible] = useState(false);
  const strength = showStrength ? passwordStrength(value) : null;

  return (
    <div className="pw-field">
      <FormField
        id={id}
        label={label}
        error={error}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder="••••••••"
        autoComplete="off"
        {...props}
      />
      <button type="button" className="pw-toggle" onClick={() => setVisible((v) => !v)} aria-label={visible ? 'Hide password' : 'Show password'}>
        {visible ? 'Hide' : 'Show'}
      </button>
      {showStrength && value && (
        <div className="pw-meter" aria-live="polite">
          <div className="pw-bars">
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className={n <= strength.score ? `on s${strength.score}` : ''} />
            ))}
          </div>
          <span className="pw-label">{strength.label}</span>
        </div>
      )}
    </div>
  );
}
