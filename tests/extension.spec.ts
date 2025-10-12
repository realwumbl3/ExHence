/// <reference types="node" />
import { test, expect, chromium } from "@playwright/test";
import path from "path";
import fs from "fs";
import os from "os";
import { addConsentCookies } from "./helpers";

// Resolve unpacked extension path from current working directory (repo root)
const EXT_PATH = process.cwd();

// Ensure test artifacts directory exists
test.beforeAll(async () => {
    const artifactsDir = path.join(__dirname, "artifacts");
    if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });
});

async function withExtension(run: (page: any, context: any) => Promise<void>) {
    const tempProfile = fs.mkdtempSync(path.join(os.tmpdir(), "pw-ext-"));
    const context = await chromium.launchPersistentContext(tempProfile, {
        headless: false,
        viewport: { width: 1280, height: 800 },
        args: [
            `--disable-extensions-except=${EXT_PATH}`,
            `--load-extension=${EXT_PATH}`,
            "--no-sandbox",
            "--disable-features=IsolateOrigins,site-per-process",
        ],
    });
    const page = await context.newPage();
    try {
        await context.tracing.start({ screenshots: true, snapshots: true });
        await addConsentCookies(context);
        await run(page, context);
    } finally {
        try {
            await context.tracing.stop();
        } catch {}
        await context.close();
    }
}

test("Extension should load", async () => {
    await withExtension(async (page) => {
        await page.goto("https://www.e-hentai.org");
        // check for .EhLogo
        await expect(page.locator(".EhLogo")).toBeVisible();
    });
});
