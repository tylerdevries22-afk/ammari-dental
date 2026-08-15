import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/dental-services", "/dental-implants", "/appointment", "/contact"];

for (const path of PAGES) {
  test(`a11y: ${path} has no serious or critical violations`, async ({ page }) => {
    const res = await page.goto(path);
    // goto() only rejects on network errors, not 4xx/5xx. Without this the
    // gate happily scans an error page and reports the route as accessible.
    expect(res?.status(), `${path} did not return 200`).toBe(200);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      // Decorative hero scrub video — silent, aria-hidden, no caption needed.
      // Excluded from scans so we can drop the placeholder <track> element.
      .exclude("video[aria-hidden='true']")
      .analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(
      blocking,
      `Found ${blocking.length} a11y violations on ${path}:\n` +
        blocking.map((v) => `- ${v.id}: ${v.help}`).join("\n"),
    ).toEqual([]);
  });
}

test("skip link is reachable via keyboard", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.textContent);
  expect(focused).toMatch(/skip to content/i);
});

// The booking picker ships behind NEXT_PUBLIC_BOOKING_FLAG. In CI the flag is
// "off" by default, so /appointment renders the legacy form (covered above).
// When the flag is "preview" or "on", the picker becomes scannable and this
// suite runs the same axe rules against its initial step.
const pickerEnabled = ["preview", "on"].includes(
  process.env.NEXT_PUBLIC_BOOKING_FLAG ?? "",
);

test.describe(pickerEnabled ? "booking picker" : "booking picker (skipped — flag off)", () => {
  test.skip(!pickerEnabled, "Set NEXT_PUBLIC_BOOKING_FLAG=preview to run");

  test("a11y: /appointment?booking=1 (reason step)", async ({ page }) => {
    await page.goto("/appointment?booking=1");
    // Wait for the reason cards to mount (initial fetch resolves).
    await page.getByRole("radiogroup", { name: /reason/i }).waitFor();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .exclude("video[aria-hidden='true']")
      .analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(
      blocking,
      `Found ${blocking.length} a11y violations:\n` +
        blocking.map((v) => `- ${v.id}: ${v.help}`).join("\n"),
    ).toEqual([]);
  });
});
