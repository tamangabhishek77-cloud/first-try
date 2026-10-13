// Thumbnail set v3 — an original, clearly stylised poor-man hero (not a likeness of any real person) leading an armed rebel host.
import fs from 'fs';
import { GlobalFonts, createCanvas } from '@napi-rs/canvas';
import { W, H, P, makeCanvas, withCam, TEX, puff, rng, mixColor, lerp } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';
import * as PL from './plates.mjs';
import { RICHARD_HORSE } from './shots_a.mjs';
GlobalFonts.registerFromPath('/home/claude/project/fonts/Anton-Regular.ttf', 'Anton');
const OUT = '/home/claude/project/out/thumbnails_v3'; fs.mkdirSync(OUT, { recursive: true });
const RED = '#E0262B', CREAM = '#F7F0E2', YEL = '#F2C200'; const t = 3.0; const { CH } = A; const TAU = Math.PI * 2;

// ------------------------------------------------------------ shared helpers
function head(c, parts, x, y, size, align = 'left', stroke = 16) {
  c.save(); c.font = `${size}px Anton`; c.textBaseline = 'alphabetic'; c.lineJoin = 'round';
  const ws = parts.map(p => c.measureText(p.t).width), tot = ws.reduce((a, b) => a + b, 0) + (parts.length - 1) * size * 0.2;
  let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
  parts.forEach((p, i) => { c.shadowColor = 'rgba(0,0,0,0.85)'; c.shadowBlur = 30; c.shadowOffsetX = 8; c.shadowOffsetY = 10;
    c.strokeStyle = '#0A0806'; c.lineWidth = stroke; c.strokeText(p.t, cx, y); c.shadowColor = 'transparent'; c.fillStyle = p.c ?? CREAM; c.fillText(p.t, cx, y); cx += ws[i] + size * 0.2; });
  c.restore();
}
function blurred(draw, px) { const [cv, x] = makeCanvas(); draw(x); const [o, ox] = makeCanvas(); ox.filter = `blur(${px}px)`; ox.drawImage(cv, 0, 0); return o; }
function grade(c, d = 0.6) { const g = c.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, H * 1.02); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(6,4,3,${d})`); c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.save(); c.globalCompositeOperation = 'overlay'; c.globalAlpha = 0.07; c.drawImage(TEX.grain[1], 0, 0, W, H); c.restore(); }
function save(c, name) { const o = createCanvas(1280, 720); o.getContext('2d').drawImage(c, 0, 0, 1280, 720); fs.writeFileSync(`${OUT}/${name}.jpg`, o.toBuffer('image/jpeg', 93));
  const s = createCanvas(168, 94); s.getContext('2d').drawImage(c, 0, 0, 168, 94); fs.writeFileSync(`${OUT}/${name}_phone.png`, s.toBuffer('image/png')); }
function sky(c, stops) { const g = c.createLinearGradient(0, 0, 0, H); stops.forEach(([o, col]) => g.addColorStop(o, col)); c.fillStyle = g; c.fillRect(0, 0, W, H); }
const FIRE = [[0, '#1A0E0A'], [0.5, '#7A2A16'], [0.78, '#D86A2A'], [1, '#F2B04A']];
const BLOOD = [[0, '#12060A'], [0.45, '#6E1418'], [0.8, '#C8452A'], [1, '#F2A04A']];
const DAWN = [[0, '#0F1722'], [0.45, '#3A4D63'], [0.75, '#D98A52'], [1, '#F5C27A']];

// ------------------------------------------------------------ the army (richer than the film's crowd: kettle hats, spears, billhooks, bows, St George banners)
function grunt(c, x, y, h, col, rimC, kind, f, ph, lightDx, kettle) {
  const bw = h * 0.12, tt = t + ph;
  const body = (cc, dx) => { c.fillStyle = cc; c.strokeStyle = cc;
    c.beginPath(); c.moveTo(x - bw + dx, y); c.lineTo(x - bw * 0.8 + dx, y - h * 0.6); c.lineTo(x - bw * 1.15 + dx, y - h * 0.72); c.lineTo(x + bw * 1.15 + dx, y - h * 0.72); c.lineTo(x + bw * 0.8 + dx, y - h * 0.6); c.lineTo(x + bw + dx, y); c.closePath(); c.fill();
    c.beginPath(); c.arc(x + f * h * 0.012 + dx, y - h * 0.8, h * 0.075, 0, TAU); c.fill();
    if (kettle) { c.beginPath(); c.ellipse(x + dx, y - h * 0.845, h * 0.125, h * 0.03, 0, 0, TAU); c.fill(); c.beginPath(); c.arc(x + dx, y - h * 0.855, h * 0.075, Math.PI, TAU); c.fill(); }
    else { c.beginPath(); c.arc(x - f * h * 0.01 + dx, y - h * 0.83, h * 0.082, Math.PI, TAU); c.fill(); }
    // raised arm
    c.lineWidth = h * 0.04; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + f * bw * 0.9 + dx, y - h * 0.68); c.lineTo(x + f * h * 0.15 + dx, y - h * 0.93); c.stroke(); };
  const hx = x + f * h * 0.15, hy = y - h * 0.93;
  const wpn = (cc, dx, steel) => { c.save(); c.translate(dx, 0); c.strokeStyle = cc; c.fillStyle = cc; c.lineCap = 'round'; c.lineWidth = h * 0.022;
    const sc = steel ? '#C9CED2' : cc;
    if (kind === 'spear') { c.beginPath(); c.moveTo(hx - f * h * 0.03, hy + h * 0.35); c.lineTo(hx + f * h * 0.03, hy - h * 0.65); c.stroke(); c.fillStyle = sc; c.beginPath(); c.moveTo(hx + f * h * 0.03 - h * 0.025, hy - h * 0.65); c.lineTo(hx + f * h * 0.03, hy - h * 0.82); c.lineTo(hx + f * h * 0.03 + h * 0.025, hy - h * 0.65); c.fill(); }
    else if (kind === 'bill') { c.beginPath(); c.moveTo(hx, hy + h * 0.35); c.lineTo(hx, hy - h * 0.55); c.stroke(); c.fillStyle = sc; c.beginPath(); c.moveTo(hx - f * h * 0.01, hy - h * 0.5); c.quadraticCurveTo(hx + f * h * 0.17, hy - h * 0.62, hx + f * h * 0.05, hy - h * 0.78); c.lineTo(hx, hy - h * 0.62); c.fill(); }
    else if (kind === 'fork') { c.beginPath(); c.moveTo(hx, hy + h * 0.35); c.lineTo(hx, hy - h * 0.5); c.stroke(); c.lineWidth = h * 0.014; c.strokeStyle = sc; c.beginPath(); c.moveTo(hx - h * 0.05, hy - h * 0.68); c.lineTo(hx - h * 0.05, hy - h * 0.5); c.lineTo(hx + h * 0.05, hy - h * 0.5); c.lineTo(hx + h * 0.05, hy - h * 0.68); c.moveTo(hx, hy - h * 0.5); c.lineTo(hx, hy - h * 0.7); c.stroke(); }
    else if (kind === 'sword') { c.save(); c.translate(hx, hy); c.rotate(f * 0.25 - Math.PI / 2 * 0 ); c.fillStyle = sc; c.beginPath(); c.moveTo(-h * 0.014, 0); c.lineTo(-h * 0.014, -h * 0.5); c.lineTo(0, -h * 0.56); c.lineTo(h * 0.014, -h * 0.5); c.lineTo(h * 0.014, 0); c.fill(); c.fillRect(-h * 0.05, -h * 0.01, h * 0.1, h * 0.016); c.restore(); }
    else if (kind === 'bow') { c.lineWidth = h * 0.016; c.beginPath(); c.arc(hx - f * h * 0.02, hy - h * 0.1, h * 0.3, f > 0 ? -1.15 : Math.PI - 1.15 + 0.0, f > 0 ? 1.15 : Math.PI + 1.15, f < 0); c.stroke(); }
    else if (kind === 'banner') { c.beginPath(); c.moveTo(hx, hy + h * 0.4); c.lineTo(hx, hy - h * 1.05); c.stroke(); const wv = Math.sin(tt * 3) * h * 0.02, fw = h * 0.46 * f, fy = hy - h * 1.02;
      c.fillStyle = steel ? '#EDE3CF' : cc; c.beginPath(); c.moveTo(hx, fy); c.lineTo(hx + fw, fy + wv); c.lineTo(hx + fw, fy + h * 0.3 + wv); c.lineTo(hx, fy + h * 0.3); c.closePath(); c.fill();
      c.fillStyle = steel ? '#B3221E' : mixColor(cc, '#000', 0.2); c.fillRect(hx + fw * 0.42 - h * 0.03, fy + wv * 0.5, h * 0.06, h * 0.3); c.fillRect(hx, fy + h * 0.12 + wv * 0.5, fw, h * 0.06); }
    c.restore(); };
  if (rimC) { body(rimC, lightDx); }
  body(col, 0); wpn(col, 0, false);
  if (rimC && kind !== 'banner') { c.globalAlpha = 0.85; wpn(col, 0, true); c.globalAlpha = 1; }
  if (kind === 'banner') wpn(col, 0, true);
}
function army(c, rows, o = {}) {
  const r = rng(o.seed ?? 3);
  for (const row of rows) { const items = [];
    for (let i = 0; i < row.n; i++) items.push({ x: lerp(row.x0, row.x1, (i + r() * 0.8) / row.n), h: lerp(row.h0, row.h1, r()), k: row.kinds[Math.floor(r() * row.kinds.length)], f: row.face ?? (r() < 0.5 ? 1 : -1), ph: r() * TAU, kt: r() < (row.kettle ?? 0.35), dy: (r() - 0.5) * (row.jit ?? 14) });
    items.sort((a, b) => a.h - b.h);
    for (const it of items) grunt(c, it.x, row.y + it.dy, it.h, row.col, row.rim, it.k, it.f, it.ph, row.lightDx ?? -3, it.kt); }
}
const MIX = ['spear', 'spear', 'bill', 'fork', 'bow', 'sword', 'spear', 'bill', 'banner'];

// ------------------------------------------------------------ the hero: an original poor man — gaunt, stubbled, scarred, patched hood, rope belt (2D comic style, units of head radius)
function hero(c, x, y, r, o = {}) {
  const f = o.face ?? 1, pose = o.pose ?? 'raise', hoodC = o.hood ?? '#7E2A22', tun = o.tunic ?? '#7A6648';
  const INK = '#0C0907', SK = '#D5A47A', SKd = '#A8704C', HAIR = '#2B1D14', STEEL = '#C9CED2', O = 0.085;
  c.save(); c.translate(x, y); c.scale(r * f, r); c.lineJoin = 'round'; c.lineCap = 'round';
  const fs_ = (col, w = O) => { c.fillStyle = col; c.fill(); c.strokeStyle = INK; c.lineWidth = w; c.stroke(); };
  const limb = (pts, w, col) => { c.beginPath(); pts.forEach(([a, b], i) => i ? c.lineTo(a, b) : c.moveTo(a, b)); c.strokeStyle = INK; c.lineWidth = w + O * 1.8; c.stroke(); c.strokeStyle = col; c.lineWidth = w; c.stroke(); };
  const sword = (gx, gy, ang, len, hw = 0.26) => { c.save(); c.translate(gx, gy); c.rotate(ang);
    c.beginPath(); c.moveTo(-hw, 0); c.lineTo(-hw * 0.9, -len * 0.92); c.lineTo(0, -len); c.lineTo(hw * 0.9, -len * 0.92); c.lineTo(hw, 0); c.closePath(); fs_(STEEL, O * 0.9);
    c.strokeStyle = '#7C858C'; c.lineWidth = 0.05; c.beginPath(); c.moveTo(0, -0.1); c.lineTo(0, -len * 0.88); c.stroke(); c.strokeStyle = '#F4F7F8'; c.lineWidth = 0.035; c.beginPath(); c.moveTo(-hw * 0.55, -0.15); c.lineTo(-hw * 0.5, -len * 0.8); c.stroke();
    c.beginPath(); c.roundRect(-0.85, 0, 1.7, 0.26, 0.1); fs_('#8A6B27', O * 0.8); // crossguard
    c.beginPath(); c.rect(-0.12, 0.26, 0.24, 0.9); fs_('#3B2A1C', O * 0.8); c.beginPath(); c.arc(0, 1.3, 0.2, 0, TAU); fs_('#8A6B27', O * 0.8); c.restore(); };
  // hood (back)
  c.beginPath(); c.moveTo(-1.5, 2.2); c.bezierCurveTo(-1.95, 0.5, -1.8, -1.6, 0, -1.85); c.bezierCurveTo(1.8, -1.6, 1.95, 0.5, 1.5, 2.2); c.closePath(); fs_(mixColor(hoodC, '#000', 0.25));
  // torso — ragged tunic
  c.beginPath(); c.moveTo(-0.6, 1.0); c.lineTo(-2.45, 1.75); c.bezierCurveTo(-2.75, 3, -2.4, 6, -2.2, 10); c.lineTo(2.2, 10); c.bezierCurveTo(2.4, 6, 2.75, 3, 2.45, 1.75); c.lineTo(0.6, 1.0); c.closePath(); fs_(tun);
  c.save(); c.clip(); // patches, tears, strap, rope
  c.fillStyle = '#4F5F4A'; c.save(); c.translate(-1.3, 4.1); c.rotate(-0.12); c.fillRect(-0.6, -0.5, 1.2, 1.0); c.strokeStyle = '#201710'; c.lineWidth = 0.05; c.setLineDash([0.12, 0.1]); c.strokeRect(-0.6, -0.5, 1.2, 1.0); c.restore();
  c.fillStyle = '#8B3A2E'; c.save(); c.translate(1.15, 5.7); c.rotate(0.15); c.fillRect(-0.55, -0.45, 1.1, 0.9); c.strokeStyle = '#201710'; c.lineWidth = 0.05; c.setLineDash([0.12, 0.1]); c.strokeRect(-0.55, -0.45, 1.1, 0.9); c.restore(); c.setLineDash([]);
  c.strokeStyle = '#1B120C'; c.lineWidth = 0.07; c.beginPath(); c.moveTo(-1.9, 2.4); c.lineTo(-1.6, 2.9); c.lineTo(-1.95, 3.3); c.lineTo(-1.55, 3.8); c.stroke();
  c.beginPath(); c.moveTo(0.4, 7.2); c.lineTo(0.7, 7.7); c.lineTo(0.35, 8.1); c.stroke();
  limb([[-2.0, 1.9], [1.7, 7.6]], 0.34, '#3B2A1C'); // leather strap
  limb([[-2.3, 7.4], [2.3, 7.0]], 0.2, '#B79A68'); // rope belt
  c.restore();
  // chest opening
  c.beginPath(); c.moveTo(-0.6, 1.0); c.lineTo(0, 2.5); c.lineTo(0.6, 1.0); c.closePath(); fs_(SKd, O * 0.8);
  c.strokeStyle = INK; c.lineWidth = 0.05; for (const [a, b] of [[-0.15, 1.6], [0.1, 1.75]]) { c.beginPath(); c.moveTo(a, b); c.lineTo(a + 0.1, b + 0.2); c.stroke(); } // collarbones
  // arms + sword
  if (pose === 'raise') {
    const ang = o.swordAng ?? 0.38, len = o.swordLen ?? 4.6, fx = 2.65, fy = o.fistY ?? 0.2;
    limb([[-2.0, 2.1], [-2.55, 4.5], [-2.25, 6.6]], 0.85, mixColor(tun, '#000', 0.1)); c.beginPath(); c.arc(-2.25, 6.75, 0.34, 0, TAU); fs_(SK, O * 0.8);
    sword(fx, fy - 0.1, ang, len);
    const ex_ = o.elbX ?? 3.0, ey_ = o.elbY ?? 1.1; limb([[2.05, 2.1], [ex_, ey_]], 0.9, tun); limb([[ex_, ey_], [fx + 0.05, fy + 0.25]], 0.62, SK); // sleeve, bare forearm
    c.beginPath(); c.arc(fx, fy + 0.1, 0.42, 0, TAU); fs_(SK, O * 0.9); c.strokeStyle = INK; c.lineWidth = 0.05; for (const dy of [-0.1, 0.08, 0.25]) { c.beginPath(); c.moveTo(fx - 0.38, fy + dy); c.lineTo(fx + 0.3, fy + dy); c.stroke(); }
  } else if (pose === 'planted') { // two fists stacked on the pommel, blade down out of frame
    const py = o.pommY ?? 4.6;
    c.save(); c.translate(0, py); c.beginPath(); c.roundRect(-0.85, 1.3, 1.7, 0.26, 0.1); fs_('#8A6B27', O * 0.8); c.beginPath(); c.moveTo(-0.26, 1.55); c.lineTo(-0.24, 9); c.lineTo(0, 9.4); c.lineTo(0.24, 9); c.lineTo(0.26, 1.55); c.closePath(); fs_(STEEL, O * 0.9);
    c.strokeStyle = '#F4F7F8'; c.lineWidth = 0.035; c.beginPath(); c.moveTo(-0.1, 1.8); c.lineTo(-0.1, 8); c.stroke(); c.beginPath(); c.rect(-0.12, 0.2, 0.24, 1.1); fs_('#3B2A1C', O * 0.8); c.beginPath(); c.arc(0, 0.05, 0.22, 0, TAU); fs_('#8A6B27', O * 0.8); c.restore();
    limb([[-2.05, 2.2], [-2.45, 4.3], [-0.3, py + 0.75]], 0.85, tun); limb([[2.05, 2.2], [2.45, 4.3], [0.3, py + 0.4]], 0.85, tun);
    c.beginPath(); c.arc(-0.3, py + 0.8, 0.4, 0, TAU); fs_(SK, O * 0.8); c.beginPath(); c.arc(0.3, py + 0.35, 0.4, 0, TAU); fs_(SK, O * 0.8);
  }
  // neck
  c.beginPath(); c.moveTo(-0.5, 0.6); c.lineTo(-0.52, 1.35); c.lineTo(0.52, 1.35); c.lineTo(0.5, 0.6); c.closePath(); fs_(SKd, O * 0.8);
  // head (tilted slightly)
  c.save(); c.translate(0, 1.0); c.rotate(o.tilt ?? 0.06); c.translate(0, -1.0);
  for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * 0.95, 0.12, 0.17, 0.27, 0, 0, TAU); fs_(SKd, O * 0.8); }
  const headPath = () => { c.beginPath(); c.moveTo(-0.92, -0.15); c.bezierCurveTo(-0.95, -0.9, -0.5, -1.18, 0, -1.18); c.bezierCurveTo(0.5, -1.18, 0.95, -0.9, 0.92, -0.15); c.bezierCurveTo(0.9, 0.5, 0.62, 1.0, 0.3, 1.24); c.quadraticCurveTo(0, 1.36, -0.3, 1.24); c.bezierCurveTo(-0.62, 1.0, -0.9, 0.5, -0.92, -0.15); c.closePath(); };
  headPath(); fs_(SK);
  c.save(); headPath(); c.clip();
  c.fillStyle = 'rgba(70,30,18,0.30)'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * 0.58, 0.45, 0.26, 0.42, s * 0.25, 0, TAU); c.fill(); } // hollow cheeks
  c.fillStyle = 'rgba(70,30,18,0.18)'; c.beginPath(); c.ellipse(0, 0.62, 0.35, 0.07, 0, 0, TAU); c.fill();
  // stubble: tinted jaw plus dots
  c.fillStyle = 'rgba(38,26,18,0.34)'; c.beginPath(); c.moveTo(-0.95, 0.15); c.bezierCurveTo(-0.9, 0.7, -0.5, 1.15, 0, 1.3); c.bezierCurveTo(0.5, 1.15, 0.9, 0.7, 0.95, 0.15); c.lineTo(0.6, 0.45); c.bezierCurveTo(0.3, 0.56, 0.2, 0.52, 0, 0.55); c.bezierCurveTo(-0.2, 0.52, -0.3, 0.56, -0.6, 0.45); c.closePath(); c.fill();
  const rr = rng(77); c.fillStyle = 'rgba(22,14,10,0.7)'; for (let i = 0; i < 260; i++) { const px = (rr() - 0.5) * 1.8, py2 = 0.35 + rr() * 0.95; if (Math.abs(px) < 0.95 - (py2 - 0.2) * 0.45) { c.beginPath(); c.arc(px, py2, 0.012 + rr() * 0.012, 0, TAU); c.fill(); } }
  c.fillStyle = 'rgba(60,40,26,0.35)'; for (const [dx, dy, rx2, ry2] of [[-0.55, -0.35, 0.18, 0.1], [0.35, 0.15, 0.14, 0.09], [-0.2, 0.9, 0.16, 0.08]]) { c.beginPath(); c.ellipse(dx, dy, rx2, ry2, 0.4, 0, TAU); c.fill(); } // grime
  c.restore();
  headPath(); c.strokeStyle = INK; c.lineWidth = O; c.stroke();
  // eyes: cream, pupils up and forward — set, defiant
  for (const s of [-1, 1]) { const ex = s * 0.4, ey = -0.1;
    c.fillStyle = '#F1E8D6'; c.beginPath(); c.ellipse(ex, ey, 0.21, 0.115, 0, 0, TAU); c.fill(); c.strokeStyle = INK; c.lineWidth = 0.045; c.stroke();
    c.fillStyle = '#2B1A10'; c.beginPath(); c.arc(ex + 0.05, ey - 0.01, 0.085, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(ex + 0.075, ey - 0.04, 0.025, 0, TAU); c.fill();
    c.strokeStyle = INK; c.lineWidth = 0.07; c.beginPath(); c.moveTo(ex - 0.23, ey - 0.02); c.quadraticCurveTo(ex, ey - 0.15, ex + 0.23, ey - 0.03); c.stroke(); // upper lid
    c.fillStyle = 'rgba(60,30,24,0.4)'; c.beginPath(); c.ellipse(ex, ey + 0.17, 0.22, 0.06, 0, 0, TAU); c.fill(); } // eye bags
  c.strokeStyle = HAIR; c.lineWidth = 0.13; c.beginPath(); c.moveTo(-0.7, -0.33); c.lineTo(-0.14, -0.2); c.stroke(); c.beginPath(); c.moveTo(0.14, -0.2); c.lineTo(0.7, -0.33); c.stroke(); // brows pulled in
  c.strokeStyle = SKd; c.lineWidth = 0.07; c.beginPath(); c.moveTo(0.0, -0.05); c.lineTo(-0.04, 0.38); c.stroke(); c.beginPath(); c.moveTo(-0.14, 0.4); c.quadraticCurveTo(0, 0.5, 0.14, 0.4); c.stroke(); // nose
  c.strokeStyle = '#5A261C'; c.lineWidth = 0.075; c.beginPath(); c.moveTo(-0.28, 0.8); c.quadraticCurveTo(0, 0.74, 0.3, 0.8); c.stroke(); // grim mouth
  c.strokeStyle = '#C47A68'; c.lineWidth = 0.05; c.beginPath(); c.moveTo(-0.62, -0.5); c.lineTo(-0.28, 0.42); c.stroke(); c.lineWidth = 0.035; for (const k of [0.15, 0.4, 0.65]) { const px = lerp(-0.62, -0.28, k), py2 = lerp(-0.5, 0.42, k); c.beginPath(); c.moveTo(px - 0.07, py2 - 0.03); c.lineTo(px + 0.07, py2 + 0.03); c.stroke(); } // scar with stitches
  // hair fringe + hood lip
  c.beginPath(); c.moveTo(-0.97, -0.1); c.lineTo(-0.95, -1.0); c.lineTo(0.95, -1.0); c.lineTo(0.97, -0.1); c.lineTo(0.8, -0.4); c.lineTo(0.62, -0.3); c.lineTo(0.42, -0.58); c.lineTo(0.2, -0.45); c.lineTo(-0.05, -0.62); c.lineTo(-0.3, -0.42); c.lineTo(-0.52, -0.55); c.lineTo(-0.72, -0.36); c.lineTo(-0.85, -0.45); c.closePath(); fs_(HAIR, O * 0.6);
  c.beginPath(); c.moveTo(-1.1, 0.7); c.bezierCurveTo(-1.3, -0.9, -0.75, -1.65, 0, -1.65); c.bezierCurveTo(0.75, -1.65, 1.3, -0.9, 1.1, 0.7); c.bezierCurveTo(1.05, -0.1, 0.95, -0.55, 0.65, -0.8); c.bezierCurveTo(0.3, -1.0, -0.3, -1.0, -0.65, -0.8); c.bezierCurveTo(-0.95, -0.55, -1.05, -0.1, -1.1, 0.7); c.closePath(); fs_(hoodC);
  c.strokeStyle = 'rgba(0,0,0,0.35)'; c.lineWidth = 0.05; c.beginPath(); c.moveTo(-0.9, -1.1); c.lineTo(-0.7, -0.95); c.moveTo(0.85, -1.15); c.lineTo(0.62, -0.97); c.stroke(); // stitching on the hood
  c.restore(); // head tilt
  c.restore();
}
// draw the hero onto its own layer so a warm rim light can wrap one edge and the far side falls into shadow
function placeHero(c, o, rimCol = '#F59A3A', off = 10, dark = 0.5) {
  const [L, lx] = makeCanvas(); hero(lx, o.x, o.y, o.r, o);
  lx.globalCompositeOperation = 'source-atop';
  const side = o.lightSide ?? -1, gx0 = o.x + side * o.r * 2.4, gx1 = o.x - side * o.r * 2.4, g = lx.createLinearGradient(gx0, 0, gx1, 0);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.4, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(8,4,2,${dark})`); lx.fillStyle = g; lx.fillRect(0, 0, W, H);
  const gw = lx.createRadialGradient(o.x + side * o.r * 1.2, o.y, o.r * 0.2, o.x + side * o.r * 1.2, o.y, o.r * 3.2); gw.addColorStop(0, 'rgba(255,170,80,0.28)'); gw.addColorStop(1, 'rgba(255,170,80,0)'); lx.fillStyle = gw; lx.fillRect(0, 0, W, H);
  const [S, sx] = makeCanvas(); sx.drawImage(L, 0, 0); sx.globalCompositeOperation = 'source-in'; sx.fillStyle = rimCol; sx.fillRect(0, 0, W, H);
  c.drawImage(S, side * off, -off * 0.3); c.drawImage(S, side * off * 0.5, -off * 0.15); c.drawImage(L, 0, 0);
}
// full-body version: the film's own figure system, same hero costume, with a large hand-placed sword
function handPos(x, y, h, spec, pose) {
  const f = pose.face ?? 1, b = spec.build ?? 1, u = h, ang = (pose.armF ?? 8) * Math.PI / 180, elb = (pose.elbF ?? 10) * Math.PI / 180;
  const sx = 0.07 * u * b, sy = -0.75 * u + 0.02 * u, ex = sx + Math.sin(ang) * 0.17 * u, ey = sy + Math.cos(ang) * 0.17 * u, a2 = ang + elb;
  return [x + f * (ex + Math.sin(a2) * 0.16 * u), y + (ey + Math.cos(a2) * 0.16 * u)];
}
function bigSword(c, hx, hy, ang, len, face = 1) { c.save(); c.translate(hx, hy); c.rotate(ang); c.scale(face, 1);
  c.fillStyle = '#3B2A1C'; c.fillRect(-len * 0.1, -len * 0.014, len * 0.12, len * 0.028); c.fillStyle = '#8A6B27'; c.fillRect(len * 0.02, -len * 0.065, len * 0.022, len * 0.13);
  c.fillStyle = '#D6DBDF'; c.beginPath(); c.moveTo(len * 0.042, -len * 0.026); c.lineTo(len * 0.95, -len * 0.02); c.lineTo(len, 0); c.lineTo(len * 0.95, len * 0.02); c.lineTo(len * 0.042, len * 0.026); c.closePath(); c.fill();
  c.strokeStyle = '#fff'; c.globalAlpha = 0.7; c.lineWidth = len * 0.006; c.beginPath(); c.moveTo(len * 0.06, -len * 0.01); c.lineTo(len * 0.9, -len * 0.008); c.stroke(); c.restore(); }
