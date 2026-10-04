import type { Mark } from '../content/resume';

/*
 * A company's logo as a small square tile, or — until there is a logo to
 * use — its monogram set in the machine voice on a hairline tile of the same
 * size, so a row with a logo and a row without one still line up.
 *
 * Always decorative: every caller prints the company name beside it, so the
 * image takes an empty alt rather than reading the name twice. Square and
 * unrounded, like everything else in the system; the logos carry their own
 * grounds (teal, black, purple), so the tile adds no border of its own.
 */
const SIZES = {
  md: { box: 'h-10 w-10', px: 40, type: 'text-[11px]' },
  sm: { box: 'h-8 w-8', px: 32, type: 'text-[10px]' },
};

export default function CompanyMark({
  mark,
  size = 'md',
  className = '',
}: {
  mark: Mark;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const { box, px, type } = SIZES[size];

  if (mark.logo) {
    return (
      <img
        src={mark.logo}
        alt=""
        width={px}
        height={px}
        loading="lazy"
        decoding="async"
        className={`${box} shrink-0 object-contain ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${box} flex shrink-0 items-center justify-center border border-ink/20 bg-paper-lift font-mono ${type} uppercase tracking-[0.06em] text-ink ${className}`}
    >
      {mark.monogram}
    </span>
  );
}
