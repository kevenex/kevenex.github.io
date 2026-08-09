import { motion } from 'framer-motion';

type TagColor = 'blue' | 'green' | 'orange' | 'purple';

/* iOS-style status chip colors — tinted background at low opacity with the
 * matching solid tone for text, same trick Settings/Notes badges use. */
const TAG_COLORS: Record<TagColor, string> = {
  blue: 'bg-blue-500/15 text-blue-300',
  green: 'bg-green-500/15 text-green-300',
  orange: 'bg-orange-500/15 text-orange-300',
  purple: 'bg-purple-500/15 text-purple-300',
};

interface TimelineEntry {
  year: string;
  role: string;
  company: string;
  status: 'now' | 'shipped';
  tags?: { label: string; color: TagColor }[];
}

/* Most recent first — a roadmap reads top-down like a changelog, "Now" at the top. */
const TIMELINE: TimelineEntry[] = [
  {
    year: '2024 — Present',
    role: 'Product Manager',
    company: 'Plusgrade',
    status: 'now',
    tags: [
      { label: 'Data Migration', color: 'blue' },
      { label: 'M&A', color: 'orange' },
    ],
  },
  {
    year: '2023 — 2024',
    role: 'Product Manager',
    company: 'ATB Financial',
    status: 'shipped',
  },
  {
    year: '2021 — 2023',
    role: 'Senior Product Manager',
    company: 'Brim Financial',
    status: 'shipped',
    tags: [{ label: 'Series B', color: 'green' }],
  },
  {
    year: '2020 — 2021',
    role: 'Category Business Analyst',
    company: 'Canadian Tire',
    status: 'shipped',
  },
  {
    year: '2019',
    role: 'Product Manager',
    company: 'IBM',
    status: 'shipped',
    tags: [{ label: 'Intern', color: 'purple' }],
  },
  {
    year: '2018 — 2019',
    role: 'Business Analyst',
    company: 'Intrepid Ventures',
    status: 'shipped',
    tags: [{ label: 'Intern', color: 'purple' }],
  },
];

/* Rough self-assessment — placeholders to adjust once real levels are pinned down. */
const SKILLS: { name: string; level: number }[] = [
  { name: 'Product Strategy', level: 95 },
  { name: 'Roadmap Planning', level: 92 },
  { name: 'Stakeholder Management', level: 90 },
  { name: 'Data-Driven Decision Making', level: 85 },
  { name: 'Agile Delivery', level: 84 },
  { name: 'User Research', level: 78 },
];

export default function Technology() {
  return (
    <section className="relative min-h-screen w-full bg-black">
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col px-6 py-24 sm:px-10 sm:py-28 md:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <motion.h2
            className="text-[clamp(36px,8vw,72px)] font-light leading-[0.95] tracking-[-0.03em] text-white"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0 }}
          >
            Adaptive
            <br />
            Intelligence
          </motion.h2>

          <motion.p
            className="max-w-xs text-[13px] leading-relaxed text-white/50 sm:text-[15px] md:pt-2 md:text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0, delay: 0.2 }}
          >
            6+ years turning ambiguous problems into shipped products — from platform
            launches to enterprise-scale data migrations, fluent in translating market
            signals into roadmap decisions.
          </motion.p>
        </div>

        <motion.div
          className="mt-16 sm:mt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.0, delay: 0.2 }}
        >
          <p className="mb-6 text-[12px] uppercase tracking-[0.2em] text-white/35 sm:mb-8 sm:text-[13px]">
            Career Roadmap
          </p>

          <ol className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[9px] top-3 bottom-3 w-px bg-white/10"
            />

            {TIMELINE.map((entry) => (
              <li key={entry.company} className="relative">
                <div className="grid w-full grid-cols-[20px_1fr_auto] items-start gap-4 rounded-lg py-3 pr-1 transition-colors hover:bg-white/[0.03] sm:gap-6 sm:py-4">
                  <span className="relative mt-[7px] flex h-[19px] w-5 items-center justify-center">
                    <span
                      className={`h-[9px] w-[9px] rounded-full bg-black ring-2 ${
                        entry.status === 'now' ? 'ring-white' : 'ring-white/30'
                      }`}
                    />
                    {entry.status === 'now' && (
                      <motion.span
                        className="absolute h-[9px] w-[9px] rounded-full bg-white/50"
                        animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                  </span>

                  <span className="flex flex-col gap-1">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[15px] font-normal leading-snug text-white sm:text-[17px]">
                        {entry.role}
                        <span className="text-white/40"> — {entry.company}</span>
                      </span>
                      {entry.tags?.map((tag) => (
                        <span
                          key={tag.label}
                          className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide sm:text-[10px] ${TAG_COLORS[tag.color]}`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.12em] text-white/30 sm:text-[12px]">
                      {entry.year}
                    </span>
                  </span>

                  <span
                    className={`shrink-0 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] sm:text-[11px] ${
                      entry.status === 'now'
                        ? 'border-white/30 text-white'
                        : 'border-white/10 text-white/30'
                    }`}
                  >
                    {entry.status === 'now' ? 'Now' : 'Shipped'}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>

        <motion.div
          className="mt-14 border-t border-white/10 pt-8 sm:mt-16 sm:pt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0, delay: 0.4 }}
        >
          <p className="mb-6 text-[12px] uppercase tracking-[0.2em] text-white/35 sm:mb-8 sm:text-[13px]">
            Skills
          </p>

          <div className="flex flex-col gap-5 sm:gap-6">
            {SKILLS.map((skill, index) => (
              <div key={skill.name} className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] text-white/80 sm:text-[14px]">{skill.name}</span>
                  <span className="text-[11px] text-white/35 sm:text-[12px]">{skill.level}%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-white/70"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1.0, delay: 0.1 + index * 0.08, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
