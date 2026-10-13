// Art library: every character, horse, crowd, building and landscape element is drawn here once,
// so each appears identically every time it is used (the consistency system).
import { P, W, H, rng, clamp, lerp, mixColor, rgba, noise1, easeOut, puff, splitRGBA } from './core.mjs';

const TAU = Math.PI * 2, rad = d => d * Math.PI / 180;

// ---------------------------------------------------------------- characters (locked specs)
export const CH = {
  tyler:    { name: 'Wat Tyler', role: 'Rebel leader', body: 'tunic', tunic: '#3B2E22', hood: P.red, hose: '#241E18', belt: '#6A5233', build: 1.12 },
  ball:     { name: 'John Ball', role: 'Radical priest', body: 'robe', robe: '#1E1A15', stole: P.red, tonsure: true, build: 0.96 },
  richard:  { name: 'Richard II', role: 'King of England', body: 'robe', robe: P.gold, edge: '#8A6B27', crown: true, build: 0.86, young: true },
  edward:   { name: 'Edward III', role: 'King, 1327–1377', body: 'robe', robe: P.gold, edge: '#8A6B27', crown: true, beard: true, build: 1.0 },
  gaunt:    { name: 'John of Gaunt', role: 'Duke of Lancaster', body: 'robe', robe: '#2B241D', edge: P.gold, ermine: true, cap: P.gold, build: 1.1 },
  walworth: { name: 'William Walworth', role: 'Mayor of London', body: 'robe', robe: P.blue, edge: '#2B4256', fur: true, chain: true, build: 1.08 },
  sudbury:  { name: 'Simon Sudbury', role: 'Archbishop & Chancellor', body: 'robe', robe: '#E6DECA', edge: P.gold, mitre: true, build: 1.0 },
  hales:    { name: 'Robert Hales', role: 'Treasurer of England', body: 'robe', robe: '#1E1A15', cross: '#EDE3CF', coif: '#1E1A15', build: 1.02 },
  bampton:  { name: 'John Bampton', role: 'Tax commissioner', body: 'robe', robe: P.blue, edge: '#2B4256', coif: '#E6DECA', build: 1.0 },
  bealknap: { name: 'Robert Bealknap', role: 'Chief Justice', body: 'robe', robe: P.blue, edge: '#E6DECA', coif: '#E6DECA', fur: true, build: 1.04 },
  baker:    { name: 'Thomas Baker', role: 'of Fobbing', body: 'tunic', tunic: '#7A6548', hood: '#5A4A36', hose: '#3A3026', belt: P.red, build: 1.0 },
  belling:  { name: 'Robert Belling', role: 'Claimed as a serf', body: 'tunic', tunic: '#8A7A60', hood: null, hose: '#4A4036', belt: '#5A4A36', build: 0.98 },
  lord:     { name: 'Lord of the manor', role: '', body: 'robe', robe: '#3A2E22', edge: P.gold, cap: '#3A2E22', build: 1.1 },
  clerk:    { name: 'Clerk', role: '', body: 'robe', robe: '#4A4036', coif: '#E6DECA', build: 0.95 },
  soldier:  { name: 'Soldier', role: '', body: 'tunic', tunic: P.blue, hose: '#2B4256', belt: '#2A241D', helmet: true, build: 1.05 },
  squire:   { name: 'Royal squire', role: '', body: 'tunic', tunic: P.blue, hose: '#2B4256', belt: P.gold, build: 1.0 },
  peasant:  { name: 'Peasant', role: '', body: 'tunic', tunic: '#8C7A5C', hood: '#6E5A43', hose: '#4A4036', belt: '#5A4A36', build: 1.0 },
  peasantR: { name: 'Rebel', role: '', body: 'tunic', tunic: '#6E4A36', hood: P.red, hose: '#3A3026', belt: '#5A4A36', build: 1.0 },
  ploughman:{ name: 'The Ploughman (original lead)', role: 'Rebel leader, thumbnails only', body: 'tunic', tunic: '#7A6648', hood: '#7E2A22', hose: '#3A3026', belt: '#8A7A60', build: 0.92 },
  woman:    { name: 'Peasant woman', role: '', body: 'robe', robe: '#8C7A5C', edge: '#6E5A43', veil: '#E6DECA', build: 0.92 },
  fleming:  { name: 'Fleming', role: '', body: 'tunic', tunic: '#6B6B66', hood: '#4E4E4A', hose: '#3A3A36', belt: '#2A2A28', build: 0.98 },
};

// ---------------------------------------------------------------- props
function prop(ctx, type, h, t = 0, color = P.ink2) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const s = h; ctx.strokeStyle = color; ctx.fillStyle = color;
  switch (type) {
    case 'dagger': ctx.fillStyle = '#C9C6BC'; tri(ctx, 0, -0.01 * s, 0.1 * s, 0, 0, 0.012 * s); ctx.fillStyle = P.ink2; ctx.fillRect(-0.03 * s, -0.012 * s, 0.03 * s, 0.024 * s); ctx.fillRect(-0.005 * s, -0.025 * s, 0.01 * s, 0.05 * s); break;
    case 'sword': ctx.fillStyle = '#D6D3C8'; tri(ctx, 0, -0.012 * s, 0.34 * s, 0, 0, 0.012 * s); ctx.fillStyle = P.gold; ctx.fillRect(-0.004 * s, -0.04 * s, 0.012 * s, 0.08 * s); ctx.fillStyle = P.ink2; ctx.fillRect(-0.06 * s, -0.01 * s, 0.056 * s, 0.02 * s); break;
    case 'staff': ctx.lineWidth = 0.018 * s; line(ctx, 0, 0.42 * s, 0, -0.55 * s); break;
    case 'crozier': ctx.strokeStyle = P.gold; ctx.lineWidth = 0.016 * s; line(ctx, 0, 0.42 * s, 0, -0.5 * s); ctx.beginPath(); ctx.arc(0.035 * s, -0.53 * s, 0.035 * s, Math.PI, Math.PI * 2.6); ctx.stroke(); break;
    case 'spear': ctx.lineWidth = 0.014 * s; line(ctx, 0, 0.42 * s, 0, -0.7 * s); ctx.fillStyle = '#C9C6BC'; tri(ctx, -0.02 * s, -0.7 * s, 0, -0.82 * s, 0.02 * s, -0.7 * s); break;
    case 'pitchfork': ctx.lineWidth = 0.014 * s; line(ctx, 0, 0.42 * s, 0, -0.55 * s); ctx.beginPath(); ctx.moveTo(-0.04 * s, -0.7 * s); ctx.lineTo(-0.04 * s, -0.55 * s); ctx.lineTo(0.04 * s, -0.55 * s); ctx.lineTo(0.04 * s, -0.7 * s); ctx.moveTo(0, -0.55 * s); ctx.lineTo(0, -0.72 * s); ctx.stroke(); break;
    case 'scythe': ctx.lineWidth = 0.014 * s; line(ctx, 0, 0.42 * s, 0, -0.6 * s); ctx.fillStyle = '#C9C6BC'; ctx.beginPath(); ctx.moveTo(0, -0.6 * s); ctx.quadraticCurveTo(-0.16 * s, -0.66 * s, -0.24 * s, -0.5 * s); ctx.quadraticCurveTo(-0.13 * s, -0.6 * s, 0, -0.56 * s); ctx.fill(); break;
    case 'bow': ctx.lineWidth = 0.012 * s; ctx.beginPath(); ctx.arc(-0.05 * s, 0, 0.26 * s, -1.2, 1.2); ctx.stroke(); ctx.lineWidth = 0.004 * s; ctx.strokeStyle = '#D8CDB5'; line(ctx, -0.05 * s + Math.cos(-1.2) * 0.26 * s, Math.sin(-1.2) * 0.26 * s, -0.05 * s + Math.cos(1.2) * 0.26 * s, Math.sin(1.2) * 0.26 * s); break;
    case 'scroll': ctx.fillStyle = P.paper; ctx.fillRect(-0.02 * s, -0.05 * s, 0.07 * s, 0.1 * s); ctx.fillStyle = P.parch3; ctx.fillRect(-0.03 * s, -0.06 * s, 0.09 * s, 0.018 * s); ctx.fillRect(-0.03 * s, 0.045 * s, 0.09 * s, 0.018 * s); break;
    case 'cup': ctx.fillStyle = '#D9D6CC'; ctx.beginPath(); ctx.moveTo(-0.03 * s, -0.05 * s); ctx.lineTo(0.03 * s, -0.05 * s); ctx.lineTo(0.012 * s, 0); ctx.lineTo(0.012 * s, 0.03 * s); ctx.lineTo(0.025 * s, 0.035 * s); ctx.lineTo(-0.025 * s, 0.035 * s); ctx.lineTo(-0.012 * s, 0.03 * s); ctx.lineTo(-0.012 * s, 0); ctx.closePath(); ctx.fill(); break;
    case 'jug': ctx.fillStyle = '#8A6B47'; ctx.beginPath(); ctx.ellipse(0, 0, 0.035 * s, 0.05 * s, 0, 0, TAU); ctx.fill(); ctx.fillRect(-0.015 * s, -0.08 * s, 0.03 * s, 0.04 * s); break;
    case 'axe': ctx.lineWidth = 0.016 * s; line(ctx, 0, 0.3 * s, 0, -0.38 * s); ctx.fillStyle = '#B9B6AC'; ctx.beginPath(); ctx.moveTo(0, -0.38 * s); ctx.quadraticCurveTo(0.14 * s, -0.42 * s, 0.13 * s, -0.25 * s); ctx.lineTo(0, -0.28 * s); ctx.fill(); break;
    case 'spade': ctx.lineWidth = 0.014 * s; line(ctx, 0, -0.35 * s, 0, 0.35 * s); ctx.fillStyle = '#8A7A60'; ctx.fillRect(-0.04 * s, 0.3 * s, 0.08 * s, 0.12 * s); break;
    case 'distaff': ctx.lineWidth = 0.01 * s; line(ctx, 0, 0.25 * s, 0, -0.3 * s); ctx.fillStyle = '#E6DECA'; ctx.beginPath(); ctx.ellipse(0, -0.28 * s, 0.03 * s, 0.07 * s, 0, 0, TAU); ctx.fill(); break;
    case 'torch': ctx.lineWidth = 0.016 * s; line(ctx, 0, 0.2 * s, 0, -0.25 * s); flames(ctx, 0, -0.25 * s, 0.07 * s, 0.16 * s, t, 3, 4); break;
    case 'banner': { ctx.lineWidth = 0.014 * s; line(ctx, 0, 0.42 * s, 0, -0.95 * s); const wv = Math.sin(t * 3) * 0.02 * s; ctx.fillStyle = color === P.ink2 ? P.red : color; ctx.beginPath(); ctx.moveTo(0, -0.93 * s); ctx.lineTo(0.3 * s, -0.9 * s + wv); ctx.lineTo(0.26 * s, -0.78 * s + wv); ctx.lineTo(0.3 * s, -0.66 * s + wv); ctx.lineTo(0, -0.68 * s); ctx.closePath(); ctx.fill(); break; }
    case 'branding': ctx.lineWidth = 0.014 * s; line(ctx, 0, 0.1 * s, 0, -0.25 * s); ctx.fillStyle = P.fire2; ctx.fillRect(-0.03 * s, -0.31 * s, 0.06 * s, 0.06 * s); break;
    // ---- Taiping additions
    case 'rifle': ctx.strokeStyle = '#3A2E22'; ctx.lineWidth = 0.022 * s; line(ctx, 0, 0.18 * s, 0, -0.08 * s); ctx.strokeStyle = '#4A4A48'; ctx.lineWidth = 0.012 * s; line(ctx, 0, -0.08 * s, 0, -0.62 * s); ctx.fillStyle = '#C9C6BC'; tri(ctx, -0.008 * s, -0.62 * s, 0, -0.74 * s, 0.008 * s, -0.62 * s); break;
    case 'cane': ctx.strokeStyle = '#2A241D'; ctx.lineWidth = 0.01 * s; line(ctx, 0, 0.42 * s, 0, -0.08 * s); break;
    case 'book': ctx.fillStyle = '#1E1A15'; ctx.fillRect(-0.035 * s, -0.045 * s, 0.07 * s, 0.09 * s); ctx.fillStyle = P.gold; ctx.fillRect(-0.004 * s, -0.03 * s, 0.008 * s, 0.05 * s); ctx.fillRect(-0.016 * s, -0.016 * s, 0.032 * s, 0.008 * s); break;
    case 'tract': ctx.fillStyle = '#EFE3C6'; ctx.fillRect(-0.03 * s, -0.04 * s, 0.06 * s, 0.08 * s); ctx.fillStyle = P.ink3; for (let i = 0; i < 3; i++) ctx.fillRect(-0.02 * s + i * 0.016 * s, -0.03 * s, 0.006 * s, 0.06 * s); break;
    case 'brush': ctx.strokeStyle = '#8A6B47'; ctx.lineWidth = 0.008 * s; line(ctx, 0, 0.04 * s, 0, -0.1 * s); ctx.fillStyle = P.ink; tri(ctx, -0.006 * s, 0.04 * s, 0, 0.08 * s, 0.006 * s, 0.04 * s); break;
    case 'lantern': ctx.lineWidth = 0.008 * s; line(ctx, 0, 0, 0, 0.06 * s); { const g = ctx.createRadialGradient(0, 0.12 * s, 0, 0, 0.12 * s, 0.16 * s); g.addColorStop(0, 'rgba(255,214,130,0.55)'); g.addColorStop(1, 'rgba(255,190,90,0)'); ctx.fillStyle = g; ctx.fillRect(-0.16 * s, -0.04 * s, 0.32 * s, 0.32 * s); } ctx.fillStyle = '#E8B860'; ctx.beginPath(); ctx.ellipse(0, 0.12 * s, 0.035 * s, 0.05 * s, 0, 0, TAU); ctx.fill(); break;
    case 'flag': { ctx.lineWidth = 0.014 * s; line(ctx, 0, 0.42 * s, 0, -0.95 * s); const wv = Math.sin(t * 3) * 0.025 * s; ctx.fillStyle = color === P.ink2 ? P.red : color; ctx.beginPath(); ctx.moveTo(0, -0.95 * s); ctx.quadraticCurveTo(0.18 * s, -0.95 * s + wv, 0.34 * s, -0.92 * s); ctx.lineTo(0.34 * s, -0.62 * s); ctx.quadraticCurveTo(0.18 * s, -0.66 * s - wv, 0, -0.64 * s); ctx.closePath(); ctx.fill(); ctx.strokeStyle = P.gold; ctx.lineWidth = 0.008 * s; ctx.strokeRect(0.03 * s, -0.9 * s, 0.27 * s, 0.24 * s); break; }
  }
  ctx.restore();
}
const line = (ctx, a, b, c, d) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); };
const tri = (ctx, a, b, c, d, e, f) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.lineTo(e, f); ctx.closePath(); ctx.fill(); };
function taper(ctx, x0, y0, x1, y1, w0, w1, col) { // tapered limb
  const a = Math.atan2(y1 - y0, x1 - x0) + Math.PI / 2, c = Math.cos(a), s = Math.sin(a);
  ctx.fillStyle = col; ctx.beginPath();
  ctx.moveTo(x0 + c * w0, y0 + s * w0); ctx.lineTo(x1 + c * w1, y1 + s * w1); ctx.lineTo(x1 - c * w1, y1 - s * w1); ctx.lineTo(x0 - c * w0, y0 - s * w0); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(x0, y0, w0, 0, TAU); ctx.arc(x1, y1, w1, 0, TAU); ctx.fill();
}

