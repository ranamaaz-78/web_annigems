# AANI GEMAS — Web Frontend

A static React + Vite frontend for the AANI GEMAS jewelry store, built from the
reference design in [`referenece_design/`](./referenece_design).

**Frontend only.** There are no APIs, no backend, and no persisted data. All content
comes from files in `src/data/`. Cart and wishlist live in memory so the design's
interactions work, and they reset when the page reloads. Forms (sign in, newsletter,
checkout) only show the UI flow.

## Getting started

```bash
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
  main.jsx                Entry: router + providers + global styles
  App.jsx                 Route table
  data/                   All static content (edit text/prices/products here)
    products.js           Product catalogue, featured / new-arrival ids, ring sizes
    catalog.js            Categories, badges, filters, sort options
    configurator.js       Rings, stones, sizes and size chart for "Design Your Ring"
    testimonials.js       Testimonials and product reviews
    site.js               Brand, navigation, footer, shipping, payment, gold rate
  context/                Providers: theme, shop (cart/wishlist), UI (overlays/toast)
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
| `/checkout` | Checkout |

## Theming

Dark is the default. The toggle in the navbar switches to light mode, and the choice is
saved in `localStorage`. Colors are CSS variables in `src/styles/tokens.css`. Light-mode
overrides are in `src/styles/theme-light.css`.

## Deployment note

The app uses `BrowserRouter`. Static hosts need an SPA fallback that rewrites all paths
to `index.html`. Netlify uses `_redirects`, Vercel uses `rewrites`. Without it, deep
links like `/shop` return 404.
