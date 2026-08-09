#!/usr/bin/env node
/*
 * Builds github.com/kevenex/chloe-web-app fresh and drops the static output
 * into public/chloe/ — the personal site's copy of "whatever Chloe currently
 * looks like on its default branch," refreshed on the same schedule as the
 * rest of this repo's deploys (push to master, workflow_dispatch, and the
 * daily cron already in deploy.yml).
 *
 * Unlike the Project Wick journal, the output here is never committed. A
 * built JS/CSS bundle gets new hashed filenames on every build even when
 * nothing changed, so committing it would just be daily git noise; the
 * `npm run build` step immediately after this one already reads the fresh
 * copy straight off disk, so nothing depends on it being in git.
 *
 * Best-effort by construction, same as the wick sync: a failure here (a
 * network blip, a broken build on Chloe's side) must not fail this site's
 * deploy over a sibling project. It logs a warning and leaves public/chloe/
 * exactly as it was on disk — including empty, on a run before the first
 * success.
 *
 *   node scripts/sync-chloe.mjs                        # refresh public/chloe/
 *   CHLOE_LOCAL_REPO=/path/to/chloe-web-app node scripts/sync-chloe.mjs
 */

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OWNER = 'kevenex';
const REPO = 'chloe-web-app';
const API = 'https://api.github.com';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(HERE, '../public/chloe');

function headers() {
  const h = { accept: 'application/vnd.github+json', 'user-agent': 'kevink.im-chloe-sync' };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) h.authorization = `Bearer ${token}`;
  return h;
}

// Resolved from the repo itself, same reasoning as the wick sync: this repo
// does not own chloe-web-app's default branch and should not assume its name.
async function defaultBranch() {
  const res = await fetch(`${API}/repos/${OWNER}/${REPO}`, { headers: headers() });
  if (!res.ok) throw new Error(`GET repo → ${res.status} ${res.statusText}`);
  const { default_branch: branch } = await res.json();
  if (!branch) throw new Error('repo metadata had no default_branch');
  return branch;
}

function run(cmd, args, cwd) {
  execFileSync(cmd, args, { cwd, stdio: 'inherit' });
}

function buildAt(dir) {
  console.log('chloe sync: npm ci && npm run build');
  run('npm', ['ci'], dir);
  run('npm', ['run', 'build'], dir);
  const dist = resolve(dir, 'dist');
  if (!existsSync(dist)) throw new Error('build finished but produced no dist/ directory');
  return dist;
}

// Copies dist/ into place. Called from inside the temp-clone's try block
// (not after it returns) — a temp dir removed by a `finally` is gone by the
// time a `return`ed path from that same try block would otherwise be used.
function embed(distDir) {
  rmSync(OUT_DIR, { recursive: true, force: true });
  cpSync(distDir, OUT_DIR, { recursive: true });
  console.log(`chloe sync: embedded fresh build → ${OUT_DIR}`);
}

async function main() {
  const local = process.env.CHLOE_LOCAL_REPO;
  if (local) {
    embed(buildAt(resolve(local)));
    return;
  }

  const branch = await defaultBranch();
  const tmp = mkdtempSync(join(tmpdir(), 'chloe-sync-'));
  try {
    console.log(`chloe sync: cloning ${OWNER}/${REPO}@${branch}`);
    run('git', ['clone', '--depth', '1', '--branch', branch, `https://github.com/${OWNER}/${REPO}.git`, tmp]);
    embed(buildAt(tmp));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/*
 * A failed sync must not fail this site's build — same rule as the wick sync.
 * Unlike that script there is no committed snapshot to fall back to (nothing
 * here is ever committed), so the fallback is simply: leave public/chloe/ as
 * it already was on disk, which is either an untouched checkout of the last
 * successful state or, on the very first run ever, nothing at all.
 */
main().catch((err) => {
  console.error(`chloe sync failed: ${err.message}`);
  const state = existsSync(OUT_DIR)
    ? 'kept the existing build'
    : 'no existing build to fall back to — /chloe/ will 404 until the next successful sync';
  console.error(`  ${state}`);
  if (process.env.GITHUB_ACTIONS) {
    console.log(`::warning title=Chloe not refreshed::${err.message} — ${state}.`);
  }
});
