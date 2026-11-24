"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { BRAND_CONFIG } from "@/config/brand";
import { useCartStore, computeCartTotals } from "@/store/cart-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/#collection", label: "La Collection" },
  { href: "/#savoir-faire", label: "L'Art du Sillage" },
  { href: "/#diagnostic", label: "Signature Olfactive" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [openMenuPathname, setOpenMenuPathname] = useState<string | null>(null);
  const mobileMenuOpen = openMenuPathname === pathname;

  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const openCart = useCartStore((s) => s.openCart);

  const { totalCount } = computeCartTotals(items);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showFrosted = scrolled || !isHome || mobileMenuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        showFrosted
          ? "border-b border-[#E5DFD5] bg-[#FAF8F5]/88 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Mobile menu button */}
        <div className="flex flex-1 items-center lg:hidden">
          <button
            type="button"
            id="mobile-nav-trigger"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() =>
              setOpenMenuPathname((prev) =>
                prev === pathname ? null : pathname
              )
            }
            className="inline-flex h-10 w-10 items-center justify-center text-[#161616] transition-colors hover:text-[#A68352] cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 stroke-[1.5]" />
            ) : (
              <Menu className="h-5 w-5 stroke-[1.5]" />
            )}
          </button>
        </div>

        {/* Desktop Left Navigation */}
        <nav
          aria-label="Navigation principale"
          className="hidden flex-1 items-center gap-9 lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#161616]/80 transition-colors hover:text-[#A68352]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Center Brand Identity */}
        <Link
          href="/"
          aria-label={`${BRAND_CONFIG.name} — Accueil`}
          className="group flex flex-col items-center justify-center text-center"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative h-6 w-11 opacity-90 transition-opacity group-hover:opacity-100">
              <Image
                src={BRAND_CONFIG.logoUrl}
                alt=""
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>
            <span className="font-serif text-xl font-medium tracking-[0.22em] text-[#161616] sm:text-2xl">
              {BRAND_CONFIG.name}
            </span>
          </div>
          <span className="hidden text-[9px] uppercase tracking-[0.32em] text-[#6B655E] sm:block">
            Grasse • Paris
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex flex-1 items-center justify-end gap-5">
          <Link
            href="/checkout"
            className="hidden text-[11px] font-medium uppercase tracking-[0.2em] text-[#6B655E] transition-colors hover:text-[#161616] md:inline-block"
          >
            Commander
          </Link>

          <button
            type="button"
            id="header-cart-button"
            onClick={openCart}
            aria-label={`Ouvrir le panier (${hasHydrated ? totalCount : 0} article${totalCount > 1 ? "s" : ""})`}
            className="group relative inline-flex h-11 items-center gap-2.5 border border-transparent px-2.5 text-[#161616] transition-colors hover:border-[#E5DFD5] hover:bg-[#F2EDE6]/70 cursor-pointer"
          >
            <ShoppingBag className="h-[19px] w-[19px] stroke-[1.5] transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] sm:inline">
              Panier
            </span>
            <AnimatePresence mode="popLayout">
              {hasHydrated && totalCount > 0 && (
                <motion.span
                  key={totalCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 450, damping: 24 }}
                  className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#161616] px-1.5 text-[10px] font-medium text-[#FAF8F5]"
                >
                  {totalCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            aria-label="Menu mobile"
            className="overflow-hidden border-t border-[#E5DFD5] bg-[#FAF8F5] lg:hidden"
          >
            <div className="flex flex-col space-y-4 px-6 py-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpenMenuPathname(null)}
                  className="font-serif text-xl tracking-wide text-[#161616] transition-colors hover:text-[#A68352]"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-[#E5DFD5]" />
              <Link
                href="/checkout"
                onClick={() => setOpenMenuPathname(null)}
                className="text-xs uppercase tracking-[0.2em] text-[#6B655E] hover:text-[#161616]"
              >
                Passer la commande
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
