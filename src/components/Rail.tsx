import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useScrollTo, useScrollToOffset } from '../lib/lenis-context';

const SECTIONS = [
  { id: 'position', label: 'Position' },
  { id: 'wick', label: 'Project Wick' },
  { id: 'flyer', label: 'Flyer Fable' },
  { id: 'practice', label: 'Practice' },
  { id: 'contact', label: 'Contact' },
];

/*
 * One fixed element that persists across every movement — but a map rather
 * than a menu. Each section sits at its *measured* position in the document,
 * so the gaps between the ticks are the real distances the reader has to
 * cross, and the fill between them is where they actually are.
 *
 * Evenly spaced ticks would say which section you are in and nothing about
 * where; they would also make the track a lie to drag along, since half the
 * page would live under one of five equal gaps.
 *
 * Real anchors, not buttons: they work without JavaScript, they can be opened
 * or copied like any link, and the click handler only takes over to route the
 * scroll through Lenis instead of letting the browser jump. The fill and the
 * drag surface are `aria-hidden` enhancements laid over them — keyboard
 * readers get the five links, which lose nothing.
 */

/** Even spacing, held only until the first measurement lands a frame later. */
const EVEN = Object.fromEntries(
  SECTIONS.map(({ id }, index) => [id, index / (SECTIONS.length - 1)])
);

/** The scrollable range. Zero on a page shorter than the viewport. */
const range = () => document.documentElement.scrollHeight - window.innerHeight;

export default function Rail() {
  const scrollTo = useScrollTo();
  const scrollToOffset = useScrollToOffset();
  const track = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState<string | null>(null);
  const [overColophon, setOverColophon] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [ratios, setRatios] = useState<Record<string, number>>(EVEN);

  const { scrollYProgress } = useScroll();
  const head = useTransform(scrollYProgress, (value) => `${value * 100}%`);

  /*
   * `getBoundingClientRect` plus `scrollY`, never `offsetTop`: every section
   * but the hero is nested inside Spine's `relative` wrapper, so `offsetTop`
   * would measure from there and put every tick in the wrong place.
   *
   * Divided by the scrollable range rather than the document height, because
   * that is the denominator `scrollYProgress` uses — any other and the ticks
   * and the fill would disagree about where the page is.
   */
  useEffect(() => {
    const measure = () => {
      const max = range();
      if (max <= 0) return;

      const next: Record<string, number> = {};

      SECTIONS.forEach(({ id }) => {
        const node = document.getElementById(id);
        if (!node) return;

        const top = node.getBoundingClientRect().top + window.scrollY;
        next[id] = Math.min(1, Math.max(0, top / max));
      });

      // The observer fires on every layout change, most of which move nothing
      // here; re-rendering the rail for an unchanged map is wasted work.
      setRatios((current) =>
        SECTIONS.every(({ id }) => current[id] === next[id]) ? current : next
      );
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

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
   * The rail's hairlines are ink on paper, which would be invisible against
   * the dark colophon. It used to step aside there — but a progress rail that
   * disappears at 85% stops being a progress rail, so it changes tone instead
   * and stays readable all the way to the end.
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

  const seek = useCallback(
    (clientY: number) => {
      const node = track.current;
      if (!node) return;

      const box = node.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientY - box.top) / box.height));

      scrollToOffset(ratio * range(), true);
    },
    [scrollToOffset]
  );

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    // Primary button only — a right-click on the rail should open the menu.
    if (event.button !== 0) return;

    // The anchors sit inside the drag surface so that presses between them
    // still scrub. A press *on* one is a click on a link and nothing else.
    if ((event.target as Element).closest('a')) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    setScrubbing(true);
    seek(event.clientY);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (scrubbing) seek(event.clientY);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!scrubbing) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    setScrubbing(false);
  };

  /*
   * Full class strings per tone rather than composed fragments, so Tailwind's
   * content scanner sees every one of them.
   */
  const tone = overColophon
    ? {
        track: 'bg-band-text/20',
        fill: 'bg-oxide-lift',
        head: 'bg-oxide-lift',
        tick: 'bg-band-text/40 group-hover:bg-band-text/70 group-focus-visible:bg-oxide-lift',
        tickOn: 'bg-oxide-lift',
        label: 'text-band-text/60',
        labelOn: 'text-oxide-lift',
      }
    : {
        track: 'bg-ink/15',
        fill: 'bg-oxide',
        head: 'bg-oxide',
        tick: 'bg-ink/40 group-hover:bg-ink/60 group-focus-visible:bg-oxide',
        tickOn: 'bg-oxide',
        label: 'text-muted',
        labelOn: 'text-oxide',
      };

  return (
    <nav
      aria-label="Sections"
      data-cursor-tone={overColophon ? 'band' : undefined}
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      {/*
       * The drag surface is this padded wrapper rather than an overlay: the
       * fill and the head marker occupy the same one-pixel column as the axis,
       * so anything laid *under* them never sees a press at all. Widened by
       * the negative margin so a hairline can actually be caught, and
       * `touch-none` stops a large touchscreen panning the page out from under
       * a scrub.
       */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="-mx-3 touch-none px-3"
      >
        <div ref={track} className={`relative h-[42vh] min-h-[280px] w-px ${tone.track}`}>
          {/*
           * Bound straight to scroll progress, unsprung — the same reasoning the
           * spine carries. A sprung fill drifts behind the scrollbar and stops
           * reading as position.
           */}
          <motion.div
            aria-hidden="true"
            className={`absolute inset-x-0 top-0 h-full origin-top ${tone.fill}`}
            style={{ scaleY: scrollYProgress }}
          />

          <motion.div
            aria-hidden="true"
            className={`absolute right-0 h-px -translate-y-1/2 transition-all duration-300 ${
              scrubbing ? 'w-6' : 'w-3'
            } ${tone.head}`}
            style={{ top: head }}
          />

          {/*
           * `absolute inset-0`, not `relative`. The items are absolutely
           * positioned by percentage, and percentages resolve against this
           * element — which, with every child taken out of flow, is zero
           * pixels tall as a `relative` box. Every tick then landed on 0% and
           * the widest label blanketed the whole track, swallowing the drag.
           */}
          <ul className="absolute inset-0 z-10">
            {SECTIONS.map(({ id, label }) => {
              const isActive = active === id;

              return (
                <li
                  key={id}
                  className="absolute right-0 -translate-y-1/2"
                  style={{ top: `${(ratios[id] ?? 0) * 100}%` }}
                >
                  <a
                    href={`#${id}`}
                    onClick={(event) => handleClick(event, id)}
                    aria-current={isActive ? 'true' : undefined}
                    className="group flex items-center justify-end gap-3 py-1 outline-none"
                  >
                    <span
                      className={`whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] transition-all duration-500 ${
                        isActive
                          ? `${tone.labelOn} opacity-100`
                          : `${tone.label} opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100`
                      }`}
                    >
                      {label}
                    </span>

                    <span
                      aria-hidden="true"
                      className={`h-px transition-all duration-500 ${
                        isActive ? `w-8 ${tone.tickOn}` : `w-4 ${tone.tick} group-hover:w-6 group-focus-visible:w-6`
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
