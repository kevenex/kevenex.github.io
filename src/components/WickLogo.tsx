/*
 * Wick's mark. The agent named itself, and its reason is the brief: "a wick is
 * small, disposable, and burns for a set amount of time."
 *
 * Two paths, and the inner one is load-bearing. A single pointed-top,
 * round-bottomed outline is the universal water-drop glyph — earlier drafts
 * read as water at every size. Fire is what gets drawn with a hot core inside
 * it, so the inner flame is what makes this read as a flame rather than a
 * droplet. The outer tip leans, which keeps it from being lucide's Flame.
 *
 * Drawn on lucide's 24-unit grid at lucide's stroke weight, because it shares
 * an icon row with Plane, FlaskConical and PenLine on the homepage and would
 * otherwise read as a different visual language.
 *
 * The same paths are inlined in public/project-wick/index.html and
 * public/project-wick/icon.svg, which cannot import from here — a standalone
 * static page has no bundler. Change one, change all three.
 */

const FLAME_OUTER =
  'M15 2.6c-.5 4.1-2.4 5.6-4.5 7.6-2 1.9-3.9 3.4-3.9 6.1a6.4 6.4 0 0 0 12.8 0c0-3-1.5-4.7-2.9-6.5-1.4-1.9-2.4-3.7-1.5-7.2z';
const FLAME_INNER =
  'M12 21.5a2.9 2.9 0 0 0 2.9-2.9c0-2-1.5-3.3-2.3-6-.5 1.7-3.5 3.2-3.5 6a2.9 2.9 0 0 0 2.9 2.9z';

interface WickLogoProps {
  className?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}

export default function WickLogo({
  className,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}: WickLogoProps) {
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
      <path d={FLAME_OUTER} />
      <path d={FLAME_INNER} />
    </svg>
  );
}
