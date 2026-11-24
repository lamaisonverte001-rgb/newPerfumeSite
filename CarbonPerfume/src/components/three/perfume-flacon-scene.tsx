"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  OrbitControls,
} from "@react-three/drei";
import type { HeroBottleEdition } from "@/config/brand";
import { createCartoucheLabelTextures } from "./label-texture";

export type CameraViewMode = "studio" | "detail";

interface FlaconSceneProps {
  edition: HeroBottleEdition;
  brandName: string;
  viewMode: CameraViewMode;
  reducedMotion: boolean;
}

function buildFlaconGeometries() {
  // 1. Outer crystal glass body profile (y from -1.64 to +0.76)
  const outerPoints: THREE.Vector2[] = [];
  outerPoints.push(new THREE.Vector2(0.0, -1.64));
  outerPoints.push(new THREE.Vector2(0.62, -1.64));
  // Rounded bottom corner fillet
  for (let i = 0; i <= 10; i += 1) {
    const t = (i / 10) * (Math.PI / 2);
    const r = 0.68 + Math.sin(t) * 0.18;
    const y = -1.52 - Math.cos(t) * 0.12;
    outerPoints.push(new THREE.Vector2(r, y));
  }
  // Vertical cylinder wall
  outerPoints.push(new THREE.Vector2(0.86, -1.48));
  outerPoints.push(new THREE.Vector2(0.86, 0.34));
  // Smooth curved glass shoulder
  for (let i = 1; i <= 16; i += 1) {
    const u = i / 16;
    const ease = 0.5 - 0.5 * Math.cos(u * Math.PI);
    const r = 0.86 - ease * 0.44;
    const y = 0.34 + Math.sin(u * (Math.PI / 2)) * 0.38;
    outerPoints.push(new THREE.Vector2(r, y));
  }
  // Glass neck seat
  outerPoints.push(new THREE.Vector2(0.42, 0.76));
  outerPoints.push(new THREE.Vector2(0.35, 0.76));

  const outerGlassGeo = new THREE.LatheGeometry(outerPoints, 96);
  outerGlassGeo.computeVertexNormals();

  // 2. Sculpted fluted crystal punt dome at base interior (creates golden base caustics)
  const puntGeo = new THREE.ConeGeometry(0.68, 0.42, 48, 12, false);
  const posAttr = puntGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i += 1) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);
    const angle = Math.atan2(z, x);
    const radial = Math.hypot(x, z);
    // Soft 10-lobe radial scallops matching the base caustics in the reference render
    const flute = 1 + 0.065 * Math.cos(angle * 10) * (radial / 0.68);
    // Round the tip into a smooth parabolic dome
    const normalizedH = (y + 0.21) / 0.42;
    const domeCurve = Math.sin(normalizedH * (Math.PI / 2));
    posAttr.setXYZ(
      i,
      x * flute,
      -1.60 + domeCurve * 0.42,
      z * flute
    );
  }
  puntGeo.computeVertexNormals();

  // 3. Perfume liquid ("jus") slightly inset inside glass cavity with concave bottom over punt & top meniscus
  const liquidPoints: THREE.Vector2[] = [];
  // Center top of punt indentation
  liquidPoints.push(new THREE.Vector2(0.0, -1.13));
  for (let i = 1; i <= 10; i += 1) {
    const u = i / 10;
    const r = u * 0.735;
    const puntIndent = -1.13 - Math.sin(u * Math.PI * 0.78) * 0.14;
    liquidPoints.push(new THREE.Vector2(r, puntIndent));
  }
  // Outer liquid cylinder wall
  liquidPoints.push(new THREE.Vector2(0.742, -1.04));
  liquidPoints.push(new THREE.Vector2(0.742, 0.41));
  // Subtle curved shoulder & concave meniscus at top surface
  liquidPoints.push(new THREE.Vector2(0.715, 0.475));
  liquidPoints.push(new THREE.Vector2(0.65, 0.452));
  liquidPoints.push(new THREE.Vector2(0.42, 0.442));
  liquidPoints.push(new THREE.Vector2(0.0, 0.438));

  const liquidGeo = new THREE.LatheGeometry(liquidPoints, 80);
  liquidGeo.computeVertexNormals();

  // Bright meniscus rim ring catching overhead softbox
  const meniscusGeo = new THREE.TorusGeometry(0.708, 0.011, 16, 72);
  meniscusGeo.rotateX(Math.PI / 2);

  // 4. Translucent dip tube curving gently toward bottom-right around the punt
  const tubeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.0, 0.76, 0.0),
    new THREE.Vector3(0.0, 0.22, 0.0),
    new THREE.Vector3(0.03, -0.45, 0.01),
    new THREE.Vector3(0.19, -0.92, 0.04),
    new THREE.Vector3(0.38, -1.18, 0.07),
  ]);
  const dipTubeGeo = new THREE.TubeGeometry(tubeCurve, 48, 0.019, 16, false);

  // 5. Stepped & flared polished 24k gold collar
  const collarPoints: THREE.Vector2[] = [
    new THREE.Vector2(0.38, 0.73),
    new THREE.Vector2(0.452, 0.73),
    new THREE.Vector2(0.465, 0.752),
    new THREE.Vector2(0.442, 0.772),
    new THREE.Vector2(0.428, 0.78),
    new THREE.Vector2(0.428, 1.05),
  ];
  // Trumpet flare upward from r=0.428 to r=0.585
  for (let i = 1; i <= 12; i += 1) {
    const u = i / 12;
    const flare = Math.pow(u, 1.75);
    const r = 0.428 + flare * 0.162;
    const y = 1.05 + u * 0.17;
    collarPoints.push(new THREE.Vector2(r, y));
  }
  collarPoints.push(new THREE.Vector2(0.598, 1.235));
  collarPoints.push(new THREE.Vector2(0.575, 1.258));
  collarPoints.push(new THREE.Vector2(0.42, 1.258));

  const goldCollarGeo = new THREE.LatheGeometry(collarPoints, 80);
  goldCollarGeo.computeVertexNormals();

  // Internal atomizer nozzle detail (visible at angles / detail mode)
  const atomizerGeo = new THREE.CylinderGeometry(0.11, 0.14, 0.18, 32);

  // 6. Piano-black lacquered cap band
  const blackBandPoints: THREE.Vector2[] = [
    new THREE.Vector2(0.48, 1.258),
    new THREE.Vector2(0.566, 1.258),
    new THREE.Vector2(0.568, 1.565),
    new THREE.Vector2(0.48, 1.565),
  ];
  const blackCapBandGeo = new THREE.LatheGeometry(blackBandPoints, 80);
  blackCapBandGeo.computeVertexNormals();

  // 7. Domed 24k gold cap crown with bevel lip
  const goldCrownPoints: THREE.Vector2[] = [
    new THREE.Vector2(0.48, 1.565),
    new THREE.Vector2(0.582, 1.565),
    new THREE.Vector2(0.602, 1.595),
    new THREE.Vector2(0.598, 1.635),
    new THREE.Vector2(0.565, 1.662),
  ];
  for (let i = 1; i <= 12; i += 1) {
    const u = i / 12;
    const r = (1 - u) * 0.565;
    goldCrownPoints.push(
      new THREE.Vector2(r, 1.662 + Math.sin(u * (Math.PI / 2)) * 0.068)
    );
  }
  const goldCrownGeo = new THREE.LatheGeometry(goldCrownPoints, 80);
  goldCrownGeo.computeVertexNormals();

  // 8. Curved cylindrical label patch hugging front glass (+Z)
  const thetaLength = 1.18; // ~67.6 degrees arc
  const labelGeo = new THREE.CylinderGeometry(
    0.866,
    0.866,
    1.16,
    64,
    1,
    true,
    -thetaLength / 2,
    thetaLength
  );

  return {
    outerGlassGeo,
    puntGeo,
    liquidGeo,
    meniscusGeo,
    dipTubeGeo,
    goldCollarGeo,
    atomizerGeo,
    blackCapBandGeo,
    goldCrownGeo,
    labelGeo,
    disposeAll: () => {
      outerGlassGeo.dispose();
      puntGeo.dispose();
      liquidGeo.dispose();
      meniscusGeo.dispose();
      dipTubeGeo.dispose();
      goldCollarGeo.dispose();
      atomizerGeo.dispose();
      blackCapBandGeo.dispose();
      goldCrownGeo.dispose();
      labelGeo.dispose();
    },
  };
}

