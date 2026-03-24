import { insertWish, listWishes } from "@/lib/wishDb";

export const runtime = "nodejs";

export async function GET() {
  const wishes = listWishes(100);
  return Response.json({ wishes });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    message?: string;
  };

  const name = body.name?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !message) {
    return Response.json(
      { error: "Name and message are required." },
      { status: 400 },
    );
  }

  if (name.length > 80 || message.length > 500) {
    return Response.json(
      { error: "Name or message too long." },
      { status: 400 },
    );
  }

  const wish = insertWish(name, message);
  return Response.json({ wish }, { status: 201 });
}
