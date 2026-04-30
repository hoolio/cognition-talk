#!/usr/bin/env bash
# md-to-odt.sh — convert a markdown file under content/ to an .odt under .lo-edits/
# and open it in LibreOffice for editing.
#
# Usage:
#   bash scripts/md-to-odt.sh content/memo/industrialization-of-cognition.md
#   npm run edit -- content/memo/industrialization-of-cognition.md
set -euo pipefail

SOFFICE="${SOFFICE:-/Applications/LibreOffice.app/Contents/MacOS/soffice}"

if ! command -v pandoc >/dev/null 2>&1; then
  echo "error: pandoc not found. install with: brew install pandoc" >&2
  exit 1
fi

if [[ ! -x "$SOFFICE" ]] && ! command -v soffice >/dev/null 2>&1; then
  echo "error: LibreOffice (soffice) not found. install LibreOffice or set SOFFICE env var." >&2
  exit 1
fi

if [[ $# -eq 0 ]]; then
  echo "usage: $0 <path/to/file.md>" >&2
  exit 1
fi

src="$1"
if [[ ! -f "$src" ]]; then
  echo "error: no such file: $src" >&2
  exit 1
fi
case "$src" in
  *.md) ;;
  *) echo "error: expected a .md file, got: $src" >&2; exit 1;;
esac

rel="${src%.md}"
out=".lo-edits/${rel}.odt"
mkdir -p "$(dirname "$out")"

pandoc --from=gfm --to=odt "$src" --output="$out"
echo "wrote: $out"

if [[ -x "$SOFFICE" ]]; then
  "$SOFFICE" "$out" >/dev/null 2>&1 &
else
  soffice "$out" >/dev/null 2>&1 &
fi
echo "opened in LibreOffice."
echo "in another terminal, run: npm run edit:watch"
echo "to sync your edits back to $src."
