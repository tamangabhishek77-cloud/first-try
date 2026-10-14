// Shots: chapters 9–12 (guerrilla episode): kill all, burn all; the cities fall; not one needle; the fish and the water.
import { W, H, P, T, clamp, lerp, easeIO, easeOut, easeIn, backOut, ramp, life, rng, mixColor, rgba, parchment, withCam, push, puff } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';
import * as PL from './plates.mjs';
import { dim, tint, cam, fade, tok, xy, V, arrow, column, fishWater, people, bookCover, stretcher, bars } from './gw_common.mjs';
const { CH } = A; const f = T.f, e = T.e, w = T.w;
const TAU = Math.PI * 2;
const SHOP = { ...CH.farmer, cone: null, skullcap: '#1E1A15' };

export const SHOTS_C = [
// ================================================================ CH 9  Kill all, burn all
{ id: 'S75', at: 'f140', trans: 'black', desc: 'North China, August 1940: a train on the line below the Great Wall; charges blow the rails, a bridge, a mine head — one blast per word.',
  sfx: [[f('f140'), 'wind', 0.4, 3], [f('f140') + 0.5, 'march', 0.3, 3], [w('f141', 'railways'), 'boom', 0.8], [w('f141', 'bridges'), 'boom', 0.7], [w('f141', 'mines'), 'boom', 0.8]],
  draw(c, t, lt, S) {
    const b = [w('f141', 'railways'), w('f141', 'bridges'), w('f141', 'mines')]; let blast = 0, bx = 960; b.forEach((a, i) => { const u = clamp((t - a) / 1.2); if (u > 0 && u < 1) { blast = u; bx = [700, 1250, 1600][i]; } });
    cam(c, lt, S, 1.0, 1.07, W / 2, H / 2, W * 0.5, H * 0.58, () => PL.northChina(c, t, { train: ramp(t, f('f140') - 1, 9, (u) => clamp(u)) * 0.6, blast, blastX: bx, dusk: 0.3 }));
    G.dateLine(c, t, { at: f('f140') + 0.1, out: f('f141'), event: 'North China', day: 'August', year: 1940, from: 1938, mode: 'light', y: 150 });
    G.slam(c, t, [{ t: 'OVER 100 REGIMENTS' }], w('f141', 'hundred') - 0.1, S.end + 0.2, { y: H * 0.3, size: 110 });
  } },
{ id: 'S76', at: 'f142', trans: 'cut', desc: 'Archive photo: the Hundred Regiments Offensive, 1940.',
  sfx: [[w('f142', 'Hundred'), 'whoosh', 0.5], [w('f142', 'Offensive'), 'drum', 0.5, 2]],
  draw(c, t, lt, S) {
    c.fillStyle = '#16120E'; c.fillRect(0, 0, W, H);
    G.archival(c, t, 'a_hundred40', f('f142') - 0.2, S.end + 0.4, { caption: 'The Hundred Regiments Offensive, 1940', credit: 'Archive photo · Wikimedia Commons · public domain', w: 1300, h: 760, z1: 1.1 });
  } },
{ id: 'S77', at: 'f143', trans: 'whip', dark: true, desc: 'Japan\'s answer: the Three Alls — villages burn under a crimson sky (no people shown); KILL ALL · BURN ALL · LOOT ALL stamped one by one.',
  sfx: [[f('f143'), 'fire', 0.7, 6], [w('f144', 'kill'), 'stamp', 0.9], [w('f144', 'burn'), 'stamp', 0.9], [w('f144', 'loot'), 'stamp', 0.9]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.1, W / 2, H / 2, W * 0.6, H * 0.6, () => PL.northChina(c, t, { village: 1, burn: lerp(0.4, 1, ramp(t, f('f143'), 3)), dusk: 0.6 }));
    G.text(c, 'THE THREE ALLS', W / 2, 200, '900 90px Bodoni', '#F2E8D2', 'center', life(t, w('f143', 'Three') - 0.2, w('f144', 'kill'), 0.3, 0.3), 'rgba(0,0,0,0.6)');
    ['KILL ALL', 'BURN ALL', 'LOOT ALL'].forEach((s, i) => G.stamp(c, t, s, w('f144', ['kill', 'burn', 'loot'][i]), S.end + 0.3, { x: 420 + i * 540, y: 330, size: 90, rot: -0.12 + i * 0.1, color: '#E8553F' }));
  } },
{ id: 'S78', at: 'f145', trans: 'cut', dark: true, desc: 'Map: village dots across the communist base areas go out one by one; a bar of population falls by almost half ("by some estimates").',
  sfx: [[w('f145', 'wiped'), 'impact', 0.6], [w('f146', 'half'), 'thud', 0.7]],
  draw(c, t, lt, S) {
    const v = V.north; cam(c, lt, S, 1.0, 1.05, W / 2, H / 2, W * 0.5, H * 0.5, () => { PL.cnMap(c, t, { view: v, japan: 0.6, labels: [], cartouche: '1941–1942' });
      const r = rng(173); for (let i = 0; i < 70; i++) { const p = [lerp(34.5, 40.5, r()), lerp(111.5, 118, r())]; const [x, y] = xy(v, p); const gone = ramp(t, w('f145', 'wiped') - 0.6 + r() * 1.6, 0.3); c.fillStyle = gone > 0.5 ? rgba('#2A241D', 0.6) : rgba(P.red, 0.8); c.beginPath(); c.arc(x, y, 7, 0, TAU); c.fill(); } });
    dim(c, 0.4 * ramp(t, f('f146') - 0.2, 0.4));
    const u = ramp(t, w('f146', 'fell') - 0.2, 1.4, easeIO); if (t > f('f146') - 0.3) { c.fillStyle = rgba(P.red, 0.9); c.fillRect(360, 560, lerp(1200, 680, u), 90); G.text(c, 'population of the communist areas', 360, 530, 'italic 400 40px BodoniItalic', '#F2E8D2', 'left', ramp(t, f('f146'), 0.3)); G.text(c, 'by some estimates: almost halved', 360, 720, '600 40px Oswald', '#F2E8D2', 'left', ramp(t, w('f146', 'half') - 0.2, 0.3)); }
  } },
{ id: 'S79', at: 'f147', trans: 'cut', desc: 'Mao\'s lesson: medallion (Yan\'an photo) and the line NEVER SHOW YOUR FULL STRENGTH TOO EARLY over the cave homes at dusk.',
  sfx: [[w('f147', 'lesson'), 'gong', 0.5], [w('f147', 'strength'), 'tick', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W / 2, H * 0.55, () => PL.yanan(c, t, { dusk: 0.7, lamps: 1 })); dim(c, 0.35);
    G.medallion(c, t, 'maoYan', 360, 380, 150, f('f147') - 0.2, S.end + 0.2, { role: "Yan'an" });
    G.slam(c, t, [{ t: 'never show your', small: true }, { t: 'FULL STRENGTH' }, { t: 'too early', small: true }], w('f147', 'never') - 0.1, S.end + 0.2, { x: 1180, y: H * 0.4, size: 110 });
  } },
{ id: 'S80', at: 'f148', trans: 'whip', desc: 'Map, January 1941: blue arrows close on the New Fourth Army south of the Yangtze; then two medallions (Chiang, Mao) with a widening crack between them — IN NAME ONLY.',
  sfx: [[w('f148', 'ambushed'), 'volley', 0.7], [w('f148', 'Army'), 'boom', 0.5], [w('f149', 'name'), 'snap', 0.8]],
  draw(c, t, lt, S) {
    const p2 = ramp(t, f('f149') - 0.3, 0.5), v = V.east;
    fade(c, 1 - p2, () => { PL.cnMap(c, t, { view: v, labels: ['Nanjing', 'Shanghai'], cartouche: 'January 1941' }); tok(c, v, [30.6, 118.3], P.red, 1, null, 26);
      const u = ramp(t, w('f148', 'ambushed') - 0.6, 1.0, easeIO); arrow(c, v, [[29.2, 116.8], [30.0, 117.7], [30.5, 118.1]], u, P.blue, 11); arrow(c, v, [[29.6, 120.0], [30.2, 119.1], [30.55, 118.6]], u, P.blue, 11);
      G.dateLine(c, t, { at: f('f148') + 0.1, out: f('f149'), event: 'The New Fourth Army ambushed', day: 'January', year: 1941, from: 1940, mode: 'ink', y: 150 }); });
    fade(c, p2, () => { parchment(c, t); const cr = ramp(t, w('f149', 'name') - 0.2, 0.6); G.medallion(c, t, 'chiang', W / 2 - 260 - cr * 80, 480, 160, f('f149') - 0.3, S.end + 0.4, {}); G.medallion(c, t, 'maoYan', W / 2 + 260 + cr * 80, 480, 160, f('f149') - 0.3, S.end + 0.4, {});
      c.strokeStyle = P.red; c.lineWidth = 8; c.beginPath(); c.moveTo(W / 2, 220); for (let k = 1; k <= 8; k++) c.lineTo(W / 2 + (k % 2 ? 24 : -24) * cr, 220 + k * 70 * cr); c.stroke();
      G.text(c, 'an alliance in name only', W / 2, 900, 'italic 400 64px BodoniItalic', P.red, 'center', ramp(t, w('f149', 'name') - 0.2, 0.4)); });
  } },
{ id: 'S81', at: 'f150', trans: 'ink', dark: true, desc: 'Yan\'an by lamplight: a party history document — its lines are struck through and rewritten in red ("rewrote its history"); the Rectification Movement.',
  sfx: [[f('f150'), 'night', 0.5, 5], [w('f150', 'purged'), 'impact', 0.6], [w('f150', 'rewrote'), 'quill', 0.7, 1.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W / 2, H * 0.55, () => PL.yanan(c, t, { night: 0.7, dusk: 0.3, lamps: 1 })); dim(c, 0.4);
    c.save(); c.translate(W / 2, H / 2 + 30); c.rotate(-0.02); c.fillStyle = '#EFE6C8'; c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 30; c.fillRect(-420, -300, 840, 600); c.shadowBlur = 0;
    G.text(c, 'HISTORY OF THE PARTY', 0, -230, '600 34px Oswald', P.ink, 'center');
    for (let i = 0; i < 9; i++) { const y = -160 + i * 50, wl = 520 + (i * 53 % 160); c.fillStyle = 'rgba(42,36,29,0.55)'; c.fillRect(-wl / 2, y, wl, 10); const s = ramp(t, w('f150', 'rewrote') - 0.4 + i * 0.12, 0.25); if (s > 0) { c.fillStyle = P.red; c.fillRect(-wl / 2, y + 2, wl * s, 5); if (s >= 1 && i % 2 === 0) c.fillRect(-wl / 2 + 20, y + 22, wl * 0.6, 6); } }
    c.restore();
    G.text(c, 'the Rectification Movement, 1942–44', W / 2, 1010, 'italic 400 46px BodoniItalic', '#F2E8D2', 'center', ramp(t, w('f150', 'purged'), 0.4), 'rgba(0,0,0,0.6)');
  } },
{ id: 'S82', at: 'f151', trans: 'black', desc: 'August 1945: the occupied zone drains from the map; then a counter: 40,000 party members in 1937 → over 1,000,000.',
  sfx: [[w('f151', 'surrendered'), 'gong', 0.8], [w('f152', 'ready'), 'drum', 0.5, 2], [w('f153', '40'), 'tick', 0.6], [w('f154', 'million'), 'boom', 0.7]],
  draw(c, t, lt, S) {
    const p2 = ramp(t, f('f153') - 0.3, 0.5);
    fade(c, 1 - p2, () => { PL.cnMap(c, t, { japan: 1 - ramp(t, w('f151', 'surrendered') - 0.2, 1.6, easeIO), labels: ["Yan'an"], cartouche: 'August 1945' }); G.dateLine(c, t, { at: f('f151') + 0.1, out: f('f153'), event: 'Japan surrenders', day: 'August', year: 1945, from: 1941, mode: 'ink', y: 150 }); });
    fade(c, p2, () => { parchment(c, t); A.star5(c, W / 2, 330, 90, P.red); G.text(c, 'PARTY MEMBERS', W / 2, 500, '600 44px Oswald', P.ink3, 'center');
      const v = t < f('f154') - 0.1 ? 40000 : Math.round(lerp(40000, 1200000, easeIO((t - f('f154') + 0.1) / 1.2))); G.text(c, (t < f('f154') - 0.1 ? '1937 · ' : '1945 · ') + v.toLocaleString('en-GB') + (t > f('f154') + 1 ? '+' : ''), W / 2, 680, '600 130px Bodoni', t > f('f154') ? P.red : P.ink, 'center'); });
  } },

