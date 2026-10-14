// Plates: every location is drawn by one function, so a place looks identical each time it returns (callbacks).
import { W, H, P, T, clamp, lerp, easeIO, easeOut, ramp, life, rng, mixColor, rgba, noise1, parchment, withCam, push, puff } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';

const TAU = Math.PI * 2;
export const CH = A.CH;

// a darkened "shadow" version of any character (advisers in the shadows, silhouettes against fire)
export function shade(spec, col = '#1A1612') { const o = { ...spec }; for (const k of ['tunic', 'hood', 'hose', 'belt', 'robe', 'edge', 'stole', 'cap', 'coif', 'cross', 'veil', 'wrap', 'lapel', 'sash', 'square', 'mhat', 'mhatTop', 'button', 'cone', 'slouch', 'kepi', 'skullcap', 'collarW']) if (o[k]) o[k] = col; o.ermine = false; o.chain = false; o.glasses = false; return o; }
// a stone-carved version (relief panels): every colour, skin and hair become the stone tone
export function stone(spec, col) { const o = shade(spec, col); o.skin = col; o.hairCol = col; o.ink = mixColor(col, '#000000', 0.25); if (o.goldBeard) o.goldBeard = col; if (o.tcrown) o.tcrown = false; return o; }

// ------------------------------------------------------------- ground helpers
export function sun(ctx, x, y, r, col) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
export function ground(ctx, y, c0, c1) { const g = ctx.createLinearGradient(0, y, 0, H + 200); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.fillRect(-W, y, W * 3, H * 2); }
function grass(ctx, y0, y1, seed, col, n = 220) { const r = rng(seed); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath();
  for (let i = 0; i < n; i++) { const x = r() * (W + 400) - 200, y = lerp(y0, y1, r()), h = 6 + r() * 12; ctx.moveTo(x, y); ctx.lineTo(x + (r() - 0.5) * 6, y - h); } ctx.stroke(); }
function cityWall(ctx, x0, x1, y, h, col) { ctx.fillStyle = col; ctx.fillRect(x0, y - h, x1 - x0, h); for (let x = x0; x < x1; x += h * 0.5) ctx.fillRect(x, y - h * 1.25, h * 0.28, h * 0.25); }

// ------------------------------------------------------------- SMITHFIELD (cold open + chapter 9)
export function smithfield(ctx, t, o = {}) {
  A.sky(ctx, o.sky ?? 'gold', t);
  if (o.tint) { ctx.save(); ctx.fillStyle = o.tint; ctx.globalAlpha = o.tintA ?? 0.4; ctx.fillRect(-W, -H, W * 3, H * 3); ctx.restore(); }
  sun(ctx, 1480, 330, 520, 'rgba(255,238,196,0.55)');
  A.clouds(ctx, t, 5, 210, 'rgba(252,242,222,0.30)', 4, 5);
  A.hills(ctx, 700, 26, 21, '#BFA77A');
  const far = o.far ?? '#86735A';
  cityWall(ctx, -60, 760, 690, 34, far); A.stPauls(ctx, 360, 660, 28, far);
  for (let i = 0; i < 9; i++) { const x = 40 + i * 80; ctx.fillStyle = far; ctx.beginPath(); ctx.moveTo(x, 660); ctx.lineTo(x + 30, 630 - (i % 3) * 8); ctx.lineTo(x + 60, 660); ctx.fill(); }
  A.priory(ctx, 1460, 700, 44, o.prioryCol ?? '#6E5E48', o.lit);
  A.hills(ctx, 770, 34, 22, '#AA9264');
  ground(ctx, 790, '#9E8659', '#6E5A3C');
  grass(ctx, 800, 1080, 3, 'rgba(70,55,35,0.35)');
}

// ------------------------------------------------------------- LONDON skyline from the south bank (cold open, ch7, ch8)
export function london(ctx, t, o = {}) {
  const night = o.night ?? 0;
  A.sky(ctx, o.sky ?? 'day', t);
  if (night > 0) { ctx.save(); ctx.globalAlpha = night; A.sky(ctx, 'night', t); ctx.restore(); }
  A.clouds(ctx, t, 8, 180, night ? 'rgba(10,10,14,0.25)' : 'rgba(252,244,228,0.32)', 4, 6);
  const col = night ? mixColor('#4A4036', '#151310', night) : '#4A4036', far = night ? '#2A2622' : '#8A7A62';
  // far city roofs
  const r = rng(44); for (let i = 0; i < 40; i++) { const x = i * 52 - 40, h = 40 + r() * 70; ctx.fillStyle = far; ctx.fillRect(x, 640 - h, 50, h); ctx.beginPath(); ctx.moveTo(x - 4, 640 - h); ctx.lineTo(x + 25, 640 - h - 26); ctx.lineTo(x + 54, 640 - h); ctx.fill(); }
  A.stPauls(ctx, 560, 640, 44, col);
  A.whiteTower(ctx, 1650, 650, 62, night ? '#2E2A26' : '#5A5046', night > 0.5);
  A.savoy(ctx, 170, 650, 30, col, false, clamp(o.savoyFire ?? 0) * 0.6);
  if (o.savoyFire) { A.flames(ctx, 170, 650, 300, 220 * o.savoyFire, t, 3, 10); A.smoke(ctx, 170, 520, t, 1.4, 4, 'rgba(50,44,40,0.35)'); }
  // river
  ctx.fillStyle = night ? '#1E2228' : '#9AA39C'; ctx.fillRect(-W, 700, W * 3, 260);
  ctx.strokeStyle = night ? 'rgba(220,160,80,0.18)' : 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2; for (let i = 0; i < 12; i++) { const y = 720 + i * 20, off = (t * 20 + i * 97) % 300; ctx.setLineDash([60, 240]); ctx.lineDashOffset = -off; ctx.beginPath(); ctx.moveTo(-50, y); ctx.lineTo(W + 50, y); ctx.stroke(); } ctx.setLineDash([]);
  const br = A.londonBridge(ctx, 300, 1420, 760, 58, col, night > 0.5, o.bridgeOpen ?? 1);
  if (o.spikes) { const a = clamp(o.spikes); ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = night ? '#0E0C0A' : P.ink; ctx.lineWidth = 3;
    for (const dx of [-14, 14]) { ctx.beginPath(); ctx.moveTo(br.gateX + dx, br.gateTop); ctx.lineTo(br.gateX + dx, br.gateTop - 54); ctx.stroke(); ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.arc(br.gateX + dx, br.gateTop - 58, 8, 0, TAU); ctx.fill(); } ctx.restore(); }
  // south bank foreground
  ctx.fillStyle = night ? '#141210' : '#7A6A50'; ctx.beginPath(); ctx.moveTo(-W, H); ctx.lineTo(-W, 930); for (let x = -100; x <= W + 100; x += 40) ctx.lineTo(x, 925 + Math.sin(x / 140) * 10); ctx.lineTo(W * 2, H * 2); ctx.fill();
  return br;
}

// ------------------------------------------------------------- VILLAGE (ch1, ch10 callback, ensemble)
export function village(ctx, t, o = {}) {
  const dusk = o.dusk ?? 0;
  A.sky(ctx, 'day', t); if (dusk > 0) { ctx.save(); ctx.globalAlpha = dusk; A.sky(ctx, 'dusk', t); ctx.restore(); }
  sun(ctx, 1500, 260, 460, 'rgba(255,244,214,0.5)');
  A.clouds(ctx, t, 2, 170, 'rgba(252,244,228,0.34)', 5, 7);
  A.hills(ctx, 560, 70, 31, mixColor('#B9A57E', '#9C7A52', dusk)); A.hills(ctx, 640, 50, 32, mixColor('#A89066', '#8A6A44', dusk));
  // strip fields
  const over = clamp(o.overgrown ?? 0);
  const fc = mixColor('#C4AC74', '#6F7448', over);
  ctx.save(); ctx.beginPath(); ctx.rect(-W, 640, W * 3, H); ctx.clip();
  A.fieldStrips(ctx, -200, 660, W + 200, 900, 16, fc, mixColor('#9C8452', '#4E5432', over)); ctx.restore();
  if (over > 0) { const r = rng(91); ctx.save(); ctx.globalAlpha = over; ctx.strokeStyle = '#4E5432'; ctx.lineWidth = 2.5; ctx.beginPath(); for (let i = 0; i < 500; i++) { const x = r() * W, y = 660 + r() * 240, h = 10 + r() * 22; ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 6, y - h * 0.6, x + (r() - 0.5) * 14, y - h); } ctx.stroke(); ctx.restore(); }
  // sheaves (rot when harvest fails)
  if (o.sheaves) { const rot = clamp(o.rot ?? 0); for (let i = 0; i < 7; i++) { const x = 260 + i * 210, y = 790 + (i % 2) * 40; ctx.fillStyle = mixColor('#D9B25A', '#5A4A2E', rot); ctx.beginPath(); ctx.moveTo(x - 22, y); ctx.lineTo(x - 6, y - 64 + rot * 18); ctx.lineTo(x + 6, y - 64 + rot * 18); ctx.lineTo(x + 22, y); ctx.fill(); ctx.fillStyle = mixColor('#9C7A3A', '#3A3020', rot); ctx.fillRect(x - 12, y - 32 + rot * 8, 24, 6); } }
  const lit = dusk > 0.5;
  A.church(ctx, 1240, 640, 120, '#3E352B', lit);
  A.manor(ctx, 1640, 650, 110, '#3A3027', lit);
  [[160, 660, 90], [330, 652, 80], [500, 664, 86], [700, 656, 78], [900, 662, 84]].forEach(([x, y, s], i) => A.cottage(ctx, x, y, s, lit && i % 2 === 0, '#4A3E32'));
  A.tree(ctx, 1050, 660, 120, '#3E3A2A', 4); A.tree(ctx, 1840, 660, 140, '#3E3A2A', 9);
  ground(ctx, 900, mixColor('#9C8452', '#6A5432', dusk), '#5E4C32');
  grass(ctx, 905, 1080, 7, 'rgba(60,48,30,0.35)');
}

// ------------------------------------------------------------- INTERIOR stone hall (throne, council, court, chapel, scriptorium, treasury, gaol)
export function interior(ctx, t, o = {}) {
  const dark = o.dark ?? 0.0;
  ctx.fillStyle = mixColor('#5A4E40', '#1E1A16', dark); ctx.fillRect(-W, -H, W * 3, H * 3);
  // stone courses
  ctx.strokeStyle = 'rgba(20,16,12,0.25)'; ctx.lineWidth = 2; const r = rng(o.seed ?? 6);
  for (let y = 0; y < 820; y += 46) { ctx.beginPath(); ctx.moveTo(-200, y); ctx.lineTo(W + 200, y); ctx.stroke(); for (let x = (y / 46 % 2) * 60 - 200; x < W + 200; x += 120 + r() * 20) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 46); ctx.stroke(); } }
  // arches + windows with light
  const n = o.arches ?? 3;
  for (let i = 0; i < n; i++) { const cx = W * (i + 0.5) / n, wW = 120, top = 170;
    ctx.fillStyle = 'rgba(15,12,10,0.55)'; ctx.beginPath(); ctx.moveTo(cx - 230, 820); ctx.lineTo(cx - 230, 320); ctx.quadraticCurveTo(cx, 30, cx + 230, 320); ctx.lineTo(cx + 230, 820); ctx.lineTo(cx + 190, 820); ctx.lineTo(cx + 190, 330); ctx.quadraticCurveTo(cx, 80, cx - 190, 330); ctx.lineTo(cx - 190, 820); ctx.fill();
    if (o.windows !== false) { const lit = o.night ? '#3A4A6A' : '#F2DFA8'; ctx.fillStyle = lit; ctx.beginPath(); ctx.moveTo(cx - wW / 2, 470); ctx.lineTo(cx - wW / 2, top + 90); ctx.quadraticCurveTo(cx, top - 10, cx + wW / 2, top + 90); ctx.lineTo(cx + wW / 2, 470); ctx.fill();
      ctx.strokeStyle = '#2A241D'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx, top + 30); ctx.lineTo(cx, 470); ctx.moveTo(cx - wW / 2, 330); ctx.lineTo(cx + wW / 2, 330); ctx.stroke();
      if (!o.night) { ctx.save(); ctx.globalAlpha = 0.13 + 0.03 * Math.sin(t * 0.7 + i); ctx.fillStyle = '#F6E2A8'; ctx.beginPath(); ctx.moveTo(cx - wW / 2, 470); ctx.lineTo(cx + wW / 2, 470); ctx.lineTo(cx + wW * 1.9, 1080); ctx.lineTo(cx - wW * 0.2, 1080); ctx.fill(); ctx.restore(); } } }
  if (o.banners) for (const bx of (o.bannerX ?? [W * 0.2, W * 0.8])) { ctx.fillStyle = o.bannerCol ?? P.red; ctx.beginPath(); ctx.moveTo(bx - 60, 90); ctx.lineTo(bx + 60, 90); ctx.lineTo(bx + 60, 520); ctx.lineTo(bx, 470); ctx.lineTo(bx - 60, 520); ctx.fill();
    ctx.fillStyle = P.gold; for (let k = 0; k < 3; k++) { const ly = 190 + k * 100; ctx.beginPath(); ctx.moveTo(bx - 34, ly); ctx.lineTo(bx + 34, ly); ctx.lineTo(bx, ly + 40); ctx.fill(); } }
  // floor
  ground(ctx, 820, mixColor('#4A4034', '#16130F', dark), mixColor('#2E2720', '#0C0A08', dark));
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 2; for (let i = -12; i <= 12; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * 60, 820); ctx.lineTo(W / 2 + i * 260, 1080); ctx.stroke(); }
  for (let y = 840; y < 1080; y += 40 + (y - 820) * 0.4) { ctx.beginPath(); ctx.moveTo(-100, y); ctx.lineTo(W + 100, y); ctx.stroke(); }
  if (dark > 0) { const g = ctx.createRadialGradient(W / 2, H * 0.55, 100, W / 2, H * 0.55, W * 0.7); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${0.6 * dark})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
}
export function throne(ctx, x, y, s) {
  ctx.fillStyle = '#3A2A1C'; ctx.fillRect(x - 0.55 * s, y - 2.2 * s, 1.1 * s, 2.2 * s); ctx.fillStyle = P.gold; ctx.fillRect(x - 0.6 * s, y - 2.3 * s, 1.2 * s, 0.12 * s);
  ctx.beginPath(); ctx.moveTo(x - 0.6 * s, y - 2.3 * s); ctx.lineTo(x, y - 2.75 * s); ctx.lineTo(x + 0.6 * s, y - 2.3 * s); ctx.fill();
  ctx.fillStyle = '#5A3E26'; ctx.fillRect(x - 0.75 * s, y - 1.0 * s, 1.5 * s, 0.25 * s); ctx.fillRect(x - 0.75 * s, y - 1.0 * s, 0.18 * s, 1.0 * s); ctx.fillRect(x + 0.57 * s, y - 1.0 * s, 0.18 * s, 1.0 * s);
  ctx.fillStyle = P.red; ctx.fillRect(x - 0.45 * s, y - 2.05 * s, 0.9 * s, 1.0 * s);
  ctx.fillStyle = '#3A2A1C'; ctx.fillRect(x - 1.0 * s, y - 0.1 * s, 2.0 * s, 0.1 * s); ctx.fillRect(x - 1.2 * s, y, 2.4 * s, 0.12 * s);
}
export function table(ctx, x, y, w, h = 120, cloth = '#2B4256') {
  ctx.fillStyle = '#3A2A1C'; ctx.fillRect(x - w / 2 + 20, y - h, 18, h); ctx.fillRect(x + w / 2 - 38, y - h, 18, h);
  ctx.fillStyle = cloth; ctx.fillRect(x - w / 2, y - h - 14, w, 64); ctx.fillStyle = mixColor(cloth, '#000', 0.3); ctx.fillRect(x - w / 2, y - h + 40, w, 8);
  ctx.fillStyle = '#4A3420'; ctx.fillRect(x - w / 2 - 10, y - h - 22, w + 20, 12);
}
export function candle(ctx, x, y, t, seed = 1) { ctx.fillStyle = '#EDE3CF'; ctx.fillRect(x - 6, y - 50, 12, 50); A.flames(ctx, x, y - 50, 14, 30, t, seed, 3); }
export function chest(ctx, x, y, s, open = 0, t = 0) {
  ctx.fillStyle = '#4A3420'; ctx.fillRect(x - s, y - 0.9 * s, 2 * s, 0.9 * s); ctx.fillStyle = '#8A6B47'; for (const dx of [-0.8, 0.6]) ctx.fillRect(x + dx * s, y - 0.9 * s, 0.2 * s, 0.9 * s);
  ctx.fillStyle = '#16120E'; if (open > 0) ctx.fillRect(x - 0.95 * s, y - 0.9 * s, 1.9 * s, 0.12 * s);
  ctx.save(); ctx.translate(x - s, y - 0.9 * s); ctx.rotate(-open * 1.9); ctx.fillStyle = '#5A3E26'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(2 * s, 0); ctx.quadraticCurveTo(2 * s, -0.5 * s, s, -0.5 * s); ctx.quadraticCurveTo(0, -0.5 * s, 0, 0); ctx.fill(); ctx.fillStyle = '#8A6B47'; ctx.fillRect(0.2 * s, -0.42 * s, 0.2 * s, 0.42 * s); ctx.fillRect(1.6 * s, -0.42 * s, 0.2 * s, 0.42 * s); ctx.restore();
  ctx.fillStyle = P.gold; ctx.fillRect(x - 0.12 * s, y - 0.86 * s, 0.24 * s, 0.22 * s);
}
export function bars(ctx, x, y, w, h, lift = 0) { ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2, y - h, w, h); ctx.clip(); ctx.translate(0, -lift * h);
  ctx.strokeStyle = '#1A1612'; ctx.lineWidth = 16; for (let i = 0; i <= 6; i++) { const bx = x - w / 2 + i * w / 6; ctx.beginPath(); ctx.moveTo(bx, y - h); ctx.lineTo(bx, y); ctx.stroke(); }
  ctx.lineWidth = 14; for (const yy of [y - h * 0.75, y - h * 0.25]) { ctx.beginPath(); ctx.moveTo(x - w / 2, yy); ctx.lineTo(x + w / 2, yy); ctx.stroke(); } ctx.restore(); }

