# face crops -> sepia 512px medallion portraits in portraits/proc/<key>.png  (cx, cy = face centre as fraction; s = crop side as fraction of width)
import os
from PIL import Image, ImageOps, ImageEnhance
R='/home/claude/project/archival/raw/'; O='/home/claude/project/portraits/proc/'
C={'maoY':('p_maoY',0.5,0.35,0.62),'braun':('p_braun',0.43,0.29,0.6),'snow':('p_snow',0.47,0.33,0.62),'zhu':('p_zhu',0.5,0.27,0.8),'chiang':('p_chiang',0.5,0.32,0.62),'prachanda':('p_prachanda',0.5,0.32,0.8),
   'zhou':('a_yanan37',0.2,0.37,0.3),'zhangX':('p_zhangX',0.5,0.3,0.6)}
for k,(f,cx,cy,s) in C.items():
    p=R+f+'.jpg'
    if not os.path.exists(p) or os.path.getsize(p)<6000: continue
    im=Image.open(p).convert('RGB'); w,h=im.size; d=s*w
    x0=max(0,min(w-d,cx*w-d/2)); y0=max(0,min(h-d,cy*h-d/2)); im=im.crop((int(x0),int(y0),int(x0+d),int(y0+d))).resize((512,512),Image.LANCZOS)
    g=ImageOps.autocontrast(ImageOps.grayscale(im),cutoff=1)
    sep=ImageOps.colorize(g,black='#1E160E',white='#F2E6CC',mid='#8A6E4E'); ImageEnhance.Contrast(sep).enhance(1.05).save(O+k+'.png'); print(k)
