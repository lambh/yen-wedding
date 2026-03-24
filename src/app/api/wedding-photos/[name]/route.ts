import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { WEDDING_PHOTO_NAMES } from "@/lib/weddingPhotoSource";

type RouteParams = { params: Promise<{ name: string }> };

// In-memory resize cache: key = `${name}:${width}`, value = WebP buffer
const resizeCache = new Map<string, Uint8Array>();

const WIDTHS = {
  thumb: 480,  // cloud thumbnails
  full: 1400,  // lightbox
} as const;

export async function GET(request: Request, { params }: RouteParams) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  if (!WEDDING_PHOTO_NAMES.includes(decodedName as (typeof WEDDING_PHOTO_NAMES)[number])) {
    return new Response("Not found", { status: 404 });
  }

  const url = new URL(request.url);
  const sizeParam = url.searchParams.get("s");
  const width = sizeParam === "full" ? WIDTHS.full : WIDTHS.thumb;
  const cacheKey = `${decodedName}:${width}`;

  if (resizeCache.has(cacheKey)) {
    return new Response(resizeCache.get(cacheKey)!.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  }

  const filePath = path.join(process.cwd(), "public", "photos", decodedName);

  try {
    const raw = await fs.readFile(filePath);
    const webpBuffer = await sharp(raw)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: sizeParam === "full" ? 88 : 78 })
      .toBuffer();
    const webp = new Uint8Array(webpBuffer);

    resizeCache.set(cacheKey, webp);

    return new Response(webp.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
