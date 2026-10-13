# QA contact sheets: one still per shot (at a chosen fraction of the shot), 3 columns, 12 per sheet, labelled with shot id.
import json, sys, subprocess, os
from PIL import Image, ImageDraw
ROOT = '/home/claude/project'; out = sys.argv[1]; ids = sys.argv[2].split(',') if len(sys.argv) > 2 and sys.argv[2] else None; frac = float(sys.argv[3]) if len(sys.argv) > 3 else 0.6
S = json.load(open(f'{ROOT}/shots.json')); S = [s for s in S if not ids or s['id'] in ids]
ts = [round(s['start'] + s['dur'] * frac, 2) for s in S]
d = out + '_stills'; os.makedirs(d, exist_ok=True)
subprocess.run(['node', f'{ROOT}/render/render.mjs', '--still', ','.join(map(str, ts)), '--dir', d], check=True, capture_output=True)
for k in range(0, len(S), 12):
    M = Image.new('RGB', (1920, 1440), (0, 0, 0)); dr = ImageDraw.Draw(M)
    for i, (s, t) in enumerate(zip(S[k:k + 12], ts[k:k + 12])):
        im = Image.open(f'{d}/t{t:07.2f}.jpg').resize((640, 360)); x, y = (i % 3) * 640, (i // 3) * 360; M.paste(im, (x, y))
        dr.rectangle([x, y, x + 150, y + 26], fill=(0, 0, 0)); dr.text((x + 6, y + 6), f"{s['id']} {t:.1f}s", fill=(255, 80, 60))
    M.save(f'{out}_{k // 12 + 1}.jpg', quality=82); print(f'{out}_{k // 12 + 1}.jpg')
