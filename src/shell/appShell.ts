import * as Phaser from 'phaser';

import { setAppContext, type AppContext } from '../game/context';
import { createDebugStore } from '../game/debug';
import { createGame } from '../game/createGame';
import { GAME_PROFILES, resolveStartupProfile } from '../game/profiles';
import { createSettingsStore } from '../game/settings';
import { SCENE_KEYS, type GameProfile } from '../game/types';

export function createApp(root: HTMLElement): void {
  root.innerHTML = `
    <div class="app-shell" data-profile="landscape">
      <header class="app-shell__header">
        <div class="app-shell__brand">
          <p class="eyebrow">VGD-PHASER-STARTER ▸ v0.1</p>
          <h1>PHASER 4 STARTER</h1>
          <p class="subtitle">Reusable scaffold for 2D browser games</p>
        </div>
        <div class="app-shell__header-action">
          <button id="play-toggle" class="shell-button" data-variant="primary" type="button">Play</button>
        </div>
        <div class="app-shell__status">
          <button id="profile-toggle" class="status-chip" type="button" title="Toggle layout">Landscape</button>
          <span id="scene-badge" class="status-chip" data-tone="muted">BootScene</span>
        </div>
      </header>
      <div class="app-shell__workspace">
        <section class="game-host">
          <div class="game-host__bezel-label">
            <span>GAME ▸ CANVAS</span>
            <span class="dots"><i></i><i></i><i></i></span>
          </div>
          <div id="game-root" class="game-root"></div>
        </section>
        <aside id="debug-panel" class="debug-panel">
          <div class="debug-panel__header">
            <h2 class="debug-panel__title">Debug Console</h2>
            <button id="debug-collapse" class="shell-button" type="button">Collapse</button>
          </div>
          <div class="debug-panel__body">
            <div id="debug-controls" class="debug-panel__controls"></div>
          </div>
        </aside>
      </div>
      <div id="play-toast" class="play-toast" role="status" aria-live="polite">
        Press ESC to return to editor
      </div>
    </div>
  `;

  const appShell = root.querySelector<HTMLElement>('.app-shell');
  const gameRoot = root.querySelector<HTMLElement>('#game-root');
  const debugPanel = root.querySelector<HTMLElement>('#debug-panel');
  const debugControls = root.querySelector<HTMLElement>('#debug-controls');
  const collapseButton = root.querySelector<HTMLButtonElement>('#debug-collapse');
  const playToggle = root.querySelector<HTMLButtonElement>('#play-toggle');
  const playToast = root.querySelector<HTMLElement>('#play-toast');
  const profileToggle = root.querySelector<HTMLButtonElement>('#profile-toggle');
  const sceneBadge = root.querySelector<HTMLElement>('#scene-badge');

  if (
    !appShell ||
    !gameRoot ||
    !debugPanel ||
    !debugControls ||
    !collapseButton ||
    !playToggle ||
    !playToast ||
    !profileToggle ||
    !sceneBadge
  ) {
    throw new Error('App shell failed to mount');
  }

  const settingsStore = createSettingsStore();
  const debugStore = createDebugStore();
  let currentProfile = resolveStartupProfile(window.location.search);
  let game: Phaser.Game | null = null;
  let playToastTimeout: number | null = null;

  const context: AppContext = {
    debugStore,
    settingsStore,
    getProfile: () => currentProfile
  };

  setAppContext(context);

  const showPlayToast = (): void => {
    playToast.classList.add('is-visible');

    if (playToastTimeout !== null) {
      window.clearTimeout(playToastTimeout);
    }

    playToastTimeout = window.setTimeout(() => {
      playToast.classList.remove('is-visible');
      playToastTimeout = null;
    }, 2200);
  };

  const enterPlayMode = (): void => {
    if (appShell.classList.contains('is-play-mode')) {
      return;
    }

    appShell.classList.add('is-play-mode');
    playToggle.textContent = 'Playing';
    showPlayToast();
  };

  const exitPlayMode = (): void => {
    if (!appShell.classList.contains('is-play-mode')) {
      return;
    }

    appShell.classList.remove('is-play-mode');
    playToggle.textContent = 'Play';
    playToast.classList.remove('is-visible');

    if (playToastTimeout !== null) {
      window.clearTimeout(playToastTimeout);
      playToastTimeout = null;
    }
  };

  const remountGame = (profile: GameProfile): void => {
    currentProfile = profile;
    const profileConfig = GAME_PROFILES[profile];

    profileToggle.textContent = profileConfig.label;
    appShell.dataset.profile = profile;

    game?.destroy(true, false);
    gameRoot.innerHTML = '';
    debugStore.patchState({ activeScene: SCENE_KEYS.Boot, paused: false });
    game = createGame(gameRoot, profile);
  };

  debugControls.innerHTML = `
    <div class="panel-group">
      <p class="panel-group__title">Runtime</p>
      <div class="panel-group__row">
        <button id="pause-toggle" class="shell-button" data-variant="primary" type="button">Pause</button>
      </div>
      <label class="toggle-row"><input id="show-world" type="checkbox" /> World bounds</label>
    </div>

    <div class="metrics">
      <div class="metrics__row"><span>Scene</span><strong id="scene-readout">-</strong></div>
      <div class="metrics__row"><span>Pointer</span><strong id="pointer-readout">0, 0</strong></div>
      <div class="metrics__row"><span>Input</span><strong id="input-readout">idle</strong></div>
    </div>
  `;

  const pauseToggle = debugControls.querySelector<HTMLButtonElement>('#pause-toggle');
  const showWorld = debugControls.querySelector<HTMLInputElement>('#show-world');
  const sceneReadout = debugControls.querySelector<HTMLElement>('#scene-readout');
  const pointerReadout = debugControls.querySelector<HTMLElement>('#pointer-readout');
  const inputReadout = debugControls.querySelector<HTMLElement>('#input-readout');

  if (!pauseToggle || !showWorld || !sceneReadout || !pointerReadout || !inputReadout) {
    throw new Error('Debug panel controls failed to mount');
  }

  pauseToggle.addEventListener('click', () => {
    debugStore.patchState({ paused: !debugStore.getState().paused });
  });

  showWorld.addEventListener('change', () => {
    debugStore.patchState({ showWorldBounds: showWorld.checked });
  });

  collapseButton.addEventListener('click', () => {
    debugPanel.classList.toggle('is-collapsed');
    collapseButton.textContent = debugPanel.classList.contains('is-collapsed') ? 'Expand' : 'Collapse';
  });

  playToggle.addEventListener('click', () => {
    if (appShell.classList.contains('is-play-mode')) {
      exitPlayMode();
    } else {
      enterPlayMode();
    }
  });

  profileToggle.addEventListener('click', () => {
    const next: GameProfile = currentProfile === 'landscape' ? 'portrait' : 'landscape';
    remountGame(next);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      exitPlayMode();
    }
  });

  debugStore.subscribe((state) => {
    sceneBadge.textContent = state.activeScene;
    sceneReadout.textContent = state.activeScene;
    showWorld.checked = state.showWorldBounds;
    pauseToggle.textContent = state.paused ? 'Resume' : 'Pause';
    pointerReadout.textContent = `${Math.round(state.pointer.x)}, ${Math.round(state.pointer.y)}`;

    const activeInputs = [
      state.input.up ? 'up' : '',
      state.input.down ? 'down' : '',
      state.input.left ? 'left' : '',
      state.input.right ? 'right' : '',
      state.input.pointerDown ? 'pointer' : ''
    ].filter(Boolean);

    inputReadout.textContent = activeInputs.length > 0 ? activeInputs.join(' + ') : 'idle';
  });

  remountGame(currentProfile);
}
