/**
 * Builds public/memoji/kevin.webp from a Memoji recording.
 *
 *   FFMPEG=/path/to/ffmpeg node scripts/build-memoji.mjs path/to/EmojiMovie.mov [start] [frames]
 *
 * Defaults match the shipped sprite: EmojiMovie812735549.mov, 20.55s in, the
 * first 24 of 36 frames sampled over 1.6s — one continuous head turn from
 * facing the reader's right to their left. The recordings themselves are not
 * committed (they are large and carry audio).
 *
 * Needs an ffmpeg that decodes H.264 and encodes libwebp. Playwright's bundled
 * one does neither; `npx @ffmpeg-installer/ffmpeg` in a scratch directory does.
 *
 * The recording is on pure black and the hair is near-black, so a colour key
 * would eat the hair. Instead: flood the background in from the border through
 * near-black pixels, also clear any sizeable near-black island (background
 * showing between a lens and the cheek), and turn the anti-aliased rim into
 * partial alpha so there is no dark halo on the light page.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [input, start = '20.55', keep = '24'] = process.argv.slice(2);
const ffmpeg = process.env.FFMPEG ?? 'ffmpeg';
if (!input) {
  console.error('usage: FFMPEG=… node scripts/build-memoji.mjs <movie.mov> [start] [frames]');
  process.exit(1);
}

const W = 640, H = 480, SAMPLED = 36, SPAN = 1.6, COLS = 6;
const BG = 8, EDGE = 40, PAD = 6;
const KEEP = Number(keep);

const raw = execFileSync(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-ss', start, '-t', String(SPAN), '-i', input,
  '-an', '-vf', `fps=${SAMPLED}/${SPAN}`, '-frames:v', String(SAMPLED),
  '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-',
], { maxBuffer: 1 << 30 });

const FS = W * H * 3;
const n = Math.min(KEEP, raw.length / FS);
let minx = W, maxx = 0, miny = H, maxy = 0;
const frames = [];

for (let f = 0; f < n; f++) {
  const o = f * FS;
  const mx = (i) => Math.max(raw[o + i * 3], raw[o + i * 3 + 1], raw[o + i * 3 + 2]);
  const bg = new Uint8Array(W * H);
  const queue = [];
  const push = (i) => { if (!bg[i] && mx(i) <= BG) { bg[i] = 1; queue.push(i); } };
  for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
  const neighbours = (i) => {
    const x = i % W, y = (i / W) | 0;
    return [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1];
  };
  for (let k = 0; k < queue.length; k++) for (const j of neighbours(queue[k])) if (j >= 0) push(j);

  const seen = new Uint8Array(W * H);
  for (let s = 0; s < W * H; s++) {
    if (bg[s] || seen[s] || mx(s) > BG) continue;
    const island = [s]; seen[s] = 1;
    for (let k = 0; k < island.length; k++)
      for (const j of neighbours(island[k]))
        if (j >= 0 && !seen[j] && !bg[j] && mx(j) <= BG) { seen[j] = 1; island.push(j); }
    if (island.length >= 20) for (const i of island) bg[i] = 1;
  }

  const rgba = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    const r = raw[o + i * 3], g = raw[o + i * 3 + 1], b = raw[o + i * 3 + 2];
    let a = 255;
    if (bg[i]) a = 0;
    else {
      const x = i % W, y = (i / W) | 0;
      let rim = false;
      for (let dy = -2; dy <= 2 && !rim; dy++)
        for (let dx = -2; dx <= 2; dx++) {
          const xx = x + dx, yy = y + dy;
          if (xx >= 0 && yy >= 0 && xx < W && yy < H && bg[yy * W + xx]) { rim = true; break; }
        }
      // A rim pixel is the subject blended with black: its brightness is its coverage.
      if (rim) a = Math.min(255, Math.round((255 * Math.max(0, Math.max(r, g, b) - BG)) / (EDGE - BG)));
    }
    const k = a ? 255 / a : 0, j = i * 4;
    rgba[j] = Math.min(255, Math.round(r * k));
    rgba[j + 1] = Math.min(255, Math.round(g * k));
    rgba[j + 2] = Math.min(255, Math.round(b * k));
    rgba[j + 3] = a;
    if (a > 16) { const x = i % W, y = (i / W) | 0; minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y); }
  }
  frames.push(rgba);
}

// One square crop shared by every frame, so the head never jumps between them.
const S = Math.min(Math.max(maxx - minx, maxy - miny) + PAD * 2, W, H);
const x0 = Math.max(0, Math.min(W - S, ((minx + maxx) >> 1) - (S >> 1)));
const y0 = Math.max(0, Math.min(H - S, ((miny + maxy) >> 1) - (S >> 1)));
const cropped = Buffer.alloc(n * S * S * 4);
frames.forEach((frame, f) => {
  for (let y = 0; y < S; y++) frame.copy(cropped, (f * S * S + y * S) * 4, ((y0 + y) * W + x0) * 4, ((y0 + y) * W + x0 + S) * 4);
});

const dir = mkdtempSync(join(tmpdir(), 'memoji-'));
const rawPath = join(dir, 'frames.rgba');
writeFileSync(rawPath, cropped);
const rows = Math.ceil(n / COLS);
execFileSync(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${S}x${S}`,
  '-i', rawPath, '-vf', `tile=${COLS}x${rows}`, '-frames:v', '1', '-c:v', 'libwebp', '-q:v', '82',
  'public/memoji/kevin.webp',
]);
console.log(`public/memoji/kevin.webp — ${n} frames of ${S}px, ${COLS}×${rows}, ${readFileSync('public/memoji/kevin.webp').length} bytes`);
