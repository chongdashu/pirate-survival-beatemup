# Lobit Characters

Game-facing fixed-grid Spriterrific exports.

| Character | Manifest | Review |
|---|---|---|
| Pirate | [pirate/character.json](pirate/character.json) | [pirate](pirate/index.md) |
| Skeleton | [skeleton/character.json](skeleton/character.json) | [skeleton](skeleton/index.md) |

Each promoted animation is exported as one transparent PNG spritesheet plus a per-animation manifest:

```text
animations/<direction>/<action>/spritesheet.png
animations/<direction>/<action>/preview.gif
animations/<direction>/<action>/manifest.json
```

Runtime format: `256x256` cells, 5 columns, transparent PNG spritesheets. Promoted animations are finalized with `spriterrific finalize-runtime` so grounded actions share a consistent bottom anchor.
