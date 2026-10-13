// Shots: chapters 5–8 (Taiping episode).
import { W, H, P, T, clamp, lerp, easeIO, easeOut, easeIn, backOut, ramp, life, rng, mixColor, rgba, parchment, withCam, push } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';
import * as PL from './plates.mjs';
import { dim, panel, tint, cam, fade, V, tok } from './shots_a.mjs';
const { CH } = A; const f = T.f, e = T.e, w = T.w;
const TAU = Math.PI * 2;
// red Taiping flags on the Nanjing wall (wall top y≈610)
const wallFlags = (c, t, a = 1, col = P.red) => fade(c, a, () => { for (let i = 0; i < 9; i++) { const x = 60 + i * 220; c.strokeStyle = P.ink2; c.lineWidth = 5; c.beginPath(); c.moveTo(x, 600); c.lineTo(x, 470); c.stroke(); const wv = Math.sin(t * 3 + i) * 7; c.fillStyle = col; c.beginPath(); c.moveTo(x, 470); c.lineTo(x + 80, 480 + wv); c.lineTo(x + 76, 522 + wv); c.lineTo(x, 516); c.fill(); } });
const decree = (c, t, x, y, o = {}) => G.documentSheet(c, t, x, y, 620, 760, { title: o.title ?? 'Laws of the Heavenly Kingdom', titleSize: 34, seal: true, sealText: 'T', sealAt: o.sealAt ?? 1, written: o.written ?? 1, seed: 9, ...o });
export { wallFlags };

