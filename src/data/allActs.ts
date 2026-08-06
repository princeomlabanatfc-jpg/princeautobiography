import { ActData } from '../types';
import { ACTS_1_TO_3 } from './acts1to3';
import { ACTS_4_TO_6 } from './acts4to6';
import { ACTS_7_TO_11 } from './acts7to11';

export const ALL_ACTS: ActData[] = [
  ...ACTS_1_TO_3,
  ...ACTS_4_TO_6,
  ...ACTS_7_TO_11,
];

export const ACT_MAP: Record<string, ActData> = ALL_ACTS.reduce((acc, act) => {
  acc[act.actId] = act;
  return acc;
}, {} as Record<string, ActData>);
