import { useCallback, useEffect, useRef, useState } from 'react';

/*
 * The other project's evidence: the sim itself, embedded, but only once the
 * reader asks for it.
 *
 * Click-to-activate rather than loading on intersection, for three reasons
 * that are all in the embedded page's own source:
 *
 *  - It binds `keydown` on the window and calls `preventDefault()` on the
 *    arrow keys and Space (public/flyer-fable/index.html). A frame holding
 *    focus would swallow the reader's own scroll keys.
 *  - It calls `requestPointerLock()` when its canvas is clicked, which is why
 *    the frame below has to say `allow="pointer-lock"` — inside a frame that
 *    permission fails silently rather than loudly.
 *  - It is an 89KB page plus a 670KB copy of Three.js plus a WebGL render
 *    loop. That is not something to start because somebody scrolled past.
 */

/** The route, as the sim's own source defines it. */
const FROM = 'Seoul';
const TO = 'Hallasan';
const DISTANCE = '451 km';

export default function FlightPlate() {
  const [flying, setFlying] = useState(false);
  const start = useRef<HTMLButtonElement>(null);

  const exit = useCallback(() => {
    setFlying(false);

    /*
     * Unmounting the frame is what actually stops the render loop — hiding it
     * would leave a WebGL context running for the rest of the session. Focus
     * goes back to the control the reader used to get in, which no longer
     * exists until this render completes, hence the frame's delay.
     */
    requestAnimationFrame(() => start.current?.focus());
  }, []);

  /*
   * Escape is the conventional way out and costs nothing to honour. It only
   * fires while focus is in this document — inside the frame, Escape is spent
   * releasing pointer lock — which is exactly why the exit control below is a
   * visible button outside the frame rather than an overlay on top of it.
   */
  useEffect(() => {
    if (!flying) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') exit();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flying, exit]);

  if (flying) {
    return (
      <div>
        {/*
         * Above the frame, never over it. Pointer lock hides the cursor and
         * takes every click inside the frame, so an overlaid control would be
         * unreachable at exactly the moment it is needed.
         */}
        <div className="flex items-center justify-between border-b border-ink/15 pb-3">
          <p className="font-mono text-label uppercase text-muted">
            {FROM} → {TO} — click the view to take the controls
          </p>

          <button
            type="button"
            onClick={exit}
            className="font-mono text-label uppercase text-ink outline-none transition-colors hover:text-oxide focus-visible:text-oxide"
          >
            Exit flight
          </button>
        </div>

        {/*
         * `data-cursor="hide"` hands the native cursor back and parks our own
         * ring: under pointer lock this document stops receiving pointermove
         * altogether, so the ring would otherwise freeze mid-page.
         */}
        <div data-cursor="hide" className="mt-4 aspect-[16/9] max-h-[70vh] w-full">
          <iframe
            src="/flyer-fable/"
            title="Flyer Fable — a first-person flight from Seoul to Hallasan"
            allow="pointer-lock; fullscreen"
            className="h-full w-full border border-ink/15"
          />
        </div>
      </div>
    );
  }

  return (
    <button
      ref={start}
      type="button"
      onClick={() => setFlying(true)}
      data-cursor-label="Fly"
      className="group block w-full border border-ink/15 bg-paper-lift outline-none transition-colors hover:border-oxide/50 focus-visible:border-oxide"
    >
      <span className="flex aspect-[16/9] max-h-[70vh] w-full flex-col justify-between p-6 sm:p-10">
        <span className="flex items-baseline justify-between font-mono text-label uppercase text-muted">
          <span>Flight plan</span>
          <span className="tabular">{DISTANCE}</span>
        </span>

        {/*
         * The leg, drawn. `preserveAspectRatio="none"` lets it stretch to the
         * panel at any width — it is a diagram of a route, not a map, and
         * nothing in it has to survive being scaled unevenly.
         */}
        <svg
          viewBox="0 0 100 30"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="my-8 h-16 w-full text-oxide"
        >
          <path
            d="M4 26 C 34 26, 58 10, 96 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
            vectorEffect="non-scaling-stroke"
          />
          {/*
           * Terminus marks as vertical rules, not circles. The panel stretches
           * the viewBox ~5x more across than down, which turns a circle into a
           * visible ellipse — `non-scaling-stroke` fixes the stroke width but
           * not the shape. A vertical line survives the stretch as a vertical
           * line.
           */}
          <line
            x1="4"
            y1="21"
            x2="4"
            y2="30"
            stroke="currentColor"
            strokeWidth="0.4"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="96"
            y1="0"
            x2="96"
            y2="9"
            stroke="currentColor"
            strokeWidth="0.4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <span className="flex items-end justify-between gap-6">
          <span className="flex flex-col gap-1 text-left">
            <span className="font-mono text-label uppercase text-muted">{FROM}</span>
            <span className="font-serif text-section leading-none text-ink">{TO}</span>
          </span>

          {/*
           * The same drawing rule the project links use, so the plate reads as
           * part of the page's vocabulary rather than as a play button.
           */}
          <span className="flex shrink-0 flex-col gap-2 font-mono text-label uppercase text-ink">
            <span className="transition-colors group-hover:text-oxide group-focus-visible:text-oxide">
              Fly it &rarr;
            </span>
            <span
              aria-hidden="true"
              className="h-px w-full origin-left scale-x-0 bg-oxide transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
            />
          </span>
        </span>
      </span>
    </button>
  );
}