// ================================================================ CH 10  The cities fall
{ id: 'S83', at: 'f155', trans: 'black', desc: 'Map, 1946: most of China in Nationalist blue, the communist north in red patches. NO CONTEST — on paper.',
  sfx: [[f('f155'), 'march', 0.6, 4], [w('f155', 'war'), 'boom', 0.6], [w('f156', 'paper'), 'paper', 0.6]],
  draw(c, t, lt, S) {
    const v = { lon: 110, lat: 35, span: 46 };
    cam(c, lt, S, 1.0, 1.05, W / 2, H / 2, W * 0.5, H * 0.5, () => { PL.cnMap(c, t, { view: v, labels: ["Yan'an", 'Nanjing'], cartouche: '1946' });
      PL.cnBorders(c, v, ['CHN'], { fill: rgba(P.blue, 0.35 * ramp(t, f('f155'), 1.2)), dash: [], width: 2, color: P.blue });
      const BASES = [[[38.6, 106.4], [38.8, 109.5], [37.6, 110.8], [35.6, 110.2], [35.4, 107.2], [36.8, 106.0]], [[41.2, 113.0], [41.0, 116.2], [38.6, 116.4], [37.0, 114.6], [37.4, 112.4], [39.6, 112.0]], [[37.6, 117.6], [37.4, 120.6], [36.0, 120.4], [35.0, 118.2], [35.8, 116.8]], [[48.0, 124.0], [47.6, 129.6], [45.2, 130.4], [44.4, 126.2], [45.6, 123.4]]];
      BASES.forEach((b, i) => G.fillRegion(c, 'eastasia', v, b, P.red, 0.55 * ramp(t, f('f155') + 0.5 + i * 0.25, 0.8))); });
    G.dateLine(c, t, { at: f('f155') + 0.1, out: f('f156'), event: 'Civil war, again', year: 1946, from: 1945, mode: 'ink', y: 150 });
    G.slam(c, t, [{ t: 'on paper', small: true }, { t: 'NO CONTEST' }], w('f156', 'paper') - 0.1, S.end + 0.2, { x: 520, y: H * 0.7, size: 110, mode: 'ink' });
  } },
{ id: 'S84', at: 'f157', trans: 'cut', desc: 'Bars: Chiang over 4 million men (American weapons) against perhaps 1 million communists, counting militias.',
  sfx: [[w('f157', 'four'), 'impact', 0.6], [w('f157', 'American'), 'clang', 0.5], [w('f158', 'million'), 'tick', 0.6]],
  draw(c, t, lt, S) {
    parchment(c, t);
    bars(c, t, [{ label: 'Nationalists (Chiang)', num: '4,000,000+', v: 1, col: P.blue, at: w('f157', 'four') - 0.3 }, { label: 'Communists, counting militias', num: '~1,000,000', v: 0.27, col: P.red, at: w('f158', 'perhaps') - 0.2 }], 0, { x: 260, y: 340, w: 1100 });
    G.text(c, 'many with American weapons', 260, 640, 'italic 400 40px BodoniItalic', P.ink3, 'left', ramp(t, w('f157', 'American') - 0.2, 0.3));
    G.medallion(c, t, 'chiang', 1700, 200, 90, f('f157') - 0.1, S.end + 0.2, { noPlaque: true });
  } },
{ id: 'S85', at: 'f159', trans: 'whip', desc: 'Yan\'an, March 1947: blue Nationalist troops enter the cave town; Mao simply walks away over the hill; the spine\'s first line flashes again.',
  sfx: [[w('f159', 'captured'), 'march', 0.7, 3], [w('f160', 'walked'), 'whoosh', 0.5], [w('f161', 'retreat'), 'gong', 0.6]],
  draw(c, t, lt, S) {
    const wk = ramp(t, f('f160') - 0.2, 3.4, easeIO);
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.5, H * 0.56, () => { PL.yanan(c, t, { dusk: 0.3 });
      const u = ramp(t, f('f159'), 3, easeIO); for (let i = 0; i < 8; i++) A.figure(c, lerp(2100, 1300, u) + i * 110, 1010 + (i % 2) * 20, 240, CH.natSoldier, { face: -1, walk: u < 1 ? t * 5 + i : null, prop: 'rifle' });
      fade(c, 1 - clamp(wk * 1.3 - 0.3), () => A.figure(c, lerp(700, 120, wk), lerp(1010, 900, wk), lerp(300, 200, wk), CH.maoYan, { face: -1, walk: wk > 0 && wk < 1 ? t * 4 : null, armF: 5 })); });
    G.dateLine(c, t, { at: f('f159') + 0.1, out: f('f160'), event: "Yan'an captured", day: 'March', year: 1947, from: 1946, mode: 'light', y: 150 });
    dim(c, 0.5 * ramp(t, f('f161') - 0.3, 0.4)); G.sixteen(c, t, f('f161') - 0.3, S.end + 0.2, { brush: 16, size: 70, y: H * 0.38, lines: [1, 1, 0, 0], hi: 0, light: true });
  } },
{ id: 'S86', at: 'f162', trans: 'cut', desc: 'A village square: a land deed is torn in two; plots are handed out; the brown crowd turns red and grows. HUNDREDS OF THOUSANDS joined.',
  sfx: [[w('f162', 'seized'), 'paper', 0.8], [w('f162', 'handed'), 'crowd', 0.5, 3], [w('f163', 'joined'), 'cheer', 0.5], [w('f163', 'hundreds'), 'march', 0.5, 3]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.5, H * 0.58, () => { PL.jiangxi(c, t, {});
      A.crowd(c, { x0: 100, x1: 1820, y: 960, n: lerp(40, 110, ramp(t, f('f163'), 2.4)) | 0, hMin: 90, hMax: 170, depth: 110, seed: 186, t, red: ramp(t, w('f163', 'joined') - 0.6, 1.4), hat: 'cone', toolSet: ['spade', 'staff', 'rifle', null], raise: ramp(t, w('f163', 'joined'), 0.8) }); });
    const tr = ramp(t, w('f162', 'seized') - 0.2, 0.6); c.save(); c.translate(W / 2, 360);
    for (const s of [-1, 1]) { c.save(); c.translate(s * tr * 60, tr * 20); c.rotate(s * tr * 0.15); c.fillStyle = '#EFE6C8'; c.fillRect(s < 0 ? -200 : 0, -130, 200, 260); c.fillStyle = 'rgba(42,36,29,0.5)'; for (let i = 0; i < 6; i++) c.fillRect(s < 0 ? -170 : 20, -90 + i * 34, 150, 8); c.restore(); }
    G.text(c, 'LAND DEED', 0, -150, '600 30px Oswald', '#F2E8D2', 'center', 1 - tr, 'rgba(0,0,0,0.6)'); c.restore();
    G.slam(c, t, [{ t: 'HUNDREDS OF THOUSANDS' }, { t: 'of peasants\' sons joined', small: true }], w('f163', 'hundreds') - 0.1, S.end + 0.2, { y: H * 0.62, size: 90 });
  } },
{ id: 'S87', at: 'f164', trans: 'cut', dark: true, desc: 'Chiang\'s China rotting: over a dim Shanghai street, a list — INFLATION · CORRUPTION · CONSCRIPTED AT GUNPOINT — and the archive photo of Chiang, 1945.',
  sfx: [[w('f164', 'rotting'), 'thud', 0.6], [w('f164', 'inflation'), 'coins', 0.6], [w('f164', 'corruption'), 'tick', 0.5], [w('f164', 'conscripted'), 'march', 0.4, 2]],
  draw(c, t, lt, S) {
    PL.shanghaiStreet(c, t, { dusk: 0.6, night: 0.5 }); dim(c, 0.55);
    G.archival(c, t, 'a_chiang45', f('f164') - 0.2, S.end + 0.4, { x: 520, y: 480, w: 600, h: 700, caption: 'Chiang Kai-shek, 1945', credit: 'Archive photo · public domain' });
    G.listPanel(c, t, ['inflation', 'corruption', 'men conscripted at gunpoint'], [w('f164', 'inflation') - 0.1, w('f164', 'corruption') - 0.1, w('f164', 'conscripted') - 0.1], f('f164'), S.end + 0.3, { x: 980, y: 300, w: 780, title: "Chiang's China was rotting" });
  } },
{ id: 'S88', at: 'f165', trans: 'ink', dark: true, desc: 'Changchun, 1948: a red ring closes around the city on the map; the gates close; grey human icons fade as the counter reads 150,000+ civilians starved (by most estimates). Then silence.',
  sfx: [[w('f165', 'besieged'), 'drum', 0.5, 3], [w('f166', 'leave'), 'gate', 0.7], [w('f167', '150'), 'thud', 0.6]],
  draw(c, t, lt, S) {
    const v = V.manch, p2 = ramp(t, f('f167') - 0.4, 0.6);
    fade(c, 1 - p2, () => { PL.cnMap(c, t, { view: v, labels: ['Changchun'], hi: 'Changchun', cartouche: 'Manchuria · 1948' }); const [cx, cy] = xy(v, 'Changchun'); const r = lerp(260, 110, ramp(t, w('f165', 'besieged') - 0.2, 2.2, easeIO));
      for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; G.token(c, cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.9, 16, P.red, 1); }
      G.dateLine(c, t, { at: f('f165') + 0.1, out: f('f167') - 0.3, event: 'The siege of Changchun', day: 'May–October', year: 1948, from: 1946, mode: 'ink', y: 150 });
      G.slam(c, t, [{ t: 'ALMOST NO ONE', size: 90 }, { t: 'allowed to leave', small: true }], w('f166', 'almost') - 0.1, f('f167'), { x: W * 0.68, y: H * 0.72, size: 90, mode: 'ink' }); });
    fade(c, p2, () => { c.fillStyle = '#14100C'; c.fillRect(0, 0, W, H); people(c, 330, 380, 34, 5, 32, '#8A8278', ramp(t, f('f167'), 4.5), 207);
      G.text(c, '150,000+', W / 2, 260, '600 120px Bodoni', '#E6D9BE', 'center', ramp(t, w('f167', '150') - 0.3, 0.4)); G.text(c, 'CIVILIANS STARVED · BY MOST ESTIMATES', W / 2, 320 + 30, '500 30px Oswald', '#C9BCA0', 'center', ramp(t, w('f167', 'civilians') - 0.2, 0.4)); });
  } },
{ id: 'S89', at: 'f168', trans: 'cut', dark: true, desc: 'Archive photo: PLA soldiers at the end of the siege (soldiers only). "In China, that siege is still rarely mentioned."',
  sfx: [[w('f168', 'rarely'), 'bell', 0.35]],
  draw(c, t, lt, S) {
    c.fillStyle = '#14100C'; c.fillRect(0, 0, W, H);
    G.archival(c, t, 'a_changchun', f('f168') - 0.3, S.end + 0.4, { caption: 'Communist troops at the end of the siege of Changchun, 1948', credit: 'Archive photo · Wikimedia Commons · public domain', w: 1200, h: 700, tint: 'rgba(30,20,14,0.2)' });
    G.text(c, 'still rarely mentioned in China', W / 2, 90, 'italic 400 46px BodoniItalic', '#E6D9BE', 'center', life(t, w('f168', 'rarely') - 0.3, S.end, 0.3, 0.3));
  } },
{ id: 'S90', at: 'f169', trans: 'whip', desc: 'Map, late 1948: three great red arrows — Manchuria, Huaihai (around Xuzhou), Beiping–Tianjin.',
  sfx: [[w('f169', 'three'), 'boom', 0.6], [w('f169', 'giant'), 'march', 0.7, 3], [w('f169', 'campaigns'), 'drum', 0.5, 2]],
  draw(c, t, lt, S) {
    const v = { lon: 120, lat: 38, span: 24 }; cam(c, lt, S, 1.0, 1.05, W / 2, H / 2, W * 0.5, H * 0.5, () => { PL.cnMap(c, t, { view: v, labels: ['Changchun', 'Beiping', 'Xuzhou', 'Nanjing'], cartouche: 'Late 1948 – January 1949' });
      const u = (k) => ramp(t, w('f169', 'three') + k * 0.5 - 0.3, 1.6, easeIO);
      arrow(c, v, [[46, 126], [43.5, 124.5], [41.5, 122.5]], u(0), P.red, 16); arrow(c, v, [[41.8, 120], [40.6, 117.8], [40.1, 116.7]], u(1), P.red, 16); arrow(c, v, [[36.6, 116.5], [35.3, 117.0], [34.5, 117.2]], u(2), P.red, 16); });
    G.dateLine(c, t, { at: f('f169') + 0.1, out: S.end - 0.1, event: 'Three giant campaigns', day: 'Late', year: 1948, from: 1947, mode: 'ink', y: 150 });
  } },
{ id: 'S91', at: 'f170', trans: 'cut', desc: 'Archive photo: Nationalist troops during the Huaihai Campaign; counter: over 500,000 lost.',
  sfx: [[w('f170', 'Huaihai'), 'whoosh', 0.5], [w('f170', 'half'), 'impact', 0.7], [w('f170', 'lost'), 'thud', 0.5]],
  draw(c, t, lt, S) {
    c.fillStyle = '#16120E'; c.fillRect(0, 0, W, H);
    G.archival(c, t, 'a_huaihai', f('f170') - 0.3, S.end + 0.4, { x: W * 0.4, w: 1100, h: 720, caption: 'Nationalist troops during the Huaihai Campaign, 1948', credit: 'Archive photo · Wikimedia Commons · public domain' });
    G.counter(c, t, 0, 500000, w('f170', 'half') - 0.3, 1.0, 1600, 520, { size: 100, label: 'Nationalist troops lost', out: S.end + 0.3 });
  } },
{ id: 'S92', at: 'f171', trans: 'cut', desc: 'The spine: the third line — ENEMY TIRES · WE ATTACK — stamped red.',
  sfx: [[w('f171', 'attack'), 'gong', 0.7], [w('f171', 'worked'), 'impact', 0.5]],
  draw(c, t, lt, S) {
    parchment(c, t);
    G.sixteen(c, t, f('f171') - 0.4, S.end + 1, { brush: 16, size: 92, y: H * 0.4, lines: [1, 1, ramp(t, w('f171', 'attack'), 0.6), 0], hi: 2 });
    G.text(c, 'the third line had worked', W / 2, 800, 'italic 400 58px BodoniItalic', P.red, 'center', ramp(t, w('f171', 'worked') - 0.2, 0.4));
  } },

