// Graphic templates: slams, script names, date-line bar, fuse, tally stick, medallions, cards, counters, maps.
import fs from 'fs';
import { P, W, H, clamp, lerp, easeOut, easeIO, backOut, ramp, life, rng, mixColor, rgba, T } from './core.mjs';
import { bust, CH, flames } from './art.mjs';
import { loadImage } from '@napi-rs/canvas';
// real period portraits (public domain, Wikimedia Commons), sepia, face-cropped: used in medallions where one exists
export const PORTRAIT = {};
for (const k of ['hong', 'zengF', 'zengQ', 'gordon', 'ward', 'liangFa', 'emperor', 'sun', 'mao']) { const f = `/home/claude/project/portraits/proc/${k}.png`; if (fs.existsSync(f)) PORTRAIT[k] = await loadImage(fs.readFileSync(f)); }

const TAU = Math.PI * 2;

// ---- text helpers
export function text(ctx, s, x, y, font, color, align = 'center', alpha = 1, shadow = null) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  if (shadow) { ctx.shadowColor = shadow; ctx.shadowBlur = 18; ctx.shadowOffsetY = 3; }
  ctx.fillText(s, x, y); ctx.restore();
}
function spaced(ctx, s, x, y, font, color, track, align = 'left', alpha = 1) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.font = font; ctx.fillStyle = color; ctx.textBaseline = 'alphabetic';
  const ws = [...s].map(c => ctx.measureText(c).width); const total = ws.reduce((a, b) => a + b, 0) + track * (s.length - 1);
  let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  [...s].forEach((c, i) => { ctx.fillText(c, cx, y); cx += ws[i] + track; }); ctx.restore(); return total;
}

// ---- SLAM: stacked heavy serif caps. lines = [{t:'WORD', red:true, small:false}] ; at = appear time, out = disappear time
// mode 'light' (cream text with shadow, for dark/busy plates) or 'ink' (dark text on parchment)
export function slam(ctx, t, lines, at, out, o = {}) {
  const a = life(t, at, out, 0.12, 0.3); if (a <= 0) return;
  const pop = 1 + 0.12 * (1 - easeOut((t - at) / 0.24));
  const cx = o.x ?? W / 2, cy = o.y ?? H / 2, size = o.size ?? 150, gap = o.gap ?? 0.98;
  const light = (o.mode ?? 'light') === 'light';
  const fills = lines.map(l => l.small ? size * 0.42 : (l.size ?? size));
  const total = fills.reduce((s, f) => s + f * gap, 0);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy); ctx.scale(pop, pop);
  let y = -total / 2;
  lines.forEach((l, i) => {
    const fs_ = fills[i]; y += fs_ * gap;
    const font = l.small ? `italic 500 ${fs_}px BodoniItalic` : `900 ${fs_}px Bodoni`;
    const col = l.red ? (light ? '#D2412F' : P.red) : l.gold ? P.gold2 : (light ? '#F6EFE0' : P.ink);
    ctx.font = font; ctx.textAlign = 'center';
    if (light) { ctx.shadowColor = 'rgba(10,6,2,0.75)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 4; }
    ctx.fillStyle = col; ctx.fillText(l.small ? l.t : l.t.toUpperCase(), 0, y - fs_ * 0.18);
  });
  ctx.restore();
}

// ---- giant script place/name + small role line
export function scriptName(ctx, t, name, at, out, o = {}) {
  const a = life(t, at, out, 0.5, 0.45); if (a <= 0) return;
  const x = o.x ?? W / 2, y = o.y ?? H * 0.5, size = o.size ?? 150;
  const light = (o.mode ?? 'light') === 'light';
  ctx.save(); ctx.globalAlpha *= a * (o.alpha ?? 0.92);
  const drift = (t - at) * 6;
  text(ctx, name, x + drift, y, `${size}px Pinyon`, light ? '#F6EFE0' : P.ink, o.align ?? 'center', 1, light ? 'rgba(10,6,2,0.65)' : null);
  if (o.role) spaced(ctx, o.role.toUpperCase(), x + drift, y + size * 0.42, `500 ${size * 0.17}px Oswald`, light ? '#EBDFC6' : P.ink3, size * 0.03, o.align ?? 'center');
  ctx.restore();
}

// ---- DATE-LINE BAR: thin line, italic event name above, small day+month left of a big odometer year
export function dateLine(ctx, t, o) {
  const at = o.at, out = o.out ?? at + 4.2; const a = life(t, at, out, 0.35, 0.45); if (a <= 0) return;
  const y = o.y ?? H * 0.82, light = (o.mode ?? 'light') === 'light';
  const ink = light ? '#F3EAD6' : P.ink, sub = light ? '#E6D9BE' : P.ink3;
  ctx.save(); ctx.globalAlpha *= a;
  if (light) { ctx.shadowColor = 'rgba(10,6,2,0.6)'; ctx.shadowBlur = 14; }
  const grow = easeOut((t - at) / 0.7);
  const ex = o.x ?? W * 0.16, lx0 = ex - 110;
  ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx0, y); ctx.lineTo(lx0 + (W * 0.93 - lx0) * grow, y); ctx.stroke();
  text(ctx, o.event, ex, y - 18, `italic 400 46px BodoniItalic`, ink, 'left', clamp((t - at - 0.15) / 0.4));
  if (o.day) text(ctx, o.day, ex, y + 44, `400 24px Oswald`, sub, 'left', clamp((t - at - 0.3) / 0.4));
  // odometer year
  const year = String(o.year), from = String(o.from ?? (o.year - 4)); const roll = easeIO((t - at - 0.2) / (o.rollDur ?? 1.2));
  ctx.font = `600 92px Bodoni`; ctx.textBaseline = 'alphabetic'; let x = ex + (o.day ? 150 : 0);
  ctx.save(); ctx.beginPath(); ctx.rect(x - 10, y + 6, 420, 100); ctx.clip();
  for (let i = 0; i < year.length; i++) {
    const d1 = +year[i], d0 = +(from[i] ?? year[i]); const steps = (d1 - d0 + 10) % 10; const pos = d0 + steps * roll;
    const w = ctx.measureText('0').width; for (let k = -1; k <= 1; k++) { const dv = (Math.floor(pos) + k + 10) % 10, off = (k - (pos - Math.floor(pos))) * 96;
      ctx.fillStyle = ink; ctx.globalAlpha = a * clamp(1 - Math.abs(off) / 96); ctx.fillText(String(dv), x, y + 92 + off); }
    x += w + 2;
  }
  ctx.restore();
  if (o.suffix) { ctx.fillStyle = ink; ctx.globalAlpha = a; ctx.fillText(o.suffix, x, y + 92); }
  ctx.restore();
}

