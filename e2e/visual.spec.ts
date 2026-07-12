import { expect, test } from "@playwright/test";
test("onboarding visual review", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("onboarding.png", {
    animations: "disabled",
    fullPage: true,
  });
});
test("new game visual review", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip" }).click();
  await page.getByRole("button", { name: /New Game/ }).click();
  await expect(page).toHaveScreenshot("new-game.png", {
    animations: "disabled",
    fullPage: true,
  });
});
test("active game visual review", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip" }).click();
  await page.getByRole("button", { name: /Quick Play/ }).click();
  await expect(page.getByRole("grid")).toBeVisible();
  await page.addStyleTag({ content: ".game-time span{visibility:hidden}" });
  await expect(page).toHaveScreenshot("active-game.png", {
    animations: "disabled",
    fullPage: true,
  });
});
test("completion visual review", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip" }).click();
  await page.getByRole("button", { name: /Quick Play/ }).click();
  await page.getByRole("button", { name: /Pause/ }).click({ force: true });
  await expect(page.getByRole("heading", { name: /paused/i })).toBeVisible();
  const finalMove = await page.evaluate(() => {
    const key = "tomduko:v3";
    const data = JSON.parse(localStorage.getItem(key)!);
    const game = data.game;
    const editable = game.original
      .map((value: number, index: number) => (value === 0 ? index : -1))
      .filter((index: number) => index >= 0);
    const index = editable.at(-1)!;
    for (const cell of editable.slice(0, -1)) game.values[cell] = game.solution[cell];
    game.values[index] = 0;
    game.elapsedSeconds = 287;
    game.mistakes = 1;
    game.status = "playing";
    localStorage.setItem(key, JSON.stringify(data));
    sessionStorage.setItem("tomduko:screen", "game");
    return { index, digit: game.solution[index] };
  });
  await page.reload();
  await page.locator(`[data-cell="${finalMove.index}"]`).click({ force: true });
  await page.getByRole("button", { name: String(finalMove.digit), exact: true }).click({ force: true });
  await expect(page.getByRole("heading", { name: "Exceptional solve." })).toBeVisible();
  await expect(page).toHaveScreenshot("completion.png", {
    animations: "disabled",
    fullPage: true,
  });
});
test("settings visual review", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip" }).click();
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page).toHaveScreenshot("settings.png", {
    animations: "disabled",
    fullPage: true,
  });
});
test("statistics visual review", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip" }).click();
  await page.getByRole("button", { name: "Statistics" }).click();
  await expect(page).toHaveScreenshot("statistics.png", {
    animations: "disabled",
    fullPage: true,
  });
});
