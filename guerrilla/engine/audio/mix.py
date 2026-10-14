#!/usr/bin/env python3
"""Sound for The Major Revolution documentaries (episode 3: China's guerrilla war, 1927–1949): synthesised effects from cues.json, an original modal score keyed to the
chapter timeline, ducking under the narration, and a stereo pre-master (loudness is finished in ffmpeg)."""
import json, numpy as np, soundfile as sf
from scipy import signal

SR = 48000
ROOT = '/home/claude/project'
TL = json.load(open(f'{ROOT}/timeline.json'))
CUES = json.load(open(f'{ROOT}/cues.json'))
DUR = TL['duration']
N = int((DUR + 0.5) * SR)
rng = np.random.default_rng(1381)

def t_(d): return np.arange(int(d * SR)) / SR
def env_ad(n, a, d, curve=4.0):
    t = np.arange(n) / SR; e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) * curve / max(d, 1e-4)); return e
def lp(x, fc, order=2): b, a = signal.butter(order, min(fc / (SR / 2), 0.99), 'low'); return signal.lfilter(b, a, x)
def hp(x, fc, order=2): b, a = signal.butter(order, fc / (SR / 2), 'high'); return signal.lfilter(b, a, x)
def bp(x, f1, f2, order=2): b, a = signal.butter(order, [f1 / (SR / 2), min(f2 / (SR / 2), 0.99)], 'band'); return signal.lfilter(b, a, x)
def noise(d): return rng.standard_normal(int(d * SR))
def norm(x, peak=1.0): m = np.max(np.abs(x)) + 1e-9; return x / m * peak

def shaped_noise(d, fc, bw, env=None, nper=1024):
    """noise with a time-varying spectral band (fc, bw are functions of u in 0..1)"""
    hop = nper // 4; frames = int(d * SR / hop) + 4; freqs = np.fft.rfftfreq(nper, 1 / SR)
    U = np.linspace(0, 1, frames)
    mag = np.exp(-0.5 * ((freqs[:, None] - np.array([fc(u) for u in U])[None, :]) / np.array([bw(u) for u in U])[None, :]) ** 2)
    if env is not None: mag *= np.array([env(u) for u in U])[None, :]
    Z = mag * np.exp(1j * rng.uniform(0, 2 * np.pi, mag.shape))
    _, x = signal.istft(Z, SR, nperseg=nper, noverlap=nper - hop); return x[:int(d * SR)]

def partials(d, fs, decays, amps=None):
    t = t_(d); x = np.zeros_like(t)
    for i, f in enumerate(fs): x += (amps[i] if amps else 1 / (i + 1)) * np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * np.exp(-t / decays[i])
    return x

# ------------------------------------------------------------------ effects
def fx_whoosh(d=0.6):
    x = shaped_noise(d, lambda u: 300 + 2600 * np.sin(np.pi * u) ** 2, lambda u: 300 + 900 * u, lambda u: np.sin(np.pi * u) ** 1.5); return norm(x, 0.8)
def fx_impact(d=1.6):
    t = t_(d); f = 38 + 60 * np.exp(-t / 0.05); ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.45); hit = lp(noise(d), 1800) * np.exp(-t / 0.05) * 0.8; tail = lp(noise(d), 400) * np.exp(-t / 0.6) * 0.25
    return norm(body + hit + tail, 0.95)
def fx_boom(d=4.0):
    t = t_(d); f = 32 + 40 * np.exp(-t / 0.08); body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 1.4)
    rum = lp(noise(d), 160) * np.exp(-t / 1.6) * 0.6; hit = lp(noise(d), 2500) * np.exp(-t / 0.08) * 0.6
    return norm(body + rum + hit, 0.95)
def fx_tick(d=0.12):
    t = t_(d); return norm(hp(noise(d), 2500) * np.exp(-t / 0.004) + 0.5 * np.sin(2 * np.pi * 2300 * t) * np.exp(-t / 0.012), 0.7)
def fx_thud(d=0.6):
    t = t_(d); f = 55 + 70 * np.exp(-t / 0.03); return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.18) + lp(noise(d), 600) * np.exp(-t / 0.04) * 0.6, 0.9)
def fx_paper(d=0.7):
    x = bp(noise(d), 1200, 7000); am = np.abs(lp(noise(d), 18)); am = am / am.max(); e = np.sin(np.pi * np.linspace(0, 1, len(x))) ** 0.6
    return norm(x * am * e, 0.6)
def fx_quill(d=1.5):
    t = t_(d); x = bp(noise(d), 2500, 9000); gate = (np.sin(2 * np.pi * 7 * t + 3 * np.sin(2 * np.pi * 1.3 * t)) > 0.2).astype(float); gate = lp(gate, 60)
    return norm(x * gate * (0.6 + 0.4 * np.abs(lp(noise(d), 4)) * 3), 0.35)
def fx_seal(d=0.8): return norm(fx_thud(d) + 0.5 * np.pad(partials(0.3, [210, 470], [0.06, 0.03]), (0, int(d * SR) - int(0.3 * SR))), 0.9)
def fx_stamp(d=0.8): x = fx_seal(d); x[:int(0.25 * SR)] += 0.4 * fx_paper(0.25); return norm(x, 0.95)
def fx_coin(d=0.7):
    base = rng.uniform(0.9, 1.1); x = partials(d, [2100 * base, 3620 * base, 5230 * base, 7900 * base, 9800 * base], [0.25, 0.18, 0.12, 0.08, 0.05], [1, .7, .5, .35, .2])
    x[:200] += hp(noise(200 / SR), 3000) * 0.6; return norm(x, 0.6)
def fx_coins(d=1.2):
    out = np.zeros(int(d * SR) + SR)
    for k in range(9): s = int(rng.uniform(0, d * 0.8) * SR); c = fx_coin(0.6) * rng.uniform(0.4, 1); out[s:s + len(c)] += c
    return norm(out, 0.7)
def fx_bell(d=6.0):
    f0 = 196.0; rs = [0.5, 1.0, 1.183, 1.506, 2.0, 2.514, 2.662, 3.011, 4.166]; dec = [4.0, 3.2, 2.6, 2.2, 1.8, 1.4, 1.2, 1.0, 0.7]
    x = partials(d, [f0 * r for r in rs], dec, [0.8, 1, .6, .5, .45, .3, .25, .2, .12]); x[:300] += hp(noise(300 / SR), 1500) * 0.3; return norm(x, 0.8)
