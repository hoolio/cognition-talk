#!/usr/bin/env bash
# odt-to-md.sh — convert an .odt under .lo-edits/ back to its source .md.
#
# Usage:
#   bash scripts/odt-to-md.sh .lo-edits/content/memo/industrialization-of-cognition.odt
#   npm run edit:back -- .lo-edits/content/memo/industrialization-of-cognition.odt
set -euo pipefail

if ! command -v pandoc >/dev/null 2>&1; then
  echo "error: pandoc not found. install with: brew install pandoc" >&2
  exit 1
fi

if [[ $# -eq 0 ]]; then
  echo "usage: $0 <path/to/file.odt>" >&2
  exit 1
fi

src="$1"
if [[ ! -f "$src" ]]; then
  echo "error: no such file: $src" >&2
  exit 1
fi
case "$src" in
  *.odt) ;;
  *) echo "error: expected a .odt file, got: $src" >&2; exit 1;;
esac

# Map .lo-edits/<rel>.odt back to <rel>.md.
rel="${src#.lo-edits/}"
rel="${rel%.odt}"
out="${rel}.md"

mkdir -p "$(dirname "$out")"
pandoc --from=odt --to=gfm --wrap=preserve "$src" --output="$out"
echo "wrote: $out"