// ------------------------------------------------------------- generic landscape for Kent/Essex scenes, Blackheath, Mile End, Clerkenwell
export function field(ctx, t, o = {}) {
  A.sky(ctx, o.sky ?? 'day', t); if (o.dusk) { ctx.save(); ctx.globalAlpha = o.dusk; A.sky(ctx, 'dusk', t); ctx.restore(); }
  A.clouds(ctx, t, o.seed ?? 3, 190, o.dusk ? 'rgba(120,70,40,0.16)' : 'rgba(252,244,228,0.32)', 5, 6);
  A.hills(ctx, o.h1 ?? 620, 60, (o.seed ?? 3) + 1, o.c1 ?? '#B5A07A'); A.hills(ctx, o.h2 ?? 720, 46, (o.seed ?? 3) + 2, o.c2 ?? '#A08A60');
  if (o.back) o.back(ctx);
  ground(ctx, o.gy ?? 800, o.g0 ?? '#9A8458', o.g1 ?? '#6A563A'); grass(ctx, (o.gy ?? 800) + 6, 1080, (o.seed ?? 3) + 5, 'rgba(60,48,30,0.32)');
}
export function blackheath(ctx, t, o = {}) {
  field(ctx, t, { sky: 'day', dusk: o.dusk ?? 0.85, seed: 12, h1: 560, h2: 640, c1: '#9C7E58', c2: '#86683F', gy: 700, g0: '#7E6440', g1: '#4A3A26',
    back: c => { // London on the horizon across the river
      c.fillStyle = 'rgba(80,66,50,0.55)'; for (let i = 0; i < 26; i++) c.fillRect(380 + i * 34, 600 - (i * 37 % 50), 30, 60 + (i * 37 % 50));
      A.stPauls(c, 700, 610, 20, 'rgba(70,58,44,0.7)'); A.whiteTower(c, 1180, 610, 24, 'rgba(70,58,44,0.7)');
      c.fillStyle = 'rgba(150,150,140,0.55)'; c.fillRect(300, 606, 1100, 14); } });
  const r = rng(5);
  for (let i = 0; i < 9; i++) A.tent(ctx, 120 + i * 210 + r() * 60, 720 + (i % 3) * 12, 90 + r() * 30, i % 2 ? '#8A7A60' : '#7A6A50');
  for (let i = 0; i < 5; i++) A.campfire(ctx, 240 + i * 380, 760 + (i % 2) * 20, 70, t, 10 + i);
}
export function rochester(ctx, t, o = {}) {
  field(ctx, t, { seed: 17, h1: 600, h2: 690, back: c => { A.keep(c, 1240, 760, 120, '#3E352B', o.lit); if (o.flag) { const fa = clamp(o.flag); c.strokeStyle = '#2A241D'; c.lineWidth = 5; c.beginPath(); c.moveTo(1316, 520); c.lineTo(1316, 520 - 110 * fa); c.stroke(); if (fa > 0.5) { c.fillStyle = '#F2EBDD'; c.beginPath(); const wv = Math.sin(t * 4) * 6; c.moveTo(1316, 410); c.lineTo(1390, 418 + wv); c.lineTo(1388, 456 + wv); c.lineTo(1316, 450); c.fill(); } } } , gy: 780 });
  // the Medway in front
  A.river(ctx, [[-100, 860], [600, 850], [1200, 870], [2100, 850]], 46, t, '#8E9A94');
}
export function savoy(ctx, t, o = {}) {
  const f = clamp(o.fire ?? 0);
  A.sky(ctx, 'day', t); if (f > 0) { ctx.save(); ctx.globalAlpha = f; A.sky(ctx, 'fire', t); ctx.restore(); }
  A.clouds(ctx, t, 14, 160, 'rgba(80,60,40,0.15)', 4, 6);
  A.hills(ctx, 640, 30, 41, mixColor('#B5A07A', '#5A3424', f));
  A.savoy(ctx, 960, 700, 150, '#3A3027', f < 0.2, clamp(o.burnt ?? 0));
  if (f > 0) { for (const [x, w] of [[700, 360], [1000, 420], [1300, 360]]) A.flames(ctx, x, 690, w, 300 * f, t, x, 9); A.smoke(ctx, 960, 450, t, 2, 7, 'rgba(40,30,26,0.4)'); }
  ctx.fillStyle = mixColor('#8E9A94', '#6A4A36', f * 0.6); ctx.fillRect(-W, 760, W * 3, 400); // Thames in front
  ctx.strokeStyle = 'rgba(255,230,190,0.2)'; ctx.lineWidth = 2; for (let i = 0; i < 9; i++) { const y = 780 + i * 30; ctx.setLineDash([80, 200]); ctx.lineDashOffset = -(t * 24 + i * 77) % 280; ctx.beginPath(); ctx.moveTo(-50, y); ctx.lineTo(W + 50, y); ctx.stroke(); } ctx.setLineDash([]);
  ctx.fillStyle = '#3A3027'; ctx.fillRect(-W, 740, W * 3, 24);
}
export function temple(ctx, t, o = {}) {
  const f = clamp(o.fire ?? 0);
  A.sky(ctx, 'day', t); if (f > 0) { ctx.save(); ctx.globalAlpha = f * 0.8; A.sky(ctx, 'fire', t); ctx.restore(); }
  A.clouds(ctx, t, 52, 170, 'rgba(252,244,228,0.3)', 4, 6);
  const r = rng(53); for (let i = 0; i < 26; i++) { const x = i * 78 - 30, h = 70 + r() * 90; ctx.fillStyle = '#8A7A62'; ctx.fillRect(x, 700 - h, 70, h); ctx.beginPath(); ctx.moveTo(x - 4, 700 - h); ctx.lineTo(x + 35, 700 - h - 34); ctx.lineTo(x + 74, 700 - h); ctx.fill(); }
  A.templeChurch(ctx, 760, 790, 200, '#3E352B');
  for (const [x, s] of [[200, 90], [330, 80], [1500, 96], [1650, 84], [1790, 92]]) A.cottage(ctx, x, 790, s, false, '#4A3E32');
  ground(ctx, 790, '#8E7A5A', '#5A4A34'); grass(ctx, 800, 1080, 54, 'rgba(60,48,30,0.3)');
  if (f > 0) A.smoke(ctx, 960, 760, t, 1.6, 55, 'rgba(50,40,34,0.4)');
}
export function streetNight(ctx, t, o = {}) {
  A.sky(ctx, 'night', t); if (o.fire) { ctx.save(); ctx.globalAlpha = o.fire * 0.6; A.sky(ctx, 'fire', t); ctx.restore(); }
  const r = rng(61);
  for (let side = 0; side < 2; side++) for (let i = 0; i < 9; i++) { const x = side ? 1100 + i * 120 : i * 110 - 60, h = 300 + r() * 160; ctx.fillStyle = '#16130F'; ctx.fillRect(x, 820 - h, 104, h); ctx.beginPath(); ctx.moveTo(x - 10, 820 - h); ctx.lineTo(x + 52, 820 - h - 70); ctx.lineTo(x + 114, 820 - h); ctx.fill();
    if (r() < 0.4) { ctx.fillStyle = 'rgba(232,170,80,0.7)'; ctx.fillRect(x + 30, 820 - h * 0.6, 22, 30); } }
  ground(ctx, 820, '#24201B', '#0E0C0A');
}
export function trafalgar(ctx, t, o = {}) {
  const k = clamp(o.riot ?? 0);
  ctx.fillStyle = mixColor('#3A3A40', '#4A2A22', k); ctx.fillRect(-W, -H, W * 3, H * 3);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(255,255,255,0.05)'); g.addColorStop(1, 'rgba(255,180,120,0.18)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 12; i++) { ctx.fillStyle = '#1E1E22'; ctx.fillRect(i * 170 - 30, 420 + (i % 3) * 30, 160, 400); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { ctx.fillStyle = (i + r + c) % 3 ? 'rgba(220,200,150,0.25)' : 'rgba(240,200,120,0.6)'; ctx.fillRect(i * 170 - 10 + c * 36, 460 + (i % 3) * 30 + r * 70, 18, 34); } }
  A.column(ctx, 960, 820, 80, '#121216');
  if (k > 0) { A.smoke(ctx, 600, 700, t, 2.2, 31, 'rgba(30,26,26,0.45)'); A.flames(ctx, 1500, 840, 200, 160 * k, t, 33, 8); }
  ground(ctx, 820, '#26262A', '#121214');
}

// ------------------------------------------------------------- PEOPLE GRID (poll-tax chapter: the same icons every time)
export function peopleGrid(ctx, t, o) {
  const cols = o.cols ?? 16, rows = o.rows ?? 7, x0 = o.x ?? 260, y0 = o.y ?? 300, dx = o.dx ?? 88, dy = o.dy ?? 100, h = o.h ?? 70;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const k = j * cols + i, st = o.state ? o.state(k, cols * rows, i, j) : {}; if ((st.a ?? 1) <= 0) continue;
    const x = x0 + i * dx, y = y0 + j * dy; ctx.save(); ctx.globalAlpha *= st.a ?? 1; ctx.fillStyle = st.color ?? P.ink2;
    ctx.beginPath(); ctx.moveTo(x - h * 0.2, y); ctx.lineTo(x - h * 0.14, y - h * 0.62); ctx.quadraticCurveTo(x, y - h * 0.72, x + h * 0.14, y - h * 0.62); ctx.lineTo(x + h * 0.2, y); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(x, y - h * 0.82, h * 0.13, 0, TAU); ctx.fill();
    if (st.coin) G.groat(ctx, x + h * 0.28, y - h * 0.9, h * 0.15, st.coin);
    ctx.restore(); }
}

