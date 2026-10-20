import { useCallback, useMemo } from 'react';
import { applyConfigRule, resolveProductPrice } from '../utils/pricing';
import { useAuth } from './useAuth';
import { useB2B } from './useB2B';

// Price helpers that respect the signed-in account type (retail vs business).
export function usePricing() {
  const { user } = useAuth();
  const { pricing } = useB2B();
  const isB2B = user?.accountType === 'b2b';

  // { price, retail, isB2B } for a catalogue product
  const productPrice = useCallback(
    (product) => ({ price: resolveProductPrice(product, isB2B, pricing), retail: product.price, isB2B }),
    [isB2B, pricing],
  );

  // Price of a custom ring given its retail total
  const configPrice = useCallback((total) => (isB2B ? applyConfigRule(total, pricing.config) : total), [isB2B, pricing]);

  return useMemo(() => ({ isB2B, productPrice, configPrice }), [isB2B, productPrice, configPrice]);
}
