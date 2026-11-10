import { useCallback, useMemo } from 'react';
import { CONFIG_B2B } from '../data/configurator';
import { useAuth } from './useAuth';

// Price helpers that respect the signed-in account type (retail vs business).
// For a business account the API already returns its tier prices: `price` is the business price
// and `retailPrice` the normal one.
export function usePricing() {
  const { isB2B } = useAuth();

  // { price, retail, isB2B } for a catalogue product
  const productPrice = useCallback(
    // isB2B here = "show the business price next to the struck retail price" (0% categories show one price)
    (product) => ({ price: product.price, retail: product.retailPrice ?? product.price, isB2B: isB2B && product.retailPrice != null && product.retailPrice > product.price }),
    [isB2B],
  );

  // Price of a custom ring given its retail total (tier % of the Design Your Ring row).
  const configPrice = useCallback(
    (total) => (isB2B && CONFIG_B2B.percent ? Math.round(total * (100 - CONFIG_B2B.percent)) / 100 : total),
    [isB2B],
  );

  return useMemo(() => ({ isB2B, productPrice, configPrice, ringPercent: isB2B ? CONFIG_B2B.percent : null }), [isB2B, productPrice, configPrice]);
}
