#!/bin/bash

set -e

echo ""
echo "=============================================="
echo "   JDS — INDEXING / SITEMAP FINALIZER"
echo "=============================================="
echo ""
echo "Ce script :"
echo "  • met le template projet en noindex / nofollow"
echo "  • crée sitemap.xml avec toutes les vraies pages"
echo "  • exclut _project-template.html du sitemap"
echo "  • crée robots.txt"
echo "  • crée une sauvegarde avant modification"
echo ""

REPO="/Users/jonathandasilva/Desktop/04_SITEWEB/JDS/JonathanDaSilvaWebsite"
BASE_URL="https://jdsforeal.github.io/JonathanDaSilvaWebsite"

if [ ! -d "$REPO" ]; then
  echo "Le dossier habituel du site n'a pas été trouvé."
  echo "Choisis le dossier JonathanDaSilvaWebsite dans la fenêtre suivante."
  REPO=$(osascript -e 'POSIX path of (choose folder with prompt "Choisis le dossier JonathanDaSilvaWebsite")')
  REPO="${REPO%/}"
fi

python3 - "$REPO" "$BASE_URL" <<'PY'
from pathlib import Path
import re
import shutil
import sys
from datetime import datetime
from xml.sax.saxutils import escape

root = Path(sys.argv[1]).resolve()
base_url = sys.argv[2].rstrip("/")

template = root / "projects" / "_project-template.html"
robots_path = root / "robots.txt"
sitemap_path = root / "sitemap.xml"

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
backup_root = root.parent / f"JonathanDaSilvaWebsite_INDEXING_BACKUP_{timestamp}"
backup_root.mkdir(parents=True, exist_ok=True)

def backup_if_exists(path):
    if path.exists():
        rel = path.relative_to(root)
        dst = backup_root / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, dst)

backup_if_exists(template)
backup_if_exists(robots_path)
backup_if_exists(sitemap_path)

# ---------------------------------------------------------
# 1) NOINDEX TEMPLATE
# ---------------------------------------------------------
template_changed = False

if template.exists():
    text = template.read_text(encoding="utf-8")

    # Remove any existing robots meta so we keep only one.
    text = re.sub(
        r'\s*<meta\b(?=[^>]*\bname\s*=\s*["\']robots["\'])[^>]*>\s*',
        "\n",
        text,
        flags=re.I | re.S,
    )

    # The template should not advertise itself as a canonical real page.
    text = re.sub(
        r'\s*<link\b(?=[^>]*\brel\s*=\s*["\']canonical["\'])[^>]*>\s*',
        "\n",
        text,
        flags=re.I | re.S,
    )

    # Remove og:url for the same reason.
    text = re.sub(
        r'\s*<meta\b(?=[^>]*\bproperty\s*=\s*["\']og:url["\'])[^>]*>\s*',
        "\n",
        text,
        flags=re.I | re.S,
    )

    matches = list(re.finditer(r"</head>", text, re.I))
    if not matches:
        raise RuntimeError("Le template existe mais ne contient pas </head>.")

    block = (
        '    <!-- TEMPLATE: NEVER INDEX -->\n'
        '    <meta name="robots" content="noindex, nofollow, noarchive">\n'
    )

    text = re.sub(r"\n[ \t]*\n[ \t]*\n+", "\n\n", text)

    m = matches[-1]
    before = text[:m.start()].rstrip()
    after = text[m.start():]
    new_text = before + "\n\n" + block + after

    template.write_text(new_text, encoding="utf-8")
    template_changed = True

# ---------------------------------------------------------
# 2) SITEMAP
# ---------------------------------------------------------
html_files = sorted(
    p for p in root.rglob("*.html")
    if ".git" not in p.parts
    and "node_modules" not in p.parts
    and not p.name.startswith("_")
)

urls = []

for path in html_files:
    rel = path.relative_to(root).as_posix()

    if rel == "index.html":
        url = base_url + "/"
    else:
        url = base_url + "/" + rel

    urls.append(url)

sitemap_lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
]

for url in urls:
    sitemap_lines.extend([
        "  <url>",
        f"    <loc>{escape(url)}</loc>",
        "  </url>",
    ])

sitemap_lines.append("</urlset>")
sitemap_path.write_text("\n".join(sitemap_lines) + "\n", encoding="utf-8")

# ---------------------------------------------------------
# 3) ROBOTS.TXT
# ---------------------------------------------------------
robots_text = f"""User-agent: *
Allow: /
Disallow: /JonathanDaSilvaWebsite/projects/_project-template.html

Sitemap: {base_url}/sitemap.xml
"""

robots_path.write_text(robots_text, encoding="utf-8")

# ---------------------------------------------------------
# SUMMARY / VALIDATION
# ---------------------------------------------------------
print("")
print("==============================================")
print("TERMINÉ")
print("==============================================")
print(f"Pages HTML réelles dans le sitemap : {len(urls)}")
print(f"Template noindex appliqué          : {'OUI' if template_changed else 'NON (template absent)'}")
print(f"sitemap.xml créé                   : OUI")
print(f"robots.txt créé                    : OUI")
print("")
print("Sauvegarde créée ici :")
print(backup_root)
print("")
print("Premières URLs du sitemap :")
for url in urls[:10]:
    print(" ✓", url)
if len(urls) > 10:
    print(f" ... + {len(urls) - 10} autres")
print("")
print("Vérification robots.txt :")
print(robots_text)
print("Tout est bon 🖤")
PY

STATUS=$?

echo ""
if [ "$STATUS" -eq 0 ]; then
  echo "Appuie sur Entrée pour fermer."
else
  echo "Le script s'est arrêté pour éviter une modification incomplète."
  echo "Code erreur : $STATUS"
  echo ""
  echo "Appuie sur Entrée pour fermer."
fi

read -r
exit "$STATUS"
