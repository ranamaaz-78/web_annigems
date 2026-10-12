export default function SectionHeader({ eyebrow, title, subtitle, as: Heading = 'h2' }) {
  return (
    <div className="sec-hdr" data-reveal="up">
      {eyebrow && <p className="sec-ey">{eyebrow}</p>}
      <Heading className="sec-title">{title}</Heading>
      {subtitle && <p className="sec-sub">{subtitle}</p>}
    </div>
  );
}
