// src/scripts/pc/rotation.ts
// Idle sway + drag-to-rotate + pointer tilt, stepped once per frame. Pure — no DOM or three.js.

export const ROTATION = {
  swayAmplitude: 0.4, // radians either side of the resting angle
  swaySpeed: 0.25, // radians of sway phase per second
  dragSensitivity: 0.008, // radians per dragged pixel
  pitchMin: -0.2,
  pitchMax: 0.35,
  inertiaDamping: 4, // per second
  settleDelay: 1.2, // seconds after release before drifting back
  settleRate: 1.8, // per second
  tiltMax: 0.06, // radians of lean toward the pointer
  tiltRate: 4, // per second
};

export interface RotationState {
  swayTime: number;
  userYaw: number;
  pitch: number;
  yawVelocity: number;
  dragging: boolean;
  sinceRelease: number;
  tiltX: number;
  tiltY: number;
}

export function createRotationState(): RotationState {
  return { swayTime: 0, userYaw: 0, pitch: 0, yawVelocity: 0, dragging: false, sinceRelease: 0, tiltX: 0, tiltY: 0 };
}

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
/** Fraction of the remaining distance to cover this frame, frame-rate independent */
const approach = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);

export const yawOf = (s: RotationState) => Math.sin(s.swayTime * ROTATION.swaySpeed) * ROTATION.swayAmplitude + s.userYaw;

export const startDrag = (s: RotationState): RotationState => ({ ...s, dragging: true, yawVelocity: 0 });

export const endDrag = (s: RotationState): RotationState => ({ ...s, dragging: false, sinceRelease: 0 });

export function dragBy(s: RotationState, dxPx: number, dyPx: number, dt: number): RotationState {
  const dYaw = dxPx * ROTATION.dragSensitivity;
  return {
    ...s,
    userYaw: s.userYaw + dYaw,
    pitch: clamp(s.pitch + dyPx * ROTATION.dragSensitivity, ROTATION.pitchMin, ROTATION.pitchMax),
    yawVelocity: dt > 0 ? dYaw / dt : s.yawVelocity,
  };
}

/**
 * @param pointer normalized pointer position in [-1, 1] over the canvas, or null when it's elsewhere
 * @param sway false under prefers-reduced-motion
 */
export function stepRotation(
  s: RotationState,
  dt: number,
  pointer: { x: number; y: number } | null,
  sway: boolean,
): RotationState {
  const next = { ...s };
  const tilt = approach(ROTATION.tiltRate, dt);
  next.tiltY += ((pointer ? pointer.x * ROTATION.tiltMax : 0) - next.tiltY) * tilt;
  next.tiltX += ((pointer ? pointer.y * ROTATION.tiltMax : 0) - next.tiltX) * tilt;

  if (s.dragging) return next;

  if (sway) next.swayTime += dt;
  next.sinceRelease += dt;
  next.userYaw += next.yawVelocity * dt;
  next.yawVelocity *= Math.exp(-ROTATION.inertiaDamping * dt);

  if (next.sinceRelease > ROTATION.settleDelay) {
    const settle = approach(ROTATION.settleRate, dt);
    // Drift to the nearest whole turn so it never unwinds a long spin
    const fullTurn = Math.round(next.userYaw / (2 * Math.PI)) * 2 * Math.PI;
    next.userYaw += (fullTurn - next.userYaw) * settle;
    next.pitch += (0 - next.pitch) * settle;
  }
  return next;
}
