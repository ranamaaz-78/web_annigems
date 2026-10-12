import { ORDER_STAGES } from '../../data/orders';

export default function OrderStatusBadge({ stage }) {
  const done = stage >= ORDER_STAGES.length - 1;
  return <span className={`status-badge${done ? ' done' : ''}`}>{ORDER_STAGES[stage]?.label ?? 'Processing'}</span>;
}
