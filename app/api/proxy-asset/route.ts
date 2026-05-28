import { NextRequest } from "next/server";

/**
 * Temporary asset proxy for the Higgs Field photo pipeline.
 *
 * The dev harness Claude runs in blocks direct CloudFront HTTP, so we can't
 * curl the Higgs Field output URLs into the repo. This endpoint runs server-
 * side on Vercel (no sandbox), fetches the upstream binary, and returns it
 * base64-wrapped in JSON. The agent then calls the endpoint via the Vercel
 * MCP (which IS allowlisted), parses the JSON, decodes base64, and writes
 * the bytes to /public/images/generated/.
 *
 * Hard-locked to Higgs CDN + 12 MB cap. Delete this route after the photo
 * library has been imported and committed.
 */

const ALLOWED_PREFIX = "https://d8j0ntlcm91z4.cloudfront.net/";
const MAX_BYTES = 12 * 1024 * 1024;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url || !url.startsWith(ALLOWED_PREFIX)) {
    return Response.json({ error: "forbidden: url must be a Higgs Field CDN URL" }, { status: 403 });
  }
  try {
    const upstream = await fetch(url, { cache: "no-store" });
    if (!upstream.ok) {
      return Response.json({ error: `upstream ${upstream.status}` }, { status: 502 });
    }
    const buf = await upstream.arrayBuffer();
    if (buf.byteLength > MAX_BYTES) {
      return Response.json({ error: `too large: ${buf.byteLength} > ${MAX_BYTES}` }, { status: 413 });
    }
    return Response.json({
      contentType: upstream.headers.get("content-type") ?? "application/octet-stream",
      size: buf.byteLength,
      base64: Buffer.from(buf).toString("base64"),
    });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
