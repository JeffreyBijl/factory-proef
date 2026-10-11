---
id: "007-item-afvinken"
titel: "Item afvinken"
issue: "#12"
status: goedgekeurd
spec_versie: 1
profielversie: 1
goedgekeurd:
  door: "Jeffrey"
  op: "2026-10-11"
---

# Item afvinken

## Gedrag

Een lid van het huishouden vinkt een item af in de winkel; het item staat dan doorgestreept onderaan, en terugzetten kan.

## Context

Nu kunnen items alleen verwijderd worden. In de winkel wil je zien wat je al hebt, en een vergissing ongedaan kunnen maken.

## Acceptatiecriteria

| ID | Gegeven | Als | Dan | Test |
| --- | --- | --- | --- | --- |
| AC-1 | de lijst Melk, Brood, Appels | ik `PATCH /api/items/<id van Melk>` met `{ "afgevinkt": true }` | geeft de API 200 met het item en `afgevinkt: true`, en geeft `GET /api/items` de volgorde Brood, Appels, Melk | unit |
| AC-2 | Melk is afgevinkt | ik `PATCH` met `{ "afgevinkt": false }` | geeft `GET /api/items` weer Melk, Brood, Appels met `afgevinkt: false` bij Melk | unit |
| AC-3 | een item van huishouden pietersen | huishouden jansen stuurt een `PATCH` voor dat item | geeft de API 404 en is het item bij pietersen niet afgevinkt | unit |
| AC-4 | een item | de body heeft geen boolean `afgevinkt` (ontbreekt, `"ja"`, `1`) | geeft de API 400 met een `fout` en verandert er niets | unit |
| AC-5 | de lijst op de pagina | ik klik op het vinkje bij Melk | staat Melk doorgestreept onderaan, ook na herladen | e2e |

## Buiten scope

- Alle afgevinkte items in één keer wissen.
- Andere leden zien het direct (slice B, later).

## Nieuwe dependencies

| Pakket | Versie | Waarom | Alternatief zonder dependency |
| --- | --- | --- | --- |
| geen |  |  |  |

## Raakt gevoelige gebieden

- `src/server.js`: nieuw endpoint `PATCH /api/items/:id`; moet controleren dat het item bij het huishouden uit de cookie hoort.

## Specialisten

- Verplicht volgens het profiel: security, ui
- Extra voor deze spec: evaluator (afvinken op een smal scherm)

## Opknippen

| Slice | Gedrag in één zin | Criteria | Hangt af van |
| --- | --- | --- | --- |
| A | Een item afvinken en terugzetten, via de API en op de pagina | AC-1 t/m AC-5 | – |

## Inschatting

| Slice | Gewijzigde regels | Bestanden | Rondes | Verbruik |
| --- | --- | --- | --- | --- |
| A | ~80 | ~3 | 1 | laag, ~3% van het weeklimiet |

## Open vragen

- geen

## Spec-wijzigingen

| Versie | Datum | Aanleiding | Wijziging | Goedgekeurd door |
| --- | --- | --- | --- | --- |
