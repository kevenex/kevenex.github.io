/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './app/index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      /*
       * Colours resolve through CSS variables rather than literals, so a
       * single class like `bg-paper` or `border-ink/15` is correct in both
       * themes and no component needs a `dark:` variant. The channel triplets
       * live in index.css; `<alpha-value>` keeps Tailwind's opacity modifiers
       * working against them.
       *
       * The names are roles, not appearances: `paper` is the page ground and
       * `ink` is the text on it, which stays true when the ground is dark.
       * Measured ratios for both palettes are recorded in index.css beside the
       * values themselves.
       */
      colors: {
        paper: {
          DEFAULT: 'rgb(var(--c-paper) / <alpha-value>)',
          deep: 'rgb(var(--c-paper-deep) / <alpha-value>)',
          lift: 'rgb(var(--c-paper-lift) / <alpha-value>)',
        },
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        oxide: {
          DEFAULT: 'rgb(var(--c-oxide) / <alpha-value>)',
          lift: 'rgb(var(--c-oxide-lift) / <alpha-value>)',
        },
        amber: {
          DEFAULT: 'rgb(var(--c-amber) / <alpha-value>)',
          dot: 'rgb(var(--c-amber-dot) / <alpha-value>)',
        },
        /*
         * The colophon's band is its own role rather than a reuse of `ink`.
         * In light it is near-black under pale text; in dark it goes darker
         * still, so the close stays a distinct band instead of inverting into
         * a bright slab.
         */
        band: {
          DEFAULT: 'rgb(var(--c-band) / <alpha-value>)',
          text: 'rgb(var(--c-band-text) / <alpha-value>)',
        },
      },

      /*
       * Three voices, each with a job: serif is the human, sans is the
       * working voice, mono is the machine. Anything a machine produced —
       * timestamps, commit hashes, coordinates, counts, years — is mono.
       */
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        // Display — Instrument Serif
        hero: ['clamp(52px, 9vw, 132px)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        spread: ['clamp(38px, 6vw, 84px)', { lineHeight: '1.0', letterSpacing: '-0.015em' }],
        section: ['clamp(30px, 4.5vw, 56px)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        // Reading — Instrument Sans
        lead: ['clamp(19px, 2.1vw, 27px)', { lineHeight: '1.5' }],
        body: ['17px', { lineHeight: '1.65' }],
        small: ['15px', { lineHeight: '1.6' }],
        // Machine — Space Mono
        label: ['12px', { lineHeight: '1.4', letterSpacing: '0.14em' }],
        data: ['13px', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        year: ['clamp(40px, 5vw, 72px)', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },

      maxWidth: {
        /*
         * Tuned by measuring the rendered result, not by trusting the unit:
         * `ch` is the advance of "0", which in Instrument Sans is narrower
         * than the average lowercase letter, so a literal 65ch set lines
         * running at ~74 characters. 58ch lands them near 65.
         */
        measure: '58ch',
      },
    },
  },
  plugins: [],
};
