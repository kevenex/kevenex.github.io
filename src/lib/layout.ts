import { useEffect, useState } from 'react';

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

/*
 * Right-hand breathing room — and, at lg and up, the section rail's gutter.
 * The rail is fixed at right-6 and its widest label ("Project Wick") makes it
 * 142px across, so it occupies the last 166px of the viewport. Anything less
 * than that here and right-aligned content runs underneath it: the data strip
 * was colliding with the active label at lg:pr-24. 192px clears it.
 *
 * Only lg needs it; below that the rail is hidden entirely.
 */
export const RAIL_PAD_R = 'pr-6 md:pr-16 lg:pr-48';

/** One easing curve and one distance for every reveal on the page. */
export const EASE = [0.22, 0.61, 0.36, 1] as const;
export const RISE = 24;

/** The shared reveal. Elements do not perform; they arrive. */
const MOVING = {
  initial: { opacity: 0, y: RISE },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.7, ease: EASE },
};

/*
 * The same shape with nothing in motion. Identical keys so callers can still
 * spread it and override `transition` without branching.
 */
const STILL = {
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0 },
};

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);

    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return reduced;
}

/*
 * Reveals must be a hook rather than a constant, because reduced motion has
 * to switch them off in JavaScript — not in CSS.
 *
 * The stylesheet's `prefers-reduced-motion` block zeroes transition and
 * animation durations, which does nothing here: Framer Motion animates
 * opacity by writing inline styles, so an element sits at `opacity: 0`
 * waiting for an intersection the CSS cannot influence. A reader who asked
 * for no motion would get content that never appears at all — the failure is
 * worse than the animation it was meant to prevent.
 */
export function useReveal() {
  return usePrefersReducedMotion() ? STILL : MOVING;
}
