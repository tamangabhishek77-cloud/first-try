import { SHOTS_A } from './shots_a.mjs';
let B = [], C = [];
try { B = (await import('./shots_b.mjs')).SHOTS_B; } catch (e) { if (!String(e).includes('Cannot find module')) throw e; }
try { C = (await import('./shots_c.mjs')).SHOTS_C; } catch (e) { if (!String(e).includes('Cannot find module')) throw e; }
export const SHOTS = [...SHOTS_A, ...B, ...C];
