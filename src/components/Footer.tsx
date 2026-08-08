import KevinKLogo from './KevinKLogo';
import { VIDEOS } from '../constants/videos';

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-black">
      <div className="flex min-h-[400px] flex-col md:flex-row">
        <div className="h-[300px] w-full md:h-auto md:w-1/2">
          <video
            src={VIDEOS.footer}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex w-full flex-col justify-between p-10 sm:p-16 md:w-1/2">
          <div>
            <div className="mb-8 flex items-center gap-2.5">
              <KevinKLogo className="text-white/70" width={18} height={18} />
              <span className="text-[15px] font-medium tracking-tight text-white/70">
                KevinK
              </span>
            </div>

            <p className="max-w-sm text-[14px] leading-relaxed text-white/40 sm:text-[15px]">
              Personal website build by Kevin Kim. Built with Claude Code, curiosity, and
              for entertainment purposes only.
            </p>
          </div>

          <p className="mt-12 text-[12px] text-white/25">
            © 2026 KevinK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
