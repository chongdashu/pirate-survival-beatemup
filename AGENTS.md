# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Type check + production build to /dist
npm run typecheck  # TypeScript check only (no emit)
npm test           # Run all Vitest unit tests once
npm run preview    # Preview production build locally
```

## Architecture

### Bootstrap flow

`index.html` → `src/main.ts` → `appShell.ts` (creates debug/settings stores, AppContext, debug panel DOM) → `createGame.ts` (Phaser.Game factory) → scenes.

`appShell.ts` owns the outer shell: profile switching, play-mode toggle (ESC/Play button), and the debug sidebar. When the profile changes via the header chip, it tears down and remounts the Phaser game.

### Scene graph

`BootScene` → `SplashScene` → `MainMenuScene` → `SandboxScene` | `SettingsScene`

All scenes extend `BaseScene`, which provides common heading, footer, and navigation helpers. Scene keys are the `SceneKey` union in `src/game/types.ts`.

**`SandboxScene` is the integration point** for new gameplay. It's a placeholder with a WASD-controlled rectangle, plus debug-panel wiring (live pointer/input snapshot, honors `paused` and `showWorldBounds`). Replace its contents — or add new scenes alongside it — when implementing real features.

### State management

`src/game/store.ts` exports a generic `createStore<T>` with immutable `setState` / `patchState` and a subscribe/unsubscribe observer pattern. Two stores are created in `appShell.ts`:
- **debugStore** — pointer position, input snapshot, paused, showWorldBounds, activeScene
- **settingsStore** — volume and mute, persisted to localStorage under the key in `constants.ts`

Both stores plus the active `GameProfile` are bundled into an `AppContext` singleton (`context.ts`) and passed into every scene via `this.app`.

### Responsive profiles

`src/game/profiles.ts` maps `"landscape"` (1280×720) and `"portrait"` (720×1280) to `GameProfileConfig`. Profile is resolved from the `?profile=` query string; defaults to landscape. Switching profile unmounts/remounts the entire Phaser game.

### Asset generation

No external art assets shipped with the starter. `src/game/generatedAssets.ts` runs during `BootScene` and creates `ui-button`, `ui-button-active`, `ui-panel` textures via Phaser graphics. To add real assets, call `scene.load.image(...)` in `BootScene.preload`.

## TypeScript notes

Strict mode is on. `noUnusedLocals` and `noUnusedParameters` are enforced — the build will fail on unused declarations. Target is ES2022/ESNext modules.

## Conventions

- One scene per file in `src/scenes/`.
- Game-engine concerns (stores, types, profiles, asset generation) live in `src/game/`.
- Outer DOM/UI lives in `src/shell/`.
- Tests are colocated (`*.test.ts`) and use Vitest.
- Don't add framework (React, Vue, etc.) for the shell — it's intentionally a plain DOM template.
