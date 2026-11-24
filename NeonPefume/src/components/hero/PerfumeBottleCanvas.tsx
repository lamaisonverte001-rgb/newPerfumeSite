"use client";

import React, { Component, useEffect, useState } from "react";
import Image from "next/image";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  OrbitControls,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";
import {
  ProceduralBottle,
  type BottleVisualConfig,
} from "@/components/hero/ProceduralBottle";

export type HeroCameraMode = "studio" | "detail";

interface PerfumeBottleCanvasProps {
  bottle: BottleVisualConfig;
  fallbackImageUrl: string;
  cameraMode: HeroCameraMode;
}

function CameraRig({ mode }: { mode: HeroCameraMode }) {
  const { camera } = useThree();
  const targetPos = React.useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (mode === "detail") {
      targetPos.set(0.32, 0.14, 3.85);
    } else {
      targetPos.set(0, 0.18, 5.75);
    }
    const damp = 1 - Math.exp(-3.4 * delta);
    camera.position.lerp(targetPos, damp);
  });

  return null;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

function FallbackBottleVisual({
  imageUrl,
  name,
}: {
  imageUrl: string;
  name: string;
}) {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-8">
      <div className="relative h-[420px] w-[320px] sm:h-[490px] sm:w-[370px]">
        <Image
          src={imageUrl}
          alt={`Flacon ${name}`}
          fill
          priority
          sizes="(max-width: 768px) 320px, 420px"
          className="object-contain drop-shadow-[0_28px_40px_rgba(36,28,18,0.16)]"
        />
      </div>
    </div>
  );
}

export default function PerfumeBottleCanvas({
  bottle,
  fallbackImageUrl,
  cameraMode,
}: PerfumeBottleCanvasProps) {
  const [webglReady] = useState<boolean>(() => checkWebGLSupport());
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const fallback = (
    <FallbackBottleVisual imageUrl={fallbackImageUrl} name={bottle.name} />
  );

  if (!webglReady) {
    return fallback;
  }

  return (
    <WebGLErrorBoundary fallback={fallback}>
      <div
        className="relative h-full w-full cursor-grab active:cursor-grabbing"
        aria-label={`Modèle 3D interactif du flacon ${bottle.name}`}
      >
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0.18, 5.75], fov: 34, near: 0.1, far: 50 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.08,
          }}
        >
          {/* Éclairage studio haute parfumerie 100 % autonome (aucun HDR externe) */}
          <ambientLight intensity={0.42} color="#FFF9F0" />
          <directionalLight
            position={[4.5, 6, 4.5]}
            intensity={1.35}
            color="#FFF4DF"
          />
          <directionalLight
            position={[-4.5, 2.5, -2.5]}
            intensity={0.75}
            color="#F5EDE0"
          />
          <pointLight
            position={[0, -0.4, -2.2]}
            intensity={1.6}
            distance={8}
            color="#F5D387"
          />

          <Environment resolution={256} frames={1}>
            {/* Grande boîte à lumière zénithale */}
            <Lightformer
              form="rect"
              intensity={2.4}
              color="#FFFDF8"
              position={[0, 6, 1]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[8, 4, 1]}
            />
            {/* Stripbox verticale gauche (reflet signature sur le verre cylindrique) */}
            <Lightformer
              form="rect"
              intensity={3.6}
              color="#FFF9EC"
              position={[-4.8, 0.8, 2.6]}
              rotation={[0, Math.PI / 2.6, 0]}
              scale={[1.4, 8, 1]}
            />
            {/* Stripbox verticale droite chaude */}
            <Lightformer
              form="rect"
              intensity={2.8}
              color="#FBE8C2"
              position={[4.8, 0.5, 2.2]}
              rotation={[0, -Math.PI / 2.5, 0]}
              scale={[1.2, 7.5, 1]}
            />
            {/* Contre-jour doré derrière le flacon pour illuminer le jus */}
            <Lightformer
              form="circle"
              intensity={3.2}
              color="#FFE5A8"
              position={[0, 0.1, -5]}
              scale={4.2}
            />
            {/* Réflecteur bas chaud pour révéler le dôme de cristal (punt) */}
            <Lightformer
              form="ring"
              intensity={1.8}
              color="#F4D799"
              position={[0, -3.5, 0.5]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={4}
            />
          </Environment>

          <Float
            speed={reducedMotion ? 0 : 1.35}
            rotationIntensity={reducedMotion ? 0 : 0.08}
            floatIntensity={reducedMotion ? 0 : 0.24}
            floatingRange={[-0.06, 0.06]}
          >
            <ProceduralBottle bottle={bottle} reducedMotion={reducedMotion} />
          </Float>

          {!reducedMotion && (
            <Sparkles
              count={24}
              scale={[3.4, 3.8, 2.6]}
              size={1.6}
              speed={0.22}
              opacity={0.42}
              color="#C8A563"
            />
          )}

          <ContactShadows
            position={[0, -1.78, 0]}
            opacity={0.34}
            scale={5.4}
            blur={2.4}
            far={3.4}
            color="#3A2F20"
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.05}
            minPolarAngle={Math.PI / 3.4}
            maxPolarAngle={Math.PI / 1.85}
            rotateSpeed={0.65}
          />

          <CameraRig mode={cameraMode} />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