def crowd_base(d, bright=1.0, rate=3.0, n=10):
    x = np.zeros(int(d * SR))
    for _ in range(n):
        lo = rng.uniform(250, 600); hi = lo * rng.uniform(3, 6) * bright; v = bp(noise(d), lo, hi)
        am = np.abs(lp(noise(d), rng.uniform(1.5, rate))); x += v * am / (am.max() + 1e-9)
    return x
def fx_crowd(d=3.0): e = np.minimum(1, np.linspace(0, d, int(d * SR)) / 0.6) * np.minimum(1, (d - np.linspace(0, d, int(d * SR))) / 0.8); return norm(crowd_base(d) * e, 0.55)
def fx_murmur(d=4.0): e = np.minimum(1, np.linspace(0, d, int(d * SR)) / 1.0) * np.minimum(1, (d - np.linspace(0, d, int(d * SR))) / 1.0); return norm(crowd_base(d, 0.7, 2.0) * e, 0.35)
def fx_roar(d=2.5): t = np.linspace(0, d, int(d * SR)); e = np.minimum(1, t / 0.15) * np.exp(-np.maximum(0, t - 0.6) / 1.0); return norm(crowd_base(d, 1.6, 6, 14) * e, 0.85)
def fx_cheer(d=2.5): t = np.linspace(0, d, int(d * SR)); e = np.minimum(1, t / 0.4) * np.exp(-np.maximum(0, t - 1.0) / 0.9); return norm(crowd_base(d, 2.0, 8, 14) * e, 0.8)
def fx_fire(d=4.0):
    t = np.linspace(0, d, int(d * SR)); base = lp(noise(d), 500) * 0.6 + bp(noise(d), 800, 3000) * 0.15
    cr = np.zeros_like(t); idx = rng.integers(0, len(t) - 400, int(d * 40));
    for i in idx: cr[i:i + 300] += hp(noise(300 / SR), 2000) * np.exp(-np.arange(300) / 40) * rng.uniform(0.3, 1)
    e = np.minimum(1, t / 0.5) * np.minimum(1, (d - t) / 0.8); return norm((base + cr) * e, 0.7)
def fx_hooves(d=4.0):
    out = np.zeros(int(d * SR) + SR); step = 1 / 2.4; k = 0; tt = 0.0
    while tt < d:
        for off in (0, 0.11):
            s = int((tt + off) * SR); h = bp(noise(0.06), 500, 2500) * np.exp(-np.arange(int(0.06 * SR)) / (0.008 * SR)) * rng.uniform(0.6, 1); out[s:s + len(h)] += h
        tt += step * rng.uniform(0.95, 1.05)
    return norm(out[:int(d * SR)], 0.6)
def fx_drum(d=3.0, bpm=104):
    out = np.zeros(int(d * SR) + SR); beat = 60 / bpm; tt = 0.0; k = 0
    while tt < d:
        f0 = 95 if k % 4 == 0 else 120; n = int(0.4 * SR); t = np.arange(n) / SR; f = f0 + 80 * np.exp(-t / 0.02)
        h = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.15) + bp(noise(0.4), 200, 1500) * np.exp(-t / 0.03) * 0.4
        s = int(tt * SR); out[s:s + n] += h * (1 if k % 4 == 0 else 0.6); tt += beat / (2 if k % 2 else 1) * (1 if k % 2 == 0 else 1); k += 1
    return norm(out[:int(d * SR)], 0.8)
def fx_march(d=3.0):
    out = np.zeros(int(d * SR) + SR)
    for v in range(14):
        tt = rng.uniform(0, 0.5); rate = rng.uniform(1.7, 2.0)
        while tt < d: s = int(tt * SR); h = lp(noise(0.08), 900) * np.exp(-np.arange(int(0.08 * SR)) / (0.015 * SR)) * rng.uniform(0.3, 0.8); out[s:s + len(h)] += h; tt += 1 / rate
    out[:int(d * SR)] += bp(noise(d), 2000, 6000) * 0.03
    return norm(out[:int(d * SR)], 0.6)
def fx_clang(d=1.5): x = partials(d, [430, 1120, 1870, 2650, 3400, 4700], [0.6, 0.4, 0.3, 0.2, 0.15, 0.1], [1, .8, .6, .5, .4, .3]); x[:400] += hp(noise(400 / SR), 2000); return norm(x, 0.9)
def fx_slash(d=0.6): return norm(np.concatenate([shaped_noise(0.25, lambda u: 2000 + 5000 * u, lambda u: 1500, lambda u: np.sin(np.pi * u)), np.zeros(int(0.35 * SR))]) + 0.3 * partials(d, [2600, 3900], [0.15, 0.1]), 0.9)
def fx_splash(d=1.2): t = t_(d); x = lp(noise(d), 3000) * np.exp(-t / 0.18) + bp(noise(d), 300, 1200) * np.exp(-t / 0.4) * 0.5; return norm(x, 0.7)
def fx_gate(d=1.6):
    t = t_(1.2); f = 90 + 40 * np.sin(2 * np.pi * 0.9 * t) + 15 * lp(noise(1.2), 8) * 10; saw = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR)
    cr = bp(saw, 300, 2500) * np.minimum(1, t / 0.1) * np.exp(-t / 0.9); out = np.zeros(int(d * SR)); out[:len(cr)] += cr * 0.6
    th = fx_thud(0.5); s = int(1.0 * SR); out[s:s + len(th)] += th[:len(out) - s]; return norm(out, 0.8)
def fx_creak(d=1.0): x = fx_gate(1.2)[:int(d * SR)]; return norm(x, 0.6)
def fx_chain(d=0.9):
    out = np.zeros(int(d * SR) + SR)
    for k in range(14): s = int(rng.uniform(0, d * 0.85) * SR); c = partials(0.25, [1200 * rng.uniform(.9, 1.2), 2600, 3900], [0.06, 0.04, 0.03]); out[s:s + len(c)] += c * rng.uniform(.3, 1)
    return norm(out[:int(d * SR)], 0.6)
