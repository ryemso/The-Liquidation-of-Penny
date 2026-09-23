# Shortcut platform clearance — 2026-09-23

Generated bridges previously spanned directly below walls and close to existing ledges. Split the proposed bridge into free spans, excluding existing geometry with 48px headroom and 8px side/bottom clearance. Drop fragments narrower than 48px. The dotted preview uses the same geometry calculation; collision and rendering use the inserted segments. Usage logging checks actual segments. Fully blocked bridges do not mark themselves open. Existing platforms stay unchanged.

Validation: all 91 tests pass, including all ten exploration bridges, repeated interaction, preview/spawn equality, overlap/headroom, traversal logging and fully blocked layout.
