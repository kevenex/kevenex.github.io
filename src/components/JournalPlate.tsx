import { useState } from 'react';
import { useFinePointer } from '../lib/pointer';

interface Entry {
  date: string;
  time: string;
  words: number;
  sources: number;
  text: string;
}

/*
 * The evidence, rather than a description of it: the agent's own last dozen
 * entries, read out of its journal at build time and printed verbatim.
 *
 * Every row is the machine's voice, so all of it is mono and none of it is
 * ours — the excerpts are clipped and tag-stripped by the `wick-summary`
 * plugin and otherwise untouched.
 */

/*
 * The 0fr → 1fr grid row is what makes this open smoothly without anyone
 * having to measure the text. The excerpt stays in the DOM at every state and
 * is only clipped, so a screen reader gets all twelve entries whether or not
 * a pointer ever opens one.
 */
const SHEET = 'grid transition-[grid-template-rows] duration-500 ease-out';

export default function JournalPlate({ entries }: { entries: Entry[] }) {
  const fine = useFinePointer();
  const [open, setOpen] = useState<number | null>(null);

  if (entries.length === 0) return null;

  /*
   * Three ways in, one piece of state. A pointer opens by hovering, a keyboard
   * opens by focusing, and a tap toggles — so the plate is not a desktop
   * feature with a touch fallback bolted on, it is the same control reached
   * three ways.
   */
  const hover = (index: number) => (fine ? () => setOpen(index) : undefined);

  return (
    <div
      className="border-t border-ink/15"
      onPointerLeave={fine ? () => setOpen(null) : undefined}
    >
      <p className="py-4 font-mono text-label uppercase text-muted">
        From the journal — last {entries.length}, verbatim
      </p>

      <ul className="border-t border-ink/10">
        {entries.map((entry, index) => {
          const isOpen = open === index;

          return (
            <li key={`${entry.date}-${entry.time}`} className="border-b border-ink/10">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : index)}
                onPointerEnter={hover(index)}
                /*
                 * Gated on `:focus-visible`, not focus. Clicking a button also
                 * focuses it, so an unguarded focus handler opened the row a
                 * moment before the click handler toggled it shut again — the
                 * row flickered and stayed closed on every tap. Browsers
                 * withhold `:focus-visible` from pointer-focused buttons, so
                 * this opens for the keyboard and leaves the click alone.
                 */
                onFocus={(event) => {
                  if (event.currentTarget.matches(':focus-visible')) setOpen(index);
                }}
                className="group w-full py-3 text-left outline-none"
              >
                <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-data">
                  <span
                    className={`tabular uppercase tracking-[0.1em] transition-colors ${
                      isOpen ? 'text-oxide' : 'text-muted group-focus-visible:text-oxide'
                    }`}
                  >
                    {entry.date} {entry.time}
                  </span>

                  <span className="tabular text-muted/70">{entry.words} words</span>

                  {/*
                   * Most entries cite nothing — the agent was often reflecting
                   * rather than researching — so a zero is left off rather
                   * than printed as an absence.
                   */}
                  {entry.sources > 0 && (
                    <span className="tabular text-muted/70">
                      {entry.sources} {entry.sources === 1 ? 'source' : 'sources'}
                    </span>
                  )}
                </span>

                <span
                  className={SHEET}
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <span className="overflow-hidden">
                    <span className="mt-3 block max-w-measure font-sans text-small text-ink">
                      {entry.text}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