// ---------------------------------------------------------------- figure
// feet at (x,y), height h. pose: face(1 right/-1 left), armF/armB (deg from down, + = forward), elbF/elbB, walk (phase rad or null),
// prop (string) in front hand, propB in back hand, kneel 0..1, lean deg, seated (bool), alpha
export function figure(ctx, x, y, h, spec, pose = {}) {
  const f = pose.face ?? 1, b = spec.build ?? 1, wv = pose.walk;
  const armF = rad(pose.armF ?? 8), armB = rad(pose.armB ?? -6), elbF = rad(pose.elbF ?? 10), elbB = rad(pose.elbB ?? 8);
  const bob = wv != null ? Math.abs(Math.sin(wv)) * 0.012 * h : 0;
  ctx.save(); ctx.translate(x, y - bob); ctx.scale(f, 1); if (pose.lean) ctx.rotate(rad(pose.lean)); ctx.globalAlpha *= pose.alpha ?? 1;
  const u = h, sh = { x: 0.0, y: -0.75 * u }, hw = 0.1 * u * b;
  const skinC = spec.skin ?? P.skin, ink = spec.ink ?? P.ink;
  const sleeveC = spec.body === 'robe' ? spec.robe : spec.tunic;
  const drawArm = (ang, elb, back, propName) => {
    const sx = (back ? -0.065 : 0.07) * u * b, sy = sh.y + 0.02 * u;
    const ex = sx + Math.sin(ang) * 0.17 * u, ey = sy + Math.cos(ang) * 0.17 * u;
    const a2 = ang + elb, hx = ex + Math.sin(a2) * 0.16 * u, hy = ey + Math.cos(a2) * 0.16 * u;
    const col = back ? mixColor(sleeveC, '#000000', 0.25) : sleeveC;
    taper(ctx, sx, sy, ex, ey, 0.032 * u * b, 0.026 * u * b, col);
    taper(ctx, ex, ey, hx, hy, 0.026 * u * b, spec.wide ? 0.05 * u : 0.02 * u, col);
    ctx.fillStyle = skinC; ctx.beginPath(); ctx.arc(hx, hy, 0.022 * u, 0, TAU); ctx.fill();
    if (propName) {
      // long props stay upright (held like a staff); blades follow the forearm; small items stay level
      const LONG = ['staff', 'spear', 'crozier', 'pitchfork', 'scythe', 'banner', 'torch', 'axe', 'spade', 'distaff', 'branding', 'rifle', 'cane', 'flag'];
      const BLADE = ['dagger', 'sword'];
      let pa = 0;
      if (pose.propAng != null) pa = rad(pose.propAng);
      else if (BLADE.includes(propName)) pa = Math.PI / 2 - a2;
      else if (LONG.includes(propName)) pa = rad(pose.propTilt ?? 0);
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(pa); prop(ctx, propName, u, pose.t ?? 0, pose.propColor); ctx.restore();
    }
  };
  // back arm
  drawArm(armB, elbB, true, pose.propB);
  // legs (tunic) or robe hem
  if (spec.body === 'tunic' && !pose.seated) {
    const k = pose.kneel ?? 0, s1 = wv != null ? Math.sin(wv) * 0.38 : 0;
    const hip = -0.45 * u;
    const leg = (side, sw) => {
      const hx = side * 0.035 * u, kx = hx + Math.sin(sw) * 0.22 * u, ky = hip + Math.cos(sw) * 0.22 * u * (1 - k * 0.5);
      const fx = kx + Math.sin(sw * 0.4 - k * 1.2) * 0.22 * u, fy = Math.min(0, ky + 0.23 * u);
      taper(ctx, hx, hip, kx, ky, 0.032 * u * b, 0.026 * u, side < 0 ? mixColor(spec.hose, '#000', 0.25) : spec.hose);
      taper(ctx, kx, ky, fx, fy - 0.015 * u, 0.026 * u, 0.02 * u, side < 0 ? mixColor(spec.hose, '#000', 0.25) : spec.hose);
      ctx.fillStyle = ink; ctx.beginPath(); ctx.ellipse(fx + 0.02 * u, fy - 0.012 * u, 0.04 * u, 0.016 * u, 0, 0, TAU); ctx.fill();
    };
    leg(-1, -s1); leg(1, s1);
    // tunic body
    ctx.fillStyle = spec.tunic; ctx.beginPath();
    ctx.moveTo(-hw, sh.y); ctx.lineTo(hw, sh.y); ctx.lineTo(hw * 1.15, -0.5 * u); ctx.lineTo(hw * 1.35, -0.36 * u); ctx.lineTo(-hw * 1.35, -0.36 * u); ctx.lineTo(-hw * 1.15, -0.5 * u); ctx.closePath(); ctx.fill();
    ctx.fillStyle = spec.belt; ctx.fillRect(-hw * 1.15, -0.53 * u, hw * 2.3, 0.025 * u);
  } else if (pose.seated) {
    ctx.fillStyle = spec.body === 'robe' ? spec.robe : spec.tunic; ctx.beginPath();
    ctx.moveTo(-hw, sh.y); ctx.lineTo(hw, sh.y); ctx.lineTo(hw * 1.25, -0.45 * u); ctx.lineTo(hw * 1.7, -0.3 * u); ctx.lineTo(-hw * 1.1, -0.3 * u); ctx.lineTo(-hw * 1.2, -0.45 * u); ctx.closePath(); ctx.fill();
    taper(ctx, 0.05 * u, -0.36 * u, 0.12 * u, -0.1 * u, 0.034 * u, 0.026 * u, spec.hose || mixColor(spec.robe || P.ink2, '#000', 0.2));
    ctx.fillStyle = ink; ctx.beginPath(); ctx.ellipse(0.14 * u, -0.09 * u, 0.04 * u, 0.016 * u, 0, 0, TAU); ctx.fill();
  } else {
    const sway = wv != null ? Math.sin(wv) * 0.02 * u : 0;
    ctx.fillStyle = spec.robe; ctx.beginPath();
    ctx.moveTo(-hw, sh.y); ctx.lineTo(hw, sh.y); ctx.lineTo(hw * 1.2, -0.5 * u); ctx.lineTo(hw * 1.75 + sway, -0.015 * u); ctx.lineTo(-hw * 1.75 + sway, -0.015 * u); ctx.lineTo(-hw * 1.2, -0.5 * u); ctx.closePath(); ctx.fill();
    if (spec.edge) { ctx.strokeStyle = spec.edge; ctx.lineWidth = 0.016 * u; ctx.beginPath(); ctx.moveTo(hw * 1.75 + sway, -0.02 * u); ctx.lineTo(-hw * 1.75 + sway, -0.02 * u); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, sh.y + 0.02 * u); ctx.lineTo(sway * 0.6, -0.03 * u); ctx.stroke(); }
    if (spec.stole) { ctx.strokeStyle = spec.stole; ctx.lineWidth = 0.022 * u; ctx.beginPath(); ctx.moveTo(-0.035 * u, sh.y); ctx.lineTo(-0.045 * u, -0.3 * u); ctx.moveTo(0.035 * u, sh.y); ctx.lineTo(0.045 * u, -0.3 * u); ctx.stroke(); }
    if (spec.cross) { ctx.fillStyle = spec.cross; const cy = -0.6 * u; ctx.fillRect(-0.012 * u, cy - 0.05 * u, 0.024 * u, 0.1 * u); ctx.fillRect(-0.045 * u, cy - 0.012 * u, 0.09 * u, 0.024 * u); }
    if (spec.ermine) { ctx.fillStyle = '#EDE6D6'; ctx.beginPath(); ctx.moveTo(-hw * 1.15, sh.y + 0.01 * u); ctx.quadraticCurveTo(0, sh.y - 0.03 * u, hw * 1.15, sh.y + 0.01 * u); ctx.lineTo(hw * 0.9, sh.y + 0.09 * u); ctx.quadraticCurveTo(0, sh.y + 0.13 * u, -hw * 0.9, sh.y + 0.09 * u); ctx.closePath(); ctx.fill(); ctx.fillStyle = P.ink; for (const [dx, dy] of [[-0.06, 0.04], [0.0, 0.07], [0.06, 0.04], [-0.03, 0.02], [0.03, 0.02]]) { ctx.beginPath(); ctx.ellipse(dx * u, sh.y + dy * u, 0.006 * u, 0.012 * u, 0, 0, TAU); ctx.fill(); } }
    if (spec.veil) {}
    ctx.fillStyle = P.ink; ctx.beginPath(); ctx.ellipse(0.06 * u + sway, -0.012 * u, 0.045 * u, 0.014 * u, 0, 0, TAU); ctx.fill();
  }
  if (spec.chain) { ctx.strokeStyle = P.gold; ctx.lineWidth = 0.01 * u; ctx.beginPath(); ctx.arc(0, sh.y - 0.03 * u, 0.08 * u, 0.35, Math.PI - 0.35); ctx.stroke(); }
  // ---- Chinese costume details (Taiping episode)
  if (spec.armour) { ctx.strokeStyle = 'rgba(15,12,9,0.42)'; ctx.lineWidth = 0.008 * u; for (let k = 0; k < 6; k++) { const yy = sh.y + 0.03 * u + k * 0.04 * u; ctx.beginPath(); ctx.moveTo(-hw * 1.05, yy); ctx.lineTo(hw * 1.1, yy); ctx.stroke(); for (let j = -3; j <= 3; j++) { ctx.beginPath(); ctx.moveTo(j * hw * 0.3 + (k % 2) * hw * 0.15, yy); ctx.lineTo(j * hw * 0.3 + (k % 2) * hw * 0.15, yy + 0.04 * u); ctx.stroke(); } } }
  if (spec.lapel) { ctx.strokeStyle = spec.lapel; ctx.lineWidth = 0.016 * u; ctx.beginPath(); ctx.moveTo(-0.03 * u, sh.y + 0.005 * u); ctx.quadraticCurveTo(0.03 * u, -0.66 * u, hw * 0.95, -0.58 * u); ctx.stroke(); }
  if (spec.square) { ctx.fillStyle = spec.square; ctx.fillRect(-0.045 * u, -0.69 * u, 0.09 * u, 0.09 * u); ctx.strokeStyle = P.ink2; ctx.lineWidth = 0.004 * u; ctx.strokeRect(-0.038 * u, -0.683 * u, 0.076 * u, 0.076 * u); ctx.fillStyle = P.ink2; ctx.beginPath(); ctx.ellipse(0, -0.645 * u, 0.022 * u, 0.012 * u, -0.5, 0, TAU); ctx.fill(); }
  if (spec.sash) { ctx.fillStyle = spec.sash; ctx.fillRect(-hw * 1.2, -0.53 * u, hw * 2.4, 0.03 * u); }
  // neck + head
  ctx.fillStyle = skinC; ctx.fillRect(-0.022 * u, -0.82 * u, 0.044 * u, 0.08 * u);
  const hx = 0.006 * u, hy = -0.865 * u, hr = (spec.young ? 0.066 : 0.062) * u;
  ctx.beginPath(); ctx.arc(hx, hy, hr, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(hx + hr * 0.92, hy - hr * 0.1); ctx.lineTo(hx + hr * 1.22, hy + hr * 0.18); ctx.lineTo(hx + hr * 0.9, hy + hr * 0.3); ctx.fill(); // nose
  if (spec.beard) { ctx.beginPath(); ctx.moveTo(hx - hr * 0.2, hy + hr * 0.5); ctx.quadraticCurveTo(hx + hr * 0.7, hy + hr * 1.9, hx + hr * 0.95, hy + hr * 0.45); ctx.fill(); }
  if (spec.goldBeard) { ctx.fillStyle = spec.goldBeard; ctx.beginPath(); ctx.moveTo(hx - hr * 0.6, hy + hr * 0.1); ctx.quadraticCurveTo(hx - hr * 0.3, hy + hr * 4.2, hx + hr * 0.5, hy + hr * 4.4); ctx.quadraticCurveTo(hx + hr * 1.2, hy + hr * 2.2, hx + hr * 1.0, hy + hr * 0.35); ctx.closePath(); ctx.fill(); ctx.fillStyle = skinC; }
  if (spec.wisp) { ctx.beginPath(); ctx.moveTo(hx + hr * 0.35, hy + hr * 0.7); ctx.quadraticCurveTo(hx + hr * 0.5, hy + hr * 1.8, hx + hr * 0.75, hy + hr * 2.3); ctx.quadraticCurveTo(hx + hr * 0.75, hy + hr * 1.4, hx + hr * 0.85, hy + hr * 0.6); ctx.fill(); }
  if (spec.moustache) { ctx.beginPath(); ctx.ellipse(hx + hr * 0.85, hy + hr * 0.38, hr * 0.32, hr * 0.1, 0.15, 0, TAU); ctx.fill(); }
  if (spec.longHair) { ctx.fillStyle = spec.hairCol ?? '#1A1612'; ctx.beginPath(); ctx.moveTo(hx + hr * 0.2, hy - hr * 1.0); ctx.quadraticCurveTo(hx - hr * 1.7, hy - hr * 0.9, hx - hr * 1.45, hy + hr * 1.0); ctx.quadraticCurveTo(hx - hr * 1.5, hy + hr * 2.2, hx - hr * 1.1, sh.y + 0.07 * u); ctx.lineTo(hx - hr * 0.3, sh.y + 0.02 * u); ctx.quadraticCurveTo(hx - hr * 0.6, hy + hr * 0.6, hx - hr * 0.1, hy - hr * 0.2); ctx.closePath(); ctx.fill(); ctx.fillStyle = skinC; }
  if (spec.queue) { ctx.strokeStyle = spec.hairCol ?? '#1A1612'; ctx.lineWidth = 0.02 * u; ctx.lineCap = 'round'; const q0x = hx - hr * 0.85, q0y = hy + hr * 0.1, q1x = -hw * 0.85, q1y = -0.47 * u; ctx.beginPath(); ctx.moveTo(q0x, q0y); ctx.quadraticCurveTo(hx - hr * 1.35, sh.y + 0.04 * u, q1x, q1y); ctx.stroke();
    ctx.lineWidth = 0.007 * u; for (let k = 1; k < 9; k++) { const v = k / 9, bx = (1 - v) * (1 - v) * q0x + 2 * (1 - v) * v * (hx - hr * 1.35) + v * v * q1x, by = (1 - v) * (1 - v) * q0y + 2 * (1 - v) * v * (sh.y + 0.04 * u) + v * v * q1y; ctx.beginPath(); ctx.moveTo(bx - 0.012 * u, by - 0.004 * u); ctx.lineTo(bx + 0.012 * u, by + 0.004 * u); ctx.stroke(); } ctx.fillStyle = spec.hairCol ?? '#1A1612'; ctx.beginPath(); ctx.arc(q1x, q1y + 0.01 * u, 0.012 * u, 0, TAU); ctx.fill(); ctx.fillStyle = skinC; }
  if (spec.collarW) { ctx.fillStyle = spec.collarW; ctx.fillRect(-0.03 * u, -0.79 * u, 0.06 * u, 0.035 * u); }
  // headwear
  if (spec.hood) { ctx.fillStyle = spec.hood; ctx.beginPath();
    ctx.moveTo(hx - hr * 1.25, hy + hr * 0.6); ctx.quadraticCurveTo(hx - hr * 1.4, hy - hr * 1.6, hx + hr * 0.6, hy - hr * 1.25); ctx.quadraticCurveTo(hx + hr * 1.15, hy - hr * 0.9, hx + hr * 0.7, hy - hr * 0.15);
    ctx.lineTo(hx + hr * 0.25, hy + hr * 0.2); ctx.lineTo(hx + hr * 0.55, hy + hr * 1.3); ctx.lineTo(hw * 1.05, sh.y + 0.05 * u); ctx.lineTo(-hw * 1.1, sh.y + 0.06 * u); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(hx - hr * 1.1, hy - hr * 0.6); ctx.quadraticCurveTo(hx - hr * 2.6, hy - hr * 0.2, hx - hr * 2.2, hy + hr * 2.4); ctx.lineTo(hx - hr * 1.8, hy + hr * 2.4); ctx.quadraticCurveTo(hx - hr * 1.9, hy, hx - hr * 0.9, hy - hr * 0.1); ctx.fill(); // liripipe
  }
  if (spec.crown) { ctx.fillStyle = P.gold2; const cy = hy - hr * 0.75, cw = hr * 1.05; ctx.beginPath(); ctx.moveTo(hx - cw, cy + hr * 0.25); ctx.lineTo(hx - cw, cy - hr * 0.35);
    for (let i = 0; i < 5; i++) { const px = hx - cw + (i + 0.5) * (2 * cw / 5); ctx.lineTo(px, cy - hr * (i % 2 ? 0.5 : 0.9)); ctx.lineTo(hx - cw + (i + 1) * (2 * cw / 5), cy - hr * 0.35); }
    ctx.lineTo(hx + cw, cy + hr * 0.25); ctx.closePath(); ctx.fill(); ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(hx, cy - hr * 0.05, hr * 0.12, 0, TAU); ctx.fill(); }
  if (spec.mitre) { ctx.fillStyle = '#F1EBDD'; ctx.beginPath(); ctx.moveTo(hx - hr * 0.9, hy - hr * 0.55); ctx.lineTo(hx - hr * 0.6, hy - hr * 2.3); ctx.lineTo(hx, hy - hr * 2.7); ctx.lineTo(hx + hr * 0.6, hy - hr * 2.3); ctx.lineTo(hx + hr * 0.9, hy - hr * 0.55); ctx.closePath(); ctx.fill();
    ctx.fillStyle = P.gold; ctx.fillRect(hx - hr * 0.9, hy - hr * 0.8, hr * 1.8, hr * 0.28); ctx.fillRect(hx - hr * 0.1, hy - hr * 2.5, hr * 0.2, hr * 1.8); }
  if (spec.coif) { ctx.fillStyle = spec.coif; ctx.beginPath(); ctx.arc(hx - hr * 0.1, hy - hr * 0.1, hr * 1.06, Math.PI * 0.85, Math.PI * 2.05); ctx.lineTo(hx + hr * 0.3, hy + hr * 0.75); ctx.lineTo(hx - hr * 0.9, hy + hr * 0.8); ctx.closePath(); ctx.fill(); }
  if (spec.fur) { ctx.fillStyle = '#3A3026'; ctx.beginPath(); ctx.ellipse(hx - hr * 0.05, hy - hr * 0.75, hr * 1.15, hr * 0.55, 0, Math.PI, TAU); ctx.fill(); ctx.fillRect(hx - hr * 1.15, hy - hr * 0.8, hr * 2.3, hr * 0.35); }
  if (spec.cap) { ctx.fillStyle = spec.cap; ctx.beginPath(); ctx.ellipse(hx - hr * 0.2, hy - hr * 0.8, hr * 1.25, hr * 0.5, -0.15, Math.PI * 0.9, TAU * 1.02); ctx.fill(); }
  if (spec.helmet) { ctx.fillStyle = '#8E949A'; ctx.beginPath(); ctx.ellipse(hx, hy - hr * 0.4, hr * 1.55, hr * 0.28, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(hx, hy - hr * 0.4, hr * 0.95, Math.PI, TAU); ctx.fill(); }
  if (spec.tonsure) { ctx.fillStyle = '#5C4D3E'; ctx.beginPath(); ctx.ellipse(hx - hr * 0.1, hy - hr * 0.86, hr * 0.5, hr * 0.18, 0, 0, TAU); ctx.fill(); }
  if (spec.veil) { ctx.fillStyle = spec.veil; ctx.beginPath(); ctx.arc(hx - hr * 0.15, hy - hr * 0.05, hr * 1.12, Math.PI * 0.75, Math.PI * 2.1); ctx.lineTo(hx - hr * 0.6, sh.y + 0.06 * u); ctx.lineTo(hx - hr * 1.3, sh.y + 0.06 * u); ctx.closePath(); ctx.fill(); }
  if (spec.hairUp) { ctx.fillStyle = '#1A1612'; ctx.beginPath(); ctx.ellipse(hx - hr * 0.35, hy - hr * 0.55, hr * 1.0, hr * 0.62, -0.25, Math.PI * 0.85, Math.PI * 2.1); ctx.fill(); }
  if (spec.wrap) { ctx.fillStyle = spec.wrap; ctx.beginPath(); ctx.arc(hx - hr * 0.05, hy - hr * 0.2, hr * 1.1, Math.PI * 0.95, Math.PI * 2.02); ctx.closePath(); ctx.fill(); ctx.fillRect(hx - hr * 1.12, hy - hr * 0.45, hr * 2.15, hr * 0.38);
    ctx.beginPath(); ctx.arc(hx - hr * 1.05, hy - hr * 0.3, hr * 0.36, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(hx - hr * 1.2, hy - hr * 0.2); ctx.quadraticCurveTo(hx - hr * 1.9, hy + hr * 0.6, hx - hr * 1.7, hy + hr * 1.5); ctx.lineTo(hx - hr * 1.35, hy + hr * 1.3); ctx.quadraticCurveTo(hx - hr * 1.45, hy + hr * 0.5, hx - hr * 0.9, hy - hr * 0.1); ctx.fill(); }
  if (spec.tcrown) { const cs = spec.crownScale ?? 1; ctx.save(); ctx.translate(hx, hy - hr * 0.7); ctx.scale(cs, cs); ctx.fillStyle = P.gold2; ctx.fillRect(-hr * 1.02, -hr * 0.3, hr * 2.04, hr * 0.42);
    ctx.beginPath(); ctx.moveTo(-hr * 0.85, -hr * 0.28); ctx.lineTo(-hr * 0.7, -hr * 1.15); ctx.lineTo(hr * 0.7, -hr * 1.15); ctx.lineTo(hr * 0.85, -hr * 0.28); ctx.closePath(); ctx.fill();
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * hr * 0.95, -hr * 0.2); ctx.quadraticCurveTo(sx * hr * 1.75, -hr * 0.4, sx * hr * 1.6, -hr * 1.05); ctx.lineTo(sx * hr * 1.45, -hr * 0.95); ctx.quadraticCurveTo(sx * hr * 1.5, -hr * 0.45, sx * hr * 0.95, -hr * 0.05); ctx.fill(); }
    ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(0, -hr * 0.68, hr * 0.17, 0, TAU); ctx.fill(); ctx.fillStyle = '#8A6B27'; ctx.fillRect(-hr * 0.7, -hr * 1.2, hr * 1.4, hr * 0.1); ctx.restore(); }
  if (spec.skullcap) { ctx.fillStyle = spec.skullcap; ctx.beginPath(); ctx.arc(hx - hr * 0.05, hy - hr * 0.25, hr * 1.05, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(hx - hr * 0.05, hy - hr * 1.3, hr * 0.14, 0, TAU); ctx.fill(); }
  if (spec.mhat) { ctx.fillStyle = spec.mhatTop ?? '#6E3A24'; ctx.beginPath(); ctx.ellipse(hx, hy - hr * 0.95, hr * 0.95, hr * 0.62, 0, Math.PI, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(20,10,6,0.45)'; ctx.lineWidth = hr * 0.06; for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(hx, hy - hr * 1.55); ctx.lineTo(hx + k * hr * 0.28, hy - hr * 0.98); ctx.stroke(); }
    ctx.fillStyle = spec.mhat; ctx.beginPath(); ctx.moveTo(hx - hr * 1.22, hy - hr * 1.0); ctx.quadraticCurveTo(hx, hy - hr * 0.88, hx + hr * 1.22, hy - hr * 1.0); ctx.lineTo(hx + hr * 1.06, hy - hr * 0.42); ctx.quadraticCurveTo(hx, hy - hr * 0.3, hx - hr * 1.06, hy - hr * 0.42); ctx.closePath(); ctx.fill();
    ctx.fillStyle = spec.button ?? P.gold2; ctx.beginPath(); ctx.arc(hx, hy - hr * 1.62, hr * 0.2, 0, TAU); ctx.fill(); }
  if (spec.cone) { ctx.fillStyle = spec.cone; ctx.beginPath(); ctx.moveTo(hx - hr * 2.0, hy - hr * 0.4); ctx.lineTo(hx, hy - hr * 1.75); ctx.lineTo(hx + hr * 2.0, hy - hr * 0.4); ctx.quadraticCurveTo(hx, hy - hr * 0.62, hx - hr * 2.0, hy - hr * 0.4); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(hx - hr * 1.95, hy - hr * 0.48, hr * 3.9, hr * 0.1); }
  if (spec.slouch) { ctx.fillStyle = spec.slouch; ctx.beginPath(); ctx.ellipse(hx - hr * 0.05, hy - hr * 0.62, hr * 1.85, hr * 0.28, -0.06, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(hx - hr * 0.1, hy - hr * 0.95, hr * 0.92, hr * 0.62, 0, Math.PI, TAU); ctx.fill(); }
  if (spec.kepi) { ctx.fillStyle = spec.kepi; ctx.beginPath(); ctx.moveTo(hx - hr * 0.95, hy - hr * 0.45); ctx.lineTo(hx - hr * 0.8, hy - hr * 1.45); ctx.lineTo(hx + hr * 0.75, hy - hr * 1.3); ctx.lineTo(hx + hr * 0.95, hy - hr * 0.45); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(hx + hr * 0.6, hy - hr * 0.5); ctx.lineTo(hx + hr * 1.55, hy - hr * 0.32); ctx.lineTo(hx + hr * 0.6, hy - hr * 0.3); ctx.fill(); }
  if (spec.glasses) { ctx.strokeStyle = P.gold2; ctx.lineWidth = hr * 0.08; ctx.beginPath(); ctx.arc(hx + hr * 0.62, hy - hr * 0.12, hr * 0.26, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(hx + hr * 0.36, hy - hr * 0.14); ctx.lineTo(hx - hr * 0.5, hy - hr * 0.22); ctx.stroke(); }
  // front arm last
  drawArm(armF, elbF, false, pose.prop);
  ctx.restore();
}

// head-and-shoulders bust for portrait medallions (same drawing, cropped)
export function bust(ctx, cx, cy, r, spec) {
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
  const h = r * 5.6; // head radius ~0.35r, head centre at cy, shoulders at ~cy+0.64r
  figure(ctx, cx - r * 0.04, cy + 0.0 * r + 0.865 * h, h, spec, { armF: 4, armB: -4, elbF: 4, elbB: 4 });
  ctx.restore();
}

// ---------------------------------------------------------------- horse (side view, facing right; hooves at y)
export function horse(ctx, x, y, L, opt = {}) {
  const f = opt.face ?? 1, col = opt.color ?? '#2A241D', wv = opt.walk, edge = opt.edge ?? P.ink;
  ctx.save(); ctx.translate(x, y); ctx.scale(f * L, L); if (opt.tilt) ctx.rotate(rad(opt.tilt));
  const back = mixColor(col, '#000000', 0.3);
  const legs = [[-0.36, -0.66, 0.0], [-0.28, -0.66, Math.PI], [0.3, -0.64, Math.PI * 0.5], [0.38, -0.64, Math.PI * 1.5]];
  const drawLeg = (hx, hy, ph, c) => {
    const sw = wv != null ? Math.sin(wv + ph) * 0.32 : 0, kb = wv != null ? Math.max(0, Math.sin(wv + ph + 1.2)) * 0.5 : 0;
    const kx = hx + Math.sin(sw) * 0.33, ky = hy + Math.cos(sw) * 0.33;
    const fx = kx + Math.sin(sw - kb) * 0.33, fy = Math.min(0, ky + Math.cos(sw - kb) * 0.33);
    taper(ctx, hx, hy, kx, ky, 0.055, 0.03, c); taper(ctx, kx, ky, fx, fy, 0.03, 0.026, c);
    ctx.fillStyle = P.ink; ctx.fillRect(fx - 0.03, fy - 0.03, 0.06, 0.03);
  };
  drawLeg(legs[1][0], legs[1][1], legs[1][2], back); drawLeg(legs[3][0], legs[3][1], legs[3][2], back);
  ctx.fillStyle = col; ctx.strokeStyle = edge; ctx.lineWidth = 0.012;
  ctx.beginPath(); // tail
  ctx.moveTo(-0.5, -0.86); ctx.quadraticCurveTo(-0.66, -0.78 + (wv != null ? Math.sin(wv) * 0.03 : 0), -0.62, -0.42); ctx.lineTo(-0.56, -0.44); ctx.quadraticCurveTo(-0.58, -0.74, -0.46, -0.82); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, -0.75, 0.46, 0.17, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(-0.34, -0.78, 0.19, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(0.3, -0.78, 0.17, 0, TAU); ctx.fill();
  const nod = wv != null ? Math.sin(wv * 2) * 0.015 : 0;
  ctx.beginPath(); ctx.moveTo(0.18, -0.9); ctx.lineTo(0.5, -1.22 + nod); ctx.lineTo(0.6, -1.16 + nod); ctx.lineTo(0.46, -0.62); ctx.closePath(); ctx.fill(); // neck
  ctx.beginPath(); ctx.moveTo(0.48, -1.24 + nod); ctx.lineTo(0.58, -1.27 + nod); ctx.lineTo(0.81, -1.03 + nod); ctx.lineTo(0.8, -0.96 + nod); ctx.lineTo(0.71, -0.94 + nod); ctx.lineTo(0.55, -1.07 + nod); ctx.closePath(); ctx.fill(); // head
  tri(ctx, 0.52, -1.25 + nod, 0.55, -1.35 + nod, 0.58, -1.26 + nod);
  ctx.fillStyle = mixColor(col, '#000', 0.45); ctx.beginPath(); ctx.moveTo(0.2, -0.92); ctx.quadraticCurveTo(0.36, -1.16 + nod, 0.52, -1.26 + nod); ctx.lineTo(0.47, -1.18 + nod); ctx.quadraticCurveTo(0.32, -1.06, 0.2, -0.86); ctx.fill(); // mane
  ctx.fillStyle = col; drawLeg(legs[0][0], legs[0][1], legs[0][2], col); drawLeg(legs[2][0], legs[2][1], legs[2][2], col);
  if (opt.cloth) { ctx.fillStyle = opt.cloth; ctx.beginPath(); ctx.moveTo(-0.22, -0.92); ctx.lineTo(0.18, -0.92); ctx.lineTo(0.24, -0.62); ctx.lineTo(-0.26, -0.62); ctx.closePath(); ctx.fill();
    ctx.fillStyle = opt.clothEdge ?? P.ink2; ctx.fillRect(-0.26, -0.64, 0.5, 0.03); }
  ctx.restore();
}
// rider on horse: draws horse then seated figure at saddle
export function rider(ctx, x, y, L, spec, opt = {}) {
  const f = opt.face ?? 1, wv = opt.walk;
  horse(ctx, x, y, L, opt);
  const sx = x + f * (-0.02 * L), sy = y - 0.9 * L - (wv != null ? Math.abs(Math.sin(wv)) * 0.01 * L : 0);
  figure(ctx, sx, sy + 0.42 * L * 0.98, L * 0.95, spec, { face: f, seated: true, armF: opt.armF ?? 40, elbF: opt.elbF ?? 40, armB: opt.armB ?? 30, elbB: 50, prop: opt.prop, propAng: opt.propAng, lean: opt.lean, t: opt.t });
}

// ---------------------------------------------------------------- crowd
// draws n simple figures between x0..x1 around baseline y. red 0..1 turns them red one by one; raise lifts tools; seed fixes the crowd.
export function crowd(ctx, o) {
  const r = rng(o.seed ?? 1), n = o.n ?? 40, t = o.t ?? 0;
  const items = [];
  for (let i = 0; i < n; i++) {
    const depth = r(), x = lerp(o.x0, o.x1, r()), h = lerp(o.hMin ?? 60, o.hMax ?? 110, depth);
    const y = o.y + depth * (o.depth ?? 40), thr = r(), tool = ['pitchfork', 'scythe', 'staff', 'bow', 'banner', 'spear', null, 'axe', null][Math.floor(r() * 9)];
    items.push({ x, y, h, depth, thr, tool, ph: r() * TAU, f: r() < (o.faceBias ?? 0.5) ? 1 : -1 });
  }
  items.sort((a, b) => a.depth - b.depth);
  for (const it of items) {
    const isRed = (o.red ?? 0) > it.thr; const base = o.color ?? P.crowd;
    const c0 = mixColor(o.far ?? P.crowdBack, base, it.depth);
    const col = isRed ? mixColor(mixColor(o.far ?? P.crowdBack, '#7A2A20', 0.4), P.red, it.depth) : c0;
    const bob = Math.sin(t * 2.2 + it.ph) * 0.012 * it.h * (o.agit ?? 1);
    const fx = o.face ?? it.f;
    const x = it.x + (o.march ? (t * o.march) % 1 : 0), y = it.y - bob;
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(x - it.h * 0.11, y); ctx.lineTo(x - it.h * 0.08, y - it.h * 0.7); ctx.lineTo(x + it.h * 0.08, y - it.h * 0.7); ctx.lineTo(x + it.h * 0.11, y); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(x + fx * it.h * 0.01, y - it.h * 0.8, it.h * 0.075, 0, TAU); ctx.fill();
    if (isRed) { ctx.fillStyle = mixColor(P.red, '#000', 0.15); ctx.beginPath(); ctx.arc(x - fx * it.h * 0.01, y - it.h * 0.83, it.h * 0.082, Math.PI, TAU); ctx.fill(); }
    if (o.hat === 'cone') { ctx.fillStyle = mixColor(o.hatColor ?? '#8A7A5A', o.far ?? P.crowdBack, (1 - it.depth) * 0.5); ctx.beginPath(); ctx.moveTo(x - it.h * 0.17, y - it.h * 0.82); ctx.lineTo(x, y - it.h * 0.97); ctx.lineTo(x + it.h * 0.17, y - it.h * 0.82); ctx.closePath(); ctx.fill(); }
    if (o.hair && isRed) { ctx.fillStyle = mixColor('#1A1612', col, 0.3); ctx.beginPath(); ctx.moveTo(x - fx * it.h * 0.04, y - it.h * 0.86); ctx.quadraticCurveTo(x - fx * it.h * 0.14, y - it.h * 0.8, x - fx * it.h * 0.1, y - it.h * 0.66); ctx.lineTo(x - fx * it.h * 0.03, y - it.h * 0.7); ctx.fill(); }
    const raise = clamp((o.raise ?? 0) * 1.4 - it.thr * 0.4);
    if (it.tool && (o.tools ?? true)) {
      ctx.save(); ctx.translate(x + fx * it.h * 0.1, y - it.h * (0.45 + 0.25 * raise)); ctx.rotate(fx * (0.35 - 0.3 * raise));
      prop(ctx, (o.allBows && raise > 0.2) ? 'bow' : it.tool, it.h * 0.9, t + it.ph, isRed ? mixColor(P.ink2, P.red, 0.25) : mixColor(P.ink3, c0, 0.4));
      ctx.restore();
    }
  }
}

// ---------------------------------------------------------------- landscape
export function sky(ctx, mode = 'day', t = 0) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  const m = { day: ['#E8DCC2', '#F1E8D4'], dusk: ['#C99A63', '#EBCB98'], night: ['#22262F', '#3A3A3C'], storm: ['#6A645A', '#A39A88'], fire: ['#5A2A1E', '#B25A32'], gold: ['#D9B979', '#F0DDB0'] }[mode] || ['#E8DCC2', '#F1E8D4'];
  g.addColorStop(0, m[0]); g.addColorStop(1, m[1]);
  ctx.save(); ctx.globalAlpha = 0.86; ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3); ctx.restore();
}
export function hills(ctx, yBase, amp, seed, color, x0 = -400, x1 = W + 400) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x0, H * 2);
  for (let x = x0; x <= x1; x += 20) ctx.lineTo(x, yBase - amp * (0.5 + 0.5 * noise1(x / 420, seed)) - amp * 0.3 * noise1(x / 130, seed + 7));
  ctx.lineTo(x1, H * 2); ctx.closePath(); ctx.fill();
}
export function fieldStrips(ctx, x0, y0, x1, y1, n, color, line) {
  ctx.fillStyle = color; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.strokeStyle = line; ctx.lineWidth = 2;
  for (let i = 0; i <= n; i++) { const u = i / n; ctx.beginPath(); ctx.moveTo(lerp(x0, x1, u), y0); ctx.lineTo(lerp(x0 - 300, x1 + 300, u), y1); ctx.stroke(); }
}
export function tree(ctx, x, y, s, col = P.ink2, seed = 3) {
  const r = rng(seed); ctx.fillStyle = col;
  ctx.fillRect(x - 0.05 * s, y - 0.5 * s, 0.1 * s, 0.5 * s);
  for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(x + (r() - 0.5) * 0.5 * s, y - 0.6 * s - r() * 0.45 * s, (0.18 + r() * 0.16) * s, 0, TAU); ctx.fill(); }
}
export function river(ctx, pts, w, t, col = P.sea2) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 2; ctx.setLineDash([30, 60]); ctx.lineDashOffset = -t * 30;
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1] - w * 0.15) : ctx.moveTo(p[0], p[1] - w * 0.15)); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
}
export function clouds(ctx, t, seed, y, col = 'rgba(80,64,44,0.18)', n = 6, speed = 12, scale = 1) {
  const r = rng(seed); const [cc, ca] = splitRGBA(col);
  for (let i = 0; i < n; i++) { const bx = ((r() * (W + 800) + t * speed * (0.6 + r())) % (W + 800)) - 400, by = y + (r() - 0.5) * 120 * scale;
    for (let k = 0; k < 6; k++) puff(ctx, cc, bx + (k - 3) * 45 * scale, by + Math.sin(k * 1.7) * 18 * scale, (50 + r() * 40) * scale * 1.35, ca * 0.9, 0.35); }
}
// big rolling storm-cloud wall (used as the "doom" wipe and in the epilogue)
export function stormWall(ctx, t, cover, seed = 9, col = '#2C2A2A') {
  const r = rng(seed); const edge = lerp(-500, W + 500, cover);
  for (let i = 0; i < 90; i++) { const yy = r() * (H + 200) - 100, xx = edge - r() * (W + 900), rr = 80 + r() * 160;
    if (xx - rr * 1.6 > W || xx + rr * 1.6 < 0) continue; puff(ctx, col, xx + Math.sin(t * 0.5 + i) * 20, yy, rr * 1.55, 1, 0.45); }
}

