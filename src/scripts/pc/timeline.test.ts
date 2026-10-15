import { describe, expect, it } from 'vitest';
import { bootLevel, easings, poseAt, type PartTrack } from './timeline';

const track: PartTrack = {
  id: 'gpu',
  start: 1,
  duration: 2,
  fromOffset: [4, -2, 0],
  fromRotation: [0, 1, 0],
  ease: 'outCubic',
};

describe('easings', () => {
  it.each(Object.entries(easings))('%s starts at 0 and ends at 1', (_, ease) => {
    expect(ease(0)).toBeCloseTo(0);
    expect(ease(1)).toBeCloseTo(1);
  });

  it('outBack overshoots past 1 before settling', () => {
    const samples = Array.from({ length: 50 }, (_, i) => easings.outBack(i / 49));
    expect(Math.max(...samples)).toBeGreaterThan(1);
  });
});

describe('poseAt', () => {
  it('is hidden and fully offset before the track starts', () => {
    const pose = poseAt(track, 0.5);
    expect(pose.visible).toBe(false);
    expect(pose.opacity).toBe(0);
    expect(pose.offset).toEqual([4, -2, 0]);
    expect(pose.rotation).toEqual([0, 1, 0]);
  });

  it('is visible and partway there mid-track', () => {
    const pose = poseAt(track, 2);
    expect(pose.visible).toBe(true);
    expect(pose.offset[0]).toBeGreaterThan(0);
    expect(pose.offset[0]).toBeLessThan(4);
    expect(pose.opacity).toBe(1);
  });

  it('fades in over the start of the track', () => {
    const pose = poseAt(track, 1.1);
    expect(pose.opacity).toBeGreaterThan(0);
    expect(pose.opacity).toBeLessThan(1);
  });

  it('rests exactly in place once the track ends', () => {
    const pose = poseAt(track, 10);
    expect(pose).toEqual({ visible: true, opacity: 1, offset: [0, 0, 0], rotation: [0, 0, 0] });
  });
});

describe('bootLevel', () => {
  it('ramps from 0 to 1 after the boot start, shifted by delay', () => {
    expect(bootLevel(0, 3, 1)).toBe(0);
    expect(bootLevel(3, 3, 1)).toBe(0);
    expect(bootLevel(3.5, 3, 1)).toBeCloseTo(0.5);
    expect(bootLevel(4, 3, 1)).toBe(1);
    expect(bootLevel(4, 3, 1, 0.5)).toBeLessThan(1);
    expect(bootLevel(99, 3, 1, 0.5)).toBe(1);
  });
});
