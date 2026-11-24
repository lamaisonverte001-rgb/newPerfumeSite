"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { BRAND_CONFIG } from "@/config/brand";
import { useCartStore, selectCartCount } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const emptySubscribe = () => () => {};

const NAV_LINKS = [
  { href: "/#collection", label: "La Collection" },
  { href: "/#savoir-faire", label: "L'Art du Sillage" },
  { href: "/#diagnostic", label: "Diagnostic Olfactif" },
  { href: "/admin", label: "Atelier Admin" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const openCart = useCartStore((s) => s.openCart);
  const cartCount = useCartStore(selectCartCount);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-500",
          scrolled
            ? "border-b border-[#E5DFD5] bg-[#FAF8F5]/85 backdrop-blur-md py-3.5"
            : "border-b border-transparent bg-transparent py-5"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* Navigation gauche desktop / menu burger mobile */}
          <div className="flex items-center gap-6 lg:flex-1">
            <button
              type="button"
              aria-label="Ouvrir la navigation"
              onClick={() => setMobileOpen(true)}
              className="p-1.5 text-[#161616] hover:text-[#A68352] transition-colors lg:hidden cursor-pointer"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <nav
              aria-label="Navigation principale"
              className="hidden items-center gap-8 lg:flex"
            >
              {NAV_LINKS.slice(0, 2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#161616] transition-colors hover:text-[#A68352]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Logo central & Signature Maison */}
          <Link
            href="/"
            className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A68352]"
          >
            <div className="relative h-7 w-12 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={BRAND_CONFIG.logoPath}
                alt={`Monogramme ${BRAND_CONFIG.monogram}`}
                fill
                priority
                sizes="48px"
                className="object-contain"
              />
            </div>
            <div className="hidden sm:flex flex-col border-l border-[#E5DFD5] pl-3">
              <span className="font-serif text-base font-medium tracking-[0.24em] text-[#161616]">
                {BRAND_CONFIG.name}
              </span>
              <span className="text-[9px] uppercase tracking-[0.24em] text-[#6B655E]">
                Parfumerie · Grasse
              </span>
            </div>
          </Link>

          {/* Navigation droite + Panier */}
          <div className="flex items-center justify-end gap-8 lg:flex-1">
            <nav
              aria-label="Navigation secondaire"
              className="hidden items-center gap-8 lg:flex"
            >
              {NAV_LINKS.slice(2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#161616] transition-colors hover:text-[#A68352]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              onClick={openCart}
              aria-label="Ouvrir le panier"
              className="group relative inline-flex items-center gap-2 py-1 text-[#161616] transition-colors hover:text-[#A68352] cursor-pointer"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] sm:inline">
                Panier
              </span>
              <AnimatePresence mode="popLayout">
                {mounted && cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#A68352] px-1.5 text-[10px] font-semibold text-[#FAF8F5]"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="max-w-xs p-0">
          <SheetHeader>
            <SheetTitle>{BRAND_CONFIG.name}</SheetTitle>
            <SheetDescription>{BRAND_CONFIG.tagline}</SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col divide-y divide-[#E5DFD5] px-6 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-4 text-xs font-medium uppercase tracking-[0.2em] text-[#161616] hover:text-[#A68352] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
