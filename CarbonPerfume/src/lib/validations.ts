import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(5, "Veuillez saisir votre adresse email.")
    .email("Veuillez saisir une adresse email valide."),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const checkoutCustomerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .max(60, "Prénom trop long."),
  lastName: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(60, "Nom trop long."),
  email: z
    .string()
    .trim()
    .email("Veuillez saisir une adresse email valide."),
  phone: z
    .string()
    .trim()
    .min(8, "Veuillez saisir un numéro de téléphone valide.")
    .max(25, "Numéro de téléphone trop long."),
  address: z
    .string()
    .trim()
    .min(5, "Veuillez saisir votre adresse complète.")
    .max(180, "Adresse trop longue."),
  city: z
    .string()
    .trim()
    .min(2, "Veuillez indiquer votre ville.")
    .max(80, "Nom de ville trop long."),
  postalCode: z
    .string()
    .trim()
    .min(3, "Code postal invalide.")
    .max(12, "Code postal invalide."),
  country: z
    .string()
    .trim()
    .min(2, "Veuillez sélectionner un pays.")
    .max(60, "Nom de pays trop long."),
  giftNote: z
    .string()
    .trim()
    .max(280, "Le message cadeau ne peut pas dépasser 280 caractères.")
    .optional()
    .or(z.literal("")),
  cardHolder: z
    .string()
    .trim()
    .min(3, "Veuillez indiquer le titulaire de la carte."),
  cardNumber: z
    .string()
    .trim()
    .regex(/^[\d\s]{16,23}$/, "Numéro de carte simulé à 16 chiffres requis."),
  cardExpiry: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format MM/AA requis."),
  cardCvc: z
    .string()
    .trim()
    .regex(/^\d{3,4}$/, "Code CVC à 3 ou 4 chiffres requis."),
});

export type CheckoutCustomerFormValues = z.infer<typeof checkoutCustomerSchema>;

export const orderItemInputSchema = z.object({
  variantId: z.string().min(1, "Variante invalide."),
  quantity: z.number().int().min(1).max(20),
});

export const createOrderServerSchema = z.object({
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(60),
  email: z.string().trim().email(),
  phone: z.string().trim().min(8).max(25),
  address: z.string().trim().min(5).max(180),
  city: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(3).max(12),
  country: z.string().trim().min(2).max(60),
  giftNote: z.string().trim().max(280).optional().or(z.literal("")),
  items: z
    .array(orderItemInputSchema)
    .min(1, "Votre panier est vide."),
});

export type CreateOrderServerInput = z.infer<typeof createOrderServerSchema>;

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Veuillez saisir le mot de passe administrateur."),
});

export const orderStatusValues = [
  "PENDING",
  "PAID",
  "PREPARING",
  "SHIPPED",
  "CANCELLED",
] as const;

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(orderStatusValues),
});

export const updateVariantSchema = z.object({
  variantId: z.string().min(1),
  priceEuros: z
    .number()
    .min(1, "Le prix doit être supérieur à 1 €.")
    .max(5000, "Prix maximum dépassé."),
  stock: z
    .number()
    .int("Le stock doit être un nombre entier.")
    .min(0, "Le stock ne peut pas être négatif.")
    .max(10000, "Stock maximum dépassé."),
});
