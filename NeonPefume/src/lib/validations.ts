import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Veuillez renseigner votre adresse e-mail.")
    .email("Veuillez saisir une adresse e-mail valide."),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const checkoutFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Le prénom doit contenir au moins 2 caractères."),
  lastName: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères."),
  customerEmail: z
    .string()
    .trim()
    .email("Adresse e-mail invalide."),
  customerPhone: z
    .string()
    .trim()
    .min(8, "Veuillez indiquer un numéro de téléphone valide."),
  shippingAddress: z
    .string()
    .trim()
    .min(5, "Veuillez indiquer votre adresse complète."),
  shippingCity: z
    .string()
    .trim()
    .min(2, "Veuillez indiquer votre ville."),
  shippingPostalCode: z
    .string()
    .trim()
    .min(3, "Code postal invalide."),
  shippingCountry: z
    .string()
    .trim()
    .min(2, "Veuillez sélectionner un pays."),
  giftNote: z
    .string()
    .trim()
    .max(300, "Le message cadeau ne doit pas dépasser 300 caractères.")
    .optional()
    .or(z.literal("")),
  cardHolder: z
    .string()
    .trim()
    .min(2, "Nom du titulaire requis."),
  cardNumber: z
    .string()
    .trim()
    .refine(
      (val) => val.replace(/\s+/g, "").length >= 16 && /^\d+$/.test(val.replace(/\s+/g, "")),
      "Numéro de carte invalide (16 chiffres)."
    ),
  cardExpiry: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format attendu : MM/AA"),
  cardCvc: z
    .string()
    .trim()
    .regex(/^\d{3,4}$/, "Code CVC invalide."),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export const createOrderApiSchema = z.object({
  customerName: z.string().trim().min(2),
  customerEmail: z.string().trim().email(),
  customerPhone: z.string().trim().min(8),
  shippingAddress: z.string().trim().min(5),
  shippingCity: z.string().trim().min(2),
  shippingPostalCode: z.string().trim().min(3),
  shippingCountry: z.string().trim().min(2),
  giftNote: z.string().trim().max(300).optional(),
  items: z
    .array(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1, "Le panier est vide."),
});

export type CreateOrderApiInput = z.infer<typeof createOrderApiSchema>;

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Veuillez saisir le mot de passe."),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "PREPARING", "SHIPPED", "CANCELLED"]),
});

export const updateVariantSchema = z.object({
  priceCents: z.number().int().min(1000).max(500000),
  stock: z.number().int().min(0).max(10000),
});
