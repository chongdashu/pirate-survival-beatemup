import { createStore, type Store } from './store';
import { SCENE_KEYS, type DebugState } from './types';

export const DEFAULT_DEBUG_STATE: DebugState = {
  activeScene: SCENE_KEYS.Boot,
  paused: false,
  showWorldBounds: false,
  pointer: { x: 0, y: 0 },
  input: {
    up: false,
    down: false,
    left: false,
    right: false,
    pointerDown: false
  }
};

export function createDebugStore(): Store<DebugState> {
  return createStore<DebugState>(DEFAULT_DEBUG_STATE);
}
