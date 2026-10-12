import { useUI } from '../../hooks/useUI';

export default function Toast() {
  const { toast } = useUI();
  return (
    <div className={`toast${toast.visible ? ' show' : ''}`} role="status" aria-live="polite">
      <span className="toast-icon">✓</span>
      <span>{toast.message}</span>
    </div>
  );
}
