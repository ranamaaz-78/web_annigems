// Decorative gem swatch. Diamond uses the animated `.diamond` CSS style.
export default function StoneGem({ stone }) {
  if (stone.id === 'diamond') return <div className="sc-gem diamond" />;
  return (
    <div
      className="sc-gem"
      style={{
        background: stone.gem,
        boxShadow: `0 0 40px ${stone.color}60, inset 0 0 20px rgba(255,255,255,0.3)`,
      }}
    />
  );
}
