// Labelled input / textarea / select with an inline error message.
// Usage: <FormField id="x" label="Email" error={errors.email} type="email" ... />
export default function FormField({ id, label, error, as: Tag = 'input', children, hint, ...props }) {
  return (
    <div className={`form-field${error ? ' has-error' : ''}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <Tag id={id} name={props.name ?? id} aria-invalid={Boolean(error)} {...props}>
        {children}
      </Tag>
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && (
        <span className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
