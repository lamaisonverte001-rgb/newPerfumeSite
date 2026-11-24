"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { BRAND_CONFIG } from "@/config/brand";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Accès refusé.");
        return;
      }

      toast.success("Connexion administrateur établie.");
      router.refresh();
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-6 pt-24 pb-20">
      <div className="border border-[#E5DFD5] bg-[#FAF8F5] p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E5DFD5] bg-[#F2EDE6] text-[#A68352]">
            <Lock className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.26em] text-[#A68352]">
            {BRAND_CONFIG.name}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-light text-[#161616]">
            Atelier Administration
          </h1>
          <p className="mt-2 text-xs text-[#6B655E]">
            Accès réservé à la gestion des commandes, des stocks et du cercle
            privé.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="admin-password"
              className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655E]"
            >
              Mot de passe
            </label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-xs text-[#8B2C2C]" role="alert">
                {error}
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? "Vérification..." : "Accéder au Back-Office"}
          </Button>
        </form>
      </div>
    </div>
  );
}
