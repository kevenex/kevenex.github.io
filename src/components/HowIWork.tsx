import { motion } from 'framer-motion';
import { Rocket, Search, Users, Wrench } from 'lucide-react';
import { HOW, type WorkItem } from '../content/resume';
import { RAIL_PAD, RAIL_PAD_R, useReveal } from '../lib/layout';

const ICONS: Record<WorkItem['icon'], typeof Search> = {
  search: Search,
  people: Users,
  build: Wrench,
  ship: Rocket,
};

/*
 * A way of working, stated once and then made concrete: one sentence of
 * principle, one paragraph of how it plays out, and the things a team can
 * hand over. Icons are line-drawn in the accent at the stroke weight of the
 * page's hairlines, so they read as marks in the margin rather than as UI.
 */
export default function HowIWork() {
  const reveal = useReveal();

  return (
    <section id="how" className={`w-full py-32 sm:py-40 ${RAIL_PAD} ${RAIL_PAD_R}`}>
      <motion.p className="font-mono text-label uppercase text-muted" {...reveal}>
        How I work
      </motion.p>

      <motion.h2
        className="mt-8 max-w-[18ch] font-serif text-spread"
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.05 }}
      >
        {HOW.headline}
      </motion.h2>

      <motion.p
        className="mt-10 max-w-measure font-sans text-lead text-muted"
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.1 }}
      >
        {HOW.body}
      </motion.p>

      <motion.h3
        className="mt-20 font-sans text-[24px] leading-snug text-ink"
        {...reveal}
      >
        What I can help you get done.
      </motion.h3>

      <ul className="mt-10 flex max-w-3xl flex-col gap-10">
        {HOW.help.map(({ icon, title, body }, index) => {
          const Icon = ICONS[icon];
          return (
            <motion.li
              key={title}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-5"
              {...reveal}
              transition={{ ...reveal.transition, delay: index * 0.06 }}
            >
              <Icon aria-hidden="true" strokeWidth={1.5} className="mt-0.5 h-8 w-8 text-oxide" />
              <div>
                <p className="font-sans text-[19px] font-medium leading-snug text-ink">{title}</p>
                <p className="mt-2 font-sans text-body text-muted">{body}</p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
