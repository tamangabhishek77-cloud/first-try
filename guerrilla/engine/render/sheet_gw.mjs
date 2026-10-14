// Checkpoint-2 contact sheet: every character, medallion, device, archival insert and location of the guerrilla episode.
import { W, H, P, makeCanvas, parchment, filmLook } from './core.mjs';
import * as A from './art.mjs';
import * as G from './gfx.mjs';
import * as PL from './plates.mjs';
import fs from 'fs';
const OUT = '/home/claude/project/out/sheet_gw/'; fs.mkdirSync(OUT, { recursive: true }); const CH = A.CH; let n = 0;
const only = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
const tile = (title, fn) => { n++; if (only && !only.includes(n)) return; const [c, x] = makeCanvas(); x.fillStyle = P.ink; x.fillRect(0, 0, W, H); fn(x, 3.0); filmLook(x, 0);
  x.fillStyle = 'rgba(15,12,9,0.78)'; x.fillRect(0, 0, W, 64); G.text(x, title, 30, 46, '600 34px Oswald', '#F2E8D2', 'left');
  fs.writeFileSync(OUT + `tile${String(n).padStart(2, '0')}.jpg`, c.toBuffer('image/jpeg', 86)); };
const lineup = (x, keys, poses = {}, h = 330, y = 900) => { parchment(x, 0); A.sky(x, 'day'); A.hills(x, y - 40, 50, 3, '#B9A57E'); x.fillStyle = '#9E8659'; x.fillRect(0, y, W, H);
  const dx = (W - 160) / keys.length; keys.forEach((k, i) => { const cx = 80 + dx * (i + 0.5); A.figure(x, cx, y, h, CH[k], { face: 1, armF: 18, elbF: 20, t: 1, ...(poses[k] || {}) }); G.text(x, CH[k].name, cx, y + 50 + (i % 2) * 64, '600 19px Cinzel', P.ink, 'center'); if (CH[k].role) G.text(x, CH[k].role, cx, y + 76 + (i % 2) * 64, 'italic 400 17px BodoniItalic', P.ink3, 'center'); }); };

tile('1 · Leaders: communists (rebel red), Chiang (old-regime gold), Zhang (state blue), Braun, Snow', x => lineup(x, ['maoY', 'maoYan', 'zhu', 'zhou', 'braun', 'chiang', 'zhangX', 'snow'],
  { maoY: { armF: 30, elbF: 40 }, maoYan: { prop: 'tract', armF: 55, elbF: 55 }, zhu: { prop: 'rifle', propAng: 0 }, zhou: { armF: 50, elbF: 60 }, braun: { prop: 'scroll', armF: 55, elbF: 55 }, chiang: { prop: 'cane', armF: 25, elbF: 10 }, zhangX: { armF: 20 }, snow: { prop: 'tract', armF: 60, elbF: 50 } }, 340));
tile('2 · Armies and people (crowds turn red as they join)', x => { lineup(x, ['redSoldier', 'redWoman', 'natSoldier', 'japSoldier', 'gangster', 'farmer', 'farmerW', 'landlord', 'bandit'],
  { redSoldier: { prop: 'rifle' }, redWoman: { prop: 'spear' }, natSoldier: { prop: 'rifle' }, japSoldier: { prop: 'rifle' }, gangster: { prop: 'dagger', armF: 40 }, farmer: { prop: 'spade' }, bandit: { prop: 'sword', armF: 40, elbF: 30 } }, 240, 560);
  A.crowd(x, { x0: 40, x1: 900, y: 930, n: 60, hMin: 70, hMax: 120, depth: 70, seed: 4, t: 1, red: 0.7, hat: 'star', toolSet: ['rifle', 'spear', 'banner', null, null] });
  A.crowd(x, { x0: 1000, x1: 1880, y: 930, n: 60, hMin: 70, hMax: 120, depth: 70, seed: 5, t: 1, color: P.blue, far: '#8A98A6', hat: 'stahl', toolSet: ['rifle', null] }); });
tile('3 · Portrait medallions (real photos where they exist; a death greys the medallion with a red slash)', x => { parchment(x, 0);
  const keys = ['maoY', 'maoYan', 'zhu', 'zhou', 'chiang', 'braun', 'zhangX', 'snow', 'prachanda', 'redSoldier', 'landlord', 'bandit'];
  keys.forEach((k, i) => { const c = i % 6, r = Math.floor(i / 6); G.medallion(x, 2, k, 190 + c * 308, 290 + r * 400, 110, 0, 99, k === 'landlord' ? { grey: 1, slash: 1, role: 'land reform, 1947–52' } : {}); }); });
