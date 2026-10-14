# captions (.srt), YouTube chapters and the description for the guerrilla episode, from timeline.json
import json, textwrap
TL = json.load(open('/home/claude/project/timeline.json')); OUT = '/home/user/first-try/guerrilla/package/'
def ts(t): h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60; return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)) % 1000:03d}'
def mmss(t): return f'{int(t // 60)}:{int(t % 60):02d}'
srt = []
for i, f in enumerate(TL['frags']):
    lines = textwrap.wrap(f['text'], 42)
    srt.append(f"{i + 1}\n{ts(f['start'])} --> {ts(f['start'] + f['dur'] + 0.05)}\n" + '\n'.join(lines[:2]) + '\n')
open(OUT + 'chinese_guerrilla_war_en.srt', 'w').write('\n'.join(srt))
ch = []
for i, c in enumerate(TL['chapters']):
    t = 0 if i == 0 else c['start'] - 1.0; title = c['title'].split(':')[0]; yr = c['title'].split(':')[1].strip() if ':' in c['title'] else ''
    ch.append(f"{mmss(t)} {'Cold open: Shanghai, 1949' if i == 0 else title + (f' ({yr})' if yr else '')}")
open(OUT + 'youtube_chapters.txt', 'w').write('\n'.join(ch) + '\n')
print('\n'.join(ch)); print(len(srt), 'captions')
