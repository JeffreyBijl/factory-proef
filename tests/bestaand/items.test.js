import { test, after, before } from "node:test";
import assert from "node:assert/strict";
import { startServer } from "../helpers.js";

let app;
before(async () => {
	app = await startServer();
});
after(() => app.stop());

test("geeft alleen de items van het eigen huishouden, op positie", async () => {
	const items = await (await app.verzoek("/api/items")).json();
	assert.deepEqual(
		items.map((i) => i.naam),
		["Melk", "Brood", "Appels"],
	);
});

test("zonder huishouden geeft de API 401", async () => {
	const res = await fetch(
		new URL("/api/items", (await app.verzoek("/api/items")).url),
	);
	assert.equal(res.status, 401);
});

test("voegt een item toe aan het eind", async () => {
	const res = await app.verzoek("/api/items", {
		method: "POST",
		body: JSON.stringify({ naam: "Kaas" }),
	});
	assert.equal(res.status, 201);
	const items = await (await app.verzoek("/api/items")).json();
	assert.equal(items.at(-1).naam, "Kaas");
});

test("weigert een lege naam", async () => {
	const res = await app.verzoek("/api/items", {
		method: "POST",
		body: JSON.stringify({ naam: "  " }),
	});
	assert.equal(res.status, 400);
});

test("verwijdert geen item van een ander huishouden", async () => {
	const koffie = app.store.lijst("pietersen")[0];
	const res = await app.verzoek(`/api/items/${koffie.id}`, {
		method: "DELETE",
	});
	assert.equal(res.status, 404);
	assert.equal(app.store.lijst("pietersen").length, 1);
});
