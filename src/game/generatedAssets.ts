import * as Phaser from 'phaser';

const UI_BUTTON_SIZE = { width: 320, height: 60 };
const UI_PANEL_SIZE = { width: 520, height: 420 };

function generateRectangleTexture(
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
  fillColor: number,
  strokeColor = 0x0f172a
): void {
  if (scene.textures.exists(key)) {
    return;
  }

  const graphics = scene.add.graphics();

  graphics.fillStyle(fillColor, 1);
  graphics.fillRect(0, 0, width, height);
  graphics.lineStyle(3, strokeColor, 1);
  graphics.strokeRect(1.5, 1.5, width - 3, height - 3);
  graphics.generateTexture(key, width, height);
  graphics.destroy();
}

export function registerGeneratedAssets(scene: Phaser.Scene): void {
  generateRectangleTexture(
    scene,
    'ui-button',
    UI_BUTTON_SIZE.width,
    UI_BUTTON_SIZE.height,
    0x1e293b,
    0x7dd3fc
  );
  generateRectangleTexture(
    scene,
    'ui-button-active',
    UI_BUTTON_SIZE.width,
    UI_BUTTON_SIZE.height,
    0x334155,
    0xf8fafc
  );
  generateRectangleTexture(
    scene,
    'ui-panel',
    UI_PANEL_SIZE.width,
    UI_PANEL_SIZE.height,
    0x111827,
    0x475569
  );
}
