import { motion } from 'framer-motion';
import { FIT } from '../content/resume';
import { RAIL_PAD, RAIL_PAD_R, useReveal } from '../lib/layout';
import DrawnLink from './DrawnLink';

/*
 * Where I fit. Written to the reader rather than about the writer: each case
 * is the reader's own situation, so a hiring manager can check theirs against
 * it instead of translating a list of strengths into one.
 */
export default function Fit() {
  const reveal = useReveal();

  return (
    <section
      id="fit"
      className={`w-full bg-paper-lift py-32 sm:py-40 ${RAIL_PAD} ${RAIL_PAD_R}`}
    >
      <motion.p className="font-mono text-label uppercase text-muted" {...reveal}>
        Where I fit
      </motion.p>

      <motion.h2
        className="mt-8 max-w-[22ch] font-serif text-section"
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.05 }}
      >
        {FIT.open}
      </motion.h2>

      <motion.p
        className="mt-6 max-w-measure font-sans text-lead text-muted"
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.1 }}
      >
        {FIT.scope}
      </motion.p>

      <ul className="mt-16 grid gap-12 border-t border-ink/15 pt-12 md:grid-cols-2 md:gap-x-10">
        {FIT.cases.map((item, index) => (
          <motion.li
            key={item.title}
            {...reveal}
            transition={{ ...reveal.transition, delay: 0.1 + index * 0.06 }}
          >
            <h3 className="font-sans text-[21px] font-medium leading-snug text-ink">{item.title}</h3>
            <p className="mt-3 font-sans text-body text-muted">{item.body}</p>
            {item.link && (
              <DrawnLink href={item.link.href} className="mt-6">
                {item.link.label}&nbsp;&rarr;
              </DrawnLink>
            )}
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
