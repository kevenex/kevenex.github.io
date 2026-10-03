/**
 * Builds public/memoji/kevin.webp — one still, transparent frame — from a
 * Memoji recording.
 *
 *   FFMPEG=/path/to/ffmpeg node scripts/build-memoji.mjs path/to/EmojiMovie.mov [start] [frame]
 *
 * Defaults match the shipped image: EmojiMovie812735549.mov, sampled from
 * 20.55s at 36 frames over 1.6s, keeping frame 13 — the most front-on point of
 * a head turn. The recordings themselves are not committed (they are large and
 * carry audio).
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

const [input, start = '20.55', pick = '13'] = process.argv.slice(2);
const ffmpeg = process.env.FFMPEG ?? 'ffmpeg';
if (!input) {
  console.error('usage: FFMPEG=… node scripts/build-memoji.mjs <movie.mov> [start] [frame]');
  process.exit(1);
}

const W = 640, H = 480, SAMPLED = 36, SPAN = 1.6;
const BG = 8, EDGE = 40, PAD = 6;
const FRAME = Number(pick);

const raw = execFileSync(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-ss', start, '-t', String(SPAN), '-i', input,
  '-an', '-vf', `fps=${SAMPLED}/${SPAN}`, '-frames:v', String(SAMPLED),
  '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-',
], { maxBuffer: 1 << 30 });

const FS = W * H * 3;
if (FRAME < 0 || FRAME >= raw.length / FS) throw new Error(`frame ${FRAME} is outside the ${raw.length / FS} sampled`);
let minx = W, maxx = 0, miny = H, maxy = 0;
const frames = [];

{
  const o = FRAME * FS;
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

// A square crop around the head, with a little room on every side.
const S = Math.min(Math.max(maxx - minx, maxy - miny) + PAD * 2, W, H);
const x0 = Math.max(0, Math.min(W - S, ((minx + maxx) >> 1) - (S >> 1)));
const y0 = Math.max(0, Math.min(H - S, ((miny + maxy) >> 1) - (S >> 1)));
const [frame] = frames;
const cropped = Buffer.alloc(S * S * 4);
for (let y = 0; y < S; y++) frame.copy(cropped, y * S * 4, ((y0 + y) * W + x0) * 4, ((y0 + y) * W + x0 + S) * 4);

const dir = mkdtempSync(join(tmpdir(), 'memoji-'));
const rawPath = join(dir, 'frame.rgba');
writeFileSync(rawPath, cropped);
execFileSync(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${S}x${S}`,
  '-i', rawPath, '-frames:v', '1', '-c:v', 'libwebp', '-q:v', '85', 'public/memoji/kevin.webp',
]);
console.log(`public/memoji/kevin.webp — frame ${FRAME}, ${S}px, ${readFileSync('public/memoji/kevin.webp').length} bytes`);
