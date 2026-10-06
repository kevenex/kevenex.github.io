import type { ReactNode } from 'react';
import { Lock } from 'lucide-react';

/*
 * A link that is not open yet. It sits where a DrawnLink would, in the same
 * mono voice, so the line under a project still reads as its way in — but in
 * the muted tone, behind a lock, with no href, no hover rule and no cursor
 * label, so nothing about it promises a destination it cannot reach.
 *
 * A span rather than a disabled anchor: an <a> without an href is still
 * announced as a link by some screen readers, and this is a label.
 */
export default function LockedLink({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-label uppercase text-muted ${className}`}
    >
      <Lock aria-hidden="true" strokeWidth={1.5} className="h-3.5 w-3.5 shrink-0" />
      {children}
    </span>
  );
}
