"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { loginAdminAction } from "@/actions/admin";
import { BRAND_CONFIG } from "@/config/brand";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await loginAdminAction(password);
    setLoading(false);

    if (!res.ok) {
      setError(res.message);
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-[78vh] max-w-md flex-col justify-center px-5 pt-28 pb-20">
      <div className="border border-[#E5DFD5] bg-[#FFFDF9] p-8 sm:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#E5DFD5] bg-[#F2EDE6] text-[#A68352]">
          <Lock className="h-5 w-5 stroke-[1.5]" />
        </div>

        <p className="mt-5 text-center text-[11px] uppercase tracking-[0.26em] text-[#A68352]">
          {BRAND_CONFIG.name}
        </p>
        <h1 className="mt-2 text-center font-serif text-3xl text-[#161616]">
          Atelier d&apos;Administration
        </h1>
        <p className="mt-2 text-center text-xs leading-relaxed text-[#6B655E]">
          Accès réservé à la gestion des commandes, des stocks et du Cercle Privé.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-[#6B655E]"
            >
              Mot de passe administrateur
            </label>
            <Input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              aria-invalid={Boolean(error)}
            />
            {error && (
              <p role="alert" className="mt-1.5 text-xs text-[#9B2C2C]">
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            id="admin-login-submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Vérification…" : "Accéder au Back-Office"}
          </Button>
        </form>
      </div>
    </div>
  );
}
