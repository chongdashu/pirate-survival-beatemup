import type { Store } from './store';
import type { DebugState, GameProfile, GameSettings } from './types';

export interface AppContext {
  debugStore: Store<DebugState>;
  settingsStore: Store<GameSettings>;
  getProfile(): GameProfile;
}

let activeContext: AppContext | null = null;

export function setAppContext(context: AppContext): void {
  activeContext = context;
}

export function getAppContext(): AppContext {
  if (!activeContext) {
    throw new Error('App context has not been initialized');
  }

  return activeContext;
}
