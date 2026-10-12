/*
 * How this site ships, for the "This website" entry on How I use AI.
 *
 * The pipeline is the source of truth, not this figure: Cloudflare Workers
 * Builds on kevink-im (it posts the "Workers Builds: kevink-im" check),
 * wrangler.jsonc, and .github/workflows/deploy.yml. Change those first and
 * bring this along.
 *
 * The shape carries the point. The top row is a change on its way out, and
 * it turns down into the one thing a reader can open: kevink.im, outlined in
 * oxide, the only accent in the figure. The bottom row is the part nobody
 * starts: the workflow runs on every merge and on a schedule, commits what it
 * pulled back to GitHub (dashed, because it is a commit rather than a build),
 * and that commit goes out along the top row like any other. The sibling
 * apps are left unnamed: one is unlisted and the other is off this page.
 *
 * Built the way WickFlow is: token classes only, so it follows the theme with
 * no `dark:` variant, and non-scaling strokes, so the hairlines stay
 * hairlines. Below its minimum width the frame that holds it scrolls.
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

const LINE = 'fill-none stroke-ink/40';

/** A small mono note beside a connector. */
function Note({ x, y, children, end = false }: { x: number; y: number; children: string; end?: boolean }) {
  return (
    <text
      x={x}
      y={y}
      fontSize={10}
      letterSpacing={0.5}
      textAnchor={end ? 'end' : 'start'}
      className="fill-muted font-mono"
    >
      {children}
    </text>
  );
}

export default function DeployFlow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 274"
      role="img"
      aria-label="How this site ships. Claude Code writes the change and it goes to GitHub for review and a merge. Cloudflare builds every merge and deploys it to kevink.im. GitHub Actions also runs on every merge and once a day at 06:17 UTC: it pulls in the apps built in sibling repositories, commits them back to GitHub, which sends them out the same way, and publishes a static mirror to GitHub Pages."
      className={`h-auto w-full ${className}`}
    >
      <defs>
        {/* One instance per page, so a fixed id is safe. */}
        <marker
          id="deploy-flow-arrow"
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

      {/* Row one: a change on its way out, turning down into the live site. */}
      <Step x={0} y={8} title="Claude Code" sub="WRITES THE CHANGE" />
      <Step x={185} y={8} title="GitHub" sub="REVIEW, THEN MERGE" />
      <Step x={370} y={8} title="Cloudflare" sub="BUILDS AND DEPLOYS" />

      <path d="M150 37 H181" vectorEffect="non-scaling-stroke" className={LINE} markerEnd="url(#deploy-flow-arrow)" />
      <path d="M335 37 H366" vectorEffect="non-scaling-stroke" className={LINE} markerEnd="url(#deploy-flow-arrow)" />
      <path d="M445 66 V104" vectorEffect="non-scaling-stroke" className={LINE} markerEnd="url(#deploy-flow-arrow)" />

      <Step x={370} y={108} title="kevink.im" sub="THE LIVE SITE" accent />

      {/* Every merge starts the workflow; what it pulls in goes back as a commit. */}
      <path d="M235 66 V204" vectorEffect="non-scaling-stroke" className={LINE} markerEnd="url(#deploy-flow-arrow)" />
      <Note x={227} y={140} end>
        ON MERGE
      </Note>

      <path
        d="M285 208 V70"
        vectorEffect="non-scaling-stroke"
        className={`${LINE} [stroke-dasharray:3_3]`}
        markerEnd="url(#deploy-flow-arrow)"
      />
      <Note x={293} y={133}>
        COMMITS
      </Note>
      <Note x={293} y={147}>
        SNAPSHOTS
      </Note>

      {/* Row three: the part nobody starts. */}
      <Step x={0} y={208} title="On a schedule" sub="DAILY · 06:17 UTC" />
      <Step x={185} y={208} title="GitHub Actions" sub="PULLS SIBLING APPS" />
      <Step x={370} y={208} title="GitHub Pages" sub="A STATIC MIRROR" />

      <path d="M150 237 H181" vectorEffect="non-scaling-stroke" className={LINE} markerEnd="url(#deploy-flow-arrow)" />
      <path d="M335 237 H366" vectorEffect="non-scaling-stroke" className={LINE} markerEnd="url(#deploy-flow-arrow)" />
    </svg>
  );
}
