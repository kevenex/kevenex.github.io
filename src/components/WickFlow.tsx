/*
 * Project Wick at a glance: one run, start to finish, for the Projects page.
 *
 * A simplification of the "How it worked" diagram on /project-wick/, which is
 * the source of truth — change that one first and bring this along. Only the
 * run is drawn. The heartbeat between runs is left out, and so is the
 * cadence: the one-pager itself says the schedule drifted from thirty minutes
 * to over two hours, and a figure this small has nowhere to put that caveat.
 *
 * The shape carries the point. Three steps run left to right into the one
 * judgment call (outlined in oxide, the only accent in the figure), then the
 * path turns back on itself: a zero ends the run with nothing written, and
 * anything above it has to become a position before it can become an entry.
 * Underneath sit the three folders that were the agent's entire memory.
 *
 * Every colour is a token class, so it follows the theme with no `dark:`
 * variant, and every stroke is non-scaling, so the hairlines stay hairlines
 * at whatever width the column gives it. Below its minimum width the frame
 * that holds it scrolls rather than shrinking the type past reading.
 */

const W = 150;
const H = 58;

/** A step: its name in the working voice, a machine-voice line under it. */
function Step({
  x,
  y,
  title,
  sub,
  accent = false,
}: {
  x: number;
  y: number;
  title: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={W}
        height={H}
        vectorEffect="non-scaling-stroke"
        className={accent ? 'fill-paper stroke-oxide' : 'fill-paper stroke-ink/25'}
      />
      <text x={x + 12} y={y + 25} fontSize={14} className="fill-ink font-sans">
        {title}
      </text>
      <text x={x + 12} y={y + 44} fontSize={10} letterSpacing={0.5} className="fill-muted font-mono">
        {sub}
      </text>
    </g>
  );
}

/** A folder: storage, so it sits on the deeper paper rather than reading as a step. */
function Folder({ x, name, sub }: { x: number; name: string; sub: string }) {
  return (
    <g>
      <rect
        x={x}
        y={232}
        width={W}
        height={52}
        vectorEffect="non-scaling-stroke"
        className="fill-paper-deep stroke-ink/15"
      />
      <text x={x + 12} y={254} fontSize={12.5} className="fill-ink font-mono">
        {name}
      </text>
      <text x={x + 12} y={272} fontSize={10} letterSpacing={0.5} className="fill-muted font-mono">
        {sub}
      </text>
    </g>
  );
}

const LINE = 'fill-none stroke-ink/40';

export default function WickFlow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 292"
      role="img"
      aria-label="One run of Project Wick. It wakes up, searches the web, then rates its interest from 0 to 10. A zero ends the run with no entry. Anything higher, it takes a position, then writes a journal entry, plus a wiki page at 7 or above. Its whole memory was three folders, journal, state and wiki, read at every run."
      className={`h-auto w-full ${className}`}
    >
      <defs>
        {/* One instance per page, so a fixed id is safe. */}
        <marker
          id="wick-flow-arrow"
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0.5 L7.5 4 L0 7.5 Z" className="fill-ink/50" />
        </marker>
      </defs>

      {/* Row one, left to right: into the judgment call. */}
      <Step x={0} y={8} title="Wakes up" sub="ON A SCHEDULE" />
      <Step x={185} y={8} title="Searches the web" sub="1 TO 3 SEARCHES" />
      <Step x={370} y={8} title="Rates interest" sub="0 TO 10" accent />

      <path d="M150 37 H181" vectorEffect="non-scaling-stroke" className={LINE} markerEnd="url(#wick-flow-arrow)" />
      <path d="M335 37 H366" vectorEffect="non-scaling-stroke" className={LINE} markerEnd="url(#wick-flow-arrow)" />

      {/* A zero drops out: no entry, and the run ends there. */}
      <path d="M482 66 V96" vectorEffect="non-scaling-stroke" className={LINE} markerEnd="url(#wick-flow-arrow)" />
      <text x={490} y={86} fontSize={11} className="fill-oxide font-mono">
        0
      </text>
      <text x={482} y={116} fontSize={10} letterSpacing={0.5} textAnchor="middle" className="fill-muted font-mono">
        NO ENTRY
      </text>
      <text x={482} y={130} fontSize={10} letterSpacing={0.5} textAnchor="middle" className="fill-muted font-mono">
        RUN ENDS
      </text>

      {/* Anything above it turns back along row two. */}
      <path
        d="M412 66 V137 H339"
        vectorEffect="non-scaling-stroke"
        className={LINE}
        markerEnd="url(#wick-flow-arrow)"
      />
      <text x={420} y={86} fontSize={11} className="fill-oxide font-mono">
        1+
      </text>

      <Step x={185} y={108} title="Takes a position" sub="I THINK X BECAUSE Y" />
      <Step x={0} y={108} title="Writes an entry" sub="+ WIKI PAGE AT 7+" />

      <path d="M185 137 H154" vectorEffect="non-scaling-stroke" className={LINE} markerEnd="url(#wick-flow-arrow)" />

      {/* What it wrote to, and all it had to remember with. */}
      <path
        d="M75 166 V228"
        vectorEffect="non-scaling-stroke"
        className={`${LINE} [stroke-dasharray:3_3]`}
        markerEnd="url(#wick-flow-arrow)"
      />
      <text x={83} y={204} fontSize={10} letterSpacing={0.5} className="fill-muted font-mono">
        WRITES
      </text>
      <text x={185} y={204} fontSize={10} letterSpacing={0.5} className="fill-muted font-mono">
        ITS WHOLE MEMORY · READ EVERY RUN
      </text>

      <Folder x={0} name="journal/" sub="ONE FILE A DAY" />
      <Folder x={185} name="state/" sub="IDENTITY · THREADS" />
      <Folder x={370} name="wiki/" sub="WHAT IT KEEPS" />
    </svg>
  );
}
