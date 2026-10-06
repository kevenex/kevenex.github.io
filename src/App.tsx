import Arrival from './components/Arrival';
import Colophon from './components/Colophon';
import Contact from './components/Contact';
import Credentials from './components/Credentials';
import Cursor from './components/Cursor';
import Experience from './components/Experience';
import Fit from './components/Fit';
import HowIWork from './components/HowIWork';
import Rail from './components/Rail';
import Spine from './components/Spine';
import ThemeToggle from './components/ThemeToggle';
import { LenisProvider } from './lib/lenis';

/*
 * Résumé first, evidence after: who and where, the career newest first, where
 * that experience fits a team, how the work gets done, then the credentials.
 * The projects live at /projects/, linked from the hero and the colophon,
 * rather than set on the page. One continuous canvas: paper throughout, with the spine running from the end of
 * the hero to the start of the colophon so no movement inside it reads as a
 * section boundary.
 */
export default function App() {
  return (
    <LenisProvider>
      <Cursor />
      <ThemeToggle />
      <Rail />

      <main className="min-h-screen w-full bg-paper text-ink">
        <Arrival />

        <Spine>
          <Experience />
          <Fit />
          <HowIWork />
          <Credentials />
          <Contact />
        </Spine>

        <Colophon />
      </main>
    </LenisProvider>
  );
}
