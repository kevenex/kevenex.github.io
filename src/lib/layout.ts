/*
 * The page hangs off one left rail and never resets it. The spine sits on
 * RAIL; everything else clears it with RAIL_PAD. The Practice timeline's
 * nodes reuse RAIL so they land on exactly the same axis the reader has
 * been following since the top of the page — that shared coordinate is what
 * makes the spine *become* the timeline rather than resemble it.
 *
 * Full class strings rather than composed fragments, so Tailwind's content
 * scanner sees them.
 */
export const RAIL = 'left-6 md:left-16 lg:left-24';
export const RAIL_PAD = 'pl-16 md:pl-32 lg:pl-44';

/** Right-hand breathing room, paired with RAIL_PAD. */
export const RAIL_PAD_R = 'pr-6 md:pr-16 lg:pr-24';

/** One easing curve and one distance for every reveal on the page. */
export const EASE = [0.22, 0.61, 0.36, 1] as const;
export const RISE = 24;

/** The shared reveal. Elements do not perform; they arrive. */
export const reveal = {
  initial: { opacity: 0, y: RISE },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.7, ease: EASE },
};
