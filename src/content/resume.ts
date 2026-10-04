/*
 * Everything a recruiter reads on the page, in one place. Components lay it
 * out; none of them carry copy of their own about the career. Change a role
 * here and every section that mentions it follows.
 *
 * Deliberately anonymized: outcomes without vendor names or exact figures.
 * The PDF carries the numbers; the page carries the judgment behind them.
 */

export const LINKEDIN = 'https://www.linkedin.com/in/kevinsunkim';

export const IDENTITY = {
  name: 'Kevin Kim',
  title: 'Product Manager',
  location: 'Toronto, ON',
  greeting: 'Hi. I’m Kevin.',
  lead: 'I’m a product manager in fintech. Most of my work has been card platforms, payments, and the data behind them.',
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
}

export interface Closer {
  icon: 'data' | 'payments' | 'compass';
  text: string;
}

/** The current role gets the framed treatment; the rest follow it. */
export const FEATURED = {
  company: 'Plusgrade',
  monogram: 'P',
  title: 'Product Manager',
  start: '2024',
  span: '2024–',
  city: 'Toronto',
  domain: 'Travel commerce & payments',
  gist: 'Bringing acquired data onto one platform',
  team: 'Data, engineering, finance and leadership',
  headline: 'Bringing acquired companies onto one data platform.',
  body: 'Plusgrade has grown by buying other companies, and each one came with its own systems. I lead the product work underneath all of that. I ran the project to move their data onto one platform, added new payment providers, and made the case for the infrastructure the company needs before its AI and ML plans can go anywhere.',
  scale: {
    label: 'Scale of the work',
    value: 'Several business units',
    note: 'data from acquired companies, now in one place',
  },
  closer: [
    {
      icon: 'data',
      text: 'Ran a migration over several months that moved data from acquired companies onto one cloud platform.',
    },
    {
      icon: 'payments',
      text: 'Added new payment providers, which raised authorization rates and let us process payments in local currencies.',
    },
    {
      icon: 'compass',
      text: 'Looked into what was holding back the AI and ML roadmap, and got the fix funded.',
    },
  ] satisfies Closer[],
};

/** The line beside "Before Plusgrade": every earlier role in one breath. */
export const BEFORE_SUMMARY =
  'Launching cards with banks, getting a team to measure the same way, retail data, a prototype that shipped, and a startup’s first round.';

/** Newest first — a recruiter reads down from the present. */
export const ROLES: Role[] = [
  {
    company: 'ATB Financial',
    monogram: 'ATB',
    title: 'Product Manager',
    start: '2023',
    span: '2023–2024',
    city: 'Toronto',
    domain: 'Banking',
    gist: 'Agreeing on how to measure a product',
    headline: 'First, agree on what good looks like.',
    flow: ['Shared metrics', 'Better accuracy'],
    body: 'I owned an identity verification service. Before changing anything, I sat down with data and engineering to decide how we’d measure it, and we set up the tracking together. Accuracy and performance both went up after that. I also got the team writing requirements and launch plans the same way.',
    takeaway: 'half the arguments about what to build next went away once everyone could see the same numbers.',
  },
  {
    company: 'Brim Financial',
    logo: '/logos/brim.webp',
    monogram: 'B',
    title: 'Senior Product Manager',
    start: '2021',
    span: '2021–2023',
    city: 'Toronto',
    domain: 'Card issuing & payments',
    gist: 'Credit card launches with banks',
    headline: 'Launching credit cards with Canadian banks.',
    flow: ['Bank discovery', 'Card launch'],
    body: 'I took card platforms from the first discovery calls to launch with several banks, which meant moving their cardholders and payments over to us. The banks were involved through the pilot and early launch, and what they told us went into the roadmap I reported on to the VP of Product. We signed a lot more partners over those two years.',
    takeaway: 'I learned to plan the handover to the bank’s team from the first week, not the last.',
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
    gist: 'Inventory and a store-in-store rollout',
    headline: 'My first job out of school.',
    flow: ['Inventory analysis', 'Less excess stock'],
    body: 'I worked on a store-in-store rollout across hundreds of Canadian Tire locations and helped move an acquired company’s systems into the main data warehouse. My inventory analysis turned into recommendations the category team used, and excess stock went down.',
    takeaway: 'I started building every analysis around the one decision it was supposed to help someone make.',
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
    gist: 'A prototype that shipped',
    headline: 'An internship that ended up in production.',
    flow: ['Prototype', 'Production'],
    body: 'I worked with engineers on a prototype that made Java applications start faster. Our testing showed a real improvement, and the feature was approved for production. At the end of the program I pitched it in New York at IBM’s Dragon’s Den showcase.',
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
  open: 'I’m looking for product roles in fintech and data platforms.',
  scope: 'Product management, including the discovery and data work that comes with it.',
  cases: [
    {
      title: 'You’re launching a financial product with bank partners.',
      body: 'Banks and compliance teams will shape your roadmap as much as you do. I’ve launched card platforms with banks involved from the start.',
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
  { group: 'Discovery', items: ['Customer & stakeholder interviews', 'Hypothesis validation', 'Market analysis'] },
  { group: 'Strategy', items: ['Technical PRDs', 'Roadmaps', 'Product analytics', 'Rapid prototyping'] },
  { group: 'AI', items: ['Agentic workflows', 'LLM tooling'] },
  { group: 'Data', items: ['SQL', 'Cloud data platforms', 'REST APIs', 'Data migration'] },
];

/**
 * One personal line beside the LinkedIn link. Left empty until Kevin writes
 * it — the section renders nothing rather than a placeholder.
 */
export const OFF_THE_CLOCK = '';
