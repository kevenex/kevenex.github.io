/*
 * Everything a recruiter reads on the page, in one place. Components lay it
 * out; none of them carry copy of their own about the career. Change a role
 * here and every section that mentions it follows.
 *
 * Deliberately anonymized: outcomes without vendor names or exact figures.
 * Regions are fine ("North America and Europe"); counts, partner names and
 * acquired companies' names are not. The PDF carries the numbers; the page
 * carries the judgment behind them.
 */

export const LINKEDIN = 'https://www.linkedin.com/in/kevinsunkim';

export const IDENTITY = {
  name: 'Kevin Kim',
  title: 'Product Manager',
  location: 'Toronto, ON',
  greeting: 'Hi. I’m Kevin.',
  lead: 'I’m a product manager working on data and AI, mostly in fintech and payments. Right now I’m the product manager for the data that finance, risk and AI products depend on.',
  how: 'I’m good at taking a problem nobody has pinned down yet and getting it to launch.',
};

/**
 * A company's mark: its logo where we have one, otherwise a monogram tile.
 * The company name is always printed beside it as text, so neither carries
 * meaning of its own.
 */
export interface Mark {
  /** A path under public/, e.g. /logos/brim.webp. */
  logo?: string;
  /** One to three letters, set in mono on a hairline tile when there is no logo. */
  monogram: string;
}

export interface Role extends Mark {
  company: string;
  title: string;
  /** The year the timeline's counter snaps to while this role is being read. */
  start: string;
  /** Printed as-is; an open end means the role is current. */
  span: string;
  city: string;
  /** What the company does, for a reader who has never heard of it. */
  domain: string;
  /** One phrase for the index at the top of Experience. */
  gist: string;
  headline: string;
  /** The two chips under the headline: what the work started from, and what it turned into. */
  flow: [string, string];
  body: string;
  takeaway: string;
  /** One sense of scale in the facts column. Optional: not every role has one worth printing. */
  figure?: Figure;
}

/** A sense of scale, worded rather than counted — see the note at the top. */
export interface Figure {
  label: string;
  value: string;
  note: string;
}

export interface Closer {
  icon: 'data' | 'ai' | 'compass';
  text: string;
}

/** The current role gets the framed treatment; the rest follow it. */
export const FEATURED = {
  company: 'Plusgrade',
  logo: '/logos/plusgrade.webp',
  monogram: 'P',
  title: 'Product Manager',
  start: '2024',
  span: '2024–',
  city: 'Toronto',
  domain: 'Travel commerce & payments',
  gist: 'The data foundation for finance, risk and AI',
  team: 'Data engineering, finance, risk, analytics and partner operations',
  headline: 'Making the company’s data reliable enough to build on.',
  body: 'I’m the main product manager for data at Plusgrade. I decide what Data Engineering builds, why it matters, and how we’ll know it worked. Finance, risk, analytics and partner operations run on that data, and so do the AI products the company is building. Plusgrade has grown by buying other companies, so a lot of the work is getting each one onto the same foundation, reliably and at global scale.',
  /** Drawn as the teams' chips standing on one base: who depends on the work, and what it is. */
  foundation: {
    label: 'Built on it',
    on: ['Finance', 'Risk', 'Analytics', 'Partner operations'],
    /** Set apart in the accent: the one the rest of the roadmap is heading toward. */
    accent: 'AI products',
    base: 'Data foundation',
    note: 'Plusgrade and the companies it bought, on one platform',
  },
  closer: [
    {
      icon: 'compass',
      text: 'Set what Data Engineering works on: the capability each piece adds, the business outcome behind it, and who owns it.',
    },
    {
      icon: 'data',
      text: 'Ran a migration over several months that moved data from acquired companies onto one cloud platform, so other teams’ products could depend on it.',
    },
    {
      icon: 'ai',
      text: 'Looked into what was holding back the AI and ML roadmap, and got the data foundation it needed funded.',
    },
  ] satisfies Closer[],
};

/** The line beside "Before Plusgrade": every earlier role in one breath. */
export const BEFORE_SUMMARY =
  'Card platforms with banks on two continents, retail data through a nationwide rollout, a greenlit prototype, and a startup’s first round.';

