import { motion } from 'framer-motion';
import { EASE, RAIL_PAD, RAIL_PAD_R, usePrefersReducedMotion } from '../lib/layout';

/*
 * Text is the visual. No video, no scrub, no watermark — the page opens on a
 * sentence and the reader either wants the rest or does not.
 *
 * This is the one place on the page that animates on load rather than on
 * scroll, so the sequence is deliberately short: the reader came here to
 * read, not to wait.
 */
export default function Arrival() {
  const still = usePrefersReducedMotion();

  return (
    <section
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
      >
        I build things that keep running when I am not watching.
      </motion.h1>

      <motion.p
        className="font-mono text-label uppercase text-muted"
        initial={still ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: still ? 0 : 0.8, ease: EASE, delay: still ? 0 : 0.6 }}
      >
        Scroll
      </motion.p>
    </section>
  );
}
