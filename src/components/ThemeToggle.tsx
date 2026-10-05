import { useTheme } from '../lib/theme';

/*
 * In the same register as everything else: a mono label and a rule that
 * draws, not an icon button with a pill around it. It names the theme you
 * would get by pressing it, which is less ambiguous than a sun/moon glyph
 * that could mean either the current state or the destination.
 *
 * Fixed only from lg, where the page keeps a right-hand gutter clear for it.
 * Below that there is no such gutter, so it is set at the top of the document
 * beside the hero's header line and scrolls away with it rather than floating
 * over the text of every section.
 */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'Light' : 'Dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next.toLowerCase()} theme`}
      className="group absolute right-8 top-6 z-50 inline-flex flex-col gap-1.5 font-mono text-label uppercase text-muted outline-none md:right-6 lg:fixed"
    >
      <span className="transition-colors group-hover:text-oxide group-focus-visible:text-oxide">
        {next}
      </span>
      <span
        aria-hidden="true"
        className="h-px w-full origin-left scale-x-0 bg-oxide transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </button>
  );
}
