import * as Phaser from 'phaser';

import { getAppContext } from '../game/context';
import type { AppContext } from '../game/context';
import type { SceneKey } from '../game/types';

export abstract class BaseScene extends Phaser.Scene {
  protected get app(): AppContext {
    return getAppContext();
  }

  protected markActiveScene(sceneKey: SceneKey): void {
    this.app.debugStore.patchState({ activeScene: sceneKey });
  }

  protected createHeading(title: string, subtitle: string): void {
    const { centerX } = this.cameras.main;

    this.add
      .text(centerX, 56, title, {
        color: '#f8fafc',
        fontFamily: 'monospace',
        fontSize: '34px'
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, 92, subtitle, {
        color: '#94a3b8',
        fontFamily: 'monospace',
        fontSize: '16px'
      })
      .setOrigin(0.5);
  }

  protected createFooterHint(text: string): void {
    const { centerX, height } = this.cameras.main;

    this.add
      .text(centerX, height - 28, text, {
        color: '#94a3b8',
        fontFamily: 'monospace',
        fontSize: '14px'
      })
      .setOrigin(0.5);
  }

  protected goToMenu(): void {
    this.scene.start('MainMenuScene');
  }
}
