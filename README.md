# CalcForge

Fast, accurate calculators for money, business, real estate, construction and everyday decisions — built as a scalable platform where adding calculator #1,000 is as easy as adding #21.

**Competitive principle:** better calculators + better explanations + better UX. Every calculator shows its formula, assumptions and a verified worked example, and every formula is covered by reference-value tests.

- 24 production calculators across 8 categories (finance, investing, debt, real estate, business, construction, career, everyday)
- Static generation for every public page; works with **zero** environment variables
- Optional Postgres, auth, Stripe, AI explanations, analytics and ads — each behind a clean abstraction
- 310+ unit/component tests (formulas, validation, search, registry contracts) and 26 Playwright E2E tests including axe accessibility scans

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the design and key decisions, and [`docs/ADDING_A_CALCULATOR.md`](docs/ADDING_A_CALCULATOR.md) for the calculator workflow.

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, Turbopack), strict TypeScript |
| Styling | Tailwind CSS v4 with CSS-variable design tokens (light + dark) |
| UI primitives | Small in-house shadcn-style components (`src/components/ui`), lucide icons |
| Charts | Recharts, lazy-loaded when a chart scrolls into view |
| Validation | Zod (inputs, API bodies, server actions) |
| Database | PostgreSQL + Prisma 7 (driver adapter `@prisma/adapter-pg`) — Supabase, Neon, RDS or local |
| Auth | Auth.js v5 (JWT sessions, Prisma adapter; GitHub, Google, email magic link, dev login) |
| Billing | Stripe (checkout, customer portal, webhooks) behind `src/lib/billing` |
| AI | Anthropic SDK (structured outputs) behind `src/lib/ai` — optional |
| Tests | Vitest + Testing Library, Playwright + axe-core |

---

## Local setup

Requirements: Node.js ≥ 20.19 (22 recommended) and npm. PostgreSQL is optional.

```bash
npm install            # also runs `prisma generate`
cp .env.example .env   # every value is optional
npm run dev            # http://localhost:3000
```

With no `.env` at all, the full public site works: all calculators, search, categories, SEO, sharing. Features that need storage (saved calculations, feedback, newsletter, admin) show a friendly "not available yet" state.

### Database setup

Any PostgreSQL 14+ works. Locally:

```bash
createuser calcforge --createdb --pwprompt      # password: calcforge
createdb calcforge -O calcforge
# .env
DATABASE_URL="postgresql://calcforge:calcforge@localhost:5432/calcforge"

npm run db:migrate     # apply migrations (prisma migrate dev)
npm run db:seed        # categories + one editorial row per calculator
```

**Supabase:** create a project, copy the *connection pooling* URI (port 6543, `?pgbouncer=true`) into `DATABASE_URL` for the app. Run migrations with the direct connection URI (port 5432).

### Migrations

| Command | Use |
| --- | --- |
| `npm run db:migrate` | Create/apply migrations in development (`prisma migrate dev`) |
| `npm run db:deploy` | Apply committed migrations in CI/production (`prisma migrate deploy`) |
| `npm run db:seed` | Idempotent seed (never overwrites admin edits) |
| `npm run db:studio` | Browse data |

After editing `prisma/schema.prisma`, run `npm run db:migrate -- --name describe_change` and commit the generated folder under `prisma/migrations`.

### First admin user

Set `ADMIN_EMAILS="you@example.com"` and sign in with that email (any provider). For local development without OAuth, set `AUTH_DEV_LOGIN=true` and use the development login form on `/signin` (never enabled in production builds).

---

## Environment variables

All variables are documented in [`.env.example`](.env.example). Summary:

