import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 2,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  snapshotPathTemplate: "visual-review/{projectName}/{arg}{ext}",
  use: { baseURL: "http://127.0.0.1:4173", trace: "on-first-retry" },
  webServer: {
    command: "npm run build && npm run preview -- --host 127.0.0.1",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "375x667",
      use: {
        ...devices["iPhone 13 Mini"],
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: "375x812",
      use: {
        ...devices["iPhone 13 Mini"],
        viewport: { width: 375, height: 812 },
      },
    },
    {
      name: "390x844",
      use: { ...devices["iPhone 13"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "430x932",
      use: {
        ...devices["iPhone 14 Pro Max"],
        viewport: { width: 430, height: 932 },
      },
    },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
});
