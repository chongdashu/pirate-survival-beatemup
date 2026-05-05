type Listener<T> = (state: T) => void;

export interface Store<T> {
  getState(): T;
  setState(nextState: T): void;
  patchState(patch: Partial<T>): void;
  subscribe(listener: Listener<T>): () => void;
}

export function createStore<T extends object>(initialState: T): Store<T> {
  let state = initialState;
  const listeners = new Set<Listener<T>>();

  const emit = (): void => {
    for (const listener of listeners) {
      listener(state);
    }
  };

  return {
    getState: () => state,
    setState(nextState) {
      state = nextState;
      emit();
    },
    patchState(patch) {
      state = { ...state, ...patch };
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      listener(state);

      return () => {
        listeners.delete(listener);
      };
    }
  };
}
