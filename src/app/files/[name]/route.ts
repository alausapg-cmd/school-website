import { promises as fs } from "fs";
import path from "path";
import { currentUser } from "@/lib/auth";
import { UPLOAD_DIR } from "@/lib/files";

const TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".txt": "text/plain; charset=utf-8",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export async function GET(_req: Request, ctx: RouteContext<"/files/[name]">) {
  if (!(await currentUser())) return new Response("Please log in", { status: 401 });
  const { name } = await ctx.params;
  const base = path.basename(name);
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, base));
    const type = TYPES[path.extname(base).toLowerCase()] ?? "application/octet-stream";
    return new Response(data, {
      headers: { "Content-Type": type, "Content-Disposition": `inline; filename="${base.replace(/^f_[^-]+-/, "")}"` },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
