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
src/
  App.tsx                  Page composition + entrance timing
  index.css                Fonts, Tailwind, global reset, Lenis classes
  constants/videos.ts      CloudFront background video URLs
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

## Notes

- The hero video never autoplays. It sits paused at `0` and is scrubbed by horizontal
  pointer movement; seeks are chained through the `seeked` event so frames are not
  dropped mid-decode.
- Every full-height section uses `h-screen h-[100dvh]` so mobile browser chrome does not
  clip the layout.
- Deployment is handled by `.github/workflows/deploy.yml`, which builds the site and
  publishes `dist/` to GitHub Pages.
