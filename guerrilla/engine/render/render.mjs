// Render engine: resolves shot timing from the narration timeline, draws transitions and global overlays,
// and streams raw frames to ffmpeg.  Usage:
//   node render.mjs --still 12.5,40.2 [--dir out]      PNG stills at those times
//   node render.mjs --from 0 --to 60 --out seg.mp4     video segment (frames in [from,to))
//   node render.mjs --cues                              write sound-effect cue list (cues.json) and shot list (shots.json)
import fs from 'fs';
import { spawn } from 'child_process';
import { W, H, FPS, T, P, clamp, lerp, easeIO, easeOut, rng, makeCanvas, filmLook, puff } from './core.mjs';
import { fuse } from './gfx.mjs';
import { SHOTS } from './shots.mjs';

const LEAD = 0.15;                     // picture leads the word by ~4 frames
const TD = { cut: 0, fade: 0.6, black: 0.9, ink: 0.8, whip: 0.36, smoke: 0.9, flash: 0.3 };

// ---- resolve timing
for (const s of SHOTS) s.start = typeof s.at === 'string' ? T.f(s.at) - LEAD : s.at;
SHOTS.sort((a, b) => a.start - b.start);
SHOTS.forEach((s, i) => { s.end = i + 1 < SHOTS.length ? SHOTS[i + 1].start : T.duration; s.dur = s.end - s.start; s.td = s.td ?? TD[s.trans ?? 'cut']; s.idx = i; });

const [main, ctx] = makeCanvas(), [bufA, ca] = makeCanvas(), [bufB, cb] = makeCanvas(), [bufM, cm] = makeCanvas();

