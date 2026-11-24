import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { BRAND_CONFIG } from "@/config/brand";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND_CONFIG.name} — Haute Parfumerie de Niche`,
    template: `%s | ${BRAND_CONFIG.name}`,
  },
  description:
    "Maison de haute parfumerie contemporaine. Extraits intenses composés à Grasse à partir de matières premières naturelles d'exception.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${jakarta.variable}`}
    >
      <body className="min-h-screen bg-[#FAF8F5] font-sans text-[#161616] antialiased flex flex-col">
        <SmoothScrollProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#FAF8F5",
                color: "#161616",
                border: "1px solid #E5DFD5",
                borderRadius: "0px",
                fontFamily: "var(--font-jakarta), sans-serif",
                fontSize: "13px",
              },
            }}
          />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
