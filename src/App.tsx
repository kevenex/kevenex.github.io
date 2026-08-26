import Arrival from './components/Arrival';
import Position from './components/Position';
import Spine from './components/Spine';
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
        </Spine>
      </main>
    </LenisProvider>
  );
}
