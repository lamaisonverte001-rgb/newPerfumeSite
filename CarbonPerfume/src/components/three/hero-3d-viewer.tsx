"use client";

import React, { Component, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Eye, Move3d, ArrowUpRight } from "lucide-react";
import {
  BRAND_CONFIG,
  HERO_BOTTLE_EDITIONS,
  type HeroBottleEdition,
} from "@/config/brand";
import type { CameraViewMode } from "./perfume-flacon-scene";
import { cn } from "@/lib/utils";

const PerfumeFlaconCanvas = dynamic(() => import("./perfume-flacon-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="h-14 w-14 animate-pulse rounded-full border border-[#A68352]/40 bg-[#F2EDE6]" />
      <span className="text-[11px] uppercase tracking-[0.24em] text-[#6B655E]">
        Préparation de l&apos;écrin 3D…
      </span>
    </div>
  ),
});

interface WebGLErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<
  WebGLErrorBoundaryProps,
  WebGLErrorBoundaryState
> {
  constructor(props: WebGLErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

let cachedWebGLSupport: boolean | null = null;

function getWebGLSnapshot(): boolean {
  if (typeof window === "undefined") return true;
  if (cachedWebGLSupport !== null) return cachedWebGLSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    cachedWebGLSupport = Boolean(gl);
  } catch {
    cachedWebGLSupport = false;
  }
  return cachedWebGLSupport;
}

const noopSubscribe = () => () => {};

function subscribeReducedMotion(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Hero3DViewer() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<CameraViewMode>("studio");

  const webglSupported = useSyncExternalStore(
    noopSubscribe,
    getWebGLSnapshot,
    () => true
  );
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  const currentEdition: HeroBottleEdition =
    HERO_BOTTLE_EDITIONS[selectedIndex] ?? HERO_BOTTLE_EDITIONS[0];

  const fallbackView = (
    <div className="relative flex h-full w-full items-center justify-center p-8">
      <div className="relative h-[420px] w-[340px] sm:h-[480px] sm:w-[390px]">
        <Image
          src={currentEdition.fallbackImage}
          alt={`${currentEdition.name} — ${BRAND_CONFIG.name}`}
          fill
          priority
          sizes="(max-width: 768px) 340px, 420px"
          className="object-contain drop-shadow-xl transition-all duration-500"
        />
      </div>
    </div>
  );

  return (
    <div className="relative flex h-[540px] w-full flex-col justify-between overflow-hidden border border-[#E5DFD5] bg-gradient-to-b from-[#F6F2EB] via-[#F2EDE6] to-[#EAE2D6] sm:h-[620px] lg:h-[680px]">
      {/* Ambient radial halo adapted to selected edition */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30 transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 44%, ${currentEdition.ambientGlow}44 0%, transparent 66%)`,
        }}
      />

      {/* Top HUD bar inside studio frame */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-7 sm:pt-6">
        <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] text-[#6B655E]">
          <Move3d className="h-3.5 w-3.5 text-[#A68352]" />
          <span>Rotation 360° Interactive</span>
        </div>

        {webglSupported && (
          <button
            type="button"
            id="hero-3d-toggle-detail"
            onClick={() =>
              setViewMode((prev) => (prev === "studio" ? "detail" : "studio"))
            }
            className={cn(
              "inline-flex items-center gap-2 border px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] transition-all cursor-pointer",
              viewMode === "detail"
                ? "border-[#161616] bg-[#161616] text-[#FAF8F5]"
                : "border-[#E5DFD5] bg-[#FAF8F5]/80 text-[#161616] hover:border-[#A68352]"
            )}
          >
            <Eye className="h-3 w-3" />
            {viewMode === "detail" ? "Vue Studio" : "Vue Détail"}
          </button>
        )}
      </div>

      {/* Main 3D WebGL Canvas or Graceful 2D HD Fallback */}
      <div className="relative z-0 flex-1 cursor-grab active:cursor-grabbing">
        {webglSupported ? (
          <WebGLErrorBoundary fallback={fallbackView}>
            <PerfumeFlaconCanvas
              edition={currentEdition}
              brandName={BRAND_CONFIG.name}
              viewMode={viewMode}
              reducedMotion={reducedMotion}
            />
          </WebGLErrorBoundary>
        ) : (
          fallbackView
        )}
      </div>

      {/* Bottom Interactive Edition Switcher */}
      <div className="relative z-10 border-t border-[#E5DFD5]/80 bg-[#FAF8F5]/85 px-5 py-4 backdrop-blur-md sm:px-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B655E]">
              {currentEdition.family}
            </p>
            <Link
              href={`/parfums/${currentEdition.slug}`}
              className="group inline-flex items-center gap-1.5 font-serif text-xl text-[#161616] transition-colors hover:text-[#A68352]"
            >
              <span>{currentEdition.name}</span>
              <ArrowUpRight className="h-4 w-4 text-[#A68352] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div
            role="tablist"
            aria-label="Sélectionner l'édition du flacon 3D"
            className="flex flex-wrap items-center gap-2"
          >
            {HERO_BOTTLE_EDITIONS.map((ed, idx) => {
              const active = idx === selectedIndex;
              return (
                <button
                  key={ed.slug}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Afficher le flacon ${ed.name}`}
                  onClick={() => setSelectedIndex(idx)}
                  className={cn(
                    "group relative flex h-7 w-7 items-center justify-center rounded-full border transition-all cursor-pointer",
                    active
                      ? "scale-110 border-[#161616] ring-2 ring-[#A68352]/35"
                      : "border-[#E5DFD5] opacity-75 hover:opacity-100"
                  )}
                  title={ed.name}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-[#C89D46]/60"
                    style={{ backgroundColor: ed.labelBg }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
