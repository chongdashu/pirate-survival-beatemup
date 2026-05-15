# Pirate Survival Beat 'Em Up

A Phaser 4 + Vite + TypeScript starter for the *Build a Pirate Beat 'Em Up Game in 30 mins* tutorial.

This repository is the tutorial starting point. It includes the app shell, scene flow, debug tooling, responsive profiles, and pirate/skeleton character asset manifests. It does **not** include a `completed` branch in the public repo.

> **Live demo:** https://vgd-pirate-beatemup.vercel.app

[![VibeGameDev](https://raw.githubusercontent.com/chongdashu/vibejam-starter-pack/main/assets/vgd.png)](https://vibegamedev.com)

Brought to you by [VibeGameDev.com](https://vibegamedev.com) - visit for more vibe coding game dev resources, starter projects, and agent workflows.

## Quickstart

```bash
git clone https://github.com/chongdashu/pirate-survival-beatemup.git
cd pirate-survival-beatemup
npm install
npm run dev        # http://localhost:5173
```

## Commands

```bash
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Type check + production build to /dist
npm run typecheck  # TypeScript check only (no emit)
npm test           # Run all Vitest unit tests once
npm run preview    # Preview production build locally
```

## Repository State

The public repository is intentionally the starting version of the project:

- `main` is the public tutorial starting point.
- There is no public `completed` branch.
- Gameplay currently lives in `SandboxScene`, which is a placeholder with a WASD-controlled rectangle.
- Pirate and skeleton runtime assets are included under `public/assets/lobit/`, ready to wire into gameplay during the tutorial.

## What the starter gives you

- **App shell** (`src/shell/appShell.ts`) - header, Play/Editor toggle, profile switcher, scene badge, and collapsible debug panel.
- **Scene flow** - `BootScene` -> `SplashScene` -> `MainMenuScene` -> `SandboxScene` / `SettingsScene`.
- **Debug panel** - pause toggle, world-bounds overlay, live pointer + keyboard input readout, and active scene tracker.
- **Settings** - volume + mute, persisted to `localStorage`.
- **Profiles** - `landscape` (1280x720) and `portrait` (720x1280). Switch in the header chip or via `?profile=portrait`.
- **Reactive store** (`src/game/store.ts`) - tiny `createStore<T>` with `subscribe`, `setState`, and `patchState`.
- **Generated UI textures** (`src/game/generatedAssets.ts`) - buttons and panel rendered at boot via Phaser graphics.
- **Pirate + skeleton assets** under `public/assets/lobit/` - west-facing 256x256-frame spritesheets, previews, and per-animation manifests for idle, walk, attack, hurt, death, and jump.

## Tutorial Map

Use the commit history on `main` as the tutorial source. The public repo does not publish a finished-game branch to diff against.

1. Tour the starter project and character assets.
2. Run the starter project.
3. Generate stage backgrounds.
4. Build a canonical asset index.
5. Integrate the pirate player.
6. Add a skeleton enemy and fix facing.
7. Visualize visual, hit, and attack bounds.
8. Gate hits to active weapon frames.
9. Tune attack bounds to weapon shape.
10. Add a health system.
11. Add death animations and game over.
12. Plan the round progression loop.
13. Implement the round loop.
14. Clean up the HUD and scene names.
15. Add BGM and SFX.
16. Brand the game.
17. Add polish, juice, and editable world bounds.

## Architecture

```text
index.html
  -> src/main.ts
       -> src/shell/appShell.ts        # outer shell, stores, profile mount
            -> src/game/createGame.ts  # Phaser.Game factory
                 -> scenes/*           # Boot -> Splash -> MainMenu -> Sandbox / Settings
```

`AppContext` (`src/game/context.ts`) bundles `debugStore`, `settingsStore`, and the active profile. Every scene reaches it via `this.app` from `BaseScene`.

## Conventions

- One scene per file in `src/scenes/`.
- Game-engine concerns live in `src/game/`.
- Outer DOM/UI lives in `src/shell/`.
- Tests are colocated (`*.test.ts`) and use Vitest.
- TypeScript strict mode is enabled. `noUnusedLocals` and `noUnusedParameters` are enforced.
- The shell is plain DOM code; do not add React, Vue, or another app framework.

## Extending

### Add a scene

1. Create `src/scenes/MyScene.ts` extending `BaseScene`.
2. Add the key to `SCENE_KEYS` in `src/game/types.ts`.
3. Register the scene in the `scene` array in `src/game/createGame.ts`.
4. Add a menu option in `src/scenes/MainMenuScene.ts`, or call `this.scene.start(SCENE_KEYS.MyScene)` from another scene.

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

Settings are auto-persisted by `createSettingsStore`; every patch writes through to `localStorage`.

## License

MIT
