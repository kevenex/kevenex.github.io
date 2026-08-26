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
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-paper px-6 text-ink">
      <KevinKLogo className="mb-8 text-muted" width={28} height={28} />

      <h1 className="text-center font-serif text-section">Coming Soon</h1>

      <p className="mt-4 max-w-xs text-center font-sans text-small text-muted">
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
          className="w-full border-b border-ink/25 bg-transparent px-1 py-2 text-center font-sans text-small text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-oxide focus:border-b-2"
        />

        <button
          type="submit"
          className="mt-2 w-full border border-ink/25 py-2 font-mono text-label uppercase text-muted transition-colors hover:border-oxide hover:text-oxide focus-visible:border-oxide focus-visible:text-oxide focus-visible:outline-none"
        >
          Enter
        </button>

        {error && (
          <p className="mt-1 text-center font-mono text-data text-oxide">
            That password does not match. Check it and try again.
          </p>
        )}
      </form>
    </div>
  );
}
