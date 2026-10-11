import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { maakVoorbeeldStore } from "./store.js";

const indexPad = fileURLToPath(
	new URL("../public/index.html", import.meta.url),
);

// Vereenvoudigde sessie: het huishouden staat in een cookie. Zonder cookie: 401.
function huishoudenUit(req) {
	const match = /(?:^|;\s*)huishouden=([a-z]+)/.exec(req.headers.cookie ?? "");
	return match ? match[1] : null;
}

function json(res, status, body) {
	res.writeHead(status, { "content-type": "application/json" });
	res.end(body === undefined ? "" : JSON.stringify(body));
}

async function leesJson(req) {
	let data = "";
	for await (const deel of req) data += deel;
	try {
		return JSON.parse(data || "{}");
	} catch {
		return null;
	}
}

export function maakServer(store = maakVoorbeeldStore()) {
	return http.createServer(async (req, res) => {
		const url = new URL(req.url, "http://localhost");

		if (req.method === "GET" && url.pathname === "/") {
			res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
			res.end(await readFile(indexPad));
			return;
		}

		if (!url.pathname.startsWith("/api/"))
			return json(res, 404, { fout: "Niet gevonden" });

		const huishouden = huishoudenUit(req);
		if (!huishouden) return json(res, 401, { fout: "Niet ingelogd" });

		if (req.method === "GET" && url.pathname === "/api/items") {
			return json(res, 200, store.lijst(huishouden));
		}

		if (req.method === "POST" && url.pathname === "/api/items") {
			const body = await leesJson(req);
			const naam = typeof body?.naam === "string" ? body.naam.trim() : "";
			if (!naam || naam.length > 100)
				return json(res, 400, {
					fout: "Naam is verplicht, maximaal 100 tekens",
				});
			return json(res, 201, store.voegToe(huishouden, naam));
		}

		const itemMatch = /^\/api\/items\/(\d+)$/.exec(url.pathname);
		if (req.method === "DELETE" && itemMatch) {
			const verwijderd = store.verwijder(huishouden, Number(itemMatch[1]));
			return verwijderd
				? json(res, 204)
				: json(res, 404, { fout: "Item niet gevonden" });
		}

		return json(res, 404, { fout: "Niet gevonden" });
	});
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const poort = Number(process.env.PORT ?? 3000);
	maakServer().listen(poort, () =>
		console.log(`Boodschappenlijst op http://localhost:${poort}`),
	);
}
