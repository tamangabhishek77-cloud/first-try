// Shots: chapters 4–8 (guerrilla episode): the blockhouses, the long retreat, the bridge, the kidnapping, fish in the sea.
import { W, H, P, T, clamp, lerp, easeIO, easeOut, easeIn, backOut, ramp, life, rng, mixColor, rgba, parchment, withCam, push, puff } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';
import * as PL from './plates.mjs';
import { dim, tint, cam, fade, tok, xy, V, arrow, column, fishWater, people, bookCover, stretcher, bars } from './gw_common.mjs';
const { CH } = A; const f = T.f, e = T.e, w = T.w;
const TAU = Math.PI * 2;
const ringPts = (cx, cy, r) => Array.from({ length: 28 }, (_, i) => [cx + Math.sin(i / 28 * TAU) * r * 0.85, cy + Math.cos(i / 28 * TAU) * r]);

export const SHOTS_B = [
// ================================================================ CH 4  The blockhouses
{ id: 'S36', at: 'f070', trans: 'black', desc: '1933: stone blockhouses rise one by one on every ridge, joined by roads. Chiang medallion; FIFTH ATTEMPT.',
  sfx: [[f('f070'), 'wind', 0.5, 5], [w('f070', 'fifth'), 'stamp', 0.7], [w('f070', 'changed'), 'impact', 0.6], [w('f071', 'blockhouses'), 'clang', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.5, H * 0.56, () => PL.blockhouses(c, t, { ring: ramp(t, w('f070', 'changed') - 0.3, e('f071') - w('f070', 'changed'), (u) => clamp(u)), dusk: 0.3 }));
    G.dateLine(c, t, { at: f('f070') + 0.1, out: f('f071'), event: 'The fifth encirclement', year: 1933, from: 1931, mode: 'ink', y: 150 });
    G.medallion(c, t, 'chiang', 1640, 280, 100, f('f070') + 0.2, S.end + 0.2, { role: 'his fifth attempt' });
    G.text(c, 'advised by German officers', W / 2, 1010, 'italic 400 50px BodoniItalic', '#F2E8D2', 'center', life(t, w('f071', 'German') - 0.2, S.end, 0.3, 0.3), 'rgba(0,0,0,0.6)');
  } },
{ id: 'S37', at: 'f072', trans: 'cut', desc: 'Map: a ring of blockhouse dots around the red base; it creeps inward month by month and tightens like a noose. THOUSANDS · LIKE A NOOSE.',
  sfx: [[w('f072', 'Thousands'), 'tick', 0.6], [w('f073', 'month'), 'drum', 0.4, 3], [w('f074', 'noose'), 'impact', 0.8]],
  draw(c, t, lt, S) {
    const v = V.south, [cx, cy] = xy(v, [26.0, 115.9]); const u = ramp(t, f('f073'), e('f074') - f('f073'), easeIO), r = lerp(330, 180, u);
    cam(c, lt, S, 1.0, 1.1, W / 2, H / 2, cx, cy, () => { PL.cnMap(c, t, { view: v, soviet: 1, labels: ['Ruijin'], cartouche: 'The blockhouse ring · 1933–34' });
      c.save(); c.fillStyle = 'rgba(42,36,29,0.0)'; const n = 60; for (let i = 0; i < n; i++) { const a = i / n * TAU, rr = r * (1 + 0.06 * Math.sin(i * 3)); const x = cx + Math.cos(a) * rr * 1.15, y = cy + Math.sin(a) * rr; if (clamp(ramp(t, f('f072') - 0.2, 1.4) * n - i) <= 0) continue; PL.blockhouse(c, x, y + 10, 22, P.blue); } c.restore();
      c.strokeStyle = rgba(P.blue, 0.6); c.lineWidth = 4; c.beginPath(); c.ellipse(cx, cy, r * 1.15, r, 0, 0, TAU); c.stroke(); });
    G.slam(c, t, [{ t: 'THOUSANDS' }, { t: 'joined by new roads', small: true }], w('f072', 'Thousands') - 0.05, f('f073'), { x: 440, y: H * 0.3, size: 110, mode: 'ink' });
    G.slam(c, t, [{ t: 'LIKE A NOOSE', red: true }], w('f074', 'noose') - 0.1, S.end + 0.2, { x: 440, y: H * 0.3, size: 110, mode: 'ink' });
  } },
{ id: 'S38', at: 'f075', trans: 'whip', desc: 'New leaders: Mao\'s medallion greys and slides aside; Otto Braun\'s medallion (photo) takes the centre — "Moscow\'s man".',
  sfx: [[w('f075', 'aside'), 'thud', 0.6], [w('f076', 'Moscow'), 'gong', 0.5], [w('f076', 'Braun'), 'whoosh', 0.5]],
  draw(c, t, lt, S) {
    parchment(c, t); const out = ramp(t, w('f075', 'aside') - 0.3, 0.8, easeIO);
    G.medallion(c, t, 'maoY', lerp(W / 2, 360, out), 470, lerp(170, 110, out), f('f075') - 0.3, S.end + 0.2, { grey: out * 0.8, role: 'pushed aside' });
    G.medallion(c, t, 'braun', W / 2 + 120, 460, 190, w('f076', 'Moscow') - 0.1, S.end + 0.2, { role: "the Comintern's military adviser" });
    G.text(c, "MOSCOW'S MAN", W / 2 + 120, 900, '900 80px Bodoni', P.red, 'center', ramp(t, w('f076', 'Moscow') - 0.1, 0.3));
  } },
{ id: 'S39', at: 'f077', trans: 'cut', desc: 'The Red Army attacks a blockhouse line uphill in the open; volleys from the towers; crimson as they fall back. The first line of the spine cracks.',
  sfx: [[w('f077', 'hold'), 'march', 0.6, 3], [w('f077', 'open'), 'volley', 0.7], [w('f078', 'regular'), 'drum', 0.4, 2], [w('f079', 'lost'), 'boom', 0.7], [w('f079', 'lost') + 0.3, 'snap', 0.6]],
  draw(c, t, lt, S) {
    const lost = ramp(t, w('f079', 'lost') - 0.4, 0.9);
    cam(c, lt, S, 1.05, 1.15, W / 2, H * 0.6, W * 0.55, H * 0.55, () => { PL.blockhouses(c, t, { ring: 1, smoke: 1, dusk: 0.4, fire: lost * 0.5 });
      const u = ramp(t, f('f077'), 4, easeIO); for (let i = 0; i < 10; i++) A.figure(c, lerp(120, 700, u) + i * 90 - lost * 200, 1060 - i * 18 - u * 120, 200 - i * 6, CH.redSoldier, { face: 1, walk: t * 6 + i, prop: 'rifle', lean: 12 });
      for (let i = 0; i < 4; i++) { const ph = (t * 1.6 + i * 0.27) % 1; if (ph < 0.15) puff(c, '#FFE2A0', [420, 1180, 1640, 980][i], [760, 780, 750, 560][i], 40, 1 - ph / 0.15, 0.6); } });
    tint(c, '#8A2A1C', 0.4 * lost);
    G.slam(c, t, [{ t: 'they fought like a regular army', small: true }], f('f078') - 0.1, f('f079'), { y: H * 0.42, size: 120 });
    G.slam(c, t, [{ t: 'AND LOST LIKE ONE', red: true }], w('f079', 'lost') - 0.2, S.end + 0.2, { y: H * 0.42, size: 110 });
    G.sixteen(c, t, f('f077') - 0.2, S.end + 0.2, { brush: 16, size: 52, y: 92, lines: [1, 0, 0, 0], crack: ramp(t, w('f079', 'lost'), 0.8), light: true, title: false, en: false });
  } },
{ id: 'S40', at: 'f080', trans: 'cut', dark: true, desc: 'Their losses: a red crowd thins and greys on a dark field. ENORMOUS LOSSES.',
  sfx: [[w('f080', 'losses'), 'impact', 0.7], [w('f080', 'enormous'), 'drum', 0.4, 2]],
  draw(c, t, lt, S) {
    c.fillStyle = '#16120E'; c.fillRect(0, 0, W, H); const u = ramp(t, f('f080'), S.dur * 0.9, easeIO);
    people(c, 300, 380, 26, 6, 40, P.red, u * 0.65, 91);
    G.slam(c, t, [{ t: 'ENORMOUS LOSSES', red: true }], w('f080', 'enormous') - 0.2, S.end + 0.2, { y: H * 0.22, size: 110 });
  } },
{ id: 'S41', at: 'f081', trans: 'ink', desc: 'Map: autumn 1934, the red base shrinks inside the ring; a red arrow probes for a way out; a question mark.',
  sfx: [[f('f081'), 'wind', 0.5, 4], [w('f081', 'dying'), 'thud', 0.6], [w('f082', 'break'), 'impact', 0.6], [w('f083', 'know'), 'tick', 0.5]],
  draw(c, t, lt, S) {
    const v = V.south; cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.5, H * 0.52, () => { PL.cnMap(c, t, { view: v, soviet: lerp(1, 0.45, ramp(t, w('f081', 'dying') - 0.3, 1.2)), labels: ['Ruijin'], cartouche: 'Autumn 1934' });
      const [cx, cy] = xy(v, [26.0, 115.9]); c.strokeStyle = rgba(P.blue, 0.7); c.lineWidth = 6; c.beginPath(); c.ellipse(cx, cy, 200, 175, 0, 0, TAU); c.stroke();
      arrow(c, v, [[25.9, 115.9], [25.7, 115.1], [25.5, 114.2]], ramp(t, w('f082', 'break') - 0.2, 1.4, easeIO), P.red, 12); });
    G.dateLine(c, t, { at: f('f081'), out: f('f082'), event: 'The Soviet is dying', day: 'Autumn', year: 1934, from: 1933, mode: 'ink', y: 150 });
    G.text(c, '?', 520, 760, '900 260px Bodoni', P.red, 'center', ramp(t, w('f083', 'know') - 0.2, 0.4));
    G.text(c, 'they did not yet know where they were going', W / 2, 1000, 'italic 400 48px BodoniItalic', P.ink, 'center', ramp(t, f('f083') - 0.1, 0.4));
  } },