def amb(d, lo, hi, amr, fade=1.0):
    t = np.linspace(0, d, int(d * SR)); x = bp(noise(d), lo, hi); am = 0.6 + 0.4 * np.sin(2 * np.pi * amr * t + rng.uniform(0, 6))
    e = np.minimum(1, t / fade) * np.minimum(1, (d - t) / fade); return x * am * e
def fx_wind(d=6.0): return norm(amb(d, 150, 900, 0.17) + 0.3 * amb(d, 900, 2500, 0.11), 0.5)
def fx_water(d=8.0): return norm(amb(d, 200, 1600, 0.4) + 0.2 * amb(d, 1600, 5000, 0.9), 0.45)
def fx_oars(d=4.0):
    out = np.zeros(int(d * SR) + SR); tt = 0.2
    while tt < d: sp = fx_splash(0.6) * 0.6; s = int(tt * SR); out[s:s + len(sp)] += sp; tt += 1.4
    return norm(out[:int(d * SR)], 0.5)
def fx_sizzle(d=1.5): t = t_(d); return norm(hp(noise(d), 3000) * np.exp(-t / 0.5) * (0.6 + 0.4 * np.abs(lp(noise(d), 30)) * 5), 0.5)
def fx_match(d=1.0): t = t_(d); x = hp(noise(d), 1500) * np.exp(-t / 0.03) + bp(noise(d), 800, 4000) * np.minimum(1, t / 0.15) * np.exp(-t / 0.5) * 0.5; return norm(x, 0.8)
def fx_fuse(d=1.7): t = t_(d); x = hp(noise(d), 2500) * 0.5 + fx_fire(d) * 0.4; e = np.minimum(1, t / 0.1) * np.minimum(1, (d - t) / 0.1); return norm(x * e, 0.6)
def fx_thunder(d=4.5):
    t = t_(d); x = np.zeros_like(t)
    for k in range(4): s = rng.uniform(0, 1.2); x += lp(noise(d), rng.uniform(150, 400)) * np.exp(-np.maximum(0, t - s) / rng.uniform(0.6, 1.4)) * (t > s)
    return norm(x * np.minimum(1, t / 0.05), 0.9)
def fx_sting(d=1.6):
    t = t_(d); x = np.zeros_like(t)
    for f in [146.8, 155.6, 220, 233.1]: x += signal.sawtooth(2 * np.pi * f * t * rng.uniform(.998, 1.002))
    x = lp(x, 1400) * np.minimum(1, t / 0.02) * np.exp(-t / 0.7); return norm(x, 0.7)
def fx_bowdraw(d=1.0):
    out = np.zeros(int(d * SR))
    for k in range(10): s = int(rng.uniform(0, 0.3) * SR); c = fx_creak(0.7) * rng.uniform(.3, .8); out[s:s + len(c)] += c[:len(out) - s]
    return norm(out, 0.6)
def fx_scuffle(d=1.5):
    out = np.zeros(int(d * SR) + SR)
    for k in range(12): s = int(rng.uniform(0, d) * SR); c = fx_thud(0.3) * rng.uniform(.2, .7); out[s:s + len(c)] += c
    out[:int(d * SR)] += crowd_base(d, 1.4, 8, 6) * 0.3; return norm(out[:int(d * SR)], 0.7)
def fx_smash(d=1.5):
    t = t_(d); x = lp(noise(d), 4000) * np.exp(-t / 0.08)
    for k in range(20): s = int(rng.uniform(0.02, 0.8) * SR); c = partials(0.2, [rng.uniform(3000, 8000)], [0.04]); x[s:s + len(c)] += c[:len(x) - s] * 0.4
    return norm(x, 0.8)
def fx_village(d=6.0):
    out = fx_wind(d) * 0.3
    for k in range(int(d * 1.5)):
        s = int(rng.uniform(0, d - 0.5) * SR); n = int(rng.uniform(0.06, 0.15) * SR); tt = np.arange(n) / SR; f0 = rng.uniform(2500, 4500)
        ch = np.sin(2 * np.pi * np.cumsum(f0 + 900 * np.sin(2 * np.pi * rng.uniform(15, 30) * tt)) / SR) * np.sin(np.pi * tt / tt[-1]) ** 2
        out[s:s + n] += ch * rng.uniform(.1, .3)
    return norm(out, 0.4)
def fx_camp(d=6.0): return norm(fx_fire(d) * 0.6 + fx_murmur(d) * 0.6, 0.5)
def fx_chant(d=9.0):
    t = t_(d); x = np.zeros_like(t)
    for f in [73.4, 110, 146.8, 220]: x += signal.sawtooth(2 * np.pi * f * (1 + 0.003 * np.sin(2 * np.pi * 5 * t + f)) * t)
    y = bp(x, 500, 900) * 1.0 + bp(x, 1000, 1300) * 0.5 + lp(x, 300) * 0.4; e = np.minimum(1, t / 1.5) * np.minimum(1, (d - t) / 1.5); return norm(y * e, 0.45)
def fx_night(d=12.0): return norm(fx_wind(d) * 0.7 + fx_murmur(d) * 0.3, 0.5)
def fx_riot(d=5.0):
    out = fx_roar(d) * 0.8;
    for k in range(4): s = int(rng.uniform(0.2, d - 1.5) * SR); c = fx_smash(1.2) * 0.6; out[s:s + len(c)] += c
    return norm(out, 0.9)
def fx_snap(d=0.8): t = t_(d); x = hp(noise(d), 1500) * np.exp(-t / 0.01) + fx_thud(d) * 0.5; return norm(x, 0.9)
def fx_smallthing(d=0.4): return fx_tick(d)

# ---- Taiping additions
def fx_gong(d=6.0):
    t = t_(d); fs_ = [110, 167, 231, 298, 381, 470, 602]; x = sum(np.sin(2 * np.pi * f * (1 - 0.004 * np.minimum(t, 1)) * t + k) * np.exp(-t / (2.6 - k * 0.25)) / (1 + k * 0.4) for k, f in enumerate(fs_))
    x += lp(noise(d), 1800) * np.exp(-t / 0.05) * 0.6; return norm(x * np.minimum(1, t / 0.01), 0.9)
