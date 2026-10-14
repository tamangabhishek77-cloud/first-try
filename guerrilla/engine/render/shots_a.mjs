// Shots: cold open, chapters 1–3 (guerrilla episode, 1927–1949). Every beat is keyed to a word or fragment of the narration (T.f / T.w).
import { W, H, P, T, clamp, lerp, easeIO, easeOut, easeIn, backOut, ramp, life, rng, mixColor, rgba, parchment, withCam, push, puff } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';
import * as PL from './plates.mjs';
import { dim, tint, cam, fade, tok, xy, V, arrow, column, fishWater, people, bookCover, stretcher, bars } from './gw_common.mjs';
const { CH } = A; const f = T.f, e = T.e, w = T.w;
const TAU = Math.PI * 2;
const SHOP = { ...CH.farmer, cone: null, skullcap: '#1E1A15' }; // a Shanghai shopkeeper (generic)

export const SHOTS_A = [
// ================================================================ COLD OPEN
{ id: 'S01', at: 0, desc: 'Shanghai at dawn, May 1949 (cold-open plate = ch11): the street, mist; date-line.',
  sfx: [[0, 'wind', 0.5, 6], [0.5, 'tick', 0.5], [w('f001', 'Shanghai'), 'whoosh', 0.4], [w('f002', 'strange'), 'bell', 0.35]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.1, W / 2, H / 2, W * 0.56, H * 0.52, () => PL.shanghaiStreet(c, t, { dawn: 0.85, mist: 0.8, sleepers: ramp(t, w('f002', 'strange') - 0.6, 1.4, easeIO) }));
    G.dateLine(c, t, { at: 0.4, out: f('f002') + 0.6, event: 'Shanghai', day: 'May', year: 1949, from: 1945, mode: 'light', y: 150 });
    G.slam(c, t, [{ t: "China's richest city", small: true }], w('f002', 'richest') - 0.1, S.end + 0.2, { y: H * 0.78, size: 120 });
  } },
{ id: 'S02', at: 'f003', trans: 'cut', desc: 'Close: a Red Army soldier asleep on the pavement, rifle in his arms; Mao medallion; a shop shutter half open behind. "They had just taken the city."',
  sfx: [[w('f003', 'Mao'), 'whoosh', 0.4], [w('f003', 'asleep'), 'smallthing', 0.3], [w('f004', 'taken'), 'drum', 0.4, 2]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.48, H * 0.5, () => {
      PL.shanghaiStreet(c, t, { dawn: 0.8, sleepers: 1, shutters: ramp(t, f('f004'), 2.5) * 0.4 });
      c.fillStyle = 'rgba(30,24,18,0.25)'; c.fillRect(0, 760, W, 320);
      PL.lyingSoldier(c, 1240, 1050, 720, '#5E6266', 1); PL.lyingSoldier(c, 520, 1070, 640, '#5E6266', -1);
    });
    G.medallion(c, t, 'maoYan', 1640, 280, 110, w('f003', 'Mao') - 0.1, S.end + 0.2, { role: "his soldiers" });
    G.slam(c, t, [{ t: 'ASLEEP' }, { t: 'on the pavements', small: true }], w('f003', 'asleep') - 0.05, f('f004'), { x: 640, y: H * 0.3, size: 130 });
    G.slam(c, t, [{ t: 'they had just', small: true }, { t: 'TAKEN THE CITY', red: true }], w('f004', 'taken') - 0.1, S.end + 0.2, { x: 700, y: H * 0.3, size: 110 });
  } },
{ id: 'S03', at: 'f005', trans: 'cut', desc: 'Shut doors along the shophouses; soldiers asleep outside them. NOT ONE HOME.',
  sfx: [[w('f005', 'orders'), 'tick', 0.5], [w('f005', 'single'), 'stamp', 0.8]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.25, 1.4, W * 0.72, H * 0.6, W * 0.76, H * 0.62, () => PL.shanghaiStreet(c, t, { dawn: 0.75, sleepers: 1 }));
    G.text(c, 'by most accounts', W * 0.3, H * 0.22, 'italic 400 44px BodoniItalic', '#F2E8D2', 'center', life(t, f('f005'), S.end, 0.3, 0.3), 'rgba(0,0,0,0.6)');
    G.stamp(c, t, 'NOT ONE HOME', w('f005', 'single'), S.end + 0.2, { x: W * 0.32, y: H * 0.4, size: 110, rot: -0.08 });
  } },
{ id: 'S04', at: 'f006', trans: 'black', dark: true, desc: '1927: the Jinggang Mountains at dusk; a thin column of beaten men climbs the path. UNDER 1,000.',
  sfx: [[f('f006'), 'wind', 0.6, 6], [w('f006', 'thousand'), 'impact', 0.6], [w('f007', 'mountains'), 'whoosh', 0.4]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.45, H * 0.52, () => { PL.jinggang(c, t, { dusk: 0.8, night: 0.25, path: 1, village: false });
      column(c, t, CH.redSoldier, 360, 1060, 6, 210, 90, -34, { depth: 0.5, speed: 3.6, prop: null }); });
    G.dateLine(c, t, { at: f('f006') + 0.1, out: S.end - 0.2, event: 'Twenty-two years earlier', year: 1927, from: 1949, mode: 'light', y: 150 });
    G.slam(c, t, [{ t: 'UNDER 1,000' }, { t: 'beaten men', small: true }], w('f006', 'thousand') - 0.05, S.end + 0.2, { x: W * 0.68, y: H * 0.46, size: 130 });
  } },
{ id: 'S05', at: 'f008', trans: 'whip', desc: 'Map: 1934–35, the Long March route races across China. MOST NEVER FINISHED.',
  sfx: [[f('f008'), 'whoosh', 0.6], [w('f008', 'ran'), 'march', 0.5, 3], [w('f009', 'never'), 'impact', 0.7]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.05, W / 2, H / 2, W * 0.48, H * 0.5, () => PL.cnMap(c, t, { view: V.march, march: ramp(t, f('f008') - 0.2, 3.2, easeIO), labels: ['Ruijin', 'Wuqi'], cartouche: '1934–1935' }));
    G.dateLine(c, t, { at: f('f008'), out: S.end - 0.2, event: 'Fifteen years earlier', year: 1934, from: 1949, mode: 'ink', y: 150 });
    dim(c, 0.45 * ramp(t, w('f009', 'never') - 0.3, 0.5));
    G.slam(c, t, [{ t: 'most of them', small: true }, { t: 'NEVER FINISHED', red: true }], w('f009', 'never') - 0.05, S.end + 0.2, { y: H * 0.5, size: 130 });
  } },
{ id: 'S06', at: 'f010', trans: 'cut', desc: 'Map: China fills red. NOW IT HELD CHINA.',
  sfx: [[w('f010', 'held'), 'boom', 0.7], [w('f010', 'China'), 'gong', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.05, 1.0, W / 2, H / 2, W / 2, H / 2, () => { PL.cnMap(c, t, { view: { lon: 104, lat: 35, span: 64 }, labels: [], cartouche: '1949' });
      PL.cnBorders(c, { lon: 104, lat: 35, span: 64 }, ['CHN'], { fill: rgba(P.red, 0.6 * ramp(t, w('f010', 'held') - 0.3, 0.8, easeIO)), dash: [], width: 3, color: P.red }); });
    G.slam(c, t, [{ t: 'now it held', small: true }, { t: 'CHINA', red: true }], w('f010', 'held') - 0.05, S.end + 0.2, { y: H * 0.5, size: 190, mode: 'ink' });
  } },
{ id: 'S07', at: 'f011', trans: 'ink', dark: true, desc: 'Title card: a column on a ridge against a red dusk; "an army that kept running away" / "win the most populous country on earth?" then THE ARMY THAT RAN AWAY — AND WON · China\'s guerrilla war 1927–1949.',
  sfx: [[f('f011') - 0.3, 'thunder', 0.5], [w('f011', 'running'), 'march', 0.6, 3], [w('f012', 'populous'), 'whoosh', 0.5], [w('f013', 'guerrilla'), 'gong', 1.0], [w('f013', 'war'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H * 0.55, W / 2, H * 0.5, () => { A.sky(c, 'storm', t); c.save(); c.globalAlpha = 0.75; A.sky(c, 'fire', t); c.restore();
      A.hills(c, 760, 160, 71, '#2A2420'); A.hills(c, 900, 120, 72, '#1A1612');
      const k = (t - f('f011')) * 60; for (let i = 0; i < 26; i++) { const x = ((i * 74 + k) % 2100) - 100, y = 760 - Math.sin(x / 210) * 70 - 40 * Math.sin(x / 90) * 0.4; A.figure(c, x, 820 + Math.sin(x / 300) * 30, 92, PL.shade(CH.redSoldier, '#14110E'), { face: 1, walk: t * 5 + i, prop: i % 3 ? 'rifle' : null }); }
      PL.redFlag(c, 1500, 640, 120, t); c.strokeStyle = '#14110E'; c.lineWidth = 5; c.beginPath(); c.moveTo(1500, 640); c.lineTo(1500, 840); c.stroke(); });
    const q1 = f('f011'), q2 = f('f012'), tt = w('f013', 'guerrilla') - 0.6, out = S.end - 0.2;
    G.text(c, 'how did an army that kept running away', W / 2, H * 0.36, 'italic 400 58px BodoniItalic', '#EDE3CF', 'center', life(t, q1, tt, 0.3, 0.3), 'rgba(0,0,0,0.6)');
    G.text(c, 'win the most populous country on earth?', W / 2, H * 0.36 + 80, 'italic 400 58px BodoniItalic', '#EDE3CF', 'center', life(t, q2, tt, 0.3, 0.3), 'rgba(0,0,0,0.6)');
    G.slam(c, t, [{ t: 'THE ARMY THAT RAN AWAY' }, { t: 'AND WON', red: true }], tt, out, { y: H * 0.34, size: 120 });
    G.text(c, "China's guerrilla war · 1927 – 1949", W / 2, H * 0.34 + 190, '500 54px Oswald', P.gold2, 'center', life(t, tt + 0.5, out, 0.4, 0.3), 'rgba(0,0,0,0.6)');
  } },
{ id: 'S08', at: e('f013') + 0.1, trans: 'cut', dark: true, desc: 'Brand sting: a fuse burns across the black and lights THE MAJOR REVOLUTION.',
  sfx: [[e('f013') + 0.25, 'match', 0.9], [e('f013') + 0.45, 'fuse', 0.8, 1.7], [e('f013') + 2.15, 'boom', 1.0]],
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

// ================================================================ CH 1  The barrel of a gun
{ id: 'S09', at: 'f014', trans: 'black', dark: true, desc: 'Shanghai by night, April 1927 (the same street, under red light): gangsters with daggers advance in silhouette.',
  sfx: [[f('f014') - 0.2, 'night', 0.6, 6], [w('f014', 'Shanghai'), 'whoosh', 0.4], [f('f014') + 1.2, 'march', 0.4, 3]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.5, H * 0.55, () => { PL.shanghaiStreet(c, t, { night: 0.75, red: ramp(t, f('f014') + 0.6, 2.5) * 0.6 });
      for (let i = 0; i < 5; i++) { const u = ramp(t, f('f014') + i * 0.3, 6, easeIO); A.figure(c, lerp(260, 620, u) + i * 120, 1010 - i * 26, 250 - i * 24, PL.shade(CH.gangster), { face: 1, walk: u < 1 ? t * 4 + i : null, prop: 'dagger' }); } });
    G.dateLine(c, t, { at: f('f014') + 0.2, out: S.end - 0.2, event: 'Shanghai', day: 'April', year: 1927, from: 1923, mode: 'light', y: 150 });
  } },
{ id: 'S10', at: 'f015', trans: 'whip', dark: true, desc: "Chiang Kai-shek: medallion (photo) and the figure in gold; a red crack runs between him and the communists' red tokens. TURNED ON HIS ALLIES.",
  sfx: [[w('f015', 'Chiang'), 'whoosh', 0.5], [w('f015', 'turned'), 'slash', 0.8], [w('f015', 'allies'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.05, W / 2, H / 2, W * 0.52, H * 0.5, () => { PL.shanghaiStreet(c, t, { night: 0.8, red: 0.5 }); dim(c, 0.45);
      A.figure(c, 640, 1000, 520, CH.chiang, { face: 1, armF: 25, elbF: 10, prop: 'cane' });
      A.crowd(c, { x0: 1150, x1: 1850, y: 980, n: 26, hMin: 120, hMax: 200, depth: 60, seed: 19, t, red: 1, hat: 'star', tools: false, face: -1, agit: lerp(1, 3, ramp(t, w('f015', 'turned'), 0.4)) }); });
    const u = ramp(t, w('f015', 'turned') - 0.1, 0.35); if (u > 0) { c.save(); c.strokeStyle = P.red; c.lineWidth = 10; c.beginPath(); c.moveTo(980, 120); for (let k = 1; k <= 8; k++) c.lineTo(980 + (k % 2 ? 30 : -30), 120 + k * 110 * u); c.stroke(); c.restore(); }
    G.medallion(c, t, 'chiang', 300, 280, 110, w('f015', 'Chiang') - 0.2, S.end + 0.2, { role: 'Nationalist leader' });
    G.slam(c, t, [{ t: 'TURNED ON' }, { t: 'his communist allies', small: true }], w('f015', 'turned') - 0.05, S.end + 0.2, { x: 1400, y: H * 0.26, size: 110 });
  } },
{ id: 'S11', at: 'f016', trans: 'cut', dark: true, desc: 'The hunt by night: silhouettes run across the red street; crimson tint; HUNDREDS / THOUSANDS (no bodies).',
  sfx: [[f('f016'), 'riot', 0.5, 4], [w('f017', 'shot'), 'impact', 0.6], [w('f017', 'hundreds'), 'drum', 0.5, 2], [w('f018', 'thousands'), 'boom', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.1, 1.18, W / 2, H * 0.6, W * 0.46, H * 0.62, () => { PL.shanghaiStreet(c, t, { night: 0.8, red: 0.8 });
      const k = (t - f('f016')) * 260; for (let i = 0; i < 6; i++) { const x = ((i * 330 + k) % 2400) - 300; A.figure(c, x, 1000 + (i % 2) * 30, 240, PL.shade(CH.redSoldier, '#1A0A08'), { face: 1, walk: t * 9 + i, lean: 14 }); }
      for (let i = 0; i < 4; i++) { const x = ((i * 380 + k * 0.92 - 500) % 2400) - 300; A.figure(c, x, 1030, 270, PL.shade(CH.gangster, '#0E0806'), { face: 1, walk: t * 8 + i, prop: 'dagger', lean: 10 }); } });
    tint(c, '#8A2A1C', 0.35);
    G.slam(c, t, [{ t: 'HUNDREDS', red: true }, { t: 'shot in the first days', small: true }], w('f017', 'hundreds') - 0.05, f('f018') - 0.05, { y: H * 0.3, size: 140 });
    G.slam(c, t, [{ t: 'THOUSANDS', red: true }, { t: 'across China, in the months that followed', small: true }], w('f018', 'thousands') - 0.05, S.end + 0.2, { y: H * 0.3, size: 140 });
  } },
{ id: 'S12', at: 'f019', trans: 'ink', desc: 'Parchment card: THE CITIES (factory chimneys, a red workers\' crowd) — the crowd greys and a DESTROYED stamp lands.',
  sfx: [[w('f019', 'cities'), 'whoosh', 0.4], [w('f020', 'destroyed'), 'stamp', 0.9]],
  draw(c, t, lt, S) {
    parchment(c, t); const g = ramp(t, w('f020', 'destroyed') - 0.4, 0.8);
    for (let i = 0; i < 6; i++) { const x = 360 + i * 230, h = 260 + (i % 3) * 80; c.fillStyle = mixColor('#4A4036', '#8A8278', g); c.fillRect(x, 720 - h, 160, h); c.fillRect(x + 110, 720 - h - 140, 30, 140); A.smoke(c, x + 125, 720 - h - 150, t, 0.6, 30 + i, `rgba(60,54,50,${0.25 * (1 - g)})`); }
    c.fillStyle = mixColor('#4A4036', '#8A8278', g); c.fillRect(200, 720, 1520, 20);
    A.crowd(c, { x0: 260, x1: 1660, y: 930, n: 60, hMin: 70, hMax: 120, depth: 60, seed: 23, t, red: 1 - g, color: '#6A625A', tools: false, agit: 1 - g });
    G.text(c, 'THE CITIES', W / 2, 220, '900 100px Bodoni', P.ink, 'center', ramp(t, w('f019', 'cities') - 0.1, 0.4));
    G.text(c, 'workers, strikes, unions', W / 2, 290, 'italic 400 44px BodoniItalic', P.ink3, 'center', ramp(t, w('f019', 'cities'), 0.4));
    G.stamp(c, t, 'DESTROYED', w('f020', 'destroyed'), S.end + 0.2, { x: W / 2, y: 560, size: 150, rot: -0.1 });
  } },
{ id: 'S13', at: 'f021', trans: 'black', dark: true, desc: 'A secret meeting by lamplight: shadowed delegates at a table; Mao (young) stands to speak. Medallion with his 1925 photo. Date-line 7 August 1927.',
  sfx: [[f('f021'), 'night', 0.5, 6], [w('f021', 'secret'), 'creak', 0.5], [w('f022', 'Mao'), 'whoosh', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.05, 1.15, W / 2, H * 0.55, W * 0.56, H * 0.5, () => { PL.hallInterior(c, t, { mode: 'home', night: true, dark: 0.5 });
      PL.table(c, 960, 900, 760, 110, '#3A2E22'); PL.candle(c, 960, 790, t, 5);
      [[620, -1], [760, 1], [1160, -1], [1300, 1]].forEach(([x, fc], i) => A.figure(c, x, 900, 300, PL.shade(CH.zhou, '#1E1812'), { face: fc > 0 ? 1 : -1, seated: true, armF: 40, elbF: 50 }));
      const up = ramp(t, w('f022', 'Mao') - 0.5, 0.8); A.figure(c, 1500, 1000, lerp(330, 420, up), CH.maoY, { face: -1, armF: lerp(20, 80, up), elbF: 30 }); });
    G.dateLine(c, t, { at: f('f021') + 0.2, out: w('f022', 'Mao') - 0.1, event: 'An emergency party meeting', day: '7 August', year: 1927, mode: 'light', y: 150 });
    G.medallion(c, t, 'maoY', 330, 300, 120, w('f022', 'Mao') - 0.1, S.end + 0.2, { role: 'aged 33 · a farmer\'s son from Hunan' });
  } },
{ id: 'S14', at: 'f023', trans: 'cut', dark: true, desc: 'Quote card (reported speech, party record): "Political power grows out of the barrel of a gun." A rifle barrel rises behind.',
  sfx: [[f('f023'), 'whoosh', 0.4], [w('f023', 'barrel'), 'clang', 0.7], [w('f023', 'gun'), 'impact', 0.7]],
  draw(c, t, lt, S) {
    c.fillStyle = '#16120E'; c.fillRect(0, 0, W, H); const u = ramp(t, f('f023'), 2.6, easeIO);
    c.save(); c.translate(W * 0.82, lerp(1300, 760, u)); c.rotate(-0.25); c.fillStyle = '#3A2E22'; c.fillRect(-26, 0, 52, 420); c.fillStyle = '#5A5A58'; c.fillRect(-12, -520, 24, 540); c.fillRect(-20, -540, 40, 26); c.restore();
    G.quote(c, t, ['Political power', 'grows out of the barrel of a gun.'], f('f023') - 0.1, S.end + 0.3, { y: H * 0.46, size: 80, by: 'Mao Zedong · 7 August 1927 · as recorded by the party', stagger: 0.9 });
  } },
{ id: 'S15', at: 'f024', trans: 'whip', desc: 'Hunan, September 1927: peasants rise under red flags in the paddies — then a steel-blue Nationalist line advances; the crowd breaks. CRUSHED.',
  sfx: [[f('f024'), 'crowd', 0.6, 3], [w('f024', 'uprising'), 'roar', 0.5], [f('f025'), 'march', 0.6, 2], [w('f025', 'crushed'), 'stamp', 0.9]],
  draw(c, t, lt, S) {
    const cr = ramp(t, w('f025', 'crushed') - 0.6, 1.0);
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.5, H * 0.55, () => { PL.jiangxi(c, t, { dusk: 0.5 });
      A.crowd(c, { x0: 80, x1: 1100, y: 900, n: 70, hMin: 90, hMax: 160, depth: 120, seed: 29, t, red: ramp(t, w('f024', 'uprising') - 0.4, 1.0) * (1 - cr * 0.6), raise: 1 - cr, toolSet: ['pitchfork', 'spear', 'banner', 'staff', null], hat: 'cone', agit: 1 + cr * 2, march: cr ? -cr * 40 : 0 });
      const nx = lerp(2100, 1250, ramp(t, f('f025') - 0.4, 1.4, easeIO)); for (let i = 0; i < 7; i++) A.figure(c, nx + i * 110, 960 + (i % 2) * 30, 230, CH.natSoldier, { face: -1, walk: t * 5 + i, prop: 'rifle' }); });
    G.dateLine(c, t, { at: f('f024'), out: f('f025'), event: 'The Autumn Harvest Uprising, Hunan', day: 'September', year: 1927, mode: 'ink', y: 150 });
    G.stamp(c, t, 'CRUSHED', w('f025', 'crushed'), S.end + 0.2, { x: 640, y: 420, size: 140, rot: -0.1 });
  } },
{ id: 'S16', at: 'f026', trans: 'ink', desc: 'Map (Hunan–Jiangxi border): a small red token retreats from Hunan into the Jinggang Mountains. UNDER 1,000 MEN.',
  sfx: [[f('f026'), 'whoosh', 0.5], [w('f026', 'thousand'), 'tick', 0.6], [w('f027', 'Jinggang'), 'march', 0.4, 3]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.52, H * 0.5, () => { PL.cnMap(c, t, { view: V.south, labels: ['Changsha', 'Jinggangshan'], hi: 'Jinggangshan', cartouche: 'Hunan and Jiangxi · 1927' });
      const pts = [[28.15, 113.9], [27.6, 113.85], [27.1, 114.0], [26.57, 114.17]]; arrow(c, V.south, pts, ramp(t, f('f026') + 0.4, 3.4, easeIO), P.red, 9);
      const p = G.route(c, V.south, pts, ramp(t, f('f026') + 0.4, 3.4, easeIO), { color: 'rgba(0,0,0,0)', w: 1, arrow: false }) || xy(V.south, pts[0]); G.token(c, p[0], p[1], 30, P.red, 1); });
    G.slam(c, t, [{ t: 'UNDER 1,000' }, { t: 'men, by most accounts', small: true }], w('f026', 'thousand') - 0.05, S.end + 0.2, { x: 520, y: H * 0.3, size: 120, mode: 'ink' });
  } },
{ id: 'S17', at: 'f028', trans: 'cut', desc: 'A village road on the way up (Jinggang plate, dusk): Mao stops the ragged column and raises three fingers. THREE RULES.',
  sfx: [[w('f028', 'three'), 'drum', 0.4, 2], [w('f028', 'rules'), 'tick', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.05, 1.15, W / 2, H * 0.6, W * 0.42, H * 0.62, () => { PL.jinggang(c, t, { dusk: 0.6, path: 1 });
      A.crowd(c, { x0: 820, x1: 1700, y: 1000, n: 30, hMin: 160, hMax: 230, depth: 50, seed: 41, t, red: 0.8, hat: 'star', toolSet: ['rifle', 'spear', null], face: -1, agit: 0.3 });
      A.figure(c, 560, 1040, 380, CH.maoY, { face: 1, armF: lerp(10, 150, ramp(t, w('f028', 'three') - 0.3, 0.5)), elbF: 10 }); });
    G.slam(c, t, [{ t: 'THREE RULES' }], w('f028', 'three') - 0.05, S.end + 0.2, { x: 1260, y: H * 0.26, size: 130 });
  } },
{ id: 'S18', at: 'f029', trans: 'cut', desc: 'THE PLANT: the three rules written out, line by line; a single sweet potato drops onto rule two; the red REMEMBER tag pins on "Remember" (motif).',
  sfx: [[f('f029'), 'paper', 0.7], [w('f029', 'obey'), 'quill', 0.6, 1.2], [w('f030', 'sweet'), 'thud', 0.6], [w('f031', 'hand'), 'quill', 0.6, 1.2], [w('f032', 'Remember') - 0.05, 'motif', 1.0], [w('f032', 'Remember'), 'stamp', 0.6]],
  draw(c, t, lt, S) {
    parchment(c, t);
    cam(c, lt, S, 1.0, 1.22, W / 2, H / 2, W * 0.6, H * 0.56, () => {
      const rev = f('f029') < t ? (t < f('f030') ? 0.34 : t < f('f031') ? 0.66 : 1) : 0;
      G.ruleSheet(c, t, W / 2, H / 2 + 20, 980, 820, { reveal: Math.min(rev, ramp(t, f('f029') - 0.3, 4.5) + 0.3), potato: ramp(t, w('f030', 'sweet') - 0.2, 0.5, backOut), tag: ramp(t, w('f032', 'Remember') - 0.1, 0.3), rot: -0.015, glow: life(t, w('f032', 'matter'), S.end + 1, 0.3, 0.3) * 0.6 });
    });
  } },

