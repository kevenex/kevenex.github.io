import wick from 'virtual:wick-summary';
import JournalPlate from './JournalPlate';
import Spread, { type SpreadDatum } from './Spread';
import WickMark from './WickMark';

const number = (value: number) => value.toLocaleString('en-US');

/*
 * The date of the newest entry, not `lastRun`. The agent stamped
 * state/last-run.txt itself and stopped maintaining it days before it stopped
 * writing, so that field now names a run that is not the last one. The journal
 * page shows the stamp and says so; a six-row strip has no room for the
 * caveat, so it prints the figure that needs none.
 */
const day = (iso: string) => {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

/*
 * Figures come from the agent's own journal, read at build time — a real entry
 * count says more than case-study copy could. The run is over, so these are
 * final rather than current.
 */
export default function WickSpread() {
  const data: SpreadDatum[] = wick.available
    ? [
        { label: 'Entries', value: number(wick.totals.entries) },
        { label: 'Words', value: number(wick.totals.words) },
        { label: 'Days', value: number(wick.totals.days) },
        { label: 'Wiki pages', value: number(wick.totals.wikiPages) },
        ...(wick.latest.date ? [{ label: 'Last entry', value: day(wick.latest.date) }] : []),
        ...(wick.commit ? [{ label: 'Commit', value: wick.commit }] : []),
      ]
    : [
        // Nothing here can go stale: the run ended, so the span is fixed.
        { label: 'Ran', value: 'Aug 8 – 26, 2026' },
        { label: 'Author', value: 'The agent' },
      ];

  return (
    <Spread
      id="wick"
      ground="deep"
      title="Project Wick"
      thesis="An agent that woke on a cron for nineteen days, researched one thing, decided for
        itself whether it was worth an entry, and wrote it down in first person. It kept its own
        journal, its own wiki, and its own list of threads it had not finished pulling — and
        nobody edited any of them but the agent. It developed real self-awareness. Its curiosity
        died anyway."
      data={data}
      href="/project-wick/"
      linkLabel="Open Project Wick"
      mark={<WickMark className="text-oxide" width={28} height={28} />}
    >
      {/*
       * Gated on there being entries rather than rendered empty: Spread only
       * lays out a plate when it is given one, so an unreadable journal costs
       * the spread its plate instead of leaving a labelled gap where the
       * evidence should be.
       */}
      {wick.entries.length > 0 && <JournalPlate entries={wick.entries} />}
    </Spread>
  );
}
