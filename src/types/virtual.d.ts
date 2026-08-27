declare module 'virtual:wick-summary' {
  /** Built by the `wick-summary` plugin in vite.config.ts. */
  const summary: {
    /** False when journal.json could not be read — the spread drops its figures. */
    available: boolean;
    totals: { days: number; entries: number; words: number; wikiPages: number };
    lastRun: string;
    openThread: string;
    commit: string;
    repo: string;
    latest: { date: string; time: string; text: string };
  };
  export default summary;
}
