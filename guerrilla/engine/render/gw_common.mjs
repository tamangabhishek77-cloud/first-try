// Shared helpers for the guerrilla-episode shot files (same idiom as the Taiping shots).
import { W, H, P, T, clamp, lerp, easeIO, easeOut, ramp, life, rng, mixColor, rgba, parchment, withCam, push, puff } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';
import * as PL from './plates.mjs';
const TAU = Math.PI * 2;
export const dim = (c, a) => { if (a <= 0) return; c.save(); c.fillStyle = `rgba(16,12,8,${a})`; c.fillRect(0, 0, W, H); c.restore(); };
export const tint = (c, col, a) => { if (a <= 0) return; c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = a; c.fillStyle = col; c.fillRect(0, 0, W, H); c.restore(); };
export const cam = (c, lt, S, s0, s1, x0, y0, x1, y1, fn) => withCam(c, push(lt, S.dur, s0, s1, x0 ?? W / 2, y0 ?? H / 2, x1 ?? x0 ?? W / 2, y1 ?? y0 ?? H / 2), fn);
export const fade = (c, a, fn) => { if (a <= 0) return; c.save(); c.globalAlpha *= a; fn(); c.restore(); };
export const tok = (c, view, place, col, a = 1, label = null, r = 26) => { const p = Array.isArray(place) ? place : G.PLACES[place]; const [x, y] = G.proj(view, p[0], p[1]); G.token(c, x, y, r, col, a, label); return [x, y]; };
export const xy = (view, place) => { const p = Array.isArray(place) ? place : G.PLACES[place]; return G.proj(view, p[0], p[1]); };
// map views
export const V = { cn: { lon: 112, lat: 33.5, span: 40 }, south: { lon: 114.6, lat: 26.8, span: 9 }, march: { lon: 108, lat: 31, span: 26 }, north: { lon: 114, lat: 37, span: 22 },
  manch: { lon: 122, lat: 41.5, span: 16 }, east: { lon: 117, lat: 32, span: 14 }, nepal: { lon: 84.2, lat: 28.2, span: 13 }, chishui: { lon: 106, lat: 27.8, span: 6 } };
// a simple arrow along geo points (an army's move); col blue/red
export function arrow(c, view, pts, u, col, w = 12) { if (u <= 0) return; const end = G.route(c, view, pts, u, { color: col, w, dash: [], arrow: false }); if (!end) return;
  const n = pts.length, p0 = Array.isArray(pts[n - 2]) ? G.proj(view, ...pts[n - 2]) : xy(view, pts[n - 2]); const a = Math.atan2(end[1] - p0[1], end[0] - p0[0]);
  c.save(); c.fillStyle = col; c.translate(end[0], end[1]); c.rotate(a); c.beginPath(); c.moveTo(w * 2.4, 0); c.lineTo(-w * 0.6, -w * 1.8); c.lineTo(-w * 0.6, w * 1.8); c.closePath(); c.fill(); c.restore(); }
// a column of marching figures (keeps every figure the locked spec)
export function column(c, t, spec, x0, y0, n, h, dx, dy, o = {}) { for (let i = 0; i < n; i++) { const k = o.depth ? 1 - i / n * o.depth : 1; A.figure(c, x0 + i * dx, y0 + i * dy, h * k, spec, { face: o.face ?? 1, walk: o.walk === false ? null : t * (o.speed ?? 4.5) + i * 1.3, prop: o.prop ?? (i % 2 ? 'rifle' : null), lean: o.lean ?? 0, t }); } }
// the people as water, the guerrillas as fish (ch8, ch12)
export function fishWater(c, t, o = {}) {
  const dark = clamp(o.dark ?? 0); parchment(c, t);
  const g = c.createRadialGradient(W / 2, H * 0.55, 60, W / 2, H * 0.55, 900); g.addColorStop(0, mixColor('#AFC0BC', '#2A3436', dark)); g.addColorStop(1, mixColor('#8EA29E', '#141A1C', dark)); c.fillStyle = g; c.beginPath(); c.ellipse(W / 2, H * 0.56, 860, 380, 0, 0, TAU); c.fill();
  c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 2; for (let i = 0; i < 7; i++) { const u = ((t * 0.18 + i / 7) % 1); c.globalAlpha = 1 - u; c.beginPath(); c.ellipse(W / 2 + (i % 3 - 1) * 260, H * 0.56 + (i % 2) * 80, 40 + u * 300, 16 + u * 120, 0, 0, TAU); c.stroke(); } c.globalAlpha = 1;
  const nf = o.n ?? 9; for (let i = 0; i < nf; i++) { const r = rng(500 + i), a = t * (0.25 + r() * 0.2) + r() * TAU, rx = 300 + r() * 420, ry = 110 + r() * 180, x = W / 2 + Math.cos(a) * rx, y = H * 0.56 + Math.sin(a) * ry, s = (o.big && i === 0 ? 3.2 : 1) * (34 + r() * 18);
    c.save(); c.translate(x, y); c.rotate(a + Math.PI / 2); c.fillStyle = mixColor(P.red, '#3A0E0A', dark * 0.5); c.beginPath(); c.ellipse(0, 0, s, s * 0.38, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(-s * 0.85, 0); c.lineTo(-s * 1.45, -s * 0.4 * (1 + 0.2 * Math.sin(t * 8 + i))); c.lineTo(-s * 1.45, s * 0.4); c.closePath(); c.fill(); c.fillStyle = '#F2E8D2'; c.beginPath(); c.arc(s * 0.55, -s * 0.08, s * 0.07, 0, TAU); c.fill(); c.restore(); }
}
// small grey human icons (numbers of people: no bodies, ever)
export function people(c, x0, y0, cols, rows, s, col, fadeU = 0, seed = 1) { const r = rng(seed); for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const gone = r() < fadeU; c.save(); c.globalAlpha *= gone ? 0.18 : 1; c.fillStyle = col; const x = x0 + i * s * 1.3, y = y0 + j * s * 2.3;
  c.beginPath(); c.arc(x, y, s * 0.36, 0, TAU); c.fill(); c.beginPath(); c.moveTo(x - s * 0.5, y + s * 1.6); c.lineTo(x - s * 0.42, y + s * 0.5); c.quadraticCurveTo(x, y + s * 0.3, x + s * 0.42, y + s * 0.5); c.lineTo(x + s * 0.5, y + s * 1.6); c.closePath(); c.fill(); c.restore(); } }
