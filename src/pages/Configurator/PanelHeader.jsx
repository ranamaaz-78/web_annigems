export default function PanelHeader({ title, subtitle, children }) {
  return (
    <div className="conf-panel-hdr">
      <h2 className="conf-panel-title">{title}</h2>
      <p className="conf-panel-sub">{subtitle}</p>
      {children}
    </div>
  );
}
