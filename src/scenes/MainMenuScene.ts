import * as Phaser from 'phaser';

import { createTextButton, type TextButton } from '../game/ui';
import { GAME_PROFILES } from '../game/profiles';
import { SCENE_KEYS } from '../game/types';
import { BaseScene } from './BaseScene';

interface MenuOption {
  label: string;
  action: () => void;
}

export class MainMenuScene extends BaseScene {
  private selectedIndex = 0;

  private buttons: TextButton[] = [];

  private options: MenuOption[] = [];

  constructor() {
    super(SCENE_KEYS.MainMenu);
  }

  create(): void {
    this.buttons = [];
    this.selectedIndex = 0;
    this.options = [];

    this.markActiveScene(SCENE_KEYS.MainMenu);
    this.cameras.main.setBackgroundColor(0x020617);
    this.createHeading('Main Menu', 'Framework entry point — extend with your own scenes');

    const profileLabel = GAME_PROFILES[this.app.getProfile()].label;

    this.add
      .text(this.cameras.main.centerX, 136, `Layout: ${profileLabel} • Switch via ?profile=portrait`, {
        color: '#cbd5e1',
        fontFamily: 'monospace',
        fontSize: '18px'
      })
      .setOrigin(0.5);

    this.renderMenu();

    const keyUp = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    const keyDown = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    const keyW = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    const keyS = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    const keyEnter = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    const keySpace = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    keyUp?.on('down', () => this.moveSelection(-1));
    keyW?.on('down', () => this.moveSelection(-1));
    keyDown?.on('down', () => this.moveSelection(1));
    keyS?.on('down', () => this.moveSelection(1));
    keyEnter?.on('down', () => this.options[this.selectedIndex]?.action());
    keySpace?.on('down', () => this.options[this.selectedIndex]?.action());

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.clearButtons();
      this.selectedIndex = 0;
      this.options = [];
    });

    this.createFooterHint('Arrow keys / WASD to navigate • Enter / Space to confirm');
  }

  private moveSelection(direction: number): void {
    const next = Phaser.Math.Wrap(this.selectedIndex + direction, 0, this.buttons.length);
    this.setSelection(next);
  }

  private setSelection(index: number): void {
    this.selectedIndex = index;
    this.buttons.forEach((button, buttonIndex) => {
      button.setSelected(buttonIndex === index);
    });
  }

  private renderMenu(): void {
    this.clearButtons();

    this.options = [
      { label: 'Sandbox', action: () => this.scene.start(SCENE_KEYS.Sandbox) },
      { label: 'Settings', action: () => this.scene.start(SCENE_KEYS.Settings) }
    ];

    const startY = 280;
    const spacing = 88;

    this.options.forEach((option, index) => {
      const button = createTextButton(this, {
        x: this.cameras.main.centerX,
        y: startY + index * spacing,
        width: 360,
        height: 68,
        label: option.label,
        onClick: option.action,
        onHover: () => this.setSelection(index)
      });

      this.buttons.push(button);
    });

    this.setSelection(0);
  }

  private clearButtons(): void {
    this.buttons.forEach((button) => {
      button.destroy();
    });
    this.buttons = [];
  }
}
