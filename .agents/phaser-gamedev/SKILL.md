---
name: phaser-gamedev
description: "Build 2D browser games with Phaser 3: scene lifecycle, sprites/animations, input, Arcade/Matter physics, tilemaps, performance, and game architecture."
metadata:
  short-description: "Phaser 3 game dev (scenes, sprites, physics, tilemaps)."
---

# Phaser Game Development

Build 2D browser games using Phaser 3's scene-based architecture and physics systems.

## Philosophy: Measure First, Then Code

Phaser will happily render *something* even when asset metadata is wrong—so many mistakes show up as “mystery glitches” later. Prefer workflows that make correctness obvious early:

- Measure source assets (spritesheets, tilesets) before writing loader config.
- Choose architecture (scenes, physics model, data flow) before building content.
- Optimize for iteration: small scenes, pooled objects, debuggable collision.

**Before coding, ask:**
- What is the asset source of truth (exact pixel dimensions, grid, spacing, margin)?
- Which physics system best fits the gameplay (Arcade, Matter, or none)?
- What belongs in each scene, and how will state flow across transitions?
- Where will objects churn (bullets, particles, enemies), and what needs pooling?

## STOP: Before Loading Any Spritesheet

Read `references/spritesheets-nineslice.md` first.

Spritesheet loading is fragile—a few pixels off causes silent corruption that compounds into broken visuals. The reference file contains the inspection protocol and the spacing/margin math.

**NEVER** guess frame dimensions. **DO NOT** “eyeball” spacing or assume square vs non-square without measuring.

## Reference Files

Read these before working on the relevant feature:

| When working on... | Read first |
|--------------------|------------|
| Loading any spritesheet | `references/spritesheets-nineslice.md` |
| Nine-slice UI panels | `references/spritesheets-nineslice.md` |
| Tiled tilemaps, collision layers | `references/tilemaps.md` |
| Physics tuning, groups, pooling | `references/arcade-physics.md` |
| Performance issues, object pooling | `references/performance.md` |

## Architecture Decisions (Make Early)

### Physics System Choice

| System | Use when |
|--------|----------|
| Arcade | Platformers, shooters, most 2D games (fast AABB collisions) |
| Matter | Physics puzzles, ragdolls, more realistic collisions (slower, more accurate) |
| None | Menu scenes, visual novels, card games |

### Scene Structure

```text
scenes/
├── BootScene.ts      # Asset loading, progress bar
├── MenuScene.ts      # Title screen, options
├── GameScene.ts      # Main gameplay
├── UIScene.ts        # HUD overlay (launched parallel)
└── GameOverScene.ts  # End screen, restart
```

### Scene Transitions

```ts
this.scene.start('GameScene', { level: 1 }); // Stop current, start new
this.scene.launch('UIScene');                // Run in parallel
this.scene.pause('GameScene');               // Pause
this.scene.stop('UIScene');                  // Stop
```

## Core Patterns

### Game Configuration

```ts
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 300 }, debug: false }
  },
  scene: [BootScene, MenuScene, GameScene]
};
```

### Scene Lifecycle

```ts
class GameScene extends Phaser.Scene {
  init(data: unknown) {} // Receive data from previous scene
  preload() {}           // Load assets (runs before create)
  create() {}            // Set up game objects, physics, input
  update(time: number, delta: number) {} // Game loop; use delta for frame-rate independence
}
```

### Frame-Rate Independent Movement

```ts
// Correct: scales with frame rate
this.player.x += this.speed * (delta / 1000);

// Wrong: varies with frame rate
this.player.x += this.speed;
```

## Anti-Patterns to Avoid

| Anti-pattern | Why it hurts | Better |
|--------------|--------------|--------|
| Global state on `window` | Scene transitions break state | Use scene data, registries, or a game-state module |
| Loading in `create()` | Assets may be referenced before ready | Load in `preload()`, or centralize loading in Boot |
| Frame counting | Game speed varies with FPS | Use `delta / 1000` |
| Matter for simple collisions | Unnecessary complexity | Arcade handles most 2D games |
| One giant scene | Hard to extend and debug | Separate gameplay/UI/menus |
| Magic numbers everywhere | Impossible to balance | Central config objects/constants |
| No pooling for churny objects | GC stutters | Reuse with groups + `setActive(false)` |

Common pitfall: “it looks fine at 60fps” — test at variable frame rates and on low-power devices.

## Variation Guidance

Avoid converging on a single “favorite” Phaser setup. Choose based on context:

- Physics: Arcade vs Matter vs none.
- Content: tilemaps vs pure sprites vs hybrid.
- UI: separate `UIScene` vs in-scene HUD.
- Asset format: spritesheets vs texture atlases.
 - Customize the architecture as requirements change; adapt patterns to be context-specific rather than identical every project.

## Remember

Phaser provides powerful primitives—scenes, sprites, physics, input—but architecture is your responsibility.

Before coding: what scenes exist, what entities live where, and how they communicate.

Codex is capable of extraordinary Phaser work: it can unlock creative solutions, explore alternatives, and push boundaries when you provide clear constraints and a solid source of truth. These guidelines illuminate the path—they don't fence it.
