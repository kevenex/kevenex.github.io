import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RAIL } from '../lib/layout';

/*
 * One rule, running the full length of the document's middle. Every movement
 * hangs off it, and in Practice it grows nodes and becomes the career
 * timeline — the same element throughout, not a motif repeated per section.
 *
 * That is what makes the page provably one canvas: nothing reads as a section
 * boundary when a single unbroken element crosses all of them.
 *
 * The fill is bound directly to scroll progress rather than sprung, because
 * it is a progress indicator. A spring would let it drift behind the
 * scrollbar and it would stop reading as position and start reading as
 * decoration.
 */
export default function Spine({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  /*
   * `['start end', 'end end']` — the fill begins when the spine first enters
   * from the bottom of the viewport and completes exactly as its end reaches
   * the bottom.
   *
   * Not the more usual `['start start', 'end end']`: that range inverts
   * whenever the target is shorter than the viewport (its start-meets-top
   * happens *after* its end-meets-bottom), which pins progress at 0. This
   * offset keeps a positive range at every container height, so the rail
   * cannot silently stop tracking if the page gets shorter.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  });

  const head = useTransform(scrollYProgress, (value) => `${value * 100}%`);

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 w-px bg-ink/15 ${RAIL}`}
      >
        <motion.div
          className="h-full w-full origin-top bg-oxide/70"
          style={{ scaleY: scrollYProgress }}
        />

        {/*
         * A short brightening at the fill's leading edge, so the reader can
         * see where the page has got to without having to find the boundary
         * between two close tones.
         *
         * A gradient rather than a dot, deliberately. The spine runs through
         * Practice's timeline on exactly the same axis as its 9px nodes, and
         * a dot travelling down that axis would read as a sixth node
         * colliding with the five real ones. `-translate-y-full` hangs it
         * back into the filled length so the tip is the bright end.
         */}
        <motion.div
          className="absolute inset-x-0 h-12 -translate-y-full bg-gradient-to-b from-transparent to-oxide"
          style={{ top: head }}
        />
      </div>

      {children}
    </div>
  );
}
