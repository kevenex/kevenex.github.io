import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Cat, FlaskConical, Plane } from 'lucide-react';
import { VIDEOS } from '../constants/videos';
import WickMark from './WickMark';

/*
 * Lucide icons and the hand-drawn Wick mark both satisfy this, which is the
 * point: a project with its own mark should not need a different card.
 */
type ProjectIcon = ComponentType<{
  className?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}>;

/*
 * A card with an `href` is a live link; one without renders as an inert
 * placeholder rather than a dead link. Adding a page later is a one-line
 * change — give the entry its href. `locked` marks a card whose page exists
 * and is still reachable by direct URL, but that we don't want surfaced (and
 * therefore linked) from the home page — it renders inert like a
 * "Coming soon" card, just labeled "Locked" instead.
 */
interface Project {
  title: string;
  blurb: string;
  icon: ProjectIcon;
  href?: string;
  locked?: boolean;
}

const PROJECTS: Project[] = [
  {
    title: 'Flyer Fable',
    blurb: 'Fly a low-poly South Korea at true geographic scale, Seoul to Hallasan.',
    icon: Plane,
    href: '/flyer-fable/',
  },
  {
    title: 'Project Wick',
    blurb: 'An agent that wakes every half hour, does one small thing, and writes about it.',
    icon: WickMark,
    locked: true,
  },
  {
    title: 'Project Chloe',
    blurb: 'A calico cat you can pet and feed — an interactive pet game, early in development.',
    icon: Cat,
    locked: true,
  },
  {
    title: 'Experiments',
    blurb: 'Smaller things worth keeping — built to answer a question, then left running.',
    icon: FlaskConical,
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
            className="mb-14 text-center text-[13px] uppercase tracking-[0.2em] text-white/75 sm:mb-20 sm:text-[14px]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2 }}
          >
            Projects
          </motion.p>

          {/* Four cards: two up at tablet, one row of four once there is room.
              Three-across would strand the fourth on a row of its own. */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {PROJECTS.map((project, index) => {
              const Icon = project.icon;

              const inner = (
                <>
                  <Icon
                    className={project.href ? 'text-white' : 'text-white/45'}
                    width={26}
                    height={26}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />

                  <h3
                    className={`mt-6 text-[20px] font-normal tracking-[-0.02em] sm:text-[23px] ${
                      project.href ? 'text-white' : 'text-white/55'
                    }`}
                  >
                    {project.title}
                  </h3>

                  <p
                    className={`mt-3 text-[13px] leading-relaxed sm:text-[14px] ${
                      project.href ? 'text-white/55' : 'text-white/35'
                    }`}
                  >
                    {project.blurb}
                  </p>

                  <span
                    className={`mt-7 text-[12px] uppercase tracking-[0.14em] sm:mt-8 ${
                      project.href ? 'text-white/70' : 'text-white/30'
                    }`}
                  >
                    {project.href ? 'Open →' : project.locked ? 'Locked' : 'Coming soon'}
                  </span>
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
                    <div
                      className={`${CARD_BASE} border-white/10 bg-white/[0.06]`}
                      aria-disabled="true"
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
