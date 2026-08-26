import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EASE, RAIL, RAIL_PAD, RAIL_PAD_R, RISE, reveal } from '../lib/layout';

interface Role {
  /** The year the counter snaps to while this entry is the one being read. */
  start: string;
  span: string;
  role: string;
  company: string;
  notes?: string[];
}

/*
 * Ascending — 2018 first, now last. A career reads forward, and an ascending
 * list lets the page do something a descending one cannot: accumulate. Early
 * entries are compact, each later one takes more room, and the present role
 * is the only one set in serif.
 */
const TIMELINE: Role[] = [
  {
    start: '2018',
    span: '2018 — 2019',
    role: 'Business Analyst',
    company: 'Intrepid Ventures',
    notes: ['Internship'],
  },
  {
    start: '2019',
    span: '2019',
    role: 'Product Manager',
    company: 'IBM',
    notes: ['Internship'],
  },
  {
    start: '2020',
    span: '2020 — 2021',
    role: 'Category Business Analyst',
    company: 'Canadian Tire',
  },
  {
    start: '2021',
    span: '2021 — 2023',
    role: 'Senior Product Manager',
    company: 'Brim Financial',
    notes: ['Series B'],
  },
  {
    start: '2023',
    span: '2023 — 2024',
    role: 'Product Manager',
    company: 'ATB Financial',
  },
  {
    start: '2024',
    span: '2024 — Present',
    role: 'Product Manager',
    company: 'Plusgrade',
    notes: ['Data migration', 'M&A'],
  },
];

/* Room and weight grow down the list — the reader feels the career gather. */
const TIER = [
  { pad: 'py-6', type: 'font-sans text-body text-muted' },
  { pad: 'py-7', type: 'font-sans text-body text-muted' },
  { pad: 'py-8', type: 'font-sans text-[19px] leading-snug text-ink' },
  { pad: 'py-10', type: 'font-sans text-[21px] leading-snug text-ink' },
  { pad: 'py-12', type: 'font-sans text-[24px] leading-snug text-ink' },
  { pad: 'py-14', type: 'font-serif text-section text-ink' },
];

/*
 * The distance from the content column's left edge back out to the rail, at
 * each breakpoint — RAIL_PAD minus RAIL. Kept as one expression so a change
 * to either constant is a change in one place, and the nodes cannot drift
 * off the spine.
 */
const NODE_REACH = '-ml-10 md:-ml-16 lg:-ml-20';

/* No percentages. A self-assessed "95%" encodes nothing a peer can use. */
const PRACTICE_AREAS = [
  'Product strategy',
  'Roadmap planning',
  'Discovery & user research',
  'Data migration',
  'Agile delivery',
  'Stakeholder management',
];

export default function Practice() {
  const entries = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    /*
     * A zero-height band across the viewport's middle: an entry becomes the
     * active one as it crosses the centre line, which is the same threshold
     * the nodes fill on. One observer for the list rather than one per row.
     */
    const observer = new IntersectionObserver(
      (records) => {
        records.forEach((record) => {
          if (!record.isIntersecting) return;
          const index = entries.current.indexOf(record.target as HTMLLIElement);
          if (index !== -1) setActive(index);
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    entries.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  // Before the first entry reaches the centre the counter still needs a real
  // year to show, so it holds at the earliest rather than reading blank.
  const year = TIMELINE[Math.max(active, 0)].start;

  return (
    <section id="practice" className="w-full py-32 sm:py-40">
      <div className={`${RAIL_PAD} ${RAIL_PAD_R}`}>
        <motion.p className="font-mono text-label uppercase text-muted" {...reveal}>
          Practice
        </motion.p>

        <motion.h2
          className="mt-8 max-w-[24ch] font-serif text-section"
          {...reveal}
          transition={{ ...reveal.transition, delay: 0.05 }}
        >
          Six years of shipping product, mostly in financial services.
        </motion.h2>
      </div>

      {/*
       * Rows span the full page width rather than sitting in a padded
       * column, so that `absolute left-…` inside one resolves against the
       * page and lands on the rail. Their text is inset with the same
       * RAIL_PAD every other movement uses, so the grid never resets.
       */}
      <div className="relative mt-20">
        {/*
         * The counter is the one element on the page that changes
         * continuously with scroll, and it rides the rail itself. It snaps
         * to each entry's start year rather than interpolating — a real year
         * at every moment, never 2021.4.
         *
         * A zero-height sticky box in normal flow, with the figure absolute
         * inside it: sticky and absolute cannot be the same element, but
         * absolute *within* a sticky parent sticks perfectly well.
         *
         * lg only — below that the gutter is too narrow to hold four digits,
         * and each row carries its own year anyway.
         */}
        <div className="sticky top-[45vh] z-10 hidden h-0 lg:block">
          <span
            className={`absolute ml-4 tabular font-mono text-[28px] leading-none text-oxide ${RAIL}`}
          >
            {year}
          </span>
        </div>

        <ol>
          {TIMELINE.map((entry, index) => {
            const tier = TIER[index] ?? TIER[TIER.length - 1];
            const isNow = index === TIMELINE.length - 1;
            const passed = index <= active;

            return (
              <li
                key={entry.company}
                ref={(node) => {
                  entries.current[index] = node;
                }}
                className="relative border-t border-ink/10 first:border-t-0"
              >
                <div className={`${RAIL_PAD} ${RAIL_PAD_R} ${tier.pad} ${tier.type}`}>
                  <motion.div
                    initial={{ opacity: 0, y: RISE }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    {/*
                     * The node reaches back out of the content column to the
                     * rail — the spine's own axis, so the line the reader has
                     * followed since the top of the page is the line these
                     * hang off. Zero-width so it costs the text no space, and
                     * offset in `em` so it stays on the first line whatever
                     * size that line is at this tier.
                     */}
                    <span
                      aria-hidden="true"
                      className={`relative inline-block w-0 shrink-0 ${NODE_REACH}`}
                    >
                      <span
                        className={`absolute left-0 top-[0.72em] h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 transition-colors duration-500 ${
                          isNow
                            ? 'bg-amber-dot ring-amber'
                            : passed
                              ? 'bg-oxide ring-oxide'
                              : 'bg-paper ring-ink/30'
                        }`}
                      >
                        {isNow && (
                          <motion.span
                            className="absolute inset-0 rounded-full bg-amber-dot"
                            animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                          />
                        )}
                      </span>
                    </span>

                    <p>
                      {entry.role}
                      <span className="text-muted"> — {entry.company}</span>
                    </p>

                    <motion.div
                      className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.7, ease: EASE, delay: 0.06 }}
                    >
                      <span className="tabular font-mono text-data uppercase text-muted">
                        {entry.span}
                      </span>

                      {entry.notes?.map((note) => (
                        <span
                          key={note}
                          className="border border-ink/15 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted"
                        >
                          {note}
                        </span>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <motion.div
        className={`mt-24 border-t border-ink/15 pt-8 ${RAIL_PAD} ${RAIL_PAD_R}`}
        {...reveal}
      >
        <p className="font-mono text-label uppercase text-muted">Practice areas</p>

        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 font-mono text-data text-ink">
          {PRACTICE_AREAS.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
