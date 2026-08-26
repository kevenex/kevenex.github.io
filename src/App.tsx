import Arrival from './components/Arrival';
import Contact from './components/Contact';
import FlyerSpread from './components/FlyerSpread';
import Position from './components/Position';
import Practice from './components/Practice';
import Spine from './components/Spine';
import WickSpread from './components/WickSpread';
import { LenisProvider } from './lib/lenis';

/*
 * One continuous canvas: paper throughout, with the spine running from the
 * end of the hero to the start of the colophon so no movement inside it
 * reads as a section boundary.
 *
 * Sections are still being added back — see the redesign plan.
 */
export default function App() {
  return (
    <LenisProvider>
      <main className="min-h-screen w-full bg-paper text-ink">
        <Arrival />

        <Spine>
          <Position />
          <WickSpread />
          <FlyerSpread />
          <Practice />
          <Contact />
        </Spine>
      </main>
    </LenisProvider>
  );
}
