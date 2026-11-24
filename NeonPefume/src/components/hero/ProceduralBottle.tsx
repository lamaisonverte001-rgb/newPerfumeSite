"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BRAND_CONFIG } from "@/config/brand";

export interface BottleVisualConfig {
  slug: string;
  name: string;
  labelStyle: string;
  accentHex: string;
}

interface LabelPalette {
  bgTop: string;
  bgBottom: string;
  textPrimary: string;
  textSecondary: string;
  logoTint: string;
  isMetallic: boolean;
  juiceColor: string;
  juiceAttenuation: string;
}

function getLabelPalette(style: string): LabelPalette {
  switch (style) {
    case "ivory":
      return {
        bgTop: "#F5F0E4",
        bgBottom: "#EAE2D0",
        textPrimary: "#151412",
        textSecondary: "#2A2622",
        logoTint: "#151412",
        isMetallic: false,
        juiceColor: "#F2DA96",
        juiceAttenuation: "#DFB85A",
      };
    case "gold":
      return {
        bgTop: "#EAD28B",
        bgBottom: "#CFAF57",
        textPrimary: "#1B1813",
        textSecondary: "#2C251B",
        logoTint: "#181510",
        isMetallic: true,
        juiceColor: "#EED382",
        juiceAttenuation: "#D6AA46",
      };
    case "crimson":
      return {
        bgTop: "#A80E0E",
        bgBottom: "#7D0808",
        textPrimary: "#E7C776",
        textSecondary: "#D9B662",
        logoTint: "#E7C776",
        isMetallic: false,
        juiceColor: "#EBC972",
        juiceAttenuation: "#D19D3B",
      };
    case "teal":
      return {
        bgTop: "#00626A",
        bgBottom: "#00464D",
        textPrimary: "#E7C776",
        textSecondary: "#D9B662",
        logoTint: "#E7C776",
        isMetallic: false,
        juiceColor: "#F0D88E",
        juiceAttenuation: "#D8B356",
      };
    case "obsidian":
    default:
      return {
        bgTop: "#1A1918",
        bgBottom: "#0F0E0D",
        textPrimary: "#E6C674",
        textSecondary: "#D7B460",
        logoTint: "#E6C674",
        isMetallic: false,
        juiceColor: "#EED488",
        juiceAttenuation: "#D8AE4D",
      };
  }
}

/**
 * Construit le tracé 2D du médaillon baroque échancré emblématique de LA MAISON VERTE.
 * Coordonnées centrées en (0, 0), demi-largeur = hw, demi-hauteur = hh.
 */
function createScallopedMedallionShape(hw: number, hh: number): THREE.Shape {
  const shape = new THREE.Shape();
  const notch = hw * 0.14;
  const cornerY = hh * 0.68;
  const cornerX = hw * 0.72;
  const archW = hw * 0.42;

  // Départ : sommet haut du médaillon (sens horaire)
  shape.moveTo(0, hh);
  // Arche supérieure droite
  shape.bezierCurveTo(archW * 0.72, hh, archW, hh * 0.9, archW, cornerY + notch * 0.65);
  // Encoche coin haut-droit
  shape.lineTo(cornerX, cornerY + notch * 0.65);
  shape.lineTo(cornerX, cornerY - notch * 0.55);
  // Flanc droit incurvé vers l'extérieur
  shape.bezierCurveTo(
    hw * 0.99,
    cornerY - notch * 0.65,
    hw,
    hh * 0.34,
    hw,
    0
  );
  shape.bezierCurveTo(
    hw,
    -hh * 0.34,
    hw * 0.99,
    -cornerY + notch * 0.65,
    cornerX,
    -cornerY + notch * 0.55
  );
  // Encoche coin bas-droit
  shape.lineTo(cornerX, -cornerY - notch * 0.65);
  shape.lineTo(archW, -cornerY - notch * 0.65);
  // Arche inférieure droite -> bas
  shape.bezierCurveTo(archW, -hh * 0.9, archW * 0.72, -hh, 0, -hh);
  // Arche inférieure gauche
  shape.bezierCurveTo(-archW * 0.72, -hh, -archW, -hh * 0.9, -archW, -cornerY - notch * 0.65);
  // Encoche coin bas-gauche
  shape.lineTo(-cornerX, -cornerY - notch * 0.65);
  shape.lineTo(-cornerX, -cornerY + notch * 0.55);
  // Flanc gauche incurvé
  shape.bezierCurveTo(
    -hw * 0.99,
    -cornerY + notch * 0.65,
    -hw,
    -hh * 0.34,
    -hw,
    0
  );
  shape.bezierCurveTo(
    -hw,
    hh * 0.34,
    -hw * 0.99,
    cornerY - notch * 0.65,
    -cornerX,
    cornerY - notch * 0.55
  );
  // Encoche coin haut-gauche
  shape.lineTo(-cornerX, cornerY + notch * 0.65);
  shape.lineTo(-archW, cornerY + notch * 0.65);
  // Retour arche supérieure gauche -> sommet
  shape.bezierCurveTo(-archW, hh * 0.9, -archW * 0.72, hh, 0, hh);

  return shape;
}

