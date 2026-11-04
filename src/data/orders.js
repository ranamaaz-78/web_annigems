// Fulfilment stages shown on the tracking timeline.
// Live store: labels and descriptions come from GET /bootstrap (order_stages).

import { mapStage } from '../api/mappers';

export const ORDER_STAGES = [];

export function hydrateOrderStages(stages) {
  ORDER_STAGES.splice(0, ORDER_STAGES.length, ...(stages ?? []).map(mapStage));
}
