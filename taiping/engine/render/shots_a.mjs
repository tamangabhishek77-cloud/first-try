// Shots: cold open, chapters 1–4 (Taiping episode). Every beat is keyed to a word or fragment of the narration (T.f / T.w).
import { W, H, P, T, clamp, lerp, easeIO, easeOut, easeIn, backOut, ramp, life, rng, mixColor, rgba, noise1, parchment, withCam, push } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';
import * as PL from './plates.mjs';
const { CH } = A; const f = T.f, e = T.e, w = T.w;
const TAU = Math.PI * 2;
const dim = (c, a) => { if (a <= 0) return; c.save(); c.fillStyle = `rgba(16,12,8,${a})`; c.fillRect(0, 0, W, H); c.restore(); };
const panel = (c, x, y, w_, h_, a = 0.86) => { c.save(); c.globalAlpha *= a; c.fillStyle = '#ECE1C8'; c.shadowColor = 'rgba(0,0,0,0.3)'; c.shadowBlur = 30; c.fillRect(x - w_ / 2, y - h_ / 2, w_, h_); c.restore(); };
const hash = k => { const r = rng(k * 2654435761 >>> 0); r(); return r(); };
const tint = (c, col, a) => { if (a <= 0) return; c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = a; c.fillStyle = col; c.fillRect(0, 0, W, H); c.restore(); };
const cam = (c, lt, S, s0, s1, x0, y0, x1, y1, fn) => withCam(c, push(lt, S.dur, s0, s1, x0 ?? W / 2, y0 ?? H / 2, x1 ?? x0 ?? W / 2, y1 ?? y0 ?? H / 2), fn);
const fade = (c, a, fn) => { if (a <= 0) return; c.save(); c.globalAlpha *= a; fn(); c.restore(); };
// a generic Qing official (not a named character) for "pass, and you could become an official"
const OFFICIAL = { ...CH.scholar, robe: P.gold, edge: '#8A6B27', lapel: '#8A6B27', square: '#E2C47A', skullcap: null, mhat: '#1E1A15' };
// the planted object's motif (three notes in audio/mix.py) is cued with sfx 'motif'
export { dim, panel, hash, tint, cam, fade, OFFICIAL };

// the views used by the map shots
export const V = { cn: G.CN_VIEW, south: { lon: 111.6, lat: 23.6, span: 6.5 }, north: { lon: 116.5, lat: 34.5, span: 20 }, lower: { lon: 118.6, lat: 31.2, span: 8 }, gx: { lon: 110.4, lat: 23.6, span: 4.2 } };
export const tok = (c, view, place, col, a = 1, label = null, r = 26) => { const p = Array.isArray(place) ? place : G.PLACES[place]; const [x, y] = G.proj(view, p[0], p[1]); G.token(c, x, y, r, col, a, label); return [x, y]; };

