import wick from 'virtual:wick-summary';
import Spread, { type SpreadDatum } from './Spread';
import WickMark from './WickMark';

const number = (value: number) => value.toLocaleString('en-US');

/*
 * Figures come from the agent's own journal, read at build time — a real
 * entry count and last-run time say more than case-study copy could.
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
      mark={<WickMark className="text-oxide" width={28} height={28} />}
    />
  );
}
