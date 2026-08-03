import { useState } from 'react';
import { motion } from 'framer-motion';
import ScrambleText from './ScrambleText';
import SquashHamburger from './SquashHamburger';
import SynapseXLogo from './SynapseXLogo';

const PILL_SPRING = { type: 'spring' as const, stiffness: 350, damping: 28 };

const NAV_LINKS = [
  { label: 'About', target: () => window.innerHeight },
  { label: 'Metrics', target: () => window.innerHeight * 2 },
];

interface NavbarProps {
  entranceComplete: boolean;
}

export default function Navbar({ entranceComplete }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const scrollTo = (top: number) => {
    setIsOpen(false);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 z-50 h-20 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: entranceComplete ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Desktop */}
      <div className="hidden h-full w-full items-center justify-between px-8 sm:flex">
        <div className="flex items-center gap-2">
          <motion.a
            href="#top"
            className={`${isOpen ? 'hidden md:flex' : 'flex'} h-12 items-center gap-2.5 rounded-[14px] bg-white/15 px-5 backdrop-blur-md`}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.22)' }}
            whileTap={{ scale: 0.98 }}
            onClick={(event) => {
              event.preventDefault();
              scrollTo(0);
            }}
          >
            <SynapseXLogo className="text-white" width={18} height={18} />
            <span className="text-[16px] font-medium tracking-tight text-white">SynapseX</span>
          </motion.a>

          <motion.div
            className="flex h-12 items-center overflow-hidden rounded-[14px] bg-white/15 backdrop-blur-md"
            animate={{ width: isOpen ? 290 : 48 }}
            transition={PILL_SPRING}
          >
            <button
              type="button"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((open) => !open)}
              className={
                isOpen
                  ? 'ml-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-white/10 transition-colors hover:bg-white/20'
                  : 'flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]'
              }
            >
              <SquashHamburger isOpen={isOpen} />
            </button>

            <motion.div
              className="flex items-center gap-6 whitespace-nowrap pl-4"
              animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 15 }}
              transition={{ duration: 0.25, delay: isOpen ? 0.1 : 0 }}
              style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
            >
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => scrollTo(link.target())}
                  onMouseEnter={() => setHovered(link.label)}
                  onMouseLeave={() => setHovered(null)}
                  className="text-[16px] font-normal text-white/85 transition-colors hover:text-white"
                >
                  <ScrambleText text={link.label} isHovered={hovered === link.label} />
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.button
          type="button"
          className="flex h-12 items-center gap-2 rounded-full bg-white px-6 text-black"
          whileHover={{ scale: 1.03, backgroundColor: '#e2e2e6' }}
          whileTap={{ scale: 0.97 }}
          onMouseEnter={() => setHovered('Download')}
          onMouseLeave={() => setHovered(null)}
        >
          <i className="bi bi-apple text-[17px]" aria-hidden="true" />
          <ScrambleText
            text="Download"
            isHovered={hovered === 'Download'}
            className="text-[15px] font-medium"
          />
        </motion.button>
      </div>

      {/* Mobile */}
      <div className="flex h-full w-full items-center gap-2 px-4 sm:hidden">
        <motion.div
          className="overflow-hidden"
          animate={{ width: isOpen ? 0 : 'auto' }}
          transition={PILL_SPRING}
        >
          <a
            href="#top"
            className="flex h-9 items-center gap-2 rounded-[10px] bg-white/15 px-3 backdrop-blur-md"
            onClick={(event) => {
              event.preventDefault();
              scrollTo(0);
            }}
          >
            <SynapseXLogo className="text-white" width={14} height={14} />
            <span className="whitespace-nowrap text-[13px] font-medium tracking-tight text-white">
              SynapseX
            </span>
          </a>
        </motion.div>

        <motion.div
          className="flex h-9 items-center overflow-hidden rounded-[10px] bg-white/15 backdrop-blur-md"
          animate={{ width: isOpen ? '100%' : 36 }}
          transition={PILL_SPRING}
        >
          <button
            type="button"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
            className={
              isOpen
                ? 'ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-white/10'
                : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]'
            }
          >
            <SquashHamburger isOpen={isOpen} mobile />
          </button>

          <motion.div
            className="flex items-center gap-5 whitespace-nowrap pl-3"
            animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 15 }}
            transition={{ duration: 0.25, delay: isOpen ? 0.1 : 0 }}
            style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => scrollTo(link.target())}
                className="text-[13px] font-normal text-white/85"
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        </motion.div>

        <motion.button
          type="button"
          className="ml-auto flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 text-black"
          whileTap={{ scale: 0.97 }}
        >
          <i className="bi bi-apple text-[14px]" aria-hidden="true" />
          <span className="text-[13px] font-medium">Download</span>
        </motion.button>
      </div>
    </motion.nav>
  );
}
