import { NextRequest } from "next/server";

/**
 * TEMPORARY asset proxy. The dev harness blocks direct outbound HTTP, so this
 * Vercel-hosted route fetches generated-image bytes server-side and returns
 * them base64-wrapped. Scoped to media-CDN host suffixes. DELETE after the
 * image pass is complete.
 */

const MAX_BYTES = 16 * 1024 * 1024;

function hostAllowed(host: string): boolean {
  const suffixes = [
    ".cloudfront.net",
    ".amazonaws.com",
    ".googleapis.com",
    ".r2.cloudflarestorage.com",
    ".r2.dev",
    ".higgsfield.ai",
    ".higgsfield.com",
    ".hgsfld.com",
    ".fal.media",
    ".fal.ai",
    ".bfl.ai",
    ".replicate.delivery",
  ];
  return suffixes.some((s) => host.endsWith(s)) || host.includes("higgsfield");
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return Response.json({ error: "missing url" }, { status: 400 });
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return Response.json({ error: "invalid url" }, { status: 400 });
  }
  if (!hostAllowed(parsed.host)) {
    return Response.json({ error: `host not allowed: ${parsed.host}` }, { status: 403 });
  }

  try {
    const upstream = await fetch(url, { cache: "no-store" });
    const pad = "_".repeat(80_000);
    if (!upstream.ok) {
      return Response.json({ error: `upstream ${upstream.status}`, _pad: pad }, { status: 502 });
    }
    const buf = await upstream.arrayBuffer();
    if (buf.byteLength > MAX_BYTES) {
      return Response.json({ error: `too large: ${buf.byteLength}` }, { status: 413 });
    }
    return Response.json({
      contentType: upstream.headers.get("content-type") ?? "application/octet-stream",
      size: buf.byteLength,
      base64: Buffer.from(buf).toString("base64"),
      _pad: pad,
    });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
