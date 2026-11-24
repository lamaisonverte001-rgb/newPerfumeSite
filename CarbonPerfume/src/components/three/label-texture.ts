import * as THREE from "three";
import type { HeroBottleEdition } from "@/config/brand";

export interface GeneratedLabelTextures {
  colorMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  dispose: () => void;
}

/**
 * Traces the signature baroque die-cut cartouche path seen on the reference flacons:
 * - Top central arch
 * - Rectangular shoulder steps
 * - Side rounded lobes
 * - Symmetrical lower steps and bottom arch
 */
function traceCartouchePath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number
): void {
  const s = scale;
  ctx.beginPath();

  // Top arch (left to right)
  ctx.moveTo(cx - 115 * s, cy - 295 * s);
  ctx.quadraticCurveTo(cx, cy - 395 * s, cx + 115 * s, cy - 295 * s);

  // Top-right step
  ctx.lineTo(cx + 225 * s, cy - 295 * s);
  ctx.lineTo(cx + 225 * s, cy - 215 * s);

  // Right rounded lobe
  ctx.quadraticCurveTo(cx + 318 * s, cy - 165 * s, cx + 318 * s, cy - 85 * s);
  ctx.lineTo(cx + 318 * s, cy + 85 * s);
  ctx.quadraticCurveTo(cx + 318 * s, cy + 165 * s, cx + 225 * s, cy + 215 * s);

  // Bottom-right step
  ctx.lineTo(cx + 225 * s, cy + 295 * s);
  ctx.lineTo(cx + 115 * s, cy + 295 * s);

  // Bottom arch (right to left)
  ctx.quadraticCurveTo(cx, cy + 395 * s, cx - 115 * s, cy + 295 * s);

  // Bottom-left step
  ctx.lineTo(cx - 225 * s, cy + 295 * s);
  ctx.lineTo(cx - 225 * s, cy + 215 * s);

  // Left rounded lobe
  ctx.quadraticCurveTo(cx - 318 * s, cy + 165 * s, cx - 318 * s, cy + 85 * s);
  ctx.lineTo(cx - 318 * s, cy - 85 * s);
  ctx.quadraticCurveTo(cx - 318 * s, cy - 165 * s, cx - 225 * s, cy - 215 * s);

  // Top-left step
  ctx.lineTo(cx - 225 * s, cy - 295 * s);
  ctx.closePath();
}