// ---- FUSE (signature device): burning cord along the top edge, shown at chapter starts
export function fuse(ctx, t, at, frac0, frac1, o = {}) {
  const dur = o.dur ?? 4.2; const a = life(t, at, at + dur, 0.4, 0.6); if (a <= 0) return;
  const frac = lerp(frac0, frac1, easeIO((t - at - 0.3) / (dur - 1.2)));
  const y = 34, x0 = 60, x1 = W - 60, xb = lerp(x1, x0, frac); // burns from right to left
  ctx.save(); ctx.globalAlpha *= a;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(30,24,18,0.55)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(xb, y); ctx.lineTo(x1, y); ctx.stroke(); // ash
  ctx.strokeStyle = '#B79A6A'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(xb, y); ctx.stroke();
  ctx.strokeStyle = '#8C7148'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 7]); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(xb, y); ctx.stroke(); ctx.setLineDash([]);
  const g = ctx.createRadialGradient(xb, y, 0, xb, y, 40); g.addColorStop(0, 'rgba(255,214,120,0.95)'); g.addColorStop(0.3, 'rgba(240,140,50,0.6)'); g.addColorStop(1, 'rgba(240,120,40,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(xb, y, 40, 0, TAU); ctx.fill();
  const r = rng(Math.floor(t * 25)); ctx.fillStyle = '#FFE2A0';
  for (let i = 0; i < 9; i++) { const ang = r() * TAU, d = r() * 26; ctx.globalAlpha = a * r(); ctx.beginPath(); ctx.arc(xb + Math.cos(ang) * d, y + Math.sin(ang) * d * 0.6 - r() * 8, 1.5 + r() * 2, 0, TAU); ctx.fill(); }
  ctx.globalAlpha = a;
  if (o.label) spaced(ctx, o.label.toUpperCase(), x0, y + 46, `500 26px Oswald`, o.light ? '#F0E6D0' : P.ink2, 5, 'left', clamp((t - at - 0.4) / 0.5));
  if (o.num) text(ctx, o.num, x0, y + 84, `italic 400 22px BodoniItalic`, o.light ? '#E0D3B8' : P.ink3, 'left', clamp((t - at - 0.6) / 0.5));
  ctx.restore();
}

// ---- TALLY STICK (the revolt's spine): 17 notches = 30 May … 15 June
export const TALLY_DAYS = ['30 May', '31 May', '1 June', '2 June', '3 June', '4 June', '5 June', '6 June', '7 June', '8 June', '9 June', '10 June', '11 June', '12 June', '13 June', '14 June', '15 June'];
export function tally(ctx, t, at, out, day0, day1, o = {}) {
  const a = life(t, at, out, 0.4, 0.4); if (a <= 0) return;
  const x = o.x ?? W * 0.62, y = o.y ?? H * 0.09, w = o.w ?? 600, light = o.light ?? false;
  const prog = lerp(day0, day1, easeIO((t - at - 0.4) / (o.roll ?? 1.4)));
  ctx.save(); ctx.globalAlpha *= a;
  // stick
  ctx.fillStyle = '#B8995F'; ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.lineTo(x + w, y - 14); ctx.quadraticCurveTo(x + w + 16, y, x + w, y + 14); ctx.lineTo(x, y + 14); ctx.quadraticCurveTo(x - 16, y, x, y - 14); ctx.fill();
  ctx.strokeStyle = '#7A6238'; ctx.lineWidth = 1.5; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(x + 10, y - 9 + i * 3.6); ctx.lineTo(x + w - 10, y - 9 + i * 3.6 + (i % 2 ? 1 : -1)); ctx.stroke(); }
  for (let i = 0; i < 17; i++) {
    const nx = x + 20 + i * (w - 40) / 16, cut = prog >= i + 1 - 0.001 ? 1 : clamp(prog - i);
    ctx.fillStyle = cut > 0 ? mixColor('#7A6238', P.red, cut) : '#9C8152'; ctx.beginPath(); ctx.moveTo(nx - 5, y - 14); ctx.lineTo(nx, y - 2 - 6 * cut); ctx.lineTo(nx + 5, y - 14); ctx.fill();
    ctx.beginPath(); ctx.moveTo(nx - 5, y + 14); ctx.lineTo(nx, y + 2 + 6 * cut); ctx.lineTo(nx + 5, y + 14); ctx.fill();
  }
  const d = Math.max(1, Math.round(prog));
  spaced(ctx, `DAY ${d}`, x, y + 50, '600 26px Oswald', light ? '#F0E6D0' : P.ink2, 4, 'left');
  text(ctx, TALLY_DAYS[d - 1] + ' 1381', x + 120, y + 50, 'italic 400 26px BodoniItalic', light ? '#E6D9BE' : P.ink3, 'left');
  ctx.restore();
}

