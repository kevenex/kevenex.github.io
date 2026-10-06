# KevinK

Personal site for **Kevin Kim**, written to be read by recruiters and hiring
managers. Three typographic voices, one continuous scroll, and a warm palette in
both light and dark. The home page is a single page; projects live as their own
static pages under `public/`.

## The page, in reading order

Résumé first, evidence after — the structure is modelled on how a recruiter
reads, and on tariquekhan.ca's plain-spoken version of it:

1. **Arrival** — name, title, location, two lines on what he does, LinkedIn
   and *My projects* side by side, and his Memoji.
2. **Experience** — newest first. The current role is a framed card whose
   *Built on it* drawing shows the teams that depend on the data foundation
   as chips on one base, AI products in the accent. Every role before it sits
   under *Before Plusgrade* and splits in two at xl: a narrow column of facts
   (logo, company, title, years, domain, city, and an optional worded figure
   for scale) under a short heavy rule, and a wide one for the story
   (headline, two flow chips, what happened, *What I learnt*).
3. **Where I fit** — open to roles, then four cases written to the reader as
   their own situation, two by two, AI first. The prototyping case links to
   How I use AI.
4. **Credentials** — education, certifications, skills.
5. **Contact** — LinkedIn first; the form underneath.

The projects are not set on the page. They are listed at `/projects/`, which
the hero and the colophon link to (see Projects, below). The old spreads and
the Curiosity hinge are still in `src/components/`, unmounted, so they can
come back without a rebuild. Flyer Fable is archived — see below.

**All career copy lives in `src/content/resume.ts`.** Components lay it out and
carry none of their own. It is deliberately anonymized — outcomes without vendor
names or exact figures — so check any new line against that before adding it.
Regions are named ("North America and Europe"); counts, partner banks and
acquired companies are not, which is why a role's `figure` is worded ("Hundreds
of stores") rather than counted.
`OFF_THE_CLOCK` is empty on purpose: Contact prints the line only once it exists.

## The design, in one paragraph

The page is paper-quiet — a greige ground, serif gravitas, generous space — and
the content is machines: an agent that woke on a cron and wrote, a flight engine
over real terrain, enterprise data migrations. That tension is the identity.
"Modern" is carried by register rather than by colour: mono data, live
timestamps and a hard grid do that work while the palette stays warm and analog.

## Stack

- React 18 + TypeScript
- Vite 8
- Tailwind CSS 3
- Framer Motion 12
- Lenis (smooth scroll)

## Structure