// ------------------------------------------------------------- LONDON 1381 schematic map (map-as-stage for ch7–ch9)
export const LM = { // screen positions of every place on the schematic
  Savoy: [330, 655], Temple: [560, 660], StPauls: [840, 560], Bridge: [1060, 705], Tower: [1300, 655], Aldgate: [1222, 470],
  Smithfield: [640, 365], Barts: [560, 330], Clerkenwell: [650, 180], MileEnd: [1700, 430], Southwark: [1060, 840], Blackheath: [1560, 960], City: [960, 480]
};
const THAMES = [[-60, 640], [300, 690], [700, 720], [1000, 705], [1300, 690], [1600, 745], [1980, 800]];
const WALL = [[700, 702], [690, 560], [760, 430], [900, 382], [1060, 380], [1180, 430], [1240, 560], [1252, 690]];
export function londonMap(ctx, t, o = {}) {
  parchment(ctx, t, o.tint, o.tintA);
  ctx.save(); ctx.strokeStyle = 'rgba(110,90,60,0.12)'; ctx.lineWidth = 1; for (let x = 0; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 120) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } ctx.restore();
  // fields shading outside the walls
  ctx.fillStyle = 'rgba(120,130,80,0.10)'; ctx.fillRect(0, 0, W, 640);
  // the Thames
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#9EAAA2'; ctx.lineWidth = 86; ctx.beginPath(); THAMES.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
  ctx.strokeStyle = 'rgba(60,70,66,0.35)'; ctx.lineWidth = 3; ctx.setLineDash([22, 16]); ctx.lineDashOffset = -t * 10; ctx.beginPath(); THAMES.forEach(([x, y], i) => i ? ctx.lineTo(x, y + 10) : ctx.moveTo(x, y + 10)); ctx.stroke(); ctx.restore();
  G.text(ctx, 'Thamesis', 1500, 760, 'italic 400 34px FellItalic', '#4E5A56', 'center', 0.9);
  // city wall
  ctx.save(); ctx.fillStyle = 'rgba(180,150,110,0.22)'; ctx.beginPath(); WALL.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = P.ink2; ctx.lineWidth = 9; ctx.lineJoin = 'round'; ctx.beginPath(); WALL.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
  ctx.lineWidth = 3; ctx.setLineDash([6, 8]); ctx.strokeStyle = '#EDE3CF'; ctx.beginPath(); WALL.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
  // houses inside
  const r = rng(12); ctx.fillStyle = 'rgba(60,50,40,0.35)'; for (let i = 0; i < 70; i++) { const x = 760 + r() * 440, y = 420 + r() * 260; if (Math.hypot(x - 980, (y - 560) * 1.4) > 260) continue; ctx.fillRect(x, y, 16, 12); }
  // landmarks (small versions of the same building drawings)
  const ic = '#3A3027';
  A.stPauls(ctx, LM.StPauls[0], LM.StPauls[1], 14, ic); A.whiteTower(ctx, LM.Tower[0], LM.Tower[1], 18, ic);
  A.londonBridge(ctx, LM.Bridge[0] - 18, LM.Bridge[0] + 18, LM.Bridge[1] + 50, 6, ic); ctx.fillStyle = ic; ctx.fillRect(LM.Bridge[0] - 9, LM.Bridge[1] - 36, 18, 84);
  A.savoy(ctx, LM.Savoy[0], LM.Savoy[1], 16, ic, false, clamp(o.savoyBurnt ?? 0)); A.templeChurch(ctx, LM.Temple[0] - 20, LM.Temple[1], 18, ic);
  A.priory(ctx, LM.Barts[0], LM.Barts[1], 16, ic); A.cityGate(ctx, LM.Aldgate[0], LM.Aldgate[1] + 14, 7, ic, o.aldgate ?? 0);
  const lab = (k, name, dx = 0, dy = 46, sz = 30, al = 'center', a = 1) => G.text(ctx, name, LM[k][0] + dx, LM[k][1] + dy, `italic 400 ${sz}px FellItalic`, P.ink, al, a);
  const la = o.labels ?? {};
  lab('StPauls', "St Paul's", 0, 40, 26, 'center', la.StPauls ?? 0.8); lab('Tower', 'The Tower', 0, 46, 30, 'center', la.Tower ?? 1); lab('Bridge', 'London Bridge', 0, 96, 26, 'center', la.Bridge ?? 0.8);
  lab('Savoy', 'The Savoy', 0, 46, 28, 'center', la.Savoy ?? 0.8); lab('Temple', 'The Temple', 0, 46, 26, 'center', la.Temple ?? 0.7); lab('Aldgate', 'Aldgate', 40, 10, 28, 'left', la.Aldgate ?? 0.8);
  lab('Smithfield', 'Smithfield', 0, 0, 36, 'center', la.Smithfield ?? 0.9); lab('Barts', "St Bartholomew's", -10, -36, 24, 'center', la.Barts ?? 0.6); lab('Clerkenwell', 'Clerkenwell', 0, 0, 34, 'center', la.Clerkenwell ?? 0.8);
  lab('MileEnd', 'Mile End', 0, 0, 36, 'center', la.MileEnd ?? 0.9); lab('Southwark', 'Southwark', 0, 0, 28, 'center', la.Southwark ?? 0.6); lab('Blackheath', 'to Blackheath', 0, 0, 28, 'center', la.Blackheath ?? 0.6);
  G.text(ctx, 'LONDON', LM.City[0], LM.City[1] - 40, '600 40px Cinzel', P.ink2, 'center', 0.55);
  // compass & cartouche
  ctx.save(); ctx.translate(1800, 130); ctx.fillStyle = P.ink2; ctx.beginPath(); ctx.moveTo(0, -50); ctx.lineTo(12, 0); ctx.lineTo(0, 50); ctx.lineTo(-12, 0); ctx.fill(); G.text(ctx, 'N', 0, -62, '600 26px Cinzel', P.ink2); ctx.restore();
  G.text(ctx, 'London · 1381', 90, 1030, 'italic 400 30px FellItalic', P.ink3, 'left', 0.8);
}
export function lmPath(pts, u) { // position along a polyline of LM keys / points
  const xy = pts.map(p => typeof p === 'string' ? LM[p] : p); let L = 0; const seg = []; for (let i = 1; i < xy.length; i++) { const d = Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]); seg.push(d); L += d; }
  let goal = L * clamp(u); for (let i = 1; i < xy.length; i++) { if (goal <= seg[i - 1]) { const k = goal / seg[i - 1]; return [lerp(xy[i - 1][0], xy[i][0], k), lerp(xy[i - 1][1], xy[i][1], k)]; } goal -= seg[i - 1]; }
  return xy[xy.length - 1];
}
export function screenRoute(ctx, pts, u, o = {}) {
  if (u <= 0) return; const xy = pts.map(p => typeof p === 'string' ? LM[p] : p); ctx.save(); ctx.strokeStyle = o.color ?? P.red; ctx.lineWidth = o.w ?? 7; ctx.setLineDash(o.dash ?? [20, 12]); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(...xy[0]); const N = 60; for (let k = 1; k <= N; k++) { if (k / N > u) break; ctx.lineTo(...lmPath(pts, k / N)); } ctx.lineTo(...lmPath(pts, u)); ctx.stroke(); ctx.restore();
}

// ================================================================ TAIPING EPISODE plates (each location drawn by one function; callbacks reuse it exactly)
const skyMix = (ctx, t, base, o) => { A.sky(ctx, base, t); for (const [k, m] of [['dusk', 'dusk'], ['night', 'night'], ['fire', 'fire']]) if (o[k] > 0) { ctx.save(); ctx.globalAlpha = clamp(o[k]); A.sky(ctx, m, t); ctx.restore(); } };

// ---- NANJING, the Heavenly Capital: walls, gate tower, palace roofs inside, Purple Mountain behind (cold open = ch5 = ch10)
export function nanjing(ctx, t, o = {}) {
  skyMix(ctx, t, o.sky ?? 'day', { dusk: o.dusk ?? 0.7, night: o.night ?? 0, fire: o.fire ?? 0 });
  const nt = clamp((o.night ?? 0) + (o.fire ?? 0) * 0.5), lit = nt > 0.4;
  sun(ctx, 1500, 360, 420, rgba('#FFE6B0', 0.45 * (1 - nt)));
  A.clouds(ctx, t, 31, 200, nt ? 'rgba(20,14,12,0.25)' : 'rgba(252,240,214,0.28)', 4, 5);
  A.hills(ctx, 560, 150, 61, mixColor('#9C7E62', '#2A2028', nt), 900, W + 300); // Purple Mountain
  A.hills(ctx, 640, 40, 62, mixColor('#B19A74', '#2A2420', nt));
  const inner = mixColor('#6E5A46', '#1A1512', nt), roof = mixColor('#5A2A20', '#24120E', nt);
  [[220, 650, 40], [420, 640, 46], [1000, 645, 42], [1460, 650, 38], [1700, 652, 36]].forEach(([x, y, s]) => A.hallCN(ctx, x, y, s, inner, lit, 1, roof));
  A.hallCN(ctx, 760, 650, 118, inner, lit, 2, roof); // the Heavenly King's palace
  if (o.fire) { for (const [x, w_] of [[300, 300], [760, 420], [1300, 360]]) A.flames(ctx, x, 640, w_, 240 * clamp(o.fire), t, x, 9); A.smoke(ctx, 760, 520, t, 2.2, 63, 'rgba(36,26,22,0.42)'); }
  const wall = mixColor('#5E5040', '#1E1A16', nt), top = 610, base = 770;
  A.cnWall(ctx, -120, W + 120, base, base - top, wall);
  A.gateTowerCN(ctx, 1250, base, 125, mixColor('#4E4234', '#18140F', nt), lit);
  const b = clamp(o.breach ?? 0);
  if (b > 0) { // the mine: a 60-yard section drops, the city burning behind
    const x0 = 360, x1 = 720, xm = (x0 + x1) / 2, drop = easeOut(b) * (base - top + 10);
    ctx.save(); ctx.beginPath(); ctx.moveTo(x0 - 30, top - 40); ctx.lineTo(x0 + 20, top - 20 + drop * 0.35); ctx.lineTo(xm - 90, top + drop * 0.8); ctx.lineTo(xm - 30, top - 10 + drop); ctx.lineTo(xm + 40, top + drop * 0.92); ctx.lineTo(xm + 100, top + drop * 0.7); ctx.lineTo(x1 - 10, top - 20 + drop * 0.3); ctx.lineTo(x1 + 30, top - 40); ctx.closePath(); ctx.clip();
    A.sky(ctx, 'fire', t); A.flames(ctx, (x0 + x1) / 2, base - 10, x1 - x0, 260 * b, t, 77, 9); ctx.restore();
    ctx.fillStyle = mixColor('#3A3026', '#100C09', nt); ctx.beginPath(); ctx.moveTo(x0 - 120, base + 20); ctx.quadraticCurveTo((x0 + x1) / 2, base - 90 * b, x1 + 120, base + 20); ctx.fill();
    const dust = Math.sin(Math.min(1, b * 1.6) * Math.PI) ; for (let k = 0; k < 16; k++) puff(ctx, '#6A5A48', lerp(x0 - 80, x1 + 80, (k * 0.618) % 1), base - 60 - (k % 5) * 70 * b, 120 + k * 9, 0.5 * dust + 0.15 * b, 0.25);
  }
  ctx.fillStyle = mixColor('#7E8A84', '#1C2026', nt); ctx.fillRect(-W, base, W * 3, 60); // moat
  ctx.strokeStyle = rgba('#FFFFFF', 0.18); ctx.lineWidth = 2; ctx.setLineDash([50, 180]); ctx.lineDashOffset = -t * 18; ctx.beginPath(); ctx.moveTo(-50, base + 30); ctx.lineTo(W + 50, base + 30); ctx.stroke(); ctx.setLineDash([]);
  ground(ctx, base + 60, mixColor('#8E7652', '#1C1813', nt), mixColor('#5E4A32', '#0C0A08', nt));
  if (o.siege) { const sa = clamp(o.siege); ctx.save(); ctx.globalAlpha *= sa; // Hunan Army siege lines
    ctx.fillStyle = mixColor('#4A3E30', '#14110D', nt); ctx.beginPath(); ctx.moveTo(-100, 930); for (let x = -100; x <= W + 100; x += 80) ctx.lineTo(x, 905 + Math.sin(x / 90) * 10); ctx.lineTo(W + 100, 1100); ctx.lineTo(-100, 1100); ctx.fill();
    ctx.strokeStyle = mixColor('#3A3026', '#100C09', nt); ctx.lineWidth = 6; for (let x = -60; x < W + 60; x += 26) { ctx.beginPath(); ctx.moveTo(x, 915 + Math.sin(x / 90) * 10); ctx.lineTo(x + 4, 870 + Math.sin(x / 90) * 10); ctx.stroke(); }
    for (let i = 0; i < 7; i++) A.tent(ctx, 140 + i * 270, 990 + (i % 2) * 20, 110, mixColor(P.blue, '#10161E', nt * 0.7));
    for (let i = 0; i < 4; i++) { const fx = 300 + i * 440; ctx.strokeStyle = P.ink2; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(fx, 900); ctx.lineTo(fx, 780); ctx.stroke(); ctx.fillStyle = P.blue; const wv = Math.sin(t * 3 + i) * 8; ctx.beginPath(); ctx.moveTo(fx, 780); ctx.lineTo(fx + 80, 790 + wv); ctx.lineTo(fx + 76, 830 + wv); ctx.lineTo(fx, 826); ctx.fill(); }
    ctx.restore(); }
}

// ---- CANTON EXAMINATION COMPOUND: cell rows, the lookout tower, and the screen wall where the PASS LIST is pasted (ch1; echoes ch5, ch6, ch11)
export const EXAM_LIST = { x: 1440, y: 470, w: 640, h: 560 };
export function examHall(ctx, t, o = {}) {
  skyMix(ctx, t, 'day', { dusk: o.dusk ?? 0, night: o.night ?? 0 });
  sun(ctx, 520, 260, 420, 'rgba(255,244,214,0.45)');
  A.clouds(ctx, t, 71, 170, 'rgba(252,244,228,0.3)', 4, 5);
  A.hills(ctx, 560, 40, 72, '#B9A57E');
  const far = '#7A6A54', near = '#4E4234';
  for (let row = 0; row < 4; row++) { const y = 600 + row * 34, c = mixColor(far, near, row / 3), n = 26 - row * 3, cw = (W + 200) / n; // rows of examination cells
    for (let i = 0; i < n; i++) { const x = -100 + i * cw; ctx.fillStyle = c; ctx.fillRect(x, y - 30 - row * 6, cw - 6, 30 + row * 6); ctx.fillStyle = '#16120E'; ctx.fillRect(x + cw * 0.3, y - 20 - row * 4, cw * 0.32, 20 + row * 4); }
    A.roofCN(ctx, W / 2, y - 26 - row * 6, W * 1.25, 18 + row * 4, c); }
  ctx.fillStyle = near; ctx.fillRect(820, 420, 280, 200); A.hallCN(ctx, 960, 430, 110, near, false, 2); // the lookout tower
  ground(ctx, 740, '#A8916A', '#6E5A3E');
  ctx.strokeStyle = 'rgba(60,48,30,0.28)'; ctx.lineWidth = 2; for (let i = -14; i <= 14; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * 70, 740); ctx.lineTo(W / 2 + i * 300, 1080); ctx.stroke(); } for (let y = 760; y < 1080; y += 24 + (y - 740) * 0.3) { ctx.beginPath(); ctx.moveTo(-50, y); ctx.lineTo(W + 50, y); ctx.stroke(); }
  // the screen wall
  const L = EXAM_LIST; ctx.fillStyle = '#5A4A38'; ctx.fillRect(L.x - L.w / 2 - 60, L.y - L.h / 2 - 50, L.w + 120, L.h + 330); A.roofCN(ctx, L.x, L.y - L.h / 2 - 46, L.w + 230, 60, '#3A3027');
  ctx.fillStyle = '#4A3E30'; ctx.fillRect(L.x - L.w / 2 - 80, L.y + L.h / 2 + 180, L.w + 160, 120);
  if (o.list) G.passList(ctx, t, L.x, L.y, L.w, L.h, { light: true, ...o.list });
}

// ---- HAKKA VILLAGE near Canton (Hong's home; ch1, ch2)
export function hakkaVillage(ctx, t, o = {}) {
  const dusk = clamp(o.dusk ?? 0), night = clamp(o.night ?? 0);
  skyMix(ctx, t, 'day', { dusk, night });
  sun(ctx, 1450, 280, 440, rgba('#FFF4D6', 0.5 * (1 - night)));
  A.clouds(ctx, t, 81, 180, night ? 'rgba(10,10,14,0.25)' : 'rgba(252,244,228,0.32)', 5, 6);
  A.hills(ctx, 590, 130, 82, mixColor('#B3A07E', '#2A2A30', night));
  A.hills(ctx, 660, 50, 83, mixColor('#A08A62', '#22201E', night));
  A.paddies(ctx, 690, 1080, mixColor('#9EA27A', '#1E2220', night), mixColor('#6E7250', '#141614', night), 8, 84);
  const hc = mixColor('#3E352B', '#14110E', night), lit = dusk > 0.5 || night > 0.3;
  [[150, 700, 110], [370, 694, 96], [1180, 700, 104], [1400, 696, 92], [1620, 704, 112]].forEach(([x, y, s], i) => A.farmhouseCN(ctx, x, y, s, lit && i % 2 === 0, hc));
  A.hallCN(ctx, 780, 704, 78, hc, lit, 1); // the village school
  A.bamboo(ctx, 560, 712, 180, 85, mixColor('#3E3A2A', '#121410', night)); A.bamboo(ctx, 1830, 712, 200, 86, mixColor('#3E3A2A', '#121410', night));
  A.tree(ctx, 1000, 706, 150, mixColor('#3E3A2A', '#121410', night), 7);
  ctx.fillStyle = mixColor('#8E7A56', '#16130F', night); ctx.fillRect(-W, 712, W * 3, 14);
}