// ---- portrait medallion card: gold ring, bust of the same character drawing, name plaque
export function medallion(ctx, t, key, x, y, r, at, out, o = {}) {
  const a = life(t, at, out, 0.35, 0.35); if (a <= 0) return;
  const sc = lerp(0.85, 1, backOut((t - at) / 0.45));
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 20;
  ctx.fillStyle = o.bg ?? '#D9CBA9'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
  const ph = !o.drawn && PORTRAIT[key];
  if (ph) { ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r * 0.94, 0, TAU); ctx.clip(); ctx.drawImage(ph, -r * 0.94, -r * 0.94, r * 1.88, r * 1.88); ctx.restore(); }
  else if (!o.blank) bust(ctx, 0, 0, r * 0.94, CH[key]);
  else { ctx.fillStyle = P.ink2; ctx.beginPath(); ctx.arc(0, r * 0.1, r * 0.55, 0, TAU); ctx.fill(); text(ctx, '?', 0, r * 0.36, `900 ${r * 0.9}px Bodoni`, '#D9CBA9'); }
  ctx.strokeStyle = o.ring ?? P.gold; ctx.lineWidth = r * 0.09; ctx.beginPath(); ctx.arc(0, 0, r * 0.97, 0, TAU); ctx.stroke();
  ctx.strokeStyle = '#7A5E24'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, r * 0.9, 0, TAU); ctx.stroke();
  if (o.grey) { ctx.fillStyle = `rgba(40,36,30,${0.55 * clamp(o.grey)})`; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); }
  if (o.slash) { const u = clamp(o.slash); ctx.strokeStyle = P.red; ctx.lineWidth = r * 0.12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-r * 0.75, -r * 0.75); ctx.lineTo(lerp(-r * 0.75, r * 0.75, u), lerp(-r * 0.75, r * 0.75, u)); ctx.stroke(); }
  if (!o.noPlaque) {
    const pw = Math.max(r * 2.2, 40 + (CH[key]?.name.length ?? 8) * r * 0.16), ph = r * 0.42;
    ctx.fillStyle = '#E8DCC2'; ctx.strokeStyle = '#7A5E24'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.rect(-pw / 2, r * 0.95, pw, ph); ctx.fill(); ctx.stroke();
    text(ctx, o.name ?? CH[key].name, 0, r * 0.95 + ph * 0.7, `600 ${ph * 0.58}px Cinzel`, P.ink, 'center');
    if (o.role ?? CH[key].role) text(ctx, (o.role ?? CH[key].role), 0, r * 0.95 + ph + r * 0.28, `italic 400 ${r * 0.22}px BodoniItalic`, o.light ? '#F0E6D0' : P.ink2, 'center');
  }
  ctx.restore();
}

// ---- quote card: italic serif quotation, centred, with attribution
export function quote(ctx, t, lines, at, out, o = {}) {
  const a = life(t, at, out, 0.5, 0.5); if (a <= 0) return;
  const size = o.size ?? 74, light = (o.mode ?? 'light') === 'light', cy = o.y ?? H * 0.46;
  ctx.save(); ctx.globalAlpha *= a;
  if (o.panel) { ctx.fillStyle = 'rgba(236,226,204,0.92)'; ctx.fillRect(W * 0.12, cy - lines.length * size * 0.75 - 70, W * 0.76, lines.length * size * 1.25 + 150); }
  text(ctx, '“', W * 0.14, cy - lines.length * size * 0.45, `400 ${size * 2.4}px Bodoni`, light ? P.gold2 : P.red, 'left', 0.9);
  lines.forEach((l, i) => { const la = clamp((t - at - 0.25 - i * (o.stagger ?? 0.6)) / 0.5);
    text(ctx, l, W / 2, cy + (i - (lines.length - 1) / 2) * size * 1.22, `italic 400 ${size}px BodoniItalic`, light ? '#F6EFE0' : P.ink, 'center', la, light ? 'rgba(0,0,0,0.6)' : null); });
  if (o.by) spaced(ctx, o.by.toUpperCase(), W / 2, cy + (lines.length / 2) * size * 1.22 + 40, '500 24px Oswald', light ? '#E6D9BE' : P.ink3, 5, 'center', clamp((t - at - 1.2) / 0.5));
  ctx.restore();
}

// ---- list panel: items appear one at a time at given times
export function listPanel(ctx, t, items, times, at, out, o = {}) {
  const a = life(t, at, out, 0.4, 0.4); if (a <= 0) return;
  const x = o.x ?? W * 0.56, y = o.y ?? H * 0.22, w = o.w ?? 720, lh = o.lh ?? 92;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = 'rgba(238,228,206,0.9)'; ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 24;
  ctx.fillRect(x, y, w, 96 + items.length * lh); ctx.shadowBlur = 0;
  ctx.strokeStyle = P.sepia; ctx.lineWidth = 2; ctx.strokeRect(x + 12, y + 12, w - 24, 72 + items.length * lh);
  if (o.title) spaced(ctx, o.title.toUpperCase(), x + 40, y + 52, '600 24px Oswald', P.red, 5, 'left');
  items.forEach((it, i) => { const ia = clamp((t - times[i]) / 0.35); if (ia <= 0) return;
    ctx.save(); ctx.globalAlpha *= ia; ctx.translate((1 - ia) * 30, 0);
    ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(x + 52, y + 126 + i * lh - 14, 7, 0, TAU); ctx.fill();
    text(ctx, it, x + 78, y + 126 + i * lh, `italic 400 ${o.size ?? 52}px BodoniItalic`, P.ink, 'left'); ctx.restore(); });
  ctx.restore();
}

// ---- rolling counter
export function counter(ctx, t, v0, v1, at, dur, x, y, o = {}) {
  const a = life(t, at, o.out ?? 1e9, 0.3, 0.4); if (a <= 0) return;
  const v = Math.round(lerp(v0, v1, easeIO((t - at) / dur)));
  const s = o.plain ? String(v) : v.toLocaleString('en-GB');
  ctx.save(); ctx.globalAlpha *= a; text(ctx, s, x, y, `600 ${o.size ?? 120}px Bodoni`, o.color ?? '#F6EFE0', o.align ?? 'center', 1, (o.mode ?? 'light') === 'light' ? 'rgba(0,0,0,0.6)' : null);
  if (o.label) spaced(ctx, o.label.toUpperCase(), x, y + (o.size ?? 120) * 0.42, '500 26px Oswald', o.labelColor ?? '#E6D9BE', 5, o.align ?? 'center');
  ctx.restore();
}

