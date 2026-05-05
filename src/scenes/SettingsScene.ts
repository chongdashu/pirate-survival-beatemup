import * as Phaser from 'phaser';

import { createTextButton, type TextButton } from '../game/ui';
import { DEFAULT_SETTINGS } from '../game/settings';
import { SCENE_KEYS } from '../game/types';
import { BaseScene } from './BaseScene';

export class SettingsScene extends BaseScene {
  private volumeValue!: Phaser.GameObjects.Text;

  private muteValue!: Phaser.GameObjects.Text;

  private volumeDownButton!: TextButton;

  private volumeUpButton!: TextButton;

  private muteButton!: TextButton;

  private resetButton!: TextButton;

  private backButton!: TextButton;

  private selectedRow = 0;

  constructor() {
    super(SCENE_KEYS.Settings);
  }

  create(): void {
    this.markActiveScene(SCENE_KEYS.Settings);
    this.cameras.main.setBackgroundColor(0x020617);
    this.createHeading('Settings', 'Player-facing runtime preferences persisted through localStorage');

    const centerX = this.cameras.main.centerX;
    const camera = this.cameras.main;
    const panel = this.add.image(centerX, camera.centerY, 'ui-panel');
    panel.setDisplaySize(520, 420);

    const valueStyle = {
      color: '#cbd5e1',
      fontFamily: 'monospace',
      fontSize: '24px'
    };

    this.volumeValue = this.add.text(centerX, 220, '', valueStyle).setOrigin(0.5);
    this.muteValue = this.add.text(centerX, 260, '', valueStyle).setOrigin(0.5);

    const buttonY = [330, 400, 470, 540];
    const wideButtonWidth = 320;
    const halfButtonWidth = 150;
    const buttonHeight = 58;

    this.volumeDownButton = createTextButton(this, {
      x: centerX - 85,
      y: buttonY[0],
      width: halfButtonWidth,
      height: buttonHeight,
      label: 'Volume -',
      onClick: () => this.changeVolume(-0.1),
      onHover: () => this.setSelection(0)
    });

    this.volumeUpButton = createTextButton(this, {
      x: centerX + 85,
      y: buttonY[0],
      width: halfButtonWidth,
      height: buttonHeight,
      label: 'Volume +',
      onClick: () => this.changeVolume(0.1),
      onHover: () => this.setSelection(0)
    });

    this.muteButton = createTextButton(this, {
      x: centerX,
      y: buttonY[1],
      width: wideButtonWidth,
      height: buttonHeight,
      label: 'Toggle mute',
      onClick: () => this.toggleMute(),
      onHover: () => this.setSelection(1)
    });

    this.resetButton = createTextButton(this, {
      x: centerX,
      y: buttonY[2],
      width: wideButtonWidth,
      height: buttonHeight,
      label: 'Reset defaults',
      onClick: () => this.app.settingsStore.setState(DEFAULT_SETTINGS),
      onHover: () => this.setSelection(2)
    });

    this.backButton = createTextButton(this, {
      x: centerX,
      y: buttonY[3],
      width: wideButtonWidth,
      height: buttonHeight,
      label: 'Back to menu',
      onClick: () => this.goToMenu(),
      onHover: () => this.setSelection(3)
    });

    this.setSelection(0);

    this.input.keyboard?.on('keydown-UP', () => this.moveSelection(-1));
    this.input.keyboard?.on('keydown-W', () => this.moveSelection(-1));
    this.input.keyboard?.on('keydown-DOWN', () => this.moveSelection(1));
    this.input.keyboard?.on('keydown-S', () => this.moveSelection(1));
    this.input.keyboard?.on('keydown-LEFT', () => this.handleLeft());
    this.input.keyboard?.on('keydown-RIGHT', () => this.handleRight());
    this.input.keyboard?.on('keydown-ESC', () => this.goToMenu());
    this.input.keyboard?.on('keydown-ENTER', () => this.activateSelection());
    this.input.keyboard?.on('keydown-SPACE', () => this.activateSelection());

    const unsubscribe = this.app.settingsStore.subscribe((settings) => {
      this.volumeValue.setText(`Volume: ${Math.round(settings.volume * 100)}%`);
      this.muteValue.setText(`Mute: ${settings.muted ? 'On' : 'Off'}`);
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, unsubscribe);

    this.createFooterHint('Up/Down select • Left/Right adjust • Enter/Space select • Esc back');
  }

  private changeVolume(delta: number): void {
    const current = this.app.settingsStore.getState();
    const nextVolume = Math.max(0, Math.min(1, current.volume + delta));

    this.app.settingsStore.patchState({ volume: Number(nextVolume.toFixed(2)) });
  }

  private toggleMute(): void {
    const settings = this.app.settingsStore.getState();
    this.app.settingsStore.patchState({ muted: !settings.muted });
  }

  private moveSelection(direction: number): void {
    const nextIndex = Phaser.Math.Wrap(this.selectedRow + direction, 0, 4);
    this.setSelection(nextIndex);
  }

  private setSelection(index: number): void {
    this.selectedRow = index;
    this.volumeDownButton.setSelected(index === 0);
    this.volumeUpButton.setSelected(index === 0);
    this.muteButton.setSelected(index === 1);
    this.resetButton.setSelected(index === 2);
    this.backButton.setSelected(index === 3);
  }

  private activateSelection(): void {
    if (this.selectedRow === 1) {
      this.toggleMute();
      return;
    }

    if (this.selectedRow === 2) {
      this.app.settingsStore.setState(DEFAULT_SETTINGS);
      return;
    }

    if (this.selectedRow === 3) {
      this.goToMenu();
    }
  }

  private handleLeft(): void {
    if (this.selectedRow === 0) {
      this.changeVolume(-0.1);
      return;
    }

    if (this.selectedRow === 1) {
      this.toggleMute();
    }
  }

  private handleRight(): void {
    if (this.selectedRow === 0) {
      this.changeVolume(0.1);
      return;
    }

    if (this.selectedRow === 1) {
      this.toggleMute();
    }
  }
}
