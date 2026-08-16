import { test, expect } from "@playwright/test";
import snapshot from "../../legacy-seo-snapshot.json" with { type: "json" };

const SAMPLE_PATHS = [
  "/",
  "/dental-services",
  "/dental-implants",
  "/teeth-whitening",
  "/dental-staff",
  "/new-patients",
  "/contact",
  "/appointment",
  "/our-dental-office-location",
  "/reviews",
  "/post-op-instructions",
];

for (const path of SAMPLE_PATHS) {
  test(`legacy URL responds 200: ${path}`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status(), `${path} should return 200`).toBe(200);
    const title = await page.title();
    expect(title.length, `${path} should have a non-empty <title>`).toBeGreaterThan(10);
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc?.length ?? 0, `${path} should have a meta description`).toBeGreaterThan(20);
  });
}

test("every legacy URL is present in the live sitemap", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.ok()).toBeTruthy();
  const body = await res.text();
  const live = new Set(
    [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
      m[1].replace(/^https?:\/\/[^/]+/, "") || "/",
    ),
  );
  const missing = snapshot.urls.filter((u: string) => !live.has(u));
  expect(missing, `${missing.length} legacy URL(s) missing`).toEqual([]);
});

/**
 * Guards the class of bug that slipped past every other gate twice: the
 * homepage "Featured Articles" tiles pointed at slugs that did not exist, and
 * the replacement pointed at bare ids that resolved root-relative. Both shipped
 * green because nothing asserted that a link on the page actually goes
 * somewhere. Crawling from "/" also covers the header nav and footer, which
 * render on every route.
 */
const LINK_CRAWL_PAGES = ["/", "/dental-services", "/articles/general"];

for (const path of LINK_CRAWL_PAGES) {
  test(`every internal link on ${path} resolves`, async ({ page, request }) => {
    const res = await page.goto(path);
    expect(res?.status(), `${path} should return 200`).toBe(200);

    const hrefs: string[] = await page.evaluate(() =>
      Array.from(new Set(
        Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))
          .map((a) => {
            const raw = a.getAttribute("href") ?? "";
            // Skip non-navigational and off-site targets. Resolve everything
            // else against the document so a relative href is checked where a
            // browser would actually send the user.
            if (/^(tel:|mailto:|#|javascript:)/i.test(raw) || raw === "") return "";
            const url = new URL(raw, document.baseURI);
            if (url.origin !== location.origin) return "";
            return url.pathname + url.search;
          })
          .filter(Boolean),
      )),
    );

    expect(hrefs.length, `${path} should expose internal links to check`).toBeGreaterThan(5);

    const broken: string[] = [];
    for (const href of hrefs) {
      const r = await request.get(href, { maxRedirects: 5 });
      if (r.status() !== 200) broken.push(`${href} -> ${r.status()}`);
    }

    expect(
      broken,
      `${broken.length} broken internal link(s) on ${path}:\n${broken.join("\n")}`,
    ).toEqual([]);
  });
}

test("home has H1 and primary CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("link", { name: /book appointment/i }).first()).toBeVisible();
});

test("article route renders title + breadcrumb schema", async ({ page }) => {
  await page.goto("/articles/general/502399-glossary");
  await expect(page.locator("h1")).toBeVisible();
  const ldjson = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ldjson.some((t) => t.includes("BreadcrumbList"))).toBeTruthy();
});
