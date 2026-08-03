import { useEffect, useState } from 'react';

const CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><';

const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

/** Number of characters revealed per animation frame. */
const REVEAL_RATE = 0.5;
/** How far ahead of the reveal cursor random characters are still painted. */
const SCRAMBLE_LOOKAHEAD = 3;
const FRAME_MS = 25;

interface ScrambleInProps {
  text: string;
  delay: number;
  triggered: boolean;
}

export default function ScrambleIn({ text, delay, triggered }: ScrambleInProps) {
  const [started, setStarted] = useState(false);
  const [display, setDisplay] = useState('');

  useEffect(() => {
    if (!triggered) {
      setStarted(false);
      setDisplay('');
      return;
    }
    const timeout = window.setTimeout(() => setStarted(true), delay);
    return () => window.clearTimeout(timeout);
  }, [triggered, delay]);

  useEffect(() => {
    if (!started) return;

    let revealed = 0;
    const interval = window.setInterval(() => {
      revealed += REVEAL_RATE;
      const cursor = Math.floor(revealed);

      if (cursor >= text.length) {
        setDisplay(text);
        window.clearInterval(interval);
        return;
      }

      let next = '';
      for (let i = 0; i < text.length; i += 1) {
        if (text[i] === ' ') {
          next += ' ';
        } else if (i < cursor) {
          next += text[i];
        } else if (i < cursor + SCRAMBLE_LOOKAHEAD) {
          next += randomChar();
        }
      }
      setDisplay(next);
    }, FRAME_MS);

    return () => window.clearInterval(interval);
  }, [started, text]);

  if (!started) return <>&nbsp;</>;

  return <>{display}</>;
}
