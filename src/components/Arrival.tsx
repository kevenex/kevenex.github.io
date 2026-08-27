import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EASE, RAIL_PAD, RAIL_PAD_R, usePrefersReducedMotion } from '../lib/layout';

/*
 * Text is the visual. No video, no watermark — the page opens on a sentence
 * and the reader either wants the rest or does not.
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

  // Gone by 70%, so the headline never survives long enough to collide with
  // the thesis arriving underneath it.
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
      className={`flex h-screen-dvh w-full flex-col justify-between py-10 ${RAIL_PAD} ${RAIL_PAD_R}`}
    >
      <motion.p
        className="font-mono text-label uppercase text-muted"
        initial={still ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: still ? 0 : 0.8, ease: EASE }}
      >
        Kevin Kim — Product Manager
      </motion.p>

      <motion.h1
        className="max-w-[18ch] font-serif text-hero"
        initial={still ? false : { opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: still ? 0 : 1.1, ease: EASE, delay: still ? 0 : 0.15 }}
        /*
         * Bound only when the reader allows motion. Under reduced motion the
         * headline is left entirely alone rather than pinned by a transform
         * that happens to evaluate to zero.
         */
        style={still ? undefined : { y: drift, opacity: fade }}
      >
        I enjoy building things that spark my curiosity.
      </motion.h1>

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
