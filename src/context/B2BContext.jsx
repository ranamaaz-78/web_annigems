import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PRICING, SEED_CREDIT_REQUESTS } from '../data/b2b';
import { readStorage, writeStorage } from '../utils/storage';
import { B2BContext } from './contexts';

// B2B pricing rules (read-only here), credit-limit requests and "become a business customer" enquiries.
// Rules are managed in the separate admin project; until the backend exists they come from data/b2b.js.
// Persisted in localStorage (no backend).

const PRICING_KEY = 'aani-b2b-pricing';
const CREDIT_KEY = 'aani-b2b-credit-requests';
const ENQUIRY_KEY = 'aani-b2b-enquiries';

export function B2BProvider({ children }) {
  const [pricing] = useState(() => readStorage(PRICING_KEY, DEFAULT_PRICING));
  const [creditRequests, setCreditRequests] = useState(() => readStorage(CREDIT_KEY, SEED_CREDIT_REQUESTS));
  const [enquiries, setEnquiries] = useState(() => readStorage(ENQUIRY_KEY, []));

  useEffect(() => writeStorage(PRICING_KEY, pricing), [pricing]);
  useEffect(() => writeStorage(CREDIT_KEY, creditRequests), [creditRequests]);
  useEffect(() => writeStorage(ENQUIRY_KEY, enquiries), [enquiries]);

  const requestCredit = useCallback((entry) => {
    setCreditRequests((prev) => [{ id: `cr-${Date.now()}`, status: 'pending', createdAt: Date.now(), ...entry }, ...prev]);
  }, []);

  const addEnquiry = useCallback((entry) => {
    setEnquiries((prev) => [{ id: `enq-${Date.now()}`, status: 'new', createdAt: Date.now(), ...entry }, ...prev]);
  }, []);

  const value = useMemo(
    () => ({ pricing, creditRequests, requestCredit, addEnquiry }),
    [pricing, creditRequests, requestCredit, addEnquiry],
  );

  return <B2BContext.Provider value={value}>{children}</B2BContext.Provider>;
}