// ---- CHINESE INTERIOR (school, Heavenly King's throne hall, East King's palace by night, Qing throne room): one hall, four dressings
export function hallInterior(ctx, t, o = {}) {
  const mode = o.mode ?? 'school', dark = clamp(o.dark ?? (mode === 'east' ? 0.55 : 0));
  ctx.fillStyle = mixColor('#5A4230', '#1A120C', dark); ctx.fillRect(-W, -H, W * 3, H * 3);
  ctx.strokeStyle = 'rgba(20,12,8,0.35)'; ctx.lineWidth = 3; for (let x = 0; x < W; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 800); ctx.stroke(); } // plank wall
  for (const cx of [380, 1540]) { const night = o.night || mode === 'east'; ctx.fillStyle = night ? '#2A3448' : '#F0DDA8'; ctx.fillRect(cx - 170, 180, 340, 360); // lattice windows
    ctx.strokeStyle = '#2A1E14'; ctx.lineWidth = 8; for (let k = 0; k <= 6; k++) { ctx.beginPath(); ctx.moveTo(cx - 170 + k * 340 / 6, 180); ctx.lineTo(cx - 170 + k * 340 / 6, 540); ctx.stroke(); } for (let k = 0; k <= 6; k++) { ctx.beginPath(); ctx.moveTo(cx - 170, 180 + k * 60); ctx.lineTo(cx + 170, 180 + k * 60); ctx.stroke(); }
    if (!night) { ctx.save(); ctx.globalAlpha = 0.12 + 0.02 * Math.sin(t * 0.7); ctx.fillStyle = '#F6E2A8'; ctx.beginPath(); ctx.moveTo(cx - 170, 540); ctx.lineTo(cx + 170, 540); ctx.lineTo(cx + 420, 1080); ctx.lineTo(cx + 40, 1080); ctx.fill(); ctx.restore(); } }
  const col = mixColor(mode === 'qing' ? '#5A3A1C' : mode === 'home' ? '#3E2E20' : '#6A1E16', '#1A0C08', dark);
  for (const cx of [120, 700, 1220, 1800]) { ctx.fillStyle = col; ctx.fillRect(cx - 34, 0, 68, 820); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(cx + 10, 0, 24, 820); } // lacquered columns
  ctx.fillStyle = mixColor('#3A2A1C', '#100A06', dark); ctx.fillRect(-W, 0, W * 3, 70); ctx.fillRect(-W, 70, W * 3, 18);
  ground(ctx, 820, mixColor('#4A3A2A', '#120E0A', dark), mixColor('#2A2018', '#0A0806', dark));
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 2; for (let y = 840; y < 1080; y += 30 + (y - 820) * 0.3) { ctx.beginPath(); ctx.moveTo(-100, y); ctx.lineTo(W + 100, y); ctx.stroke(); }
  if (mode === 'school') { table(ctx, 960, 820, 520, 140, '#5A3E26');
    const ta = clamp(o.tablet ?? 1); if (ta > 0) { ctx.save(); ctx.globalAlpha *= ta; ctx.fillStyle = '#3A2414'; ctx.fillRect(915, 520, 90, 150); ctx.fillStyle = P.gold; ctx.fillRect(927, 534, 66, 122); for (let k = 0; k < 4; k++) G.brushGlyph(ctx, 960, 552 + k * 30, 24, 500 + k, '#3A2414', 1.2); ctx.restore(); }
    for (const [x, y] of [[420, 1000], [1500, 1000]]) table(ctx, x, y, 300, 90, '#4A3420'); }
  if (mode === 'throne' || mode === 'east' || mode === 'qing') {
    const q = mode === 'qing', ban = q ? P.gold : P.red;
    for (const bx of [520, 1400]) { ctx.fillStyle = mixColor(ban, '#000', dark * 0.6); ctx.fillRect(bx - 70, 100, 140, 520); ctx.strokeStyle = q ? '#8A6B27' : P.gold; ctx.lineWidth = 6; ctx.strokeRect(bx - 56, 116, 112, 488); for (let k = 0; k < 4; k++) G.brushGlyph(ctx, bx, 190 + k * 110, 70, (q ? 600 : 650) + k + bx, q ? '#5A3A1C' : P.gold2, 1.2); }
    ctx.fillStyle = mixColor('#3A2A1C', '#0E0A06', dark); ctx.fillRect(560, 760, 800, 60); ctx.fillRect(620, 720, 680, 40); // dais
    ctx.fillStyle = mixColor(q ? '#8A6B27' : '#7A1E16', '#120806', dark); ctx.fillRect(780, 420, 360, 300); ctx.fillStyle = mixColor(q ? P.gold : P.gold, '#120806', dark); ctx.fillRect(760, 400, 400, 30); ctx.fillRect(760, 600, 40, 120); ctx.fillRect(1120, 600, 40, 120); // throne
    if (q) { ctx.strokeStyle = mixColor('#5A3A1C', '#000', dark); ctx.lineWidth = 8; ctx.beginPath(); for (let k = 0; k <= 30; k++) { const u = k / 30; ctx.lineTo(820 + u * 280, 520 + Math.sin(u * 9) * 40); } ctx.stroke(); } // dragon carving
    if (mode === 'east') for (const lx of [300, 1620]) { puff(ctx, '#E8A43A', lx, 300, 120, 0.35 + 0.05 * Math.sin(t * 6), 0.2); ctx.fillStyle = '#C8402A'; ctx.beginPath(); ctx.ellipse(lx, 300, 34, 48, 0, 0, TAU); ctx.fill(); }
  }
  if (dark > 0) { const g = ctx.createRadialGradient(W / 2, H * 0.55, 100, W / 2, H * 0.55, W * 0.7); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${0.6 * dark})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
}

// ---- THE DREAM (Hong's 1837 vision): a palace in a gold sky. The two figures are backlit silhouettes only.
export function dream(ctx, t, o = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E9C67A'); g.addColorStop(0.55, '#F4E2B2'); g.addColorStop(1, '#C99A5A'); ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3);
  sun(ctx, W / 2, 330, 900, 'rgba(255,250,230,0.7)');
  ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = '#FFF6DC'; for (let k = 0; k < 16; k++) { const a = k / 16 * TAU + t * 0.03; ctx.beginPath(); ctx.moveTo(W / 2, 330); ctx.lineTo(W / 2 + Math.cos(a) * 2400, 330 + Math.sin(a) * 2400); ctx.lineTo(W / 2 + Math.cos(a + 0.08) * 2400, 330 + Math.sin(a + 0.08) * 2400); ctx.fill(); } ctx.restore();
  const pal = '#A07A3E'; A.hallCN(ctx, W / 2, 470, 150, pal, true, 2, '#8A6430'); A.hallCN(ctx, W / 2 - 420, 520, 80, pal, false, 1, '#8A6430'); A.hallCN(ctx, W / 2 + 420, 520, 80, pal, false, 1, '#8A6430');
  const r = rng(91); for (let i = 0; i < 46; i++) { const x = r() * (W + 600) - 300 + Math.sin(t * 0.2 + i) * 30, y = 520 + r() * 180; puff(ctx, '#FBF1D8', x, y, 140 + r() * 120, 0.85, 0.4); }
  for (let i = 0; i < 30; i++) { const x = r() * (W + 600) - 300 - t * 6, y = 860 + r() * 220; puff(ctx, '#F3DFAE', ((x % (W + 600)) + W + 600) % (W + 600) - 300, y, 160 + r() * 140, 0.9, 0.4); }
  if (o.demons) { const da = clamp(o.demons); for (let i = 0; i < 9; i++) { const x = 200 + i * 190 + Math.sin(t * 1.3 + i) * 20, y = 960 + Math.cos(t + i) * 10; ctx.save(); ctx.globalAlpha *= da * (1 - clamp(o.slain ?? 0) * (i % 3 === 0 ? 1 : (o.slain ?? 0) > 0.6 ? 1 : 0)); ctx.fillStyle = '#2A1E16';
    ctx.beginPath(); ctx.moveTo(x - 30, y); ctx.quadraticCurveTo(x - 40, y - 90, x, y - 110); ctx.quadraticCurveTo(x + 40, y - 90, x + 30, y); ctx.fill(); tri(ctx, x - 22, y - 96, x - 30, y - 140, x - 8, y - 104); tri(ctx, x + 22, y - 96, x + 30, y - 140, x + 8, y - 104); ctx.fillStyle = '#E8A43A'; ctx.fillRect(x - 12, y - 84, 8, 5); ctx.fillRect(x + 4, y - 84, 8, 5); ctx.restore(); } }
}
function tri(ctx, a, b, c, d, e, f) { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.lineTo(e, f); ctx.closePath(); ctx.fill(); }
export function visionFigure(ctx, t, key, x, y, h, pose = {}) { // backlit: gold halo, dark-brown silhouette, the golden beard stays gold
  const g = ctx.createRadialGradient(x, y - h * 0.8, 0, x, y - h * 0.8, h * 0.9); g.addColorStop(0, 'rgba(255,248,220,0.95)'); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g; ctx.fillRect(x - h, y - h * 1.8, h * 2, h * 2);
  A.figure(ctx, x, y, h, shade(CH[key], '#4A3420'), pose);
}

// ---- GUANGXI: tower karst, charcoal kilns, Thistle Mountain and Jintian village (ch3, ch4)
export function guangxi(ctx, t, o = {}) {
  const dusk = clamp(o.dusk ?? 0), night = clamp(o.night ?? 0);
  skyMix(ctx, t, 'day', { dusk, night });
  sun(ctx, 1500, 300, 460, rgba('#FFF0CC', 0.45 * (1 - night)));
  A.karst(ctx, 560, 101, mixColor('#C2B394', '#30303A', night), 11, 160, 330);
  for (let i = 0; i < 8; i++) puff(ctx, night ? '#3A3A44' : '#F2EAD8', i * 280 + Math.sin(t * 0.1 + i) * 40, 560, 260, 0.45, 0.3); // mist
  A.karst(ctx, 680, 102, mixColor('#9C8A68', '#22222A', night), 7, 220, 440);
  for (let i = 0; i < 6; i++) puff(ctx, night ? '#2E2E36' : '#EDE3CF', i * 360 + 100, 690, 240, 0.35, 0.3);
  A.karst(ctx, 800, 103, mixColor('#6E5E46', '#18181C', night), 4, 260, 520, -300, W + 300); // Thistle Mountain range
  ground(ctx, 800, mixColor('#8A7652', '#141310', night), mixColor('#5A4A32', '#0A0908', night));
  const hc = mixColor('#3A3027', '#100E0B', night), lit = dusk > 0.4 || night > 0.3;
  if (o.kilns !== false) for (const [x, s] of [[260, 70], [420, 56], [1660, 64]]) A.kiln(ctx, x, 830, s, t, x, hc);
  if (o.village) [[820, 840, 90], [990, 834, 80], [1150, 842, 94], [1300, 838, 84]].forEach(([x, y, s], i) => A.farmhouseCN(ctx, x, y, s, lit && i % 2 === 0, hc));
  if (o.camp) { const ca = clamp(o.camp); ctx.save(); ctx.globalAlpha *= ca; for (let i = 0; i < 8; i++) A.tent(ctx, 140 + i * 235, 930 + (i % 2) * 20, 100, mixColor('#4A3E30', '#14110D', night));
    for (let i = 0; i < 4; i++) A.campfire(ctx, 260 + i * 460, 960, 70, t, 20 + i);
    for (let i = 0; i < 5; i++) { const fx = 200 + i * 400; ctx.strokeStyle = P.ink2; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(fx, 940); ctx.lineTo(fx, 760); ctx.stroke(); const wv = Math.sin(t * 3 + i) * 8; ctx.fillStyle = P.red; ctx.beginPath(); ctx.moveTo(fx, 760); ctx.lineTo(fx + 100, 772 + wv); ctx.lineTo(fx + 96, 822 + wv); ctx.lineTo(fx, 816); ctx.fill(); }
    ctx.restore(); }
}

// ---- THE YANGTZE: wide river, a walled city on the far bank, the Taiping fleet (ch4 Wuchang, ch6, ch9 Anqing)
export function yangtze(ctx, t, o = {}) {
  const dusk = clamp(o.dusk ?? 0), night = clamp(o.night ?? 0), fire = clamp(o.fire ?? 0);
  skyMix(ctx, t, 'day', { dusk, night, fire: fire * 0.8 });
  A.clouds(ctx, t, 111, 190, night ? 'rgba(10,10,14,0.25)' : 'rgba(252,244,228,0.3)', 5, 6);
  A.hills(ctx, 560, 70, 112, mixColor('#AE9A76', '#26242A', night));
  const cc = mixColor('#5E5040', '#18140F', night);
  if (o.city !== false) { A.cnWall(ctx, 420, 1500, 620, 70, cc); A.gateTowerCN(ctx, 960, 620, 62, cc, night > 0.3); A.pagoda(ctx, 1320, 560, 46, cc, 7); [[560, 556, 32], [760, 552, 36], [1160, 556, 34]].forEach(([x, y, s]) => A.hallCN(ctx, x, y, s, cc, night > 0.3));
    if (fire) { A.flames(ctx, 800, 600, 600, 200 * fire, t, 113, 10); A.smoke(ctx, 900, 480, t, 2, 114, 'rgba(36,26,22,0.4)'); } }
  ctx.fillStyle = mixColor('#9AA49C', '#1C2228', night); ctx.fillRect(-W, 630, W * 3, H); // the river
  ctx.strokeStyle = night ? 'rgba(220,160,80,0.15)' : 'rgba(255,255,255,0.22)'; ctx.lineWidth = 2; for (let i = 0; i < 14; i++) { const y = 650 + i * 30; ctx.setLineDash([70 + i * 6, 220]); ctx.lineDashOffset = -(t * (14 + i) + i * 97) % 400; ctx.beginPath(); ctx.moveTo(-50, y); ctx.lineTo(W + 50, y); ctx.stroke(); } ctx.setLineDash([]);
  const n = o.fleet ?? 0, fx = o.fleetX ?? 0;
  for (let i = 0; i < n; i++) { const r = rng(120 + i), d = r(), x = ((r() * (W + 600) + fx * (0.6 + d * 0.5)) % (W + 600)) - 300, y = 700 + d * 280, s = 22 + d * 42;
    A.junk(ctx, x, y, s, t, mixColor('#3A3027', '#100C09', night), mixColor('#8A6B47', '#2A2018', night), P.red); }
  if (o.warships) for (const [x, y, s] of o.warships) A.warship(ctx, x, y, s, t);
}

