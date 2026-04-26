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