function eye(c, x, y, h, spec, face = 1) { const hr = 0.062 * h, hx = x + face * (0.006 * h + hr * 0.42), hy = y - 0.865 * h - hr * 0.1;
  c.save(); c.fillStyle = '#EDE3CF'; c.beginPath(); c.ellipse(hx, hy, hr * 0.2, hr * 0.12, 0, 0, TAU); c.fill(); c.fillStyle = '#120E0A'; c.beginPath(); c.arc(hx + face * hr * 0.07, hy, hr * 0.085, 0, TAU); c.fill();
  c.strokeStyle = '#0A0806'; c.lineWidth = hr * 0.07; c.lineCap = 'round'; c.beginPath(); c.moveTo(hx - face * hr * 0.25, hy - hr * 0.26); c.lineTo(hx + face * hr * 0.22, hy - hr * 0.12); c.stroke(); c.restore(); }
function dark(spec, a) { const d = { ...spec }; for (const k of ['tunic', 'hood', 'hose', 'belt', 'robe']) if (d[k]) d[k] = mixColor(d[k], '#000000', a); return d; }
function rimFig(c, x, y, h, spec, pose, col, off) { c.save(); c.globalAlpha = 0.9; A.figure(c, x + off, y - off * 0.4, h, { ...dark(spec, 1), tunic: col, hood: col, hose: col, belt: col, robe: col }, pose); c.restore(); }