// ================================================================ CH 2  The mountain
{ id: 'S19', at: 'f033', trans: 'black', desc: 'The Jinggang Mountains: mist, bamboo, the hideout village. Two bandit chiefs on a rock above the path.',
  sfx: [[f('f033') - 0.2, 'wind', 0.6, 6], [w('f033', 'bandit'), 'sting', 0.5], [w('f034', 'chiefs'), 'clang', 0.4]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.1, W / 2, H / 2, W * 0.4, H * 0.55, () => { PL.jinggang(c, t, { dusk: 0.2, path: 1 });
      fade(c, ramp(t, w('f034', 'chiefs') - 0.5, 0.6), () => { c.fillStyle = '#3A3428'; c.beginPath(); c.ellipse(560, 1000, 300, 70, 0, Math.PI, TAU); c.fill(); A.figure(c, 470, 960, 300, CH.bandit, { face: 1, prop: 'sword', armF: 30, elbF: 20 }); A.figure(c, 650, 966, 320, CH.bandit, { face: 1, armF: 10, elbF: 40, prop: 'spear' }); }); });
    G.dateLine(c, t, { at: f('f033') + 0.1, out: S.end - 0.2, event: 'The Jinggang Mountains', day: 'October', year: 1927, mode: 'ink', y: 150 });
    G.slam(c, t, [{ t: 'BANDIT COUNTRY' }], w('f033', 'bandit') - 0.05, f('f034'), { x: 1320, y: H * 0.42, size: 110 });
  } },
{ id: 'S20', at: 'f035', trans: 'cut', desc: 'Mao and a bandit chief face each other; the chief\'s men turn red behind him. RECRUITED, NOT FOUGHT.',
  sfx: [[w('f035', 'recruited'), 'gong', 0.5], [w('f035', 'fighting'), 'tick', 0.5]],
  draw(c, t, lt, S) {
    const u = ramp(t, w('f035', 'recruited') - 0.2, 1.2, easeIO);
    cam(c, lt, S, 1.1, 1.18, W / 2, H * 0.62, W / 2, H * 0.6, () => { PL.jinggang(c, t, { dusk: 0.3 });
      A.crowd(c, { x0: 1150, x1: 1850, y: 980, n: 26, hMin: 150, hMax: 210, depth: 50, seed: 47, t, red: u, color: '#4A3E30', toolSet: ['spear', 'sword', null], face: -1 });
      A.figure(c, 760, 1040, 400, CH.maoY, { face: 1, armF: lerp(10, 70, u), elbF: 20 }); A.figure(c, 1080, 1040, 410, CH.bandit, { face: -1, armF: lerp(10, 70, u), elbF: 20 }); });
    G.slam(c, t, [{ t: 'RECRUITED' }, { t: 'not fought', small: true }], w('f035', 'recruited') - 0.05, S.end + 0.2, { y: H * 0.24, size: 120 });
  } },
{ id: 'S21', at: 'f036', trans: 'whip', desc: 'Map: April 1928, Zhu De\'s column reaches the mountains (red arrow from the south-east). Zhu De medallion (photo).',
  sfx: [[f('f036'), 'whoosh', 0.5], [w('f036', 'survivor'), 'march', 0.5, 3], [w('f037', 'Zhu'), 'whoosh', 0.5], [w('f037', 'battered'), 'impact', 0.4]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.05, W / 2, H / 2, W * 0.5, H * 0.5, () => { PL.cnMap(c, t, { view: V.south, labels: ['Jinggangshan'], hi: 'Jinggangshan', cartouche: 'Spring 1928' });
      arrow(c, V.south, [[25.6, 116.6], [25.4, 115.6], [25.9, 114.6], [26.5, 114.25]], ramp(t, w('f036', 'survivor') - 0.4, 3, easeIO), P.red, 11); tok(c, V.south, 'Jinggangshan', P.red, 1, null, 24); });
    G.dateLine(c, t, { at: f('f036'), out: w('f037', 'Zhu'), event: 'Another survivor', day: 'April', year: 1928, from: 1927, mode: 'ink', y: 150 });
    G.medallion(c, t, 'zhu', 1560, 360, 130, w('f037', 'Zhu') - 0.1, S.end + 0.2, { role: 'a former warlord officer' });
  } },
{ id: 'S22', at: 'f038', trans: 'cut', desc: 'The hideout village: the red Army flag runs up the pole. THE FOURTH RED ARMY. Zhu and Mao side by side: commander / political chief.',
  sfx: [[w('f038', 'formed'), 'gong', 0.6], [w('f038', 'Fourth'), 'chant', 0.3, 3], [w('f039', 'commanded'), 'tick', 0.5], [w('f039', 'political'), 'tick', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.1, W / 2, H * 0.6, W * 0.56, H * 0.56, () => { PL.jinggang(c, t, { flag: ramp(t, w('f038', 'formed') - 0.4, 1.2, easeIO), dusk: 0.15 });
      A.crowd(c, { x0: 120, x1: 1800, y: 1010, n: 50, hMin: 110, hMax: 170, depth: 60, seed: 53, t, red: 0.9, hat: 'star', toolSet: ['rifle', 'spear', null] });
      fade(c, ramp(t, f('f039') - 0.3, 0.5), () => { A.figure(c, 760, 1060, 380, CH.zhu, { face: 1, prop: 'rifle' }); A.figure(c, 1080, 1060, 380, CH.maoY, { face: -1, armF: 30, elbF: 40 }); }); });
    G.slam(c, t, [{ t: 'THE FOURTH' }, { t: 'RED ARMY', red: true }], w('f038', 'Fourth') - 0.05, f('f039'), { y: H * 0.3, size: 130 });
    G.text(c, 'Zhu De · commander', 760, 330, 'italic 400 52px BodoniItalic', P.ink, 'center', life(t, w('f039', 'commanded') - 0.1, S.end, 0.3, 0.3));
    G.text(c, 'Mao · political chief', 1180, 400, 'italic 400 52px BodoniItalic', P.ink, 'center', life(t, w('f039', 'political') - 0.1, S.end, 0.3, 0.3));
  } },
{ id: 'S23', at: 'f040', trans: 'ink', desc: 'Split: a vast steel-blue army against a small red band: OUTNUMBERED · OUTGUNNED · SHORT OF EVERYTHING.',
  sfx: [[w('f040', 'outnumbered'), 'impact', 0.5], [w('f040', 'outgunned'), 'impact', 0.5], [w('f040', 'short'), 'impact', 0.5], [w('f041', 'different'), 'whoosh', 0.5]],
  draw(c, t, lt, S) {
    parchment(c, t); A.hills(c, 800, 40, 59, '#B9A57E'); c.fillStyle = '#9E8659'; c.fillRect(0, 820, W, 300);
    A.crowd(c, { x0: 820, x1: 1880, y: 840, n: 160, hMin: 60, hMax: 140, depth: 160, seed: 61, t, color: P.blue, far: '#8A98A6', hat: 'stahl', toolSet: ['rifle', null], face: -1 });
    A.crowd(c, { x0: 60, x1: 460, y: 900, n: 16, hMin: 90, hMax: 150, depth: 60, seed: 62, t, red: 1, hat: 'star', toolSet: ['spear', 'rifle', null, null], face: 1 });
    ['OUTNUMBERED', 'OUTGUNNED', 'SHORT OF EVERYTHING'].forEach((s, i) => G.text(c, s, 120, 220 + i * 92, '900 76px Bodoni', i === 2 ? P.red : P.ink, 'left', ramp(t, w('f040', ['outnumbered', 'outgunned', 'short'][i]) - 0.1, 0.25)));
    G.text(c, 'so they learned to fight a different way', W / 2, 1030, 'italic 400 50px BodoniItalic', P.ink, 'center', ramp(t, w('f041', 'different') - 0.3, 0.5));
  } },
{ id: 'S24', at: 'f042', trans: 'cut', desc: 'THE SPINE IS BORN: on parchment, a brush writes the sixteen characters, four lines of four; a brush hand moves along. "By May, Mao later wrote."',
  sfx: [[f('f042'), 'quill', 0.6, 3], [w('f042', 'sixteen'), 'gong', 0.5], [w('f043', 'Four'), 'tick', 0.5], [w('f043', 'four', 2), 'tick', 0.5]],
  draw(c, t, lt, S) {
    parchment(c, t); const br = lerp(0, 16, ramp(t, f('f042') + 0.3, e('f043') - f('f042') - 0.2, (u) => clamp(u)));
    cam(c, lt, S, 1.05, 1.0, W / 2, H / 2, W / 2, H / 2, () => G.sixteen(c, t, f('f042') - 0.3, S.end + 1, { brush: br, size: 96, y: H * 0.42, en: false }));
    G.text(c, 'by May 1928, Mao later wrote', W / 2, 250, 'italic 400 50px BodoniItalic', P.ink3, 'center', life(t, f('f042'), S.end, 0.3, 0.3));
    G.text(c, 'FOUR LINES OF FOUR', W / 2, 760, '600 40px Oswald', P.red, 'center', ramp(t, w('f043', 'Four') - 0.1, 0.3));
  } },
{ id: 'S25', at: 'f044', trans: 'cut', desc: 'The formula, line by line, each with a small tactical diagram on a map sheet: blue advances / red falls back; blue halts / red harasses; blue tires / red strikes; blue retreats / red pursues.',
  sfx: [[f('f044'), 'whoosh', 0.4], [f('f045'), 'whoosh', 0.4], [f('f046'), 'impact', 0.6], [f('f047'), 'march', 0.5, 2]],
  draw(c, t, lt, S) {
    parchment(c, t); const L = t < f('f045') ? 0 : t < f('f046') ? 1 : t < f('f047') ? 2 : 3, t0 = [f('f044'), f('f045'), f('f046'), f('f047')][L], u = clamp((t - t0) / 2.4);
    G.sixteen(c, t, f('f044') - 0.4, S.end + 1, { brush: 16, size: 70, y: 120, hi: L, title: false });
    c.save(); c.globalAlpha = 0.9; c.fillStyle = '#E3D6BA'; c.fillRect(260, 330, 1400, 620); c.strokeStyle = P.sepia; c.lineWidth = 3; c.strokeRect(272, 342, 1376, 596); c.restore();
    A.hills(c, 900, 60, 77 + L, '#C2B394', 270, 1650);
    const bx = [lerp(1500, 1000, u), 1100, 1100, lerp(1100, 1500, u)][L], rx = [lerp(800, 480, u), 700 + Math.sin(t * 6) * 60, lerp(560, 1000, easeIn(u)), lerp(700, 1150, u)][L];
    for (let i = 0; i < 5; i++) G.token(c, bx + (i % 3) * 60, 560 + Math.floor(i / 3) * 70 + (L === 2 ? Math.sin(t * 2 + i) * 6 : 0), 26, P.blue, L === 2 ? 0.6 : 1);
    for (let i = 0; i < 3; i++) G.token(c, rx + i * 50, 700 + (i % 2) * 40, 22, P.red, 1);
    if (L === 1) for (let i = 0; i < 3; i++) { const ph = (t * 1.5 + i * 0.33) % 1; if (ph < 0.2) puff(c, '#FFE2A0', bx + 40 + i * 40, 600, 30, 1 - ph * 5, 0.6); }
    if (L === 2 && u > 0.6) puff(c, '#FFE2A0', 1050, 600, 120, 1 - u, 0.6);
    G.text(c, G.SIXTEEN_EN[L].replace(' · ', ', '), W / 2, 1010, '900 70px Bodoni', P.ink, 'center', clamp((t - t0 + 0.1) / 0.3));
  } },
{ id: 'S26', at: 'f048', trans: 'cut', desc: 'The sixteen characters lift to the top edge over the mountain plate: the spine is in place. "The whole war is written in them."',
  sfx: [[w('f048', 'Watch'), 'whoosh', 0.5], [w('f048', 'whole'), 'gong', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W / 2, H * 0.55, () => PL.jinggang(c, t, { dusk: 0.4, flag: 1 })); dim(c, 0.25);
    const u = ramp(t, f('f048'), 1.4, easeIO); G.sixteen(c, t, f('f048') - 0.3, S.end + 1, { brush: 16, size: lerp(96, 62, u), y: lerp(H * 0.42, 100, u), light: true });
    G.text(c, 'the whole war is written in them', W / 2, 860, 'italic 400 60px BodoniItalic', '#F2E8D2', 'center', ramp(t, w('f048', 'whole') - 0.2, 0.4), 'rgba(0,0,0,0.6)');
  } },
{ id: 'S27', at: 'f049', trans: 'cut', desc: 'ECHO: the rule sheet again — rule two is struck through; the sweet potato is replaced by a needle and thread (motif, major); PAY · RETURN.',
  sfx: [[w('f050', 'sweet'), 'motif', 0.8], [w('f050', 'needle'), 'smallthing', 0.6], [w('f052', 'Pay'), 'coin', 0.6], [w('f052', 'Return'), 'tick', 0.5]],
  draw(c, t, lt, S) {
    parchment(c, t);
    cam(c, lt, S, 1.15, 1.05, W * 0.56, H * 0.56, W / 2, H / 2, () => G.ruleSheet(c, t, W / 2 - 160, H / 2 + 20, 900, 760, { reveal: 1, potato: 1, swap: ramp(t, w('f050', 'needle') - 0.6, 1.4, easeIO), rot: 0.01, date: '1927 · revised by 1929' }));
    G.text(c, 'PAY FOR WHAT YOU BUY', 1500, 420, '600 46px Oswald', P.ink, 'center', ramp(t, w('f052', 'Pay') - 0.1, 0.3)); G.groat(c, 1500, 520, 46, ramp(t, w('f052', 'Pay'), 0.3));
    G.text(c, 'RETURN WHAT YOU BORROW', 1500, 700, '600 46px Oswald', P.ink, 'center', ramp(t, w('f052', 'Return') - 0.1, 0.3));
  } },

