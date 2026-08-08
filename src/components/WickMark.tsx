/*
 * The Project Wick mark.
 *
 * Three parts, each of which says something about the agent rather than about
 * fire in general:
 *
 *   the dial   Twenty-four ticks, one per wake. Four of them run longer — the
 *              hours that earned an entry. Their spacing is deliberately
 *              irregular, clustered and then quiet, because that is the shape
 *              of a real day in the journal and because "3–6 entries from 24
 *              wakes" is the agent's whole thesis about restraint.
 *   the flame  It named itself Wick: small, disposable, burns for an hour.
 *   the wick   A stub below the flame, not reaching the dial. What is left
 *              behind is smaller than the thing that burned.
 *
 * Line art at 1.5, on a 24 viewBox, because it sits beside Lucide icons in the
 * Projects grid and has to carry the same weight. The ticks are drawn a little
 * finer so the flame stays the thing you see first.
 *
 * Kept identical to the inline copies in public/project-wick/index.html and
 * public/project-wick/journal/index.html — those pages are static and cannot
 * import this. Change one, change all three.
 */

const DIAL =
  'M12 2.85L12 1.5M14.37 3.16L14.72 1.86M15.93 5.2L17.25 2.91M18.47 5.53L19.42 4.58M19.92 7.43L21.09 6.75M20.84 9.63L22.14 9.28M21.15 12L22.5 12M19.58 14.03L22.14 14.72M19.92 16.58L21.09 17.25M17.55 17.55L19.42 19.42M16.58 19.92L17.25 21.09M14.37 20.84L14.72 22.14M12 21.15L12 22.5M9.63 20.84L9.28 22.14M7.43 19.92L6.75 21.09M5.53 18.47L4.58 19.42M5.2 15.93L2.91 17.25M3.16 14.37L1.86 14.72M2.85 12L1.5 12M3.16 9.63L1.86 9.28M4.08 7.42L2.91 6.75M5.53 5.53L4.58 4.58M7.42 4.08L6.75 2.91M9.63 3.16L9.28 1.86';

const FLAME =
  'M12 5.1c1.85 2.6 3.75 4.95 3.75 7.5a3.75 3.75 0 0 1-7.5 0c0-1.3.5-2.5 1.3-3.65.15 1.1.62 1.9 1.4 2.35C10.8 9.9 11.25 7.35 12 5.1Z';

const WICK = 'M12 16.35v2.1';

interface WickMarkProps {
  className?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}

export default function WickMark({
  className,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}: WickMarkProps) {
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
      <path d={DIAL} strokeWidth={strokeWidth * 0.73} />
      <path d={FLAME} />
      <path d={WICK} />
    </svg>
  );
}
