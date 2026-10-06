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
    'I’m a product manager working on data and AI, mostly in fintech. I use AI to think a problem through, build a rough version I can put in front of people, and catch what I missed. Sometimes that turns into a prototype for work. Sometimes it turns into a game, an agent, or this website.',
    'It does a lot of the typing. I decide what the problem is, what holds up, and what goes out under my name.',
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
  /** A pull-quote set apart from the body, with its own small label. */
  detail?: { label: string; quote: string; after: string };
  /**
   * `locked` keeps the destination but renders the label without a link, for
   * a write-up that is not ready to be read. Unlocking is deleting the flag.
   */
  link: { href: string; label: string; locked?: boolean };
  image?: { src: string; alt: string; caption: string; width: number; height: number };
}

export const AI_TRYING = {
  heading: 'From a question to something useful.',
  sub: 'Sometimes that means a prototype before a meeting. Sometimes it turns into something I keep building.',
  callout: {
    title: 'Before the spec.',
    body: 'When an idea comes up at work, I build a rough version with AI tools before anyone writes a spec. People give better feedback on a working screen than on a document, and it shows quickly whether the idea holds up before engineering spends time on it.',
    quote: 'A prototype shows whether an idea works. Whether anyone needs it is still a question for the people who’d use it.',
  },
  projects: [
    {
      eyebrow: 'An agent I ran',
      title: 'Project Wick',
      body: 'I gave an agent internet access, a place to write and nothing to finish, and let it run on a server for nineteen days. It named itself, wrote 349 journal entries, and then stopped being curious.',
      check:
        'what it can do without asking. It could write to three folders and nothing else. Git, posting, spending and deleting had no tool at all, so the only way to any of them was to ask me.',
      // The write-up is being redone, so the way in is shut for now.
      link: { href: '/project-wick/', label: 'Write-up in progress', locked: true },
      image: {
        src: '/ai/project-wick.webp',
        alt: 'The Project Wick page, headed “Give an agent the internet and no task. See what it does with it.”',
        caption: 'The one-pager. The journal behind it has every entry the agent wrote.',
        width: 1600,
        height: 1000,
      },
    },
    {
      eyebrow: 'A game in the browser',
      title: 'Flyer Fable',
      body: 'A stylized first-person flight over South Korea that runs in the browser, with landmarks along the way and quick hops between cities from Seoul to Jeju. I built it with Claude Code, one version at a time.',
      check:
        'what it gets confidently wrong. A landmark in the wrong place still looks convincing, so the map gets checked as well as the code.',
      link: { href: '/flyer-fable/', label: 'Try Flyer Fable' },
      image: {
        src: '/ai/flyer-fable.webp',
        alt: 'Flyer Fable mid-flight over Seoul, with Lotte World Tower and N Seoul Tower labelled and Incheon on the coast.',
        caption: 'Over Seoul, with Incheon on the coast to the right.',
        width: 1600,
        height: 1000,
      },
    },
    {
      eyebrow: 'Live, and still being edited',
      title: 'This website',
      body: 'Built with Claude Code, mostly by talking it through. AI wrote the code and cut my Memoji out of the recordings. I supplied the experience and kept correcting the story.',
      detail: {
        label: 'A detail that matters',
        quote: 'Every outcome on the home page is mine. The numbers stay on my résumé; the page keeps the judgment behind them.',
        after: 'When I reread a draft, the question is whether I’d say it that way in an interview. If I wouldn’t, it goes.',
      },
      link: { href: '/', label: 'See the site' },
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
      title: 'Memory on the VPS',
      body: 'Hermes keeps notes between conversations, so the assistant I message picks up where we left off.',
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
      body: 'This site, Flyer Fable and Project Wick. I describe what I want, read what comes back, and keep correcting it until it’s right.',
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
      tool: 'Hermes, on a VPS',
      body: 'An assistant I can message any time, and a place to try out agents.',
    },
  ],
};

export const AI_CLOSE = {
  text: 'If you’re building something and want to compare notes, or want to talk about a role:',
  link: { href: '/#contact', label: 'Get in touch' },
};
