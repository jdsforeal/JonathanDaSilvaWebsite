#!/bin/bash

set -e

echo ""
echo "=============================================="
echo "   JDS — FAVICON HTML INSTALLER"
echo "=============================================="
echo ""
echo "Ce script :"
echo "  • ajoute le favicon dans tous les fichiers .html"
echo "  • calcule automatiquement ../ pour les pages dans projects/"
echo "  • remplace les anciennes balises favicon si elles existent"
echo "  • ne duplique pas les balises"
echo "  • crée une sauvegarde des HTML avant modification"
echo ""

REPO="/Users/jonathandasilva/Desktop/04_SITEWEB/JDS/JonathanDaSilvaWebsite"

if [ ! -d "$REPO" ]; then
  echo "Le dossier habituel du site n'a pas été trouvé."
  echo "Choisis le dossier JonathanDaSilvaWebsite dans la fenêtre suivante."
  REPO=$(osascript -e 'POSIX path of (choose folder with prompt "Choisis le dossier JonathanDaSilvaWebsite")')
  REPO="${REPO%/}"
fi

echo "Site sélectionné :"
echo "$REPO"
echo ""

python3 - "$REPO" <<'PY'
from pathlib import Path
import os
import re
import shutil
import sys
from datetime import datetime

root = Path(sys.argv[1]).resolve()

required_assets = [
    "favicon.ico",
    "svgfavicon-32x32.png",
    "svgapple-touch-icon.png",
    "svgandroid-chrome-192x192.png",
    "svgandroid-chrome-512x512.png",
]

missing = [name for name in required_assets if not (root / name).exists()]
if missing:
    print("ERREUR : il manque à la racine du site :")
    for name in missing:
        print("  -", name)
    print("")
    print("Copie d'abord les 5 fichiers du pack favicon à côté de index.html,")
    print("puis relance ce script.")
    sys.exit(2)

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
backup_root = root.parent / f"JonathanDaSilvaWebsite_HTML_BACKUP_{timestamp}"

html_files = [
    p for p in root.rglob("*.html")
    if ".git" not in p.parts and "node_modules" not in p.parts
]

if not html_files:
    print("Aucun fichier HTML trouvé.")
    sys.exit(3)

for src in html_files:
    rel = src.relative_to(root)
    dst = backup_root / rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)

favicon_link_pattern = re.compile(
    r"[ \t]*<link\b(?=[^>]*\brel\s*=\s*['\"](?:icon|shortcut icon|apple-touch-icon)['\"])[^>]*>\s*",
    re.IGNORECASE | re.DOTALL
)

changed = []
skipped = []

for path in html_files:
    original = path.read_text(encoding="utf-8")
    cleaned = favicon_link_pattern.sub("", original)

    matches = list(re.finditer(r"</head>", cleaned, flags=re.IGNORECASE))
    if not matches:
        skipped.append((path, "pas de </head>"))
        continue

    rel_prefix = Path(os.path.relpath(root, path.parent)).as_posix()
    prefix = "" if rel_prefix == "." else rel_prefix.rstrip("/") + "/"

    block = f'''    <!-- FAVICON -->
    <link rel="icon" type="image/x-icon" href="{prefix}favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="{prefix}svgfavicon-32x32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="{prefix}svgapple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="192x192" href="{prefix}svgandroid-chrome-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="{prefix}svgandroid-chrome-512x512.png">
'''

    m = matches[-1]
    before = cleaned[:m.start()].rstrip()
    after = cleaned[m.start():]

    new_text = before + "\n\n" + block + after

    if new_text != original:
        path.write_text(new_text, encoding="utf-8")
        changed.append(path)

print("")
print("==============================================")
print("TERMINÉ")
print("==============================================")
print(f"Fichiers HTML trouvés : {len(html_files)}")
print(f"Fichiers modifiés     : {len(changed)}")
print(f"Fichiers ignorés      : {len(skipped)}")
print("")
print("Sauvegarde créée ici :")
print(backup_root)
print("")

if skipped:
    print("Fichiers ignorés :")
    for path, reason in skipped:
        print(" -", path.relative_to(root), ":", reason)
    print("")

print("Vérification rapide :")
for path in changed[:12]:
    print(" ✓", path.relative_to(root))
if len(changed) > 12:
    print(f" ... + {len(changed) - 12} autres")
print("")
print("Tu peux maintenant ouvrir le site dans VS Code et vérifier quelques <head>.")
PY

STATUS=$?

echo ""
if [ "$STATUS" -eq 0 ]; then
  echo "Tout est bon 🖤"
  echo ""
  echo "Appuie sur Entrée pour fermer."
else
  echo "Le script s'est arrêté pour éviter de modifier le site."
  echo "Code erreur : $STATUS"
  echo ""
  echo "Appuie sur Entrée pour fermer."
fi

read -r
exit "$STATUS"
