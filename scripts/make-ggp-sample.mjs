// Writes an invented sample of GGPoker exports to a zip, for the GGP Tracker
// screenshot on /projects/ (public/projects/ggp-tracker.webp).
//
//   node scripts/make-ggp-sample.mjs <ggpoker-tracker>/web /tmp/ggp-sample.zip
//
// Then import the zip into a local build of kevenex/ggpoker-tracker and
// capture it. The first argument is that checkout's web/ directory, because
// the zip is written with its copy of JSZip rather than adding a dependency
// here for a script that runs once a redesign.
//
// Tournament summaries cover five months and hand histories the last three,
// which are GG's own retention windows. Nobody's real history: every field,
// finish, card and action is drawn from a seeded RNG, so the same seed gives
// the same screenshot. Pots add up and the betting is legal, but showdowns
// are not evaluated — the winner is drawn — because nothing the screenshot
// shows depends on who held the better hand.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire(process.argv[2] + '/package.json');
const JSZip = require('jszip');
const out = process.argv[3];

let seed = 20261006;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
const pick = (xs) => xs[Math.floor(rand() * xs.length)];
const chance = (p) => rand() < p;
const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
const chips = (n) => Math.round(n).toLocaleString('en-US');
const ord = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th'));
const pad = (n) => String(n).padStart(2, '0');
const hex = () => Math.floor(rand() * 0xfffffff).toString(16).padStart(7, '0');

const EVENTS = [
  ['Daily Hyper', 3, 0.15, [300, 900]],
  ['Mini Deepstack', 5, 0.4, [400, 1500]],
  ['Evening Turbo', 2, 0.15, [500, 1800]],
  ['Weekday Classic', 10, 0.8, [250, 900]],
  ['Late Night Speed', 1, 0.08, [800, 3000]],
  ['Sunday Mini Main', 20, 1.6, [600, 2400]],
];

// ---------------------------------------------------------------- hands

const RANKS = '23456789TJQKA';
const SUITS = 'shdc';
function deck() {
  const d = [];
  for (const r of RANKS) for (const s of SUITS) d.push(r + s);
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}
/** A rough 0..1 preflop strength, so Hero's opens lean toward real hands. */
function strength([a, b]) {
  const hi = Math.max(RANKS.indexOf(a[0]), RANKS.indexOf(b[0]));
  const lo = Math.min(RANKS.indexOf(a[0]), RANKS.indexOf(b[0]));
  let s = (hi * 1.4 + lo) / (12 * 2.4);
  if (a[0] === b[0]) s += 0.35;
  if (a[1] === b[1]) s += 0.06;
  if (hi - lo === 1) s += 0.03;
  return Math.min(1, s);
}
const LEVELS = [100, 120, 160, 200, 250, 300, 400, 500, 600, 800, 1000, 1200, 1600, 2000, 2500, 3000, 4000, 5000];
// Positions by distance from the button, for an 8-handed table.
const POS = ['BTN', 'SB', 'BB', 'UTG', 'UTG1', 'MP', 'HJ', 'CO'];
const OPEN = { UTG: 0.13, UTG1: 0.15, MP: 0.18, HJ: 0.23, CO: 0.3, BTN: 0.42, SB: 0.34, BB: 0 };

