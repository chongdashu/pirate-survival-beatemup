import * as Phaser from 'phaser';

import { SCENE_KEYS } from '../game/types';
import { BaseScene } from './BaseScene';

const PLAYER_SPEED = 240;

export class SandboxScene extends BaseScene {
  private player!: Phaser.GameObjects.Rectangle;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  private worldBoundsRect?: Phaser.GameObjects.Rectangle;

  constructor() {
    super(SCENE_KEYS.Sandbox);
  }

  create(): void {
    this.markActiveScene(SCENE_KEYS.Sandbox);
    this.cameras.main.setBackgroundColor(0x020617);
    this.createHeading('Sandbox', 'Replace this scene with your own gameplay');

    const camera = this.cameras.main;
    this.player = this.add.rectangle(camera.centerX, camera.centerY, 48, 48, 0x7dd3fc);
    this.player.setStrokeStyle(2, 0xf8fafc);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', () => {
      this.scene.start(SCENE_KEYS.MainMenu);
    });

    this.createFooterHint('WASD or arrow keys to move • ESC to return to menu');
  }

  update(_time: number, delta: number): void {
    const state = this.app.debugStore.getState();
    const dt = delta / 1000;

    const inputSnapshot = {
      up: this.cursors.up?.isDown || this.wasd.up.isDown,
      down: this.cursors.down?.isDown || this.wasd.down.isDown,
      left: this.cursors.left?.isDown || this.wasd.left.isDown,
      right: this.cursors.right?.isDown || this.wasd.right.isDown,
      pointerDown: this.input.activePointer.isDown
    };

    this.app.debugStore.patchState({
      pointer: { x: this.input.activePointer.x, y: this.input.activePointer.y },
      input: inputSnapshot
    });

    if (!state.paused) {
      const dx =
        (inputSnapshot.left ? -1 : 0) + (inputSnapshot.right ? 1 : 0);
      const dy =
        (inputSnapshot.up ? -1 : 0) + (inputSnapshot.down ? 1 : 0);

      this.player.x = Phaser.Math.Clamp(
        this.player.x + dx * PLAYER_SPEED * dt,
        this.player.width / 2,
        this.cameras.main.width - this.player.width / 2
      );
      this.player.y = Phaser.Math.Clamp(
        this.player.y + dy * PLAYER_SPEED * dt,
        this.player.height / 2,
        this.cameras.main.height - this.player.height / 2
      );
    }

    if (state.showWorldBounds && !this.worldBoundsRect) {
      this.worldBoundsRect = this.add
        .rectangle(0, 0, this.cameras.main.width, this.cameras.main.height)
        .setOrigin(0, 0)
        .setStrokeStyle(2, 0xf43f5e);
    } else if (!state.showWorldBounds && this.worldBoundsRect) {
      this.worldBoundsRect.destroy();
      this.worldBoundsRect = undefined;
    }
  }
}
