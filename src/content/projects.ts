/*
 * Every word on the Projects page, in one place — the same rule as resume.ts
 * and ai.ts: the page lays it out and carries no copy of its own.
 *
 * Each project has a page of its own, and this one only points at it. The
 * lines below are taken from those pages rather than written fresh, so the
 * two cannot disagree on a fact. Project Wick's write-up is being redone, so
 * its link is locked for now: the label says so and nothing is clickable.
 */

export const PROJECTS_BACK = { href: '/', label: 'Back to the site' };

export const PROJECTS_HERO = { title: 'Projects.' };

/**
 * What sits beside a project's text. A screenshot when there is a product to
 * show; a drawn diagram when what matters is how it works.
 */
export type ProjectVisual =
  | { kind: 'image'; src: string; alt: string; caption: string; width: number; height: number }
  | { kind: 'wick-flow'; caption: string };

export interface Project {
  /** The mono line above the title, after its number. */
  eyebrow: string;
  title: string;
  /** Which drawn mark sits beside the title. */
  mark: 'ggp' | 'wick';
  body: string;
  /**
   * `locked` keeps the destination but renders the label without a link, for
   * a write-up that is not ready to be read. Unlocking is deleting the flag.
   */
  link: { href: string; label: string; locked?: boolean };
  visual: ProjectVisual;
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
    visual: {
      kind: 'image',
      src: '/projects/ggp-tracker.webp',
      alt: 'GGP Tracker’s Key Stats panel: a win rate and eight preflop and flop figures as coloured rings, then the same figures by seat, on a made-up sample of tournaments.',
      caption: 'The app on a sample I made up. None of these results are mine.',
      width: 1600,
      height: 1000,
    },
  },
  {
    eyebrow: 'AI agent experiment',
    title: 'Project Wick',
    mark: 'wick',
    body: 'I gave an agent the open web, a place to write and no task, and let it run on its own for nineteen days. It named itself, wrote 349 journal entries, and then stopped being curious.',
    link: { href: '/project-wick/', label: 'Write-up in progress', locked: true },
    visual: {
      kind: 'wick-flow',
      caption: 'One run. A single score decided whether it wrote anything at all.',
    },
  },
];

export const PROJECTS_CLOSE = {
  text: 'If one of these is close to something you’re building, or you want to talk about a role:',
  link: { href: '/#contact', label: 'Get in touch' },
};
