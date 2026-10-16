exec(open('/home/claude/meiji/helpers.py').read())
import os
os.chdir('/home/claude/crazy')
T='/home/claude/thumbpro/'
def C(k,fade=0.0):
    c=Image.open(f'{T}{k}_cut.png').convert('RGBA'); c=c.crop(c.split()[3].getbbox()); a=np.array(c.split()[3]).astype(float); n=int(c.height*fade)
    if n: a[-n:,:]*=np.linspace(1,0,n)[:,None]
    c.putalpha(Image.fromarray(a.astype('uint8'))); return c
mao=C('mao36'); chiang=C('chiang36'); mao25=C('mao25'); mao49=C('mao49')
def neon(b,s,x,y,size,col,anchor='la',glow=30):
    f=F(size); lay=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(lay).text((x,y),s,font=f,fill=col+(255,),anchor=anchor)
    g=lay.filter(ImageFilter.GaussianBlur(glow)); b.alpha_composite(g); b.alpha_composite(g); b.alpha_composite(lay)
    ImageDraw.Draw(b).text((x,y),s,font=f,fill=(255,240,230),anchor=anchor,stroke_width=0) if False else None
def crack(b,cx,cy,n=9,L=700,col=(10,8,6),w=10,seed=1):
    r=np.random.default_rng(seed); d=ImageDraw.Draw(b)
    for k in range(n):
        a=k/n*2*math.pi+r.uniform(-.2,.2); x,y=cx,cy; pts=[(x,y)]
        for s in range(6): a+=r.uniform(-.4,.4); x+=math.cos(a)*L/6; y+=math.sin(a)*L/6; pts.append((x,y))
        d.line(pts,fill=col,width=w,joint='curve'); d.line(pts,fill=(255,255,255),width=2)
def face(c,box,con=1.4):  # extreme crop of a face region (fractions)
    w,h=c.size; return c.crop((int(box[0]*w),int(box[1]*h),int(box[2]*w),int(box[3]*h)))
def crosshair(b,cx,cy,r,col=RED):
    d=ImageDraw.Draw(b); d.ellipse((cx-r,cy-r,cx+r,cy+r),outline=col,width=14); d.ellipse((cx-r*0.55,cy-r*0.55,cx+r*0.55,cy+r*0.55),outline=col,width=8)
    for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]: d.line([(cx+dx*r*0.25,cy+dy*r*0.25),(cx+dx*r*1.35,cy+dy*r*1.35)],fill=col,width=12)
