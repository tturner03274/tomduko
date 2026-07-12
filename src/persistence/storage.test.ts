import { describe, expect, it } from "vitest";
import { createGame } from "../game/types";
import { puzzles } from "../sudoku/fixtures";
import { createStorage, defaults, migrate } from "./storage";
class Memory implements Storage {
  data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  clear() {
    this.data.clear();
  }
  getItem(k: string) {
    return this.data.get(k) ?? null;
  }
  key(i: number) {
    return [...this.data.keys()][i] ?? null;
  }
  removeItem(k: string) {
    this.data.delete(k);
  }
  setItem(k: string, v: string) {
    this.data.set(k, v);
  }
}
describe("persistence", () => {
  it("round trips exact active game", () => {
    const m = new Memory(),
      r = createStorage(m),
      d = {
        ...defaults,
        game: createGame(puzzles[0], {
          mode: "classic",
          mistakeMode: "relaxed",
        }),
      };
    expect(r.save(d)).toBe(true);
    expect(r.load().game).toEqual(d.game);
  });
  it("recovers corrupt and invalid saves", () => {
    const m = new Memory();
    m.setItem("tomduko:v3", "bad");
    expect(createStorage(m).load().game).toBeNull();
    expect(
      migrate({ ...defaults, game: { values: [] } }).recoveryMessage,
    ).toMatch(/damaged/);
  });
  it("adds sound defaults to older settings", () => {
    const oldSettings = { ...defaults.settings } as Partial<typeof defaults.settings>;
    delete oldSettings.soundEnabled;
    delete oldSettings.soundVolume;
    const migrated = migrate({ ...defaults, settings: oldSettings });
    expect(migrated.settings.soundEnabled).toBe(true);
    expect(migrated.settings.soundVolume).toBe(0.58);
  });
});
