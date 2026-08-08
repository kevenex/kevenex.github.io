import { useState } from 'react';
import { motion } from 'framer-motion';
import ScrambleText from './ScrambleText';
import SquashHamburger from './SquashHamburger';
import KevinKLogo from './KevinKLogo';

const PILL_SPRING = { type: 'spring' as const, stiffness: 350, damping: 28 };

/*
 * Two kinds of entry: `target` scrolls to a position on this page, `href`
 * navigates away. The flyer and Wick are standalone static pages under
 * public/, so those are real navigations rather than scrolls.
 */
type NavLink =
  | { label: string; target: () => number; href?: never }
  | { label: string; href: string; target?: never };

const NAV_LINKS: NavLink[] = [
  { label: 'About', target: () => window.innerHeight },
  { label: 'Projects', target: () => window.innerHeight * 2 },
  { label: 'Flyer Fable', href: '/flyer-fable/' },
  // "Wick", not "Project Wick". The open pill is measured from these labels,
  // and the full name grows it until it touches the Download button between
  // 640 and 768px — the failure the note above warns about. The card in the
  // Projects grid and the page itself both carry the full name.
  { label: 'Wick', href: '/project-wick/' },
];

/*
 * The open width has to be a number for the spring to animate it, so it is
 * measured rather than laid out. Space Mono is monospace at 0.6em, which makes
 * a 16px label exactly 9.6px per character — everything else is the fixed
 * chrome around the labels: the button's left margin and width, the leading
 * padding, one gap between each pair of links, and a trailing inset.
 *
 * Derived rather than hardcoded so that editing NAV_LINKS cannot leave the
 * pill clipping its last label. Adding an entry does push the open pill toward
 * the viewport edge on a small laptop, so check it at 640px before doing so.
 */
const NAV_OPEN_WIDTH = Math.round(
  6 +
    36 +
    16 +
    NAV_LINKS.reduce((total, link) => total + link.label.length * 9.6, 0) +
    (NAV_LINKS.length - 1) * 24 +
    32
);

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
            <KevinKLogo className="text-white" width={18} height={18} />
            <span className="text-[16px] font-medium tracking-tight text-white">KevinK</span>
          </motion.a>

          <motion.div
            className="flex h-12 shrink-0 items-center overflow-hidden rounded-[14px] bg-white/15 backdrop-blur-md"
            animate={{ width: isOpen ? NAV_OPEN_WIDTH : 48 }}
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
              {NAV_LINKS.map((link) => {
                const shared = {
                  key: link.label,
                  onMouseEnter: () => setHovered(link.label),
                  onMouseLeave: () => setHovered(null),
                  className:
                    'text-[16px] font-normal text-white/85 transition-colors hover:text-white',
                  children: <ScrambleText text={link.label} isHovered={hovered === link.label} />,
                };

                return link.href ? (
                  <a {...shared} href={link.href} />
                ) : (
                  <button {...shared} type="button" onClick={() => scrollTo(link.target())} />
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        <motion.a
          href="/resume/Kevin-Kim-Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center gap-2 rounded-full bg-white px-6 text-black"
          whileHover={{ scale: 1.03, backgroundColor: '#e2e2e6' }}
          whileTap={{ scale: 0.97 }}
          onMouseEnter={() => setHovered('Download')}
          onMouseLeave={() => setHovered(null)}
        >
          <i className="bi bi-file-earmark-pdf text-[17px]" aria-hidden="true" />
          <ScrambleText
            text="Download"
            isHovered={hovered === 'Download'}
            className="text-[15px] font-medium"
          />
        </motion.a>
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
            <KevinKLogo className="text-white" width={14} height={14} />
            <span className="whitespace-nowrap text-[13px] font-medium tracking-tight text-white">
              KevinK
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
            {NAV_LINKS.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="whitespace-nowrap text-[13px] font-normal text-white/85"
                >
                  {link.label}
                </a>
              ) : (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => scrollTo(link.target())}
                  className="text-[13px] font-normal text-white/85"
                >
                  {link.label}
                </button>
              )
            )}
          </motion.div>
        </motion.div>

        {/* Collapses while the menu is open, the same way the logo does — three
            links plus the CTA do not fit across a phone, and the pill clips its
            last label rather than shrinking. */}
        <motion.div
          className="ml-auto overflow-hidden"
          animate={{ width: isOpen ? 0 : 'auto' }}
          transition={PILL_SPRING}
        >
          <motion.a
            href="/resume/Kevin-Kim-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 text-black"
            whileTap={{ scale: 0.97 }}
          >
            <i className="bi bi-file-earmark-pdf text-[14px]" aria-hidden="true" />
            <span className="whitespace-nowrap text-[13px] font-medium">Download</span>
          </motion.a>
        </motion.div>
      </div>
    </motion.nav>
  );
}
