/*
 * Every word on the Projects page, in one place — the same rule as resume.ts
 * and ai.ts: the page lays it out and carries no copy of its own.
 *
 * Each project has a page of its own, and this one only points at it. The
 * lines below are taken from those pages rather than written fresh, so the
 * two cannot disagree on a fact.
 */

export const PROJECTS_BACK = { href: '/', label: 'Back to the site' };

export const PROJECTS_HERO = {
  title: 'Projects.',
  intro: [
    'Things I’ve built on my own time, mostly with AI.',
    'Each one has a write-up of its own: what I set out to find, the calls I made, and what came of it.',
  ],
};

export interface Project {
  /** The mono line above the title, after its number. */
  eyebrow: string;
  title: string;
  /** Which drawn mark sits beside the title. */
  mark: 'ggp' | 'wick';
  body: string;
  link: { href: string; label: string };
}

/** Newest first, like the career. */
export const PROJECTS: Project[] = [
  {
    eyebrow: 'Poker analytics · Build notes',
    title: 'GGP Tracker',
    mark: 'ggp',
    body: 'Was it the cards, or was it me? A private analytics tool for my own GGPoker tournaments, and the product decisions that turned out to matter more than the charts.',
    /*
     * Served by kevenex/ggpoker-tracker's own Worker, on its route for
     * kevink.im/ggpoker-tracker*, so this site's Worker never sees the path.
     * Root-relative on purpose: it is the same origin, so the theme carries.
     */
    link: { href: '/ggpoker-tracker/readme/', label: 'Read the build notes' },
  },
  {
    eyebrow: 'AI agent experiment',
    title: 'Project Wick',
    mark: 'wick',
    body: 'I gave an agent the open web, a place to write and no task, and let it run on its own for nineteen days. It named itself, wrote 349 journal entries, and then stopped being curious.',
    link: { href: '/project-wick/', label: 'Read about Project Wick' },
  },
];

export const PROJECTS_CLOSE = {
  text: 'If one of these is close to something you’re building, or you want to talk about a role:',
  link: { href: '/#contact', label: 'Get in touch' },
};
