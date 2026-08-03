import { motion } from 'framer-motion';

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 20 };

interface SquashHamburgerProps {
  isOpen: boolean;
  mobile?: boolean;
}

export default function SquashHamburger({ isOpen, mobile = false }: SquashHamburgerProps) {
  const width = mobile ? 15 : 18;
  const height = mobile ? 10 : 12;
  const bar = mobile ? 1.2 : 1.5;
  const center = height / 2 - bar / 2;

  const barClass = 'absolute left-0 w-full bg-white rounded-full';

  return (
    <span className="relative block" style={{ width, height }}>
      <motion.span
        className={barClass}
        style={{ height: bar, top: 0 }}
        animate={isOpen ? { rotate: 45, y: center } : { rotate: 0, y: 0 }}
        transition={SPRING}
      />
      <motion.span
        className={barClass}
        style={{ height: bar, top: center }}
        animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={SPRING}
      />
      <motion.span
        className={barClass}
        style={{ height: bar, bottom: 0 }}
        animate={isOpen ? { rotate: -45, y: -center } : { rotate: 0, y: 0 }}
        transition={SPRING}
      />
    </span>
  );
}
