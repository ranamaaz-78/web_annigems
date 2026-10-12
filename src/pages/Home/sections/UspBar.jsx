import { USP_ITEMS } from '../../../data/site';

export default function UspBar() {
  return (
    <div className="usp-bar" data-stagger=".usp-item">
      {USP_ITEMS.map((item) => (
        <div className="usp-item" key={item.label}>
          <span className="usp-icon">{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
