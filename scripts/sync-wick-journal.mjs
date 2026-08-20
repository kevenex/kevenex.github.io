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
  {
    file: 'state/seeded-interests.md',
    title: 'Seeded interests',
    note: 'The one file Wick did not write: a set of questions Kevin injected, kept separate so it can be pulled out without touching the organic ones.',
  },
  { file: 'state/continuity.md', title: 'Continuity', note: 'Up to five open threads, where each got to, and what happens next.' },
  {
    file: 'state/open-thread-seed.md',
    title: 'Open-thread seed',
    note: 'Written by the heartbeat when it finds no threads left, and picked up by the next run as the topic to open. The handoff between the two cadences.',
  },
  { file: 'state/pending-approval.md', title: 'Pending approvals', note: 'Anything Wick asked to do and is waiting on. Silence is not consent.' },
];

/* The wiki is the agent's second record: state/ and journal/ are what it thought,
   wiki/ is what it decided is worth keeping. Only the pages count as content —
   index.md, log.md, hot.md, SCHEMA.md and meta/ are bookkeeping the agent's own
   run.py regenerates from the filesystem after every run, so mirroring them would
   put machine output on a page whose whole claim is that it shows Wick's writing.
   Leading-underscore files (research/<program>/_index.md) are navigation stubs and
   go the same way. */
const WIKI_PAGE =
  /^wiki\/(?:concepts|entities|sources|comparisons|questions|projects|research)\/(?:[^/]+\/)*[^_/][^/]*\.md$/;

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
 * `[[wiki/concepts/thing.md|Label]]` → `Label`, `[[thing]]` → `thing`. Obsidian
 * links resolve inside the agent's vault, which this site does not reproduce:
 * most targets are pages Wick has not written yet, and none of them have a URL
 * here. Rendering the label alone keeps the sentence readable; leaving the
 * brackets in would show markup on a page whose point is the prose.
 */
function wikiLinkText(target, label) {
  if (label) return label.trim();
  const slug = target.trim().split('/').pop().replace(/\.md$/i, '');
  return slug.replace(/[-_]+/g, ' ').trim() || target.trim();
}

/*
 * Inline formatting only, and applied *after* escaping — everything the page
 * inserts as HTML has already been through escapeHtml, so a journal entry can
 * never introduce a tag. Wick writes plain prose with the occasional emphasis;
 * this covers what actually appears in the files rather than all of Markdown.
 */
