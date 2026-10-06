import { type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import KevinKLogo from './KevinKLogo';
import { LINKEDIN } from '../content/resume';
import { RAIL_PAD, RAIL_PAD_R, useReveal } from '../lib/layout';
import { useScrollTo } from '../lib/lenis-context';
import { useMagnetic } from '../lib/pointer';

/*
 * The page's one dark band, and the only place it departs from paper
 * throughout — a stark close is the device David Whyte's site uses, and the
 * page earns its ending by changing ground exactly once.
 *
 * The band is its own colour role rather than a reuse of `ink`, because in
 * dark mode it goes darker than the page rather than inverting into a pale
 * slab. Hover and focus use `oxide-lift`: the base accent manages only 2.4:1
 * against the light theme's band. Body text stays band-coloured and never
 * becomes the accent, which would drop it below the ratio it needs as text.
 */
/*
 * `inline-block` is load-bearing rather than cosmetic: `transform` has no
 * effect on a non-replaced inline box, so the magnetic pull below would
 * silently do nothing on a default inline anchor.
 */
const LINK =
  'text-band-text/80 underline decoration-band-text/25 underline-offset-4 transition-colors hover:text-oxide-lift hover:decoration-oxide-lift focus-visible:text-oxide-lift focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-oxide-lift focus-visible:ring-offset-2 focus-visible:ring-offset-band inline-block';

/**
 * `top` is where "Back to the start" goes: the hero on the home page, the
 * header on a sub-page that has no hero of that name.
 */
export default function Colophon({ top = '#arrival' }: { top?: string }) {
  const reveal = useReveal();

  const scrollTo = useScrollTo();

  const linkedin = useMagnetic<HTMLAnchorElement>();
  const ai = useMagnetic<HTMLAnchorElement>();
  const wick = useMagnetic<HTMLAnchorElement>();
  const topLink = useMagnetic<HTMLAnchorElement>();

  const toTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollTo(top);
  };

  return (
    <footer
      id="colophon"
      data-cursor-tone="band"
      className={`w-full bg-band py-24 text-band-text sm:py-32 ${RAIL_PAD} ${RAIL_PAD_R}`}
    >
      <motion.div {...reveal}>
        <div className="flex items-center gap-3">
          <KevinKLogo className="text-band-text/70" width={20} height={20} />
          <span className="font-mono text-label uppercase text-band-text/70">Kevin Kim</span>
        </div>

        <div className="mt-14 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
          {/*
           * A native disclosure rather than a page of its own: it works with
           * no JavaScript, opens from the keyboard, and keeps the note at the
           * foot of the page it describes.
           */}
          <details className="group max-w-measure font-sans text-body text-band-text/60">
            <summary className="w-fit cursor-pointer list-none font-mono text-label uppercase text-band-text/70 outline-none transition-colors hover:text-oxide-lift focus-visible:text-oxide-lift focus-visible:ring-1 focus-visible:ring-oxide-lift focus-visible:ring-offset-2 focus-visible:ring-offset-band [&::-webkit-details-marker]:hidden">
              How I built this
              <span aria-hidden="true" className="ml-2 inline-block transition-transform group-open:rotate-45">
                +
              </span>
            </summary>

            <div className="mt-6 flex flex-col gap-4">
              <p>
                Built with Claude Code. React, TypeScript, Vite and Tailwind, with Framer Motion
                and Lenis for the scrolling.
              </p>
              <p>Fonts: Instrument Serif &amp; Sans, and Space Mono.</p>
            </div>
          </details>

          <dl className="flex flex-col gap-3 font-mono text-data text-band-text/50">
            <div className="flex justify-between gap-6">
              <dt className="uppercase tracking-[0.1em]">Elsewhere</dt>
              <dd className="text-right">
                <a
                  ref={linkedin}
                  href={LINKEDIN}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor-label="LinkedIn ↗"
                  className={LINK}
                >
                  LinkedIn
                </a>
              </dd>
            </div>

            <div className="flex justify-between gap-6">
              <dt className="uppercase tracking-[0.1em]">Projects</dt>
              <dd className="text-right">
                <a
                  ref={wick}
                  href="/project-wick/"
                  data-cursor-label="/project-wick/"
                  className={LINK}
                >
                  Wick
                </a>
              </dd>
            </div>

            <div className="flex justify-between gap-6">
              <dt className="uppercase tracking-[0.1em]">AI</dt>
              <dd className="text-right">
                <a
                  ref={ai}
                  href="/how-i-use-ai/"
                  data-cursor-label="/how-i-use-ai/"
                  className={LINK}
                >
                  How I use AI
                </a>
              </dd>
            </div>

            <div className="flex justify-between gap-6">
              <dt className="uppercase tracking-[0.1em]">Top</dt>
              <dd className="text-right">
                <a
                  ref={topLink}
                  href={top}
                  onClick={toTop}
                  data-cursor-label={top}
                  className={LINK}
                >
                  Back to the start
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <p className="mt-20 font-mono text-data text-band-text/35">© 2026 Kevin Kim</p>
      </motion.div>
    </footer>
  );
}
