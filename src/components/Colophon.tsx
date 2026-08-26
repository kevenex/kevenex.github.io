import { type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import KevinKLogo from './KevinKLogo';
import { RAIL_PAD, RAIL_PAD_R, useReveal } from '../lib/layout';
import { useScrollTo } from '../lib/lenis-context';

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
export default function Colophon() {
  const reveal = useReveal();

  const scrollTo = useScrollTo();

  const toTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollTo('#arrival');
  };

  return (
    <footer id="colophon" className={`w-full bg-band py-24 text-band-text sm:py-32 ${RAIL_PAD} ${RAIL_PAD_R}`}>
      <motion.div {...reveal}>
        <div className="flex items-center gap-3">
          <KevinKLogo className="text-band-text/70" width={20} height={20} />
          <span className="font-mono text-label uppercase text-band-text/70">Kevin Kim</span>
        </div>

        <div className="mt-14 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
          <p className="max-w-measure font-sans text-body text-band-text/60">
            Built with Claude.
          </p>

          <dl className="flex flex-col gap-3 font-mono text-data text-band-text/50">
            <div className="flex justify-between gap-6">
              <dt className="uppercase tracking-[0.1em]">Projects</dt>
              <dd className="text-right">
                <a
                  href="/project-wick/"
                  className="text-band-text/80 underline decoration-band-text/25 underline-offset-4 transition-colors hover:text-oxide-lift hover:decoration-oxide-lift focus-visible:text-oxide-lift focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-oxide-lift focus-visible:ring-offset-2 focus-visible:ring-offset-band"
                >
                  Wick
                </a>
                <span aria-hidden="true" className="px-2 text-band-text/30">
                  /
                </span>
                <a
                  href="/flyer-fable/"
                  className="text-band-text/80 underline decoration-band-text/25 underline-offset-4 transition-colors hover:text-oxide-lift hover:decoration-oxide-lift focus-visible:text-oxide-lift focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-oxide-lift focus-visible:ring-offset-2 focus-visible:ring-offset-band"
                >
                  Flyer Fable
                </a>
              </dd>
            </div>

            <div className="flex justify-between gap-6">
              <dt className="uppercase tracking-[0.1em]">Top</dt>
              <dd className="text-right">
                <a
                  href="#arrival"
                  onClick={toTop}
                  className="text-band-text/80 underline decoration-band-text/25 underline-offset-4 transition-colors hover:text-oxide-lift hover:decoration-oxide-lift focus-visible:text-oxide-lift focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-oxide-lift focus-visible:ring-offset-2 focus-visible:ring-offset-band"
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