// ================================================================ CH 5  The long retreat
{ id: 'S42', at: 'f084', trans: 'black', dark: true, desc: 'October 1934, night: long columns slip between the blockhouses with lanterns doused. OVER 80,000.',
  sfx: [[f('f084') - 0.2, 'night', 0.6, 8], [w('f084', 'slipped'), 'march', 0.5, 4], [w('f084', '80'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.5, H * 0.56, () => { PL.blockhouses(c, t, { ring: 1, dusk: 0.6 }); dim(c, 0.55);
      const k = (t - f('f084')) * 50; for (let r_ = 0; r_ < 3; r_++) for (let i = 0; i < 14; i++) { const x = ((i * 150 + k + r_ * 60) % 2200) - 200; A.figure(c, x, 900 + r_ * 70, 110 + r_ * 30, PL.shade(CH.redSoldier, '#0E0C0A'), { face: 1, walk: t * 4 + i, prop: i % 3 === 0 ? 'rifle' : null }); } });
    G.dateLine(c, t, { at: f('f084') + 0.1, out: S.end - 0.2, event: 'The breakout', day: 'October', year: 1934, mode: 'light', y: 150 });
    G.slam(c, t, [{ t: 'OVER 80,000' }, { t: 'people slipped out at night', small: true }], w('f084', '80') - 0.05, S.end + 0.2, { y: H * 0.4, size: 130 });
  } },
{ id: 'S43', at: 'f085', trans: 'cut', desc: 'Porters haul printing presses and crates on their backs; then Mao, sick with malaria, carried on a stretcher (medallion: "by some accounts").',
  sfx: [[w('f085', 'printing'), 'clang', 0.5], [w('f085', 'backs'), 'march', 0.5, 3], [w('f086', 'malaria'), 'bell', 0.3], [w('f086', 'stretcher'), 'creak', 0.5]],
  draw(c, t, lt, S) {
    const p2 = ramp(t, f('f086') - 0.3, 0.6);
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.6, W * 0.52, H * 0.6, () => { PL.jinggang(c, t, { dusk: 0.5, village: false, path: 1 });
      fade(c, 1 - p2, () => { const k = (t - f('f085')) * 60; for (let i = 0; i < 6; i++) { const x = ((i * 300 + k) % 2200) - 200, y = 1010 - (i % 2) * 30; A.figure(c, x, y, 230, CH.redSoldier, { face: 1, walk: t * 4 + i, lean: 18, armF: 140, elbF: 40 }); c.fillStyle = '#4A3A2A'; c.fillRect(x - 70, y - 300, 120, 80); c.fillStyle = '#2A241D'; c.fillRect(x - 60, y - 290, 100, 12); } });
      fade(c, p2, () => stretcher(c, t, lerp(700, 1000, ramp(t, f('f086'), 4)), 1030, 260, CH.maoY, CH.redSoldier)); });
    G.slam(c, t, [{ t: 'PRINTING PRESSES' }, { t: 'and heavy equipment, on their backs', small: true }], w('f085', 'printing') - 0.05, f('f086') - 0.1, { y: H * 0.24, size: 100 });
    G.medallion(c, t, 'maoY', 1620, 300, 110, w('f086', 'Mao') - 0.1, S.end + 0.2, { role: 'sick with malaria (by some accounts)' });
  } },
{ id: 'S44', at: 'f087', trans: 'whip', dark: true, desc: 'The Xiang River, under fire: boats and men crossing; flashes on the far bank; smoke. THE ARMY SHRANK BY HALF (by some estimates).',
  sfx: [[f('f087'), 'water', 0.6, 6], [w('f087', 'caught'), 'volley', 0.8], [w('f087', 'crossing'), 'boom', 0.6], [w('f088', 'half'), 'impact', 0.8]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.1, W / 2, H / 2, W * 0.5, H * 0.58, () => PL.riverX(c, t, { boats: 7, fire: ramp(t, w('f087', 'caught') - 0.4, 0.8), dusk: 0.6, night: 0.3, cross: t - f('f087') }));
    G.dateLine(c, t, { at: f('f087'), out: f('f088'), event: 'The Xiang River', day: 'Late November', year: 1934, mode: 'light', y: 150 });
    if (t > f('f088') - 0.3) { dim(c, 0.5 * ramp(t, f('f088') - 0.3, 0.4)); people(c, 560, 560, 16, 3, 40, P.red, ramp(t, w('f088', 'half'), 0.8) * 0.5, 93); }
    G.slam(c, t, [{ t: 'HALVED', red: true }, { t: 'within weeks · by some estimates', small: true }], w('f088', 'half') - 0.05, S.end + 0.2, { y: H * 0.3, size: 130 });
  } },
{ id: 'S45', at: 'f089', trans: 'ink', dark: true, desc: 'Zunyi, January 1935: the leaders around a lamp-lit table; Braun\'s medallion greys ("the blame"); Mao\'s medallion returns in colour ("back into command").',
  sfx: [[f('f089'), 'night', 0.4, 6], [w('f089', 'Zunyi'), 'whoosh', 0.4], [w('f090', 'blame'), 'thud', 0.7], [w('f090', 'command'), 'gong', 0.7]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.05, 1.14, W / 2, H * 0.58, W * 0.5, H * 0.55, () => { PL.hallInterior(c, t, { mode: 'home', night: true, dark: 0.35 }); PL.table(c, 960, 900, 900, 110, '#3A2E22'); PL.candle(c, 960, 790, t, 7);
      [[560, 1], [720, 1], [1200, -1], [1360, -1]].forEach(([x, fc]) => A.figure(c, x, 900, 300, PL.shade(CH.zhou, '#241C14'), { face: fc, seated: true, armF: 40, elbF: 50 }));
      A.figure(c, 1560, 1000, 380, CH.braun, { face: -1, armF: 20, prop: 'scroll' }); A.figure(c, 360, 1000, 380, CH.maoY, { face: 1, armF: 50, elbF: 40 }); });
    G.dateLine(c, t, { at: f('f089') + 0.1, out: S.end - 0.2, event: 'Zunyi', day: '15–17 January', year: 1935, from: 1934, mode: 'light', y: 150 });
    G.medallion(c, t, 'braun', 1660, 320, 100, w('f090', 'Braun') - 0.2, S.end + 0.2, { grey: ramp(t, w('f090', 'blame'), 0.5), slash: 0, role: 'blamed' });
    G.medallion(c, t, 'maoY', 260, 320, 100, w('f090', 'Mao') - 0.1, S.end + 0.2, { role: 'back in command' });
  } },
{ id: 'S46', at: 'f091', trans: 'cut', desc: 'Two-column card: PARTY HISTORY — "the turning point" / HISTORIANS — "more cautious". The cracks in the spine\'s first line heal: the guerrilla rules come back.',
  sfx: [[w('f091', 'Party'), 'paper', 0.6], [w('f091', 'Historians'), 'paper', 0.6], [w('f092', 'rules'), 'gong', 0.6]],
  draw(c, t, lt, S) {
    parchment(c, t); const sp = ramp(t, f('f092') - 0.2, 0.6);
    fade(c, 1 - sp, () => { c.fillStyle = 'rgba(42,36,29,0.8)'; c.fillRect(W / 2 - 3, 300, 6, 560);
      G.text(c, 'PARTY HISTORY', W * 0.28, 380, '600 46px Oswald', P.red, 'center', ramp(t, w('f091', 'Party') - 0.1, 0.3)); G.text(c, '“the turning point”', W * 0.28, 520, 'italic 400 70px BodoniItalic', P.ink, 'center', ramp(t, w('f091', 'turning') - 0.1, 0.3));
      G.text(c, 'HISTORIANS', W * 0.72, 380, '600 46px Oswald', P.ink3, 'center', ramp(t, w('f091', 'Historians') - 0.1, 0.3)); G.text(c, 'more cautious', W * 0.72, 520, 'italic 400 70px BodoniItalic', P.ink, 'center', ramp(t, w('f091', 'cautious') - 0.1, 0.3)); });
    G.sixteen(c, t, f('f092') - 0.4, S.end + 1, { brush: 16, size: 92, y: H * 0.4, lines: [1, 0, 0, 0], crack: 1 - ramp(t, w('f092', 'rules'), 0.8), hi: 0 });
    G.text(c, 'the guerrilla rules came back', W / 2, 780, 'italic 400 58px BodoniItalic', P.red, 'center', ramp(t, w('f092', 'came') - 0.2, 0.4));
  } },
{ id: 'S47', at: 'f093', trans: 'whip', desc: 'Map (Chishui River): the route zig-zags, doubles back and feints — four crossings counted 1–4 as the blue arrows miss.',
  sfx: [[w('f093', 'straight'), 'whoosh', 0.5], [w('f094', 'doubled'), 'whoosh', 0.5], [w('f094', 'feinted'), 'whoosh', 0.5], [w('f095', 'four'), 'splash', 0.6], [w('f095', 'hunters'), 'tick', 0.5]],
  draw(c, t, lt, S) {
    const v = V.chishui; const pts = [[28.0, 107.5], [28.3, 106.0], [28.4, 105.6], [28.1, 105.9], [27.8, 106.3], [28.0, 105.7], [28.3, 105.4], [27.8, 105.8], [27.3, 106.4], [26.9, 106.7]];
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.5, H * 0.52, () => { PL.cnMap(c, t, { view: v, labels: ['Zunyi', 'Chishui'], cartouche: 'The Chishui River · early 1935' });
      c.strokeStyle = '#7E96A0'; c.lineWidth = 12; c.beginPath(); [[28.9, 105.3], [28.5, 105.6], [28.1, 105.9], [27.7, 106.0], [27.4, 105.8]].forEach((p, i) => { const [x, y] = xy(v, p); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke();
      const u = ramp(t, f('f093') + 0.3, e('f095') - f('f093') - 0.5, (x) => clamp(x)); arrow(c, v, pts, u, P.red, 9);
      arrow(c, v, [[29.2, 107.4], [28.6, 106.6], [28.2, 106.2]], ramp(t, w('f094', 'feinted'), 1.5, easeIO), P.blue, 11); arrow(c, v, [[26.6, 104.6], [27.3, 105.2], [27.9, 105.5]], ramp(t, w('f094', 'doubled'), 1.5, easeIO), P.blue, 11); });
    for (let k = 0; k < 4; k++) G.text(c, String(k + 1), 300 + k * 120, 900, '900 110px Bodoni', P.red, 'center', ramp(t, w('f095', 'four') - 0.3 + k * 0.3, 0.2));
    G.text(c, 'CROSSINGS', 480, 980, '600 36px Oswald', P.ink, 'center', ramp(t, w('f095', 'four') + 0.6, 0.3));
  } },

// ================================================================ CH 6  The bridge
{ id: 'S48', at: 'f096', trans: 'black', desc: 'Map: May 1935, the route swings far west to the Dadu River and Luding.',
  sfx: [[f('f096'), 'whoosh', 0.5], [w('f096', 'Dadu'), 'water', 0.5, 3]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.42, H * 0.5, () => PL.cnMap(c, t, { view: V.march, march: lerp(0.52, 0.63, ramp(t, f('f096'), 2.4, easeIO)), labels: ['Ruijin', 'Zunyi', 'Luding'], hi: 'Luding', cartouche: 'The far west · 1935' }));
    G.dateLine(c, t, { at: f('f096') + 0.1, out: S.end - 0.1, event: 'The Dadu River', day: 'May', year: 1935, mode: 'ink', y: 150 });
  } },
{ id: 'S49', at: 'f097', trans: 'cut', desc: 'The Luding Bridge across the gorge: thirteen chains; the near planks are gone (they fade away on "torn up"). 13 IRON CHAINS.',
  sfx: [[f('f097'), 'water', 0.8, 8], [w('f097', 'thirteen'), 'chain', 0.7], [w('f098', 'planks'), 'creak', 0.6], [w('f098', 'torn'), 'snap', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.5, H * 0.46, () => PL.luding(c, t, { planks: lerp(1, 0.33, ramp(t, w('f098', 'torn') - 0.4, 1.0)), dusk: 0.25 }));
    G.scriptName(c, t, 'Luding Bridge', f('f097') - 0.1, w('f097', 'thirteen') - 0.1, { y: H * 0.8, size: 150, role: 'over the Dadu River' });
    G.slam(c, t, [{ t: '13 IRON CHAINS' }], w('f097', 'thirteen') - 0.05, f('f098') - 0.1, { y: H * 0.8, size: 110 });
    G.text(c, 'party history says…', W / 2, H * 0.84, 'italic 400 56px BodoniItalic', '#F2E8D2', 'center', life(t, f('f098'), S.end, 0.3, 0.3), 'rgba(0,0,0,0.6)');
  } },
{ id: 'S50', at: 'f099', trans: 'cut', desc: 'Close on the chains: volunteers crawl hand over hand toward the burning far end, under fire (muzzle flashes, no wounds).',
  sfx: [[w('f099', 'volunteers'), 'chain', 0.6], [w('f099', 'crawled'), 'chain', 0.6], [w('f099', 'fire'), 'volley', 0.8], [w('f099', 'fire') + 0.4, 'fire', 0.5, 3]],
  draw(c, t, lt, S) {
    const L = PL.LUDING; cam(c, lt, S, 1.6, 1.75, W * 0.62, H * 0.44, W * 0.7, H * 0.44, () => { PL.luding(c, t, { planks: 0.33, fire: ramp(t, w('f099', 'fire') - 0.6, 0.8), dusk: 0.3 });
      for (let i = 0; i < 6; i++) { const x = lerp(520, 1180, ramp(t, f('f099') + i * 0.25, 5)) - i * 90; A.figure(c, x, L.y(x) + 6, 64, PL.shade(CH.redSoldier, '#1E1812'), { face: 1, kneel: 0.7, armF: 100 + Math.sin(t * 6 + i) * 30, elbF: 0, lean: 30 }); }
      for (let i = 0; i < 3; i++) { const ph = (t * 1.3 + i * 0.33) % 1; if (ph < 0.15) puff(c, '#FFE2A0', 1640 + i * 30, 430 + i * 14, 24, 1 - ph / 0.15, 0.6); } });
    G.text(c, 'a few dozen volunteers', W / 2, H * 0.86, 'italic 400 56px BodoniItalic', '#F2E8D2', 'center', life(t, w('f099', 'few') - 0.1, S.end, 0.3, 0.3), 'rgba(0,0,0,0.6)');
  } },
{ id: 'S51', at: 'f100', trans: 'cut', desc: 'The same bridge, drained of colour and fire; a red DISPUTED stamp; "some historians doubt there was much of a battle at all".',
  sfx: [[w('f100', 'doubt'), 'stamp', 0.8], [w('f100', 'battle'), 'tick', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.2, 1.15, W * 0.55, H * 0.45, W / 2, H * 0.45, () => PL.luding(c, t, { planks: 0.33, fire: 0, dusk: 0.1 }));
    c.save(); c.globalCompositeOperation = 'saturation'; c.fillStyle = `rgba(128,128,128,${0.8 * ramp(t, f('f100'), 0.8)})`; c.fillRect(0, 0, W, H); c.restore();
    G.stamp(c, t, 'DISPUTED', w('f100', 'doubt'), S.end + 0.2, { x: W / 2, y: H * 0.3, size: 130, rot: -0.08 });
    G.text(c, 'some historians doubt there was much of a battle at all', W / 2, H * 0.86, 'italic 400 50px BodoniItalic', '#F2E8D2', 'center', life(t, w('f100', 'historians'), S.end, 0.3, 0.3), 'rgba(0,0,0,0.6)');
  } },
{ id: 'S52', at: 'f101', trans: 'whip', desc: 'Either way: the planks are back and a long file of soldiers crosses the bridge.',
  sfx: [[f('f101'), 'march', 0.6, 3], [w('f101', 'across'), 'chain', 0.4]],
  draw(c, t, lt, S) {
    const L = PL.LUDING; cam(c, lt, S, 1.15, 1.25, W / 2, H * 0.45, W * 0.55, H * 0.45, () => { PL.luding(c, t, { planks: 1, dusk: 0.15 });
      const k = (t - f('f101')) * 70; for (let i = 0; i < 14; i++) { const x = ((i * 110 + k) % 1400) + 300; A.figure(c, x, L.y(x), 72, CH.redSoldier, { face: 1, walk: t * 5 + i, prop: i % 2 ? 'rifle' : null }); } });
    G.slam(c, t, [{ t: 'either way', small: true }, { t: 'THEY GOT ACROSS' }], w('f101', 'Either') - 0.05, S.end + 0.2, { y: H * 0.78, size: 100 });
  } },
{ id: 'S53', at: 'f102', trans: 'ink', desc: 'The Snow Mountains: a file of men in thin cotton climbs into a blizzard.',
  sfx: [[f('f102') - 0.2, 'wind', 0.9, 5], [w('f102', 'Snow'), 'whoosh', 0.4]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.1, W / 2, H / 2, W * 0.46, H * 0.56, () => { PL.snowGrass(c, t, { mode: 'snow', blizzard: 0.8 });
      for (let i = 0; i < 9; i++) { const u = clamp(((t - f('f102')) * 0.06 + i * 0.1) % 1); const x = lerp(200, 1100, u), y = lerp(1060, 690, u); A.figure(c, x, y, lerp(170, 60, u), CH.redSoldier, { face: 1, walk: t * 3 + i, lean: 16 }); } });
    G.text(c, 'climbed in thin cotton uniforms', W / 2, 220, 'italic 400 56px BodoniItalic', '#2A241D', 'center', life(t, w('f102', 'thin') - 0.2, S.end, 0.3, 0.3));
  } },
{ id: 'S54', at: 'f103', trans: 'cut', desc: 'The grasslands: fog over swamp; a line of men picks its way; one figure sinks into the fog and is gone (no body shown).',
  sfx: [[f('f103'), 'wind', 0.5, 4], [w('f103', 'swamps'), 'splash', 0.5], [w('f103', 'sank'), 'thud', 0.4]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.52, H * 0.6, () => { PL.snowGrass(c, t, { mode: 'grass', fog: 0.9 });
      for (let i = 0; i < 7; i++) { const x = 1500 - i * 150 - (t - f('f103')) * 30, sink = i === 3 ? ramp(t, w('f103', 'sank') - 0.2, 1.2) : 0; fade(c, 1 - sink, () => { c.save(); c.beginPath(); c.rect(0, 0, W, 940 + i * 8 - sink * 0); c.clip(); A.figure(c, x, 940 + i * 8 + sink * 120, 150, CH.redSoldier, { face: -1, walk: t * 3 + i, lean: 8 }); c.restore(); }); }
      for (let i = 0; i < 6; i++) puff(c, '#E8E4D2', i * 360, 960, 320, 0.4, 0.3); });
  } },
{ id: 'S55', at: 'f104', trans: 'black', desc: 'Map: the route reaches northern Shaanxi (Wuqi), October 1935; FEWER THAN 10,000 left.',
  sfx: [[f('f104'), 'whoosh', 0.5], [w('f104', 'reached'), 'gong', 0.6], [w('f105', 'fewer'), 'impact', 0.7]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.05, W / 2, H / 2, W * 0.5, H * 0.46, () => { PL.cnMap(c, t, { view: V.march, march: lerp(0.63, 1, ramp(t, f('f104') - 0.2, 2.2, easeIO)), labels: ['Ruijin', 'Luding', 'Wuqi'], hi: 'Wuqi', cartouche: '1934–1935' }); });
    G.dateLine(c, t, { at: f('f104') + 0.1, out: f('f105'), event: 'Northern Shaanxi', day: 'October', year: 1935, from: 1934, mode: 'ink', y: 150 });
    dim(c, 0.35 * ramp(t, f('f105') - 0.2, 0.4));
    G.slam(c, t, [{ t: 'FEWER THAN 10,000' }, { t: 'left, by most accounts', small: true }], w('f105', 'fewer') - 0.05, S.end + 0.2, { y: H * 0.5, size: 130 });
  } },
{ id: 'S56', at: 'f106', trans: 'cut', desc: 'Odometers on parchment: 25,000 LI ≈ 12,500 km (Mao) against ≈ 6,000 km (measured by two British walkers). A very long way.',
  sfx: [[w('f106', '25'), 'tick', 0.6], [w('f106', 'kilometres'), 'tick', 0.5], [w('f107', 'British'), 'paper', 0.5], [w('f107', '6'), 'tick', 0.6], [w('f108', 'long'), 'whoosh', 0.4]],
  draw(c, t, lt, S) {
    parchment(c, t); c.save(); c.globalAlpha = 0.35; c.strokeStyle = P.red; c.lineWidth = 8; c.setLineDash([22, 14]); c.beginPath(); for (let x = 120; x < 1800; x += 40) c.lineTo(x, 900 + Math.sin(x / 140) * 60); c.stroke(); c.restore();
    G.text(c, 'MAO', 500, 270, '600 42px Oswald', P.red, 'center', ramp(t, f('f106') - 0.1, 0.3)); G.counter(c, t, 0, 25000, w('f106', '25') - 0.3, 1.2, 500, 470, { color: P.ink, mode: 'ink', label: 'li', labelColor: P.ink3, size: 130 });
    G.text(c, '≈ 12,500 km', 500, 620, 'italic 400 60px BodoniItalic', P.ink, 'center', ramp(t, w('f106', 'kilometres') - 0.3, 0.3));
    G.text(c, 'MEASURED ON FOOT, 2003', 1420, 270, '600 42px Oswald', P.ink3, 'center', ramp(t, f('f107') - 0.1, 0.3)); G.counter(c, t, 0, 6000, w('f107', '6') - 0.3, 1.0, 1420, 470, { color: P.ink, mode: 'ink', label: 'km', labelColor: P.ink3, size: 130, out: 1e9 });
    G.text(c, 'Ed Jocelyn & Andrew McEwen', 1420, 620, 'italic 400 44px BodoniItalic', P.ink3, 'center', ramp(t, w('f107', 'British'), 0.3));
    G.text(c, 'either way, a very long way to run', W / 2, 1010, 'italic 400 54px BodoniItalic', P.red, 'center', ramp(t, f('f108') - 0.1, 0.4));
  } },
{ id: 'S57', at: 'f109', trans: 'cut', dark: true, desc: 'Northern Shaanxi at dusk: a ragged handful by the caves; CORNERED · STARVING; then Chiang\'s medallion in cold blue and blue arrows close in — hold for the mid-roll silence.',
  sfx: [[w('f109', 'survived'), 'tick', 0.5], [w('f109', 'cornered'), 'impact', 0.6], [w('f109', 'starving'), 'impact', 0.6], [w('f110', 'Chiang'), 'drum', 0.6, 2], [w('f110', 'finish'), 'boom', 0.8]],
  draw(c, t, lt, S) {
    const ch_ = ramp(t, f('f110') - 0.3, 0.6);
    cam(c, lt, S, 1.0, 1.12, W / 2, H / 2, W * 0.5, H * 0.58, () => { PL.yanan(c, t, { dusk: 0.8, night: 0.35 });
      for (let i = 0; i < 5; i++) A.figure(c, 560 + i * 170, 1010, 230, CH.redSoldier, { face: i % 2 ? 1 : -1, armF: 5, elbF: 10, lean: 6 }); });
    dim(c, 0.5 * ch_); tint(c, '#3E5C76', 0.35 * ch_);
    G.slam(c, t, [{ t: 'CORNERED' }], w('f109', 'cornered') - 0.05, f('f110'), { x: 560, y: H * 0.26, size: 110 });
    G.slam(c, t, [{ t: 'STARVING', red: true }], w('f109', 'starving') - 0.05, f('f110'), { x: 1360, y: H * 0.26, size: 110 });
    G.medallion(c, t, 'chiang', W / 2, 470, 190, w('f110', 'Chiang') - 0.1, S.end - 0.3, { ring: P.blue, role: 'coming to finish them' });
  } },