export const SHOTS_A = [
// ================================================================ COLD OPEN
{ id: 'S01', at: 0, desc: 'Nanjing at dusk, June 1864: the walls, the palace roofs, the Hunan Army siege lines. Date-line.',
  sfx: [[0, 'wind', 0.7, 5], [0.4, 'drum', 0.4, 4], [0.9, 'tick', 0.6], [w('f001', 'Nanjing'), 'whoosh', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.42, H * 0.5, () => {
      PL.nanjing(c, t, { dusk: 0.85, siege: 1 });
      A.crowd(c, { x0: -100, x1: 2020, y: 1000, n: 60, hMin: 60, hMax: 110, depth: 60, seed: 3, t, color: P.blue, far: '#5A6A7A', hat: 'cone', tools: true, face: -1 });
    });
    G.dateLine(c, t, { at: 0.5, out: 4.4, event: 'Nanjing, besieged', day: 'June', year: 1864, from: 1859, mode: 'light', y: 150 });
  } },
{ id: 'S02', at: 'f002', dark: true, desc: 'The Heavenly King\'s throne hall in shadow: Hong on the throne, the medallion "believed he was the younger brother of Jesus". The light dies on "dying".',
  sfx: [[f('f002'), 'whoosh', 0.4], [w('f002', 'Jesus') - 0.2, 'bell', 0.5], [w('f003', 'dying'), 'thud', 0.5]],
  draw(c, t, lt, S) {
    const dk = lerp(0.35, 0.8, ramp(t, w('f003', 'dying') - 0.3, 1.5, easeIO));
    cam(c, lt, S, 1.05, 1.16, W / 2, H * 0.52, W / 2, H * 0.5, () => {
      PL.hallInterior(c, t, { mode: 'throne', dark: dk });
      A.figure(c, 960, 760, 330, CH.hong, { face: 1, seated: true, armF: 20, elbF: 30, lean: lerp(0, -8, ramp(t, f('f003'), 2)) });
    });
    G.medallion(c, t, 'hong', 1560, 330, 120, w('f002', 'man') - 0.1, S.end + 0.3, { role: 'believed he was the younger brother of Jesus' });
  } },
{ id: 'S03', at: 'f004', trans: 'ink', dark: true, desc: 'Night inside the walls: a grey, thin crowd. STARVING. Li Xiucheng\'s medallion ("one of his own generals"). WILD PLANTS / MANNA.',
  sfx: [[f('f004'), 'night', 0.7, 8], [w('f004', 'starving'), 'impact', 0.7], [w('f005', 'generals'), 'whoosh', 0.5], [w('f006', 'wild'), 'impact', 0.6], [w('f006', 'manna'), 'bell', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.1, W / 2, H * 0.55, W * 0.55, H * 0.6, () => {
      PL.nanjing(c, t, { night: 0.85, dusk: 0.2 });
      A.crowd(c, { x0: -100, x1: 2020, y: 1000, n: 70, hMin: 90, hMax: 170, depth: 90, seed: 31, t, color: '#3A3632', far: '#2A2622', tools: false, agit: 0.2 });
      const g = ramp(t, w('f006', 'wild') - 0.4, 1.2); if (g > 0) { c.save(); c.strokeStyle = '#3E4A2A'; c.lineWidth = 4; const r = rng(7); for (let i = 0; i < 90; i++) { const x = r() * W, h = (30 + r() * 60) * g; c.beginPath(); c.moveTo(x, 1080); c.quadraticCurveTo(x + 10, 1080 - h * 0.6, x + (r() - 0.5) * 30, 1080 - h); c.stroke(); } c.restore(); }
    });
    G.slam(c, t, [{ t: 'STARVING' }], w('f004', 'starving'), f('f005') + 0.1, { y: H * 0.3, size: 150 });
    G.medallion(c, t, 'li', 1600, 300, 100, w('f005', 'generals') - 0.2, w('f006', 'wild'), { role: 'the Loyal King' });
    G.slam(c, t, [{ t: 'WILD PLANTS' }], w('f006', 'wild'), w('f006', 'manna') - 0.1, { y: H * 0.3, size: 130 });
    G.slam(c, t, [{ t: 'call it', small: true }, { t: 'MANNA', gold: true }], w('f006', 'manna') - 0.05, S.end + 0.2, { y: H * 0.32, size: 150 });
  } },
{ id: 'S04', at: 'f007', trans: 'whip', desc: 'The map of China: red spreads from the south to the lower Yangtze ("torn the country apart"); the map dims and the toll rolls: 20–30 MILLION.',
  sfx: [[f('f007'), 'whoosh', 0.6], [w('f007', 'torn'), 'fire', 0.5, 3], [w('f008', 'killed'), 'impact', 0.9], [w('f008', 'twenty'), 'tick', 0.6], [w('f008', 'thirty'), 'tick', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.52, H * 0.48, () => {
      PL.chinaMap(c, t, { tp: ramp(t, w('f007', 'torn') - 0.6, 2.2, easeIO), labels: ['Canton', 'Nanjing', 'Beijing'], hi: 'Nanjing' });
      G.route(c, V.cn, ['Jintian', 'Yongan', 'Guilin', 'Changsha', 'Wuchang', 'Anqing', 'Nanjing'], ramp(t, f('f007'), 2.6, easeIO), { w: 7 });
    });
    dim(c, 0.6 * ramp(t, w('f008', 'killed') - 0.3, 0.6));
    G.slam(c, t, [{ t: '20 – 30' }, { t: 'MILLION', red: true }, { t: 'dead, by most estimates', small: true }], w('f008', 'killed') - 0.05, S.end + 0.2, { y: H * 0.46, size: 170 });
  } },
{ id: 'S05', at: 'f009', trans: 'black', dark: true, desc: 'Title card: THE TAIPING REBELLION 1851–1864 over a rising red crowd; "a failed exam student" / "a kingdom of heaven" / "why it ended in fire" as a fire wall rises.',
  sfx: [[f('f009') - 0.3, 'thunder', 0.6], [w('f009', 'Taiping'), 'gong', 1.0], [w('f010', 'failed'), 'whoosh', 0.6], [w('f010', 'kingdom'), 'whoosh', 0.6], [w('f011', 'fire'), 'fire', 0.9, 2.5], [w('f011', 'fire'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    const failed = w('f010', 'failed'), kingdom = w('f010', 'kingdom'), fire = w('f011', 'fire');
    cam(c, lt, S, 1.0, 1.06, W / 2, H * 0.55, W / 2, H * 0.5, () => {
      A.sky(c, 'storm', t); A.clouds(c, t, 31, 260, 'rgba(30,26,24,0.35)', 6, 14, 1.4);
      A.karst(c, 860, 61, '#2E2822', 8, 160, 320);
      const yy = lerp(1210, 905, easeOut(clamp((t - failed + 0.6) / 1.4)));
      A.crowd(c, { x0: -100, x1: 2020, y: yy, n: 120, hMin: 80, hMax: 150, depth: 90, seed: 13, t, color: '#1E1A16', far: '#2C2622', red: ramp(t, kingdom, 1.0), raise: ramp(t, kingdom, 0.8), hair: true, agit: 1.2 });
      const fw = ramp(t, fire - 0.2, 1.6, easeIO); if (fw > 0) { c.save(); c.globalAlpha = fw; A.sky(c, 'fire', t); c.restore(); for (let i = 0; i < 6; i++) A.flames(c, 160 + i * 320, 1080, 420, 420 * fw, t, 40 + i, 9); }
    });
    const out = S.end - 0.2;
    G.slam(c, t, [{ t: 'THE TAIPING' }, { t: 'REBELLION', red: true }], w('f009', 'Taiping'), out, { y: H * 0.36, size: 160 });
    G.text(c, '1851 – 1864', W / 2, H * 0.36 + 200, '500 64px Oswald', P.gold2, 'center', life(t, w('f009', 'Taiping') + 0.4, out, 0.4, 0.3), 'rgba(0,0,0,0.6)');
    const sub = (s, a0, a1) => G.text(c, s, W / 2, H * 0.36 + 290, 'italic 400 56px BodoniItalic', '#EDE3CF', 'center', life(t, a0, a1, 0.2, 0.2), 'rgba(0,0,0,0.6)');
    sub('a failed exam student', failed - 0.05, kingdom - 0.05); sub('a kingdom of heaven', kingdom - 0.05, fire - 0.3); sub('and why it ended in fire', fire - 0.3, out);
  } },
{ id: 'S06', at: e('f011') + 0.1, trans: 'cut', dark: true, desc: 'Brand sting: a fuse burns across the black and lights THE MAJOR REVOLUTION.',
  sfx: [[e('f011') + 0.25, 'match', 0.9], [e('f011') + 0.45, 'fuse', 0.8, 1.7], [e('f011') + 2.15, 'boom', 1.0]],
  draw(c, t, lt, S) {
    c.fillStyle = '#0E0C0A'; c.fillRect(0, 0, W, H);
    const x0 = 330, x1 = 1590, u = easeIO(clamp((lt - 0.35) / 1.7)), xb = lerp(x0, x1, u);
    const fadeOut = 1 - clamp((lt - (S.dur - 0.5)) / 0.5);
    c.save(); c.globalAlpha = fadeOut;
    c.strokeStyle = '#6E5A3A'; c.lineWidth = 4; c.beginPath(); c.moveTo(xb, 640); c.lineTo(x1, 640); c.stroke();
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

// ================================================================ CH 1  The list
{ id: 'S07', at: 'f012', trans: 'black', desc: 'The Canton examination compound: script "Canton"; candidates stream in. THOUSANDS.',
  sfx: [[f('f012') - 0.2, 'murmur', 0.6, 8], [f('f012') + 0.5, 'tick', 0.5], [w('f013', 'thousands'), 'impact', 0.6], [w('f013', 'exams'), 'gong', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.07, W / 2, H / 2, W * 0.45, H * 0.52, () => {
      PL.examHall(c, t, {});
      const k = (t - f('f012')) * 40; for (let i = 0; i < 14; i++) { const x = ((i * 137 + k) % 1500) - 100, d = (i % 3) / 2; A.figure(c, x, 900 + d * 120, 150 + d * 90, CH.scholar, { face: 1, walk: t * 5 + i, t }); }
    });
    G.scriptName(c, t, 'Canton', f('f012') - 0.1, w('f013', 'thousands') - 0.1, { y: H * 0.32, size: 190, mode: 'ink', role: 'southern China · 1837' });
    G.slam(c, t, [{ t: 'THOUSANDS' }, { t: 'of candidates', small: true }], w('f013', 'thousands'), S.end + 0.2, { x: 620, y: H * 0.34, size: 140, mode: 'ink' });
  } },
{ id: 'S08', at: 'f014', trans: 'whip', desc: 'Split card: PASS – an official appears, "rich · respected · safe"; FAIL – a candidate walks home with nothing.',
  sfx: [[w('f014', 'Pass'), 'whoosh', 0.5], [w('f014', 'rich'), 'coin', 0.6], [w('f014', 'respected'), 'tick', 0.5], [w('f014', 'safe'), 'tick', 0.5], [w('f015', 'Fail'), 'thud', 0.7], [w('f015', 'nothing'), 'impact', 0.5]],
  draw(c, t, lt, S) {
    parchment(c, t);
    c.fillStyle = 'rgba(42,36,29,0.85)'; c.fillRect(W / 2 - 3, 120, 6, 840);
    G.text(c, 'PASS', W * 0.25, 210, '900 110px Bodoni', P.ink, 'center', ramp(t, w('f014', 'Pass') - 0.1, 0.3));
    fade(c, ramp(t, w('f014', 'official') - 0.3, 0.5), () => A.figure(c, W * 0.25 - 120, 900, 420, OFFICIAL, { face: 1, armF: 30, elbF: 40 }));
    ['rich', 'respected', 'safe'].forEach((s, i) => G.text(c, s, W * 0.25 + 150, 520 + i * 90, 'italic 400 60px BodoniItalic', P.ink, 'center', ramp(t, w('f014', s) - 0.1, 0.3)));
    G.text(c, 'FAIL', W * 0.75, 210, '900 110px Bodoni', P.red, 'center', ramp(t, w('f015', 'Fail') - 0.1, 0.3));
    const u = ramp(t, w('f015', 'Fail'), 2.4, easeIO); fade(c, ramp(t, w('f015', 'Fail') - 0.2, 0.3), () => A.figure(c, lerp(W * 0.7, W * 0.92, u), 900, 360, CH.scholar, { face: 1, walk: u > 0 && u < 1 ? t * 5 : null, armF: 4, elbF: 4 }));
    G.text(c, 'nothing', W * 0.75, 1000, 'italic 400 60px BodoniItalic', P.red, 'center', ramp(t, w('f015', 'nothing') - 0.1, 0.3));
  } },
{ id: 'S09', at: 'f016', trans: 'ink', desc: 'Hong\'s Hakka village: Hong walks to the road with his books. Medallion "aged 23". Two FAILED stamps.',
  sfx: [[f('f016') - 0.1, 'village', 0.6, 6.5], [w('f016', 'Hong'), 'whoosh', 0.5], [w('f017', 'failed'), 'stamp', 0.8], [w('f017', 'twice'), 'stamp', 0.8]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.46, H * 0.55, () => {
      PL.hakkaVillage(c, t, { dusk: 0.15 });
      const u = ramp(t, f('f016'), 5, easeIO); A.figure(c, lerp(560, 860, u), 980, 300, CH.hongStudent, { face: 1, walk: u < 1 ? t * 4.5 : null, prop: 'tract', armF: 55, elbF: 50 });
      A.figure(c, 1200, 960, 230, CH.villager, { face: -1, prop: 'spade', armF: 30 + Math.sin(t * 2) * 15, elbF: 20 });
      A.figure(c, 1380, 970, 220, CH.hakkaWoman, { face: -1 });
    });
    G.medallion(c, t, 'hongStudent', 1600, 300, 110, w('f016', 'Hong') - 0.1, S.end + 0.3, { role: 'aged 23 · a Hakka' });
    G.stamp(c, t, 'FAILED', w('f017', 'failed'), S.end + 0.2, { x: 520, y: 300, size: 100, rot: -0.12 });
    G.stamp(c, t, 'FAILED', w('f017', 'twice'), S.end + 0.2, { x: 620, y: 420, size: 100, rot: 0.08 });
  } },
{ id: 'S10', at: 'f018', trans: 'cut', desc: 'THE PLANT: the pass list is pasted on the screen wall; a red line scans the columns; the empty dashed slot – "Hong Xiuquan · not on the list"; the red REMEMBER tag pins on "Remember".',
  sfx: [[w('f018', 'posted'), 'paper', 0.8], [f('f018'), 'murmur', 0.5, 4], [f('f019'), 'tick', 0.4], [w('f019', 'not'), 'impact', 0.6], [w('f020', 'Remember') - 0.05, 'motif', 1.0], [w('f020', 'Remember'), 'stamp', 0.6]],
  draw(c, t, lt, S) {
    const L = PL.EXAM_LIST;
    cam(c, lt, S, 1.0, 1.32, W / 2, H / 2, L.x - 80, L.y + 20, () => {
      PL.examHall(c, t, { list: { reveal: ramp(t, w('f018', 'posted') - 0.4, 1.0, easeIO), scan: clamp((t - f('f019') + 0.2) / 1.6), gap: ramp(t, w('f019', 'not') - 0.1, 0.4), tag: ramp(t, w('f020', 'Remember') - 0.1, 0.3), caption: 'Pass list · Canton · 1837' } });
      for (let i = 0; i < 5; i++) A.figure(c, 520 + i * 120, 1000, 230 + (i % 2) * 20, CH.scholar, { face: 1, armF: i === 2 ? 70 : 10, elbF: 30 });
      A.figure(c, 1040, 1040, 300, CH.hongStudent, { face: 1, armF: 8, elbF: 6 });
    });
  } },
{ id: 'S11', at: 'f021', trans: 'black', dark: true, desc: 'Night at home: Hong collapses, lies raving by a candle; his family stand over him.',
  sfx: [[w('f021', 'collapsed'), 'thud', 0.8], [f('f021') + 1, 'night', 0.5, 6], [w('f022', 'dying'), 'bell', 0.4]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.05, 1.15, W / 2, H * 0.55, W * 0.52, H * 0.6, () => {
      PL.hallInterior(c, t, { mode: 'home', night: true, dark: 0.55 });
      c.fillStyle = '#3A2A1C'; c.fillRect(560, 800, 760, 70); c.fillStyle = '#5A4A38'; c.fillRect(560, 780, 760, 26);
      c.save(); c.translate(1260, 790); c.rotate(-Math.PI / 2 + Math.sin(t * 7) * 0.012 * (t < w('f022', 'family') ? 1 : 0)); A.figure(c, 0, 0, 340, CH.hongStudent, { face: -1, armF: 40 + Math.sin(t * 5) * 30, elbF: 30 }); c.restore();
      PL.candle(c, 520, 800, t, 3);
      fade(c, ramp(t, f('f022') - 0.4, 0.6), () => { A.figure(c, 1460, 1000, 330, PL.shade(CH.villager, '#1E1812'), { face: -1, armF: 30, elbF: 40 }); A.figure(c, 1640, 1000, 300, PL.shade(CH.hakkaWoman, '#1E1812'), { face: -1 }); });
    });
    G.slam(c, t, [{ t: 'for weeks', small: true }, { t: 'HE RAVED' }], w('f021', 'raved') - 0.05, f('f022') + 0.2, { y: H * 0.25, size: 120 });
  } },
{ id: 'S12', at: 'f023', trans: 'fade', desc: 'The vision: Hong rises into a palace in a gold sky; the old man with the golden beard (backlit silhouette) hands him a sword.',
  sfx: [[f('f023'), 'chant', 0.5, 7], [w('f023', 'palace'), 'bell', 0.6], [w('f024', 'golden'), 'whoosh', 0.5], [w('f024', 'sword'), 'clang', 0.6]],
  draw(c, t, lt, S) {
    const sw = w('f024', 'sword');
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.55, W / 2, H * 0.5, () => {
      PL.dream(c, t, {});
      const g = ramp(t, w('f024', 'old') - 0.3, 1.0); fade(c, g, () => PL.visionFigure(c, t, 'visionGod', 760, 880, 420, { face: 1, prop: t > sw ? null : 'sword', armF: lerp(10, 75, ramp(t, w('f024', 'handed'), 0.8)), elbF: -10 }));
      const rise = lerp(1300, 980, ramp(t, f('f023'), 2.5, easeOut));
      A.figure(c, 1120, rise, 300, CH.hongStudent, { face: -1, armF: t > sw ? 80 : 20, elbF: 20, prop: t > sw ? 'sword' : null });
    });
  } },
{ id: 'S13', at: 'f025', trans: 'cut', desc: 'Demons crowd the cloud floor; the elder brother (silhouette) joins; together they hunt the demons down. Never a face.',
  sfx: [[w('f025', 'demons'), 'impact', 0.6], [w('f025', 'demons'), 'sting', 0.5], [w('f026', 'younger'), 'whoosh', 0.5], [w('f027', 'hunt'), 'slash', 0.7], [w('f027', 'down'), 'slash', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.04, 1.12, W / 2, H * 0.6, W * 0.5, H * 0.62, () => {
      PL.dream(c, t, { demons: ramp(t, w('f025', 'demons') - 0.4, 0.6), slain: ramp(t, w('f027', 'hunt'), 1.6) });
      PL.visionFigure(c, t, 'visionGod', 520, 860, 380, { face: 1 });
      fade(c, ramp(t, w('f026', 'younger') - 0.2, 0.8), () => PL.visionFigure(c, t, 'visionBro', 1420, 880, 350, { face: -1, armF: lerp(10, 110, ramp(t, w('f027', 'hunt'), 0.4)), elbF: 0 }));
      A.figure(c, 960, 960, 320, CH.hongStudent, { face: 1, prop: 'sword', armF: lerp(60, 140, ramp(t, w('f027', 'hunt'), 0.3)) - 80 * ramp(t, w('f027', 'down'), 0.3), elbF: 0 });
    });
    G.slam(c, t, [{ t: 'DEMONS', red: true }], w('f025', 'demons'), f('f026') + 0.3, { y: H * 0.22, size: 140 });
    G.text(c, 'as Hong later told it', W / 2, 1030, 'italic 400 34px BodoniItalic', P.ink2, 'center', life(t, f('f025') + 0.5, S.end, 0.4, 0.3));
  } },
{ id: 'S14', at: 'f028', trans: 'fade', desc: 'Back in the village: Hong, recovered, walks with his books. SIX YEARS. The dream meant nothing.',
  sfx: [[f('f028'), 'village', 0.5, 4.5], [w('f028', 'six'), 'tick', 0.6], [w('f028', 'nothing'), 'whoosh', 0.3]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.08, 1.0, W * 0.5, H * 0.55, W / 2, H / 2, () => {
      PL.hakkaVillage(c, t, { dusk: 0.45 });
      A.figure(c, lerp(900, 1150, ramp(t, f('f028'), 4)), 980, 300, CH.hongStudent, { face: 1, walk: t * 4.5, prop: 'tract', armF: 55, elbF: 50 });
    });
    G.slam(c, t, [{ t: 'SIX YEARS' }, { t: 'the dream meant nothing', small: true }], w('f028', 'six'), S.end + 0.2, { y: H * 0.3, size: 140 });
  } },

// ================================================================ CH 2  God's younger son
{ id: 'S15', at: 'f029', trans: 'black', desc: 'The same exam wall (callback): the list again; FAILED · 1843 stamps across the empty slot.',
  sfx: [[f('f029'), 'murmur', 0.4, 3.5], [w('f029', 'fourth') - 0.05, 'stamp', 0.9]],
  draw(c, t, lt, S) {
    const L = PL.EXAM_LIST;
    cam(c, lt, S, 1.2, 1.28, L.x - 100, L.y, L.x - 120, L.y + 10, () => PL.examHall(c, t, { list: { reveal: 1, gap: 1, gapLabel: false, tag: 1, caption: 'Pass list · Canton · 1843' } }));
    G.stamp(c, t, 'FAILED · 1843', w('f029', 'fourth') - 0.05, S.end + 0.2, { x: 760, y: 560, size: 110, rot: -0.1 });
    G.dateLine(c, t, { at: f('f029') + 0.1, out: S.end, event: 'The fourth failure', year: 1843, from: 1837, mode: 'ink', y: 150, x: 200 });
  } },
{ id: 'S16', at: 'f030', trans: 'ink', desc: 'The tracts: a booklet opens on parchment, columns of brush text; Liang Fa\'s medallion.',
  sfx: [[w('f030', 'opened'), 'paper', 0.8], [w('f031', 'Christian'), 'paper', 0.5], [w('f031', 'Liang'), 'whoosh', 0.4]],
  draw(c, t, lt, S) {
    parchment(c, t);
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.48, H * 0.5, () => {
      const op = ramp(t, w('f030', 'opened') - 0.2, 1.0, easeIO);
      G.passList(c, t, 760, 560, lerp(120, 760, op), 640, { reveal: op, cols: 10, rows: 10, seed: 77, caption: 'Good Words to Exhort the Age · 1832' });
      fade(c, ramp(t, w('f031', 'Christian') - 0.2, 0.5), () => { c.save(); c.translate(760, 280); c.fillStyle = P.red; c.fillRect(-8, -40, 16, 80); c.fillRect(-30, -18, 60, 14); c.restore(); });
    });
    G.medallion(c, t, 'liangFa', 1500, 460, 140, w('f031', 'Liang') - 0.2, S.end + 0.3, {});
  } },
{ id: 'S17', at: 'f032', trans: 'fade', desc: 'The dream returns (callback plate) as Hong reads: the old man is labelled "God the Father".',
  sfx: [[f('f032'), 'chant', 0.4, 8], [w('f032', 'believed'), 'tick', 0.5], [w('f033', 'God'), 'bell', 0.7]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.07, W / 2, H * 0.55, W * 0.44, H * 0.55, () => {
      PL.dream(c, t, {});
      PL.visionFigure(c, t, 'visionGod', 700, 900, 440, { face: 1 });
      A.figure(c, 1180, 980, 300, CH.hongStudent, { face: -1, prop: 'tract', armF: 60, elbF: 50 });
    });
    G.slam(c, t, [{ t: 'or believed he did', small: true }], w('f032', 'believed') - 0.1, f('f033') + 0.1, { y: H * 0.2, size: 120, mode: 'ink' });
    G.scriptName(c, t, 'God the Father', w('f033', 'God') - 0.1, S.end + 0.3, { x: 720, y: H * 0.24, size: 130, mode: 'ink', role: 'in Hong\'s reading' });
  } },
{ id: 'S18', at: 'f034', trans: 'cut', desc: 'The elder brother labelled "Jesus Christ"; Hong between them: THE SECOND SON OF GOD, sent to slay demons.',
  sfx: [[w('f034', 'Jesus'), 'bell', 0.6], [w('f035', 'second'), 'impact', 0.9], [w('f035', 'demons'), 'slash', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.1, W / 2, H * 0.55, W / 2, H * 0.5, () => {
      PL.dream(c, t, { demons: ramp(t, w('f035', 'demons') - 0.3, 0.4) });
      PL.visionFigure(c, t, 'visionGod', 460, 880, 420, { face: 1 });
      PL.visionFigure(c, t, 'visionBro', 1460, 880, 380, { face: -1 });
      A.figure(c, 960, 980, lerp(300, 340, ramp(t, w('f035', 'second'), 0.6)), CH.hongStudent, { face: 1, prop: 'sword', armF: lerp(10, 150, ramp(t, w('f035', 'demons') - 0.2, 0.4)), elbF: 0 });
    });
    G.scriptName(c, t, 'Jesus Christ', w('f034', 'Jesus') - 0.1, w('f035', 'second') - 0.2, { x: 1440, y: H * 0.24, size: 120, mode: 'ink', role: 'the elder brother' });
    G.slam(c, t, [{ t: 'THE SECOND' }, { t: 'SON OF GOD', red: true }, { t: 'sent to slay demons', small: true }], w('f035', 'second') - 0.05, S.end + 0.2, { y: H * 0.3, size: 120 });
  } },
{ id: 'S19', at: 'f036', trans: 'whip', desc: 'The Qing Dragon Throne in shadow; DEMONS stamps over the emperor; "the Manchus · the Qing dynasty since 1644".',
  sfx: [[w('f036', 'demons'), 'sting', 0.6], [w('f036', 'Manchus'), 'stamp', 0.9], [w('f037', 'foreign'), 'gong', 0.4]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.1, W / 2, H * 0.5, W / 2, H * 0.48, () => {
      PL.hallInterior(c, t, { mode: 'qing', dark: lerp(0.1, 0.5, ramp(t, w('f036', 'demons'), 1.2)) });
      A.figure(c, 960, 760, 300, PL.shade(CH.emperor, '#2A1E12'), { face: 1, seated: true });
    });
    G.stamp(c, t, 'DEMONS', w('f036', 'Manchus'), S.end + 0.2, { x: W / 2, y: 330, size: 150, rot: -0.1 });
    G.scriptName(c, t, 'the Manchus', w('f037', 'foreign') - 0.2, S.end + 0.3, { y: H * 0.86, size: 110, role: 'the Qing dynasty · since 1644' });
  } },
{ id: 'S20', at: 'f038', trans: 'cut', desc: 'The village school: Hong takes the Confucian tablet off the altar and throws it out. DISMISSED.',
  sfx: [[w('f038', 'threw'), 'whoosh', 0.7], [w('f038', 'school') - 0.1, 'smash', 0.7], [w('f039', 'lost'), 'stamp', 0.8]],
  draw(c, t, lt, S) {
    const th = ramp(t, w('f038', 'threw') - 0.1, 0.9, easeIn);
    const tablet = (x, y, r) => { c.save(); c.translate(x, y); c.rotate(r); c.fillStyle = '#3A2414'; c.fillRect(-45, -75, 90, 150); c.fillStyle = P.gold; c.fillRect(-33, -61, 66, 122); c.restore(); };
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.55, W * 0.55, H * 0.55, () => {
      PL.hallInterior(c, t, { mode: 'school', tablet: th > 0 ? 0 : 1 });
      if (th > 0 && th < 1) tablet(lerp(960, 1700, th), lerp(595, 980, th) - Math.sin(th * Math.PI) * 220, th * 5);
      if (th >= 1) tablet(1700, 1000, 1.4);
      A.figure(c, 1240, 980, 360, CH.hongStudent, { face: -1, armF: lerp(60, 160, ramp(t, w('f038', 'threw') - 0.3, 0.3)), elbF: 10 });
    });
    G.dateLine(c, t, { at: f('f038') + 0.2, out: w('f039', 'lost'), event: 'By most accounts', year: 1843, from: 1840, mode: 'light', y: 150 });
    G.stamp(c, t, 'DISMISSED', w('f039', 'lost'), S.end + 0.2, { x: 620, y: 300, size: 120 });
  } },
{ id: 'S21', at: 'f040', trans: 'ink', desc: 'Canton, 1847: Hong studies with the American Baptist Issachar Roberts (medallion) – a book between them.',
  sfx: [[f('f040'), 'paper', 0.5], [w('f040', 'American'), 'whoosh', 0.5], [w('f041', 'Issachar'), 'tick', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.55, W * 0.5, H * 0.52, () => {
      PL.hallInterior(c, t, { mode: 'home' });
      PL.table(c, 960, 960, 520, 120, '#4A3420');
      A.figure(c, 760, 1000, 360, CH.hongStudent, { face: 1, armF: 60, elbF: 50 });
      fade(c, ramp(t, w('f040', 'American') - 0.3, 0.6), () => A.figure(c, 1180, 1000, 380, CH.roberts, { face: -1, prop: 'book', armF: 60, elbF: 50 }));
    });
    G.dateLine(c, t, { at: f('f040') + 0.1, out: w('f041', 'Issachar'), event: 'Canton', year: 1847, from: 1843, mode: 'light', y: 150 });
    G.medallion(c, t, 'roberts', 1640, 330, 110, w('f041', 'Issachar') - 0.2, S.end + 0.3, {});
  } },
{ id: 'S22', at: 'f042', trans: 'cut', desc: 'They fall out: Hong walks away – UNBAPTISED; then the map, a red route from Hua county west into Guangxi on "mission".',
  sfx: [[w('f042', 'fell'), 'thud', 0.6], [w('f042', 'unbaptised'), 'stamp', 0.7], [w('f043', 'mission'), 'whoosh', 0.7], [w('f043', 'mission'), 'drum', 0.5, 2.5]],
  draw(c, t, lt, S) {
    const m = f('f043');
    if (t < m) {
      cam(c, lt, S, 1.0, 1.06, W / 2, H * 0.55, W * 0.45, H * 0.55, () => {
        PL.hallInterior(c, t, { mode: 'home' }); PL.table(c, 960, 960, 520, 120, '#4A3420');
        A.figure(c, 1180, 1000, 380, CH.roberts, { face: -1, prop: 'book', armF: 30, elbF: 30 });
        const u = ramp(t, w('f042', 'fell'), 2.4, easeIO); A.figure(c, lerp(760, 220, u), 1000, 360, CH.hongStudent, { face: -1, walk: u > 0 && u < 1 ? t * 5 : null });
      });
      G.stamp(c, t, 'UNBAPTISED', w('f042', 'unbaptised') - 0.05, m + 0.1, { x: W / 2, y: 300, size: 120 });
    } else {
      cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.48, H * 0.5, () => {
        PL.chinaMap(c, t, { view: V.south, labels: ['Canton', 'Hua county', 'Thistle Mountain'], hi: 'Thistle Mountain', cartouche: 'Guangdong · Guangxi' });
        G.route(c, V.south, ['Hua county', 'Thistle Mountain'], ramp(t, m, 2.2, easeIO), { w: 8 });
        for (const [nm, la, lo] of [['GUANGXI', 24.3, 109.6], ['GUANGDONG', 24.2, 113.3]]) { const [x, y] = G.proj(V.south, la, lo); G.text(c, nm, x, y, '600 46px Cinzel', 'rgba(42,36,29,0.45)', 'center'); }
      });
      G.slam(c, t, [{ t: 'a mission', small: true }], w('f043', 'mission') - 0.1, S.end + 0.2, { y: H * 0.18, size: 140, mode: 'ink' });
    }
  } },

