/// <reference types="node" />
import { defineConfig } from '@playwright/test';
import path from 'path';

// Prefer current working directory as the unpacked extension path
const EXTENSION_PATH = process.cwd();

export default defineConfig({
  testDir: __dirname,
  timeout: 120_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: path.join(__dirname, 'report') }]],
  use: {
    headless: false,
    viewport: { width: 1280, height: 800 },
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {
      args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
        '--no-sandbox',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    }
  }
});


