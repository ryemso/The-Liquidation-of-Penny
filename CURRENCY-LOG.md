# Stage-clear currency — 2026-09-23

Add persistent Pizza Score alongside run-only seed money. Initial campaign reward schedule: regular/exploration 10 × chapter, elite 20 × chapter, boss 50 × chapter. Shops award nothing. This is a prototype campaign earning path; original raid/PvP sources remain future work.

Award immediately on successful stage clear, including traversal exits. A run-room guard prevents repeat awards; wallet receipts deduplicate delivery across reloads. Defeat and restart do not subtract earned currency. Chapter-two shortcut awards only actually cleared rooms. No retroactive grant.

Header shows the existing pizza icon and balance; reward/finish screens show earned totals. currency_earned events include amount, reason, run total and receipt. Saved independently under penny-wallet-v1; blocked storage displays a persistent warning and keeps current-session earnings. Local storage only, no account synchronization or server verification. Purchase/upgrade spending is not implemented in this change.

Validation: 95 tests pass, covering reward schedule, actual exploration/elite/boss clear flows, duplicate prevention, defeat persistence, reload, corrupt data and unavailable storage. JavaScript syntax check passes.
