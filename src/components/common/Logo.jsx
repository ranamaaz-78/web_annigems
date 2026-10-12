import { BRAND } from '../../data/site';

// Brand mark: logo image + wordmark. Navbar uses the .nav-logo-img class; other spots pass an explicit height.
export default function Logo({ className, imgHeight, textClassName, style }) {
  return (
    <div className={className} style={style}>
      <img
        src={BRAND.logo}
        alt={`${BRAND.name} logo`}
        className={imgHeight ? undefined : 'nav-logo-img'}
        style={imgHeight ? { height: imgHeight, width: 'auto' } : undefined}
      />
      <span className={textClassName}>{BRAND.name}</span>
    </div>
  );
}
