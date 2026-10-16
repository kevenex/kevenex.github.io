/**
 * Builds the favicons from public/memoji/kevin.webp, so the tab carries the
 * same Memoji as the hero rather than a mark of its own. Rerun it whenever
 * build-memoji.mjs replaces that image.
 *
 *   FFMPEG=/path/to/ffmpeg node scripts/build-favicon.mjs
 *
 * Writes:
 *   public/favicon.ico           16, 32 and 48px, each a PNG inside the ICO.
 *   public/apple-touch-icon.png  180px, on the paper colour.
 *
 * An ICO rather than the SVG it replaces: the Memoji is a raster, so an SVG
 * would only wrap a PNG. And /favicon.ico is requested by browsers and
 * crawlers whether or not a page links it; with nothing there, the host's
 * single-page-application fallback answers that request with index.html.
 * 48px is in it because Google's search results ask for a multiple of 48.
 *
 * The tab icon is the cut-out on transparency, no plate. A greige circle and
 * a rounded square were both tried: each shrinks the face by a fifth at 16px,
 * on a light tab bar the plate barely shows so it costs size for nothing, and
 * on a dark one it reads as a beige blob. Bare, the hair loses its edge
 * against a dark tab bar but the face still reads.
 *
 * The touch icon does get a plate, because iOS fills transparency with black.
 * The head is inset so the home screen's corner mask never reaches the hair.
 *
 * Shrinking is area averaging over premultiplied alpha, done here rather
 * than by ffmpeg's scaler. The cut-out keeps black under its transparent
 * pixels, and scaling straight alpha drags that black into the rim — the
 * dark halo build-memoji.mjs works to avoid. ffmpeg only decodes the WebP
 * and encodes PNGs, the same split as that script.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const ffmpeg = process.env.FFMPEG ?? 'ffmpeg';
const SOURCE = 'public/memoji/kevin.webp';
const ICO_SIZES = [16, 32, 48];
const TOUCH = 180;
const TOUCH_INSET = 0.8;
// --c-paper in src/index.css, light theme: the page ground the Memoji sits on.
const PAPER = [0xe5, 0xe1, 0xd8];
// What build-memoji.mjs counts as the subject when it crops.
const SOLID = 16;

const [W, H] = execFileSync(ffmpeg.replace(/ffmpeg$/, 'ffprobe'), [
  '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', SOURCE,
]).toString().trim().split(',').map(Number);
const raw = execFileSync(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-i', SOURCE, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-',
], { maxBuffer: 1 << 26 });

// A square around the head with no margin: at 16px every pixel of padding is
// a pixel of face given up.
let minx = W, maxx = 0, miny = H, maxy = 0;
for (let i = 0; i < W * H; i++) {
  if (raw[i * 4 + 3] <= SOLID) continue;
  const x = i % W, y = (i / W) | 0;
  minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y);
}
const S = Math.min(Math.max(maxx - minx, maxy - miny) + 1, W, H);
const x0 = Math.max(0, Math.min(W - S, ((minx + maxx + 1) >> 1) - (S >> 1)));
const y0 = Math.max(0, Math.min(H - S, ((miny + maxy + 1) >> 1) - (S >> 1)));

const head = new Float64Array(S * S * 4);
for (let y = 0; y < S; y++)
  for (let x = 0; x < S; x++) {
    const i = ((y0 + y) * W + x0 + x) * 4, j = (y * S + x) * 4, a = raw[i + 3] / 255;
    head[j] = raw[i] * a; head[j + 1] = raw[i + 1] * a; head[j + 2] = raw[i + 2] * a; head[j + 3] = raw[i + 3];
  }

/** Each output pixel is the mean of the source area it covers, partial pixels weighted by coverage. */
function shrink(n) {
  const f = S / n;
  const spans = Array.from({ length: n }, (_, i) => {
    const a = i * f, b = (i + 1) * f, w = [];
    for (let p = Math.floor(a); p < Math.min(S, Math.ceil(b)); p++) w.push([p, Math.min(b, p + 1) - Math.max(a, p)]);
    return w;
  });
  const out = new Float64Array(n * n * 4);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const o = (y * n + x) * 4;
      for (const [sy, wy] of spans[y])
        for (const [sx, wx] of spans[x]) {
          const s = (sy * S + sx) * 4, w = (wy * wx) / (f * f);
          for (let c = 0; c < 4; c++) out[o + c] += head[s + c] * w;
        }
    }
  return out;
}

/** Premultiplied floats back to straight 8-bit RGBA. */
function straight(px) {
  const out = Buffer.alloc(px.length);
  for (let i = 0; i < px.length; i += 4) {
    const a = px[i + 3], k = a > 0 ? 255 / a : 0;
    for (let c = 0; c < 3; c++) out[i + c] = Math.min(255, Math.round(px[i + c] * k));
    out[i + 3] = Math.min(255, Math.round(a));
  }
  return out;
}

function png(rgba, n) {
  return execFileSync(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${n}x${n}`, '-i', '-',
    '-frames:v', '1', '-c:v', 'png', '-f', 'image2pipe', '-',
  ], { input: rgba });
}

// ICO: a 6-byte header, a 16-byte entry per image, then the images. A width
// or height byte of 0 means 256; none of these sizes need it.
const pngs = ICO_SIZES.map((n) => png(straight(shrink(n)), n));
const header = Buffer.alloc(6 + 16 * pngs.length);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
let offset = header.length;
pngs.forEach((data, k) => {
  const e = 6 + 16 * k;
  header.writeUInt8(ICO_SIZES[k], e); header.writeUInt8(ICO_SIZES[k], e + 1);
  header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(data.length, e + 8); header.writeUInt32LE(offset, e + 12);
  offset += data.length;
});
const ico = Buffer.concat([header, ...pngs]);
writeFileSync('public/favicon.ico', ico);

// The head shrunk to the inset, then laid over paper with the usual "over".
const inner = Math.round(TOUCH * TOUCH_INSET);
const face = shrink(inner);
const touch = Buffer.alloc(TOUCH * TOUCH * 4);
const pad = (TOUCH - inner) >> 1;
for (let y = 0; y < TOUCH; y++)
  for (let x = 0; x < TOUCH; x++) {
    const o = (y * TOUCH + x) * 4, fx = x - pad, fy = y - pad;
    const inside = fx >= 0 && fy >= 0 && fx < inner && fy < inner;
    const f = inside ? (fy * inner + fx) * 4 : -1;
    const a = inside ? face[f + 3] / 255 : 0;
    for (let c = 0; c < 3; c++) touch[o + c] = Math.min(255, Math.round((inside ? face[f + c] : 0) + PAPER[c] * (1 - a)));
    touch[o + 3] = 255;
  }
const touchPng = png(touch, TOUCH);
writeFileSync('public/apple-touch-icon.png', touchPng);

console.log(`public/favicon.ico — ${ICO_SIZES.join('/')}px from a ${S}px crop, ${ico.length} bytes`);
console.log(`public/apple-touch-icon.png — ${TOUCH}px, ${touchPng.length} bytes`);