// ============================================================ 1 · hero with sword, army behind, headline right
{ const [c, x] = makeCanvas();
  sky(x, FIRE); PL.sun(x, 1450, 760, 760, 'rgba(255,214,140,0.5)'); A.smoke(x, 1250, 380, t, 2.6, 33, 'rgba(20,12,10,0.38)');
  A.hills(x, 840, 40, 21, '#3A1E12');
  army(x, [
    { y: 820, h0: 230, h1: 270, n: 34, x0: -40, x1: 1960, col: '#4A1E14', rim: '#E07A2A', kinds: MIX, lightDx: -2 },
    { y: 900, h0: 320, h1: 380, n: 22, x0: -40, x1: 1960, col: '#2C120C', rim: '#E8832E', kinds: MIX, lightDx: -3 },
    { y: 990, h0: 430, h1: 500, n: 12, x0: 330, x1: 1960, col: '#180A06', rim: '#F59A3A', kinds: MIX, lightDx: -4, jit: 20 } ], { seed: 8 });
  x.fillStyle = 'rgba(20,6,2,0.28)'; x.fillRect(0, 0, W, H);
  placeHero(x, { x: 470, y: 690, r: 168, pose: 'raise', lightSide: 1, swordAng: 0.18, swordLen: 4.4, fistY: 0.5 }, '#F59A3A', 12, 0.55);
  grade(x, 0.55);
  head(x, [{ t: 'THE PEASANTS’' }], 1850, 250, 168, 'right'); head(x, [{ t: 'REVOLT', c: RED }], 1850, 480, 270, 'right'); head(x, [{ t: '1381', c: YEL }], 1850, 700, 210, 'right');
  save(c, '1_hero_leads_the_army'); }

