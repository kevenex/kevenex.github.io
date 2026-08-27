import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './layout';

/*
 * The hover layer — the one part of the page that answers back rather than
 * simply arriving. Everything here is an enhancement over a page that already
 * works without it, and every effect in this file is gated on `useHoverLayer`
 * so the enhancement can be switched off wholesale rather than per feature.
 */

const FINE = '(pointer: fine)';

/**
 * A pointer that can actually hover — a mouse or trackpad, not a finger.
 *
 * Watched rather than read once, to match `usePrefersReducedMotion`: a laptop
 * with a touchscreen can switch between the two mid-session, and plugging in a
 * mouse should not require a reload to get the cursor back.
 *
 * Module-private: `useHoverLayer` is the gate everything else should ask, so
 * that no caller can accidentally take half of the condition.
 */
function useFinePointer() {
  const [fine, setFine] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(FINE).matches
  );

  useEffect(() => {
    const query = window.matchMedia(FINE);
    const sync = () => setFine(query.matches);

    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return fine;
}

/**
 * The single gate for the whole hover layer: a precise pointer, and a reader
 * who has not asked for less motion.
 *
 * Touch is excluded outright rather than degraded. A magnetic pull with no
 * pointer to be magnetic toward is not a smaller version of the effect — it
 * is an element that moves for no reason the reader can see.
 */
export function useHoverLayer() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();

  return fine && !reduced;
}

/** How close the pointer must come before an element starts to lean. */
const RADIUS = 90;

/** Fraction of the pointer's offset the element travels, at the centre. */
const STRENGTH = 0.28;

/** Per-frame approach. Low enough that the element trails the pointer. */
const LERP = 0.15;

/**
 * Makes an element lean toward the pointer as it approaches, and settle back
 * when it leaves.
 *
 * The transform is written straight to the node rather than held in state:
 * this runs at frame rate, and a `useState` here would re-render the section
 * the element lives in on every mouse move.
 *
 * Returns a ref to attach. Elements that never receive it are unaffected, so
 * this is opt-in per element rather than a global pointer effect.
 */
export function useMagnetic<T extends HTMLElement>(radius = RADIUS, strength = STRENGTH) {
  const ref = useRef<T>(null);
  const active = useHoverLayer();

  useEffect(() => {
    const element = ref.current;
    if (!element || !active) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let inside = false;
    let x = 0;
    let y = 0;

    const step = () => {
      frame = 0;

      /*
       * The element's box is read here rather than in the move handler, so a
       * burst of pointer events costs one layout read per frame instead of
       * one per event.
       */
      let targetX = 0;
      let targetY = 0;

      if (inside) {
        const box = element.getBoundingClientRect();
        const dx = pointerX - (box.left + box.width / 2);
        const dy = pointerY - (box.top + box.height / 2);
        const distance = Math.hypot(dx, dy);

        if (distance < radius) {
          // Falls off toward the edge of the radius, so the element does not
          // snap into motion the moment the pointer crosses the threshold.
          const falloff = 1 - distance / radius;
          targetX = dx * strength * falloff;
          targetY = dy * strength * falloff;
        }
      }

      x += (targetX - x) * LERP;
      y += (targetY - y) * LERP;

      // Under half a pixel there is nothing left to see, so the loop stops
      // rather than idling at frame rate for the rest of the session.
      if (Math.abs(targetX - x) < 0.1 && Math.abs(targetY - y) < 0.1) {
        x = targetX;
        y = targetY;
        element.style.transform = x || y ? `translate3d(${x}px, ${y}px, 0)` : '';
        return;
      }

      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = requestAnimationFrame(step);
    };

    const run = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      inside = true;
      run();
    };

    /*
     * A pointer that leaves the window stops sending moves, so without this
     * the element would hold its last lean until something else woke the
     * loop. Releases it instead.
     */
    const onLeave = () => {
      inside = false;
      run();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      cancelAnimationFrame(frame);
      element.style.transform = '';
    };
  }, [active, radius, strength]);

  return ref;
}
