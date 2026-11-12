#!/usr/bin/env bash
# Renders og-image.html to public/og/kurstadttattoo-og-{de,en}.png (1200 x 630) with headless Chrome,
# one card per locale. Run locally after changing the design or the facts on the card; the PNGs are
# committed. Needs node_modules (fonts) and Google Chrome (or CHROME=/path/to/chrome).
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
root="$(cd "$here/../.." && pwd)"
chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
mkdir -p "$root/public/og"

for lang in de en; do
  out="$root/public/og/kurstadttattoo-og-$lang.png"
  "$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --allow-file-access-from-files --virtual-time-budget=3000 \
    --window-size=1200,630 --screenshot="$out" "file://$here/og-image.html?lang=$lang"
  sips -g pixelWidth -g pixelHeight "$out"
done
