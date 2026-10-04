import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, CreditCard, Database } from 'lucide-react';
import { BEFORE_SUMMARY, FEATURED, ROLES, type Closer } from '../content/resume';
import {
  EASE,
  RAIL,
  RAIL_PAD,
  RAIL_PAD_R,
  RISE,
  usePrefersReducedMotion,
  useReveal,
} from '../lib/layout';
import CompanyMark from './CompanyMark';

/*
 * Newest first. A recruiter reads down from the present, so the current role
 * opens the section in a framed card and everything before it follows as a
 * timeline on the spine — each role a headline, what happened, and what it
 * taught, rather than a list of duties.
 *
 * Every role, framed or not, splits the same way at xl: a narrow column of
 * facts (who, when, what kind of company) under a short heavy rule, and a
 * wide column for the story. Below xl the facts stack above the story; the
 * narrow column cannot hold a logo and a long company name side by side any
 * earlier than that.
 */

const ICONS: Record<Closer['icon'], typeof Database> = {
  data: Database,
  payments: CreditCard,
  compass: Compass,
};

/*
 * The distance from the content column's left edge back out to the rail, at
 * each breakpoint — RAIL_PAD minus RAIL. Kept as one expression so a change
 * to either constant is a change in one place, and the nodes cannot drift
 * off the spine.
 */
const NODE_REACH = '-ml-10 md:-ml-16 lg:-ml-20';

/** The years the counter can show, in reading order: the present first. */
const STARTS = [FEATURED.start, ...ROLES.map((role) => role.start)];

/** The facts column and the story column, at the width that can hold both. */
const SPLIT = 'grid gap-y-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] xl:gap-x-16';

/**
 * A zero-width hook that hangs a node on the spine from inside the content
 * column. Offset in `em` by default so it stays on the first line whatever
 * size that line is set at; `at` overrides it where the first line is a
 * fixed-height row, like a company mark beside its name.
 */
