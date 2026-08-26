import { motion } from 'framer-motion';
import { RAIL_PAD, RAIL_PAD_R, useReveal } from '../lib/layout';

/*
 * The thesis. This slot used to render a full viewport of video with no
 * content in it at all — it is the largest gap on the old page, and it gets
 * the plainest possible answer: who this is and what the rest of the page is.
 */
export default function Position() {
  const reveal = useReveal();

  return (
    <section
      id="position"
      className={`flex min-h-[80vh] w-full flex-col justify-center py-32 ${RAIL_PAD} ${RAIL_PAD_R}`}
    >
      <motion.p className="font-mono text-label uppercase text-muted" {...reveal}>
        Position
      </motion.p>

      <motion.p
        className="mt-10 max-w-measure font-sans text-lead text-ink"
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.1 }}
      >
        By day I turn ambiguous problems into shipped product — platform launches,
        enterprise data migrations, and the tangle of systems an acquisition leaves
        behind.
      </motion.p>

      <motion.p
        className="mt-8 max-w-measure font-sans text-lead text-muted"
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.2 }}
      >
        The rest of this page is what I build when nobody asked: an agent that woke on a
        cron for nineteen days and wrote about what it found, and a flight engine over
        real terrain. Both were made with Claude Code. One is still running; the other
        finished and left a record.
      </motion.p>
    </section>
  );
}
