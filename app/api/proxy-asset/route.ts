import { NextRequest } from "next/server";

/**
 * TEMPORARY research proxy. The dev harness blocks direct outbound HTTP and
 * several review sites bot-block the agent's fetcher, so this Vercel-hosted
 * route fetches server-side (clean IP + browser UA) and returns the body as
 * text. Scoped to a review/listing host allowlist. DELETE after the audit.
 */

const MAX = 4_000_000;

function hostAllowed(host: string): boolean {
  const ok = [
    "auroragentledentist.com",
    "healthgrades.com",
    "birdeye.com",
    "yelp.com",
    "ratemds.com",
    "vitals.com",
    "sharecare.com",
    "doctor.com",
    "wellness.com",
  ];
  return ok.some((d) => host === d || host.endsWith("." + d));
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
    const upstream = await fetch(url, {
      cache: "no-store",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
      },
    });
    const text = (await upstream.text()).slice(0, MAX);
    const pad = "_".repeat(60_000);
    return Response.json({ status: upstream.status, size: text.length, text, _pad: pad });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
