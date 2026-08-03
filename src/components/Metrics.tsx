import { motion } from 'framer-motion';
import { VIDEOS } from '../constants/videos';

const METRICS = [
  { value: '2.4ms', label: 'Synaptic Latency' },
  { value: '99.7%', label: 'Signal Accuracy' },
  { value: '140B', label: 'Neural Parameters' },
];

export default function Metrics() {
  return (
    <section id="metrics" className="relative min-h-screen w-full overflow-hidden bg-black">
      <video
        src={VIDEOS.metrics}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-32 pt-32">
        <div className="mx-auto w-full max-w-6xl">
          <motion.p
            className="mb-20 text-center text-[13px] uppercase tracking-[0.2em] text-white/40 sm:text-[14px]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2 }}
          >
            Performance Metrics
          </motion.p>

          <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-8">
            {METRICS.map((metric, index) => (
              <motion.div
                key={metric.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
              >
                <div className="text-[clamp(48px,10vw,96px)] font-light leading-none tracking-[-0.04em] text-white">
                  {metric.value}
                </div>
                <div className="mt-4 text-[13px] tracking-wide text-white/40 sm:text-[15px]">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
