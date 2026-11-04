// About page content. Live store: filled from GET /about at start-up.

export const ABOUT = { story: [], stats: [], values: [], milestones: [] };

export function hydrateAbout(about) {
  Object.assign(ABOUT, about ?? {});
}
