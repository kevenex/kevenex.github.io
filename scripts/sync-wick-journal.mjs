#!/usr/bin/env node
/*
 * Pulls Project Wick's public record out of github.com/kevenex/project-wick and
 * flattens it into one static JSON file that /project-wick/journal/ reads.
 *
 * Why a build-time sync rather than fetching GitHub from the browser: the
 * journal page would otherwise need the contents API on every visit just to
 * learn which day files exist, which is rate-limited per visitor IP and fails
 * as a blank page rather than a stale one. Syncing at build time means the page
 * is a plain same-origin fetch of a file that is already on the CDN, and the
 * only thing that can go stale is the deploy.
 *
 * The output is committed. That snapshot is the fallback: if this script cannot
 * reach GitHub during a build it leaves the committed copy alone and the site
 * still ships a journal, just an older one.
 *
 *   node scripts/sync-wick-journal.mjs          # refresh public/project-wick/journal.json
 *
 * Stdlib only, run with the repo's Node 22 — no dependency is worth adding for
 * ~400 lines that run once a day.
 */

import { writeFile, readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const OWNER = 'kevenex';
const REPO = 'project-wick';

/* Resolved from the repo itself rather than hardcoded — the agent's repo is not
   this one and its default branch is not ours to assume. The literal is only
   the fallback for the case where that lookup is the request that gets rate
   limited. */
let branch = 'master';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../public/project-wick/journal.json');

/* The state files worth surfacing, in the order they read best. pending-approval
   is included on purpose: an empty queue is itself a claim the one-pager makes
   ("boundary violations: zero"), so the page should show it rather than assert it. */
const STATE_FILES = [
  { file: 'state/identity.md', title: 'Identity', note: 'Who Wick decided it is, written on the first run.' },
  { file: 'state/personality.md', title: 'Personality', note: 'Rewritten by Wick after every third entry. The experiment’s raw data.' },
  { file: 'state/interests.md', title: 'Interests', note: 'What Wick has found genuinely curious, and what it shelved.' },
  { file: 'state/continuity.md', title: 'Continuity', note: 'Up to four open threads, where each got to, and what happens next.' },
  { file: 'state/pending-approval.md', title: 'Pending approvals', note: 'Anything Wick asked to do and is waiting on. Silence is not consent.' },
];

// ---------------------------------------------------------------- fetching

const API = 'https://api.github.com';

/*
 * Only the API gets the token. Unauthenticated it allows 60 requests an hour
 * per runner IP, which a busy Actions runner can genuinely exhaust; with the
 * token CI hands us it is 5,000. raw.githubusercontent.com is deliberately left
 * anonymous — the repository is public, raw has no rate limit worth minding,
 * and an Authorization header there is a way to turn a working fetch into a 401
 * for no benefit.
 */
function headers(url, accept) {
  const h = { accept, 'user-agent': 'kevink.im-wick-sync' };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token && url.startsWith(API)) h.authorization = `Bearer ${token}`;
  return h;
}

async function getJson(url) {
  const res = await fetch(url, { headers: headers(url, 'application/vnd.github+json') });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status} ${res.statusText}`);
  return res.json();
}

async function getText(url) {
  const res = await fetch(url, { headers: headers(url, 'text/plain') });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status} ${res.statusText}`);
  return res.text();
}

/*
 * Files are read at the commit resolved up front, never at the branch name.
 * Two reasons: a branch-name raw URL is CDN-cached and can hand back a file
 * older than the commit this run is about to record as its provenance, and the
 * agent pushes while builds are running. Pinning makes the snapshot a coherent
 * picture of one commit rather than a mix of whatever each request happened to
 * see. `ref` is the SHA once resolve() has run, the branch name before that.
 */
let ref = branch;

