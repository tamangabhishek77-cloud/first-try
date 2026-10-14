import json,subprocess,urllib.parse,time,os,sys
UA="MajorRevolutionDoc/1.0 (https://github.com/tamangabhishek77-cloud/first-try; educational documentary)"
F=json.load(open('files.json'))
def get(u):
    for i in range(6):
        s=subprocess.run(['curl','-s','-m','40','-A',UA,u],capture_output=True,text=True).stdout
        try: return json.loads(s)
        except Exception: time.sleep(10+i*10)
meta={}
if os.path.exists('meta.json'): meta=json.load(open('meta.json'))
for k,t in F.items():
    out=f'raw/{k}.jpg'
    if k in meta and os.path.exists(out) and os.path.getsize(out)>5000: continue
    r=get('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','titles':'File:'+t,'prop':'imageinfo','iiprop':'url|extmetadata|size','iiurlwidth':1280,'format':'json'}))
    if not r or 'query' not in r: print('API fail',k,flush=True); time.sleep(60); continue
    pg=list(r['query']['pages'].values())[0]
    if 'imageinfo' not in pg: print('MISSING',k,t); continue
    ii=pg['imageinfo'][0]; em=ii.get('extmetadata',{})
    g=lambda n:(em.get(n,{}).get('value','') or '')[:160]
    meta[k]={'title':t,'license':g('LicenseShortName'),'artist':g('Artist'),'date':g('DateTimeOriginal'),'size':[ii['width'],ii['height']]}
    u=ii['url'] if ii['width']<=1280 else ii.get('thumburl',ii['url'])
    for i in range(5):
        subprocess.run(['curl','-s','-m','90','-A',UA,'-o',out,u])
        if os.path.exists(out) and os.path.getsize(out)>5000 and open(out,'rb').read(2) in (b'\xff\xd8',b'\x89P'): break
        time.sleep(60+i*30)
    print(k, os.path.getsize(out) if os.path.exists(out) else 0, meta[k]['license'], meta[k]['size'], flush=True)
    json.dump(meta,open('meta.json','w'),indent=1,ensure_ascii=False); time.sleep(25)
