import { useEffect, useState } from 'react';

const CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><';

const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

/** Frames spent scrambling before each character locks in. */
const FRAMES_PER_CHAR = 4;
const FRAME_MS = 25;

interface ScrambleTextProps {
  text: string;
  isHovered: boolean;
  className?: string;
}

export default function ScrambleText({ text, isHovered, className }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!isHovered) {
      setDisplay(text);
      return;
    }

    let frame = 0;
    const interval = window.setInterval(() => {
      const cursor = Math.floor(frame / FRAMES_PER_CHAR);

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
        } else {
          next += randomChar();
        }
      }
      setDisplay(next);
      frame += 1;
    }, FRAME_MS);

    return () => window.clearInterval(interval);
  }, [isHovered, text]);

  return <span className={className}>{display}</span>;
}
