from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "assets" / "portrait.webp"
OUTPUT = ROOT / "src" / "assets" / "portrait-type.png"
CELL_WIDTH = 8
CELL_HEIGHT = 13
WORDS = (
    "AGENT",
    "CONTEXT",
    "RUNTIME",
    "MEMORY",
    "TOOLS",
    "SYSTEM",
    "REASON",
    "TRACE",
    "VECTOR",
    "PROMPT",
    "STATE",
    "PYTHON",
    "BACKEND",
    "MODEL",
    "INPUT",
    "OUTPUT",
    "SKILLS",
    "LANGGRAPH",
)


def load_font() -> ImageFont.FreeTypeFont:
    candidates = (
        Path("C:/Windows/Fonts/consola.ttf"),
        Path("C:/Windows/Fonts/cour.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"),
    )
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), 8)
    return ImageFont.load_default()


def render() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    width, height = source.size
    pixels = source.load()
    output = Image.new("RGBA", source.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(output)
    font = load_font()

    for row, y in enumerate(range(0, height, CELL_HEIGHT)):
        word = WORDS[(row * 7) % len(WORDS)]
        text = " ".join((word, WORDS[(row * 7 + 5) % len(WORDS)], WORDS[(row * 7 + 11) % len(WORDS)])) + " "
        column = 0
        for x in range(0, width, CELL_WIDTH):
            char = text[column % len(text)]
            column += 1

            samples = [pixels[sx, sy] for sy in range(y, min(y + CELL_HEIGHT, height)) for sx in range(x, min(x + CELL_WIDTH, width))]
            alpha = sum(pixel[3] for pixel in samples) / len(samples) / 255
            if alpha < 0.16 or char == " ":
                continue

            luminance = sum((pixel[0] * 0.2126 + pixel[1] * 0.7152 + pixel[2] * 0.0722) for pixel in samples) / len(samples) / 255
            shade = round(110 + luminance * 125)
            ink_alpha = round(alpha * (105 + luminance * 125))
            draw.text((x, y - 1), char, font=font, fill=(shade, min(shade + 8, 255), max(shade - 6, 0), ink_alpha))

    output.save(OUTPUT, optimize=True)


def verify() -> None:
    if not OUTPUT.exists():
        raise SystemExit(f"Missing generated image: {OUTPUT}")

    with Image.open(OUTPUT) as image:
        if image.size != Image.open(SOURCE).size or image.mode != "RGBA":
            raise SystemExit("Typography portrait has the wrong size or alpha mode")
        if image.getchannel("A").getbbox() is None:
            raise SystemExit("Typography portrait is empty")
        if image.getchannel("A").getextrema()[0] != 0:
            raise SystemExit("Typography portrait must retain its transparent background")

    print("typography portrait verified")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="verify the generated image")
    args = parser.parse_args()
    if args.check:
        verify()
    else:
        render()
        verify()
