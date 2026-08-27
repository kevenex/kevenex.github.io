declare module 'virtual:wick-summary' {
  /*
   * One row of the journal plate. Mirrored by hand from the `JournalEntry`
   * interface in vite.config.ts — a virtual module cannot export a type to
   * its own consumers, so the shape is stated in both places. Change one,
   * change the other.
   */
  interface JournalEntry {
    /** ISO date of the day the agent wrote it. */
    date: string;
    /** 24-hour local time, as the agent stamped it. */
    time: string;
    words: number;
    /** Links counted out of the agent's free-text `sources` field. */
    sources: number;
    /** Plain text, tags stripped and clipped to ~180 characters. */
    text: string;
  }

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
    /** The most recent entries, newest first. Empty when unavailable. */
    entries: JournalEntry[];
  };
  export default summary;
}