export const SHOTS_B = [
// ================================================================ CH 5  The Heavenly Capital
{ id: 'S40', at: 'f071', trans: 'black', desc: 'Nanjing by day: red flags rise along the wall; date-line 19 March 1853; the calendar stamps 1853.',
  sfx: [[f('f071'), 'roar', 0.6], [w('f071', 'nineteenth'), 'tick', 0.5], [w('f071', 'Nanjing'), 'gong', 0.8], [w('f071', 'Nanjing') + 0.2, 'seal', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.55, H * 0.5, () => {
      PL.nanjing(c, t, { dusk: 0.15 });
      wallFlags(c, t, ramp(t, w('f071', 'took') - 0.2, 0.8));
      A.crowd(c, { x0: 900, x1: 1700, y: 1000, n: 60, hMin: 100, hMax: 170, depth: 60, seed: 71, t, red: 1, hair: true, raise: ramp(t, w('f071', 'Nanjing'), 0.6), face: 1 });
    });
    G.dateLine(c, t, { at: f('f071') + 0.1, out: S.end, event: 'Nanjing falls to the Taiping', day: '19 March', year: 1853, from: 1849, mode: 'light', y: 150 });
    G.calendar(c, t, w('f071', 'Nanjing') - 0.3, S.end + 0.3, 2, 3, { x: 1060, y: 900, light: true });
  } },
{ id: 'S41', at: 'f072', trans: 'smoke', dark: true, desc: 'The Manchu garrison quarter in crimson: gold-clad silhouettes grey out one by one. No gore. "By most accounts".',
  sfx: [[f('f072'), 'riot', 0.4, 4], [w('f072', 'massacred'), 'impact', 0.8]],
  draw(c, t, lt, S) {
    const k = ramp(t, w('f072', 'garrison') - 0.2, 2.6);
    cam(c, lt, S, 1.0, 1.06, W / 2, H * 0.55, W / 2, H * 0.58, () => {
      PL.nanjing(c, t, { dusk: 0.3, night: 0.5, fire: 0.5 });
      A.crowd(c, { x0: -100, x1: 2020, y: 1010, n: 70, hMin: 120, hMax: 200, depth: 70, seed: 72, t, color: mixColor('#A88A44', '#3A3632', k), far: mixColor('#7A6A44', '#2A2622', k), tools: false, agit: 0.3 });
    });
    tint(c, '#7A1C14', 0.45);
    G.text(c, 'by most accounts', W / 2, 260, 'italic 400 48px BodoniItalic', '#F2E8D2', 'center', ramp(t, f('f072'), 0.4), 'rgba(0,0,0,0.6)');
    G.slam(c, t, [{ t: 'MASSACRED', red: true }, { t: 'the Manchu garrison and its families', small: true }], w('f072', 'massacred') - 0.05, S.end + 0.2, { y: H * 0.42, size: 130 });
  } },
{ id: 'S42', at: 'f073', trans: 'cut', desc: 'Nanjing (callback plate) under red flags; script "Tianjing – the Heavenly Capital"; the Heavenly King\'s seal.',
  sfx: [[w('f073', 'Tianjing'), 'seal', 0.8], [w('f073', 'Heavenly'), 'gong', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.05, 1.0, W / 2, H * 0.5, W / 2, H * 0.5, () => { PL.nanjing(c, t, { dusk: 0.35 }); wallFlags(c, t); });
    G.scriptName(c, t, 'Tianjing', w('f073', 'Tianjing') - 0.2, S.end + 0.3, { y: H * 0.3, size: 200, role: 'the Heavenly Capital' });
    const sa = ramp(t, w('f073', 'Tianjing'), 0.25); if (sa > 0) { c.save(); c.translate(1620, 860); c.scale(1 + (1 - sa) * 1.3, 1 + (1 - sa) * 1.3); c.globalAlpha *= sa; G.heavenlySeal(c, 0, 0, 80); c.restore(); }
  } },
{ id: 'S43', at: 'f074', trans: 'cut', dark: true, desc: 'The throne hall: Hong walks to his throne and sits; dark doors slide shut on "rarely left it again".',
  sfx: [[f('f074'), 'creak', 0.5], [w('f074', 'rarely'), 'gate', 0.8]],
  draw(c, t, lt, S) {
    const u = ramp(t, f('f074'), 1.6, easeIO), shut = ramp(t, w('f074', 'rarely') - 0.2, 1.4, easeIO);
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.55, W / 2, H * 0.52, () => {
      PL.hallInterior(c, t, { mode: 'throne' });
      if (u < 1) A.figure(c, lerp(400, 960, u), lerp(1000, 760, u), 330, CH.hong, { face: 1, walk: t * 4 });
      else A.figure(c, 960, 760, 330, CH.hong, { face: 1, seated: true, armF: 20, elbF: 30 });
    });
    c.fillStyle = '#1A120C'; c.fillRect(0, 0, W / 2 * shut, H); c.fillRect(W - W / 2 * shut, 0, W / 2 * shut, H);
    c.fillStyle = P.gold; if (shut > 0) { c.fillRect(W / 2 * shut - 14, 0, 14, H); c.fillRect(W - W / 2 * shut, 0, 14, H); }
  } },
{ id: 'S44', at: 'f075', trans: 'ink', desc: 'A decree is written and sealed; a list of bans ticks in word by word: opium, foot-binding, prostitution, buying brides.',
  sfx: [[f('f075'), 'quill', 0.6, 2.5], [w('f075', 'laws'), 'seal', 0.6], [w('f076', 'Opium'), 'stamp', 0.5], [w('f076', 'foot'), 'stamp', 0.5], [w('f076', 'prostitution'), 'stamp', 0.5], [w('f076', 'buying'), 'stamp', 0.5]],
  draw(c, t, lt, S) {
    parchment(c, t);
    cam(c, lt, S, 1.0, 1.05, W / 2, H / 2, W * 0.48, H / 2, () => decree(c, t, 520, 560, { written: ramp(t, f('f075'), 3), sealAt: ramp(t, w('f075', 'laws'), 0.3) }));
    G.listPanel(c, t, ['Opium', 'Foot-binding', 'Prostitution', 'Buying brides'], [w('f076', 'Opium'), w('f076', 'foot'), w('f076', 'prostitution'), w('f076', 'buying')], f('f076') - 0.3, S.end + 0.3, { x: 980, y: 230, w: 760, title: 'Banned in the Heavenly Kingdom', size: 56 });
  } },
{ id: 'S45', at: 'f077', trans: 'cut', desc: 'Land shared equally – a field grid split between men and women, stamped ON PAPER; then women soldiers march with spears.',
  sfx: [[w('f077', 'paper'), 'stamp', 0.8], [w('f077', 'equally'), 'tick', 0.5], [w('f078', 'Women'), 'march', 0.6, 3]],
  draw(c, t, lt, S) {
    const sw = f('f078');
    if (t < sw - 0.15) {
      parchment(c, t);
      for (let j = 0; j < 4; j++) for (let i = 0; i < 10; i++) { const x = 360 + i * 120, y = 380 + j * 120, a = ramp(t, f('f077') + 0.5 + (i + j * 10) * 0.04, 0.3); if (a <= 0) continue; c.save(); c.globalAlpha = a; c.fillStyle = (i + j) % 2 ? '#B9A57E' : '#A8946A'; c.fillRect(x, y, 112, 112); c.restore();
        if (ramp(t, w('f077', 'men') - 0.2, 0.4) > 0) fade(c, ramp(t, w('f077', 'men') - 0.2 + i * 0.03, 0.3), () => A.figure(c, x + 56, y + 100, 80, (i + j) % 2 ? CH.tpWoman : CH.tpSoldier, { face: 1 })); }
      G.stamp(c, t, 'ON PAPER', w('f077', 'paper') - 0.05, S.end, { x: W / 2, y: 230, size: 110 });
    } else {
      cam(c, lt, S, 1.0, 1.06, W / 2, H * 0.6, W * 0.55, H * 0.6, () => {
        PL.nanjing(c, t, { dusk: 0.2 }); wallFlags(c, t);
        for (let i = 0; i < 7; i++) A.figure(c, ((i * 230 + (t - sw) * 70) % 2000) - 100, 1010 - (i % 2) * 20, 260, CH.tpWoman, { face: 1, walk: t * 5 + i, prop: 'spear' });
      });
      G.slam(c, t, [{ t: 'WOMEN' }, { t: 'as soldiers, and as officials', small: true }], w('f078', 'Women'), S.end + 0.2, { y: H * 0.28, size: 140 });
    }
  } },
{ id: 'S46', at: 'f079', trans: 'cut', desc: 'ECHO: the Taiping exam list, stamped with the Heavenly King\'s seal, a Bible beside it; on "women", a woman candidate.',
  sfx: [[w('f079', 'examinations'), 'paper', 0.7], [w('f079', 'Bible'), 'seal', 0.8], [w('f080', 'women'), 'tick', 0.6]],
  draw(c, t, lt, S) {
    parchment(c, t); tint(c, P.red, 0.06);
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.46, H * 0.5, () => {
      G.passList(c, t, 720, 540, 700, 640, { reveal: ramp(t, w('f079', 'examinations') - 0.4, 0.9), seal: ramp(t, w('f079', 'Bible'), 0.3), caption: 'Taiping examination · Tianjing 1853' });
      fade(c, ramp(t, w('f079', 'Bible') - 0.2, 0.4), () => { c.save(); c.translate(1300, 760); c.scale(3.2, 3.2); c.fillStyle = '#1E1A15'; c.fillRect(-40, -54, 80, 108); c.fillStyle = P.gold; c.fillRect(-5, -36, 10, 60); c.fillRect(-20, -18, 40, 10); c.restore(); });
      fade(c, ramp(t, w('f080', 'women') - 0.3, 0.5), () => A.figure(c, 1640, 1000, 360, { ...CH.tpWoman, body: 'robe', robe: '#7A3A2A', edge: '#1E1A15', lapel: '#1E1A15' }, { face: -1, prop: 'brush', armF: 60, elbF: 50 }));
    });
    G.text(c, 'by some accounts', 1640, 560, 'italic 400 40px BodoniItalic', P.ink2, 'center', ramp(t, w('f080', 'by') - 0.1, 0.4));
  } },
{ id: 'S47', at: 'f081', trans: 'cut', desc: 'ECHO of the plant: the same list, the Heavenly King\'s medallion at its head, the red REMEMBER tag – "the man who had failed the exams now wrote them".',
  sfx: [[f('f081') - 0.05, 'motif', 0.9], [w('f081', 'wrote'), 'seal', 0.7]],
  draw(c, t, lt, S) {
    parchment(c, t); tint(c, P.red, 0.06);
    cam(c, lt, S, 1.15, 1.3, 720, 470, 700, 430, () => G.passList(c, t, 720, 540, 700, 640, { reveal: 1, seal: 1, tag: ramp(t, f('f081'), 0.3), caption: 'Taiping examination · Tianjing 1853' }));
    G.medallion(c, t, 'hongStudent', 1500, 380, 120, f('f081') - 0.1, w('f081', 'wrote'), { noPlaque: true, grey: 0.4 });
    G.medallion(c, t, 'hong', 1500, 380, 120, w('f081', 'wrote') - 0.1, S.end + 0.3, { role: 'now the examiner' });
    G.slam(c, t, [{ t: 'the failed student', small: true }, { t: 'NOW WROTE THEM', red: true }], w('f081', 'now') - 0.05, S.end + 0.2, { x: 1460, y: 900, size: 70, mode: 'ink' });
  } },
{ id: 'S48', at: 'f082', trans: 'cut', desc: 'The decree (callback) fades back to blank paper – "never left the page"; a wall rises between the men\'s and women\'s camps.',
  sfx: [[w('f082', 'never'), 'paper', 0.6], [w('f083', 'apart'), 'gate', 0.7], [w('f083', 'husbands'), 'thud', 0.5]],
  draw(c, t, lt, S) {
    const sw = f('f083');
    if (t < sw - 0.15) { parchment(c, t); cam(c, lt, S, 1.0, 1.04, W / 2, H / 2, W / 2, H / 2, () => decree(c, t, W / 2, 560, { written: 1 - ramp(t, w('f082', 'never') - 0.2, 1.4, easeIO) })); }
    else {
      parchment(c, t);
      const wh = ramp(t, w('f083', 'apart') - 0.3, 0.8, easeOut); c.fillStyle = '#4E4234'; c.fillRect(W / 2 - 40, 1000 - 620 * wh, 80, 620 * wh); for (let k = 0; k < 3; k++) c.fillRect(W / 2 - 52 + k * 40, 1000 - 620 * wh - 24, 24, 24);
      for (let i = 0; i < 6; i++) A.figure(c, 180 + i * 120, 1000 - (i % 2) * 20, 240, CH.tpSoldier, { face: 1 });
      for (let i = 0; i < 6; i++) A.figure(c, 1140 + i * 120, 1000 - (i % 2) * 20, 220, CH.tpWoman, { face: -1 });
      G.text(c, 'men', 480, 640, 'italic 400 56px BodoniItalic', P.ink, 'center', 1); G.text(c, 'women', 1440, 640, 'italic 400 56px BodoniItalic', P.ink, 'center', 1);
      G.slam(c, t, [{ t: 'even husbands and wives', small: true }], w('f083', 'husbands') - 0.1, S.end + 0.2, { y: 220, size: 120, mode: 'ink' });
    }
  } },
{ id: 'S49', at: 'f084', trans: 'whip', desc: 'Followers with empty hands in the street; then the throne hall glowing gold – the kings\' palaces and harems.',
  sfx: [[f('f084'), 'murmur', 0.5, 3], [w('f085', 'palaces'), 'coins', 0.6], [w('f085', 'harems'), 'bell', 0.4]],
  draw(c, t, lt, S) {
    const sw = f('f085');
    if (t < sw - 0.1) {
      cam(c, lt, S, 1.0, 1.06, W / 2, H * 0.6, W / 2, H * 0.6, () => { PL.nanjing(c, t, { dusk: 0.3 }); wallFlags(c, t); A.crowd(c, { x0: -100, x1: 2020, y: 1010, n: 60, hMin: 140, hMax: 220, depth: 60, seed: 84, t, red: 1, hair: true, tools: false, agit: 0.3 }); });
      G.slam(c, t, [{ t: 'OWN NOTHING' }], w('f084', 'own') - 0.05, sw, { y: H * 0.26, size: 140 });
    } else {
      cam(c, lt, S, 1.1, 1.0, W / 2, H * 0.5, W / 2, H * 0.5, () => {
        PL.hallInterior(c, t, { mode: 'throne' });
        A.figure(c, 960, 760, 330, CH.hong, { face: 1, seated: true, armF: 20, elbF: 30 });
        A.figure(c, 560, 1000, 340, CH.yang, { face: 1 }); for (let i = 0; i < 4; i++) A.figure(c, 1300 + i * 120, 1000, 260, { ...CH.hakkaWoman, robe: '#8A2A22', cone: null, edge: P.gold, lapel: P.gold }, { face: -1 });
      });
      tint(c, P.gold, 0.15 * ramp(t, sw, 0.6));
      G.slam(c, t, [{ t: 'PALACES' }, { t: 'and harems', small: true }], w('f085', 'palaces') - 0.05, S.end + 0.2, { y: H * 0.22, size: 130 });
    }
  } },

