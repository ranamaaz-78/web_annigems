// Policy pages and FAQs. Live store: filled from GET /pages/{slug} and GET /faqs at start-up.

export const POLICY_SLUGS = ['shipping-policy', 'returns', 'privacy-policy', 'terms', 'warranty'];

export const POLICIES = {};
export const FAQS = [];

export function hydratePolicies(pages) {
  pages.filter(Boolean).forEach((p) => {
    POLICIES[p.slug] = { title: p.title, eyebrow: p.eyebrow, intro: p.intro, updated: p.updated, sections: p.sections ?? [] };
  });
}

export function hydrateFaqs(groups) {
  FAQS.splice(0, FAQS.length, ...(groups ?? []).map((g) => ({ category: g.category, items: g.items.map((i) => ({ q: i.q, a: i.a })) })));
}
