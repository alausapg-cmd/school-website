"use server";

import { redirect } from "next/navigation";
import { mutate } from "@/lib/db";
import { newId } from "@/lib/format";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim().slice(0, 500);

// Public online admission form. No login needed.
export async function submitApplication(formData: FormData) {
  if (str(formData, "website")) redirect("/apply?sent=1"); // honeypot for bots
  const childName = str(formData, "childName");
  const parentName = str(formData, "parentName");
  const phone = str(formData, "phone");
  if (!childName || !parentName || !phone) redirect("/apply?error=1");
  await mutate((db) => {
    db.applications.push({
      id: newId("app"),
      childName,
      gender: str(formData, "gender") === "Male" ? "Male" : "Female",
      dob: str(formData, "dob"),
      classWanted: str(formData, "classWanted"),
      boarding: str(formData, "boarding") === "yes",
      parentName,
      phone,
      email: str(formData, "email"),
      address: str(formData, "address"),
      previousSchool: str(formData, "previousSchool"),
      status: "pending",
      note: "",
      createdAt: new Date().toISOString(),
    });
  });
  redirect("/apply?sent=1");
}