function ProceduralPerfumeFlacon({
  edition,
  brandName,
  reducedMotion,
}: {
  edition: HeroBottleEdition;
  brandName: string;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const geometries = useMemo(() => buildFlaconGeometries(), []);

  useEffect(() => {
    return () => {
      geometries.disposeAll();
    };
  }, [geometries]);

  const labelTextures = useMemo(
    () => createCartoucheLabelTextures(edition, brandName),
    [edition, brandName]
  );

  useEffect(() => {
    return () => {
      labelTextures.dispose();
    };
  }, [labelTextures]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      // Subtle mouse parallax + slow noble oscillation
      const targetRotX = state.pointer.y * 0.09;
      const targetRotY =
        Math.sin(state.clock.elapsedTime * 0.38) * 0.16 +
        state.pointer.x * 0.22;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        Math.min(1, delta * 3.2)
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        Math.min(1, delta * 3.2)
      );
    }
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.4}
      rotationIntensity={reducedMotion ? 0 : 0.08}
      floatIntensity={reducedMotion ? 0 : 0.22}
    >
      <group ref={groupRef} position={[0, -0.05, 0]}>
        {/* Dip tube inside liquid */}
        <mesh geometry={geometries.dipTubeGeo} renderOrder={1}>
          <meshPhysicalMaterial
            color="#FAF7F0"
            transparent
            opacity={0.44}
            roughness={0.22}
            transmission={0.6}
            ior={1.46}
            depthWrite={false}
          />
        </mesh>

        {/* Perfume liquid ("jus") */}
        <mesh geometry={geometries.liquidGeo} renderOrder={2}>
          <meshPhysicalMaterial
            color={edition.liquidColor}
            attenuationColor={edition.liquidAttenuation}
            attenuationDistance={1.15}
            transmission={0.88}
            transparent
            opacity={0.94}
            ior={1.36}
            thickness={1.1}
            roughness={0.05}
            metalness={0.02}
            envMapIntensity={1.35}
          />
        </mesh>

        {/* Liquid meniscus golden highlight ring */}
        <mesh
          geometry={geometries.meniscusGeo}
          position={[0, 0.462, 0]}
          renderOrder={3}
        >
          <meshStandardMaterial
            color="#F5DF9E"
            metalness={0.65}
            roughness={0.18}
            transparent
            opacity={0.72}
          />
        </mesh>

        {/* Sculpted fluted crystal punt at bottom interior */}
        <mesh geometry={geometries.puntGeo} renderOrder={3}>
          <meshPhysicalMaterial
            color="#F6DF9C"
            transmission={0.78}
            transparent
            opacity={0.72}
            ior={1.54}
            thickness={0.65}
            roughness={0.08}
            metalness={0.12}
            clearcoat={1}
            envMapIntensity={1.9}
          />
        </mesh>

        {/* Heavy outer crystal flacon */}
        <mesh geometry={geometries.outerGlassGeo} renderOrder={4}>
          <meshPhysicalMaterial
            color="#FFFFFF"
            transmission={0.95}
            transparent
            opacity={1}
            ior={1.52}
            thickness={0.82}
            roughness={0.035}
            metalness={0.0}
            clearcoat={1}
            clearcoatRoughness={0.03}
            reflectivity={0.95}
            attenuationColor="#FDF8EC"
            attenuationDistance={2.8}
            envMapIntensity={1.65}
          />
        </mesh>

        {/* Internal atomizer stem */}
        <mesh geometry={geometries.atomizerGeo} position={[0, 0.85, 0]}>
          <meshStandardMaterial
            color="#DFBA64"
            metalness={0.92}
            roughness={0.22}
          />
        </mesh>

        {/* Polished 24k gold stepped & flared collar */}
        <mesh geometry={geometries.goldCollarGeo}>
          <meshPhysicalMaterial
            color="#E8C670"
            metalness={0.97}
            roughness={0.11}
            clearcoat={0.7}
            clearcoatRoughness={0.08}
            envMapIntensity={1.85}
          />
        </mesh>

        {/* Piano-black lacquered cap cylinder */}
        <mesh geometry={geometries.blackCapBandGeo}>
          <meshPhysicalMaterial
            color="#090909"
            metalness={0.08}
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.03}
            envMapIntensity={1.8}
          />
        </mesh>

        {/* Domed 24k gold cap crown */}
        <mesh geometry={geometries.goldCrownGeo}>
          <meshPhysicalMaterial
            color="#E8C670"
            metalness={0.97}
            roughness={0.1}
            clearcoat={0.75}
            clearcoatRoughness={0.07}
            envMapIntensity={1.9}
          />
        </mesh>

        {/* Curved baroque die-cut cartouche label */}
        <mesh
          geometry={geometries.labelGeo}
          position={[0, -0.34, 0]}
          renderOrder={5}
        >
          <meshStandardMaterial
            map={labelTextures.colorMap}
            bumpMap={labelTextures.bumpMap}
            bumpScale={0.014}
            transparent
            alphaTest={0.25}
            roughness={0.38}
            metalness={0.28}
            envMapIntensity={1.15}
          />
        </mesh>
      </group>
    </Float>
  );
}

