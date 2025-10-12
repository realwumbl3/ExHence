import { Page, expect, Frame, BrowserContext } from "@playwright/test";

export async function collectDiagnostics(page: Page, label: string) {
    const timestamp = Date.now();
    await page.screenshot({ path: `tests/artifacts/${label}-${timestamp}.png`, fullPage: true }).catch(() => {});
    const html = await page.content();
    await page
        .context()
        .tracing.stop({ path: `tests/artifacts/${label}-${timestamp}.zip` })
        .catch(() => {});
    return html;
}

export async function addConsentCookies(_context: BrowserContext) {
    // Intentionally left as a no-op for now; hook for setting consent cookies if needed.
}