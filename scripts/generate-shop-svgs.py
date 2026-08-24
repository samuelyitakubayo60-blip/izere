from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "shop"
OUT.mkdir(parents=True, exist_ok=True)

ITEMS = [
    ("pads.svg", "#26a69a", "#0d3b36", "Pads", "Sanitary pads"),
    ("condoms-prudence.svg", "#1565c0", "#0d2137", "Prudence", "Condoms"),
    ("condoms-plaisir.svg", "#8e24aa", "#2a1233", "Plaisir", "Condoms"),
    ("pregnancy-test.svg", "#00897b", "#0e2f2c", "Test", "Pregnancy kit"),
    ("hiv-test.svg", "#c62828", "#2d1214", "HIV", "Self-test kit"),
    ("diapers-baby.svg", "#29b6f6", "#0d2a38", "Baby", "Diapers"),
    ("diapers-adult.svg", "#546e7a", "#1c262b", "Adult", "Diapers"),
    ("mama-kit.svg", "#ef6c00", "#2d1a0a", "Mama", "Delivery kit"),
    ("hygiene-paper.svg", "#78909c", "#1c2428", "Paper", "Tissues"),
    ("soap.svg", "#43a047", "#142016", "Soap", "Washing bar"),
]

TEMPLATE = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" role="img" aria-label="{sub}">
  <rect width="640" height="480" rx="28" fill="{bg}"/>
  <circle cx="520" cy="70" r="90" fill="{accent}" opacity="0.28"/>
  <circle cx="80" cy="420" r="70" fill="{accent}" opacity="0.18"/>
  <rect x="190" y="110" width="260" height="220" rx="28" fill="#fff" opacity="0.94"/>
  <rect x="220" y="140" width="200" height="28" rx="8" fill="{accent}"/>
  <rect x="240" y="188" width="160" height="12" rx="6" fill="{bg}" opacity="0.35"/>
  <rect x="240" y="214" width="120" height="12" rx="6" fill="{bg}" opacity="0.22"/>
  <text x="320" y="300" text-anchor="middle" font-family="Outfit, Inter, sans-serif" font-size="34" font-weight="700" fill="{bg}">{title}</text>
  <text x="320" y="400" text-anchor="middle" font-family="Inter, sans-serif" font-size="22" fill="#fff">{sub}</text>
</svg>
"""

for name, accent, bg, title, sub in ITEMS:
    (OUT / name).write_text(
        TEMPLATE.format(accent=accent, bg=bg, title=title, sub=sub),
        encoding="utf-8",
    )
print(f"Wrote {len(ITEMS)} images to {OUT}")
