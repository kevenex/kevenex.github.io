import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { RAIL_PAD, RAIL_PAD_R, useReveal } from '../lib/layout';

export interface SpreadDatum {
  label: string;
  value: string;
}

interface SpreadProps {
  id: string;
  title: string;
  thesis: string;
  data: SpreadDatum[];
  href: string;
  linkLabel: string;
  /** The plate: whatever this project can show as evidence of itself. */
  children: ReactNode;
  /** Project Wick's spread takes the page's one tonal shift. */
  ground?: 'paper' | 'deep';
  /** A project with its own mark shows it; one without simply does not. */
  mark?: ReactNode;
}

/*
 * The tonal shift has to arrive without an edge, or it stops being one
 * material catching different light and becomes two stacked panels — which
 * is exactly the seam this page is built to avoid.
 *
 * Explicit stops rather than a plain `to-b` gradient: the deep tone holds
 * flat across the middle 64% and only softens over the outer 18% at each
 * end, so the section still reads as a solid ground rather than as a wash.
 */
const DEEP_GROUND =
  'linear-gradient(to bottom, #E5E1D8 0%, #D6CFC2 18%, #D6CFC2 82%, #E5E1D8 100%)';

/*
 * Both projects get a full movement and the same structure, so they read as a
 * matched pair rather than as two designs.
 *
 * Deliberately not cards: a card grid is a scanning device, and the whole
 * point of this page is to slow the reader down. Two projects with room to
 * breathe beat four tiles.
 */
export default function Spread({
  id,
  title,
  thesis,
  data,
  href,
  linkLabel,
  children,
  ground = 'paper',
  mark,
}: SpreadProps) {
  const reveal = useReveal();

  return (
    <section
      id={id}
      className={`w-full py-32 sm:py-40 ${RAIL_PAD} ${RAIL_PAD_R}`}
      style={ground === 'deep' ? { backgroundImage: DEEP_GROUND } : undefined}
    >
      <motion.div className="flex items-center gap-4" {...reveal}>
        {mark}
        <p className="font-mono text-label uppercase text-muted">Featured work</p>
      </motion.div>

      <motion.h2
        className="mt-8 font-serif text-spread"
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.05 }}
      >
        {title}
      </motion.h2>

      <div className="mt-12 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <motion.p
          className="max-w-measure font-sans text-lead text-muted"
          {...reveal}
          transition={{ ...reveal.transition, delay: 0.1 }}
        >
          {thesis}
        </motion.p>

        {/*
         * The data strip is the machine's voice: everything in it is a figure
         * something else produced, so all of it is mono and none of it is
         * decorative.
         */}
        <motion.dl
          className="flex flex-col gap-3 border-t border-ink/15 pt-5 font-mono text-data"
          {...reveal}
          transition={{ ...reveal.transition, delay: 0.15 }}
        >
          {data.map((datum) => (
            <div key={datum.label} className="flex justify-between gap-6">
              <dt className="shrink-0 uppercase tracking-[0.1em] text-muted">{datum.label}</dt>
              <dd className="tabular text-right text-ink">{datum.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <motion.div
        className="mt-16"
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.2 }}
      >
        {children}
      </motion.div>

      {/*
       * An editorial rule that draws, not a button. The underline grows from
       * the left on hover and focus alike, so keyboard users get the same
       * cue rather than a separate ring bolted on.
       */}
      <motion.div className="mt-14" {...reveal} transition={{ ...reveal.transition, delay: 0.25 }}>
        <a
          href={href}
          className="group inline-flex flex-col gap-2 font-mono text-label uppercase text-ink outline-none"
        >
          <span className="transition-colors group-hover:text-oxide group-focus-visible:text-oxide">
            {linkLabel} &rarr;
          </span>
          <span
            aria-hidden="true"
            className="h-px w-full origin-left scale-x-0 bg-oxide transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
          />
        </a>
      </motion.div>
    </section>
  );
}
