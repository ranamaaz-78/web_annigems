import { useCallback, useEffect, useState } from 'react';
import { getLenis } from '../../lib/lenis';

// Main photo with hover zoom (desktop) and a full-screen viewer on click / tap.
export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(null); // { x, y } in % while the pointer is over the photo
  const [viewer, setViewer] = useState(false);
  const count = images.length;
  const step = useCallback((d) => setActive((i) => (i + d + count) % count), [count]);

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  useEffect(() => {
    if (!viewer) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setViewer(false);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.body.style.overflow = 'hidden';
    getLenis()?.stop();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      getLenis()?.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [viewer, step]);

  return (
    <div className="pd-gallery">
      <button
        type="button"
        className={`pd-main-img${zoom ? ' zooming' : ''}`}
        onPointerMove={onMove}
        onPointerLeave={() => setZoom(null)}
        onClick={() => setViewer(true)}
        aria-label={`Enlarge photo of ${name}`}
      >
        <img src={images[active]} alt={name} style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} draggable="false" />
        <span className="pd-zoom-hint" aria-hidden="true">
          ⤢ Tap to enlarge
        </span>
      </button>
      {count > 1 && (
        <div className="pd-thumbs">
          {images.map((src, i) => (
            <button key={src} className={`pd-thumb${i === active ? ' active' : ''}`} onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`}>
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}

      {viewer && (
        <div className="pd-viewer" role="dialog" aria-modal="true" aria-label={`${name} photos`} onClick={(e) => e.target === e.currentTarget && setViewer(false)}>
          <button type="button" className="pd-viewer-x" onClick={() => setViewer(false)} aria-label="Close">
            ✕
          </button>
          <img src={images[active]} alt={name} />
          {count > 1 && (
            <>
              <button type="button" className="pd-viewer-nav prev" onClick={() => step(-1)} aria-label="Previous photo">
                ‹
              </button>
              <button type="button" className="pd-viewer-nav next" onClick={() => step(1)} aria-label="Next photo">
                ›
              </button>
              <p className="pd-viewer-count">
                {active + 1} / {count}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
