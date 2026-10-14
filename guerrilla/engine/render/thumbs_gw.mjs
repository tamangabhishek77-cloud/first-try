// Thumbnails for the guerrilla episode (one round of four). Same system as thumbs3.mjs: Anton headlines with heavy stroke,
// the film's own character and plate drawings, a warm rim light, vignette grade; each saved at 1280x720 plus a 168x94 phone check.
import fs from 'fs';
import { GlobalFonts, createCanvas } from '@napi-rs/canvas';
import { W, H, P, makeCanvas, TEX, puff, rng, mixColor, lerp } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';
import * as PL from './plates.mjs';
GlobalFonts.registerFromPath('/home/claude/project/fonts/Anton-Regular.ttf', 'Anton');
const OUT = '/home/claude/project/out/thumbnails_gw'; fs.mkdirSync(OUT, { recursive: true });
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
const DAWN = [[0, '#2A1A12'], [0.55, '#8A4A22'], [0.85, '#E0903A'], [1, '#F6C878']];
// A · THE ARMY THAT RAN AWAY: Mao's real portrait, a red column on a ridge, title
{ const c = makeCanvas()[1]; sky(c, FIRE); glow(c, 520, 470, 560, 'rgba(255,200,120,0.4)');
  c.save(); c.globalAlpha = 0.35; c.strokeStyle = '#F7D58A'; c.lineWidth = 9; for (let k = 0; k < 28; k++) { const a = k / 28 * TAU; c.beginPath(); c.moveTo(520 + Math.cos(a) * 340, 470 + Math.sin(a) * 340); c.lineTo(520 + Math.cos(a) * 1500, 470 + Math.sin(a) * 1500); c.stroke(); } c.restore();
  A.hills(c, 900, 90, 7, '#1A100C'); for (let i = 0; i < 22; i++) { const x = 40 + i * 90; A.figure(c, x, 930 - Math.sin(x / 260) * 40, 120, PL.shade(CH.redSoldier, '#120A08'), { face: 1, walk: i * 1.3, prop: i % 3 ? 'rifle' : null }); }
  PL.redFlag(c, 1700, 700, 150, 1); c.strokeStyle = '#120A08'; c.lineWidth = 7; c.beginPath(); c.moveTo(1700, 700); c.lineTo(1700, 950); c.stroke();
  G.medallion(c, t, 'maoYan', 520, 450, 330, 0, 99, { noPlaque: true });
  head(c, [{ t: 'THE ARMY' }], 1880, 250, 190, 'right', 20); head(c, [{ t: 'THAT RAN AWAY' }], 1880, 450, 150, 'right', 18); head(c, [{ t: 'AND WON', c: YEL }], 1880, 680, 190, 'right', 20);
  grade(c, 0.5); save(c, 'A_ran_away_and_won'); }
// B · 16 CHARACTERS: the red tiles big, young Mao's photo, the revolution name
{ const c = makeCanvas()[1]; sky(c, [[0, '#120C08'], [1, '#3A1A12']]); glow(c, 960, 520, 900, 'rgba(200,60,30,0.35)');
  G.sixteen(c, t, 0, 99, { brush: 16, size: 88, y: 110, lines: [1, 1, 1, 1], light: true, title: false, en: false });
  G.medallion(c, t, 'maoY', 330, 700, 250, 0, 99, { noPlaque: true });
  head(c, [{ t: '16 CHARACTERS' }], 1860, 560, 170, 'right', 18); head(c, [{ t: 'THAT WON CHINA', c: RED }], 1860, 760, 150, 'right', 18);
  head(c, [{ t: "MAO'S GUERRILLA WAR", c: YEL }], 1860, 930, 90, 'right', 12);
  grade(c, 0.45); save(c, 'B_16_characters'); }
// C · THEY SLEPT IN THE STREET: the Shanghai dawn with sleeping soldiers, the rule
{ const c = makeCanvas()[1]; PL.shanghaiStreet(c, t, { dawn: 0.9, sleepers: 1, mist: 0.5 }); c.fillStyle = 'rgba(30,24,18,0.25)'; c.fillRect(0, 760, W, 320); PL.lyingSoldier(c, 1100, 1040, 820, '#5E6266', -1);
  c.fillStyle = 'rgba(10,6,4,0.3)'; c.fillRect(0, 0, W, H);
  head(c, [{ t: 'NOT ONE' }], 70, 260, 200, 'left', 22); head(c, [{ t: 'SWEET POTATO', c: YEL }], 70, 470, 170, 'left', 20); head(c, [{ t: 'CHINA 1927–1949', c: RED }], 70, 640, 100, 'left', 14);
  G.ruleSheet(c, t, 1520, 330, 620, 520, { reveal: 1, potato: 1, rot: 0.05 });
  grade(c, 0.5); save(c, 'C_not_one_sweet_potato'); }
// D · MAO vs CHIANG: red/blue split, two real portraits, the revolution name
{ const c = makeCanvas()[1]; c.fillStyle = '#8A1A14'; c.beginPath(); c.moveTo(0, 0); c.lineTo(1080, 0); c.lineTo(840, H); c.lineTo(0, H); c.fill(); c.fillStyle = '#1E3348'; c.beginPath(); c.moveTo(1080, 0); c.lineTo(W, 0); c.lineTo(W, H); c.lineTo(840, H); c.fill();
  c.strokeStyle = YEL; c.lineWidth = 18; c.beginPath(); c.moveTo(1080, 0); c.lineTo(840, H); c.stroke();
  A.crowd(c, { x0: -100, x1: 900, y: 1100, n: 60, hMin: 120, hMax: 200, depth: 80, seed: 9, t, red: 1, hat: 'star', toolSet: ['rifle', null], color: '#2A1612', far: '#3A1E16' });
  A.crowd(c, { x0: 1000, x1: 2020, y: 1100, n: 60, hMin: 120, hMax: 200, depth: 80, seed: 10, t, color: '#14202C', far: '#1E2C3A', hat: 'stahl', toolSet: ['rifle', null] });
  G.medallion(c, t, 'maoYan', 440, 430, 270, 0, 99, { noPlaque: true }); G.medallion(c, t, 'chiang', 1480, 430, 270, 0, 99, { noPlaque: true, ring: '#C8D2DC' });
  head(c, [{ t: 'VS' }], 960, 520, 170, 'center', 20);
  head(c, [{ t: "CHINA'S GUERRILLA WAR", c: YEL }], 960, 900, 120, 'center', 16);
  grade(c, 0.4); save(c, 'D_mao_vs_chiang'); }
console.log('thumbs done');
