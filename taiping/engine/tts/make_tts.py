#!/usr/bin/env python3
"""Generate narration fragment by fragment and build the master timeline.

Reads script.txt, writes:
  tts/frag_XXX.wav   one trimmed clip per fragment (24 kHz mono)
  timeline.json      chapters, fragments with start/duration and per-word estimated times
  audio/narration.wav  the assembled narration track
"""
import json, re, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

VOICE, SPEED = "bm_george", 1.06
SR = 24000
GAP_COMMA, GAP_STOP, GAP_CHAPTER, LEAD = 0.22, 0.48, 1.1, 0.6

def trim(x, thr=0.012, pad=0.04):
    a = np.abs(x)
    idx = np.where(a > thr)[0]
    if not len(idx):
        return x
    s = max(0, idx[0] - int(pad * SR)); e = min(len(x), idx[-1] + int(pad * SR))
    return x[s:e]

LEX = json.load(open("tts/lexicon.json", encoding="utf-8")) if __import__("os").path.exists("tts/lexicon.json") else {}
LEX_RE = re.compile(r"\b(" + "|".join(sorted(map(re.escape, LEX), key=len, reverse=True)) + r")('s)?\b") if LEX else None

def speak(k, text):
    """Kokoro TTS; words in tts/lexicon.json are spliced in as IPA so foreign names are said correctly."""
    if not LEX_RE or not LEX_RE.search(text):
        return k.create(text, voice=VOICE, speed=SPEED, lang="en-gb")
    parts, pos = [], 0
    for m in LEX_RE.finditer(text):
        if text[pos:m.start()].strip(): parts.append(k.tokenizer.phonemize(text[pos:m.start()], "en-gb"))
        parts.append(LEX[m.group(1)] + ("z" if m.group(2) else ""))
        pos = m.end()
    if text[pos:].strip(): parts.append(k.tokenizer.phonemize(text[pos:], "en-gb"))
    ph = " ".join(x.strip() for x in parts)
    for a, b in ((" ,", ","), (" .", "."), (" :", ":"), (" ?", "?")): ph = ph.replace(a, b)
    return k.create(ph, voice=VOICE, speed=SPEED, lang="en-gb", is_phonemes=True)

def main(only=None):
    k = Kokoro("models/kokoro-v1.0.onnx", "models/voices-v1.0.bin")
    items, chapter = [], None
    for raw in open("script.txt", encoding="utf-8"):
        line = raw.rstrip("\n").strip()
        if not line or (line.startswith("#") and not line.startswith("## ")):
            continue
        if line.startswith("## "):
            chapter = line[3:].strip(); items.append({"type": "chapter", "title": chapter}); continue
        m = re.match(r"\{pause ([0-9.]+)\}", line)
        if m:
            items.append({"type": "pause", "dur": float(m.group(1))}); continue
        spoken, _, display = line.partition("||")
        spoken = spoken.strip(); display = (display or spoken).strip()
        items.append({"type": "frag", "spoken": spoken, "display": display, "chapter": chapter})

    t = LEAD; out = []; chapters = []; fid = 0; audio = [np.zeros(int(LEAD * SR), np.float32)]
    prev_gap = 0.0
    for it in items:
        if it["type"] == "chapter":
            if chapters:
                t += GAP_CHAPTER; audio.append(np.zeros(int(GAP_CHAPTER * SR), np.float32))
            chapters.append({"title": it["title"], "start": round(t, 3)}); continue
        if it["type"] == "pause":
            t += it["dur"]; audio.append(np.zeros(int(it["dur"] * SR), np.float32)); continue
        fid += 1; key = f"f{fid:03d}"
        path = f"tts/frag_{fid:03d}.wav"
        if (only is not None and fid in only) or not __import__("os").path.exists(path):
            s, sr = speak(k, it["spoken"])
            s = trim(np.asarray(s, np.float32)); sf.write(path, s, SR)
        else:
            s, _ = sf.read(path, dtype="float32")
        dur = len(s) / SR
        # per-word time estimate inside the fragment: proportional to characters (good to ~0.1 s in short fragments)
        words = it["display"].split(); total = sum(len(w) + 1 for w in words); acc = 0; wt = []
        for w in words:
            wt.append({"w": w, "t": round(t + dur * acc / total, 3)}); acc += len(w) + 1
        out.append({"id": key, "chapter": it["chapter"], "text": it["display"], "spoken": it["spoken"],
                    "start": round(t, 3), "dur": round(dur, 3), "words": wt})
        audio.append(s); t += dur
        gap = GAP_STOP if it["display"].rstrip()[-1:] in ".?!:" else GAP_COMMA
        audio.append(np.zeros(int(gap * SR), np.float32)); t += gap
        print(key, round(dur, 2), it["spoken"][:60], flush=True)
    total = t + 1.0; audio.append(np.zeros(int(1.0 * SR), np.float32))
    track = np.concatenate(audio)
    sf.write("audio/narration.wav", track, SR)
    json.dump({"fps": 25, "duration": round(len(track) / SR, 3), "chapters": chapters, "frags": out},
              open("timeline.json", "w"), indent=1)
    print("TOTAL", round(len(track) / SR, 1), "s")

if __name__ == "__main__":
    only = set(int(x) for x in sys.argv[1:]) if len(sys.argv) > 1 else None
    main(only)
