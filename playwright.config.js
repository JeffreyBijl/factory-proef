import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "tests/factory/e2e",
	use: { baseURL: "http://localhost:3100" },
	webServer: {
		command: "PORT=3100 node src/server.js",
		url: "http://localhost:3100",
		reuseExistingServer: true,
	},
});
