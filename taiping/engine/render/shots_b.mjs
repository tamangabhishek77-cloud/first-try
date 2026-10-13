// Shots: chapters 4–7 (Brentwood → the Temple).
import { W, H, P, T, clamp, lerp, easeIO, easeOut, easeIn, backOut, ramp, life, rng, mixColor, rgba, noise1, parchment, withCam, push } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';
import * as PL from './plates.mjs';
import { dim, panel, hash, drawChain, manorRollPlate, throneRoom, boyKing, RICHARD_HORSE } from './shots_a.mjs';
const { CH } = A; const f = T.f, e = T.e, w = T.w;
const TAU = Math.PI * 2;

export const ESSEX = [[51.95, 1.28], [52.05, 0.75], [52.08, 0.4], [52.0, 0.05], [51.75, 0.0], [51.6, 0.0], [51.5, 0.02], [51.47, 0.3], [51.5, 0.6], [51.55, 0.95], [51.75, 0.95], [51.85, 1.2]];
export const KENT = [[51.48, 0.0], [51.44, 0.35], [51.47, 0.6], [51.38, 0.9], [51.39, 1.45], [51.15, 1.42], [51.1, 1.3], [51.05, 1.05], [50.92, 0.95], [51.0, 0.6], [51.05, 0.2], [51.15, 0.05], [51.3, 0.05], [51.42, -0.02]];
const lerpView = (a, b, u) => ({ lon: lerp(a.lon, b.lon, u), lat: lerp(a.lat, b.lat, u), span: lerp(a.span, b.span, u) });

// court at Brentwood (S26, S27): one plate, two judges
function court(c, t, lt, S, o) {
  withCam(c, push(lt, S.dur, 1.0, 1.05, W / 2, H * 0.55, W * 0.52, H * 0.56), () => {
    PL.interior(c, t, { dark: 0.3, arches: 2 });
    // villagers behind Baker
    A.crowd(c, { x0: 1380, x1: 1980, y: 900, n: 26, hMin: 200, hMax: 300, depth: 90, seed: 23, t, red: o.red ?? 0, raise: o.raise ?? 0, face: -1, agit: o.agit ?? 0.6 });
    // the judge: seated, or fleeing left
    const fl = o.flee ?? 0;
    if (fl <= 0) A.figure(c, 700, 985, 360, o.judge, { seated: true, face: 1, armF: 50, elbF: 60 });
    else { const x = lerp(700, -300, easeIn(clamp(fl))); A.figure(c, x, 960, 360, o.judge, { face: -1, armF: 60, elbF: 50, walk: t * 9 }); }
    PL.table(c, 700, 990, 640, 120, '#2B4256'); G.documentSheet(c, t, 640, 852, 160, 60, { seed: 4, lines: 1, rot: 0.05 });
    // clerk with the roll
    A.figure(c, 1000, 990, 330, CH.clerk, { face: 1, armF: 40, elbF: 60, prop: 'scroll' });
    // soldiers sent to arrest Baker
    if (o.soldiers != null) { const k = easeIO(clamp(o.soldiers)), back = easeIO(clamp(o.pushBack ?? 0));
      [0, 1].forEach(i => { const x = lerp(-200 - i * 140, 1080 - i * 130, k) - back * 420; A.figure(c, x, 1000 + i * 20, 340, CH.soldier, { face: 1, prop: 'spear', armF: 30, elbF: 20, walk: k > 0 && k < 1 ? t * 7 : null, t }); }); }
    if (o.baker) A.figure(c, 1260, 1000, 350, CH.baker, { face: -1, armF: o.bakerArm ?? 20, elbF: 30 });
  });
}

