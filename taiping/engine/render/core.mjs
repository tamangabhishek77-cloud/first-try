// Core: canvas, palette, fonts, timing, easing, textures, camera.
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import fs from 'fs';

export const W = 1920, H = 1080, FPS = 25;
const ROOT = '/home/claude/project';

// ---- palette (house style) ----
export const P = {
  parch: '#EDE3CF', parch2: '#E3D6BA', parch3: '#D8C7A3', paper: '#F6EFE0',
  ink: '#15130F', ink2: '#2A241D', ink3: '#4A4036', sepia: '#6E5A43',
  red: '#A3201C', red2: '#C2402F', gold: '#C8A04A', gold2: '#E2C47A', blue: '#3E5C76', blue2: '#6C8AA3',
  grey: '#5B5E63', smoke: '#8C8A84', sea: '#C2C6BC', sea2: '#AEB5AC', night: '#1C2029', dusk: '#B88A5A',
  crowd: '#5E5242', crowdBack: '#8E8270', fire1: '#E8A43A', fire2: '#D2582A', fire3: '#F3D27A', skin: '#2A241D'
};

// ---- fonts ----
const F = ROOT + '/fonts/';
GlobalFonts.registerFromPath(F + 'BodoniModa_opsz_wght_.ttf', 'Bodoni');
GlobalFonts.registerFromPath(F + 'BodoniModa-Italic_opsz_wght_.ttf', 'BodoniItalic');
GlobalFonts.registerFromPath(F + 'PinyonScript-Regular.ttf', 'Pinyon');
GlobalFonts.registerFromPath(F + 'Oswald_wght_.ttf', 'Oswald');
GlobalFonts.registerFromPath(F + 'IMFeENrm28P.ttf', 'Fell');
GlobalFonts.registerFromPath(F + 'IMFeENit28P.ttf', 'FellItalic');
GlobalFonts.registerFromPath(F + 'Cinzel_wght_.ttf', 'Cinzel');
GlobalFonts.registerFromPath(F + 'UnifrakturMaguntia-Book.ttf', 'UnifrakturMaguntia');

