/*
 * Background loops are served from the site itself rather than the original
 * CloudFront links, so the page does not depend on those generated-asset URLs
 * staying alive. Sources are re-encoded to 1080p H.264 CRF 26 (~8.8 MB total,
 * down from ~52 MB) — visually equivalent for muted background video.
 */
export const VIDEOS = {
  hero: '/videos/hero.mp4',
  cinematic: '/videos/cinematic.mp4',
  metrics: '/videos/metrics.mp4',
  footer: '/videos/footer.mp4',
} as const;
