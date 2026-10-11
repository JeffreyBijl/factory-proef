import { defineConfig } from "@playwright/test";

// BASE_URL wijst naar de preview van de PR (pipeline); zonder BASE_URL start Playwright de app lokaal.
const preview = process.env.BASE_URL;

export default defineConfig({
	testDir: "tests/factory/e2e",
	use: { baseURL: preview ?? "http://localhost:3100" },
	webServer: preview
		? undefined
		: {
				command: "PORT=3100 node src/server.js",
				url: "http://localhost:3100",
				reuseExistingServer: true,
			},
});
