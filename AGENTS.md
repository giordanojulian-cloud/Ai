<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CalcForge project notes

- Before pushing: `npm run check` (registry, lint, typecheck, unit tests). E2E: `npm run build && npm run test:e2e`.
- Calculators live in `src/calculators/definitions/<slug>/`; follow `docs/ADDING_A_CALCULATOR.md`. Run `npm run calculators:generate` after adding or removing a folder.
- Every worked-example number in calculator content must be computed and asserted in that calculator's test.
- Brand strings come from `src/config/site.ts`; colors from tokens in `src/app/globals.css`.