/** Newest first — a recruiter reads down from the present. */
export const ROLES: Role[] = [
  {
    company: 'Brim Financial',
    logo: '/logos/brim.webp',
    monogram: 'B',
    title: 'Senior Product Manager',
    start: '2021',
    span: '2021–2023',
    city: 'Toronto',
    domain: 'Card issuing & payments',
    gist: 'Card platform launches with banks',
    headline: 'Moving traditional banks onto a modern card platform.',
    flow: ['Traditional banking', 'Modular card issuing'],
    body: 'Brim sells a card issuing platform to banks, and the banks offer the cards to their own customers. I led major integrations with banks in North America and Europe from 0 to 1: discovery, partner communications, delivery, and stabilizing things after launch. I ran a team of PMs and QA analysts, turned loose ideas into decisions engineering could act on, and worked directly with the executive team, directors and SVPs on each rollout.',
    takeaway: 'I learned to plan the handover to the bank’s team from the first week, not the last.',
    figure: {
      label: 'Scale of the work',
      value: 'Two continents',
      note: 'major bank integrations across North America and Europe',
    },
  },
  {
    company: 'Canadian Tire',
    logo: '/logos/canadian-tire.webp',
    monogram: 'CT',
    title: 'Category Business Analyst',
    start: '2020',
    span: '2020–2021',
    city: 'Toronto',
    domain: 'Retail',
    gist: 'Inventory data for a store-in-store rollout',
    headline: 'Keeping inventory data straight after an acquisition.',
    flow: ['Acquired inventory', 'Nationwide rollout'],
    body: 'My first job out of school. Canadian Tire had bought another retailer and was opening it as a store-in-store across the country. I tracked its inventory across several ERP systems and kept the data consistent and accurate as the rollout reached hundreds of locations. My analysis turned into recommendations the category team used, and excess stock went down.',
    takeaway: 'I started building every analysis around the one decision it was supposed to help someone make.',
    figure: {
      label: 'Scale of the work',
      value: 'Hundreds of stores',
      note: 'inventory kept consistent through a nationwide rollout',
    },
  },
  {
    company: 'IBM',
    logo: '/logos/ibm.svg',
    monogram: 'IBM',
    title: 'Product Manager (Intern)',
    start: '2019',
    span: '2019',
    city: 'Ottawa',
    domain: 'Enterprise software',
    gist: 'A prototype greenlit by senior management',
    headline: 'From a problem statement to a greenlit prototype.',
    flow: ['Problem statement', 'Greenlit prototype'],
    body: 'IBM ran the program like Dragon’s Den: three months to take a problem statement, find the pain points and the opening in it, and build something that works. I worked with three engineers and set what we built first, and we made a proof of concept that helped Java applications start faster. I pitched it to IBM’s senior management in New York, and it was greenlit for further development after the internship ended.',
    takeaway: 'a working prototype settled questions that weeks of slides wouldn’t have.',
  },
  {
    company: 'Intrepid Ventures',
    logo: '/logos/intrepid-ventures.webp',
    monogram: 'IV',
    title: 'Business Analyst',
    start: '2018',
    span: '2018–2019',
    city: 'Seoul',
    domain: 'Early-stage startup',
    gist: 'A first funding round',
    headline: 'Working next to the founders in Seoul.',
    flow: ['Investor meetings', 'First funding round'],
    body: 'I worked directly with the founders and their advisors on the company’s first funding round. I also looked after relationships with investors and partners, and helped get new products to market.',
    takeaway: 'sitting in on investor meetings taught me to answer the question someone actually asked.',
  },
];

export const FIT = {
  open: 'I’m looking for product roles in AI, data platforms and fintech.',
  scope: 'Product management, especially where AI is being built on payments or financial data and someone has to get that data ready for it.',
  cases: [
    {
      title: 'You’re building AI products and the data isn’t ready for them.',
      body: 'An AI product is only as good as the data under it. I own that layer today: what gets built, which outcome it supports, who owns it, and what comes first.',
    },
    {
      title: 'You’re launching a financial product with bank partners.',
      body: 'Banks and compliance teams will shape your roadmap as much as you do. I’ve led card platform integrations with major banks in North America and Europe, from discovery through to after launch.',
    },
    {
      title: 'You bought a company and now have two of everything.',
      body: 'Two sets of systems, and nobody is sure which numbers are right. I’ve led that kind of migration and I know where it usually gets stuck.',
    },
    {
      title: 'You want a PM who tries things before writing the spec.',
      body: 'I build quick prototypes with AI tools to see if an idea holds up before engineering spends time on it.',
    },
  ],
};

export interface WorkItem {
  icon: 'search' | 'people' | 'build' | 'ship';
  title: string;
  body: string;
}

export const HOW = {
  headline: 'Start with who has to decide.',
  body: 'Most requests show up as a feature someone wants. I try to find out who actually has to make the call and what they’d need to see, then build the least we can get away with to show them.',
  help: [
    {
      icon: 'search',
      title: 'Figure out the real problem',
      body: 'Talk to customers and stakeholders until the problem is specific enough that we’d know if we fixed it.',
    },
    {
      icon: 'people',
      title: 'Get people to agree',
      body: 'Product, engineering, data and partners working from the same roadmap, and knowing why it’s in that order.',
    },
    {
      icon: 'build',
      title: 'Prototype before committing',
      body: 'A rough version built with AI tools, so we can react to something real before engineering starts.',
    },
    {
      icon: 'ship',
      title: 'Ship it and check it worked',
      body: 'Decide how we’ll measure success before launch, then actually look at the numbers afterward.',
    },
  ] satisfies WorkItem[],
  /** Where the prototyping above is shown, not just claimed. */
  more: { href: '/how-i-use-ai/', label: 'How I use AI' },
};

export interface Credential {
  what: string;
  where: string;
  year: string;
  /** The institution's mark, where there is one to show. */
  mark?: Mark;
}

export const EDUCATION: Credential[] = [
  {
    what: 'Bachelor’s, Business Management',
    where: 'Western University',
    year: '2020',
    mark: { logo: '/logos/western.webp', monogram: 'W' },
  },
];

export const CERTIFICATIONS: Credential[] = [
  { what: 'Product Strategy Micro-Certification', where: 'Product School', year: '2023' },
  { what: 'Professional Project Management', where: 'Google', year: '2024' },
  { what: 'AI Foundations', where: 'Reforge', year: '2025' },
];

export const SKILLS = [
  { group: 'AI', items: ['AI product strategy', 'Data readiness for AI/ML', 'Agentic workflows', 'LLM tooling'] },
  {
    group: 'Data',
    items: ['Data platform roadmaps', 'Data ownership', 'SQL', 'Cloud data platforms', 'Data migration', 'REST APIs'],
  },
  { group: 'Strategy', items: ['Technical PRDs', 'Roadmaps', 'Product analytics', 'Rapid prototyping'] },
  { group: 'Discovery', items: ['Customer & stakeholder interviews', 'Hypothesis validation', 'Market analysis'] },
];

/**
 * One personal line beside the LinkedIn link. Left empty until Kevin writes
 * it — the section renders nothing rather than a placeholder.
 */
export const OFF_THE_CLOCK = '';
