// Shots: chapters 8–11 (Mile End → the tax that came back) and the end card.
import { W, H, P, T, clamp, lerp, easeIO, easeOut, easeIn, backOut, ramp, life, rng, mixColor, rgba, noise1, parchment, withCam, push } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';
import * as PL from './plates.mjs';
import { dim, panel, hash, drawChain, manorRollPlate, throneRoom, boyKing, councilPlate, RICHARD_HORSE, TYLER_HORSE } from './shots_a.mjs';
import { ESSEX, KENT } from './shots_b.mjs';
const { CH } = A; const f = T.f, e = T.e, w = T.w;
const TAU = Math.PI * 2;
const WALWORTH_HORSE = { color: '#5A4A3A', cloth: P.blue };
const black = (c, t, t0, d) => { if (t >= t0 && t < t0 + d) { c.fillStyle = '#0B0908'; c.fillRect(0, 0, W, H); return true; } return false; };

// Smithfield with the royal party (left) and the rebel host (right): used by S58–S66
function smithfieldStage(c, t, o = {}) {
  PL.smithfield(c, t, { tint: o.tint, tintA: o.tintA });
  A.crowd(c, { x0: 1180, x1: 2100, y: 800, n: 90, hMin: 100, hMax: 180, depth: 170, seed: 5, t, red: 1, face: o.crowdFace ?? -1, raise: o.raise ?? 0.2, allBows: o.bows ?? false, agit: o.agit ?? 0.7, color: o.crowdCol, far: o.crowdFar });
  if (o.walworth !== false) A.rider(c, o.wx ?? 200, 1000, 225, o.shadow ? PL.shade(CH.walworth) : CH.walworth, { face: 1, ...WALWORTH_HORSE, ...(o.shadow ? { color: '#1A1612', cloth: '#1A1612' } : {}), walk: o.wwalk, prop: o.wprop, armF: o.warmF, elbF: o.welbF, t });
  if (o.richard !== false) A.rider(c, o.rx ?? 430, 1010, 230, o.shadow ? PL.shade(CH.richard) : CH.richard, { face: o.rface ?? 1, ...RICHARD_HORSE, ...(o.shadow ? { color: '#1A1612', cloth: '#1A1612' } : {}), walk: o.rwalk, t });
  if (o.squire !== false) A.figure(c, o.sqx ?? 620, 1030, 300, o.shadow ? PL.shade(CH.squire) : CH.squire, { face: 1, prop: 'sword', armF: o.sqArm ?? 20, elbF: 20, walk: o.sqwalk, t });
  if (o.tyler !== false) { const ty = o.ty ?? {}; c.save(); c.globalAlpha *= ty.alpha ?? 1;
    A.rider(c, ty.x ?? 820, 1000, 190, o.shadow ? PL.shade(CH.tyler) : CH.tyler, { face: ty.face ?? -1, ...TYLER_HORSE, ...(o.shadow ? { color: '#1A1612' } : {}), walk: ty.walk, prop: ty.prop ?? 'dagger', armF: ty.armF ?? 40, elbF: ty.elbF ?? 30, lean: ty.lean, t }); c.restore(); }
}

