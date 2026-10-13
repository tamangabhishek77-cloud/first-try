import { W, H, P, makeCanvas, parchment, filmLook, T } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';
import fs from 'fs';
const [c, x] = makeCanvas();
// 1 characters
parchment(x, 0); A.sky(x,'dusk'); A.hills(x, 900, 60, 3, '#7A6A50');
const keys=['tyler','ball','richard','walworth','sudbury','hales','bampton','baker','belling','gaunt','soldier','woman'];
keys.forEach((k,i)=>A.figure(x, 120+i*150, 980, 300, A.CH[k], {face: i%2?-1:1, armF: i===0?95:20, elbF: i===0?-20:15, prop: {tyler:'dagger',ball:'staff',walworth:'sword',sudbury:'crozier',bampton:'scroll',soldier:'spear'}[k], walk: i===7? 1.0:null, t:1}));
G.text(x,'Character line-up', W/2, 80, '600 40px Cinzel', P.ink);
G.slam(x, 2, [{t:'THREE'},{t:'groats',small:true},{t:'A HEAD',red:true}], 1.0, 9, {x:W*0.5,y:H*0.36,size:120});
filmLook(x, 0); fs.writeFileSync('/tmp/claude-0/-home-claude/0dc83cd9-91de-5bea-8f6d-50bb195a76a5/scratchpad/sheet1.png', c.toBuffer('image/png'));
// 2 horses, crowd, buildings
const [c2,y]=makeCanvas(); parchment(y,1); A.sky(y,'day'); A.hills(y, 760, 80, 5, '#B9A57E'); A.hills(y, 860, 50, 9, '#9C8A66');
A.londonBridge(y, 900, 1880, 640, 60, P.ink2, false, 1);
A.whiteTower(y, 420, 560, 70); A.stPauls(y, 1500, 420, 50); 
A.rider(y, 380, 1000, 260, A.CH.richard, {face:1, color:'#E8E2D4', cloth:P.gold, walk:0.6, t:1});
A.rider(y, 820, 1000, 220, A.CH.tyler, {face:-1, color:'#3A3026', walk:2.2, prop:'dagger', armF:70, elbF:-30, t:1});
A.crowd(y, {x0:1000,x1:1900,y:930,n:70,hMin:70,hMax:130,red:0.6,raise:0.8,seed:4,t:1,depth:60});
G.dateLine(y, 3, {at:0, event:'Smithfield', day:'15 June', year:1381, from:1376});
G.medallion(y, 2, 'tyler', 1700, 300, 110, 0, 99);
G.fuse(y, 2, 0, 0.1, 0.3, {label:'Chapter 9 · Smithfield', num:'15 June 1381'});
G.tally(y, 3, 0, 99, 1, 9, {x: 1150, y: 150});
filmLook(y,1); fs.writeFileSync('/tmp/claude-0/-home-claude/0dc83cd9-91de-5bea-8f6d-50bb195a76a5/scratchpad/sheet2.png', c2.toBuffer('image/png'));
// 3 map + docs
const [c3,z]=makeCanvas(); const view={lon:0.35,lat:51.5,span:3.2};
G.drawMap(z,'se',view,{rivers:['Thames']});
for (const p of ['London','Brentwood','Fobbing','Corringham','Stanford-le-Hope','Rochester','Maidstone','Canterbury','Blackheath','Gravesend','Dartford']) G.mapLabel(z, view, p, 1, {t:1, size:30, color: p==='London'?P.red:P.ink});
G.route(z, view, ['Maidstone','Canterbury'], 1); G.route(z, view, ['Canterbury','Rochester','Dartford','Blackheath'], 0.7);
G.documentSheet(z, 1, 1500, 520, 420, 560, {title:'Carta', seal:true, written:1, seed:3, cross:0.7});
G.manorRoll(z, 1, 380, 200, 300, 600, 1, {highlight:5, tag:'REMEMBER'});
G.groat(z, 1000, 900, 60);
filmLook(z,2); fs.writeFileSync('/tmp/claude-0/-home-claude/0dc83cd9-91de-5bea-8f6d-50bb195a76a5/scratchpad/sheet3.png', c3.toBuffer('image/png'));
console.log('ok');
