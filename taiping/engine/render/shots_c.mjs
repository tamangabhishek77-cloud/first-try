// Shots: chapters 9–12 (Taiping episode).
import { W, H, P, T, clamp, lerp, easeIO, easeOut, easeIn, backOut, ramp, life, rng, mixColor, rgba, parchment, withCam, push } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';
import * as PL from './plates.mjs';
import { dim, panel, tint, cam, fade, V, tok, hash } from './shots_a.mjs';
import { wallFlags } from './shots_b.mjs';
const { CH } = A; const f = T.f, e = T.e, w = T.w;
const TAU = Math.PI * 2;
const blueFlagsOnCity = (c, t, a) => fade(c, a, () => { for (let i = 0; i < 6; i++) { const x = 480 + i * 190; c.strokeStyle = P.ink2; c.lineWidth = 4; c.beginPath(); c.moveTo(x, 552); c.lineTo(x, 480); c.stroke(); const wv = Math.sin(t * 3 + i) * 5; c.fillStyle = P.blue; c.beginPath(); c.moveTo(x, 480); c.lineTo(x + 50, 486 + wv); c.lineTo(x + 48, 512 + wv); c.lineTo(x, 508); c.fill(); } });
const weeds = (c, g, seed = 7) => { if (g <= 0) return; c.save(); c.strokeStyle = '#3E4A2A'; c.lineWidth = 4; const r = rng(seed); for (let i = 0; i < 90; i++) { const x = r() * W, h = (30 + r() * 60) * g; c.beginPath(); c.moveTo(x, 1080); c.quadraticCurveTo(x + 10, 1080 - h * 0.6, x + (r() - 0.5) * 30, 1080 - h); c.stroke(); } c.restore(); };

