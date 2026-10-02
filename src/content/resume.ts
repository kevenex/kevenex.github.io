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
  lead: 'I build fintech and data products: card platforms, payments, and the data underneath them.',
  accent: 'Six companies, eight years, and products that move money and data.',
  how: 'I turn ambiguous problems into shipped product — and lately, I build with AI agents.',
};

export interface Role {
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
  title: 'Product Manager',
  start: '2024',
  span: '2024 —',
  city: 'Toronto',
  domain: 'Travel commerce & payments',
  gist: 'Consolidating data after acquisitions',
  team: 'Data, engineering, finance and leadership',
  headline: 'Untangling what an acquisition leaves behind.',
  body: 'I lead product work on the systems underneath the business: bringing the data that arrived with acquisitions onto one platform, adding payment providers, and finding the infrastructure gaps that stand between the company and its AI/ML roadmap.',
  scale: { label: 'Scale of the work', value: 'Multi-business-unit', note: 'post-acquisition data platform' },
  closer: [
    {
      icon: 'data',
      text: 'Led a multi-month migration that consolidated post-acquisition data sources onto one cloud data platform.',
    },
    {
      icon: 'payments',
      text: 'Integrated new payment providers, improving authorization rates and enabling local-currency processing.',
    },
    {
      icon: 'compass',
      text: 'Ran discovery on the infrastructure gaps blocking the AI/ML roadmap and turned them into a funded initiative.',
    },
  ] satisfies Closer[],
};

/** Newest first — a recruiter reads down from the present. */
export const ROLES: Role[] = [
  {
    company: 'ATB Financial',
    title: 'Product Manager',
    start: '2023',
    span: '2023 — 2024',
    city: 'Toronto',
    domain: 'Banking',
    gist: 'Measuring what matters',
    headline: 'Metrics before features.',
    body: 'I owned an identity-verification service. The first job was agreeing on what good looked like: success metrics and tracking, defined with data and engineering, which measurably improved the service’s accuracy and performance. I also standardized how the team wrote requirements and go-to-market plans.',
    takeaway: 'if a team can’t agree on how to measure a product, it can’t agree on what to build next.',
  },
  {
    company: 'Brim Financial',
    title: 'Senior Product Manager',
    start: '2021',
    span: '2021 — 2023',
    city: 'Toronto',
    domain: 'Card issuing & payments',
    gist: 'Launching card platforms with banks',
    headline: 'Card platforms, launched with banks.',
    body: 'I took credit card platforms from discovery to deployment with several Canadian banks, moving their cardholders and payments onto the platform. Partner institutions were in the room through pilot and early launch, and what they told us fed a roadmap I reported on to the VP of Product. Partner acquisition grew several-fold over that time.',
    takeaway: 'a launch is only done when the partner can run it without you.',
  },
  {
    company: 'Canadian Tire',
    title: 'Category Business Analyst',
    start: '2020',
    span: '2020 — 2021',
    city: 'Toronto',
    domain: 'Retail',
    gist: 'Turning retail data into decisions',
    headline: 'Data from the shop floor.',
    body: 'I supported a store-in-store rollout across hundreds of locations and helped bring an acquired business’s systems into the enterprise data warehouse. Analyzing inventory workflows led to recommendations that cut excess inventory.',
    takeaway: 'the useful analysis is the one someone can act on by Monday.',
  },
  {
    company: 'IBM',
    title: 'Product Manager (Intern)',
    start: '2019',
    span: '2019',
    city: 'Ottawa',
    domain: 'Enterprise software',
    gist: 'Taking a prototype to production',
    headline: 'A prototype that earned production.',
    body: 'With engineering, I defined and evaluated a JVM optimization prototype. It validated a meaningful startup-performance gain and the feature was greenlit for production. I pitched it at the program’s final Dragon’s Den showcase in New York.',
    takeaway: 'a prototype’s job is to make a decision easy.',
  },
  {
    company: 'Intrepid Ventures',
    title: 'Business Analyst',
    start: '2018',
    span: '2018 — 2019',
    city: 'Seoul',
    domain: 'Early-stage startup',
    gist: 'Raising a first round',
    headline: 'Close to the founders, first round.',
    body: 'I worked directly with the founders and advisors on the company’s first funding round, kept relationships with investors, partners and customers, and helped take new products to market.',
    takeaway: 'every stakeholder is answering a different question; find out which one.',
  },
];

export const FIT = {
  open: 'Open to product roles in fintech and data platforms.',
  scope: 'Product management, with the discovery, data and delivery work around it.',
  cases: [
    {
      title: 'You’re launching a regulated financial product.',
      body: 'Banks, partners and compliance all shape the roadmap. I’ve taken card platforms from discovery to launch with the institutions in the room.',
    },
    {
      title: 'You’re consolidating systems after an acquisition.',
      body: 'Several sources of truth and one business that needs a single answer. I’ve led that migration and know where it stalls.',
    },
    {
      title: 'You want a PM who builds before asking.',
      body: 'I prototype with AI agents to test an idea before engineering commits to it. The two projects further down are examples.',
    },
  ],
};

export interface WorkItem {
  icon: 'search' | 'people' | 'ship';
  title: string;
  body: string;
}

export const HOW = {
  headline: 'Understand the decision, then build.',
  body: 'Most product problems arrive as a feature request. I start with the decision behind it — who has to make it, and what they would need to believe — and work back to the smallest thing that answers it.',
  help: [
    {
      icon: 'search',
      title: 'Find the real problem',
      body: 'Discovery with customers and stakeholders until the problem is specific enough to measure.',
    },
    {
      icon: 'people',
      title: 'Bring the people together',
      body: 'Product, engineering, data and partners agreeing on one roadmap and the reasons behind it.',
    },
    {
      icon: 'ship',
      title: 'Ship it, then measure it',
      body: 'Requirements, delivery and success metrics defined before launch, not after.',
    },
  ] satisfies WorkItem[],
};

export const EDUCATION = [
  { what: 'Bachelor’s, Business Management', where: 'Western University', year: '2020' },
];

export const CERTIFICATIONS = [
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