/**
 * Projette une ShapeGeometry plane sur la paroi cylindrique du flacon (rayon R)
 * avec des coordonnées UV normalisées [0, 1] pour une texture d'étiquette nette.
 */
function createCurvedMedallionGeometry(
  hw: number,
  hh: number,
  cylinderRadius: number
): THREE.BufferGeometry {
  const shape = createScallopedMedallionShape(hw, hh);
  const geom = new THREE.ShapeGeometry(shape, 40);
  const pos = geom.attributes.position;
  const uv = geom.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    const x2d = pos.getX(i);
    const y2d = pos.getY(i);

    // UV normalisés sur la boîte englobante du médaillon
    const u = (x2d + hw) / (2 * hw);
    const v = (y2d + hh) / (2 * hh);
    uv.setXY(i, u, v);

    // Enroulement cylindrique autour de l'axe Y, centré vers +Z
    const theta = x2d / cylinderRadius;
    const x3d = Math.sin(theta) * cylinderRadius;
    const z3d = Math.cos(theta) * cylinderRadius;
    pos.setXYZ(i, x3d, y2d, z3d);
  }

  pos.needsUpdate = true;
  uv.needsUpdate = true;
  geom.computeVertexNormals();
  return geom;
}

function splitPerfumeTitle(name: string): string[] {
  const upper = name.toUpperCase();
  if (upper.length <= 12) return [upper];
  const words = upper.split(" ");
  if (words.length === 2) return [words[0], words[1]];
  if (words.length >= 3) {
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  }
  return [upper];
}

function createLabelCanvasTextures(
  perfumeName: string,
  palette: LabelPalette,
  logoImage: HTMLImageElement | null
): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext("2d");

  if (ctx) {
    // Fond principal avec subtil dégradé satiné
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, palette.bgTop);
    grad.addColorStop(0.55, palette.bgBottom);
    grad.addColorStop(1, palette.bgTop);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Grain papier coton / brossage métallique subtil
    ctx.save();
    for (let i = 0; i < 6500; i++) {
      const gx = Math.random() * size;
      const gy = Math.random() * size;
      const alpha = palette.isMetallic ? 0.035 : 0.028;
      ctx.fillStyle =
        i % 2 === 0
          ? `rgba(255,255,255,${alpha})`
          : `rgba(0,0,0,${alpha})`;
      ctx.fillRect(gx, gy, palette.isMetallic ? 14 : 2, 1.5);
    }
    ctx.restore();

    // Monogramme calligraphique LMV en haut du médaillon
    if (logoImage && logoImage.complete && logoImage.naturalWidth > 0) {
      const tintCanvas = document.createElement("canvas");
      const targetW = 240;
      const aspect = logoImage.naturalHeight / logoImage.naturalWidth;
      const targetH = Math.round(targetW * aspect);
      tintCanvas.width = targetW;
      tintCanvas.height = targetH;
      const tCtx = tintCanvas.getContext("2d");
      if (tCtx) {
        tCtx.drawImage(logoImage, 0, 0, targetW, targetH);
        tCtx.globalCompositeOperation = "source-in";
        tCtx.fillStyle = palette.logoTint;
        tCtx.fillRect(0, 0, targetW, targetH);
        ctx.drawImage(tintCanvas, (size - targetW) / 2, 102);
      }
    } else {
      ctx.save();
      ctx.fillStyle = palette.logoTint;
      ctx.font = 'italic 400 112px Georgia, "Times New Roman", serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(BRAND_CONFIG.monogram, size / 2, 168);
      ctx.restore();
    }

    // Nom de la maison
    ctx.save();
    ctx.fillStyle = palette.textSecondary;
    ctx.font = '500 30px Georgia, "Times New Roman", serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const brandText = BRAND_CONFIG.name.toUpperCase();
    // Espacement typographique soigné
    drawTrackedText(ctx, brandText, size / 2, 278, 5.5);

    // Nom du parfum au centre (1 ou 2 lignes équilibrées)
    const lines = splitPerfumeTitle(perfumeName);
    ctx.fillStyle = palette.textPrimary;
    const titleSize = lines.length === 1 ? 82 : 68;
    ctx.font = `500 ${titleSize}px Georgia, "Times New Roman", serif`;
    if (lines.length === 1) {
      drawTrackedText(ctx, lines[0], size / 2, 475, 4);
    } else {
      drawTrackedText(ctx, lines[0], size / 2, 434, 3.5);
      drawTrackedText(ctx, lines[1], size / 2, 518, 3.5);
    }

    // Concentration
    ctx.fillStyle = palette.textSecondary;
    ctx.font = '500 31px Georgia, "Times New Roman", serif';
    drawTrackedText(ctx, "PARFUM INTENSE", size / 2, 658, 4.5);

    // Origine & Volume
    ctx.font = '400 26px Georgia, "Times New Roman", serif';
    drawTrackedText(ctx, BRAND_CONFIG.originLabel, size / 2, 774, 3.5);
    ctx.font = '400 24px Georgia, "Times New Roman", serif';
    drawTrackedText(ctx, "50ML | 1.69 fl. oz", size / 2, 822, 2);
    ctx.restore();
  }

  // Texture bump (grain papier fin + léger gaufrage)
  if (bCtx) {
    bCtx.fillStyle = "#808080";
    bCtx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 8000; i++) {
      const shade = 116 + Math.floor(Math.random() * 24);
      bCtx.fillStyle = `rgb(${shade},${shade},${shade})`;
      bCtx.fillRect(
        Math.random() * 512,
        Math.random() * 512,
        palette.isMetallic ? 10 : 2,
        2
      );
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  map.needsUpdate = true;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.needsUpdate = true;

  return { map, bumpMap };
}

function drawTrackedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  tracking: number
) {
  const chars = Array.from(text);
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const totalWidth =
    widths.reduce((sum, w) => sum + w, 0) +
    Math.max(0, chars.length - 1) * tracking;
  let currentX = centerX - totalWidth / 2;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const w = widths[i];
    ctx.fillText(ch, currentX + w / 2, y);
    currentX += w + tracking;
  }
}

interface ProceduralBottleProps {
  bottle: BottleVisualConfig;
  reducedMotion: boolean;
}

export function ProceduralBottle({
  bottle,
  reducedMotion,
}: ProceduralBottleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);

  // Charge le vrai logo LMV pour l'étiquette 3D
  useEffect(() => {
    let active = true;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = BRAND_CONFIG.logoPath;
    img.onload = () => {
      if (active) setLogoImg(img);
    };
    return () => {
      active = false;
    };
  }, []);

  const palette = useMemo(
    () => getLabelPalette(bottle.labelStyle),
    [bottle.labelStyle]
  );

  // Géométries haute résolution reconstruites fidèlement d'après les flacons LMV
  const geometries = useMemo(() => {
    // 1. Silhouette verre extérieur (corps cylindrique, épaulement doux, fond massif)
    const outerPoints: THREE.Vector2[] = [
      new THREE.Vector2(0.0, -1.32),
      new THREE.Vector2(0.68, -1.32),
      new THREE.Vector2(0.81, -1.30),
      new THREE.Vector2(0.88, -1.24),
      new THREE.Vector2(0.90, -1.14),
      new THREE.Vector2(0.90, 0.56),
      new THREE.Vector2(0.89, 0.68),
      new THREE.Vector2(0.83, 0.79),
      new THREE.Vector2(0.71, 0.89),
      new THREE.Vector2(0.56, 0.96),
      new THREE.Vector2(0.45, 1.00),
      new THREE.Vector2(0.42, 1.05),
      new THREE.Vector2(0.42, 1.12),
      new THREE.Vector2(0.35, 1.12),
    ];
    const outerGlass = new THREE.LatheGeometry(outerPoints, 96);
    outerGlass.computeVertexNormals();

    // 2. Fond massif en cristal avec dôme intérieur (punt) captant les reflets dorés
    const puntPoints: THREE.Vector2[] = [
      new THREE.Vector2(0.0, -0.94),
      new THREE.Vector2(0.14, -0.96),
      new THREE.Vector2(0.32, -1.07),
      new THREE.Vector2(0.50, -1.21),
      new THREE.Vector2(0.67, -1.29),
      new THREE.Vector2(0.82, -1.24),
      new THREE.Vector2(0.84, -0.88),
      new THREE.Vector2(0.80, -0.79),
      new THREE.Vector2(0.62, -0.76),
      new THREE.Vector2(0.0, -0.76),
    ];
    const crystalBase = new THREE.LatheGeometry(puntPoints, 72);
    crystalBase.computeVertexNormals();

    // 3. Liquide parfumé champagne doré avec ménisque supérieur concave
    const liquidPoints: THREE.Vector2[] = [
      new THREE.Vector2(0.0, -0.75),
      new THREE.Vector2(0.64, -0.75),
      new THREE.Vector2(0.78, -0.71),
      new THREE.Vector2(0.835, -0.60),
      new THREE.Vector2(0.835, 0.56),
      new THREE.Vector2(0.815, 0.65),
      new THREE.Vector2(0.76, 0.71),
      new THREE.Vector2(0.66, 0.695),
      new THREE.Vector2(0.40, 0.685),
      new THREE.Vector2(0.0, 0.683),
    ];
    const liquid = new THREE.LatheGeometry(liquidPoints, 80);
    liquid.computeVertexNormals();

    // 4. Tube plongeur transparent descendant et s'incurvant délicatement vers le bas-droit
    const dipCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 1.06, 0.0),
      new THREE.Vector3(0.0, 0.45, 0.0),
      new THREE.Vector3(0.02, -0.18, 0.01),
      new THREE.Vector3(0.14, -0.54, 0.04),
      new THREE.Vector3(0.34, -0.73, 0.07),
    ]);
    const dipTube = new THREE.TubeGeometry(dipCurve, 40, 0.021, 14, false);

    // 5. Col métallique or poli avec bague perlée et évasement sculpté
    const collarPoints: THREE.Vector2[] = [
      new THREE.Vector2(0.41, 1.04),
      new THREE.Vector2(0.455, 1.055),
      new THREE.Vector2(0.465, 1.08),
      new THREE.Vector2(0.44, 1.105),
      new THREE.Vector2(0.425, 1.12),
      new THREE.Vector2(0.425, 1.44),
      new THREE.Vector2(0.445, 1.48),
      new THREE.Vector2(0.515, 1.54),
      new THREE.Vector2(0.575, 1.575),
      new THREE.Vector2(0.595, 1.60),
      new THREE.Vector2(0.585, 1.625),
      new THREE.Vector2(0.555, 1.635),
    ];
    const goldCollar = new THREE.LatheGeometry(collarPoints, 96);
    goldCollar.computeVertexNormals();

    // 6. Bandeau central du bouchon laqué noir piano
    const blackCapBand = new THREE.CylinderGeometry(0.562, 0.562, 0.365, 96, 1);

    // 7. Couronne supérieure bombée en or poli
    const crownPoints: THREE.Vector2[] = [
      new THREE.Vector2(0.555, 1.995),
      new THREE.Vector2(0.595, 2.01),
      new THREE.Vector2(0.605, 2.04),
      new THREE.Vector2(0.585, 2.075),
      new THREE.Vector2(0.50, 2.11),
      new THREE.Vector2(0.34, 2.132),
      new THREE.Vector2(0.16, 2.142),
      new THREE.Vector2(0.0, 2.145),
    ];
    const goldCrown = new THREE.LatheGeometry(crownPoints, 96);
    goldCrown.computeVertexNormals();

    // 8. Médaillon baroque courbé (bordure or + plaque étiquette)
    const goldFrame = createCurvedMedallionGeometry(0.625, 0.685, 0.905);
    const labelFace = createCurvedMedallionGeometry(0.582, 0.642, 0.911);

    // 9. Petites facettes de réfraction dorées autour du punt intérieur
    const puntRing = new THREE.TorusGeometry(0.42, 0.045, 16, 48);

    return {
      outerGlass,
      crystalBase,
      liquid,
      dipTube,
      goldCollar,
      blackCapBand,
      goldCrown,
      goldFrame,
      labelFace,
      puntRing,
    };
  }, []);

  // Nettoyage mémoire strict de toutes les géométries à la destruction
  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((g) => g.dispose());
    };
  }, [geometries]);

  // Génération dynamique de la texture haute définition de l'étiquette
  const labelTextures = useMemo(() => {
    if (typeof document === "undefined") return null;
    return createLabelCanvasTextures(bottle.name, palette, logoImg);
  }, [bottle.name, palette, logoImg]);

  useEffect(() => {
    return () => {
      labelTextures?.map.dispose();
      labelTextures?.bumpMap.dispose();
    };
  }, [labelTextures]);

  // Animation douce : légère rotation de respiration + parallaxe curseur amortie
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (reducedMotion) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        0.12,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0,
        0.05
      );
      return;
    }

    const pointerTargetY = state.pointer.x * 0.28;
    const pointerTargetX = -state.pointer.y * 0.1;
    const gentleSway = Math.sin(t * 0.45) * 0.16;

    const damp = 1 - Math.exp(-3.2 * delta);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      gentleSway + pointerTargetY,
      damp
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointerTargetX,
      damp
    );
  });

  return (
    <group ref={groupRef} position={[0, -0.35, 0]} scale={0.96}>
      {/* Corps extérieur en verre cristal épais */}
      <mesh geometry={geometries.outerGlass} renderOrder={4}>
        <meshPhysicalMaterial
          color="#FFFFFF"
          transmission={0.95}
          opacity={1}
          transparent
          roughness={0.055}
          metalness={0.0}
          ior={1.52}
          thickness={0.55}
          specularIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.04}
          envMapIntensity={1.45}
          depthWrite={false}
        />
      </mesh>

      {/* Fond massif en cristal avec dôme intérieur (punt) */}
      <mesh geometry={geometries.crystalBase} renderOrder={2}>
        <meshPhysicalMaterial
          color="#FAF4E4"
          transmission={0.86}
          transparent
          opacity={0.92}
          roughness={0.08}
          ior={1.58}
          thickness={1.1}
          attenuationColor="#DFBA62"
          attenuationDistance={1.15}
          envMapIntensity={1.8}
          clearcoat={1}
        />
      </mesh>

      {/* Caustique interne dorée du dôme inférieur */}
      <mesh
        geometry={geometries.puntRing}
        position={[0, -1.16, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        renderOrder={1}
      >
        <meshStandardMaterial
          color="#E5C063"
          metalness={0.88}
          roughness={0.18}
          transparent
          opacity={0.42}
        />
      </mesh>

      {/* Jus parfumé champagne-or lumineux */}
      <mesh geometry={geometries.liquid} renderOrder={1}>
        <meshPhysicalMaterial
          color={palette.juiceColor}
          transmission={0.74}
          transparent
          opacity={0.94}
          roughness={0.07}
          metalness={0.04}
          ior={1.36}
          thickness={1.4}
          attenuationColor={palette.juiceAttenuation}
          attenuationDistance={0.9}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Tube plongeur transparent incurvé */}
      <mesh geometry={geometries.dipTube} renderOrder={2}>
        <meshPhysicalMaterial
          color="#FFFDF8"
          transparent
          opacity={0.45}
          roughness={0.12}
          metalness={0.05}
          clearcoat={1}
        />
      </mesh>

      {/* Col métallique doré poli & bague de sertissage */}
      <mesh geometry={geometries.goldCollar}>
        <meshStandardMaterial
          color="#DFBE6B"
          metalness={0.96}
          roughness={0.11}
          envMapIntensity={1.6}
        />
      </mesh>

      {/* Bandeau central du bouchon laqué noir piano */}
      <mesh geometry={geometries.blackCapBand} position={[0, 1.815, 0]}>
        <meshPhysicalMaterial
          color="#090909"
          metalness={0.15}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.04}
          envMapIntensity={1.4}
        />
      </mesh>

      {/* Couronne supérieure bombée en or poli */}
      <mesh geometry={geometries.goldCrown}>
        <meshStandardMaterial
          color="#E2C270"
          metalness={0.97}
          roughness={0.1}
          envMapIntensity={1.65}
        />
      </mesh>

      {/* Bordure métallique dorée en relief du médaillon */}
      <mesh geometry={geometries.goldFrame} position={[0, -0.04, 0]} renderOrder={5}>
        <meshStandardMaterial
          color="#DFBE6A"
          metalness={0.94}
          roughness={0.16}
          envMapIntensity={1.55}
        />
      </mesh>

      {/* Face texturée haute résolution de l'étiquette */}
      {labelTextures && (
        <mesh geometry={geometries.labelFace} position={[0, -0.04, 0]} renderOrder={6}>
          <meshStandardMaterial
            map={labelTextures.map}
            bumpMap={labelTextures.bumpMap}
            bumpScale={0.004}
            metalness={palette.isMetallic ? 0.58 : 0.08}
            roughness={palette.isMetallic ? 0.34 : 0.72}
            envMapIntensity={palette.isMetallic ? 1.25 : 0.6}
          />
        </mesh>
      )}
    </group>
  );
}