export const SHOTS_C = [
// ================================================================ CH 8  Mile End and the Tower
{ id: 'S48', at: 'f104', trans: 'ink', desc: 'The London schematic: the king\'s gold token rides from the Tower to Mile End, 14 June.',
  sfx: [[f('f104') + 0.3, 'hooves', 0.6, 4], [f('f104') + 0.2, 'tick', 0.5]],
  draw(c, t, lt, S) {
    PL.londonMap(c, t, { aldgate: 1, savoyBurnt: 1 });
    for (let i = 0; i < 10; i++) G.token(c, PL.LM.MileEnd[0] - 60 + (i % 5) * 30, PL.LM.MileEnd[1] + 40 + Math.floor(i / 5) * 30, 15, P.red, ramp(t, f('f104') + i * 0.05, 0.3));
    const p = PL.lmPath(['Tower', [1450, 560], 'MileEnd'], ramp(t, f('f104') + 0.5, 4.2, easeIO)); PL.screenRoute(c, ['Tower', [1450, 560], 'MileEnd'], ramp(t, f('f104') + 0.5, 4.2, easeIO), { color: P.gold, w: 6 });
    G.token(c, p[0], p[1], 24, P.gold, 1);
    if (t > w('f104', 'Mile') - 0.2) { c.save(); c.strokeStyle = P.red; c.lineWidth = 5; c.beginPath(); c.arc(PL.LM.MileEnd[0], PL.LM.MileEnd[1] + 30, 110 + Math.sin(t * 5) * 4, 0, TAU); c.stroke(); c.restore(); }
    G.dateLine(c, t, { at: f('f104') + 0.15, out: S.end + 0.3, event: 'Mile End', day: '14 June', year: 1381, from: 1377, mode: 'ink' });
    G.tally(c, t, f('f104') + 0.3, S.end + 0.3, 15, 16, { x: 1240, y: 1010 });
  } },
{ id: 'S49', at: 'f105', desc: 'Mile End: the king before the men of Essex. The demands appear one by one; the king says YES (stamp).',
  sfx: [[w('f106', 'end'), 'tick', 0.6], [w('f106', 'Free'), 'tick', 0.6], [w('f106', 'Cheap'), 'tick', 0.6], [w('f106', 'pardon'), 'tick', 0.6], [w('f107', 'yes'), 'stamp', 1.0], [w('f107', 'yes') + 0.15, 'cheer', 0.9]],
  draw(c, t, lt, S) {
    const yes = w('f107', 'yes');
    withCam(c, push(lt, S.dur, 1.0, 1.05, W / 2, H / 2, W * 0.5, H * 0.52), () => {
      PL.field(c, t, { seed: 91, h1: 640, h2: 720, back: cc => { A.cityGate(cc, 330, 730, 34, '#7A6A52', 1); A.whiteTower(cc, 120, 730, 22, '#7A6A52'); }, gy: 790 });
      A.crowd(c, { x0: 1050, x1: 2100, y: 800, n: 90, hMin: 110, hMax: 190, depth: 170, seed: 93, t, red: 1, face: -1, raise: 0.2 + 0.7 * ramp(t, yes, 0.4), agit: t > yes ? 2 : 0.7 });
      A.rider(c, 200, 1000, 225, CH.walworth, { face: 1, ...WALWORTH_HORSE, t });
      A.rider(c, 460, 1010, 230, CH.richard, { face: 1, ...RICHARD_HORSE, t, armF: t > yes - 0.3 ? 90 : 40, elbF: 10 });
    });
    G.listPanel(c, t, ['An end to serfdom', 'Free labour', 'Cheap land', 'A pardon for all'], [w('f106', 'end') - 0.15, w('f106', 'Free') - 0.1, w('f106', 'Cheap') - 0.1, w('f106', 'pardon') - 0.15], w('f105', 'everything') - 0.3, S.end + 0.3, { title: 'The demands · Mile End', x: 1010, y: 70, w: 800, lh: 84 });
    G.stamp(c, t, 'YES', yes - 0.05, S.end + 0.3, { x: 1500, y: 290, size: 170, rot: -0.16 });
  } },
{ id: 'S50', at: 'f108', desc: 'A scriptorium: clerks copy charters of freedom; charters multiply across the frame. "For a moment…"',
  sfx: [[f('f108'), 'quill', 0.7, 6], [w('f108', 'charters'), 'paper', 0.6], [f('f109'), 'seal', 0.5], [f('f109') + 0.6, 'seal', 0.5], [f('f109') + 1.2, 'seal', 0.5], [w('f110', 'won'), 'impact', 0.8]],
  draw(c, t, lt, S) {
    withCam(c, push(lt, S.dur, 1.0, 1.06, W / 2, H * 0.55, W / 2, H * 0.56), () => {
      PL.interior(c, t, { dark: 0.35, arches: 2 });
      for (const x of [560, 1360]) { A.figure(c, x, 985, 330, CH.clerk, { seated: true, face: 1, armF: 70 + Math.sin(t * 9 + x) * 6, elbF: 60 }); PL.table(c, x + 40, 990, 420, 120, '#4A3420'); G.documentSheet(c, t, x + 60, 852, 180, 50, { seed: x, lines: 1, rot: 0.04 }); PL.candle(c, x - 120, 856, t, x); }
    });
    const c0 = w('f108', 'charters') - 0.1, c1 = e('f109');
    for (let i = 0; i < 10; i++) { const at = lerp(c0, c1, i / 9), a = ramp(t, at, 0.25, backOut); if (a <= 0) continue; const col = i % 5, row = Math.floor(i / 5);
      c.save(); c.globalAlpha = Math.min(1, a); c.translate(260 + col * 350, 250 + row * 300); c.scale(a, a); G.documentSheet(c, t, 0, 0, 200, 250, { title: 'Carta', titleSize: 30, seal: true, seed: 3 + i, lines: 4, rot: (hash(i) - 0.5) * 0.2 }); c.restore(); }
    const wa = life(t, w('f110', 'moment') - 0.2, S.end + 0.3, 0.12, 0.3); if (wa > 0) { c.save(); c.globalAlpha = wa; panel(c, W / 2, 560, 1300, 280, 0.92); c.restore(); }
    G.slam(c, t, [{ t: 'for a moment', small: true }, { t: 'THE REVOLT HAD WON', red: true }], w('f110', 'moment') - 0.1, S.end + 0.2, { y: 560, size: 100, mode: 'ink' });
  } },
{ id: 'S51', at: 'f111', trans: 'whip', desc: 'The map again: with the king away at Mile End, the Tower\'s gates stand open; about 400 rebels walk in.',
  sfx: [[w('f112', 'open'), 'gate', 0.8], [f('f113'), 'march', 0.7, 2.5], [w('f113', 'four'), 'tick', 0.6]],
  draw(c, t, lt, S) {
    const k = easeIO(clamp((t - f('f112') + 0.4) / 2.0));
    withCam(c, { x: lerp(1500, 1300, k), y: lerp(520, 620, k), s: lerp(1.3, 1.7, k) }, () => {
      PL.londonMap(c, t, { aldgate: 1, savoyBurnt: 1, labels: { MileEnd: 1, Tower: 1 } });
      G.token(c, PL.LM.MileEnd[0], PL.LM.MileEnd[1] + 40, 24, P.gold, 1);
      for (let i = 0; i < 10; i++) G.token(c, PL.LM.MileEnd[0] - 60 + (i % 5) * 30, PL.LM.MileEnd[1] + 80 + Math.floor(i / 5) * 30, 13, P.red, 1);
      if (t > w('f112', 'open') - 0.3) { c.save(); c.strokeStyle = P.red; c.lineWidth = 4; c.setLineDash([10, 8]); c.beginPath(); c.arc(PL.LM.Tower[0], PL.LM.Tower[1] - 18, 60 + Math.sin(t * 5) * 3, 0, TAU); c.stroke(); c.restore(); }
      const u = ramp(t, f('f113') - 0.1, 2.4, easeIO);
      for (let i = 0; i < 12; i++) { const ui = clamp(u * 1.4 - i * 0.04); if (ui <= 0) continue; const p = PL.lmPath([[1320, 520], [1340, 600], [1300, 640]], ui); G.token(c, p[0] + ((i % 4) - 1.5) * 16, p[1] + Math.floor(i / 4) * 14, 9, P.red, 1); }
    });
    const pa = life(t, w('f111', 'while') - 0.2, S.end + 0.3, 0.12, 0.3); if (pa > 0) { c.save(); c.globalAlpha = pa; panel(c, W / 2, 175, 1150, 230, 0.92); c.restore(); }
    G.slam(c, t, [{ t: 'BEHIND HIM' }], w('f111', 'while') - 0.1, w('f112', 'open') - 0.2, { y: 170, size: 100, mode: 'ink' });
    G.slam(c, t, [{ t: 'THE GATES STOOD OPEN', red: true }], w('f112', 'open') - 0.1, f('f113'), { y: 170, size: 96, mode: 'ink' });
    G.slam(c, t, [{ t: 'ABOUT 400' }, { t: 'walked straight in', small: true }], w('f113', 'four') - 0.15, S.end + 0.2, { y: 190, size: 110, mode: 'ink' });
  } },
{ id: 'S52', at: 'f114', trans: 'ink', dark: true, desc: 'The chapel of the White Tower: Simon Sudbury and Robert Hales (medallions with their offices).',
  sfx: [[f('f114') - 0.2, 'chant', 0.6, 9.5], [w('f114', 'Simon'), 'whoosh', 0.5], [w('f116', 'Robert'), 'whoosh', 0.5]],
  draw(c, t, lt, S) {
    withCam(c, push(lt, S.dur, 1.0, 1.1, W / 2, H * 0.55, W / 2, H * 0.55), () => {
      PL.interior(c, t, { dark: 0.5, arches: 1 });
      c.fillStyle = '#E8E0CC'; c.fillRect(800, 840, 320, 90); c.fillStyle = '#3A2A1C'; c.fillRect(810, 930, 300, 60); c.fillStyle = P.gold; c.fillRect(952, 700, 16, 140); c.fillRect(915, 740, 90, 14);
      PL.candle(c, 840, 840, t, 5); PL.candle(c, 1080, 840, t, 6);
      A.figure(c, 690, 1010, 330, CH.sudbury, { face: 1, armF: 80, elbF: 90, armB: 60, elbB: 90 });
      A.figure(c, 1260, 1000, 340, CH.hales, { face: -1, armF: 15 });
    });
    G.text(c, 'the chapel of the White Tower', W / 2, 120, 'italic 400 46px BodoniItalic', '#F0E6D0', 'center', life(t, f('f114') + 0.2, w('f114', 'Simon'), 0.4, 0.3), 'rgba(0,0,0,0.6)');
    G.medallion(c, t, 'sudbury', 360, 300, 120, w('f114', 'Simon') - 0.15, S.end + 0.3, { light: true, role: 'Archbishop of Canterbury · Chancellor' });
    G.medallion(c, t, 'hales', 1560, 300, 120, w('f116', 'Robert') - 0.15, S.end + 0.3, { light: true, role: 'Treasurer of England' });
  } },
{ id: 'S53', at: 'f117', desc: 'The two medallions with the groats between them: the men who ran THE POLL TAX.',
  sfx: [[f('f117'), 'coins', 0.7], [w('f117', 'poll'), 'impact', 0.8]],
  draw(c, t, lt, S) {
    parchment(c, t);
    G.medallion(c, t, 'sudbury', 640, 420, 150, f('f117') - 0.3, S.end + 0.3);
    G.medallion(c, t, 'hales', 1280, 420, 150, f('f117') - 0.3, S.end + 0.3);
    for (let i = 0; i < 3; i++) { const a = ramp(t, f('f117') + i * 0.12, 0.2, backOut); if (a > 0) { c.save(); c.translate(960, 330 + i * 80); c.scale(a, a); G.groat(c, 0, 0, 34); c.restore(); } }
    G.slam(c, t, [{ t: 'who had run', small: true }, { t: 'THE POLL TAX', red: true }], w('f117', 'run') - 0.2, S.end + 0.2, { y: 860, size: 120, mode: 'ink' });
  } },
{ id: 'S54', at: 'f118', dark: true, desc: 'Tower Hill under a storm sky: the medallions grey (cut to black on "beheaded"). Poles carried through the streets.',
  sfx: [[w('f118', 'Tower'), 'crowd', 0.7, 2], [w('f118', 'beheaded'), 'thud', 1.0], [f('f119'), 'drum', 0.7, 3]],
  draw(c, t, lt, S) {
    const bh = w('f118', 'beheaded');
    if (black(c, t, bh, 0.5)) return;
    withCam(c, push(lt, S.dur, 1.0, 1.06, W / 2, H / 2, W * 0.52, H * 0.5), () => {
      A.sky(c, 'storm', t); A.clouds(c, t, 101, 220, 'rgba(30,26,24,0.35)', 6, 10, 1.3);
      A.whiteTower(c, 1450, 720, 60, '#2E2A26'); A.hills(c, 800, 70, 103, '#241F1A');
      const k = ramp(t, f('f119'), 4, easeIO);
      A.crowd(c, { x0: -100 + k * 300, x1: 1300 + k * 300, y: 820, n: 80, hMin: 120, hMax: 200, depth: 160, seed: 105, t, red: 0.6, color: '#1A1612', far: '#2A2420', raise: 0.9, face: 1, agit: 1.2 });
    });
    G.medallion(c, t, 'sudbury', 680, 250, 100, f('f118') - 0.2, S.end + 0.3, { light: true, grey: t > bh ? 1 : 0, slash: t > bh ? 1 : 0, noPlaque: true });
    G.medallion(c, t, 'hales', 1240, 250, 100, f('f118') - 0.2, S.end + 0.3, { light: true, grey: t > bh ? 1 : 0, slash: t > bh ? 1 : 0, noPlaque: true });
    G.scriptName(c, t, 'Tower Hill', f('f118') + 0.4, bh, { x: W / 2, y: 520, size: 140 });
    G.text(c, 'paraded through the streets', W / 2, 470, 'italic 400 46px BodoniItalic', '#F0E6D0', 'center', life(t, f('f119') + 0.2, S.end + 0.3, 0.4, 0.3), 'rgba(0,0,0,0.6)');
  } },
{ id: 'S55', at: 'f120', desc: 'London Bridge at dusk (callback): small dark shapes above the gatehouse.',
  sfx: [[f('f120'), 'wind', 0.7, 3.2], [w('f120', 'spikes'), 'thud', 0.5]],
  draw(c, t, lt, S) {
    withCam(c, push(lt, S.dur, 1.3, 1.6, 1000, 640, 1010, 600), () => PL.london(c, t, { sky: 'dusk', night: 0.25, spikes: ramp(t, w('f120', 'spikes') - 0.3, 0.8) }));
    G.text(c, 'above London Bridge', W / 2, 150, 'italic 400 50px BodoniItalic', '#F3EAD6', 'center', life(t, w('f120', 'above') - 0.2, S.end + 0.2, 0.3, 0.2), 'rgba(0,0,0,0.7)');
  } },
{ id: 'S56', at: 'f121', trans: 'fade', dark: true, desc: 'Night streets: torches; Flemish residents hunted; a storm wall swallows the frame: something much darker.',
  sfx: [[f('f121') - 0.2, 'night', 0.7, 13], [w('f122', 'Flemish'), 'crowd', 0.8, 4], [f('f123'), 'thunder', 0.7], [w('f123', 'darker'), 'impact', 0.7]],
  draw(c, t, lt, S) {
    const fl = w('f122', 'Flemish');
    withCam(c, push(lt, S.dur, 1.0, 1.08, W / 2, H * 0.55, W * 0.5, H * 0.55), () => {
      PL.streetNight(c, t, { fire: 0.4 + 0.2 * Math.sin(t) });
      const k = (t - fl) / 4.5;
      if (k > 0) [0, 1, 2].forEach(i => { const x = lerp(1300 + i * 120, -300 + i * 120, easeIn(clamp(k - i * 0.05))); A.figure(c, x, 980 + i * 10, 240, CH.fleming, { face: -1, walk: t * 10 + i, armF: 40, armB: -40 }); });
      const kc = clamp((t - f('f121')) / 9);
      A.crowd(c, { x0: lerp(2100, 900, kc), x1: lerp(2900, 1900, kc), y: 900, n: 30, hMin: 200, hMax: 280, depth: 90, seed: 107, t, red: 0.3, color: '#0F0C0A', far: '#1C1814', face: -1, tools: true, raise: 0.7, agit: 1.5 });
      for (let i = 0; i < 7; i++) { const tx = lerp(2000, 1000, kc) + i * 130 + Math.sin(t + i) * 10, ty = 640 + (i % 3) * 30; c.strokeStyle = '#1A1410'; c.lineWidth = 8; c.beginPath(); c.moveTo(tx, ty + 120); c.lineTo(tx, ty); c.stroke(); A.flames(c, tx, ty, 40, 70, t, 200 + i, 4); }
      A.stormWall(c, t, 0.08 + 0.95 * easeIO(clamp((t - f('f123') - 0.3) / 3)), 109, '#0B0908');
    });
    G.text(c, 'Flemish immigrants', 420, 200, 'italic 400 52px BodoniItalic', '#F0E6D0', 'center', life(t, fl - 0.1, f('f123') + 0.5, 0.3, 0.3), 'rgba(0,0,0,0.7)');
    G.slam(c, t, [{ t: 'SOMETHING' }, { t: 'MUCH DARKER', red: true }], w('f123', 'darker') - 0.1, S.end + 0.2, { y: H * 0.45, size: 120 });
  } },

// ================================================================ CH 9  Smithfield
{ id: 'S57', at: 'f124', trans: 'black', desc: 'The schematic: the king summons the rebels to Smithfield, just outside the walls. 15 June, tally day 17.',
  sfx: [[f('f124') + 0.3, 'hooves', 0.6, 4], [w('f124', 'Smithfield'), 'tick', 0.6], [w('f124', 'walls'), 'whoosh', 0.5]],
  draw(c, t, lt, S) {
    PL.londonMap(c, t, { aldgate: 1, savoyBurnt: 1, labels: { Smithfield: 1, Barts: 0.9 } });
    for (let i = 0; i < 14; i++) G.token(c, PL.LM.Smithfield[0] - 80 + (i % 7) * 26, PL.LM.Smithfield[1] + 30 + Math.floor(i / 7) * 26, 13, P.red, ramp(t, w('f124', 'rebels') + i * 0.04, 0.3));
    const u = ramp(t, f('f124') + 0.3, 4.5, easeIO); PL.screenRoute(c, [[0, 610], [300, 560], [520, 420], [600, 380]], u, { color: P.gold, w: 6 }); const p = PL.lmPath([[0, 610], [300, 560], [520, 420], [600, 380]], u); G.token(c, p[0], p[1], 24, P.gold, 1);
    if (t > w('f124', 'walls') - 0.2) { const a = Math.sin(clamp((t - w('f124', 'walls') + 0.2) / 1.2) * Math.PI); c.save(); c.globalAlpha = a; c.strokeStyle = P.red; c.lineWidth = 14; c.beginPath(); [[700, 702], [690, 560], [760, 430], [900, 382]].forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.restore(); }
    G.text(c, 'from Westminster', 120, 560, 'italic 400 28px FellItalic', P.ink3, 'left', ramp(t, f('f124') + 0.4, 0.4));
    G.dateLine(c, t, { at: f('f124') + 0.15, out: S.end + 0.3, event: 'Smithfield', day: '15 June', year: 1381, from: 1377, mode: 'ink' });
    G.tally(c, t, f('f124') + 0.3, S.end + 0.3, 16, 17, { x: 1240, y: 1010 });
  } },
{ id: 'S58', at: 'f125', trans: 'ink', desc: 'Smithfield (the cold-open plate, identical): Tyler rides out on a small horse, dagger in hand, takes the king\'s hand: "brother".',
  sfx: [[f('f125') + 0.2, 'hooves', 0.7, 4], [w('f125', 'dagger'), 'whoosh', 0.4], [w('f126', 'brother'), 'impact', 0.5]],
  draw(c, t, lt, S) {
    const u = easeIO(clamp((t - f('f125') - 0.2) / 4.2));
    withCam(c, push(lt, S.dur, 1.0, 1.1, W / 2, H * 0.55, W * 0.4, H * 0.6), () =>
      smithfieldStage(c, t, { ty: { x: lerp(1200, 760, u), walk: u > 0 && u < 1 ? t * 5.5 : null, armF: t > f('f126') ? 75 : 40, elbF: t > f('f126') ? 0 : 30 } }));
    G.text(c, 'a small horse, a dagger in his hand', 1350, 180, 'italic 400 44px BodoniItalic', P.ink, 'center', life(t, w('f125', 'small') - 0.2, f('f126'), 0.3, 0.3));
    G.slam(c, t, [{ t: '“brother”', small: true }], w('f126', 'brother') - 0.1, S.end + 0.2, { x: 760, y: 330, size: 220, mode: 'ink' });
  } },
{ id: 'S59', at: 'f127', desc: 'Tyler\'s demands at Smithfield (list); the king answers he will grant whatever he fairly can (medallion).',
  sfx: [[w('f128', 'No'), 'tick', 0.6], [w('f128', 'Church'), 'tick', 0.6], [w('f129', 'bishop'), 'tick', 0.6], [w('f130', 'grant'), 'whoosh', 0.5]],
  draw(c, t, lt, S) {
    withCam(c, { x: W / 2, y: H * 0.55, s: 1.05 }, () => smithfieldStage(c, t, { ty: { x: 760, armF: 30 } }));
    dim(c, 0.45);
    G.listPanel(c, t, ['No lord but the king', 'Church wealth to the people', 'One bishop for all England'], [w('f128', 'No') - 0.15, w('f128', 'Church') - 0.15, w('f129', 'bishop') - 0.2], f('f127') - 0.2, S.end + 0.3, { title: 'Tyler\'s demands · Smithfield', x: 110, y: 140, w: 880, lh: 92 });
    G.medallion(c, t, 'richard', 1460, 400, 150, f('f130') - 0.2, S.end + 0.3, { light: true });
    G.text(c, 'whatever he fairly could', 1460, 730, 'italic 400 48px BodoniItalic', '#F6EFE0', 'center', life(t, w('f130', 'grant') - 0.2, S.end + 0.3, 0.3, 0.3), 'rgba(0,0,0,0.6)');
  } },
{ id: 'S60', at: 'f131', desc: 'Close on Tyler: water, rinsed in front of the king; then ale.',
  sfx: [[w('f131', 'water'), 'water', 0.5, 1.5], [w('f132', 'ale'), 'whoosh', 0.4]],
  draw(c, t, lt, S) {
    const ale = w('f132', 'ale');
    withCam(c, { x: 680, y: 760, s: 1.75 + 0.05 * lt / S.dur }, () => smithfieldStage(c, t, { walworth: false, squire: false, ty: { x: 820, prop: t > ale - 0.2 ? 'cup' : t > w('f131', 'water') - 0.2 ? 'jug' : null, armF: t > w('f131', 'water') - 0.2 ? 100 : 30, elbF: t > w('f131', 'water') - 0.2 ? 50 : 30 } }));
    G.text(c, 'water', 1180, 250, 'italic 400 60px BodoniItalic', P.ink, 'center', life(t, w('f131', 'water') - 0.15, ale - 0.2, 0.25, 0.25));
    G.text(c, '… then ale', 1180, 250, 'italic 400 60px BodoniItalic', P.red, 'center', life(t, ale - 0.15, S.end + 0.2, 0.25, 0.25));
  } },
{ id: 'S61', at: 'f133', desc: 'Someone in the royal party: THIEF! Tyler goes for him with his dagger.',
  sfx: [[w('f133', 'thief'), 'impact', 1.0], [w('f134', 'went'), 'whoosh', 0.9], [w('f134', 'went') + 0.1, 'crowd', 0.7, 2]],
  draw(c, t, lt, S) {
    const go = w('f134', 'went'), u = easeOut(clamp((t - go + 0.1) / 0.6));
    withCam(c, push(lt, S.dur, 1.25, 1.3, 720, 720, 700, 720), () => smithfieldStage(c, t, { sqArm: t > w('f133', 'thief') - 0.3 ? 100 : 20, ty: { x: lerp(820, 720, u), lean: -14 * u, armF: lerp(40, 105, u), elbF: lerp(30, -10, u) }, agit: t > go ? 1.8 : 0.8 }));
    G.slam(c, t, [{ t: 'THIEF!', red: true }], w('f133', 'thief') - 0.05, go - 0.1, { x: 1180, y: 300, size: 200 });
  } },
{ id: 'S62', at: 'f135', desc: 'Mayor William Walworth (medallion) moves to arrest him; the stab glances off the mayor\'s armour (inset).',
  sfx: [[w('f135', 'Walworth'), 'whoosh', 0.6], [w('f135', 'arrest'), 'hooves', 0.6, 1.5], [w('f136', 'stabbed'), 'clang', 1.0], [w('f136', 'armour'), 'tick', 0.5]],
  draw(c, t, lt, S) {
    const ar = w('f135', 'arrest'), st = w('f136', 'stabbed'), wu = easeIO(clamp((t - ar + 0.2) / 1.6));
    withCam(c, push(lt, S.dur, 1.2, 1.28, 640, 720, 640, 720), () => {
      smithfieldStage(c, t, { wx: lerp(200, 560, wu), wwalk: wu > 0 && wu < 1 ? t * 6 : null, rx: 330, sqx: 260, ty: { x: 760, armF: t > st - 0.2 ? 100 : 40, elbF: t > st - 0.2 ? -10 : 30, lean: t > st - 0.2 && t < st + 0.5 ? -12 : 0 } });
      if (t > st && t < st + 0.5) { const r = rng(Math.floor(t * 25)); c.strokeStyle = '#FFE8B0'; c.lineWidth = 4; for (let i = 0; i < 12; i++) { const a = r() * TAU, d = 20 + r() * 60; c.beginPath(); c.moveTo(640, 760); c.lineTo(640 + Math.cos(a) * d, 760 + Math.sin(a) * d); c.stroke(); } }
    });
    G.medallion(c, t, 'walworth', 1650, 300, 115, w('f135', 'Walworth') - 0.15, S.end + 0.3);
    const ma = life(t, w('f136', 'armour') - 0.25, S.end + 0.3, 0.3, 0.3);
    if (ma > 0) { c.save(); c.globalAlpha = ma; c.translate(1450, 760); c.fillStyle = '#3A3A3C'; c.beginPath(); c.arc(0, 0, 150, 0, TAU); c.fill(); c.save(); c.beginPath(); c.arc(0, 0, 146, 0, TAU); c.clip();
      c.strokeStyle = '#B8BCC0'; c.lineWidth = 3; for (let y = -160; y < 160; y += 18) for (let x = -160 + ((y / 18) % 2 ? 9 : 0); x < 160; x += 18) { c.beginPath(); c.arc(x, y, 8, 0, TAU); c.stroke(); } c.restore();
      c.strokeStyle = P.gold; c.lineWidth = 8; c.beginPath(); c.arc(0, 0, 150, 0, TAU); c.stroke(); c.restore();
      G.text(c, 'armour under his robes', 1450, 960, 'italic 400 40px BodoniItalic', P.ink, 'center', ma); }
  } },
{ id: 'S63', at: 'f137', trans: 'flash', dark: true, desc: 'Crimson-tinted silhouettes: Walworth strikes; a royal squire runs Tyler through. Cut to black.',
  sfx: [[w('f137', 'struck'), 'slash', 1.0], [w('f138', 'squire'), 'whoosh', 0.7], [w('f138', 'through') - 0.05, 'thud', 1.0], [w('f138', 'through'), 'impact', 0.8]],
  draw(c, t, lt, S) {
    const th = w('f138', 'through');
    if (black(c, t, th, 0.55)) return;
    const sq = easeOut(clamp((t - w('f138', 'squire') + 0.2) / 0.8));
    withCam(c, push(lt, S.dur, 1.35, 1.45, 700, 720, 700, 720), () => smithfieldStage(c, t, { shadow: true, tint: '#6A1A12', tintA: 0.7, crowdCol: '#2A0E0A', crowdFar: '#3A1410', wx: 560, warmF: t > w('f137', 'struck') - 0.1 ? 120 : 40, welbF: -20, wprop: 'sword', rx: 300, sqx: lerp(260, 700, sq), sqArm: 80, sqwalk: sq > 0 && sq < 1 ? t * 9 : null, ty: { x: 780, armF: 60, lean: t > w('f137', 'struck') ? 10 : 0 } }));
    c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = 'rgba(163,32,28,0.55)'; c.fillRect(0, 0, W, H); c.restore();
    if (t > w('f137', 'struck') && t < w('f137', 'struck') + 0.25) { c.fillStyle = 'rgba(255,240,220,0.5)'; c.fillRect(0, 0, W, H); c.strokeStyle = '#F6EFE0'; c.lineWidth = 10; c.beginPath(); c.moveTo(600, 300); c.lineTo(1100, 700); c.stroke(); }
  } },
{ id: 'S64', at: 'f139', desc: 'Tyler turns his horse towards his men, and falls. Across the field, the bows come up. Hold through the silence.',
  sfx: [[f('f139'), 'hooves', 0.5, 2], [w('f139', 'fell'), 'thud', 0.9], [w('f140', 'drew') - 0.2, 'bowdraw', 1.0], [w('f140', 'drew'), 'crowd', 0.6, 3]],
  draw(c, t, lt, S) {
    const fell = w('f139', 'fell'), u = easeIO(clamp((t - f('f139')) / 2.2)), fa = ramp(t, fell - 0.1, 0.8);
    withCam(c, push(lt, S.dur, 1.05, 1.18, W * 0.52, H * 0.58, W * 0.62, H * 0.56), () => {
      smithfieldStage(c, t, { tint: '#3A2A20', tintA: 0.25, tyler: false, raise: ramp(t, w('f140', 'drew') - 0.4, 0.8), bows: true, agit: 0.3 });
      const x = lerp(800, 1000, u);
      A.horse(c, x, 1000, 190, { face: 1, ...TYLER_HORSE, walk: u < 1 ? t * 5 : null });
      const fy = lerp(907, 1012, easeIn(fa)), fx = x - 4 + fa * 40;
      if (fa < 1) A.figure(c, fx, fy, 180, CH.tyler, { face: 1, seated: fa < 0.25, lean: 85 * easeIn(fa), armF: 60, elbF: 30 });
      else A.figure(c, fx, 1012, 180, PL.shade(CH.tyler, '#2A1E16'), { face: 1, lean: 85, armF: 60, elbF: 30 });
    });
    G.slam(c, t, [{ t: 'and fell', small: true }], fell - 0.05, f('f140') + 0.2, { x: 700, y: 300, size: 180, mode: 'ink' });
    G.slam(c, t, [{ t: 'THE BOWS', red: true }], w('f140', 'drew') - 0.1, S.end - 0.6, { x: 700, y: 300, size: 120, mode: 'ink' });
  } },
{ id: 'S65', at: 'f141', desc: 'The fourteen-year-old king (medallion callback) rides out towards the bows, alone.',
  sfx: [[f('f141') + 0.2, 'hooves', 0.7, 6], [w('f141', 'extraordinary'), 'whoosh', 0.5], [w('f142', 'alone'), 'impact', 0.9]],
  draw(c, t, lt, S) {
    const u = easeIO(clamp((t - f('f142') + 0.8) / 4.5));
    withCam(c, push(lt, S.dur, 1.0, 1.06, W / 2, H * 0.55, W * 0.55, H * 0.55), () => {
      PL.smithfield(c, t);
      A.crowd(c, { x0: 1250, x1: 2100, y: 800, n: 90, hMin: 100, hMax: 180, depth: 170, seed: 5, t, red: 1, face: -1, raise: 1, allBows: true, agit: 0.3 });
      A.rider(c, lerp(260, 900, u), 1010, 230, CH.richard, { face: 1, ...RICHARD_HORSE, walk: u > 0 && u < 1 ? t * 5.5 : null, t });
    });
    G.medallion(c, t, 'richard', 330, 280, 110, f('f141') - 0.1, S.end + 0.3, { role: 'aged 14' });
    G.slam(c, t, [{ t: 'ALONE', red: true }], w('f142', 'alone') - 0.05, S.end + 0.2, { x: 1000, y: 330, size: 190, mode: 'ink' });
  } },
{ id: 'S66', at: 'f143', desc: 'The king before the host: he will be their captain (as one chronicler reports). The bows come down, and they follow.',
  sfx: [[w('f143', 'captain'), 'impact', 0.6], [f('f144'), 'crowd', 0.6, 2.5], [f('f144') + 0.3, 'whoosh', 0.4]],
  draw(c, t, lt, S) {
    const did = f('f144');
    withCam(c, push(lt, S.dur, 1.15, 1.22, 1150, 720, 1150, 720), () => {
      PL.smithfield(c, t);
      A.crowd(c, { x0: 1250, x1: 2100, y: 800, n: 90, hMin: 100, hMax: 180, depth: 170, seed: 5, t, red: 1, face: t > did + 0.6 ? 1 : -1, raise: 1 - ramp(t, did - 0.1, 0.9), allBows: true, agit: 0.3 });
      A.rider(c, 900, 1010, 230, CH.richard, { face: t > did + 0.5 ? -1 : 1, ...RICHARD_HORSE, armF: t < did ? 110 : 40, elbF: 0, t });
    });
    G.text(c, 'according to one chronicler', 700, 200, 'italic 400 40px BodoniItalic', P.ink3, 'center', life(t, f('f143') + 0.1, did, 0.3, 0.3));
    G.slam(c, t, [{ t: 'THEIR CAPTAIN' }], w('f143', 'captain') - 0.1, did, { x: 700, y: 300, size: 110, mode: 'ink' });
    G.slam(c, t, [{ t: 'AND THEY DID', red: true }], did - 0.05, S.end + 0.2, { x: 700, y: 300, size: 110, mode: 'ink' });
  } },
{ id: 'S67', at: 'f145', trans: 'cut', desc: 'The schematic: the host follows the king north to Clerkenwell; the mayor\'s soldiers (blue) close a ring.',
  sfx: [[f('f145'), 'march', 0.6, 3], [w('f146', 'closing'), 'drum', 0.7, 2.5]],
  draw(c, t, lt, S) {
    withCam(c, { x: 760, y: 420, s: 1.35 }, () => {
      PL.londonMap(c, t, { aldgate: 1, savoyBurnt: 1, labels: { Smithfield: 1, Clerkenwell: 1 } });
      const u = ramp(t, f('f145') + 0.1, 2.6, easeIO);
      const kp = PL.lmPath(['Smithfield', 'Clerkenwell'], u); G.token(c, kp[0] + 30, kp[1] - 30, 20, P.gold, 1);
      for (let i = 0; i < 14; i++) { const p = PL.lmPath(['Smithfield', 'Clerkenwell'], clamp(u - 0.05)); G.token(c, p[0] - 80 + (i % 7) * 26, p[1] + 20 + Math.floor(i / 7) * 26, 12, P.red, 1); }
      const cl = ramp(t, w('f146', 'closing') - 0.4, 2.2, easeIO);
      if (cl > 0) for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, R = lerp(380, 150, cl); G.token(c, PL.LM.Clerkenwell[0] + Math.cos(a) * R, PL.LM.Clerkenwell[1] + 30 + Math.sin(a) * R * 0.7, 13, P.blue, clamp(cl * 3)); }
    });
    G.slam(c, t, [{ t: 'CLOSING IN', red: true }], w('f146', 'closing') - 0.1, S.end + 0.2, { x: 1500, y: 860, size: 100, mode: 'ink' });
  } },
{ id: 'S68', at: 'f147', trans: 'ink', dark: true, desc: 'St Bartholomew\'s at dusk; Tyler\'s medallion greys. The tally stick snaps: OVER.',
  sfx: [[f('f147'), 'wind', 0.6, 9], [w('f148', 'beheaded'), 'thud', 0.9], [w('f149', 'over') - 0.05, 'snap', 1.0], [w('f149', 'over'), 'boom', 0.6]],
  draw(c, t, lt, S) {
    const bh = w('f148', 'beheaded'), ov = w('f149', 'over');
    withCam(c, push(lt, S.dur, 1.0, 1.08, W / 2, H * 0.55, W / 2, H * 0.55), () => {
      A.sky(c, 'dusk', t); A.clouds(c, t, 111, 200, 'rgba(120,70,40,0.18)', 5, 5); A.hills(c, 760, 30, 113, '#6A4A30');
      A.priory(c, 960, 880, 180, '#2E241C', true); PL.ground(c, 880, '#5A4630', '#2E2418');
    });
    G.scriptName(c, t, 'St Bartholomew\'s', w('f147', 'Saint') - 0.2, bh - 0.3, { x: W / 2, y: 260, size: 140, role: 'the hospital at Smithfield' });
    G.medallion(c, t, 'tyler', 400, 300, 120, w('f148', 'Walworth') - 0.3, ov - 0.2, { light: true, grey: ramp(t, bh, 0.3), slash: ramp(t, bh, 0.25) });
    G.medallion(c, t, 'walworth', 1520, 300, 120, w('f148', 'Walworth') - 0.15, ov - 0.2, { light: true });
    const ta = life(t, f('f149') - 0.3, S.end + 0.3, 0.3, 0.3);
    if (ta > 0) { const br = ramp(t, ov - 0.05, 0.5, easeOut);
      for (const side of [-1, 1]) { c.save(); c.beginPath(); c.rect(side < 0 ? 0 : W / 2, 0, W / 2, H); c.clip(); c.translate(W / 2 + side * br * 60, 470 + br * 40); c.rotate(side * br * 0.16); c.translate(-W / 2, -470); G.tally(c, t, f('f149') - 0.6, S.end + 0.3, 17, 17, { x: 560, y: 470, w: 800, light: true }); c.restore(); } }
    G.slam(c, t, [{ t: 'OVER', red: true }], ov - 0.05, S.end + 0.2, { y: 270, size: 180 });
  } },

