import { NextResponse } from "next/server";
import { answer } from "@/lib/dental-kb";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };
type Body = { message?: string; history?: ChatMessage[] };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Guard the type before touching it: a non-string `message` (or a `null`
  // body) previously threw past the try/catch above and returned a bare 500.
  if (typeof body?.message !== "string") {
    return NextResponse.json({ error: "Message must be a string" }, { status: 400 });
  }

  const message = body.message.trim();
  if (!message) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }
  if (message.length > 1000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  // Shared intent matchers + KB (also drives the site-wide search palette).
  return NextResponse.json(answer(message));
}
