# Archival photos -> house sepia (same treatment as the portrait medallions). Usage: python3 proc_arch.py
import os, json
from PIL import Image, ImageOps, ImageEnhance
R='/home/claude/project/archival/raw/'; O='/home/claude/project/archival/proc/'
for f in sorted(os.listdir(R)):
    if not f.startswith('a_') or os.path.getsize(R+f) < 6000: continue
    im = Image.open(R+f).convert('RGB'); w, h = im.size
    if w > 1600: im = im.resize((1600, int(h * 1600 / w)), Image.LANCZOS)
    g = ImageOps.autocontrast(ImageOps.grayscale(im), cutoff=1)
    sep = ImageOps.colorize(g, black='#1E160E', white='#F2E6CC', mid='#8A6E4E')
    sep = ImageEnhance.Contrast(sep).enhance(1.05)
    if f.startswith('a_founding'): W_, H_ = sep.size; sep = sep.crop((int(W_ * 0.205), int(H_ * 0.138), int(W_ * 0.80), int(H_ * 0.355)))  # the painting only (the file is a photo of it on display)
    sep.save(O + f.replace('.png', '.jpg'), quality=90); print(f, sep.size)
