import { promises as fs } from "fs";

type RouteParams = { params: Promise<{ person: string }> };

const QR_BY_PERSON = {
  groom: "/Users/admin/.cursor/projects/Users-admin-Documents-Yen/assets/image-6e95b152-854b-4931-8439-b205791df959.png",
  bride: "/Users/admin/.cursor/projects/Users-admin-Documents-Yen/assets/image-8e21e1a8-d2df-4934-b9d1-ff2751961664.png",
} as const;

export async function GET(_: Request, { params }: RouteParams) {
  const { person } = await params;
  const filePath = QR_BY_PERSON[person as keyof typeof QR_BY_PERSON];

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