def fx_whip(d=0.6): t = t_(d); x = hp(noise(d), 2500) * np.exp(-t / 0.012) + bp(noise(d), 800, 3000) * np.exp(-t / 0.06) * 0.3; return norm(x, 0.95)
def fx_volley(d=1.6):
    out = np.zeros(int(d * SR))
    for k in range(9):
        s = int((0.02 + rng.uniform(0, 0.55)) * SR); n = int(0.5 * SR); t = t_(0.5); c = hp(noise(0.5), 900) * np.exp(-t / 0.018) + lp(noise(0.5), 600) * np.exp(-t / 0.12) * 0.6
        out[s:s + n] += c[:len(out) - s]
    return norm(out, 0.9)
def fx_motif(d=0.1): return np.zeros(int(d * SR))  # the planted object's three notes are played by the score

FX = {k[3:]: v for k, v in globals().items() if k.startswith('fx_')}
GAIN_DB = {  # level of each effect relative to the narration (0 dB = speech level)
  'whoosh': -16, 'impact': -9, 'boom': -8, 'tick': -20, 'thud': -11, 'paper': -17, 'quill': -21, 'seal': -12, 'stamp': -10, 'coin': -16, 'coins': -16,
  'bell': -13, 'crowd': -19, 'murmur': -23, 'roar': -15, 'cheer': -16, 'fire': -18, 'hooves': -18, 'drum': -18, 'march': -19, 'clang': -11, 'slash': -10,
  'splash': -16, 'gate': -14, 'creak': -16, 'chain': -14, 'wind': -24, 'water': -24, 'oars': -20, 'sizzle': -18, 'match': -12, 'fuse': -14, 'thunder': -13,
  'sting': -15, 'bowdraw': -15, 'scuffle': -16, 'smash': -13, 'village': -23, 'camp': -22, 'chant': -21, 'night': -24, 'riot': -14, 'snap': -9, 'gong': -12, 'whip': -10, 'volley': -11, 'motif': -60 }
DEF_DUR = { 'crowd': 3, 'murmur': 4, 'fire': 4, 'hooves': 4, 'drum': 3, 'march': 3, 'wind': 6, 'water': 8, 'oars': 4, 'village': 6, 'camp': 6, 'chant': 9, 'night': 12, 'riot': 5, 'quill': 1.5, 'coins': 1.2, 'fuse': 1.7 }

def pan_st(x, p):  # p in -1..1, constant power
    a = (p + 1) * np.pi / 4; return np.stack([x * np.cos(a), x * np.sin(a)])

def build_fx():
    bus = np.zeros((2, N))
    for c in CUES:
        typ = c['type']; fn = FX.get(typ)
        if fn is None: print('missing fx', typ); continue
        d = c['dur'] or DEF_DUR.get(typ)
        x = fn(d) if d else fn()
        x = x * 10 ** ((GAIN_DB.get(typ, -16)) / 20) * c['gain']
        s = int(max(0, c['t']) * SR); x = x[:N - s]
        bus[:, s:s + len(x)] += pan_st(x, rng.uniform(-0.35, 0.35))
    return bus

# ------------------------------------------------------------------ score
NOTE = {'C': -9, 'D': -7, 'E': -5, 'F': -4, 'G': -2, 'A': 0, 'B': 2}
def hz(n):  # 'D4', 'F#4', 'Bb3'
    name = n[0]; acc = n[1] if n[1] in '#b' else ''; octv = int(n[len(name) + len(acc):]); semi = NOTE[name] + (1 if acc == '#' else -1 if acc == 'b' else 0)
    return 440 * 2 ** ((semi + (octv - 4) * 12) / 12)
def saw_lp(f, d, fc=900, det=(0.996, 1.0, 1.004)):
    t = t_(d); x = sum(signal.sawtooth(2 * np.pi * f * k * t + rng.uniform(0, 6)) for k in det) / len(det); return lp(x, fc, 2)
def pad(notes, d, fc=1000, att=1.5, rel=1.5):
    t = t_(d); e = np.minimum(1, t / att) * np.minimum(1, (d - t) / rel); return sum(saw_lp(hz(n), d, fc) for n in notes) / len(notes) * e
def drone(notes, d, fc=600, att=2.0, rel=2.0): x = pad(notes, d, fc, att, rel); t = t_(d); return x * (0.85 + 0.15 * np.sin(2 * np.pi * 0.08 * t))
def recorder(n, d):
    f = hz(n); t = t_(d); vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / 0.35)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR; x = np.sin(ph) + 0.14 * np.sin(2 * ph) + 0.05 * np.sin(3 * ph)
    x += bp(noise(d), f * 1.5, f * 3) * 0.04; e = np.minimum(1, t / 0.05) * np.minimum(1, (d - t) / 0.09); return x * e
def pluck(n, d=1.6):
    f = hz(n); t = t_(d); x = sum((1 / k) * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (1.8 + k * 1.1)) for k in range(1, 9)); x[:120] *= np.linspace(0, 1, 120); return x
def cello(n, d, fc=700): t = t_(d); e = np.minimum(1, t / 0.04) * np.exp(-t / (d * 0.9)); return saw_lp(hz(n), d, fc, (0.998, 1.002)) * e
def tabor(d=0.5, f0=150):
    t = t_(d); f = f0 + 90 * np.exp(-t / 0.015); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12) + bp(noise(d), 300, 2500) * np.exp(-t / 0.025) * 0.5
def lowdrum(d=1.0, f0=55):
    t = t_(d); f = f0 + 60 * np.exp(-t / 0.03); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.35) + lp(noise(d), 400) * np.exp(-t / 0.05) * 0.4

MUS = np.zeros((2, N))
def put(x, t0, g=1.0, p=0.0, wide=0.0):
    s = int(t0 * SR);
    if s >= N: return
    x = x[:N - s] * g
    if wide > 0:  # cheap stereo width: slightly delayed copy on one side
        dl = int(0.011 * SR); y = np.concatenate([np.zeros(dl), x])[:len(x)]; st = np.stack([x * (1 - wide * 0.3) + y * wide * 0.3, x * (1 - wide * 0.3) - y * wide * 0.0 + y * wide * 0.3])
        a = (p + 1) * np.pi / 4; MUS[0, s:s + len(x)] += st[0] * np.cos(a) * 1.41 * 0.7; MUS[1, s:s + len(x)] += st[1] * np.sin(a) * 1.41 * 0.7
    else: MUS[:, s:s + len(x)] += pan_st(x, p)
