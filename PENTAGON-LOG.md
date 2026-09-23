# Pentagon extension — 2026-09-23

The campaign now has six chapters and 29 rooms. Defeating the Wall Street boss opens chapter 6 instead of ending the run. Victory occurs after the central conference-room boss and exit.

| Room | Layout and role | Background |
|---|---|---|
| Pentagon exterior | 2,900-wide approach, 12 guards, optional upper cache | Sunset limestone headquarters |
| First floor | 2,750-wide vertical lobby, 12 guards, optional cache, +20 HP on clear | Teal-lit security lobby |
| Path to central conference room | 3,100-wide security corridor, 12 guards including elite, optional cache | Olive corridor with red indicators |
| Central conference room | 2,200-wide boss arena | Gold/navy economic map chamber |

All three combat rooms require defeating their non-optional guards. They use distinct upper ledge sequences and retain a traversable lower route. Existing reward selection, totem pickup, stage analytics and persistent clear currency apply. Rewards are 60/60/120/300 Pizza Score under the existing chapter formula. The first-floor recovery replaces a separate shop stop within this four-room chapter.

Chapter entry grants the established +20 max HP, +45 recovery, +6 attack and 50 profit once. Market period is 18 seconds. Normal enemies have 1.6× their base HP, with unchanged damage. The final 국가계약 집행관 uses the existing enforcer artwork and AI, with 3,200 HP; this update does not introduce a new boss moveset. Institutional monster art is reused for chapter 6.

The Pentagon interiors are fictional financial-action game environments, not a reconstruction of real facilities. Four original pixel-art plates were created with builtin imagegen. Assets: `assets/backgrounds/pentagon-*.png`; prompts: `assets/backgrounds/pentagon-prompts.json`.

Validation: 113 automated tests pass, including chapter-5 transition, one-time promotion, all four room bounds/spawns/floor traversal, mandatory clearance, recovery, currency deduplication and a single final victory. JavaScript syntax checks pass.

Room count increases by 16%; actual playtime increase remains to be measured from play logs.
