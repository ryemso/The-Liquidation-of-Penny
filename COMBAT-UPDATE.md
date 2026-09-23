# Combat update — 2026-09-23

## Bug fixes
- Central-bank supply bullets now fire toward the player instead of always left.
- Expired projectiles and floor hazards no longer perform an extra collision check.

## Five additional boss patterns
Every fourth attack cycle replaces the normal attack with a new pattern. Positions lock at warning time; warnings last at least 1.2 seconds. Damage is 16 before existing enemy/armor modifiers. Existing hazard visuals describe the real hit region. The boss recovers for 1.8 seconds afterward. Killing the boss clears pending hazards.

| Boss | Pattern | Response |
| --- | --- | --- |
| Chapter 1 | Pump and dump | Side lanes first, center second; move to cleared side |
| Chapter 2 | Short squeeze | Outer then inner lanes; keep central gap or climb |
| Chapter 3 | Backtrace orders | Three fixed positions trigger in sequence; leave route |
| Chapter 4 | Tightening wave | Five sequential lanes; move behind wave |
| Chapter 5 | Sector rotation | Alternating lanes; change lanes after first wave |

These are game analogies, not literal market prediction rules.

## Conditional equipment effects
- Buffett: 3% temporary armor per 6 seconds without damage with active enemies, max 9%; reset on damage/room change.
- Musk: leverage activation adds 20% attack and 10% incoming damage for 8 seconds.
- Jensen: five basic attack hits grant 25% shorter attack interval for 4 seconds; 10-second cooldown from activation.
- Fed: retain 90% instead of 75% unrealized profit on damage.
- Newton: actual damage grants 25% attack for 4 seconds; 8-second cooldown.
- Turing: successful dash dodge empowers next hit within 5 seconds by 40%; 8-second cooldown.
- Einstein: surviving damage at 30% HP or below freezes enemies for 1.5 seconds; 20-second cooldown. No resurrection.

Effects have in-combat text, selection descriptions and equipment_activated log events. Cooldowns pause with gameplay and persist across room changes; temporary buffs clear on room change. No permanent stat mutation or retry stacking.

Validation: 89 Node tests pass. Existing boss-cycle assertions updated to four patterns. New tests cover all seven effects, timing, cooldowns, reset boundaries, all five warning/recovery cycles, death cleanup, expired projectiles and shooting direction. Subjective difficulty and balance remain tuning targets.
