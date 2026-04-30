#!/usr/bin/env bash
# watch-odt.sh — watch .lo-edits/ for .odt changes and sync each back to its .md source.
# Uses fswatch when available, falls back to a 2s polling loop.
#
# Usage:
#   bash scripts/watch-odt.sh
#   npm run edit:watch
set -euo pipefail

if ! command -v pandoc >/dev/null 2>&1; then
  echo "error: pandoc not found. install with: brew install pandoc" >&2
  exit 1
fi

watchdir=".lo-edits"
mkdir -p "$watchdir"

sync_one() {
  local odt="$1"
  case "$(basename "$odt")" in
    .~lock.*) return 0;;  # LibreOffice lock file
  esac
  bash scripts/odt-to-md.sh "$odt" || echo "  sync failed for $odt"
}

if command -v fswatch >/dev/null 2>&1; then
  echo "watching $watchdir with fswatch (Ctrl-C to stop)..."
  fswatch -0 --event Updated --event Created "$watchdir" \
    | while IFS= read -r -d "" file; do
        [[ "$file" == *.odt ]] || continue
        [[ -f "$file" ]] || continue
        echo "[sync] $file"
        sync_one "$file"
      done
else
  echo "watching $watchdir by polling every 2s (install fswatch for instant sync)..."
  while true; do
    while IFS= read -r -d $'\0' odt; do
      rel="${odt#.lo-edits/}"; rel="${rel%.odt}"
      md="${rel}.md"
      if [[ ! -f "$md" ]] || [[ "$odt" -nt "$md" ]]; then
        echo "[sync] $odt"
        sync_one "$odt"
      fi
    done < <(find "$watchdir" -name "*.odt" -print0 2>/dev/null)
    sleep 2
  done
fi
