import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Commande & Expédition",
  description: "Finalisez votre commande Carbon Perfume en toute sécurité.",
};

export default function CheckoutPage() {
  const stripeEnabled = Boolean(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()
  );

  return <CheckoutClient stripeEnabled={stripeEnabled} />;
}
