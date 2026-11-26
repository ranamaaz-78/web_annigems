import { useEffect } from 'react';
import { CONFIG_RINGS } from '../../data/configurator';

// Every photo the stage can show: each plain ring and each ring + stone combination.
const allImages = (stones) => [
  ...new Set(CONFIG_RINGS.flatMap((r) => [r.image, ...stones.map((s) => s.images[r.id]).filter(Boolean)])),
];

// Live preview: the real photo of the current ring + stone, cross-faded on every change.
export default function Stage({ ring, stone, stones }) {
  const images = allImages(stones);
  const active = (ring && stone?.images[ring.id]) || ring?.image || CONFIG_RINGS[0]?.image;

  // Warm the cache so switching is instant.
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps

  const chips = [
    ring && `${ring.karat}K ${ring.metal?.replace(/^\d+K\s*/i, '') || 'Gold'}`,
    ring && `${ring.goldWeightG}g gold`,
    stone?.carat && `${stone.carat} ct`,
    stone?.rarity,
  ].filter(Boolean);

  return (
    <div className="dyr-stage" style={{ '--glow': stone?.glow || 'rgba(201,168,76,.22)' }}>
      <div className="dyr-stage-glow" />
      {images.map((src) => (
        <img key={src} src={src} alt="" aria-hidden={src !== active} className={src === active ? 'on' : ''} draggable="false" />
      ))}
      <span className="dyr-stage-live">
        <i /> Live preview
      </span>
      {chips.length > 0 && (
        <div className="dyr-stage-chips">
          {chips.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      )}
      <div className="dyr-stage-cap">
        {ring ? (
          <>
            <p className="dyr-stage-name">
              {ring.name}
              {stone && <em> with {stone.name}</em>}
            </p>
            <p className="dyr-stage-sub">{stone ? stone.description : ring.description}</p>
          </>
        ) : (
          <>
            <p className="dyr-stage-name">Your ring starts here</p>
            <p className="dyr-stage-sub">Pick a setting and watch it come to life.</p>
          </>
        )}
      </div>
    </div>
  );
}
