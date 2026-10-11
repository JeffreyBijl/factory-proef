// Opslag in het geheugen. Elk huishouden heeft zijn eigen lijst.

export function maakStore() {
	let volgendId = 1;
	const items = [];

	function voegToe(huishouden, naam) {
		const positie = items.filter((i) => i.huishouden === huishouden).length;
		const item = {
			id: volgendId++,
			huishouden,
			naam,
			positie,
			afgevinkt: false,
		};
		items.push(item);
		return item;
	}

	function lijst(huishouden) {
		return items
			.filter((i) => i.huishouden === huishouden)
			.sort((a, b) => a.afgevinkt - b.afgevinkt || a.positie - b.positie);
	}

	function zoek(id) {
		return items.find((i) => i.id === id);
	}

	function verwijder(huishouden, id) {
		const index = items.findIndex(
			(i) => i.id === id && i.huishouden === huishouden,
		);
		if (index === -1) return false;
		items.splice(index, 1);
		return true;
	}

	return { voegToe, lijst, zoek, verwijder };
}

export function maakVoorbeeldStore() {
	const store = maakStore();
	store.voegToe("jansen", "Melk");
	store.voegToe("jansen", "Brood");
	store.voegToe("jansen", "Appels");
	store.voegToe("pietersen", "Koffie");
	return store;
}
