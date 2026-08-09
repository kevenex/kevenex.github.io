# KevinK

Personal site for **Kevin Kim**. Black canvas, white type, full-viewport video
backgrounds, and Space Mono throughout. The homepage is a single scrolling page;
projects live as their own pages under `public/`.

## Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Framer Motion 12

## Background video

The four loops are served from `public/videos/` rather than the CloudFront URLs
they originated from, so the site does not break if those generated-asset links
expire. Each was re-encoded to 1080p H.264 CRF 26 with `+faststart`, taking the
set to ~5.3 MB total (SSIM 0.975–0.987 against the sources) — the originals ran
at 5–17 Mbps, far above what a muted background loop needs.

The Adaptive Intelligence section (`Technology.tsx`) dropped its loop entirely —
an interactive career timeline reads better against a plain background than
a video underneath it.

To swap a clip, drop the replacement in `public/videos/` under the same name.
Re-encode anything large first:

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 26 -preset slow \
       -pix_fmt yuv420p -movflags +faststart -an public/videos/hero.mp4
```

## Flyer Fable (`/flyer-fable/`)

A stylized first-person flight over a low-poly South Korea, reachable from the
nav menu. It's vendored from [kevenex/korea-flyer](https://github.com/kevenex/korea-flyer)
at commit `a53bfec`, and lives in `public/` as a self-contained static page
rather than a React route. Local changes on top of upstream — self-hosted
Three.js, touch controls, a compact mobile layout, and site chrome — are each
marked with a `SITE:` comment in `index.html`.

## Project Wick (`/project-wick/`)

A product one-pager for an hourly journaling agent, with a companion journal
page at `/project-wick/journal/` that renders everything the agent has
actually written, plus the state files it keeps between runs. Both pages are
static HTML in `public/`, share a hand-drawn mark (`WickMark.tsx`, an inline
`<svg>`, and `wick.svg` for the favicon), and use the same two-hue visual
system for their inline-SVG figures. The journal's content is synced at build
time from a separate agent repository by `scripts/sync-wick-journal.mjs`,
which writes `public/project-wick/journal.json` and commits it back so the
page has a fresh fallback even if that sync fails — refresh it by hand with
`npm run sync:wick`.

## Notes

- The hero video never autoplays. It sits paused at `0` and is scrubbed by horizontal
  pointer movement; seeks are chained through the `seeked` event so frames are not
  dropped mid-decode.
- Every full-height section uses `h-screen h-[100dvh]` so mobile browser chrome does not
  clip the layout.
- Deployment is handled by `.github/workflows/deploy.yml`, which builds the site and
  publishes `dist/` to GitHub Pages. It runs on pushes to `master`, once a day on a
  schedule (to pick up the Project Wick journal), and can be started by hand from the
  Actions tab (`workflow_dispatch`).
- The custom domain lives in the repository's Pages settings. Because the site is
  published from a workflow rather than a branch, no `CNAME` file is needed in the repo.
