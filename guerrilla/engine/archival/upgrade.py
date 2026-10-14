# second pass: try bigger thumbnails for the photos that only came down small (rate limits)
import json, hashlib, subprocess, os, time, urllib.parse
from PIL import Image
UA = "MajorRevolutionDoc/1.0 (https://github.com/tamangabhishek77-cloud/first-try; educational documentary)"
F = json.load(open('files.json'))
for k in ['a_ruijin31', 'a_changchun', 'a_wall38', 'a_prc49', 'a_yanan37', 'a_mao36']:
    if Image.open(f'raw/{k}.jpg').width >= 900: continue
    name = F[k].replace(' ', '_'); h = hashlib.md5(name.encode()).hexdigest(); q = urllib.parse.quote(name)
    for wd in (1280, 960):
        for attempt in range(6):
            out = f'raw/{k}_big.jpg'; u = f'https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{q}/{wd}px-{q}'
            code = subprocess.run(['curl', '-s', '-m', '90', '-A', UA, '-o', out, '-w', '%{http_code}', u], capture_output=True, text=True).stdout
            if code == '200' and open(out, 'rb').read(2) == b'\xff\xd8': os.replace(out, f'raw/{k}.jpg'); print(k, wd, 'OK', flush=True); break
            print(k, wd, code, flush=True); time.sleep(30 if code == '429' else 2)
            if code not in ('429', '000'): break
        if Image.open(f'raw/{k}.jpg').width >= 900: break
print('UPGRADE-END', flush=True)