export function createCartoucheLabelTextures(
  edition: HeroBottleEdition,
  brandName: string
): GeneratedLabelTextures {
  const size = 1024;
  const cx = size / 2;
  const cy = size / 2;

  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = size;
  colorCanvas.height = size;
  const ctx = colorCanvas.getContext("2d");

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext("2d");

  if (!ctx || !bctx) {
    const fallback = new THREE.CanvasTexture(colorCanvas);
    return {
      colorMap: fallback,
      bumpMap: fallback,
      dispose: () => fallback.dispose(),
    };
  }

  ctx.clearRect(0, 0, size, size);
  bctx.fillStyle = "#000000";
  bctx.fillRect(0, 0, size, size);

  // 1. Outer metallic gold foil cartouche backing
  const goldGrad = ctx.createLinearGradient(cx - 320, cy - 380, cx + 320, cy + 380);
  goldGrad.addColorStop(0, "#F3DC99");
  goldGrad.addColorStop(0.28, edition.labelBorder);
  goldGrad.addColorStop(0.52, "#FFF0BE");
  goldGrad.addColorStop(0.78, "#9E7832");
  goldGrad.addColorStop(1, "#E5C478");

  traceCartouchePath(ctx, cx, cy, 1.0);
  ctx.fillStyle = goldGrad;
  ctx.fill();

  traceCartouchePath(bctx, cx, cy, 1.0);
  bctx.fillStyle = "#B8B8B8";
  bctx.fill();

  // 2. Inner textured paper field
  ctx.save();
  traceCartouchePath(ctx, cx, cy, 0.935);
  ctx.clip();

  ctx.fillStyle = edition.labelBg;
  ctx.fillRect(0, 0, size, size);

  // Subtle radial vignette for depth
  const vignette = ctx.createRadialGradient(cx, cy, 60, cx, cy, 380);
  vignette.addColorStop(0, "rgba(255, 255, 255, 0.06)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.16)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, size, size);

  // Fine cotton paper grain (deterministic pseudo-noise)
  let seed = 42;
  const nextRand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let i = 0; i < 3600; i += 1) {
    const gx = cx - 330 + nextRand() * 660;
    const gy = cy - 390 + nextRand() * 780;
    const alpha = nextRand() * 0.045;
    ctx.fillStyle = i % 2 === 0 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.fillRect(gx, gy, 2, 2);
  }
  ctx.restore();

  // Bump inner field slightly recessed relative to gold rim
  bctx.save();
  traceCartouchePath(bctx, cx, cy, 0.935);
  bctx.fillStyle = "#787878";
  bctx.fill();
  for (let i = 0; i < 2800; i += 1) {
    const gx = cx - 310 + nextRand() * 620;
    const gy = cy - 360 + nextRand() * 720;
    const shade = 112 + Math.floor(nextRand() * 24);
    bctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    bctx.fillRect(gx, gy, 2, 2);
  }
  bctx.restore();

  // 3. Delicate inner hairline border
  traceCartouchePath(ctx, cx, cy, 0.905);
  ctx.strokeStyle = edition.labelBorder;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 4. Calligraphic monogram flourish at top arch (inspired by LMV crest)
  ctx.save();
  ctx.strokeStyle = edition.labelText;
  ctx.lineWidth = 5.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - 58, cy - 228);
  ctx.bezierCurveTo(cx - 18, cy - 295, cx + 8, cy - 298, cx - 22, cy - 242);
  ctx.bezierCurveTo(cx - 48, cy - 196, cx - 72, cy - 192, cx - 8, cy - 186);
  ctx.moveTo(cx - 6, cy - 200);
  ctx.lineTo(cx + 16, cy - 246);
  ctx.lineTo(cx + 22, cy - 198);
  ctx.lineTo(cx + 46, cy - 244);
  ctx.lineTo(cx + 46, cy - 194);
  ctx.lineTo(cx + 82, cy - 256);
  ctx.stroke();
  ctx.restore();

  // 5. Typography hierarchy
  ctx.fillStyle = edition.labelText;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Brand name sub-header
  ctx.font = '600 25px "Cormorant Garamond", Georgia, serif';
  ctx.letterSpacing = "4px";
  ctx.fillText(brandName.toUpperCase(), cx, cy - 132);

  // Perfume title (1 or 2 lines)
  const lines = edition.labelTitleLines;
  if (lines.length === 1) {
    ctx.font = '600 62px "Cormorant Garamond", Georgia, serif';
    ctx.letterSpacing = "3px";
    ctx.fillText(lines[0], cx, cy - 16);

    bctx.fillStyle = "#DFDFDF";
    bctx.textAlign = "center";
    bctx.font = '600 62px Georgia, serif';
    bctx.fillText(lines[0], cx, cy - 16);
  } else {
    ctx.font = '600 54px "Cormorant Garamond", Georgia, serif';
    ctx.letterSpacing = "2.5px";
    ctx.fillText(lines[0], cx, cy - 46);
    ctx.fillText(lines[1], cx, cy + 16);

    bctx.fillStyle = "#DFDFDF";
    bctx.textAlign = "center";
    bctx.font = '600 54px Georgia, serif';
    bctx.fillText(lines[0], cx, cy - 46);
    bctx.fillText(lines[1], cx, cy + 16);
  }

  // Concentration
  ctx.font = '600 24px "Cormorant Garamond", Georgia, serif';
  ctx.letterSpacing = "3.5px";
  ctx.fillText("PARFUM INTENSE", cx, cy + 112);

  // Origin & Volume
  ctx.font = '500 20px "Cormorant Garamond", Georgia, serif';
  ctx.letterSpacing = "2px";
  ctx.fillText("MADE IN EUROPE", cx, cy + 188);

  ctx.font = '500 19px "Cormorant Garamond", Georgia, serif';
  ctx.letterSpacing = "1px";
  ctx.fillText("50ML | 1.69 fl. oz", cx, cy + 222);

  const colorMap = new THREE.CanvasTexture(colorCanvas);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.anisotropy = 8;
  colorMap.needsUpdate = true;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.anisotropy = 4;
  bumpMap.needsUpdate = true;

  return {
    colorMap,
    bumpMap,
    dispose: () => {
      colorMap.dispose();
      bumpMap.dispose();
    },
  };
}
