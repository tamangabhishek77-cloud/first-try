// Checkpoint-2 contact sheet: every character, medallion, device and location of the Taiping episode.
import { W, H, P, makeCanvas, parchment, filmLook } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';
import * as PL from './plates.mjs';
import fs from 'fs';
const OUT = '/home/claude/project/out/sheet/'; const CH = A.CH; let n = 0;
const tile = (title, fn) => { const [c, x] = makeCanvas(); x.fillStyle = P.ink; x.fillRect(0, 0, W, H); fn(x, 3.0); filmLook(x, 0);
  x.fillStyle = 'rgba(15,12,9,0.78)'; x.fillRect(0, 0, W, 64); G.text(x, title, 30, 46, '600 34px Oswald', '#F2E8D2', 'left');
  fs.writeFileSync(OUT + `tile${String(++n).padStart(2, '0')}.jpg`, c.toBuffer('image/jpeg', 86)); };
const lineup = (x, keys, poses = {}, h = 330, y = 900) => { parchment(x, 0); A.sky(x, 'day'); A.hills(x, y - 40, 50, 3, '#B9A57E'); x.fillStyle = '#9E8659'; x.fillRect(0, y, W, H);
  const dx = (W - 160) / keys.length; keys.forEach((k, i) => { const cx = 80 + dx * (i + 0.5); A.figure(x, cx, y, h, CH[k], { face: 1, armF: 18, elbF: 20, t: 1, ...(poses[k] || {}) }); G.text(x, CH[k].name, cx, y + 50 + (i % 2) * 64, '600 19px Cinzel', P.ink, 'center'); if (CH[k].role) G.text(x, CH[k].role, cx, y + 76 + (i % 2) * 64, 'italic 400 17px BodoniItalic', P.ink3, 'center'); }); };

tile('1 · Taiping leaders (rebel red)', x => lineup(x, ['hongStudent', 'hong', 'yang', 'feng', 'xiao', 'wei', 'shi', 'rengan', 'li', 'boyKing'],
  { hongStudent: { prop: 'tract', armF: 60, elbF: 50 }, hong: { prop: 'sword', armF: 40, elbF: 30 }, feng: { prop: 'book', armF: 55, elbF: 55 }, xiao: { prop: 'spear' }, wei: { prop: 'sword', armF: 60, elbF: -10 }, shi: { prop: 'flag' }, rengan: { prop: 'book', armF: 55, elbF: 55 }, li: { prop: 'spear' } }));
tile('2 · Qing side, foreigners, the vision, the modern echo', x => { lineup(x, ['zengF', 'zengQ', 'emperor', 'liangFa', 'roberts', 'ward', 'gordon', 'sun', 'mao'], { zengF: { prop: 'brush', armF: 60, elbF: 50 }, zengQ: { prop: 'lantern', armF: 50, elbF: 30 }, liangFa: { prop: 'tract', armF: 60, elbF: 50 }, roberts: { prop: 'book', armF: 55, elbF: 55 }, ward: { prop: 'sword', armF: 30 }, gordon: { prop: 'cane', armF: 25, elbF: 10 } }, 300, 760);
  PL.visionFigure(x, 3, 'visionGod', 1500, 1060, 200, { face: -1 }); PL.visionFigure(x, 3, 'visionBro', 1760, 1060, 180, { face: -1 }); });
tile('3 · Armies and people (crowds turn red as they join)', x => { lineup(x, ['tpSoldier', 'tpWoman', 'qingSoldier', 'hunanSoldier', 'bannerman', 'foreignSoldier', 'scholar', 'villager', 'hakkaWoman', 'burner'],
  { tpSoldier: { prop: 'spear' }, tpWoman: { prop: 'spear' }, qingSoldier: { prop: 'spear' }, hunanSoldier: { prop: 'rifle', propAng: 0 }, bannerman: { prop: 'bow', armF: 70, elbF: 0 }, foreignSoldier: { prop: 'rifle' }, villager: { prop: 'spade' } }, 230, 560);
  A.crowd(x, { x0: 40, x1: 900, y: 930, n: 60, hMin: 70, hMax: 120, depth: 70, seed: 4, t: 1, red: 0.7, hair: true, raise: 0.6 });
  A.crowd(x, { x0: 1000, x1: 1880, y: 930, n: 60, hMin: 70, hMax: 120, depth: 70, seed: 5, t: 1, color: P.blue, far: '#8A98A6', hat: 'cone', tools: true });
  A.rider(x, 1500, 1060, 160, CH.shi, { face: -1, color: '#E8E2D4', cloth: P.red, prop: 'flag', t: 1 }); A.rider(x, 420, 1060, 160, CH.li, { face: 1, color: '#2A241D', cloth: P.red, prop: 'spear', t: 1 }); });
tile('4 · Portrait medallions (same drawings); a death greys the medallion with a red slash', x => { parchment(x, 0);
  const keys = ['hongStudent', 'hong', 'yang', 'feng', 'xiao', 'wei', 'shi', 'rengan', 'li', 'boyKing', 'zengF', 'zengQ', 'emperor', 'liangFa', 'roberts', 'ward', 'gordon', 'sun', 'mao'];
  keys.forEach((k, i) => { const c = i % 7, r = Math.floor(i / 7); G.medallion(x, 2, k, 170 + c * 263, 230 + r * 320, 92, 0, 99, k === 'yang' ? { grey: 1, slash: 1, role: 'killed 1856' } : {}); });
  G.medallion(x, 2, 'visionGod', 1750, 870, 92, 0, 99, { bg: '#F1E1B4' }); });