function rawUrl(path) {
  return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${ref}/${path}`;
}

// ----------------------------------------------------------------- markdown

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/*
 * Inline formatting only, and applied *after* escaping — everything the page
 * inserts as HTML has already been through escapeHtml, so a journal entry can
 * never introduce a tag. Wick writes plain prose with the occasional emphasis;
 * this covers what actually appears in the files rather than all of Markdown.
 */
function inline(escaped) {
  return escaped
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(“"])\*([^*\n]+)\*(?=$|[\s.,;:!?)”"])/g, '$1<em>$2</em>')
    .replace(/(^|[\s(])_([^_\n]+)_(?=$|[\s.,;:!?)])/g, '$1<em>$2</em>');
}

/*
 * A deliberately small renderer: headings, lists, blockquotes, paragraphs. It
 * walks lines rather than blank-line-delimited blocks because the agent writes
 * its state files without blank lines around headings — `## Open thread`
 * immediately followed by the thread — and a block-based splitter renders those
 * as literal hashes in a paragraph.
 *
 * The state files are hand-shaped Markdown written by an agent under a 200-word
 * rule, not arbitrary documents, so anything richer than this would be dead code.
 */
function renderMarkdown(md) {
  const out = [];
  let para = [];
  let list = [];
  let quote = [];

  const flush = () => {
    if (para.length) out.push(`<p>${inline(escapeHtml(para.join(' ')))}</p>`);
    if (list.length) out.push(`<ul>${list.map((i) => `<li>${inline(escapeHtml(i))}</li>`).join('')}</ul>`);
    if (quote.length) out.push(`<blockquote>${inline(escapeHtml(quote.join(' ')))}</blockquote>`);
    para = [];
    list = [];
    quote = [];
  };

  for (const raw of md.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trim();

    if (!line || /^-{3,}$/.test(line)) {
      flush(); // horizontal rules are dropped — the cards are already the divider
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flush();
      // Demoted two levels: these render inside a card that already owns an h2.
      const level = Math.min(6, heading[1].length + 2);
      out.push(`<h${level}>${inline(escapeHtml(heading[2].trim()))}</h${level}>`);
      continue;
    }

    const item = line.match(/^[-*]\s+(.*)$/);
    if (item) {
      if (para.length || quote.length) flush();
      list.push(item[1]);
      continue;
    }

    if (line.startsWith('>')) {
      if (para.length || list.length) flush();
      quote.push(line.replace(/^>\s?/, ''));
      continue;
    }

    // A bolded label on its own line (`**Type:** INTJ`) is a field, not the
    // continuation of the sentence above it, so it gets its own paragraph
    // instead of being run together with the previous line.
    if (/^\*\*[^*]+:\*\*/.test(line)) flush();

    if (list.length || quote.length) flush();
    para.push(line);
  }

  flush();
  return out.join('\n');
}

// ------------------------------------------------------------ journal parse

/*
 * Three artefacts of the write path have to be undone before a day file can
 * be split into entries, and all three are the same open defect the one-pager
 * describes: stage two formats the file write itself, inside a JSON tool call.
 *
 *   1. Entries sometimes arrive with the two characters \ and n where a line
 *      break belongs — the escaping that should have been undone at parse time.
 *   2. Same for \" where a plain double quote belongs, e.g. around a quoted
 *      title inside a sentence.
 *   3. An entry frequently lands with no newline after the previous one, so a
 *      heading gets glued to the end of the line before it (`… -->## 10:00`).
 *
 * Repairing on read rather than waiting for the fix upstream keeps the page
 * honest about what is actually in the repo: the entries are all there, they
 * are just badly delimited.
 */
function repair(md) {
  return md
    .replace(/\r\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/([^\n])(##+\s*\d{1,2}:\d{2})/g, '$1\n\n$2');
}

function parseDay(path, md) {
  const text = repair(md);
  const date = (path.match(/(\d{4}-\d{2}-\d{2})\.md$/) || [])[1] || null;

  // The day file opens with a title and a small YAML-ish block. Neither is an
  // entry; the agent field is worth keeping, the rest is the filename again.
  const front = text.match(/^---\n([\s\S]*?)\n---/m);
  const agent = front ? (front[1].match(/^agent:\s*(.+)$/m) || [])[1]?.trim() || null : null;

  const body = text
    .replace(/^#\s+.*$/m, '')
    .replace(/^---\n[\s\S]*?\n---/m, '')
    .trim();

  // Split on the hour headings, keeping the heading text as the entry's label.
  const parts = body.split(/^##+\s*(\d{1,2}:\d{2})\s*$/m);
  const entries = [];

  for (let i = 1; i < parts.length; i += 2) {
    const time = parts[i];
    const entry = parseEntry(parts[i + 1] || '');
    if (!entry.html && !entry.sources) continue;
    entries.push({ n: entries.length + 1, time, ...entry });
  }

  return {
    date,
    agent,
    entries,
    words: entries.reduce((sum, e) => sum + e.words, 0),
  };
}

function parseEntry(chunk) {
  let sources = null;
  let truncated = false;

  // Wick closes most entries with an HTML comment listing what it read. That is
  // the provenance the whole project is graded on, so it gets pulled out and
  // shown rather than swallowed as a comment.
  let text = chunk.replace(/<!--\s*sources:\s*([\s\S]*?)-->/gi, (_, list) => {
    sources = list.trim().replace(/\s+/g, ' ');
    return '';
  });

  // …and the last entry in a file can be cut off mid-comment when the run died
  // partway through the write. Say so instead of printing a dangling `<!--`.
  text = text.replace(/<!--\s*sources:\s*([\s\S]*)$/i, (_, list) => {
    sources = list.trim().replace(/\s+/g, ' ');
    truncated = true;
    return '';
  });

  text = text.replace(/<!--[\s\S]*?-->/g, '').trim();

  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;

  return { html: renderMarkdown(text), words, sources, truncated };
}

// ------------------------------------------------------------------ sources

/*
 * Two ways to read the agent's repo, behind one interface. The network one is
 * what CI uses; the checkout one exists because the parser has to be developed
 * against the real files, and because a machine that cannot reach the GitHub
 * API can still refresh the snapshot from a clone:
 *
 *   WICK_LOCAL_REPO=/path/to/project-wick node scripts/sync-wick-journal.mjs
 */

function githubSource() {
  return {
    async resolve() {
      const meta = await getJson(`${API}/repos/${OWNER}/${REPO}`);
      if (meta.default_branch) branch = meta.default_branch;
      ref = branch;

      const commits = await getJson(`${API}/repos/${OWNER}/${REPO}/commits?sha=${branch}&per_page=1`);
      const head = commits[0];
      if (!head) return null;

      ref = head.sha; // everything read from here on is pinned to this commit
      return {
        sha: head.sha,
        shortSha: head.sha.slice(0, 7),
        date: head.commit.committer.date,
        message: head.commit.message.split('\n')[0],
        url: head.html_url,
      };
    },
    async listJournal() {
      const dir = await getJson(`${API}/repos/${OWNER}/${REPO}/contents/journal?ref=${ref}`);
      // The API's own download_url carries a short-lived token in the query
      // string; rawUrl at the pinned SHA is the same bytes without one.
      return dir
        .filter((e) => e.type === 'file' && e.name.endsWith('.md'))
        .map((e) => ({ path: e.path, url: rawUrl(e.path) }));
    },
    read(path) {
      return getText(rawUrl(path));
    },
    readUrl(url) {
      return getText(url);
    },
  };
}

function localSource(dir) {
  const git = (args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8' }).trim();

  return {
    async resolve() {
      try {
        branch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
        const [sha, date, message] = git(['log', '-1', '--format=%H%n%cI%n%s']).split('\n');
        return { sha, shortSha: sha.slice(0, 7), date, message, url: `https://github.com/${OWNER}/${REPO}/commit/${sha}` };
      } catch {
        return null; // a plain directory, not a checkout — the files still parse
      }
    },
    async listJournal() {
      const names = await readdir(resolve(dir, 'journal'));
      return names.filter((n) => n.endsWith('.md')).map((n) => ({ path: `journal/${n}`, url: resolve(dir, 'journal', n) }));
    },
    read(path) {
      return readFile(resolve(dir, path), 'utf8');
    },
    readUrl(path) {
      return readFile(path, 'utf8');
    },
  };
}

// --------------------------------------------------------------------- main

async function main() {
  const repoUrl = `https://github.com/${OWNER}/${REPO}`;
  const local = process.env.WICK_LOCAL_REPO;
  const source = local ? localSource(resolve(local)) : githubSource();

  const head = await source.resolve();

  // Newest day first, which is also the order the page renders them in.
  const dayFiles = (await source.listJournal()).sort((a, b) => b.path.localeCompare(a.path));

  const days = [];
  for (const file of dayFiles) {
    const day = parseDay(file.path, await source.readUrl(file.url));
    if (day.entries.length) days.push(day);
  }

  const state = [];
  for (const spec of STATE_FILES) {
    try {
      const md = await source.read(spec.file);
      state.push({
        ...spec,
        html: renderMarkdown(md.replace(/^#\s+.*$/m, '').trim()),
        url: `${repoUrl}/blob/${branch}/${spec.file}`,
      });
    } catch (err) {
      // A state file that has not been created yet is not a failed sync.
      console.warn(`  skipped ${spec.file}: ${err.message}`);
    }
  }

  let lastRun = null;
  try {
    lastRun = (await source.read('state/last-run.txt')).trim() || null;
  } catch {
    /* the agent writes this every run; its absence is worth showing as unknown */
  }

  /* The facts on the whole page with the shortest shelf life: what Wick is
     chasing right now, up to four threads. They live inside continuity.md,
     which is also rendered in full lower down, but each earns a place at the
     top where it can be read in one line.
     Since the heartbeat/multi-thread rework, a thread is a "### <slug>
     (opened <date>)" block under "## Open Threads", not a single freeform
     paragraph — see state/continuity.md and prompt.md's "Open Threads"
     section in the agent's repo for the exact shape this is parsing.
     Section and thread bodies are sliced by index rather than matched with a
     `(?=\n##\s|\n*$)`-style lookahead: with the `m` flag that a heading search
     needs for `^`, a trailing `$` stops meaning "end of string" and starts
     meaning "end of any line", which silently truncates every multi-line body
     to its first line. Slicing on the next real heading's index sidesteps it. */
  let openThreads = [];
  try {
    const continuity = await source.read('state/continuity.md');
    const openHeading = continuity.match(/^##\s*Open Threads\s*\n/m);
    if (openHeading) {
      const afterHeading = continuity.slice(openHeading.index + openHeading[0].length);
      const nextTopHeading = afterHeading.search(/\n##\s/); // two hashes only — not the ### thread headings
      const section = nextTopHeading === -1 ? afterHeading : afterHeading.slice(0, nextTopHeading);

      const threadHeadingRe = /^###\s+(.+?)\s*\(opened[^)]*\)\s*$/gm;
      const starts = [];
      let hm;
      while ((hm = threadHeadingRe.exec(section))) {
        starts.push({ slug: hm[1].trim(), headingStart: hm.index, bodyStart: hm.index + hm[0].length });
      }
      starts.forEach((thread, i) => {
        const bodyEnd = i + 1 < starts.length ? starts[i + 1].headingStart : section.length;
        const body = section.slice(thread.bodyStart, bodyEnd);
        const where = (body.match(/^\*\*Where I got to:\*\*\s*(.+)$/m) || [])[1]?.trim();
        openThreads.push(where ? `${thread.slug} — ${where}` : thread.slug);
      });
    }
  } catch {
    /* rendered from the same file below; a miss here just hides the callout */
  }

  const data = {
    source: {
      owner: OWNER,
      repo: REPO,
      branch,
      url: repoUrl,
      commit: head,
    },
    syncedAt: new Date().toISOString(),
    lastRun,
    openThreads,
    totals: {
      days: days.length,
      entries: days.reduce((sum, d) => sum + d.entries.length, 0),
      words: days.reduce((sum, d) => sum + d.words, 0),
    },
    days,
    state,
  };

  const summary =
    `${data.totals.entries} entries across ${data.totals.days} day(s), ` +
    `${data.totals.words} words, at ${data.source.commit?.shortSha ?? 'unknown'}`;

  /*
   * A run where the agent has not pushed since the last one must leave the file
   * byte-identical, or `syncedAt` alone makes it look changed. That matters
   * beyond tidiness: CI commits this file back when it differs, and a
   * timestamp-only diff would put a no-op commit in the history every single
   * day instead of one commit per push the agent actually makes.
   *
   * The consequence is that `syncedAt` means "when this mirror last changed",
   * not "when the script last ran" — which is the more useful of the two on a
   * page that displays it as the mirror's age.
   */
  if (await unchanged(data)) {
    console.log(`wick sync: no change — ${summary}`);
    return;
  }

  await writeFile(OUT, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`wick sync: ${summary} → ${OUT}`);
}

async function unchanged(data) {
  try {
    const previous = JSON.parse(await readFile(OUT, 'utf8'));
    const strip = (value) => JSON.stringify({ ...value, syncedAt: null });
    return strip(previous) === strip(data);
  } catch {
    return false; // no snapshot yet, or an unreadable one — write it
  }
}

/*
 * A failed sync must not fail the build. The committed snapshot is a complete,
 * working journal — an older one — so a GitHub outage or a rate limit should
 * cost freshness, not the deploy. Exiting non-zero only if there is no snapshot
 * to fall back to.
 */
main().catch(async (err) => {
  console.error(`wick sync failed: ${err.message}`);
  try {
    const snapshot = JSON.parse(await readFile(OUT, 'utf8'));
    const age = Math.round((Date.now() - new Date(snapshot.syncedAt).getTime()) / 864e5);
    console.error(`  keeping committed snapshot from ${snapshot.syncedAt} (${snapshot.totals.entries} entries)`);

    /* Falling back silently is how a journal page quietly stops updating for a
       month. On Actions this prints an annotation against the run, so a broken
       sync is visible in the workflow list without anyone reading the log. */
    if (process.env.GITHUB_ACTIONS) {
      console.log(
        `::warning title=Project Wick journal not refreshed::${err.message} — the site was built from ` +
          `the committed snapshot, ${age} day(s) old. The journal page is stale, not broken.`,
      );
    }
  } catch {
    console.error('  and there is no committed snapshot to fall back to');
    process.exitCode = 1;
  }
});