function drawShot(c, s, t) { c.save(); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none'; c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = P.ink; c.fillRect(0, 0, W, H); s.draw(c, t, t - s.start, s); c.restore(); }

function inkMask(c, u, seed) { // organic ink-bleed blots that grow to cover the frame (one path, one fill: destination-in must see a single source)
  const r = rng(seed); c.fillStyle = '#000'; c.beginPath(); let any = false;
  for (let i = 0; i < 9; i++) { const x = r() * W, y = r() * H, base = (0.25 + r() * 0.6) * W * easeIO(clamp(u * 1.25 - r() * 0.25));
    if (base <= 0) continue; any = true;
    for (let k = 0; k <= 40; k++) { const a = k / 40 * Math.PI * 2, rr = base * (1 + 0.18 * Math.sin(a * 5 + i) + 0.1 * Math.sin(a * 11 + i * 3)); const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; k ? c.lineTo(px, py) : c.moveTo(px, py); }
    c.closePath(); }
  if (any) c.fill('nonzero'); else { c.fillRect(0, 0, 0, 0); }
  return any;
}

export function frameAt(t, frameNo = 0) {
  let i = SHOTS.findIndex(s => t >= s.start && t < s.end); if (i < 0) i = SHOTS.length - 1;
  let A = SHOTS[i], B = null, u = 0;
  const nx = SHOTS[i + 1];
  if (A.td > 0 && t < A.start + A.td / 2 && i > 0) { B = A; A = SHOTS[i - 1]; u = (t - (B.start - B.td / 2)) / B.td; }
  else if (nx && nx.td > 0 && t >= nx.start - nx.td / 2) { B = nx; u = (t - (nx.start - nx.td / 2)) / nx.td; }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  let cur = A;
  if (!B) drawShot(ctx, A, t);
  else {
    u = clamp(u); const kind = B.trans; cur = u < 0.5 ? A : B;
    if (kind === 'black') {
      if (u < 0.5) { drawShot(ctx, A, t); ctx.fillStyle = `rgba(10,8,6,${easeIO(u * 2)})`; ctx.fillRect(0, 0, W, H); }
      else { drawShot(ctx, B, t); ctx.fillStyle = `rgba(10,8,6,${1 - easeIO((u - 0.5) * 2)})`; ctx.fillRect(0, 0, W, H); }
    } else if (kind === 'flash') {
      if (u < 0.5) drawShot(ctx, A, t); else drawShot(ctx, B, t);
      ctx.fillStyle = `rgba(250,240,220,${Math.sin(u * Math.PI) * 0.9})`; ctx.fillRect(0, 0, W, H);
    } else if (kind === 'whip') {
      drawShot(ca, A, t); drawShot(cb, B, t); const e = easeIO(u), off = e * W;
      const sm = Math.sin(u * Math.PI) * 70; ctx.save(); // motion blur: a few offset copies
      for (let k = 0; k < 5; k++) { const d = (k / 4 - 0.5) * sm; ctx.globalAlpha = k === 0 ? 1 : 0.35; ctx.drawImage(bufA, -off + d, 0); ctx.drawImage(bufB, W - off + d, 0); } ctx.restore();
    } else if (kind === 'ink') {
      drawShot(ctx, A, t); drawShot(cm, B, t); cm.save(); cm.globalCompositeOperation = 'destination-in'; const any = inkMask(cm, u, B.idx * 13 + 1); cm.restore();
      if (any) ctx.drawImage(bufM, 0, 0);
    } else { // fade / smoke
      drawShot(ctx, A, t); drawShot(cb, B, t); ctx.save(); ctx.globalAlpha = easeIO(u); ctx.drawImage(bufB, 0, 0); ctx.restore();
      if (kind === 'smoke') { const r = rng(B.idx); for (let k = 0; k < 14; k++) puff(ctx, '#28241F', r() * W + (u - 0.5) * 300, r() * H, 260 + r() * 300, Math.sin(u * Math.PI) * 0.55 * (0.4 + r() * 0.6), 0.2); }
    }
  }
  // ---- global overlay: the fuse at each chapter start
  T.chapters.forEach((ch, n) => { if (n === 0) return; const at = ch.start - 0.1;
    if (t > at - 0.1 && t < at + 4.6) fuse(ctx, t, at, (n - 1) / (T.chapters.length - 1), n / (T.chapters.length - 1), { dur: 4.4, label: `Chapter ${n} · ${ch.title.replace(/:.*/, '')}`, num: ch.title.includes(':') ? ch.title.split(':')[1].trim() : null, light: (cur.dark ?? false) }); });
  filmLook(ctx, frameNo);
  return main;
}

// ---- CLI
const args = process.argv.slice(2), arg = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
if (args.includes('--cues')) {
  const cues = []; for (const s of SHOTS) for (const c of (s.sfx ?? [])) cues.push({ t: +c[0].toFixed(3), type: c[1], gain: c[2] ?? 1, dur: c[3] ?? null, shot: s.id });
  cues.sort((a, b) => a.t - b.t);
  fs.writeFileSync('/home/claude/project/cues.json', JSON.stringify(cues, null, 1));
  fs.writeFileSync('/home/claude/project/shots.json', JSON.stringify(SHOTS.map(s => ({ id: s.id, start: +s.start.toFixed(3), end: +s.end.toFixed(3), dur: +s.dur.toFixed(2), trans: s.trans ?? 'cut', at: s.at, desc: s.desc ?? '' })), null, 1));
  console.log(SHOTS.length, 'shots,', cues.length, 'cues');
} else if (arg('--still')) {
  const dir = arg('--dir') ?? '/tmp/claude-0/-home-claude/0dc83cd9-91de-5bea-8f6d-50bb195a76a5/scratchpad/stills'; fs.mkdirSync(dir, { recursive: true });
  for (const ts of arg('--still').split(',')) { const t = +ts; const t0 = Date.now(); const c = frameAt(t, Math.round(t * FPS));
    const f = `${dir}/t${t.toFixed(2).padStart(7, '0')}.jpg`; fs.writeFileSync(f, c.toBuffer('image/jpeg', 82)); console.log(f, Date.now() - t0, 'ms'); }
} else {
  const from = +(arg('--from') ?? 0), to = +(arg('--to') ?? T.duration), out = arg('--out') ?? '/home/claude/project/out/video.mp4';
  const f0 = Math.round(from * FPS), f1 = Math.min(Math.round(to * FPS), Math.round(T.duration * FPS));
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'faster', '-crf', '18', '-pix_fmt', 'yuv420p', '-g', '50', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const tStart = Date.now();
  for (let f = f0; f < f1; f++) {
    const c = frameAt(f / FPS, f); const buf = Buffer.from(c.data());
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 250 === 0) console.log(`frame ${f}/${f1} t=${(f / FPS).toFixed(1)}s  ${((Date.now() - tStart) / Math.max(1, f - f0)).toFixed(0)} ms/frame`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); console.log('done', out, ((Date.now() - tStart) / 1000).toFixed(0), 's');
}
