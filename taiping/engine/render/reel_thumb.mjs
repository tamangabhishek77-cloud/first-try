import fs from 'fs';
import { GlobalFonts, createCanvas } from '@napi-rs/canvas';
import { TEX } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';
import * as PL from './plates.mjs';
GlobalFonts.registerFromPath('/home/claude/project/fonts/Anton-Regular.ttf', 'Anton');
const W = 1080, H = 1920, t = 3, TAU = Math.PI * 2, { CH } = A;
const cv = createCanvas(W, H), c = cv.getContext('2d');
let g = c.createLinearGradient(0, 0, 0, H); [[0, '#1A0E0A'], [0.45, '#7A2A16'], [0.75, '#D86A2A'], [1, '#F2B04A']].forEach(([o, k]) => g.addColorStop(o, k)); c.fillStyle = g; c.fillRect(0, 0, W, H);
c.save(); c.globalAlpha = 0.45; c.strokeStyle = '#F7D58A'; c.lineWidth = 10; for (let k = 0; k < 28; k++) { const a = k / 28 * TAU; c.beginPath(); c.moveTo(540 + Math.cos(a) * 180, 900 + Math.sin(a) * 180); c.lineTo(540 + Math.cos(a) * 1400, 900 + Math.sin(a) * 1400); c.stroke(); } c.restore();
A.crowd(c, { x0: -100, x1: 1180, y: 1930, n: 80, hMin: 160, hMax: 280, depth: 120, seed: 9, t, red: 1, hair: true, raise: 0.9, color: '#2A1612', far: '#3A1E16', agit: 0 });


G.medallion(c, t, 'hong', 540, 1140, 360, 0, 99, { noPlaque: true });
function head(s, x, y, size, col) { c.save(); c.font = `${size}px Anton`; c.textAlign = 'center'; c.lineJoin = 'round'; c.shadowColor = 'rgba(0,0,0,.85)'; c.shadowBlur = 30; c.shadowOffsetY = 10; c.strokeStyle = '#0A0806'; c.lineWidth = size / 9; c.strokeText(s, x, y); c.shadowColor = 'transparent'; c.fillStyle = col; c.fillText(s, x, y); c.restore(); }
head("HE SAID HE WAS", 540, 250, 120, '#F7F0E2'); head("JESUS'", 540, 450, 200, '#F2C200'); head("BROTHER", 540, 640, 190, '#F2C200');
head('20 MILLION DIED', 540, 1800, 130, '#E0262B');
g = c.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(6,4,3,.55)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
c.save(); c.globalCompositeOperation = 'overlay'; c.globalAlpha = 0.07; c.drawImage(TEX.grain[1], 0, 0, W, H); c.restore();
fs.writeFileSync('/home/user/first-try/taiping/package/thumbnails/reel_thumbnail_1080x1920.jpg', cv.toBuffer('image/jpeg', 93)); console.log('ok');