export const SHOTS_B = [
// ================================================================ CH 4  Brentwood: the spark
{ id: 'S24', at: 'f055', trans: 'cut', desc: 'The map zooms to Essex: John Bampton (medallion) holds his court at Brentwood, 30 May. Tally day 1.',
  sfx: [[f('f055'), 'whoosh', 0.6], [w('f055', 'Bampton'), 'whoosh', 0.5], [w('f056', 'Brentwood'), 'tick', 0.6], [f('f055') + 0.3, 'tick', 0.5]],
  draw(c, t, lt, S) {
    const view = lerpView({ lon: 0.45, lat: 51.5, span: 3.0 }, { lon: 0.42, lat: 51.57, span: 1.1 }, easeIO(clamp(lt / 1.8)));
    G.drawMap(c, 'se', view, { rivers: ['Thames'] });
    G.mapLabel(c, view, 'London', 1, { size: 34, box: true, dx: -150 });
    const [bx, by] = G.proj(view, ...G.PLACES.Brentwood);
    G.token(c, bx, by, 26, P.blue, ramp(t, f('f055') + 0.6, 0.3));
    G.mapLabel(c, view, 'Brentwood', ramp(t, w('f056', 'Brentwood') - 0.1, 0.3), { size: 40, box: true, dx: 34, dy: -10, ring: true, t });
    G.mapLabel(c, view, [51.75, 0.55], ramp(t, w('f056', 'Essex') - 0.1, 0.4), { name: 'ESSEX', dot: false, size: 54 });
    G.medallion(c, t, 'bampton', 1660, 300, 110, w('f055', 'Bampton') - 0.15, S.end + 0.3);
    G.dateLine(c, t, { at: f('f055') + 0.15, out: S.end + 0.3, event: 'Brentwood, Essex', day: '30 May', year: 1381, from: 1377, mode: 'ink' });
    G.tally(c, t, f('f056'), S.end + 0.3, 0, 1, { x: 1150, y: 110 });
  } },
{ id: 'S25', at: 'f057', desc: 'Fobbing, Corringham and Stanford-le-Hope light up; their men (red) are summoned to Brentwood.',
  sfx: [[w('f057', 'Fobbing'), 'tick', 0.6], [w('f057', 'Corringham'), 'tick', 0.6], [w('f057', 'Stanford'), 'tick', 0.6], [w('f057', 'summoned'), 'drum', 0.4, 2]],
  draw(c, t, lt, S) {
    const view = { lon: 0.42, lat: 51.57, span: 1.0 + 0.03 * lt / S.dur };
    G.drawMap(c, 'se', view, { rivers: ['Thames'] });
    G.mapLabel(c, view, 'Brentwood', 1, { size: 40, box: true, dx: 34, dy: -10 });
    const [bx, by] = G.proj(view, ...G.PLACES.Brentwood); G.token(c, bx, by, 26, P.blue, 1);
    const vs = [['Fobbing', 'Fobbing', { dx: 26, dy: -14 }], ['Corringham', 'Corringham', { dx: 28, dy: 26 }], ['Stanford-le-Hope', 'Stanford', { dx: -26, dy: 42, align: 'right' }]];
    vs.forEach(([p, word, o], i) => { const at = w('f057', word) - 0.1, a = ramp(t, at, 0.3); G.mapLabel(c, view, p, a, { size: 34, ring: true, t, color: P.red, ...o });
      const u = ramp(t, w('f058', 'Their') + i * 0.2, 2.2, easeIO); if (u > 0) { const end = G.route(c, view, [p, 'Brentwood'], u, { color: P.red, w: 5, arrow: false }); G.token(c, end[0], end[1], 18, P.red, 1); } });
    G.slam(c, t, [{ t: 'SUMMONED' }], w('f057', 'summoned') - 0.1, S.end + 0.2, { x: 1500, y: 260, size: 100, mode: 'ink' });
  } },
{ id: 'S26', at: 'f058', trans: 'ink', desc: 'The court at Brentwood: Thomas Baker refuses ("nothing more"); soldiers sent in; the villagers fight back; Bampton flees.',
  sfx: [[f('f058'), 'murmur', 0.6, 4], [w('f058', 'nothing'), 'impact', 0.8], [f('f059'), 'march', 0.6, 2], [w('f060', 'fought'), 'roar', 1.0], [w('f060', 'fought') + 0.2, 'scuffle', 0.8, 1.5], [w('f060', 'fled'), 'whoosh', 0.7]],
  draw(c, t, lt, S) {
    const fought = w('f060', 'fought');
    court(c, t, lt, S, { judge: CH.bampton, baker: true, bakerArm: t > w('f058', 'nothing') - 0.2 ? 75 : 20, soldiers: (t - f('f059')) / 1.6, pushBack: (t - fought) / 0.9,
      red: ramp(t, fought - 0.2, 0.8), raise: ramp(t, fought - 0.1, 0.5), agit: t > fought ? 2 : 0.6, flee: (t - w('f060', 'fled')) / 1.6 });
    G.scriptName(c, t, 'Thomas Baker', w('f058', 'Thomas') - 0.1, w('f058', 'nothing') - 0.1, { x: 960, y: 300, size: 120, role: 'of Fobbing' });
    G.slam(c, t, [{ t: 'NOTHING' }, { t: 'MORE', red: true }], w('f058', 'nothing') - 0.05, f('f059') + 0.4, { x: 960, y: 300, size: 130 });
    G.slam(c, t, [{ t: 'ARREST HIM' }], w('f059', 'arrested') - 0.15, fought - 0.1, { x: 960, y: 240, size: 100 });
    G.slam(c, t, [{ t: 'THEY FOUGHT BACK', red: true }], fought - 0.05, S.end + 0.2, { x: 960, y: 240, size: 110 });
  } },
{ id: 'S27', at: 'f061', desc: 'The same court: Chief Justice Bealknap (medallion) comes to punish them, and barely escapes.',
  sfx: [[w('f061', 'Bealknap'), 'whoosh', 0.6], [f('f062'), 'roar', 0.9], [w('f062', 'escaped'), 'whoosh', 0.7]],
  draw(c, t, lt, S) {
    court(c, t, lt, S, { judge: CH.bealknap, red: 1, raise: ramp(t, f('f062') - 0.2, 0.5), agit: t > f('f062') ? 2 : 1, flee: (t - w('f062', 'escaped') + 0.2) / 1.4 });
    G.medallion(c, t, 'bealknap', 1650, 290, 110, w('f061', 'Bealknap') - 0.1, S.end + 0.3, { light: true });
    G.slam(c, t, [{ t: 'came to punish them', small: true }], w('f061', 'punish') - 0.15, f('f062'), { x: 960, y: 230, size: 150 });
    G.slam(c, t, [{ t: 'BARELY' }, { t: 'ESCAPED', red: true }], w('f062', 'barely') - 0.05, S.end + 0.2, { x: 960, y: 260, size: 120 });
  } },
{ id: 'S28', at: 'f063', trans: 'cut', desc: 'Map: red floods Essex, then Kent across the Thames. Tally runs a week.',
  sfx: [[w('f063', 'revolt'), 'roar', 0.7], [w('f064', 'Kent'), 'roar', 0.7], [f('f063'), 'tick', 0.5, 2]],
  draw(c, t, lt, S) {
    const view = { lon: 0.5, lat: 51.52, span: 3.1 - 0.1 * lt / S.dur };
    G.drawMap(c, 'se', view, { rivers: ['Thames'] });
    G.fillRegion(c, 'se', view, ESSEX, P.red, 0.5 * ramp(t, w('f063', 'revolt') - 0.3, 1.0, easeIO));
    G.fillRegion(c, 'se', view, KENT, P.red, 0.5 * ramp(t, w('f064', 'Kent') - 0.3, 1.0, easeIO));
    G.mapLabel(c, view, 'London', 1, { size: 32, box: true, dx: -150 });
    G.mapLabel(c, view, [51.78, 0.55], 1, { name: 'ESSEX', dot: false, size: 56 }); G.mapLabel(c, view, [51.2, 0.62], ramp(t, w('f064', 'Kent') - 0.4, 0.4), { name: 'KENT', dot: false, size: 56 });
    G.mapLabel(c, view, [51.49, 0.85], 0.8, { name: 'Thames', dot: false, size: 30, textColor: '#4E5A56' });
    G.tally(c, t, f('f063') - 0.1, S.end + 0.3, 1, 8, { x: 1180, y: 960, roll: 4 });
  } },

// ================================================================ CH 5  Kent rises
{ id: 'S29', at: 'f065', trans: 'ink', desc: 'Rochester: Robert Belling (medallion), claimed as an escaped serf, led by a royal knight into Rochester Castle.',
  sfx: [[w('f065', 'Belling'), 'whoosh', 0.6], [f('f066'), 'hooves', 0.4, 3], [w('f066', 'locked'), 'gate', 0.9]],
  draw(c, t, lt, S) {
    withCam(c, push(lt, S.dur, 1.0, 1.06, W / 2, H / 2, W * 0.56, H * 0.5), () => {
      PL.rochester(c, t);
      const u = easeIO(clamp((t - f('f066')) / 4.2)), x = lerp(1900, 1290, u), inA = 1 - ramp(t, w('f066', 'locked') - 0.3, 0.6);
      if (inA > 0) { c.save(); c.globalAlpha = inA; A.figure(c, x - 90, 830, 170, CH.soldier, { face: -1, prop: 'sword', armF: 40, elbF: 30, walk: u < 1 ? t * 7 : null });
        A.figure(c, x + 20, 830, 160, CH.belling, { face: -1, armF: 10, armB: 20, walk: u < 1 ? t * 7 + 1 : null }); c.restore(); }
    });
    G.medallion(c, t, 'belling', 300, 280, 110, w('f065', 'Belling') - 0.15, S.end + 0.3);
    G.slam(c, t, [{ t: 'an escaped serf', small: true }], w('f066', 'escaped') - 0.15, w('f066', 'Rochester') - 0.2, { x: 1100, y: 250, size: 150, mode: 'ink' });
    G.scriptName(c, t, 'Rochester Castle', w('f066', 'Rochester') - 0.1, S.end + 0.3, { x: 1100, y: 290, size: 130, mode: 'ink' });
  } },
{ id: 'S30', at: 'f067', desc: 'The same plate: the crowd marches on Rochester (6 June); a white flag; Belling walks free.',
  sfx: [[f('f067'), 'march', 0.8, 3], [w('f067', 'crowd'), 'crowd', 0.7, 3], [w('f068', 'surrendered'), 'whoosh', 0.5], [w('f068', 'walked'), 'cheer', 0.8]],
  draw(c, t, lt, S) {
    withCam(c, push(lt, S.dur, 1.02, 1.08, W * 0.5, H * 0.52, W * 0.55, H * 0.5), () => {
      PL.rochester(c, t, { flag: ramp(t, w('f068', 'surrendered') - 0.2, 0.8) });
      const bw = w('f068', 'Belling'), bu = easeIO(clamp((t - bw + 0.3) / 2.6));
      if (t > bw - 0.4) A.figure(c, lerp(1240, 1560, bu), 830, 160, CH.belling, { face: 1, armF: 50, elbF: -30, armB: -60, walk: bu < 1 ? t * 7 : null });
      const k = easeOut(clamp((t - f('f067')) / 3.5));
      A.crowd(c, { x0: 2300 - k * 900, x1: 3000 - k * 900, y: 920, n: 70, hMin: 120, hMax: 210, depth: 120, seed: 31, t, red: 1, face: -1, raise: 0.4 + 0.4 * ramp(t, bw, 0.5), agit: 1.2 });
    });
    G.dateLine(c, t, { at: f('f067') + 0.1, out: f('f068') + 0.6, event: 'Rochester, Kent', day: '6 June', year: 1381, from: 1377, mode: 'ink', y: 150 });
    G.tally(c, t, f('f067') + 0.2, S.end + 0.3, 7, 8, { x: 1240, y: 270 });
    G.slam(c, t, [{ t: 'WITHOUT A FIGHT' }], w('f068', 'without') - 0.1, w('f068', 'Belling') - 0.1, { x: 700, y: 330, size: 100, mode: 'ink' });
    G.slam(c, t, [{ t: 'FREE', red: true }], w('f068', 'free') - 0.05, S.end + 0.2, { x: 700, y: 330, size: 150, mode: 'ink' });
  } },
{ id: 'S31', at: 'f069', trans: 'fade', desc: 'Maidstone, 7 June: the rebels gather; Wat Tyler steps forward (script name).',
  sfx: [[f('f069'), 'crowd', 0.7, 6], [w('f070', 'Wat') - 0.1, 'impact', 1.0], [w('f070', 'Wat'), 'roar', 0.6]],
  draw(c, t, lt, S) {
    const wat = w('f070', 'Wat');
    withCam(c, push(lt, S.dur, 1.0, 1.08, W / 2, H * 0.55, W / 2, H * 0.56), () => {
      PL.field(c, t, { seed: 21, h1: 600, h2: 690, back: cc => { A.church(cc, 1400, 700, 110, '#4A4036'); [[1150, 60], [1250, 54], [1600, 58], [1700, 52]].forEach(([x, s]) => A.cottage(cc, x, 700, s, false, '#4A4036')); }, gy: 760 });
      A.crowd(c, { x0: -100, x1: 2020, y: 790, n: 110, hMin: 110, hMax: 190, depth: 150, seed: 41, t, red: 1, raise: 0.3 + 0.6 * ramp(t, wat, 0.5), agit: t > wat ? 1.6 : 0.8 });
      const ty = lerp(1300, 1080, easeOut(clamp((t - wat + 0.6) / 0.9)));
      A.figure(c, 960, ty, 560, CH.tyler, { face: 1, armF: 25, elbF: 20, armB: -10 });
    });
    G.dateLine(c, t, { at: f('f069') + 0.15, out: w('f069', 'leader') - 0.2, event: 'Maidstone, Kent', day: '7 June', year: 1381, from: 1377, mode: 'ink', y: 150 });
    G.tally(c, t, f('f069') + 0.3, wat - 0.2, 8, 9, { x: 1240, y: 270 });
    G.slam(c, t, [{ t: 'A LEADER' }], w('f069', 'leader') - 0.1, wat - 0.2, { x: 700, y: 330, size: 120, mode: 'ink' });
    G.scriptName(c, t, 'Wat Tyler', wat - 0.1, S.end + 0.4, { x: 960, y: 300, size: 220, mode: 'ink' });
  } },
{ id: 'S32', at: 'f071', trans: 'cut', desc: 'Tyler\'s medallion beside a blank one: origins unknown. The tally cuts nine notches: NINE DAYS.',
  sfx: [[w('f071', 'nothing'), 'whoosh', 0.6], [w('f072', 'nine'), 'impact', 0.8], [w('f072', 'nine') + 0.3, 'tick', 0.6, 1.6]],
  draw(c, t, lt, S) {
    parchment(c, t);
    const nine = w('f072', 'nine');
    G.medallion(c, t, 'tyler', 600, 400, 150, f('f071') - 0.1, S.end + 0.3);
    G.medallion(c, t, 'tyler', 1050, 400, 150, w('f071', 'nothing') - 0.15, nine - 0.2, { blank: true, name: 'Where from?', role: 'we do not know' });
    G.tally(c, t, nine - 0.3, S.end + 0.3, 8, 17, { x: 560, y: 820, w: 800, roll: 2.0 });
    G.slam(c, t, [{ t: 'NINE DAYS', red: true }], nine - 0.05, S.end + 0.2, { x: 1240, y: 440, size: 130, mode: 'ink' });
    G.text(c, 'one of the most powerful men in England', W / 2, 1000, 'italic 400 40px BodoniItalic', P.ink, 'center', life(t, w('f072', 'powerful') - 0.2, S.end + 0.3, 0.3, 0.3));
  } },
{ id: 'S33', at: 'f073', trans: 'ink', dark: true, desc: 'Maidstone gaol: the bars lift; John Ball (medallion), radical priest, preaching for twenty years (date roll 1361→1381).',
  sfx: [[w('f073', 'freed') - 0.1, 'gate', 1.0], [w('f073', 'freed') + 0.3, 'chain', 0.6], [w('f074', 'John'), 'whoosh', 0.6], [w('f074', 'preaching'), 'tick', 0.5]],
  draw(c, t, lt, S) {
    const fr = w('f073', 'freed');
    withCam(c, push(lt, S.dur, 1.0, 1.12, W / 2, H * 0.55, W / 2, H * 0.52), () => {
      PL.interior(c, t, { dark: 0.55, arches: 1, night: true });
      PL.sun(c, 960, 640, 520, 'rgba(150,170,200,0.32)');
      const step = easeIO(clamp((t - fr - 0.8) / 1.6));
      A.figure(c, 960, lerp(900, 1000, step), lerp(380, 460, step), CH.ball, { face: 1, armF: lerp(10, 40, step), elbF: 20, armB: -10 });
      PL.bars(c, 960, 930, 760, 640, ramp(t, fr - 0.1, 1.0, easeIO));
    });
    G.medallion(c, t, 'ball', 1640, 290, 110, w('f074', 'John') - 0.15, S.end + 0.3, { light: true });
    G.slam(c, t, [{ t: 'a prisoner', small: true }], w('f073', 'prisoner') - 0.15, w('f074', 'John'), { x: 520, y: 300, size: 160 });
    G.scriptName(c, t, 'John Ball', w('f074', 'John') - 0.1, w('f074', 'preaching'), { x: 520, y: 300, size: 150, role: 'a radical priest' });
    G.dateLine(c, t, { at: w('f074', 'preaching') - 0.1, out: S.end + 0.3, event: 'Preaching against lords and bishops', day: '', year: 1381, from: 1361, rollDur: 2.2, mode: 'light' });
  } },
{ id: 'S34', at: 'f075', trans: 'cut', desc: 'Map: Maidstone to Canterbury (10 June), then the road to London.',
  sfx: [[f('f075'), 'march', 0.6, 3], [w('f075', 'Canterbury'), 'tick', 0.6], [w('f076', 'road'), 'march', 0.7, 2.5], [w('f076', 'London'), 'impact', 0.6]],
  draw(c, t, lt, S) {
    const view = { lon: 0.55, lat: 51.37, span: 1.9 };
    G.drawMap(c, 'se', view, { rivers: ['Thames'] });
    for (const p of ['Maidstone', 'Rochester', 'Dartford']) G.mapLabel(c, view, p, 1, { size: 30 });
    const u1 = ramp(t, f('f075') + 0.2, 2.6, easeIO); if (u1 > 0) { const e1 = G.route(c, view, ['Maidstone', 'Canterbury'], u1); }
    G.mapLabel(c, view, 'Canterbury', ramp(t, w('f075', 'Canterbury') - 0.15, 0.3), { size: 38, box: true, ring: true, t, color: P.red, dx: -40, dy: 56 });
    const u2 = ramp(t, w('f076', 'road') - 0.3, 2.6, easeIO); if (u2 > 0) { const e2 = G.route(c, view, ['Canterbury', 'Rochester', 'Dartford', 'Blackheath'], u2); G.token(c, e2[0], e2[1], 20, P.red, 1); }
    G.mapLabel(c, view, 'London', ramp(t, w('f076', 'London') - 0.3, 0.3), { size: 38, box: true, dx: -170, dy: -30 });
    G.dateLine(c, t, { at: f('f075') + 0.1, out: S.end + 0.3, event: 'Canterbury', day: '10 June', year: 1381, from: 1377, mode: 'ink' });
    G.tally(c, t, f('f075') + 0.2, S.end + 0.3, 11, 12, { x: 1150, y: 110 });
  } },

// ================================================================ CH 6  Blackheath
{ id: 'S35', at: 'f077', trans: 'whip', dark: true, desc: 'Blackheath at dusk (12 June): the Kent camp, fires, tents; London on the horizon.',
  sfx: [[f('f077') - 0.2, 'camp', 0.8, 6.5], [w('f077', 'Blackheath'), 'tick', 0.5]],
  draw(c, t, lt, S) {
    withCam(c, push(lt, S.dur, 1.0, 1.1, W * 0.5, H * 0.58, W * 0.46, H * 0.5), () => {
      PL.blackheath(c, t);
      A.crowd(c, { x0: -100, x1: 2020, y: 860, n: 90, hMin: 150, hMax: 260, depth: 160, seed: 51, t, red: 0.85, color: '#2A221A', far: '#4A3C2C', raise: 0.2, agit: 0.5 });
    });
    G.scriptName(c, t, 'Blackheath', w('f077', 'Blackheath') - 0.15, f('f078') + 0.8, { x: W * 0.5, y: 300, size: 170 });
    G.text(c, 'London', 840, 520, 'italic 400 40px FellItalic', '#F0E6D0', 'center', life(t, w('f078', 'city') - 0.3, S.end + 0.3, 0.4, 0.3), 'rgba(0,0,0,0.6)');
    G.dateLine(c, t, { at: f('f077') + 0.15, out: S.end + 0.3, event: 'Blackheath, south of London', day: '12 June', year: 1381, from: 1377, mode: 'light' });
    G.tally(c, t, f('f077') + 0.3, S.end + 0.3, 13, 14, { x: 1200, y: 110, light: true });
  } },
{ id: 'S36', at: 'f079', dark: true, desc: 'John Ball preaches from a cart. Quote card: "When Adam delved and Eve span…" Adam and Eve; NOBODY WAS BORN A LORD.',
  sfx: [[f('f079'), 'crowd', 0.5, 4], [f('f080') - 0.2, 'whoosh', 0.5], [w('f081', 'nobody'), 'impact', 1.0], [w('f081', 'lord'), 'roar', 0.6]],
  draw(c, t, lt, S) {
    withCam(c, push(lt, S.dur, 1.3, 1.42, W / 2, H * 0.56, W / 2, H * 0.54), () => {
      PL.blackheath(c, t);
      cart(c, 960, 880, 1.2);
      A.figure(c, 960, 800, 360, CH.ball, { face: 1, armF: 150 + Math.sin(t * 1.8) * 10, elbF: -10, armB: -130, elbB: -10 });
      A.crowd(c, { x0: 200, x1: 1720, y: 1010, n: 50, hMin: 220, hMax: 300, depth: 60, seed: 57, t, red: 0.7, color: '#241C14', far: '#3A2E22', agit: 0.4 });
    });
    const q0 = f('f080'), q1 = e('f080') + 0.25;
    if (t > q0 - 0.5 && t < q1 + 0.6) dim(c, 0.55 * life(t, q0 - 0.4, q1 + 0.3, 0.4, 0.4));
    G.quote(c, t, ['When Adam delved and Eve span,', 'who was then the gentleman?'], q0 - 0.1, q1, { size: 78, y: H * 0.45, by: 'John Ball\'s sermon · Blackheath, 1381', stagger: w('f080', 'who') - q0 - 0.2 });
    const ae = life(t, f('f081') - 0.1, S.end + 0.3, 0.3, 0.3);
    if (ae > 0) { dim(c, 0.45 * ae); c.save(); c.globalAlpha = ae; c.fillStyle = 'rgba(236,226,204,0.95)'; c.beginPath(); c.arc(W / 2, 640, 250, 0, TAU); c.fill(); c.strokeStyle = P.gold; c.lineWidth = 10; c.stroke();
      c.save(); c.beginPath(); c.arc(W / 2, 640, 245, 0, TAU); c.clip(); A.hills(c, 760, 30, 3, '#B5A07A', 700, 1220); c.fillStyle = '#9A8458'; c.fillRect(700, 760, 520, 200);
      A.figure(c, 880, 820, 240, CH.peasant, { face: 1, prop: 'spade', armF: 40 + Math.sin(t * 3) * 20, elbF: 30, t }); A.figure(c, 1040, 820, 225, CH.woman, { face: -1, prop: 'distaff', armF: 45, elbF: 40, t }); c.restore(); c.restore(); }
    G.slam(c, t, [{ t: 'NOBODY' }, { t: 'was born a', small: true }, { t: 'LORD', red: true }], w('f081', 'nobody') - 0.05, S.end + 0.2, { y: 250, size: 120 });
  } },
{ id: 'S37', at: 'f082', trans: 'ink', desc: 'What the rebels did not say: the king\'s medallion stays; the watchword banner: WITH KING RICHARD AND THE TRUE COMMONS.',
  sfx: [[w('f082', 'notice'), 'whoosh', 0.5], [w('f084', 'watchword'), 'paper', 0.7], [w('f084', 'King'), 'impact', 0.6], [w('f084', 'true'), 'impact', 0.7]],
  draw(c, t, lt, S) {
    parchment(c, t);
    G.medallion(c, t, 'richard', 960, 400, 170, f('f082') + 0.1, S.end + 0.3, { role: 'King of England, aged 14' });
    G.slam(c, t, [{ t: 'what they did NOT say', small: true }], w('f082', 'notice') - 0.1, f('f083') + 0.3, { y: 140, size: 170, mode: 'ink' });
    G.slam(c, t, [{ t: 'NOT AGAINST THE KING' }], w('f083', 'not') - 0.1, f('f084'), { y: 150, size: 90, mode: 'ink' });
    const ba = ramp(t, w('f084', 'watchword') - 0.2, 0.6, easeOut);
    if (ba > 0) { c.save(); c.translate(W / 2, 840); c.scale(ba, 1); c.fillStyle = P.red; c.beginPath(); c.moveTo(-760, -90); c.lineTo(760, -90); c.lineTo(720, 0); c.lineTo(760, 90); c.lineTo(-760, 90); c.lineTo(-720, 0); c.closePath(); c.fill(); c.restore();
      G.text(c, 'WITH KING RICHARD', W / 2 - 10, 828, '700 62px Cinzel', '#F6EFE0', 'right', ramp(t, w('f084', 'King') - 0.15, 0.3));
      G.text(c, 'AND THE TRUE COMMONS', W / 2 + 30, 828, '700 62px Cinzel', P.gold2, 'left', ramp(t, w('f084', 'true') - 0.25, 0.3));
      G.text(c, 'the rebels\' watchword', W / 2, 900, 'italic 400 34px BodoniItalic', '#F0E6D0', 'center', ramp(t, w('f084', 'watchword'), 0.4)); }
  } },
{ id: 'S38', at: 'f085', trans: 'cut', dark: true, desc: 'Throne room callback: the boy king, and the three advisers in shadow stepping in front of him.',
  sfx: [[w('f086', 'corrupt') - 0.2, 'whoosh', 0.7], [w('f086', 'advisers'), 'sting', 0.7]],
  draw(c, t, lt, S) {
    const adv = w('f086', 'corrupt') - 0.2;
    withCam(c, push(lt, S.dur, 1.0, 1.08, W / 2, H * 0.55, W / 2, H * 0.55), () => {
      throneRoom(c, t); boyKing(c, 960, 905, 330, t);
      [['sudbury', 700, 0], ['hales', 1220, 0.15], ['gaunt', 960, 0.3]].forEach(([k, x, d], i) => { const u = easeOut(clamp((t - adv - d) / 0.9)); if (u <= 0) return;
        c.save(); c.globalAlpha = u * 0.92; A.figure(c, lerp(x + (i === 1 ? 500 : -500), x, u), 1060, 520, PL.shade(CH[k], '#14110E'), { face: i === 1 ? -1 : 1, armF: 10 }); c.restore();
        G.text(c, CH[k].name, lerp(x + (i === 1 ? 500 : -500), x, u), 1040, '600 26px Cinzel', '#E6D9BE', 'center', ramp(t, adv + 0.9 + d, 0.3)); });
    });
    G.slam(c, t, [{ t: 'ON THEIR SIDE' }], w('f085', 'side') - 0.2, adv, { y: 250, size: 110 });
    G.slam(c, t, [{ t: 'CORRUPT ADVISERS', red: true }], adv + 0.1, S.end + 0.2, { y: 220, size: 100 });
  } },
{ id: 'S39', at: 'f087', trans: 'fade', desc: 'The Thames, 13 June: the royal barge comes down river, will not land, and turns back. Silence.',
  sfx: [[f('f087') - 0.2, 'water', 0.8, 15], [f('f087') + 0.5, 'oars', 0.6, 4], [f('f089'), 'crowd', 0.8, 3], [w('f090', 'turned'), 'oars', 0.6, 3]],
  draw(c, t, lt, S) {
    const tb = w('f090', 'turned'), arrive = easeOut(clamp((t - f('f087')) / 4.6)), back = easeIO(clamp((t - tb) / 3.2));
    const bx = lerp(-420, 860, arrive) - back * 1500;
    withCam(c, push(lt, S.dur, 1.0, 1.1, W / 2, H / 2, W * 0.52, H * 0.55), () => {
      A.sky(c, 'day', t); A.clouds(c, t, 71, 170, 'rgba(252,244,228,0.3)', 5, 6);
      c.fillStyle = '#8A7A62'; for (let i = 0; i < 30; i++) { const x = i * 70 - 40, h = 30 + (i * 53 % 50); c.fillRect(x, 430 - h, 62, h); }
      c.fillStyle = '#7A6A50'; c.fillRect(-W, 425, W * 3, 20);
      c.fillStyle = '#9AA39C'; c.fillRect(-W, 440, W * 3, 400);
      c.strokeStyle = 'rgba(255,255,255,0.25)'; c.lineWidth = 2; for (let i = 0; i < 14; i++) { const y = 470 + i * 26; c.setLineDash([70, 220]); c.lineDashOffset = -(t * 26 + i * 91) % 290; c.beginPath(); c.moveTo(-50, y); c.lineTo(W + 50, y); c.stroke(); } c.setLineDash([]);
      A.barge(c, bx, 690, 110, t);
      A.figure(c, bx - 10, 662, 120, CH.richard, { face: back > 0 ? -1 : 1, armF: 20 }); A.figure(c, bx - 60, 662, 120, PL.shade(CH.sudbury), { face: 1 }); A.figure(c, bx + 50, 662, 120, PL.shade(CH.gaunt), { face: 1 });
      c.fillStyle = '#6E5A3C'; c.beginPath(); c.moveTo(-W, H * 2); c.lineTo(-W, 840); for (let x = -100; x <= W + 100; x += 40) c.lineTo(x, 835 + Math.sin(x / 120) * 12); c.lineTo(W * 2, H * 2); c.fill();
      A.crowd(c, { x0: 900, x1: 2050, y: 880, n: 70, hMin: 130, hMax: 220, depth: 150, seed: 61, t, red: 1, face: -1, raise: 0.3 + 0.6 * ramp(t, f('f089'), 0.6) - 0.6 * ramp(t, tb + 1.5, 2), agit: t > f('f089') && t < tb + 1 ? 2 : 0.5 });
    });
    G.dateLine(c, t, { at: f('f087') + 0.2, out: f('f088'), event: 'The royal barge, the Thames', day: '13 June', year: 1381, from: 1377, mode: 'ink', y: 150 });
    G.tally(c, t, f('f087') + 0.3, f('f088') + 0.5, 14, 15, { x: 1240, y: 270 });
    G.slam(c, t, [{ t: 'WOULD NOT LET HIM LAND' }], w('f088', 'not') - 0.1, f('f089'), { x: 960, y: 230, size: 90, mode: 'ink' });
    G.slam(c, t, [{ t: 'NO KING, NO TALK', red: true }], w('f089', 'not') - 0.2, tb - 0.1, { x: 960, y: 230, size: 90, mode: 'ink' });
  } },

// ================================================================ CH 7  London opens its gates
{ id: 'S40', at: 'f091', trans: 'black', desc: 'London Bridge: the drawbridge is lowered from inside; the rebels pour across (13 June).',
  sfx: [[w('f091', 'opened') - 0.2, 'gate', 1.0], [w('f091', 'opened') + 0.4, 'chain', 0.7], [w('f091', 'opened') + 0.8, 'march', 0.8, 3]],
  draw(c, t, lt, S) {
    const op = w('f091', 'opened');
    withCam(c, push(lt, S.dur, 1.1, 1.3, 1200, 650, 1250, 660), () => {
      PL.london(c, t, { bridgeOpen: ramp(t, op - 0.3, 1.6, easeIO) });
      const k = easeIO(clamp((t - op - 1.2) / 3.4));
      c.save(); c.beginPath(); c.rect(-200, 0, 2400, 742); c.clip();
      if (k > 0) A.crowd(c, { x0: 1500 - k * 900, x1: 2300 - k * 900, y: 741, n: 46, hMin: 34, hMax: 46, depth: 3, seed: 11, t, red: 1, face: -1, agit: 0.6 });
      c.restore();
    });
    G.dateLine(c, t, { at: f('f091') + 0.2, out: S.end + 0.3, event: 'London Bridge', day: '13 June', year: 1381, from: 1377, mode: 'ink' });
    G.slam(c, t, [{ t: 'someone inside', small: true }], w('f091', 'someone') - 0.15, S.end + 0.2, { x: 700, y: 260, size: 150, mode: 'ink' });
  } },
{ id: 'S41', at: 'f092', trans: 'cut', desc: 'Aldgate: the portcullis rises; the men of Essex march in.',
  sfx: [[w('f092', 'opened') - 0.2, 'gate', 1.0], [w('f092', 'Essex'), 'march', 0.8, 2.5]],
  draw(c, t, lt, S) {
    const op = w('f092', 'opened');
    withCam(c, push(lt, S.dur, 1.0, 1.08, W / 2, H / 2, W * 0.5, H * 0.52), () => {
      A.sky(c, 'day', t); A.clouds(c, t, 81, 170, 'rgba(252,244,228,0.3)', 5, 6);
      const r = rng(8); for (let i = 0; i < 30; i++) { const x = i * 68 - 20, h = 60 + r() * 80; c.fillStyle = '#8A7A62'; c.fillRect(x, 690 - h, 60, h); c.beginPath(); c.moveTo(x - 4, 690 - h); c.lineTo(x + 30, 690 - h - 30); c.lineTo(x + 64, 690 - h); c.fill(); }
      A.stPauls(c, 560, 690, 34, '#7A6A52');
      A.cityGate(c, 960, 840, 140, '#3E352B', ramp(t, op - 0.3, 1.3, easeIO));
      PL.ground(c, 840, '#9A8458', '#6A563A');
      const k = easeIO(clamp((t - op) / 3.6));
      A.crowd(c, { x0: 2100 - k * 900, x1: 2900 - k * 900, y: 900, n: 60, hMin: 130, hMax: 210, depth: 120, seed: 71, t, red: 1, face: -1, raise: 0.5, agit: 1 });
    });
    G.scriptName(c, t, 'Aldgate', w('f092', 'Aldgate') - 0.15, S.end + 0.3, { x: 960, y: 230, size: 170, mode: 'ink' });
    G.text(c, 'the men of Essex', 1500, 560, 'italic 400 44px BodoniItalic', P.ink, 'center', life(t, w('f092', 'Essex') - 0.3, S.end + 0.3, 0.3, 0.3));
  } },
{ id: 'S42', at: 'f093', trans: 'cut', desc: 'The London schematic: red tokens pour in at the bridge and Aldgate; INSIDE THE CAPITAL; then straight for the Savoy.',
  sfx: [[f('f093'), 'whoosh', 0.6], [w('f093', 'inside'), 'impact', 0.8], [w('f094', 'straight'), 'march', 0.6, 2]],
  draw(c, t, lt, S) {
    PL.londonMap(c, t, { aldgate: 1 });
    const u = ramp(t, f('f093') - 0.1, 1.8, easeIO);
    for (let i = 0; i < 6; i++) { const ua = clamp(u * 1.3 - i * 0.06); if (ua > 0) { const p = PL.lmPath(['Southwark', 'Bridge', [1000, 600]], ua); G.token(c, p[0] + (i % 3) * 22 - 22, p[1] + Math.floor(i / 3) * 22, 15, P.red, 1); }
      const ub = clamp(u * 1.3 - i * 0.06); if (ub > 0) { const p = PL.lmPath([[1500, 470], 'Aldgate', [1100, 500]], ub); G.token(c, p[0] + (i % 3) * 22 - 22, p[1] + Math.floor(i / 3) * 22, 15, P.red, 1); } }
    PL.screenRoute(c, [[960, 560], 'StPauls', [700, 640], 'Savoy'], ramp(t, w('f094', 'straight') - 0.2, 1.6, easeIO));
    if (t > w('f094', 'Savoy') - 0.2) { c.save(); c.strokeStyle = P.red; c.lineWidth = 5; c.beginPath(); c.arc(PL.LM.Savoy[0], PL.LM.Savoy[1] - 20, 70 + Math.sin(t * 5) * 4, 0, TAU); c.stroke(); c.restore(); }
    const sa = life(t, w('f093', 'inside') - 0.15, S.end + 0.3, 0.12, 0.3); if (sa > 0) { c.save(); c.globalAlpha = sa; panel(c, W / 2, 170, 1100, 200, 0.9); c.restore(); }
    G.slam(c, t, [{ t: 'INSIDE', red: true }, { t: 'the capital', small: true }], w('f093', 'inside') - 0.05, S.end + 0.2, { y: 170, size: 110, mode: 'ink' });
  } },
{ id: 'S43', at: 'f095', trans: 'whip', desc: 'The Savoy, John of Gaunt\'s palace (medallion callback): smashed, burned, its treasures thrown into the Thames.',
  sfx: [[w('f096', 'smashed'), 'smash', 1.0], [w('f096', 'burned') - 0.1, 'fire', 0.9, 8], [w('f096', 'threw'), 'splash', 0.8], [w('f096', 'threw') + 0.6, 'splash', 0.7], [w('f096', 'Thames'), 'splash', 0.8]],
  draw(c, t, lt, S) {
    const sm = w('f096', 'smashed'), bu = w('f096', 'burned'), th = w('f096', 'threw');
    const shake = Math.max(0, 1 - (t - sm) / 0.5) * (t > sm ? 1 : 0);
    withCam(c, { ...push(lt, S.dur, 1.0, 1.08, W / 2, H / 2, W / 2, H * 0.52), x: W / 2 + Math.sin(t * 80) * 10 * shake }, () => {
      PL.savoy(c, t, { fire: ramp(t, bu - 0.2, 1.4, easeIO), burnt: ramp(t, bu + 1, 3) });
      if (t > sm) { const r = rng(5); c.fillStyle = '#C9C6BC'; for (let i = 0; i < 30; i++) { const a = clamp((t - sm) / 0.8); c.globalAlpha = 1 - a; c.fillRect(700 + r() * 520 + (r() - 0.5) * 200 * a, 600 + r() * 60 + a * a * 200, 6, 6); } c.globalAlpha = 1; }
      for (let i = 0; i < 6; i++) { const t0 = th + i * 0.45, u = (t - t0) / 1.0; if (u < 0 || u > 1.6) continue; const x0 = 760 + i * 90, x1 = x0 + 140 + i * 30;
        if (u <= 1) { const x = lerp(x0, x1, u), y = 620 - Math.sin(u * Math.PI) * 220 + u * 230; c.save(); c.translate(x, y); c.rotate(u * 6); i % 2 ? G.groat(c, 0, 0, 16) : (c.fillStyle = P.gold, c.fillRect(-18, -12, 36, 24)); c.restore(); }
        else { const k = (u - 1) / 0.6; c.strokeStyle = `rgba(240,240,230,${1 - k})`; c.lineWidth = 4; c.beginPath(); c.ellipse(x1, 852, 20 + k * 60, 6 + k * 14, 0, 0, TAU); c.stroke(); } }
    });
    G.scriptName(c, t, 'The Savoy', f('f095') - 0.1, sm - 0.2, { x: 700, y: 260, size: 160, mode: 'ink', role: 'the finest house in England' });
    G.medallion(c, t, 'gaunt', 1640, 280, 110, w('f095', 'Gaunt') - 0.15, sm, {});
    G.slam(c, t, [{ t: 'SMASHED' }], sm - 0.05, bu - 0.05, { y: 250, size: 120 });
    G.slam(c, t, [{ t: 'BURNED', red: true }], bu - 0.05, th - 0.05, { y: 250, size: 130 });
    G.slam(c, t, [{ t: 'INTO THE THAMES' }], th - 0.05, S.end + 0.2, { y: 250, size: 110 });
  } },
{ id: 'S44', at: 'f097', trans: 'cut', dark: true, desc: 'The Savoy burning: THEY REFUSED TO STEAL; quote card: "zealots for truth and justice, not thieves and robbers".',
  sfx: [[f('f097'), 'fire', 0.7, 7], [w('f097', 'refused'), 'impact', 0.8], [f('f098') - 0.2, 'whoosh', 0.5]],
  draw(c, t, lt, S) {
    withCam(c, push(lt, S.dur, 1.25, 1.35, W / 2, H * 0.5, W / 2, H * 0.48), () => PL.savoy(c, t, { fire: 1, burnt: 1 }));
    const q0 = f('f098'), q1 = S.end;
    dim(c, 0.2 + 0.4 * ramp(t, q0 - 0.4, 0.5));
    G.slam(c, t, [{ t: 'THEY REFUSED' }, { t: 'to steal', small: true }], w('f097', 'refused') - 0.1, q0 - 0.2, { y: H * 0.42, size: 140 });
    G.quote(c, t, ['We are zealots for truth and justice,', 'not thieves and robbers.'], q0 - 0.1, q1 + 0.4, { size: 70, y: H * 0.44, by: 'the rebels, as reported by a chronicler', stagger: w('f098', 'not') - q0 - 0.2 });
  } },
{ id: 'S45', at: 'f099', trans: 'cut', dark: true, desc: 'A silhouette with a silver cup; "one chronicler claims"; the flames take him and the cup.',
  sfx: [[w('f099', 'silver'), 'coin', 0.7], [w('f099', 'fire') - 0.2, 'fire', 1.0, 3], [w('f099', 'fire'), 'whoosh', 0.8]],
  draw(c, t, lt, S) {
    const fi = w('f099', 'fire');
    withCam(c, { x: 820, y: 640, s: 1.9 + 0.08 * lt / S.dur }, () => PL.savoy(c, t, { fire: 1, burnt: 1 }));
    const fa = 1 - ramp(t, fi + 0.2, 0.8);
    if (fa > 0) { c.save(); c.globalAlpha = fa; A.figure(c, 900, 1130, 760, PL.shade(CH.peasantR, '#120E0B'), { face: 1, prop: 'cup', armF: 70, elbF: 70, armB: -10 }); c.restore();
      if (t > w('f099', 'silver') - 0.2) { c.save(); c.globalAlpha = fa * ramp(t, w('f099', 'silver') - 0.2, 0.3); c.strokeStyle = P.gold2; c.lineWidth = 6; c.beginPath(); c.arc(1150, 640, 70 + Math.sin(t * 6) * 4, 0, TAU); c.stroke(); c.restore(); } }
    if (t > fi - 0.3) { const u = ramp(t, fi - 0.3, 0.9); A.flames(c, 960, 1100, 1400, 900 * u, t, 91, 14); }
    G.text(c, 'one chronicler claims', 120, 140, 'italic 400 40px BodoniItalic', '#F0E6D0', 'left', life(t, f('f099'), S.end, 0.4, 0.3), 'rgba(0,0,0,0.6)');
  } },
{ id: 'S46', at: 'f100', trans: 'smoke', desc: 'The Temple, home of the lawyers: its books and records carried out and burned.',
  sfx: [[w('f100', 'Temple'), 'tick', 0.5], [w('f101', 'books'), 'paper', 0.9], [w('f101', 'burned') - 0.1, 'fire', 0.9, 4]],
  draw(c, t, lt, S) {
    const bk = w('f101', 'books'), bu = w('f101', 'burned');
    withCam(c, push(lt, S.dur, 1.0, 1.08, W / 2, H / 2, W / 2, H * 0.55), () => {
      PL.temple(c, t, { fire: ramp(t, bu, 1.2) });
      const r = rng(17); for (let i = 0; i < 14; i++) { const at = bk - 0.2 + i * 0.12, a = ramp(t, at, 0.25); if (a <= 0) continue;
        G.documentSheet(c, t, 820 + r() * 360, lerp(760, 960 - (i % 4) * 14, a), 170, 120, { seed: i + 30, lines: 3, rot: (r() - 0.5) * 1.2, burn: ramp(t, bu + i * 0.08, 2.2) * 0.85 }); }
      if (t > bu - 0.2) A.flames(c, 1000, 990, 520, 320 * ramp(t, bu - 0.2, 0.8), t, 47, 11);
      A.crowd(c, { x0: 1250, x1: 2000, y: 900, n: 30, hMin: 170, hMax: 240, depth: 100, seed: 81, t, red: 1, face: -1, raise: 0.6, tools: true });
    });
    G.scriptName(c, t, 'The Temple', w('f100', 'Temple') - 0.15, S.end + 0.3, { x: 960, y: 240, size: 160, mode: 'ink', role: 'home of the lawyers' });
  } },
{ id: 'S47', at: 'f102', trans: 'cut', desc: 'Callback: the same manor roll with its REMEMBER tag; it burns. BURN THE PARCHMENT — and the chain snaps: BURN THE CHAINS.',
  sfx: [[f('f102'), 'paper', 0.6], [w('f103', 'Burn') - 0.1, 'fire', 1.0, 4], [w('f103', 'chains') - 0.05, 'chain', 1.0], [w('f103', 'chains'), 'impact', 0.9]],
  draw(c, t, lt, S) {
    const bu = w('f103', 'Burn'), ch = w('f103', 'chains');
    manorRollPlate(c, t, lt, S, { unroll: 1, tag: 'REMEMBER', burn: ramp(t, bu - 0.2, 2.8, easeIO) });
    G.slam(c, t, [{ t: 'Remember the manor rolls?', small: true }], f('f102') - 0.05, bu - 0.3, { x: W * 0.28, y: 520, size: 120, mode: 'ink' });
    G.slam(c, t, [{ t: 'BURN' }, { t: 'THE PARCHMENT' }], bu - 0.05, ch - 0.1, { x: W * 0.23, y: 500, size: 86, mode: 'ink' });
    G.slam(c, t, [{ t: 'BURN' }, { t: 'THE CHAINS', red: true }], ch - 0.05, S.end + 0.2, { x: W * 0.25, y: 500, size: 100, mode: 'ink' });
    const ca = life(t, w('f103', 'parchment'), S.end + 0.3, 0.3, 0.3); if (ca > 0) { c.save(); c.globalAlpha = ca; drawChain(c, 120, 820, 960, 820, 1, ramp(t, ch - 0.05, 0.3)); c.restore(); }
  } },
];

function cart(c, x, y, s) { c.fillStyle = '#4A3420'; c.fillRect(x - 160 * s, y - 80 * s, 320 * s, 40 * s); c.fillStyle = '#2A1E14'; for (const dx of [-110, 110]) { c.beginPath(); c.arc(x + dx * s, y, 48 * s, 0, TAU); c.fill(); c.fillStyle = '#5A4430'; c.beginPath(); c.arc(x + dx * s, y, 14 * s, 0, TAU); c.fill(); c.fillStyle = '#2A1E14'; } }
