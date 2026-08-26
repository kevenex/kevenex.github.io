import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Resolved from import.meta rather than __dirname, which Vite's native config
// loader does not provide.
const JOURNAL = fileURLToPath(new URL('./public/project-wick/journal.json', import.meta.url));

/**
 * Exposes a handful of figures from the Project Wick journal as
 * `virtual:wick-summary`, read at build time.
 *
 * The journal itself is ~117KB and is already served as a static file, so
 * importing it directly would inline all of it into the bundle to print five
 * numbers. This reads it on the server and emits only what the spread shows.
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
      };

      try {
        const journal = JSON.parse(readFileSync(JOURNAL, 'utf8'));

        // Days run newest-first; entries within a day run oldest-first, so
        // the most recent entry is the last one of the first day.
        const day = journal.days?.[0];
        const entry = day?.entries?.[day.entries.length - 1];

        const text = String(entry?.html ?? '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/\s+/g, ' ')
          .trim();

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
            text: text.length > 260 ? `${text.slice(0, 260).trimEnd()}…` : text,
          },
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
