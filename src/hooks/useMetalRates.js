import { useSyncExternalStore } from 'react';
import { api } from '../api/client';

// One shared poll of GET /metal-rates for every component that shows live prices.
const REFRESH_MS = 60_000;
let data = null;
let timer = null;
const listeners = new Set();

async function load() {
  if (document.hidden) return;
  try {
    const res = await api('metal-rates');
    if (res?.data) {
      data = res.data;
      listeners.forEach((notify) => notify());
    }
  } catch {
    // Keep showing the last reading; the next tick retries.
  }
}

function subscribe(notify) {
  listeners.add(notify);
  if (!timer) {
    load();
    timer = setInterval(load, REFRESH_MS);
    document.addEventListener('visibilitychange', load);
  }
  return () => {
    listeners.delete(notify);
    if (!listeners.size) {
      clearInterval(timer);
      timer = null;
      document.removeEventListener('visibilitychange', load);
    }
  };
}

export const useMetalRates = () => useSyncExternalStore(subscribe, () => data);
