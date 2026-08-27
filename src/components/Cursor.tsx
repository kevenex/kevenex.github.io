import { useEffect, useRef, useState } from 'react';
import { useHoverLayer } from '../lib/pointer';

/*
 * The page's own cursor: a hairline ring, in the same language as every other
 * rule on the page, that grows over anything it can act on and names the
 * action when the element says what it is.
 *
 * It is an enhancement in the strictest sense — the native cursor is only
 * given up once this one has proven it renders (see `ready` below), and it is
 * never constructed at all on touch or under reduced motion.
 */

/** Anything the ring should grow over. */
const INTERACTIVE = 'a, button, [data-cursor-label]';

/*
 * Regions that keep the native cursor because its shape carries information
 * the ring cannot — an I-beam over a field says "you can type here". The
 * attribute is the general escape hatch for anything else that needs the
 * native cursor back, notably anything that captures the pointer and stops
 * sending us moves.
 */
const NATIVE = '[data-cursor="hide"], input, textarea, select';

/*
 * The colophon is a dark band in both themes, and the base accent manages only
 * 2.4:1 against it in light — the same reason the colophon's own links use
 * `oxide-lift`. The ring is a fixed overlay and cannot see what it is sitting
 * on, so the band declares itself and the ring changes tone on the way in.
 */
const BAND = '[data-cursor-tone="band"]';

/** Per-frame approach. The ring trails the pointer rather than pinning to it. */
const LERP = 0.2;

export default function Cursor() {
  const active = useHoverLayer();
  const ring = useRef<HTMLDivElement>(null);

  /*
   * False until a real pointermove has arrived. Hiding the native cursor
   * before that would leave a reader with no cursor at all if anything here
   * failed to render — the page must never be worse off for the enhancement.
   */
  const [ready, setReady] = useState(false);
  const [over, setOver] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [native, setNative] = useState(false);
  const [band, setBand] = useState(false);

  useEffect(() => {
    if (!active) return;

    const node = ring.current;
    if (!node) return;

    let frame = 0;
    let first = true;
    let pointerX = 0;
    let pointerY = 0;
    let x = 0;
    let y = 0;

    const step = () => {
      frame = 0;

      x += (pointerX - x) * LERP;
      y += (pointerY - y) * LERP;

      // Settled — park the loop rather than idle at frame rate.
      if (Math.abs(pointerX - x) < 0.1 && Math.abs(pointerY - y) < 0.1) {
        x = pointerX;
        y = pointerY;
        node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        return;
      }

      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = requestAnimationFrame(step);
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      /*
       * The ring appears where the pointer already is. Lerping from the
       * origin would fly it across the page on the first move of the session.
       */
      if (first) {
        first = false;
        x = pointerX;
        y = pointerY;
        node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        setReady(true);
        return;
      }

      if (!frame) frame = requestAnimationFrame(step);
    };

    /*
     * Delegated rather than per-element: `pointerover` bubbles, so one pair of
     * listeners covers every link on the page including ones mounted later,
     * and nothing has to be re-bound when a section reveals.
     *
     * `elementFromPoint` per frame would answer the same question at hundreds
     * of times the cost.
     */
    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest) return;

      setNative(Boolean(target.closest(NATIVE)));
      setBand(Boolean(target.closest(BAND)));

      const hit = target.closest(INTERACTIVE);
      setOver(Boolean(hit));
      setLabel(hit?.getAttribute('data-cursor-label') ?? null);
    };

    const onLeave = () => {
      setOver(false);
      setLabel(null);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, [active]);

  /*
   * The class that surrenders the native cursor, applied to the document
   * rather than to a wrapper so it reaches the standalone `<html>` element
   * and every UA default underneath it. Removed on cleanup, so switching to
   * touch or turning on reduced motion hands the cursor straight back.
   */
  useEffect(() => {
    if (!active || !ready) return;

    document.documentElement.classList.add('cursor-custom');
    return () => document.documentElement.classList.remove('cursor-custom');
  }, [active, ready]);

  if (!active) return null;

  const shown = ready && !native;

  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] will-change-transform"
    >
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
          shown ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`rounded-full border transition-all duration-300 ease-out ${
            band ? 'border-oxide-lift' : 'border-oxide'
          } ${over ? 'h-11 w-11 bg-oxide/5' : 'h-6 w-6'}`}
        />

        {/*
         * The label sits outside the ring rather than inside it: at 44px the
         * ring cannot hold a word at the mono sizes this page uses without
         * setting it smaller than anything else on the page.
         */}
        {label && (
          <span
            className={`absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] ${
              band ? 'text-oxide-lift' : 'text-oxide'
            }`}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
