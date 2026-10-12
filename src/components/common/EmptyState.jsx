import { Link } from 'react-router-dom';

export default function EmptyState({ icon, title, text, actionLabel, actionTo }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {actionLabel && (
        <Link className="btn-gold" to={actionTo}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
