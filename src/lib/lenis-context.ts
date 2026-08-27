import { createContext, useCallback, useContext } from 'react';
import type Lenis from 'lenis';

/*
 * The context and its hooks live apart from the provider component so that
 * neither file mixes component and non-component exports — Fast Refresh
 * cannot reload a module that does both.
 */

export const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Scrolls to a selector. Every in-page navigation goes through this — a bare
 * `window.scrollTo` would fight Lenis for control of the same scroll position
 * and stutter visibly.
 *
 * With no instance (the reduced-motion case) it falls back to a native jump,
 * which is the correct behaviour there anyway.
 */
export function useScrollTo() {
  const lenis = useLenis();

  return useCallback(
    (selector: string) => {
      if (lenis) {
        lenis.scrollTo(selector);
        return;
      }
      document.querySelector(selector)?.scrollIntoView();
    },
    [lenis]
  );
}

/**
 * Scrolls to an absolute document offset. The rail's scrubber needs this:
 * `useScrollTo` can only name an element, and a pointer part-way down a track
 * is a position with no element at it.
 *
 * `immediate` is what a drag wants — Lenis easing toward each new target while
 * the pointer is still moving would leave the page permanently trailing the
 * reader's hand. Without it the jump is eased like any other.
 *
 * The no-instance branch is the reduced-motion case, so it never asks for
 * smooth behaviour regardless.
 */
export function useScrollToOffset() {
  const lenis = useLenis();

  return useCallback(
    (offset: number, immediate = false) => {
      if (lenis) {
        lenis.scrollTo(offset, { immediate });
        return;
      }
      window.scrollTo(0, offset);
    },
    [lenis]
  );
}
