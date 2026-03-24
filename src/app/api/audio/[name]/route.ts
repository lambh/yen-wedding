import { promises as fs } from "fs";
import path from "path";

const AUDIO_DIR = path.join(process.cwd(), "audio");

const ALLOWED = new Set([
  "Em Đồng Ý (I Do).mp3",
  "Một Nhà.mp3",
  "Ngày Ta Có Nhau.mp3",
  "Trăm năm hạnh phúc.mp3",
]);

type RouteParams = { params: Promise<{ name: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);

  if (!ALLOWED.has(decoded)) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(AUDIO_DIR, decoded);

  try {
    const stat = await fs.stat(filePath);
    const fileSize = stat.size;

    const rangeHeader = request.headers.get("range");

    if (rangeHeader) {
      const [startStr, endStr] = rangeHeader.replace("bytes=", "").split("-");
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const fd = await fs.open(filePath, "r");
      const buffer = Buffer.allocUnsafe(chunkSize);
      await fd.read(buffer, 0, chunkSize, start);
      await fd.close();

      return new Response(buffer, {
        status: 206,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": String(chunkSize),
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    const buffer = await fs.readFile(filePath);
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Accept-Ranges": "bytes",
        "Content-Length": String(fileSize),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
