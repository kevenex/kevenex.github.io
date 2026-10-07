/*
 * Every word on the Projects page, in one place — the same rule as resume.ts
 * and ai.ts: the page lays it out and carries no copy of its own.
 *
 * Each project has a page of its own, and this one only points at it: GGP
 * Tracker at the app, Project Wick at its write-up. The lines below say no
 * more than each project's own write-up does, so the two cannot disagree on
 * a fact. Project Wick's write-up is being redone, so
 * its link is locked for now: the label says so and nothing is clickable.
 */

export const PROJECTS_BACK = { href: '/', label: 'Back to the site' };

export const PROJECTS_HERO = { title: 'Projects.' };

/**
 * What sits beside a project's text. A screenshot when there is a product to
 * show; a drawn diagram when what matters is how it works.
 */
export type ProjectVisual =
  | { kind: 'image'; src: string; alt: string; width: number; height: number }
  | { kind: 'wick-flow' };

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
    eyebrow: 'Poker analytics · Live app',
    title: 'GGP Tracker',
    mark: 'ggp',
    body: 'GGPoker shows what you won, not why, and deletes your hand histories after three months. GGP Tracker keeps every hand in a private archive and shows where you win, where you leak chips, and how much of it was luck.',
    /*
     * The app itself, served by kevenex/ggpoker-tracker's own Worker on its
     * route for kevink.im/ggpoker-tracker*. Absolute on purpose: that route
     * covers the apex only, and this site's Worker does not send www to the
     * apex, so a root-relative link clicked on www.kevink.im would fall to
     * this site's app shell and show the home page.
     */
    link: { href: 'https://kevink.im/ggpoker-tracker/', label: 'Open GGP Tracker' },
    visual: {
      kind: 'image',
      src: '/projects/ggp-tracker.webp',
      alt: 'GGP Tracker’s Key Stats panel: a win rate and eight preflop and flop figures as coloured rings, then the same figures by seat, on a made-up sample of tournaments.',
      width: 1600,
      height: 1000,
    },
  },
  {
    eyebrow: 'AI agent experiment',
    title: 'Project Wick',
    mark: 'wick',
    body: 'I gave an agent the open web, a place to write and no task, and let it run on its own for nineteen days.',
    link: { href: '/project-wick/', label: 'Write-up in progress', locked: true },
    visual: { kind: 'wick-flow' },
  },
];

export const PROJECTS_CLOSE = {
  text: 'If one of these is close to something you’re building, or you want to talk about a role:',
  link: { href: '/#contact', label: 'Get in touch' },
};
