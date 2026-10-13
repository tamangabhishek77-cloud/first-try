// Thumbnails for the Taiping episode (one round of four). Same system as thumbs3.mjs: Anton headlines with heavy stroke,
// the film's own character and plate drawings, a warm rim light, vignette grade; each saved at 1280x720 plus a 168x94 phone check.
import fs from 'fs';
import { GlobalFonts, createCanvas } from '@napi-rs/canvas';
import { W, H, P, makeCanvas, TEX, puff, rng, mixColor, lerp } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';
import * as PL from './plates.mjs';
GlobalFonts.registerFromPath('/home/claude/project/fonts/Anton-Regular.ttf', 'Anton');
const OUT = '/home/claude/project/out/thumbnails_taiping'; fs.mkdirSync(OUT, { recursive: true });
const RED = '#E0262B', CREAM = '#F7F0E2', YEL = '#F2C200'; const t = 3.0; const { CH } = A; const TAU = Math.PI * 2;

function head(c, parts, x, y, size, align = 'left', stroke = 16) {
  c.save(); c.font = `${size}px Anton`; c.textBaseline = 'alphabetic'; c.lineJoin = 'round';
  const ws = parts.map(p => c.measureText(p.t).width), tot = ws.reduce((a, b) => a + b, 0) + (parts.length - 1) * size * 0.2;
  let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
  parts.forEach((p, i) => { c.shadowColor = 'rgba(0,0,0,0.85)'; c.shadowBlur = 30; c.shadowOffsetX = 8; c.shadowOffsetY = 10;
    c.strokeStyle = '#0A0806'; c.lineWidth = stroke; c.strokeText(p.t, cx, y); c.shadowColor = 'transparent'; c.fillStyle = p.c ?? CREAM; c.fillText(p.t, cx, y); cx += ws[i] + size * 0.2; });
  c.restore();
}
function grade(c, d = 0.6) { const g = c.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, H * 1.02); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(6,4,3,${d})`); c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.save(); c.globalCompositeOperation = 'overlay'; c.globalAlpha = 0.07; c.drawImage(TEX.grain[1], 0, 0, W, H); c.restore(); }
function save(c, name) { const o = createCanvas(1280, 720); o.getContext('2d').drawImage(c, 0, 0, 1280, 720); fs.writeFileSync(`${OUT}/${name}.jpg`, o.toBuffer('image/jpeg', 93));
  const s = createCanvas(168, 94); s.getContext('2d').drawImage(c, 0, 0, 168, 94); fs.writeFileSync(`${OUT}/${name}_phone.png`, s.toBuffer('image/png')); }
function sky(c, stops) { const g = c.createLinearGradient(0, 0, 0, H); stops.forEach(([o, col]) => g.addColorStop(o, col)); c.fillStyle = g; c.fillRect(0, 0, W, H); }
const FIRE = [[0, '#1A0E0A'], [0.5, '#7A2A16'], [0.78, '#D86A2A'], [1, '#F2B04A']];
// a figure with a warm rim light: a lighter offset copy behind the figure
function rimFig(c, x, y, h, spec, pose, col = '#F59A3A', off = 9) { c.save(); c.globalAlpha = 0.9; A.figure(c, x + off, y - off * 0.4, h, { ...PL.shade(spec, col), skin: col, hairCol: col }, pose); c.restore(); A.figure(c, x, y, h, spec, pose); }
function glow(c, x, y, r, col) { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }

// ============================================================ 1 · the Heavenly King, huge, in front of a burning sky and a red host: "GOD'S 2ND SON"
{ const c = makeCanvas()[1];
  sky(c, FIRE); glow(c, 620, 380, 700, 'rgba(255,200,120,0.45)');
  c.save(); c.globalAlpha = 0.5; c.strokeStyle = '#F7D58A'; c.lineWidth = 10; for (let k = 0; k < 28; k++) { const a = k / 28 * TAU; c.beginPath(); c.moveTo(620 + Math.cos(a) * 200, 330 + Math.sin(a) * 200); c.lineTo(620 + Math.cos(a) * 900, 330 + Math.sin(a) * 900); c.stroke(); } c.restore();
  A.crowd(c, { x0: -100, x1: 2020, y: 1090, n: 120, hMin: 140, hMax: 260, depth: 110, seed: 9, t, red: 1, hair: true, raise: 0.9, color: '#2A1612', far: '#3A1E16', agit: 0 });
  rimFig(c, 620, 1180, 1100, CH.hong, { face: 1, prop: 'sword', armF: 150, elbF: -10, t });
  head(c, [{ t: "GOD'S" }], 1820, 360, 230, 'right', 22); head(c, [{ t: '2ND SON', c: YEL }], 1820, 610, 230, 'right', 22);
  head(c, [{ t: '?', c: RED }], 1830, 860, 220, 'right', 20);
  grade(c, 0.55); save(c, 'A_gods_second_son'); }

// ============================================================ 2 · the failed exam → 20,000,000 dead: the pass list (red empty slot) on the left, Nanjing burning on the right
{ const c = makeCanvas()[1];
  PL.nanjing(c, t, { night: 0.5, fire: 1, breach: 1, dusk: 0.2 }); c.fillStyle = 'rgba(10,6,4,0.35)'; c.fillRect(0, 0, W, H);
  c.save(); c.translate(-40, 0); G.passList(c, t, 470, 560, 760, 860, { reveal: 1, gap: 1, gapLabel: false, tag: 0 }); c.restore();
  c.save(); c.strokeStyle = RED; c.lineWidth = 16; c.beginPath(); c.arc(166, 560, 120, 0, TAU); c.stroke(); c.restore();
  head(c, [{ t: 'FAILED' }], 1860, 300, 210, 'right', 20); head(c, [{ t: '4 EXAMS' }], 1860, 520, 170, 'right', 18);
  head(c, [{ t: '20 MILLION', c: RED }], 1860, 760, 190, 'right', 20); head(c, [{ t: 'DEAD' }], 1860, 960, 170, 'right', 18);
  grade(c, 0.5); save(c, 'B_failed_four_exams'); }

// ============================================================ 3 · map: the red heartland, "DEADLIER THAN WW1"
{ const c = makeCanvas()[1];
  PL.chinaMap(c, t, { tp: 1, cartouche: false, view: { lon: 112, lat: 30.5, span: 26 } });
  c.fillStyle = 'rgba(30,10,8,0.35)'; c.fillRect(0, 0, W, H);
  const v = { lon: 112, lat: 30.5, span: 26 }; G.fillRegion(c, 'china', v, PL.TP_AREA, '#C21A1A', 0.75);
  G.route(c, v, ['Jintian', 'Yongan', 'Guilin', 'Changsha', 'Wuchang', 'Anqing', 'Nanjing'], 1, { w: 16, color: '#E0262B' });
  rimFig(c, 380, 1160, 980, CH.hong, { face: 1, armF: 30, elbF: 30, t }, '#F59A3A', 10);
  head(c, [{ t: 'DEADLIER' }], 1860, 300, 220, 'right', 22); head(c, [{ t: 'THAN', c: CREAM }], 1860, 500, 160, 'right', 18); head(c, [{ t: 'WW1', c: YEL }], 1860, 760, 260, 'right', 24);
  grade(c, 0.55); save(c, 'C_deadlier_than_ww1'); }

// ============================================================ 4 · the climax: the wall blows, the blue army pours into the burning Heavenly Capital: "HEAVEN FELL"
{ const c = makeCanvas()[1];
  PL.nanjing(c, t, { night: 0.4, fire: 1, breach: 1, siege: 1 });
  A.crowd(c, { x0: 400, x1: 2100, y: 1080, n: 110, hMin: 180, hMax: 320, depth: 120, seed: 41, t, color: P.blue, far: '#2A3440', hat: 'cone', face: -1, raise: 0.9, agit: 0 });
  glow(c, 560, 640, 520, 'rgba(255,190,110,0.5)');
  G.medallion(c, t, 'hong', 1560, 300, 170, 0, 99, { grey: 1, slash: 1, noPlaque: true });
  head(c, [{ t: 'HEAVEN' }], 80, 260, 230, 'left', 22); head(c, [{ t: 'FELL', c: RED }], 80, 500, 260, 'left', 24);
  grade(c, 0.5); save(c, 'D_heaven_fell'); }

// phone-size comparison sheet
{ const s = createCanvas(4 * 180 + 20, 120), x = s.getContext('2d'); x.fillStyle = '#111'; x.fillRect(0, 0, s.width, s.height);
  const { loadImage } = await import('@napi-rs/canvas');
  for (const [i, n] of ['A_gods_second_son', 'B_failed_four_exams', 'C_deadlier_than_ww1', 'D_heaven_fell'].entries()) x.drawImage(await loadImage(`${OUT}/${n}_phone.png`), 10 + i * 180, 13);
  fs.writeFileSync(`${OUT}/phone_check.png`, s.toBuffer('image/png')); }
console.log('thumbnails done');
