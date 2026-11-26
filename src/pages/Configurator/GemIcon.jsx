// Top view of a brilliant-cut gem, tinted with the stone's colour.

const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (hex, target, amount) => {
  const [r, g, b] = hexToRgb(hex);
  const t = target === 'white' ? 255 : 0;
  return `rgb(${[r, g, b].map((c) => Math.round(c + (t - c) * amount)).join(',')})`;
};

// Octagon vertices (rotated so a flat edge sits on top), center 32,32.
const ring = (r) => Array.from({ length: 8 }, (_, i) => {
  const a = ((22.5 + i * 45) * Math.PI) / 180;
  return [32 + r * Math.cos(a), 32 + r * Math.sin(a)];
});
const OUTER = ring(29);
const TABLE = ring(14);
const pts = (list) => list.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

export default function GemIcon({ stone, size = 44 }) {
  const base = stone.isDiamond ? '#bcd9f5' : stone.color || '#90caf9';
  const id = `gem-${stone.id}`;
  return (
    <svg className={`gem-icon${stone.isDiamond ? ' diamond' : ''}`} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="36%" cy="30%" r="75%">
          <stop offset="0" stopColor={mix(base, 'white', stone.isDiamond ? 0.85 : 0.55)} />
          <stop offset="0.5" stopColor={base} />
          <stop offset="1" stopColor={mix(base, 'black', stone.isDiamond ? 0.45 : 0.6)} />
        </radialGradient>
      </defs>
      <polygon points={pts(OUTER)} fill={`url(#${id})`} />
      <g stroke="rgba(255,255,255,.38)" strokeWidth=".7" fill="none">
        <polygon points={pts(TABLE)} />
        {OUTER.map(([x, y], i) => (
          <line key={i} x1={x} y1={y} x2={TABLE[i][0]} y2={TABLE[i][1]} />
        ))}
        {OUTER.map(([x, y], i) => {
          const [nx, ny] = TABLE[(i + 1) % 8];
          return <line key={`s${i}`} x1={x} y1={y} x2={nx} y2={ny} />;
        })}
      </g>
      <polygon points={pts([TABLE[5], TABLE[6], [32, 32]])} fill="rgba(255,255,255,.45)" />
      <polygon points={pts(OUTER)} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth=".9" />
    </svg>
  );
}
