#!/usr/bin/env bash
set -euo pipefail

SRC="$HOME/Projects/spriterrific/public/assets/characters/lobit/"
DEST="$(dirname "$0")/../public/assets/lobit/"

if [ ! -d "$SRC" ]; then
  echo "Source not found: $SRC"
  exit 1
fi

mkdir -p "$DEST"
rsync -av --delete "$SRC" "$DEST"
echo "Synced lobit assets from $SRC → $DEST"
