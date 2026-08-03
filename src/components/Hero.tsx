import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ScrambleIn from './ScrambleIn';
import { VIDEOS } from '../constants/videos';

/** How much of the timeline a full-viewport-width mouse sweep scrubs. */
const SCRUB_SENSITIVITY = 0.8;

const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1.0] as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

interface HeroProps {
  entranceComplete: boolean;
}

export default function Hero({ entranceComplete }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let targetTime = 0;
    let isSeeking = false;
    let lastX: number | null = null;

    const applySeek = () => {
      if (isSeeking || !Number.isFinite(video.duration) || video.duration === 0) return;
      const next = clamp(targetTime, 0, video.duration - 0.01);
      if (Math.abs(next - video.currentTime) < 0.001) return;
      isSeeking = true;
      video.currentTime = next;
    };

    // Chain seeks off `seeked` so a pending seek is never interrupted mid-decode.
    const handleSeeked = () => {
      isSeeking = false;
      applySeek();
    };

    const scrubBy = (deltaX: number) => {
      const { duration } = video;
      if (!Number.isFinite(duration) || duration === 0) return;
      targetTime = clamp(
        targetTime + (deltaX / window.innerWidth) * duration * SCRUB_SENSITIVITY,
        0,
        duration
      );
      applySeek();
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (lastX === null) {
        lastX = event.clientX;
        return;
      }
      const delta = event.clientX - lastX;
      lastX = event.clientX;
      scrubBy(delta);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      if (lastX === null) {
        lastX = touch.clientX;
        return;
      }
      const delta = touch.clientX - lastX;
      lastX = touch.clientX;
      scrubBy(delta);
    };

    const resetPointer = () => {
      lastX = null;
    };

    const handleLoadedMetadata = () => {
      video.pause();
      video.currentTime = 0;
    };

    video.pause();
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeked', handleSeeked);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', resetPointer);
    window.addEventListener('mouseleave', resetPointer);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', resetPointer);
      window.removeEventListener('mouseleave', resetPointer);
    };
  }, []);

  return (
    <section
      id="top"
      className="relative h-screen-dvh w-full overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        src={VIDEOS.hero}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.05,
        }}
      />

      {/* Watermark */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ transform: 'translateY(50px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: entranceComplete ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <span
          className="select-none whitespace-nowrap uppercase"
          style={{
            fontFamily: '"Anton SC", sans-serif',
            fontSize: 'clamp(120px, 30vw, 521px)',
            letterSpacing: '-4px',
            lineHeight: 1,
            opacity: 0.1,
            background:
              'radial-gradient(circle, rgba(142,127,148,0) 0%, #8E7F94 70%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}
        >
          Transcendence
        </span>
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex h-full flex-col px-4 pb-8 pt-20 sm:px-6 sm:pb-12 sm:pt-24 md:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: entranceComplete ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <div className="flex-1" />

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-[clamp(40px,10vw,100px)] font-light leading-[0.95] tracking-[-0.03em] text-white">
              <ScrambleIn text="Brain" delay={200} triggered={entranceComplete} />
              <br />
              <ScrambleIn text="And Body" delay={500} triggered={entranceComplete} />
            </h1>

            <motion.p
              className="max-w-sm text-[13px] leading-relaxed text-white/60 sm:text-[15px]"
              initial={{ opacity: 0, y: 25 }}
              animate={entranceComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              transition={{ duration: 0.9, ease: EASE_OUT_CUBIC, delay: 0.2 }}
            >
              Built at the intersection of neuroscience and artificial intelligence.
              SynapseX continuously maps neural pathways, cognitive load, and physiological
              states into a single adaptive intelligence layer.
            </motion.p>
          </div>

          <h1 className="text-left text-[clamp(40px,10vw,100px)] font-light leading-[0.95] tracking-[-0.03em] text-white md:text-right">
            <ScrambleIn text="One" delay={700} triggered={entranceComplete} />
            <br />
            <ScrambleIn text="Network" delay={1000} triggered={entranceComplete} />
          </h1>
        </div>
      </motion.div>
    </section>
  );
}