// ============================================================ 2 · poster-style (own layout): hero centred, host in tiers, banners, THE UPRISING
{ const [c, x] = makeCanvas();
  sky(x, BLOOD); PL.sun(x, 960, 560, 640, 'rgba(255,190,120,0.55)');
  x.fillStyle = 'rgba(12,4,4,0.55)'; x.beginPath(); x.arc(960, 520, 360, 0, TAU); x.fill(); // dark halo disc behind the head
  A.hills(x, 860, 30, 21, '#2A0F0C');
  for (const s of [-1, 1]) army(x, [
    { y: 760, h0: 230, h1: 270, n: 12, x0: s < 0 ? -40 : 1160, x1: s < 0 ? 760 : 1960, col: '#4A1612', rim: '#E8672A', kinds: MIX, lightDx: -2 },
    { y: 850, h0: 330, h1: 390, n: 9, x0: s < 0 ? -40 : 1160, x1: s < 0 ? 700 : 1960, col: '#2A0D0A', rim: '#EE7A2E', kinds: MIX, lightDx: -3 },
    { y: 960, h0: 430, h1: 500, n: 5, x0: s < 0 ? -40 : 1260, x1: s < 0 ? 600 : 1960, col: '#160706', rim: '#F59A3A', kinds: MIX, lightDx: -4, jit: 20 } ], { seed: s < 0 ? 4 : 14 });
  placeHero(x, { x: 960, y: 500, r: 196, pose: 'raise', lightSide: 1, swordAng: -0.04, swordLen: 4.6, fistY: 2.6, elbX: 3.3, elbY: 4.4, tilt: 0.03 }, '#FFB060', 12, 0.5);
  grade(x, 0.55);
  head(x, [{ t: 'THE UPRISING' }], 960, 975, 205, 'center');
  head(x, [{ t: 'PEASANTS’ REVOLT', c: RED }, { t: '1381', c: YEL }], 960, 130, 100, 'center', 12);
  save(c, '2_poster_the_uprising'); }

