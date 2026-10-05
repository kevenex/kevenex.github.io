import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { IDENTITY, LINKEDIN } from '../content/resume';
import { EASE, RAIL_PAD, RAIL_PAD_R, usePrefersReducedMotion } from '../lib/layout';
import { useMagnetic } from '../lib/pointer';
import CanadaFlag from './CanadaFlag';
import Memoji from './Memoji';

/*
 * Text is the visual. No video, no watermark — the page opens on who this is,
 * what he does and where to find him, so a reader who stops after one screen
 * has still read the résumé's first line.
 *
 * Two kinds of motion meet here, and only here. The load sequence is
 * deliberately short, because the reader came to read rather than to wait.
 * Everything after it is bound to the scroll: the introduction drifts and
 * fades on the way out. There is no scroll cue — the rail already says the
 * page goes on, and the first screen is better spent on the résumé.
 */

/** How far the headline lags the page on its way out, in pixels. */
const DRIFT = 120;

export default function Arrival() {
  const still = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const link = useMagnetic<HTMLAnchorElement>();

  /*
   * `['start start', 'end start']` — 0 while the hero fills the viewport, 1
   * exactly as its last pixel leaves the top — the hero's own exit, which is
   * what the drift and fade are timed against.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const drift = useTransform(scrollYProgress, [0, 1], [0, DRIFT]);

  // Gone by 70%, so the introduction never survives long enough to collide
  // with the section arriving underneath it.
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="arrival"
      className={`flex min-h-screen-dvh w-full flex-col gap-16 pb-10 pt-6 lg:pt-10 ${RAIL_PAD} ${RAIL_PAD_R}`}
    >
      <motion.p
        className="font-mono text-label uppercase text-muted"
        initial={still ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: still ? 0 : 0.8, ease: EASE }}
      >
        {/*
         * One line from sm. On a phone it would wrap mid-phrase and leave a
         * separator hanging at a line end, so it stacks instead: name, title,
         * place. The first line is short, which keeps it clear of the theme
         * toggle sitting at the right of the same row.
         */}
        {IDENTITY.name}
        <span className="hidden text-muted/60 sm:inline"> · </span>
        <br className="sm:hidden" />
        {IDENTITY.title}
        <span className="hidden text-muted/60 sm:inline"> · </span>
        <br className="sm:hidden" />
        <span className="whitespace-nowrap">
          {IDENTITY.location}
          <CanadaFlag className="ml-2 h-[0.8em] w-auto align-[-0.05em]" />
        </span>
      </motion.p>

      <motion.div
        initial={still ? false : { opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: still ? 0 : 1.1, ease: EASE, delay: still ? 0 : 0.15 }}
        /*
         * Bound only when the reader allows motion. Under reduced motion the
         * introduction is left entirely alone rather than pinned by a
         * transform that happens to evaluate to zero.
         */
        style={still ? undefined : { y: drift, opacity: fade }}
        className="my-auto grid items-center gap-y-8 xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-x-16"
      >
        {/*
         * First in the source so that, stacked, it sits above the greeting;
         * from xl it moves to the second column, beside the text. It rides
         * the same drift and fade, so the hero leaves as one piece.
         */}
        <Memoji className="w-24 sm:w-28 xl:order-last xl:w-[280px]" />

        <div>
          <h1 className="font-serif text-hero">{IDENTITY.greeting}</h1>

          <div className="mt-10 flex max-w-measure flex-col gap-5 font-sans text-lead">
            <p className="text-ink">{IDENTITY.lead}</p>
            <p className="text-muted">{IDENTITY.how}</p>
          </div>

          {/*
           * The one way in a recruiter actually uses. Same drawing rule as the
           * project links, so the page has a single link language.
           */}
          <a
            ref={link}
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer"
            data-cursor-label="LinkedIn ↗"
            className="group mt-12 inline-flex flex-col gap-2 font-mono text-label uppercase text-ink outline-none"
          >
            <span className="transition-colors group-hover:text-oxide group-focus-visible:text-oxide">
              Find me on LinkedIn &#8599;
            </span>
            <span
              aria-hidden="true"
              className="h-px w-full origin-left scale-x-0 bg-oxide transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
            />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
