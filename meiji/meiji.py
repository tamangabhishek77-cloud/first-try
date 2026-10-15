exec(open('/home/claude/meiji/helpers.py').read())
JRED=(188,0,45)
def C(k,fade=0.22):
    c=Image.open(f'/home/claude/meiji/{k}_cut.png').convert('RGBA'); c=c.crop(c.split()[3].getbbox()); a=np.array(c.split()[3]).astype(float)
    n=int(c.height*fade)
    if n: a[-n:,:]*=np.linspace(1,0,n)[:,None]
    c.putalpha(Image.fromarray(a.astype('uint8'))); return c
def sun(b,cx,cy,r,col=JRED,rays=True):
    lay=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(lay)
    if rays:
        for k in range(16):
            a0=k/16*2*math.pi; a1=a0+math.pi/16
            d.polygon([(cx,cy),(cx+3000*math.cos(a0),cy+3000*math.sin(a0)),(cx+3000*math.cos(a1),cy+3000*math.sin(a1))],fill=col+(70,))
    d.ellipse((cx-r,cy-r,cx+r,cy+r),fill=col+(255,)); b.alpha_composite(lay)
def full(path,crop=(0.5,0.5),bwmode=True,con=1.3):
    im=Image.open(path).convert('RGB'); im=ImageOps.fit(im,(W,H),centering=crop)
    if bwmode: g=ImageEnhance.Contrast(ImageOps.autocontrast(im.convert('L'),cutoff=1)).enhance(con); im=ImageOps.colorize(g,black=(10,8,6),white=(240,232,214))
    return im.convert('RGBA')
def shade(b,y0,y1,a0,a1):
    ov=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(ov)
    for y in range(y0,y1): d.line([(0,y),(W,y)],fill=(6,4,3,int(a0+(a1-a0)*(y-y0)/max(1,y1-y0))))
    b.alpha_composite(ov)
R='/home/claude/meiji/raw/'

