import { useUI } from '../../hooks/useUI';

// Backdrop + box shell shared by the auth and quick-view modals.
export default function Modal({ open, boxClassName, label, children }) {
  const { close } = useUI();
  return (
    <div className={`modal-bg${open ? ' open' : ''}`} onClick={(e) => e.target === e.currentTarget && close()} aria-hidden={!open}>
      <div className={boxClassName} data-lenis-prevent role="dialog" aria-modal="true" aria-label={label}>
        <button className="modal-x" onClick={close} aria-label="Close">
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
