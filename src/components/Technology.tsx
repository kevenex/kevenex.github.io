import { motion } from 'framer-motion';
import { VIDEOS } from '../constants/videos';

const CAPABILITIES = [
  {
    title: 'Platform Launches',
    description: 'Directed rollouts from discovery to deployment, growing partner adoption 300%.',
  },
  {
    title: 'Data Migration',
    description: 'Led a multi-month migration unifying legacy systems onto a modern cloud platform.',
  },
  {
    title: 'Cross-Functional Leadership',
    description: 'Aligned product, engineering, and business teams around a shared roadmap.',
  },
  {
    title: 'Customer Discovery',
    description: 'Turned stakeholder input and market research into prioritized decisions.',
  },
];

const COMPANIES = ['Plusgrade', 'ATB Financial', 'Brim Financial', 'Canadian Tire', 'IBM', 'Intrepid Ventures'];

export default function Technology() {
  return (
    <section className="relative h-screen-dvh w-full overflow-hidden bg-black">
      <video
        src={VIDEOS.technology}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="relative z-10 flex h-full flex-col px-8 py-12 sm:px-12 sm:py-16 md:px-16">
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

        <div className="flex-1" />

        <motion.div
          className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0, delay: 0.3 }}
        >
          {CAPABILITIES.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
            >
              <h3 className="mb-2 text-[14px] font-normal text-white sm:text-[16px]">
                {item.title}
              </h3>
              <p className="text-[12px] leading-relaxed text-white/40 sm:text-[14px]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/10 pt-6 sm:mt-12 sm:pt-8"
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