def melody(seq, t0, beat, voice=recorder, g=0.22, p=0.15, legato=0.95):
    tt = t0
    for n, b in seq:
        if n != '-': put(voice(n, b * beat * legato), tt, g, p)
        tt += b * beat
    return tt
def ostinato(notes, t0, t1, step, voice, g, p=0.0, fc=None):
    tt = t0; k = 0
    while tt < t1:
        n = notes[k % len(notes)]; x = voice(n, step * 1.6) if voice is not cello else cello(n, step * 0.95, fc or 700); put(x, tt, g, p); tt += step; k += 1
def beats(t0, t1, bpm, fn, g, pattern=(1,), p=0.0):
    tt = t0; k = 0; b = 60 / bpm
    while tt < t1:
        a = pattern[k % len(pattern)]
        if a > 0: put(fn(), tt, g * a, p)
        tt += b; k += 1
def section(fn_list): pass

# ---- episode 3 themes: A minor pentatonic ("yu" mode on A), a marching theme for the Red Army, a lament, and the rule motif
TH_A = [('E4', 1), ('A4', 1), ('C5', 1), ('D5', 1), ('E5', 2), ('D5', 1), ('C5', 1), ('A4', 2), ('G4', 1), ('A4', 1), ('C5', 2), ('A4', 2)]   # the march (A minor pentatonic)
TH_B = [('E5', 1), ('D5', 1), ('C5', 1), ('A4', 1), ('G4', 2), ('A4', 1), ('C5', 1), ('D5', 2), ('C5', 1), ('A4', 1), ('A4', 3)]
RULE = [('E5', 2), ('D5', 2), ('A4', 4)]   # the sweet-potato rule motif: three notes, every time the rule sheet appears
LAMENT = [('E5', 2), ('C5', 2), ('D5', 1), ('C5', 1), ('A4', 2), ('G4', 2), ('A4', 4), ('C5', 2), ('D5', 1), ('E5', 1), ('D5', 2), ('C5', 1), ('A4', 1), ('A4', 4)]
NAT = [['A2', 'C3', 'E3'], ['F2', 'A2', 'C3'], ['G2', 'B2', 'D3'], ['A2', 'C3', 'E3']]   # regal, Western-tinged chords for Chiang's side
REMEMBER = RULE

def ch(i): return TL['chapters'][i]['start']
F = {f['id']: f for f in TL['frags']}
def fs(i): return F[f'f{i:03d}']['start']
def fe(i): return F[f'f{i:03d}']['start'] + F[f'f{i:03d}']['dur']
def chords(seq, t0, t1, each, g=0.26, fc=1200):
    tt = t0; k = 0
    while tt < t1 - 0.5: put(pad(seq[k % len(seq)], min(each + 0.6, t1 - tt), fc, 0.8, 0.8), tt, g, 0, 1); tt += each; k += 1
def high(notes, t0, t1, g=0.16): put(pad(notes, t1 - t0, 3000, 2.5, 1.5), t0, g, 0, 1)
def march(t0, t1, bpm=104, g=0.2): beats(t0, t1, bpm, lambda: tabor(0.35), g, (1, 0.5, 0.8, 0.5)); beats(t0, t1, bpm / 2, lambda: lowdrum(0.8), g * 1.4)