// ============================================================ 3 · the charge — full-body hero leads left, the host streams behind him
{ const [c, x] = makeCanvas();
  sky(x, DAWN); PL.sun(x, 420, 780, 640, 'rgba(255,214,150,0.6)'); A.hills(x, 880, 50, 5, '#1B2430');
  for (let i = 0; i < 16; i++) { const rr = rng(i + 5); puff(x, '#C8A878', 500 + rr() * 1500, 900 + rr() * 60, 110 + rr() * 140, 0.22, 0.2); }
  army(x, [
    { y: 850, h0: 250, h1: 290, n: 30, x0: 520, x1: 2000, col: '#2A3442', rim: '#F0A860', kinds: MIX, face: -1, lightDx: -3 },
    { y: 940, h0: 360, h1: 410, n: 17, x0: 820, x1: 2000, col: '#161C26', rim: '#F5B070', kinds: MIX, face: -1, lightDx: -3 },
    { y: 1040, h0: 500, h1: 560, n: 7, x0: 1300, x1: 2000, col: '#0C0F14', rim: '#FFC080', kinds: MIX, face: -1, lightDx: -4, jit: 20 } ], { seed: 21 });
  placeHero(x, { x: 1500, y: 700, r: 165, face: -1, pose: 'raise', hood: '#8E2A22', lightSide: -1, swordAng: 0.3, swordLen: 4.4, fistY: 0.5 }, '#FFC080', 12, 0.5);
  grade(x, 0.5);
  head(x, [{ t: 'THE PEASANTS’' }], 70, 240, 150); head(x, [{ t: 'REVOLT', c: RED }], 70, 450, 240); head(x, [{ t: '1381', c: YEL }], 70, 640, 190);
  save(c, '3_the_charge'); }