// ---- SHANGHAI 1860: city wall with foreign troops, harbour with steam warships and godowns (ch8, ch9)
export function shanghai(ctx, t, o = {}) {
  const dusk = clamp(o.dusk ?? 0.3);
  skyMix(ctx, t, 'day', { dusk });
  A.clouds(ctx, t, 131, 180, 'rgba(252,244,228,0.3)', 5, 6);
  const far = '#7E705C';
  for (let i = 0; i < 9; i++) { const x = 980 + i * 110, h = 70 + (i % 3) * 22; ctx.fillStyle = far; ctx.fillRect(x, 600 - h, 100, h); ctx.fillRect(x - 6, 600 - h - 8, 112, 8); for (let k = 0; k < 4; k++) { ctx.fillStyle = 'rgba(230,220,200,0.35)'; ctx.fillRect(x + 8 + k * 24, 600 - h + 16, 12, 22); } } // godowns on the Bund
  ctx.fillStyle = '#6E5E46'; ctx.fillRect(900, 596, W, 14);
  ctx.fillStyle = mixColor('#9AA49C', '#6E6A60', dusk * 0.3); ctx.fillRect(860, 610, W, 600); // the Huangpu
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 2; for (let i = 0; i < 12; i++) { const y = 630 + i * 34; ctx.setLineDash([80, 200]); ctx.lineDashOffset = -(t * 16 + i * 77) % 280; ctx.beginPath(); ctx.moveTo(880, y); ctx.lineTo(W + 50, y); ctx.stroke(); } ctx.setLineDash([]);
  A.warship(ctx, 1700, 700, 54, t + 2); A.warship(ctx, 1330, 790, 74, t); A.junk(ctx, 1080, 900, 44, t, '#3A3027', '#8A6B47', null); A.junk(ctx, 1600, 980, 50, t, '#3A3027', '#8A6B47', null);
  ctx.save(); ctx.beginPath(); ctx.rect(-W, 0, W + 900, H * 2); ctx.clip();
  ground(ctx, 640, '#8E7A56', '#5A4A32'); A.cnWall(ctx, -120, 900, 780, 200, '#4E4234'); A.gateTowerCN(ctx, 420, 780, 90, '#443A2E');
  ground(ctx, 880, '#7E6A48', '#4A3A26'); ctx.restore();
  ctx.fillStyle = '#4E4234'; ctx.beginPath(); ctx.moveTo(900, 560); ctx.lineTo(860, 560); ctx.lineTo(860, H); ctx.lineTo(900, H); ctx.fill();
  if (o.troops) { const ta = clamp(o.troops); for (let i = 0; i < 9; i++) { const x = 40 + i * 92; ctx.save(); ctx.globalAlpha *= ta; A.figure(ctx, x, 584, 72, CH.foreignSoldier, { face: 1, prop: 'rifle', armF: 70, elbF: -60, propAng: 80 }); ctx.restore(); }
    if (o.volley) { const v = o.volley; for (let i = 0; i < 9; i++) { const ph = (v + i * 0.13) % 1; if (ph < 0.2) { puff(ctx, '#FFE2A0', 40 + i * 92 + 60, 540, 26, 1 - ph * 5, 0.5); puff(ctx, '#B8B0A4', 40 + i * 92 + 90, 530, 50 + ph * 200, 0.4, 0.3); } } } }
}

// ---- THE SUMMER PALACE, Beijing, October 1860 (ch9)
export function summerPalace(ctx, t, o = {}) {
  const f = clamp(o.fire ?? 0); skyMix(ctx, t, 'day', { fire: f * 0.9 });
  A.clouds(ctx, t, 141, 170, 'rgba(80,60,40,0.15)', 4, 6);
  A.hills(ctx, 600, 160, 142, mixColor('#A89270', '#4A2A20', f));
  const c = mixColor('#4E4234', '#1A110C', f * 0.7);
  A.pagoda(ctx, 980, 470, 40, c, 5); A.hallCN(ctx, 980, 520, 90, c, false, 2, c); A.hallCN(ctx, 640, 600, 70, c, false, 1, c); A.hallCN(ctx, 1340, 600, 70, c, false, 1, c); A.hallCN(ctx, 340, 640, 54, c, false, 1, c); A.hallCN(ctx, 1640, 640, 54, c, false, 1, c);
  if (f > 0) { for (const [x, w_] of [[640, 300], [980, 380], [1340, 300], [340, 220], [1640, 220]]) A.flames(ctx, x, 620, w_, 170 * f, t, x + 1, 9); A.smoke(ctx, 980, 380, t, 2.6, 143, 'rgba(36,26,22,0.45)'); A.smoke(ctx, 500, 480, t, 2, 144, 'rgba(36,26,22,0.35)'); }
  ctx.fillStyle = mixColor('#9AA49C', '#6A3A26', f * 0.6); ctx.fillRect(-W, 680, W * 3, H); // Kunming Lake
  ctx.strokeStyle = 'rgba(255,230,190,0.2)'; ctx.lineWidth = 2; for (let i = 0; i < 10; i++) { const y = 700 + i * 34; ctx.setLineDash([80, 200]); ctx.lineDashOffset = -(t * 14 + i * 77) % 280; ctx.beginPath(); ctx.moveTo(-50, y); ctx.lineTo(W + 50, y); ctx.stroke(); } ctx.setLineDash([]);
  ctx.fillStyle = mixColor('#D8CDB5', '#5A3A2A', f * 0.6); for (let k = 0; k < 7; k++) { const x0 = 300 + k * 190; ctx.beginPath(); ctx.moveTo(x0, 860); ctx.quadraticCurveTo(x0 + 95, 790, x0 + 190, 860); ctx.lineTo(x0 + 190, 880); ctx.quadraticCurveTo(x0 + 95, 820, x0, 880); ctx.fill(); } ctx.fillRect(300, 844, 1330, 16); // seventeen-arch style bridge
}

// ---- TIANANMEN SQUARE and the Monument to the People's Heroes (ch12); o.relief shows the carved Jintian panel
export function tiananmen(ctx, t, o = {}) {
  skyMix(ctx, t, 'day', { dusk: o.dusk ?? 0.15 });
  A.clouds(ctx, t, 151, 170, 'rgba(252,244,228,0.32)', 5, 5);
  A.tiananmenGate(ctx, 640, 640, 52, '#7A6A54');
  ground(ctx, 640, '#B8A786', '#7E6A4A');
  ctx.strokeStyle = 'rgba(70,56,36,0.3)'; ctx.lineWidth = 2; for (let i = -20; i <= 20; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * 50, 640); ctx.lineTo(W / 2 + i * 260, 1080); ctx.stroke(); } for (let y = 650; y < 1080; y += 14 + (y - 640) * 0.25) { ctx.beginPath(); ctx.moveTo(-50, y); ctx.lineTo(W + 50, y); ctx.stroke(); }
  if (o.obelisk !== false) A.obelisk(ctx, 1300, 930, 112, '#4E453A');
}
export function reliefPanel(ctx, t, o = {}) { // stone bas-relief: the uprising at Jintian (figures carved from the same character drawings)
  ctx.fillStyle = '#9C968A'; ctx.fillRect(-W, -H, W * 3, H * 3);
  const r = rng(161); for (let i = 0; i < 1800; i++) { ctx.fillStyle = `rgba(${r() < 0.5 ? '60,56,50' : '220,214,200'},${0.05 + r() * 0.08})`; ctx.fillRect(r() * W, r() * H, 2 + r() * 4, 2 + r() * 4); }
  ctx.fillStyle = '#8E887C'; ctx.fillRect(110, 150, W - 220, 720);
  const keys = ['tpSoldier', 'burner', 'tpWoman', 'feng', 'tpSoldier', 'villager', 'tpSoldier', 'xiao', 'tpWoman', 'burner', 'tpSoldier', 'hakkaWoman'];
  const poses = [{ prop: 'flag', armF: 170, elbF: 0 }, { prop: 'spear', armF: 150, elbF: 10 }, { prop: 'spear' }, { prop: 'flag', armF: 165, elbF: 5 }, { armF: 160, elbF: -10, prop: 'spade' }, { prop: 'spear', armF: 140 }, { prop: 'flag', armF: 170 }, { prop: 'spear' }, { armF: 150, elbF: 20 }, { prop: 'axe', armF: 160 }, { prop: 'spear', armF: 150 }, { armF: 120, elbF: 30 }];
  const carve = (dx, dy, col, propCol) => keys.forEach((k, i) => { const row = i % 2, x = 210 + i * 135 + dx, y = 850 - row * 36 + dy, h = 360 - row * 40;
    A.figure(ctx, x, y, h, stone(CH[k], col), { face: i < 6 ? 1 : -1, walk: 0.6 + i, t: 0, propColor: propCol, ...poses[i] }); });
  carve(7, 9, '#4A453E', '#4A453E'); carve(0, 0, '#B6B0A2', '#A8A294');
  ctx.strokeStyle = '#6E685E'; ctx.lineWidth = 24; ctx.strokeRect(98, 138, W - 196, 744);
  ctx.fillStyle = '#8A8478'; ctx.fillRect(98, 870, W - 196, 110);
  if (o.red) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = clamp(o.red) * 0.35; ctx.fillStyle = P.red; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}

// ---- CHINA MAP (Natural Earth land + rivers; the Taiping heartland can be filled red)
export const TP_AREA = [[32.4, 114.0], [32.6, 116.6], [32.7, 119.0], [32.0, 120.6], [31.4, 121.2], [30.4, 120.8], [29.7, 119.6], [29.1, 117.5], [28.9, 115.6], [29.7, 113.9], [30.8, 113.6]];
export function chinaMap(ctx, t, o = {}) {
  const view = o.view ?? G.CN_VIEW;
  G.drawMap(ctx, 'china', view, { rivers: ['cn_Yangtze', 'cn_Huang', 'cn_Xiang', 'cn_Gan', 'cn_Pearl', 'cn_Han', 'cn_Min'], riverW: o.riverW ?? 4 });
  if (o.tp) G.fillRegion(ctx, 'china', view, TP_AREA, P.red, 0.38 * clamp(o.tp));
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.35; parchment(ctx, t); ctx.restore();
  for (const p of (o.labels ?? [])) G.mapLabel(ctx, view, p, 1, { t, size: 30, color: p === (o.hi ?? '') ? P.red : P.ink });
  if (o.cartouche !== false) G.text(ctx, o.cartouche ?? 'Qing China · 1850s', 90, 1030, 'italic 400 30px FellItalic', P.ink3, 'left', 0.8);
}

