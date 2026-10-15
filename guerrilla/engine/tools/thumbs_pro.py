import json, math, numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps, ImageEnhance, ImageChops
W,H=1920,1080; ANTON='/home/claude/project/fonts/Anton-Regular.ttf'
RED=(214,30,38); YEL=(242,194,0); WHITE=(247,240,226)
def F(s): return ImageFont.truetype(ANTON,s)
def bg(top,bot,glow=None,gc=(200,40,30),ga=0.6,smoke=0.5,seed=1):
    a=np.linspace(0,1,H)[:,None,None]; img=(np.array(top)*(1-a)+np.array(bot)*a)*np.ones((H,W,3))
    if glow:
        yy,xx=np.mgrid[0:H,0:W]; d=np.sqrt((xx-glow[0])**2+(yy-glow[1])**2)/glow[2]; g=np.clip(1-d,0,1)**1.6*ga
        img=img*(1-g[...,None])+np.array(gc)*g[...,None]
    r=np.random.default_rng(seed); n=Image.fromarray((r.random((54,96))*255).astype('uint8')).resize((W,H),Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
    n=np.array(n)[...,None]/255.0; img=img*(1-smoke*0.35)+img*smoke*0.7*n+ (n*40*smoke)
    return Image.fromarray(np.clip(img,0,255).astype('uint8')).convert('RGBA')
def bw(cut,contrast=1.35,tint=None):
    a=cut.split()[3]; g=ImageOps.autocontrast(cut.convert('L'),cutoff=1); g=ImageEnhance.Contrast(g).enhance(contrast)
    rgb=ImageOps.colorize(g,black=(10,8,6),white=(250,246,236)) if not tint else ImageOps.colorize(g,black=(8,8,10),white=tint)
    o=rgb.convert('RGBA'); o.putalpha(a); return o
def place(base,cut,h,x,y,rim=RED,rimw=12,glow=True):
    s=h/cut.height; c=cut.resize((int(cut.width*s),h),Image.LANCZOS); a=c.split()[3]
    if glow:
        gl=Image.new('RGBA',c.size,(0,0,0,0)); gl.putalpha(a.filter(ImageFilter.GaussianBlur(40)).point(lambda v:int(v*0.9)))
        sh=Image.new('RGBA',c.size,(0,0,0,255)); sh.putalpha(a.filter(ImageFilter.GaussianBlur(30))); base.alpha_composite(sh,(x+20,y+10))
    if rim:
        big=a.filter(ImageFilter.MaxFilter(rimw*2+1)); ol=Image.new('RGBA',c.size,rim+(255,)); ol.putalpha(big); base.alpha_composite(ol,(x,y))
    base.alpha_composite(c,(x,y)); return c.size
def text(base,s,x,y,size,col=WHITE,anchor='la',stroke=14,shadow=True,bgbar=None):
    d=ImageDraw.Draw(base); f=F(size)
    if bgbar:
        b=d.textbbox((x,y),s,font=f,anchor=anchor); d.rectangle((b[0]-28,b[1]-22,b[2]+28,b[3]+22),fill=bgbar)
        d.text((x,y),s,font=f,fill=col,anchor=anchor); return
    if shadow:
        sh=Image.new('RGBA',base.size,(0,0,0,0)); ImageDraw.Draw(sh).text((x+10,y+12),s,font=f,fill=(0,0,0,200),anchor=anchor,stroke_width=stroke,stroke_fill=(0,0,0,200)); base.alpha_composite(sh.filter(ImageFilter.GaussianBlur(12)))
    d.text((x,y),s,font=f,fill=col,anchor=anchor,stroke_width=stroke,stroke_fill=(10,8,6))
def finish(base,name):
    im=base.convert('RGB'); a=np.array(im).astype(float); yy,xx=np.mgrid[0:H,0:W]; d=np.sqrt(((xx-W/2)/W)**2+((yy-H/2)/H)**2); v=np.clip(1-(d-0.35)*1.1,0.45,1)
    a=a*v[...,None]; r=np.random.default_rng(9); a+=r.normal(0,6,a.shape); im=Image.fromarray(np.clip(a,0,255).astype('uint8'))
    im.resize((1280,720),Image.LANCZOS).save(f'out/{name}.jpg',quality=94); im.resize((168,94),Image.LANCZOS).save(f'out/{name}_phone.png')
import os; os.makedirs('out',exist_ok=True)
C=lambda k: Image.open(f'{k}_cut.png').convert('RGBA')
def crop_alpha(c): return c.crop(c.split()[3].getbbox())
mao36=crop_alpha(C('mao36')); chiang=crop_alpha(C('chiang36')); mao25=crop_alpha(C('mao25')); mao49=crop_alpha(C('mao49'))

# 1 · RUN. HIDE. WIN. — the face of the story
b=bg((14,8,6),(40,10,8),glow=(1350,520,900),gc=(190,30,24),ga=0.75,seed=2)
place(b,bw(mao36),1130,980,40,rim=RED,rimw=10)
text(b,'RUN.',90,90,250,WHITE); text(b,'HIDE.',90,380,250,WHITE); text(b,'WIN.',90,670,290,RED)
finish(b,'P1_run_hide_win')

# 2 · 4,000,000 vs 1,000,000 — the underdog split
b=bg((16,22,30),(8,10,14),seed=3); red=bg((60,8,6),(20,4,4),glow=(1500,500,800),gc=(200,30,24),ga=0.7,seed=4)
m=Image.new('L',(W,H),0); ImageDraw.Draw(m).polygon([(1060,0),(W,0),(W,H),(860,H)],fill=255); b.paste(red,(0,0),m)
place(b,bw(chiang,1.25,tint=(205,220,235)),1000,40,110,rim=(90,140,190),rimw=8)
place(b,bw(mao36),1050,1060,60,rim=RED,rimw=10)
d=ImageDraw.Draw(b); d.line([(1060,0),(860,H)],fill=YEL,width=22)
text(b,'4,000,000',470,40,170,(200,215,230),anchor='ma'); text(b,'1,000,000',1500,40,170,YEL,anchor='ma')
text(b,'WHO WON?',960,880,150,WHITE,anchor='ma',bgbar=(10,8,6))
finish(b,'P2_who_won')

# 3 · 1927 vs 1949 — before / after
b=bg((10,8,7),(26,20,16),seed=5); r=bg((70,10,8),(25,5,4),glow=(1450,560,800),gc=(210,40,26),ga=0.8,seed=6)
m=Image.new('L',(W,H),0); m.paste(255,(960,0,W,H)); b.paste(r,(0,0),m)
place(b,bw(mao25,1.2),900,140,200,rim=(120,120,120),rimw=6)
place(b,bw(mao49,1.3),960,1080,140,rim=RED,rimw=10)
ImageDraw.Draw(b).rectangle((952,0,968,H),fill=YEL)
text(b,'1,000 MEN',480,40,150,WHITE,anchor='ma'); text(b,'ALL OF CHINA',1440,40,150,YEL,anchor='ma')
text(b,'1927',480,900,120,(180,180,180),anchor='ma'); text(b,'1949',1440,900,120,RED,anchor='ma')
finish(b,'P3_1000_men_to_china')

# 4 · RETREAT = VICTORY — pattern violation
b=bg((26,22,18),(12,10,8),glow=(1400,560,900),gc=(150,30,24),ga=0.6,seed=7)
place(b,bw(mao36,1.3),1080,1000,40,rim=RED,rimw=10)
st=Image.new('RGBA',(1060,330),(0,0,0,0)); sd=ImageDraw.Draw(st); f=F(200)
sd.rounded_rectangle((15,15,1045,315),radius=26,outline=RED+(255,),width=22); sd.text((530,165),'RETREAT',font=f,fill=RED+(255,),anchor='mm')
rr=np.random.default_rng(3); arr=np.array(st); mask=rr.random(arr.shape[:2])<0.18; arr[mask,3]=(arr[mask,3]*0.2).astype('uint8'); st=Image.fromarray(arr).rotate(8,expand=True,resample=Image.BICUBIC)
b.alpha_composite(st,(40,120))
text(b,'=',470,520,170,WHITE,anchor='ma'); text(b,'VICTORY',470,700,220,YEL,anchor='ma')
finish(b,'P4_retreat_victory')

# 5 · the map: they ran 6,000 km — map strike
M=json.load(open('/home/claude/project/render/maps.json'))
b=bg((8,12,16),(4,6,8),smoke=0.3,seed=8); d=ImageDraw.Draw(b)
vw={'lon':104,'lat':34,'span':52}; k=W/vw['span']; cl=math.cos(math.radians(vw['lat']))
P=lambda la,lo:(W/2+(lo-vw['lon'])*k, H/2-(la-vw['lat'])*k/cl)
for ring in M['world']['land']:
    d.polygon([P(la,lo) for lo,la in ring],fill=(30,38,46))
lay=Image.new('RGBA',(W,H),(0,0,0,0)); ld=ImageDraw.Draw(lay)
for ring in M['borders']['CHN']: ld.polygon([P(la,lo) for lo,la in ring],fill=(170,24,28,255),outline=(255,90,80,255))
g=lay.filter(ImageFilter.GaussianBlur(30)); b.alpha_composite(g); b.alpha_composite(lay)
LM=[[25.88,116.03],[25.95,115.41],[25.4,113.0],[25.93,111.07],[26.23,109.14],[27.72,106.93],[28.59,105.7],[27.4,105.3],[26.2,102.6],[29.91,102.23],[30.85,102.7],[31.9,102.2],[32.64,103.6],[34.2,103.9],[35.5,105.8],[36.93,108.17]]
pts=[P(a,o) for a,o in LM]; d=ImageDraw.Draw(b)
d.line(pts,fill=(10,8,6),width=30,joint='curve'); d.line(pts,fill=YEL,width=16,joint='curve')
x,y=pts[-1]; d.ellipse((x-26,y-26,x+26,y+26),fill=YEL,outline=(10,8,6),width=6)
place(b,bw(mao36),640,80,420,rim=YEL,rimw=8)
text(b,'6,000 KM',1840,60,230,YEL,anchor='ra'); text(b,'ON THE RUN',1840,330,140,WHITE,anchor='ra')
finish(b,'P5_6000km_on_the_run')

# 6 · archive photo full bleed: UNCATCHABLE
w=Image.open('/home/claude/project/archival/raw/a_wall38.jpg').convert('L'); w=ImageOps.autocontrast(w,cutoff=1); w=ImageEnhance.Contrast(w).enhance(1.35)
w=ImageOps.fit(w,(W,H),centering=(0.5,0.4)); b=ImageOps.colorize(w,black=(10,8,6),white=(240,232,214)).convert('RGBA')
ov=Image.new('RGBA',(W,H),(0,0,0,0)); od=ImageDraw.Draw(ov); od.rectangle((0,0,W,330),fill=(0,0,0,120)); b.alpha_composite(ov.filter(ImageFilter.GaussianBlur(60)))
tint=Image.new('RGBA',(W,H),(180,20,20,70)); b.alpha_composite(tint)
text(b,'UNCATCHABLE',960,40,250,WHITE,anchor='ma',stroke=16)
text(b,'22 YEARS',70,860,140,YEL)
finish(b,'P6_uncatchable')
print('ok')
