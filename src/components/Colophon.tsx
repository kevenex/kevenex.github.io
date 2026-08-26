import { type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import KevinKLogo from './KevinKLogo';
import { RAIL_PAD, RAIL_PAD_R, reveal } from '../lib/layout';
import { useScrollTo } from '../lib/lenis-context';

/*
 * The page's one dark band, and the only place it departs from paper
 * throughout — a stark close is the device David Whyte's site uses, and the
 * page earns its ending by changing ground exactly once.
 *
 * Everything here takes its colours from the same tokens as the rest of the
 * page, but the accent lifts: #8C3A2E manages only 2.4:1 on ink, so hover and
 * focus use `oxide-lift` instead. Body text stays paper-coloured and never
 * becomes the accent, which would drop it below the ratio it needs as text.
 */
export default function Colophon() {
  const scrollTo = useScrollTo();

  const toTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollTo('#arrival');
  };

  return (
    <footer id="colophon" className={`w-full bg-ink py-24 text-paper sm:py-32 ${RAIL_PAD} ${RAIL_PAD_R}`}>
      <motion.div {...reveal}>
        <div className="flex items-center gap-3">
          <KevinKLogo className="text-paper/70" width={20} height={20} />
          <span className="font-mono text-label uppercase text-paper/70">Kevin Kim</span>
        </div>

        <div className="mt-14 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
          <p className="max-w-measure font-sans text-body text-paper/60">
            Set in Instrument Serif and Instrument Sans, with Space Mono carrying anything
            a machine wrote — timestamps, counts, coordinates. Built with Claude Code and
            deployed from a GitHub Action.
          </p>

          <dl className="flex flex-col gap-3 font-mono text-data text-paper/50">
            <div className="flex justify-between gap-6">
              <dt className="uppercase tracking-[0.1em]">Projects</dt>
              <dd className="text-right">
                <a
                  href="/project-wick/"
                  className="text-paper/80 underline decoration-paper/25 underline-offset-4 transition-colors hover:text-oxide-lift hover:decoration-oxide-lift focus-visible:text-oxide-lift focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-oxide-lift focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  Wick
                </a>
                <span aria-hidden="true" className="px-2 text-paper/30">
                  /
                </span>
                <a
                  href="/flyer-fable/"
                  className="text-paper/80 underline decoration-paper/25 underline-offset-4 transition-colors hover:text-oxide-lift hover:decoration-oxide-lift focus-visible:text-oxide-lift focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-oxide-lift focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
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
                  className="text-paper/80 underline decoration-paper/25 underline-offset-4 transition-colors hover:text-oxide-lift hover:decoration-oxide-lift focus-visible:text-oxide-lift focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-oxide-lift focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  Back to the start
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <p className="mt-20 font-mono text-data text-paper/35">© 2026 Kevin Kim</p>
      </motion.div>
    </footer>
  );
}