// ================================================================ CH 10  Parchment and rope
{ id: 'S69', at: 'f150', trans: 'black', desc: 'A Mile End charter of freedom: cancelled in red. 2 July 1381.',
  sfx: [[f('f150') + 0.1, 'paper', 0.7], [w('f151', 'revoked') - 0.1, 'quill', 0.9, 1.2], [w('f151', 'revoked') + 0.6, 'impact', 0.6]],
  draw(c, t, lt, S) {
    parchment(c, t, '#6E5030', 0.3);
    withCam(c, push(lt, S.dur, 1.0, 1.08, W / 2, H / 2, W * 0.5, H * 0.48), () => G.documentSheet(c, t, 760, 520, 560, 740, { title: 'Charter of Freedom', titleSize: 46, seal: true, seed: 3, cross: ramp(t, w('f151', 'revoked') - 0.1, 1.0) }));
    G.slam(c, t, [{ t: 'the king\'s promises', small: true }], f('f150') + 0.2, f('f151') + 0.2, { x: 1500, y: 400, size: 130, mode: 'ink' });
    G.slam(c, t, [{ t: 'REVOKED', red: true }], w('f151', 'revoked') + 0.2, S.end + 0.2, { x: 1560, y: 400, size: 110, mode: 'ink' });
    G.dateLine(c, t, { at: f('f151') + 0.1, out: S.end + 0.3, event: 'Every charter revoked', day: '2 July', year: 1381, from: 1377, mode: 'ink', x: 1260 });
  } },
{ id: 'S70', at: 'f152', dark: true, desc: 'The throne room again: the king\'s message, as one chronicler reports it: "Serfs you were, and serfs you will remain."',
  sfx: [[f('f153') - 0.2, 'whoosh', 0.5], [w('f153', 'remain'), 'thud', 0.6]],
  draw(c, t, lt, S) {
    withCam(c, push(lt, S.dur, 1.05, 1.15, W / 2, H * 0.55, W / 2, H * 0.52), () => { throneRoom(c, t); boyKing(c, 960, 905, 330, t); });
    dim(c, 0.2 + 0.4 * ramp(t, f('f153') - 0.4, 0.5));
    G.text(c, 'as one chronicler reports it', W / 2, 150, 'italic 400 42px BodoniItalic', '#F0E6D0', 'center', life(t, f('f152') + 0.3, f('f153'), 0.4, 0.3), 'rgba(0,0,0,0.6)');
    G.quote(c, t, ['Serfs you were,', 'and serfs you will remain.'], f('f153') - 0.15, S.end + 0.3, { size: 84, y: H * 0.45, by: 'Richard II to the men of Essex · as reported', stagger: w('f153', 'and') - f('f153') - 0.1 });
  } },
{ id: 'S71', at: 'f154', trans: 'ink', desc: 'Map: royal judges fan out into the rebel counties; John Ball taken at Coventry, executed at St Albans, 15 July.',
  sfx: [[f('f154') + 0.2, 'whoosh', 0.6], [w('f155', 'Coventry'), 'tick', 0.6], [w('f155', 'Albans'), 'tick', 0.6], [w('f155', 'executed'), 'thud', 0.8]],
  draw(c, t, lt, S) {
    const view = { lon: -0.1, lat: 51.92, span: 3.9 };
    G.drawMap(c, 'se', view, { rivers: ['Thames'] });
    G.mapLabel(c, view, 'London', 1, { size: 32, box: true, dx: -150 });
    const dests = ['Chelmsford', 'Brentwood', 'Maidstone', 'Rochester', 'St Albans', 'Colchester'];
    dests.forEach((d, i) => { const u = ramp(t, f('f154') + 0.3 + i * 0.15, 1.6, easeIO); if (u <= 0) return; const end = G.route(c, view, ['London', d], u, { color: P.blue, w: 4, dash: [12, 9], arrow: false }); G.token(c, end[0], end[1], 16, P.blue, 1); });
    G.mapLabel(c, view, 'Coventry', ramp(t, w('f155', 'Coventry') - 0.2, 0.3), { size: 36, box: true, ring: true, t, dx: 30 });
    const ru = ramp(t, w('f155', 'Coventry') + 0.2, 1.8, easeIO); if (ru > 0) G.route(c, view, ['Coventry', 'St Albans'], ru, { color: P.ink2, w: 5 });
    G.mapLabel(c, view, 'St Albans', ramp(t, w('f155', 'Albans') - 0.2, 0.3), { size: 36, box: true, ring: true, t, dx: 30, dy: -6 });
    const ex = w('f155', 'executed');
    G.medallion(c, t, 'ball', 1650, 300, 115, w('f155', 'John') - 0.15, S.end + 0.3, { grey: ramp(t, ex, 0.3), slash: ramp(t, ex, 0.25) });
    G.dateLine(c, t, { at: w('f155', 'fifteenth') - 0.3, out: S.end + 0.3, event: 'John Ball executed, St Albans', day: '15 July', year: 1381, from: 1377, mode: 'ink', x: 1000, y: 150 });
    G.slam(c, t, [{ t: 'ROYAL JUDGES' }], f('f154') + 0.1, f('f155'), { x: 1450, y: 760, size: 90, mode: 'ink' });
  } },
{ id: 'S72', at: 'f156', dark: true, desc: 'Tally marks fill the dark: at least 1,500 killed or executed by November.',
  sfx: [[f('f156') + 0.2, 'tick', 0.5, 4], [e('f156') - 0.3, 'thud', 0.7]],
  draw(c, t, lt, S) {
    c.fillStyle = '#16120E'; c.fillRect(0, 0, W, H);
    const n = Math.round(1500 * easeIO(clamp((t - f('f156') - 0.2) / (S.dur - 1.0))));
    c.strokeStyle = 'rgba(214,200,170,0.65)'; c.lineWidth = 3; c.beginPath();
    for (let i = 0; i < n; i++) { const col = i % 60, row = Math.floor(i / 60), x = 230 + col * 25 + (col % 5 === 4 ? 0 : 0), y = 380 + row * 25; if (col % 5 === 4) { c.moveTo(x - 102, y + 4); c.lineTo(x + 2, y - 18); } else { c.moveTo(x, y); c.lineTo(x + 1, y - 18); } }
    c.stroke();
    G.counter(c, t, 0, 1500, f('f156') + 0.2, S.dur - 1.0, W / 2, 250, { size: 140, label: 'killed or executed by November · at least' });
  } },
{ id: 'S73', at: 'f157', trans: 'fade', desc: 'The payoff: the manor roll that made men serfs beside the charter cancelled. BEGAN / ENDED.',
  sfx: [[w('f157', 'began'), 'paper', 0.6], [w('f158', 'ended'), 'paper', 0.6], [w('f158', 'cancelled'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    parchment(c, t, '#6E5030', 0.3);
    G.manorRoll(c, t, 600, 110, 380, 760, 1, { highlight: 5 });
    G.documentSheet(c, t, 1330, 500, 500, 660, { title: 'Charter of Freedom', titleSize: 40, seal: true, seed: 3, cross: 1 });
    G.slam(c, t, [{ t: 'IT BEGAN' }, { t: 'with parchment', small: true }], w('f157', 'began') - 0.1, S.end + 0.3, { x: 600, y: 960, size: 80, mode: 'ink' });
    G.slam(c, t, [{ t: 'IT ENDED', red: true }, { t: 'with parchment', small: true }], w('f158', 'ended') - 0.1, S.end + 0.3, { x: 1330, y: 960, size: 80, mode: 'ink' });
    const la = life(t, w('f157', 'manor') - 0.2, S.end + 0.3, 0.3, 0.3); G.text(c, 'the manor rolls', 600, 70, 'italic 400 40px BodoniItalic', P.ink, 'center', la);
    G.text(c, 'a king\'s charter, cancelled', 1330, 120, 'italic 400 40px BodoniItalic', P.ink, 'center', life(t, w('f158', 'charter') - 0.2, S.end + 0.3, 0.3, 0.3));
  } },
{ id: 'S74', at: 'f159', dark: true, desc: 'The council again, frightened; a card: the flat poll tax, DROPPED.',
  sfx: [[w('f159', 'frightened'), 'sting', 0.6], [w('f160', 'dropped'), 'stamp', 1.0]],
  draw(c, t, lt, S) {
    const jit = 1.5 + Math.sin(t * 40) * 1.5;
    c.save(); c.translate(Math.sin(t * 37) * jit * 0.5, 0); councilPlate(c, t, lt, S, 1e9); c.restore();
    G.slam(c, t, [{ t: 'FRIGHTENED' }], w('f159', 'frightened') - 0.1, f('f160') - 0.1, { y: 240, size: 120 });
    const ca = life(t, f('f160') - 0.2, S.end + 0.3, 0.3, 0.3);
    if (ca > 0) { c.save(); c.globalAlpha = ca; c.translate(0, (1 - easeOut(clamp((t - f('f160') + 0.2) / 0.4))) * 120); panel(c, W / 2, 420, 760, 420, 0.97);
      for (let i = 0; i < 3; i++) G.groat(c, 820 + i * 140, 380, 56); G.text(c, 'the flat poll tax', W / 2, 540, 'italic 400 44px BodoniItalic', P.ink, 'center'); c.restore(); }
    G.stamp(c, t, 'DROPPED', w('f160', 'dropped') - 0.05, S.end + 0.3, { x: W / 2, y: 420, size: 130 });
  } },
{ id: 'S75', at: 'f161', trans: 'fade', desc: 'The village (callback to the villein plate): a century passes (1400→1500); the chain fades; rent paid in coin; the labourer works his own strip.',
  sfx: [[f('f161') + 0.2, 'tick', 0.6, 3], [w('f161', 'withered'), 'chain', 0.6], [w('f162', 'money'), 'coin', 0.9], [f('f163'), 'village', 0.6, 3]],
  draw(c, t, lt, S) {
    const wi = w('f161', 'withered'), mo = w('f162', 'money'), wk = f('f163');
    withCam(c, push(lt, S.dur, 1.12, 1.18, 1250, 700, 1290, 705), () => {
      PL.village(c, t, { dusk: 0.15 });
      A.figure(c, 1500, 1000, 300, CH.lord, { face: -1, armF: t > mo ? 50 : 15, elbF: 40 });
      const wu = clamp((t - wk) / 4); const fx = lerp(1060, 900, wu);
      A.figure(c, fx, 1000, 300, CH.peasant, { face: wu > 0 ? -1 : 1, armF: wu > 0 ? 40 + Math.sin(t * 6) * 20 : 30, elbF: 30, prop: 'spade', walk: wu > 0 && wu < 1 ? t * 5 : null, t });
      const ca = 1 - ramp(t, wi - 0.2, 1.4); if (ca > 0) { c.save(); c.globalAlpha = ca; drawChain(c, 1084, 982, 1560, 650, 1, ramp(t, wi, 0.6)); c.restore(); }
      const gu = (t - mo + 0.1) / 0.9; if (gu > 0 && gu < 1) { G.groat(c, lerp(1110, 1450, gu), 760 - Math.sin(gu * Math.PI) * 120, 22); } else if (gu >= 1) G.groat(c, 1452, 760, 22);
    });
    G.dateLine(c, t, { at: f('f161') + 0.2, out: S.end + 0.3, event: 'Serfdom withers away', day: 'c.', year: 1500, from: 1400, rollDur: 3.5, mode: 'ink', y: 150 });
    G.text(c, 'rent, paid in money', 1450, 270, 'italic 400 46px BodoniItalic', P.ink, 'center', life(t, mo - 0.3, S.end + 0.3, 0.3, 0.3));
  } },

// ================================================================ CH 11  The tax that came back
{ id: 'S76', at: 'f164', trans: 'black', desc: 'The odometer rolls 1381 → 1990; a modern form: COMMUNITY CHARGE, stamped POLL TAX.',
  sfx: [[f('f164') + 0.2, 'tick', 0.7, 3], [w('f164', 'flat'), 'paper', 0.7], [w('f166', 'poll'), 'stamp', 1.0]],
  draw(c, t, lt, S) {
    parchment(c, t);
    const fl = w('f164', 'flat');
    G.dateLine(c, t, { at: f('f164') + 0.1, out: S.end + 0.3, event: 'Six hundred and nine years later', day: '', year: 1990, from: 1381, rollDur: 3.0, mode: 'ink', x: 220, y: 470 });
    const ca = ramp(t, fl - 0.3, 0.7, easeOut);
    if (ca > 0) modernCard(c, t, lerp(2200, 1360, ca), 560, t > w('f165', 'Community') - 0.2);
    G.stamp(c, t, 'POLL TAX', w('f166', 'poll') - 0.05, S.end + 0.3, { x: 1360, y: 330, size: 110, rot: -0.1 });
  } },
{ id: 'S77', at: 'f167', dark: true, desc: 'Trafalgar Square, 31 March 1990: a march with placards ends in a riot (silhouettes, smoke, fire).',
  sfx: [[f('f167'), 'crowd', 0.7, 4], [w('f168', 'riot') - 0.2, 'riot', 1.0, 5], [w('f168', 'Trafalgar'), 'impact', 0.5]],
  draw(c, t, lt, S) {
    const ri = w('f168', 'riot');
    withCam(c, push(lt, S.dur, 1.0, 1.08, W / 2, H * 0.55, W / 2, H * 0.55), () => {
      PL.trafalgar(c, t, { riot: ramp(t, ri - 0.3, 1.2) });
      const r = rng(121);
      for (let i = 0; i < 16; i++) { const x = 60 + i * 120 + (r() - 0.5) * 40 + Math.sin(t * 2 + i) * 6, y = 740 + r() * 40; c.strokeStyle = '#121214'; c.lineWidth = 5; c.beginPath(); c.moveTo(x, y + 140); c.lineTo(x, y); c.stroke();
        c.fillStyle = '#E8E4DA'; c.fillRect(x - 50, y - 60, 100, 64); G.text(c, 'NO POLL', x, y - 34, '700 20px Oswald', P.red, 'center'); G.text(c, 'TAX', x, y - 10, '700 20px Oswald', P.red, 'center'); }
      A.crowd(c, { x0: -100, x1: 2020, y: 900, n: 120, hMin: 160, hMax: 260, depth: 160, seed: 123, t, tools: false, color: '#0E0E10', far: '#1E1E22', agit: t > ri ? 2.2 : 0.8, march: 0 });
    });
    if (t > ri) { const fl = Math.max(0, Math.sin(t * 7)) * 0.12; c.fillStyle = `rgba(255,120,60,${fl})`; c.fillRect(0, 0, W, H); }
    G.dateLine(c, t, { at: f('f167') + 0.1, out: S.end + 0.3, event: 'London', day: '31 March', year: 1990, from: 1986, mode: 'light', y: 150 });
    G.scriptName(c, t, 'Trafalgar Square', w('f168', 'Trafalgar') - 0.2, S.end + 0.3, { x: W / 2, y: 470, size: 130 });
  } },
{ id: 'S78', at: 'f169', desc: 'The form again: the prime minister resigns within months; the tax is ABOLISHED (replaced in 1993).',
  sfx: [[w('f169', 'gone'), 'whoosh', 0.6], [w('f170', 'tax'), 'stamp', 1.0]],
  draw(c, t, lt, S) {
    parchment(c, t);
    modernCard(c, t, 1360, 560, true);
    G.stamp(c, t, 'POLL TAX', -1, S.end + 0.3, { x: 1360, y: 330, size: 110, rot: -0.1 });
    G.text(c, 'November 1990', 520, 420, '600 44px Oswald', P.ink2, 'center', life(t, w('f169', 'gone') - 0.6, S.end + 0.3, 0.3, 0.3));
    G.text(c, 'the prime minister resigns', 520, 480, 'italic 400 44px BodoniItalic', P.ink, 'center', life(t, w('f169', 'gone') - 0.6, S.end + 0.3, 0.3, 0.3));
    G.stamp(c, t, 'ABOLISHED', w('f170', 'tax') - 0.05, S.end + 0.3, { x: 1360, y: 640, size: 120, rot: 0.08 });
    G.text(c, 'replaced by the Council Tax, 1993', 520, 680, 'italic 400 36px BodoniItalic', P.ink3, 'center', life(t, w('f170', 'tax') + 0.2, S.end + 0.3, 0.3, 0.3));
  } },
{ id: 'S79', at: 'f171', trans: 'fade', desc: 'Ensemble at dusk: every character of the story on the village field. Leaders to shadow, charters torn, the chain breaks. LOSERS? OR THE FIRST WINNERS? Fade to black; end card.',
  sfx: [[f('f171'), 'village', 0.5, 6], [w('f172', 'leaders'), 'bell', 0.6], [w('f172', 'charters'), 'paper', 0.8], [w('f173', 'outlive') - 0.1, 'chain', 0.9], [w('f174', 'losers'), 'impact', 0.5], [w('f174', 'winners'), 'impact', 0.6], [e('f175') + 1.2, 'boom', 0.5]],
  draw(c, t, lt, S) {
    const ld = w('f172', 'leaders'), chs = w('f172', 'charters'), out = w('f173', 'outlive'), endT = e('f175') + 0.4;
    const cam = push(lt, S.dur - 2, 1.12, 1.0, W / 2, H * 0.58, W / 2, H * 0.52);
    withCam(c, cam, () => {
      PL.village(c, t, { dusk: lerp(0.5, 1, clamp(lt / S.dur)) });
      const rebels = [['ball', 300], ['tyler', 470], ['baker', 640], ['belling', 790], ['peasant', 930], ['woman', 1060], ['peasantR', 1190]];
      rebels.forEach(([k, x], i) => { const sh = (k === 'tyler' || k === 'ball') ? ramp(t, ld - 0.1 + (k === 'ball' ? 0.3 : 0), 0.8) : 0; const sp = CH[k];
        A.figure(c, x, 1000 + (i % 2) * 14, 300, sp, { face: 1, armF: 10 + i * 3, elbF: 15, prop: k === 'ball' ? 'staff' : k === 'peasant' ? 'spade' : k === 'woman' ? 'distaff' : null, t });
        if (sh > 0) { c.save(); c.globalAlpha = sh; A.figure(c, x, 1000 + (i % 2) * 14, 300, PL.shade(sp, '#1E1812'), { face: 1, armF: 10 + i * 3, elbF: 15, prop: k === 'ball' ? 'staff' : null }); c.restore(); } });
      [['richard', 1470, 280], ['walworth', 1620, 300], ['gaunt', 1770, 310]].forEach(([k, x, h]) => A.figure(c, x, 990, h, CH[k], { face: -1, armF: 12 }));
      const chA = life(t, f('f173') - 0.2, S.end, 0.4, 0.6); if (chA > 0) { c.save(); c.globalAlpha = chA; drawChain(c, 960, 990, 1640, 650, 1, ramp(t, out - 0.05, 0.4)); c.restore(); }
    });
    const tr = ramp(t, chs - 0.1, 1.2, easeIn), ta = life(t, chs - 0.4, chs + 1.6, 0.3, 0.4);
    if (ta > 0) for (const side of [-1, 1]) { c.save(); c.globalAlpha = ta; c.beginPath(); c.rect(side < 0 ? 0 : W / 2, 0, W / 2, H); c.clip(); c.translate(W / 2 + side * tr * 300, 330 - tr * 80); c.rotate(side * tr * 0.5); c.translate(-W / 2, -330); G.documentSheet(c, t, W / 2, 330, 260, 330, { title: 'Carta', titleSize: 30, seal: true, seed: 3, lines: 5 }); c.restore(); }
    G.slam(c, t, [{ t: 'defeated?', small: true }], f('f171') + 0.4, chs - 0.4, { y: 260, size: 200 });
    G.slam(c, t, [{ t: 'LOSERS?' }], w('f174', 'losers') - 0.1, w('f174', 'first') - 0.2, { y: 280, size: 140 });
    G.slam(c, t, [{ t: 'OR THE FIRST WINNERS', red: true }, { t: 'of a very long fight', small: true }], w('f174', 'first') - 0.15, endT, { y: 280, size: 110 });
    G.text(c, 'still an open question', W / 2, 470, 'italic 400 52px BodoniItalic', '#F6EFE0', 'center', life(t, w('f175', 'open') - 0.3, endT + 0.3, 0.4, 0.5), 'rgba(0,0,0,0.6)');
    const k = ramp(t, endT, 1.0); if (k > 0) { c.fillStyle = `rgba(11,9,8,${k})`; c.fillRect(0, 0, W, H); }
    const ea = life(t, endT + 1.0, 1e9, 0.6, 0.5);
    if (ea > 0) { G.text(c, 'THE MAJOR', W / 2, 480, '500 46px Oswald', '#D9CBA9', 'center', ea); G.text(c, 'REVOLUTION', W / 2, 600, '900 130px Bodoni', '#F2E8D2', 'center', ea); c.save(); c.globalAlpha = ea; c.fillStyle = P.red; c.fillRect(W / 2 - 520, 628, 1040, 7); c.restore(); }
  } },
];

function modernCard(c, t, x, y, hi) {
  c.save(); c.translate(x, y); c.rotate(0.03);
  c.shadowColor = 'rgba(0,0,0,0.35)'; c.shadowBlur = 24; c.shadowOffsetY = 8; c.fillStyle = '#F7F6F1'; c.fillRect(-330, -420, 660, 840); c.shadowBlur = 0; c.shadowOffsetY = 0;
  c.fillStyle = '#2E4A6A'; c.fillRect(-330, -420, 660, 70);
  G.text(c, 'COMMUNITY CHARGE', -300, -240, '700 52px Oswald', hi ? P.ink : '#4A4A4A', 'left');
  G.text(c, 'Demand notice · 1990', -300, -190, '400 28px Oswald', '#6A6A6A', 'left');
  c.fillStyle = '#C9C9C2'; for (let i = 0; i < 12; i++) c.fillRect(-300, -120 + i * 38, i % 4 === 3 ? 300 : 560, 14);
  c.strokeStyle = '#6A6A6A'; c.lineWidth = 2; c.strokeRect(80, 300, 220, 80); G.text(c, 'per adult', 190, 352, '400 26px Oswald', '#4A4A4A', 'center');
  c.restore();
}
