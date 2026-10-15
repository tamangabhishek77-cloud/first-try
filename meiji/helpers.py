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