function playHand({ handId, tid, name, level, when, button, seats, heroSeat }) {
  const bb = LEVELS[Math.min(level - 1, LEVELS.length - 1)];
  const sb = bb / 2;
  const ante = Math.round(bb / 8);
  const d = deck();
  const n = seats.length;
  const at = (k) => seats[(button + k) % n]; // k-th seat clockwise from the button
  const players = seats.map((s) => ({ ...s, put: 0, street: 0, folded: false }));
  const by = (id) => players.find((p) => p.id === id);
  const posOf = (p) => POS[(players.indexOf(p) - button + n) % n];
  const L = [];
  L.push(`Poker Hand #TM${handId}: Tournament #${tid}, ${name} Hold'em No Limit - Level${level}(${chips(sb)}/${chips(bb)}(${chips(ante)})) - ${when}`);
  L.push(`Table '${(tid % 97) + 1}' 8-max Seat #${button + 1} is the button`);
  players.forEach((p, i) => L.push(`Seat ${i + 1}: ${p.id} (${chips(p.stack)} in chips)`));
  players.forEach((p) => { L.push(`${p.id}: posts the ante ${chips(ante)}`); p.put += ante; });
  const post = (p, amt, what) => { L.push(`${p.id}: posts ${what} ${chips(amt)}`); p.put += amt; p.street = amt; };
  post(players[(button + 1) % n], sb, 'small blind');
  post(players[(button + 2) % n], bb, 'big blind');
  L.push('*** HOLE CARDS ***');
  const hero = players[heroSeat];
  hero.cards = [d.pop(), d.pop()];
  players.forEach((p) => L.push(p === hero ? `Dealt to Hero [${hero.cards.join(' ')}]` : `Dealt to ${p.id}`));

  // ---- preflop
  let bet = bb;
  let raises = 0;
  let aggressor = null;
  const live = () => players.filter((p) => !p.folded);
  const act = (p, kind, amount = 0) => {
    if (kind === 'fold') { p.folded = true; L.push(`${p.id}: folds`); }
    else if (kind === 'check') L.push(`${p.id}: checks`);
    else if (kind === 'call') { const add = bet - p.street; p.put += add; p.street = bet; L.push(`${p.id}: calls ${chips(add)}`); }
    else if (kind === 'bet') { bet = amount; p.put += amount; p.street = amount; aggressor = p; L.push(`${p.id}: bets ${chips(amount)}`); }
    else if (kind === 'raise') { const add = amount - p.street; L.push(`${p.id}: raises ${chips(amount - bet)} to ${chips(amount)}`); bet = amount; p.put += add; p.street = amount; aggressor = p; raises++; }
  };
  const ring = (startK) => Array.from({ length: n }, (_, i) => players[(button + startK + i) % n]);
  let queue = ring(3);
  const decidePre = (p) => {
    const pos = posOf(p);
    const facing = raises;
    if (p === hero) {
      const s = strength(hero.cards);
      if (facing === 0) {
        if (pos === 'BB') return ['check'];
        if (chance(Math.min(0.95, OPEN[pos] * 2.4 * s * s))) return ['raise', Math.round(bb * (pos === 'SB' ? 3 : 2.1))];
        if (pos === 'SB' && chance(0.08)) return ['call'];
        return ['fold'];
      }
      if (facing === 1) {
        if (chance(0.26 * s * s)) return ['raise', Math.round(bet * 3)];
        if (chance(pos === 'BB' ? 0.55 * s : 0.22 * s)) return ['call'];
        return ['fold'];
      }
      return chance(0.45 * s) ? ['call'] : ['fold'];
    }
    if (facing === 0) {
      if (pos === 'BB') return ['check'];
      if (chance(OPEN[pos])) return ['raise', Math.round(bb * (pos === 'SB' ? 3 : 2.1))];
      return ['fold'];
    }
    if (facing === 1) {
      if (chance(0.045)) return ['raise', Math.round(bet * 3)];
      if (chance(pos === 'BB' ? 0.38 : 0.13)) return ['call'];
      return ['fold'];
    }
    return chance(0.38) ? ['call'] : ['fold'];
  };
  while (queue.length) {
    const p = queue.shift();
    if (p.folded) continue;
    if (live().length === 1) break;
    if (p.street === bet && !(raises === 0 && posOf(p) === 'BB')) continue;
    const [kind, amount] = decidePre(p);
    if (kind === 'check' && p.street < bet) { act(p, 'fold'); continue; }
    act(p, kind, amount);
    if (kind === 'raise') {
      const i = players.indexOf(p);
      queue = Array.from({ length: n - 1 }, (_, k) => players[(i + 1 + k) % n]).filter((q) => !q.folded);
    }
  }

  const finish = (winner, showdown) => {
    const streetBets = live().map((p) => p.street).sort((a, b) => b - a);
    if (!showdown && streetBets.length === 1) {
      // Everyone else folded: the part of the last bet nobody matched goes back.
      const others = players.filter((p) => p !== winner).map((p) => p.street);
      const back = winner.street - Math.max(0, ...others);
      if (back > 0) { winner.put -= back; L.push(`Uncalled bet (${chips(back)}) returned to ${winner.id}`); }
    }
    const pot = players.reduce((a, p) => a + p.put, 0);
    L.push('*** SHOWDOWN ***');
    if (showdown) {
      for (const p of live()) {
        if (!p.cards) p.cards = [d.pop(), d.pop()];
        L.push(`${p.id}: shows [${p.cards.join(' ')}]`);
      }
    }
    L.push(`${winner.id} collected ${chips(pot)} from pot`);
    L.push('*** SUMMARY ***');
    L.push(`Total pot ${chips(pot)} | Rake 0 | Jackpot 0 | Bingo 0 | Fortune 0 | Tax 0`);
    return L.join('\n');
  };

  if (live().length === 1) return finish(live()[0], false);

  // ---- postflop: the flop is played; turn and river are checked down, or end in one bet.
  const board = [d.pop(), d.pop(), d.pop()];
  const preAggressor = aggressor;
  const order = () => ring(1).filter((p) => !p.folded);
  for (const street of ['FLOP', 'TURN', 'RIVER']) {
    players.forEach((p) => { p.street = 0; });
    bet = 0; raises = 0; aggressor = null;
    if (street === 'FLOP') L.push(`*** FLOP *** [${board.join(' ')}]`);
    if (street === 'TURN') { board.push(d.pop()); L.push(`*** TURN *** [${board.slice(0, 3).join(' ')}] [${board[3]}]`); }
    if (street === 'RIVER') { board.push(d.pop()); L.push(`*** RIVER *** [${board.slice(0, 4).join(' ')}] [${board[4]}]`); }
    const pot = players.reduce((a, p) => a + p.put, 0);
    let q = order();
    while (q.length) {
      const p = q.shift();
      if (p.folded || live().length === 1) continue;
      if (bet === 0) {
        const isAgg = street === 'FLOP' && p === preAggressor;
        const betP = isAgg ? (p === hero ? 0.66 : 0.58) : street === 'FLOP' ? 0.06 : 0.12;
        if (chance(betP)) {
          act(p, 'bet', Math.round(pot * (isAgg ? 0.4 : 0.6)));
          const i = players.indexOf(p);
          q = Array.from({ length: n - 1 }, (_, k) => players[(i + 1 + k) % n]).filter((x) => !x.folded);
        } else act(p, 'check');
      } else {
        const r = rand();
        if (raises === 0 && r < 0.08) {
          act(p, 'raise', bet * 3);
          const i = players.indexOf(p);
          q = Array.from({ length: n - 1 }, (_, k) => players[(i + 1 + k) % n]).filter((x) => !x.folded);
        } else if (r < 0.5) act(p, 'call');
        else act(p, 'fold');
      }
    }
    if (live().length === 1) return finish(live()[0], false);
  }
  // Showdown: Hero wins a little under half the time they get there.
  const contenders = live();
  const winner = contenders.includes(hero) && chance(0.47) ? hero : pick(contenders.filter((p) => p !== hero));
  return finish(winner, true);
}