```
public/
  flyer-fable/             Standalone flight game; archived, reachable by URL, unlinked — see below
  project-wick/            Product one-pager + the agent's journal — see below
  chloe/                   Standalone pet game; reachable by URL, unlinked
  memoji/kevin.webp        The Memoji, cut out of a recording — see Memoji, below
  memoji/thinking.webp     …and two more expressions for How I use AI
  memoji/grin.webp
  ai/                      Screenshots for How I use AI (flyer-fable.webp is unused while archived)
  projects/ggp-tracker.webp  GGP Tracker on invented data, for Projects — see below
  logos/                   Company and school marks, 160px tiles shown at 40px
  app/index.html           Redirects the retired /app/ to / where the host can't — see below
  favicon.svg
scripts/
  build-memoji.mjs         Cuts the Memoji still out of a recording
  sync-wick-journal.mjs    Pulls the agent's repo into public/project-wick/journal.json
  sync-chloe.mjs           Builds kevenex/chloe-web-app into public/chloe/
  make-ggp-sample.mjs      Invented GG exports for the GGP Tracker screenshot
worker/
  index.ts                 POST /api/contact, and the /app → / redirect — the only server
src/
  App.tsx                  Page composition
  main.tsx                 The home page's entry
  pages/
    HowIUseAI.tsx          The /how-i-use-ai/ page
    Projects.tsx           The /projects/ page
  main-ai.tsx              How I use AI's entry
  main-projects.tsx        Projects' entry
  content/
    resume.ts              Every word of career copy — the one place to edit it
    ai.ts                  Every word on How I use AI
    projects.ts            Every word on Projects
  index.css                Colour tokens for both themes, fonts, reset, Lenis classes
  lib/
    layout.ts              Rail geometry, the shared reveal, reduced-motion hooks
    lenis.tsx              The single Lenis instance
    lenis-context.ts       Context + useScrollTo / useScrollToOffset
    pointer.ts             The hover layer's gate, and the magnetic hook
    theme.ts               Light/dark resolution and the stored preference
    contact.ts             Contact validation, shared with the Worker, and delivery
  components/
    Arrival.tsx            Who, what, where, and LinkedIn
    Memoji.tsx             The still Memoji beside the introduction
    Experience.tsx         Featured current role, then the timeline on the spine
    Fit.tsx                Where I fit
    Curiosity.tsx          The hinge into the projects (not mounted)
    Spread.tsx             Shared layout for a project (not mounted)
    WickSpread.tsx         Project Wick, with figures read at build time (not mounted)
    FlyerSpread.tsx        Flyer Fable (not mounted; archived)
    CompanyMark.tsx        A company's logo tile, or its monogram until there is one
    DrawnLink.tsx          The mono link whose rule draws in on hover
    LockedLink.tsx         Where a link would be, for a write-up not open yet
    Credentials.tsx        Education, certifications, skills
    Contact.tsx            LinkedIn, then name / email / message
    Colophon.tsx           The closing dark band, with How I built this
    Spine.tsx              The rule that runs the page
    Rail.tsx               Scrubbable map of the page
    Cursor.tsx             The page's own cursor
    ThemeToggle.tsx        Light/dark switch
    KevinKLogo.tsx         4-fold symmetric SVG mark
    CanadaFlag.tsx         The hero's flag, drawn (Windows has no flag emoji)
    WickMark.tsx           Project Wick's mark
    GgpMark.tsx            GGP Tracker's mark
    WickFlow.tsx           One Project Wick run, drawn, for Projects
```

## Design system

**Three voices, each with a job.** Instrument Serif is the human (headlines,
ideas). Instrument Sans is the working voice (body, UI). Space Mono is the
machine's — timestamps, commit hashes, coordinates, counts, years. Anything a
machine produced is mono; anything a person wrote is not.

**Colour** resolves through CSS variables defined in `src/index.css`, with the
measured contrast ratio recorded beside each block. Token names are roles, not
appearances — `paper` is whatever the page is printed on and `ink` is what it is
printed in, which stays true when the paper is black. Every pairing in both
themes clears its threshold.

**Dark mode** is therefore free at the component level: a class like `bg-paper`
or `border-ink/15` is correct in both themes and there is no `dark:` variant
anywhere in the markup. Two things make it work:

- The theme is resolved by a **blocking inline script in the document head**,
  before first paint. React mounts long after the browser paints, so deciding
  in the bundle would flash the wrong theme on every load. It is duplicated in
  `index.html`, `how-i-use-ai/index.html` and `projects/index.html` (and the
  standalone pages under `public/`) because they share an origin and a stored preference.
- A stored choice outranks the OS. With nothing stored the page follows
  `prefers-color-scheme` live; once someone picks a side, changing the system
  theme no longer overrides them (`src/lib/theme.ts`).

The colophon has its own `band` role rather than reusing `ink`, because in dark
mode it goes *darker* than the page — inverting it into a pale slab would make
the close shout when its job is to settle.

**`Spread` has an empty plate slot.** (The spreads are off the home page for
now; this holds for when they return.) Its `children` render under the data
strip, and neither project currently passes anything — both spreads are a
thesis, a figure strip and a link out. Two plates were built there and removed
by decision, not by accident: the projects say more as an invitation to their
own pages than as a preview embedded in this one.

