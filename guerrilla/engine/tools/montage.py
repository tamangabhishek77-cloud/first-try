import sys
from PIL import Image, ImageDraw
out=sys.argv[1]; files=sys.argv[2:]
cols=2; w,h=960,540; rows=(len(files)+1)//2
M=Image.new('RGB',(cols*w,rows*h),(0,0,0)); d=ImageDraw.Draw(M)
for i,f in enumerate(files):
    im=Image.open(f).resize((w,h)); M.paste(im,((i%2)*w,(i//2)*h)); d.text(((i%2)*w+8,(i//2)*h+8),f.split('/')[-1],fill=(255,0,0))
M.save(out,quality=85)
