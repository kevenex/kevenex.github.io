# KevinK

Personal site for **Kevin Kim**. Three typographic voices, one continuous
scroll, and a warm palette in both light and dark. The home page is a single
page; projects live as their own static pages under `public/`.

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
  flyer-fable/             Standalone flight game — see below
  project-wick/            Product one-pager + the agent's journal — see below
  chloe/                   Standalone pet game; reachable by URL, unlinked
  favicon.svg
scripts/
  sync-wick-journal.mjs    Pulls the agent's repo into public/project-wick/journal.json
  sync-chloe.mjs           Builds kevenex/chloe-web-app into public/chloe/
worker/
  index.ts                 POST /api/contact — the form's delivery route (see Contact)
src/
  App.tsx                  Page composition
  index.css                Colour tokens for both themes, fonts, reset, Lenis classes
  lib/
    layout.ts              Rail geometry, the shared reveal, reduced-motion hooks
    lenis.tsx              The single Lenis instance
    lenis-context.ts       Context + useScrollTo / useScrollToOffset
    pointer.ts             The hover layer's gate, and the magnetic hook
    theme.ts               Light/dark resolution and the stored preference
    contact.ts             Contact validation and delivery (see Contact, below)
  components/
    Arrival.tsx            Typographic hero
    Position.tsx           The thesis
    Spread.tsx             Shared layout for a featured project
    WickSpread.tsx         Project Wick, with figures read at build time
    FlyerSpread.tsx        Flyer Fable
    Practice.tsx           Ascending career timeline
    Contact.tsx            Name / email / message
    Colophon.tsx           The closing dark band
    Spine.tsx              The rule that runs the page
    Rail.tsx               Scrubbable map of the page
    Cursor.tsx             The page's own cursor
    ThemeToggle.tsx        Light/dark switch
    ComingSoon.tsx         The password gate at /
    KevinKLogo.tsx         4-fold symmetric SVG mark
    WickMark.tsx           Project Wick's mark
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
  `index.html` and `app/index.html` because the gate and the site share an
  origin and a stored preference.
- A stored choice outranks the OS. With nothing stored the page follows
  `prefers-color-scheme` live; once someone picks a side, changing the system
  theme no longer overrides them (`src/lib/theme.ts`).

The colophon has its own `band` role rather than reusing `ink`, because in dark
mode it goes *darker* than the page — inverting it into a pale slab would make
the close shout when its job is to settle.

**`Spread` has an empty plate slot.** Its `children` render under the data
strip, and neither project currently passes anything — both spreads are a
thesis, a figure strip and a link out. Two plates were built there and removed
by decision, not by accident: the projects say more as an invitation to their
own pages than as a preview embedded in this one.

**The spine** (`Spine.tsx`) is the continuity device: one rule running the
length of the document's middle, which in `Practice.tsx` grows nodes and becomes
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
would live under one of five equal gaps. Three things are load-bearing there
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

The home page spread prints that journal's real figures — entries, words, days,
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
greige than `/app/` is worse than no shared language at all. Each page also
inlines the critical tokens and the pre-paint theme script from
`app/index.html`, against the same `localStorage` key, so a theme chosen
anywhere on the site holds everywhere.

`wick.css` adds exactly one role the SPA does not have: `--c-fault`, for an open
defect. It has to be told apart from `--c-oxide` at a glance, since oxide is
already the accent under every link and hover, so it is a cool crimson against
oxide's rust-brown. Measured ratios are recorded beside the values. Neither it
nor `--c-amber` is ever the only signal — both are set beside a written label.

`/flyer-fable/` is the other standalone page and has **not** been brought onto
`wick.css`; it still carries the old dark, mono-only look.

## Flyer Fable (`/flyer-fable/`)

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

The form posts to `POST /api/contact`, a route on the same Cloudflare Worker
that serves the site (`worker/index.ts`), which hands the message to Email
Routing for delivery to a verified destination address. No mailbox exists on
this domain and none is needed: `send_email` sends *as* a routing address, and
the free plan allows any destination the account has verified — those messages
do not count against a sending quota.

`submitContact` in `src/lib/contact.ts` still reports whether the message was
delivered rather than assuming it, and the form has three endings instead of
one: sent, failed (the typed message is kept, with `form@kevink.im` offered as
a fallback), and rate-limited. A form that says "sent" when the request failed
misleads the person who wrote it.

**The recipient is a secret, not a var.** This repository is public, and a
personal address in a committed config is an address handed to every scraper
that reads it:

```sh
npx wrangler secret put CONTACT_TO
```

The three things that must exist in the Cloudflare dashboard, none of which
require a mailbox:

1. **Email Routing enabled** on the zone — it adds its own MX and SPF records.
2. **The destination address verified** — the same address `CONTACT_TO` holds.
   Until the verification link Cloudflare emails is clicked, every send fails.
3. **`form@kevink.im`** as a routing address, forwarding to that destination.
   The binding will only send as an address Email Routing knows.

Validation lives in `src/lib/contact.ts` and runs on both ends — the client for
fast, specific errors, the Worker because the endpoint is public and the gate on
`/` is client-side. The Worker also drops honeypot submissions silently, caps
the body, and rate-limits per IP (3/minute, per colo).

Locally, `npm run dev:worker` serves `dist/` and the route together on :8787;
the binding writes the composed message to `.wrangler/tmp/email/` instead of
sending it, which is enough to prove the headers and body are right. Delivery
itself can only be tested from a deploy.

## Before the Coming Soon gate comes off

`/` is a password gate (`ComingSoon.tsx`); the site itself is at `/app/`, which
redirects back if `localStorage` has no access token. Deferred by decision, not
forgotten:

1. **Resolve the Project Wick sync** (see Known stale above), so the spread's
   figures are current rather than a snapshot.
2. Re-check contrast and focus states if imagery is ever added to the spreads.

## Notes

- Every full-height section uses `h-screen-dvh` so mobile browser chrome does
  not clip the layout.
- Deployment is handled by `.github/workflows/deploy.yml`, which builds the site
  and publishes `dist/` to GitHub Pages. It runs on pushes to `master`, once a
  day on a schedule (to pick up the Project Wick journal and the Chloe build),
  and can be started by hand from the Actions tab.
- The custom domain lives in the repository's Pages settings. Because the site
  is published from a workflow rather than a branch, no `CNAME` file is needed.