// ---- coins (an original groat design: cross, pellets, beaded rim)
export function groat(ctx, x, y, r, alpha = 1) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y);
  const g = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r); g.addColorStop(0, '#EDEBE4'); g.addColorStop(1, '#9C9A92');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#6E6C66'; ctx.lineWidth = r * 0.06; ctx.beginPath(); ctx.arc(0, 0, r * 0.86, 0, TAU); ctx.stroke();
  ctx.fillStyle = '#6E6C66'; for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.93, Math.sin(a) * r * 0.93, r * 0.03, 0, TAU); ctx.fill(); }
  ctx.fillRect(-r * 0.06, -r * 0.7, r * 0.12, r * 1.4); ctx.fillRect(-r * 0.7, -r * 0.06, r * 1.4, r * 0.12);
  for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(dx * r * (0.28 + (k === 2 ? 0.1 : 0)), dy * r * (0.28 + (k === 1 ? 0.1 : 0)), r * 0.07, 0, TAU); ctx.fill(); }
  ctx.restore();
}

// ---- parchment document: lines of illegible hand, optional seal; returns nothing. kind 'charter' | 'roll' | 'statute'
export function documentSheet(ctx, t, x, y, w, h, o = {}) {
  const r = rng(o.seed ?? 5), b = clamp(o.burn ?? 0);
  ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
  if (b >= 0.999) { ctx.restore(); return; }
  const edge = h / 2 - b * h; // paper burns away from the bottom edge upwards
  if (b > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-w / 2 - 40, -h / 2 - 40, w + 260, edge + h / 2 + 40); ctx.clip(); }
  ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 22; ctx.shadowOffsetY = 6;
  ctx.fillStyle = o.color ?? '#EFE3C6'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.strokeStyle = 'rgba(110,90,60,0.35)'; ctx.lineWidth = 2; ctx.strokeRect(-w / 2 + 10, -h / 2 + 10, w - 20, h - 20);
  if (o.title) text(ctx, o.title, 0, -h / 2 + 70, `400 ${o.titleSize ?? 44}px UnifrakturMaguntia, Fell`, P.ink, 'center');
  const lines = o.lines ?? Math.floor((h - 150) / 26), written = o.written ?? 1;
  ctx.strokeStyle = 'rgba(40,30,20,0.75)'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
  for (let i = 0; i < lines; i++) {
    const ly = -h / 2 + (o.title ? 110 : 50) + i * 26, lw = (w - 90) * (i === lines - 1 ? 0.5 : 0.85 + r() * 0.15);
    const frac = clamp(written * lines - i); if (frac <= 0) break;
    ctx.beginPath(); let px = -w / 2 + 45; ctx.moveTo(px, ly);
    while (px < -w / 2 + 45 + lw * frac) { const step = 6 + r() * 8; ctx.quadraticCurveTo(px + step / 2, ly - 6 - r() * 6, px + step, ly + (r() - 0.5) * 2); px += step; if (r() < 0.12) { px += 10; ctx.moveTo(px, ly); } }
    ctx.stroke();
    if (o.highlight === i) { ctx.fillStyle = 'rgba(163,32,28,0.22)'; ctx.fillRect(-w / 2 + 38, ly - 18, lw + 14, 24); }
  }
  if (o.seal) { const sa = o.sealAt != null ? clamp(o.sealAt) : 1; if (sa > 0) { const ss = 1 + (1 - sa) * 1.2; ctx.save(); ctx.translate(w * 0.28, h / 2 - 70); ctx.scale(ss, ss); ctx.globalAlpha *= sa;
    ctx.fillStyle = P.red; ctx.beginPath(); for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, rr = 42 + (i % 2 ? 4 : -2); ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#6E1410'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 28, 0, TAU); ctx.stroke(); ctx.fillStyle = '#6E1410'; ctx.font = '700 26px Cinzel'; ctx.textAlign = 'center'; ctx.fillText(o.sealText ?? 'R', 0, 9); ctx.restore(); } }
  if (o.cross) { const ca = clamp(o.cross); ctx.strokeStyle = P.red; ctx.lineWidth = 18; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-w * 0.38, -h * 0.38); ctx.lineTo(lerp(-w * 0.38, w * 0.38, clamp(ca * 2)), lerp(-h * 0.38, h * 0.38, clamp(ca * 2))); ctx.stroke();
    if (ca > 0.5) { ctx.beginPath(); ctx.moveTo(w * 0.38, -h * 0.38); ctx.lineTo(lerp(w * 0.38, -w * 0.38, clamp(ca * 2 - 1)), lerp(-h * 0.38, h * 0.38, clamp(ca * 2 - 1))); ctx.stroke(); } }
  if (o.tag) { ctx.fillStyle = P.red; ctx.fillRect(w / 2 - 20, -h / 2 + 30, 160, 46); ctx.beginPath(); ctx.moveTo(w / 2 + 140, -h / 2 + 30); ctx.lineTo(w / 2 + 160, -h / 2 + 53); ctx.lineTo(w / 2 + 140, -h / 2 + 76); ctx.fill();
    spaced(ctx, o.tag, w / 2 - 6, -h / 2 + 62, '600 24px Oswald', '#F6EFE0', 3, 'left'); }
  if (b > 0) { // charred band at the burning edge, then flames
    const g = ctx.createLinearGradient(0, edge, 0, edge - 70); g.addColorStop(0, 'rgba(30,14,6,0.95)'); g.addColorStop(0.35, 'rgba(110,50,16,0.6)'); g.addColorStop(1, 'rgba(160,90,30,0)');
    ctx.fillStyle = g; ctx.fillRect(-w / 2, edge - 70, w, 72); ctx.restore();
    flames(ctx, 0, edge + 6, w * 0.95, 70 + 60 * Math.sin(b * Math.PI), t, 8, 12); }
  ctx.restore();
}