// ================================================================ CH 6  The scholar's army
{ id: 'S50', at: 'f086', trans: 'black', desc: 'Qing troops (blue, conical hats) fall back across the frame. FAILING.',
  sfx: [[f('f086'), 'march', 0.6, 2.5], [w('f086', 'failing'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    const u = ramp(t, f('f086'), 3, easeIn);
    cam(c, lt, S, 1.0, 1.06, W / 2, H * 0.6, W / 2, H * 0.6, () => { PL.yangtze(c, t, { city: false, dusk: 0.5 }); A.crowd(c, { x0: 300 - u * 900, x1: 1900 - u * 900, y: 1000, n: 60, hMin: 130, hMax: 210, depth: 60, seed: 86, t, color: P.blue, far: '#5A6A7A', hat: 'cone', face: -1, agit: 1.6 }); });
    G.slam(c, t, [{ t: 'FAILING' }], w('f086', 'failing') - 0.05, S.end + 0.2, { y: H * 0.28, size: 160 });
  } },
{ id: 'S51', at: 'f087', trans: 'cut', desc: 'Zeng Guofan: full figure on parchment, brush in hand; script "Zeng Guofan · a scholar from Hunan"; medallion.',
  sfx: [[w('f087', 'scholar'), 'whoosh', 0.5], [w('f087', 'Zeng'), 'gong', 0.6]],
  draw(c, t, lt, S) {
    parchment(c, t);
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.55, W * 0.45, H * 0.55, () => A.figure(c, 640, 1040, 760, CH.zengF, { face: 1, prop: 'brush', armF: 60, elbF: 60 }));
    G.scriptName(c, t, 'Zeng Guofan', w('f087', 'Zeng') - 0.2, S.end + 0.3, { x: 1320, y: H * 0.42, size: 150, mode: 'ink', role: 'a Confucian scholar from Hunan' });
    G.medallion(c, t, 'zengF', 1320, 760, 110, w('f087', 'Zeng') + 0.2, S.end + 0.3, { noPlaque: true });
  } },
{ id: 'S52', at: 'f088', trans: 'whip', desc: 'Face to face: Hong the failed student (brown) and Zeng the official (gold). "Everything Hong was not."',
  sfx: [[f('f088'), 'whoosh', 0.5], [w('f088', 'not'), 'impact', 0.5]],
  draw(c, t, lt, S) {
    parchment(c, t);
    c.fillStyle = 'rgba(42,36,29,0.8)'; c.fillRect(W / 2 - 3, 160, 6, 820);
    A.figure(c, 600, 980, 520, CH.hongStudent, { face: 1, prop: 'tract', armF: 50, elbF: 50 });
    A.figure(c, 1320, 980, 540, CH.zengF, { face: -1, prop: 'brush', armF: 50, elbF: 50 });
    G.text(c, 'failed four times', 600, 300, 'italic 400 46px BodoniItalic', P.ink2, 'center', ramp(t, f('f088'), 0.4));
    G.slam(c, t, [{ t: 'EVERYTHING' }, { t: 'HONG WAS NOT', red: true }], w('f088', 'everything') - 0.05, S.end + 0.2, { x: 1320, y: 260, size: 80, mode: 'ink' });
  } },
{ id: 'S53', at: 'f089', trans: 'cut', desc: 'ECHO: a Qing pass list – the first column gilded: Zeng\'s name at the top. "Passed every examination."',
  sfx: [[f('f089') - 0.05, 'motif', 0.7], [w('f089', 'passed'), 'bell', 0.6]],
  draw(c, t, lt, S) {
    parchment(c, t);
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.55, H * 0.46, () => G.passList(c, t, 980, 540, 760, 640, { reveal: 1, top: ramp(t, w('f089', 'passed') - 0.2, 0.5), seed: 33, caption: 'Metropolitan examination · Beijing 1838' }));
    G.medallion(c, t, 'zengF', 1530, 300, 100, w('f089', 'passed') - 0.2, S.end + 0.3, { role: 'passed every examination' });
  } },
{ id: 'S54', at: 'f090', trans: 'cut', desc: 'Map: blue tokens appear across Hunan, village by village; then the Hunan Army drills under blue banners – "loyal to its own officers".',
  sfx: [[f('f090'), 'tick', 0.5], [w('f091', 'village'), 'tick', 0.5], [w('f091', 'village', 2), 'tick', 0.5], [w('f091', 'loyal'), 'march', 0.7, 3]],
  draw(c, t, lt, S) {
    const sw = w('f091', 'loyal') - 0.3;
    if (t < sw) {
      cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.42, H * 0.6, () => {
        PL.chinaMap(c, t, { labels: ['Hunan', 'Changsha', 'Wuchang', 'Nanjing'], hi: 'Hunan' });
        const [hx, hy] = G.proj(V.cn, ...G.PLACES.Hunan); for (let i = 0; i < 16; i++) { const r = rng(90 + i); G.token(c, hx + (r() - 0.5) * 260, hy + (r() - 0.5) * 200, 14, P.blue, ramp(t, f('f090') + 0.3 + i * 0.3, 0.3)); }
      });
      G.scriptName(c, t, 'the Hunan Army', w('f091', 'Hunan') - 0.2, sw, { y: H * 0.2, size: 130, mode: 'ink' });
    } else {
      cam(c, lt, S, 1.0, 1.06, W / 2, H * 0.6, W * 0.55, H * 0.6, () => {
        PL.field(c, t, { seed: 21, c1: '#A8946E', c2: '#8E7A56', g0: '#8E7A52', g1: '#5E4A32', dusk: 0.2 });
        for (let i = 0; i < 9; i++) A.figure(c, 160 + i * 200, 1000 - (i % 2) * 24, 300, CH.hunanSoldier, { face: 1, prop: i % 3 === 0 ? 'flag' : 'spear', propColor: P.blue, walk: t * 4 + i, t });
      });
      G.slam(c, t, [{ t: 'LOYAL' }, { t: 'to its own officers', small: true }], w('f091', 'loyal') - 0.05, S.end + 0.2, { y: H * 0.24, size: 140 });
    }
  } },
{ id: 'S55', at: 'f092', trans: 'fade', dark: true, desc: 'Dusk on the river after a defeat: Zeng alone on the bank. Date-line "An early defeat" 1854. (The attempt is only narrated.)',
  sfx: [[f('f092'), 'water', 0.6, 5], [w('f092', 'drown'), 'bell', 0.4]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.1, W / 2, H * 0.6, W * 0.4, H * 0.62, () => {
      PL.yangtze(c, t, { city: false, dusk: 0.6, night: 0.45, fleet: 3, fleetX: (t - f('f092')) * 20 });
      A.figure(c, 640, 760, 260, PL.shade(CH.zengF, '#2A2018'), { face: 1, armF: 4, elbF: 4 });
    });
    G.dateLine(c, t, { at: f('f092') + 0.2, out: S.end, event: 'An early defeat', year: 1854, from: 1850, mode: 'light', y: 150 });
    G.calendar(c, t, f('f092') + 0.3, S.end + 0.3, 3, 4, { x: 1060, y: 940, light: true });
  } },
{ id: 'S56', at: 'f093', trans: 'whip', desc: 'Map of the north: a red arrow drives from Nanjing towards Beijing and stops short near Tianjin; Beijing pulses gold.',
  sfx: [[f('f093'), 'drum', 0.7, 6], [w('f094', 'striking'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.5, H * 0.42, () => {
      PL.chinaMap(c, t, { view: V.north, labels: ['Nanjing', 'Beijing', 'Tianjin'], hi: 'Beijing', cartouche: 'The Northern Expedition · 1853–55' });
      G.route(c, V.north, ['Nanjing', [34.4, 116.9], [36.6, 115.6], [38.5, 116.6]], ramp(t, f('f093'), 3.8, easeIO), { w: 9 });
      const [bx, by] = G.proj(V.north, ...G.PLACES.Beijing); c.strokeStyle = P.gold; c.lineWidth = 6; c.globalAlpha = 0.6 + 0.4 * Math.sin(t * 5); c.beginPath(); c.arc(bx, by, 40 + 8 * Math.sin(t * 5), 0, TAU); c.stroke(); c.globalAlpha = 1;
    });
    G.slam(c, t, [{ t: 'TO TAKE BEIJING' }], w('f093', 'Beijing') - 0.05, f('f094'), { y: H * 0.82, size: 110, mode: 'ink' });
  } },
{ id: 'S57', at: 'f095', trans: 'cut', desc: 'Snow falls on the map; the red army tokens freeze and grey out. WIPED OUT · 1855. Calendar 1855.',
  sfx: [[f('f095'), 'wind', 0.8, 4], [w('f095', 'wiped'), 'stamp', 0.9]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.04, W * 0.5, H * 0.42, W * 0.5, H * 0.42, () => {
      PL.chinaMap(c, t, { view: V.north, labels: ['Nanjing', 'Beijing', 'Tianjin'], cartouche: 'The Northern Expedition · 1853–55' });
      G.route(c, V.north, ['Nanjing', [34.4, 116.9], [36.6, 115.6], [38.5, 116.6]], 1, { w: 9, color: mixColor(P.red, '#7A7A7A', ramp(t, w('f095', 'starved'), 1.2)), arrow: false });
      for (let i = 0; i < 8; i++) { const [x, y] = G.proj(V.north, 38.3 + Math.sin(i) * 0.4, 116.4 + Math.cos(i * 1.7) * 0.5); G.token(c, x, y, 16, mixColor(P.red, '#8A8A86', ramp(t, w('f095', 'froze') + i * 0.12, 0.4)), 1); }
    });
    tint(c, '#A8B4C0', 0.35 * ramp(t, f('f095'), 1));
    const r = rng(95); c.fillStyle = 'rgba(250,250,255,0.85)'; for (let i = 0; i < 160; i++) { const x = (r() * W + Math.sin(t + i) * 30) % W, y = (r() * H + t * (40 + r() * 60)) % H; c.beginPath(); c.arc(x, y, 1.5 + r() * 2.5, 0, TAU); c.fill(); }
    G.stamp(c, t, 'WIPED OUT · 1855', w('f095', 'wiped') - 0.05, S.end + 0.2, { x: W / 2, y: 800, size: 100 });
    G.calendar(c, t, f('f095') + 0.3, S.end + 0.3, 4, 5, { x: 140, y: 110 });
  } },
{ id: 'S58', at: 'f096', trans: 'cut', desc: 'The lower Yangtze: city tokens flip red, blue, red, blue – a grinding stalemate.',
  sfx: [[w('f096', 'grinding'), 'drum', 0.5, 4], [w('f097', 'again'), 'tick', 0.6], [w('f097', 'again', 2), 'tick', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.5, H * 0.5, () => {
      PL.chinaMap(c, t, { view: { lon: 116, lat: 30.5, span: 11 }, labels: ['Wuchang', 'Anqing', 'Nanjing'], cartouche: 'The Yangtze · 1855–58' });
      const pts = [[29.7, 115.9], [30.2, 115.1], [30.5, 117.0], [31.3, 118.4], [30.9, 117.8], [29.9, 116.8], [30.6, 114.3], [31.6, 117.2]];
      pts.forEach((p, i) => { const k = Math.floor((t - f('f096')) * 1.6 + i * 0.7); const [x, y] = G.proj({ lon: 116, lat: 30.5, span: 11 }, p[0], p[1]); G.token(c, x, y, 24, k % 2 ? P.blue : P.red, ramp(t, f('f096') + i * 0.1, 0.3)); });
    });
    G.slam(c, t, [{ t: 'STALEMATE' }], w('f096', 'stalemate') - 0.05, S.end + 0.2, { y: H * 0.2, size: 130, mode: 'ink' });
  } },
{ id: 'S59', at: 'f098', trans: 'cut', desc: 'A river city smoulders; a grey line of refugees walks the bank. "The people inside paid the price."',
  sfx: [[f('f098'), 'fire', 0.5, 3], [w('f098', 'price'), 'thud', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.55, W * 0.55, H * 0.6, () => {
      PL.yangtze(c, t, { fire: 0.5, dusk: 0.5 });
      PL.ground(c, 960, '#7E6A48', '#4A3A26');
      for (let i = 0; i < 12; i++) A.figure(c, ((i * 160 + (t - f('f098')) * 40) % 2100) - 100, 1040 - (i % 2) * 14, 160, PL.shade(i % 3 ? CH.villager : CH.hakkaWoman, '#4A4440'), { face: 1, walk: t * 3 + i });
    });
    G.slam(c, t, [{ t: 'the people paid', small: true }], w('f098', 'people') - 0.1, S.end + 0.2, { y: H * 0.24, size: 120 });
  } },

