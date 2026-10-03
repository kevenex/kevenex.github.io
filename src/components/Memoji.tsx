import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../lib/layout';
import { useHoverLayer } from '../lib/pointer';

/*
 * Kevin's Memoji, turning to look at the reader's cursor.
 *
 * The sprite is 24 real frames of one continuous head turn, cut from a Memoji
 * recording: frame 0 faces the reader's right, frame 23 their left, and frame
 * 13 is the most front-on. Scrubbing through them is what turns the head, so
 * the motion is the recording's own rather than a transform faking a turn.
 * A small 3D tilt on top supplies the up-and-down the recording doesn't have.
 *
 * Three behaviours, chosen the same way as everything else on the page:
 * - hover layer (fine pointer, motion allowed): follows the cursor;
 * - motion allowed but no hover (touch): looks slowly from side to side;
 * - reduced motion: holds the front-on frame and never moves.
 *
 * Frames are written straight to the node's style, never through state: this
 * runs at frame rate and would otherwise re-render the hero on every move.
 */

const SPRITE = '/memoji/kevin.webp';
const COLS = 6;
const ROWS = 4;
const FRAMES = 24;
const FRONT = 13;

/** Per-frame approach — the head trails the cursor rather than snapping to it. */
const LERP = 0.12;

/** Most the head tilts toward the cursor, in degrees. */
const TILT_X = 8;
const TILT_Y = 6;

/** One full look left-and-right when idling on touch, in milliseconds. */
const IDLE_PERIOD = 7000;

function paint(face: HTMLDivElement, frame: number, tiltX: number, tiltY: number) {
  const index = Math.max(0, Math.min(FRAMES - 1, Math.round(frame)));
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  face.style.backgroundPosition = `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`;
  face.style.transform =
    tiltX || tiltY ? `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)` : '';
}

/**
 * Where the head should point for a cursor offset of -1 (far left of the
 * Memoji) to 1 (far right). Two different spans either side of the front
 * frame, because the recording turns further one way than the other.
 */
function frameFor(offset: number) {
  return offset >= 0 ? FRONT - offset * FRONT : FRONT - offset * (FRAMES - 1 - FRONT);
}

/** An offset as a fraction of the room on its side, clamped to -1…1. */
function reach(offset: number, before: number, after: number) {
  const room = offset < 0 ? before : after;
  return room > 0 ? Math.max(-1, Math.min(1, offset / room)) : 0;
}

export default function Memoji({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const follow = useHoverLayer();
  const still = usePrefersReducedMotion();

  useEffect(() => {
    const face = ref.current;
    if (!face) return;

    paint(face, FRONT, 0, 0);
    if (still) return;

    let raf = 0;
    let visible = true;
    let pointerX = 0;
    let pointerY = 0;
    let inside = false;

    let frame = FRONT;
    let tiltX = 0;
    let tiltY = 0;

    const step = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;

      let targetFrame = FRONT;
      let targetX = 0;
      let targetY = 0;

      if (follow) {
        if (inside) {
          const box = face.getBoundingClientRect();
          const cx = box.left + box.width / 2;
          const cy = box.top + box.height / 2;
          // Each side is measured against its own distance to the screen
          // edge, so the head reaches its furthest turn at the edge whichever
          // side of the page it sits on.
          const nx = reach(pointerX - cx, cx, window.innerWidth - cx);
          const ny = reach(pointerY - cy, cy, window.innerHeight - cy);
          targetFrame = frameFor(nx);
          targetX = -ny * TILT_X;
          targetY = nx * TILT_Y;
        }
      } else {
        // Touch: a slow look to either side, easing through the front.
        const phase = Math.sin((now / IDLE_PERIOD) * Math.PI * 2);
        targetFrame = frameFor(phase * 0.7);
        targetY = phase * 0.7 * TILT_Y;
      }

      frame += (targetFrame - frame) * LERP;
      tiltX += (targetX - tiltX) * LERP;
      tiltY += (targetY - tiltY) * LERP;
      paint(face, frame, tiltX, tiltY);

      // Following settles and stops; idling never settles, by design.
      const settled =
        follow &&
        Math.abs(targetFrame - frame) < 0.05 &&
        Math.abs(targetX - tiltX) < 0.05 &&
        Math.abs(targetY - tiltY) < 0.05;

      if (!settled) raf = requestAnimationFrame(step);
    };

    const run = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      inside = true;
      run();
    };

    const onLeave = () => {
      inside = false;
      run();
    };

    // Nothing animates while the hero is off screen or the tab is hidden.
    const observer = new IntersectionObserver(([record]) => {
      visible = record.isIntersecting;
      if (visible) run();
    });
    observer.observe(face);
    document.addEventListener('visibilitychange', run);

    if (follow) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      window.addEventListener('blur', onLeave);
    }

    run();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener('visibilitychange', run);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, [follow, still]);

  return (
    <div className={`[perspective:900px] ${className}`}>
      <div
        ref={ref}
        role="img"
        aria-label="Kevin’s Memoji"
        className="aspect-square w-full bg-no-repeat will-change-transform"
        style={{
          backgroundImage: `url(${SPRITE})`,
          backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
        }}
      />
    </div>
  );
}