// ---- manor roll: a long scroll unrolling downward (the planted object)
export function manorRoll(ctx, t, x, y, w, len, unroll, o = {}) {
  const h = len * clamp(unroll);
  ctx.save(); ctx.translate(x, y);
  documentSheet(ctx, t, 0, h / 2, w, Math.max(h, 1), { seed: 21, lines: Math.max(1, Math.floor(h / 26) - 2), highlight: o.highlight, color: '#ECDDBA', title: unroll > 0.25 ? (o.title ?? 'Rotulus Curie') : null, titleSize: 40, tag: o.tag, burn: o.burn });
  ctx.fillStyle = '#C9B48A'; for (const yy of [0, h]) { ctx.beginPath(); ctx.ellipse(0, yy, w / 2 + 14, 16, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#A88E60'; ctx.fillRect(-w / 2 - 22, yy - 6, 10, 12); ctx.fillRect(w / 2 + 12, yy - 6, 10, 12); ctx.fillStyle = '#C9B48A'; }
  ctx.restore();
}

// ---------------------------------------------------------------- MAPS
const MAPS = JSON.parse(fs.readFileSync('/home/claude/project/render/maps.json', 'utf8'));
export const PLACES = {
  London: [51.512, -0.095], Brentwood: [51.621, 0.305], Fobbing: [51.532, 0.479], Corringham: [51.523, 0.459], 'Stanford-le-Hope': [51.514, 0.433],
  Gravesend: [51.441, 0.371], Dartford: [51.446, 0.218], Rochester: [51.388, 0.506], Maidstone: [51.272, 0.522], Canterbury: [51.28, 1.08],
  Blackheath: [51.466, 0.009], Greenwich: [51.483, -0.008], 'St Albans': [51.752, -0.336], Coventry: [52.406, -1.512], Colchester: [51.889, 0.901],
  Chelmsford: [51.736, 0.469], Calais: [50.95, 1.86], Bordeaux: [44.84, -0.58], Paris: [48.857, 2.35], Bayonne: [43.49, -1.47], Brest: [48.39, -4.49], Cherbourg: [49.64, -1.62]
};
// view: {lon, lat, span} span = degrees of longitude across the frame
export function project(view, lat, lon) {
  const k = W / view.span, cosl = Math.cos(view.lat * Math.PI / 180);
  return [W / 2 + (lon - view.lon) * k * cosl / cosl * Math.cos(lat * Math.PI / 180) / cosl * cosl, H / 2 - (lat - view.lat) * k * 1.6 * cosl];
}
const proj = (view, lat, lon) => { const k = W / view.span; const cl = Math.cos(view.lat * Math.PI / 180); return [W / 2 + (lon - view.lon) * k, H / 2 - (lat - view.lat) * k / cl]; };
export { proj };
export function drawMap(ctx, region, view, o = {}) {
  ctx.save();
  ctx.fillStyle = o.sea ?? P.sea; ctx.fillRect(-W, -H, W * 3, H * 3);
  // sea hatching lines (old map feel)
  ctx.strokeStyle = 'rgba(80,90,85,0.10)'; ctx.lineWidth = 1; for (let y = -H; y < H * 2; y += 14) { ctx.beginPath(); ctx.moveTo(-W, y); ctx.lineTo(W * 2, y); ctx.stroke(); }
  const polys = MAPS[region].land;
  const pathOf = () => { ctx.beginPath(); for (const ring of polys) { ring.forEach(([lon, lat], i) => { const [x, y] = proj(view, lat, lon); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); } };
  // coastal glow
  pathOf(); ctx.strokeStyle = 'rgba(70,80,75,0.18)'; ctx.lineWidth = 26; ctx.stroke(); ctx.lineWidth = 12; ctx.stroke();
  pathOf(); ctx.fillStyle = o.land ?? '#E9DDC3'; ctx.fill('evenodd');
  ctx.strokeStyle = P.ink3; ctx.lineWidth = 2.2; ctx.stroke();
  if (o.rivers) for (const name of o.rivers) for (const ln of (MAPS.rivers[name] || [])) {
    ctx.strokeStyle = '#8FA0A0'; ctx.lineWidth = o.riverW ?? 4; ctx.lineCap = 'round'; ctx.beginPath(); ln.forEach(([lon, lat], i) => { const [x, y] = proj(view, lat, lon); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); }
  ctx.restore();
}
export function fillGeo(ctx, view, pts, color, alpha) { // pts [[lat,lon]...]
  ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = color; ctx.beginPath(); pts.forEach(([la, lo], i) => { const [x, y] = proj(view, la, lo); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); ctx.fill(); ctx.restore();
}
export function mapLabel(ctx, view, place, a, o = {}) {
  if (a <= 0) return; const [la, lo] = Array.isArray(place) ? place : PLACES[place]; const [x, y] = proj(view, la, lo);
  ctx.save(); ctx.globalAlpha *= a;
  if (o.dot !== false) { ctx.fillStyle = o.color ?? P.ink; ctx.beginPath(); ctx.arc(x, y, o.r ?? 7, 0, TAU); ctx.fill(); if (o.ring) { ctx.strokeStyle = o.color ?? P.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, (o.r ?? 7) + 6 + Math.sin(o.t * 4) * 2, 0, TAU); ctx.stroke(); } }
  const name = o.name ?? place; const fs_ = o.size ?? 36;
  if (o.box) { ctx.font = `600 ${fs_ * 0.8}px Cinzel`; const tw = ctx.measureText(name).width; ctx.fillStyle = '#F2E8D2'; ctx.strokeStyle = P.ink2; ctx.lineWidth = 2; const bx = x + (o.dx ?? 16), by = y + (o.dy ?? -fs_ * 0.4) - fs_ * 0.8;
    ctx.fillRect(bx, by, tw + 24, fs_ * 1.1); ctx.strokeRect(bx, by, tw + 24, fs_ * 1.1); text(ctx, name, bx + 12, by + fs_ * 0.82, `600 ${fs_ * 0.8}px Cinzel`, P.ink, 'left'); }
  else text(ctx, name, x + (o.dx ?? 16), y + (o.dy ?? 10), `italic 400 ${fs_}px FellItalic`, o.textColor ?? P.ink, o.align ?? 'left');
  ctx.restore();
}
// dashed route drawn progressively along geo points
export function route(ctx, view, pts, prog, o = {}) {
  if (prog <= 0) return; const xy = pts.map(p => Array.isArray(p) ? proj(view, p[0], p[1]) : proj(view, ...PLACES[p]));
  let L = 0; const seg = []; for (let i = 1; i < xy.length; i++) { const d = Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]); seg.push(d); L += d; }
  const goal = L * clamp(prog); ctx.save(); ctx.strokeStyle = o.color ?? P.red; ctx.lineWidth = o.w ?? 6; ctx.setLineDash(o.dash ?? [18, 12]); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(...xy[0]); let acc = 0, end = xy[0];
  for (let i = 1; i < xy.length; i++) { if (acc + seg[i - 1] <= goal) { ctx.lineTo(...xy[i]); acc += seg[i - 1]; end = xy[i]; } else { const u = (goal - acc) / seg[i - 1]; end = [lerp(xy[i - 1][0], xy[i][0], u), lerp(xy[i - 1][1], xy[i][1], u)]; ctx.lineTo(...end); break; } }
  ctx.stroke(); ctx.setLineDash([]);
  if (o.arrow !== false && prog < 1.001) { ctx.fillStyle = o.color ?? P.red; ctx.beginPath(); ctx.arc(end[0], end[1], (o.w ?? 6) * 1.6, 0, TAU); ctx.fill(); }
  ctx.restore(); return end;
}
// token on a map: a coloured disc with a small silhouette head (faction marker)
export function token(ctx, x, y, r, color, a = 1, label = null, light = false) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 10; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(20,16,12,0.85)'; ctx.beginPath(); ctx.arc(x, y - r * 0.18, r * 0.28, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - r * 0.45, y + r * 0.55); ctx.quadraticCurveTo(x, y - r * 0.05, x + r * 0.45, y + r * 0.55); ctx.fill();
  ctx.strokeStyle = '#F2E8D2'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  if (label) text(ctx, label, x, y + r + 30, `600 24px Cinzel`, light ? '#F2E8D2' : P.ink, 'center');
  ctx.restore();
}

// ---- rubber stamp: rotated boxed caps that thump in (drawn offscreen so the ink wear only bites the stamp)
import { createCanvas } from '@napi-rs/canvas';
const STAMP = createCanvas(1600, 420), SX = STAMP.getContext('2d');
export function stamp(ctx, t, str, at, out, o = {}) {
  const a = life(t, at, out, 0.06, 0.3); if (a <= 0) return;
  const k = clamp((t - at) / 0.18), sc = lerp(1.9, 1, easeOut(k));
  const size = o.size ?? 120, col = o.color ?? P.red;
  SX.setTransform(1, 0, 0, 1, 0, 0); SX.clearRect(0, 0, 1600, 420); SX.globalCompositeOperation = 'source-over'; SX.globalAlpha = 1;
  SX.font = `900 ${size}px Bodoni`; const tw = SX.measureText(str).width;
  SX.translate(800, 210);
  SX.strokeStyle = col; SX.lineWidth = size * 0.07; SX.strokeRect(-tw / 2 - size * 0.3, -size * 0.78, tw + size * 0.6, size * 1.08);
  SX.fillStyle = col; SX.textAlign = 'center'; SX.textBaseline = 'alphabetic'; SX.fillText(str, 0, size * 0.12);
  const r = rng(str.length * 7 + 3); SX.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 90; i++) { SX.globalAlpha = 0.55 * r(); SX.beginPath(); SX.arc((r() - 0.5) * (tw + size * 0.6), (r() - 0.6) * size, 1 + r() * size * 0.05, 0, TAU); SX.fill(); }
  SX.globalCompositeOperation = 'source-over'; SX.globalAlpha = 1;
  ctx.save(); ctx.globalAlpha *= a * (o.alpha ?? 0.92); ctx.translate(o.x ?? W / 2, o.y ?? H / 2); ctx.rotate(o.rot ?? -0.12); ctx.scale(sc, sc);
  ctx.drawImage(STAMP, -800, -210); ctx.restore();
}
// ---- clip to land (so regional fills never spill into the sea)
export function landPath(ctx, region, view) {
  ctx.beginPath(); for (const ring of MAPS[region].land) { ring.forEach(([lon, lat], i) => { const [x, y] = proj(view, lat, lon); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); }
}
export function fillRegion(ctx, region, view, pts, color, alpha) {
  if (alpha <= 0) return; ctx.save(); landPath(ctx, region, view); ctx.clip('evenodd'); fillGeo(ctx, view, pts, color, alpha); ctx.restore();
}

// ================================================================ TAIPING EPISODE additions
// a brush "character": 3–6 strokes inside a box (illegible on purpose; the fonts have no CJK glyphs)
export function brushGlyph(ctx, x, y, s, seed, col = P.ink, wgt = 1) {
  const r = rng(seed * 7919 + 13); ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineCap = 'round'; ctx.lineWidth = s * 0.085 * wgt;
  const n = 3 + Math.floor(r() * 4);
  for (let i = 0; i < n; i++) { const k = r(); ctx.beginPath();
    if (k < 0.35) { const yy = y + (r() - 0.5) * s * 0.8; ctx.moveTo(x - s * (0.2 + r() * 0.25), yy); ctx.quadraticCurveTo(x, yy - s * 0.04, x + s * (0.2 + r() * 0.25), yy + s * 0.02); }
    else if (k < 0.65) { const xx = x + (r() - 0.5) * s * 0.7; ctx.moveTo(xx, y - s * (0.2 + r() * 0.25)); ctx.lineTo(xx + s * 0.02, y + s * (0.15 + r() * 0.3)); }
    else if (k < 0.85) { const sx = r() < 0.5 ? -1 : 1; ctx.moveTo(x + sx * s * 0.05, y - s * 0.1); ctx.quadraticCurveTo(x - sx * s * 0.1, y + s * 0.15, x - sx * s * 0.38, y + s * 0.38); }
    else { ctx.arc(x + (r() - 0.5) * s * 0.6, y + (r() - 0.5) * s * 0.6, s * 0.06, 0, TAU); ctx.fill(); continue; }
    ctx.stroke(); }
  ctx.restore();
}
// the PASS LIST (planted object): a pasted exam list, columns of names written top-to-bottom, right-to-left
export function passList(ctx, t, x, y, w, h, o = {}) {
  ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
  const rev = clamp(o.reveal ?? 1);
  ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 22; ctx.shadowOffsetY = 6; ctx.fillStyle = o.paper ?? '#EFE6C8'; ctx.fillRect(-w / 2, -h / 2, w, h * clamp(rev * 1.4)); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.strokeStyle = 'rgba(110,40,30,0.55)'; ctx.lineWidth = 3; ctx.strokeRect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24);
  // header: three large glyphs
  for (let k = 0; k < 3; k++) brushGlyph(ctx, -w * 0.16 + k * w * 0.16, -h / 2 + h * 0.1, h * 0.09, 900 + k, P.red, 1.1);
  const cols = o.cols ?? 12, rows = o.rows ?? 9, cw = (w - 80) / cols, gs = Math.min(cw * 0.62, (h * 0.72) / rows * 0.8);
  for (let c = 0; c < cols; c++) { const ca = clamp(rev * cols * 1.1 - c); if (ca <= 0) continue; const cx = w / 2 - 40 - cw * (c + 0.5);
    ctx.save(); ctx.globalAlpha *= ca;
    if (o.top != null && c === 0) { ctx.fillStyle = rgba(P.gold, 0.35 * clamp(o.top)); ctx.fillRect(cx - cw * 0.45, -h / 2 + h * 0.2, cw * 0.9, rows * (h * 0.72 / rows)); }
    for (let r_ = 0; r_ < rows; r_++) brushGlyph(ctx, cx, -h / 2 + h * 0.24 + r_ * (h * 0.72 / rows), gs, c * 31 + r_ + (o.seed ?? 0), P.ink, 0.9);
    ctx.restore(); }
  if (o.scan != null && o.scan > 0 && o.scan < 1) { const u = o.scan * cols, c = Math.floor(u), cx = w / 2 - 40 - cw * (c + 0.5), yy = -h / 2 + h * 0.2 + (u - c) * h * 0.72;
    ctx.fillStyle = 'rgba(163,32,28,0.16)'; ctx.fillRect(cx - cw * 0.45, -h / 2 + h * 0.2, cw * 0.9, h * 0.72); ctx.fillStyle = 'rgba(163,32,28,0.5)'; ctx.fillRect(cx - cw * 0.5, yy - 3, cw, 6); }
  if (o.gap) { const ga = clamp(o.gap); ctx.save(); ctx.globalAlpha *= ga; ctx.strokeStyle = P.red; ctx.lineWidth = 5; ctx.setLineDash([14, 10]); const gx = -w / 2 + 40 + cw * 0.05, gy = -h / 2 + h * 0.2; ctx.strokeRect(gx - cw * 0.2, gy, cw * 0.95, h * 0.72); ctx.setLineDash([]);
    if (o.gapLabel !== false) { text(ctx, 'Hong Xiuquan', gx + cw * 0.28, h / 2 + 58, 'italic 400 44px BodoniItalic', o.light ? '#F6EFE0' : P.ink, 'center', 1, o.light ? 'rgba(0,0,0,0.6)' : null); spaced(ctx, 'NOT ON THE LIST', gx + cw * 0.28, h / 2 + 96, '600 24px Oswald', o.light ? '#E8553F' : P.red, 4, 'center'); } ctx.restore(); }
  if (o.seal) { const sa = clamp(o.seal), ss = 1 + (1 - sa) * 1.3; ctx.save(); ctx.translate(-w / 2 + 90, -h / 2 + 90); ctx.scale(ss, ss); ctx.globalAlpha *= sa; heavenlySeal(ctx, 0, 0, 62); ctx.restore(); }
  if (o.caption) spaced(ctx, o.caption.toUpperCase(), 0, h / 2 - 26, '500 20px Oswald', P.ink3, 4, 'center', clamp(rev * 2 - 1));
  if (o.tag) { const ta = clamp(o.tag), tw_ = 190; ctx.save(); ctx.globalAlpha *= ta; ctx.translate(w / 2 - 250 + (1 - ta) * 40, -h / 2 - 30); ctx.fillStyle = P.red; ctx.fillRect(0, 0, tw_, 50); ctx.beginPath(); ctx.moveTo(tw_, 0); ctx.lineTo(tw_ + 22, 25); ctx.lineTo(tw_, 50); ctx.fill();
    ctx.fillStyle = '#7A1612'; ctx.beginPath(); ctx.arc(14, 25, 6, 0, TAU); ctx.fill(); spaced(ctx, 'REMEMBER', 30, 35, '600 26px Oswald', '#F6EFE0', 3, 'left'); ctx.restore(); }
  ctx.restore();
}
// the Heavenly King's square seal (red, carved-style strokes)
export function heavenlySeal(ctx, x, y, s, col = P.red) {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.fillRect(-s, -s, s * 2, s * 2); ctx.fillStyle = '#F2E4C4';
  ctx.fillRect(-s * 0.82, -s * 0.82, s * 1.64, s * 0.1); ctx.fillRect(-s * 0.82, s * 0.72, s * 1.64, s * 0.1); ctx.fillRect(-s * 0.82, -s * 0.82, s * 0.1, s * 1.64); ctx.fillRect(s * 0.72, -s * 0.82, s * 0.1, s * 1.64);
  ctx.globalCompositeOperation = 'source-over'; for (let k = 0; k < 4; k++) brushGlyph(ctx, (k % 2 ? 0.33 : -0.33) * s, (k < 2 ? -0.33 : 0.33) * s, s * 0.55, 700 + k, '#F2E4C4', 1.3);
  ctx.restore();
}
// THE HEAVENLY CALENDAR (spine): 14 year-tiles 1851–1864. prog = tiles stamped (float); crack/shatter/burn 0..1
export function calendar(ctx, t, at, out, prog0, prog1, o = {}) {
  const a = life(t, at, out, 0.4, 0.4); if (a <= 0) return;
  const x = o.x ?? W * 0.5 - 420, y = o.y ?? 96, ts = o.size ?? 52, gap = ts * 0.16, light = o.light ?? false;
  const prog = lerp(prog0, prog1, easeIO((t - at - 0.4) / (o.roll ?? 1.2)));
  const burn = clamp(o.burn ?? 0), crack = clamp(o.crack ?? 0), shat = clamp(o.shatter ?? 0);
  ctx.save(); ctx.globalAlpha *= a;
  spaced(ctx, 'THE HEAVENLY CALENDAR', x, y - ts * 0.75, '600 20px Oswald', light ? '#F0E6D0' : P.ink2, 4, 'left');
  for (let i = 0; i < 14; i++) {
    const tx = x + i * (ts + gap), burnt = burn > 0 && (13 - i) / 14 < burn; if (burnt && burn * 14 - (13 - i) > 1.2) continue;
    let dy = 0, rot = 0, fa = 1; if (i === 13 && shat > 0) { dy = shat * shat * 300; rot = shat * 1.2; fa = 1 - shat; }
    const st = clamp(prog - i), on = st > 0; const pop = on && st < 1 ? 1 + 0.25 * (1 - st) : 1;
    ctx.save(); ctx.globalAlpha *= fa; ctx.translate(tx + ts / 2, y + ts / 2 + dy); ctx.rotate(rot); ctx.scale(pop, pop);
    ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 8; ctx.fillStyle = on ? mixColor('#E6D7B4', P.red, st) : '#E6D7B4'; ctx.fillRect(-ts / 2, -ts / 2, ts, ts); ctx.shadowBlur = 0;
    ctx.strokeStyle = on ? '#6E1410' : 'rgba(90,70,40,0.6)'; ctx.lineWidth = 2; ctx.strokeRect(-ts / 2 + 4, -ts / 2 + 4, ts - 8, ts - 8);
    brushGlyph(ctx, 0, -ts * 0.12, ts * 0.42, 300 + i, on ? '#F2E4C4' : 'rgba(42,36,29,0.55)', 0.9);
    text(ctx, String(1851 + i), 0, ts * 0.38, `600 ${ts * 0.26}px Bodoni`, on ? '#F6EFE0' : P.ink3, 'center');
    if (crack > 0 && on) { ctx.strokeStyle = 'rgba(20,10,6,0.85)'; ctx.lineWidth = 2; const r = rng(i * 17 + 5); ctx.beginPath(); let px = (r() - 0.5) * ts * 0.6, py = -ts / 2; ctx.moveTo(px, py); for (let k = 0; k < 5 && (k + 1) / 5 <= crack + 0.2; k++) { px += (r() - 0.5) * ts * 0.4; py += ts / 5; ctx.lineTo(px, py); } ctx.stroke(); }
    if (burnt) { ctx.fillStyle = 'rgba(30,14,6,0.7)'; ctx.fillRect(-ts / 2, -ts / 2, ts, ts); }
    ctx.restore();
  }
  if (burn > 0 && burn < 1) { const fx = x + (13 - Math.floor(burn * 14) + 0.5) * (ts + gap); flames(ctx, fx, y + ts, ts * 1.6, ts * 1.6, t, 41, 7); }
  if (o.label !== false && prog > 0.5) { const yr = 1850 + Math.min(14, Math.max(1, Math.round(prog))); text(ctx, o.caption ?? `Year ${Math.min(14, Math.max(1, Math.round(prog)))} of the Heavenly Kingdom · ${yr}`, x, y + ts + 34, 'italic 400 24px BodoniItalic', light ? '#E6D9BE' : P.ink3, 'left'); }
  ctx.restore();
}
Object.assign(PLACES, {
  Canton: [23.13, 113.26], 'Hua county': [23.55, 113.1], 'Thistle Mountain': [23.55, 110.1], Jintian: [23.42, 110.0], Guilin: [25.27, 110.29], Yongan: [24.0, 110.4],
  Changsha: [28.23, 112.94], Wuchang: [30.55, 114.3], Anqing: [30.53, 117.05], Nanjing: [32.06, 118.79], Shanghai: [31.23, 121.47], Suzhou: [31.3, 120.58],
  Beijing: [39.9, 116.4], Tianjin: [39.13, 117.2], 'Hong Kong': [22.3, 114.17], Hunan: [27.73, 112.53], Chengdu: [30.66, 104.06], 'Dadu River': [29.3, 102.6], Cixi: [30.17, 121.24], Hangzhou: [30.27, 120.15]
});
export const CN_VIEW = { lon: 113.5, lat: 29.5, span: 30 };
