import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDB } from "./db";
import type { Role, User } from "./types";

const COOKIE = "school_session";
const SECRET = process.env.SESSION_SECRET ?? "dev-only-secret-change-me";

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export async function setSession(userId: string) {
  const jar = await cookies();
  jar.set(COOKIE, `${userId}.${sign(userId)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

export async function currentUser(): Promise<User | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [id, sig] = raw.split(".");
  if (!id || !sig || sig.length !== 64) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(sign(id)))) return null;
  const db = await getDB();
  return db.users.find((u) => u.id === id) ?? null;
}

export async function requireUser(...roles: Role[]): Promise<User> {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (roles.length && !roles.includes(user.role)) redirect("/portal");
  return user;
}
