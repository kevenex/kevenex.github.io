# SynapseX

Single-page landing site for **SynapseX**, a futuristic neural-AI interface product.
Black canvas, white type, full-viewport video backgrounds, and Space Mono throughout.

## Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Framer Motion 12

## Getting started

```bash
npm install
npm run dev
```

| Script              | Purpose                              |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the Vite dev server            |
| `npm run build`     | Type-check and build to `dist/`      |
| `npm run preview`   | Serve the production build locally   |
| `npm run lint`      | Lint with ESLint                     |
| `npm run typecheck` | Type-check without emitting          |

## Structure

```
public/
  videos/                  Five background loops (1080p H.264, ~8.8 MB total)
  favicon.svg
src/
  App.tsx                  Page composition + entrance timing
  index.css                Fonts, Tailwind, global reset, Lenis classes
  constants/videos.ts      Background video paths
  components/
    Navbar.tsx             Fixed nav with expanding menu capsule
    Hero.tsx               Mouse-scrubbed hero video + scramble headings
    CinematicText.tsx      Scroll-driven 3D text section
    Metrics.tsx            Performance metrics grid
    Technology.tsx         Adaptive intelligence capabilities
    Architecture.tsx       Three-layer breakdown (no video)
    Footer.tsx             Split video/footer layout
    ScrambleIn.tsx         Entrance reveal text animation
    ScrambleText.tsx       Hover-driven scramble text
    SquashHamburger.tsx    Animated hamburger/close icon
    SynapseXLogo.tsx       4-fold symmetric SVG mark
```

## Background video

The five loops are served from `public/videos/` rather than the CloudFront URLs
they originated from, so the site does not break if those generated-asset links
expire. Each was re-encoded to 1080p H.264 CRF 26 with `+faststart`, taking the
set from ~52 MB to ~8.8 MB (SSIM 0.975–0.987 against the sources) — the
originals ran at 5–17 Mbps, far above what a muted background loop needs.

To swap a clip, drop the replacement in `public/videos/` under the same name.
Re-encode anything large first:

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 26 -preset slow \
       -pix_fmt yuv420p -movflags +faststart -an public/videos/hero.mp4
```

## Notes

- The hero video never autoplays. It sits paused at `0` and is scrubbed by horizontal
  pointer movement; seeks are chained through the `seeked` event so frames are not
  dropped mid-decode.
- Every full-height section uses `h-screen h-[100dvh]` so mobile browser chrome does not
  clip the layout.
- The live site is deployed by Cloudflare Workers Builds, which watches this repository
  and builds on every push. `wrangler.jsonc` describes the deploy: no `main` entry point,
  just the Vite output in `dist/` served as static assets, with unknown paths falling back
  to `index.html` for the single-page app. Wrangler is pinned in `devDependencies` so the
  build and local `npx wrangler deploy --dry-run` agree on a version.
- `.github/workflows/deploy.yml` is a second, independent deploy to GitHub Pages, kept
  from before the Cloudflare setup. It runs on pushes to `master` and can be started by
  hand from the Actions tab (`workflow_dispatch`).