// ============================================================ 4 · major event: Smithfield — the poor man faces the boy king and the bows
{ const [c, x] = makeCanvas();
  withCam(x, { x: 1050, y: 700, s: 1.35 }, () => {
    PL.smithfield(x, t, { sky: 'storm', tint: '#3A1A12', tintA: 0.4, far: '#4A3A2E', prioryCol: '#2E241C' });
    A.crowd(x, { x0: 1000, x1: 2300, y: 800, n: 120, hMin: 120, hMax: 210, depth: 200, seed: 5, t, red: 1, face: -1, raise: 1, allBows: true, agit: 0.2 }); });
  x.save(); x.globalCompositeOperation = 'multiply'; const rg = x.createLinearGradient(0, 0, W, 0); rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(1, 'rgba(225,150,130,1)'); x.fillStyle = rg; x.fillRect(0, 0, W, H); x.restore();
  A.rider(x, 1330, 1040, 430, CH.richard, { face: -1, ...RICHARD_HORSE, t });
  army(x, [{ y: 1060, h0: 560, h1: 620, n: 5, x0: -20, x1: 420, col: '#120806', rim: '#E8832E', kinds: ['spear', 'bill', 'banner', 'fork'], lightDx: -4, jit: 12 }], { seed: 31 });
  placeHero(x, { x: 330, y: 700, r: 190, pose: 'raise', lightSide: 1, swordAng: 0.4, swordLen: 4.0, fistY: 0.8 }, '#F59A3A', 12, 0.55);
  grade(x, 0.6);
  head(x, [{ t: 'THE PEASANTS’' }], 1850, 190, 150, 'right'); head(x, [{ t: 'REVOLT', c: RED }, { t: '1381', c: YEL }], 1850, 395, 215, 'right');
  save(c, '4_event_smithfield'); }

