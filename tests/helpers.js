import { maakServer } from "../src/server.js";
import { maakVoorbeeldStore } from "../src/store.js";

// Start een server op een vrije poort met verse voorbeelddata.
export async function startServer() {
	const store = maakVoorbeeldStore();
	const server = maakServer(store);
	await new Promise((klaar) => server.listen(0, klaar));
	const basis = `http://localhost:${server.address().port}`;
	const verzoek = (pad, { huishouden = "jansen", ...opties } = {}) =>
		fetch(basis + pad, {
			...opties,
			headers: {
				"content-type": "application/json",
				cookie: `huishouden=${huishouden}`,
				...opties.headers,
			},
		});
	return {
		store,
		verzoek,
		stop: () => new Promise((klaar) => server.close(klaar)),
	};
}