// ---------------------------------------------------------------- fire & smoke
export function flames(ctx, x, y, w, h, t, seed = 1, n = 9, glow = true) {
  const r = rng(seed); ctx.save();
  if (glow) { const R = Math.max(w, h) * 1.4, g = ctx.createRadialGradient(x, y - h * 0.3, 0, x, y - h * 0.3, R); g.addColorStop(0, 'rgba(240,170,70,0.35)'); g.addColorStop(1, 'rgba(240,120,50,0)'); ctx.fillStyle = g; ctx.fillRect(x - R, y - h * 0.3 - R, R * 2, R * 2); }
  const layer = (col, sh, sw) => { ctx.fillStyle = col; for (let i = 0; i < n; i++) { const px = x + (r() - 0.5) * w, ph = r() * 10, hh = h * sh * (0.55 + 0.45 * Math.abs(noise1(t * 3 + ph, seed + i))), ww = w * sw / n * (1.4 + r());
      const sway = noise1(t * 2.3 + ph, i) * ww * 0.8; ctx.beginPath(); ctx.moveTo(px - ww, y); ctx.quadraticCurveTo(px - ww * 0.9, y - hh * 0.5, px + sway, y - hh); ctx.quadraticCurveTo(px + ww * 0.9, y - hh * 0.5, px + ww, y); ctx.closePath(); ctx.fill(); } };
  layer(P.fire2, 1.0, 1.4); layer(P.fire1, 0.72, 1.1); layer(P.fire3, 0.42, 0.8);
  ctx.fillStyle = P.fire3; for (let i = 0; i < n * 2; i++) { const ph = r(), age = (t * 0.6 + ph) % 1; ctx.globalAlpha = (1 - age) * 0.9; ctx.beginPath(); ctx.arc(x + (r() - 0.5) * w * 1.3 + noise1(t + i, 3) * 20, y - h * (0.5 + age * 1.6), 2 + r() * 2.5, 0, TAU); ctx.fill(); }
  ctx.restore();
}
export function smoke(ctx, x, y, t, s = 1, seed = 2, col = 'rgba(60,54,50,0.28)') {
  const r = rng(seed); const [cc, ca] = splitRGBA(col);
  for (let i = 0; i < 14; i++) { const ph = r(), age = (t * 0.12 + ph) % 1;
    puff(ctx, cc, x + (r() - 0.5) * 60 * s + age * 160 * s, y - age * 520 * s, (40 + age * 140) * s * 1.3, ca * Math.sin(age * Math.PI) * 0.9, 0.3); }
}

