# GANSID website

The new website for the Global Action Network for Sickle Cell & Other Inherited Blood Disorders (GANSID), replacing the WordPress site at inheritedblooddisorders.world.

- **Stack:** Next.js 16 (static export), React 19, Tailwind CSS 4, three.js, Lenis.
- **Run locally:** `npm install`, then `npm run dev` (http://localhost:3002).
- **Build:** `npm run build` writes the static site to `out/`.
- **Deploys:** Netlify builds `main` to production and every pull request to a preview link.
- **Design system:** `/design-system` (colours, type, liquid glass, buttons, pills, cards, motion, brand mark).
- **Content source:** the scraped WordPress content lives outside this repo (content inventory: pages, people, forms, navigation). Page copy is carried over from it, never invented.

## Homepage design options

While the homepage is in review, each section has switchable variants (`src/lib/variants.tsx`) and a review dock (`src/components/review/review-dock.tsx`) that saves "Use this one / Save for later / Close, needs tweaks / Not for us" marks. Saved-for-later variants (for example the Orbit timeline) are kept on purpose for reuse on inner pages.

`node scripts/make-preview.mjs <dir> [page] [title]` turns the static export into a self-contained bundle for a claude.ai Artifact preview.
