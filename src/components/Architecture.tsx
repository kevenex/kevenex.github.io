import { motion } from 'framer-motion';

const MEDIUM_PROFILE = 'https://medium.com/@kevinsunkim';

const ARTICLES = [
  {
    index: '01',
    title: '3 Ways Blockchain Technology Can Help Game Developers',
    href: 'https://medium.com/blockchain-review/3-ways-blockchain-technology-can-help-game-developers-e27ab5414ec7',
  },
  {
    index: '02',
    title: 'What is Cryptocurrency & Why the Term Doesn’t Apply to Most Coins & Tokens Today',
    href: 'https://medium.com/blockchain-review/what-is-cryptocurrency-why-the-term-doesnt-apply-to-most-coins-tokens-today-ca971cbb48ac',
  },
  {
    index: '03',
    title: 'How Blockchain Technology can Transform Game Skins Trading',
    href: 'https://medium.com/blockchain-review/how-blockchain-technology-can-transform-game-skins-trading-ac6e45167cdf',
  },
];

export default function Architecture() {
  return (
    <section className="relative min-h-screen w-full bg-black">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.0 }}
        >
          <p className="mb-8 text-[13px] uppercase tracking-[0.2em] text-white/40 sm:text-[14px]">
            Writing
          </p>

          <h2 className="mb-10 text-[clamp(28px,6vw,56px)] font-light leading-[1.15] tracking-[-0.02em] text-white">
            My Thoughts
          </h2>

          <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-white/45 sm:text-[17px]">
            Longer-form thinking on blockchain, product, and the ideas that didn't make
            the roadmap. Full essays live on Medium.
          </p>
        </motion.div>

        <motion.div
          className="mt-20 flex w-full flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          {ARTICLES.map((article) => (
            <motion.a
              key={article.index}
              href={article.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full max-w-md flex-col gap-1 rounded-lg border border-white/10 px-6 py-4 text-left transition-colors hover:border-white/25 hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-0 sm:h-[72px]"
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            >
              <span className="shrink-0 text-[12px] uppercase tracking-[0.15em] text-white/30">
                {article.index}
              </span>
              <span className="text-[15px] font-light leading-snug text-white sm:text-right sm:text-[17px]">
                {article.title}
              </span>
            </motion.a>
          ))}
        </motion.div>

        <motion.a
          href={MEDIUM_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 text-[13px] uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-white sm:text-[14px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.0, delay: 0.6 }}
        >
          Read more on Medium &rarr;
        </motion.a>
      </div>
    </section>
  );
}