// ---- timeline ----
export const TL = JSON.parse(fs.readFileSync(ROOT + '/timeline.json', 'utf8'));
const FR = Object.fromEntries(TL.frags.map(f => [f.id, f]));
export const T = {
  f: id => FR[id].start,                       // fragment start
  e: id => FR[id].start + FR[id].dur,           // fragment end
  d: id => FR[id].dur,
  // time of a word inside a fragment (first word starting with `w`, case-insensitive)
  w: (id, w, nth = 1) => {
    const fr = FR[id]; const lw = w.toLowerCase(); let k = 0;
    for (const x of fr.words) { if (x.w.toLowerCase().replace(/[^a-z0-9'’-]/g, '').startsWith(lw)) { k++; if (k === nth) return x.t; } }
    throw new Error(`word "${w}" not in ${id}: ${fr.text}`);
  },
  frag: id => FR[id],
  chapters: TL.chapters,
  duration: TL.duration
};

// ---- math / easing ----
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, u) => a + (b - a) * u;
export const easeIO = u => (u = clamp(u), u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
export const easeOut = u => (u = clamp(u), 1 - Math.pow(1 - u, 3));
export const easeIn = u => (u = clamp(u), u * u * u);
export const backOut = u => { u = clamp(u); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
// 0→1 from t0 over d seconds
export const ramp = (t, t0, d = 0.5, ease = easeOut) => ease((t - t0) / d);
// alpha envelope: in at t0 (fade fi), out at t1 (fade fo)
export const life = (t, t0, t1 = 1e9, fi = 0.35, fo = 0.35) => clamp(Math.min((t - t0) / fi, (t1 - t) / fo));
export function mixColor(a, b, u) {
  const pa = hex(a), pb = hex(b);
  return `rgb(${Math.round(lerp(pa[0], pb[0], u))},${Math.round(lerp(pa[1], pb[1], u))},${Math.round(lerp(pa[2], pb[2], u))})`;
}
export function hex(c) { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
export function rgba(c, a) { const [r, g, b] = hex(c); return `rgba(${r},${g},${b},${a})`; }

// seeded RNG (mulberry32)
export function rng(seed) { let s = seed >>> 0; return () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export const noise1 = (x, seed = 0) => { // smooth 1-D value noise in [-1,1]
  const i = Math.floor(x), f = x - i; const h = n => { const r = rng((n * 374761393 + seed * 668265263) >>> 0); return r() * 2 - 1; };
  const u = f * f * (3 - 2 * f); return lerp(h(i), h(i + 1), u);
};

// ---- soft round sprites (replace per-draw blur filters, which are very slow): cached per colour/hardness
const SPR = new Map();
export function soft(color, hard = 0) {
  const key = color + '|' + hard; let s = SPR.get(key); if (s) return s;
  const [cv, x] = makeCanvas(128, 128); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  const [r, gg, b] = color.startsWith('#') ? hex(color) : color.match(/[0-9.]+/g).slice(0, 3).map(Number);
  g.addColorStop(0, `rgba(${r},${gg},${b},1)`); g.addColorStop(hard, `rgba(${r},${gg},${b},${hard ? 0.95 : 1})`); g.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  x.fillStyle = g; x.fillRect(0, 0, 128, 128); SPR.set(key, cv); return cv;
}
export function puff(ctx, color, x, y, rad, alpha = 1, hard = 0) { if (alpha <= 0) return; const a0 = ctx.globalAlpha; ctx.globalAlpha = a0 * alpha; ctx.drawImage(soft(color, hard), x - rad, y - rad, rad * 2, rad * 2); ctx.globalAlpha = a0; }
// parse 'rgba(r,g,b,a)' → [hex-ish colour, alpha]
export function splitRGBA(col) { const m = col.match(/[0-9.]+/g).map(Number); return [`rgb(${m[0]},${m[1]},${m[2]})`, m[3] ?? 1]; }

// ---- offscreen helper ----
export function makeCanvas(w = W, h = H) { const c = createCanvas(w, h); return [c, c.getContext('2d')]; }

// ---- textures (built once) ----
function buildParchment(w, h, seed, base = P.parch) {
  const [c, x] = makeCanvas(w, h); const r = rng(seed);
  x.fillStyle = base; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 260; i++) { // stains and blotches
    const px = r() * w, py = r() * h, rad = 30 + r() * 260, dark = r() < 0.65;
    const g = x.createRadialGradient(px, py, 0, px, py, rad);
    const a = 0.025 + r() * 0.05;
    g.addColorStop(0, dark ? `rgba(120,90,50,${a})` : `rgba(255,250,235,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.beginPath(); x.arc(px, py, rad, 0, Math.PI * 2); x.fill();
  }
  x.lineCap = 'round';
  for (let i = 0; i < 2600; i++) { // fibres
    const px = r() * w, py = r() * h, len = 4 + r() * 26, ang = r() * Math.PI;
    x.strokeStyle = `rgba(90,70,40,${0.02 + r() * 0.05})`; x.lineWidth = 0.6 + r() * 0.8;
    x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(ang) * len * 0.5 + (r() - 0.5) * 4, py + Math.sin(ang) * len * 0.5 + (r() - 0.5) * 4, px + Math.cos(ang) * len, py + Math.sin(ang) * len); x.stroke();
  }
  const id = x.getImageData(0, 0, w, h), d = id.data; // fine grain baked in
  for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * 16; d[i] += n; d[i + 1] += n; d[i + 2] += n * 0.9; }
  x.putImageData(id, 0, 0);
  // edge burn
  const g = x.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.72);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(90,60,30,0.28)');
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  return c;
}
export const TEX = {};
TEX.parch = buildParchment(2112, 1188, 11);
TEX.parchLight = buildParchment(1400, 1000, 23, P.paper);
TEX.grain = Array.from({ length: 6 }, (_, k) => {
  const [c, x] = makeCanvas(960, 540); const id = x.createImageData(960, 540), d = id.data, r = rng(100 + k);
  for (let i = 0; i < d.length; i += 4) { const v = 128 + (r() - 0.5) * 120; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
  x.putImageData(id, 0, 0); return c;
});
TEX.vignette = (() => {
  const [c, x] = makeCanvas(W, H); const g = x.createRadialGradient(W / 2, H / 2, H * 0.42, W / 2, H / 2, H * 1.05);
  g.addColorStop(0, 'rgba(20,14,8,0)'); g.addColorStop(1, 'rgba(20,14,8,0.55)'); x.fillStyle = g; x.fillRect(0, 0, W, H); return c;
})();

// draw parchment background with slow drift; tint optional
export function parchment(ctx, t, tint = null, tintA = 0) {
  const ox = -96 + Math.sin(t * 0.05) * 40, oy = -54 + Math.cos(t * 0.04) * 20;
  ctx.drawImage(TEX.parch, ox, oy);
  if (tint && tintA > 0) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = tintA; ctx.fillStyle = tint; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}
// final film look applied to every frame
export function filmLook(ctx, frame) {
  ctx.save();
  ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.10;
  ctx.drawImage(TEX.grain[frame % TEX.grain.length], 0, 0, W, H);
  ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.22; ctx.drawImage(TEX.parch, -96, -54); // paper tooth over every plate
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  ctx.drawImage(TEX.vignette, 0, 0);
  ctx.restore();
}

// camera: slow push/pan around a focus. cam = {x,y,s} in screen units (focus point and scale)
export function withCam(ctx, cam, fn) {
  ctx.save();
  ctx.translate(W / 2, H / 2); ctx.scale(cam.s, cam.s); ctx.translate(-cam.x, -cam.y);
  fn(); ctx.restore();
}
export const push = (lt, dur, s0 = 1.0, s1 = 1.08, x0 = W / 2, y0 = H / 2, x1 = x0, y1 = y0) => {
  const u = easeIO(lt / Math.max(dur, 0.01));
  return { x: lerp(x0, x1, u), y: lerp(y0, y1, u), s: lerp(s0, s1, u) };
};
