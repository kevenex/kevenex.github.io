import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/*
 * One row of the journal plate. Mirrored by hand in src/types/virtual.d.ts —
 * a virtual module cannot export a type to its own consumers, so the shape
 * is stated in both places. Change one, change the other.
 */
interface JournalEntry {
  date: string;
  time: string;
  words: number;
  sources: number;
  text: string;
}

// Resolved from import.meta rather than __dirname, which Vite's native config
// loader does not provide.
const JOURNAL = fileURLToPath(new URL('./public/project-wick/journal.json', import.meta.url));

/**
 * The journal is stored as HTML fragments. Both the spread's strip and the
 * plate want plain text out of them, so the unwrapping lives here rather than
 * being written twice with two different sets of entities handled.
 */
const strip = (html: unknown) =>
  String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

const clip = (text: string, limit: number) =>
  text.length > limit ? `${text.slice(0, limit).trimEnd()}\u2026` : text;

/*
 * `sources` is free text the agent wrote itself — usually null, sometimes a
 * pipe-separated list of URLs, occasionally a sentence ("none —
 * self-reflection"). Counting the links in it is the only part that survives
 * as a figure; the prose has nowhere to go in a one-line row.
 */
const sourceCount = (sources: unknown) => (String(sources ?? '').match(/https?:\/\//g) ?? []).length;

/** How many entries the plate shows, and how much of each. */
const PLATE_ENTRIES = 12;
const PLATE_CHARS = 180;

/**
 * Exposes a handful of figures from the Project Wick journal as
 * `virtual:wick-summary`, read at build time.
 *
 * The journal itself is ~640KB and is already served as a static file, so
 * importing it directly would inline all of it into the bundle to print five
 * numbers. This reads it on the server and emits only what the page shows:
 * the spread's figures, plus the dozen most recent entries the plate lets a
 * reader open. Twelve clipped excerpts cost about 2KB against that 640KB.
 *
 * The deploy workflow refreshes journal.json and rebuilds daily, so the
 * figures on the page stay within a day of the agent's actual output.
 *
 * Failing soft is deliberate and matches scripts/sync-wick-journal.mjs: a
 * missing or malformed journal costs the spread its live figures, not the
 * site its build.
 */
function wickSummary(): Plugin {
  const virtualId = 'virtual:wick-summary';
  const resolvedId = `\0${virtualId}`;

  return {
    name: 'wick-summary',

    resolveId(id) {
      return id === virtualId ? resolvedId : null;
    },

    load(id) {
      if (id !== resolvedId) return null;

      let summary = {
        available: false,
        totals: { days: 0, entries: 0, words: 0, wikiPages: 0 },
        lastRun: '',
        openThread: '',
        commit: '',
        repo: 'https://github.com/kevenex/project-wick',
        latest: { date: '', time: '', text: '' },
        entries: [] as JournalEntry[],
      };

      try {
        const journal = JSON.parse(readFileSync(JOURNAL, 'utf8'));

        // Days run newest-first; entries within a day run oldest-first, so
        // the most recent entry is the last one of the first day.
        const day = journal.days?.[0];
        const entry = day?.entries?.[day.entries.length - 1];

        const text = strip(entry?.html);

        /*
         * The same ordering, walked: each day newest-first, and each day's
         * entries reversed so the newest of them comes out first. Stops as
         * soon as the plate has enough rather than mapping all 349.
         */
        const entries: JournalEntry[] = [];

        for (const current of journal.days ?? []) {
          const written = current.entries ?? [];

          for (let index = written.length - 1; index >= 0; index -= 1) {
            if (entries.length >= PLATE_ENTRIES) break;

            entries.push({
              date: current.date ?? '',
              time: written[index].time ?? '',
              words: written[index].words ?? 0,
              sources: sourceCount(written[index].sources),
              text: clip(strip(written[index].html), PLATE_CHARS),
            });
          }

          if (entries.length >= PLATE_ENTRIES) break;
        }

        summary = {
          available: true,
          totals: journal.totals ?? summary.totals,
          lastRun: journal.lastRun ?? '',
          openThread: journal.openThreads?.[0] ?? '',
          commit: journal.source?.commit?.shortSha ?? '',
          repo: journal.source?.url ?? summary.repo,
          latest: {
            date: day?.date ?? '',
            time: entry?.time ?? '',
            text: clip(text, 260),
          },
          entries,
        };
      } catch {
        this.warn('project-wick journal unreadable — the spread will render without live figures');
      }

      return `export default ${JSON.stringify(summary)};`;
    },
  };
}

export default defineConfig({
  plugins: [react(), wickSummary()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        app: 'app/index.html',
      },
    },
  },
});
