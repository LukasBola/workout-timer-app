import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(
  (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.CI,
);

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
