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
  A.obelisk(ctx, 1300, 930, 112, '#4E453A');
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
