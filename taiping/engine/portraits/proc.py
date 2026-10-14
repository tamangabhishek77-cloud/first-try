from PIL import Image, ImageOps, ImageEnhance, ImageDraw
C={'hong':(0.44,0.36,0.72),'zengF':(0.5,0.34,0.78),'zengQ':(0.53,0.24,0.3),'gordon':(0.49,0.2,0.34),'ward':(0.5,0.15,0.55),'liangFa':(0.5,0.33,0.85),'emperor':(0.5,0.50,0.8),'sun':(0.48,0.30,0.75),'mao':(0.33,0.30,0.62)}
M=Image.new('RGB',(9*210,210),(40,40,40))
for i,(k,(cx,cy,s)) in enumerate(C.items()):
    im=Image.open(k+'.jpg').convert('RGB'); w,h=im.size; d=s*w
    x0=max(0,min(w-d,cx*w-d/2)); y0=max(0,min(h-d,cy*h-d/2)); im=im.crop((int(x0),int(y0),int(x0+d),int(y0+d))).resize((512,512),Image.LANCZOS)
    g=ImageOps.autocontrast(ImageOps.grayscale(im),cutoff=1)
    sep=ImageOps.colorize(g,black='#1E160E',white='#F2E6CC',mid='#8A6E4E')
    sep=ImageEnhance.Contrast(sep).enhance(1.05); sep.save(f'proc/{k}.png')
    t=sep.resize((200,200)); m=Image.new('L',(200,200),0); ImageDraw.Draw(m).ellipse((0,0,199,199),fill=255); M.paste(t,(i*210+5,5),m)
M.save('/tmp/claude-0/-home-user-first-try/03b7b6c3-21c5-5720-9965-a40af1fb1641/scratchpad/crops.jpg')
