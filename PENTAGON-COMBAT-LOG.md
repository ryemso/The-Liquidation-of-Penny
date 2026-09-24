# Pentagon enemies and policy boss — 2026-09-24

- New transparent pixel atlas: rifleman, pugilist, large elite brute, ordinary suited official, transformed executor; four poses per character. Created with builtin imagegen using the previous draft as reference. Runtime uses explicit row/column cuts because generated rows are not equal height.
- All chapter-6 regular encounters and optional reinforcements use the military actors. Riflemen aim then fire one round. Pugilists and the larger elite use committed lunging punches with recovery windows.
- The executor enters within the initial viewport as an ordinary human. After three unpaused playing seconds it transforms once, preserving its feet and center. Body width/height become 3× the player; rendered target height is 135.66 px versus the player's 45.22 px. It cannot be killed or farmed for attack profit during the introduction.
- The transformed boss uses close-range lunging punches without passive contact damage or projectile volleys.

## Skill-resource policy

The resource is the existing unrealized profit meter, not gold or persistent Pizza Score. Policies are fictional combat analogies, not a claim that the Pentagon sets monetary policy.

| State | A: take-profit minimum | S: leverage cost | D: circuit-breaker cost |
|---|---:|---:|---:|
| Normal | 25 | 0 | 0 |
| Rate increase | 40 | 15 | 20 |
| Currency devaluation | 50 | 20 | 25 |
| Rate decrease | 15 | 0 | 0 |

A continues consuming the whole current profit meter once its minimum is met. S/D deduct only the displayed cost. Insufficient resource cancels activation without starting a cooldown. Cooldown-blocked inputs never charge again.

Starting one second after transformation, policies rotate in table order every eight active boss seconds, last six playing seconds and never stack. Pausing stops timers. Circuit-breaker pauses the boss's next policy cast while an existing policy continues to expire. Boss death, player death and room changes restore defaults immediately. Skill buttons show current requirements even during cooldown; boss HUD shows the policy and remaining time.

Logs include transformation, policy start/end, resource spent and resource-denied attempts. The run build identifier now records chapter6-pentagon-policy.

Validation: 119 automated tests passed; syntax checks passed; all 20 atlas frames contain visible pixels. Tests cover introduction timing/pause, 3× dimensions, all policy costs and debits, expiry/reset, cast order, rifle shots, melee hit windows and full chapter completion.