// ================================================================ CH 7  The kidnapping
{ id: 'S58', at: 'f111', trans: 'black', desc: 'Summer 1936: an American reporter arrives at the cave camp (Edgar Snow, notebook in hand); Snow medallion — his own photo in a Red Army cap.',
  sfx: [[f('f111'), 'camp', 0.5, 6], [w('f111', 'American'), 'whoosh', 0.4], [w('f112', 'Snow'), 'paper', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.6, W * 0.55, H * 0.6, () => { PL.yanan(c, t, {});
      const u = ramp(t, f('f111'), 3.5, easeIO); A.figure(c, lerp(1900, 1250, u), 1010, 340, CH.snow, { face: -1, walk: u < 1 ? t * 4 : null, prop: 'tract', armF: 50, elbF: 50 });
      A.figure(c, 800, 1010, 330, CH.maoYan, { face: 1, armF: lerp(5, 50, ramp(t, f('f112'), 0.6)), elbF: 30 }); A.figure(c, 600, 1010, 300, CH.redSoldier, { face: 1, prop: 'rifle' }); });
    G.dateLine(c, t, { at: f('f111') + 0.1, out: f('f112'), event: 'Northern Shaanxi', day: 'Summer', year: 1936, from: 1935, mode: 'ink', y: 150 });
    G.medallion(c, t, 'snow', 1650, 300, 120, w('f112', 'Edgar') - 0.1, S.end + 0.2, { role: 'American journalist' });
  } },
{ id: 'S59', at: 'f113', trans: 'cut', desc: 'Archive photo: Mao in northern Shaanxi, 1936; the book cover RED STAR OVER CHINA (1937) slides in.',
  sfx: [[w('f113', 'book'), 'paper', 0.6], [w('f113', 'famous'), 'bell', 0.4]],
  draw(c, t, lt, S) {
    c.fillStyle = '#16120E'; c.fillRect(0, 0, W, H);
    G.archival(c, t, 'a_mao36', f('f113') - 0.2, S.end + 0.4, { x: W * 0.38, w: 980, h: 760, caption: 'Mao Zedong in northern Shaanxi, 1936', credit: 'Archive photo · Wikimedia Commons' });
    const u = ramp(t, w('f113', 'Red') - 0.3, 0.7, backOut); if (u > 0) bookCover(c, lerp(2200, 1480, u), 520, 420, -0.06);
  } },
{ id: 'S60', at: 'f114', trans: 'whip', desc: 'Map: December 1936, Chiang flies from Nanjing to Xi\'an (a plane icon traces the route) to order one last offensive.',
  sfx: [[f('f114'), 'whoosh', 0.6], [w('f114', 'flew'), 'wind', 0.5, 3], [w('f114', 'offensive'), 'drum', 0.5, 2]],
  draw(c, t, lt, S) {
    const v = V.north; cam(c, lt, S, 1.0, 1.05, W / 2, H / 2, W * 0.48, H * 0.52, () => { PL.cnMap(c, t, { view: v, labels: ['Nanjing', "Xi'an", "Yan'an"], hi: "Xi'an", cartouche: 'December 1936' });
      const end = G.route(c, v, ['Nanjing', "Xi'an"], ramp(t, w('f114', 'flew') - 0.3, 2.2, easeIO), { color: P.blue, w: 5 }); if (end) { c.save(); c.translate(end[0], end[1]); c.fillStyle = P.ink; c.rotate(-0.3 + Math.PI); c.fillRect(-26, -5, 52, 10); c.fillRect(-6, -28, 12, 56); c.fillRect(18, -12, 8, 24); c.restore(); }
      tok(c, v, "Yan'an", P.red, 1, null, 22); });
    G.dateLine(c, t, { at: f('f114'), out: S.end - 0.2, event: "Chiang flies to Xi'an", day: 'December', year: 1936, mode: 'ink', y: 150 });
    G.medallion(c, t, 'chiang', 1660, 300, 100, f('f114') + 0.2, S.end + 0.2, {});
  } },
{ id: 'S61', at: 'f115', trans: 'cut', desc: 'His generals: Zhang Xueliang\'s medallion; the map darkens Manchuria (seized by Japan, 1931). A DIFFERENT ENEMY: JAPAN.',
  sfx: [[w('f115', 'Japan'), 'gong', 0.6], [w('f116', 'Manchuria'), 'impact', 0.6], [w('f116', 'Zhang'), 'whoosh', 0.5]],
  draw(c, t, lt, S) {
    const v = { lon: 118, lat: 39, span: 32 }; cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.58, H * 0.42, () => { PL.cnMap(c, t, { view: v, labels: ["Xi'an", 'Manchuria'], cartouche: 'Japanese-held since 1931' });
      G.fillRegion(c, 'eastasia', v, [[53, 120], [49, 135], [42.5, 131], [40, 124.5], [39, 121.5], [41, 119], [43, 121], [46, 118], [49.5, 117]], '#2A241D', 0.45 * ramp(t, w('f116', 'Manchuria') - 0.4, 0.8)); });
    G.slam(c, t, [{ t: 'a different enemy', small: true }, { t: 'JAPAN', red: true }], w('f115', 'Japan') - 0.1, f('f116'), { x: 560, y: H * 0.5, size: 150, mode: 'ink' });
    G.medallion(c, t, 'zhangX', 420, 560, 140, w('f116', 'Zhang') - 0.2, S.end + 0.2, { role: 'his homeland was Manchuria' });
  } },
{ id: 'S62', at: 'f117', trans: 'black', dark: true, desc: 'Xi\'an, before dawn, 12 December 1936: torches of Zhang\'s troops climb toward the pavilions; shots.',
  sfx: [[f('f117'), 'night', 0.6, 5], [w('f117', 'stormed'), 'volley', 0.7], [w('f117', 'dawn'), 'march', 0.5, 2]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.1, W / 2, H / 2, W * 0.62, H * 0.66, () => { PL.xian(c, t, { torches: ramp(t, f('f117'), 1.2), dawn: 0.4, night: 0.55 });
      for (let i = 0; i < 6; i++) A.figure(c, 1100 + i * 90 + ramp(t, f('f117'), 4) * 120, 960 - i * 20, 140, PL.shade(CH.zhangX, '#141210'), { face: 1, walk: t * 6 + i, prop: 'rifle' }); });
    G.dateLine(c, t, { at: f('f117') + 0.1, out: S.end - 0.2, event: "Xi'an, before dawn", day: '12 December', year: 1936, mode: 'light', y: 150 });
  } },
{ id: 'S63', at: 'f118', trans: 'cut', dark: true, desc: 'Chiang, in his nightclothes, scrambles up the frosty hillside; he crouches among the rocks; torchlight finds him.',
  sfx: [[w('f118', 'fled'), 'whoosh', 0.5], [w('f118', 'nightclothes'), 'scuffle', 0.6], [w('f119', 'hiding'), 'snap', 0.4], [w('f119', 'rocks'), 'thud', 0.5]],
  draw(c, t, lt, S) {
    const hide = ramp(t, w('f119', 'hiding') - 0.4, 0.6), u = ramp(t, f('f118'), e('f118') - f('f118'), easeIO);
    cam(c, lt, S, 1.2, 1.35, W * 0.42, H * 0.5, W * 0.38, H * 0.42, () => { PL.xian(c, t, { torches: 1, dawn: 0.5, night: 0.5 });
      A.figure(c, lerp(900, 640, u), lerp(900, 640, u), 210, CH.chiangNight, { face: -1, walk: hide < 1 ? t * 7 : null, lean: hide ? 0 : -14, kneel: hide, armF: hide ? 90 : 40, elbF: 20 });
      if (hide > 0) { const tb = ramp(t, w('f119', 'rocks'), 1); A.flames(c, lerp(1100, 800, tb), lerp(860, 700, tb), 16, 34, t, 77, 3); PL.sun(c, lerp(1100, 800, tb), lerp(850, 690, tb), 220, rgba('#FFB060', 0.35)); } });
    G.text(c, 'by most accounts', W / 2, 200, 'italic 400 46px BodoniItalic', '#F2E8D2', 'center', life(t, f('f118'), w('f118', 'nightclothes'), 0.3, 0.3), 'rgba(0,0,0,0.6)');
  } },
{ id: 'S64', at: 'f120', trans: 'cut', dark: true, desc: 'Chiang\'s medallion: "the man who hunted the communists for nine years" — PRISONER stamp.',
  sfx: [[w('f120', 'nine'), 'tick', 0.5], [w('f121', 'prisoner'), 'stamp', 1.0], [w('f121', 'prisoner') + 0.1, 'gate', 0.6]],
  draw(c, t, lt, S) {
    c.fillStyle = '#14100C'; c.fillRect(0, 0, W, H);
    G.medallion(c, t, 'chiang', W / 2, 460, 220, f('f120') - 0.2, S.end + 0.4, { role: 'hunted the communists for nine years', light: true });
    G.stamp(c, t, 'PRISONER', w('f121', 'prisoner'), S.end + 0.4, { x: W / 2, y: 470, size: 150, rot: -0.12 });
  } },
{ id: 'S65', at: 'f122', trans: 'whip', desc: 'Released: three medallions — Chiang, Zhang, and Zhou Enlai (the communists\' envoy) — linked by a cord; UNITED FRONT AGAINST JAPAN.',
  sfx: [[w('f122', 'released'), 'gate', 0.6], [w('f123', 'Zhou'), 'whoosh', 0.5], [w('f123', 'deal'), 'seal', 0.6], [w('f124', 'Japan'), 'gong', 0.7]],
  draw(c, t, lt, S) {
    parchment(c, t); const link = ramp(t, w('f123', 'deal') - 0.2, 0.8);
    c.strokeStyle = P.red; c.lineWidth = 6; c.beginPath(); c.moveTo(480, 470); c.lineTo(lerp(480, W - 480, link), 470); c.stroke();
    G.medallion(c, t, 'chiang', 480, 470, 140, f('f122') - 0.2, S.end + 0.2, { role: 'released after two weeks' });
    G.medallion(c, t, 'zhangX', W / 2, 470, 140, f('f122') + 0.2, S.end + 0.2, {});
    G.medallion(c, t, 'zhou', W - 480, 470, 140, w('f123', 'Zhou') - 0.2, S.end + 0.2, { role: 'the communist envoy' });
    G.slam(c, t, [{ t: 'STOP THE CIVIL WAR', size: 80 }, { t: 'FIGHT JAPAN', red: true, size: 110 }], w('f124', 'stop') - 0.1, S.end + 0.2, { y: H * 0.84, size: 100, mode: 'ink' });
  } },
{ id: 'S66', at: 'f125', trans: 'cut', desc: 'Zhang\'s medallion greys behind bars ("decades under arrest"); then the map: the blue arrows pull back from Yan\'an. THE HUNT WAS OVER. FOR NOW.',
  sfx: [[w('f125', 'arrest'), 'gate', 0.7], [w('f126', 'hunt'), 'whoosh', 0.5], [w('f126', 'now'), 'tick', 0.6]],
  draw(c, t, lt, S) {
    const p2 = ramp(t, f('f126') - 0.3, 0.5);
    fade(c, 1 - p2, () => { parchment(c, t); G.medallion(c, t, 'zhangX', W / 2, 470, 190, f('f125') - 0.3, S.end + 1, { grey: ramp(t, w('f125', 'arrest'), 0.6) * 0.7, role: 'under arrest for decades' });
      const bu = ramp(t, w('f125', 'arrest') - 0.2, 0.4); for (let i = 0; i < 7; i++) { c.fillStyle = rgba(P.ink, 0.85); c.fillRect(W / 2 - 240 + i * 80, lerp(-200, 240, bu), 14, 470); } });
    fade(c, p2, () => { const v = V.north; PL.cnMap(c, t, { view: v, labels: ["Yan'an", "Xi'an"], hi: "Yan'an", cartouche: '1937' }); tok(c, v, "Yan'an", P.red, 1, null, 26);
      const back = ramp(t, f('f126'), 1.6, easeIO); arrow(c, v, [[35.6, 110.5], [34.0 + 0 * back, lerp(112, 115, back)]], 1, rgba(P.blue, 1 - back * 0.6), 12);
      G.slam(c, t, [{ t: 'THE HUNT WAS OVER' }, { t: 'for now', small: true }], w('f126', 'hunt') - 0.1, S.end + 0.2, { y: H * 0.78, size: 100, mode: 'ink' }); });
  } },