def tape(b,y,txt,rot=-6):
    lay=Image.new('RGBA',(W+800,180),(0,0,0,0)); d=ImageDraw.Draw(lay); d.rectangle((0,0,W+800,180),fill=YEL+(255,))
    for x in range(0,W+800,140): d.polygon([(x,0),(x+60,0),(x-40,180),(x-100,180)],fill=(15,12,8,255))
    d.rectangle((0,35,W+800,145),fill=YEL+(255,)); d.text(((W+800)//2,92),txt,font=F(100),fill=(15,12,8),anchor='mm')
    lay=lay.rotate(rot,expand=True,resample=Image.BICUBIC); b.alpha_composite(lay,(-400,y))
def potato(b,cx,cy,s):
    lay=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(lay)
    d.ellipse((cx-s,cy-s*0.45,cx+s,cy+s*0.45),fill=(150,60,40,255)); lay=lay.rotate(-12,center=(cx,cy),resample=Image.BICUBIC)
    sh=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(sh).ellipse((cx-s*0.8,cy-s*0.35,cx+s*0.3,cy),fill=(220,120,90,120)); sh=sh.filter(ImageFilter.GaussianBlur(40))
    g=lay.filter(ImageFilter.GaussianBlur(60)); g2=Image.new('RGBA',(W,H),(255,170,60,0)); g2.putalpha(g.split()[3].point(lambda v:int(v*0.9)))
    b.alpha_composite(g2); b.alpha_composite(lay); m=lay.split()[3]; s2=Image.new('RGBA',(W,H),(0,0,0,0)); s2.paste(sh,(0,0),m); b.alpha_composite(s2)
    d=ImageDraw.Draw(b)
    for k in range(-2,3): d.arc((cx+k*s*0.3-s*0.1,cy-s*0.4,cx+k*s*0.3+s*0.15,cy+s*0.4),200,340,fill=(90,30,18),width=6)
def mask_text(b,s,y,size,img):
    f=F(size); m=Image.new('L',(W,H),0); ImageDraw.Draw(m).text((W//2,y),s,font=f,fill=255,anchor='ma')
    ol=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(ol).text((W//2,y),s,font=f,fill=(0,0,0,0),anchor='ma',stroke_width=16,stroke_fill=RED+(255,)); b.alpha_composite(ol)
    b.paste(img,(0,0),m)
def save(b,n): finish(b,n)

# 1 extreme eyes crop
b=bg((10,6,5),(30,6,6),seed=21); fc=face(mao,(0.12,0.05,0.88,0.42)); fc=bw(fc,1.5); fc=fc.resize((W,int(fc.height*W/fc.width)),Image.LANCZOS); b.alpha_composite(fc,(0,(H-fc.height)//2+60))
shade=Image.new('RGBA',(W,H),(0,0,0,0)); dd=ImageDraw.Draw(shade); dd.rectangle((0,0,W,260),fill=(0,0,0,170)); dd.rectangle((0,820,W,H),fill=(0,0,0,170)); b.alpha_composite(shade.filter(ImageFilter.GaussianBlur(30)))
text(b,'HE RAN AWAY…',960,20,200,WHITE,anchor='ma'); text(b,'AND WON CHINA',960,830,200,RED,anchor='ma'); save(b,'C01_ran_away_won_china')
# 2 Chiang cracked
b=bg((10,14,20),(4,6,8),seed=22); place(b,bw(chiang,1.3,tint=(200,215,235)),1060,560,30,rim=(80,120,170),rimw=8); crack(b,960,420,10,800)
text(b,'HE LOST',80,120,200,WHITE); text(b,'CHINA',80,360,280,YEL); save(b,'C02_he_lost_china')
# 3 HOW?
b=bg((14,6,5),(40,8,8),glow=(1400,540,900),gc=(200,30,24),ga=0.7,seed=23); place(b,bw(mao,1.35),900,1150,180,rim=RED,rimw=10)
text(b,'1,000',90,60,230,WHITE); text(b,'vs',90,320,110,(200,200,200)); text(b,'4,000,000',90,450,190,(160,190,220)); text(b,'HOW?!',90,700,250,YEL); save(b,'C03_how')
# 4 retreat to win arrow
b=bg((8,8,10),(24,6,6),seed=24); d=ImageDraw.Draw(b)
pts=[(1750,900),(1100,900),(500,850),(300,600),(500,380),(1100,330),(1700,250)]
d.line(pts,fill=(10,8,6),width=120,joint='curve'); d.line(pts,fill=RED,width=90,joint='curve'); d.polygon([(1880,230),(1640,120),(1660,380)],fill=RED)
place(b,bw(mao,1.35),560,700,300,rim=YEL,rimw=8); text(b,'RETREAT',1880,520,170,WHITE,anchor='ra'); text(b,'TO WIN',1880,700,190,YEL,anchor='ra'); save(b,'C04_retreat_to_win')
# 5 cheat code neon
b=bg((4,4,6),(10,4,6),smoke=0.2,seed=25)
G16=['敌进我退','敌驻我扰','敌疲我打','敌退我追']; fz=ImageFont.truetype('/home/claude/project/fonts/MaShanZheng-Regular.ttf',150)
for i,s in enumerate(G16):
    lay=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(lay).text((480+(i%2)*960,130+(i//2)*230),s,font=fz,fill=(255,40,40,255),anchor='ma'); g=lay.filter(ImageFilter.GaussianBlur(25)); b.alpha_composite(g); b.alpha_composite(g); b.alpha_composite(lay)
text(b,"MAO'S CHEAT CODE",960,640,210,YEL,anchor='ma'); text(b,'16 CHARACTERS',960,890,110,WHITE,anchor='ma'); save(b,'C05_cheat_code')
# 6 crosshair hunted
b=bg((24,22,18),(8,7,6),seed=26); place(b,bw(mao,1.35),1000,700,80,rim=None); crosshair(b,1010,400,300)
text(b,'HUNTED',70,120,210,WHITE); text(b,'22 YEARS',70,380,200,RED); save(b,'C06_hunted_22_years')
# 7 kidnapped tape
b=bg((10,14,20),(4,6,8),seed=27); place(b,bw(chiang,1.3,tint=(200,215,235)),1040,600,40,rim=(80,120,170),rimw=8); tape(b,380,'KIDNAPPED · KIDNAPPED · KIDNAPPED')
text(b,"CHINA'S LEADER",960,840,150,WHITE,anchor='ma'); save(b,'C07_kidnapped')
# 8 he took it all: map + giant Mao
M=json.load(open('/home/claude/project/render/maps.json'))
b=bg((30,6,6),(8,2,2),glow=(960,500,900),gc=(220,60,30),ga=0.7,seed=28); place(b,bw(mao,1.4),1150,560,-40,rim=None,glow=False)
vw={'lon':104,'lat':37,'span':58}; k=W/vw['span']; cl=math.cos(math.radians(vw['lat'])); P=lambda la,lo:(W/2+(lo-vw['lon'])*k, H/2+120-(la-vw['lat'])*k/cl)
lay=Image.new('RGBA',(W,H),(0,0,0,0)); ld=ImageDraw.Draw(lay)
for ring in M['borders']['CHN']: ld.polygon([P(la,lo) for lo,la in ring],fill=(200,20,26,230),outline=YEL+(255,),width=6)
b.alpha_composite(lay.filter(ImageFilter.GaussianBlur(25))); b.alpha_composite(lay)
text(b,'HE TOOK',70,60,180,WHITE); text(b,'IT ALL',70,280,220,YEL); save(b,'C08_he_took_it_all')
# 9 nobody -> ruler
b=bg((10,9,8),(22,18,15),seed=29); r=bg((70,8,6),(20,4,4),glow=(1440,560,800),gc=(220,40,26),ga=0.85,seed=30)
m=Image.new('L',(W,H),0); ImageDraw.Draw(m).polygon([(1000,0),(W,0),(W,H),(920,H)],fill=255); b.paste(r,(0,0),m)
place(b,bw(mao25,1.2),820,120,260,rim=(120,120,120),rimw=6); place(b,bw(mao49,1.3),1000,1020,90,rim=YEL,rimw=10)
text(b,'NOBODY',470,40,190,(200,200,200),anchor='ma'); text(b,'RULER',1480,40,230,YEL,anchor='ma'); save(b,'C09_nobody_to_ruler')
# 10 invisible army archival
w=Image.open('/home/claude/project/archival/raw/a_wall38.jpg').convert('L'); w=ImageEnhance.Contrast(ImageOps.autocontrast(w,cutoff=1)).enhance(1.4); w=ImageOps.fit(w,(W,H),centering=(0.5,0.4))
b=ImageOps.colorize(w,black=(5,10,8),white=(140,200,150)).convert('RGBA'); b.alpha_composite(Image.new('RGBA',(W,H),(0,40,10,60)))
neon(b,'THE INVISIBLE',960,40,170,(255,60,40),anchor='ma',glow=20); text(b,'THE INVISIBLE',960,40,170,WHITE,anchor='ma',stroke=10,shadow=False); text(b,'ARMY',960,240,260,RED,anchor='ma'); save(b,'C10_invisible_army')
# 11 sweet potato
b=bg((6,5,4),(16,10,6),glow=(960,560,700),gc=(255,170,60),ga=0.35,seed=31); pt=Image.open('/home/claude/crazy/potato.png').convert('RGBA'); g=pt.filter(ImageFilter.GaussianBlur(50)); gl=Image.new('RGBA',pt.size,(255,170,60,0)); gl.putalpha(g.split()[3]); b.alpha_composite(gl,(260,130)); b.alpha_composite(gl,(260,130)); b.alpha_composite(pt,(260,130))
text(b,'THIS WON',960,30,220,WHITE,anchor='ma'); text(b,'A WAR',960,840,220,YEL,anchor='ma'); save(b,'C11_this_won_a_war')
# 12 greatest comeback
b=bg((8,10,14),(4,4,6),seed=32); r=bg((70,8,6),(20,4,4),glow=(1500,500,800),gc=(220,40,26),ga=0.8,seed=33)
m=Image.new('L',(W,H),0); m.paste(255,(960,0,W,H)); b.paste(r,(0,0),m)
place(b,bw(chiang,1.3,tint=(200,215,235)),900,100,180,rim=(80,120,170),rimw=8); place(b,bw(mao,1.35),950,1060,130,rim=RED,rimw=10)
d=ImageDraw.Draw(b); bolt=[(1000,0),(900,420),(1010,420),(880,H)]; d.line(bolt,fill=YEL,width=26)
text(b,'GREATEST COMEBACK',960,890,140,WHITE,anchor='ma',bgbar=(10,8,6)); save(b,'C12_greatest_comeback')
# 13 80K -> 8K
b=bg((230,230,235),(180,186,195),smoke=0.2,seed=34)
d=ImageDraw.Draw(b)
for i in range(120): x=60+(i%20)*92; y=260+(i//20)*110; col=RED if i<12 else (150,150,155); d.ellipse((x,y,x+40,y+40),fill=col); d.rectangle((x+5,y+42,x+35,y+95),fill=col)
text(b,'80,000 → 8,000',960,20,200,RED,anchor='ma'); text(b,'THE LONG MARCH',960,930,120,(20,16,12),anchor='ma',stroke=0,shadow=False); save(b,'C13_80000_to_8000')
# 14 WANTED poster
b=bg((40,20,10),(12,6,4),seed=35); pos=Image.new('RGBA',(820,980),(226,208,170,255)); pd=ImageDraw.Draw(pos)
pd.rectangle((20,20,800,960),outline=(60,40,20),width=10); pd.text((410,40),'WANTED',font=F(200),fill=(60,20,10),anchor='ma')
pm=bw(mao,1.4); pm=pm.resize((int(pm.width*560/pm.height),560)); pos.alpha_composite(pm,(410-pm.width//2,270)); pd.text((410,850),'MAO ZEDONG',font=F(100),fill=(60,20,10),anchor='ma')
pos=pos.rotate(4,expand=True,resample=Image.BICUBIC); b.alpha_composite(pos,(80,30))
text(b,'A PRICE',1860,240,170,WHITE,anchor='ra'); text(b,'ON HIS',1860,430,170,WHITE,anchor='ra'); text(b,'HEAD',1860,620,220,YEL,anchor='ra'); save(b,'C14_wanted')
# 15 GUERRILLA filled with Mao photo
src=Image.open('/home/claude/project/archival/raw/a_mao36.jpg').convert('L'); src=ImageEnhance.Contrast(ImageOps.autocontrast(src,cutoff=1)).enhance(1.4); src=ImageOps.fit(src,(W,H),centering=(0.5,0.25)); src=ImageOps.colorize(src,black=(10,8,6),white=(250,240,230))
b=bg((120,10,12),(40,4,6),glow=(960,540,900),gc=(230,40,30),ga=0.6,seed=36); mask_text(b,'GUERRILLA',170,470,src)
text(b,'HOW MAO WON CHINA',960,800,130,YEL,anchor='ma'); save(b,'C15_guerrilla_photo_text')
print('ok')
