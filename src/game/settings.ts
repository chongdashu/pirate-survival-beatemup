import { STORAGE_KEY } from './constants';
import { createStore, type Store } from './store';
import type { GameSettings } from './types';

export const DEFAULT_SETTINGS: GameSettings = {
  volume: 0.8,
  muted: false
};

export function sanitizeSettings(raw: unknown): GameSettings {
  const candidate = raw as Partial<GameSettings> | null;

  return {
    volume:
      typeof candidate?.volume === 'number' && candidate.volume >= 0 && candidate.volume <= 1
        ? candidate.volume
        : DEFAULT_SETTINGS.volume,
    muted: typeof candidate?.muted === 'boolean' ? candidate.muted : DEFAULT_SETTINGS.muted
  };
}

export function loadSettings(storage: Storage = window.localStorage): GameSettings {
  try {
    const raw = storage.getItem(STORAGE_KEY);

    if (!raw) {
      return DEFAULT_SETTINGS;
    }

    return sanitizeSettings(JSON.parse(raw));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings, storage: Storage = window.localStorage): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function createSettingsStore(storage: Storage = window.localStorage): Store<GameSettings> {
  const store = createStore<GameSettings>(loadSettings(storage));

  store.subscribe((settings) => {
    saveSettings(settings, storage);
  });

  return store;
}