# M01 · Before/After emperor: 1872 robe → 1873 uniform
b=bg((14,10,8),(30,22,16),seed=11); r=bg((70,6,14),(25,4,6),glow=(1440,560,800),gc=JRED,ga=0.8,seed=12)
m=Image.new('L',(W,H),0); m.paste(255,(960,0,W,H)); b.paste(r,(0,0),m)
p=Image.open(R+'meiji72.jpg').convert('L'); p=p.crop((0,int(p.height*0.04),p.width,int(p.height*0.62))); p=ImageEnhance.Contrast(ImageOps.autocontrast(p,cutoff=1)).enhance(1.25); p=ImageOps.colorize(p,black=(10,8,6),white=(240,232,214)); p=p.resize((int(p.width*660/p.height),660),Image.LANCZOS)
fr=Image.new('RGBA',(p.width+30,p.height+30),(236,228,210,255)); fr.paste(p,(15,15)); fr=fr.rotate(-3,expand=True,resample=Image.BICUBIC); b.alpha_composite(fr,(480-fr.width//2,200))
place(b,bw(C('meiji73'),1.25),980,1000,170,rim=JRED,rimw=10)
ImageDraw.Draw(b).rectangle((952,190,968,H),fill=YEL)
text(b,'THE MEIJI RESTORATION',960,30,150,WHITE,anchor='ma')
text(b,'1872',480,900,120,(190,190,190),anchor='ma'); text(b,'1873',1440,900,120,YEL,anchor='ma')
finish(b,'M01_meiji_before_after')

# M02 · The samurai under a red sun
b=bg((240,232,214),(200,190,170),smoke=0.2,seed=13); sun(b,1300,470,330)
place(b,bw(C('samsword',0.05),1.35),1020,1000,40,rim=None)
text(b,'THE',80,120,150,(20,16,12),stroke=0,shadow=False); text(b,'SAMURAI',80,270,230,JRED,stroke=12); text(b,'REVOLUTION',80,520,170,(20,16,12),stroke=0,shadow=False)
finish(b,'M02_samurai_revolution_sun')

# M03 · The last samurai: Saigo + Shiroyama print
b=full(R+'shiroyama.jpg',bwmode=False); shade(b,0,H,140,200)
sg=C('saigo',0); sg=sg.crop((0,0,sg.width,int(sg.height*0.72))); place(b,bw(sg,1.3),1000,940,90,rim=JRED,rimw=10)
text(b,'THE LAST',70,140,170,WHITE); text(b,'SAMURAI',70,330,230,JRED); text(b,'SAIGŌ TAKAMORI · 1877',70,620,70,YEL,stroke=8)
finish(b,'M03_last_samurai')

# M04 · Shogun vs Emperor
b=bg((14,18,24),(8,10,14),seed=14); r=bg((70,6,14),(25,4,6),glow=(1500,500,800),gc=JRED,ga=0.8,seed=15)
m=Image.new('L',(W,H),0); ImageDraw.Draw(m).polygon([(1060,0),(W,0),(W,H),(860,H)],fill=255); b.paste(r,(0,0),m)
place(b,bw(C('yoshinobu'),1.2,tint=(205,215,230)),980,80,140,rim=(110,140,170),rimw=8)
place(b,bw(C('meiji73'),1.25),1000,1020,120,rim=JRED,rimw=10)
ImageDraw.Draw(b).line([(1060,0),(860,H)],fill=YEL,width=22)
text(b,'SHOGUN',470,30,170,(205,215,230),anchor='ma'); text(b,'EMPEROR',1500,30,170,YEL,anchor='ma')
text(b,'THE MEIJI RESTORATION',960,900,110,WHITE,anchor='ma',bgbar=(10,8,6))
finish(b,'M04_shogun_vs_emperor')

# M05 · Satsuma samurai, real colour photo, full bleed
b=full(R+'satsuma.jpg',crop=(0.5,0.45),bwmode=True,con=1.25); shade(b,0,420,200,0); shade(b,700,H,0,170)
tint=Image.new('RGBA',(W,H),JRED+(40,)); b.alpha_composite(tint)
text(b,'THE SAMURAI REVOLUTION',960,40,160,WHITE,anchor='ma')
text(b,'1868',80,880,150,YEL)
finish(b,'M05_satsuma_samurai')

# M06 · Ryoma: the samurai who started it
b=bg((16,10,8),(40,10,12),glow=(1350,520,900),gc=JRED,ga=0.75,seed=16)
place(b,bw(C('ryoma'),1.3),1020,960,60,rim=JRED,rimw=10)
text(b,'ONE',80,110,200,WHITE); text(b,'SAMURAI',80,330,220,YEL); text(b,'CHANGED JAPAN',80,600,130,WHITE)
finish(b,'M06_one_samurai')

# M07 · 1868 under the rising sun with the emperor
b=bg((14,8,8),(30,8,10),seed=17); sun(b,960,560,300)
place(b,bw(C('meiji73'),1.25),1000,620,120,rim=(10,8,6),rimw=8)
text(b,'1868',60,60,300,WHITE); text(b,'THE MEIJI',1860,620,150,WHITE,anchor='ra'); text(b,'RESTORATION',1860,790,150,YEL,anchor='ra')
finish(b,'M07_1868_rising_sun')

# M08 · Black ships: it began with 4 ships
b=full(R+'perry.jpg',crop=(0.5,0.4),bwmode=True,con=1.4); shade(b,0,H,90,150)
place(b,bw(C('ueno'),1.3),900,1300,200,rim=JRED,rimw=10)
text(b,'IT BEGAN WITH',70,90,110,WHITE); text(b,'4 BLACK SHIPS',70,240,200,YEL); text(b,'THE MEIJI RESTORATION',70,870,100,WHITE,bgbar=(10,8,6))
finish(b,'M08_black_ships')

# M09 · Swords to guns: samurai → modern army
b=bg((240,232,214),(205,195,175),smoke=0.2,seed=18); r=bg((70,6,14),(25,4,6),glow=(1440,560,800),gc=JRED,ga=0.8,seed=19)
m=Image.new('L',(W,H),0); m.paste(255,(960,0,W,H)); b.paste(r,(0,0),m)
place(b,bw(C('ueno'),1.3),960,190,140,rim=None)
place(b,bw(C('meiji73'),1.25),980,1010,140,rim=YEL,rimw=8)
text(b,'SWORDS',480,20,150,(20,16,12),anchor='ma',stroke=0,shadow=False); text(b,'EMPIRE',1440,20,150,YEL,anchor='ma')
text(b,'THE SAMURAI REVOLUTION',960,920,100,WHITE,anchor='ma',bgbar=(10,8,6))
finish(b,'M09_swords_to_empire')

# M10 · The end of the samurai: Shiroyama full bleed
b=full(R+'shiroyama.jpg',crop=(0.5,0.5),bwmode=False); shade(b,0,H,60,120)
text(b,'THE END OF',960,40,150,WHITE,anchor='ma'); text(b,'THE SAMURAI',960,220,230,JRED,anchor='ma')
text(b,'MEIJI RESTORATION',70,900,110,YEL)
finish(b,'M10_end_of_samurai')
print('ok')
