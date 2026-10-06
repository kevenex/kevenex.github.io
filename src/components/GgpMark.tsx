/*
 * The GGP Tracker mark: a poker chip — the rim, its eight edge spots, and the
 * inlay.
 *
 * Line art at 1.5 on a 24 viewBox, the same weight as WickMark, so the two
 * read as a pair on the Projects page. The spots are drawn a little finer, as
 * Wick's dial ticks are, so the chip's outline is what you see first.
 *
 * Kept identical to the inline copy in kevenex/ggpoker-tracker's
 * web/public/readme/index.html — that page is static and lives in another
 * repository, so nothing catches the drift. Change one, change both.
 */

const SPOTS =
  'M18.75 12H21.5M16.77 16.77L18.72 18.72M12 18.75V21.5M7.23 16.77L5.28 18.72M5.25 12H2.5M7.23 7.23L5.28 5.28M12 5.25V2.5M16.77 7.23L18.72 5.28';

interface GgpMarkProps {
  className?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}

export default function GgpMark({
  className,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}: GgpMarkProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="12" r="4.5" />
      <path d={SPOTS} strokeWidth={strokeWidth * 0.73} />
    </svg>
  );
}
