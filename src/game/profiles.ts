import type { GameProfile, GameProfileConfig } from './types';

export const GAME_PROFILES: Record<GameProfile, GameProfileConfig> = {
  landscape: {
    id: 'landscape',
    label: 'Landscape',
    width: 1280,
    height: 720
  },
  portrait: {
    id: 'portrait',
    label: 'Portrait',
    width: 720,
    height: 1280
  }
};

export function isGameProfile(value: string | null | undefined): value is GameProfile {
  return value === 'landscape' || value === 'portrait';
}

export function resolveStartupProfile(search: string, defaultProfile: GameProfile = 'landscape'): GameProfile {
  const params = new URLSearchParams(search);
  const requested = params.get('profile');

  if (isGameProfile(requested)) {
    return requested;
  }

  return defaultProfile;
}
