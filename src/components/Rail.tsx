import { useEffect, useState, type MouseEvent } from 'react';
import { useScrollTo } from '../lib/lenis-context';

const SECTIONS = [
  { id: 'position', label: 'Position' },
  { id: 'wick', label: 'Project Wick' },
  { id: 'flyer', label: 'Flyer Fable' },
  { id: 'practice', label: 'Practice' },
  { id: 'contact', label: 'Contact' },
];

/*
 * One fixed element that persists across every movement, so the reader always
 * knows where in the page they are — the thing the old expanding-pill nav
 * never told them.
 *
 * Real anchors, not buttons: they work without JavaScript, they can be opened
 * or copied like any link, and the click handler only takes over to route the
 * scroll through Lenis instead of letting the browser jump.
 */
export default function Rail() {
  const scrollTo = useScrollTo();
  const [active, setActive] = useState<string | null>(null);
  const [overColophon, setOverColophon] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (records) => {
        records.forEach((record) => {
          if (record.isIntersecting) setActive(record.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );

    SECTIONS.forEach(({ id }) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  /*
   * The rail's hairlines are ink on paper, which would leave them invisible
   * against the dark colophon. It has nothing to indicate down there anyway —
   * the colophon carries its own links — so it steps aside once the colophon
   * crosses the midpoint rather than hanging around unreadable.
   */
  useEffect(() => {
    const colophon = document.getElementById('colophon');
    if (!colophon) return;

    const observer = new IntersectionObserver(
      ([record]) => setOverColophon(record.isIntersecting),
      { rootMargin: '-50% 0px 0px 0px' }
    );

    observer.observe(colophon);
    return () => observer.disconnect();
  }, []);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    scrollTo(`#${id}`);
  };

  return (
    <nav
      aria-label="Sections"
      aria-hidden={overColophon}
      className={`fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-500 lg:block ${
        overColophon ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <ul className="flex flex-col items-end gap-4">
        {SECTIONS.map(({ id, label }) => {
          const isActive = active === id;

          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(event) => handleClick(event, id)}
                aria-current={isActive ? 'true' : undefined}
                className="group flex items-center justify-end gap-3 outline-none"
              >
                <span
                  className={`font-mono text-[11px] uppercase tracking-[0.14em] transition-all duration-500 ${
                    isActive
                      ? 'text-oxide opacity-100'
                      : 'text-muted opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                  }`}
                >
                  {label}
                </span>

                <span
                  aria-hidden="true"
                  className={`h-px transition-all duration-500 ${
                    isActive
                      ? 'w-8 bg-oxide'
                      : 'w-4 bg-ink/40 group-hover:w-6 group-hover:bg-ink/60 group-focus-visible:w-6 group-focus-visible:bg-oxide'
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