// ================================================================ CH 7  The voice of God
{ id: 'S60', at: 'f099', trans: 'black', dark: true, desc: 'Nanjing by night: the palace windows lit inside the walls. Calendar 1856.',
  sfx: [[f('f099'), 'night', 0.7, 5], [w('f099', 'danger'), 'sting', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.12, W / 2, H / 2, W * 0.4, H * 0.48, () => { PL.nanjing(c, t, { night: 0.9 }); wallFlags(c, t, 1, '#7A2018'); });
    G.calendar(c, t, f('f099') + 0.4, S.end + 0.3, 5, 6, { x: 1060, y: 900, light: true });
  } },
{ id: 'S61', at: 'f100', trans: 'cut', dark: true, desc: 'The East King\'s palace by night: Yang falls into a trance, arms raised, a halo of rays; "the voice of God".',
  sfx: [[w('f100', 'gift'), 'bell', 0.5], [w('f101', 'trances'), 'chant', 0.6, 4], [w('f101', 'God'), 'gong', 0.7]],
  draw(c, t, lt, S) {
    const tr = ramp(t, w('f101', 'trances') - 0.3, 1.0, easeIO);
    cam(c, lt, S, 1.0, 1.12, W / 2, H * 0.5, W / 2, H * 0.46, () => {
      PL.hallInterior(c, t, { mode: 'east' });
      if (tr > 0) { c.save(); c.globalAlpha = tr * 0.5; c.strokeStyle = '#F2D79A'; c.lineWidth = 6; for (let k = 0; k < 24; k++) { const a = k / 24 * TAU + t * 0.2; c.beginPath(); c.moveTo(960 + Math.cos(a) * 90, 470 + Math.sin(a) * 90); c.lineTo(960 + Math.cos(a) * (240 + 40 * Math.sin(t * 6 + k)), 470 + Math.sin(a) * (240 + 40 * Math.sin(t * 6 + k))); c.stroke(); } c.restore(); }
      A.figure(c, 960, 760, 330, CH.yang, { face: 1, armF: lerp(20, 155, tr), elbF: lerp(30, 10, tr), armB: lerp(-10, -150, tr) });
    });
    G.medallion(c, t, 'yang', 1600, 300, 100, f('f100') - 0.1, w('f101', 'trances'), { role: 'the East King' });
    G.scriptName(c, t, 'the voice of God', w('f101', 'spoke') - 0.2, S.end + 0.3, { y: H * 0.86, size: 120 });
  } },
{ id: 'S62', at: 'f102', trans: 'cut', dark: true, desc: 'Yang towers in the rays; Hong, small, bows before him. WHIPPED – a whip-crack on the word.',
  sfx: [[w('f102', 'orders'), 'impact', 0.5], [w('f103', 'whipped'), 'whip', 1.0], [w('f103', 'whipped') + 0.35, 'whip', 0.7]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.5, W * 0.55, H * 0.5, () => {
      PL.hallInterior(c, t, { mode: 'east' });
      c.save(); c.globalAlpha = 0.45; c.strokeStyle = '#F2D79A'; c.lineWidth = 6; for (let k = 0; k < 24; k++) { const a = k / 24 * TAU + t * 0.2; c.beginPath(); c.moveTo(1180 + Math.cos(a) * 110, 360 + Math.sin(a) * 110); c.lineTo(1180 + Math.cos(a) * 330, 360 + Math.sin(a) * 330); c.stroke(); } c.restore();
      A.figure(c, 1180, 1040, 640, CH.yang, { face: -1, armF: 150, elbF: 10, armB: -150 });
      A.figure(c, 600, 990, 300, CH.hong, { face: 1, lean: lerp(0, 18, ramp(t, w('f102', 'Heavenly'), 0.6)), armF: 4, elbF: 4 });
    });
    G.slam(c, t, [{ t: 'Hong himself', small: true }, { t: 'WHIPPED', red: true }], w('f103', 'whipped') - 0.05, S.end + 0.2, { y: H * 0.24, size: 150 });
  } },
{ id: 'S63', at: 'f104', trans: 'cut', dark: true, desc: 'Date-line 1856: Yang alone in his hall, pacing.',
  sfx: [[f('f104'), 'tick', 0.5], [w('f104', 'more'), 'sting', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H * 0.55, W * 0.55, H * 0.55, () => { PL.hallInterior(c, t, { mode: 'east' }); const u = (t - f('f104')) * 0.35; A.figure(c, 760 + Math.sin(u * 2) * 300, 1000, 380, CH.yang, { face: Math.cos(u * 2) > 0 ? 1 : -1, walk: t * 4 }); });
    G.dateLine(c, t, { at: f('f104') + 0.1, out: S.end, event: 'Tianjing', day: 'summer', year: 1856, from: 1852, mode: 'light', y: 150 });
  } },
{ id: 'S64', at: 'f105', trans: 'cut', desc: 'Two medallions: Hong – "Lord of Ten Thousand Years"; Yang – a counter rolls 9,000 → 10,000 on "demanded".',
  sfx: [[w('f105', 'Ten'), 'gong', 0.6], [w('f106', 'Nine'), 'tick', 0.6], [w('f106', 'demanded'), 'impact', 0.8], [w('f106', 'same'), 'sting', 0.5]],
  draw(c, t, lt, S) {
    parchment(c, t); tint(c, P.red, 0.08);
    G.medallion(c, t, 'hong', 620, 420, 150, f('f105') - 0.1, S.end + 0.3, {});
    G.text(c, 'Lord of', 620, 760, 'italic 400 44px BodoniItalic', P.ink2, 'center', ramp(t, w('f105', 'Lord') - 0.1, 0.3));
    G.counter(c, t, 10000, 10000, w('f105', 'Ten') - 0.1, 0.1, 620, 860, { size: 110, color: P.red, mode: 'ink', label: 'years', labelColor: P.ink3 });
    G.medallion(c, t, 'yang', 1300, 420, 150, w('f106', 'Yang') - 0.2, S.end + 0.3, {});
    G.counter(c, t, 9000, 10000, w('f106', 'demanded') - 0.1, 0.9, 1300, 860, { size: 110, color: P.ink, mode: 'ink', label: 'years', labelColor: P.ink3, out: S.end + 0.3 });
  } },
{ id: 'S65', at: 'f107', dark: true, desc: 'The throne hall: Hong on his throne, still; a slow push in. Silence (mid-roll break follows).',
  sfx: [[f('f107') + 0.4, 'thud', 0.3]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.22, W / 2, H * 0.5, W / 2, H * 0.42, () => { PL.hallInterior(c, t, { mode: 'throne', dark: lerp(0.3, 0.7, ramp(t, f('f107'), 4)) }); A.figure(c, 960, 760, 330, CH.hong, { face: 1, seated: true, armF: 20, elbF: 30 }); });
    G.slam(c, t, [{ t: 'Hong appeared to agree', small: true }], f('f107'), e('f107') + 1.3, { y: H * 0.86, size: 110 });
  } },
{ id: 'S66', at: 'f108', trans: 'black', dark: true, desc: 'A shadowed figure crosses the night city: Wei Changhui, summoned in secret (medallion).',
  sfx: [[f('f108'), 'night', 0.7, 5], [w('f108', 'secretly'), 'whoosh', 0.5], [w('f108', 'Wei'), 'sting', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.55, W * 0.55, H * 0.6, () => { PL.nanjing(c, t, { night: 0.95 }); const u = ramp(t, f('f108'), 4.5); A.figure(c, lerp(200, 1400, u), 1010, 300, PL.shade(CH.wei, '#0E0C0A'), { face: 1, walk: t * 5, prop: 'sword', armF: 10, elbF: 10 }); });
    G.medallion(c, t, 'wei', 1600, 320, 110, w('f108', 'Wei') - 0.3, S.end + 0.3, { role: 'the North King' });
    G.text(c, 'by most accounts', 400, 220, 'italic 400 44px BodoniItalic', '#E6D9BE', 'left', ramp(t, f('f108'), 0.4), 'rgba(0,0,0,0.6)');
  } },
{ id: 'S67', at: 'f109', trans: 'cut', dark: true, desc: 'Date-line 2 September 1856; shadow-men with swords storm the East King\'s hall; Yang\'s medallion greys with a red slash on "killed".',
  sfx: [[w('f109', 'second'), 'tick', 0.5], [w('f110', 'stormed'), 'scuffle', 0.9], [w('f110', 'stormed'), 'gate', 0.6], [w('f110', 'killed'), 'slash', 0.9]],
  draw(c, t, lt, S) {
    const k = w('f110', 'killed');
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.5, W * 0.52, H * 0.5, () => {
      PL.hallInterior(c, t, { mode: 'east', dark: 0.7 });
      const u = ramp(t, w('f110', 'stormed') - 0.3, 1.4, easeOut); for (let i = 0; i < 5; i++) A.figure(c, lerp(-200, 520 + i * 150, u), 1020, 320, PL.shade(CH.tpSoldier, '#0E0C0A'), { face: 1, prop: 'sword', armF: 70 + 30 * Math.sin(t * 6 + i), elbF: 0, walk: u < 1 ? t * 6 + i : null });
      fade(c, 1 - ramp(t, k, 0.5), () => A.figure(c, 1400, 1000, 380, CH.yang, { face: -1, armF: 100, elbF: 20 }));
    });
    G.dateLine(c, t, { at: f('f109'), out: w('f110', 'stormed'), event: 'The East King\'s palace', day: '2 September', year: 1856, from: 1852, mode: 'light', y: 150 });
    G.medallion(c, t, 'yang', 1600, 320, 110, w('f110', 'East') - 0.2, S.end + 0.3, { grey: ramp(t, k, 0.3), slash: ramp(t, k, 0.25), role: 'killed 1856' });
  } },
{ id: 'S68', at: 'f111', trans: 'cut', dark: true, desc: 'Crimson-tinted silhouettes of Yang\'s household grey out row by row; 20,000+ "by some accounts".',
  sfx: [[w('f111', 'kept'), 'riot', 0.5, 4], [w('f112', 'twenty'), 'impact', 0.7]],
  draw(c, t, lt, S) {
    const k = ramp(t, w('f111', 'family') - 0.3, 3.2);
    cam(c, lt, S, 1.0, 1.06, W / 2, H * 0.55, W / 2, H * 0.6, () => {
      PL.hallInterior(c, t, { mode: 'east', dark: 0.8 });
      A.crowd(c, { x0: -100, x1: 2020, y: 1010, n: 90, hMin: 140, hMax: 240, depth: 80, seed: 111, t, color: mixColor('#8A2A22', '#2A2622', k), far: mixColor('#6A2018', '#1E1A16', k), tools: false, agit: 0.2 });
    });
    tint(c, '#7A1C14', 0.4);
    ['family', 'officials', 'followers'].forEach((s, i) => G.text(c, s, 480 + i * 480, 300, 'italic 400 60px BodoniItalic', '#F2E8D2', 'center', life(t, w('f111', s) - 0.1, S.end, 0.3, 0.3), 'rgba(0,0,0,0.6)'));
    G.counter(c, t, 0, 20000, w('f112', 'twenty') - 0.2, 1.0, W / 2, 560, { size: 140, label: 'dead · by some accounts' });
  } },
{ id: 'S69', at: 'f113', trans: 'whip', dark: true, desc: 'Shi Dakai flees on his white horse (medallion); then Wei\'s medallion greys – executed, November 1856.',
  sfx: [[w('f113', 'protested'), 'impact', 0.5], [w('f113', 'fled'), 'hooves', 0.8, 2.5], [w('f113', 'killed'), 'thud', 0.6], [w('f114', 'executed'), 'slash', 0.8]],
  draw(c, t, lt, S) {
    const ex = w('f114', 'executed');
    cam(c, lt, S, 1.0, 1.06, W / 2, H * 0.55, W * 0.45, H * 0.6, () => {
      PL.nanjing(c, t, { night: 0.85 });
      const u = ramp(t, w('f113', 'fled') - 0.2, 2.6, easeIn); A.rider(c, lerp(1500, -300, u), 1040, 230, CH.shi, { face: -1, color: '#E8E2D4', cloth: P.red, walk: u > 0 && u < 1 ? t * 8 : null, t });
    });
    G.medallion(c, t, 'shi', 1600, 320, 110, f('f113') - 0.1, f('f114') + 0.2, { role: 'the Wing King · his family was killed' });
    G.medallion(c, t, 'wei', 1600, 320, 110, f('f114'), S.end + 0.3, { grey: ramp(t, ex, 0.3), slash: ramp(t, ex, 0.25), role: 'executed, November 1856' });
  } },
{ id: 'S70', at: 'f115', trans: 'cut', desc: 'Map: Shi Dakai\'s army – about 100,000 – streams west out of Nanjing. Calendar 1857.',
  sfx: [[f('f115'), 'march', 0.6, 4], [w('f115', 'hundred'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.5, H * 0.5, () => {
      PL.chinaMap(c, t, { labels: ['Nanjing', 'Anqing', 'Wuchang', 'Chengdu'], tp: 1 });
      G.route(c, V.cn, ['Nanjing', 'Anqing', [28.6, 115.9], [27.0, 112.0], [27.5, 107.0], 'Chengdu'], ramp(t, f('f115') + 0.4, 4.2, easeIO), { w: 8, color: '#C2402F', dash: [8, 10] });
    });
    G.counter(c, t, 0, 100000, w('f115', 'hundred') - 0.3, 1.0, 1480, 900, { size: 110, color: P.ink, mode: 'ink', label: 'followers left with Shi', labelColor: P.ink3 });
    G.calendar(c, t, f('f115') + 0.2, S.end + 0.3, 6, 7, { x: 140, y: 110, crack: 1 });
  } },
{ id: 'S71', at: 'f116', trans: 'cut', desc: 'The five kings\' row (callback): Feng, Xiao, Yang, Wei greyed; Shi fades out; Hong alone. "Done to itself what the Qing could not."',
  sfx: [[w('f116', 'not'), 'thud', 0.6], [w('f117', 'itself'), 'impact', 0.8]],
  draw(c, t, lt, S) {
    parchment(c, t);
    G.medallion(c, t, 'hong', W / 2, 250, 110, f('f116') - 0.1, S.end + 0.3, { role: 'alone' });
    [['yang', 1], ['xiao', 1], ['feng', 1], ['wei', 1], ['shi', 0]].forEach(([k, dead], i) => fade(c, k === 'shi' ? 1 - ramp(t, w('f116', 'remained') - 0.2, 0.8) : 1, () => G.medallion(c, t, k, 260 + i * 350, 740, 95, f('f116') - 0.2, S.end + 0.3, dead ? { grey: 1, slash: 1 } : {})));
    G.slam(c, t, [{ t: 'WHAT THE QING' }, { t: 'COULD NOT', red: true }], w('f117', 'Qing') - 0.3, S.end + 0.2, { y: 560, size: 84, mode: 'ink' });
  } },

// ================================================================ CH 8  A second chance
{ id: 'S72', at: 'f118', trans: 'black', desc: 'Nanjing by day, red flags still flying. NOT YET.',
  sfx: [[f('f118'), 'wind', 0.5, 3], [w('f118', 'yet', 2), 'impact', 0.7]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.08, 1.0, W / 2, H * 0.5, W / 2, H * 0.5, () => { PL.nanjing(c, t, { dusk: 0.1 }); wallFlags(c, t); });
    G.slam(c, t, [{ t: 'NOT YET', red: true }], w('f118', 'yet', 2) - 0.1, S.end + 0.2, { y: H * 0.28, size: 170 });
  } },
{ id: 'S73', at: 'f119', trans: 'whip', desc: 'Map: a route from Hong Kong to Nanjing; Hong Rengan\'s medallion; date-line 1859; calendar 1858–59.',
  sfx: [[f('f119'), 'whoosh', 0.5], [w('f119', 'Rengan'), 'tick', 0.6], [w('f120', 'missionaries'), 'bell', 0.4]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H / 2, W * 0.55, H * 0.55, () => {
      PL.chinaMap(c, t, { labels: ['Hong Kong', 'Canton', 'Nanjing'], hi: 'Nanjing', tp: 1 });
      G.route(c, V.cn, ['Hong Kong', [26.0, 116.0], [29.5, 117.5], 'Nanjing'], ramp(t, f('f119') + 0.3, 3.6, easeIO), { w: 7 });
    });
    G.medallion(c, t, 'rengan', 1600, 320, 110, w('f119', 'Rengan') - 0.2, S.end + 0.3, { role: 'Hong\'s cousin' });
    G.dateLine(c, t, { at: f('f119') + 0.1, out: f('f120') + 1.5, event: 'Hong Rengan reaches Tianjing', year: 1859, from: 1855, mode: 'ink', y: 150, x: 200 });
    G.calendar(c, t, f('f119') + 0.2, S.end + 0.3, 7, 9, { x: 140, y: 930, crack: 1 });
  } },
{ id: 'S74', at: 'f121', trans: 'cut', desc: 'The throne hall: Rengan receives a Western missionary visitor; Hong names him chief minister.',
  sfx: [[w('f121', 'welcomed'), 'creak', 0.5], [w('f122', 'chief'), 'gong', 0.6]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.06, W / 2, H * 0.55, W * 0.5, H * 0.52, () => {
      PL.hallInterior(c, t, { mode: 'throne' });
      A.figure(c, 960, 760, 330, CH.hong, { face: 1, seated: true, armF: lerp(20, 70, ramp(t, w('f122', 'chief') - 0.3, 0.4)), elbF: 20 });
      A.figure(c, 520, 1020, 360, CH.rengan, { face: 1, prop: 'book', armF: 55, elbF: 55, lean: lerp(0, 12, ramp(t, w('f122', 'chief'), 0.5)) });
      fade(c, ramp(t, w('f121', 'welcomed') - 0.2, 0.6) * (1 - ramp(t, f('f122') - 0.3, 0.4)), () => A.figure(c, 1460, 1020, 360, CH.roberts, { face: -1, prop: 'book', armF: 40, elbF: 40 }));
    });
    G.slam(c, t, [{ t: 'hoping the West would take his side', small: true }], w('f121', 'hoping') - 0.1, f('f122'), { y: H * 0.18, size: 110 });
    G.scriptName(c, t, 'chief minister', w('f122', 'chief') - 0.2, S.end + 0.3, { y: H * 0.86, size: 110 });
  } },
{ id: 'S75', at: 'f123', trans: 'ink', desc: 'Rengan\'s plan on parchment: railways, steamships, banks, newspapers appear as small engravings word by word.',
  sfx: [[f('f123'), 'quill', 0.6, 2.5], [w('f124', 'railways'), 'tick', 0.6], [w('f124', 'steamships'), 'tick', 0.6], [w('f124', 'banks'), 'coin', 0.6], [w('f124', 'newspapers'), 'paper', 0.6]],
  draw(c, t, lt, S) {
    parchment(c, t);
    G.documentSheet(c, t, 420, 560, 520, 700, { title: 'A plan to modernise China', titleSize: 30, written: ramp(t, f('f123'), 2.6), seed: 12 });
    const icon = (i, at, fn, label) => { const a = ramp(t, at - 0.1, 0.35); if (a <= 0) return; const x = 960 + (i % 2) * 460, y = 330 + Math.floor(i / 2) * 400; c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(lerp(0.8, 1, a), lerp(0.8, 1, a)); fn(); c.restore(); G.text(c, label, x, y + 150, 'italic 400 46px BodoniItalic', P.ink, 'center', a); };
    icon(0, w('f124', 'railways'), () => { c.fillStyle = P.ink2; c.fillRect(-140, -20, 200, 70); c.fillRect(20, -70, 50, 50); c.fillRect(-120, -60, 30, 40); for (const x of [-110, -50, 10, 50]) { c.beginPath(); c.arc(x, 60, 26, 0, TAU); c.fill(); } c.fillRect(-180, 86, 360, 8); }, 'railways');
    icon(1, w('f124', 'steamships'), () => A.warship(c, 0, 40, 60, t, P.ink2, false), 'steamships');
    icon(2, w('f124', 'banks'), () => { for (let k = 0; k < 5; k++) G.groat(c, -60 + k * 30, 40 - k * 14, 46); }, 'banks');
    icon(3, w('f124', 'newspapers'), () => { c.fillStyle = '#F2E8D2'; c.fillRect(-110, -80, 220, 170); c.fillStyle = P.ink2; c.fillRect(-90, -60, 180, 22); for (let k = 0; k < 5; k++) c.fillRect(-90, -20 + k * 20, 180 * (k % 2 ? 0.8 : 1), 8); }, 'newspapers');
  } },
{ id: 'S76', at: 'f125', trans: 'cut', desc: 'Li Xiucheng, the Loyal King, rides out on his dark horse with a red banner; his medallion.',
  sfx: [[f('f125'), 'hooves', 0.8, 4], [w('f125', 'Li'), 'whoosh', 0.5], [w('f125', 'field'), 'roar', 0.5]],
  draw(c, t, lt, S) {
    const u = ramp(t, f('f125'), 4.4, easeIO);
    cam(c, lt, S, 1.0, 1.08, W / 2, H * 0.6, W * 0.55, H * 0.6, () => {
      PL.guangxi(c, t, { dusk: 0.1, kilns: false });
      A.crowd(c, { x0: -300 + u * 400, x1: 1000 + u * 400, y: 1000, n: 60, hMin: 100, hMax: 180, depth: 60, seed: 125, t, red: 1, hair: true, face: 1, raise: 0.4 });
      A.rider(c, lerp(500, 1200, u), 1040, 260, CH.li, { face: 1, color: '#2A241D', cloth: P.red, walk: t * 6, prop: 'flag', armF: 60, t });
    });
    G.medallion(c, t, 'li', 1640, 300, 110, w('f125', 'Li') - 0.2, S.end + 0.3, { role: 'the Loyal King' });
  } },
{ id: 'S77', at: 'f126', trans: 'cut', desc: 'Outside Nanjing: the blue Qing siege camp is overrun by a red wave; tents topple. Date-line 1860; calendar 1860.',
  sfx: [[f('f126'), 'roar', 0.8], [w('f126', 'smashed'), 'impact', 0.9], [w('f126', 'smashed') + 0.3, 'clang', 0.6]],
  draw(c, t, lt, S) {
    const k = ramp(t, w('f126', 'smashed') - 0.4, 1.6, easeIO);
    cam(c, lt, S, 1.0, 1.06, W / 2, H * 0.6, W / 2, H * 0.62, () => {
      PL.nanjing(c, t, { dusk: 0.3, siege: 1 - k * 0.8 }); wallFlags(c, t);
      A.crowd(c, { x0: 800 + k * 700, x1: 1900 + k * 900, y: 1000, n: 40, hMin: 120, hMax: 200, depth: 60, seed: 126, t, color: P.blue, far: '#5A6A7A', hat: 'cone', face: 1, agit: 1.5 });
      A.crowd(c, { x0: -600 + k * 900, x1: 600 + k * 1100, y: 1010, n: 70, hMin: 130, hMax: 210, depth: 60, seed: 127, t, red: 1, hair: true, face: 1, raise: 0.8, agit: 1.5 });
    });
    G.dateLine(c, t, { at: f('f126') + 0.1, out: S.end, event: 'The Qing camp outside Nanjing', year: 1860, from: 1856, mode: 'light', y: 150 });
    G.calendar(c, t, f('f126') + 0.3, S.end + 0.3, 9, 10, { x: 1060, y: 120, light: true, crack: 1 });
  } },
{ id: 'S78', at: 'f127', trans: 'cut', desc: 'Map of the lower Yangtze: the red territory spreads east; on "Suzhou fell" its token flips red.',
  sfx: [[w('f127', 'swept'), 'whoosh', 0.6], [w('f127', 'Suzhou'), 'impact', 0.8]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.55, H * 0.5, () => {
      PL.chinaMap(c, t, { view: V.lower, tp: 0.6, labels: ['Nanjing', 'Suzhou', 'Shanghai', 'Hangzhou'], cartouche: 'The lower Yangtze · 1860' });
      G.fillRegion(c, 'china', V.lower, [[32.0, 119.0], [31.9, 120.9], [31.0, 121.0], [30.2, 120.4], [30.5, 119.2]], P.red, 0.45 * ramp(t, w('f127', 'swept'), 1.6));
      tok(c, V.lower, 'Suzhou', t > w('f127', 'Suzhou') ? P.red : P.gold, 1, null, 28);
    });
    G.slam(c, t, [{ t: 'SUZHOU FELL' }], w('f127', 'Suzhou') - 0.05, S.end + 0.2, { y: H * 0.18, size: 120, mode: 'ink' });
  } },
{ id: 'S79', at: 'f128', trans: 'whip', desc: 'Shanghai: walls, the Bund\'s godowns, gunboats in the river; a red column approaches. "Christians too, after all."',
  sfx: [[f('f128'), 'water', 0.5, 7], [w('f129', 'welcome'), 'bell', 0.4], [w('f129', 'Christians'), 'tick', 0.5]],
  draw(c, t, lt, S) {
    cam(c, lt, S, 1.0, 1.08, W / 2, H / 2, W * 0.4, H * 0.55, () => {
      PL.shanghai(c, t, {});
      A.crowd(c, { x0: -500 + (t - f('f128')) * 40, x1: 500 + (t - f('f128')) * 40, y: 1010, n: 40, hMin: 140, hMax: 220, depth: 40, seed: 128, t, red: 1, hair: true, face: 1, tools: true, raise: 0.1 });
    });
    G.scriptName(c, t, 'Shanghai', f('f128') - 0.1, f('f129'), { y: H * 0.26, size: 170, role: 'its foreign merchants' });
    G.slam(c, t, [{ t: 'CHRISTIANS TOO' }, { t: 'after all', small: true }], w('f129', 'Christians') - 0.05, S.end + 0.2, { y: H * 0.26, size: 120 });
  } },
{ id: 'S80', at: 'f130', trans: 'cut', desc: 'August 1860: British and French troops on the walls fire volleys; the red column recoils. FIRED.',
  sfx: [[w('f131', 'fired') - 0.1, 'volley', 1.0], [w('f131', 'fired') + 0.8, 'volley', 0.8], [w('f131', 'walls'), 'roar', 0.5]],
  draw(c, t, lt, S) {
    const fi = w('f131', 'fired'), k = ramp(t, fi, 1.6, easeOut);
    cam(c, lt, S, 1.0, 1.1, W / 2, H / 2, W * 0.35, H * 0.5, () => {
      PL.shanghai(c, t, { troops: ramp(t, w('f131', 'British') - 0.3, 0.6), volley: t > fi ? (t - fi) * 0.8 : null });
      A.crowd(c, { x0: -300 - k * 300, x1: 700 - k * 300, y: 1010, n: 40, hMin: 140, hMax: 220, depth: 40, seed: 128, t, red: 1, hair: true, face: k > 0.3 ? -1 : 1, agit: 1 + 2 * k });
    });
    G.dateLine(c, t, { at: f('f130'), out: fi, event: 'Shanghai', day: 'August', year: 1860, from: 1856, mode: 'light', y: 150 });
    G.slam(c, t, [{ t: 'FIRED', red: true }, { t: 'British and French troops', small: true }], fi, S.end + 0.2, { x: 1300, y: H * 0.3, size: 150 });
  } },
];
