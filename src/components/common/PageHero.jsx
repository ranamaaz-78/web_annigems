import Breadcrumb from './Breadcrumb';

// Compact page header: breadcrumb, eyebrow, split-reveal title and subtitle.
export default function PageHero({ eyebrow, title, subtitle, crumbs, align = 'center' }) {
  return (
    <header className={`page-hero page-hero-${align}`}>
      {crumbs && <Breadcrumb items={crumbs} />}
      {eyebrow && (
        <p className="sec-ey" data-reveal="fade">
          {eyebrow}
        </p>
      )}
      <h1 className="page-hero-title" data-split>
        {title}
      </h1>
      {subtitle && (
        <p className="page-hero-sub" data-reveal="up" data-delay="0.2">
          {subtitle}
        </p>
      )}
    </header>
  );
}
