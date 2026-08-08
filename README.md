# KevinK

Personal site for **Kevin Kim**. Black canvas, white type, full-viewport video
backgrounds, and Space Mono throughout. The homepage is a single scrolling page;
projects live as their own pages under `public/`.

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
  flyer-fable/             Standalone flight game — see below
    index.html             The whole game: markup, styles, scene, flight loop
    three.min.js           Three.js r0.160.0, self-hosted
  project-wick/            Product one-pager — see below
    index.html             The whole page: copy, styles, four inline-SVG figures
  favicon.svg
src/
  App.tsx                  Page composition + entrance timing
  index.css                Fonts, Tailwind, global reset, Lenis classes
  constants/videos.ts      Background video paths
  components/
    Navbar.tsx             Fixed nav with expanding menu capsule
    Hero.tsx               Mouse-scrubbed hero video + scramble headings
    CinematicText.tsx      Scroll-driven 3D text section
    Projects.tsx           Translucent project cards linking to sub-pages
    Technology.tsx         Adaptive intelligence capabilities
    Architecture.tsx       Three-layer breakdown (no video)
    Footer.tsx             Split video/footer layout
    ScrambleIn.tsx         Entrance reveal text animation
    ScrambleText.tsx       Hover-driven scramble text
    SquashHamburger.tsx    Animated hamburger/close icon
    KevinKLogo.tsx         4-fold symmetric SVG mark
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

## Flyer Fable (`/flyer-fable/`)

A stylized first-person flight over a low-poly South Korea, reachable from the
nav menu. It is vendored from [kevenex/korea-flyer](https://github.com/kevenex/korea-flyer)
at commit `a53bfec`.

It lives in `public/` rather than under `src/`, which means Vite copies it to
`dist/` byte for byte and GitHub Pages serves it as an ordinary static page. The
game is one self-contained file that builds its own scene and runs its own
render loop outside React, so routing it through the SPA would add a bundle
dependency and buy nothing — and an iframe would inherit the parent's viewport
quirks on mobile for no gain.

Local changes on top of upstream are each marked with a `SITE:` comment:

- **Self-hosted Three.js.** Upstream loads r0.160.0 from unpkg. Here it is
  served from the same origin, for the same reason the background videos are —
  the page should not go blank because a third-party CDN moved or went down.
- **Touch controls.** Upstream is keyboard-only, so it is unplayable on a phone.
  The on-screen buttons write into the same `keys` map the keyboard writes to,
  which is why the flight loop needed no changes to accept them. Pointer capture
  on press is what keeps a held control from sticking on when a finger slides
  off the button.
- **Compact layout.** The desktop version parks a panel in each of the four
  corners at fixed pixel sizes. A `compact` body class — set from JS, refreshed
  on resize — collapses that into a stack: HUD and minimap shrink, the fly-to
  buttons become one horizontally scrolling row above the controls, and the
  keyboard panel gives way to a hint on the splash screen. It keys off touch
  capability as well as width, because a landscape phone is ~750px wide and
  would otherwise be treated as a desktop while still needing the clearance.
- **Site chrome.** A link back to the homepage, page title, favicon and
  description.

To pull in upstream changes, re-copy `index.html` and re-apply the `SITE:`
blocks — they are contiguous and commented for that purpose.

## Project Wick (`/project-wick/`) — unlisted

A product one-pager for an hourly journaling agent: strategy, the nested
feedback loops, the two-stage implementation, the permission boundary, and a
phased execution plan.

**Nothing on the site links here.** There is no Projects card and no nav entry,
and the page carries `<meta name="robots" content="noindex, nofollow">`. It is
reachable only by typing the URL. The path is deliberately *not* in a
`robots.txt` `Disallow` line, because that file is public and would advertise
the very path being hidden.

That is obscurity, not access control. The page is still served publicly and
this repository is public, so nothing on it should be treated as private. Real
gating would need the page moved somewhere that can authenticate — GitHub Pages
serves static files to anyone who asks. To relist it, add the card back to
`src/components/Projects.tsx`, add a nav entry, and drop the robots tag.

The homepage tile hints at the project without linking to it, and its
"Request early access" button is **deliberately inert** — there is no
destination yet. Wire an `onClick` in `src/components/Projects.tsx` when one
exists.

It sits in `public/` for the same reason the flyer does — it is prose and
drawings, needs nothing React provides, and the site has no router, so putting
it through the SPA would add a bundle dependency and buy nothing.

The two figures are hand-authored inline SVG: no chart library, no runtime, no
external images. Three conventions hold across both:

- **`currentColor` for strokes and text**, so a figure inherits the page
  foreground instead of hardcoding white in a dozen places.
- **One literal hue with one meaning.** `--open` (amber) marks something
  unresolved — an open axis, an untested claim — and nothing else. It is never
  decorative and never the only signal: the tile and table cells that use it
  also say so in words.
- **Shared type classes on the wrapper** (`.t-node`, `.t-small`, …) so both
  figures land on the same scale without per-element font attributes.

Wide drawings scroll inside their own `overflow-x: auto` box rather than
shrinking until the labels stop being readable; the page body never scrolls
sideways.

## Wick's mark

`src/components/WickLogo.tsx`, drawn on lucide's 24-unit grid at lucide's
stroke weight so it can sit in the homepage icon row beside `Plane`,
`FlaskConical` and `PenLine` without reading as a different visual language.

Two paths, and the inner one is load-bearing: a single pointed-top,
round-bottomed outline is the universal **water-drop** glyph, and earlier drafts
read as water at every size. Fire is what gets drawn with a hot core inside it,
so the inner flame is what makes it a flame. The outer tip leans, which keeps it
distinct from lucide's own `Flame`.

The same two paths are inlined in three places that cannot import from each
other — the component, `public/project-wick/index.html`, and
`public/project-wick/icon.svg` (the page favicon, on a black plate with a
heavier 1.9 stroke because 1.5 disappears at 16px). Change one, change all
three.

## Notes

- The hero video never autoplays. It sits paused at `0` and is scrubbed by horizontal
  pointer movement; seeks are chained through the `seeked` event so frames are not
  dropped mid-decode.
- Every full-height section uses `h-screen h-[100dvh]` so mobile browser chrome does not
  clip the layout.
- Deployment is handled by `.github/workflows/deploy.yml`, which builds the site and
  publishes `dist/` to GitHub Pages. It runs on pushes to `master` and can be started
  by hand from the Actions tab (`workflow_dispatch`).
- The custom domain lives in the repository's Pages settings. Because the site is
  published from a workflow rather than a branch, no `CNAME` file is needed in the repo.
