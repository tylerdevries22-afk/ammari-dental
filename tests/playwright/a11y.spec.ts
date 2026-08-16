import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/dental-services", "/dental-implants", "/appointment", "/contact"];

/**
 * Skip the intro splash the same way a returning visitor does.
 *
 * The splash is a 3.4s opaque overlay that renders on every fresh context, so
 * whether axe caught it still painted depended on machine speed — an
 * intermittent color-contrast failure on its decorative wordmark. Seeding the
 * flag the app itself checks makes the scan deterministic and, more usefully,
 * scans the page a visitor actually interacts with. The splash is
 * aria-hidden + role="presentation", so nothing meaningful goes unscanned.
 */
async function skipSplash(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("am-splash-shown", "1");
    } catch {
      /* storage unavailable — splash just plays as normal */
    }
  });
}

for (const path of PAGES) {
  test(`a11y: ${path} has no serious or critical violations`, async ({ page }) => {
    await skipSplash(page);
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
  // Without this the splash can hold focus when Tab fires.
  await skipSplash(page);
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.textContent);
  expect(focused).toMatch(/skip to content/i);
});

// The booking picker ships behind NEXT_PUBLIC_BOOKING_FLAG. CI sets it to
// "preview" so this actually runs — previously it was never set, so the whole
// booking surface silently skipped and the gate protected nothing.
// When the flag is "preview" or "on", the picker becomes scannable and this
// suite runs the same axe rules against its initial step.
const pickerEnabled = ["preview", "on"].includes(
  process.env.NEXT_PUBLIC_BOOKING_FLAG ?? "",
);

test.describe(pickerEnabled ? "booking picker" : "booking picker (skipped — flag off)", () => {
  test.skip(!pickerEnabled, "Set NEXT_PUBLIC_BOOKING_FLAG=preview to run");

  test("a11y: /appointment?booking=1 (reason step)", async ({ page }) => {
    await skipSplash(page);
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