| Variable | Enables |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph (set in production) |
| `DATABASE_URL` | Accounts, saved calculations, feedback, newsletter, suggestions, admin overrides |
| `AUTH_SECRET` | Required for auth in production (`npx auth secret`) |
| `AUTH_GITHUB_ID/SECRET`, `AUTH_GOOGLE_ID/SECRET` | OAuth sign-in |
| `AUTH_RESEND_KEY`, `AUTH_EMAIL_FROM` | Email magic-link sign-in |
| `AUTH_DEV_LOGIN` | Password-less dev login (development only) |
| `ADMIN_EMAILS`, `SEED_ADMIN_EMAIL` | Admin bootstrap |
| `STRIPE_*` | Pro subscriptions |
| `ANTHROPIC_API_KEY`, `AI_MODEL` | "Explain my result" |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` + provider keys | Analytics |
| `NEXT_PUBLIC_ADS_MODE`, `NEXT_PUBLIC_ADSENSE_*` | Display ads |
| `NEXT_PUBLIC_MONETIZATION_PREVIEW` | Labeled placeholders for all ad/affiliate/lead slots |

Private variables are read only in server code (`src/lib/env.ts`, route handlers, server actions). Only `NEXT_PUBLIC_*` values reach the browser.

---

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run typecheck` | Route type generation + `tsc --noEmit` |
| `npm test` | Unit, contract and component tests (Vitest) |
| `npm run test:e2e` | Playwright smoke + accessibility tests (run `npm run build` first) |
| `npm run check` | Registry check + lint + typecheck + unit tests — run before every push |
| `npm run calculators:new -- <slug> "<Name>" <category>` | Scaffold a calculator |
| `npm run calculators:generate` | Rebuild the calculator registry after adding/removing a folder |

E2E tests start `npm start` on port 3100 automatically (`E2E_PORT` to change). Playwright uses the pre-installed Chromium; locally run `npx playwright install chromium` once.

---

## Deployment (Vercel)

1. Import the repository in Vercel (framework preset: Next.js; build command `npm run build`).
2. Set `NEXT_PUBLIC_SITE_URL` to your production domain, plus any optional integrations.
3. If using a database, set `DATABASE_URL` and run `npm run db:deploy` against it (from CI or locally) before the first deploy that needs new tables.
4. Set `AUTH_SECRET` before enabling any sign-in provider. OAuth callback URLs are `https://<domain>/api/auth/callback/<provider>`.
5. Stripe webhook endpoint: `https://<domain>/api/billing/webhook`.

The app also runs on any Node host (`npm run build && npm start`). The in-memory rate limiter should be swapped for a shared store (Upstash/Redis) when running multiple instances — see `src/lib/rate-limit.ts`.

**Measured Lighthouse (production build, local):** desktop 100/100/100/100 on home and calculator pages; mobile (simulated slow 4G, 4× CPU) performance 88–97 on calculator pages and 94 on the homepage, with accessibility, best practices and SEO at 100. Real-world scores depend on hosting, CDN and any ad/analytics scripts you add.

---

## How to…

### Create a calculator

```bash
npm run calculators:new -- car-loan "Car Loan Calculator" finance
```

Then fill in the TODOs in `src/calculators/definitions/car-loan/` and run `npm run check`. The full guide, with examples for every field type, output type and the content checklist, is in [`docs/ADDING_A_CALCULATOR.md`](docs/ADDING_A_CALCULATOR.md).

### How calculator configuration works

Each calculator is a folder in `src/calculators/definitions/<slug>/`:

