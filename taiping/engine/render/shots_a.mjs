// Shots: cold open, chapters 1–3. Every beat is keyed to a word or fragment of the narration (T.f / T.w).
import { W, H, P, T, clamp, lerp, easeIO, easeOut, easeIn, backOut, ramp, life, rng, mixColor, rgba, noise1, parchment, withCam, push } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';
import * as PL from './plates.mjs';
const { CH } = A; const f = T.f, e = T.e, w = T.w;
const TAU = Math.PI * 2;
export const RICHARD_HORSE = { color: '#E8E2D4', cloth: P.gold };
export const TYLER_HORSE = { color: '#3A3026', cloth: null };
const dim = (c, a) => { c.save(); c.fillStyle = `rgba(16,12,8,${a})`; c.fillRect(0, 0, W, H); c.restore(); };
const panel = (c, x, y, w_, h_, a = 0.86) => { c.save(); c.globalAlpha *= a; c.fillStyle = '#ECE1C8'; c.shadowColor = 'rgba(0,0,0,0.3)'; c.shadowBlur = 30; c.fillRect(x - w_ / 2, y - h_ / 2, w_, h_); c.restore(); };
const hash = k => { const r = rng(k * 2654435761 >>> 0); r(); return r(); };
export { dim, panel, hash };

// shared: the poll-tax people grid (identical in S08, S19, S22)
export const GRID = { cols: 16, rows: 6, x: 300, y: 470, dx: 88, dy: 98, h: 72 };

