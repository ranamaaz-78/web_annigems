export const formatPrice = (n) =>
  '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatPriceRounded = (n) => '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const formatDate = (ts) => new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
