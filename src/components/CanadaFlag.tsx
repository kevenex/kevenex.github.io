/*
 * The Canadian flag, drawn rather than typed. The 🇨🇦 emoji is a pair of
 * regional-indicator letters that only some systems turn into a flag:
 * Windows has no flag glyphs at all and prints a bare "CA", which is exactly
 * where a recruiter on a work laptop would be reading this.
 *
 * Public-domain geometry from the 1965 proclamation, on its 2:1 grid: red
 * field, white square, and the leaf cut out of the square so the red shows
 * through. Decorative — the location beside it is the text.
 */
const LEAF =
  'm2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z';

export default function CanadaFlag({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 9600 4800"
      className={`inline-block aspect-[2/1] ${className}`}
    >
      <path fill="#D52B1E" d="M0 0h9600v4800H0z" />
      <path fill="#FFFFFF" d={LEAF} />
    </svg>
  );
}
