import { describe, expect, it } from 'vitest';

import { DEFAULT_SETTINGS, sanitizeSettings } from './settings';

describe('sanitizeSettings', () => {
  it('normalizes valid persisted settings', () => {
    expect(
      sanitizeSettings({
        volume: 0.4,
        muted: true
      })
    ).toEqual({
      volume: 0.4,
      muted: true
    });
  });

  it('falls back when persisted settings are invalid', () => {
    expect(
      sanitizeSettings({
        volume: 99
      })
    ).toEqual(DEFAULT_SETTINGS);
  });
});