export const SHOTS_C = [
// ================================================================ CH 9  The West chooses
{ id: 'S81', at: 'f132', trans: 'black', desc: 'Map of the north: blue British and French tokens land near Tianjin and push towards Beijing.',
  sfx: [[f('f132'), 'drum', 0.6, 4], [w('f132', 'war'), 'boom', 0.7]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.52, H * 0.5, () => {
      PL.chinaMap(c, t, { view: { lon: 117.2, lat: 39.4, span: 6.5 }, labels: ['Beijing', 'Tianjin', 'Nanjing'], hi: 'Beijing', cartouche: 'The Second Opium War · 1860' });
      G.route(c, { lon: 117.2, lat: 39.4, span: 6.5 }, [[38.9, 118.4], 'Tianjin', 'Beijing'], ramp(t, f('f132') + 0.3, 2.6, easeIO), { w: 8, color: P.blue });
      for (let i = 0; i < 4; i++) { const [x, y] = G.proj({ lon: 117.2, lat: 39.4, span: 6.5 }, 38.7 + i * 0.12, 118.7 + i * 0.3); A.warship(c, x, y, 18, t + i); }
    });
    G.slam(c, t, [{ t: 'Britain and France', small: true }, { t: 'AT WAR WITH THE QING', red: true }], w('f132', 'war') - 0.1, S.end + 0.2, { y: H * 0.82, size: 80, mode: 'ink' });
  } },
{ id: 'S82', at: 'f133', trans: 'cut', dark: true, desc: 'The Summer Palace: pavilions on the lake catch fire on "burned"; smoke over Beijing. Date-line October 1860.',
  sfx: [[w('f133', 'looted'), 'smash', 0.6], [w('f133', 'burned'), 'fire', 0.9, 4.5], [w('f133', 'burned'), 'boom', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.1, W / 2, H * 0.5, W / 2, H * 0.45, () => PL.summerPalace(c, t, { fire: ramp(t, w('f133', 'burned') - 0.3, 1.8, easeIO) }));
    G.dateLine(c, t, { at: f('f133') + 0.1, out: S.end, event: 'The Summer Palace, Beijing', day: 'October', year: 1860, from: 1856, mode: 'light', y: 150 });
  } },
{ id: 'S83', at: 'f134', trans: 'cut', desc: 'A treaty on parchment takes two seals – "on their own terms".',
  sfx: [[w('f134', 'peace'), 'seal', 0.8], [w('f134', 'terms'), 'seal', 0.7]],
  draw(c, t, lt, S) {
    parchment(c, t);
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W / 2, H * 0.5, () => {
      G.documentSheet(c, t, W / 2, 560, 640, 780, { title: 'Convention of Peking', titleSize: 34, written: 1, seed: 31, seal: true, sealText: 'Q', sealAt: ramp(t, w('f134', 'peace'), 0.3) });
      fade(c, ramp(t, w('f134', 'terms') - 0.05, 0.25), () => { c.save(); c.translate(W / 2 - 180, 860); c.fillStyle = P.blue; c.beginPath(); for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, rr = 42 + (i % 2 ? 4 : -2); c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); });
    });
    G.text(c, '1860', W / 2 + 420, 300, '600 64px Bodoni', P.ink2, 'center', ramp(t, f('f134'), 0.4));
  } },
{ id: 'S84', at: 'f135', trans: 'whip', desc: 'The emperor\'s medallion between two foreign medallions: KEEP THE QING ALIVE – "paid its debts · honoured its treaties".',
  sfx: [[w('f135', 'keep'), 'impact', 0.7], [w('f136', 'debts'), 'coins', 0.6], [w('f136', 'treaties'), 'seal', 0.6]],
  draw(c, t, lt, S) {
    parchment(c, t);
    G.medallion(c, t, 'emperor', W / 2, 360, 140, f('f135') - 0.1, S.end + 0.3, {});
    G.medallion(c, t, 'foreignSoldier', W / 2 - 420, 400, 95, f('f135') + 0.3, S.end + 0.3, { name: 'Britain', role: '' });
    G.medallion(c, t, 'foreignSoldier', W / 2 + 420, 400, 95, f('f135') + 0.5, S.end + 0.3, { name: 'France', role: '' });
    G.slam(c, t, [{ t: 'KEEP THE QING ALIVE', red: true }], w('f135', 'keep') - 0.05, f('f136'), { y: 760, size: 100, mode: 'ink' });
    G.listPanel(c, t, ['it paid its debts', 'it honoured its treaties'], [w('f136', 'debts') - 0.3, w('f136', 'treaties') - 0.3], f('f136') - 0.2, S.end + 0.3, { x: W / 2 - 380, y: 660, w: 760, size: 50 });
  } },
{ id: 'S85', at: 'f137', trans: 'cut', desc: 'A drill ground: a foreign officer drills a line of Qing soldiers with modern rifles; the rifles snap to the shoulder.',
  sfx: [[f('f137'), 'march', 0.7, 4], [w('f137', 'rifles'), 'volley', 0.6]],
  draw(c, t, lt, S) {
    const k = Math.floor((t - f('f137')) * 1.2) % 2;
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.6, W * 0.55, H * 0.6, () => {
      PL.field(c, t, { seed: 33, c1: '#A8946E', c2: '#8E7A56', g0: '#8E7A52', g1: '#5E4A32' });
      for (let i = 0; i < 8; i++) A.figure(c, 640 + i * 150, 1000, 300, CH.qingSoldier, { face: -1, prop: 'rifle', armF: k ? 160 : 30, elbF: k ? -150 : 10, propAng: k ? -10 : 0 });
      A.figure(c, 320, 1000, 340, CH.foreignSoldier, { face: 1, prop: 'cane', armF: 60 + 30 * Math.sin(t * 3), elbF: 30 });
    });
    G.slam(c, t, [{ t: 'MODERN RIFLES' }], w('f137', 'modern') - 0.05, S.end + 0.2, { y: H * 0.22, size: 120 });
  } },
{ id: 'S86', at: 'f138', trans: 'cut', desc: 'Frederick Townsend Ward (slouch hat) before his Ever Victorious Army; his medallion greys on "killed" (1862). Calendar 1862.',
  sfx: [[w('f138', 'American'), 'whoosh', 0.5], [w('f138', 'Ever'), 'march', 0.6, 3], [w('f139', 'killed'), 'thud', 0.9]],
  draw(c, t, lt, S) {
    const kd = w('f139', 'killed');
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.6, W * 0.45, H * 0.6, () => {
      PL.field(c, t, { seed: 34, c1: '#A8946E', c2: '#8E7A56', g0: '#8E7A52', g1: '#5E4A32', dusk: 0.3 });
      for (let i = 0; i < 8; i++) A.figure(c, 900 + i * 130, 1000 - (i % 2) * 20, 260, CH.qingSoldier, { face: -1, prop: 'rifle' });
      fade(c, 1 - ramp(t, kd + 0.2, 1.0), () => A.figure(c, 560, 1010, 380, CH.ward, { face: 1, prop: 'sword', armF: 40, elbF: 20 }));
    });
    G.scriptName(c, t, 'the Ever Victorious Army', w('f138', 'Ever') - 0.3, kd - 0.2, { y: H * 0.24, size: 120 });
    G.medallion(c, t, 'ward', 1600, 320, 110, w('f138', 'Frederick') - 0.2, S.end + 0.3, { grey: ramp(t, kd, 0.3), slash: ramp(t, kd, 0.25), role: 'killed 1862' });
    G.calendar(c, t, f('f139') - 0.2, S.end + 0.3, 11, 12, { x: 140, y: 930, crack: 1, light: true });
  } },
{ id: 'S87', at: 'f140', trans: 'cut', desc: 'Charles Gordon, cane in hand, takes command (medallion).',
  sfx: [[w('f140', 'Charles'), 'whoosh', 0.5], [w('f140', 'over'), 'impact', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.06, 1.0, W * 0.45, H * 0.55, W / 2, H * 0.55, () => {
      PL.field(c, t, { seed: 34, c1: '#A8946E', c2: '#8E7A56', g0: '#8E7A52', g1: '#5E4A32', dusk: 0.3 });
      for (let i = 0; i < 8; i++) A.figure(c, 900 + i * 130, 1000 - (i % 2) * 20, 260, CH.qingSoldier, { face: -1, prop: 'rifle' });
      A.figure(c, 560, 1010, 380, CH.gordon, { face: 1, prop: 'cane', armF: 25, elbF: 10 });
    });
    G.medallion(c, t, 'gordon', 1600, 320, 110, w('f140', 'Charles') - 0.2, S.end + 0.3, { role: 'British officer · 1863' });
  } },
{ id: 'S88', at: 'f141', trans: 'whip', desc: 'Up the Yangtze: Hunan Army boats under blue flags; Anqing on the far bank; blue flags rise on its walls. Date-line 5 September 1861.',
  sfx: [[f('f141'), 'oars', 0.6, 4], [w('f142', 'Anqing'), 'boom', 0.8], [w('f142', 'took'), 'roar', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.5, H * 0.5, () => {
      PL.yangtze(c, t, { dusk: 0.35, fire: ramp(t, w('f142', 'took') - 0.3, 1.0) * 0.4 });
      blueFlagsOnCity(c, t, ramp(t, w('f142', 'Anqing'), 0.8));
      for (let i = 0; i < 7; i++) { const x = ((i * 300 + (t - f('f141')) * 90) % 2300) - 200; A.junk(c, x, 760 + (i % 3) * 80, 30 + (i % 3) * 10, t, '#2A2E34', '#5A6A7A', P.blue); }
    });
    G.dateLine(c, t, { at: f('f142') + 0.1, out: S.end, event: 'Anqing', day: '5 September', year: 1861, from: 1857, mode: 'light', y: 150 });
    G.calendar(c, t, f('f142') + 0.3, S.end + 0.3, 10, 11, { x: 1060, y: 930, crack: 1, light: true });
  } },
{ id: 'S89', at: 'f143', trans: 'cut', desc: 'Map: the river road from Anqing down to Nanjing lights up blue.',
  sfx: [[f('f143'), 'whoosh', 0.5], [w('f143', 'Nanjing'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    const v = { lon: 117.9, lat: 31.1, span: 5.5 };
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.55, H * 0.45, () => {
      PL.chinaMap(c, t, { view: v, labels: ['Anqing', 'Nanjing'], hi: 'Nanjing', cartouche: 'The river road · 1861' });
      G.route(c, v, ['Anqing', [30.75, 117.6], [31.3, 118.3], [31.7, 118.5], 'Nanjing'], ramp(t, f('f143'), 2.6, easeIO), { w: 12, color: P.blue });
      tok(c, v, 'Anqing', P.blue, 1, null, 30);
    });
  } },
{ id: 'S90', at: 'f144', trans: 'cut', dark: true, desc: 'Anqing in crimson after the siege: smoke, grey silhouettes. "By most accounts" – no gore.',
  sfx: [[f('f144'), 'fire', 0.5, 4], [w('f144', 'massacred'), 'thud', 0.8]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H * 0.55, W / 2, H * 0.6, () => {
      PL.yangtze(c, t, { fire: 0.7, dusk: 0.5, night: 0.4 }); blueFlagsOnCity(c, t, 1);
      PL.ground(c, 960, '#4A3A2A', '#2A2018');
      A.crowd(c, { x0: -100, x1: 2020, y: 1050, n: 60, hMin: 110, hMax: 190, depth: 30, seed: 144, t, color: mixColor('#5E5242', '#2A2622', ramp(t, w('f144', 'defenders'), 2)), far: '#2A2622', tools: false, agit: 0.1 });
    });
    tint(c, '#7A1C14', 0.45);
    G.text(c, 'by most accounts, after a long siege', W / 2, 260, 'italic 400 48px BodoniItalic', '#F2E8D2', 'center', ramp(t, f('f144'), 0.4), 'rgba(0,0,0,0.6)');
    G.slam(c, t, [{ t: 'MASSACRED', red: true }], w('f144', 'massacred') - 0.05, S.end + 0.2, { y: H * 0.42, size: 140 });
  } },
{ id: 'S91', at: 'f145', trans: 'cut', desc: 'Map: a blue arrow runs down the river from Anqing to Nanjing; Zeng Guoquan\'s medallion. Spring 1862.',
  sfx: [[f('f145'), 'drum', 0.6, 3], [w('f146', 'Zeng'), 'whoosh', 0.5]],
  draw(c, t, lt, S) {
    const v = { lon: 117.9, lat: 31.1, span: 5.5 };
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.6, H * 0.42, () => {
      PL.chinaMap(c, t, { view: v, labels: ['Anqing', 'Nanjing'], hi: 'Nanjing', cartouche: 'Spring 1862' });
      G.route(c, v, ['Anqing', [30.75, 117.6], [31.3, 118.3], [31.7, 118.5], 'Nanjing'], 1, { w: 12, color: P.blue, arrow: false });
      const u = ramp(t, f('f145') + 0.3, 2.4, easeIO); const p = [lerp(30.53, 32.0, u), lerp(117.05, 118.7, u)]; tok(c, v, p, P.blue, 1, null, 34);
    });
    G.medallion(c, t, 'zengQ', 400, 330, 110, w('f146', 'Zeng') - 0.2, S.end + 0.3, { role: 'Zeng Guofan\'s younger brother' });
    G.calendar(c, t, f('f145'), S.end + 0.3, 11, 12, { x: 140, y: 930, crack: 1 });
  } },
{ id: 'S92', at: 'f147', trans: 'cut', desc: 'Nanjing (callback plate): the siege lines dig in outside the walls; Zeng Guoquan with a lantern in the foreground.',
  sfx: [[f('f147'), 'march', 0.5, 3], [w('f147', 'dug'), 'thud', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.55, W * 0.45, H * 0.6, () => {
      PL.nanjing(c, t, { dusk: 0.75, siege: ramp(t, w('f147', 'dug') - 0.3, 1.4) }); wallFlags(c, t);
      A.figure(c, 300, 1060, 420, CH.zengQ, { face: 1, prop: 'lantern', armF: 50, elbF: 30 });
    });
  } },

