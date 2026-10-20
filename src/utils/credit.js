// Credit used = approved credit orders that admin has not marked as settled.
export const creditSummary = (account, orders) => {
  const limit = account?.creditLimit ?? 0;
  const used = orders
    .filter((o) => o.email === account?.email && o.payment?.status === 'credit_approved')
    .reduce((s, o) => s + o.totals.total, 0);
  return { limit, used, available: Math.max(0, limit - used) };
};
