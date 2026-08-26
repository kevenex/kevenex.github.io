import { useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { LenisContext } from './lenis-context';

/*
 * The whole page rests on this: the scroll is where the weight lives, so
 * that individual elements never have to perform to feel like motion.
 *
 * Lenis v1 drives the real document scroll position (it calls scrollTo each
 * frame rather than transforming a wrapper), which is why Framer Motion's
 * useScroll and plain `position: sticky` both keep working underneath it.
 * That is what lets the spine, the year counter and every reveal share one
 * scroll source with no second animation library.
 */

/** Below Lenis's 0.1 default — the brief asked for heavy, not brisk. */
const LERP = 0.08;

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');

    let instance: Lenis | null = null;
    let frame = 0;

    const start = () => {
      if (instance) return;

      instance = new Lenis({ lerp: LERP });
      setLenis(instance);

      const raf = (time: number) => {
        instance?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      instance?.destroy();
      instance = null;
      setLenis(null);
    };

    /*
     * Reduced motion gets no instance at all rather than a disabled one, so
     * the browser's own scrolling is left completely untouched. Watched
     * rather than read once, so toggling the OS setting takes effect without
     * a reload.
     */
    const sync = () => (query.matches ? stop() : start());

    sync();
    query.addEventListener('change', sync);

    return () => {
      query.removeEventListener('change', sync);
      stop();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
