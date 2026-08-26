/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './app/index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      /*
       * One warm, analog palette. The page is paper throughout — "modern" is
       * carried by register (mono data, live timestamps, a hard grid) rather
       * than by cool tones or gradients.
       *
       * Every pairing below was contrast-checked against its ground:
       *   ink/paper 14.3   oxide/paper 5.8   muted/paper 5.7
       *   oxide/paper-lift 6.5   amber/paper 4.7
       * `amber-dot` is the brighter fill and is for non-text marks only,
       * where the 3:1 threshold applies — never for a label.
       */
      colors: {
        paper: {
          DEFAULT: '#E5E1D8', // greige, closer to uncoated stock than to cream
          deep: '#D6CFC2', // taupe band — Project Wick's spread
          lift: '#EFECE4', // toward light, for Contact
        },
        ink: '#161210',
        muted: '#5C544A', // warm grey-brown, biased toward the accent
        oxide: '#8C3A2E', // interactive accent — dark madder
        amber: {
          DEFAULT: '#8A5714', // live-state text
          dot: '#D9903F', // live-state mark only
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
