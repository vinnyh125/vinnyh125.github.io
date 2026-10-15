import { describe, expect, it } from 'vitest';
import {
  ROTATION,
  createRotationState,
  dragBy,
  endDrag,
  startDrag,
  stepRotation,
  yawOf,
  type RotationState,
} from './rotation';

function run(s: RotationState, seconds: number, pointer: { x: number; y: number } | null = null, sway = true) {
  for (let t = 0; t < seconds; t += 1 / 60) s = stepRotation(s, 1 / 60, pointer, sway);
  return s;
}

describe('rotation', () => {
  it('sways on its own when idle', () => {
    const s = run(createRotationState(), 2);
    expect(yawOf(s)).not.toBeCloseTo(yawOf(createRotationState()));
  });

  it('does not sway when sway is disabled (reduced motion)', () => {
    const s = run(createRotationState(), 2, null, false);
    expect(yawOf(s)).toBeCloseTo(yawOf(createRotationState()));
  });

  it('turns with horizontal drags and clamps pitch on vertical drags', () => {
    let s = startDrag(createRotationState());
    s = dragBy(s, 100, 0, 1 / 60);
    expect(s.userYaw).toBeCloseTo(100 * ROTATION.dragSensitivity);
    s = dragBy(s, 0, 10_000, 1 / 60);
    expect(s.pitch).toBe(ROTATION.pitchMax);
    s = dragBy(s, 0, -20_000, 1 / 60);
    expect(s.pitch).toBe(ROTATION.pitchMin);
  });

  it('drifts back to a full turn and level pitch after release', () => {
    let s = startDrag(createRotationState());
    s = dragBy(s, 900, 50, 1 / 60);
    s = run(endDrag(s), 15);
    const turns = s.userYaw / (2 * Math.PI);
    expect(Math.abs(turns - Math.round(turns))).toBeLessThan(0.01);
    expect(Math.abs(s.pitch)).toBeLessThan(0.01);
  });

  it('tilts toward the pointer and back when it leaves', () => {
    let s = run(createRotationState(), 3, { x: 1, y: -1 });
    expect(s.tiltY).toBeCloseTo(ROTATION.tiltMax, 2);
    expect(s.tiltX).toBeCloseTo(-ROTATION.tiltMax, 2);
    s = run(s, 3, null);
    expect(s.tiltY).toBeCloseTo(0, 2);
  });
});