// ---------------------------------------------------------------- summaries

const zip = new JSZip();
let id = 271400000;
let handId = 6100000000;
const end = new Date(2026, 9, 4);
let count = 0;
let hands = 0;
for (let dd = 150; dd >= 0; dd--) {
  const day = new Date(end.getTime() - dd * 86400000);
  if (chance(0.45)) continue; // not every day is a session
  const sessions = 1 + Math.floor(rand() * 4);
  for (let s = 0; s < sessions; s++) {
    let [name, buyIn, rake, [lo, hi]] = pick(EVENTS);
    if (name === 'Sunday Mini Main' && day.getDay() !== 0) [name, buyIn, rake, [lo, hi]] = EVENTS[1];
    const players = Math.floor(lo + rand() * (hi - lo));
    const pool = Math.round(buyIn * players * 100) / 100;
    const paid = Math.floor(players * 0.15);
    const rank = Math.max(1, Math.ceil(players * Math.pow(rand(), 1.12)));
    let prize = 0;
    if (rank <= paid) {
      let total = 0;
      for (let r = 1; r <= paid; r++) total += 1 / Math.pow(r, 0.95);
      prize = Math.round(pool * (1 / Math.pow(rank, 0.95) / total) * 100) / 100;
      prize = Math.max(prize, Math.round(buyIn * 1.6 * 100) / 100);
    }
    const reentries = chance(0.08) ? 1 : 0;
    const hour = 17 + Math.floor(rand() * 5);
    const minute = Math.floor(rand() * 4) * 15;
    const stamp = `${day.getFullYear()}${pad(day.getMonth() + 1)}${pad(day.getDate())}`;
    const date = `${day.getFullYear()}/${pad(day.getMonth() + 1)}/${pad(day.getDate())}`;
    id += 1 + Math.floor(rand() * 4000);
    const title = `${name} ${money(buyIn + rake)}`;
    const lines = [
      `Tournament #${id}, ${title}, Hold'em No Limit`,
      `Buy-in: ${money(buyIn)} + ${money(rake)}`,
      `${players} Players`,
      `Total Prize Pool: ${money(pool)}`,
      `Tournament started ${date} ${pad(hour)}:${pad(minute)}:00`,
      `${ord(rank)} : Hero, ${money(prize)}`,
      reentries
        ? `You made ${reentries} re-entries and received a total of ${money(prize)}.`
        : `You received a total of ${money(prize)}.`,
    ];
    zip.file(`GG${stamp} - Tournament #${id} - ${title}.txt`, lines.join('\n') + '\n');
    count++;

    // GG keeps hand histories for three months, so only the recent part of the sample has them.
    if (dd > 88) continue;
    const depth = 1 - rank / players;
    const n = Math.round(25 + depth * depth * 170 + rand() * 20);
    const seats = Array.from({ length: 8 }, () => ({ id: hex(), stack: 0 }));
    const heroSeat = Math.floor(rand() * 8);
    seats[heroSeat].id = 'Hero';
    let button = Math.floor(rand() * 8);
    const text = [];
    for (let h = 0; h < n; h++) {
      const level = 1 + Math.floor(h / 9);
      const bbNow = LEVELS[Math.min(level - 1, LEVELS.length - 1)];
      seats.forEach((p) => { p.stack = Math.round(bbNow * (30 + rand() * 90)); });
      const secs = h * 70 + Math.floor(rand() * 40);
      const t = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute, secs);
      const when = `${t.getFullYear()}/${pad(t.getMonth() + 1)}/${pad(t.getDate())} ${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`;
      text.push(playHand({ handId: handId++, tid: id, name: title, level, when, button, seats, heroSeat }));
      button = (button + 1) % 8;
      hands++;
    }
    zip.file(`GG${stamp}-${pad(hour)}${pad(minute)} - ${title}.txt`, text.join('\n\n\n') + '\n');
  }
}
writeFileSync(out, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
console.log(`wrote ${count} summaries and ${hands} hands to ${out}`);