// ================================================================ CH 3  Thistle Mountain
{ id: 'S23', at: 'f044', trans: 'black', desc: 'Guangxi: the tower-karst hills, mist, charcoal kilns. Script "Guangxi". Feng Yunshan walks in; his medallion.',
  sfx: [[f('f044'), 'wind', 0.6, 8], [w('f044', 'Guangxi'), 'whoosh', 0.5], [w('f045', 'Feng'), 'tick', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.1, W / 2, H / 2, W * 0.5, H * 0.56, () => {
      PL.guangxi(c, t, { dusk: 0.2 });
      const u = ramp(t, f('f045'), 3.4, easeIO); fade(c, ramp(t, f('f045') - 0.3, 0.4), () => A.figure(c, lerp(1500, 1100, u), 1000, 300, CH.feng, { face: -1, walk: u < 1 ? t * 4.5 : null, prop: 'book', armF: 55, elbF: 55 }));
    });
    G.scriptName(c, t, 'Guangxi', w('f044', 'Guangxi') - 0.4, f('f045') + 0.3, { y: H * 0.3, size: 190, mode: 'ink', role: 'south-western China' });
    G.medallion(c, t, 'feng', 1640, 300, 110, w('f045', 'Feng') - 0.2, S.end + 0.3, { role: 'one of Hong\'s first converts' });
  } },
{ id: 'S24', at: 'f046', trans: 'cut', desc: 'Feng preaches by Thistle Mountain; the small congregation turns red one by one: "the God Worshipping Society".',
  sfx: [[f('f046'), 'murmur', 0.5, 5], [w('f046', 'Thistle'), 'tick', 0.5], [w('f046', 'God'), 'chant', 0.5, 4]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.04, 1.12, W / 2, H * 0.55, W * 0.56, H * 0.58, () => {
      PL.guangxi(c, t, { dusk: 0.3, village: true });
      A.figure(c, 640, 990, 320, CH.feng, { face: 1, prop: 'book', armF: lerp(50, 120, (Math.sin(t * 1.5) + 1) / 2), elbF: 40 });
      A.crowd(c, { x0: 820, x1: 1820, y: 990, n: 30, hMin: 140, hMax: 220, depth: 40, seed: 46, t, red: ramp(t, w('f046', 'God') - 0.6, 3), face: -1, tools: false, agit: 0.4 });
    });
    G.scriptName(c, t, 'Thistle Mountain', w('f046', 'Thistle') - 0.2, w('f046', 'God') - 0.1, { y: H * 0.26, size: 140, mode: 'ink' });
    G.slam(c, t, [{ t: 'the', small: true }, { t: 'GOD WORSHIPPING' }, { t: 'SOCIETY', red: true }], w('f046', 'God') - 0.05, S.end + 0.2, { y: H * 0.3, size: 110, mode: 'ink' });
  } },
{ id: 'S25', at: 'f047', trans: 'whip', desc: 'Who joined: charcoal burners, a farmer, a Hakka woman step forward. POOR · HAKKA, outsiders in their province.',
  sfx: [[f('f047'), 'whoosh', 0.4], [w('f047', 'poor'), 'tick', 0.5], [w('f047', 'Hakka'), 'impact', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H * 0.6, W / 2, H * 0.6, () => {
      PL.guangxi(c, t, { dusk: 0.35, kilns: true });
      [['burner', 'axe'], ['villager', 'spade'], ['burner', null], ['hakkaWoman', null], ['villager', 'spear']].forEach(([k, p], i) => fade(c, ramp(t, f('f047') + i * 0.5, 0.4), () => A.figure(c, 380 + i * 290, 1010, 300, CH[k], { face: i < 2 ? 1 : -1, prop: p, armF: 20, elbF: 20 })));
    });
    G.slam(c, t, [{ t: 'POOR' }], w('f047', 'poor'), w('f047', 'Hakka') - 0.1, { y: H * 0.22, size: 140 });
    G.slam(c, t, [{ t: 'HAKKA', red: true }, { t: 'outsiders in their province', small: true }], w('f047', 'Hakka'), S.end + 0.2, { y: H * 0.24, size: 140 });
  } },
{ id: 'S26', at: 'f048', trans: 'cut', desc: 'The map darkens ("coming apart"); British warships off Canton; date-line First Opium War 1842.',
  sfx: [[f('f048'), 'thunder', 0.5], [w('f049', 'Britain'), 'boom', 0.7], [w('f049', 'Opium'), 'boom', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.55, H * 0.62, () => {
      PL.chinaMap(c, t, { labels: ['Canton', 'Hong Kong', 'Nanjing'] });
      const sh = ramp(t, w('f049', 'Britain') - 0.4, 0.8); if (sh > 0) { const [x, y] = G.proj(V.cn, 22.0, 114.6); fade(c, sh, () => { A.warship(c, x + 70, y + 40, 22, t); A.warship(c, x + 210, y + 10, 18, t + 1); A.warship(c, x + 330, y - 40, 16, t + 2); }); }
    });
    tint(c, '#5A4A3A', 0.5 * ramp(t, f('f048'), 1.2));
    G.dateLine(c, t, { at: w('f049', 'Britain') - 0.2, out: S.end, event: 'The First Opium War', day: 'ends', year: 1842, from: 1839, mode: 'ink', y: 160 });
  } },
{ id: 'S27', at: 'f050', trans: 'cut', desc: 'Opium crates flow in, silver flows out; BANDITS · PIRATES · HUNGER.',
  sfx: [[w('f050', 'Opium'), 'whoosh', 0.6], [w('f050', 'Silver'), 'coins', 0.7], [w('f051', 'Bandits'), 'impact', 0.5], [w('f051', 'pirates'), 'impact', 0.5], [w('f051', 'hunger'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    parchment(c, t);
    const u1 = ramp(t, w('f050', 'Opium') - 0.2, 1.4, easeIO), u2 = ramp(t, w('f050', 'Silver') - 0.2, 1.4, easeIO);
    G.text(c, 'opium in', 320, 300, 'italic 400 64px BodoniItalic', P.ink, 'center', u1);
    for (let i = 0; i < 6; i++) { const x = lerp(-200, 900, clamp(u1 * 1.4 - i * 0.07)) - i * 90; c.fillStyle = '#5A3E26'; c.fillRect(x, 360, 70, 52); c.strokeStyle = '#2A1E14'; c.lineWidth = 3; c.strokeRect(x, 360, 70, 52); }
    G.text(c, 'silver out', 1600, 520, 'italic 400 64px BodoniItalic', P.ink, 'center', u2);
    for (let i = 0; i < 8; i++) { const x = lerp(1100, 2200, clamp(u2 * 1.3 - i * 0.05)) + i * 60; c.fillStyle = '#C9C6BC'; c.beginPath(); c.ellipse(x, 590, 34, 16, 0, 0, TAU); c.fill(); c.fillStyle = '#9C9A92'; c.beginPath(); c.ellipse(x, 584, 16, 9, 0, 0, TAU); c.fill(); }
    [['BANDITS', 'Bandits'], ['PIRATES', 'pirates'], ['HUNGER', 'hunger']].forEach(([s, wd], i) => G.slam(c, t, [{ t: s, red: i === 2 }], w('f051', wd) - 0.05, S.end + 0.2, { x: 420 + i * 540, y: 860, size: 110, mode: 'ink' }));
  } },
{ id: 'S28', at: 'f052', trans: 'whip', desc: 'The Thistle Mountain camp: the God Worshippers raise spears; coins drop into a common treasury chest.',
  sfx: [[w('f052', 'armed'), 'clang', 0.6], [f('f052'), 'camp', 0.6, 6], [w('f053', 'pooled'), 'coins', 0.8], [w('f053', 'treasury'), 'thud', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.6, W * 0.52, H * 0.62, () => {
      PL.guangxi(c, t, { dusk: 0.45, camp: 1 });
      A.crowd(c, { x0: -100, x1: 1300, y: 1000, n: 50, hMin: 140, hMax: 230, depth: 60, seed: 52, t, red: 1, raise: ramp(t, w('f052', 'armed') - 0.3, 0.6), agit: 1 });
      PL.chest(c, 1560, 1010, 110, ramp(t, f('f053') - 0.3, 0.5), t);
      for (let i = 0; i < 10; i++) { const tt = t - w('f053', 'pooled') - i * 0.12; if (tt > 0 && tt < 0.8) G.groat(c, 1560 + (i % 3 - 1) * 30, lerp(700, 900, tt / 0.8), 16); }
    });
    G.scriptName(c, t, 'a common treasury', w('f053', 'common') - 0.3, S.end + 0.3, { x: 1560, y: H * 0.3, size: 110, mode: 'ink' });
  } },
{ id: 'S29', at: 'f054', trans: 'cut', desc: 'Map of Guangxi: tokens gather at Jintian; date-line late 1850.',
  sfx: [[f('f054'), 'tick', 0.5], [w('f054', 'thousands'), 'drum', 0.6, 3], [w('f054', 'Jintian'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.1, W / 2, H / 2, W * 0.46, H * 0.48, () => {
      PL.chinaMap(c, t, { view: V.gx, labels: ['Jintian', 'Thistle Mountain'], hi: 'Jintian', cartouche: 'Guangxi · 1850' });
      const [jx, jy] = G.proj(V.gx, ...G.PLACES.Jintian);
      for (let i = 0; i < 18; i++) { const r = rng(i + 3), a = r() * TAU, d = 300 + r() * 300, u = ramp(t, f('f054') + i * 0.15, 1.6, easeIO); G.token(c, lerp(jx + Math.cos(a) * d, jx + Math.cos(a) * 30 * r(), u), lerp(jy + Math.sin(a) * d * 0.7, jy + Math.sin(a) * 30 * r(), u), 16, P.red, 1); }
    });
    G.dateLine(c, t, { at: f('f054') + 0.2, out: S.end, event: 'Jintian', day: 'late', year: 1850, from: 1846, mode: 'ink', y: 160 });
  } },
{ id: 'S30', at: 'f055', trans: 'cut', desc: 'Qing soldiers (blue, conical hats) march in from the right; the red God Worshippers surge; the blue line breaks. BEATEN.',
  sfx: [[f('f055'), 'march', 0.6, 2.5], [w('f055', 'beaten') - 0.7, 'roar', 0.8], [w('f055', 'beaten'), 'impact', 0.9]],
  draw(c, t, lt, S) {
    const hit = w('f055', 'beaten') - 0.6, k = ramp(t, hit, 1.2, easeIO), inn = ramp(t, f('f055'), 1.5, easeOut);
    cam(c, lt, S, 1.04, 1.12, W / 2, H * 0.6, W * 0.55, H * 0.62, () => {
      PL.guangxi(c, t, { dusk: 0.5 });
      A.crowd(c, { x0: 1150 + (1 - inn) * 500 + k * 500, x1: 2100 + (1 - inn) * 500 + k * 600, y: 990, n: 45, hMin: 130, hMax: 210, depth: 60, seed: 55, t, color: P.blue, far: '#5A6A7A', hat: 'cone', face: k > 0.2 ? 1 : -1, agit: 1 + k });
      A.crowd(c, { x0: -200 + k * 400, x1: 1000 + k * 500, y: 1000, n: 55, hMin: 140, hMax: 220, depth: 60, seed: 56, t, red: 1, raise: ramp(t, hit - 0.4, 0.4), face: 1, agit: 1.4 });
    });
    G.slam(c, t, [{ t: 'BEATEN', red: true }], w('f055', 'beaten'), S.end + 0.2, { y: H * 0.26, size: 170 });
  } },

// ================================================================ CH 4  The Heavenly Kingdom
{ id: 'S31', at: 'f056', trans: 'black', desc: 'Jintian at dawn: red banners rise over the camp; date-line 11 January 1851; the Heavenly Calendar appears, tile one.',
  sfx: [[f('f056'), 'camp', 0.6, 7], [w('f056', 'eleventh'), 'tick', 0.5], [w('f057', 'declared'), 'gong', 0.8], [w('f057', 'declared'), 'cheer', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.6, W * 0.5, H * 0.55, () => {
      PL.guangxi(c, t, { dusk: lerp(0.7, 0.2, ramp(t, f('f056'), 6)), camp: 1, village: true });
      A.crowd(c, { x0: -100, x1: 2020, y: 1010, n: 80, hMin: 120, hMax: 200, depth: 70, seed: 57, t, red: 1, hair: true, raise: ramp(t, w('f057', 'declared'), 0.8), agit: 1.2 });
    });
    G.dateLine(c, t, { at: f('f056') + 0.1, out: w('f057', 'declared') + 0.6, event: 'Jintian, Hong\'s birthday', day: '11 January', year: 1851, from: 1846, mode: 'light', y: 150 });
    G.calendar(c, t, w('f057', 'declared') - 0.2, S.end + 0.3, 0, 1, { y: 120, light: true });
  } },
{ id: 'S32', at: 'f058', trans: 'cut', desc: 'TAIPING TIANGUO: the Heavenly King\'s seal thumps; "the Heavenly Kingdom of Great Peace"; the student medallion turns into the Heavenly King.',
  sfx: [[w('f058', 'Taiping'), 'seal', 1.0], [w('f058', 'Heavenly'), 'gong', 0.6], [w('f059', 'Heavenly') - 0.1, 'whoosh', 0.6], [w('f059', 'King'), 'bell', 0.6]],
  draw(c, t, lt, S) {
    parchment(c, t); tint(c, P.red, 0.08);
    const sa = ramp(t, w('f058', 'Taiping') - 0.05, 0.25); if (sa > 0) { c.save(); c.translate(500, 470); const ss = 1 + (1 - sa) * 1.4; c.scale(ss, ss); c.globalAlpha *= sa; G.heavenlySeal(c, 0, 0, 170); c.restore(); }
    G.slam(c, t, [{ t: 'TAIPING' }, { t: 'TIANGUO', red: true }], w('f058', 'Taiping'), S.end + 0.2, { x: 1250, y: 380, size: 140, mode: 'ink' });
    G.text(c, 'the Heavenly Kingdom of Great Peace', 1250, 600, 'italic 400 50px BodoniItalic', P.ink, 'center', ramp(t, w('f058', 'Heavenly') - 0.1, 0.4));
    const sw = ramp(t, w('f059', 'Heavenly') - 0.2, 0.5);
    fade(c, 1 - sw, () => G.medallion(c, t, 'hongStudent', 1250, 820, 110, f('f058'), S.end + 0.3, { noPlaque: true }));
    fade(c, sw, () => G.medallion(c, t, 'hong', 1250, 820, 110, f('f058'), S.end + 0.3, {}));
  } },
{ id: 'S33', at: 'f060', trans: 'whip', desc: 'A villager with the Manchu braid becomes a long-haired Taiping soldier (braid falls, red head-wrap); "the long-haired rebels".',
  sfx: [[w('f060', 'cut'), 'snap', 0.8], [w('f060', 'grew'), 'whoosh', 0.4], [w('f061', 'long'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    const cut = ramp(t, w('f060', 'cut'), 0.5);
    cam(c, lt, S, 1.1, 1.18, W * 0.4, H * 0.55, W * 0.42, H * 0.52, () => {
      PL.guangxi(c, t, { dusk: 0.3, camp: 1 });
      fade(c, 1 - cut, () => A.figure(c, 760, 1020, 520, CH.villager, { face: 1, armF: 40, elbF: 60 }));
      fade(c, cut, () => A.figure(c, 760, 1020, 520, CH.tpSoldier, { face: 1, prop: 'spear', armF: 20, elbF: 20 }));
      if (cut > 0 && cut < 1) { c.strokeStyle = '#1A1612'; c.lineWidth = 10; c.beginPath(); c.moveTo(700, lerp(660, 1000, cut)); c.lineTo(690, lerp(800, 1020, cut)); c.stroke(); }
      A.crowd(c, { x0: 1000, x1: 2000, y: 1000, n: 30, hMin: 160, hMax: 240, depth: 40, seed: 60, t, red: ramp(t, w('f060', 'grew'), 1), hair: true, face: -1, tools: true });
    });
    G.slam(c, t, [{ t: 'the', small: true }, { t: 'LONG-HAIRED' }, { t: 'REBELS', red: true }], w('f061', 'long') - 0.05, S.end + 0.2, { x: 1400, y: H * 0.28, size: 110 });
  } },
{ id: 'S34', at: 'f062', trans: 'cut', desc: 'The five kings: medallions land one by one on "East", "West", "South", "North" and "Wing" beneath Hong.',
  sfx: [[w('f062', 'East'), 'impact', 0.5], [w('f062', 'West'), 'impact', 0.5], [w('f062', 'South'), 'impact', 0.5], [w('f062', 'North'), 'impact', 0.5], [w('f063', 'Wing'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    parchment(c, t);
    G.medallion(c, t, 'hong', W / 2, 330, 120, f('f062') - 0.1, S.end + 0.3, { role: 'the Heavenly King' });
    const K = [['yang', 'East', 'f062'], ['xiao', 'West', 'f062'], ['feng', 'South', 'f062'], ['wei', 'North', 'f062'], ['shi', 'Wing', 'f063']];
    c.save(); c.strokeStyle = 'rgba(42,36,29,0.4)'; c.lineWidth = 3; K.forEach(([k, wd, fid], i) => { const a = ramp(t, w(fid, wd), 0.4); if (a <= 0) return; c.globalAlpha = a; c.beginPath(); c.moveTo(W / 2, 470); c.lineTo(260 + i * 350, 630); c.stroke(); }); c.restore();
    K.forEach(([k, wd, fid], i) => G.medallion(c, t, k, 260 + i * 350, 740, 95, w(fid, wd) - 0.1, S.end + 0.3, {}));
  } },
{ id: 'S35', at: 'f064', trans: 'ink', desc: 'Yang Xiuqing by a charcoal kiln, crowned East King (medallion); then "its own calendar" – the Heavenly Calendar fills the frame, 1851 stamped.',
  sfx: [[w('f064', 'East'), 'whoosh', 0.5], [w('f064', 'charcoal'), 'fire', 0.4, 3], [w('f065', 'calendar') - 0.2, 'seal', 0.8]],
  draw(c, t, lt, S) {
    const cal = f('f065');
    if (t < cal - 0.1) {
      cam(c, lt, S, 1.0, 1.1, W / 2, H * 0.55, W * 0.45, H * 0.55, () => {
        PL.guangxi(c, t, { dusk: 0.5 });
        A.kiln(c, 1100, 1000, 220, t, 64);
        A.figure(c, 720, 1020, 460, CH.yang, { face: 1, armF: 30, elbF: 40 });
      });
      G.medallion(c, t, 'yang', 1580, 300, 120, w('f064', 'East') - 0.1, cal, { role: 'the East King' });
      G.text(c, 'a former charcoal burner', 1580, 540, 'italic 400 40px BodoniItalic', '#F2E8D2', 'center', ramp(t, w('f064', 'charcoal') - 0.1, 0.4), 'rgba(0,0,0,0.6)');
    } else {
      parchment(c, t);
      G.calendar(c, t, cal - 0.1, S.end + 0.3, 1, 1.4, { x: 140, y: 470, size: 96, caption: 'Their own calendar' });
    }
  } },
{ id: 'S36', at: 'f066', trans: 'whip', desc: 'The march north on the map: Jintian → Yongan → Guilin → Changsha; 1852 – Feng and Xiao\'s medallions grey with red slashes.',
  sfx: [[f('f066'), 'drum', 0.7, 6], [w('f067', 'fell'), 'thud', 0.8], [w('f067', 'fell') + 0.3, 'thud', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.46, H * 0.55, () => {
      PL.chinaMap(c, t, { labels: ['Jintian', 'Guilin', 'Changsha', 'Wuchang'], hi: 'Changsha' });
      G.route(c, V.cn, ['Jintian', 'Yongan', 'Guilin', 'Changsha'], ramp(t, f('f066'), 4, easeIO), { w: 8 });
    });
    const fell = w('f067', 'fell');
    G.medallion(c, t, 'feng', 1380, 760, 95, w('f067', 'two') - 0.1, S.end + 0.3, { grey: ramp(t, fell, 0.3), slash: ramp(t, fell, 0.25), role: 'killed 1852' });
    G.medallion(c, t, 'xiao', 1680, 760, 95, w('f067', 'two') - 0.1, S.end + 0.3, { grey: ramp(t, fell + 0.3, 0.3), slash: ramp(t, fell + 0.3, 0.25), role: 'killed 1852' });
    G.calendar(c, t, f('f067') - 0.2, S.end + 0.3, 1, 2, { x: 140, y: 110 });
  } },
{ id: 'S37', at: 'f068', trans: 'cut', desc: 'The army swells: a red column fills the frame and keeps growing.',
  sfx: [[f('f068'), 'march', 0.8, 4], [w('f068', 'swelling'), 'roar', 0.6]],
  draw(c, t, lt, S) {
    const g = ramp(t, f('f068'), 3.6);
    cam(c, lt, S, 1.0, 1.1, W / 2, H * 0.6, W * 0.55, H * 0.62, () => {
      PL.guangxi(c, t, { dusk: 0.15, kilns: false });
      A.crowd(c, { x0: -200, x1: 2100, y: 1000, n: Math.round(lerp(40, 130, g)), hMin: 90, hMax: 210, depth: 90, seed: 68, t, red: 1, hair: true, face: 1, agit: 1.2, raise: 0.3 });
    });
  } },
{ id: 'S38', at: 'f069', trans: 'cut', desc: 'The Yangtze: Wuchang on the far bank; the fleet sails in; the city burns. Date-line January 1853.',
  sfx: [[f('f069'), 'water', 0.6, 5], [w('f069', 'Wuchang'), 'boom', 0.7], [w('f069', 'took'), 'roar', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.5, H * 0.52, () => PL.yangtze(c, t, { fleet: 10, fleetX: (t - f('f069')) * 60, fire: ramp(t, w('f069', 'Wuchang') - 0.2, 1.4) * 0.8, dusk: 0.3 }));
    G.dateLine(c, t, { at: f('f069') + 0.1, out: S.end, event: 'Wuchang, on the Yangtze', day: 'January', year: 1853, from: 1849, mode: 'light', y: 150 });
  } },
{ id: 'S39', at: 'f070', trans: 'cut', desc: 'The river fills with junks under red flags; 500,000 on the move, by some estimates.',
  sfx: [[f('f070'), 'oars', 0.6, 4], [w('f070', 'half'), 'impact', 0.7]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.05, 1.0, W / 2, H * 0.6, W / 2, H * 0.5, () => PL.yangtze(c, t, { fleet: 34, fleetX: (t - f('f070')) * 70, city: false, dusk: 0.4 }));
    G.counter(c, t, 0, 500000, w('f070', 'half') - 0.2, 1.2, W / 2, H * 0.3, { size: 140, label: 'on the move · by some estimates' });
  } },
];