def score():
    # COLD OPEN: dawn drone over Shanghai, a heartbeat for the run, the march theme swells under the title; silence for the sting
    put(drone(['A2', 'E3'], fs(6) - 0.2, 600, 3, 1.0), 0.0, 0.42, 0, 1); high(['A4', 'C5', 'E5'], 1.0, fs(6) - 0.3, 0.14)
    beats(fs(6), fs(11) - 0.2, 64, lambda: lowdrum(0.7, 48), 0.3, (1, 0.6)); put(pad(['A2', 'E3', 'G3'], fs(11) - fs(6), 800, 1, 1), fs(6), 0.22, 0, 1)
    put(pad(['A2', 'E3', 'A3', 'C4'], fe(13) - fs(11) + 0.5, 1600, 0.8, 0.6), fs(11) - 0.2, 0.32, 0, 1); march(fs(11), fe(13), 100, 0.24)
    melody(TH_A, fs(11) + 0.3, 60 / 100, g=0.17)
    # CH1 The barrel of a gun: dark night cluster for the purge; a low pulse for the meeting; the uprising and its crushing; the rules (motif cued by shots)
    c1 = ch(1); put(drone(['A1', 'E2', 'Bb2'], fs(19) - c1, 450, 1.5, 1), c1, 0.3, 0, 1); beats(fs(16), fs(19), 72, lambda: lowdrum(0.6, 46), 0.28, (1, 0.6))
    ostinato(['A2', 'Bb2', 'A2', 'G2'], fs(16), fs(19), 60 / 88, cello, 0.16, -0.2)
    put(pad(['A2', 'C3', 'E3'], fs(21) - fs(19), 700, 1, 1), fs(19), 0.2, 0, 1)
    put(drone(['A2', 'E3'], fs(24) - fs(21), 500, 1, 1), fs(21), 0.24, 0, 1); ostinato(['A3', 'E3', 'C4', 'E3'], fs(21), fs(24), 60 / 80 / 2, pluck, 0.08, 0.2)
    march(fs(24), fs(25), 112, 0.22); put(pad(['A2', 'Bb2', 'E3'], fs(26) - fs(25), 700, 0.2, 1), fs(25), 0.26, 0, 1)
    put(drone(['A2', 'E3'], fs(28) - fs(26), 500, 1, 1), fs(26), 0.22, 0, 1); melody(LAMENT[:6], fs(26) + 0.3, 60 / 72, g=0.12)
    put(pad(['A2', 'E3', 'A3'], ch(2) - fs(28), 900, 1.5, 1.5), fs(28), 0.2, 0, 1); ostinato(['A3', 'E3', 'G3', 'E3'], fs(28), ch(2) - 0.3, 60 / 84 / 2, pluck, 0.07, 0.2)
    # CH2 The mountain: misty pluck and flute; a strong chord for the Fourth Red Army; the sixteen characters as a slow drum ritual; the motif returns (major)
    c2 = ch(2); put(drone(['A2', 'E3'], fs(38) - c2, 600, 2, 1), c2, 0.22, 0, 1); ostinato(['E4', 'A3', 'C4', 'A3', 'D4', 'A3', 'G4', 'A3'], c2 + 0.3, fs(38), 60 / 92 / 2, pluck, 0.09, 0.25)
    melody(TH_B, fs(36), 60 / 80, g=0.13)
    put(pad(['A2', 'C#3', 'E3', 'A3'], fs(40) - fs(38), 1400, 0.5, 1), fs(38), 0.28, 0, 1); march(fs(38), fs(40), 104, 0.2)
    put(drone(['A2', 'Bb2'], fs(42) - fs(40), 500, 1, 1), fs(40), 0.24, 0, 1)
    put(drone(['A2', 'E3'], fs(49) - fs(42), 600, 1.5, 1), fs(42), 0.24, 0, 1); beats(fs(44), fs(48), 60, lambda: lowdrum(0.9, 50), 0.32)
    high(['A4', 'C5', 'E5'], fs(48), fs(49), 0.18)
    put(pad(['A2', 'C#3', 'E3'], ch(3) - fs(49), 1200, 1.5, 1), fs(49), 0.2, 0, 1); ostinato(['A3', 'E3', 'C#4', 'E3'], fs(49), ch(3) - 0.3, 60 / 92 / 2, pluck, 0.08, 0.2)
    # CH3 Lure them in: cat-and-mouse pluck, a tense pulse for the blue columns, hits for the strikes, triumph for the first line and Ruijin; the purge in darkness
    c3 = ch(3); put(drone(['A2', 'E3'], fs(57) - c3, 600, 2, 1), c3, 0.22, 0, 1); ostinato(['A3', 'C4', 'E4', 'C4'], c3 + 0.3, fs(57), 60 / 100 / 2, pluck, 0.09, 0.2)
    ostinato(['A2', 'A2', 'Bb2', 'A2'], fs(54), fs(58), 60 / 96, cello, 0.15, -0.2)
    march(fs(58), fs(61), 120, 0.24); put(pad(['A2', 'C#3', 'E3', 'A3'], fs(65) - fs(61), 1500, 0.5, 1), fs(61), 0.3, 0, 1); melody(TH_A, fs(62), 60 / 96, g=0.17)
    put(drone(['A1', 'E2', 'Bb2'], ch(4) - fs(65), 400, 1, 2), fs(65), 0.3, 0, 1); beats(fs(66), fs(69), 58, lambda: lowdrum(0.6, 44), 0.26, (1, 0.6)); melody(LAMENT[:7], fs(68) + 0.2, 60 / 66, g=0.11)
    # CH4 The blockhouses: Nationalist chords and a slow tightening pulse; Braun's cold drone; the defeat; a dying fall
    c4 = ch(4); chords(NAT, c4 + 0.2, fs(75), 2.6, 0.22); beats(fs(72), fs(75), 66, lambda: lowdrum(0.7, 46), 0.26)
    put(drone(['A2', 'Eb3'], fs(78) - fs(75), 500, 1, 1), fs(75), 0.24, 0, 1); ostinato(['A2', 'Bb2', 'A2', 'G#2'], fs(75), fs(78), 60 / 84, cello, 0.15, -0.2)
    march(fs(77), fs(79) + 0.5, 116, 0.22); put(pad(['A2', 'Bb2', 'E3'], fs(81) - fs(79), 700, 0.2, 1.5), fs(79), 0.28, 0, 1)
    put(drone(['A2', 'E3'], ch(5) - fs(81), 450, 1, 1.5), fs(81), 0.24, 0, 1); melody(LAMENT[:6], fs(81) + 0.3, 60 / 70, g=0.12)
    # CH5 The long retreat: a night march (soft pulse), battle at the Xiang, hope at Zunyi, a sly pluck for the river crossings
    c5 = ch(5); put(drone(['A2', 'E3'], fs(87) - c5, 500, 1.5, 1), c5, 0.24, 0, 1); beats(c5, fs(87), 92, lambda: tabor(0.3), 0.14, (1, 0.4, 0.7, 0.4)); melody(TH_B[:7], fs(85), 60 / 76, g=0.12)
    put(pad(['A2', 'Bb2', 'E3'], fs(89) - fs(87), 700, 0.5, 1), fs(87), 0.28, 0, 1); beats(fs(87), fs(89), 104, lambda: lowdrum(0.8), 0.32, (1, 0, 0.7, 0))
    put(pad(['A2', 'C#3', 'E3'], fs(93) - fs(89), 1100, 1.5, 1), fs(89), 0.22, 0, 1); high(['A4', 'C#5', 'E5'], fs(91), fs(93), 0.14)
    ostinato(['E4', 'A3', 'G4', 'A3', 'C5', 'A3', 'D4', 'A3'], fs(93), ch(6) - 0.3, 60 / 108 / 2, pluck, 0.1, 0.2); beats(fs(94), ch(6) - 0.3, 108, lambda: tabor(0.3), 0.18, (1, 0.5, 0.8, 0.5))
    # CH6 The bridge: river roar under a tense pulse, the crawl (drums), doubt (thin), the climb (lament), arrival; dread — then silence for the mid-roll
    c6 = ch(6); put(drone(['A2', 'E3'], fs(99) - c6, 500, 1.5, 1), c6, 0.24, 0, 1); ostinato(['A2', 'A2', 'Bb2', 'A2'], fs(97), fs(99), 60 / 92, cello, 0.15, -0.2)
    beats(fs(99), fs(100), 132, lambda: lowdrum(0.6), 0.32); put(pad(['A2', 'Eb3', 'A3'], fs(101) - fs(99), 800, 0.3, 0.6), fs(99), 0.28, 0, 1)
    put(pad(['A3', 'E4'], fs(101) - fs(100), 2500, 0.4, 0.6), fs(100), 0.14, 0, 1); march(fs(101), fs(102), 104, 0.2)
    put(drone(['A2', 'E3'], fs(104) - fs(102), 500, 1, 1), fs(102), 0.26, 0, 1); melody(LAMENT, fs(102), 60 / 76, g=0.13)
    put(pad(['A2', 'C#3', 'E3', 'A3'], fs(109) - fs(104), 1400, 1, 1), fs(104), 0.24, 0, 1); melody(TH_A[:8], fs(106), 60 / 84, g=0.12)
    put(drone(['A1', 'E2', 'Bb2'], fe(110) - fs(109), 400, 0.8, 0.1), fs(109), 0.3, 0, 1); beats(fs(109), fe(110) - 0.2, 60, lambda: lowdrum(0.7, 44), 0.3)
    # (silence after "And Chiang was coming to finish them.": the mid-roll break)
    # CH7 The kidnapping: a lighter pluck for Snow; tension for Xi'an; night drums for the raid; release; uneasy calm
    c7 = ch(7); put(pad(['A2', 'E3', 'A3'], fs(114) - c7, 1100, 2, 1), c7, 0.2, 0, 1); ostinato(['A3', 'E4', 'C4', 'E4'], c7 + 0.5, fs(114), 60 / 96 / 2, pluck, 0.09, 0.2)
    put(drone(['A2', 'Bb2'], fs(117) - fs(114), 500, 1, 1), fs(114), 0.24, 0, 1); chords(NAT[:2], fs(114), fs(116), 2.2, 0.18)
    put(drone(['A1', 'E2'], fs(122) - fs(117), 400, 0.5, 1), fs(117), 0.28, 0, 1); beats(fs(117), fs(120), 120, lambda: lowdrum(0.6), 0.3, (1, 0.6, 0.8, 0.6)); put(pad(['A2', 'Bb2', 'E3'], fs(122) - fs(120), 700, 0.2, 1), fs(120), 0.26, 0, 1)
    put(pad(['A2', 'C3', 'E3', 'G3'], ch(8) - fs(122), 1000, 1, 1.5), fs(122), 0.22, 0, 1); melody(TH_B[:8], fs(123), 60 / 80, g=0.12)
    # CH8 Fish in the sea: invasion (low ostinato and drums), Nanjing (a held lament, no drums), the guerrilla march, water pluck, the second line
    c8 = ch(8); ostinato(['A1', 'A1', 'Bb1', 'A1'], c8 + 0.1, fs(129), 60 / 96, cello, 0.18, -0.2); beats(c8, fs(129), 48, lambda: lowdrum(1.0, 42), 0.32)
    put(drone(['A1', 'E2'], fs(130) - fs(129), 400, 0.5, 1.5), fs(129), 0.3, 0, 1); melody(LAMENT[:4], w_('f129', 'Nanjing'), 60 / 66, g=0.12)
    march(fs(130), fs(134), 108, 0.22); melody(TH_A, fs(130) + 0.3, 60 / 108, g=0.16)
    put(pad(['A2', 'E3', 'A3', 'C4'], fs(137) - fs(134), 1200, 1.5, 1), fs(134), 0.2, 0, 1); ostinato(['E4', 'C4', 'A3', 'C4', 'D4', 'C4'], fs(134), fs(137), 60 / 84 / 2, pluck, 0.08, 0.2)
    put(pad(['A2', 'C#3', 'E3', 'A3'], ch(9) - fs(137), 1400, 1, 1), fs(137), 0.24, 0, 1); beats(fs(138), ch(9) - 0.3, 104, lambda: tabor(0.35), 0.18, (1, 0.5, 0.8, 0.5))
    # CH9 Kill all, burn all: offensive drums; the Three Alls as a dark cluster without rhythm; the cold lesson; the betrayal; the rise to a million
    c9 = ch(9); march(c9 + 0.2, fs(143), 116, 0.24); put(pad(['A2', 'E3', 'A3'], fs(143) - c9, 1000, 1, 1), c9, 0.2, 0, 1)
    put(drone(['A1', 'Bb1', 'E2'], fs(147) - fs(143), 400, 0.5, 1.5), fs(143), 0.32, 0, 1); high(['Bb4', 'E5'], fs(144), fs(146), 0.1)
    put(drone(['A2', 'E3'], fs(148) - fs(147), 500, 1, 1), fs(147), 0.22, 0, 1); chords(NAT, fs(148), fs(150), 2.2, 0.2)
    put(drone(['A2', 'Eb3'], fs(151) - fs(150), 500, 1, 1), fs(150), 0.24, 0, 1)
    put(pad(['A2', 'C#3', 'E3', 'A3'], ch(10) - fs(151), 1500, 1, 1), fs(151), 0.26, 0, 1); march(fs(152), ch(10) - 0.3, 104, 0.2); melody(TH_A[:8], fs(153), 60 / 96, g=0.15)
    # CH10 The cities fall: Nationalist chords (the odds), the walk-away (pluck), the land (march, rising), decay, Changchun (a cold drone — then silence), the great campaigns
    c10 = ch(10); chords(NAT, c10 + 0.2, fs(159), 2.4, 0.24); beats(fs(157), fs(159), 52, lambda: lowdrum(0.9), 0.26)
    ostinato(['E4', 'A3', 'G4', 'A3'], fs(159), fs(162), 60 / 96 / 2, pluck, 0.09, 0.2); put(pad(['A2', 'E3'], fs(162) - fs(159), 900, 1, 1), fs(159), 0.2, 0, 1)
    put(pad(['A2', 'C#3', 'E3'], fs(164) - fs(162), 1300, 1, 1), fs(162), 0.24, 0, 1); march(fs(162), fs(164), 108, 0.22)
    put(drone(['A2', 'Bb2'], fs(165) - fs(164), 500, 0.5, 1), fs(164), 0.24, 0, 1)
    put(drone(['A1', 'E2', 'Bb2'], fe(167) - fs(165), 380, 1.5, 0.1), fs(165), 0.3, 0, 1); beats(fs(165), fs(167), 54, lambda: lowdrum(0.6, 42), 0.24, (1, 0.5))
    # (silence after "...at least 150,000 civilians starved.")
    put(drone(['A2', 'E3'], fs(169) - fs(168), 450, 0.5, 1), fs(168), 0.22, 0, 1); melody(LAMENT[:5], fs(168) + 0.2, 60 / 64, g=0.11)
    march(fs(169), ch(11) - 0.3, 120, 0.26); put(pad(['A2', 'C#3', 'E3', 'A3'], ch(11) - fs(169), 1500, 1, 1), fs(169), 0.26, 0, 1); melody(TH_A, fs(170), 60 / 112, g=0.16)
    # CH11 Not one needle: the crossing (full march), all sixteen (a held major chord), Shanghai dawn (the motif, cued by shots), the proclamation, resolve
    c11 = ch(11); march(c11 + 0.2, fs(175), 112, 0.26); put(pad(['A2', 'C#3', 'E3', 'A3'], fs(175) - c11, 1600, 1, 1), c11, 0.28, 0, 1); melody(TH_A, c11 + 0.4, 60 / 112, g=0.17)
    put(pad(['A2', 'E3', 'A3', 'C#4'], fs(181) - fs(175), 1300, 2, 1.5), fs(175), 0.22, 0, 1); high(['A4', 'C#5', 'E5'], fs(175), fs(181), 0.13)
    ostinato(['E4', 'A3', 'C#4', 'A3'], fs(177), fs(181), 60 / 88 / 2, pluck, 0.08, 0.2)
    put(pad(['A2', 'C#3', 'E3', 'A3'], ch(12) - fs(181), 1800, 0.6, 1), fs(181), 0.3, 0, 1); march(fs(181), fs(183), 100, 0.24); melody(TH_B, fs(181) + 0.3, 60 / 92, g=0.17)
    put(drone(['A2', 'E3'], ch(12) - fs(183), 500, 1, 1.5), fs(183), 0.22, 0, 1)
    # CH12 The fish and the water: the cost (dark drone), Mao (cold), the theme travels the world (pluck + flute), the open question (thin, unresolved)
    c12 = ch(12); put(drone(['A1', 'E2', 'Bb2'], fs(189) - c12, 400, 1, 1), c12, 0.3, 0, 1); beats(fs(186), fs(188), 56, lambda: lowdrum(0.6, 44), 0.24)
    put(drone(['A2', 'E3'], DUR - fs(189), 600, 2, 3), fs(189), 0.2, 0, 1); ostinato(['E4', 'A3', 'C4', 'A3', 'D4', 'A3', 'G4', 'A3'], fs(189) + 0.2, fs(198), 60 / 92 / 2, pluck, 0.08, 0.2)
    melody(TH_A, fs(190), 60 / 80, g=0.15); put(pad(['A2', 'E3', 'A3'], fs(198) - fs(194), 1200, 1, 1), fs(194), 0.2, 0, 1)
    put(pad(['A2', 'E3', 'A3', 'B3'], DUR - fs(198) - 0.2, 1600, 2, 3), fs(198), 0.24, 0, 1); melody(RULE, fs(200), 0.5, g=0.12)
    # the planted object's motif, wherever the shots cue it
    for c in CUES:
        if c['type'] == 'motif': melody(RULE, c['t'], 0.42, g=0.24 * c['gain'])

