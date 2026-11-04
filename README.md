# AANI GEMAS — Web Frontend

A React + Vite storefront for the AANI GEMAS jewelry store, built from the
reference design in [`referenece_design/`](./referenece_design).

**Connected to the Web Portal API** (`/api/v1/web/*` of the AANI GEMAS backend).
At start-up the store loads its content (settings, navigation, home, catalogue,
configurator, FAQs, policies, about, services) and keeps it in the `src/data/` modules, so
components read it as before. Prices, cart totals, coupons and shipping come from the
API (`POST /cart/quote`). Accounts, addresses, wishlist, orders, contact and newsletter use
their endpoints. Checkout creates the order with `POST /checkout` and confirms the card
payment with Stripe.

**Not connected:** the Business (B2B) module still runs on local demo data
(`src/data/b2b.js`), because its API has not been built yet.

## Getting started

```bash
cp .env.example .env   # VITE_API_URL = the backend (php artisan serve -> http://localhost:8000)
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
npm run lint      # oxlint
```

## Project structure

```
public/images/            Product, banner and logo images
src/
  main.jsx                Entry: loads the store from the API, then router + providers + styles
  api/                    API client (token, currency, errors), response mappers, boot hydration, Stripe
  App.jsx                 Route table
  data/                   Content stores, filled from the API at start-up (edit content in the admin)
    products.js           Product catalogue, featured / new-arrival ids
    catalog.js            Categories, badges, filters, sort options
    configurator.js       Rings, stones, sizes and size chart for "Design Your Ring"
    testimonials.js       Testimonials and product reviews
    site.js               Brand, navigation, footer, shipping, payment, gold rate
  context/                Providers: auth (account, orders), shop (cart/quote/wishlist), B2B, theme, UI
  hooks/                  useTheme, useShop, useUI, useScrolled, useWishlistToggle
  utils/                  Formatting, pricing and cart helpers
  components/
    common/               Logo, Icons, Stars, Breadcrumb, SectionHeader, EmptyState, ThemeToggle
    layout/               Layout shell, Navbar, MegaMenu, MobileMenu, Footer
    overlays/             CartDrawer, SearchOverlay, AuthModal, QuickViewModal, Toast
    product/              ProductCard, ProductGrid
  pages/
    Home/                 HomePage + sections (Hero, UspBar, CategoryGrid, …)
    Shop/                 ShopPage, ShopSidebar, filter logic
    Product/              ProductPage, gallery, info, accordion, reviews
    Configurator/         4-step "Design Your Ring" flow
    Checkout/             3-step checkout + order summary
    Wishlist/, NotFound/
  styles/                 Global CSS split by feature (index.css imports them in order)
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/shop?cat=rings&sort=price-asc&max=1000` | Shop (filters are in the URL) |
| `/product/:id` | Product detail |
| `/design-your-ring` | Ring configurator |
| `/wishlist` | Wishlist |
| `/checkout` | Checkout (sign-in required; card payment via Stripe) |
| `/track-order` | Order tracking (sign-in required) |
| `/account/*` | Profile, orders, addresses, password, wishlist |

## Theming

Dark is the default. The toggle in the navbar switches to light mode, and the choice is
saved in `localStorage`. Colors are CSS variables in `src/styles/tokens.css`. Light-mode
overrides are in `src/styles/theme-light.css`.

## Deployment note

The app uses `BrowserRouter`. Static hosts need an SPA fallback that rewrites all paths
to `index.html`. Netlify uses `_redirects`, Vercel uses `rewrites`. Without it, deep
links like `/shop` return 404.