// ============================================================ 5 · major event: London burns — the host across the bridge, the poor man in the foreground
{ const [c, x] = makeCanvas();
  x.drawImage(blurred(b => withCam(b, { x: 900, y: 640, s: 1.7 }, () => { PL.london(b, t, { sky: 'fire', night: 0.12, savoyFire: 1 });
    A.flames(b, 760, 742, 900, 300, t, 77, 12); A.smoke(b, 800, 520, t, 2.2, 78, 'rgba(30,22,18,0.4)');
    b.save(); b.beginPath(); b.rect(-200, 0, 2400, 742); b.clip(); A.crowd(b, { x0: 330, x1: 1430, y: 741, n: 70, hMin: 36, hMax: 46, depth: 3, seed: 11, t, red: 1, face: -1 }); b.restore(); }), 2), 0, 0);
  const gl = x.createRadialGradient(500, 700, 40, 500, 700, 900); gl.addColorStop(0, 'rgba(255,150,60,0.45)'); gl.addColorStop(1, 'rgba(255,120,40,0)'); x.fillStyle = gl; x.fillRect(0, 0, W, H);
  army(x, [{ y: 1070, h0: 520, h1: 580, n: 6, x0: 900, x1: 1960, col: '#110705', rim: '#F59A3A', kinds: ['spear', 'banner', 'bill', 'fork', 'spear'], face: -1, lightDx: -4, jit: 12 }], { seed: 12 });
  placeHero(x, { x: 1420, y: 640, r: 200, face: -1, pose: 'raise', lightSide: -1, swordAng: 0.36, swordLen: 4.0, fistY: 0.8 }, '#FFA040', 12, 0.5);
  grade(x, 0.5);
  head(x, [{ t: 'THE UPRISING' }], 70, 250, 210); head(x, [{ t: '1381', c: RED }], 70, 500, 270);
  save(c, '5_event_london_burns'); }