// ================================================================ GUERRILLA EPISODE (1927–1949): plates
// one-point perspective helper for street plates: X across, Y down (ground at +), z depth (1 = near)
const pv = (vx, vy, X, Y, z) => [vx + X / z, vy + Y / z];
function poly(ctx, pts, col) { ctx.fillStyle = col; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); }
export function lyingSoldier(ctx, x, y, s, col = '#5E6266', f = 1, cap = true) { // a soldier asleep on his back across the pavement: pack under his head, rifle in his arms
  ctx.save(); ctx.translate(x, y); ctx.scale(f * s, s); const dk = mixColor(col, '#000000', 0.3);
  ctx.fillStyle = 'rgba(20,16,12,0.25)'; ctx.beginPath(); ctx.ellipse(0, 0, 0.62, 0.05, 0, 0, TAU); ctx.fill(); // shadow
  ctx.fillStyle = dk; ctx.beginPath(); ctx.moveTo(-0.58, -0.02); ctx.lineTo(-0.3, -0.12); ctx.lineTo(-0.08, -0.06); ctx.lineTo(-0.08, -0.01); ctx.lineTo(-0.3, -0.06); ctx.lineTo(-0.56, 0.01); ctx.closePath(); ctx.fill(); // legs, one knee up
  ctx.fillStyle = '#2A241D'; ctx.fillRect(-0.62, -0.035, 0.07, 0.05); // straw sandals
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-0.1, -0.01); ctx.lineTo(-0.1, -0.1); ctx.quadraticCurveTo(0.15, -0.16, 0.38, -0.1); ctx.lineTo(0.38, -0.0); ctx.closePath(); ctx.fill(); // torso
  ctx.fillStyle = '#6E5A43'; ctx.fillRect(0.38, -0.08, 0.16, 0.08); // pack as pillow
  ctx.fillStyle = '#2A241D'; ctx.beginPath(); ctx.arc(0.47, -0.13, 0.06, 0, TAU); ctx.fill(); // head
  if (cap) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0.42, -0.17); ctx.lineTo(0.43, -0.25); ctx.lineTo(0.55, -0.25); ctx.lineTo(0.54, -0.17); ctx.closePath(); ctx.fill(); A.star5(ctx, 0.49, -0.21, 0.022, P.red); }
  ctx.fillStyle = P.red; ctx.fillRect(0.33, -0.12, 0.03, 0.02); // collar tab
  ctx.strokeStyle = '#3A2E22'; ctx.lineWidth = 0.022; ctx.beginPath(); ctx.moveTo(-0.18, -0.13); ctx.lineTo(0.36, -0.2); ctx.stroke(); ctx.strokeStyle = '#4A4A48'; ctx.lineWidth = 0.012; ctx.beginPath(); ctx.moveTo(0.36, -0.2); ctx.lineTo(0.6, -0.25); ctx.stroke(); // rifle hugged
  ctx.restore();
}
// the Chinese Red Army flag (1928–37): red field, white hoist band, yellow star (not the 1949 five-star flag)
export function redFlag(ctx, fx, fy, w, t, col = P.red) { const wv = Math.sin(t * 3 + fx) * w * 0.06, h = w * 0.62; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.quadraticCurveTo(fx + w / 2, fy - h * 0.1 + wv, fx + w, fy + h * 0.04); ctx.lineTo(fx + w, fy + h * 1.04); ctx.quadraticCurveTo(fx + w / 2, fy + h * 0.9 + wv, fx, fy + h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#EDE3CF'; ctx.fillRect(fx, fy, w * 0.12, h); A.star5(ctx, fx + w * 0.45, fy + h * 0.45 + wv * 0.5, h * 0.24, P.gold2); }
// the PRC five-star flag (from 1 October 1949)
export function prcFlag(ctx, fx, fy, w, t) { const wv = Math.sin(t * 3 + fx) * w * 0.06, h = w * 0.66; ctx.fillStyle = P.red; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.quadraticCurveTo(fx + w / 2, fy - h * 0.1 + wv, fx + w, fy + h * 0.04); ctx.lineTo(fx + w, fy + h * 1.04); ctx.quadraticCurveTo(fx + w / 2, fy + h * 0.9 + wv, fx, fy + h); ctx.closePath(); ctx.fill();
  A.star5(ctx, fx + w * 0.17, fy + h * 0.27, h * 0.16, '#F2C84A'); for (const [dx, dy] of [[0.33, 0.1], [0.4, 0.2], [0.4, 0.35], [0.33, 0.45]]) A.star5(ctx, fx + w * dx, fy + h * dy, h * 0.055, '#F2C84A'); }
// ---- SHANGHAI STREET: stone banks on the left, Chinese shophouses on the right. ch1 (1927, night, red) and cold open = ch11 (1949 dawn, sleepers)
export function shanghaiStreet(ctx, t, o = {}) {
  const night = clamp(o.night ?? 0), red = clamp(o.red ?? 0), dawn = clamp(o.dawn ?? 0), VX = 1120, VY = 560;
  skyMix(ctx, t, 'day', { dusk: dawn * 0.75, night });
  if (red) { ctx.save(); ctx.globalAlpha = red * 0.75; A.sky(ctx, 'fire', t); ctx.restore(); }
  sun(ctx, VX + 60, VY - 40, 520, rgba('#FFE2A8', 0.55 * dawn * (1 - night)));
  A.clouds(ctx, t, 211, 150, night ? 'rgba(10,10,14,0.25)' : 'rgba(252,240,214,0.3)', 4, 4);
  const dk = (c) => mixColor(mixColor(c, '#1A1614', night * 0.85), '#3A100C', red * 0.45);
  // road and pavements
  poly(ctx, [[-W, H], [W * 2, H], [VX, VY]], dk('#8A7C66'));
  poly(ctx, [pv(VX, VY, -1600, 540, 1), pv(VX, VY, -900, 540, 1), pv(VX, VY, -900, 540, 30), pv(VX, VY, -1600, 540, 30)], dk('#A39478'));
  poly(ctx, [pv(VX, VY, 820, 540, 1), pv(VX, VY, 1500, 540, 1), pv(VX, VY, 1500, 540, 30), pv(VX, VY, 820, 540, 30)], dk('#A39478'));
  ctx.strokeStyle = dk('#5E5242'); ctx.lineWidth = 3; for (const X of [-900, 820]) { ctx.beginPath(); ctx.moveTo(...pv(VX, VY, X, 540, 1)); ctx.lineTo(...pv(VX, VY, X, 540, 30)); ctx.stroke(); }
  ctx.strokeStyle = dk('#6E6252'); ctx.lineWidth = 2; for (const X of [-260, -120, 120, 260]) { ctx.beginPath(); ctx.moveTo(...pv(VX, VY, X, 540, 1)); ctx.lineTo(...pv(VX, VY, X, 540, 30)); ctx.stroke(); } // tram rails
  for (let z = 1.2; z < 30; z *= 1.32) { ctx.strokeStyle = dk('rgba(70,58,44,0.35)'); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(...pv(VX, VY, -1600, 540, z)); ctx.lineTo(...pv(VX, VY, -900, 540, z)); ctx.moveTo(...pv(VX, VY, 820, 540, z)); ctx.lineTo(...pv(VX, VY, 1500, 540, z)); ctx.stroke(); }
  // left: stone banks (segments of different heights), columns and windows; a clock tower further down
  const L = -1600, segs = [[1, 2.1, -1250], [2.1, 3.6, -1500], [3.6, 6.2, -1150], [6.2, 11, -1350], [11, 30, -1000]];
  for (const [z0, z1, top] of segs) { const base = dk(['#B3A68C', '#A8997C', '#B8AA90', '#A39478', '#9C8E74'][segs.findIndex(sg => sg[0] === z0)]);
    poly(ctx, [pv(VX, VY, L, 540, z0), pv(VX, VY, L, top, z0), pv(VX, VY, L, top, z1), pv(VX, VY, L, 540, z1)], base);
    poly(ctx, [pv(VX, VY, L, top, z0), pv(VX, VY, L + 70, top - 40, z0), pv(VX, VY, L + 70, top - 40, z1), pv(VX, VY, L, top, z1)], dk('#6E6252')); // cornice
    for (let z = z0 + 0.12; z < z1 - 0.05; z += (z1 - z0) / Math.max(3, Math.round((z1 - z0) * 2.2))) { const [cx0, cy0] = pv(VX, VY, L, 540, z), [, cy1] = pv(VX, VY, L, top + 60, z);
      ctx.fillStyle = dk('rgba(60,50,38,0.28)'); ctx.fillRect(cx0 - 26 / z, cy1, 14 / z, cy0 - cy1); // column shadow
      for (let k = 0; k < 4; k++) { const Y0 = top + 140 + k * ((540 - top - 260) / 4); const [wx, wy] = pv(VX, VY, L, Y0, z + 0.08), [, wy2] = pv(VX, VY, L, Y0 + 120, z + 0.08);
        const lit = night > 0.3 && ((z * 7 + k) | 0) % 3 === 0; ctx.fillStyle = lit ? 'rgba(255,200,120,0.75)' : dk('#3A3027'); ctx.fillRect(wx + 6 / z, wy, 34 / z, wy2 - wy); } } }
  { const z = 7.4, [tx, ty] = pv(VX, VY, L + 40, -1350, z), tw = 260 / z; ctx.fillStyle = dk('#8C7E66'); ctx.fillRect(tx - tw / 2, ty - 900 / z, tw, 900 / z); // clock tower
    ctx.fillStyle = dk('#EDE3CF'); ctx.beginPath(); ctx.arc(tx, ty - 700 / z, 70 / z, 0, TAU); ctx.fill(); ctx.strokeStyle = P.ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx, ty - 700 / z); ctx.lineTo(tx, ty - 750 / z); ctx.moveTo(tx, ty - 700 / z); ctx.lineTo(tx + 35 / z, ty - 690 / z); ctx.stroke();
    poly(ctx, [[tx - tw * 0.6, ty - 900 / z], [tx, ty - 1150 / z], [tx + tw * 0.6, ty - 900 / z]], dk('#5E5242')); }
  // right: two-storey shophouses with shutters and hanging signboards
  const R = 1500;
  for (let i = 0; i < 9; i++) { const z0 = 1 * Math.pow(1.38, i), z1 = z0 * 1.38, top = -560 - (i % 3) * 90;
    poly(ctx, [pv(VX, VY, R, 540, z0), pv(VX, VY, R, top, z0), pv(VX, VY, R, top, z1), pv(VX, VY, R, 540, z1)], dk(i % 2 ? '#8A7660' : '#7E6A54'));
    poly(ctx, [pv(VX, VY, R, top, z0), pv(VX, VY, R - 120, top - 20, z0), pv(VX, VY, R - 120, top - 20, z1), pv(VX, VY, R, top, z1)], dk('#3A3027'));
    const sh = clamp(o.shutters ?? 0), [ax, ay] = pv(VX, VY, R, 540, z0 + 0.06 * z0), [bx, by] = pv(VX, VY, R, 160, z1 - 0.06 * z0), [, by0] = pv(VX, VY, R, 540, z1 - 0.06 * z0);
    ctx.fillStyle = dk('#2A241D'); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax, pv(VX, VY, R, 160, z0 + 0.06 * z0)[1]); ctx.lineTo(bx, by); ctx.lineTo(bx, by0); ctx.closePath(); ctx.fill();
    if (sh > 0) { const op = clamp(sh * 2.2 - i * 0.12); ctx.save(); ctx.globalAlpha *= op; ctx.fillStyle = 'rgba(255,214,150,0.55)'; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax, pv(VX, VY, R, 160, z0 + 0.06 * z0)[1]); ctx.lineTo(bx, by); ctx.lineTo(bx, by0); ctx.closePath(); ctx.fill(); ctx.restore(); }
    else { ctx.strokeStyle = dk('rgba(110,90,66,0.6)'); ctx.lineWidth = 1.2; for (let k = 1; k < 6; k++) { const zz = lerp(z0 * 1.06, z1 * 0.96, k / 6); ctx.beginPath(); ctx.moveTo(...pv(VX, VY, R, 540, zz)); ctx.lineTo(...pv(VX, VY, R, 160, zz)); ctx.stroke(); } }
    const zs = z0 * 1.2, [sx, sy] = pv(VX, VY, R - 60, top + 120, zs), sw = 110 / zs, shh = 520 / zs; // signboard, faces the camera
    ctx.fillStyle = dk(i % 3 === 1 ? '#7A2A22' : '#2A241D'); ctx.fillRect(sx - sw, sy, sw, shh); ctx.strokeStyle = dk('#C8A04A'); ctx.lineWidth = Math.max(1, 4 / zs); ctx.strokeRect(sx - sw, sy, sw, shh);
    for (let k = 0; k < 3; k++) G.brushGlyph(ctx, sx - sw / 2, sy + shh * (0.2 + k * 0.3), sw * 0.62, 600 + i * 5 + k, dk('#E8D6A8'), 0.9); }
  // street lamps
  for (const z of [1.6, 3.1, 6]) { const [lx, ly] = pv(VX, VY, -980, 540, z), [, ly2] = pv(VX, VY, -980, -300, z); ctx.strokeStyle = dk('#2A241D'); ctx.lineWidth = Math.max(2, 14 / z); ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx, ly2); ctx.stroke();
    ctx.fillStyle = night > 0.3 ? '#FFD890' : dk('#3A3027'); ctx.beginPath(); ctx.arc(lx, ly2, 26 / z, 0, TAU); ctx.fill(); if (night > 0.3) sun(ctx, lx, ly2, 220 / z, rgba('#FFC870', 0.4 * night)); }
  // 1949: soldiers asleep along both pavements
  if (o.sleepers) { const sa = clamp(o.sleepers); const rr = rng(213);
    for (let z = 9; z >= 1.15; z /= 1.16) { const k = rr(); if (k > sa * 1.3) continue; const [x, y] = pv(VX, VY, -1250 + rr() * 200, 540, z); lyingSoldier(ctx, x, y, 420 / z, mixColor('#5E6266', '#3A3A3A', night), rr() < 0.5 ? 1 : -1);
      if (rr() < 0.6) { const [x2, y2] = pv(VX, VY, 1150 + rr() * 200, 540, z * 1.05); lyingSoldier(ctx, x2, y2, 420 / (z * 1.05), mixColor('#5E6266', '#3A3A3A', night), -1); } } }
  if (o.mist) for (let i = 0; i < 5; i++) puff(ctx, '#F2E6CC', VX - 500 + i * 260, VY + 40, 320, 0.25 * clamp(o.mist), 0.3);
}
// ---- JINGGANG MOUNTAINS: forested ridges in mist, bamboo, the hideout village on a terrace (ch1, ch2, ch12)
export function jinggang(ctx, t, o = {}) {
  const dusk = clamp(o.dusk ?? 0), night = clamp(o.night ?? 0);
  skyMix(ctx, t, 'day', { dusk, night });
  sun(ctx, 1450, 300, 420, rgba('#FFF0CC', 0.4 * (1 - night)));
  const c = (a, b) => mixColor(a, b, night);
  A.hills(ctx, 470, 190, 231, c('#B9B29A', '#2C2E36'));
  for (let i = 0; i < 7; i++) puff(ctx, night ? '#34343C' : '#F2EAD8', i * 320 + Math.sin(t * 0.1 + i) * 30, 500, 300, 0.5, 0.3);
  A.hills(ctx, 590, 230, 232, c('#8E8A72', '#22242A'));
  for (let i = 0; i < 6; i++) puff(ctx, night ? '#2E2E36' : '#EDE3CF', i * 380 + 80, 640, 260, 0.4, 0.3);
  A.hills(ctx, 720, 200, 233, c('#5E6048', '#16171A'), -300, W + 300);
  { const r = rng(234); for (let i = 0; i < 70; i++) { const x = r() * (W + 200) - 100, y = 650 + r() * 140; A.tree(ctx, x, y + 40, 26 + r() * 22, c('#3E4232', '#101210'), i); } }
  ground(ctx, 820, c('#6E6A4A', '#121210'), c('#3E3A28', '#080806'));
  A.paddies(ctx, 860, 930, c('#8C8A62', '#18181A'), c('rgba(60,58,40,0.5)', 'rgba(0,0,0,0.4)'), 4, 235);
  const hc = c('#3A3027', '#0E0C0A'), lit = dusk > 0.4 || night > 0.3;
  if (o.village !== false) { [[760, 850, 92], [930, 842, 80], [1090, 852, 100], [1260, 846, 84]].forEach(([x, y, s], i) => A.farmhouseCN(ctx, x, y, s, lit && i % 2 === 0, hc));
    if (o.flag) { const fa = clamp(o.flag), fx = 1180, wv = Math.sin(t * 3) * 6; ctx.strokeStyle = hc; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(fx, 846); ctx.lineTo(fx, 846 - 230 * fa); ctx.stroke();
      if (fa > 0.9) redFlag(ctx, fx, 616, 110, t); } }
  A.bamboo(ctx, 60, 1080, 1.4, 236, c('#2E3222', '#0A0B08')); A.bamboo(ctx, 1840, 1080, 1.5, 237, c('#2E3222', '#0A0B08'));
  if (o.path) { ctx.strokeStyle = c('rgba(200,186,150,0.6)', 'rgba(60,56,48,0.5)'); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(300, 1080); ctx.bezierCurveTo(500, 960, 700, 980, 820, 870); ctx.stroke(); }
}
// ---- JIANGXI: rice paddies, farm villages, low hills; o.hall = the Ruijin congress hall with red flags (ch3, ch4)
export function jiangxi(ctx, t, o = {}) {
  const dusk = clamp(o.dusk ?? 0), night = clamp(o.night ?? 0), c = (a, b) => mixColor(a, b, night);
  skyMix(ctx, t, 'day', { dusk, night });
  sun(ctx, 520, 320, 420, rgba('#FFF0CC', 0.4 * (1 - night)));
  A.clouds(ctx, t, 241, 170, night ? 'rgba(10,10,14,0.25)' : 'rgba(252,244,228,0.3)', 5, 5);
  A.hills(ctx, 560, 120, 242, c('#A89E80', '#26282E')); A.hills(ctx, 640, 80, 243, c('#7E7A5C', '#1A1B1E'));
  ground(ctx, 640, c('#8E8A62', '#141412'), c('#5E5A3C', '#0A0A08'));
  A.paddies(ctx, 660, H, c('#9EA078', '#1A1C1A'), c('rgba(70,66,44,0.5)', 'rgba(0,0,0,0.4)'), 9, 244);
  const hc = c('#3A3027', '#0E0C0A'), lit = dusk > 0.4 || night > 0.3;
  [[200, 660, 70], [330, 664, 60], [1540, 662, 76], [1690, 666, 64]].forEach(([x, y, s], i) => A.farmhouseCN(ctx, x, y, s, lit && i % 2, hc));
  for (const [x, y, s] of [[110, 700, 60], [1820, 700, 66], [1420, 690, 50]]) A.tree(ctx, x, y, s, c('#3E4232', '#101210'), x);
  if (o.hall) { const ha = clamp(o.hall); ctx.save(); ctx.globalAlpha *= ha; A.hallCN(ctx, 960, 690, 120, c('#4A3E30', '#14110D'), lit, 1, c('#3A2A20', '#100C0A'));
    for (const fx of [760, 1160]) { const wv = Math.sin(t * 3 + fx) * 6; ctx.strokeStyle = hc; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(fx, 690); ctx.lineTo(fx, 440); ctx.stroke(); redFlag(ctx, fx, 444, 140, t); }
    ctx.fillStyle = P.red; ctx.fillRect(820, 560, 280, 34); G.text(ctx, 'CHINESE SOVIET REPUBLIC · 1931', 960, 584, '600 17px Oswald', '#F6EFE0', 'center'); ctx.restore(); }
}
// ---- THE BLOCKHOUSE RING (1933–34): stone towers on every ridge, joined by new roads; ring 0..1 how many are built (ch4)
export function blockhouse(ctx, x, y, s, col) { ctx.fillStyle = col; ctx.fillRect(x - 0.3 * s, y - 0.9 * s, 0.6 * s, 0.9 * s); ctx.fillRect(x - 0.34 * s, y - 0.98 * s, 0.68 * s, 0.1 * s);
  for (let i = 0; i < 4; i++) ctx.fillRect(x - 0.34 * s + i * 0.2 * s, y - 1.08 * s, 0.1 * s, 0.1 * s); ctx.fillStyle = 'rgba(0,0,0,0.6)'; for (const yy of [0.35, 0.65]) for (const xx of [-0.14, 0.06]) ctx.fillRect(x + xx * s, y - yy * s, 0.08 * s, 0.035 * s); }
