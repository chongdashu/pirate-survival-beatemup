import { describe, expect, it } from 'vitest';

import { resolveStartupProfile } from './profiles';

describe('resolveStartupProfile', () => {
  it('uses the query string when the profile is valid', () => {
    expect(resolveStartupProfile('?profile=portrait')).toBe('portrait');
  });

  it('falls back to the provided default profile when the query string is missing', () => {
    expect(resolveStartupProfile('', 'landscape')).toBe('landscape');
  });

  it('defaults to landscape when no explicit default is provided', () => {
    expect(resolveStartupProfile('')).toBe('landscape');
  });
});
