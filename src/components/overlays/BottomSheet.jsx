import { useEffect } from 'react';
import { getLenis } from '../../lib/lenis';

// Panel that slides up from the bottom of the screen (phones). Backdrop tap, ✕ or Escape closes it;
// the page behind does not scroll while it is open.
export default function BottomSheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    getLenis()?.stop();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      getLenis()?.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <>
      <div className={`bsheet-bg${open ? ' open' : ''}`} onClick={onClose} aria-hidden="true" />
      <div className={`bsheet${open ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label={title} aria-hidden={!open} data-lenis-prevent>
        <div className="bsheet-grip" aria-hidden="true" />
        <div className="bsheet-head">
          <span>{title}</span>
          <button type="button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="bsheet-body">{children}</div>
      </div>
    </>
  );
}
