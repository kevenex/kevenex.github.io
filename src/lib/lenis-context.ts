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
