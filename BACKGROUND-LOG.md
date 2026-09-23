# Background journey — 2026-09-23

Five original pixel-art plates generated with builtin imagegen replace the two reused backdrops.

| Chapter | Location | Visual identity |
|---|---|---|
| 1 | 19th-century Five Points | Gas lamps, tenements, muddy streets |
| 2 | Iron and brick city | Elevated railway, warehouses, cast iron |
| 3 | Modern urban center | Glass towers, subway entrance, cold blue light |
| 4 | The Hole | Low houses, stagnant water, fences, retaining walls |
| 5 | Wall Street | Exchange columns, stone towers, bronze bull, gold light |

This is a fictional journey through eras and places, not a historically continuous walking route. The Hole treatment draws on its low-lying neighborhood character rather than a literal crater.

Each chapter uses a unique plate. Its five rooms vary crop, zoom, light and location subtitle. Bounded parallax avoids tiled-image seams and uncovered canvas edges. Atmospheric overlays remain behind gameplay. The original combat chapter names, room IDs, collision geometry and difficulty are retained.

Assets: `assets/backgrounds/*.png`; original prompts: `assets/backgrounds/prompts.json`; renderer: `backgrounds.mjs`.

Reference context: https://archive.blackgothamarchive.org/exhibits/show/stories/themakingofgotham/thefivepoints/index.html and https://cityneighborhoods.nyc/the-hole . Images are newly generated interpretations.

Validation: game.js and backgrounds.mjs syntax checks passed; existing 110 tests passed; 60 room/camera coverage combinations passed.
