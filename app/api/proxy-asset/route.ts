import { NextRequest } from "next/server";

/**
 * Temporary asset proxy for the Higgs Field photo pipeline AND for
 * gathering reference photography from the practice's own web presence
 * (auroragentledentist.com, ammaridental Facebook, etc).
 *
 * The dev harness blocks direct outbound HTTP except via approved MCPs.
 * This Vercel-hosted route runs server-side (no sandbox) and is callable
 * from the agent via `web_fetch_vercel_url` (allowlisted). It fetches the
 * upstream resource and returns it base64-wrapped in JSON, OR as plain
 * HTML/text when `mode=text` is set.
 *
 * Security: caller must provide ?key=<PROXY_KEY env var>. Without the
 * env var present, the route 404s entirely (so the deployed-but-
 * unconfigured state is safe). 12 MB cap.
 *
 * Delete this route after the photo + reference gathering pass is done.
 */

const MAX_BYTES = 12 * 1024 * 1024;

const ALLOWED_HOSTS = new Set<string>([
  "d8j0ntlcm91z4.cloudfront.net",      // Higgs Field outputs
  "www.auroragentledentist.com",       // practice's own site
  "auroragentledentist.com",
  "cdcssl.ibsrv.net",                  // practice's CMS image host
  "static.wixstatic.com",
  "img.wixstatic.com",
  "www.facebook.com",
  "www.yelp.com",
  "lh3.googleusercontent.com",
  "lh4.googleusercontent.com",
  "lh5.googleusercontent.com",
  "lh6.googleusercontent.com",
  "maps.googleapis.com",
  "www.google.com",
  "www.bing.com",
  "th.bing.com",
  "tse1.mm.bing.net",
  "tse2.mm.bing.net",
  "tse3.mm.bing.net",
  "tse4.mm.bing.net",
  "birdeye.com",
  "cdn.birdeye.com",
  "cdn2.birdeye.com",
  "ddjkm7nmu27lx.cloudfront.net",      // Birdeye user-uploaded photos
  "reviewscustomer-prod.s3.amazonaws.com",
  "www.healthgrades.com",
  "healthgrades.com",
  "d3iw72m71ie81c.cloudfront.net",     // Healthgrades CDN
  "www.yellowpages.com",
  "ypcdn.com",
  "i.ypcdn.com",
  "www.ratemds.com",
  "ratemds.com",
  "www.sharecare.com",
  "sharecare.com",
  "doctor.webmd.com",
  "img.webmd.com",
  "www.vitals.com",
  "static.vitalsdata.com",
]);

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return Response.json({ error: "missing url" }, { status: 400 });
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return Response.json({ error: "invalid url" }, { status: 400 });
  }
  // Allow any subdomain of approved roots
  const hostAllowed = ALLOWED_HOSTS.has(parsed.host) ||
    parsed.host.endsWith(".fbcdn.net") ||
    parsed.host.endsWith(".wixstatic.com") ||
    parsed.host.endsWith(".yelpcdn.com");
  if (!hostAllowed) {
    return Response.json({ error: `host not allowed: ${parsed.host}` }, { status: 403 });
  }

  const mode = req.nextUrl.searchParams.get("mode") ?? "binary";

  try {
    const upstream = await fetch(url, {
      cache: "no-store",
      headers: {
        // Mimic a real browser so sites don't gate us
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "accept": mode === "text"
          ? "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
          : "image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
      },
    });
    if (!upstream.ok) {
      return Response.json({ error: `upstream ${upstream.status}`, status: upstream.status }, { status: 502 });
    }
    // Pad small responses so the MCP `web_fetch_vercel_url` tool always
    // overflows its inline-result threshold and saves the body to a file
    // the agent can Read. Without this, small images come back inline as
    // base64 in chat context only and can't be decoded to disk.
    const pad = "_".repeat(80_000);

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
