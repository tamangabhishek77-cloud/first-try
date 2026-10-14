# Direct Commons downloads without the API: upload.wikimedia.org/<md5 path>, standard thumbnail widths first (the API is rate-limited from here).
import json, hashlib, subprocess, os, time, urllib.parse
UA = "MajorRevolutionDoc/1.0 (https://github.com/tamangabhishek77-cloud/first-try; educational documentary)"
F = json.load(open('files.json'))
def ok(p): return os.path.exists(p) and os.path.getsize(p) > 6000 and open(p, 'rb').read(2) in (b'\xff\xd8', b'\x89P')
for k, t in F.items():
    out = f'raw/{k}.jpg'
    if ok(out): continue
    name = t.replace(' ', '_'); h = hashlib.md5(name.encode()).hexdigest(); q = urllib.parse.quote(name)
    base = 'https://upload.wikimedia.org/wikipedia/commons'
    urls = [f'{base}/thumb/{h[0]}/{h[:2]}/{q}/{wd}px-{q}' for wd in (1280, 960, 500)] + [f'{base}/{h[0]}/{h[:2]}/{q}']
    for u in urls:
        code = subprocess.run(['curl', '-s', '-m', '90', '-A', UA, '-o', out, '-w', '%{http_code}', u], capture_output=True, text=True).stdout
        if ok(out): print(k, 'OK', u.split('/')[-1][:40], os.path.getsize(out), flush=True); break
        print(k, code, u.split('/')[-1][:30], flush=True); time.sleep(4)
    time.sleep(3)
print('END', flush=True)
