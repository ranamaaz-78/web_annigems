import { hydrateAbout } from '../data/about';
import { hydrateCatalog } from '../data/catalog';
import { hydrateConfigurator } from '../data/configurator';
import { hydrateOrderStages } from '../data/orders';
import { POLICY_SLUGS, hydrateFaqs, hydratePolicies } from '../data/policies';
import { hydrateProducts } from '../data/products';
import { hydrateHome, hydrateServices, hydrateSite } from '../data/site';
import { hydrateTestimonials } from '../data/testimonials';
import { api } from './client';

/** All products (the catalogue is small; pages of 50). */
async function fetchAllProducts() {
  const first = await api('products?per_page=50');
  const pages = [first];
  for (let p = 2; p <= (first.meta?.last_page ?? 1); p += 1) pages.push(await api(`products?per_page=50&page=${p}`));
  return pages.flatMap((r) => r.data);
}

const optional = (promise) => promise.catch(() => null);

/**
 * Loads every piece of store content from the Web Portal API into the data stores
 * before the app renders, so pages render synchronously exactly as before.
 */
export async function hydrateStore() {
  const [bootstrap, home, products, configurator, faqs, about, services, ...pages] = await Promise.all([
    api('bootstrap'),
    api('home'),
    fetchAllProducts(),
    api('configurator'),
    api('faqs'),
    api('about'),
    api('services'),
    ...POLICY_SLUGS.map((slug) => optional(api(`pages/${slug}`))),
  ]);

  const b = bootstrap.data;
  hydrateSite(b);
  hydrateOrderStages(b.order_stages);
  hydrateHome(home.data);
  hydrateCatalog(b, home.data.categories);
  hydrateProducts(products, home.data);
  hydrateTestimonials(home.data.testimonials);
  hydrateConfigurator(configurator.data);
  hydrateFaqs(faqs.data);
  hydrateAbout(about.data);
  hydrateServices(services.data);
  hydratePolicies(pages.map((p) => p?.data));
}
