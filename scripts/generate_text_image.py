from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = ROOT / "src" / "assets" / "portrait.webp"
DEFAULT_OUTPUT = ROOT / "src" / "assets" / "portrait-type.png"
DEFAULT_WORDS = "AGENT CONTEXT RUNTIME MEMORY TOOLS SYSTEM REASON TRACE VECTOR PROMPT STATE PYTHON BACKEND MODEL INPUT OUTPUT SKILLS LANGGRAPH"


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = (
        Path("C:/Windows/Fonts/consola.ttf"),
        Path("C:/Windows/Fonts/cour.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"),
    )
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def generate(
    input_path: Path,
    output_path: Path,
    words: list[str],
    cell_width: int,
    cell_height: int,
    background_threshold: float,
    detail_gamma: float = 1.0,
    sampling: str = "mean",
) -> None:
    source = Image.open(input_path).convert("RGBA")
    pixels = source.load()
    width, height = source.size
    output = Image.new("RGBA", source.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(output)
    font = load_font(max(5, round(cell_height * 0.68)))

    for row, y in enumerate(range(0, height, cell_height)):
        phrase = f" {words[row % len(words)]} {words[(row + 5) % len(words)]} "
        for column, x in enumerate(range(0, width, cell_width)):
            char = phrase[(column + row * 3) % len(phrase)]
            if char == " ":
                continue

            samples = [
                pixels[sx, sy]
                for sy in range(y, min(y + cell_height, height))
                for sx in range(x, min(x + cell_width, width))
            ]
            if not samples:
                continue

            alpha = sum(pixel[3] for pixel in samples) / len(samples) / 255
            if alpha < 0.16:
                continue

            luminance = sum(
                pixel[3]
                * (pixel[0] * 0.2126 + pixel[1] * 0.7152 + pixel[2] * 0.0722)
                for pixel in samples
            ) / max(sum(pixel[3] for pixel in samples), 1) / 255
            if sampling == "detail":
                peak = max(
                    (pixel[0] * 0.2126 + pixel[1] * 0.7152 + pixel[2] * 0.0722)
                    * pixel[3] / (255 * 255)
                    for pixel in samples
                )
                luminance = max(luminance, luminance * 0.25 + peak * 0.75)
            contrast = max(0.0, min(1.0, (luminance - 0.16) / 0.68))
            # Keep dark source details readable against the site's charcoal canvas.
            shade = round(140 + contrast * 115)
            brightness_mask = max(
                0.0,
                min(1.0, (luminance - background_threshold) / 0.3),
            )
            if brightness_mask < 0.08:
                continue
            ink_alpha = round(alpha * brightness_mask ** detail_gamma * 255)
            draw.text(
                (x, y - 1),
                char,
                font=font,
                fill=(shade, shade, shade, ink_alpha),
            )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output.save(output_path, optimize=True)


def verify(input_path: Path, output_path: Path) -> None:
    if not output_path.exists():
        raise SystemExit(f"Missing generated image: {output_path}")

    with Image.open(input_path) as source, Image.open(output_path) as image:
        if image.size != source.size or image.mode != "RGBA":
            raise SystemExit("Text image must match its source dimensions and use RGBA mode")
        if image.getchannel("A").getbbox() is None:
            raise SystemExit("Generated text image is empty")

    print(f"text image verified: {output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Render a transparent image mosaic made from repeated technical words."
    )
    parser.add_argument("input", nargs="?", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("output", nargs="?", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--words", default=DEFAULT_WORDS, help="space-separated words used for the text texture")
    parser.add_argument("--cell-width", type=int, default=7)
    parser.add_argument("--cell-height", type=int, default=10)
    parser.add_argument(
        "--sampling", choices=("mean", "detail"), default="mean",
        help="mean for photos; detail preserves thin lines in diagrams",
    )
    parser.add_argument(
        "--detail-gamma", type=float, default=1.0,
        help="values below 1 brighten faint text details without restoring the dark background",
    )
    parser.add_argument(
        "--background-threshold",
        type=float,
        default=0.0,
        help="suppress pixels darker than this normalized luminance (0 to 1)",
    )
    parser.add_argument("--check", action="store_true", help="verify an existing generated image")
    args = parser.parse_args()

    if args.cell_width < 1 or args.cell_height < 1:
        parser.error("cell width and height must be positive integers")
    if not 0 <= args.background_threshold < 1:
        parser.error("background threshold must be between 0 and 1")
    if not 0 < args.detail_gamma <= 4:
        parser.error("detail gamma must be greater than 0 and at most 4")

    words = [word for word in args.words.replace(",", " ").split() if word]
    if not words:
        parser.error("provide at least one word for the text texture")

    if not args.check:
        generate(
            args.input,
            args.output,
            words,
            args.cell_width,
            args.cell_height,
            args.background_threshold,
            args.detail_gamma,
            args.sampling,
        )
    verify(args.input, args.output)


if __name__ == "__main__":
    main()