// ================================================================ CH 11  Not one needle
{ id: 'S93', at: 'f172', trans: 'black', desc: 'April 1949: the Yangtze (the same river plate, wide): a fleet of junks carries the army across. A MILLION TROOPS.',
  sfx: [[f('f172'), 'water', 0.7, 6], [w('f172', 'million'), 'march', 0.6, 3], [w('f172', 'crossed'), 'oars', 0.6, 3]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.5, H * 0.56, () => PL.riverX(c, t, { wide: 1, boats: 16, cross: (t - f('f172')) * 0.8 }));
    G.dateLine(c, t, { at: f('f172') + 0.1, out: S.end - 0.2, event: 'Crossing the Yangtze', day: 'April', year: 1949, from: 1948, mode: 'ink', y: 150 });
    G.slam(c, t, [{ t: 'A MILLION TROOPS' }], w('f172', 'million') - 0.1, S.end + 0.2, { y: H * 0.3, size: 120 });
  } },
{ id: 'S94', at: 'f173', trans: 'cut', desc: 'Map: Nanjing\'s token flips from blue to red; then the spine\'s fourth line stamps red — all sixteen characters complete and glowing.',
  sfx: [[w('f173', 'fell'), 'boom', 0.7], [w('f174', 'pursue'), 'gong', 0.9], [w('f174', 'complete'), 'impact', 0.7]],
  draw(c, t, lt, S) {
    const p2 = ramp(t, f('f174') - 0.3, 0.5), v = V.east;
    fade(c, 1 - p2, () => { PL.cnMap(c, t, { view: v, labels: ['Nanjing', 'Shanghai'], hi: 'Nanjing', cartouche: 'April 1949' }); const fl = ramp(t, w('f173', 'fell') - 0.2, 0.4); tok(c, v, 'Nanjing', fl > 0.5 ? P.red : P.blue, 1, null, 40 * (1 + 0.3 * Math.sin(fl * Math.PI)));
      G.slam(c, t, [{ t: "CHIANG'S CAPITAL FELL" }], w('f173', 'fell') - 0.1, f('f174'), { y: H * 0.8, size: 90, mode: 'ink' }); });
    fade(c, p2, () => { c.fillStyle = '#16120E'; c.fillRect(0, 0, W, H); const g = ramp(t, w('f174', 'complete') - 0.2, 0.6);
      if (g > 0) PL.sun(c, W / 2, H * 0.44, 900, rgba('#E8A43A', 0.35 * g));
      G.sixteen(c, t, f('f174') - 0.4, S.end + 1, { brush: 16, size: 100, y: H * 0.38, lines: [1, 1, 1, ramp(t, w('f174', 'pursue'), 0.6)], hi: 3, light: true });
      G.text(c, 'all sixteen characters, complete', W / 2, 820, 'italic 400 60px BodoniItalic', '#F2E8D2', 'center', ramp(t, w('f174', 'complete') - 0.3, 0.4), 'rgba(0,0,0,0.6)'); });
  } },
{ id: 'S95', at: 'f175', trans: 'whip', desc: 'Late May 1949: the Shanghai street again (cold-open plate), first light.',
  sfx: [[w('f175', 'Shanghai'), 'whoosh', 0.5], [f('f175'), 'wind', 0.4, 3]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.54, H * 0.5, () => PL.shanghaiStreet(c, t, { dawn: 0.85, mist: 0.8, sleepers: 0 }));
    G.dateLine(c, t, { at: f('f175') + 0.1, out: S.end - 0.1, event: 'Shanghai', day: 'Late May', year: 1949, mode: 'ink', y: 150 });
  } },
{ id: 'S96', at: 'f176', trans: 'cut', desc: 'THE PAYOFF: the same rule sheet, the sweet potato, the needle and thread and the REMEMBER tag return (motif); HARDEST TEST: China\'s richest city.',
  sfx: [[w('f176', 'Remember') - 0.05, 'motif', 1.0], [w('f176', 'potato'), 'smallthing', 0.5], [w('f177', 'hardest'), 'impact', 0.6], [w('f177', 'richest'), 'coin', 0.5]],
  draw(c, t, lt, S) {
    parchment(c, t);
    cam(c, lt, S, 1.0, 1.12, W / 2, H / 2, W * 0.46, H * 0.52, () => { G.ruleSheet(c, t, W / 2 - 300, H / 2 + 10, 900, 760, { reveal: 1, potato: 0, swap: 1, tag: ramp(t, w('f176', 'Remember') - 0.1, 0.3), glow: ramp(t, w('f176', 'potato'), 0.5) * 0.7, rot: -0.015, date: 'October 1927' }); G.sweetPotato(c, W / 2 + 20, H / 2 + 300 - 40 * ramp(t, w('f176', 'potato') - 0.2, 0.5, backOut), 92, 0.3); });
    G.slam(c, t, [{ t: '22 years on', small: true }, { t: 'THE HARDEST TEST', red: true }, { t: "China's richest city", small: true }], w('f177', 'hardest') - 0.1, S.end + 0.2, { x: 1560, y: H * 0.46, size: 80, mode: 'ink' });
  } },
{ id: 'S97', at: 'f178', trans: 'cut', desc: 'The cold-open street: soldiers asleep along both pavements; the shutters open and shopkeepers step out, looking at them.',
  sfx: [[w('f178', 'slept'), 'wind', 0.4, 3], [w('f179', 'looting'), 'tick', 0.5], [w('f179', 'woke'), 'creak', 0.7], [w('f179', 'this'), 'murmur', 0.4, 3]],
  draw(c, t, lt, S) {
    const sh = ramp(t, w('f179', 'woke') - 0.4, 2.0, easeIO);
    cam(c, lt, S, 1.0, 1.12, W / 2, H / 2, W * 0.6, H * 0.56, () => { PL.shanghaiStreet(c, t, { dawn: 0.75, sleepers: 1, shutters: sh, mist: 0.4 });
      fade(c, ramp(t, w('f179', 'woke'), 0.8), () => { A.figure(c, 1560, 960, 250, SHOP, { face: -1, armF: 20, elbF: 40 }); A.figure(c, 1720, 990, 270, CH.farmerW, { face: -1 }); A.figure(c, 1380, 900, 190, SHOP, { face: -1, armF: 60, elbF: 20 }); }); });
    G.text(c, 'by many accounts', W / 2, 200, 'italic 400 46px BodoniItalic', '#F2E8D2', 'center', life(t, f('f178'), f('f179'), 0.3, 0.3), 'rgba(0,0,0,0.6)');
    G.slam(c, t, [{ t: 'Shanghai expected', small: true }, { t: 'LOOTING' }], w('f179', 'looting') - 0.3, w('f179', 'woke') - 0.05, { y: H * 0.3, size: 110 });
  } },
{ id: 'S98', at: 'f180', trans: 'cut', desc: 'Close on a sleeping soldier in the dawn light; THE BEST ADVERTISEMENT THE COMMUNISTS EVER HAD.',
  sfx: [[w('f180', 'best'), 'gong', 0.6], [w('f180', 'advertisement'), 'bell', 0.4]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.7, W / 2, H * 0.72, () => { PL.shanghaiStreet(c, t, { dawn: 0.9, sleepers: 1, shutters: 1 }); c.fillStyle = 'rgba(30,24,18,0.25)'; c.fillRect(0, 760, W, 320); PL.lyingSoldier(c, 1080, 1050, 760, '#5E6266', -1); PL.lyingSoldier(c, 420, 1070, 640, '#5E6266', 1); });
    G.slam(c, t, [{ t: 'THE BEST' }, { t: 'ADVERTISEMENT', red: true }, { t: 'the communists ever had', small: true }], w('f180', 'best') - 0.1, S.end + 0.2, { y: H * 0.32, size: 110 });
  } },
{ id: 'S99', at: 'f181', trans: 'black', desc: 'Tiananmen Gate, 1 October 1949: red flags and crowds; then the archive photo of Mao proclaiming the People\'s Republic, and the painting The Founding Ceremony of the Nation (Dong Xiwen, 1953).',
  sfx: [[f('f181'), 'crowd', 0.6, 4], [w('f181', 'Tiananmen'), 'gong', 0.6], [w('f182', 'proclaimed'), 'cheer', 0.6], [w('f182', 'Republic'), 'boom', 0.6]],
  draw(c, t, lt, S) {
    const p2 = ramp(t, f('f182') - 0.3, 0.5);
    fade(c, 1 - p2 * 0.85, () => cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W / 2, H * 0.45, () => PL.tiananmen49(c, t, { red: ramp(t, f('f181'), 2) })));
    G.dateLine(c, t, { at: f('f181') + 0.1, out: f('f182') - 0.2, event: 'Tiananmen Gate, Beijing', day: '1 October', year: 1949, mode: 'light', y: 150 });
    const ph = w('f182', 'People') - 0.1;
    G.archival(c, t, 'a_prc49', f('f182') - 0.3, ph + 0.5, { caption: 'Mao proclaims the People\'s Republic of China, 1 October 1949', credit: 'Archive photo · Wikimedia Commons · public domain', w: 1100, h: 700, rot: -0.02 });
    G.archival(c, t, 'a_founding', ph, S.end + 0.4, { caption: 'The Founding Ceremony of the Nation · painting by Dong Xiwen, 1953', credit: 'Painting · Wikimedia Commons', w: 1300, h: 720, rot: 0.01, z1: 1.06 });
  } },
{ id: 'S100', at: 'f183', trans: 'whip', desc: 'Map: December 1949, Chiang\'s blue token crosses the strait to Taiwan.',
  sfx: [[w('f183', 'fled'), 'whoosh', 0.6], [w('f183', 'Taiwan'), 'thud', 0.5]],
  draw(c, t, lt, S) {
    const v = { lon: 118, lat: 27, span: 14 }; cam(c, lt, S, 1.0, 1.05, W / 2, H / 2, W * 0.55, H * 0.55, () => { PL.cnMap(c, t, { view: v, labels: ['Taipei'], cartouche: 'December 1949' });
      const end = G.route(c, v, [[28.5, 116.0], [26.5, 119.4], [25.03, 121.56]], ramp(t, w('f183', 'fled') - 0.3, 1.8, easeIO), { color: P.blue, w: 6 }); if (end) G.token(c, end[0], end[1], 30, P.blue, 1); });
    G.medallion(c, t, 'chiang', 380, 300, 110, f('f183') - 0.1, S.end + 0.2, { role: 'fled to Taiwan' });
    G.dateLine(c, t, { at: f('f183') + 0.1, out: S.end - 0.1, event: 'Chiang flees', day: 'December', year: 1949, mode: 'ink', y: 900 });
  } },
{ id: 'S101', at: 'f184', trans: 'cut', desc: 'The whole Long March route and the full red spine over the map of China: RAN AWAY FOR 22 YEARS — AND WON.',
  sfx: [[w('f184', 'run'), 'march', 0.4, 2], [w('f184', 'won'), 'boom', 0.8]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.05, W / 2, H / 2, W / 2, H / 2, () => { PL.cnMap(c, t, { view: V.march, march: 1, labels: ['Ruijin', 'Wuqi'], cartouche: '1927–1949' }); });
    G.sixteen(c, t, f('f184') - 0.3, S.end + 0.2, { brush: 16, size: 56, y: 96, lines: [1, 1, 1, 1], title: false, en: false });
    G.slam(c, t, [{ t: 'ran away for 22 years', small: true }, { t: 'AND WON', red: true }], w('f184', 'won') - 0.3, S.end + 0.2, { y: H * 0.56, size: 170, mode: 'ink' });
  } },

