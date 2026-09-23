# Results loadout fix and upper boss expansion — 2026-09-23

Fixed root cause of equipment slots failing after a run: totem inventory's global [data-slot] selector replaced handlers on title equipment slots. Scope to modal-inner. Returning to title rebinds slots and refreshes wallet; result button opens equipment directly. Quick retry retains current selection.

Basic attack profit gain reduced 8 to 7 per target (12.5% base reduction). Equipment/upgrade profit bonuses, seed, Pizza Score and reward amounts unchanged.

Remove boss instructional notices, windup exclamation/ring overlays and boss-owned delayed hazard previews. Actual attacks/hazards and natural windup sprite poses remain. Other enemy and environment warnings unchanged. New pattern names appear only on execution, not as advance instructions.

Upper bosses retain normal and previous special patterns; every eighth cycle alternates one of their two new actions:
- Chapter 3: sidekick (two drones); short/long (alternating upward/downward projectile columns around a fixed aim).
- Chapter 4: paid issue (spend 3% max HP, nonlethal, summon shields); bonus issue (summon light units without HP cost).
- Chapter 5: hostile takeover (shield/drone aides reduce incoming boss damage 35% while alive); short/long.

At most two living aides per boss; zero seed drops; aides disappear on boss death. New actions execute after 1.4s natural windup, freeze with circuit and retain recovery. Financial names are game analogies, not literal definitions.

Validation: 107 tests pass, including DOM-handler isolation, alternation, summon caps/cleanup, issue HP cost, takeover shield removal and bidirectional projectiles. Existing warning expectation changed to assert notices are absent. JavaScript syntax checks pass.
