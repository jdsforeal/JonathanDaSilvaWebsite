#!/bin/bash

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

SITE_URL="https://jdsforeal.github.io/JonathanDaSilvaWebsite/og-image.jpg"
TITLE="Jonathan Da Silva — Director of Photography"
DESCRIPTION="Portfolio of Jonathan Da Silva, Belgian cinematographer working across fiction, music videos and commercials."

TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_DIR="${ROOT_DIR}_OG_BACKUP_${TIMESTAMP}"
mkdir -p "$BACKUP_DIR"

HTML_FILES=()
while IFS= read -r -d '' file; do
  HTML_FILES+=("$file")
done < <(find "$ROOT_DIR" -type f -name "*.html" -print0)

TOTAL_FOUND=${#HTML_FILES[@]}
MODIFIED_COUNT=0
IGNORED_COUNT=0

python3 - "$ROOT_DIR" "$BACKUP_DIR" "$SITE_URL" "$TITLE" "$DESCRIPTION" "${HTML_FILES[@]}" <<'PY'
import os
import re
import shutil
import sys
from pathlib import Path

root = Path(sys.argv[1])
backup_dir = Path(sys.argv[2])
og_image = sys.argv[3]
title = sys.argv[4]
description = sys.argv[5]
files = [Path(p) for p in sys.argv[6:]]

meta_block = f'''<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:image" content="{og_image}">
<meta property="og:type" content="website">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{og_image}">'''

patterns_to_remove = [
    r'\s*<meta\s+property="og:title"[^>]*>\s*',
    r'\s*<meta\s+property="og:description"[^>]*>\s*',
    r'\s*<meta\s+property="og:image"[^>]*>\s*',
    r'\s*<meta\s+property="og:type"[^>]*>\s*',
    r'\s*<meta\s+name="twitter:card"[^>]*>\s*',
    r'\s*<meta\s+name="twitter:title"[^>]*>\s*',
    r'\s*<meta\s+name="twitter:description"[^>]*>\s*',
    r'\s*<meta\s+name="twitter:image"[^>]*>\s*',
]

modified = []
ignored = []

for file_path in files:
    try:
        content = file_path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        content = file_path.read_text(encoding='latin-1')

    if '</head>' not in content.lower():
        ignored.append(str(file_path))
        continue

    original = content

    for pattern in patterns_to_remove:
        content = re.sub(pattern, '\n', content, flags=re.IGNORECASE)

    content = re.sub(r'\n{3,}', '\n\n', content)

    head_close_match = re.search(r'</head>', content, flags=re.IGNORECASE)
    if not head_close_match:
        ignored.append(str(file_path))
        continue

    insert_pos = head_close_match.start()
    before = content[:insert_pos].rstrip()
    after = content[insert_pos:]
    new_content = before + '\n\n' + meta_block + '\n\n' + after

    if new_content != original:
        rel_path = file_path.relative_to(root)
        backup_path = backup_dir / rel_path
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(file_path, backup_path)
        file_path.write_text(new_content, encoding='utf-8')
        modified.append(str(rel_path))
    else:
        ignored.append(str(file_path.relative_to(root)))

print('___RESULTS___')
print(f'MODIFIED::{len(modified)}')
for item in modified:
    print(f'FILE::{item}')
print(f'IGNORED::{len(ignored)}')
for item in ignored:
    print(f'IGNORE::{item}')
PY

RESULTS=$(python3 - "$ROOT_DIR" <<'PY'
from pathlib import Path
root = Path('.')
print('ok')
PY
)

# Recompute counts from actual backup contents / file list for display
if [ -d "$BACKUP_DIR" ]; then
  MODIFIED_COUNT=$(find "$BACKUP_DIR" -type f -name "*.html" | wc -l | tr -d ' ')
else
  MODIFIED_COUNT=0
fi

IGNORED_COUNT=$((TOTAL_FOUND - MODIFIED_COUNT))

echo "=============================================="
echo
echo "TERMINÉ"
echo
echo "=============================================="
echo
echo "Fichiers HTML trouvés : $TOTAL_FOUND"
echo "Fichiers modifiés     : $MODIFIED_COUNT"
echo "Fichiers ignorés      : $IGNORED_COUNT"
echo
echo "Sauvegarde créée ici :"
echo
printf '%s\n' "$BACKUP_DIR"
echo
echo "Vérification rapide :"
echo
for file in \
  profile.html \
  index.html \
  contact.html \
  full-credits.html \
  commercials.html \
  music-videos.html \
  films.html \
  showreel.html \
  portfolio.html; do
  if [ -f "$ROOT_DIR/$file" ]; then
    if grep -q 'property="og:title"' "$ROOT_DIR/$file"; then
      echo "  ✓ $file"
    else
      echo "  ✗ $file"
    fi
  fi
done

echo
echo "Tu peux maintenant ouvrir le site dans VS Code et vérifier quelques <head>."
echo "Tout est bon 🖤"
echo
read -p "Appuie sur Entrée pour fermer."