// ---------------------------------------------------------------- buildings (all ink silhouettes, baseline y, scale s≈px per unit)
const B = P.ink2;
function win(ctx, x, y, w, h, lit) { ctx.fillStyle = lit ? 'rgba(232,180,90,0.95)' : 'rgba(120,104,84,0.55)'; ctx.fillRect(x, y, w, h); }
export function cottage(ctx, x, y, s, lit = false, col = B) {
  ctx.fillStyle = col; ctx.fillRect(x - 0.5 * s, y - 0.45 * s, s, 0.45 * s);
  ctx.fillStyle = mixColor(col, '#6E5A43', 0.35); ctx.beginPath(); ctx.moveTo(x - 0.62 * s, y - 0.42 * s); ctx.quadraticCurveTo(x, y - 1.05 * s, x + 0.62 * s, y - 0.42 * s); ctx.closePath(); ctx.fill();
  win(ctx, x - 0.3 * s, y - 0.3 * s, 0.14 * s, 0.12 * s, lit); ctx.fillStyle = '#100D0A'; ctx.fillRect(x + 0.1 * s, y - 0.3 * s, 0.16 * s, 0.3 * s);
}
export function church(ctx, x, y, s, col = B, lit = false) {
  ctx.fillStyle = col; ctx.fillRect(x - 0.6 * s, y - 0.55 * s, 1.0 * s, 0.55 * s);
  ctx.beginPath(); ctx.moveTo(x - 0.65 * s, y - 0.55 * s); ctx.lineTo(x - 0.1 * s, y - 0.85 * s); ctx.lineTo(x + 0.45 * s, y - 0.55 * s); ctx.fill();
  ctx.fillRect(x + 0.35 * s, y - 1.1 * s, 0.32 * s, 1.1 * s);
  ctx.beginPath(); ctx.moveTo(x + 0.32 * s, y - 1.1 * s); ctx.lineTo(x + 0.51 * s, y - 1.75 * s); ctx.lineTo(x + 0.7 * s, y - 1.1 * s); ctx.fill();
  win(ctx, x - 0.4 * s, y - 0.42 * s, 0.08 * s, 0.2 * s, lit); win(ctx, x - 0.15 * s, y - 0.42 * s, 0.08 * s, 0.2 * s, lit); win(ctx, x + 0.47 * s, y - 0.9 * s, 0.08 * s, 0.16 * s, lit);
}
export function manor(ctx, x, y, s, col = B, lit = false) {
  ctx.fillStyle = col; ctx.fillRect(x - 0.9 * s, y - 0.7 * s, 1.8 * s, 0.7 * s);
  ctx.beginPath(); ctx.moveTo(x - 0.95 * s, y - 0.7 * s); ctx.lineTo(x, y - 1.2 * s); ctx.lineTo(x + 0.95 * s, y - 0.7 * s); ctx.fill();
  ctx.fillRect(x - 1.15 * s, y - 1.1 * s, 0.35 * s, 1.1 * s); for (let i = 0; i < 3; i++) ctx.fillRect(x - 1.15 * s + i * 0.13 * s, y - 1.2 * s, 0.08 * s, 0.1 * s);
  for (let i = 0; i < 4; i++) win(ctx, x - 0.6 * s + i * 0.38 * s, y - 0.5 * s, 0.1 * s, 0.18 * s, lit);
}
export function keep(ctx, x, y, s, col = B, lit = false) { // Rochester: tall square keep with corner turrets
  ctx.fillStyle = col; ctx.fillRect(x - 0.6 * s, y - 1.7 * s, 1.2 * s, 1.7 * s);
  for (const dx of [-0.62, 0.42]) { ctx.fillRect(x + dx * s, y - 1.95 * s, 0.2 * s, 1.95 * s); for (let i = 0; i < 2; i++) ctx.fillRect(x + dx * s + i * 0.12 * s, y - 2.03 * s, 0.07 * s, 0.08 * s); }
  for (let i = 0; i < 6; i++) ctx.fillRect(x - 0.6 * s + i * 0.22 * s, y - 1.78 * s, 0.12 * s, 0.08 * s);
  ctx.fillRect(x - 1.6 * s, y - 0.6 * s, 3.2 * s, 0.6 * s); for (let i = 0; i < 14; i++) ctx.fillRect(x - 1.6 * s + i * 0.24 * s, y - 0.68 * s, 0.13 * s, 0.08 * s);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) win(ctx, x - 0.4 * s + c * 0.33 * s, y - 1.5 * s + r * 0.35 * s, 0.07 * s, 0.14 * s, lit && r === 2 && c === 1);
}
export function cathedral(ctx, x, y, s, col = B) {
  ctx.fillStyle = col; ctx.fillRect(x - 1.8 * s, y - 0.8 * s, 3.6 * s, 0.8 * s);
  ctx.beginPath(); ctx.moveTo(x - 1.85 * s, y - 0.8 * s); ctx.lineTo(x, y - 1.15 * s); ctx.lineTo(x + 1.85 * s, y - 0.8 * s); ctx.fill();
  ctx.fillRect(x - 0.3 * s, y - 2.2 * s, 0.6 * s, 2.2 * s); for (const dx of [-0.32, 0.22]) ctx.fillRect(x + dx * s, y - 2.45 * s, 0.1 * s, 0.3 * s);
  ctx.fillRect(x - 1.9 * s, y - 1.6 * s, 0.45 * s, 1.6 * s); ctx.fillRect(x - 1.35 * s, y - 1.6 * s, 0.45 * s, 1.6 * s);
  for (let i = 0; i < 8; i++) win(ctx, x - 0.8 * s + i * 0.3 * s, y - 0.6 * s, 0.08 * s, 0.3 * s, false);
}
export function whiteTower(ctx, x, y, s, col = '#3A342C', lit = false) {
  ctx.fillStyle = col; ctx.fillRect(x - 1.0 * s, y - 1.5 * s, 2.0 * s, 1.5 * s);
  for (const dx of [-1.05, 0.8]) { ctx.fillRect(x + dx * s, y - 1.85 * s, 0.25 * s, 1.85 * s); ctx.beginPath(); ctx.moveTo(x + dx * s - 0.02 * s, y - 1.85 * s); ctx.quadraticCurveTo(x + (dx + 0.125) * s, y - 2.25 * s, x + (dx + 0.27) * s, y - 1.85 * s); ctx.fill(); }
  ctx.fillRect(x - 0.3 * s, y - 1.75 * s, 0.25 * s, 0.25 * s);
  for (let i = 0; i < 8; i++) ctx.fillRect(x - 0.95 * s + i * 0.25 * s, y - 1.6 * s, 0.13 * s, 0.1 * s);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) win(ctx, x - 0.75 * s + c * 0.36 * s, y - 1.2 * s + r * 0.5 * s, 0.08 * s, 0.2 * s, lit && r === 1);
  // curtain wall
  ctx.fillStyle = mixColor(col, '#000', 0.15); ctx.fillRect(x - 3.0 * s, y - 0.55 * s, 6.0 * s, 0.55 * s);
  for (let i = 0; i < 24; i++) ctx.fillRect(x - 3.0 * s + i * 0.25 * s, y - 0.63 * s, 0.14 * s, 0.08 * s);
  for (const dx of [-3.1, -1.6, 1.4, 2.9]) { ctx.fillRect(x + dx * s, y - 0.85 * s, 0.32 * s, 0.85 * s); }
}
export function londonBridge(ctx, x0, x1, y, s, col = B, lit = false, gapOpen = 0) {
  // deck
  ctx.fillStyle = col; ctx.fillRect(x0, y - 0.35 * s, x1 - x0, 0.2 * s);
  const n = 12, span = (x1 - x0) / n;
  for (let i = 0; i < n; i++) { // arches: fill the spandrels under the deck
    const xl = x0 + i * span + 0.12 * s, xr = x0 + (i + 1) * span - 0.12 * s, mid = (xl + xr) / 2;
    ctx.beginPath(); ctx.moveTo(xl, y - 0.2 * s); ctx.lineTo(xl, y + 0.05 * s); ctx.quadraticCurveTo(mid, y - 0.45 * s, xr, y + 0.05 * s); ctx.lineTo(xr, y - 0.2 * s); ctx.closePath(); ctx.fill();
  }
  for (let i = 0; i <= n; i++) { const px = x0 + i * span; ctx.fillRect(px - 0.12 * s, y - 0.35 * s, 0.24 * s, 0.47 * s);
    ctx.beginPath(); ctx.ellipse(px, y + 0.13 * s, 0.32 * s, 0.07 * s, 0, 0, TAU); ctx.fill(); } // boat-shaped starlings at the waterline
  // houses on the bridge
  const r = rng(77);
  for (let i = 0; i < n; i++) { if (i === 7) continue; const px = x0 + i * span + 0.1 * s, hw = span * (0.7 + r() * 0.25), hh = (0.6 + r() * 0.5) * s;
    ctx.fillStyle = mixColor(col, '#5B4A3A', r() * 0.3); ctx.fillRect(px, y - 0.35 * s - hh, hw, hh); ctx.beginPath(); ctx.moveTo(px - 0.05 * s, y - 0.35 * s - hh); ctx.lineTo(px + hw / 2, y - 0.35 * s - hh - 0.35 * s); ctx.lineTo(px + hw + 0.05 * s, y - 0.35 * s - hh); ctx.fill();
    for (let k = 0; k < 2; k++) win(ctx, px + hw * (0.2 + k * 0.45), y - 0.35 * s - hh * 0.7, hw * 0.16, hh * 0.25, lit && r() < 0.6); }
  // drawbridge span (index 7) lifts when gapOpen<1 ... drawn as a plank that lowers
  const dx = x0 + 7 * span; ctx.save(); ctx.translate(dx, y - 0.3 * s); ctx.rotate(-(1 - gapOpen) * 1.2); ctx.fillStyle = mixColor(col, '#6E5A43', 0.4); ctx.fillRect(0, -0.06 * s, span, 0.12 * s); ctx.restore();
  // gatehouse with spikes (index 9)
  const gx = x0 + 9.2 * span; ctx.fillStyle = col; ctx.fillRect(gx, y - 1.5 * s, span * 0.9, 1.15 * s); for (let k = 0; k < 4; k++) ctx.fillRect(gx + k * span * 0.24, y - 1.62 * s, span * 0.13, 0.12 * s);
  return { gateX: gx + span * 0.45, gateTop: y - 1.62 * s, drawX: dx, span };
}
export function stPauls(ctx, x, y, s, col = B) {
  ctx.fillStyle = col; ctx.fillRect(x - 2.4 * s, y - 0.9 * s, 4.8 * s, 0.9 * s);
  ctx.beginPath(); ctx.moveTo(x - 2.45 * s, y - 0.9 * s); ctx.lineTo(x, y - 1.3 * s); ctx.lineTo(x + 2.45 * s, y - 0.9 * s); ctx.fill();
  ctx.fillRect(x + 0.2 * s, y - 2.0 * s, 0.6 * s, 2.0 * s); ctx.beginPath(); ctx.moveTo(x + 0.15 * s, y - 2.0 * s); ctx.lineTo(x + 0.5 * s, y - 4.6 * s); ctx.lineTo(x + 0.85 * s, y - 2.0 * s); ctx.fill();
}
export function savoy(ctx, x, y, s, col = B, lit = false, burnt = 0) {
  ctx.fillStyle = burnt > 0 ? mixColor(col, '#0E0907', clamp(burnt)) : col;
  ctx.fillRect(x - 2.2 * s, y - 1.0 * s, 4.4 * s, 1.0 * s);
  ctx.beginPath(); ctx.moveTo(x - 2.25 * s, y - 1.0 * s); ctx.lineTo(x - 1.2 * s, y - 1.45 * s); ctx.lineTo(x + 1.2 * s, y - 1.45 * s); ctx.lineTo(x + 2.25 * s, y - 1.0 * s); ctx.fill();
  for (const dx of [-2.5, -0.35, 2.05]) { ctx.fillRect(x + dx * s, y - 1.75 * s, 0.45 * s, 1.75 * s); ctx.beginPath(); ctx.moveTo(x + (dx - 0.04) * s, y - 1.75 * s); ctx.lineTo(x + (dx + 0.225) * s, y - 2.15 * s); ctx.lineTo(x + (dx + 0.49) * s, y - 1.75 * s); ctx.fill(); }
  for (let i = 0; i < 9; i++) win(ctx, x - 1.9 * s + i * 0.46 * s, y - 0.75 * s, 0.12 * s, 0.38 * s, lit && burnt < 0.3);
}
export function templeChurch(ctx, x, y, s, col = B) {
  ctx.fillStyle = col; ctx.fillRect(x - 0.8 * s, y - 0.9 * s, 1.6 * s, 0.9 * s);
  ctx.beginPath(); ctx.moveTo(x - 0.85 * s, y - 0.9 * s); ctx.lineTo(x, y - 1.35 * s); ctx.lineTo(x + 0.85 * s, y - 0.9 * s); ctx.fill();
  ctx.fillRect(x + 0.8 * s, y - 0.65 * s, 1.8 * s, 0.65 * s); ctx.beginPath(); ctx.moveTo(x + 0.8 * s, y - 0.65 * s); ctx.lineTo(x + 1.7 * s, y - 0.95 * s); ctx.lineTo(x + 2.6 * s, y - 0.65 * s); ctx.fill();
  for (let i = 0; i < 5; i++) win(ctx, x - 0.6 * s + i * 0.28 * s, y - 0.62 * s, 0.07 * s, 0.25 * s, false);
}
export function cityGate(ctx, x, y, s, col = B, open = 1) {
  ctx.fillStyle = col; ctx.fillRect(x - 3.5 * s, y - 0.9 * s, 7 * s, 0.9 * s); for (let i = 0; i < 28; i++) ctx.fillRect(x - 3.5 * s + i * 0.25 * s, y - 0.98 * s, 0.14 * s, 0.08 * s);
  ctx.fillRect(x - 0.9 * s, y - 1.9 * s, 1.8 * s, 1.9 * s); for (const dx of [-1.05, 0.6]) ctx.fillRect(x + dx * s, y - 2.2 * s, 0.45 * s, 2.2 * s);
  ctx.fillStyle = '#0E0B08'; ctx.beginPath(); ctx.moveTo(x - 0.45 * s, y); ctx.lineTo(x - 0.45 * s, y - 0.8 * s); ctx.quadraticCurveTo(x, y - 1.2 * s, x + 0.45 * s, y - 0.8 * s); ctx.lineTo(x + 0.45 * s, y); ctx.fill();
  // portcullis rises with open
  ctx.strokeStyle = '#5B4A3A'; ctx.lineWidth = 0.05 * s; const py = -open * 1.0 * s;
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(x - 0.4 * s + i * 0.2 * s, y + py); ctx.lineTo(x - 0.4 * s + i * 0.2 * s, y - 1.0 * s + py * 0.2); ctx.stroke(); }
}
export function priory(ctx, x, y, s, col = B, lit = false) {
  ctx.fillStyle = col; ctx.fillRect(x - 1.5 * s, y - 0.75 * s, 3 * s, 0.75 * s); ctx.beginPath(); ctx.moveTo(x - 1.55 * s, y - 0.75 * s); ctx.lineTo(x, y - 1.1 * s); ctx.lineTo(x + 1.55 * s, y - 0.75 * s); ctx.fill();
  ctx.fillRect(x + 0.7 * s, y - 1.6 * s, 0.5 * s, 1.6 * s); for (let i = 0; i < 3; i++) ctx.fillRect(x + 0.7 * s + i * 0.18 * s, y - 1.7 * s, 0.1 * s, 0.1 * s);
  for (let i = 0; i < 6; i++) win(ctx, x - 1.2 * s + i * 0.36 * s, y - 0.55 * s, 0.08 * s, 0.22 * s, lit);
}
export function tent(ctx, x, y, s, col = '#8A7A60') { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - 0.6 * s, y); ctx.lineTo(x, y - 0.75 * s); ctx.lineTo(x + 0.6 * s, y); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#2A241D'; ctx.beginPath(); ctx.moveTo(x - 0.12 * s, y); ctx.lineTo(x, y - 0.4 * s); ctx.lineTo(x + 0.12 * s, y); ctx.fill(); }
export function campfire(ctx, x, y, s, t, seed) { ctx.fillStyle = P.ink2; ctx.fillRect(x - 0.3 * s, y - 0.06 * s, 0.6 * s, 0.06 * s); flames(ctx, x, y - 0.04 * s, 0.4 * s, 0.6 * s, t, seed, 5); }
export function column(ctx, x, y, s, col = B) { // Trafalgar-type monument (generic)
  ctx.fillStyle = col; ctx.fillRect(x - 0.9 * s, y - 0.9 * s, 1.8 * s, 0.9 * s); ctx.fillRect(x - 0.6 * s, y - 1.3 * s, 1.2 * s, 0.4 * s);
  ctx.beginPath(); ctx.moveTo(x - 0.28 * s, y - 1.3 * s); ctx.lineTo(x - 0.2 * s, y - 6.0 * s); ctx.lineTo(x + 0.2 * s, y - 6.0 * s); ctx.lineTo(x + 0.28 * s, y - 1.3 * s); ctx.fill();
  ctx.fillRect(x - 0.35 * s, y - 6.3 * s, 0.7 * s, 0.3 * s); ctx.beginPath(); ctx.arc(x, y - 6.55 * s, 0.14 * s, 0, TAU); ctx.fill(); ctx.fillRect(x - 0.1 * s, y - 6.5 * s, 0.2 * s, 0.25 * s);
}
export function barge(ctx, x, y, s, t, col = P.ink2) {
  const bob = Math.sin(t * 1.4) * 0.03 * s; ctx.save(); ctx.translate(x, y + bob);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-1.6 * s, -0.25 * s); ctx.lineTo(1.7 * s, -0.25 * s); ctx.quadraticCurveTo(1.6 * s, 0.15 * s, 1.2 * s, 0.2 * s); ctx.lineTo(-1.3 * s, 0.2 * s); ctx.quadraticCurveTo(-1.6 * s, 0.1 * s, -1.6 * s, -0.25 * s); ctx.fill();
  ctx.fillStyle = P.gold; ctx.fillRect(-0.7 * s, -0.95 * s, 1.4 * s, 0.12 * s); ctx.fillRect(-0.68 * s, -0.95 * s, 0.06 * s, 0.7 * s); ctx.fillRect(0.62 * s, -0.95 * s, 0.06 * s, 0.7 * s);
  ctx.fillStyle = P.red; ctx.beginPath(); ctx.moveTo(-0.7 * s, -0.83 * s); for (let i = 0; i <= 7; i++) ctx.lineTo(-0.7 * s + i * 0.2 * s, -0.83 * s + (i % 2 ? 0.1 : 0) * s); ctx.lineTo(0.7 * s, -0.83 * s); ctx.fill();
  ctx.strokeStyle = P.ink2; ctx.lineWidth = 0.04 * s; for (let i = 0; i < 6; i++) { const a = Math.sin(t * 2 + i) * 0.3; ctx.beginPath(); ctx.moveTo(-1.2 * s + i * 0.45 * s, -0.2 * s); ctx.lineTo(-1.2 * s + i * 0.45 * s - 0.25 * s * Math.cos(a), 0.45 * s); ctx.stroke(); }
  ctx.restore();
}

