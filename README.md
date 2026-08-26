# KevinK

Personal site for **Kevin Kim**. Three typographic voices, one continuous
scroll, and a warm palette in both light and dark. The home page is a single
page; projects live as their own static pages under `public/`.

## The design, in one paragraph

The page is paper-quiet — a greige ground, serif gravitas, generous space — and
the content is machines: an agent that wakes hourly and writes, a flight engine
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
src/
  App.tsx                  Page composition
  index.css                Colour tokens for both themes, fonts, reset, Lenis classes
  lib/
    layout.ts              Rail geometry, the shared reveal, reduced-motion hooks
    lenis.tsx              The single Lenis instance
    lenis-context.ts       Context + useScrollTo
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
    Rail.tsx               Fixed section indicator
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

**The spine** (`Spine.tsx`) is the continuity device: one rule running the
length of the document's middle, which in `Practice.tsx` grows nodes and becomes
the career timeline. Both use the `RAIL` constant in `lib/layout.ts`, so they
share one axis rather than resembling each other. Change `RAIL` or `RAIL_PAD`
and both follow.

**Motion:** the page moves like weight; the elements do not perform. All the
liquidity is in the scroll (Lenis) and the spine's scroll-linked fill. Elements
get one restrained reveal and nothing else.

**The rail owns the right gutter.** `RAIL_PAD_R` reserves 192px at `lg` because
the fixed section rail occupies the last 166px of the viewport at its widest
label. Narrow it and right-aligned content runs underneath the active label.

## Three things that will bite if you forget them

**`overflow-x` must stay `clip`, never `hidden`.** Both stop sideways scrolling,
but `hidden` turns `html`/`body` into scroll containers, and every
`position: sticky` descendant then binds to that container instead of the
viewport and silently stops sticking. This already cost the timeline's year
counter once.

**Reduced motion has to be handled in JavaScript, not CSS.** The stylesheet's
`prefers-reduced-motion` block zeroes transition durations, which does nothing
to Framer Motion — it animates opacity by writing inline styles, so an element
sits at `opacity: 0` waiting for an intersection the CSS cannot influence. Use
`useReveal()` and `usePrefersReducedMotion()` from `lib/layout.ts` for anything
animated, or a reader who asked for no motion gets content that never appears.

## Project Wick (`/project-wick/`)

A one-pager for an hourly journaling agent, plus a journal page at
`/project-wick/journal/` rendering what the agent has actually written,
mirrored at build time from [`kevenex/project-wick`](https://github.com/kevenex/project-wick)
by `scripts/sync-wick-journal.mjs` (run by hand with `npm run sync:wick`).

The home page spread prints that journal's real figures — entries, words, last
run, source commit — via the `wick-summary` Vite plugin in `vite.config.ts`,
which reads `journal.json` at build time and emits only the handful of values
the spread shows. Importing the file directly would inline ~117KB to display
five numbers. A missing or malformed journal costs the spread its figures, not
the site its build.

**Known stale:** since 2026-08-10 the sync step has been failing with
`GET /repos/kevenex/project-wick → 404`, so every deploy has been building from
the committed snapshot. The step exits 0 by design — a failed sync must not fail
the deploy — so this shows as a green run with a warning in the log, and the
figures on the spread are the snapshot's, not today's. Fixing it means making
that repository reachable to the workflow (it is not public to the default
`GITHUB_TOKEN`), not changing anything here.

## Flyer Fable (`/flyer-fable/`)

A stylized first-person flight over a low-poly South Korea. Vendored from
[kevenex/korea-flyer](https://github.com/kevenex/korea-flyer) at commit
`a53bfec`, with local additions each marked with a `SITE:` comment so they
survive a re-copy from upstream. Self-contained static page in `public/`,
outside React and the SPA.

The figures on its spread come from that page's own source: `KM = 10` sets true
horizontal scale, Jeju sits 451 km from the Seoul origin, and Hallasan's 1,947 m
renders as 97 units — five times true scale.

## Contact

The form is complete; delivery is not. `submitContact` in `src/lib/contact.ts`
reports whether a message was delivered and today always answers no, so the UI
cannot claim otherwise — the confirmation says the message has not been
delivered anywhere rather than thanking the sender for something that did not
happen.

When wiring it up: the site is served by the Cloudflare Worker configured in
`wrangler.jsonc`, so a `POST /api/contact` handler can hold the credential as a
`wrangler secret`. **No credential can live in the bundle** — `dist/` is public.
And submissions must not land in this repository, which is public; prefer issues
in a private repo, which also gets you email notification for free.

## Before the Coming Soon gate comes off

`/` is a password gate (`ComingSoon.tsx`); the site itself is at `/app/`, which
redirects back if `localStorage` has no access token. Deferred by decision, not
forgotten:

1. **Wire the contact form, or stop it claiming to send.** See above.
2. **Resolve the Project Wick sync** (see Known stale above), so the spread's
   figures are current rather than a snapshot.
3. Re-check contrast and focus states if imagery is ever added to the spreads.

## Notes

- Every full-height section uses `h-screen-dvh` so mobile browser chrome does
  not clip the layout.
- Deployment is handled by `.github/workflows/deploy.yml`, which builds the site
  and publishes `dist/` to GitHub Pages. It runs on pushes to `master`, once a
  day on a schedule (to pick up the Project Wick journal and the Chloe build),
  and can be started by hand from the Actions tab.
- The custom domain lives in the repository's Pages settings. Because the site
  is published from a workflow rather than a branch, no `CNAME` file is needed.
