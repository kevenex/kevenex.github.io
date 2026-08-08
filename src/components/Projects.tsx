import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Plane, PenLine } from 'lucide-react';
import WickLogo from './WickLogo';
import { VIDEOS } from '../constants/videos';

/* Narrower than LucideIcon so the hand-drawn WickLogo can sit in the same slot. */
type CardIcon = ComponentType<{
  className?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
  'aria-hidden'?: boolean | 'true' | 'false';
}>;

/*
 * Three kinds of card, in descending order of readiness:
 *   `href` — a live link to a page.
 *   `cta`  — a real project you cannot open yet; renders a button instead.
 *   neither — an inert "Coming soon" placeholder rather than a dead link.
 * Wick deliberately has no href: the one-pager is unlisted, so the tile hints
 * at it without linking to it.
 */
interface Project {
  title: string;
  blurb: string;
  icon: CardIcon;
  href?: string;
  cta?: string;
}

const PROJECTS: Project[] = [
  {
    title: 'Flyer Fable',
    blurb: 'Fly a low-poly South Korea at true geographic scale, Seoul to Hallasan.',
    icon: Plane,
    href: '/flyer-fable/',
  },
  {
    title: 'Wick',
    blurb:
      'An agent that wakes every hour, does one small thing, and writes about it. Running quietly on a box somewhere.',
    icon: WickLogo,
    cta: 'Request early access',
  },
  {
    title: 'Experiments',
    blurb: 'Smaller things worth keeping — built to answer a question, then left running.',
    icon: FlaskConical,
  },
  {
    title: 'Writing',
    blurb: 'Notes on what broke, what worked, and what turned out to be the wrong problem.',
    icon: PenLine,
  },
];

/*
 * Deliberately translucent: the section's video keeps playing behind the cards,
 * so the fill is a light wash plus a blur rather than a solid panel. The border
 * is what gives them an edge — at this opacity the fill alone does not read as
 * one.
 */
const CARD_BASE =
  'relative flex h-full flex-col rounded-2xl border p-7 backdrop-blur-md sm:p-8';

export default function Projects() {
  return (
    <section id="projects" className="relative min-h-screen w-full overflow-hidden bg-black">
      <video
        src={VIDEOS.metrics}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-32 pt-32">
        <div className="mx-auto w-full max-w-6xl">
          <motion.p
            className="mb-14 text-center text-[13px] uppercase tracking-[0.2em] text-white/40 sm:mb-20 sm:text-[14px]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2 }}
          >
            Projects
          </motion.p>

          {/* Four cards do not divide into three columns, so the desktop row
              widens to four and tablets fall back to a 2×2 block rather than
              leaving one card stranded on its own row. */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {PROJECTS.map((project, index) => {
              const Icon = project.icon;
              /* A card with a CTA is a real project, so it gets the same
                 full-strength treatment as a linked one — only the genuine
                 placeholders are dimmed. */
              const active = Boolean(project.href || project.cta);

              const inner = (
                <>
                  <Icon
                    className={active ? 'text-white' : 'text-white/45'}
                    width={26}
                    height={26}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />

                  <h3
                    className={`mt-6 text-[20px] font-normal tracking-[-0.02em] sm:text-[23px] ${
                      active ? 'text-white' : 'text-white/55'
                    }`}
                  >
                    {project.title}
                  </h3>

                  <p
                    className={`mt-3 text-[13px] leading-relaxed sm:text-[14px] ${
                      active ? 'text-white/55' : 'text-white/35'
                    }`}
                  >
                    {project.blurb}
                  </p>

                  {project.cta ? (
                    <motion.button
                      type="button"
                      /* Deliberately inert: there is no destination yet. Wire
                         an onClick here when one exists. */
                      className="mt-7 self-start rounded-full bg-white px-4 py-2 text-[12px] font-medium text-black sm:mt-8"
                      whileHover={{ scale: 1.03, backgroundColor: '#e2e2e6' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {project.cta}
                    </motion.button>
                  ) : (
                    <span
                      className={`mt-7 text-[12px] uppercase tracking-[0.14em] sm:mt-8 ${
                        project.href ? 'text-white/70' : 'text-white/30'
                      }`}
                    >
                      {project.href ? 'Open →' : 'Coming soon'}
                    </span>
                  )}
                </>
              );

              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                >
                  {project.href ? (
                    <motion.a
                      href={project.href}
                      className={`${CARD_BASE} border-white/20 bg-white/10 transition-colors hover:border-white/35 hover:bg-white/[0.16]`}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    >
                      {inner}
                    </motion.a>
                  ) : (
                    /* No lift on hover for the CTA card: the button inside it is
                       the target, and a card that rises under the cursor reads
                       as one big click surface. */
                    <div
                      className={`${CARD_BASE} ${
                        project.cta
                          ? 'border-white/20 bg-white/10'
                          : 'border-white/10 bg-white/[0.06]'
                      }`}
                      aria-disabled={project.cta ? undefined : 'true'}
                    >
                      {inner}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
