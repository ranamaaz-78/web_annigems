import { ORDER_STAGES } from '../data/orders';

/** Business (B2B) order: cash on delivery, approved by our team before fulfilment. */
export const isB2BOrder = (order) => order?.accountType === 'business';

// Order states from the API that come before / instead of the fulfilment stages.
const STATUS = {
  pending_payment: { label: 'Payment Pending', tone: 'warn' },
  payment_failed: { label: 'Payment Failed', tone: 'bad' },
  awaiting_approval: { label: 'Awaiting Approval', tone: 'warn' },
  cancelled: { label: 'Cancelled', tone: 'bad' },
  refunded: { label: 'Refunded', tone: 'info' },
};

// { label, tone } shown in status badges. tone: '' | 'done' | 'warn' | 'bad' | 'info'
export const orderStatus = (order) => {
  if (STATUS[order.status]) {
    return order.status === 'cancelled' && isB2BOrder(order) && order.cancelReason?.startsWith('Rejected')
      ? { label: 'Rejected', tone: 'bad' }
      : STATUS[order.status];
  }
  const last = ORDER_STAGES.length - 1;
  return { label: ORDER_STAGES[order.stage]?.label ?? 'Processing', tone: order.stage >= last ? 'done' : '' };
};
