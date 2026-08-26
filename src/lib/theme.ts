import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/** Kept in step with the `--c-paper` values in index.css. */
const GROUND: Record<Theme, string> = { light: '#E5E1D8', dark: '#14110E' };

const read = (): Theme | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' || stored === 'light' ? stored : null;
  } catch {
    // Reading storage throws outright in some privacy modes.
    return null;
  }
};

/*
 * The theme itself is resolved by the inline script in index.html, before the
 * first paint — this hook only reflects and changes what that already decided.
 * It reads the class off <html> rather than recomputing, so the two can never
 * disagree.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  );

  const apply = useCallback((next: Theme) => {
    document.documentElement.classList.toggle('dark', next === 'dark');

    // The browser paints its own chrome from this, so it has to move too.
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', GROUND[next]);

    setTheme(next);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // An unwritable store costs the choice its persistence, not its effect.
    }
    apply(next);
  }, [theme, apply]);

  /*
   * Follow the system while no explicit choice has been stored. Once someone
   * has picked a side, their pick outranks the OS — changing the system theme
   * should not silently undo it.
   */
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');

    const sync = () => {
      if (read()) return;
      apply(query.matches ? 'dark' : 'light');
    };

    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, [apply]);

  // Keep theme-color correct on first mount, not only after a toggle.
  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', GROUND[theme]);
  }, [theme]);

  return { theme, toggle };
}
