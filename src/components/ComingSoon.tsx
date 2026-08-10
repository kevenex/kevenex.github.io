import { useState, type FormEvent } from 'react';
import KevinKLogo from './KevinKLogo';
import { PASSWORD_HASH, SITE_ACCESS_KEY } from '../constants/auth';

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export default function ComingSoon() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const hash = await sha256Hex(password);

    if (hash === PASSWORD_HASH) {
      localStorage.setItem(SITE_ACCESS_KEY, 'granted');
      window.location.href = '/app/';
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black px-6 text-white">
      <KevinKLogo className="mb-8 text-white/70" width={28} height={28} />

      <h1
        className="text-center uppercase text-[clamp(32px,8vw,64px)] font-light leading-none tracking-[-0.02em]"
        style={{ fontFamily: '"Anton SC", sans-serif' }}
      >
        Coming Soon
      </h1>

      <p className="mt-4 max-w-xs text-center text-[13px] leading-relaxed text-white/50 sm:text-[14px]">
        This site is being rebuilt. Enter the access password to preview it.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex w-full max-w-[280px] flex-col gap-3">
        <input
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (error) setError(false);
          }}
          placeholder="Password"
          autoFocus
          className="w-full border-b border-white/20 bg-transparent px-1 py-2 text-center text-[14px] tracking-wide text-white outline-none placeholder:text-white/30 focus:border-white/60"
        />

        <button
          type="submit"
          className="mt-2 w-full border border-white/20 py-2 text-[12px] uppercase tracking-[0.15em] text-white/80 transition-colors hover:border-white/50 hover:text-white"
        >
          Enter
        </button>

        {error && (
          <p className="mt-1 text-center text-[12px] text-white/50">Incorrect password.</p>
        )}
      </form>
    </div>
  );
}
