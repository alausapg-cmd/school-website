import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { DATA_DIR } from "./db";
import { newId } from "./format";

export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

// Saves an uploaded file and returns its public URL, or null when no file was chosen.
export async function saveUpload(file: FormDataEntryValue | null) {
  if (!file || typeof file === "string" || file.size === 0) return null;
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
  const stored = `${newId("f")}-${safe}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, stored), Buffer.from(await file.arrayBuffer()));
  return { fileUrl: `/files/${stored}`, fileName: file.name };
}
