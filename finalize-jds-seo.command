#!/bin/bash

set -e

echo ""
echo "=============================================="
echo "   JDS — FINAL SEO INSTALLER"
echo "=============================================="
echo ""
echo "Ce script :"
echo "  • garde les <title> et meta descriptions propres à chaque page"
echo "  • ajoute une URL canonical correcte à chaque page"
echo "  • synchronise og:title / og:description avec chaque page"
echo "  • ajoute og:url"
echo "  • synchronise Twitter avec chaque page"
echo "  • garde og-image.jpg comme image de partage"
echo "  • évite les doublons"
echo "  • crée une sauvegarde avant toute modification"
echo ""

REPO="/Users/jonathandasilva/Desktop/04_SITEWEB/JDS/JonathanDaSilvaWebsite"
BASE_URL="https://jdsforeal.github.io/JonathanDaSilvaWebsite"
OG_IMAGE_URL="${BASE_URL}/og-image.jpg"

if [ ! -d "$REPO" ]; then
  echo "Le dossier habituel du site n'a pas été trouvé."
  echo "Choisis le dossier JonathanDaSilvaWebsite dans la fenêtre suivante."
  REPO=$(osascript -e 'POSIX path of (choose folder with prompt "Choisis le dossier JonathanDaSilvaWebsite")')
  REPO="${REPO%/}"
fi

if [ ! -f "$REPO/og-image.jpg" ]; then
  echo ""
  echo "ERREUR : og-image.jpg n'est pas à la racine du site."
  echo "Place og-image.jpg à côté de index.html puis relance."
  echo ""
  read -r
  exit 2
fi

python3 - "$REPO" "$BASE_URL" "$OG_IMAGE_URL" <<'PY'
from pathlib import Path
import html
import re
import shutil
import sys
from datetime import datetime

root = Path(sys.argv[1]).resolve()
base_url = sys.argv[2].rstrip("/")
og_image_url = sys.argv[3]

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
backup_root = root.parent / f"JonathanDaSilvaWebsite_SEO_BACKUP_{timestamp}"

html_files = sorted(
    p for p in root.rglob("*.html")
    if ".git" not in p.parts and "node_modules" not in p.parts
)

if not html_files:
    print("Aucun fichier HTML trouvé.")
    sys.exit(3)

def attr_escape(value):
    return html.escape(value, quote=True)

def get_title(text):
    m = re.search(r"<title\b[^>]*>(.*?)</title>", text, re.I | re.S)
    if not m:
        return "Jonathan Da Silva — Director of Photography"
    value = re.sub(r"\s+", " ", m.group(1)).strip()
    return html.unescape(value) or "Jonathan Da Silva — Director of Photography"

def get_description(text):
    patterns = [
        r'<meta\b(?=[^>]*\bname\s*=\s*["\']description["\'])[^>]*\bcontent\s*=\s*["\']([^"\']*)["\'][^>]*>',
        r'<meta\b(?=[^>]*\bcontent\s*=\s*["\']([^"\']*)["\'])[^>]*\bname\s*=\s*["\']description["\'][^>]*>',
    ]
    for pattern in patterns:
        m = re.search(pattern, text, re.I | re.S)
        if m:
            value = re.sub(r"\s+", " ", m.group(1)).strip()
            if value:
                return html.unescape(value)
    return (
        "Jonathan Da Silva — Belgian cinematographer and Director of Photography "
        "based between Brussels and Paris."
    )

def remove_meta(text, *, name=None, prop=None):
    if name:
        pattern = (
            r'\s*<meta\b(?=[^>]*\bname\s*=\s*["\']'
            + re.escape(name)
            + r'["\'])[^>]*>\s*'
        )
    else:
        pattern = (
            r'\s*<meta\b(?=[^>]*\bproperty\s*=\s*["\']'
            + re.escape(prop)
            + r'["\'])[^>]*>\s*'
        )
    return re.sub(pattern, "\n", text, flags=re.I | re.S)

