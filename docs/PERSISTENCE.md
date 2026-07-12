# Persistence

`src/persistence/storage.ts` is the only local-storage boundary. Schema v3 stores the active game, exact notes/history/future, settings, aggregate statistics, daily dates and achievements. Reads merge defaults defensively. Corrupt JSON falls back safely; an invalid active-game shape is dropped while statistics survive. Quota/unavailable-storage failures return `false` and gameplay continues in memory.
