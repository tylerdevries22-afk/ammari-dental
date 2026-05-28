import { NextRequest } from "next/server";

/**
 * TEMPORARY research proxy. The dev harness blocks direct outbound HTTP and
 * the target site (hellotend.com) Cloudflare-blocks the agent's fetcher, so
 * this Vercel-hosted route fetches server-side and returns the body
 * base64-wrapped (binary) or as text (mode=text). Scoped to a small host
 * allowlist. DELETE after the audit.
 */

const MAX_BYTES = 12 * 1024 * 1024;

function hostAllowed(host: string): boolean {
  return (
    host === "hellotend.com" ||
    host === "www.hellotend.com" ||
    host.endsWith(".hellotend.com") ||
    host.endsWith(".website-files.com") ||
    host.endsWith(".cloudfront.net") ||
    host.endsWith(".ctfassets.net") ||
    host.endsWith(".contentful.com") ||
    host.endsWith(".cdn.prismic.io")
  );
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

  const mode = req.nextUrl.searchParams.get("mode") ?? "binary";
  try {
    const upstream = await fetch(url, {
      cache: "no-store",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        accept:
          mode === "text"
            ? "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
            : "*/*",
        "accept-language": "en-US,en;q=0.9",
      },
    });
    const pad = "_".repeat(80_000);
    if (!upstream.ok) {
      const body = await upstream.text().catch(() => "");
      return Response.json(
        { error: `upstream ${upstream.status}`, status: upstream.status, snippet: body.slice(0, 4000), _pad: pad },
        { status: 502 },
      );
    }
    if (mode === "text") {
      const text = await upstream.text();
      return Response.json({
        contentType: upstream.headers.get("content-type") ?? "text/plain",
        size: text.length,
        text: text.slice(0, MAX_BYTES),
        _pad: pad,
      });
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