// ================================================================ TAIPING EPISODE (1851–1864): characters and buildings
// One locked spec per character. Hong has two states (student 1837–43, Heavenly King 1851–64) with the same face and build.
Object.assign(CH, {
  hongStudent: { name: 'Hong Xiuquan', role: 'Exam candidate, 1837', body: 'robe', robe: '#6E5A43', edge: '#4A3E30', lapel: '#4A3E30', skullcap: '#1E1A15', queue: true, wide: true, build: 0.92, young: true },
  hong:        { name: 'Hong Xiuquan', role: 'The Heavenly King', body: 'robe', robe: P.red, edge: P.gold, lapel: P.gold, sash: P.gold, tcrown: true, longHair: true, wisp: true, wide: true, build: 0.98 },
  yang:        { name: 'Yang Xiuqing', role: 'The East King', body: 'robe', robe: P.red, edge: P.gold, lapel: P.gold, sash: P.gold, wrap: P.gold, longHair: true, beard: true, wide: true, build: 1.2 },
  feng:        { name: 'Feng Yunshan', role: 'The South King', body: 'tunic', tunic: '#6E5A43', hose: '#3A3026', belt: P.red, wrap: P.red, longHair: true, build: 0.96 },
  xiao:        { name: 'Xiao Chaogui', role: 'The West King', body: 'tunic', tunic: '#7A2A22', hose: '#3A3026', belt: '#1E1A15', wrap: P.red, longHair: true, armour: true, build: 1.04 },
  wei:         { name: 'Wei Changhui', role: 'The North King', body: 'robe', robe: '#6E1A14', edge: '#1E1A15', lapel: '#1E1A15', sash: '#1E1A15', wrap: '#1E1A15', longHair: true, wisp: true, armour: true, build: 1.0 },
  shi:         { name: 'Shi Dakai', role: 'The Wing King', body: 'tunic', tunic: '#8A2A22', hose: '#3A3026', belt: P.gold, wrap: P.red, longHair: true, armour: true, build: 1.0, young: true },
  rengan:      { name: 'Hong Rengan', role: 'The Shield King', body: 'robe', robe: P.red, edge: '#EDE3CF', lapel: '#EDE3CF', skullcap: '#1E1A15', glasses: true, wide: true, build: 0.95 },
  li:          { name: 'Li Xiucheng', role: 'The Loyal King', body: 'tunic', tunic: '#7A2A22', hose: '#2A241D', belt: P.gold, wrap: P.red, longHair: true, armour: true, build: 1.02 },
  boyKing:     { name: 'Hong Tianguifu', role: 'The boy Heavenly King', body: 'robe', robe: P.red, edge: P.gold, lapel: P.gold, tcrown: true, crownScale: 1.35, young: true, build: 0.72 },
  zengF:       { name: 'Zeng Guofan', role: 'Founder of the Hunan Army', body: 'robe', robe: P.gold, edge: '#8A6B27', lapel: '#8A6B27', square: '#E2C47A', mhat: '#1E1A15', queue: true, wisp: true, wide: true, build: 1.0 },
  zengQ:       { name: 'Zeng Guoquan', role: 'Besieger of Nanjing', body: 'tunic', tunic: P.blue, hose: '#2B4256', belt: P.gold, armour: true, mhat: '#1E1A15', queue: true, build: 1.08 },
  emperor:     { name: 'The Qing emperor', role: 'Dragon Throne, Beijing', body: 'robe', robe: P.gold, edge: '#8A6B27', lapel: '#8A6B27', square: '#8A6B27', mhat: '#1E1A15', mhatTop: '#8A6B27', queue: true, wide: true, build: 1.0 },
  liangFa:     { name: 'Liang Fa', role: 'Chinese Christian convert', body: 'robe', robe: '#8C7A5C', edge: '#6E5A43', lapel: '#6E5A43', skullcap: '#1E1A15', queue: true, wisp: true, wide: true, build: 0.94 },
  roberts:     { name: 'Issachar Roberts', role: 'American Baptist missionary', body: 'robe', robe: '#1E1A15', edge: '#2A241D', collarW: '#EDE3CF', beard: true, build: 1.06 },
  ward:        { name: 'Frederick T. Ward', role: 'Ever Victorious Army', body: 'tunic', tunic: P.blue, hose: '#2B4256', belt: '#1E1A15', slouch: '#2A241D', build: 1.02 },
  gordon:      { name: 'Charles Gordon', role: 'Ever Victorious Army, 1863', body: 'tunic', tunic: P.blue, hose: '#2B4256', belt: P.gold, kepi: '#1E2A36', moustache: true, build: 1.0 },
  sun:         { name: 'Sun Yat-sen', role: 'Revolution of 1911', body: 'tunic', tunic: '#2A241D', hose: '#2A241D', belt: '#2A241D', collarW: '#D8CDB5', moustache: true, build: 1.0 },
  mao:         { name: 'Mao Zedong', role: 'Founded the PRC, 1949', body: 'tunic', tunic: '#5B5E63', hose: '#4A4C50', belt: '#5B5E63', hairUp: true, build: 1.08 },
  visionGod:   { name: 'The old man of the vision', role: "Hong's account, 1837", body: 'robe', robe: '#F1E4BE', edge: P.gold2, goldBeard: P.gold2, longHair: true, hairCol: '#E8D49A', wide: true, build: 1.12 },
  visionBro:   { name: 'The elder brother', role: "Hong's account, 1837", body: 'robe', robe: '#EADFC4', edge: P.gold2, longHair: true, hairCol: '#D8C08A', build: 1.0 },
  tpSoldier:   { name: 'Taiping soldier', role: '', body: 'tunic', tunic: '#6E4A36', hose: '#3A3026', belt: '#5A4A36', wrap: P.red, longHair: true, build: 1.0 },
  tpWoman:     { name: 'Taiping woman soldier', role: '', body: 'tunic', tunic: '#7A3A2A', hose: '#3A3026', belt: '#1E1A15', wrap: P.red, longHair: true, build: 0.9 },
  qingSoldier: { name: 'Qing soldier', role: '', body: 'tunic', tunic: P.blue, hose: '#2B4256', belt: '#1E1A15', cone: '#8A7A5A', queue: true, build: 1.0 },
  hunanSoldier:{ name: 'Hunan Army soldier', role: '', body: 'tunic', tunic: '#34506A', hose: '#22364A', belt: P.gold, wrap: '#22364A', queue: true, build: 1.02 },
  bannerman:   { name: 'Manchu bannerman', role: '', body: 'tunic', tunic: '#A88A44', hose: '#5A4A2E', belt: '#1E1A15', mhat: '#1E1A15', mhatTop: '#5A4A2E', queue: true, build: 1.0 },
  foreignSoldier:{ name: 'British / French soldier', role: '', body: 'tunic', tunic: '#2E465C', hose: '#1E2A36', belt: '#EDE3CF', kepi: '#1E2A36', build: 1.0 },
  scholar:     { name: 'Exam candidate', role: '', body: 'robe', robe: '#8C7A5C', edge: '#6E5A43', lapel: '#6E5A43', skullcap: '#1E1A15', queue: true, wide: true, build: 0.96 },
  villager:    { name: 'Villager', role: '', body: 'tunic', tunic: '#8C7A5C', hose: '#4A4036', belt: '#5A4A36', cone: '#9C8A66', queue: true, build: 1.0 },
  hakkaWoman:  { name: 'Hakka woman', role: '', body: 'robe', robe: '#5E5242', edge: '#3A3026', lapel: '#3A3026', cone: '#9C8A66', build: 0.92 },
  burner:      { name: 'Charcoal burner', role: '', body: 'tunic', tunic: '#4A4036', hose: '#2A241D', belt: '#6E5A43', queue: true, build: 1.04 },
});