tile('4 · SHANGHAI, April 1927: the purge by night (crimson, no gore)', x => { PL.shanghaiStreet(x, 3, { night: 0.7, red: 0.6 }); for (let i = 0; i < 5; i++) A.figure(x, 500 + i * 140, 1000 - i * 30, 240 - i * 25, PL.shade(CH.gangster), { face: 1, walk: 1 + i, prop: 'dagger' }); });
tile('5 · SHANGHAI, May 1949 (cold open = ch 11): soldiers asleep on the pavements', x => PL.shanghaiStreet(x, 3, { dawn: 0.8, sleepers: 1, mist: 0.6 }));
tile('6 · SHANGHAI, May 1949: the shutters open', x => PL.shanghaiStreet(x, 3, { dawn: 0.5, sleepers: 1, shutters: 0.8 }));
tile('7 · THE JINGGANG MOUNTAINS: the hideout village, red flag', x => { PL.jinggang(x, 3, { flag: 1, path: 1, dusk: 0.3 }); A.figure(x, 640, 1010, 280, CH.maoY, { face: 1, walk: 1.2 }); A.figure(x, 470, 1030, 250, CH.redSoldier, { face: 1, walk: 2.2, prop: 'rifle' }); });
tile('8 · JIANGXI: paddies and the Ruijin hall, Chinese Soviet Republic (1931)', x => PL.jiangxi(x, 3, { hall: 1 }));
tile('9 · THE BLOCKHOUSE RING (1933–34)', x => PL.blockhouses(x, 3, { ring: 1, smoke: 1 }));
tile('10 · RIVER CROSSING: the Xiang, Nov 1934 (fire) · the same plate, wide = the Yangtze 1949', x => { PL.riverX(x, 3, { boats: 6, fire: 0.6, dusk: 0.4 }); });
tile('11 · THE YANGTZE, April 1949 (riverX wide)', x => PL.riverX(x, 3, { wide: 1, boats: 14 }));
tile('12 · LUDING BRIDGE, May 1935: thirteen chains, planks gone on the near side, fire on the far end', x => { PL.luding(x, 3, { planks: 0.33, fire: 0.6 }); for (let i = 0; i < 4; i++) { const xx = 420 + i * 150; A.figure(x, xx, PL.LUDING.y(xx) + 4, 70, PL.shade(CH.redSoldier, '#2A241D'), { face: 1, kneel: 0.6, armF: 80, elbF: 0 }); } });
tile('13 · THE SNOW MOUNTAINS', x => { PL.snowGrass(x, 3, { mode: 'snow' }); for (let i = 0; i < 8; i++) A.figure(x, 300 + i * 90, 1000 - i * 38, 150 - i * 12, CH.redSoldier, { face: 1, walk: i, lean: 12 }); });
tile('14 · THE GRASSLANDS', x => { PL.snowGrass(x, 3, { mode: 'grass' }); for (let i = 0; i < 6; i++) A.figure(x, 1300 - i * 120, 900 + i * 20, 120 + i * 10, CH.redSoldier, { face: -1, walk: i }); });
tile("15 · YAN'AN: loess hills, cave homes, the pagoda", x => { PL.yanan(x, 3, {}); A.figure(x, 960, 1000, 300, CH.maoYan, { face: -1, armF: 40, elbF: 50 }); A.figure(x, 1200, 1000, 290, CH.snow, { face: -1, prop: 'tract', armF: 60, elbF: 50 }); });
tile("16 · XI'AN, 12 December 1936, before dawn", x => { PL.xian(x, 3, { torches: 1 }); A.figure(x, 760, 900, 200, CH.chiangNight, { face: -1, walk: 2, lean: -10 }); });
tile('17 · NORTH CHINA: the Great Wall and the railway (Hundred Regiments, 1940)', x => PL.northChina(x, 3, { train: 0.4, blast: 0.4, blastX: 1500 }));
tile('18 · NORTH CHINA: the Three Alls (crimson; villages burning, no people shown)', x => PL.northChina(x, 3, { village: 1, burn: 0.8, dusk: 0.5 }));
tile('19 · TIANANMEN GATE, 1 October 1949', x => PL.tiananmen49(x, 3, { red: 0.8 }));
tile('20 · MAP: the Jiangxi Soviet and the Long March', x => { PL.cnMap(x, 3, { soviet: 1, march: 1, labels: ['Ruijin', 'Jinggangshan', 'Xiang River', 'Zunyi', 'Luding', 'Wuqi', "Yan'an", 'Shanghai', 'Nanjing', 'Beiping'] }); });
tile('21 · MAP: Japanese-held China (1938–45)', x => { PL.cnMap(x, 3, { japan: 1, labels: ["Yan'an", 'Pingxing Pass', 'Beiping', 'Nanjing', 'Shanghai', 'Changchun', 'Xuzhou', 'Taiwan'], hi: "Yan'an" }); });
tile('22 · MAP: the world (ch 12): China, Vietnam, Peru, Nepal', x => PL.worldMap(x, 3, { hi: { VNM: 1, PER: 1, NPL: 1 }, labels: ['Vietnam', 'Peru', 'Nepal'] }));
tile('23 · SPINE: the Sixteen Characters (line 1 proven) · fuse · stamp', x => { parchment(x, 0); G.sixteen(x, 9, 0, 99, { brush: 16, lines: [1, 0, 0, 0], hi: 0, y: 160 }); G.sixteen(x, 9, 0, 99, { brush: 16, lines: [1, 1, 1, 0.5], crack: 0, y: 470, title: false });
  G.sixteen(x, 9, 0, 99, { brush: 9.5, lines: [1, 0, 0, 0], crack: 0.8, y: 760, title: false }); G.fuse(x, 2.5, 0, 0.3, 0.42, { y: 1000, label: 'Chapter 5 · The long retreat', num: '1934' }); });
tile('24 · PLANTED OBJECT: the three rules, the sweet potato and the REMEMBER tag (1927) → needle and thread', x => { parchment(x, 0); G.ruleSheet(x, 3, 520, 580, 760, 640, { reveal: 1, potato: 1, tag: 1, rot: -0.02 }); G.ruleSheet(x, 3, 1420, 580, 760, 640, { reveal: 1, potato: 1, swap: 1, rot: 0.02 }); });
tile('25 · ARCHIVAL INSERTS: real photographs in a worn print (sample)', x => { PL.yanan(x, 3, { dusk: 0.4 }); x.fillStyle = 'rgba(10,8,6,0.55)'; x.fillRect(0, 0, W, H); G.archival(x, 3, 'a_wall37', 0, 10, { caption: 'The Eighth Route Army on the Great Wall, 1937', credit: 'Photo: Sha Fei · public domain' }); });
console.log('tiles', n);