// ================================================================ CH 12  The fish and the water
{ id: 'S102', at: 'f185', trans: 'black', dark: true, desc: 'Land reform: a village square at dusk; a landlord (gold robe) kneels before a crowd in silhouette; crimson tint; the landlord medallion greys with a red slash; HUNDREDS OF THOUSANDS TO MILLIONS.',
  sfx: [[w('f185', 'limits'), 'impact', 0.6], [w('f186', 'tried'), 'riot', 0.4, 3], [w('f187', 'dead'), 'thud', 0.7], [w('f187', 'millions'), 'bell', 0.4]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.1, W / 2, H * 0.6, W * 0.52, H * 0.62, () => { PL.jiangxi(c, t, { dusk: 0.8, night: 0.3 });
      A.crowd(c, { x0: 120, x1: 1800, y: 980, n: 70, hMin: 150, hMax: 230, depth: 70, seed: 221, t, color: '#1E1812', far: '#2A221A', red: 0.5, tools: false, agit: 1.5, raise: 0.5 });
      A.figure(c, 960, 900, 280, CH.landlord, { face: 1, kneel: 1, armF: 10 }); });
    tint(c, '#8A2A1C', 0.35 * ramp(t, f('f186'), 1));
    G.slam(c, t, [{ t: 'the promise had limits', small: true }], f('f185') - 0.05, f('f186'), { y: H * 0.24, size: 120 });
    G.medallion(c, t, 'landlord', 1620, 300, 110, w('f187', 'Estimates') - 0.2, S.end + 0.2, { grey: ramp(t, w('f187', 'dead'), 0.5), slash: ramp(t, w('f187', 'dead') + 0.2, 0.3), role: 'land reform, 1947–52' });
    G.slam(c, t, [{ t: 'HUNDREDS OF THOUSANDS', size: 90 }, { t: 'to millions', small: true }], w('f187', 'hundreds') - 0.1, S.end + 0.2, { y: H * 0.26, size: 90 });
  } },
{ id: 'S103', at: 'f188', trans: 'cut', dark: true, desc: 'Mao\'s medallion (Yan\'an photo) on black: RULED CHINA 1949–1976 · at a terrible human cost.',
  sfx: [[w('f188', 'twenty'), 'tick', 0.5], [w('f188', 'terrible'), 'bell', 0.4]],
  draw(c, t, lt, S) {
    c.fillStyle = '#14100C'; c.fillRect(0, 0, W, H);
    G.medallion(c, t, 'maoYan', W / 2, 440, 200, f('f188') - 0.2, S.end + 0.3, { name: 'Mao Zedong', role: 'ruled China, 1949–1976', light: true });
    G.text(c, 'at a terrible human cost', W / 2, 920, 'italic 400 60px BodoniItalic', '#C24A3A', 'center', ramp(t, w('f188', 'terrible') - 0.2, 0.4));
  } },
{ id: 'S104', at: 'f189', trans: 'whip', desc: 'World map: the sixteen characters lift off China and fly out; Vietnam lights red, then Peru.',
  sfx: [[w('f189', 'escaped'), 'whoosh', 0.7], [w('f190', 'Vietnam'), 'gong', 0.5], [w('f190', 'America'), 'tick', 0.5], [w('f191', 'Peru'), 'gong', 0.5]],
  draw(c, t, lt, S) {
    const v = { lon: 20, lat: 12, span: 290 };
    PL.worldMap(c, t, { view: v, hi: { VNM: ramp(t, w('f190', 'Vietnam') - 0.2, 0.5), PER: ramp(t, w('f191', 'Peru') - 0.2, 0.5) }, labels: t > w('f191', 'Peru') ? ['Vietnam', 'Peru'] : t > w('f190', 'Vietnam') ? ['Vietnam'] : [] });
    const tgt = [xy(v, 'Vietnam'), xy(v, 'Peru'), xy(v, 'Nepal')]; const fly = ramp(t, w('f189', 'escaped') - 0.2, 2.0, easeIO);
    G.sixteen(c, t, f('f189') - 0.3, S.end + 0.2, { brush: 16, size: 48, x: xy(v, [35, 104])[0] - 330, y: xy(v, [35, 104])[1] - 30, lines: [1, 1, 1, 1], fly, flyTo: tgt, title: false, en: false });
    G.text(c, 'In Vietnam: against France, then America', W / 2, 1010, 'italic 400 44px BodoniItalic', P.ink, 'center', life(t, w('f190', 'Vietnam'), f('f191'), 0.3, 0.3));
    G.text(c, 'In Peru: the Shining Path called itself Maoist', W / 2, 1010, 'italic 400 44px BodoniItalic', P.ink, 'center', life(t, w('f191', 'Peru'), S.end + 0.2, 0.3, 0.3));
  } },
{ id: 'S105', at: 'f192', trans: 'cut', desc: 'Nepal: the map zooms in; 1996–2006, a ten-year "people\'s war"; 13,000+ dead (by most counts); MONARCHY ABOLISHED 2008; Prachanda\'s medallion (photo).',
  sfx: [[w('f192', 'Nepal'), 'whoosh', 0.6], [w('f193', '13'), 'thud', 0.6], [w('f194', 'abolished'), 'stamp', 0.9], [w('f195', 'Prachanda'), 'gong', 0.6]],
  draw(c, t, lt, S) {
    const z = ramp(t, f('f192') - 0.2, 1.6, easeIO), v = { lon: lerp(20, 84.2, z), lat: lerp(12, 28.2, z), span: lerp(290, 13, easeIn(z)) };
    PL.worldMap(c, t, { view: v, china: 0.6, hi: { NPL: 1 }, labels: z > 0.9 ? ['Kathmandu'] : [] });
    G.dateLine(c, t, { at: f('f192') + 0.6, out: f('f194') - 0.2, event: "Nepal's \"people's war\"", day: '1996 –', year: 2006, from: 1996, mode: 'ink', y: 150 });
    G.counter(c, t, 0, 13000, w('f193', '13') - 0.3, 1.0, 1500, 700, { size: 110, color: P.ink, mode: 'ink', label: 'dead · by most counts', labelColor: P.ink3, out: w('f194', 'In') + 0.3 });
  } },
{ id: 'S105b', at: 'f194', trans: 'cut', desc: 'Nepal, 2008: the monarchy is abolished (stamp over Kathmandu); Prachanda, the guerrilla leader, becomes prime minister (medallion, photo).',
  sfx: [[w('f194', 'monarchy'), 'gong', 0.5], [w('f194', 'abolished'), 'stamp', 0.9], [w('f195', 'Prachanda'), 'whoosh', 0.5], [w('f195', 'minister'), 'bell', 0.4]],
  draw(c, t, lt, S) {
    const v = { lon: 84.2, lat: 28.2, span: 13 };
    cam(c, lt, S, 1.04, 1.0, W / 2, H / 2, W / 2, H / 2, () => PL.worldMap(c, t, { view: v, china: 0.6, hi: { NPL: 1 }, labels: ['Kathmandu'] }));
    G.dateLine(c, t, { at: f('f194') + 0.1, out: S.end - 0.2, event: 'Nepal becomes a republic', day: '28 May', year: 2008, from: 2006, mode: 'ink', y: 150 });
    G.stamp(c, t, 'MONARCHY ABOLISHED', w('f194', 'abolished') - 0.05, S.end + 0.2, { x: 640, y: 760, size: 80, rot: -0.06 });
    G.medallion(c, t, 'prachanda', 1520, 420, 150, w('f195', 'guerrilla') - 0.2, S.end + 0.2, { role: 'guerrilla leader · prime minister, 2008' });
  } },
{ id: 'S106', at: 'f196', trans: 'ink', desc: 'The Jinggang Mountains again at dusk (the hideout plate): the sixteen characters glow in a row over the ridges; "still studied in military academies around the world".',
  sfx: [[w('f196', 'Sixteen'), 'gong', 0.5], [w('f197', 'academies'), 'tick', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W / 2, H * 0.55, () => PL.jinggang(c, t, { dusk: 0.85, night: 0.2, flag: 1 })); dim(c, 0.25);
    G.sixteen(c, t, f('f196') - 0.3, S.end + 0.4, { brush: 16, size: 84, y: H * 0.3, lines: [1, 1, 1, 1], light: true, title: false });
    G.text(c, 'from a mountain hideout, 1928', W / 2, 760, 'italic 400 54px BodoniItalic', '#F2E8D2', 'center', life(t, f('f196'), f('f197'), 0.3, 0.3), 'rgba(0,0,0,0.6)');
    G.text(c, 'still studied in military academies around the world', W / 2, 760, 'italic 400 54px BodoniItalic', '#F2E8D2', 'center', life(t, f('f197'), S.end + 0.3, 0.3, 0.3), 'rgba(0,0,0,0.6)');
  } },
{ id: 'S107', at: 'f198', trans: 'cut', desc: 'The fish and the water again: the fish swim; "it wins by protecting them".',
  sfx: [[f('f198'), 'water', 0.5, 6], [w('f198', 'fish'), 'splash', 0.5], [w('f199', 'protecting'), 'bell', 0.4]],
  draw(c, t, lt, S) {
    fishWater(c, t, { n: 9 });
    G.text(c, 'A GUERRILLA ARMY NEEDS THE PEOPLE', W / 2, 170, '900 64px Bodoni', P.ink, 'center', ramp(t, f('f198') - 0.1, 0.4));
    G.text(c, 'as a fish needs water', W / 2, 240, 'italic 400 50px BodoniItalic', P.ink3, 'center', ramp(t, w('f198', 'fish') - 0.2, 0.4));
    G.text(c, 'it wins by protecting them', W / 2, 1010, 'italic 400 56px BodoniItalic', P.red, 'center', ramp(t, w('f199', 'protecting') - 0.3, 0.4));
  } },
{ id: 'S108', at: 'f200', trans: 'cut', dark: true, desc: 'The final question: the water darkens and the one big fish fills the pond; WHO PROTECTS THE PEOPLE FROM IT? — dip to black.',
  sfx: [[w('f200', 'won'), 'drum', 0.4, 2], [w('f201', 'protects'), 'bell', 0.5], [e('f201') + 0.4, 'boom', 0.5]],
  draw(c, t, lt, S) {
    fishWater(c, t, { n: 4, big: true, dark: ramp(t, f('f200'), 2.5) });
    G.text(c, 'but once it has won,', W / 2, 200, 'italic 400 60px BodoniItalic', '#F2E8D2', 'center', ramp(t, f('f200') - 0.1, 0.4), 'rgba(0,0,0,0.6)');
    G.slam(c, t, [{ t: 'WHO PROTECTS THE PEOPLE' }, { t: 'FROM IT?', red: true }], w('f201', 'who') - 0.1, e('f201') + 1.6, { y: H * 0.8, size: 92 });
    dim(c, ramp(t, e('f201') + 1.2, 0.8));
  } },
];