function inline(escaped) {
  return escaped
    .replace(/\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g, (_, target, label) => wikiLinkText(target, label))
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

// -------------------------------------------------------------- wiki pages

/*
 * Enough YAML for the frontmatter block SCHEMA.md actually specifies: scalars,
 * `key:` followed by `- item` lists, and the odd inline `[a, b]`. A real parser
 * would be a dependency for five keys on a file the agent writes by hand under a
 * template — and anything this misses degrades to a missing chip, not a broken
 * page, because the body is rendered from the text after the block either way.
 */
function unquoteYaml(value) {
  const trimmed = value.trim();
  const quoted = trimmed.match(/^"([\s\S]*)"$|^'([\s\S]*)'$/);
  return quoted ? (quoted[1] ?? quoted[2]) : trimmed;
}

function parseFrontmatter(md) {
  const text = md.replace(/\r\n/g, '\n');
  const block = text.match(/^---\n([\s\S]*?)\n\s*---\n?/);
  if (!block) return { meta: {}, body: text.trim() };

  const meta = {};
  let key = null;

  for (const line of block[1].split('\n')) {
    const scalar = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (scalar) {
      key = scalar[1];
      const raw = scalar[2].trim();
      if (raw === '' || raw === '[]') meta[key] = []; // a bare key opens a list
      else if (raw.startsWith('[') && raw.endsWith(']'))
        meta[key] = raw.slice(1, -1).split(',').map(unquoteYaml).filter(Boolean);
      else meta[key] = unquoteYaml(raw);
      continue;
    }

    const item = line.match(/^\s*-\s+(.*)$/);
    if (item && key) {
      if (!Array.isArray(meta[key])) meta[key] = meta[key] ? [meta[key]] : [];
      meta[key].push(unquoteYaml(item[1]));
    }
  }

  return { meta, body: text.slice(block[0].length).trim() };
}

function parseWikiPage(path, md) {
  const { meta, body } = parseFrontmatter(md);
  const str = (value) => (typeof value === 'string' && value ? value : null);

  return {
    file: path,
    title: str(meta.title) || wikiLinkText(path),
    type: str(meta.type),
    domain: str(meta.domain),
    status: str(meta.status),
    updated: str(meta.updated) || str(meta.created),
    // The h1 repeats the title the card already shows, same as the state docs.
    html: renderMarkdown(body.replace(/^#\s+.*$/m, '').trim()),
  };
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

  /* Wick closes most entries with an HTML comment listing what it read. That is
     the provenance the whole project is graded on, so it gets pulled out and
     shown rather than swallowed as a comment.

     Both spellings are accepted. The agent wrote `sources:` under the old
     prompt and the SPEC-search-thinking-v2 rewrite changed the instruction to
     `<!-- source: url -->`; the singular is rare in the files so far, but a
     mirror that only knows the old spelling silently drops provenance the day
     the agent starts obeying the new one.

     An empty list is not provenance, so it is normalised to null rather than
     carried through as an empty string. The agent has been emitting bare
     `<!-- sources:  -->` markers since Aug 17 — all seven on Aug 18 are empty —
     and letting one of those win over a real list earlier in the same entry
     would lose a citation that was actually made. */
  const capture = (list) => {
    const cleaned = list.trim().replace(/\s+/g, ' ');
    if (cleaned) sources = cleaned;
  };

  let text = chunk.replace(/<!--\s*sources?:\s*([\s\S]*?)-->/gi, (_, list) => {
    capture(list);
    return '';
  });

  // …and the last entry in a file can be cut off mid-comment when the run died
  // partway through the write. Say so instead of printing a dangling `<!--`.
  text = text.replace(/<!--\s*sources?:\s*([\s\S]*)$/i, (_, list) => {
    capture(list);
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
    /* One recursive tree call rather than walking contents/ per directory: the
       wiki nests (research/<program>/<page>.md) and its shape is the agent's to
       change. `truncated` only trips past 100k entries, which this vault will
       not reach; if it ever did, the miss is pages missing from the mirror. */
    async listWiki() {
      const tree = await getJson(`${API}/repos/${OWNER}/${REPO}/git/trees/${ref}?recursive=1`);
      return (tree.tree || [])
        .filter((e) => e.type === 'blob' && WIKI_PAGE.test(e.path))
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
    async listWiki() {
      let names;
      try {
        names = await readdir(resolve(dir, 'wiki'), { recursive: true });
      } catch {
        return []; // a checkout from before the wiki existed
      }
      return names
        .map((n) => `wiki/${String(n).split(/[\\/]/).join('/')}`)
        .filter((path) => WIKI_PAGE.test(path))
        .map((path) => ({ path, url: resolve(dir, path) }));
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

  /* Newest first, on the page's own `updated` field rather than a commit date:
     the agent stamps it when it revises a page, and a page it has not touched
     in a week belongs below one it rewrote this morning regardless of what the
     nightly auto-sync commit did to the file's mtime. */
  const wiki = [];
  for (const file of await source.listWiki()) {
    try {
      wiki.push(parseWikiPage(file.path, await source.readUrl(file.url)));
    } catch (err) {
      console.warn(`  skipped ${file.path}: ${err.message}`);
    }
  }
  wiki.sort((a, b) => (b.updated || '').localeCompare(a.updated || '') || a.title.localeCompare(b.title));

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
     chasing right now — five threads at the cap, since SPEC-heartbeat-config-v2
     took it down from eight. They live inside continuity.md,
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
      wikiPages: wiki.length,
    },
    days,
    wiki,
    state,
  };

  const summary =
    `${data.totals.entries} entries across ${data.totals.days} day(s), ` +
    `${data.totals.words} words, ${data.totals.wikiPages} wiki page(s), ` +
    `at ${data.source.commit?.shortSha ?? 'unknown'}`;

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
