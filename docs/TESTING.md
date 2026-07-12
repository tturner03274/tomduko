# Testing

`npm run test` covers shape, serialization, conflicts, candidates, immutable givens, completion, deterministic solving, invalid/unsolvable/multi-solution boards, uniqueness, reducer history/mistakes/expiry and persistence recovery. `npm run puzzles:validate` checks the bundled registry. `npm run test:e2e` covers mobile and desktop start/input/notes/undo/reload/pause, daily stability and keyboard input. `npm run lint` and `npm run build` are release gates.

Known gaps: complete end-to-end completion, offline browser-context automation, monthly daily calendar, dev-only fixture panel and all requested visual states are not yet automated.
