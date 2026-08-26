import Arrival from './components/Arrival';
import Colophon from './components/Colophon';
import Contact from './components/Contact';
import FlyerSpread from './components/FlyerSpread';
import Position from './components/Position';
import Practice from './components/Practice';
import Rail from './components/Rail';
import Spine from './components/Spine';
import WickSpread from './components/WickSpread';
import { LenisProvider } from './lib/lenis';

/*
 * One continuous canvas: paper throughout, with the spine running from the
 * end of the hero to the start of the colophon so no movement inside it
 * reads as a section boundary.
 */
export default function App() {
  return (
    <LenisProvider>
      <Rail />

      <main className="min-h-screen w-full bg-paper text-ink">
        <Arrival />

        <Spine>
          <Position />
          <WickSpread />
          <FlyerSpread />
          <Practice />
          <Contact />
        </Spine>

        <Colophon />
      </main>
    </LenisProvider>
  );
}
