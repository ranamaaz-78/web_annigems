import { B2B_STEPS } from '../data/b2b';
import { ORDER_STAGES } from '../data/orders';

export const isB2BOrder = (order) => order?.type === 'b2b';

// B2B orders start fulfilment only once payment is confirmed or credit is approved.
export const isFulfilling = (order) =>
  isB2BOrder(order) && ['paid', 'credit_approved', 'credit_settled'].includes(order.payment?.status);

const PAYMENT_LABELS = {
  unpaid: 'Payment Pending',
  link_requested: 'Payment Link Requested',
  link_sent: 'Payment Link Ready',
  credit_requested: 'Credit Under Review',
};

// { label, tone } shown in status badges. tone: '' | 'done' | 'warn' | 'bad' | 'info'
export const orderStatus = (order) => {
  if (!isB2BOrder(order)) {
    const last = ORDER_STAGES.length - 1;
    return { label: ORDER_STAGES[order.stage]?.label ?? 'Processing', tone: order.stage >= last ? 'done' : '' };
  }
  if (order.approval === 'pending') return { label: 'Awaiting Approval', tone: 'warn' };
  if (order.approval === 'rejected') return { label: 'Rejected', tone: 'bad' };
  if (!isFulfilling(order)) {
    return { label: PAYMENT_LABELS[order.payment?.status] ?? 'Payment Pending', tone: order.payment?.status === 'link_sent' ? 'info' : 'warn' };
  }
  const step = B2B_STEPS[Math.min(order.stage + 2, B2B_STEPS.length - 1)];
  return { label: step.label, tone: order.stage >= 4 ? 'done' : '' };
};

// { steps, stage } for the Timeline component.
export const orderTimeline = (order) => {
  if (!isB2BOrder(order)) return { steps: ORDER_STAGES, stage: order.stage };
  if (order.approval === 'pending') return { steps: B2B_STEPS, stage: 1 };
  if (!isFulfilling(order)) return { steps: B2B_STEPS, stage: 2 };
  return { steps: B2B_STEPS, stage: Math.min(order.stage + 2, B2B_STEPS.length - 1) };
};
