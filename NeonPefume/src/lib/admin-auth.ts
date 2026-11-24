import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "lmv_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 heures

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "maisonverte-admin";
}

function getSigningSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    crypto
      .createHash("sha256")
      .update(`lmv-session-secret:${getAdminPassword()}`)
      .digest("hex")
  );
}

function signPayload(payload: string): string {
  return crypto
    .createHmac("sha256", getSigningSecret())
    .update(payload)
    .digest("hex");
}

export function verifyAdminPassword(candidate: string): boolean {
  const expected = getAdminPassword();
  const a = Buffer.from(candidate, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) {
    // Comparaison à temps constant même si longueurs différentes
    crypto.timingSafeEqual(
      crypto.createHash("sha256").update(a).digest(),
      crypto.createHash("sha256").update(b).digest()
    );
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

export function createAdminSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const nonce = crypto.randomBytes(12).toString("hex");
  const payload = `${expiresAt}.${nonce}`;
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [expiresStr, nonce, providedSig] = parts;
  const expiresAt = Number(expiresStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  const payload = `${expiresStr}.${nonce}`;
  const expectedSig = signPayload(payload);

  const a = Buffer.from(providedSig, "utf8");
  const b = Buffer.from(expectedSig, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}
