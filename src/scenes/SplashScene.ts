import { SCENE_KEYS } from '../game/types';
import { BaseScene } from './BaseScene';

export class SplashScene extends BaseScene {
  private hasAdvanced = false;

  constructor() {
    super(SCENE_KEYS.Splash);
  }

  create(): void {
    this.markActiveScene(SCENE_KEYS.Splash);

    const camera = this.cameras.main;
    camera.setBackgroundColor(0x020617);

    this.add.rectangle(camera.centerX, camera.centerY, camera.width * 0.7, camera.height * 0.5, 0x0f172a, 0.95);

    this.add
      .text(camera.centerX, camera.centerY - 36, 'VGD PHASER STARTER', {
        color: '#f8fafc',
        fontFamily: 'monospace',
        fontSize: '42px'
      })
      .setOrigin(0.5);

    this.add
      .text(camera.centerX, camera.centerY + 18, 'Reusable Phaser 4 scaffold behind Vite', {
        color: '#94a3b8',
        fontFamily: 'monospace',
        fontSize: '18px'
      })
      .setOrigin(0.5);

    this.createFooterHint('Click, Enter, or Space to skip');

    const advanceToMenu = (): void => {
      if (this.hasAdvanced) {
        return;
      }

      this.hasAdvanced = true;
      this.scene.start(SCENE_KEYS.MainMenu);
    };

    this.time.delayedCall(1600, advanceToMenu);

    this.input.once('pointerup', advanceToMenu);
    this.input.keyboard?.once('keydown-ENTER', advanceToMenu);
    this.input.keyboard?.once('keydown-SPACE', advanceToMenu);
  }
}
