import { useState } from 'react';

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);
  return (
    <div className="pd-gallery">
      <div className="pd-main-img">
        <img src={images[active]} alt={name} />
      </div>
      {images.length > 1 && (
        <div className="pd-thumbs">
          {images.map((src, i) => (
            <button
              key={src}
              className={`pd-thumb${i === active ? ' active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
