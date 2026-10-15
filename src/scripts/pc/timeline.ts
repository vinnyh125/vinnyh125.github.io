// src/scripts/pc/timeline.ts
// Pure timing math for the PC build animation — no three.js imports so it can be unit tested.

export type Vec3 = [number, number, number];

export const easings = {
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  // Slight overshoot so parts feel like they "click" into place
  outBack: (t: number) => {
    const c1 = 1.4;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};

export type EaseName = keyof typeof easings;

export interface PartTrack {
  id: string;
  start: number;
  duration: number;
  /** Offset from the resting position at the start of the track */
  fromOffset: Vec3;
  /** Euler rotation (radians) added to the resting rotation at the start of the track */
  fromRotation: Vec3;
  ease: EaseName;
}

export interface Pose {
  visible: boolean;
  opacity: number;
  offset: Vec3;
  rotation: Vec3;
}

/** Fraction of a track's duration spent fading in */
const FADE_PORTION = 0.35;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const scale = (v: Vec3, k: number): Vec3 => [v[0] * k, v[1] * k, v[2] * k];

export function poseAt(track: PartTrack, t: number): Pose {
  if (t < track.start) {
    return { visible: false, opacity: 0, offset: [...track.fromOffset], rotation: [...track.fromRotation] };
  }
  const progress = clamp01((t - track.start) / track.duration);
  if (progress === 1) {
    return { visible: true, opacity: 1, offset: [0, 0, 0], rotation: [0, 0, 0] };
  }
  const remaining = 1 - easings[track.ease](progress);
  return {
    visible: true,
    opacity: clamp01(progress / FADE_PORTION),
    offset: scale(track.fromOffset, remaining),
    rotation: scale(track.fromRotation, remaining),
  };
}

/** 0 → 1 ramp for the boot glow, starting `delay` seconds after `bootStart` */
export function bootLevel(t: number, bootStart: number, duration: number, delay = 0): number {
  return easings.inOutCubic(clamp01((t - bootStart - delay) / duration));
}
