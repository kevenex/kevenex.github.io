import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { IDENTITY, LINKEDIN } from '../content/resume';
import { EASE, RAIL_PAD, RAIL_PAD_R, usePrefersReducedMotion } from '../lib/layout';
import { useMagnetic } from '../lib/pointer';

/*
 * Text is the visual. No video, no watermark — the page opens on who this is,
 * what he does and where to find him, so a reader who stops after one screen
 * has still read the résumé's first line.
 *
 * Two kinds of motion meet here, and only here. The load sequence is
 * deliberately short, because the reader came to read rather than to wait.
 * Everything after it is bound to the scroll: the headline drifts and fades
 * on the way out, and the scroll cue turns into an instrument reporting how
 * far through that exit the reader is.
 */

/** How far the headline lags the page on its way out, in pixels. */
const DRIFT = 120;

export default function Arrival() {
  const still = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const link = useMagnetic<HTMLAnchorElement>();

  /*
   * `['start start', 'end start']` — 0 while the hero fills the viewport, 1
   * exactly as its last pixel leaves the top. For a full-height first section
   * that is the first screen of scrolling and nothing beyond it, so the
   * readout below measures the hero's own exit rather than the document's
   * progress. The rail owns the document (see Rail.tsx); printing the same
   * number in two places would make both of them mean less.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const drift = useTransform(scrollYProgress, [0, 1], [0, DRIFT]);

  // Gone by 70%, so the introduction never survives long enough to collide
  // with the section arriving underneath it.
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  /*
   * Rendered by passing the MotionValue straight to `motion.span` as a child.
   * Framer Motion subscribes to it and writes the text node itself — reading
   * it into `useState` would re-render the hero on every frame of the scroll.
   */
  const readout = useTransform(scrollYProgress, (value) =>
    Math.round(value * 100)
      .toString()
      .padStart(3, '0')
  );

  return (
    <section
      ref={ref}
      id="arrival"
      className={`flex min-h-screen-dvh w-full flex-col justify-between gap-16 py-10 ${RAIL_PAD} ${RAIL_PAD_R}`}
    >
      <motion.p
        className="font-mono text-label uppercase text-muted"
        initial={still ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: still ? 0 : 0.8, ease: EASE }}
      >
        {IDENTITY.name} — {IDENTITY.title}
        <span className="text-muted/60"> · </span>
        {IDENTITY.location}
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
      >
        <h1 className="font-serif text-hero">{IDENTITY.greeting}</h1>

        <div className="mt-10 flex max-w-measure flex-col gap-5 font-sans text-lead">
          <p className="text-ink">{IDENTITY.lead}</p>
          <p className="text-oxide">{IDENTITY.accent}</p>
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
      </motion.div>

      <motion.p
        className="flex items-center gap-4 font-mono text-label uppercase text-muted"
        initial={still ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: still ? 0 : 0.8, ease: EASE, delay: still ? 0 : 0.6 }}
      >
        Scroll
        {/*
         * The instrument half is hidden from assistive tech outright. A figure
         * that changes on every frame of a scroll is nothing a screen reader
         * can usefully announce, and "Scroll" above already carries the whole
         * meaning for anyone not watching it move.
         */}
        {!still && (
          <>
            <span
              aria-hidden="true"
              className="relative h-px w-20 overflow-hidden bg-ink/20"
            >
              <motion.span
                className="absolute inset-0 origin-left bg-oxide"
                style={{ scaleX: scrollYProgress }}
              />
            </span>

            <motion.span aria-hidden="true" className="tabular text-oxide">
              {readout}
            </motion.span>
          </>
        )}
      </motion.p>
    </section>
  );
}
