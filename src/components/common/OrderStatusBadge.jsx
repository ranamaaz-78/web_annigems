import { orderStatus } from '../../utils/orderStatus';

export default function OrderStatusBadge({ order }) {
  const { label, tone } = orderStatus(order);
  return <span className={`status-badge${tone ? ` ${tone}` : ''}`}>{label}</span>;
}