// ============================================================ 6 · the face — extreme close-up, the host behind
{ const [c, x] = makeCanvas();
  sky(x, FIRE); PL.sun(x, 480, 760, 700, 'rgba(255,214,140,0.5)'); A.smoke(x, 500, 380, t, 2.6, 33, 'rgba(20,12,10,0.38)'); A.hills(x, 900, 40, 21, '#3A1E12');
  army(x, [
    { y: 860, h0: 230, h1: 270, n: 26, x0: -40, x1: 1100, col: '#4A1E14', rim: '#E07A2A', kinds: MIX, lightDx: 2 },
    { y: 950, h0: 330, h1: 390, n: 15, x0: -40, x1: 1000, col: '#2C120C', rim: '#E8832E', kinds: MIX, lightDx: 3 },
    { y: 1050, h0: 450, h1: 520, n: 6, x0: -40, x1: 900, col: '#180A06', rim: '#F59A3A', kinds: MIX, lightDx: 4, jit: 14 } ], { seed: 18 });
  x.fillStyle = 'rgba(20,6,2,0.25)'; x.fillRect(0, 0, W, H);
  placeHero(x, { x: 1400, y: 560, r: 330, pose: 'none', lightSide: -1, tilt: 0.05 }, '#F59A3A', 16, 0.55);
  grade(x, 0.55);
  head(x, [{ t: 'THE' }], 70, 215, 150); head(x, [{ t: 'PEASANTS’', c: CREAM }], 70, 400, 190); head(x, [{ t: 'REVOLT', c: RED }], 70, 640, 270); head(x, [{ t: '1381', c: YEL }], 70, 850, 190);
  save(c, '6_the_face'); }
console.log('ok');
