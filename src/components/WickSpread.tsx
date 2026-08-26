import wick from 'virtual:wick-summary';
import Spread, { type SpreadDatum } from './Spread';

const number = (value: number) => value.toLocaleString('en-US');

/*
 * The one project on this page that is running right now, so the spread says
 * so with a timestamp. Figures come from the agent's own journal, read at
 * build time and refreshed by the daily deploy — no case-study copy can do
 * what a real last-run time does.
 */
export default function WickSpread() {
  const data: SpreadDatum[] = wick.available
    ? [
        { label: 'Entries', value: number(wick.totals.entries) },
        { label: 'Words', value: number(wick.totals.words) },
        { label: 'Days', value: number(wick.totals.days) },
        { label: 'Wiki pages', value: number(wick.totals.wikiPages) },
        { label: 'Last run', value: wick.lastRun },
        ...(wick.commit ? [{ label: 'Commit', value: wick.commit }] : []),
      ]
    : [
        { label: 'Cadence', value: 'Hourly' },
        { label: 'Author', value: 'The agent' },
      ];

  return (
    <Spread
      id="wick"
      ground="deep"
      title="Project Wick"
      thesis="An agent that wakes every hour, does one small thing, and writes down what it
        found. It keeps its own journal, its own wiki, and its own list of threads it has
        not finished pulling. Nobody edits any of them but the agent."
      data={data}
      href="/project-wick/"
      linkLabel="Open Project Wick"
    >
      {wick.available && wick.latest.text ? (
        <figure className="max-w-measure border-l border-oxide/40 pl-6">
          <figcaption className="flex items-center gap-2 font-mono text-label uppercase text-muted">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-amber-dot"
            />
            Most recent entry — {wick.latest.date} {wick.latest.time}
          </figcaption>

          <blockquote className="mt-4 font-serif text-lead text-ink">
            {wick.latest.text}
          </blockquote>

          {wick.openThread && (
            <p className="mt-6 font-mono text-data text-muted">
              Open thread — {wick.openThread}
            </p>
          )}
        </figure>
      ) : (
        <p className="max-w-measure font-mono text-data text-muted">
          Live figures unavailable at build time — the journal itself is still at
          /project-wick/journal/.
        </p>
      )}
    </Spread>
  );
}