**The spine** (`Spine.tsx`) is the continuity device: one rule running the
length of the document's middle, which in `Experience.tsx` grows nodes and becomes
the career timeline. Both use the `RAIL` constant in `lib/layout.ts`, so they
share one axis rather than resembling each other. Change `RAIL` or `RAIL_PAD`
and both follow.

**Motion:** the page moves like weight, and hover is where it answers back.
Those are two separate rules and they do not trade against each other.

*The scroll carries everything.* Lenis provides the weight; the spine's fill,
the rail's fill, the hero's drift and its readout are all bound directly to
scroll position and none of them are sprung. They report where the reader is,
so a spring would let them drift behind the scrollbar and they would stop
reading as position. Arriving elements still get one restrained reveal and
nothing else — they do not perform on their own account.

*Hover is a separate layer, and it is optional.* The custom cursor and the
magnetic links exist only behind `useHoverLayer()` in `lib/pointer.ts`, which
requires both a `(pointer: fine)` device and a reader who has not asked for
reduced motion. Touch is excluded outright rather than degraded: a magnetic
pull with no pointer to be magnetic toward is not a smaller version of the
effect, it is an element that moves for no visible reason. Everything under
this layer is an enhancement over a page that is already complete without it.

**The rail owns the right gutter.** `RAIL_PAD_R` reserves 192px at `lg` because
the fixed section rail occupies the last 166px of the viewport at its widest
label. Narrow it and right-aligned content runs underneath the active label.

**The rail is a map, not a menu.** Each tick sits at its section's *measured*
position in the document, so the gaps between them are the real distances the
reader has to cross and the fill between them is where they actually are. That
is what makes the track worth dragging: with evenly spaced ticks, half the page
would live under one of a handful of equal gaps. Three things are load-bearing there
and none of them is obvious:

- Offsets come from `getBoundingClientRect().top + scrollY`, never `offsetTop`.
  Every section but the hero is nested inside `Spine`'s `relative` wrapper, so
  `offsetTop` measures from *there* and puts every tick in the wrong place.
- They are divided by the scrollable range (`scrollHeight - innerHeight`),
  because that is the denominator `scrollYProgress` uses. Any other and the
  ticks and the fill disagree about where the page is.
- The `<ul>` holding the ticks is `absolute inset-0`, not `relative`. Its items
  are positioned by percentage, and percentages resolve against it — which, with
  every child taken out of flow, is a zero-pixel-tall box when it is `relative`.
  Every tick then lands at 0% and the widest label blankets the whole track,
  swallowing the drag along with it.

The rail no longer steps aside over the colophon — it changes to the band's
tokens and stays readable to 100%. A progress rail that disappears at 85% has
stopped being one.

## Four things that will bite if you forget them

**`overflow-x` must stay `clip`, never `hidden`.** Both stop sideways scrolling,
but `hidden` turns `html`/`body` into scroll containers, and every
`position: sticky` descendant then binds to that container instead of the
viewport and silently stops sticking. This already cost the timeline's year
counter once.

**Never hide the native cursor before the custom one has proven it renders.**
`Cursor.tsx` adds the `cursor-custom` class to `<html>` only after a real
`pointermove` has arrived, and drops it again the moment the hover layer is
switched off. Applying it on mount would mean that anything failing in that
component leaves a reader with no cursor at all on a page that otherwise works
— the enhancement must never leave the page worse off than not having it. The
CSS side needs `html.cursor-custom *` rather than a rule on `<body>`, because
the UA stylesheet sets `cursor` directly on links, buttons and fields and an
inherited value never reaches them.

**Reduced motion has to be handled in JavaScript, not CSS.** The stylesheet's
`prefers-reduced-motion` block zeroes transition durations, which does nothing
to Framer Motion — it animates opacity by writing inline styles, so an element
sits at `opacity: 0` waiting for an intersection the CSS cannot influence. Use
`useReveal()` and `usePrefersReducedMotion()` from `lib/layout.ts` for anything
animated, and `useHoverLayer()` from `lib/pointer.ts` for anything that responds
to a pointer, or a reader who asked for no motion gets content that never
appears.

