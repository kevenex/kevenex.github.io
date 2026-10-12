/*
 * Every word on the How I use AI page, in one place — the same rule as
 * resume.ts: the page lays it out and carries no copy of its own.
 *
 * Only claims that are true and checkable. The projects link to themselves,
 * the tools are the ones Kevin actually uses, and nothing here names an
 * employer's systems.
 */

export const AI_BACK = { href: '/', label: 'Back to the site' };

export const AI_HERO = {
  title: 'How I use AI.',
  intro: [
    'I’m a product manager in data and AI, mostly in fintech. AI does the legwork so I can stay on the thinking, and it lets me take an idea further than I could build alone.',
    'I decide what the problem is, what holds up, and what goes out under my name.',
  ],
  jump: 'A few things I’ve been working on',
};

/** The in-page index under the hero, in reading order. */
export const AI_NAV = [
  { id: 'trying', label: 'What I’m trying' },
  { id: 'context', label: 'How I keep context' },
  { id: 'tools', label: 'What I reach for' },
];

export interface AiProject {
  /** The mono line above the title, after its number. */
  eyebrow: string;
  title: string;
  body: string;
  /** Read after "What I check:". */
  check?: string;
  /**
   * What it is built from and how it ships, in a frame under the link: a row
   * of parts per label, then the pipeline drawn by components/DeployFlow.tsx.
   */
  build?: {
    stack: { label: string; parts: string[] }[];
    flowLabel: string;
    caption: string;
  };
  /**
   * `locked` keeps the destination but renders the label without a link, for
   * a write-up that is not ready to be read. Unlocking is deleting the flag.
   */
  link: { href: string; label: string; locked?: boolean };
  image?: { src: string; alt: string; caption: string; width: number; height: number };
}

export const AI_TRYING = {
  heading: 'Find a problem, build something to try and solve it.',
  sub: 'The model is rarely the hard part. The hard part is finding a gap worth closing and deciding what a right answer looks like before anything gets built.',
  callout: {
    title: 'Define it, then build it.',
    body: 'When an idea comes up at work, I write down what a right answer looks like first: what counts, what doesn’t, and how I’d tell it was wrong. Then I build a rough version with AI tools and put it in front of the people who’d use it. A working screen gets better feedback than a document, and it shows where the idea breaks before engineering spends time on it.',
    quote: 'AI makes the first version cheap. Deciding what the numbers mean, and what to leave out, is still the job.',
  },
  projects: [
    {
      eyebrow: 'A data product, live',
      title: 'GGP Tracker',
      body: 'GGPoker shows you what you won, not why, and it deletes your hand histories after three months. So I built the tool I wanted: it imports GG’s own exports, keeps every hand in a private archive, and analyses the whole history instead of the last quarter. One design call keeps it cheap to run: one row per hand, with the detail nothing queries packed into a single column, fits about three years of heavy play in Supabase’s free tier. I built it with Claude Code, on top of an open-source poker engine.',
      // Absolute: the app's route covers the apex only. See the note in projects.ts.
      link: { href: 'https://kevink.im/ggpoker-tracker/', label: 'Open GGP Tracker' },
      image: {
        src: '/projects/ggp-tracker.webp',
        alt: 'GGP Tracker’s Key Stats panel: a win rate and eight preflop and flop figures as coloured rings, then the same figures by seat, on a made-up sample of tournaments.',
        caption: 'Key Stats on an invented sample of tournaments, not my own play.',
        width: 1600,
        height: 1000,
      },
    },
    {
      eyebrow: 'Live, and still being edited',
      title: 'This website',
      body: 'Built with Claude Code, mostly by talking it through. AI wrote the code and cut my Memoji out of the recordings. I supplied the experience and kept correcting the story.',
      link: { href: '/', label: 'See the site' },
      /*
       * Checked against the code, not memory: this repo's package.json,
       * wrangler.jsonc and deploy.yml, and kevenex/ggpoker-tracker's
       * Cargo.toml, web/package.json and deploy-web.yml. Change it when they do.
       */
      build: {
        stack: [
          { label: 'Built with', parts: ['Claude Code', 'GitHub'] },
          { label: 'This site', parts: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'] },
          { label: 'GGP Tracker', parts: ['Rust', 'WebAssembly', 'React', 'TypeScript', 'Vite', 'Supabase'] },
          { label: 'Hosted on', parts: ['Cloudflare Workers', 'GitHub Pages'] },
        ],
        flowLabel: 'How it ships',
        caption: 'Nothing ships by hand. Every merge here builds and deploys the site, GGP Tracker deploys itself from its own repo, and a daily job keeps the apps built elsewhere up to date.',
      },
    },
  ] satisfies AiProject[],
};

export const AI_CONTEXT = {
  heading: 'How I keep the context.',
  intro: 'An assistant is only as useful as what it knows about the work. I keep that written down where the work lives, so I’m not explaining it again each time.',
  items: [
    {
      title: 'Project files',
      body: 'A README or CLAUDE.md in each repo: what the project is, how it’s built, and the rules it keeps. The assistant reads it before it touches anything.',
      caption: 'README · CLAUDE.md',
    },
    {
      title: 'Reusable skills',
      body: 'Written instructions for a job I do often, so an assistant does it the same way each time.',
      caption: 'Skills',
    },
    {
      title: 'Memory on my own server',
      body: 'Hermes, the assistant I run on my own server, keeps notes between conversations, so we pick up where we left off.',
      caption: 'Hermes memory',
    },
  ],
};

export const AI_TOOLS = {
  heading: 'What I reach for.',
  items: [
    {
      use: 'Building things',
      tool: 'Claude Code',
      body: 'GGP Tracker, this site and Project Wick. I describe what I want, read what comes back, and keep correcting it until it’s right.',
    },
    {
      use: 'Thinking things through',
      tool: 'Claude',
      body: 'Another angle on a problem, a draft to react to, or the question I haven’t asked yet.',
    },
    {
      use: 'Making and testing',
      tool: 'Codex',
      body: 'For building and testing ideas in code.',
    },
    {
      use: 'Always on',
      tool: 'Hermes, on my own server',
      body: 'An assistant I can message any time, and a place to try out agents.',
    },
  ],
};

export const AI_CLOSE = {
  text: 'Building something and want to compare notes? Hiring for a product role in AI, data or fintech? I’d like to hear from you.',
  link: { href: '/#contact', label: 'Get in touch' },
};
