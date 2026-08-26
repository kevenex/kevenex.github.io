# KevinK

Personal site for **Kevin Kim**. Paper ground, three typographic voices, and one
continuous scroll. The home page is a single page; projects live as their own
static pages under `public/`.

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
  index.css                Fonts, Tailwind, reset, Lenis classes
  lib/
    layout.ts              Rail geometry, the shared reveal, reduced-motion hooks
    lenis.tsx              The single Lenis instance
    lenis-context.ts       Context + useScrollTo
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
    ComingSoon.tsx         The password gate at /
    KevinKLogo.tsx         4-fold symmetric SVG mark
    WickMark.tsx           Project Wick's mark
```

## Design system

**Three voices, each with a job.** Instrument Serif is the human (headlines,
ideas). Instrument Sans is the working voice (body, UI). Space Mono is the
machine's — timestamps, commit hashes, coordinates, counts, years. Anything a
machine produced is mono; anything a person wrote is not.

**Colour** lives in `tailwind.config.js`, with the measured contrast ratio
recorded beside each token. Every pairing used on the page clears its threshold;
`amber` is darkened from Project Wick's brighter tone specifically so it holds
4.5:1 as text, and `oxide-lift` exists because the base accent manages only
2.4:1 against the dark colophon.

**The spine** (`Spine.tsx`) is the continuity device: one rule running the
length of the document's middle, which in `Practice.tsx` grows nodes and becomes
the career timeline. Both use the `RAIL` constant in `lib/layout.ts`, so they
share one axis rather than resembling each other. Change `RAIL` or `RAIL_PAD`
and both follow.

**Motion:** the page moves like weight; the elements do not perform. All the
liquidity is in the scroll (Lenis) and the spine's scroll-linked fill. Elements
get one restrained reveal and nothing else.

## Two things that will bite if you forget them

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
cannot claim otherwise. A notice above the form says so before anyone spends
time writing.

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
2. **Fill the two plate slots** in the project spreads with captures of the
   running work — the Flyer terrain, the Wick journal. The spreads are designed
   to read as finished without them, which is why this is not urgent.
3. Re-check contrast and focus states once real imagery is in.

## Notes

- Every full-height section uses `h-screen-dvh` so mobile browser chrome does
  not clip the layout.
- Deployment is handled by `.github/workflows/deploy.yml`, which builds the site
  and publishes `dist/` to GitHub Pages. It runs on pushes to `master`, once a
  day on a schedule (to pick up the Project Wick journal and the Chloe build),
  and can be started by hand from the Actions tab.
- The custom domain lives in the repository's Pages settings. Because the site
  is published from a workflow rather than a branch, no `CNAME` file is needed.