export function blockhouses(ctx, t, o = {}) {
  const dusk = clamp(o.dusk ?? 0.2), ring = clamp(o.ring ?? 1), c = '#4E4A42';
  skyMix(ctx, t, 'day', { dusk, fire: clamp(o.fire ?? 0) * 0.6 });
  A.clouds(ctx, t, 251, 170, 'rgba(80,70,60,0.18)', 5, 4);
  A.hills(ctx, 520, 140, 252, '#9C9278'); A.hills(ctx, 640, 150, 253, '#7A725C'); A.hills(ctx, 800, 120, 254, '#5E5844', -300, W + 300);
  ground(ctx, 850, '#6E6A4E', '#3A3826');
  const sites = [[140, 470, 44], [420, 450, 40], [700, 472, 46], [1010, 442, 40], [1300, 464, 44], [1600, 446, 40], [1830, 472, 42], [260, 610, 64], [620, 598, 70], [980, 616, 66], [1380, 604, 72], [1720, 610, 66], [420, 820, 120], [1180, 840, 130], [1640, 810, 110]];
  ctx.strokeStyle = 'rgba(220,206,170,0.55)'; ctx.lineWidth = 4; ctx.setLineDash([]); // the road that joins them
  ctx.beginPath(); sites.slice(0, 7).forEach(([x, y], i) => { const show = clamp(ring * sites.length - i) > 0; if (!show) return; i ? ctx.lineTo(x, y + 4) : ctx.moveTo(x, y + 4); }); ctx.stroke();
  ctx.beginPath(); sites.slice(7, 12).forEach(([x, y], i) => { const show = clamp(ring * sites.length - (7 + i)) > 0; if (!show) return; i ? ctx.lineTo(x, y + 4) : ctx.moveTo(x, y + 4); }); ctx.stroke();
  sites.forEach(([x, y, s], i) => { const u = clamp(ring * sites.length - i); if (u <= 0) return; ctx.save(); ctx.globalAlpha *= u; blockhouse(ctx, x, y + (1 - backOutS(u)) * 20, s, mixColor('#8A8270', c, y / 800));
    if (o.flags !== false && i % 3 === 0) { ctx.strokeStyle = P.ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - s * 1.05); ctx.lineTo(x, y - s * 1.7); ctx.stroke(); ctx.fillStyle = P.blue; ctx.fillRect(x, y - s * 1.7, s * 0.5, s * 0.32); ctx.fillStyle = '#EDE3CF'; ctx.beginPath(); ctx.arc(x + s * 0.25, y - s * 1.54, s * 0.08, 0, TAU); ctx.fill(); }
    ctx.restore(); });
  if (o.smoke) for (let i = 0; i < 2; i++) A.smoke(ctx, 500 + i * 900, 760, t, 1.0, 255 + i, 'rgba(50,46,42,0.18)');
}
function backOutS(u) { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); }
// ---- RIVER CROSSING: steep banks, a ferry crossing (Xiang 1934, Chishui 1935); o.wide = the Yangtze, April 1949 (ch5, ch11)
export function riverX(ctx, t, o = {}) {
  const dusk = clamp(o.dusk ?? 0), night = clamp(o.night ?? 0), fire = clamp(o.fire ?? 0), wide = clamp(o.wide ?? 0), c = (a, b) => mixColor(a, b, night);
  skyMix(ctx, t, 'day', { dusk, night, fire: fire * 0.8 });
  A.clouds(ctx, t, 261, 180, night ? 'rgba(10,10,14,0.25)' : 'rgba(252,244,228,0.3)', 5, 6);
  const fy = lerp(560, 600, wide); // far bank line
  A.hills(ctx, fy - 30, lerp(180, 50, wide), 262, c('#9A8E70', '#24262C'));
  if (wide > 0.5) { const cc = c('#5E5040', '#18140F'); A.cnWall(ctx, 980, 1640, fy + 4, 40, cc); A.pagoda(ctx, 1520, fy - 30, 26, cc, 7); }
  ctx.fillStyle = c('#9AA49C', '#1C2228'); ctx.fillRect(-W, fy, W * 3, H); // water
  ctx.strokeStyle = night ? 'rgba(220,160,80,0.15)' : 'rgba(255,255,255,0.22)'; ctx.lineWidth = 2; for (let i = 0; i < 14; i++) { const y = fy + 20 + i * 30; ctx.setLineDash([70 + i * 6, 220]); ctx.lineDashOffset = -(t * (24 + i * 2) + i * 97) % 400; ctx.beginPath(); ctx.moveTo(-50, y); ctx.lineTo(W + 50, y); ctx.stroke(); } ctx.setLineDash([]);
  if (wide < 0.5) { poly(ctx, [[-50, 520], [520, 560], [700, 700], [560, H + 10], [-50, H + 10]], c('#6E5E46', '#121110')); poly(ctx, [[W + 50, 470], [1420, 540], [1300, 640], [1460, H + 10], [W + 50, H + 10]], c('#5A4C38', '#0E0D0C'));
    A.tree(ctx, 160, 560, 70, c('#3E4232', '#0A0B08'), 3); A.tree(ctx, 1780, 520, 80, c('#3E4232', '#0A0B08'), 4); }
  else { ground(ctx, 1000, c('#6E5E46', '#121110'), c('#4A3E2E', '#080706')); }
  const n = o.boats ?? 0; for (let i = 0; i < n; i++) { const r = rng(264 + i), d = r(), x = lerp(500, 1400, r()) + ((o.cross ?? 0) * 200 * (d - 0.5)), y = lerp(fy + 60, 980, d), s = 20 + d * 46;
    A.junk(ctx, x, y, s, t, c('#3A3027', '#100C09'), c('#8A6B47', '#2A2018'), P.red); }
  if (fire) { A.smoke(ctx, 1400, 500, t, 2, 265, 'rgba(36,26,22,0.4)'); A.smoke(ctx, 600, 520, t, 1.6, 266, 'rgba(36,26,22,0.35)'); for (let i = 0; i < 6; i++) { const ph = (t * 0.7 + i * 0.37) % 1; if (ph < 0.15) puff(ctx, '#FFE2A0', 300 + i * 260, fy + 80 + (i % 3) * 120, 40, (1 - ph / 0.15) * fire, 0.6); } }
}
// ---- LUDING BRIDGE: thirteen iron chains over the Dadu gorge, bridgehead halls (ch6). planks = deck left on the far third; fire on the far end
export function luding(ctx, t, o = {}) {
  const dusk = clamp(o.dusk ?? 0.2), fire = clamp(o.fire ?? 0);
  skyMix(ctx, t, 'day', { dusk, fire: fire * 0.5 });
  A.hills(ctx, 360, 260, 271, '#A8A08A'); for (let i = 0; i < 5; i++) puff(ctx, '#EFE6D2', i * 420, 380, 260, 0.4, 0.3);
  A.hills(ctx, 470, 240, 272, '#7E7660');
  // far gorge walls, then the near cliffs falling in a V to the torrent
  poly(ctx, [[-50, 520], [700, 560], [860, 760], [960, 820], [1060, 760], [1240, 560], [W + 50, 520], [W + 50, H + 10], [-50, H + 10]], '#5E5646');
  { const r = rng(275); ctx.strokeStyle = 'rgba(30,26,20,0.25)'; ctx.lineWidth = 2; for (let i = 0; i < 40; i++) { const x = 600 + r() * 720, y = 560 + r() * 260; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (r() - 0.5) * 30, y + 40 + r() * 60); ctx.stroke(); } }
  const tor = ctx.createLinearGradient(0, 800, 0, H); tor.addColorStop(0, '#8A968E'); tor.addColorStop(1, '#5E6A62');
  poly(ctx, [[560, 860], [1360, 860], [1440, H + 10], [480, H + 10]], tor);
  ctx.strokeStyle = 'rgba(245,240,230,0.65)'; ctx.lineWidth = 3; for (let i = 0; i < 30; i++) { const y = 880 + (i % 8) * 26, x0 = 560 + ((i * 173 + t * 320) % 860); ctx.beginPath(); ctx.moveTo(x0, y); ctx.quadraticCurveTo(x0 + 26, y - 9, x0 + 60, y); ctx.stroke(); }
  poly(ctx, [[-50, 400], [300, 430], [330, 520], [420, 640], [470, 760], [600, 880], [560, H + 10], [-50, H + 10]], '#4A4234');
  poly(ctx, [[W + 50, 390], [1620, 430], [1590, 520], [1500, 650], [1450, 770], [1330, 880], [1380, H + 10], [W + 50, H + 10]], '#40382C');
  ctx.strokeStyle = 'rgba(20,16,12,0.35)'; ctx.lineWidth = 3; for (const [x, y, d] of [[120, 520, 1], [260, 700, 1], [380, 860, 1], [1780, 520, -1], [1650, 690, -1], [1520, 860, -1]]) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d * 90, y + 60); ctx.lineTo(x + d * 60, y + 140); ctx.stroke(); }
  // bridgehead halls
  A.hallCN(ctx, 230, 470, 70, '#3A3027'); A.hallCN(ctx, 1690, 470, 70, fire ? mixColor('#3A3027', '#5A1A10', fire) : '#3A3027');
  const x0 = 290, x1 = 1630, y0 = 455, sag = 110, cy = (x) => { const u = (x - x0) / (x1 - x0); return y0 + sag * 4 * u * (1 - u); };
  const planks = clamp(o.planks ?? 1), pStart = lerp(x1, x0, planks);
  // deck planks (only from pStart to the far bank)
  for (let x = pStart; x < x1; x += 9) { ctx.fillStyle = '#5A4632'; ctx.fillRect(x, cy(x) - 2, 7, 8); }
  // 9 floor chains (seen as a band) + 2 handrail chains each side
  ctx.strokeStyle = '#1E1A15'; for (let k = 0; k < 9; k++) { ctx.lineWidth = 2; ctx.beginPath(); for (let x = x0; x <= x1; x += 20) { const y = cy(x) + k * 1.2; x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
  for (const dy of [-46, -58]) { ctx.lineWidth = 3; ctx.beginPath(); for (let x = x0; x <= x1; x += 20) { const y = cy(x) + dy + 10 * Math.sin((x - x0) / (x1 - x0) * Math.PI) * 0.2; x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
  ctx.lineWidth = 1.2; for (let x = x0 + 40; x < x1; x += 40) { ctx.beginPath(); ctx.moveTo(x, cy(x) - 58); ctx.lineTo(x, cy(x)); ctx.stroke(); }
  if (fire) { A.flames(ctx, 1640, 470, 180, 160 * fire, t, 273, 8); A.smoke(ctx, 1700, 360, t, 1.4, 274, 'rgba(40,30,24,0.4)'); }
}
export const LUDING = { x0: 290, x1: 1630, y0: 455, sag: 110, y: (x) => { const u = (x - 290) / 1340; return 455 + 110 * 4 * u * (1 - u); } };
// ---- SNOW MOUNTAINS / GRASSLANDS (ch6): mode 'snow' (white peaks, blizzard) or 'grass' (swamp, tussocks, fog)
export function snowGrass(ctx, t, o = {}) {
  const mode = o.mode ?? 'snow';
  if (mode === 'snow') { A.sky(ctx, 'storm', t); ctx.fillStyle = 'rgba(220,226,230,0.35)'; ctx.fillRect(0, 0, W, H);
    const r = rng(281); for (let i = 0; i < 6; i++) { const x = -100 + i * 400 + r() * 120, h = 380 + r() * 260, y = 700; poly(ctx, [[x - 360, y], [x, y - h], [x + 360, y]], '#8E949A'); poly(ctx, [[x - 120, y - h * 0.66], [x, y - h], [x + 120, y - h * 0.66], [x + 40, y - h * 0.6], [x - 20, y - h * 0.7], [x - 60, y - h * 0.6]], '#F4F6F6'); }
    ctx.fillStyle = '#E8ECEE'; ctx.beginPath(); ctx.moveTo(-50, 760); ctx.quadraticCurveTo(600, 560, 1100, 680); ctx.quadraticCurveTo(1500, 760, W + 50, 640); ctx.lineTo(W + 50, H + 10); ctx.lineTo(-50, H + 10); ctx.fill();
    ctx.strokeStyle = 'rgba(150,160,170,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(200, H); ctx.quadraticCurveTo(700, 820, 1100, 690); ctx.stroke(); // the trail
    const b = clamp(o.blizzard ?? 0.6); ctx.fillStyle = 'rgba(255,255,255,0.85)'; const rb = rng(282); for (let i = 0; i < 260 * b; i++) { const x = (rb() * W + t * (260 + rb() * 200)) % (W + 40) - 20, y = (rb() * H + t * (60 + rb() * 60)) % H; ctx.fillRect(x, y, 3, 3); }
  } else {
    A.sky(ctx, 'storm', t); ctx.fillStyle = 'rgba(200,196,170,0.35)'; ctx.fillRect(0, 0, W, H);
    A.hills(ctx, 560, 30, 283, '#8A8A74'); ground(ctx, 560, '#7A7A56', '#4E4E36');
    const r = rng(284); for (let i = 0; i < 22; i++) { const x = r() * W, y = 600 + r() * 460, w = 60 + r() * 220 * (y / 700); ctx.fillStyle = 'rgba(150,160,150,0.55)'; ctx.beginPath(); ctx.ellipse(x, y, w, w * 0.12, 0, 0, TAU); ctx.fill(); }
    for (let i = 0; i < 260; i++) { const x = r() * W, y = 580 + r() * 500, s = 4 + (y - 560) * 0.03; ctx.strokeStyle = '#4A4A30'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x - s * 0.3, y - s * 1.6); ctx.moveTo(x, y); ctx.lineTo(x, y - s * 2); ctx.moveTo(x + s, y); ctx.lineTo(x + s * 0.4, y - s * 1.5); ctx.stroke(); }
    for (let i = 0; i < 6; i++) puff(ctx, '#E8E4D2', i * 360 + Math.sin(t * 0.2 + i) * 40, 640, 300, 0.35 * clamp(o.fog ?? 0.8), 0.3);
  }
}
// ---- YAN'AN: yellow loess hills, cave homes cut into the cliff, the pagoda on the hill (ch7–ch10)
export function yanan(ctx, t, o = {}) {
  const dusk = clamp(o.dusk ?? 0), night = clamp(o.night ?? 0), c = (a, b) => mixColor(a, b, night);
  skyMix(ctx, t, 'day', { dusk, night });
  sun(ctx, 1500, 300, 440, rgba('#FFF0CC', 0.45 * (1 - night)));
  A.clouds(ctx, t, 291, 170, night ? 'rgba(10,10,14,0.25)' : 'rgba(252,244,228,0.3)', 4, 4);
  A.hills(ctx, 500, 110, 292, c('#D2BC8C', '#2E2C30'));
  A.pagoda(ctx, 1500, 420, 30, c('#6E5A42', '#141210'), 9);
  A.hills(ctx, 600, 120, 293, c('#C2A672', '#24221F')); ctx.strokeStyle = c('rgba(120,96,60,0.35)', 'rgba(0,0,0,0.3)'); ctx.lineWidth = 2; for (let y = 520; y < 640; y += 16) { ctx.beginPath(); ctx.moveTo(-50, y + Math.sin(y) * 6); ctx.lineTo(W + 50, y + Math.sin(y * 1.7) * 6); ctx.stroke(); }
  // the cliff with cave homes
  poly(ctx, [[-50, 560], [W + 50, 580], [W + 50, 900], [-50, 900]], c('#B89A64', '#1E1C1A'));
  ctx.strokeStyle = c('rgba(110,86,52,0.4)', 'rgba(0,0,0,0.35)'); ctx.lineWidth = 2; for (let y = 600; y < 900; y += 22) { ctx.beginPath(); ctx.moveTo(-50, y); ctx.lineTo(W + 50, y + 8); ctx.stroke(); }
  const lit = dusk > 0.4 || night > 0.3;
  for (let i = 0; i < 7; i++) { const x = 170 + i * 260, y = 880, w = 150, h = 190; ctx.fillStyle = c('#8E7448', '#151311'); ctx.fillRect(x - w / 2 - 14, y - h - 10, w + 28, h + 10);
    ctx.fillStyle = c('#3A3027', '#0A0908'); ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2, y - h * 0.62); ctx.arc(x, y - h * 0.62, w / 2, Math.PI, TAU); ctx.lineTo(x + w / 2, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = lit && i % 2 === 0 ? 'rgba(255,200,120,0.85)' : c('#D8C8A0', '#2A2620'); ctx.beginPath(); ctx.moveTo(x - w / 2 + 12, y - h * 0.5); ctx.arc(x, y - h * 0.62, w / 2 - 12, Math.PI, TAU); ctx.lineTo(x + w / 2 - 12, y - h * 0.5); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = c('#3A3027', '#0A0908'); ctx.lineWidth = 3; for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(x + k * 22, y - h * 0.5); ctx.lineTo(x + k * 22, y - h * 0.62 - Math.sqrt(Math.max(0, (w / 2 - 12) ** 2 - (k * 22) ** 2))); ctx.stroke(); }
    ctx.fillStyle = c('#2A241D', '#060505'); ctx.fillRect(x - 24, y - h * 0.48, 48, h * 0.48); }
  ground(ctx, 880, c('#A88A58', '#141210'), c('#6E5636', '#080706'));
  if (o.lamps && lit) for (let i = 0; i < 7; i += 2) sun(ctx, 170 + i * 260, 760, 160, rgba('#FFC870', 0.35));
}
// ---- XI'AN: the hillside behind the hot-spring pavilions at dawn, frost and rocks (ch7, 12 Dec 1936)
export function xian(ctx, t, o = {}) {
  const dawn = clamp(o.dawn ?? 0.6), night = clamp(o.night ?? 0.3), c = (a, b) => mixColor(a, b, night);
  skyMix(ctx, t, 'day', { dusk: dawn, night });
  sun(ctx, 300, 640, 500, rgba('#FFD8A0', 0.4 * dawn));
  A.hills(ctx, 360, 260, 301, c('#8E8676', '#24242A')); // Mount Li
  poly(ctx, [[-50, 300], [500, 340], [900, 520], [1300, 640], [W + 50, 700], [W + 50, H + 10], [-50, H + 10]], c('#6E6656', '#18181A'));
  const r = rng(302); for (let i = 0; i < 16; i++) { const x = r() * W * 0.75, y = 460 + r() * 560, s = 26 + (y - 400) * 0.16; const pts = []; for (let k = 0; k < 7; k++) { const a = Math.PI + k / 6 * Math.PI; pts.push([x + Math.cos(a) * s * (1.1 + r() * 0.4), y + Math.sin(a) * s * (0.6 + r() * 0.5)]); }
    poly(ctx, pts, c('#4E483C', '#121214')); ctx.strokeStyle = 'rgba(232,236,240,0.45)'; ctx.lineWidth = 3; ctx.beginPath(); pts.slice(1, 6).forEach(([px, py], k) => k ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.stroke(); } // frosted rocks
  const hc = c('#3A3027', '#0C0B0A'); A.hallCN(ctx, 1560, 860, 90, hc, true); A.hallCN(ctx, 1760, 880, 70, hc, false); A.cnWall(ctx, 1380, W + 50, 950, 40, hc);
  ground(ctx, 960, c('#5A5244', '#101010'), c('#3A3428', '#060606'));
  if (o.torches) { const ta = clamp(o.torches); for (let i = 0; i < 9; i++) { const x = 1100 + i * 90 + Math.sin(t + i) * 10, y = 900 - i * 34; ctx.save(); ctx.globalAlpha *= ta; A.flames(ctx, x, y, 16, 34, t, 303 + i, 3); sun(ctx, x, y - 10, 90, rgba('#FFB060', 0.3)); ctx.restore(); } }
}
// ---- NORTH CHINA: the Great Wall on the ridges, a railway in the valley (ch8, ch9). train 0..1 position, blast, burn (Three Alls, crimson)
export function northChina(ctx, t, o = {}) {
  const dusk = clamp(o.dusk ?? 0), night = clamp(o.night ?? 0), burn = clamp(o.burn ?? 0), c = (a, b) => mixColor(mixColor(a, b, night), '#3A120C', burn * 0.5);
  skyMix(ctx, t, 'day', { dusk, night, fire: burn });
  A.clouds(ctx, t, 311, 160, 'rgba(80,70,60,0.18)', 5, 5);
  A.hills(ctx, 440, 200, 312, c('#A49A80', '#26262C'));
  // the Great Wall following a ridge
  const ridge = (x) => 420 + Math.sin(x / 210) * 60 + Math.sin(x / 90) * 18; ctx.strokeStyle = c('#6E6252', '#141312'); ctx.lineWidth = 12; ctx.beginPath(); for (let x = -50; x <= W + 50; x += 12) { const y = ridge(x); x === -50 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
  for (let x = 60; x < W; x += 300) { const y = ridge(x); ctx.fillStyle = c('#5E5242', '#121110'); ctx.fillRect(x - 22, y - 46, 44, 46); for (let k = 0; k < 3; k++) ctx.fillRect(x - 22 + k * 17, y - 54, 10, 8); }
  A.hills(ctx, 600, 160, 313, c('#857A60', '#1C1C20')); A.hills(ctx, 700, 90, 314, c('#6A6048', '#141416'));
  ground(ctx, 720, c('#7A6E50', '#121210'), c('#4E4632', '#080806'));
  // railway embankment
  ctx.fillStyle = c('#5A4E3C', '#0E0E0E'); ctx.fillRect(-50, 800, W + 100, 26); ctx.strokeStyle = c('#2A241D', '#000'); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-50, 800); ctx.lineTo(W + 50, 800); ctx.stroke(); for (let x = -40; x < W + 50; x += 26) { ctx.fillStyle = c('#3A3027', '#050505'); ctx.fillRect(x, 802, 14, 6); }
  if (o.village) { const hc = c('#3A3027', '#0E0C0A'); [[1300, 760, 70], [1440, 754, 60], [1580, 762, 74]].forEach(([x, y, s]) => A.farmhouseCN(ctx, x, y, s, false, hc)); if (burn) { A.flames(ctx, 1440, 760, 420, 200 * burn, t, 315, 10); A.smoke(ctx, 1440, 600, t, 2.2, 316, 'rgba(30,20,16,0.45)'); } }
  if (o.train != null) { const x = lerp(-700, W + 200, o.train); trainCN(ctx, x, 800, 1, c('#2A2622', '#0A0A0A')); A.smoke(ctx, x + 500, 690, t, 0.6, 317, 'rgba(60,56,50,0.3)'); }
  if (o.blast) { const b = clamp(o.blast); puff(ctx, '#FFB050', o.blastX ?? 960, 790, 60 + b * 260, (1 - b) * 0.95, 0.6); puff(ctx, '#FFF0C0', o.blastX ?? 960, 790, 30 + b * 120, (1 - b) * 0.9, 0.6); A.smoke(ctx, o.blastX ?? 960, 700, t, 1 + b * 2, 318, `rgba(40,34,30,${0.5 * (1 - b * 0.5)})`); }
}
export function trainCN(ctx, x, y, s, col) { ctx.fillStyle = col; // locomotive faces right, wagons trail left
  ctx.fillRect(x + 380 * s, y - 90 * s, 160 * s, 74 * s); ctx.fillRect(x + 440 * s, y - 130 * s, 70 * s, 50 * s); ctx.fillRect(x + 500 * s, y - 120 * s, 24 * s, 40 * s);
  for (let i = 0; i < 4; i++) ctx.fillRect(x + i * 95 * s, y - 80 * s, 88 * s, 62 * s); for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.arc(x + 14 * s + i * 45 * s, y - 14 * s, 13 * s, 0, TAU); ctx.fill(); } }
// ---- TIANANMEN, 1 October 1949: the gate, red flags and crowds; no monument yet (ch11)
export function tiananmen49(ctx, t, o = {}) {
  skyMix(ctx, t, 'day', { dusk: o.dusk ?? 0.1 });
  A.clouds(ctx, t, 151, 170, 'rgba(252,244,228,0.32)', 5, 5);
  ctx.fillStyle = '#7A3A2C'; ctx.fillRect(-50, 560, W + 100, 190); // the long red wall either side
  A.tiananmenGate(ctx, 960, 750, 118, '#8A3A2C'); ctx.fillStyle = '#3A2A20'; ctx.fillRect(960 - 1.6 * 118 * 1.25, 750 - 118 * 1.0 - 18, 1.6 * 118 * 2.5, 18);
  for (let i = 0; i < 8; i++) { const lx = 960 - 300 + i * 86; ctx.fillStyle = P.red; ctx.beginPath(); ctx.ellipse(lx, 548, 18, 22, 0, 0, TAU); ctx.fill(); ctx.fillStyle = P.gold2; ctx.fillRect(lx - 4, 568, 8, 10); } // lanterns
  ground(ctx, 750, '#B8A786', '#7E6A4A');
  ctx.strokeStyle = 'rgba(70,56,36,0.3)'; ctx.lineWidth = 2; for (let i = -20; i <= 20; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * 50, 750); ctx.lineTo(W / 2 + i * 260, 1080); ctx.stroke(); }
  for (let i = 0; i < 6; i++) { const fx = i < 3 ? 120 + i * 170 : 1340 + (i - 3) * 170; ctx.strokeStyle = '#2A241D'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(fx, 900); ctx.lineTo(fx, 640); ctx.stroke(); prcFlag(ctx, fx, 642, 110, t); }
  A.crowd(ctx, { x0: -40, x1: W + 40, y: 900, n: 170, hMin: 50, hMax: 130, depth: 190, seed: 319, t, red: clamp(o.red ?? 0.5), tools: false });
}
// ---- MAPS: China 1927–49 with the country border; and the world (ch12)
export const SOVIET = [[26.9, 115.4], [27.0, 116.5], [26.2, 116.9], [25.3, 116.6], [25.1, 115.7], [25.6, 114.9], [26.4, 114.9]];
export const JP_HELD = [[45.5, 123.0], [48.5, 127.0], [47.5, 132.5], [43.0, 131.0], [40.0, 124.5], [38.8, 121.5], [37.5, 122.5], [35.0, 119.5], [32.0, 121.8], [30.0, 122.0], [28.0, 121.0], [30.0, 119.0], [30.5, 114.3], [32.5, 114.0], [34.7, 113.6], [36.5, 113.5], [38.0, 112.6], [40.0, 113.3], [41.5, 116.0], [42.5, 119.5]];
export const LONG_MARCH = [[25.88, 116.03], [25.95, 115.41], [25.4, 113.0], [25.93, 111.07], [26.23, 109.14], [27.72, 106.93], [28.59, 105.7], [27.4, 105.3], [26.2, 102.6], [29.91, 102.23], [30.85, 102.7], [31.9, 102.2], [32.64, 103.6], [34.2, 103.9], [35.5, 105.8], [36.93, 108.17]];
export function cnBorders(ctx, view, keys, o = {}) { const B = G.MAPS.borders; for (const k of keys) for (const ring of (B[k] || [])) { ctx.beginPath(); ring.forEach(([lon, lat], i) => { const [x, y] = G.proj(view, lat, lon); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath();
  if (o.fill) { ctx.fillStyle = typeof o.fill === 'string' ? o.fill : rgba(P.red, 0.3); ctx.fill(); } ctx.strokeStyle = o.color ?? 'rgba(42,36,29,0.75)'; ctx.lineWidth = o.width ?? 2.5; ctx.setLineDash(o.dash ?? [10, 7]); ctx.stroke(); ctx.setLineDash([]); } }
export function cnMap(ctx, t, o = {}) {
  const view = o.view ?? { lon: 112, lat: 33.5, span: 40 };
  G.drawMap(ctx, 'eastasia', view, { rivers: ['cn_Yangtze', 'cn_Huang', 'cn_Xiang', 'cn_Gan', 'cn_Pearl', 'cn_Han', 'cn_Min'], riverW: o.riverW ?? 3.5 });
  cnBorders(ctx, view, ['CHN', 'TWN']);
  if (o.soviet) G.fillRegion(ctx, 'eastasia', view, SOVIET, P.red, 0.45 * clamp(o.soviet));
  if (o.japan) G.fillRegion(ctx, 'eastasia', view, JP_HELD, '#2A241D', 0.35 * clamp(o.japan));
  if (o.march != null) G.route(ctx, view, LONG_MARCH, clamp(o.march), { color: P.red, w: 7 });
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.35; parchment(ctx, t); ctx.restore();
  for (const p of (o.labels ?? [])) G.mapLabel(ctx, view, p, 1, { t, size: 28, color: p === (o.hi ?? '') ? P.red : P.ink });
  if (o.cartouche !== false) G.text(ctx, o.cartouche ?? 'China · 1927–1949', 90, 1030, 'italic 400 30px FellItalic', P.ink3, 'left', 0.8);
}
export function worldMap(ctx, t, o = {}) {
  const view = o.view ?? { lon: 20, lat: 12, span: 290 };
  G.drawMap(ctx, 'world', view, {});
  cnBorders(ctx, view, ['CHN'], { fill: rgba(P.red, 0.5 * clamp(o.china ?? 1)), dash: [], width: 1.5 });
  for (const [k, u] of Object.entries(o.hi ?? {})) if (u > 0) cnBorders(ctx, view, [k], { fill: rgba(P.red, 0.75 * clamp(u)), dash: [], width: 2, color: P.red });
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.35; parchment(ctx, t); ctx.restore();
  for (const p of (o.labels ?? [])) G.mapLabel(ctx, view, p, 1, { t, size: 30, color: P.red, box: true });
}
