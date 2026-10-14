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
// E · big real portrait + revolution name
{ const c = makeCanvas()[1]; sky(c, FIRE); glow(c, 480, 540, 600, 'rgba(255,200,120,0.4)');
  c.save(); c.globalAlpha = 0.4; c.strokeStyle = '#F7D58A'; c.lineWidth = 9; for (let k = 0; k < 28; k++) { const a = k / 28 * TAU; c.beginPath(); c.moveTo(480 + Math.cos(a) * 380, 540 + Math.sin(a) * 380); c.lineTo(480 + Math.cos(a) * 1500, 540 + Math.sin(a) * 1500); c.stroke(); } c.restore();
  A.crowd(c, { x0: -100, x1: 2020, y: 1100, n: 110, hMin: 120, hMax: 220, depth: 100, seed: 5, t, red: 1, hair: true, raise: 0.9, color: '#2A1612', far: '#3A1E16', agit: 0 });
  G.medallion(c, t, 'hong', 480, 500, 360, 0, 99, { noPlaque: true });
  head(c, [{ t: 'TAIPING' }], 1860, 360, 250, 'right', 24); head(c, [{ t: 'REBELLION', c: YEL }], 1860, 600, 190, 'right', 20);
  head(c, [{ t: '20 MILLION DEAD', c: RED }], 1860, 820, 120, 'right', 14);
  grade(c, 0.5); save(c, 'E_taiping_portrait'); }
// F · burning Nanjing, title across top
{ const c = makeCanvas()[1]; PL.nanjing(c, t, { night: 0.45, fire: 1, breach: 1, siege: 1 }); c.fillStyle = 'rgba(10,6,4,0.25)'; c.fillRect(0, 0, W, H);
  head(c, [{ t: 'THE TAIPING' }], 960, 240, 210, 'center', 22); head(c, [{ t: 'REBELLION', c: RED }], 960, 470, 230, 'center', 22);
  head(c, [{ t: 'CHINA 1850 – 1864', c: YEL }], 960, 640, 110, 'center', 14);
  grade(c, 0.5); save(c, 'F_taiping_nanjing'); }
// G · map: red heartland, huge name
{ const c = makeCanvas()[1]; const v = { lon: 116, lat: 30.5, span: 30 };
  PL.chinaMap(c, t, { tp: 1, cartouche: false, view: v }); c.fillStyle = 'rgba(30,10,8,0.3)'; c.fillRect(0, 0, W, H);
  G.fillRegion(c, 'china', v, PL.TP_AREA, '#C21A1A', 0.8);
  G.route(c, v, ['Jintian', 'Yongan', 'Guilin', 'Changsha', 'Wuchang', 'Anqing', 'Nanjing'], 1, { w: 16, color: '#E0262B' });
  head(c, [{ t: 'TAIPING', c: RED }], 70, 260, 240, 'left', 24); head(c, [{ t: 'REBELLION' }], 70, 470, 170, 'left', 18);
  head(c, [{ t: 'DEADLIER THAN WW1', c: YEL }], 70, 1010, 110, 'left', 14);
  grade(c, 0.5); save(c, 'G_taiping_map'); }
// H · face-off: Hong vs Zeng Guofan
{ const c = makeCanvas()[1]; c.fillStyle = '#7A1A14'; c.fillRect(0, 0, W / 2, H); c.fillStyle = '#1E2E44'; c.fillRect(W / 2, 0, W / 2, H);
  c.save(); c.strokeStyle = '#F2C200'; c.lineWidth = 14; c.beginPath(); c.moveTo(W / 2 + 60, 0); c.lineTo(W / 2 - 60, H); c.stroke(); c.restore();
  G.medallion(c, t, 'hong', 470, 620, 330, 0, 99, { noPlaque: true }); G.medallion(c, t, 'zengF', 1450, 620, 330, 0, 99, { noPlaque: true });
  head(c, [{ t: 'TAIPING REBELLION' }], 960, 180, 170, 'center', 18);
  head(c, [{ t: 'VS', c: YEL }], 960, 700, 200, 'center', 20);
  head(c, [{ t: "GOD'S SON", c: '#FF6A5A' }], 470, 1040, 100, 'center', 12); head(c, [{ t: 'THE QING', c: '#9EC4FF' }], 1450, 1040, 100, 'center', 12);
  grade(c, 0.45); save(c, 'H_taiping_faceoff'); }
console.log('ok');
