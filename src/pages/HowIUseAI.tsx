import { type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { Hammer } from 'lucide-react';
import Colophon from '../components/Colophon';
import Cursor from '../components/Cursor';
import DrawnLink from '../components/DrawnLink';
import KevinKLogo from '../components/KevinKLogo';
import LockedLink from '../components/LockedLink';
import ThemeToggle from '../components/ThemeToggle';
import {
  AI_BACK,
  AI_CLOSE,
  AI_CONTEXT,
  AI_HERO,
  AI_NAV,
  AI_TOOLS,
  AI_TRYING,
  type AiProject,
} from '../content/ai';
import { RAIL_PAD, RAIL_PAD_R, useReveal } from '../lib/layout';
import { LenisProvider } from '../lib/lenis';
import { useScrollTo } from '../lib/lenis-context';

/*
 * How I use AI, at /how-i-use-ai/. A sub-page in the home page's grammar —
 * paper ground, the same left rail inset, three voices, hairlines, the
 * drawn-rule links, the dark colophon to close — but no spine, rail or year
 * counter: it is one essay read top to bottom, not a map to scrub.
 *
 * Structure: what it is, two things built with it, how the context is
 * kept, the tools, and a way to get in touch. All copy is in content/ai.ts.
 */

/** Content width for the page: the rail inset on the left, the toggle's gutter on the right. */
const COLUMN = `${RAIL_PAD} ${RAIL_PAD_R}`;

/**
 * The header's right edge clears the fixed theme toggle at every width,
 * not just at lg where RAIL_PAD_R happens to.
 */
const HEADER_R = 'pr-24 lg:pr-48';

function Project({ project, index }: { project: AiProject; index: number }) {
  const reveal = useReveal();
  const number = String(index + 1).padStart(2, '0');

  return (
    <motion.article className="mt-24 border-t border-ink/15 pt-12" {...reveal}>
      <p className="font-mono text-label uppercase text-muted">
        <span className="tabular">{number}</span> / {project.eyebrow}
      </p>
      <h3 className="mt-4 font-serif text-[clamp(34px,4vw,48px)] leading-[1.05] tracking-[-0.01em]">
        {project.title}
      </h3>

      <p className="mt-6 max-w-measure font-sans text-body text-ink">{project.body}</p>

      {project.check && (
        <p className="mt-4 max-w-measure font-sans text-body text-muted">
          <span className="text-ink">What I check:</span> {project.check}
        </p>
      )}

      {project.detail && (
        <>
          <blockquote className="mt-10 max-w-measure border-l-2 border-oxide pl-6 sm:pl-8">
            <p className="font-mono text-label uppercase text-oxide">{project.detail.label}</p>
            <p className="mt-4 font-serif text-[clamp(24px,2.6vw,32px)] leading-snug text-ink">
              {project.detail.quote}
            </p>
          </blockquote>
          <p className="mt-8 max-w-measure font-sans text-body text-muted">{project.detail.after}</p>
        </>
      )}

      {project.link.locked ? (
        <LockedLink className="mt-8">{project.link.label}</LockedLink>
      ) : (
        <DrawnLink href={project.link.href} className="mt-8">
          {project.link.label}&nbsp;&#8599;
        </DrawnLink>
      )}

      {project.image && (
        <figure className="mt-12">
          {/*
           * A hairline frame on the same paper, the Plusgrade card's rule:
           * a page set apart, not a panel with a shadow.
           */}
          <img
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            loading="lazy"
            decoding="async"
            className="h-auto w-full max-w-4xl border border-ink/15"
          />
          <figcaption className="mt-3 font-sans text-small text-muted">
            {project.image.caption}
          </figcaption>
        </figure>
      )}
    </motion.article>
  );
}

function Page() {
  const reveal = useReveal();
  const scrollTo = useScrollTo();

  /*
   * Real anchors, routed through Lenis on click so the jump eases like every
   * other in-page move; without JavaScript they are ordinary fragment links.
   */
  const jump = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollTo(`#${id}`);
  };

  return (
    <main className="min-h-screen w-full bg-paper text-ink">
      <header
        id="top"
        className={`flex items-center justify-between gap-6 border-b border-ink/15 py-6 ${RAIL_PAD} ${HEADER_R}`}
      >
        {/* The name drops below sm, where it and the back link would both wrap beside the toggle. */}
        <a
          href={AI_BACK.href}
          aria-label="Kevin Kim"
          className="flex items-center gap-3 font-mono text-label uppercase text-muted outline-none transition-colors hover:text-oxide focus-visible:text-oxide"
        >
          <KevinKLogo width={18} height={18} />
          <span className="hidden sm:inline">Kevin Kim</span>
        </a>
        <DrawnLink href={AI_BACK.href} className="whitespace-nowrap">
          {AI_BACK.label}&nbsp;&#8599;
        </DrawnLink>
      </header>

      {/* What it is. */}
      <section className={`pt-20 sm:pt-28 ${COLUMN}`}>
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
          <motion.div {...reveal}>
            <h1 className="font-serif text-hero">{AI_HERO.title}</h1>

            <div className="mt-10 flex max-w-measure flex-col gap-5 font-sans text-lead">
              <p className="text-ink">{AI_HERO.intro[0]}</p>
              <p className="text-muted">{AI_HERO.intro[1]}</p>
            </div>

            <DrawnLink href="#trying" onClick={jump('trying')} className="mt-10">
              {AI_HERO.jump}&nbsp;&#8595;
            </DrawnLink>
          </motion.div>

          {/*
           * The thinking face, cut from the same recordings as the hero's
           * Memoji. Decorative: the page says who it is in its title.
           */}
          <img
            src="/memoji/thinking.webp"
            alt=""
            width={309}
            height={309}
            decoding="async"
            className="hidden aspect-square h-auto w-[200px] lg:block xl:w-[240px]"
          />
        </div>

        <nav aria-label="On this page" className="mt-20 border-y border-ink/15">
          <ul className="flex flex-col gap-1 py-4 font-mono text-label uppercase sm:flex-row sm:justify-between sm:gap-6">
            {AI_NAV.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={jump(id)}
                  className="inline-block py-1 text-muted outline-none transition-colors hover:text-oxide focus-visible:text-oxide"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* What I'm trying. */}
      <section id="trying" className={`scroll-mt-8 pt-28 sm:pt-36 ${COLUMN}`}>
        <motion.h2 className="max-w-[20ch] font-serif text-section" {...reveal}>
          {AI_TRYING.heading}
        </motion.h2>
        <motion.p className="mt-6 max-w-measure font-sans text-lead text-muted" {...reveal}>
          {AI_TRYING.sub}
        </motion.p>

        <motion.div className="mt-14 max-w-measure border-l-2 border-oxide pl-6 sm:pl-10" {...reveal}>
          <span
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-oxide text-oxide"
          >
            <Hammer strokeWidth={1.5} className="h-5 w-5" />
          </span>
          <h3 className="mt-6 font-serif text-[clamp(28px,3vw,38px)] leading-tight">
            {AI_TRYING.callout.title}
          </h3>
          <p className="mt-4 font-sans text-body text-ink">{AI_TRYING.callout.body}</p>
          <p className="mt-8 font-serif text-[clamp(22px,2.4vw,28px)] leading-snug text-oxide">
            {AI_TRYING.callout.quote}
          </p>
        </motion.div>

        {AI_TRYING.projects.map((project, index) => (
          <Project key={project.title} project={project} index={index} />
        ))}
      </section>

      {/* How I keep the context. */}
      <section id="context" className={`scroll-mt-8 pt-32 sm:pt-40 ${COLUMN}`}>
        <motion.h2 className="font-serif text-section" {...reveal}>
          {AI_CONTEXT.heading}
        </motion.h2>
        <motion.p className="mt-6 max-w-measure font-sans text-lead text-muted" {...reveal}>
          {AI_CONTEXT.intro}
        </motion.p>

        <ol className="mt-14 max-w-3xl border-t border-ink/15">
          {AI_CONTEXT.items.map(({ title, body, caption }, index) => (
            <motion.li
              key={title}
              className="border-b border-ink/15 py-10"
              {...reveal}
              transition={{ ...reveal.transition, delay: index * 0.06 }}
            >
              <p className="tabular font-serif text-[32px] italic leading-none text-oxide">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 font-serif text-[clamp(26px,2.8vw,34px)] leading-tight">{title}</h3>
              <p className="mt-3 max-w-measure font-sans text-body text-muted">{body}</p>
              <p className="mt-4 font-mono text-label uppercase text-muted">{caption}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* What I reach for. */}
      <section id="tools" className={`scroll-mt-8 pt-32 sm:pt-40 ${COLUMN}`}>
        <motion.h2 className="font-serif text-section" {...reveal}>
          {AI_TOOLS.heading}
        </motion.h2>

        <ul className="mt-14 max-w-3xl border-t border-ink/15">
          {AI_TOOLS.items.map(({ use, tool, body }, index) => (
            <motion.li
              key={tool}
              className="border-b border-ink/15 py-10"
              {...reveal}
              transition={{ ...reveal.transition, delay: index * 0.06 }}
            >
              <h3 className="font-serif text-[clamp(26px,2.8vw,34px)] leading-tight">{use}</h3>
              <p className="mt-4 font-sans text-[19px] font-medium leading-snug text-ink">{tool}</p>
              <p className="mt-2 max-w-measure font-sans text-body text-muted">{body}</p>
            </motion.li>
          ))}
        </ul>
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
            <p className="max-w-measure font-sans text-lead text-ink">{AI_CLOSE.text}</p>
            <DrawnLink href={AI_CLOSE.link.href} className="mt-6">
              {AI_CLOSE.link.label}&nbsp;&#8599;
            </DrawnLink>
          </div>
        </motion.div>
      </section>

      <Colophon top="#top" />
    </main>
  );
}

export default function HowIUseAI() {
  return (
    <LenisProvider>
      <Cursor />
      <ThemeToggle />
      <Page />
    </LenisProvider>
  );
}
