# Equipment purchases and upgrades — 2026-09-23

Title equipment slots now open an owned/unowned catalog with purchase, equip and upgrade actions. Common gear is free starter equipment; rare 80, unique 180, mythic 350, relic 600 Pizza Score. Legacy selected gear is retained as owned when migrating, including saves without a wallet yet.

Prototype upgrade rules: guaranteed success, maximum +5; each level adds 10% of the original positive basic bonus. Negative bonuses and conditional effects are unchanged. Price per step is max(20, round(purchase price / 4)) × next level. Display current/next stats before purchase. These are initial action-game balance values, not the original defense-game tier caps.

Balance, ownership and levels commit together in one local-storage record. Failed writes cancel purchases/upgrades without charge; invalid IDs, insufficient funds, duplicate purchases and over-cap upgrades are rejected. Run construction snapshots levels and applies them once, preserving existing room and chapter progression. Run logs include level snapshots. Local save only.

Validation: 99 tests pass, including transaction rollback, duplicate purchase, funds, maximum level, migration, persistent ownership, run snapshot isolation and negative-stat preservation; JavaScript syntax checks pass.
