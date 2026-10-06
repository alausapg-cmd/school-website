import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { buildSeed } from "./seed";
import type { DB } from "./types";

// Demo data store: a JSON file on disk. In production this is replaced by
// Supabase (see supabase/schema.sql). Hosts like Vercel only allow writing to
// /tmp, so the demo data lives there (and resets when the server restarts).
export const DATA_DIR = process.env.VERCEL ? "/tmp/school-data" : path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

let cache: DB | null = null;
let queue: Promise<unknown> = Promise.resolve();

async function load(): Promise<DB> {
  if (cache) return cache;
  try {
    cache = JSON.parse(await fs.readFile(DB_PATH, "utf8")) as DB;
  } catch {
    cache = buildSeed();
    await save(cache);
  }
  return cache;
}

async function save(db: DB) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export async function getDB(): Promise<DB> {
  return load();
}

export function mutate<T>(fn: (db: DB) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await load();
    const out = await fn(db);
    await save(db);
    return out;
  });
  queue = run.catch(() => undefined);
  return run;
}

export async function resetDB() {
  cache = buildSeed();
  await save(cache);
}
