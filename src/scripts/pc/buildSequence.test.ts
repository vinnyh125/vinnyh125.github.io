import { describe, expect, it } from 'vitest';
import { BOOT_START, BUILD_ORDER, SEQUENCE_END, buildSequence } from './buildSequence';

describe('buildSequence', () => {
  it('has exactly one track per part in BUILD_ORDER', () => {
    expect(buildSequence.map((t) => t.id).sort()).toEqual([...BUILD_ORDER].sort());
  });

  it('starts parts in real build order', () => {
    const starts = BUILD_ORDER.map((id) => buildSequence.find((t) => t.id === id)!.start);
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
  });

  it('settles every part before the PC boots', () => {
    for (const track of buildSequence) {
      expect(track.start + track.duration).toBeLessThanOrEqual(BOOT_START);
    }
  });

  it('ends after the boot ramp', () => {
    expect(SEQUENCE_END).toBeGreaterThan(BOOT_START);
  });
});
