"use server";

import { redirect } from "next/navigation";
import { clearSession, setSession } from "@/lib/auth";
import { getDB } from "@/lib/db";

export async function login(_prev: string | null, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const db = await getDB();
  const user = db.users.find((u) => u.email === email && u.password === password);
  if (!user) return "Hmm, that email or password doesn't match. Try again!";
  await setSession(user.id);
  redirect("/portal");
}

export async function logout() {
  await clearSession();
  redirect("/login");
}
