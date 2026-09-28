# Architecture

## Goals

1. Calculators that are **correct**, explain themselves, and feel instant.
2. Adding a calculator is a data-and-math task, not a UI task.
3. Technical SEO by default: static pages, unique metadata, structured data, clean internal linking.
4. Every business integration (DB, auth, billing, AI, analytics, ads) is optional and replaceable.

## Request flow

```
                 build time                                   runtime (browser)
┌──────────────────────────────────────────┐        ┌─────────────────────────────────┐
│ /calculator/[slug] (SSG, ISR 1h)          │  HTML  │ CalculatorWidget ("use client")  │
│  ├─ meta (registry + admin overrides)     │ ─────▶ │  └─ lazy chunk: definition.ts    │
│  ├─ content.ts (server only)              │        │      └─ CalculatorEngine         │
│  └─ CalculatorWidget SSR with defaults    │        │         parse → validate →       │
└──────────────────────────────────────────┘        │         compute → render         │
                                                     └─────────────────────────────────┘
```

- The page is statically generated. The calculator is server-rendered with default inputs, so crawlers and no-JS users see a real result.
- Each calculator's math ships as its own chunk (`widgets.generated.tsx` uses literal `next/dynamic` imports so Next.js can preload it). A page never downloads other calculators' code.
- Long-form content is a server component: zero client JavaScript.
- Charts load Recharts only when scrolled near the viewport. Engine sections hydrate in separate Suspense boundaries.

## Key decisions

| Decision | Rationale |
| --- | --- |
| **Calculators are code, metadata is overridable data.** | Math must be reviewed and tested; editorial fields (titles, SEO, FAQs, flags) benefit from non-deploy edits. `Calculator` rows store *overrides only* (nullable columns), so code defaults keep flowing through unless an admin changes a field. |
| **Public site does not require the database.** | `getCatalog()` merges overrides when `DATABASE_URL` works and silently falls back to code defaults otherwise. The site builds and serves without any env vars. |
| **Generated registry instead of a hand-maintained import list.** | One folder per calculator; a script writes the server registry and the client lazy-widget map. CI checks it's current. |
| **Declarative fields + imperative `compute`.** | Field configs give validation, accessible inputs, share URLs and server validation for free. `compute` stays plain TypeScript so complex calculators (debt avalanche, FHA MIP) aren't forced into a formula DSL. |
| **Structured results, not JSX.** | `compute` returns data (primary, secondary, sections, charts, tables, insights). The same data drives the UI, CSV export, analytics-free AI explanations and future PDF export. |
| **Share URLs read client-side.** | Reading `searchParams` on the server would make every calculator page dynamic. Instead pages stay static; the engine applies query params after hydration. Canonical URLs never include query strings, avoiding duplicate content. |
| **Auth.js with JWT sessions.** | No DB read per request; admin checks re-read the role from the database. The header resolves session state client-side so layouts stay static. |
| **Rules in dated config files.** | FHA MIP tables and payroll tax parameters change; they live in `fha-rules.ts` / `payroll-rules.ts` with effective dates and sources, referenced by both the math and the content. |
| **Own fuzzy search (≈150 lines).** | Weighted fields, synonyms, stopwords, stemming and bounded edit distance handle "how much house can I afford" and typos without a dependency. The index is fetched lazily (`/api/search-index`) so it scales to thousands of calculators without bloating page JS. |
| **No new calculation logic from the admin UI.** | Admins can create metadata drafts; they stay unpublished until a developer implements and tests the math. `Calculator.config` is reserved for future config-driven calculators. |
| **Monetization off by default.** | No fake offers or placeholder ads in production. Everything is wired (slots, disclosures, tracking) and switched on by config. |

## Data model (Prisma)

- **Auth.js:** `User` (with `role`), `Account`, `Session`, `VerificationToken`.
- **Catalog:** `CalculatorCategory`, `Calculator` (editorial overrides + reserved `config`).
- **User data:** `SavedCalculation` (inputs only — results are recomputed), `FavoriteCalculator`, `CalculationHistory` (reserved for opt-in premium history; not written today).
- **Billing:** `PremiumSubscription` mirrors Stripe; entitlements derive from it.
- **Audience:** `NewsletterSubscriber`, `Feedback`, `CalculatorSuggestion`.

We intentionally do not log calculator inputs. Analytics events carry calculator slugs, never values.

## Security

- Zod validation on every API body and server action; calculator inputs are re-validated against the definition server-side before storage or AI use.
- Same-origin checks + JSON content type on cookie-authenticated endpoints (CSRF); server actions use Next.js' built-in origin checks.
- Admin: proxy redirect for anonymous users, then a database role check in the layout and in every action (non-admins receive 404).
- Ownership-scoped queries (`where: { id, userId }`) for saved calculations.
- Rate limiting behind a `RateLimiter` interface (memory implementation; swap for Redis in multi-instance deployments).
- Security headers in `next.config.ts`; CSP is a documented TODO pending final ad/analytics vendors.
- CSV export neutralizes spreadsheet formula injection; JSON-LD escapes `<`.

## Discovery engine

`relatedCalculators()` returns explicit `related` links first (editorial intent), then fills by score: reverse links (+4), same primary category (+3), overlapping categories (+2), shared keywords (+1 each), tie-broken by popularity. Combined with category pages, breadcrumbs, the footer and "Popular" navigation, every calculator is reachable within two clicks of the homepage.

## Future work (intentionally not built)

- Programmatic location variants — only with genuinely localized content.
- PDF export, scenario comparison and history (entitlement flags exist).
- Email provider for newsletter double opt-in (`TODO(email)` in the newsletter route).
- Shared rate-limit store; Content-Security-Policy.
