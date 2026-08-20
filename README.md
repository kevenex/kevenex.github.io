# KevinK

Personal site for **Kevin Kim**. Black canvas, white type, full-viewport video
backgrounds, and Space Mono throughout. The homepage is a single scrolling page;
projects live as their own pages under `public/`.

## Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Framer Motion 12

## Structure

```
public/
  videos/                  Four background loops (1080p H.264, ~5.3 MB total)
  flyer-fable/             Standalone flight game — see below
    index.html             The whole game: markup, styles, scene, flight loop
    three.min.js           Three.js r0.160.0, self-hosted
  project-wick/            Product one-pager — see below
    index.html             The whole page: copy, styles, one interactive SVG diagram
    wick.svg               The project mark, as the favicon for both Wick pages
    journal.json           Generated: the agent's journal, mirrored at build time
    journal/
      index.html           Reader for journal.json — entries plus the state files
  favicon.svg
scripts/
  sync-wick-journal.mjs    Pulls the agent's repo into public/project-wick/journal.json
src/
  App.tsx                  Page composition + entrance timing
  index.css                Fonts, Tailwind, global reset, Lenis classes
  constants/videos.ts      Background video paths
  components/
    Navbar.tsx             Fixed nav with expanding menu capsule
    Hero.tsx               Mouse-scrubbed hero video + scramble headings
    CinematicText.tsx      Scroll-driven 3D text section
    Projects.tsx           Translucent project cards linking to sub-pages
    Technology.tsx         Adaptive intelligence: an interactive career roadmap
    Architecture.tsx       Three-layer breakdown (no video)
    Footer.tsx             Split video/footer layout
    ScrambleIn.tsx         Entrance reveal text animation
    ScrambleText.tsx       Hover-driven scramble text
    SquashHamburger.tsx    Animated hamburger/close icon
    KevinKLogo.tsx         4-fold symmetric SVG mark
    WickMark.tsx           Project Wick's mark, for the Projects card
```

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
nav menu. Vendored from [kevenex/korea-flyer](https://github.com/kevenex/korea-flyer)
at commit `a53bfec`, with local additions — self-hosted Three.js, touch
controls, a compact mobile layout — each marked with a `SITE:` comment so they
survive a re-copy from upstream. Lives in `public/` as a self-contained static
page, outside React and the SPA.

## Project Wick (`/project-wick/`)

A product one-pager for a journaling agent that runs every 30 minutes, paired
with a journal page at `/project-wick/journal/` that renders what the agent has
actually written, mirrored at build time from
[`kevenex/project-wick`](https://github.com/kevenex/project-wick) by
`scripts/sync-wick-journal.mjs` into `public/project-wick/journal.json` (run by
hand with `npm run sync:wick`). Both pages are static HTML in `public/`, no
React, sharing a hand-drawn mark and a two-color system: amber for the human,
red for an open defect.

The one-pager is versioned in a comment at the top of its own file, and the
version tracks the agent rather than the page — v7 covers the agent's
`SPEC-search-thinking-v2` and `SPEC-heartbeat-config-v2` rewrites (a `web_read`
article-extraction tool beside `web_search`, the X tools dropped, a SENSE /
SYNTHESIZE split, the thread cap down to five, and a heartbeat that now closes
and scores threads itself). When the agent changes, re-run the sync and reread
the one-pager's Status section against `journal.json` — the counts and the list
of open defects there are the two things that go stale first.

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
