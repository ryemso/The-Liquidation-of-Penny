# Starting equipment — 2026-09-23

- Added title-screen weapon, armor, accessory and two special slots using the existing 16 equipment icons.
- All equipment is available for demo testing; no ownership, drops or currency purchases are implied.
- Players can inspect bonuses, equip, replace and remove items before starting. The same special item cannot occupy both slots.
- Selection persists locally under penny-equipment-v1; invalid or obsolete entries are discarded. Storage failure leaves the current selection usable and displays a message.
- New runs and retries receive a fresh application of flat stat bonuses. Chapter-two starts retain bonuses; knowledge and promotion remain additive.
- Mythic/relic items currently supply the stated basic bonuses only. Original special triggers and set effects remain future work.
- Pause information lists current equipment; run_start logs snapshot equipment IDs.
- Validation: 80 Node tests pass, including invalid saves, duplicate/wrong slots, retry/promotion stacking, storage failure and live circuit effect integration. JavaScript syntax checks pass.
