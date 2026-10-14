# adds the years to the chapter titles in timeline.json (the fuse shows them; YouTube chapters strip them)
import json
Y = ['', '1927', '1927–29', '1930–31', '1933–34', '1934–35', '1935', '1936', '1937–38', '1940–45', '1946–48', '1949', '1949–today']
p = '/home/claude/project/timeline.json'; tl = json.load(open(p))
for i, c in enumerate(tl['chapters']):
    c['title'] = c['title'].split(':')[0] + (f': {Y[i]}' if i and Y[i] else '')
json.dump(tl, open(p, 'w'), indent=1); print([c['title'] for c in tl['chapters']])