tile('5 · NANJING, the Heavenly Capital (cold open = ch 5 = ch 10), siege lines', x => PL.nanjing(x, 3, { dusk: 0.8, siege: 1 }));
tile('6 · NANJING, 19 July 1864: the mine, the breach (crimson, no gore)', x => PL.nanjing(x, 3, { dusk: 0.3, night: 0.6, fire: 0.7, breach: 0.75, siege: 1 }));
tile('7 · CANTON exam compound + the PASS LIST (planted object, REMEMBER tag)', x => PL.examHall(x, 3, { list: { reveal: 1, gap: 1, tag: 1, caption: 'Pass list · Canton · 1837' } }));
tile('8 · HAKKA VILLAGE near Canton (Hong\'s home, the village school)', x => { PL.hakkaVillage(x, 3, { dusk: 0.3 }); A.figure(x, 760, 960, 260, CH.hongStudent, { face: 1, walk: 1.2, t: 1 }); A.figure(x, 1000, 960, 200, CH.villager, { face: -1, prop: 'spade' }); });
tile('9 · INTERIOR: village school, the Confucian tablet', x => { PL.hallInterior(x, 3, { mode: 'school' }); A.figure(x, 1300, 980, 360, CH.hongStudent, { face: -1, armF: 90, elbF: -20 }); });
tile('10 · INTERIOR: the Heavenly King\'s throne hall, Nanjing', x => { PL.hallInterior(x, 3, { mode: 'throne' }); A.figure(x, 960, 760, 300, CH.hong, { face: 1, seated: true, armF: 40, elbF: 40 }); });
tile('11 · INTERIOR: the East King\'s palace by night (1856 purge)', x => { PL.hallInterior(x, 3, { mode: 'east' }); A.figure(x, 960, 760, 300, CH.yang, { face: 1, armF: 150, elbF: 10, armB: -150 }); A.figure(x, 1500, 1000, 330, PL.shade(CH.wei), { face: -1, prop: 'sword', armF: 80, elbF: -20 }); });
tile('12 · INTERIOR: the Qing Dragon Throne (face in shadow)', x => { PL.hallInterior(x, 3, { mode: 'qing' }); A.figure(x, 960, 760, 300, PL.shade(CH.emperor, '#2A1E12'), { face: 1, seated: true }); });
tile('13 · THE VISION (1837): backlit silhouettes only', x => { PL.dream(x, 3, { demons: 1 }); PL.visionFigure(x, 3, 'visionGod', 760, 860, 380, { face: 1, prop: 'sword', armF: 75, elbF: -10 }); PL.visionFigure(x, 3, 'visionBro', 1200, 860, 340, { face: -1 }); A.figure(x, 980, 1000, 300, CH.hongStudent, { face: -1, armF: 60, elbF: 30 }); });
tile('14 · GUANGXI: Thistle Mountain, charcoal kilns, Jintian camp', x => { PL.guangxi(x, 3, { dusk: 0.4, village: true, camp: 1 }); A.figure(x, 960, 1000, 280, CH.feng, { face: 1, prop: 'book', armF: 60, elbF: 50 }); });
tile('15 · THE YANGTZE: Wuchang / Anqing on the far bank, the Taiping fleet', x => PL.yangtze(x, 3, { fleet: 9, dusk: 0.2 }));
tile('16 · SHANGHAI 1860: British and French troops fire from the walls', x => PL.shanghai(x, 3, { troops: 1, volley: 0.05 }));
tile('17 · THE SUMMER PALACE burning, October 1860', x => PL.summerPalace(x, 3, { fire: 0.8 }));
tile('18 · TIANANMEN SQUARE: the Monument to the People\'s Heroes', x => PL.tiananmen(x, 3));
tile('19 · The Jintian relief panel (stone)', x => PL.reliefPanel(x, 3));
tile('20 · MAP: southern China, the march north, the Taiping heartland', x => { PL.chinaMap(x, 3, { tp: 1, labels: ['Canton', 'Jintian', 'Changsha', 'Wuchang', 'Anqing', 'Nanjing', 'Shanghai', 'Suzhou', 'Hong Kong'], hi: 'Nanjing' });
  const v = G.CN_VIEW; G.route(x, v, ['Jintian', 'Yongan', 'Guilin', 'Changsha', 'Wuchang', 'Anqing', 'Nanjing'], 1); G.dateLine(x, 4, { at: 0, event: 'The Heavenly Capital', day: '19 March', year: 1853, from: 1849, mode: 'ink', y: 150 }); });
tile('21 · DEVICES: Heavenly Calendar (spine), pass-list echo with the Heavenly King\'s seal, fuse, stamp', x => { parchment(x, 0);
  G.calendar(x, 9, 0, 99, 6, 6, { y: 150, crack: 0.8 }); G.passList(x, 3, 520, 640, 520, 470, { reveal: 1, seal: 1, top: 1, caption: 'Taiping examination, Tianjing 1853' });
  G.fuse(x, 2.5, 0, 0.3, 0.42, { y: 300,  label: 'Chapter 5 · The Heavenly Capital', num: '1853' }); G.stamp(x, 3, 'ABOLISHED 1905', 2, 99, { x: 1380, y: 640, size: 96 }); G.heavenlySeal(x, 1380, 900, 80); });
console.log('tiles', n);
