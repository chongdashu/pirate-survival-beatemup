# Pirate Survival Beat 'Em Up — Starter

A Phaser 4 + Vite + TypeScript starter with pirate and skeleton character art baked in, paired with a 17-lesson tutorial that ships an entire survival brawler — fully animated waves on a moonlit ship deck, with original BGM, SFX, screen shake, hit-stop, particles, and a Fibonacci-ramped round loop.

This repo is the **companion code** for the *Build a Pirate Beat 'Em Up Game in 30 mins* tutorial. Each lesson maps to one commit, so you can follow along, peek ahead, or diff against your own work at any point.

> **Live demo:** https://vgd-pirate-beatemup.vercel.app

## Two branches: pick where you start

| Branch | What's there | When to use |
| --- | --- | --- |
| [`start`](../../tree/start) | Phaser starter + character spritesheets, no gameplay yet. **You are here.** | Following the tutorial from lesson 1. |
| [`completed`](../../tree/completed) | The finished game — animated pirate, skeleton waves, health, audio, juice, polish. | Reference solution, or just play it. |

```bash
# Start the tutorial:
git clone https://github.com/AIOriented/vgd-pirate-survival-beatemup.git
cd vgd-pirate-survival-beatemup
npm install
npm run dev   # http://localhost:5173

# Or skip ahead and run the finished game:
git checkout completed
npm install
npm run dev
```

## Quickstart

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to /dist
npm run typecheck
npm test
```

## What the starter gives you

- **App shell** (`src/shell/appShell.ts`) — header, Play/Editor toggle, profile (landscape/portrait) switcher, scene badge, collapsible debug panel.
- **Scene flow** — `BootScene` → `SplashScene` → `MainMenuScene` → `SandboxScene` / `SettingsScene` (renamed to `GameScene` in lesson 14).
- **Debug panel** — Pause toggle, world-bounds overlay, live pointer + keyboard input readout, scene tracker.
- **Settings** — Volume + mute, persisted to `localStorage`.
- **Profiles** — `landscape` (1280×720) and `portrait` (720×1280). Switch in the header chip or via `?profile=portrait`.
- **Reactive store** (`src/game/store.ts`) — tiny `createStore<T>` with `subscribe`/`patchState`.
- **Generated UI textures** (`src/game/generatedAssets.ts`) — buttons and panel rendered at boot via Phaser graphics.
- **Pirate + skeleton sprites** under `public/assets/lobit/` — west-facing 1280×512 spritesheets at 256×256 frames, with per-animation manifests (idle, walk, attack, hurt, death, jump). You wire these up starting in lesson 5.

## Tutorial map (17 lessons, ~3.5 hours)

Each lesson is one commit on the `completed` branch. Diff a single lesson with `git log start..completed --oneline` and `git show <hash>`.

1. **Tour the Starter Project & Character Assets** — get oriented with the folder layout and spritesheet conventions.
2. **Run the Starter Project** — clone, install, `npm run dev`.
3. **Generate Stage Backgrounds With imagegen** — four pirate backdrops via parallel agent workers.
4. **Build a Canonical Asset Index** — one `index.json` cataloguing every sprite + animation.
5. **Integrate the Pirate Player** — animated WASD movement + Z to attack.
6. **Add a Skeleton Enemy + Fix the Flip Bug** — chasing AI, knockback, and a root-caused facing bug.
7. **Visualize Visual / Hit / Attack Bounds** — separate debug toggles for each box.
8. **Gate Hits to the Active Weapon Frame** — only frame 4 deals damage.
9. **Tune Attack Bounds to Weapon Shape** — thinner, higher hitboxes that match the art.
10. **Add a Health System** — player HP bar with green/amber/red/blink, enemy bars overhead.
11. **Death Animations + Game Over** — non-looping death, lingering corpses, restart screen.
12. **Plan the Round Progression Loop** — design the survival loop before building it.
13. **Implement the Round Loop (and Fix the Restart Bug)** — Fibonacci enemy ramp, trickle spawns, scene-restart fix.
14. **Clean Up the HUD + Rename to GameScene** — production-ready layout and names.
15. **Generate BGM + SFX With Agent Skills** — 4 BGM candidates + SFX, switchable in the debug panel.
16. **Brand It: 'Deck Brawl'** — pick a name, refresh menu copy.
17. **Polish, Juice, and an Editable World Bounds** — shadows, screen shake, hit-stop, flashes, particles.

## Architecture

```
index.html
  └─ src/main.ts
       └─ src/shell/appShell.ts        # outer shell, stores, profile mount
            └─ src/game/createGame.ts  # Phaser.Game factory
                 └─ scenes/*           # Boot → Splash → MainMenu → Sandbox / Settings
```

`AppContext` (`src/game/context.ts`) bundles `debugStore`, `settingsStore`, and the active profile. Every scene reaches it via `this.app` (provided by `BaseScene`).

## Conventions

- One scene per file in `src/scenes/`.
- Game-engine concerns (stores, types, profiles, asset generation) live in `src/game/`.
- Outer DOM/UI lives in `src/shell/`.
- Tests are colocated (`*.test.ts`) and use Vitest.
- TypeScript strict mode; `noUnusedLocals` / `noUnusedParameters` enforced — the build fails on unused declarations.

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

## License

MIT — do whatever you want, attribution appreciated.
