// src/scripts/pc/buildSequence.ts
// When and from where each part flies in. Times are in seconds.
// Axes: x = side to side (glass side at +x), y = up, z = front (+z) to back.
import type { PartTrack } from './timeline';

/** Real-world build order; tracks must start in this order */
export const BUILD_ORDER = [
  'case',
  'motherboard',
  'cpu',
  'cooler',
  'ramA',
  'ramB',
  'gpu',
  'psu',
  'fanFrontTop',
  'fanFrontMid',
  'fanFrontBottom',
  'fanRear',
  'glass',
] as const;

export type PartId = (typeof BUILD_ORDER)[number];

export const BOOT_START = 3.6;
export const BOOT_DURATION = 0.9;
/** Max extra delay for the back-most glow (glows light up front to back) */
export const BOOT_SPREAD = 0.45;
export const SEQUENCE_END = BOOT_START + BOOT_SPREAD + BOOT_DURATION;

export const buildSequence: (PartTrack & { id: PartId })[] = [
  { id: 'case',           start: 0.0,  duration: 0.9,  fromOffset: [0, -3.5, 0],  fromRotation: [0, -0.7, 0],    ease: 'outCubic' },
  { id: 'motherboard',    start: 0.6,  duration: 0.6,  fromOffset: [3.5, 0.4, 0], fromRotation: [0, 0, 0.35],    ease: 'outBack' },
  { id: 'cpu',            start: 1.05, duration: 0.45, fromOffset: [1.6, 0, 0],   fromRotation: [0, 0, 0],       ease: 'outCubic' },
  { id: 'cooler',         start: 1.35, duration: 0.55, fromOffset: [3, 0.6, 0],   fromRotation: [0, 0, -0.3],    ease: 'outBack' },
  { id: 'ramA',           start: 1.7,  duration: 0.4,  fromOffset: [2, 0, 0],     fromRotation: [0, 0, 0],       ease: 'outBack' },
  { id: 'ramB',           start: 1.8,  duration: 0.4,  fromOffset: [2, 0, 0],     fromRotation: [0, 0, 0],       ease: 'outBack' },
  { id: 'gpu',            start: 2.05, duration: 0.6,  fromOffset: [3.5, 0, 0.5], fromRotation: [0, 0.25, 0],    ease: 'outBack' },
  { id: 'psu',            start: 2.35, duration: 0.5,  fromOffset: [3.2, -0.4, 0], fromRotation: [0, 0, 0],      ease: 'outCubic' },
  { id: 'fanFrontTop',    start: 2.6,  duration: 0.45, fromOffset: [0, 0, 3],     fromRotation: [0, 0, 1.2],     ease: 'outBack' },
  { id: 'fanFrontMid',    start: 2.68, duration: 0.45, fromOffset: [0, 0, 3],     fromRotation: [0, 0, 1.2],     ease: 'outBack' },
  { id: 'fanFrontBottom', start: 2.76, duration: 0.45, fromOffset: [0, 0, 3],     fromRotation: [0, 0, 1.2],     ease: 'outBack' },
  { id: 'fanRear',        start: 2.84, duration: 0.45, fromOffset: [2.6, 0, 0],   fromRotation: [0, 0, 1.2],     ease: 'outBack' },
  // Glass group pivots on its front edge, so a y-rotation swings it shut like a door
  { id: 'glass',          start: 3.0,  duration: 0.6,  fromOffset: [0, 0, 0],     fromRotation: [0, -1.4, 0],    ease: 'outCubic' },
];