## Company marks

Logos live in `public/logos/` as 160px tiles (`ibm.svg` has its viewBox
cropped to the wordmark; at 40px the original's margins made it illegible).
A role or credential names its file in `resume.ts` through a `Mark`:
`logo` when there is one, and always a `monogram`. `CompanyMark` shows the
logo, or the monogram on a hairline tile of the same size if a logo is
ever missing — every company has one now. `plusgrade.webp` sits on a white
ground the source file doesn't have: its dark grey would vanish on the dark
theme otherwise. The company name is always printed beside the mark, so the
image takes an empty alt.

## Memoji

The hero's Memoji is a single still frame. It used to turn toward the cursor by
scrubbing 24 frames of a recorded head turn; that was taken out because the
motion never read cleanly at this size. If it comes back, regenerate a sprite
rather than reviving the old component from history blind — the frame choice
and the cut-out are where the work was.

The image is generated, not drawn. The recording is on pure black and the hair
is near-black, so a colour key would take the hair with it;
`scripts/build-memoji.mjs` floods the background in from the edges instead and
softens the rim into alpha. The `.mov` files are not committed (large, and they
carry audio). To rebuild, with an ffmpeg that decodes H.264 and encodes WebP:

```sh
FFMPEG=/path/to/ffmpeg node scripts/build-memoji.mjs EmojiMovie812735549.mov

# How I use AI's two expressions: [start] [frame] [out]
node scripts/build-memoji.mjs EmojiMovie812735599.mov 11.2 1 public/memoji/thinking.webp
node scripts/build-memoji.mjs EmojiMovie812735414.mov 9.45 1 public/memoji/grin.webp
```

## How I use AI (`/how-i-use-ai/`)

A sub-page modelled on the structure of tariquekhan.ca/how-i-use-ai: what
Kevin uses AI for, two things built with it (Project Wick and this site),
how he keeps an assistant in context, the tools he reaches for,
and a way to get in touch. It is a second Vite entry (`how-i-use-ai/index.html`
→ `src/main-ai.tsx` → `src/pages/HowIUseAI.tsx`), registered in
`vite.config.ts`, and every word is in `src/content/ai.ts`.

- **Back to the home page.** "Back to the site" and "Get in touch" point at
  `/` and `/#contact`, set in `ai.ts`.
- **The home page's grammar, minus the instruments.** Paper, the left rail
  inset, the three voices, hairlines and `DrawnLink`; no spine, rail or year
  counter, because it is read top to bottom rather than scrubbed. The
  colophon is the shared one, with `top="#top"` so *Back to the start* lands
  on this page's header.
- **The screenshots are static.** `public/ai/` holds a frame of
  `/project-wick/` taken with Playwright at 1600×1000. Retake it if the page
  changes noticeably. `flyer-fable.webp` (mid-flight, after *Start Flying*)
  is kept for the archived Flyer Fable and is not shown.

The home page links to it from the prototyping case under Where I fit and
from the colophon.

## Projects (`/projects/`)

An index of the projects that have a write-up, newest first. Under the title
there is nothing but the list: each entry has its mark, a line or two and a
link out on the left, and one picture on the right from xl (stacked below
it). It is the third Vite entry
(`projects/index.html` → `src/main-projects.tsx` → `src/pages/Projects.tsx`),
registered in `vite.config.ts`, with every word in `src/content/projects.ts`,
and it is built in How I use AI's grammar: same header, same hairline
articles, same close and colophon. The hero's *My projects* and the colophon's
*All projects* both point here.

It lists two projects, by decision. Flyer Fable is archived (see below) and
Chloe stays unlisted.

- **Project Wick's write-up is locked while it is redone.** Its link carries
  `locked: true` in both `projects.ts` and `ai.ts`, which renders
  `LockedLink` — "Write-up in progress" behind a lock, with no anchor —
  instead of `DrawnLink`. `/project-wick/` itself is still served and still
  reachable by URL; nothing on the site links to it. To reopen it, delete
  the flag in both files and put the label back to "Read about Project Wick".
- **`WickFlow.tsx` restates the "How it worked" diagram on `/project-wick/`,**
  cut down to one run: no heartbeat, and no cadence, because that page says
  the schedule drifted. It makes no claim the one-pager does not, so change
  that page first and bring this along. Below its minimum width it scrolls
  inside its frame rather than shrinking its type.
- **The GGP Tracker screenshot is the deployed app on invented data.** It was
  taken from kevenex/ggpoker-tracker at `fca8aa7`, the commit its last
  successful deploy shipped, built locally (`wasm-pack build --no-opt`, then
  `npm run build` and `vite preview`) and captured at 1600×1000 with
  Playwright after importing a zip from `scripts/make-ggp-sample.mjs`: about
  240 tournament summaries and 14,000 hand histories in GG's export format,
  drawn from a seeded RNG, so the same seed gives the same picture.
  None of it is Kevin's play, which the image's alt text says and which keeps
  it in line with the write-up's rule of no personal results. The page sets
  no caption under either picture, by decision. It shows Key
  Stats, so retake it when that panel changes noticeably.

- **GGP Tracker's write-up is not in this repository.** It lives in
  [`kevenex/ggpoker-tracker`](https://github.com/kevenex/ggpoker-tracker) at
  `web/public/readme/index.html`, and that repo's own Worker serves it at
  `/ggpoker-tracker/readme/` through its route for `kevink.im/ggpoker-tracker*`,
  so this site's Worker never sees the path. The link is root-relative, which
  keeps it on the same origin (and the theme with it), but it only resolves on
  kevink.im: on the GitHub Pages copy it 404s, and under `vite dev` or
  `vite preview` it falls back to this site. The write-up also loads
  `/project-wick/wick.css` from here, so moving or renaming that file breaks
  its styling.
- **`GgpMark.tsx` is a copy of the chip drawn inline in that write-up's
  header.** The two live in different repositories and nothing catches the
  drift. Change one, change both.

## Project Wick (`/project-wick/`)

A one-pager for an autonomous journaling agent that ran from 8 to 26 August
2026, plus a journal page at `/project-wick/journal/` rendering everything it
wrote, mirrored at build time from
[`kevenex/project-wick`](https://github.com/kevenex/project-wick) by
`scripts/sync-wick-journal.mjs` (run by hand with `npm run sync:wick`).

The run is over, so both pages are written in the past tense and the one-pager
reports a result rather than a status. Its headline is a negative one — the
agent developed real self-awareness and its curiosity died anyway — which is
the finding, not a caveat on it.

The home page spread (currently unmounted) prints that journal's real figures — entries, words, days,
wiki pages, newest entry, source commit — via the `wick-summary` Vite plugin in
`vite.config.ts`, which reads `journal.json` at build time and emits only what
the page shows. Importing the file directly would inline ~640KB to display six
numbers. A missing or malformed journal costs the spread its figures, not the
site its build.

**The last-run stamp is not the last run.** `state/last-run.txt` says
2026-08-17; the newest entry is from the 26th. The agent wrote that file itself
and stopped maintaining it before it stopped writing. The journal page shows the
stamp and names the discrepancy; the spread prints the newest entry's date
instead, because a six-row strip has nowhere to put the caveat. Do not
"fix" either by quietly substituting one for the other — the gap is a finding.

**Sync in CI is still broken.** Since 2026-08-10 the sync step has failed with
`GET /repos/kevenex/project-wick → 404`, so every deploy builds from the
committed snapshot. The step exits 0 by design — a failed sync must not fail the
deploy — so it shows as a green run with a warning in the log. The snapshot
committed here was refreshed by hand from a local checkout:

```sh
git clone --depth 1 https://github.com/kevenex/project-wick /tmp/project-wick
WICK_LOCAL_REPO=/tmp/project-wick npm run sync:wick
```

`WICK_LOCAL_REPO` switches the script from the GitHub API to a directory on
disk and is the way to refresh the journal while CI cannot reach the repo.
Fixing CI means making that repository reachable to the workflow (it is not
public to the default `GITHUB_TOKEN`), not changing anything here.

**The agent's write path is broken and the mirror repairs it on read.** Entries
land with `\n` where a line break belongs and with the next `## HH:MM` heading
glued onto the end of the previous line. `repair()` in the sync script undoes
both, which is why the pages count 349 entries where a naive grep of the day
files finds 333. Leave it in until the upstream write path is fixed — without
it, 23 entries disappear into the ends of other entries.

### The standalone pages' design system

Both Wick pages are hand-authored documents in `public/` with no build step, so
Tailwind's classes are unavailable to them. `public/project-wick/wick.css`
restates the SPA's system in plain CSS: the palette, the three type voices, the
rail, and the components both pages share.

**Its token blocks are copied from `src/index.css`. Change one, change the
other** — nothing in the build catches the drift, and a Wick page on a different
greige than the home page is worse than no shared language at all. Each page also
inlines the critical tokens and the pre-paint theme script from
`index.html`, against the same `localStorage` key, so a theme chosen
anywhere on the site holds everywhere.

`wick.css` adds exactly one role the SPA does not have: `--c-fault`, for an open
defect. It has to be told apart from `--c-oxide` at a glance, since oxide is
already the accent under every link and hover, so it is a cool crimson against
oxide's rust-brown. Measured ratios are recorded beside the values. Neither it
nor `--c-amber` is ever the only signal — both are set beside a written label.

`/flyer-fable/` is the other standalone page and has **not** been brought onto
`wick.css`; it still carries the old dark, mono-only look.

## Flyer Fable (`/flyer-fable/`)

**Archived, not deleted.** Since October 2026 nothing on the site links to
it — not Projects, not How I use AI — but the page is still built and served
at `/flyer-fable/`, the same way `/chloe/` is. Bringing it back is re-adding
its entry to `AI_TRYING.projects` in `src/content/ai.ts` (the screenshot is
still in `public/ai/`), or giving it one in `src/content/projects.ts`.

A stylized first-person flight over a low-poly South Korea. Vendored from
[kevenex/korea-flyer](https://github.com/kevenex/korea-flyer) at commit
`a53bfec`, with local additions each marked with a `SITE:` comment so they
survive a re-copy from upstream. Self-contained static page in `public/`,
outside React and the SPA.

The figures on its spread come from that page's own source: `KM = 10` sets true
horizontal scale, Jeju sits 451 km from the Seoul origin, and Hallasan's 1,947 m
renders as 97 units — five times true scale.

**It is deliberately not embedded in the home page.** A previous iteration put
it in an iframe under its spread and that was removed; if you are tempted
again, the page's own source argues against it. It binds `keydown` on the
window and calls `preventDefault()` on the arrow keys and Space, so a frame
holding focus swallows the reader's own scroll keys. It calls
`requestPointerLock()` on canvas click, which needs an explicit
`allow="pointer-lock"` inside a frame and fails silently without one — and
under pointer lock the parent stops receiving `pointermove`, which freezes the
custom cursor mid-page. And it is an 89KB page plus a 670KB copy of Three.js
plus a WebGL render loop. It is a leaf page; let it be one.

## Contact

The form delivers. `Contact.tsx` posts to `POST /api/contact` on the Worker in
`worker/index.ts`, which mails the message through Cloudflare's `send_email`
binding; `submitContact` in `src/lib/contact.ts` still *reports* whether that
happened rather than assuming it, because the form's rule has not changed — it
must never say "sent" about a message it discarded.

**There is no credential anywhere.** Not in the bundle, not in a secret. The
binding may only reach destination addresses already verified on the Cloudflare
account, which is what makes it both free on every plan and impossible to
redirect by tampering with a request. Sending to an *arbitrary* recipient — an
auto-reply to whoever wrote in, say — is the thing that would need the Workers
Paid plan and an onboarded sending domain, so the form deliberately does not.

Three things are load-bearing and none of them is obvious:

- **`run_worker_first` in `wrangler.jsonc` is what makes the route exist.**
  `not_found_handling: "single-page-application"` answers *every* unmatched path
  from the asset server, so without the override a POST to `/api/contact` comes
  back as the app shell with a 200 and the Worker never runs at all.
- **`submitContact` requires `{"delivered": true}` in the body, not just
  `response.ok`.** This repo also publishes to GitHub Pages, where the route does
  not exist and that same SPA fallback answers 200 with HTML. Trusting the status
  would make the form claim success on a host that delivered nothing.
- **The recipient is a secret, and not because it is a credential.** This
  repository is public, and a personal address committed to `wrangler.jsonc` is a
  personal address handed to scrapers. It arrives as `CONTACT_TO`.

The honeypot is checked in the form *and* on the route: a bot that posts straight
to the endpoint never renders the field the page hides, so the client-side check
alone would only catch the polite ones.

Setting it up on a fresh account is three steps, none of them in code:

1. Email Routing → Destination addresses → add the inbox and **verify** it. Email
   Routing itself is inbound-only and cannot send; verifying an address here is
   what licenses the Worker to send *to* it. Until that link is clicked the send
   is rejected, and any routing rule pointing at the address stays disabled.
2. Set `CONTACT_TO` to that address — see **Deploying** below, because which
   command works depends on whether the newest version is the deployed one.
3. Optional: enable **subaddressing** under Email Routing → Settings, and publish
   `hello+wick@kevink.im`, `hello+flyer@kevink.im` and so on. One routing rule for
   `hello@` matches every tag and the tag survives into the message, so each
   surface gets a filterable address without a rule of its own. Verifying a
   plus-addressed *destination* and pointing `CONTACT_TO` at it does the same for
   the form's own mail.

If spam ever arrives, the next steps in order are a WAF rate-limiting rule on
`/api/contact` (no code) and then Turnstile — which does put a visible widget in a
form that is deliberately austere, so it is a last resort rather than a default.

### Deploying

**The GitHub Pages workflow does not deploy this.** It publishes `dist/` to Pages
and never touches the Worker, so `/api/contact` does not exist on that copy. The
Worker is deployed with `wrangler`, from a clone:

```sh
npm run build                          # dist/ is gitignored — a fresh clone has none
npx wrangler versions upload           # prints a preview URL; shifts no traffic
npx wrangler versions secret put CONTACT_TO
npx wrangler versions deploy           # promote, once the preview checks out
```

Five things that bite, in the order they bite:

- **Run it from the repository.** Outside a clone every command fails on config
  resolution — `Required Worker name missing`, then `ENOENT package.json` — which
  looks like four unrelated problems and is one.
- **Build first, always.** `assets.directory` points at `dist/`, which is
  gitignored, so a fresh clone has nothing to upload.
- **Prefer `versions upload` to `deploy`.** This configuration defines no separate
  environment, so a plain `wrangler deploy` from *any* branch goes straight to the
  Worker serving the live site.
- **`versions secret put`, not `secret put`.** Once a version is uploaded but not
  deployed, plain `secret put` refuses — "the latest version of your Worker isn't
  currently deployed" — because writing the secret would implicitly deploy it. The
  `versions` form writes the secret into a new version carrying the uploaded code
  forward, so it *replaces* a second upload rather than following one. (`.dev.vars`
  is local-only and never read by deploy; secrets survive later deploys.)
- **Merge to `master` after promoting.** `versions deploy` puts whichever branch
  you ran it from into production while `master` still holds the old code. If a
  Cloudflare Workers Build is wired to `master`, its next run silently reverts
  production to a version with no `/api/contact`.

Test the contact route on the preview URL with `curl`:

```sh
curl -i -X POST https://<version>-kevink-im.<subdomain>.workers.dev/api/contact \
  -H 'content-type: application/json' \
  -d '{"name":"Ada","email":"ada@example.com","message":"Test."}'
```

Use a sender address that is *not* the destination inbox, or `replyTo` points at
you and the reply behaviour cannot be checked. The real test is hitting Reply on
the mail that arrives: the draft must address the sender, not `form@kevink.im`.

#### The bare domain

`kevink.im` without `www` used to have no DNS record at all, so the address
people type off a résumé failed to resolve. `routes` in `wrangler.jsonc` now
attaches both hostnames to the Worker as Custom Domains, and Cloudflare creates
the record and certificate for each on the next `versions deploy`.

`www.kevink.im` was already a Custom Domain on this Worker (it shows in DNS as a
locked record of type *Worker*), so listing it changes nothing. The apex only
carried MX and TXT records for Email Routing, and those coexist with a Custom
Domain. What would block a deploy is a hostname with its own A, AAAA or CNAME
record; delete that one first. The same attachment can be made by hand at
Workers & Pages → kevink-im → Settings → Domains & Routes → Add → Custom
domain. Check afterwards with `dig +short kevink.im`.

## The retired `/app/`

Until October 2026 `/` was a password gate and the site lived at `/app/`. The
gate is gone and the site is at `/`, but links to `/app/` are out there, so
both hosts send them home:

- **kevink.im (the Worker)** answers `/app` and everything under it with a 301
  to `/`, query string kept. `run_worker_first` in `wrangler.jsonc` lists
  `/app` and `/app/*` so the Worker sees the request before the asset server
  does. The browser carries the `#fragment` across the redirect on its own, so
  `/app/#contact` lands on the contact form. Check with
  `curl -sI https://kevink.im/app/`, which should show `301` and
  `location: https://kevink.im/`.
- **GitHub Pages** can't redirect on the server, so `public/app/index.html`
  is a client-side redirect (script, then meta refresh, then a link) with a
  canonical pointing at `https://kevink.im/`. The Worker never serves it.

Nothing reads the old `site-access` key in `localStorage` any more; browsers
that still hold it are unaffected.

## Still open

Deferred by decision, not forgotten:

1. **Resolve the Project Wick sync** (see Known stale above), so the spread's
   figures are current rather than a snapshot.
2. Re-check contrast and focus states if imagery is ever added to the spreads.

The contact form used to head this list. It now delivers — see Contact above —
though the Cloudflare console steps there have to be done once before it can.

## Notes

- Every full-height section uses `h-screen-dvh` so mobile browser chrome does
  not clip the layout.
- Deployment is handled by `.github/workflows/deploy.yml`, which builds the site
  and publishes `dist/` to GitHub Pages. It runs on pushes to `master`, once a
  day on a schedule (to pick up the Project Wick journal and the Chloe build),
  and can be started by hand from the Actions tab.
- **Only the Cloudflare Worker deploy carries `/api/contact`.** The Pages copy is
  static, so the contact form there will always report a failed send. That is the
  honest outcome rather than a bug, but it is a reason to decide whether that copy
  is still wanted.
- `npm run typecheck` runs the app and worker projects explicitly. It used to be
  plain `tsc`, which — with a solution-style root `tsconfig.json` whose `files` is
  empty — silently checked *nothing*; a real type error in `src/` passed clean.
  `tsconfig.node.json` (`vite.config.ts`) is still outside it and needs
  `@types/node` before it can join.
- The custom domain lives in the repository's Pages settings. Because the site
  is published from a workflow rather than a branch, no `CNAME` file is needed.