// ================================================================ CH 3  Lure them in
{ id: 'S28', at: 'f053', trans: 'black', desc: 'Map: 1930, the Red Army moves east from the mountains into southern Jiangxi; the base area glows red.',
  sfx: [[f('f053'), 'whoosh', 0.5], [w('f053', 'Jiangxi'), 'march', 0.4, 3]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.05, W / 2, H / 2, W * 0.55, H * 0.55, () => { PL.cnMap(c, t, { view: V.south, soviet: ramp(t, w('f053', 'Jiangxi') - 0.2, 1.5), labels: ['Jinggangshan', 'Ruijin'], cartouche: 'Southern Jiangxi · 1930' });
      arrow(c, V.south, [[26.57, 114.17], [26.4, 114.9], [26.0, 115.6]], ramp(t, f('f053') + 0.4, 2, easeIO), P.red, 11); });
    G.dateLine(c, t, { at: f('f053') + 0.1, out: S.end - 0.1, event: 'Southern Jiangxi', year: 1930, from: 1928, mode: 'ink', y: 150 });
  } },
{ id: 'S29', at: 'f054', trans: 'cut', desc: 'Chiang sends an army: blue arrows close on the red base. Chiang medallion. "Mao did not stand and fight."',
  sfx: [[w('f054', 'army'), 'march', 0.6, 3], [w('f054', 'destroy'), 'impact', 0.6], [w('f055', 'not'), 'tick', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.04, W / 2, H / 2, W * 0.52, H * 0.52, () => { PL.cnMap(c, t, { view: V.south, soviet: 1, labels: ['Ruijin', 'Nanchang'], cartouche: 'The first campaign · 1930' });
      const u = ramp(t, w('f054', 'army') - 0.3, 2.4, easeIO); arrow(c, V.south, [[28.68, 115.86], [27.6, 115.7], [26.8, 115.6]], u, P.blue, 14); arrow(c, V.south, [[27.2, 117.5], [26.6, 116.9], [26.2, 116.4]], u, P.blue, 12); arrow(c, V.south, [[25.3, 113.3], [25.6, 114.3], [25.9, 115.0]], u, P.blue, 12); });
    G.medallion(c, t, 'chiang', 1640, 280, 100, w('f054', 'Chiang') - 0.1, S.end + 0.2, {});
    G.slam(c, t, [{ t: 'he did not', small: true }, { t: 'STAND AND FIGHT' }], w('f055', 'not') - 0.1, S.end + 0.2, { x: 620, y: H * 0.3, size: 100, mode: 'ink' });
  } },
{ id: 'S30', at: 'f056', trans: 'cut', desc: 'Jiangxi paddies: red soldiers fall back into a village; farmers wave them in and the doors close. Then a long blue column marches in, strung out, swallowed by mist.',
  sfx: [[w('f056', 'back'), 'march', 0.5, 3], [w('f056', 'hide'), 'creak', 0.5], [w('f057', 'marched'), 'march', 0.6, 4], [w('f057', 'lost'), 'wind', 0.5, 3]],
  draw(c, t, lt, S) {
    const phase2 = ramp(t, f('f057') - 0.3, 0.6);
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.5, H * 0.55, () => { PL.jiangxi(c, t, {});
      if (phase2 < 1) fade(c, 1 - phase2, () => { const u = ramp(t, f('f056'), 3, easeIO); for (let i = 0; i < 6; i++) A.figure(c, lerp(900, 1500, u) + i * 70, 980 + (i % 2) * 20, 200, CH.redSoldier, { face: 1, walk: u < 1 ? t * 5 + i : null, prop: 'rifle' }); A.figure(c, 1640, 1000, 220, CH.farmer, { face: -1, armF: 90 + Math.sin(t * 6) * 30, elbF: 10 }); });
      if (phase2 > 0) fade(c, phase2, () => { const k = (t - f('f057')) * 70; for (let i = 0; i < 12; i++) A.figure(c, 1900 - i * 150 - (k % 150), 960 + Math.sin(i) * 20, 170 - i * 4, CH.natSoldier, { face: 1, walk: t * 4 + i, prop: 'rifle' });
        for (let i = 0; i < 5; i++) puff(c, '#F2EAD8', 200 + i * 400, 900, 380, 0.5 * ramp(t, w('f057', 'lost') - 0.6, 1.2), 0.3); }); });
    G.slam(c, t, [{ t: 'DEEP INTO VILLAGES', size: 90 }, { t: 'that would hide them', small: true }], w('f056', 'villages') - 0.1, f('f057') - 0.1, { y: H * 0.24, size: 90 });
    G.slam(c, t, [{ t: 'STRUNG OUT', size: 90 }, { t: 'and lost', small: true }], w('f057', 'strung') - 0.05, S.end + 0.2, { y: H * 0.24, size: 90 });
  } },
{ id: 'S31', at: 'f058', trans: 'whip', desc: 'Tactical map: the blue column broken into segments; red arrows strike one segment at a time (three hits).',
  sfx: [[w('f058', 'struck'), 'impact', 0.8], [w('f058', 'one'), 'impact', 0.7], [w('f058', 'time'), 'impact', 0.7]],
  draw(c, t, lt, S) {
    parchment(c, t); c.save(); c.globalAlpha = 0.85; c.fillStyle = '#E3D6BA'; c.fillRect(160, 160, 1600, 760); c.restore(); A.hills(c, 880, 50, 81, '#C2B394', 160, 1760);
    const hits = [w('f058', 'struck'), w('f058', 'one'), w('f058', 'time')];
    for (let s = 0; s < 3; s++) { const x0 = 360 + s * 460, gone = ramp(t, hits[s] + 0.25, 0.5); for (let i = 0; i < 4; i++) G.token(c, x0 + i * 70, 560 + Math.sin(i + s) * 20, 26, P.blue, 1 - gone * 0.85);
      const u = ramp(t, hits[s] - 0.5, 0.5, easeIn); if (u > 0) { c.save(); c.strokeStyle = P.red; c.lineWidth = 14; c.beginPath(); c.moveTo(x0 + 100, 860); c.lineTo(x0 + 100, lerp(860, 610, u)); c.stroke(); c.restore(); if (u >= 1) puff(c, '#FFE2A0', x0 + 100, 580, 120, 1 - gone, 0.6); } }
    G.text(c, 'ONE COLUMN AT A TIME', W / 2, 1010, '900 70px Bodoni', P.red, 'center', ramp(t, w('f058', 'one') - 0.1, 0.3));
  } },
{ id: 'S32', at: 'f059', trans: 'cut', desc: 'Three campaigns, three FAILED stamps on Chiang\'s orders; then the first line of the sixteen characters is stamped red.',
  sfx: [[w('f059', 'three'), 'tick', 0.5], [w('f060', 'Three'), 'stamp', 0.8], [w('f060', 'failed'), 'stamp', 0.9], [w('f061', 'retreat'), 'gong', 0.7], [w('f061', 'worked'), 'impact', 0.5]],
  draw(c, t, lt, S) {
    parchment(c, t); const sp = ramp(t, f('f061') - 0.2, 0.8);
    fade(c, 1 - sp, () => { [0, 1, 2].forEach(i => { G.documentSheet(c, t, 520 + i * 440, 560, 380, 480, { rot: (i - 1) * 0.04 }); G.text(c, ['1st', '2nd', '3rd'][i] + ' CAMPAIGN', 520 + i * 440, 400, '600 34px Oswald', P.ink, 'center'); G.text(c, ['Dec 1930', 'May 1931', 'Jul 1931'][i], 520 + i * 440, 450, 'italic 400 30px BodoniItalic', P.ink3, 'center'); });
      [w('f060', 'Three'), w('f060', 'times'), w('f060', 'failed')].forEach((a, i) => G.stamp(c, t, 'FAILED', a, S.end + 1, { x: 520 + i * 440, y: 620, size: 80, rot: -0.15 + i * 0.1 })); });
    G.sixteen(c, t, f('f061') - 0.4, S.end + 1, { brush: 16, size: lerp(62, 92, sp), y: lerp(100, H * 0.42, sp), lines: [ramp(t, w('f061', 'retreat'), 0.6), 0, 0, 0], hi: 0, title: sp > 0.5 });
    G.text(c, 'the first line had worked', W / 2, 820, 'italic 400 58px BodoniItalic', P.red, 'center', ramp(t, w('f061', 'worked') - 0.2, 0.4));
  } },
{ id: 'S33', at: 'f062', trans: 'ink', desc: 'Ruijin, November 1931: the congress hall with red flags and the banner CHINESE SOVIET REPUBLIC; then the real 1931 founding parade photo.',
  sfx: [[f('f062'), 'crowd', 0.5, 4], [w('f062', 'declared'), 'gong', 0.7], [w('f063', 'Ruijin'), 'whoosh', 0.4]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W / 2, H * 0.55, () => { PL.jiangxi(c, t, { hall: 1 }); A.crowd(c, { x0: 300, x1: 1620, y: 980, n: 80, hMin: 80, hMax: 140, depth: 90, seed: 87, t, red: 0.85, hat: 'star', tools: false, raise: 0.3 }); });
    G.dateLine(c, t, { at: f('f062') + 0.1, out: w('f063', 'Ruijin') - 0.2, event: 'A state of their own', day: '7 November', year: 1931, from: 1930, mode: 'ink', y: 150 });
    const a0 = w('f063', 'Ruijin') - 0.2; if (t > a0 - 0.1) dim(c, 0.6 * ramp(t, a0, 0.5));
    G.archival(c, t, 'a_ruijin31', a0, S.end + 0.4, { caption: 'Founding parade of the Chinese Soviet Republic, Ruijin, 1931', credit: 'Archive photo · Wikimedia Commons · public domain', w: 1180, h: 680 });
  } },
{ id: 'S34', at: 'f064', trans: 'cut', desc: 'Its own laws, money and army: a list over the real photo of Red Army soldiers, 1931.',
  sfx: [[w('f064', 'laws'), 'tick', 0.6], [w('f064', 'money'), 'coin', 0.6], [w('f064', 'army'), 'march', 0.5, 2]],
  draw(c, t, lt, S) {
    c.fillStyle = '#16120E'; c.fillRect(0, 0, W, H);
    G.archival(c, t, 'a_redarmy31', f('f064') - 0.2, S.end + 0.4, { x: W * 0.36, w: 1040, h: 760, caption: 'Red Army soldiers, 1931', credit: 'Archive photo · Wikimedia Commons · public domain' });
    G.listPanel(c, t, ['its own laws', 'its own money', 'its own army'], [w('f064', 'laws') - 0.1, w('f064', 'money') - 0.1, w('f064', 'army') - 0.1], f('f064') - 0.1, S.end + 0.3, { x: 1260, y: 330, w: 600, title: 'A state of their own' });
  } },
{ id: 'S35', at: 'f065', trans: 'black', dark: true, desc: 'Something darker: a lamp-lit room; shadows of interrogators over a kneeling prisoner (silhouettes only); crimson tint grows; TRAITORS? / UNDER TORTURE / THOUSANDS SHOT (by most estimates) — medallions grey with red slashes.',
  sfx: [[f('f065'), 'night', 0.6, 8], [w('f065', 'darker'), 'sting', 0.5], [w('f066', 'traitors'), 'impact', 0.5], [w('f067', 'torture'), 'drum', 0.4, 2], [w('f068', 'thousands'), 'boom', 0.6], [w('f069', 'eating'), 'impact', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.05, 1.18, W / 2, H * 0.6, W * 0.46, H * 0.62, () => { PL.hallInterior(c, t, { mode: 'home', night: true, dark: 0.7 }); PL.candle(c, 960, 860, t, 9);
      A.figure(c, 980, 1000, 260, PL.shade(CH.redSoldier, '#0E0A08'), { face: -1, kneel: 1, armF: 10 }); A.figure(c, 700, 1020, 380, PL.shade(CH.redSoldier, '#0E0A08'), { face: 1, armF: 60, elbF: -20 }); A.figure(c, 1300, 1020, 380, PL.shade(CH.redSoldier, '#0E0A08'), { face: -1, prop: 'rifle' }); });
    tint(c, '#7A2216', 0.5 * ramp(t, w('f067', 'torture') - 0.5, 1.2));
    G.slam(c, t, [{ t: 'TRAITORS?' }, { t: 'in their own ranks', small: true }], w('f066', 'traitors') - 0.05, f('f067'), { y: H * 0.24, size: 120 });
    G.slam(c, t, [{ t: 'UNDER TORTURE', red: true }], w('f067', 'torture') - 0.05, f('f068'), { y: H * 0.24, size: 110 });
    if (t > f('f068') - 0.3) { dim(c, 0.55 * ramp(t, f('f068') - 0.3, 0.5)); for (let i = 0; i < 7; i++) G.medallion(c, t, 'redSoldier', 360 + i * 200, 560, 70, w('f068', 'thousands') - 0.2 + i * 0.12, S.end + 0.2, { noPlaque: true, grey: ramp(t, w('f068', 'shot') - 0.2, 0.6), slash: ramp(t, w('f068', 'shot') + i * 0.08, 0.3) }); }
    G.slam(c, t, [{ t: 'THOUSANDS SHOT', red: true }, { t: 'by most estimates', small: true }], w('f068', 'thousands') - 0.05, S.end + 0.2, { y: H * 0.24, size: 110 });
    G.text(c, 'the revolution was already eating its own', W / 2, 860, 'italic 400 54px BodoniItalic', '#F2E8D2', 'center', ramp(t, w('f069', 'eating') - 0.3, 0.5), 'rgba(0,0,0,0.6)');
  } },
{ id: 'S35b', at: 'f068', trans: 'cut', dark: true, desc: 'Thousands shot (by most estimates): rows of Red Army medallions grey and take a red slash; "the revolution was already eating its own".',
  sfx: [[w('f068', 'thousands'), 'boom', 0.6], [w('f068', 'shot'), 'impact', 0.6], [w('f069', 'eating'), 'impact', 0.5]],
  draw(c, t, lt, S) {
    c.fillStyle = '#14100C'; c.fillRect(0, 0, W, H); tint(c, '#7A2216', 0.3);
    for (let r_ = 0; r_ < 2; r_++) for (let i = 0; i < 7; i++) G.medallion(c, t, 'redSoldier', 300 + i * 220, 430 + r_ * 230, 80, f('f068') - 0.2 + (i + r_ * 7) * 0.06, S.end + 0.2, { noPlaque: true, grey: ramp(t, w('f068', 'shot') - 0.2, 0.6), slash: ramp(t, w('f068', 'shot') + (i + r_ * 7) * 0.05, 0.3) });
    G.slam(c, t, [{ t: 'THOUSANDS SHOT', red: true }, { t: 'by most estimates', small: true }], w('f068', 'thousands') - 0.05, f('f069'), { y: H * 0.2, size: 110 });
    G.text(c, 'the revolution was already eating its own', W / 2, 960, 'italic 400 58px BodoniItalic', '#F2E8D2', 'center', ramp(t, w('f069', 'eating') - 0.3, 0.5), 'rgba(0,0,0,0.6)');
  } },
];