// ---- Chinese architecture (ink silhouettes like the rest of the library)
export function roofCN(ctx, x, y, w, h, col = B) { // curved roof with up-swept eaves; y = eave line
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - w / 2 - w * 0.07, y - h * 0.32);
  ctx.quadraticCurveTo(x - w * 0.42, y + h * 0.02, x - w * 0.3, y - h * 0.55); ctx.lineTo(x - w * 0.2, y - h); ctx.lineTo(x + w * 0.2, y - h); ctx.lineTo(x + w * 0.3, y - h * 0.55);
  ctx.quadraticCurveTo(x + w * 0.42, y + h * 0.02, x + w / 2 + w * 0.07, y - h * 0.32); ctx.quadraticCurveTo(x + w * 0.3, y + h * 0.12, x, y + h * 0.1); ctx.quadraticCurveTo(x - w * 0.3, y + h * 0.12, x - w / 2 - w * 0.07, y - h * 0.32); ctx.fill();
  ctx.fillRect(x - w * 0.22, y - h * 1.06, w * 0.44, h * 0.08);
}
export function hallCN(ctx, x, y, s, col = B, lit = false, tiers = 1, roofCol = null) {
  ctx.fillStyle = col; ctx.fillRect(x - 1.25 * s, y - 0.18 * s, 2.5 * s, 0.18 * s); // platform
  ctx.fillRect(x - 1.0 * s, y - 0.75 * s, 2.0 * s, 0.6 * s);
  for (let i = 0; i < 6; i++) win(ctx, x - 0.85 * s + i * 0.31 * s, y - 0.62 * s, 0.16 * s, 0.32 * s, lit && i % 2 === 1);
  roofCN(ctx, x, y - 0.72 * s, 2.5 * s, 0.55 * s, roofCol ?? col);
  if (tiers > 1) { ctx.fillStyle = col; ctx.fillRect(x - 0.6 * s, y - 1.45 * s, 1.2 * s, 0.4 * s); roofCN(ctx, x, y - 1.3 * s, 1.6 * s, 0.45 * s, roofCol ?? col); }
}
export function cnWall(ctx, x0, x1, y, h, col = B) { // brick city wall with rectangular crenels
  ctx.fillStyle = col; ctx.fillRect(x0, y - h, x1 - x0, h); for (let x = x0; x < x1; x += h * 0.32) ctx.fillRect(x, y - h * 1.14, h * 0.2, h * 0.14);
  ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 1.5; for (let yy = y - h + 14; yy < y; yy += 16) { ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x1, yy); ctx.stroke(); }
}
export function gateTowerCN(ctx, x, y, s, col = B, lit = false) { // massive gate block with an arched passage and a two-eave tower
  ctx.fillStyle = col; ctx.fillRect(x - 1.5 * s, y - 1.1 * s, 3.0 * s, 1.1 * s); for (let k = 0; k < 10; k++) ctx.fillRect(x - 1.5 * s + k * 0.31 * s, y - 1.2 * s, 0.18 * s, 0.1 * s);
  ctx.fillStyle = '#0E0B08'; ctx.beginPath(); ctx.moveTo(x - 0.3 * s, y); ctx.lineTo(x - 0.3 * s, y - 0.5 * s); ctx.quadraticCurveTo(x, y - 0.85 * s, x + 0.3 * s, y - 0.5 * s); ctx.lineTo(x + 0.3 * s, y); ctx.fill();
  hallCN(ctx, x, y - 1.15 * s, 0.85 * s, col, lit, 2);
}
export function farmhouseCN(ctx, x, y, s, lit = false, col = B) {
  ctx.fillStyle = mixColor(col, '#8A7A60', 0.25); ctx.fillRect(x - 0.55 * s, y - 0.45 * s, 1.1 * s, 0.45 * s);
  roofCN(ctx, x, y - 0.42 * s, 1.25 * s, 0.38 * s, col);
  win(ctx, x - 0.32 * s, y - 0.32 * s, 0.14 * s, 0.12 * s, lit); ctx.fillStyle = '#100D0A'; ctx.fillRect(x + 0.08 * s, y - 0.32 * s, 0.17 * s, 0.32 * s);
}
export function pagoda(ctx, x, y, s, col = B, tiers = 7) {
  for (let i = 0; i < tiers; i++) { const k = 1 - i * 0.09, yy = y - i * 0.62 * s; ctx.fillStyle = col; ctx.fillRect(x - 0.42 * s * k, yy - 0.5 * s, 0.84 * s * k, 0.5 * s); roofCN(ctx, x, yy - 0.48 * s, 1.25 * s * k, 0.22 * s, col); }
  ctx.fillRect(x - 0.03 * s, y - tiers * 0.62 * s - 0.5 * s, 0.06 * s, 0.5 * s);
}
export function junk(ctx, x, y, s, t, col = P.ink2, sail = '#8A6B47', flag = null) { // river junk with two batten sails; faces right
  const bob = Math.sin(t * 1.3 + x * 0.01) * 0.03 * s; ctx.save(); ctx.translate(x, y + bob);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-1.5 * s, -0.42 * s); ctx.lineTo(-1.2 * s, 0.12 * s); ctx.lineTo(1.1 * s, 0.12 * s); ctx.quadraticCurveTo(1.55 * s, -0.05 * s, 1.6 * s, -0.36 * s); ctx.lineTo(-1.5 * s, -0.42 * s); ctx.fill();
  ctx.fillRect(-1.5 * s, -0.62 * s, 0.5 * s, 0.24 * s);
  for (const [mx, mh] of [[-0.25, 1.9], [0.75, 1.4]]) { ctx.strokeStyle = col; ctx.lineWidth = 0.05 * s; ctx.beginPath(); ctx.moveTo(mx * s, -0.4 * s); ctx.lineTo(mx * s, -(0.4 + mh) * s); ctx.stroke();
    ctx.fillStyle = sail; ctx.beginPath(); ctx.moveTo(mx * s - 0.05 * s, -(0.45 + mh) * s); ctx.quadraticCurveTo(mx * s + 0.75 * s, -(0.4 + mh * 0.95) * s, mx * s + 0.65 * s, -0.55 * s); ctx.lineTo(mx * s - 0.05 * s, -0.55 * s); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(30,22,14,0.55)'; ctx.lineWidth = 0.025 * s; for (let k = 1; k < 6; k++) { const yy = -(0.55 + mh * k / 6.2) * s; ctx.beginPath(); ctx.moveTo(mx * s - 0.05 * s, yy); ctx.lineTo(mx * s + 0.62 * s + 0.08 * s * Math.sin(k), yy - 0.06 * s); ctx.stroke(); } }
  if (flag) { const wv = Math.sin(t * 4 + x) * 0.05 * s; ctx.fillStyle = flag; ctx.beginPath(); ctx.moveTo(-0.25 * s, -2.3 * s); ctx.lineTo(0.25 * s, -2.22 * s + wv); ctx.lineTo(-0.25 * s, -2.05 * s); ctx.fill(); }
  ctx.restore();
}
export function warship(ctx, x, y, s, t, col = '#2A2E34', smoke_ = true) { // Western steam warship (paddle/screw, funnel, two masts); faces left
  const bob = Math.sin(t * 1.1 + x * 0.02) * 0.025 * s; ctx.save(); ctx.translate(x, y + bob);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-2.2 * s, -0.35 * s); ctx.lineTo(2.0 * s, -0.42 * s); ctx.lineTo(1.8 * s, 0.15 * s); ctx.lineTo(-1.9 * s, 0.15 * s); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#E3D6BA'; for (let i = 0; i < 9; i++) ctx.fillRect(-1.6 * s + i * 0.36 * s, -0.22 * s, 0.12 * s, 0.08 * s); ctx.fillStyle = col;
  ctx.fillRect(0.1 * s, -1.1 * s, 0.28 * s, 0.7 * s); ctx.strokeStyle = col; ctx.lineWidth = 0.05 * s;
  for (const mx of [-1.2, 1.2]) { ctx.beginPath(); ctx.moveTo(mx * s, -0.4 * s); ctx.lineTo(mx * s, -2.4 * s); ctx.stroke(); for (const yy of [-1.3, -1.9]) { ctx.beginPath(); ctx.moveTo(mx * s - 0.45 * s, yy * s); ctx.lineTo(mx * s + 0.45 * s, yy * s); ctx.stroke(); } }
  ctx.restore(); if (smoke_) smoke(ctx, x + 0.24 * s, y - 1.1 * s, t, s * 0.25, Math.round(x), 'rgba(50,46,44,0.3)');
}
export function kiln(ctx, x, y, s, t, seed = 1, col = B) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 0.5 * s, Math.PI, TAU); ctx.fill(); ctx.fillStyle = '#E8A43A'; ctx.globalAlpha *= 0.8; ctx.fillRect(x - 0.08 * s, y - 0.18 * s, 0.16 * s, 0.18 * s); ctx.globalAlpha /= 0.8; smoke(ctx, x, y - 0.5 * s, t, s * 0.004 * 100, seed, 'rgba(70,64,58,0.22)'); }
export function karst(ctx, yBase, seed, col, n = 9, hMin = 160, hMax = 420, x0 = -200, x1 = W + 200) { // Guangxi tower-karst peaks
  const r = rng(seed); ctx.fillStyle = col;
  for (let i = 0; i < n; i++) { const cx = lerp(x0, x1, (i + r() * 0.8) / n), hh = lerp(hMin, hMax, r()), ww = hh * (0.42 + r() * 0.25);
    ctx.beginPath(); ctx.moveTo(cx - ww, yBase + 10); ctx.bezierCurveTo(cx - ww * 0.95, yBase - hh * 0.8, cx - ww * 0.45, yBase - hh * 1.05, cx, yBase - hh); ctx.bezierCurveTo(cx + ww * 0.5, yBase - hh * 1.02, cx + ww * 0.95, yBase - hh * 0.7, cx + ww, yBase + 10); ctx.fill(); }
  ctx.fillRect(x0, yBase, x1 - x0, H);
}
export function paddies(ctx, y0, y1, col, line_, n = 7, seed = 3) { ctx.fillStyle = col; ctx.fillRect(-W, y0, W * 3, y1 - y0); ctx.strokeStyle = line_; ctx.lineWidth = 3; const r = rng(seed);
  for (let i = 1; i <= n; i++) { const yy = y0 + (y1 - y0) * Math.pow(i / n, 1.6); ctx.beginPath(); ctx.moveTo(-50, yy); for (let x = 0; x <= W + 50; x += 60) ctx.lineTo(x, yy + Math.sin(x / (180 + r() * 40) + i) * 8 * (i / n + 0.3)); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(255,255,255,0.16)'; ctx.lineWidth = 2; for (let i = 0; i < 30; i++) { const xx = r() * W, yy = lerp(y0, y1, r()); ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + 40 + r() * 60, yy); ctx.stroke(); } }
export function bamboo(ctx, x, y, s, seed = 1, col = '#3E3A2A') { const r = rng(seed); ctx.strokeStyle = col; ctx.fillStyle = col;
  for (let i = 0; i < 7; i++) { const bx = x + (r() - 0.5) * 0.6 * s, hh = (0.9 + r() * 0.6) * s, lean = (r() - 0.5) * 0.2 * s; ctx.lineWidth = 0.025 * s; ctx.beginPath(); ctx.moveTo(bx, y); ctx.quadraticCurveTo(bx + lean * 0.3, y - hh * 0.6, bx + lean, y - hh); ctx.stroke();
    for (let k = 0; k < 6; k++) { const ly = y - hh * (0.45 + k * 0.1), lx = bx + lean * (0.45 + k * 0.1); ctx.beginPath(); ctx.ellipse(lx + (k % 2 ? 0.08 : -0.08) * s, ly, 0.09 * s, 0.018 * s, k % 2 ? 0.5 : -0.5, 0, TAU); ctx.fill(); } } }
export function obelisk(ctx, x, y, s, col = B) { // Monument to the People's Heroes: two-tier terrace, tall slab, small roof cap
  ctx.fillStyle = col; ctx.fillRect(x - 2.2 * s, y - 0.25 * s, 4.4 * s, 0.25 * s); ctx.fillRect(x - 1.6 * s, y - 0.5 * s, 3.2 * s, 0.25 * s);
  ctx.fillStyle = mixColor(col, '#EDE3CF', 0.25); ctx.fillRect(x - 1.05 * s, y - 0.95 * s, 2.1 * s, 0.45 * s); ctx.fillStyle = col;
  ctx.fillRect(x - 0.55 * s, y - 1.3 * s, 1.1 * s, 0.35 * s); ctx.fillRect(x - 0.38 * s, y - 5.6 * s, 0.76 * s, 4.3 * s); roofCN(ctx, x, y - 5.55 * s, 1.05 * s, 0.35 * s, col);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 2; for (let k = 0; k < 8; k++) { ctx.beginPath(); ctx.moveTo(x - 1.0 * s + k * 0.28 * s, y - 0.92 * s); ctx.lineTo(x - 1.0 * s + k * 0.28 * s, y - 0.53 * s); ctx.stroke(); }
}
export function tiananmenGate(ctx, x, y, s, col = B) { ctx.fillStyle = col; ctx.fillRect(x - 3.0 * s, y - 1.0 * s, 6.0 * s, 1.0 * s);
  ctx.fillStyle = '#0E0B08'; for (const dx of [-1.6, -0.8, 0, 0.8, 1.6]) { ctx.beginPath(); ctx.moveTo(x + dx * s - 0.17 * s, y); ctx.lineTo(x + dx * s - 0.17 * s, y - 0.45 * s); ctx.quadraticCurveTo(x + dx * s, y - 0.65 * s, x + dx * s + 0.17 * s, y - 0.45 * s); ctx.lineTo(x + dx * s + 0.17 * s, y); ctx.fill(); }
  hallCN(ctx, x, y - 1.0 * s, 1.6 * s, col, false, 2); }
