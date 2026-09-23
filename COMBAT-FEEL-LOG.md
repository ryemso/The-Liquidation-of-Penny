# Combat feel update — 2026-09-23

- Profit: golden candlestick overlay, heavier impact audio, 80ms hitstop and stronger knockback. Walls block knockback destinations. Regular foes enter short recovery after profit/finisher hits; bosses retain their patterns.
- Leverage: moving afterimages, orange activation ring, remaining-time arc and repayment progress near hero, 15% shorter attack intervals while active. Successful repayment emits particles and a ring. Existing damage multiplier and repayment requirements remain.
- Circuit: cyan stop tint and enemy outlines, per-enemy stored damage labels; 35% of damage dealt during circuit freeze is delivered once on resumption, with impact audio and ring. Original hits still deal their damage immediately. Echo avoids reapplying weakness/prediction bonuses, ignores dead targets, and resets on room transition. Equipment-only freezes do not enable damage banking.
- Basic combat: impact rays, graded hitstop, finisher audio, brief regular-enemy stagger and death accents. Reduced-motion mode keeps new ring radius fixed; existing camera-shake suppression remains.

Validation: 103 Node tests pass; new tests cover damage accounting, duplicate release, room/death cleanup, boss interruption immunity, leverage cadence and renderer execution. JavaScript syntax check passes. These changes target feedback and skill distinction; subjective fun and balance still require play feedback. Gear-specific attack moves and enemy formation redesign are not included.