export const SHOTS_A = [
// ================================================================ COLD OPEN
{ id: 'S01', at: 0, desc: 'Smithfield, afternoon: the boy king rides in. Date-line, medallion "aged 14".',
  sfx: [[0, 'wind', 0.6, 9.5], [0.3, 'hooves', 0.7, 6.8], [0.8, 'tick', 0.6], [w('f002', 'fourteen') - 0.1, 'whoosh', 0.7]],
  draw(c, t, lt, S) {
    const cam = push(lt, S.dur, 1.0, 1.07, W / 2, H / 2, W * 0.46, H * 0.53);
    withCam(c, cam, () => {
      PL.smithfield(c, t);
      A.crowd(c, { x0: 1250, x1: 2000, y: 780, n: 70, hMin: 34, hMax: 56, depth: 26, seed: 3, t, red: 0.15 });
      const u = easeOut(clamp(lt / 7.2)), moving = lt < 7.2;
      A.rider(c, lerp(-260, 640, u), 1010, 230, CH.richard, { face: 1, ...RICHARD_HORSE, walk: moving ? lt * 5.5 : null, t });
    });
    G.dateLine(c, t, { at: 0.6, out: 5.2, event: 'Smithfield, outside London', day: '15 June', year: 1381, from: 1376, mode: 'ink', y: 150 });
    G.medallion(c, t, 'richard', 1640, 300, 110, w('f002', 'fourteen') - 0.1, S.end + 0.3, { role: 'aged 14' });
  } },
{ id: 'S02', at: 'f003', desc: 'Reverse: thousands of armed men; the crowd turns red and raises its weapons. Slam THOUSANDS.',
  sfx: [[f('f003') - 0.15, 'crowd', 0.8, 3.4], [w('f003', 'thousands'), 'impact', 0.9], [w('f003', 'armed'), 'whoosh', 0.5]],
  draw(c, t, lt, S) {
    const cam = push(lt, S.dur, 1.04, 1.12, W * 0.48, H * 0.55, W * 0.54, H * 0.55);
    withCam(c, cam, () => {
      PL.smithfield(c, t);
      A.crowd(c, { x0: -160, x1: 2080, y: 770, n: 150, hMin: 70, hMax: 200, depth: 280, seed: 7, t, red: ramp(t, f('f003'), 2.4, easeIO), raise: ramp(t, w('f003', 'armed'), 0.8), agit: 1.4 });
    });
    G.slam(c, t, [{ t: 'THOUSANDS' }, { t: 'of armed men', small: true }], w('f003', 'thousands'), S.end + 0.2, { y: H * 0.28, size: 170 });
  } },
{ id: 'S03', at: 'f004', trans: 'whip', desc: 'London from the south bank: the march across the bridge, the Savoy burning, the archbishop (medallion) beheaded.',
  sfx: [[f('f004'), 'drum', 0.7, 3.4], [w('f005', 'burned') - 0.1, 'fire', 0.8, 5], [w('f005', 'burned'), 'impact', 0.9], [w('f006', 'head') - 0.05, 'impact', 1.0], [w('f006', 'head'), 'thud', 0.7], [f('f006'), 'whoosh', 0.5]],
  draw(c, t, lt, S) {
    const cam = push(lt, S.dur, 1.0, 1.06, W / 2, H / 2, W * 0.5, H * 0.48);
    withCam(c, cam, () => {
      PL.london(c, t, { savoyFire: ramp(t, w('f005', 'burned'), 1.0) });
      const k = easeIO(clamp((t - f('f004')) / 4.0));
      c.save(); c.beginPath(); c.rect(-200, 0, 2400, 742); c.clip();
      A.crowd(c, { x0: 1500 - k * 1050, x1: 2300 - k * 1050, y: 741, n: 46, hMin: 34, hMax: 46, depth: 3, seed: 11, t, red: 1, face: -1, agit: 0.6, tools: true });
      c.restore();
    });
    G.tally(c, t, f('f004') + 0.2, w('f005', 'burned') + 0.2, 1, 17, { x: W * 0.6, y: 110 });
    G.slam(c, t, [{ t: 'BURNED', red: true }], w('f005', 'burned'), f('f006') + 0.4, { x: 520, y: 330, size: 150 });
    const hd = w('f006', 'head');
    G.medallion(c, t, 'sudbury', 1450, 330, 130, f('f006') + 0.1, S.end + 0.3, { grey: ramp(t, hd, 0.3), slash: ramp(t, hd, 0.25) });
    G.slam(c, t, [{ t: 'BEHEADED', red: true }], hd, S.end + 0.2, { x: 760, y: 340, size: 130 });
  } },
{ id: 'S04', at: 'f007', desc: 'Smithfield again: Tyler (medallion greys: "dead"); the king rides towards the raised bows.',
  sfx: [[f('f007'), 'whoosh', 0.6], [w('f007', 'dead'), 'thud', 0.9], [f('f008') + 0.2, 'hooves', 0.6, 3], [w('f008', 'bows') - 0.4, 'bowdraw', 0.9]],
  draw(c, t, lt, S) {
    const cam = push(lt, S.dur, 1.02, 1.1, W * 0.5, H * 0.55, W * 0.56, H * 0.56);
    const dead = w('f007', 'dead'), rb = f('f008');
    withCam(c, cam, () => {
      PL.smithfield(c, t);
      A.crowd(c, { x0: 1150, x1: 2100, y: 800, n: 80, hMin: 90, hMax: 170, depth: 170, seed: 5, t, red: 1, raise: ramp(t, w('f008', 'bows') - 0.5, 0.6), allBows: true, face: -1 });
      const ta = 1 - ramp(t, dead + 0.2, 1.4, easeIO); if (ta > 0) { c.save(); c.globalAlpha = ta; A.rider(c, 1060, 1000, 200, CH.tyler, { face: -1, ...TYLER_HORSE, t }); c.restore(); }
      const u = easeIO(clamp((t - rb) / 3.2));
      A.rider(c, lerp(240, 760, u), 1010, 230, CH.richard, { face: 1, ...RICHARD_HORSE, walk: u > 0 && u < 1 ? (t - rb) * 6 : null, t });
    });
    G.medallion(c, t, 'tyler', 1000, 300, 115, f('f007') + 0.15, f('f008') + 0.6, { grey: ramp(t, dead, 0.3), slash: ramp(t, dead, 0.25) });
  } },
{ id: 'S05', at: 'f009', trans: 'black', dark: true, desc: 'Title card: THE PEASANTS\' REVOLT 1381 over a rising crowd and a storm wall; ROSE UP / ALMOST WON / FELL APART.',
  sfx: [[f('f009') - 0.3, 'thunder', 0.6], [w('f009', 'Peasants'), 'impact', 1.0], [w('f010', 'rose'), 'whoosh', 0.6], [w('f010', 'almost'), 'whoosh', 0.6], [w('f011', 'fell'), 'thunder', 0.9], [w('f011', 'fell'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    const rose = w('f010', 'rose'), almost = w('f010', 'almost'), fell = w('f011', 'fell');
    withCam(c, push(lt, S.dur, 1.0, 1.06, W / 2, H * 0.55, W / 2, H * 0.5), () => {
      A.sky(c, 'storm', t); A.clouds(c, t, 31, 260, 'rgba(30,26,24,0.35)', 6, 14, 1.4);
      A.hills(c, 860, 90, 61, '#2E2822');
      const yy = lerp(1210, 905, easeOut(clamp((t - rose + 0.6) / 1.4)));
      A.crowd(c, { x0: -100, x1: 2020, y: yy, n: 120, hMin: 80, hMax: 150, depth: 90, seed: 13, t, color: '#1E1A16', far: '#2C2622', red: ramp(t, almost, 1.0), raise: ramp(t, almost, 0.8), agit: 1.2 });
      A.stormWall(c, t, lerp(0.05, 0.25, clamp(lt / 7)) + 0.85 * easeIO(clamp((t - fell) / 2.2)), 9, '#141210');
    });
    const out = S.end - 0.2;
    G.slam(c, t, [{ t: 'THE PEASANTS\'' }, { t: 'REVOLT', red: true }], w('f009', 'Peasants'), out, { y: H * 0.36, size: 160 });
    G.text(c, '1381', W / 2, H * 0.36 + 200, '500 64px Oswald', P.gold2, 'center', life(t, w('f009', 'Peasants') + 0.4, out, 0.4, 0.3), 'rgba(0,0,0,0.6)');
    const sub = (s, a0, a1) => G.text(c, s, W / 2, H * 0.36 + 290, 'italic 400 56px BodoniItalic', '#EDE3CF', 'center', life(t, a0, a1, 0.2, 0.2), 'rgba(0,0,0,0.6)');
    sub('how they rose up', rose - 0.05, almost - 0.05); sub('why they almost won', almost - 0.05, fell - 0.05); sub('how it fell apart', fell - 0.05, out);
  } },
{ id: 'S06', at: e('f011') + 0.1, trans: 'cut', dark: true, desc: 'Brand sting: a fuse burns across the black and lights THE MAJOR REVOLUTION.',
  sfx: [[e('f011') + 0.25, 'match', 0.9], [e('f011') + 0.45, 'fuse', 0.8, 1.7], [e('f011') + 2.15, 'boom', 1.0]],
  draw(c, t, lt, S) {
    c.fillStyle = '#0E0C0A'; c.fillRect(0, 0, W, H);
    const x0 = 330, x1 = 1590, u = easeIO(clamp((lt - 0.35) / 1.7)), xb = lerp(x0, x1, u);
    const fadeOut = 1 - clamp((lt - (S.dur - 0.5)) / 0.5);
    c.save(); c.globalAlpha = fadeOut;
    // cord
    c.strokeStyle = '#6E5A3A'; c.lineWidth = 4; c.beginPath(); c.moveTo(xb, 640); c.lineTo(x1, 640); c.stroke();
    // letters revealed behind the spark
    c.save(); c.beginPath(); c.rect(0, 0, xb, H); c.clip();
    G.text(c, 'THE MAJOR', W / 2, 470, '500 54px Oswald', '#D9CBA9', 'center', 1);
    G.text(c, 'REVOLUTION', W / 2, 610, '900 150px Bodoni', '#F2E8D2', 'center', 1, 'rgba(240,120,40,0.35)');
    c.fillStyle = P.red; c.fillRect(x0, 636, xb - x0, 8);
    c.restore();
    if (u < 1) { const g = c.createRadialGradient(xb, 640, 0, xb, 640, 70); g.addColorStop(0, 'rgba(255,220,140,1)'); g.addColorStop(0.3, 'rgba(240,140,50,0.7)'); g.addColorStop(1, 'rgba(240,120,40,0)'); c.fillStyle = g; c.beginPath(); c.arc(xb, 640, 70, 0, TAU); c.fill();
      const r = rng(Math.floor(t * 25)); c.fillStyle = '#FFE2A0'; for (let i = 0; i < 16; i++) { c.globalAlpha = fadeOut * r(); c.beginPath(); c.arc(xb + (r() - 0.5) * 60, 640 + (r() - 0.5) * 40 - r() * 20, 1.5 + r() * 2.5, 0, TAU); c.fill(); } c.globalAlpha = fadeOut; }
    else { const fl = clamp(1 - (lt - 2.05) / 0.5); if (fl > 0) { c.fillStyle = `rgba(255,230,180,${0.35 * fl})`; c.fillRect(0, 0, W, H); } }
    c.restore();
  } },

// ================================================================ CH 1  A world short of hands
{ id: 'S07', at: 'f012', trans: 'black', desc: 'The village plate, day: peasants in the strip fields. Script "England", the 1370s.',
  sfx: [[f('f012') - 0.2, 'village', 0.6, 3.6], [f('f012') + 0.5, 'tick', 0.5]],
  draw(c, t, lt, S) {
    withCam(c, push(lt, S.dur, 1.0, 1.06, W / 2, H / 2, W * 0.52, H * 0.52), () => {
      PL.village(c, t);
      [[520, 'spade', CH.peasant, 1], [820, 'scythe', CH.peasant, -1], [1180, 'distaff', CH.woman, 1], [1460, 'spade', CH.peasant, -1]].forEach(([x, p, sp, fc], i) =>
        A.figure(c, x, 980 + (i % 2) * 30, 230, sp, { face: fc, prop: p, armF: 30 + Math.sin(t * 2 + i) * 15, elbF: 20, t }));
    });
    G.scriptName(c, t, 'England', w('f012', 'England') - 0.2, S.end + 0.3, { y: H * 0.34, size: 190, mode: 'ink', role: 'the 1370s' });
  } },
{ id: 'S08', at: 'f013', trans: 'ink', desc: 'The Black Death: the people grid; a third, then half, grey out. Bell tolls.',
  sfx: [[w('f013', 'Black'), 'bell', 0.8], [w('f014', 'third'), 'bell', 0.7], [w('f014', 'half'), 'bell', 0.8], [w('f013', 'Black') + 0.3, 'tick', 0.4]],
  draw(c, t, lt, S) {
    parchment(c, t);
    const third = w('f014', 'third'), half = w('f014', 'half');
    const frac = lerp(0, 1 / 3, ramp(t, third - 0.2, 0.7)) + lerp(0, 1 / 6, ramp(t, half - 0.2, 0.7));
    PL.peopleGrid(c, t, { ...GRID, state: k => hash(k) < frac ? { color: '#B9AA88', a: 0.55 } : { color: P.ink2 } });
    G.scriptName(c, t, 'The Black Death', w('f013', 'Black') - 0.1, third - 0.25, { y: 260, size: 150, mode: 'ink', role: '1348 – 1349' });
    G.slam(c, t, [{ t: 'A THIRD' }], third, half - 0.05, { y: 250, size: 150, mode: 'ink' });
    G.slam(c, t, [{ t: 'TO A HALF', red: true }], half, S.end + 0.3, { y: 250, size: 150, mode: 'ink' });
  } },
{ id: 'S09', at: 'f015', trans: 'fade', desc: 'The same village, emptied: a shortage of people; the fields overgrow, the harvest rots.',
  sfx: [[f('f015'), 'wind', 0.7, 7.5], [w('f015', 'shortage'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    withCam(c, push(lt, S.dur, 1.02, 1.1, W / 2, H * 0.55, W * 0.5, H * 0.6), () => {
      PL.village(c, t, { overgrown: ramp(t, w('f016', 'unploughed') - 0.3, 1.6, easeIO), sheaves: true, rot: ramp(t, w('f016', 'Harvests') - 0.2, 1.4, easeIO) });
      A.figure(c, 1300, 990, 220, CH.peasant, { face: -1, prop: 'spade', armF: 20, elbF: 15, t });
    });
    G.slam(c, t, [{ t: 'A SHORTAGE' }, { t: 'of people', small: true }], w('f015', 'shortage'), f('f016') + 0.1, { y: H * 0.3, size: 140, mode: 'ink' });
    G.slam(c, t, [{ t: 'UNPLOUGHED' }], w('f016', 'unploughed'), w('f016', 'Harvests'), { y: H * 0.26, size: 110, mode: 'ink' });
    G.slam(c, t, [{ t: 'ROTTED', red: true }], w('f016', 'rotted'), S.end + 0.2, { y: H * 0.26, size: 120, mode: 'ink' });
  } },
{ id: 'S10', at: 'f017', desc: 'Labourer and lord: coins stack up as the labourer names his price; wages rise; he walks off for better pay.',
  sfx: [[w('f017', 'price'), 'coin', 0.8], [w('f018', 'Wages'), 'coin', 0.7], [w('f018', 'Wages') + 0.3, 'coin', 0.7], [w('f018', 'rose'), 'coin', 0.8], [w('f018', 'left'), 'whoosh', 0.5]],
  draw(c, t, lt, S) {
    const leave = w('f018', 'left');
    withCam(c, push(lt, S.dur, 1.45, 1.5, 960, 760, 980, 760), () => {
      PL.village(c, t);
      A.figure(c, 640, 1000, 360, CH.lord, { face: 1, armF: 30, elbF: 30 });
      const u = easeIn(clamp((t - leave) / 3)); const lx = lerp(1220, 1900, u);
      A.figure(c, lx, 1000, 330, CH.peasant, { face: u > 0 ? 1 : -1, armF: u > 0 ? 10 : 45, elbF: 30, prop: u > 0 ? 'staff' : null, walk: u > 0 ? (t - leave) * 7 : null, t });
    });
    const n = (t > w('f017', 'price') ? 1 : 0) + (t > w('f018', 'Wages') ? 1 : 0) + (t > w('f018', 'Wages') + 0.3 ? 1 : 0) + (t > w('f018', 'rose') ? 1 : 0);
    for (let i = 0; i < n; i++) G.groat(c, 960, 640 - i * 34, 56 * 0.9);
    G.slam(c, t, [{ t: 'NAME HIS PRICE' }], w('f017', 'price') - 0.1, f('f018'), { y: 200, size: 110, mode: 'ink' });
    G.slam(c, t, [{ t: 'WAGES' }, { t: 'ROSE', red: true }], w('f018', 'Wages'), leave + 0.4, { y: 230, size: 110, mode: 'ink' });
    G.slam(c, t, [{ t: 'for better pay elsewhere', small: true }], leave + 0.2, S.end + 0.2, { x: 1450, y: 260, size: 150, mode: 'ink' });
  } },
{ id: 'S11', at: 'f019', desc: 'The lord, close and tinted red: PANIC.',
  sfx: [[w('f019', 'panicked'), 'impact', 1.0], [f('f019'), 'sting', 0.6]],
  draw(c, t, lt, S) {
    const sh = Math.max(0, 1 - (t - w('f019', 'panicked')) / 0.6), jx = Math.sin(t * 90) * 8 * sh, jy = Math.cos(t * 70) * 6 * sh;
    withCam(c, { x: 640 + jx, y: 780 + jy, s: 2.3 + lt * 0.03 }, () => { PL.village(c, t); A.figure(c, 640, 1000, 360, CH.lord, { face: 1, armF: 60, elbF: 80, armB: -40, elbB: 70 }); });
    c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = 'rgba(163,32,28,0.45)'; c.fillRect(0, 0, W, H); c.restore();
    G.slam(c, t, [{ t: 'PANIC', red: false }], w('f019', 'panicked') - 0.05, S.end + 0.1, { x: 470, y: H * 0.42, size: 220 });
  } },
{ id: 'S12', at: 'f020', trans: 'whip', desc: 'The Statute of Labourers (1351): sealed, wages frozen, asking for more a crime; prison or the branding iron.',
  sfx: [[f('f020') + 0.1, 'paper', 0.7], [w('f020', 'Statute') + 0.8, 'seal', 1.0], [w('f021', 'freezing'), 'impact', 0.7], [w('f022', 'crime'), 'stamp', 1.0], [w('f022', 'prison'), 'gate', 0.6], [w('f022', 'branding'), 'sizzle', 0.8]],
  draw(c, t, lt, S) {
    parchment(c, t, '#8A6A40', 0.25);
    withCam(c, push(lt, S.dur, 1.0, 1.05, W / 2, H / 2, W * 0.48, H * 0.5), () => {
      G.documentSheet(c, t, 640, 560, 620, 800, { title: 'Statute of Labourers', titleSize: 44, seal: true, sealAt: ramp(t, w('f020', 'Statute') + 0.6, 0.25), seed: 9, highlight: t > w('f022', 'crime') - 0.2 ? 3 : null, rot: -0.02 });
    });
    G.dateLine(c, t, { at: f('f020') + 0.2, out: f('f021') + 1.5, event: 'Statute of Labourers', day: '', year: 1351, from: 1348, mode: 'ink', x: W * 0.57 });
    G.slam(c, t, [{ t: 'WAGES' }, { t: 'FROZEN', red: true }], w('f021', 'freezing'), f('f022') + 0.1, { x: 1400, y: 450, size: 120, mode: 'ink' });
    G.stamp(c, t, 'A CRIME', w('f022', 'crime'), S.end + 0.2, { x: 640, y: 560, size: 120 });
    const pa = life(t, w('f022', 'prison') - 0.1, S.end + 0.3, 0.25, 0.3), ba = life(t, w('f022', 'branding') - 0.1, S.end + 0.3, 0.25, 0.3);
    if (pa > 0) { c.save(); c.globalAlpha = pa; panel(c, 1300, 500, 300, 360, 0.9); PL.bars(c, 1300, 640, 220, 260, 0); G.text(c, 'PRISON', 1300, 330, '600 34px Oswald', P.ink2, 'center'); c.restore(); }
    if (ba > 0) { c.save(); c.globalAlpha = ba; panel(c, 1660, 500, 300, 360, 0.9); c.save(); c.translate(1660, 560); c.rotate(-0.4); A.flames(c, 0, -100, 60, 60, t, 4, 4); c.restore(); c.save(); c.translate(1660, 600); c.rotate(-0.4); c.strokeStyle = P.ink2; c.lineWidth = 12; c.beginPath(); c.moveTo(0, 60); c.lineTo(0, -120); c.stroke(); c.fillStyle = P.fire2; c.fillRect(-24, -168, 48, 48); c.restore(); G.text(c, 'BRANDING', 1660, 330, '600 34px Oswald', P.ink2, 'center'); c.restore(); }
  } },
{ id: 'S13', at: 'f023', trans: 'fade', desc: 'A villein, chained to the manor; a week strip shows the lord\'s unpaid days.',
  sfx: [[w('f023', 'villeins'), 'whoosh', 0.5], [w('f024', 'bound'), 'chain', 1.0], [w('f025', 'unpaid'), 'tick', 0.6], [w('f025', 'work'), 'tick', 0.6]],
  draw(c, t, lt, S) {
    const bound = w('f024', 'bound');
    withCam(c, push(lt, S.dur, 1.12, 1.18, 1250, 700, 1290, 705), () => {
      PL.village(c, t);
      const fx = 1060, fy = 1000; A.figure(c, fx, fy, 300, CH.peasant, { face: 1, armF: 6, elbF: 8, prop: 'spade', t });
      const u = ramp(t, bound - 0.2, 1.0, easeIO); if (u > 0) drawChain(c, fx + 24, fy - 18, 1560, 650, u);
    });
    G.scriptName(c, t, 'villein', w('f023', 'villeins') - 0.15, f('f025') + 0.2, { x: W * 0.3, y: 230, size: 170, mode: 'ink', role: 'a serf, bound to the land' });
    weekStrip(c, t, f('f025') - 0.1, S.end + 0.3, [w('f025', 'unpaid'), w('f025', 'work')]);
  } },
{ id: 'S14', at: 'f026', desc: 'The manor roll unrolls: unfreedom written down. A red tag: REMEMBER (planted object).',
  sfx: [[f('f026') + 0.1, 'paper', 0.9], [w('f026', 'written'), 'quill', 0.6, 2], [w('f028', 'Remember'), 'stamp', 0.8]],
  draw(c, t, lt, S) { manorRollPlate(c, t, lt, S, { unroll: ramp(t, f('f026') + 0.15, 2.6, easeIO), tag: t > w('f028', 'Remember') - 0.05 ? 'REMEMBER' : null });
    G.scriptName(c, t, 'the manor rolls', w('f027', 'manor') - 0.2, f('f028') + 0.3, { x: W * 0.24, y: 560, size: 120, mode: 'ink', role: 'records of the lord\'s court' });
    G.slam(c, t, [{ t: 'They will matter later.', small: true }], w('f028', 'They'), S.end + 0.3, { x: W * 0.24, y: 560, size: 150, mode: 'ink' });
  } },

// ================================================================ CH 2  The boy king's empty purse
{ id: 'S15', at: 'f029', trans: 'ink', desc: 'Europe map: the war with France; English lands shrink from the 1360 extent to 1377.',
  sfx: [[f('f029'), 'drum', 0.5, 2], [w('f030', 'fighting'), 'clang', 0.6], [w('f031', 'losing'), 'whoosh', 0.6], [f('f030') + 0.3, 'tick', 0.5]],
  draw(c, t, lt, S) {
    const k = easeIO(clamp((t - w('f030', 'fighting') + 0.4) / 2.4));
    const view = { lon: lerp(-1.5, 0.6, k), lat: lerp(52.2, 47.9, k), span: lerp(13, 17, k) };
    G.drawMap(c, 'eu', view, { rivers: ['Thames', 'Seine', 'Loire', 'Garonne', 'Dordogne'] });
    const lose = ramp(t, w('f031', 'losing') - 0.2, 1.6, easeIO);
    for (const poly of EN1360) G.fillRegion(c, 'eu', view, poly, P.gold, 0.55 * (1 - lose));
    for (const poly of EN1377) G.fillRegion(c, 'eu', view, poly, P.gold, 0.75);
    G.fillRegion(c, 'eu', view, ENGLAND, P.gold, 0.35);
    G.mapLabel(c, view, [52.6, -1.6], 1, { name: 'ENGLAND', dot: false, size: 46 });
    G.mapLabel(c, view, [47.2, 2.4], ramp(t, w('f030', 'France') - 0.2, 0.5), { name: 'FRANCE', dot: false, size: 46 });
    if (t > w('f030', 'fighting') - 0.1) { const [x, y] = G.proj(view, 50.2, 0.2); swords(c, x, y, 60, ramp(t, w('f030', 'fighting') - 0.1, 0.3)); }
    G.dateLine(c, t, { at: f('f030') + 0.1, out: S.end + 0.3, event: 'The Hundred Years\' War', day: '', year: 1377, from: 1337, rollDur: 2.2, mode: 'ink' });
    G.slam(c, t, [{ t: 'LOSING', red: true }], w('f031', 'losing'), S.end + 0.2, { x: 1450, y: 300, size: 120, mode: 'ink' });
  } },
{ id: 'S16', at: 'f032', trans: 'fade', dark: true, desc: 'Throne room: Edward III fades; the ten-year-old Richard on the throne, crown too big.',
  sfx: [[w('f032', 'died') - 0.1, 'bell', 0.9], [w('f033', 'Richard'), 'whoosh', 0.6], [w('f033', 'ten'), 'tick', 0.4]],
  draw(c, t, lt, S) {
    const died = w('f032', 'died'), rich = w('f033', 'Richard');
    withCam(c, push(lt, S.dur, 1.0, 1.08, W / 2, H * 0.55, W / 2, H * 0.5), () => {
      throneRoom(c, t);
      const ea = 1 - ramp(t, died, 1.0); if (ea > 0) { c.save(); c.globalAlpha = ea; A.figure(c, 960, 905, 380, CH.edward, { seated: true, face: 1, armF: 40, elbF: 50 }); c.restore(); }
      const ra = ramp(t, rich - 0.3, 0.7); if (ra > 0) { c.save(); c.globalAlpha = ra; boyKing(c, 960, 905, 330, t); c.restore(); }
    });
    G.dateLine(c, t, { at: f('f032') + 0.2, out: died + 1.4, event: 'Edward III dies', day: '', year: 1377, from: 1372, mode: 'light' });
    G.medallion(c, t, 'edward', 1730, 280, 100, f('f032') + 0.5, rich - 0.2, { grey: ramp(t, died, 0.5), light: true });
    G.medallion(c, t, 'richard', 1730, 280, 100, rich - 0.1, S.end + 0.3, { role: 'aged just ten', light: true });
  } },
{ id: 'S17', at: 'f034', desc: 'The council of nobles; John of Gaunt steps forward (medallion): RICHEST / MOST RESENTED.',
  sfx: [[f('f034'), 'murmur', 0.6, 5], [w('f035', 'Gaunt'), 'whoosh', 0.6], [w('f036', 'richest'), 'impact', 0.7], [w('f036', 'resented'), 'impact', 0.9]],
  draw(c, t, lt, S) { councilPlate(c, t, lt, S, w('f035', 'Gaunt'));
    G.medallion(c, t, 'gaunt', 1660, 280, 110, w('f035', 'Gaunt') - 0.1, S.end + 0.3, { light: true });
    G.slam(c, t, [{ t: 'A COUNCIL', }, { t: 'of nobles', small: true }], w('f034', 'council') - 0.1, f('f035') + 0.2, { y: 240, size: 110 });
    G.slam(c, t, [{ t: 'THE RICHEST' }], w('f036', 'richest') - 0.05, w('f036', 'resented') - 0.05, { y: 240, size: 110 });
    G.slam(c, t, [{ t: 'MOST RESENTED', red: true }], w('f036', 'resented') - 0.05, S.end + 0.2, { y: 240, size: 110 });
  } },
{ id: 'S18', at: 'f037', dark: true, desc: 'The treasury chest opens on nothing; a moth. BROKE.',
  sfx: [[f('f038') - 0.1, 'creak', 0.8], [w('f038', 'broke'), 'thud', 1.0]],
  draw(c, t, lt, S) {
    const op = ramp(t, f('f038') - 0.15, 0.4, easeOut);
    withCam(c, push(lt, S.dur, 1.0, 1.25, W / 2, 700, W / 2, 760), () => {
      PL.interior(c, t, { dark: 0.6, arches: 2 });
      PL.chest(c, 960, 900, 170, op, t);
      if (op > 0.5) { const mt = t - f('f038'); const mx = 960 + Math.sin(mt * 5) * 60 + mt * 120, my = 760 - mt * 160; c.fillStyle = '#C9B48A'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(mx + s * 12, my, 14, 8 + 5 * Math.sin(mt * 30), s * 0.5, 0, TAU); c.fill(); } }
    });
    G.slam(c, t, [{ t: 'a problem that never goes away', small: true }], w('f037', 'problem'), f('f038') - 0.1, { y: 260, size: 150 });
    G.slam(c, t, [{ t: 'BROKE', red: true }], w('f038', 'broke') - 0.05, S.end + 0.2, { y: 300, size: 200 });
  } },

// ================================================================ CH 3  Three groats a head
{ id: 'S19', at: 'f039', trans: 'ink', desc: 'The people grid returns: not property but people; a coin for every head. A POLL TAX.',
  sfx: [[w('f040', 'property'), 'stamp', 0.6], [w('f040', 'Every'), 'coins', 0.9, 1.4], [w('f040', 'poll'), 'impact', 0.9]],
  draw(c, t, lt, S) {
    parchment(c, t);
    const ev = w('f040', 'Every');
    PL.peopleGrid(c, t, { ...GRID, state: (k, n) => { const ct = ev + (k / n) * 1.3; return { color: t > w('f040', 'people') ? mixColor(P.ink2, P.red, 0.25) : P.ink2, coin: ramp(t, ct, 0.2) }; } });
    G.slam(c, t, [{ t: 'a new kind of tax', small: true }], w('f039', 'new') - 0.1, f('f040') + 0.2, { y: 240, size: 170, mode: 'ink' });
    const pa = life(t, w('f040', 'property') - 0.2, w('f040', 'people') + 0.3, 0.2, 0.3);
    if (pa > 0) { c.save(); c.globalAlpha = pa; panel(c, 960, 250, 420, 300, 0.95); A.cottage(c, 960, 340, 150); c.strokeStyle = P.red; c.lineWidth = 14; c.lineCap = 'round'; const u = ramp(t, w('f040', 'property'), 0.3);
      c.beginPath(); c.moveTo(860, 150); c.lineTo(lerp(860, 1060, u), lerp(150, 350, u)); c.stroke(); c.restore(); }
    G.slam(c, t, [{ t: 'EVERY PERSON' }], ev - 0.05, w('f040', 'poll') - 0.1, { y: 250, size: 120, mode: 'ink' });
    G.slam(c, t, [{ t: 'A POLL TAX', red: true }, { t: '“poll”: an old word for head', small: true }], w('f040', 'poll') - 0.05, S.end + 0.2, { y: 250, size: 130, mode: 'ink' });
  } },
{ id: 'S20', at: 'f041', trans: 'cut', desc: 'Three columns: 1377 one groat (over 14); 1379 scaled by rank; 1380 three groats (over 15), rich or poor.',
  sfx: [[w('f041', 'groat'), 'coin', 0.9], [f('f043') + 0.5, 'coins', 0.7, 1], [w('f045', 'three'), 'coin', 0.9], [w('f045', 'three') + 0.25, 'coin', 0.9], [w('f045', 'three') + 0.5, 'coin', 0.9], [w('f045', 'rich'), 'whoosh', 0.5]],
  draw(c, t, lt, S) {
    parchment(c, t);
    const cx = lerp(820, 1100, easeIO(clamp((t - f('f044')) / 2)));
    G.text(c, 'THREE POLL TAXES IN FOUR YEARS', W / 2, 120, '600 34px Oswald', P.ink2, 'center', life(t, f('f041'), w('f045', 'rich') - 0.3, 0.4, 0.3));
    withCam(c, { x: cx, y: 640, s: 1.2 }, () => {
      c.strokeStyle = P.ink3; c.lineWidth = 3; c.beginPath(); c.moveTo(150, 820); c.lineTo(1800, 820); c.stroke();
      const col = (x, year, at) => { const a = ramp(t, at, 0.4); if (a <= 0) return a; G.text(c, year, x, 900, '600 64px Oswald', P.ink2, 'center', a); return a; };
      // 1377
      if (col(420, '1377', f('f041') - 0.1) > 0) { if (t > w('f041', 'groat')) G.groat(c, 420, 760, 58); G.text(c, '4d · one groat', 420, 640, 'italic 400 40px BodoniItalic', P.ink, 'center', ramp(t, w('f041', 'groat'), 0.3));
        G.text(c, 'everyone over 14', 420, 970, '500 30px Oswald', P.red, 'center', ramp(t, w('f042', 'fourteen') - 0.2, 0.3)); }
      // 1379
      if (col(960, '1379', f('f043') - 0.1) > 0) { const tiers = [['labourer', 1], ['craftsman', 2], ['knight', 5], ['duke', 9]];
        tiers.forEach(([lab, n], i) => { const a = ramp(t, f('f043') + 0.5 + i * 0.25, 0.25); if (a <= 0) return; c.save(); c.globalAlpha = a; const x = 810 + i * 100;
          c.fillStyle = mixColor(P.sepia, P.gold, i / 3); c.fillRect(x - 28, 820 - n * 40, 56, n * 40); G.text(c, lab, x, 808 - n * 40, 'italic 400 24px BodoniItalic', P.ink2, 'center'); c.restore(); });
        G.text(c, 'scaled by rank', 960, 970, '500 30px Oswald', P.red, 'center', ramp(t, w('f043', 'scaled') - 0.1, 0.3)); }
      // 1380
      if (col(1500, '1380', w('f044', 'eighty') - 0.2) > 0) { const th = w('f045', 'three'); for (let i = 0; i < 3; i++) if (t > th + i * 0.25) { const d = easeOut(clamp((t - th - i * 0.25) / 0.25)); G.groat(c, 1500, lerp(300, 760 - i * 52, d), 58); }
        G.text(c, '12d · three groats', 1500, 560, 'italic 400 40px BodoniItalic', P.ink, 'center', ramp(t, w('f045', 'twelve') - 0.1, 0.3));
        G.text(c, 'every man and woman over 15', 1500, 970, '500 30px Oswald', P.red, 'center', ramp(t, w('f045', 'fifteen') - 0.2, 0.3)); }
    });
    const ra = life(t, w('f045', 'rich') - 0.1, S.end + 0.3, 0.3, 0.3);
    if (ra > 0) { c.save(); c.globalAlpha = ra; panel(c, 960, 210, 760, 300, 0.95);
      A.figure(c, 760, 340, 230, CH.lord, { face: 1, armF: 20 }); A.figure(c, 1160, 340, 220, CH.peasant, { face: -1, armF: 20 });
      for (const x of [880, 1040]) for (let i = 0; i < 3; i++) G.groat(c, x, 300 - i * 30, 26);
      G.text(c, 'rich', 760, 100, 'italic 400 36px BodoniItalic', P.ink, 'center', ramp(t, w('f045', 'rich'), 0.2)); G.text(c, 'or poor', 1160, 100, 'italic 400 36px BodoniItalic', P.ink, 'center', ramp(t, w('f045', 'poor'), 0.2)); c.restore(); }
  } },
{ id: 'S21', at: 'f046', desc: 'A family of three adults at their cottage: three groats appear over each head.',
  sfx: [[w('f047', 'every'), 'coins', 0.8], [w('f047', 'adult'), 'coins', 0.8], [w('f047', 'house'), 'coins', 0.8]],
  draw(c, t, lt, S) {
    const ev = w('f047', 'every'), cam = push(lt, S.dur, 1.6, 1.68, 520, 760, 540, 760);
    const fam = [[360, CH.peasant, 1], [500, CH.woman, 1], [640, { ...CH.peasant, tunic: '#6E5A43', hood: '#4A3E32' }, -1]];
    withCam(c, cam, () => { PL.village(c, t); fam.forEach(([x, sp, fc]) => A.figure(c, x, 990, 250, sp, { face: fc, armF: 8 })); });
    fam.forEach(([x], i) => { const at = ev + i * 0.45, sx = W / 2 + cam.s * (x - cam.x), sy = H / 2 + cam.s * (990 - 250 * 1.02 - cam.y) - 50;
      for (let j = 0; j < 3; j++) { const a = ramp(t, at + j * 0.08, 0.2, backOut); if (a <= 0) continue; c.save(); c.translate(sx + (j - 1) * 50, sy); c.scale(a, a); G.groat(c, 0, 0, 23); c.restore(); } });
    G.slam(c, t, [{ t: 'SEVERAL DAYS\' WAGES' }], w('f046', 'several') - 0.1, S.end + 0.2, { y: 170, size: 96, mode: 'ink' });
    G.text(c, 'for every adult in the house', W / 2, 250, 'italic 400 44px BodoniItalic', P.ink, 'center', life(t, ev - 0.2, S.end + 0.2, 0.3, 0.3));
  } },
{ id: 'S22', at: 'f048', trans: 'fade', desc: 'The grid again: people vanish from the records; counter 1,355,201 → 896,481. NEARLY HALF A MILLION.',
  sfx: [[w('f049', 'disappeared'), 'whoosh', 0.9], [w('f050', 'fell'), 'tick', 0.5, 2.6], [w('f052', 'Nearly'), 'impact', 0.9]],
  draw(c, t, lt, S) {
    parchment(c, t);
    const roll0 = w('f050', 'fell'), roll1 = e('f051');
    const gone = 0.04 * ramp(t, f('f048') + 1, 2.5) + 0.3 * easeIO(clamp((t - roll0) / (roll1 - roll0)));
    PL.peopleGrid(c, t, { ...GRID, y: 520, state: k => { const h = hash(k + 7); return { color: P.ink2, a: clamp(1 - (gone - h) * 40) }; } });
    const v = t < roll0 ? 1355201 : Math.round(lerp(1355201, 896481, easeIO(clamp((t - roll0) / (roll1 - roll0)))));
    const ca = life(t, f('f048') + 0.3, S.end + 0.3, 0.4, 0.3);
    G.text(c, v.toLocaleString('en-GB'), W / 2, 250, '600 130px Bodoni', P.ink, 'center', ca);
    G.text(c, t < roll0 + 1 ? 'TAXPAYERS ON THE ROLLS · 1377' : 'TAXPAYERS ON THE ROLLS · 1381', W / 2, 310, '500 30px Oswald', P.red, 'center', ca);
    const sa = life(t, w('f049', 'disappeared') - 0.1, roll0 - 0.1, 0.12, 0.3); if (sa > 0) { c.save(); c.globalAlpha = sa; panel(c, W / 2, 640, 1100, 230, 0.9); c.restore(); }
    G.slam(c, t, [{ t: 'IT DISAPPEARED' }], w('f049', 'disappeared') - 0.05, roll0 - 0.1, { y: 650, size: 130, mode: 'ink' });
    const na = life(t, w('f052', 'Nearly') - 0.1, S.end + 0.3, 0.12, 0.3); if (na > 0) { c.save(); c.globalAlpha = na; panel(c, W / 2, 660, 1300, 330, 0.92); c.restore(); }
    G.slam(c, t, [{ t: 'NEARLY HALF', red: true }, { t: 'A MILLION', red: true }, { t: 'vanished from the records', small: true }], w('f052', 'Nearly') - 0.05, S.end + 0.2, { y: 670, size: 110, mode: 'ink' });
  } },
{ id: 'S23', at: 'f053', desc: 'Map of the south-east: the government was not fooled; commissioners (blue) fan out into Essex and Kent, March 1381.',
  sfx: [[w('f053', 'not'), 'impact', 0.6], [w('f054', 'sent'), 'whoosh', 0.7], [f('f054') + 0.2, 'tick', 0.5]],
  draw(c, t, lt, S) {
    const view = { lon: 0.45, lat: 51.5, span: 3.0 };
    G.drawMap(c, 'se', view, { rivers: ['Thames'] });
    for (const p of ['London']) G.mapLabel(c, view, p, 1, { t, size: 40, color: P.ink, box: true });
    const sent = w('f054', 'sent'), dests = ['Brentwood', 'Chelmsford', 'Colchester', 'Gravesend', 'Rochester', 'Maidstone', 'Canterbury', 'St Albans'];
    dests.forEach((d, i) => { const u = ramp(t, sent + i * 0.12, 1.8, easeIO); if (u <= 0) return; const end = G.route(c, view, ['London', d], u, { color: P.blue, w: 5, dash: [14, 10], arrow: false });
      G.token(c, end[0], end[1], 20, P.blue, 1); G.mapLabel(c, view, d, ramp(t, sent + 1.4 + i * 0.12, 0.4), { size: 28, dot: false, dx: 24, dy: 8 }); });
    G.token(c, ...G.proj(view, ...G.PLACES.London), 26, P.blue, ramp(t, f('f053'), 0.3));
    G.slam(c, t, [{ t: 'NOT FOOLED' }], w('f053', 'not') - 0.1, f('f054') + 0.4, { x: 1400, y: 240, size: 110, mode: 'ink' });
    G.dateLine(c, t, { at: f('f054') + 0.1, out: S.end + 0.3, event: 'Commissioners sent out', day: 'March', year: 1381, from: 1377, mode: 'ink' });
  } },
];

// ---------------------------------------------------------------- shared pieces used by later chapters too
export function drawChain(c, x0, y0, x1, y1, u, broken = 0) {
  const n = 26; c.save(); c.strokeStyle = '#3A3430'; c.lineWidth = 6;
  for (let i = 0; i < n * u; i++) { const k = i / n, x = lerp(x0, x1, k), y = lerp(y0, y1, k) + Math.sin(k * Math.PI) * 60; if (broken > 0 && Math.abs(k - 0.5) < 0.04) continue;
    const off = broken > 0 ? (k < 0.5 ? -1 : 1) * broken * 40 * Math.abs(k - 0.5) : 0; c.save(); c.translate(x + off, y + Math.abs(off) * 0.8); c.rotate(Math.atan2(y1 - y0, x1 - x0) + (i % 2 ? Math.PI / 2 : 0) * 0.0); c.beginPath(); c.ellipse(0, 0, 14, i % 2 ? 4 : 8, 0, 0, TAU); c.stroke(); c.restore(); }
  c.restore();
}
export function weekStrip(c, t, at, out, marks) {
  const a = life(t, at, out, 0.35, 0.3); if (a <= 0) return; c.save(); c.globalAlpha *= a;
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], x0 = 520, y = 150, bw = 120;
  panel(c, 960, 200, 980, 210, 0.92);
  days.forEach((d, i) => { const x = x0 + i * (bw + 20); const m = i < 2 ? ramp(t, marks[i] ?? 1e9, 0.3) : 0;
    c.fillStyle = mixColor('#E2D6BC', P.red, m * 0.85); c.fillRect(x, y, bw, 80); c.strokeStyle = P.ink3; c.lineWidth = 2; c.strokeRect(x, y, bw, 80);
    G.text(c, d, x + bw / 2, y + 52, '600 28px Oswald', m > 0.5 ? '#F6EFE0' : P.ink2, 'center'); });
  G.text(c, 'the lord\'s days: unpaid', x0 + bw, y + 130, 'italic 400 34px BodoniItalic', P.red, 'center', ramp(t, marks[0] ?? 1e9, 0.4));
  c.restore();
}
export function manorRollPlate(c, t, lt, S, o) {
  parchment(c, t, '#6E5030', 0.35);
  withCam(c, push(lt, S.dur, 1.0, 1.08, W * 0.55, H * 0.5, W * 0.6, H * 0.48), () => {
    G.manorRoll(c, t, 1150, 110, 440, 860, o.unroll, { highlight: o.tag ? 5 : null, tag: o.tag, burn: o.burn });
  });
}
const EN1360 = [ // English lands in France after Brétigny (approximate)
  [[47.1, -2.2], [47.05, 0.0], [46.6, 1.2], [45.9, 2.3], [44.9, 2.6], [44.1, 2.6], [43.6, 1.4], [43.2, 0.2], [43.0, -1.0], [43.3, -1.9], [44.6, -1.6], [45.6, -1.6], [46.3, -1.9]],
  [[51.05, 1.6], [51.0, 2.1], [50.75, 2.05], [50.72, 1.55]], [[50.35, 1.45], [50.3, 2.05], [50.0, 1.95], [50.02, 1.35]]];
const EN1377 = [ // Calais, the Bordeaux–Bayonne strip, Brest, Cherbourg
  [[51.05, 1.7], [51.0, 2.05], [50.85, 1.98], [50.86, 1.66]],
  [[45.15, -1.6], [45.0, -0.3], [44.55, -0.15], [43.9, -0.6], [43.4, -1.15], [43.3, -1.9], [44.6, -1.6]],
  [[48.5, -4.9], [48.5, -4.3], [48.25, -4.35], [48.3, -4.8]], [[49.75, -1.85], [49.72, -1.45], [49.55, -1.5], [49.6, -1.9]]];
const ENGLAND = [[55.8, -3.2], [55.8, -1.6], [54.5, -0.5], [53.6, 0.2], [52.9, 1.8], [51.9, 1.8], [51.1, 1.6], [50.7, 0.3], [50.5, -3.0], [49.9, -5.9], [50.6, -5.8], [51.4, -3.2], [51.6, -2.6], [52.5, -3.1], [53.3, -3.2], [54.4, -3.6], [55.0, -3.2]];
function swords(c, x, y, s, a) { c.save(); c.globalAlpha *= a; c.translate(x, y); for (const r of [-0.7, 0.7]) { c.save(); c.rotate(r); c.fillStyle = '#4A4036'; c.fillRect(-4, -s, 8, s * 1.6); c.fillRect(-s * 0.3, s * 0.3, s * 0.6, 8); c.fillStyle = P.gold; c.fillRect(-5, s * 0.36, 10, s * 0.3); c.restore(); } c.restore(); }
export function throneRoom(c, t) { PL.interior(c, t, { dark: 0.35, banners: true, arches: 2, bannerX: [W * 0.5 - 300, W * 0.5 + 300] }); PL.throne(c, 960, 905, 172); PL.candle(c, 600, 900, t, 1); PL.candle(c, 1320, 900, t, 2); }
export function boyKing(c, x, y, h, t) {
  A.figure(c, x, y, h, { ...CH.richard, crown: false }, { seated: true, face: 1, armF: 35, elbF: 40 });
  const hx = x + 0.006 * h, hy = y - 0.865 * h, hr = 0.066 * h, tilt = 0.12 + Math.sin(t * 1.3) * 0.03; // crown one size too big, slipping
  c.save(); c.translate(hx, hy - hr * 0.55); c.rotate(tilt); const cw = hr * 1.5; c.fillStyle = P.gold2; c.beginPath(); c.moveTo(-cw, hr * 0.3); c.lineTo(-cw, -hr * 0.4);
  for (let i = 0; i < 5; i++) { const px = -cw + (i + 0.5) * (2 * cw / 5); c.lineTo(px, -hr * (i % 2 ? 0.6 : 1.1)); c.lineTo(-cw + (i + 1) * (2 * cw / 5), -hr * 0.4); } c.lineTo(cw, hr * 0.3); c.closePath(); c.fill();
  c.fillStyle = P.red; c.beginPath(); c.arc(0, -hr * 0.05, hr * 0.16, 0, TAU); c.fill(); c.restore();
}
export function councilPlate(c, t, lt, S, gauntAt) {
  withCam(c, push(lt, S.dur, 1.0, 1.06, W / 2, H * 0.55, W / 2, H * 0.55), () => {
    PL.interior(c, t, { dark: 0.55, arches: 2 });
    const g = ramp(t, gauntAt - 0.3, 0.8);
    const nobles = [[560, CH.lord, 1], [760, { ...CH.lord, robe: '#4A3A28', cap: '#4A3A28' }, 1], [1160, { ...CH.lord, robe: '#2E3A44', cap: '#2E3A44' }, -1], [1360, { ...CH.lord, robe: '#3E2A2A', cap: '#3E2A2A' }, -1]];
    nobles.forEach(([x, sp, fc]) => { A.figure(c, x, 890, 330, PL.shade(sp, '#241E18'), { face: fc, armF: 10 }); c.save(); c.globalAlpha = 1 - 0.8 * g; A.figure(c, x, 890, 330, sp, { face: fc, armF: 10 }); c.restore(); });
    A.figure(c, 960, 890 - 20 * g, 350, CH.gaunt, { face: 1, armF: 20 + 25 * g, elbF: 30 });
    PL.table(c, 960, 990, 1200, 120, '#5A1E1A');
    PL.candle(c, 700, 856, t, 3); PL.candle(c, 1220, 856, t, 4);
  });
}
