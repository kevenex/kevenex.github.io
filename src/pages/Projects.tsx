import { motion } from 'framer-motion';
import Colophon from '../components/Colophon';
import Cursor from '../components/Cursor';
import DrawnLink from '../components/DrawnLink';
import GgpMark from '../components/GgpMark';
import KevinKLogo from '../components/KevinKLogo';
import LockedLink from '../components/LockedLink';
import ThemeToggle from '../components/ThemeToggle';
import WickFlow from '../components/WickFlow';
import WickMark from '../components/WickMark';
import {
  PROJECTS,
  PROJECTS_BACK,
  PROJECTS_CLOSE,
  PROJECTS_HERO,
  type Project,
  type ProjectVisual,
} from '../content/projects';
import { RAIL_PAD, RAIL_PAD_R, useReveal } from '../lib/layout';
import { LenisProvider } from '../lib/lenis';

/*
 * Projects, at /projects/. An index, not a showcase: each project already has
 * a page of its own, so this one says what each is in a line or two, shows
 * one picture of it, and points there. The same grammar as How I use AI — paper ground, the left
 * rail inset, three voices, hairlines, drawn-rule links, the dark colophon —
 * and, like it, no spine or rail, because there is nothing here to scrub.
 *
 * All copy is in content/projects.ts.
 */

/** Content width for the page: the rail inset on the left, the toggle's gutter on the right. */
const COLUMN = `${RAIL_PAD} ${RAIL_PAD_R}`;

/**
 * The header's right edge clears the fixed theme toggle at every width,
 * not just at lg where RAIL_PAD_R happens to.
 */
const HEADER_R = 'pr-24 lg:pr-48';

const MARKS = { ggp: GgpMark, wick: WickMark } satisfies Record<Project['mark'], unknown>;

/*
 * The picture beside a project, in the hairline frame How I use AI gives its
 * screenshots: a page set apart, not a panel with a shadow. The diagram gets
 * the same frame so the two entries read as a pair, and scrolls inside it on
 * a phone rather than shrinking its type past reading.
 */
function Visual({ visual }: { visual: ProjectVisual }) {
  return (
    <figure className="min-w-0">
      {visual.kind === 'image' ? (
        <img
          src={visual.src}
          alt={visual.alt}
          width={visual.width}
          height={visual.height}
          loading="lazy"
          decoding="async"
          className="h-auto w-full border border-ink/15"
        />
      ) : (
        <div className="overflow-x-auto border border-ink/15 p-5 sm:p-6">
          <WickFlow className="min-w-[440px]" />
        </div>
      )}
      <figcaption className="mt-3 font-sans text-small text-muted">{visual.caption}</figcaption>
    </figure>
  );
}

/*
 * Text and picture side by side from xl, where the column is wide enough for
 * both to be read; below that they stack, text first, since at lg the column
 * is about 650px and either half would be squeezed. The picture takes three
 * fifths: at 1280 that is just enough for the diagram to sit unscrolled.
 */
function Entry({ project, index }: { project: Project; index: number }) {
  const reveal = useReveal();
  const number = String(index + 1).padStart(2, '0');
  const Mark = MARKS[project.mark];

  return (
    <motion.article
      className="grid gap-y-12 border-t border-ink/15 pt-12 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:items-start xl:gap-x-16"
      {...reveal}
    >
      <div>
        <p className="font-mono text-label uppercase text-muted">
          <span className="tabular">{number}</span> / {project.eyebrow}
        </p>

        <div className="mt-5 flex items-center gap-4">
          <Mark className="h-8 w-8 shrink-0 text-oxide" />
          <h2 className="font-serif text-[clamp(34px,4vw,48px)] leading-[1.05] tracking-[-0.01em]">
            {project.title}
          </h2>
        </div>

        <p className="mt-6 max-w-measure font-sans text-body text-ink">{project.body}</p>

        {project.link.locked ? (
          <LockedLink className="mt-8">{project.link.label}</LockedLink>
        ) : (
          <DrawnLink href={project.link.href} className="mt-8">
            {project.link.label}&nbsp;&#8599;
          </DrawnLink>
        )}
      </div>

      <Visual visual={project.visual} />
    </motion.article>
  );
}

function Page() {
  const reveal = useReveal();

  return (
    <main className="min-h-screen w-full bg-paper text-ink">
      <header
        id="top"
        className={`flex items-center justify-between gap-6 border-b border-ink/15 py-6 ${RAIL_PAD} ${HEADER_R}`}
      >
        {/* The name drops below sm, where it and the back link would both wrap beside the toggle. */}
        <a
          href={PROJECTS_BACK.href}
          aria-label="Kevin Kim"
          className="flex items-center gap-3 font-mono text-label uppercase text-muted outline-none transition-colors hover:text-oxide focus-visible:text-oxide"
        >
          <KevinKLogo width={18} height={18} />
          <span className="hidden sm:inline">Kevin Kim</span>
        </a>
        <DrawnLink href={PROJECTS_BACK.href} className="whitespace-nowrap">
          {PROJECTS_BACK.label}&nbsp;&#8599;
        </DrawnLink>
      </header>

      <section className={`pt-20 sm:pt-28 ${COLUMN}`}>
        <motion.h1 className="font-serif text-hero" {...reveal}>
          {PROJECTS_HERO.title}
        </motion.h1>
      </section>

      <section className={`flex flex-col gap-24 pt-24 sm:pt-32 ${COLUMN}`}>
        {PROJECTS.map((project, index) => (
          <Entry key={project.title} project={project} index={index} />
        ))}
      </section>

      {/* A way to get in touch. */}
      <section className={`py-32 sm:py-40 ${COLUMN}`}>
        <motion.div className="flex max-w-3xl items-center gap-8" {...reveal}>
          <img
            src="/memoji/grin.webp"
            alt=""
            width={356}
            height={356}
            loading="lazy"
            decoding="async"
            className="aspect-square h-auto w-24 shrink-0 sm:w-32"
          />
          <div>
            <p className="max-w-measure font-sans text-lead text-ink">{PROJECTS_CLOSE.text}</p>
            <DrawnLink href={PROJECTS_CLOSE.link.href} className="mt-6">
              {PROJECTS_CLOSE.link.label}&nbsp;&#8599;
            </DrawnLink>
          </div>
        </motion.div>
      </section>

      <Colophon top="#top" />
    </main>
  );
}

export default function Projects() {
  return (
    <LenisProvider>
      <Cursor />
      <ThemeToggle />
      <Page />
    </LenisProvider>
  );
}
