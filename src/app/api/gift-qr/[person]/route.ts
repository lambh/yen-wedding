import { promises as fs } from "fs";
import path from "path";

type RouteParams = { params: Promise<{ person: string }> };

const QR_BY_PERSON: Record<string, string> = {
  groom: path.join(process.cwd(), "public", "qr", "groom.png"),
  bride: path.join(process.cwd(), "public", "qr", "bride.png"),
};

export async function GET(_: Request, { params }: RouteParams) {
  const { person } = await params;

  const filePath = QR_BY_PERSON[person];

  if (!filePath) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const fileBuffer = await fs.readFile(filePath);
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