def remove_canonical(text):
    pattern = r'\s*<link\b(?=[^>]*\brel\s*=\s*["\']canonical["\'])[^>]*>\s*'
    return re.sub(pattern, "\n", text, flags=re.I | re.S)

changed = []
skipped = []

for path in html_files:
    original = path.read_text(encoding="utf-8")

    if not re.search(r"</head>", original, re.I):
        skipped.append((path, "pas de </head>"))
        continue

    title = get_title(original)
    description = get_description(original)

    rel = path.relative_to(root).as_posix()

    if rel == "index.html":
        canonical = base_url + "/"
    else:
        canonical = base_url + "/" + rel

    cleaned = original

    # Remove only tags this installer owns.
    cleaned = remove_canonical(cleaned)

    for prop in ["og:title", "og:description", "og:image", "og:type", "og:url"]:
        cleaned = remove_meta(cleaned, prop=prop)

    for name in [
        "twitter:card",
        "twitter:title",
        "twitter:description",
        "twitter:image",
    ]:
        cleaned = remove_meta(cleaned, name=name)

    # Add robots only if there isn't one already.
    has_robots = bool(
        re.search(
            r'<meta\b(?=[^>]*\bname\s*=\s*["\']robots["\'])[^>]*>',
            cleaned,
            re.I | re.S,
        )
    )

    block_lines = [
        "    <!-- FINAL SEO / SOCIAL -->",
        f'    <link rel="canonical" href="{attr_escape(canonical)}">',
    ]

    if not has_robots:
        block_lines.append(
            '    <meta name="robots" content="index, follow, max-image-preview:large">'
        )

    block_lines.extend(
        [
            f'    <meta property="og:title" content="{attr_escape(title)}">',
            f'    <meta property="og:description" content="{attr_escape(description)}">',
            f'    <meta property="og:image" content="{attr_escape(og_image_url)}">',
            f'    <meta property="og:url" content="{attr_escape(canonical)}">',
            '    <meta property="og:type" content="website">',
            "",
            '    <meta name="twitter:card" content="summary_large_image">',
            f'    <meta name="twitter:title" content="{attr_escape(title)}">',
            f'    <meta name="twitter:description" content="{attr_escape(description)}">',
            f'    <meta name="twitter:image" content="{attr_escape(og_image_url)}">',
        ]
    )

    block = "\n".join(block_lines)

    # Tidy excessive blank lines caused by removed tags.
    cleaned = re.sub(r"\n[ \t]*\n[ \t]*\n+", "\n\n", cleaned)

    matches = list(re.finditer(r"</head>", cleaned, re.I))
    if not matches:
        skipped.append((path, "pas de </head> après nettoyage"))
        continue

    m = matches[-1]
    before = cleaned[:m.start()].rstrip()
    after = cleaned[m.start():]
    new_text = before + "\n\n" + block + "\n" + after

    if new_text != original:
        backup_path = backup_root / path.relative_to(root)
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, backup_path)
        path.write_text(new_text, encoding="utf-8")
        changed.append((path, canonical, title))

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
print("Vérification rapide :")
for path, canonical, title in changed[:12]:
    print(" ✓", path.relative_to(root))
    print("    canonical :", canonical)
if len(changed) > 12:
    print(f" ... + {len(changed) - 12} autres")
print("")

if skipped:
    print("Fichiers ignorés :")
    for path, reason in skipped:
        print(" -", path.relative_to(root), ":", reason)
    print("")

print("Le script a conservé les <title> et descriptions existants de chaque page.")
print("Les balises sociales utilisent maintenant ces valeurs page par page.")
PY

STATUS=$?

echo ""
if [ "$STATUS" -eq 0 ]; then
  echo "Tout est bon 🖤"
  echo ""
  echo "Appuie sur Entrée pour fermer."
else
  echo "Le script s'est arrêté pour éviter une modification incomplète."
  echo "Code erreur : $STATUS"
  echo ""
  echo "Appuie sur Entrée pour fermer."
fi

read -r
exit "$STATUS"
