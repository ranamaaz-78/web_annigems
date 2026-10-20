import { ORDER_STAGES } from '../../data/orders';
import { formatDate } from '../../utils/format';

// Vertical order-progress timeline. `stage` is the index of the current stage.
export default function Timeline({ stage, createdAt, steps = ORDER_STAGES }) {
  return (
    <ol className="timeline" data-stagger="li">
      {steps.map((s, i) => (
        <li key={s.id} className={i < stage ? 'done' : i === stage ? 'current' : ''}>
          <span className="tl-dot">{i < stage ? '✓' : i + 1}</span>
          <div>
            <p className="tl-title">{s.label}</p>
            <p className="tl-desc">{s.desc}</p>
            {i === 0 && createdAt && (
              <p className="tl-date">{formatDate(createdAt)}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
