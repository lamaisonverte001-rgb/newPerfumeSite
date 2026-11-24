import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 pt-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#A68352]">
        Erreur 404
      </p>
      <h1 className="mt-4 font-serif text-4xl text-[#161616] sm:text-5xl">
        Un sillage introuvable
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[#6B655E]">
        La page ou la création recherchée n&apos;existe pas ou a quitté notre catalogue permanent.
      </p>
      <Button asChild variant="primary" className="mt-8">
        <Link href="/">Retourner à la Maison</Link>
      </Button>
    </div>
  );
}
