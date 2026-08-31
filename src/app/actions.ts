"use server";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { stashes } from "@/db/schema";
import { isValidCoordinates } from "@/lib/coordinates";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export type CreateStashState = { error?: string };

export async function createStash(
  _prevState: CreateStashState,
  formData: FormData,
): Promise<CreateStashState> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));
  const photo = formData.get("photo");

  if (!name) {
    return { error: "Name is required." };
  }

  if (!isValidCoordinates({ lat, lng })) {
    return { error: "Pick a location on the map first." };
  }

  let photoUrl: string | null = null;
  if (photo instanceof File && photo.size > 0) {
    if (!ALLOWED_PHOTO_TYPES.has(photo.type)) {
      return { error: "Photo must be a JPEG, PNG, or WebP image." };
    }
    const extension =
      photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
    const filename = `${randomUUID()}.${extension}`;
    await mkdir(UPLOADS_DIR, { recursive: true });
    const bytes = Buffer.from(await photo.arrayBuffer());
    await writeFile(path.join(UPLOADS_DIR, filename), bytes);
    photoUrl = `/uploads/${filename}`;
  }

  const [inserted] = await db
    .insert(stashes)
    .values({ name, description: description || null, lat, lng, photoUrl })
    .returning({ id: stashes.id });

  redirect(`/stashes/${inserted.id}`);
}

export async function deleteStash(id: number): Promise<void> {
  const [deleted] = await db
    .delete(stashes)
    .where(eq(stashes.id, id))
    .returning({ photoUrl: stashes.photoUrl });

  if (deleted?.photoUrl) {
    await unlink(path.join(process.cwd(), "public", deleted.photoUrl)).catch(() => {});
  }

  redirect("/");
}
