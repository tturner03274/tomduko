# Tomduko

Tomduko is a private, iPhone-first Sudoku PWA: no adverts, subscription, account, analytics, backend, remote assets or runtime API. It plays offline after the first cached visit and restores the exact active puzzle locally.

## Run and verify

```bash
npm install
npm run dev
npm run lint
npm run test
npx playwright install chromium
npm run test:e2e
npm run puzzles:validate
npm run build
```

Vite normally opens at `http://localhost:5173`; `npm run build` writes `dist`. Puzzle tooling also provides `puzzles:report` and a dry-run `puzzles:generate -- --difficulty easy --count 20 --seed tom`. Add `--write` to write a separate JSON file. Run `npm run icons:generate` after replacing `public/icons/master.svg`.

## Architecture

- `src/sudoku`: framework-free domain types, validation, candidates, solver, logical hints and curated registry.
- `src/game`: reducer, exact bounded snapshots, modes and statistics types.
- `src/persistence`: guarded v3 repository, migrations/defaults and corrupt-save recovery.
- `src/components`: semantic grid, controls and focused screens.
- `src/config`: editable themes, commentary and achievements.
- `src/styles`: CSS-token visual system, safe areas and responsive layout.
- `scripts`, `e2e`, `docs`: puzzle/icon tooling, browser QA and operational guidance.

Classic, Quick, Daily, Zen and Time Attack are playable. Easy–Expert registry entries are unique and solver-verified. Difficulty metadata currently reflects a curated profile; the analyser and educational hint engine genuinely implement naked and hidden singles. Locked candidates and naked pairs are registry/grading metadata only, not interactive explanations. Master is deliberately hidden until chain grading exists.

Daily Challenge hashes the local ISO calendar date into the verified registry. The same date therefore selects the same bundled puzzle with no network. Completion IDs and daily dates are de-duplicated.

Every non-daily new game rotates through Sudoku-preserving digit, band, stack and orientation transformations, so repeated difficulty selections do not repeat the visible board. Tomduko IQ is a private performance score based on difficulty, time, mistakes and hints; Home shows the rolling five-game rating and personal best while Statistics keeps the latest 100 results locally. It is not a clinical IQ assessment.

The optional Sound Lounge synthesises tile, note, error, hint, pause and victory cues locally through Web Audio. Nothing is downloaded or streamed. Sound and volume controls live in Settings.

See the files in `docs/` for engine, persistence, PWA, deployment, privacy, QA and known limitations.