// ================================================================ CH 8  Fish in the sea
{ id: 'S67', at: 'f127', trans: 'black', desc: 'Map: July 1937, Japan\'s full invasion — the occupied zone spreads from the north-east down the coast.',
  sfx: [[f('f127'), 'thunder', 0.6], [w('f127', 'invaded'), 'boom', 0.8], [w('f127', 'full'), 'march', 0.6, 3]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.05, W / 2, H / 2, W * 0.55, H * 0.48, () => PL.cnMap(c, t, { japan: ramp(t, w('f127', 'invaded') - 0.4, 2.4, easeIO), labels: ['Beiping', 'Shanghai', 'Nanjing', "Yan'an"], cartouche: '1937–1938' }));
    G.dateLine(c, t, { at: f('f127') + 0.1, out: S.end - 0.2, event: 'Japan invades', day: 'July', year: 1937, from: 1936, mode: 'ink', y: 150 });
  } },
{ id: 'S68', at: 'f128', trans: 'cut', dark: true, desc: 'Chiang\'s armies in the great battles: smoke and flashes over a city skyline; SHANGHAI FELL stamp; then a dark card: Nanjing, December 1937 — no images.',
  sfx: [[f('f128'), 'boom', 0.6], [w('f128', 'battles'), 'volley', 0.6], [w('f129', 'Shanghai'), 'stamp', 0.8], [w('f129', 'Nanjing'), 'bell', 0.5], [w('f129', 'massacred'), 'thud', 0.5]],
  draw(c, t, lt, S) {
    const nj = ramp(t, w('f129', 'Nanjing') - 0.3, 0.5);
    fade(c, 1 - nj, () => { cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W / 2, H * 0.55, () => { PL.shanghaiStreet(c, t, { dusk: 0.6, red: 0.4, night: 0.3 }); A.smoke(c, 600, 600, t, 2.4, 141, 'rgba(40,32,28,0.45)'); A.smoke(c, 1400, 560, t, 2.0, 142, 'rgba(40,32,28,0.4)'); for (let i = 0; i < 4; i++) { const ph = (t * 0.9 + i * 0.29) % 1; if (ph < 0.15) puff(c, '#FFE2A0', 400 + i * 380, 500 + (i % 2) * 80, 90, 1 - ph / 0.15, 0.6); } });
      G.medallion(c, t, 'chiang', 300, 280, 100, f('f128') - 0.2, w('f129', 'Shanghai'), {}); G.stamp(c, t, 'SHANGHAI FELL', w('f129', 'Shanghai'), S.end, { x: W / 2, y: H * 0.42, size: 120, rot: -0.1 }); });
    fade(c, nj, () => { c.fillStyle = '#100C0A'; c.fillRect(0, 0, W, H); G.text(c, 'Nanjing', W / 2, H * 0.44, '140px Pinyon', '#E6D9BE', 'center', 1); G.text(c, 'DECEMBER 1937 · CIVILIANS MASSACRED FOR WEEKS', W / 2, H * 0.44 + 100, '500 34px Oswald', '#C24A3A', 'center', ramp(t, w('f129', 'massacred') - 0.2, 0.5)); });
  } },
{ id: 'S69', at: 'f130', trans: 'whip', desc: 'Archive photo: the Eighth Route Army on the Great Wall, 1937 (Sha Fei) — renamed, and going somewhere else.',
  sfx: [[w('f130', 'Eighth'), 'whoosh', 0.5], [w('f130', 'else'), 'march', 0.5, 3]],
  draw(c, t, lt, S) {
    c.fillStyle = '#16120E'; c.fillRect(0, 0, W, H);
    const big = (G.ARCH.a_wall38?.width ?? 0) >= 900; G.archival(c, t, big ? 'a_wall38' : 'a_wall37', f('f130') - 0.2, S.end + 0.4, { caption: big ? 'The Eighth Route Army on the Great Wall, 1938' : 'The Eighth Route Army at the Great Wall, 1937', credit: big ? 'Photo: Sha Fei · Wikimedia Commons · public domain' : 'Archive photo · Wikimedia Commons · public domain', w: 1300, h: 760, z1: 1.12 });
    G.slam(c, t, [{ t: 'THE EIGHTH ROUTE ARMY', size: 80 }], w('f130', 'Eighth') - 0.1, S.end + 0.2, { y: 120, size: 80 });
  } },
{ id: 'S70', at: 'f131', trans: 'cut', desc: 'Map: red arrows slip behind the Japanese front into the occupied north. BEHIND JAPANESE LINES.',
  sfx: [[w('f131', 'behind'), 'whoosh', 0.6], [w('f131', 'lines'), 'march', 0.5, 2]],
  draw(c, t, lt, S) {
    const v = V.north; cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.55, H * 0.45, () => { PL.cnMap(c, t, { view: v, japan: 1, labels: ["Yan'an", 'Beiping', 'Pingxing Pass'], cartouche: '1937–1938' });
      const u = ramp(t, f('f131') - 0.2, 1.6, easeIO); arrow(c, v, ["Yan'an", [37.5, 112.0], [39.0, 113.6]], u, P.red, 11); arrow(c, v, ["Yan'an", [36.0, 112.5], [36.6, 115.2]], u, P.red, 11); });
    G.slam(c, t, [{ t: 'BEHIND JAPANESE LINES', red: true }], w('f131', 'behind') - 0.05, S.end + 0.2, { y: H * 0.84, size: 90, mode: 'ink' });
  } },
{ id: 'S71', at: 'f132', trans: 'cut', desc: 'Pingxing Pass, September 1937: a Japanese supply column in the valley; red figures on the ridge; flashes. Then the archive photo of the battle — "a famous one".',
  sfx: [[w('f132', 'Pingxing'), 'wind', 0.5, 2], [w('f132', 'ambushed'), 'volley', 0.9], [w('f132', 'column'), 'boom', 0.6], [w('f133', 'famous'), 'whoosh', 0.4]],
  draw(c, t, lt, S) {
    const ph2 = ramp(t, f('f133') - 0.3, 0.5);
    fade(c, 1 - ph2, () => cam(c, lt, S, 1.0, 1.1, W / 2, H / 2, W / 2, H * 0.6, () => { PL.northChina(c, t, { dusk: 0.2 });
      for (let i = 0; i < 9; i++) A.figure(c, 300 + i * 140 + (t - f('f132')) * 30, 790, 90, CH.japSoldier, { face: 1, walk: t * 4 + i, prop: 'rifle' });
      for (let i = 0; i < 7; i++) A.figure(c, 200 + i * 230, 470 + Math.sin(i) * 20, 70, CH.redSoldier, { face: 1, kneel: 0.6, prop: 'rifle', armF: 70, elbF: -40 });
      const amb = ramp(t, w('f132', 'ambushed') - 0.1, 0.3); if (amb > 0) for (let i = 0; i < 7; i++) { const p = (t * 1.4 + i * 0.21) % 1; if (p < 0.15) puff(c, '#FFE2A0', 230 + i * 230, 440, 34, 1 - p / 0.15, 0.6); } }));
    G.dateLine(c, t, { at: f('f132') + 0.1, out: f('f133') - 0.3, event: 'Pingxing Pass', day: 'September', year: 1937, mode: 'light', y: 150 });
    if (ph2 > 0) { c.save(); c.globalAlpha = ph2; c.fillStyle = '#16120E'; c.fillRect(0, 0, W, H); c.restore(); }
    G.archival(c, t, 'a_pxg37', f('f133') - 0.2, S.end + 0.4, { caption: 'The Battle of Pingxing Pass, September 1937', credit: 'Archive photo · Wikimedia Commons · public domain', w: 1260, h: 720 });
    G.text(c, 'a small battle, but a famous one', W / 2, 90, 'italic 400 46px BodoniItalic', '#F2E8D2', 'center', life(t, w('f133', 'small'), S.end, 0.3, 0.3), 'rgba(0,0,0,0.6)');
  } },
{ id: 'S72', at: 'f134', trans: 'ink', desc: 'The fish and the water: a pond on parchment; red fish swim among ripples — PEOPLE = WATER, GUERRILLAS = FISH (Mao, On Guerrilla Warfare, 1937).',
  sfx: [[f('f134'), 'water', 0.5, 8], [w('f135', 'water'), 'splash', 0.5], [w('f136', 'fish'), 'splash', 0.5]],
  draw(c, t, lt, S) {
    fishWater(c, t, { n: lerp(2, 9, ramp(t, w('f136', 'fish') - 0.4, 1.2)) | 0 });
    G.text(c, 'they mostly avoided big fights', W / 2, 150, 'italic 400 50px BodoniItalic', P.ink, 'center', life(t, f('f134'), f('f135'), 0.3, 0.3));
    G.text(c, 'THE PEOPLE', 520, 170, '900 70px Bodoni', '#3E5C76', 'center', ramp(t, w('f135', 'people') - 0.1, 0.3)); G.text(c, '= the water', 520, 230, 'italic 400 46px BodoniItalic', P.ink, 'center', ramp(t, w('f135', 'water') - 0.1, 0.3));
    G.text(c, 'THE GUERRILLAS', 1400, 170, '900 70px Bodoni', P.red, 'center', ramp(t, w('f136', 'guerrillas') - 0.1, 0.3)); G.text(c, '= the fish', 1400, 230, 'italic 400 46px BodoniItalic', P.ink, 'center', ramp(t, w('f136', 'fish') - 0.1, 0.3));
    G.text(c, 'Mao Zedong, On Guerrilla Warfare, 1937 (paraphrased)', W / 2, 1030, 'italic 400 32px BodoniItalic', P.ink3, 'center', ramp(t, w('f135', 'book'), 0.4));
  } },
{ id: 'S73', at: 'f137', trans: 'cut', desc: 'Map: Japan holds the cities (dark dots) and the railways (dark lines); the villages between fill with red dots; recruits.',
  sfx: [[w('f137', 'cities'), 'tick', 0.5], [w('f137', 'railways'), 'tick', 0.5], [w('f138', 'villages'), 'chant', 0.3, 3], [w('f138', 'recruited'), 'gong', 0.5]],
  draw(c, t, lt, S) {
    const v = V.north; cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.52, H * 0.5, () => { PL.cnMap(c, t, { view: v, japan: 0.6, labels: [], cartouche: 'North China · 1938–1940' });
      const rails = [[[39.9, 116.4], [38.0, 114.5], [34.7, 113.6]], [[39.9, 116.4], [39.1, 117.2], [36.6, 117.0], [34.3, 117.2]], [[38.0, 114.5], [37.9, 112.5]]];
      rails.forEach((ln, i) => G.route(c, v, ln, ramp(t, w('f137', 'railways') - 0.3 + i * 0.15, 0.8), { color: P.ink, w: 6, dash: [12, 6], arrow: false }));
      [[39.9, 116.4], [38.0, 114.5], [34.7, 113.6], [36.6, 117.0], [34.3, 117.2], [37.9, 112.5], [39.1, 117.2]].forEach((p, i) => tok(c, v, p, P.ink, ramp(t, w('f137', 'cities') - 0.2 + i * 0.08, 0.3), null, 16));
      const r = rng(173); for (let i = 0; i < 70; i++) { const p = [lerp(34.5, 40.5, r()), lerp(111.5, 118, r())]; const [x, y] = xy(v, p); const a = ramp(t, w('f138', 'villages') - 0.2 + r() * 1.6, 0.3); if (a > 0) { c.fillStyle = rgba(P.red, 0.8 * a); c.beginPath(); c.arc(x, y, 7, 0, TAU); c.fill(); } } });
    G.slam(c, t, [{ t: 'they held the villages', small: true }, { t: 'AND RECRUITED', red: true }], w('f138', 'villages') - 0.1, S.end + 0.2, { y: H * 0.86, size: 90, mode: 'ink' });
  } },
{ id: 'S74', at: 'f139', trans: 'cut', desc: 'The spine: the second line — ENEMY HALTS · WE HARASS — is stamped red.',
  sfx: [[w('f139', 'harass'), 'gong', 0.7], [w('f139', 'worked'), 'impact', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.05, W / 2, H / 2, W / 2, H / 2, () => PL.northChina(c, t, { dusk: 0.5 })); dim(c, 0.5);
    G.sixteen(c, t, f('f139') - 0.4, S.end + 1, { brush: 16, size: 92, y: H * 0.4, lines: [1, ramp(t, w('f139', 'harass'), 0.6), 0, 0], hi: 1, light: true });
    G.text(c, 'the second line had worked', W / 2, 800, 'italic 400 58px BodoniItalic', '#F2E8D2', 'center', ramp(t, w('f139', 'worked') - 0.2, 0.4), 'rgba(0,0,0,0.6)');
  } },
];
