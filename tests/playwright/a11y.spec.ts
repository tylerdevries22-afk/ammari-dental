import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/dental-services", "/dental-implants", "/appointment", "/contact"];

type Page = import("@playwright/test").Page;

/**
 * Skip the intro splash the way a returning visitor does.
 *
 * It is a 3.4s opaque overlay that renders on every fresh context, so whether
 * axe caught it still painted was a coin flip — an intermittent contrast
 * failure on its decorative wordmark. Seeding the flag the app itself checks
 * makes the scan deterministic and scans the page a visitor interacts with.
 * The splash is aria-hidden + role="presentation", so nothing meaningful goes
 * unscanned.
 */
async function prepareScan(page: Page) {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("am-splash-shown", "1");
    } catch {
      /* storage unavailable — splash just plays as normal */
    }
  });
}

/**
 * Wait until entrance/reveal animations stop changing opacity.
 *
 * axe computes contrast against the *blended* colour, so scanning mid-fade
 * reported phantom failures on whichever element happened to be animating —
 * ink-700 as #a4aaac, a search shortcut as #4e896b, and so on. Roughly one run
 * in three failed on a different element each time.
 *
 * Scoped to header/main/footer deliberately: the only endless opacity
 * animation on the page is the chat launcher's pulse ring, which lives outside
 * those roots, so this settles instead of spinning. The infinite animations
 * that *are* inside main (AboutSplit's badge, EmergencyBand's halo) drive
 * scale and rotate, which this ignores.
 *
 * Note: emulating reduced motion is NOT a substitute. framer's
 * reducedMotion:"user" suppresses transforms but still animates opacity, and
 * it shifted timing enough to make service-page heroes fail instead.
 */
async function waitForRevealsToSettle(page: Page) {
  await page.waitForFunction(
    () =>
      new Promise<boolean>((resolve) => {
        const snapshot = () => {
          let acc = "";
          document.querySelectorAll("header, main, footer").forEach((root) => {
            root.querySelectorAll("*").forEach((el) => {
              acc += getComputedStyle(el).opacity + ",";
            });
          });
          return acc;
        };
        // Compared across 250ms rather than two frames: a two-frame window can
        // land in the gap between first paint and hydration, when opacity is
        // trivially stable because the entrance animation has not started yet.
        // Any in-flight fade (they run ~0.5s) moves measurably over 250ms.
        const before = snapshot();
        setTimeout(() => resolve(snapshot() === before), 250);
      }),
    undefined,
    { timeout: 15_000, polling: 250 },
  );
}

for (const path of PAGES) {
  test(`a11y: ${path} has no serious or critical violations`, async ({ page }) => {
    await prepareScan(page);
    const res = await page.goto(path);
    // goto() only rejects on network errors, not 4xx/5xx. Without this the
    // gate happily scans an error page and reports the route as accessible.
    expect(res?.status(), `${path} did not return 200`).toBe(200);
    await waitForRevealsToSettle(page);
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
  await prepareScan(page);
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
    await prepareScan(page);
    await page.goto("/appointment?booking=1");
    // Wait for the reason cards to mount (initial fetch resolves).
    await page.getByRole("radiogroup", { name: /reason/i }).waitFor();
    await waitForRevealsToSettle(page);
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
