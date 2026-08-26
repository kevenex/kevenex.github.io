import wick from 'virtual:wick-summary';
import Spread, { type SpreadDatum } from './Spread';
import WickMark from './WickMark';

const number = (value: number) => value.toLocaleString('en-US');

/*
 * Figures come from the agent's own journal, read at build time and refreshed
 * by the daily deploy — no case-study copy can do what a real count and a real
 * last-run time do.
 *
 * The spread no longer claims the agent is running *now*: the heartbeat was
 * switched off on 2026-08-24 and the record has been thinning since. The
 * figures say what it did, and the pulled quote is whatever it last wrote,
 * which is a more honest live signal than a badge would be.
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
        { label: 'Cadence', value: '30 min' },
        { label: 'Author', value: 'The agent' },
      ];

  return (
    <Spread
      id="wick"
      ground="deep"
      title="Project Wick"
      thesis="An agent that woke every half hour for nineteen days, did one small thing, and
        wrote down what it found. It kept its own journal, its own wiki, and its own list of
        threads it had not finished pulling. Nobody edited any of them but the agent — and it
        stopped not because the loop broke, but because it ran out of things it wanted to know."
      data={data}
      href="/project-wick/"
      linkLabel="Open Project Wick"
      mark={<WickMark className="text-oxide" width={28} height={28} />}
    >
      {wick.available && wick.latest.text ? (
        <figure className="max-w-measure border-l border-oxide/40 pl-6">
          {/*
            * The amber dot is this site's live-state mark, and the agent is no
            * longer in a state that earns it — the heartbeat is off and the
            * record has been thinning for a week. A dated caption without the
            * mark says the same thing without claiming a pulse.
            */}
          <figcaption className="font-mono text-label uppercase text-muted">
            Last entry — {wick.latest.date} {wick.latest.time}
          </figcaption>

          <blockquote className="mt-4 font-serif text-lead text-ink">
            {wick.latest.text}
          </blockquote>

          {wick.openThread && (
            <p className="mt-6 max-w-measure font-mono text-data text-muted">
              Last open thread — {wick.openThread}
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
