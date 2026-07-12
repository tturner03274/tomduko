# Architecture

The React shell owns navigation and persistence orchestration. `src/game/reducer.ts` is DOM-free; `src/sudoku` is React-free. Gameplay commits bounded full snapshots because values, notes, mistakes and completion must undo together. Selection stays outside history. Central configuration lives under `src/config`; visual values live in `src/styles/index.css`.

Stefitaire informed the static Vite boundary, prompt update flow, local-only storage, config registries and Vercel policy. Tomduko differs through a dedicated Sudoku domain, semantic 81-button grid, quieter editorial design and split solver/logical-hint layers.
