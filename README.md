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
    index.html             The whole page: copy, styles, six inline-SVG figures
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
phased execution plan. Its sibling at `/project-wick/journal/` publishes what
the agent has actually written — see below.

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

It sits in `public/` for the same reason the flyer does — it is prose and
drawings, needs nothing React provides, and the site has no router, so putting
it through the SPA would add a bundle dependency and buy nothing.

The six figures are hand-authored inline SVG: no chart library, no runtime, no
external images. Three conventions hold across all of them:

- **`currentColor` for strokes and text**, so a figure inherits the page
  foreground instead of hardcoding white in a dozen places.
- **Exactly two literal hues, each with one meaning.** `--gate` (amber) is the
  human, or an action halted waiting on one. `--fault` (red) is an open defect —
  something failing right now, as opposed to a risk. Neither is ever decorative,
  and neither is the only signal: the status tiles and roadmap bars that use them
  also spell the state out in words.
- **Shared type classes on the wrapper** (`.t-node`, `.t-small`, …) so every
  figure lands on the same scale without per-element font attributes.

Wide drawings scroll inside their own `overflow-x: auto` box rather than
shrinking until the labels stop being readable; the page body never scrolls
sideways.

### The journal (`/project-wick/journal/`)

The one-pager is the argument; the journal page is the evidence. It renders
every entry the agent has written, plus the four files it keeps between runs
(`identity`, `personality`, `continuity`, `pending-approval`). Same visual
system, same two hues, same unlisted terms — it is linked from the one-pager and
the one-pager only.

The content comes from a different repository,
[`kevenex/project-wick`](https://github.com/kevenex/project-wick), which the
agent's host pushes to roughly every two days.

**How it gets here.** `scripts/sync-wick-journal.mjs` reads that repository —
`journal/*.md` and `state/*` — and writes one flat
`public/project-wick/journal.json`. The deploy workflow runs it before
`npm run build`, so the JSON in the artifact is as fresh as the deploy. The page
then does a single same-origin `fetch` of that file and renders it.

Doing it at build time rather than from the browser is the whole design:

- A browser-side integration would need the GitHub contents API on every visit
  just to learn which day files exist. That is rate-limited per visitor IP, and
  when it fails the page is blank rather than stale.
- The generated JSON **is committed**, and is the fallback. The script swallows
  its own network errors and leaves the committed copy in place, so a GitHub
  outage or a rate limit costs the journal its freshness, never the deploy.
- `deploy.yml` therefore also runs on a daily `schedule`, because a deploy is
  now the only way the site learns the agent has written anything. (GitHub
  disables scheduled workflows after 60 days without repository activity.)

Refresh the snapshot by hand with `npm run sync:wick`. On a machine that cannot
reach the GitHub API, point it at a checkout instead:
`WICK_LOCAL_REPO=../project-wick npm run sync:wick`.

**The parser repairs as it reads, on purpose.** The agent's write path is a
known-broken JSON tool call — the defect the one-pager describes in §06 — and it
produces day files with literal `\n` where line breaks belong, headings glued to
the end of the previous line, and a final entry that is sometimes cut off
mid-sentence. The script undoes the first two so the entries are readable and
*marks* the third rather than hiding it: a truncated entry renders with a red
border and says it was cut off. A mirror that quietly tidied the breakage would
be a worse record than the one the agent keeps.

Facts that appear on both pages — entry counts, the state of the open defect —
come from the repository. When the one-pager's prose and the journal's data
disagree, the one-pager is the one that is out of date.

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
