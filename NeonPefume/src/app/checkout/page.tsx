import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Commande",
  description: "Finalisez votre commande en toute sérénité.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