// ================================================================ CH 10  Manna
{ id: 'S93', at: 'f148', trans: 'black', dark: true, desc: 'Nanjing under siege at dusk (same plate as the cold open). TWO YEARS. Calendar 1863.',
  sfx: [[f('f148'), 'wind', 0.6, 3], [w('f148', 'two'), 'drum', 0.6, 2]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.42, H * 0.5, () => { PL.nanjing(c, t, { dusk: 0.85, siege: 1 }); wallFlags(c, t); });
    G.slam(c, t, [{ t: 'TWO YEARS' }], w('f148', 'two') - 0.05, S.end + 0.2, { y: H * 0.28, size: 150 });
    G.calendar(c, t, f('f148'), S.end + 0.3, 12, 13, { x: 1060, y: 930, crack: 1, light: true });
  } },
{ id: 'S94', at: 'f149', trans: 'cut', dark: true, desc: 'The throne hall: Li kneels before Hong and begs him to break out; Hong raises a hand and refuses – "God, he said, would protect it".',
  sfx: [[w('f149', 'begged'), 'thud', 0.5], [w('f150', 'refused'), 'impact', 0.7], [w('f150', 'God'), 'bell', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.55, W * 0.52, H * 0.55, () => {
      PL.hallInterior(c, t, { mode: 'throne', dark: 0.35 });
      A.figure(c, 960, 760, 330, CH.hong, { face: 1, seated: true, armF: lerp(20, 140, ramp(t, w('f150', 'refused') - 0.2, 0.4)), elbF: 0 });
      A.figure(c, 1360, 1010, 380, CH.li, { face: -1, kneel: ramp(t, w('f149', 'begged') - 0.3, 0.6), armF: 70, elbF: 30 });
    });
    G.slam(c, t, [{ t: 'REFUSED', red: true }], w('f150', 'refused') - 0.05, w('f150', 'God') - 0.1, { y: H * 0.22, size: 140 });
    G.slam(c, t, [{ t: 'God, he said, would protect it', small: true }], w('f150', 'God') - 0.1, S.end + 0.2, { y: H * 0.22, size: 120 });
  } },
{ id: 'S95', at: 'f151', trans: 'cut', dark: true, desc: 'Night in the starving city (callback of the cold open): Li\'s confession; weeds rise in the foreground; SWEET DEW – "wild plants, heaven\'s manna".',
  sfx: [[f('f151'), 'night', 0.7, 8], [w('f151', 'confession'), 'paper', 0.6], [w('f152', 'sweet'), 'bell', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.1, W / 2, H * 0.55, W * 0.55, H * 0.6, () => {
      PL.nanjing(c, t, { night: 0.85, dusk: 0.2 });
      A.crowd(c, { x0: -100, x1: 2020, y: 1000, n: 70, hMin: 90, hMax: 170, depth: 90, seed: 31, t, color: '#3A3632', far: '#2A2622', tools: false, agit: 0.2 });
      weeds(c, ramp(t, w('f152', 'wild') - 0.4, 1.2));
    });
    G.medallion(c, t, 'li', 1600, 300, 100, w('f151', 'Li') - 0.3, f('f152') + 0.4, { role: 'from his confession' });
    G.slam(c, t, [{ t: 'SWEET DEW', gold: true }, { t: 'wild plants · heaven\'s manna', small: true }], w('f152', 'sweet') - 0.05, S.end + 0.2, { y: H * 0.32, size: 150 });
  } },
{ id: 'S96', at: 'f153', trans: 'fade', dark: true, desc: 'The throne hall in shadow (callback of S02): Hong slumps; his medallion greys with a red slash on "died". Date-line 1 June 1864.',
  sfx: [[w('f153', 'ill'), 'bell', 0.4], [w('f154', 'died'), 'thud', 0.9]],
  draw(c, t, lt, S) {
    const d = w('f154', 'died');
    cam(c, lt, S, 1.05, 1.16, W / 2, H * 0.52, W / 2, H * 0.5, () => {
      PL.hallInterior(c, t, { mode: 'throne', dark: lerp(0.45, 0.85, ramp(t, d - 0.3, 1.2)) });
      A.figure(c, 960, 760, 330, CH.hong, { face: 1, seated: true, armF: 6, elbF: 4, lean: lerp(-4, -16, ramp(t, f('f153'), 3)) });
    });
    G.medallion(c, t, 'hong', 1560, 330, 120, f('f153') + 0.3, S.end + 0.3, { grey: ramp(t, d, 0.3), slash: ramp(t, d, 0.25), role: 'died 1 June 1864' });
    G.dateLine(c, t, { at: f('f154') - 0.1, out: S.end, event: 'The Heavenly King dies', day: '1 June', year: 1864, from: 1860, mode: 'light', y: 150 });
  } },
{ id: 'S97', at: 'f155', trans: 'cut', desc: 'Two accounts: his son\'s medallion – "sickness"; Li\'s medallion – "poison".',
  sfx: [[w('f155', 'sickness'), 'tick', 0.6], [w('f155', 'poison'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    parchment(c, t);
    G.medallion(c, t, 'boyKing', 620, 420, 140, f('f155') - 0.1, S.end + 0.3, { name: 'His son' , role: '' });
    G.medallion(c, t, 'li', 1300, 420, 140, w('f155', 'Li') - 0.2, S.end + 0.3, { role: '' });
    G.slam(c, t, [{ t: 'SICKNESS' }], w('f155', 'sickness') - 0.05, S.end + 0.2, { x: 620, y: 820, size: 100, mode: 'ink' });
    G.slam(c, t, [{ t: 'POISON', red: true }], w('f155', 'poison') - 0.05, S.end + 0.2, { x: 1300, y: 820, size: 100, mode: 'ink' });
  } },
{ id: 'S98', at: 'f156', trans: 'cut', dark: true, desc: 'The throne hall: a boy in a crown too big for him sits on the Heavenly throne (medallion).',
  sfx: [[w('f156', 'teenage'), 'whoosh', 0.4], [w('f156', 'King'), 'gong', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.12, W / 2, H * 0.55, W / 2, H * 0.5, () => { PL.hallInterior(c, t, { mode: 'throne', dark: 0.4 }); A.figure(c, 960, 760, 250, CH.boyKing, { face: 1, seated: true, armF: 10, elbF: 10 }); });
    G.medallion(c, t, 'boyKing', 1560, 330, 110, w('f156', 'teenage') - 0.2, S.end + 0.3, { role: 'the new Heavenly King' });
  } },
{ id: 'S99', at: 'f157', trans: 'cut', dark: true, desc: 'Cut-away under the wall at night: a tunnel from the siege lines, a lantern moving; on "fired" a spark races along the fuse. Date-line 19 July 1864.',
  sfx: [[f('f157'), 'night', 0.6, 7], [w('f157', 'nineteenth'), 'tick', 0.6], [w('f158', 'mine') - 0.6, 'scuffle', 0.4], [w('f158', 'fired'), 'match', 0.9], [w('f158', 'fired') + 0.2, 'fuse', 0.9, 2.6]],
  draw(c, t, lt, S) {
    const fi = w('f158', 'fired');
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.4, H * 0.52, () => {
      PL.nanjing(c, t, { night: 0.9, siege: 1 }); wallFlags(c, t, 1, '#5A1A14');
      c.fillStyle = 'rgba(24,18,12,0.92)'; c.fillRect(-100, 830, W + 200, 400); // ground cut-away
      c.strokeStyle = '#4A3A2A'; c.lineWidth = 34; c.beginPath(); c.moveTo(1500, 900); c.quadraticCurveTo(1000, 1000, 560, 860); c.stroke();
      const lu = ramp(t, f('f157'), 3.2, easeIO); const lx = lerp(1500, 600, lu), ly = 900 + Math.sin(lu * Math.PI) * 60; c.fillStyle = '#E8B860'; c.beginPath(); c.arc(lx, ly, 10, 0, TAU); c.fill(); c.globalAlpha = 0.35; c.beginPath(); c.arc(lx, ly, 40, 0, TAU); c.fill(); c.globalAlpha = 1;
      c.fillStyle = '#3A2A1C'; for (let i = 0; i < 6; i++) c.fillRect(540 + i * 22, 840, 18, 26); // powder kegs
      if (t > fi) { const u = clamp((t - fi) / 2.4); const x = lerp(1500, 600, u), y = 900 + Math.sin(u * Math.PI) * 60; const g = c.createRadialGradient(x, y, 0, x, y, 50); g.addColorStop(0, 'rgba(255,220,140,1)'); g.addColorStop(1, 'rgba(240,120,40,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, 50, 0, TAU); c.fill(); }
    });
    G.dateLine(c, t, { at: f('f157') + 0.1, out: f('f158') + 0.5, event: 'Nanjing', day: '19 July', year: 1864, from: 1860, mode: 'light', y: 150 });
  } },
{ id: 'S100', at: 'f159', trans: 'flash', dark: true, desc: 'THE BLOW: white flash; sixty yards of wall drop into a fiery breach; dust; the last calendar tile shatters. Then silence.',
  sfx: [[f('f159') - 0.12, 'boom', 1.0], [f('f159'), 'impact', 1.0], [w('f159', 'down'), 'smash', 0.8]],
  draw(c, t, lt, S) {
    const b = ramp(t, f('f159') - 0.1, 2.2, easeOut);
    const sh = Math.max(0, 1 - (t - f('f159')) / 1.2) * 18;
    c.save(); c.translate((Math.random() - 0.5) * sh, (Math.random() - 0.5) * sh);
    cam(c, lt, S, 1.06, 1.0, W * 0.4, H * 0.55, W * 0.45, H * 0.55, () => { PL.nanjing(c, t, { night: 0.6, dusk: 0.3, fire: 0.4 + 0.4 * b, breach: b, siege: 1 }); wallFlags(c, t, 1, '#5A1A14'); });
    c.restore();
    G.calendar(c, t, f('f159') - 0.2, S.end + 0.3, 14, 14, { x: 1060, y: 930, crack: 1, shatter: ramp(t, w('f159', 'came'), 1.2), light: true, label: false });
    G.text(c, 'about 60 yards', 560, 260, 'italic 400 54px BodoniItalic', '#F2E8D2', 'center', life(t, w('f159', 'sixty') - 0.1, S.end, 0.3, 0.4), 'rgba(0,0,0,0.6)');
  } },
{ id: 'S101', at: 'f160', trans: 'cut', dark: true, desc: 'The Hunan Army (blue) pours through the breach into the burning city; crimson tint; "for three days, by most accounts".',
  sfx: [[f('f160'), 'roar', 0.9], [f('f160') + 0.3, 'march', 0.7, 4], [w('f161', 'slaughter'), 'fire', 0.8, 4]],
  draw(c, t, lt, S) {
    const u = (t - f('f160'));
    cam(c, lt, S, 1.0, 1.08, W * 0.45, H * 0.55, W * 0.4, H * 0.55, () => {
      PL.nanjing(c, t, { night: 0.5, fire: 0.9, breach: 1, siege: 1 });
      A.crowd(c, { x0: 700 - u * 70, x1: 2100 - u * 70, y: 1000, n: 80, hMin: 110, hMax: 200, depth: 70, seed: 160, t, color: P.blue, far: '#2A3440', hat: 'cone', face: -1, raise: 0.6, agit: 1.4 });
    });
    tint(c, '#7A1C14', 0.35 * ramp(t, f('f161'), 1));
    G.slam(c, t, [{ t: 'for three days', small: true }, { t: 'SLAUGHTER AND FIRE', red: true }, { t: 'by most accounts', small: true }], w('f161', 'three') - 0.05, S.end + 0.2, { y: H * 0.3, size: 110 });
  } },
{ id: 'S102', at: 'f162', trans: 'cut', desc: 'Zeng Guofan\'s report on parchment: 100,000 rolls up; then "may be exaggerated" in red pencil beside it.',
  sfx: [[w('f162', 'reported'), 'quill', 0.6, 1.5], [w('f162', 'hundred'), 'impact', 0.6], [w('f163', 'exaggerated'), 'stamp', 0.6]],
  draw(c, t, lt, S) {
    parchment(c, t);
    G.documentSheet(c, t, 520, 560, 560, 720, { title: 'Report to the Throne', titleSize: 32, written: ramp(t, f('f162'), 2), seed: 41, seal: true, sealText: 'Z' });
    G.medallion(c, t, 'zengF', 1450, 300, 100, f('f162') - 0.1, S.end + 0.3, {});
    G.counter(c, t, 0, 100000, w('f162', 'hundred') - 0.3, 1.0, 1300, 650, { size: 130, color: P.ink, mode: 'ink', label: 'rebels dead · Zeng\'s report', labelColor: P.ink3 });
    G.text(c, 'may be exaggerated', 1300, 820, 'italic 400 54px BodoniItalic', P.red, 'center', ramp(t, w('f163', 'may') - 0.1, 0.4));
  } },
{ id: 'S103', at: 'f164', trans: 'smoke', dark: true, desc: 'Nanjing after: the breach, smoke, the red flags gone. NO MORE.',
  sfx: [[f('f164'), 'wind', 0.7, 4], [w('f164', 'more'), 'thud', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.45, H * 0.5, () => { PL.nanjing(c, t, { dusk: 0.4, night: 0.3, breach: 1, siege: 1 }); A.smoke(c, 700, 600, t, 2.4, 164, 'rgba(40,34,30,0.4)'); });
    G.slam(c, t, [{ t: 'the Heavenly Capital', small: true }, { t: 'WAS NO MORE' }], w('f164', 'Heavenly') - 0.1, S.end + 0.2, { y: H * 0.28, size: 130 });
  } },

// ================================================================ CH 11  The price
{ id: 'S104', at: 'f165', trans: 'black', dark: true, desc: 'Night outside the walls: the boy king gallops away on Li\'s dark horse; Li, on foot, is surrounded by blue soldiers.',
  sfx: [[f('f165'), 'hooves', 0.8, 3], [w('f165', 'captured'), 'scuffle', 0.7]],
  draw(c, t, lt, S) {
    const u = ramp(t, f('f165'), 3.4, easeIn), cap = ramp(t, w('f165', 'captured') - 0.4, 0.8);
    cam(c, lt, S, 1.0, 1.06, W / 2, H * 0.6, W * 0.45, H * 0.6, () => {
      PL.guangxi(c, t, { night: 0.8, kilns: false });
      A.rider(c, lerp(800, -300, u), 1040, 220, CH.boyKing, { face: -1, color: '#2A241D', cloth: P.red, walk: t * 8, t });
      A.figure(c, 1100, 1040, 320, CH.li, { face: -1, armF: 20, elbF: 20 });
      fade(c, cap, () => { for (let i = 0; i < 4; i++) A.figure(c, lerp(1900, 1250 + i * 90, cap), 1040, 300, CH.hunanSoldier, { face: -1, prop: 'spear' }); });
    });
    G.medallion(c, t, 'li', 1600, 300, 100, f('f165') - 0.1, S.end + 0.3, { role: 'captured' });
  } },
{ id: 'S105', at: 'f166', trans: 'cut', desc: 'Li\'s confession writes itself across a long sheet; his medallion greys with a red slash on "executed".',
  sfx: [[f('f166'), 'quill', 0.7, 2.5], [w('f166', 'executed'), 'slash', 0.8]],
  draw(c, t, lt, S) {
    parchment(c, t);
    G.documentSheet(c, t, 620, 560, 680, 840, { title: 'The confession of Li Xiucheng', titleSize: 30, written: ramp(t, f('f166'), 2.6), seed: 51 });
    const ex = w('f166', 'executed');
    G.medallion(c, t, 'li', 1400, 420, 140, f('f166') - 0.1, S.end + 0.3, { grey: ramp(t, ex, 0.3), slash: ramp(t, ex, 0.25), role: 'executed, August 1864' });
  } },
{ id: 'S106', at: 'f167', trans: 'cut', desc: 'The boy king\'s medallion greys with a red slash; date-line November 1864.',
  sfx: [[w('f167', 'caught'), 'thud', 0.5], [w('f167', 'executed'), 'slash', 0.7]],
  draw(c, t, lt, S) {
    parchment(c, t);
    const ex = w('f167', 'executed');
    G.medallion(c, t, 'boyKing', W / 2, 460, 170, f('f167') - 0.1, S.end + 0.3, { grey: ramp(t, ex, 0.3), slash: ramp(t, ex, 0.25), role: 'executed, November 1864' });
    G.dateLine(c, t, { at: f('f167'), out: S.end, event: 'Nanchang', day: 'November', year: 1864, from: 1860, mode: 'ink', y: 160, x: 200 });
  } },
{ id: 'S107', at: 'f168', trans: 'cut', desc: 'Map of the south-west: the Dadu River; Shi Dakai\'s medallion greys – captured and put to death, June 1863.',
  sfx: [[w('f168', 'captured'), 'thud', 0.6], [w('f168', 'death'), 'slash', 0.7]],
  draw(c, t, lt, S) {
    const v = { lon: 104.5, lat: 29.6, span: 9 };
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.42, H * 0.52, () => {
      PL.chinaMap(c, t, { view: v, labels: ['Chengdu', 'Dadu River'], hi: 'Dadu River', cartouche: 'Sichuan · 1863' });
      tok(c, v, 'Dadu River', P.red, 1, null, 26);
    });
    const d = w('f168', 'death');
    G.medallion(c, t, 'shi', 1500, 420, 140, f('f168') - 0.1, S.end + 0.3, { grey: ramp(t, d, 0.3), slash: ramp(t, d, 0.25), role: 'put to death, June 1863' });
  } },
{ id: 'S108', at: 'f169', trans: 'cut', desc: 'The map: the red Taiping territory shrinks to scattered points and fades; the Heavenly Calendar burns on "gone".',
  sfx: [[f('f169'), 'drum', 0.4, 2.5], [w('f170', 'gone'), 'fire', 0.8, 2.5]],
  draw(c, t, lt, S) {
    const sh = ramp(t, f('f169'), 3.4, easeIO);
    cam(c, lt, S, 1.0, 1.04, W / 2, H / 2, W / 2, H / 2, () => {
      PL.chinaMap(c, t, { tp: 1 - sh, labels: ['Nanjing'] });
      for (let i = 0; i < 9; i++) { const r = rng(169 + i); const [x, y] = G.proj(V.cn, 25 + r() * 7, 112 + r() * 8); G.token(c, x, y, 14, P.red, (1 - ramp(t, f('f170') + i * 0.1, 0.6)) * ramp(t, f('f169') + i * 0.15, 0.4)); }
    });
    G.calendar(c, t, f('f169') - 0.2, S.end + 0.3, 14, 14, { x: 140, y: 110, burn: ramp(t, w('f170', 'gone') - 0.2, 1.8), crack: 1, label: false });
  } },
{ id: 'S109', at: 'f171', trans: 'cut', desc: 'The people grid: rows of figures grey out; 20 – 30 MILLION; "battle · massacre · famine · disease".',
  sfx: [[w('f172', 'twenty'), 'impact', 0.8], [w('f173', 'battle'), 'tick', 0.5], [w('f173', 'massacre'), 'tick', 0.5], [w('f173', 'famine'), 'tick', 0.5], [w('f173', 'disease'), 'tick', 0.5], [f('f171'), 'bell', 0.5]],
  draw(c, t, lt, S) {
    parchment(c, t);
    const g = ramp(t, f('f171') + 0.3, 6, easeIO);
    PL.peopleGrid(c, t, { cols: 20, rows: 5, x: 220, y: 520, dx: 78, dy: 92, h: 66, state: k => hash(k) < g * 0.9 ? { color: '#B9AA88', a: 0.6 } : { color: P.ink2 } });
    G.slam(c, t, [{ t: '20 – 30 MILLION', red: true }, { t: 'by most estimates', small: true }], w('f172', 'twenty') - 0.05, S.end + 0.2, { y: 220, size: 110, mode: 'ink' });
    ['battle', 'massacre', 'famine', 'disease'].forEach((s, i) => G.text(c, s, 360 + i * 400, 1010, 'italic 400 54px BodoniItalic', P.ink, 'center', ramp(t, w('f173', s) - 0.1, 0.3)));
  } },
{ id: 'S110', at: 'f174', trans: 'cut', desc: 'Two bars: the Taiping Rebellion (20–30 million, est.) beside the First World War (about 15–22 million, est.). "Perhaps."',
  sfx: [[f('f174'), 'whoosh', 0.5], [w('f174', 'First'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    parchment(c, t);
    const u1 = ramp(t, f('f174'), 1.0, easeOut), u2 = ramp(t, w('f174', 'First') - 0.2, 1.0, easeOut), base = 900, k = 22;
    const bar = (x, lo, hi, u, col, lab, sub) => { c.fillStyle = rgba(col, 0.35); c.fillRect(x - 110, base - hi * k * u, 220, (hi - lo) * k * u); c.fillStyle = col; c.fillRect(x - 110, base - lo * k * u, 220, lo * k * u); G.text(c, lab, x, base + 60, '600 36px Cinzel', P.ink, 'center', u); G.text(c, sub, x, base + 104, 'italic 400 34px BodoniItalic', P.ink3, 'center', u); };
    bar(700, 20, 30, u1, P.red, 'Taiping Rebellion', '20–30 million · est.'); bar(1220, 15, 22, u2, P.blue, 'First World War', 'about 15–22 million · est.');
    c.fillStyle = P.ink2; c.fillRect(480, base, 960, 4);
    G.slam(c, t, [{ t: 'perhaps more', small: true }], f('f174') - 0.1, S.end + 0.2, { y: 180, size: 110, mode: 'ink' });
  } },
{ id: 'S111', at: 'f175', trans: 'cut', desc: 'The Qing survived: the Dragon Throne (callback), Zeng\'s medallion; then the map fills with blue regional-army banners.',
  sfx: [[w('f175', 'survived'), 'gong', 0.6], [w('f176', 'regional'), 'march', 0.6, 3]],
  draw(c, t, lt, S) {
    const sw = f('f176');
    if (t < sw - 0.1) {
      cam(c, lt, S, 1.0, 1.06, W / 2, H * 0.5, W / 2, H * 0.48, () => { PL.hallInterior(c, t, { mode: 'qing' }); A.figure(c, 960, 760, 300, PL.shade(CH.emperor, '#2A1E12'), { face: 1, seated: true }); });
      G.medallion(c, t, 'zengF', 1580, 330, 110, w('f175', 'Zeng') - 0.3, sw, {});
      G.slam(c, t, [{ t: 'THE QING SURVIVED', gold: true }], w('f175', 'survived') - 0.05, sw, { y: H * 0.82, size: 100 });
    } else {
      cam(c, lt, S, 1.0, 1.05, W / 2, H / 2, W / 2, H / 2, () => {
        PL.chinaMap(c, t, { labels: ['Beijing', 'Nanjing'] });
        const pts = [[28.0, 112.5], [31.5, 117.0], [30.0, 120.0], [33.5, 113.5], [26.0, 116.0], [35.5, 116.5], [24.5, 110.0], [30.5, 108.0]];
        pts.forEach((p, i) => { const [x, y] = G.proj(V.cn, p[0], p[1]); const a = ramp(t, sw + i * 0.35, 0.4); if (a <= 0) return; c.save(); c.globalAlpha = a; c.strokeStyle = P.ink2; c.lineWidth = 4; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 70); c.stroke(); c.fillStyle = P.blue; c.beginPath(); c.moveTo(x, y - 70); c.lineTo(x + 50, y - 62); c.lineTo(x + 48, y - 38); c.lineTo(x, y - 42); c.fill(); c.restore(); });
        const [bx, by] = G.proj(V.cn, ...G.PLACES.Beijing); c.strokeStyle = P.gold; c.lineWidth = 5; c.beginPath(); c.arc(bx, by, 36, 0, TAU); c.stroke();
      });
      G.slam(c, t, [{ t: 'regional armies', small: true }, { t: 'LOYAL TO THEIR GENERALS' }], w('f176', 'regional') - 0.1, S.end + 0.2, { y: H * 0.86, size: 80, mode: 'ink' });
    }
  } },
{ id: 'S112', at: 'f177', trans: 'black', desc: 'PAYOFF: the Canton exam wall again (same plate), the same list and the red REMEMBER tag; the three-note motif.',
  sfx: [[f('f177') - 0.1, 'motif', 1.0], [w('f177', 'remember'), 'tick', 0.5]],
  draw(c, t, lt, S) {
    const L = PL.EXAM_LIST;
    cam(c, lt, S, 1.0, 1.3, W / 2, H / 2, L.x - 80, L.y + 20, () => PL.examHall(c, t, { list: { reveal: 1, gap: 1, tag: 1, caption: 'Pass list · Canton · 1837' } }));
  } },
{ id: 'S113', at: 'f178', trans: 'cut', desc: 'ABOLISHED 1905 stamps across the list; date-line 1905.',
  sfx: [[w('f178', 'abolished') - 0.05, 'stamp', 1.0], [w('f178', 'abolished'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    const L = PL.EXAM_LIST;
    cam(c, lt, S, 1.3, 1.36, L.x - 80, L.y + 20, L.x - 90, L.y + 10, () => PL.examHall(c, t, { list: { reveal: 1, gap: 1, gapLabel: false, tag: 1, caption: 'Pass list · Canton · 1837' } }));
    G.stamp(c, t, 'ABOLISHED 1905', w('f178', 'abolished') - 0.05, S.end + 0.2, { x: W / 2, y: H / 2, size: 130, rot: -0.14 });
    G.dateLine(c, t, { at: f('f178') + 0.1, out: S.end, event: 'The imperial examinations end', year: 1905, from: 1864, mode: 'light', y: 150, rollDur: 2 });
  } },
{ id: 'S114', at: 'f179', trans: 'cut', dark: true, desc: 'The Qing throne room darkens; the gold banners fall; the throne stands empty. OVERTHROWN · 1911.',
  sfx: [[w('f179', 'dynasty'), 'thunder', 0.6], [w('f179', 'overthrown'), 'impact', 0.9]],
  draw(c, t, lt, S) {
    const o = ramp(t, w('f179', 'overthrown') - 0.4, 1.2, easeIn);
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.5, W / 2, H * 0.48, () => {
      PL.hallInterior(c, t, { mode: 'qing', dark: lerp(0.2, 0.75, o) });
      fade(c, 1 - o, () => A.figure(c, 960, 760, 300, PL.shade(CH.emperor, '#2A1E12'), { face: 1, seated: true }));
    });
    G.slam(c, t, [{ t: 'OVERTHROWN', red: true }, { t: '1911', small: true }], w('f179', 'overthrown') - 0.05, S.end + 0.2, { y: H * 0.3, size: 150 });
  } },
{ id: 'S115', at: 'f180', trans: 'cut', desc: 'A year counter rolls 1864 → 1905: 41 YEARS; the student medallion beside the list.',
  sfx: [[w('f180', 'outlived'), 'tick', 0.6], [w('f180', 'forty'), 'impact', 0.8]],
  draw(c, t, lt, S) {
    parchment(c, t);
    G.passList(c, t, 520, 560, 560, 520, { reveal: 1, gap: 1, gapLabel: false, tag: 1, caption: 'Pass list · Canton · 1837' });
    G.medallion(c, t, 'hongStudent', 1350, 330, 110, f('f180') - 0.1, S.end + 0.3, {});
    G.counter(c, t, 1864, 1905, w('f180', 'outlived') - 0.2, 1.4, 1350, 720, { size: 130, color: P.ink, mode: 'ink', plain: true });
    G.slam(c, t, [{ t: '41 YEARS', red: true }], w('f180', 'forty') - 0.05, S.end + 0.2, { x: 1350, y: 900, size: 100, mode: 'ink' });
  } },

// ================================================================ CH 12  A kingdom carved in stone
{ id: 'S116', at: 'f181', trans: 'black', desc: 'Tiananmen Square today: the Monument to the People\'s Heroes; script "Tiananmen Square"; date-line 1958.',
  sfx: [[f('f181'), 'wind', 0.5, 8], [w('f181', 'Tiananmen'), 'whoosh', 0.5], [w('f182', 'Monument'), 'bell', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.12, W / 2, H / 2, W * 0.62, H * 0.45, () => PL.tiananmen(c, t));
    G.scriptName(c, t, 'Tiananmen Square', w('f181', 'Tiananmen') - 0.3, f('f182') + 0.5, { y: H * 0.3, size: 150, mode: 'ink', role: 'Beijing' });
    G.dateLine(c, t, { at: f('f182') + 0.5, out: S.end, event: 'The Monument to the People\'s Heroes', year: 1958, from: 1952, mode: 'ink', y: 160, x: 200 });
  } },
{ id: 'S117', at: 'f183', trans: 'fade', desc: 'The carved stone relief: the camera pans along the figures; on "Jintian" the carving warms to a faint red. "The Jintian Uprising · 1851".',
  sfx: [[f('f183'), 'wind', 0.4, 8], [w('f184', 'Jintian'), 'gong', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.3, 1.15, W * 0.35, H * 0.5, W * 0.62, H * 0.5, () => PL.reliefPanel(c, t, { red: ramp(t, w('f184', 'Jintian') - 0.3, 1.2) }));
    G.text(c, 'one of eight scenes', W / 2, 120, 'italic 400 44px BodoniItalic', P.ink, 'center', life(t, w('f183', 'eight') - 0.2, f('f184'), 0.3, 0.3));
    G.slam(c, t, [{ t: 'THE JINTIAN UPRISING' }, { t: '1851', small: true }], w('f184', 'Jintian') - 0.05, S.end + 0.2, { y: H * 0.86, size: 90 });
  } },
{ id: 'S118', at: 'f185', trans: 'cut', desc: 'Sun Yat-sen\'s medallion – "drew inspiration from them"; Mao Zedong\'s – "an early revolutionary".',
  sfx: [[w('f185', 'Sun'), 'whoosh', 0.5], [w('f186', 'Mao'), 'whoosh', 0.5]],
  draw(c, t, lt, S) {
    parchment(c, t);
    G.medallion(c, t, 'sun', 620, 420, 150, w('f185', 'Sun') - 0.2, S.end + 0.3, {});
    G.text(c, 'drew inspiration from them', 620, 760, 'italic 400 44px BodoniItalic', P.ink, 'center', ramp(t, w('f185', 'inspiration') - 0.3, 0.4));
    G.medallion(c, t, 'mao', 1300, 420, 150, w('f186', 'Mao') - 0.2, S.end + 0.3, {});
    G.text(c, '"an early revolutionary"', 1300, 760, 'italic 400 44px BodoniItalic', P.ink, 'center', ramp(t, w('f186', 'early') - 0.3, 0.4));
  } },
{ id: 'S119', at: 'f187', trans: 'cut', desc: 'Nanjing today (callback plate, no flags, daylight); "a museum of the Heavenly Kingdom".',
  sfx: [[f('f187'), 'village', 0.4, 8], [w('f188', 'museum'), 'bell', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.42, H * 0.5, () => PL.nanjing(c, t, { dusk: 0.0 }));
    G.slam(c, t, [{ t: 'rebels against an empire', small: true }], w('f187', 'rebels') - 0.1, f('f188'), { y: H * 0.26, size: 110 });
    G.scriptName(c, t, 'Nanjing, today', f('f188') - 0.1, S.end + 0.3, { y: H * 0.26, size: 150, role: 'a museum of the Heavenly Kingdom' });
  } },
{ id: 'S120', at: 'f189', trans: 'fade', desc: 'The gold dream sky (callback) behind the Heavenly King; then it drains to grey as rows of grey figures fill the frame.',
  sfx: [[f('f189'), 'chant', 0.4, 4], [w('f190', 'war'), 'thunder', 0.5]],
  draw(c, t, lt, S) {
    const g = ramp(t, f('f190') - 0.2, 1.6, easeIO);
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.55, W / 2, H * 0.5, () => { PL.dream(c, t, {}); A.figure(c, 960, 980, 380, CH.hong, { face: 1, armF: 20, elbF: 30 }); });
    if (g > 0) { c.save(); c.globalAlpha = g * 0.85; c.fillStyle = '#8C887E'; c.fillRect(0, 0, W, H); c.restore(); PL.peopleGrid(c, t, { cols: 22, rows: 4, x: 140, y: 640, dx: 75, dy: 110, h: 72, state: k => ({ color: '#5E5A52', a: g * (hash(k) < 0.95 ? 1 : 0) }) }); }
  } },
{ id: 'S121', at: 'f191', trans: 'cut', desc: 'The final question: the Heavenly King\'s medallion between REVOLUTION and CATASTROPHE; "China is still deciding"; fade to black.',
  sfx: [[w('f191', 'revolution'), 'impact', 0.6], [w('f191', 'catastrophe'), 'impact', 0.6], [w('f192', 'deciding'), 'bell', 0.6]],
  draw(c, t, lt, S) {
    parchment(c, t);
    G.medallion(c, t, 'hong', W / 2, 430, 170, f('f191') - 0.2, S.end + 0.3, { role: 'the Heavenly King' });
    G.slam(c, t, [{ t: 'REVOLUTION' }], w('f191', 'revolution') - 0.05, S.end + 0.2, { x: 400, y: 450, size: 90, mode: 'ink' });
    G.slam(c, t, [{ t: 'CATASTROPHE', red: true }], w('f191', 'catastrophe') - 0.05, S.end + 0.2, { x: 1520, y: 450, size: 90, mode: 'ink' });
    G.text(c, 'China is still deciding', W / 2, 860, 'italic 400 56px BodoniItalic', P.ink, 'center', ramp(t, w('f192', 'China') - 0.2, 0.6));
    dim(c, ramp(t, e('f192') + 0.3, 1.2));
  } },
];
