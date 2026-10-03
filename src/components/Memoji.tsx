/*
 * Kevin's Memoji, front-on and still.
 *
 * It used to turn to follow the cursor by scrubbing frames of a recorded head
 * turn; the motion never read cleanly at this size, so it is one frame now
 * (see scripts/build-memoji.mjs). A plain image: nothing to gate behind the
 * hover layer or reduced motion, because nothing moves.
 *
 * Sized by the caller. The intrinsic dimensions are given so the browser
 * reserves the square before the image arrives and the hero never shifts.
 */
export default function Memoji({ className = '' }: { className?: string }) {
  return (
    <img
      src="/memoji/kevin.webp"
      alt="Kevin’s Memoji"
      width={363}
      height={363}
      decoding="async"
      className={`aspect-square h-auto ${className}`}
    />
  );
}
