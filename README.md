# vgd-phaser-starter

A minimal Phaser 4 + Vite + TypeScript starter with an opinionated app shell, scene flow, debug panel, and settings persistence. Drop your game logic into `SandboxScene` and grow from there.

## Quickstart

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to /dist
npm run typecheck
npm test
```

## What's in the box

- **App shell** (`src/shell/appShell.ts`) — header with brand, Play/Editor toggle, profile (landscape/portrait) switcher, scene badge, collapsible debug panel.
- **Scene flow** — `BootScene` → `SplashScene` → `MainMenuScene` → `SandboxScene` / `SettingsScene`.
- **Debug panel** — Pause toggle, World-bounds overlay toggle, live pointer + keyboard input readout, scene tracker.
- **Settings** — Volume + mute, persisted to `localStorage` under `vgd-phaser-starter-settings`.
- **Profiles** — `landscape` (1280×720) and `portrait` (720×1280). Switch via the chip in the header or `?profile=portrait` in the URL.
- **Reactive store** (`src/game/store.ts`) — tiny `createStore<T>` with `subscribe`/`patchState`. Used for both debug and settings.
- **Generated UI textures** (`src/game/generatedAssets.ts`) — `ui-button`, `ui-button-active`, `ui-panel` rendered at boot via Phaser graphics. No external art required.

## Architecture summary

```
index.html
  └─ src/main.ts
       └─ src/shell/appShell.ts        # outer shell, stores, profile mount
            └─ src/game/createGame.ts  # Phaser.Game factory
                 └─ scenes/*           # Boot → Splash → MainMenu → Sandbox / Settings
```

`AppContext` (`src/game/context.ts`) bundles `debugStore`, `settingsStore`, and the active profile. Every scene reaches it via `this.app` (provided by `BaseScene`).

## Extending

### Add a scene

1. Create `src/scenes/MyScene.ts` extending `BaseScene`.
2. Add the key to `SCENE_KEYS` in `src/game/types.ts`.
3. Register the scene in the `scene` array in `src/game/createGame.ts`.
4. Add a menu option in `src/scenes/MainMenuScene.ts` (or `this.scene.start(SCENE_KEYS.MyScene)` from anywhere).

### Add a debug control

The debug panel HTML is built in `src/shell/appShell.ts` (`debugControls.innerHTML`). To add a toggle:

1. Add a field to `DebugState` in `src/game/types.ts` and to `DEFAULT_DEBUG_STATE` in `src/game/debug.ts`.
2. Add the input markup inside the `panel-group` in `appShell.ts`.
3. Wire `addEventListener('change', ...)` to `debugStore.patchState({ ... })`.
4. In your scene's `update`, read the flag via `this.app.debugStore.getState()`.

### Add a setting

1. Extend `GameSettings` in `src/game/types.ts`.
2. Update `DEFAULT_SETTINGS` and `sanitizeSettings` in `src/game/settings.ts` to handle the new field.
3. Read and write via `this.app.settingsStore.patchState({ ... })` and `getState()`.

Settings are auto-persisted by `createSettingsStore` — every patch writes through to `localStorage`.

## Syncing lobit assets

Sprite assets from the [spriterrific](~/projects/spriterrific) project are synced into `public/assets/lobit/`. Run:

```bash
./scripts/sync-lobit-assets.sh
```

This uses `rsync` to mirror `~/Projects/spriterrific/public/assets/characters/lobit/` into the local `public/assets/lobit/` directory, deleting any files that no longer exist in the source.

## Conventions

- TypeScript strict mode is on (`noUnusedLocals`, `noUnusedParameters`). The build will fail on unused declarations.
- Tests live next to the module they test (`*.test.ts`). Run with `npm test` or `npx vitest`.
- All textures are generated at runtime in `BootScene`. Add real art assets via `scene.load.image(...)` in `BootScene.preload`.
- The app-shell HTML is plain template-string DOM — no React, no framework. Add UI controls by extending the markup and querying for them.

## License

MIT — see [LICENSE](LICENSE) (add one when you ship).
