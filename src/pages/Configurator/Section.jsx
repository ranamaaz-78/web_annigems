// One collapsible choice (Setting, Stone, Size). Closed sections show the choice made.
export default function Section({ n, title, value, open, locked, onOpen, children }) {
  const done = Boolean(value);
  return (
    <section className={`dyr-sec${open ? ' open' : ''}${done ? ' done' : ''}${locked ? ' locked' : ''}`}>
      <button type="button" className="dyr-sec-head" onClick={onOpen} disabled={locked} aria-expanded={open}>
        <span className="dyr-sec-n">{done && !open ? '✓' : n}</span>
        <span className="dyr-sec-title">{title}</span>
        <span className="dyr-sec-val">{locked ? 'Choose a setting first' : value || (open ? '' : 'Choose')}</span>
        {done && !open && <span className="dyr-sec-edit">Change</span>}
      </button>
      <div className="dyr-sec-body" hidden={!open}>
        {children}
      </div>
    </section>
  );
}