function GoldenMistParticles({ reducedMotion }: { reducedMotion: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 46;

  const { geometry, spriteTexture } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    let s = 137;
    const rand = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };

    for (let i = 0; i < count; i += 1) {
      const radius = 1.15 + rand() * 1.15;
      const theta = rand() * Math.PI * 2;
      const y = -1.45 + rand() * 3.2;

      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius * 0.65;
      phases[i] = rand() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
      grad.addColorStop(0, "rgba(236, 206, 138, 0.95)");
      grad.addColorStop(0.45, "rgba(198, 158, 86, 0.42)");
      grad.addColorStop(1, "rgba(198, 158, 86, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);

    return { geometry: geo, spriteTexture: tex };
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      spriteTexture.dispose();
    };
  }, [geometry, spriteTexture]);

  useFrame((state) => {
    if (!pointsRef.current || reducedMotion) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.045;
    pointsRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.5) * 0.06;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        map={spriteTexture}
        size={0.055}
        transparent
        opacity={0.58}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function StudioCameraRig({ viewMode }: { viewMode: CameraViewMode }) {
  const { camera } = useThree();
  const targetPos = useMemo(
    () =>
      viewMode === "detail"
        ? new THREE.Vector3(0.18, 0.16, 3.25)
        : new THREE.Vector3(0.0, 0.05, 4.85),
    [viewMode]
  );

  useFrame((_, delta) => {
    camera.position.lerp(targetPos, Math.min(1, delta * 3.5));
  });

  return null;
}

export default function PerfumeFlaconCanvas({
  edition,
  brandName,
  viewMode,
  reducedMotion,
}: FlaconSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.05, 4.85], fov: 36, near: 0.1, far: 30 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
      }}
      className="h-full w-full touch-pan-y"
    >
      <StudioCameraRig viewMode={viewMode} />

      <ambientLight intensity={0.45} color="#FFFDF8" />
      <directionalLight
        position={[3.5, 5.2, 4.0]}
        intensity={1.55}
        color="#FFF8EB"
      />
      <directionalLight
        position={[-4.0, 2.5, -2.5]}
        intensity={0.75}
        color="#E9EFF5"
      />
      <pointLight position={[0, -1.9, 1.4]} intensity={0.7} color="#E5C06E" />

      {/* 100% Autonomous Photo Studio Environment (zero external HDR URL) */}
      <Environment resolution={256}>
        <group rotation={[0, 0, 0]}>
          {/* Left vertical studio softbox (creates iconic bottle edge highlight) */}
          <Lightformer
            form="rect"
            intensity={3.6}
            color="#FFFFFF"
            scale={[1.8, 7.5, 1]}
            position={[-4.2, 0.8, 2.4]}
            target={[0, 0, 0]}
          />
          {/* Right warm vertical strip softbox */}
          <Lightformer
            form="rect"
            intensity={2.8}
            color="#FFF3DB"
            scale={[1.5, 7.0, 1]}
            position={[4.4, 0.6, 2.0]}
            target={[0, 0, 0]}
          />
          {/* Overhead diffused ceiling softbox */}
          <Lightformer
            form="rect"
            intensity={2.4}
            color="#FFFDF9"
            scale={[6, 4, 1]}
            position={[0, 5.5, 1.0]}
            rotation={[Math.PI / 2, 0, 0]}
          />
          {/* Golden base reflector illuminating the crystal punt */}
          <Lightformer
            form="ring"
            intensity={2.1}
            color="#E8C26B"
            scale={3.2}
            position={[0, -3.4, 0.5]}
            rotation={[-Math.PI / 2, 0, 0]}
          />
          {/* Subtle back rim light */}
          <Lightformer
            form="rect"
            intensity={1.6}
            color="#F5EFE6"
            scale={[5, 5, 1]}
            position={[0, 1.2, -5]}
          />
        </group>
      </Environment>

      <ProceduralPerfumeFlacon
        edition={edition}
        brandName={brandName}
        reducedMotion={reducedMotion}
      />

      <GoldenMistParticles reducedMotion={reducedMotion} />

      <ContactShadows
        position={[0, -1.78, 0]}
        opacity={0.34}
        scale={4.8}
        blur={2.4}
        far={2.8}
        color="#2B2318"
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.65}
        minPolarAngle={Math.PI / 2 - 0.35}
        maxPolarAngle={Math.PI / 2 + 0.28}
      />
    </Canvas>
  );
}
