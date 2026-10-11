import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { startServer } from "../../helpers.js";

let app;
beforeEach(async () => {
	app = await startServer();
});
afterEach(() => app.stop());

const namen = (items) => items.map((i) => i.naam);
const idVan = (naam, huishouden = "jansen") =>
	app.store.lijst(huishouden).find((i) => i.naam === naam).id;
const vink = (id, body, opties = {}) =>
	app.verzoek(`/api/items/${id}`, {
		method: "PATCH",
		body: JSON.stringify(body),
		...opties,
	});

test("AC-1: afvinken geeft het item terug en zet het onderaan", async () => {
	const res = await vink(idVan("Melk"), { afgevinkt: true });
	const item = await res.json();
	assert.equal(item.naam, "Melk");
	assert.equal(item.afgevinkt, true);
	const lijst = await (await app.verzoek("/api/items")).json();
	assert.deepEqual(namen(lijst), ["Brood", "Appels", "Melk"]);
});

test("AC-2: terugzetten herstelt de oorspronkelijke volgorde", async () => {
	const id = idVan("Melk");
	await vink(id, { afgevinkt: true });
	const res = await vink(id, { afgevinkt: false });
	assert.equal(res.status, 200);
	const lijst = await (await app.verzoek("/api/items")).json();
	assert.deepEqual(namen(lijst), ["Melk", "Brood", "Appels"]);
	assert.equal(lijst[0].afgevinkt, false);
});

test("AC-3: een item van een ander huishouden geeft 404", async () => {
	const res = await vink(idVan("Koffie", "pietersen"), { afgevinkt: true });
	assert.equal(res.status, 404);
});

for (const body of [{}, { afgevinkt: "ja" }, { afgevinkt: 1 }]) {
	test(`AC-4: ongeldige body ${JSON.stringify(body)} geeft 400 en verandert niets`, async () => {
		const id = idVan("Melk");
		const res = await vink(id, body);
		assert.equal(res.status, 400);
		assert.notEqual(app.store.zoek(id).afgevinkt, true);
	});
}