def w_(fid, word):
    fr = F[fid]
    for x in fr['words']:
        if x['w'].lower().strip('.,:;?!').startswith(word.lower()): return x['t']
    return fr['start']

# ------------------------------------------------------------------ reverb, ducking, mix
def reverb(x, dur=1.6, wet=0.18, seed=7):
    r = np.random.default_rng(seed); n = int(dur * SR); t = np.arange(n) / SR
    out = np.zeros_like(x)
    for ch_ in range(2):
        ir = r.standard_normal(n) * np.exp(-t / (dur / 5)); ir = lp(ir, 5000); ir[:int(0.012 * SR)] = 0; ir /= np.sqrt(np.sum(ir ** 2))
        out[ch_] = signal.oaconvolve(x[ch_], ir)[:x.shape[1]]
    return x + wet * out

def main():
    vo, sr = sf.read(f'{ROOT}/audio/narration.wav', dtype='float32')
    vo = signal.resample_poly(vo, SR, sr)[:N]; vo = np.pad(vo, (0, N - len(vo)))
    vo = vo / (np.max(np.abs(vo)) + 1e-9) * 0.7
    # speech envelope for ducking (attack 40 ms, release 450 ms)
    a = np.abs(vo); env = signal.lfilter([1 - np.exp(-1 / (0.04 * SR))], [1, -np.exp(-1 / (0.04 * SR))], a)
    hold = signal.lfilter([1 - np.exp(-1 / (0.45 * SR))], [1, -np.exp(-1 / (0.45 * SR))], (env > 0.02).astype(float))
    duck = 1 - 0.5 * np.clip(hold * 1.6, 0, 1)  # about -6 dB under speech
    vrms = np.sqrt(np.mean(vo[np.abs(vo) > 0.02] ** 2))
    print('fx...', flush=True); fx = build_fx(); fx = reverb(fx, 1.4, 0.22)
    print('music...', flush=True); score(); mus = reverb(MUS, 2.6, 0.35, 3)
    # music sits ~20 dB under the voice when speech is present, ~14 dB in pauses
    mrms = np.sqrt(np.mean(mus[:, ::4] ** 2)) + 1e-9
    mus = mus / mrms * vrms * 10 ** (-14 / 20) * duck[None, :]
    fx = fx * 0.7  # fx gains are relative to the voice peak (0.7)
    fx = fx * (1 - 0.25 * np.clip(hold * 1.6, 0, 1))[None, :]
    mix = np.stack([vo, vo]) * 0.9 + fx + mus
    # gentle bus limiter
    pk = np.max(np.abs(mix)); print('peak before limit', pk)
    mix = np.tanh(mix / 0.95) * 0.95
    sf.write(f'{ROOT}/audio/mix_premaster.wav', mix.T.astype(np.float32), SR, subtype='FLOAT')
    sf.write(f'{ROOT}/audio/music_stem.wav', mus.T.astype(np.float32), SR, subtype='FLOAT')
    sf.write(f'{ROOT}/audio/fx_stem.wav', fx.T.astype(np.float32), SR, subtype='FLOAT')
    print('done', mix.shape[1] / SR, 's')

if __name__ == '__main__':
    main()
