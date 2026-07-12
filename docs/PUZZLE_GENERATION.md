# Puzzle generation

Startup uses `src/sudoku/fixtures.ts`, a bundled registry verified by `npm run puzzles:validate`. Every entry is counted to a limit of two and must return exactly one solution matching its stored solution. `npm run puzzles:generate -- --difficulty easy --count 20 --seed tom` produces deterministic registry-derived candidates as a dry run; `--write` creates a separate file and never replaces the curated registry. Full seeded solved-grid construction/removal is not yet implemented.
