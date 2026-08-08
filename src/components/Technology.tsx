import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface TimelineEntry {
  year: string;
  role: string;
  company: string;
  status: 'now' | 'shipped';
  highlight: string;
}

/* Most recent first — a roadmap reads top-down like a changelog, "Now" at the top. */
const TIMELINE: TimelineEntry[] = [
  {
    year: '2024 — Present',
    role: 'Product Manager',
    company: 'Plusgrade',
    status: 'now',
    highlight: 'Led a multi-month migration unifying legacy systems onto a modern cloud data platform.',
  },
  {
    year: '2023 — 2024',
    role: 'Product Manager',
    company: 'ATB Financial',
    status: 'shipped',
    highlight: 'Improved data accuracy 25% on an identity verification service.',
  },
  {
    year: '2021 — 2023',
    role: 'Senior Product Manager',
    company: 'Brim Financial',
    status: 'shipped',
    highlight: 'Directed platform launches from discovery to deployment, growing partner acquisition 300%.',
  },
  {
    year: '2020 — 2021',
    role: 'Category Business Analyst',
    company: 'Canadian Tire',
    status: 'shipped',
    highlight: 'Cut excess inventory 15% by analyzing and re-prioritizing supply workflows.',
  },
  {
    year: '2019',
    role: 'Product Manager (Intern)',
    company: 'IBM',
    status: 'shipped',
    highlight: 'Validated a 40% performance improvement that shipped to production.',
  },
  {
    year: '2018 — 2019',
    role: 'Business Analyst',
    company: 'Intrepid Ventures',
    status: 'shipped',
    highlight: "Helped launch the company's first funding round, raising over $1M.",
  },
];

const COMPANIES = ['Plusgrade', 'ATB Financial', 'Brim Financial', 'Canadian Tire', 'IBM', 'Intrepid Ventures'];

export default function Technology() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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

            {TIMELINE.map((entry, index) => {
              const isOpen = openIndex === index;

              return (
                <li key={entry.company} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="grid w-full grid-cols-[20px_1fr_auto] items-start gap-4 rounded-lg py-3 pr-1 text-left transition-colors hover:bg-white/[0.03] sm:gap-6 sm:py-4"
                  >
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
                      <span className="text-[15px] font-normal leading-snug text-white sm:text-[17px]">
                        {entry.role}
                        <span className="text-white/40"> — {entry.company}</span>
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.12em] text-white/30 sm:text-[12px]">
                        {entry.year}
                      </span>
                    </span>

                    <span className="flex items-center gap-3">
                      <span
                        className={`shrink-0 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] sm:text-[11px] ${
                          entry.status === 'now'
                            ? 'border-white/30 text-white'
                            : 'border-white/10 text-white/30'
                        }`}
                      >
                        {entry.status === 'now' ? 'Now' : 'Shipped'}
                      </span>
                      <motion.span
                        className="text-[15px] leading-none text-white/30"
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        aria-hidden="true"
                      >
                        +
                      </motion.span>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden pl-9 sm:pl-11"
                      >
                        <p className="pb-4 pr-2 text-[13px] leading-relaxed text-white/45 sm:text-[14px]">
                          {entry.highlight}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ol>
        </motion.div>

        <motion.div
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/10 pt-6 sm:mt-16 sm:pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0, delay: 0.4 }}
        >
          {COMPANIES.map((name) => (
            <span
              key={name}
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/35 sm:text-[12px]"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
