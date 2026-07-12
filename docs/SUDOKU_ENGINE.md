# Sudoku engine

`src/sudoku/core.ts` parses 81-character puzzles, validates givens, finds peers/conflicts/candidates and applies immutable moves. `solver.ts` uses minimum-remaining-values backtracking with deterministic digit order, early contradictions and configurable solution-count limits. It never changes its input or givens. `techniques.ts` is separate: hints are logical, structured and deterministic, not backtracking guesses.
