import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { MAX_UPLOAD_BYTES, deleteUpload, isAllowedImageType, isUploadId, listUploads, saveUpload } from "@/lib/uploads";

/** Multipart image upload from the page builder (field name: file). Stored in Redis, served from /api/uploads/[id]. */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected multipart form data" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });
  if (!isAllowedImageType(file.type)) return NextResponse.json({ ok: false, error: "Only JPG, PNG, WebP, GIF, AVIF or SVG images" }, { status: 415 });
  if (file.size > MAX_UPLOAD_BYTES) return NextResponse.json({ ok: false, error: "Image is larger than 4 MB. Compress it first (squoosh.app works well)." }, { status: 413 });
  const bytes = Buffer.from(await file.arrayBuffer());
  const meta = await saveUpload({ type: file.type, name: file.name, bytes });
  return NextResponse.json({ ok: true, id: meta.id, url: `/api/uploads/${meta.id}`, size: meta.size, type: meta.type });
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const uploads = await listUploads();
  return NextResponse.json({ ok: true, uploads: uploads.map((u) => ({ ...u, url: `/api/uploads/${u.id}` })) });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id") || "";
  if (!isUploadId(id)) return NextResponse.json({ ok: false, error: "Bad id" }, { status: 400 });
  await deleteUpload(id);
  return NextResponse.json({ ok: true });
}
