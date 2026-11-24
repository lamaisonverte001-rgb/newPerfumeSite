import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[75vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#A68352]">
        Erreur 404
      </p>
      <h1 className="mt-3 font-serif text-5xl font-light text-[#161616]">
        Page introuvable
      </h1>
      <p className="mt-4 text-sm text-[#6B655E]">
        La création ou la commande que vous recherchez semble s&apos;être
        évaporée.
      </p>
      <Button asChild className="mt-8" size="lg">
        <Link href="/">Retour à la Maison</Link>
      </Button>
    </div>
  );
}
