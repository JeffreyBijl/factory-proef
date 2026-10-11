import { expect, test } from "@playwright/test";

test("AC-1 de startpagina laadt", async ({ page }) => {
	await page.goto("/");
	await expect(page).toHaveTitle(/.+/);
	await expect(page.locator("body")).toBeVisible();
});