// a book cover (Red Star Over China, 1937)
export function bookCover(c, x, y, s, rot = -0.05) { c.save(); c.translate(x, y); c.rotate(rot); c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 30; c.fillStyle = '#A3201C'; c.fillRect(-s * 0.5, -s * 0.72, s, s * 1.44); c.shadowBlur = 0;
  c.fillStyle = '#7A1612'; c.fillRect(-s * 0.5, -s * 0.72, s * 0.06, s * 1.44); A.star5(c, 0, -s * 0.2, s * 0.22, '#F2C84A');
  G.text(c, 'RED STAR', 0, s * 0.22, `900 ${s * 0.15}px Bodoni`, '#F6EFE0', 'center'); G.text(c, 'OVER CHINA', 0, s * 0.4, `900 ${s * 0.12}px Bodoni`, '#F6EFE0', 'center'); G.text(c, 'EDGAR SNOW · 1937', 0, s * 0.6, `500 ${s * 0.06}px Oswald`, '#F2C84A', 'center'); c.restore(); }
// a stretcher with a figure lying on it, carried by two bearers
export function stretcher(c, t, x, y, h, spec, bearer, walkOn = true) { const ph = walkOn ? t * 4 : null; A.figure(c, x - h * 0.55, y, h, bearer, { face: 1, walk: ph, armF: 60, elbF: -10 }); A.figure(c, x + h * 0.55, y, h, bearer, { face: 1, walk: ph == null ? null : ph + 1.6, armF: -40, elbF: 20, armB: 40 });
  const sy = y - h * 0.55 + (walkOn ? Math.sin(t * 8) * h * 0.01 : 0); c.strokeStyle = '#4A3A2A'; c.lineWidth = h * 0.025; c.beginPath(); c.moveTo(x - h * 0.75, sy); c.lineTo(x + h * 0.75, sy); c.stroke();
  c.save(); c.translate(x + h * 0.45, sy - h * 0.02); c.rotate(-Math.PI / 2); A.figure(c, 0, 0, h * 0.8, spec, { face: -1, armF: 10, elbF: 10 }); c.restore(); c.fillStyle = '#6E5A43'; c.fillRect(x - h * 0.5, sy - h * 0.05, h, h * 0.05); }
// two bars compared (forces)
export function bars(c, t, items, at, o = {}) { const x0 = o.x ?? 360, y0 = o.y ?? 420, bw = o.w ?? 1200, bh = o.h ?? 120; items.forEach((it, i) => { const u = ramp(t, it.at ?? at + i * 0.6, 1.2, easeIO); if (u <= 0) return; const y = y0 + i * (bh + 90);
  c.fillStyle = it.col; c.fillRect(x0, y, bw * it.v * u, bh); G.text(c, it.label, x0, y - 18, 'italic 400 44px BodoniItalic', o.light ? '#F2E8D2' : P.ink, 'left', clamp(u * 2)); G.text(c, it.num, x0 + bw * it.v * u + 24, y + bh * 0.72, '600 70px Bodoni', o.light ? '#F2E8D2' : P.ink, 'left', clamp(u * 2 - 0.5)); }); }
