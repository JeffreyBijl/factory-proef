import { test, expect } from "@playwright/test";

test("AC-5: afvinken op de pagina zet Melk doorgestreept onderaan, ook na herladen", async ({
	page,
	context,
}) => {
	// Eigen huishouden per test, zodat de test niet afhangt van andere tests op dezelfde server.
	const huishouden = `e${Date.now().toString(36).replace(/[0-9]/g, "")}`;
	await context.addCookies([
		{ name: "huishouden", value: huishouden, url: "http://localhost:3100" },
	]);
	for (const naam of ["Melk", "Brood", "Appels"]) {
		await page.request.post("/api/items", { data: { naam } });
	}

	await page.goto("/");
	await page.locator("li", { hasText: "Melk" }).getByRole("checkbox").check();

	const laatste = page.locator("#lijst li").last();
	await expect(laatste).toContainText("Melk");
	await expect(laatste.locator(".naam")).toHaveCSS(
		"text-decoration-line",
		"line-through",
	);

	await page.reload();
	await expect(page.locator("#lijst li").last()).toContainText("Melk");
	await expect(
		page.locator("#lijst li").last().getByRole("checkbox"),
	).toBeChecked();
});