function Node({
  state,
  at = 'top-[0.72em]',
}: {
  state: 'now' | 'passed' | 'ahead';
  at?: string;
}) {
  const still = usePrefersReducedMotion();

  return (
    <span aria-hidden="true" className={`relative inline-block w-0 shrink-0 ${NODE_REACH}`}>
      <span
        className={`absolute left-0 ${at} h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 transition-colors duration-500 ${
          state === 'now'
            ? 'bg-amber-dot ring-amber'
            : state === 'passed'
              ? 'bg-oxide ring-oxide'
              : 'bg-paper ring-ink/30'
        }`}
      >
        {state === 'now' && !still && (
          <motion.span
            className="absolute inset-0 rounded-full bg-amber-dot"
            animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </span>
    </span>
  );
}

/**
 * What the work started from and what it turned into, as two chips. The
 * arrow is drawn for the eye; a screen reader hears "to" in its place. The
 * arrow travels with the second chip, so on a narrow screen the wrapped line
 * starts "→ …" instead of the first line ending on a dangling arrow.
 */
function Flow({ steps: [from, to] }: { steps: [string, string] }) {
  const chip = 'border border-oxide/35 bg-oxide/[0.07] px-3 py-1.5 text-oxide sm:px-4 sm:py-2';

  return (
    <p className="mt-8 flex flex-wrap items-center gap-3 font-sans text-small">
      <span className={chip}>{from}</span>
      <span className="inline-flex items-center gap-3">
        <span aria-hidden="true" className="text-muted">
          →
        </span>
        <span className="sr-only">to</span>
        <span className={chip}>{to}</span>
      </span>
    </p>
  );
}

export default function Experience() {
  const reveal = useReveal();
  const still = usePrefersReducedMotion();
  const entries = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    /*
     * A zero-height band across the viewport's middle: an entry becomes the
     * active one as it crosses the centre line, which is the same threshold
     * the nodes fill on. One observer for the whole section.
     */
    const observer = new IntersectionObserver(
      (records) => {
        records.forEach((record) => {
          if (!record.isIntersecting) return;
          const index = entries.current.indexOf(record.target as HTMLElement);
          if (index !== -1) setActive(index);
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    entries.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  // Before the first entry reaches the centre the counter still needs a real
  // year, so it holds at the present rather than reading blank.
  const year = STARTS[Math.max(active, 0)];

  const rise = {
    initial: still ? false : { opacity: 0, y: RISE },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: still ? 0 : 0.7, ease: EASE },
  } as const;

  return (
    <section id="experience" className="w-full py-32 sm:py-40">
      <div className={`${RAIL_PAD} ${RAIL_PAD_R}`}>
        <motion.p className="font-mono text-label uppercase text-muted" {...reveal}>
          Experience
        </motion.p>

        <motion.h2
          className="mt-8 font-serif text-section"
          {...reveal}
          transition={{ ...reveal.transition, delay: 0.05 }}
        >
          Some of the work.
        </motion.h2>

        <motion.p
          className="mt-8 max-w-measure font-sans text-lead text-muted"
          {...reveal}
          transition={{ ...reveal.transition, delay: 0.1 }}
        >
          I&rsquo;ve worked at six companies, mostly in fintech and banking, with a year in
          retail. The products have been very different. My part in them has mostly been the
          same, which is working out what the problem is and getting it shipped.
        </motion.p>

        {/*
         * The index: every company and what the work there was, readable in
         * one glance before any of the detail. Mono for the company, the
         * working voice for the phrase.
         */}
        <motion.dl
          className="mt-14 grid gap-x-12 border-t border-ink/15 sm:grid-cols-2"
          {...reveal}
          transition={{ ...reveal.transition, delay: 0.15 }}
        >
          {[FEATURED, ...ROLES].map((role) => (
            <div key={role.company} className="border-b border-ink/10 py-4">
              <dt className="font-mono text-data uppercase tracking-[0.1em] text-ink">
                {role.company}
              </dt>
              <dd className="mt-1 font-sans text-small text-muted">{role.gist}</dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/*
       * Rows span the full page width rather than sitting in a padded column,
       * so that `absolute left-…` inside one resolves against the page and
       * lands on the rail. Their text is inset with the same RAIL_PAD every
       * other movement uses, so the grid never resets.
       */}
      <div className="relative mt-24">
        {/*
         * The counter rides the rail and snaps to each entry's start year
         * rather than interpolating — a real year at every moment. A
         * zero-height sticky box with the figure absolute inside it, because
         * sticky and absolute cannot be the same element. lg only: below that
         * the gutter cannot hold four digits, and each entry prints its own.
         */}
        <div className="sticky top-[45vh] z-10 hidden h-0 lg:block">
          <span
            className={`absolute ml-4 tabular font-mono text-[28px] leading-none text-oxide ${RAIL}`}
          >
            {year}
          </span>
        </div>

        {/* The present. */}
        <article
          ref={(node) => {
            entries.current[0] = node;
          }}
          className={`${RAIL_PAD} ${RAIL_PAD_R}`}
        >
          <motion.div {...rise}>
            {/*
             * Each node sits in a zero-height box set in its line's type, ahead
             * of that line rather than inside it: the node's pull toward the
             * rail then moves the node alone and never drags the text with it.
             */}
            <div className="h-0 font-mono text-data">
              <Node state="now" />
            </div>
            <p className="font-mono text-data uppercase">
              <span className="inline-flex items-center gap-2">
                <span className="tabular text-muted">{FEATURED.span}</span>
                <span aria-hidden="true" className="h-[6px] w-[6px] shrink-0 rounded-full bg-amber-dot" />
                <span className="text-amber">Present</span>
              </span>
            </p>

            {/*
             * Framed, not filled: a hairline border on the same paper, so the
             * card reads as a page set apart rather than a panel stacked on
             * top. No rounding, no shadow — the system has neither.
             */}
            <div className={`mt-6 border border-ink/15 p-6 sm:p-10 lg:p-12 ${SPLIT}`}>
              <div className="max-w-xs border-t-2 border-ink pt-6">
                <div className="flex items-center gap-3">
                  <CompanyMark mark={FEATURED} />
                  <p className="font-sans text-[24px] leading-snug text-ink">{FEATURED.company}</p>
                </div>
                <p className="mt-3 font-sans text-body text-ink/80">{FEATURED.title}</p>

                <dl className="mt-4 flex flex-col gap-1 font-sans text-small text-muted">
                  <div className="flex gap-2">
                    <dt className="sr-only">Domain</dt>
                    <dd>{FEATURED.domain}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt>Worked with</dt>
                    <dd className="text-ink/80">{FEATURED.team}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="sr-only">Location</dt>
                    <dd>{FEATURED.city}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="max-w-[22ch] font-serif text-section">{FEATURED.headline}</h3>

                <p className="mt-6 max-w-measure font-sans text-body text-muted">{FEATURED.body}</p>

                <div className="mt-10 border-l border-oxide/50 pl-5">
                  <p className="font-mono text-label uppercase text-muted">{FEATURED.scale.label}</p>
                  <p className="mt-2 font-serif text-[32px] leading-tight text-ink">
                    {FEATURED.scale.value}
                  </p>
                  <p className="font-sans text-body text-oxide">{FEATURED.scale.note}</p>
                </div>

                <p className="mt-12 font-mono text-label uppercase text-muted">A closer look</p>

                <ul className="mt-6 flex flex-col gap-6">
                  {FEATURED.closer.map(({ icon, text }) => {
                    const Icon = ICONS[icon];
                    return (
                      <li key={text} className="flex max-w-measure gap-4 font-sans text-body text-ink">
                        <Icon aria-hidden="true" strokeWidth={1.5} className="mt-1 h-5 w-5 shrink-0 text-oxide" />
                        <span>{text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </motion.div>
        </article>

        <div className={`mt-24 ${RAIL_PAD} ${RAIL_PAD_R}`}>
          <motion.div
            className="grid gap-x-16 gap-y-4 border-b border-ink/15 pb-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
            {...reveal}
          >
            <h3 className="font-serif text-section">Before {FEATURED.company}</h3>
            <p className="max-w-measure font-sans text-body text-muted xl:justify-self-end xl:pt-3">
              {BEFORE_SUMMARY}
            </p>
          </motion.div>
        </div>

        <ol>
          {ROLES.map((role, index) => {
            const position = index + 1;

            return (
              <li
                key={role.company}
                ref={(node) => {
                  entries.current[position] = node;
                }}
              >
                <motion.div className={`py-14 ${RAIL_PAD} ${RAIL_PAD_R} ${SPLIT}`} {...rise}>
                  {/*
                   * The facts. The node hangs on the mark's row rather than a
                   * text line, so it is placed at half the mark's height —
                   * from a flex box, so the hook sits at the row's top edge
                   * instead of on an inline baseline somewhere below it.
                   */}
                  <div className="max-w-xs border-t-2 border-ink pt-6">
                    <div className="flex h-0">
                      <Node state={position <= active ? 'passed' : 'ahead'} at="top-5" />
                    </div>
                    <div className="flex items-center gap-3">
                      <CompanyMark mark={role} />
                      <p className="font-sans text-[21px] leading-snug text-ink">{role.company}</p>
                    </div>
                    <p className="mt-3 font-sans text-body text-ink/80">{role.title}</p>
                    <p className="tabular mt-4 font-mono text-data uppercase text-muted">{role.span}</p>
                    <p className="mt-2 font-sans text-[18px] leading-snug text-muted">{role.domain}</p>
                    <p className="mt-1 font-sans text-small text-muted">{role.city}</p>
                  </div>

                  {/* The story. */}
                  <div>
                    <h4 className="max-w-[24ch] font-sans text-[30px] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-[38px]">
                      {role.headline}
                    </h4>

                    <Flow steps={role.flow} />

                    <p className="mt-8 max-w-measure font-sans text-body text-muted">{role.body}</p>

                    <p className="mt-4 max-w-measure font-sans text-body text-ink">
                      <span className="text-oxide">What I took from it:</span> {role.takeaway}
                    </p>
                  </div>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