| File | Purpose | Ships to browser? |
| --- | --- | --- |
| `meta.ts` | Name, category, SEO, keywords, related links, flags | Small subset via search index |
| `logic.ts` | Pure math, unit tested | Yes (in that calculator's chunk only) |
| `definition.ts` | Inputs (declarative fields) + `compute()` → structured result | Yes (lazy chunk) |
| `content.ts` | Education, formulas, example, assumptions, FAQs | No (server only) |
| `<slug>.test.ts` | Reference-value tests | — |

`npm run calculators:generate` writes `registry.generated.ts` (server registry and loaders) and `widgets.generated.tsx` (one lazily loaded client chunk per calculator). The generic engine (`src/components/calculator`) renders inputs, validation, results, charts, tables, sharing, saving and AI explanations from the definition — no per-calculator UI code.

Admins can override metadata (names, descriptions, SEO, category, featured/premium/published, FAQs, related links) from `/admin` without a deploy; calculation logic always stays in code.

### Create a category

Add an entry to `src/calculators/categories.ts` (slug, name, title, descriptions, intro paragraphs, icon). The category page, navigation, footer, sitemap and admin select pick it up automatically. Run `npm run db:seed` to mirror it into the database. Empty categories render a "coming soon" page marked `noindex` and are excluded from the sitemap until they have calculators.

### Change branding

Edit `src/config/site.ts` (name, tagline, description, URL, contact email, logo mark). Replace `src/app/icon.svg`. Colors, radii and typography are tokens at the top of `src/app/globals.css`; the font is set in `src/app/layout.tsx`. No other file hardcodes the brand.

### Connect analytics

Set `NEXT_PUBLIC_ANALYTICS_PROVIDER` to `plausible`, `posthog`, `ga4` or `console`, plus that provider's key (see `.env.example`). All product events go through `track()` in `src/lib/analytics` with typed event names (`calculator_view`, `calculator_completed`, `affiliate_clicked`, `search_performed`, …). To add a provider, implement `AnalyticsProvider` in `src/lib/analytics/providers.ts` and load its script in `src/components/analytics/analytics-scripts.tsx`. Events never include calculator input values.

### Connect Stripe

1. Create a product with monthly and annual prices; set `STRIPE_SECRET_KEY`, `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_ANNUAL`.
2. Add a webhook to `/api/billing/webhook` for `checkout.session.completed` and `customer.subscription.*`; set `STRIPE_WEBHOOK_SECRET`. Locally: `stripe listen --forward-to localhost:3000/api/billing/webhook`.
3. Update display prices in `src/lib/billing/plans.ts` to match.

Entitlements (`src/lib/billing/plans.ts`) map plans to features such as `unlimited_saves`, `no_ads` and `premium_calculators`. Check them server-side with `getEntitlements(userId)` + `hasFeature()`. Mark a calculator `premium: true` in its meta (or from /admin) to gate it.

### Add AI features

Set `ANTHROPIC_API_KEY`. The "Explain my result" button appears on calculator pages; `/api/ai/explain` recomputes the result server-side from the submitted inputs (the model never sees client-supplied results), and the provider in `src/lib/ai/anthropic.ts` returns schema-validated JSON (summary, considerations, questions). The system prompt in `src/lib/ai/prompt.ts` restricts the model to explaining calculations — never recommending actions or products. Default model: `claude-opus-5` (override with `AI_MODEL`); requests use low effort, prompt caching and server-side refusal fallbacks. To use another provider, implement `ExplanationProvider` and return it from `getExplanationProvider()`. Requests are rate limited per IP.

### Add advertisements

Set `NEXT_PUBLIC_ADS_MODE=adsense` and `NEXT_PUBLIC_ADSENSE_CLIENT` plus slot IDs. Placements already exist below the result, inside the educational content and in the desktop sidebar (`<AdSlot placement="…">`), each reserving height to avoid layout shift. For Mediavine/Raptive, add their script to `src/components/monetization/ad-scripts.tsx` and render their placeholders in `AdSlot`. Affiliate offers live in `src/config/monetization.ts` (empty by default — no fake offers are shown); disclosures render automatically next to sponsored content. Lead-generation blocks are disabled per vertical until you add a destination URL.

---

## Project structure

```
src/
  app/                    Routes (public pages, account, admin, API, sitemap, robots, OG images)
  calculators/
    definitions/<slug>/   One folder per calculator (meta, logic, definition, content, tests)
    engine/               Input parsing, Zod validation, share-URL serialization
    shared/               Reusable domain math (housing, growth, property, pricing)
    categories.ts         Category config
    registry.ts           Queries + related-calculator discovery engine
    *.generated.ts(x)     Generated registry and lazy widget map
  components/             UI primitives, calculator engine UI, layout, search, monetization
  config/                 Branding, locale, monetization
  lib/                    finance math, formatting, SEO, search, analytics, auth, billing, AI, db, http
prisma/                   Schema, migrations, seed
scripts/                  Registry generator and calculator scaffold
e2e/                      Playwright tests
docs/                     Architecture and calculator guide
```

## Disclaimer

Calculators provide estimates for educational purposes. They do not constitute financial, tax, legal, lending or investment advice.
