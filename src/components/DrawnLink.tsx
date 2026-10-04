import type { MouseEvent, ReactNode } from 'react';

/*
 * The site's one link language, as a component: a mono label whose rule
 * draws in from the left on hover or focus. The same drawing rule as the
 * hero's LinkedIn link and the theme toggle — no pills, no filled buttons.
 *
 * `inline-flex` rather than inline so the rule can sit under the label as a
 * sibling and take the label's width, whatever it says.
 */
export default function DrawnLink({
  href,
  children,
  onClick,
  external = false,
  className = '',
}: {
  href: string;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`group inline-flex flex-col gap-2 font-mono text-label uppercase text-ink outline-none ${className}`}
    >
      <span className="transition-colors group-hover:text-oxide group-focus-visible:text-oxide">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="h-px w-full origin-left scale-x-0 bg-oxide transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </a>
  );
}
