import { motion } from 'framer-motion';
import { RAIL_PAD, RAIL_PAD_R, useReveal } from '../lib/layout';

/*
 * The hinge between the career and the projects. It says plainly what the two
 * spreads below are — things built on my own time, with AI agents — so a
 * recruiter reads them as evidence of how I work rather than as the job.
 */
export default function Curiosity() {
  const reveal = useReveal();

  return (
    <section id="curiosity" className={`w-full pt-32 sm:pt-40 ${RAIL_PAD} ${RAIL_PAD_R}`}>
      <motion.p className="font-mono text-label uppercase text-muted" {...reveal}>
        Curiosity
      </motion.p>

      <motion.h2
        className="mt-8 font-serif text-section"
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.05 }}
      >
        Things I build on my own time.
      </motion.h2>

      <motion.p
        className="mt-8 max-w-measure font-sans text-lead text-muted"
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.1 }}
      >
        Both of these were made with Claude Code. One is an agent that woke up on a schedule
        for nineteen days and wrote about whatever it was researching. The other is a flight
        over South Korea that runs in the browser. Building them is how I keep up with what AI
        tools can actually do.
      </motion.p>
    </section>
  );
}
