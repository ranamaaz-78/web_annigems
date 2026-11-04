// "Design Your Ring" data. Live store: filled from GET /configurator at start-up.

import { mapRing, mapStone } from '../api/mappers';

const fill = (target, items) => target.splice(0, target.length, ...(items ?? []));

export const CONFIG_STEPS = [];
export const CONFIG_RINGS = [];
export const CONFIG_STONES = [];
// Active ring × stone combos: a stone is offered for a ring only when its combo exists.
export const CONFIG_COMBOS = [];
// All sizes offered by at least one ring (each ring also carries its own `sizes`).
export const CONFIG_SIZES = [];
export const SIZE_CHART = [];
export const SIZE_GUIDE_STEPS = [];

export function hydrateConfigurator(c) {
  fill(CONFIG_STEPS, c.steps);
  fill(CONFIG_COMBOS, c.combos);
  fill(CONFIG_RINGS, (c.rings ?? []).map(mapRing));
  fill(CONFIG_STONES, (c.stones ?? []).map((s) => mapStone(s, c.combos ?? [])));
  const sizes = [...new Set(CONFIG_RINGS.flatMap((r) => r.sizes))].sort((a, b) => parseFloat(a) - parseFloat(b));
  fill(CONFIG_SIZES, sizes);
  fill(SIZE_CHART, c.size_chart);
  fill(SIZE_GUIDE_STEPS, c.size_guide_steps);
}

export const stonesForRing = (ring) => CONFIG_STONES.filter((s) => CONFIG_COMBOS.some((c) => c.ring_id === ring?.id && c.stone_id === s.id));
