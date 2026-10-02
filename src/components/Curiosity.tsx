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
        What I build when nobody asked.
      </motion.h2>

      <motion.p
        className="mt-8 max-w-measure font-sans text-lead text-muted"
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.1 }}
      >
        Two projects, both made with Claude Code: an agent that woke on a cron for nineteen
        days and wrote about what it found, and a flight over real terrain that runs in the
        browser. They are how I keep my hands on what AI can actually do.
      </motion.p>
    </section>
  );
}
