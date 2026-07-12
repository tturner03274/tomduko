import { playSound } from "../audio/audio";
import { achievements } from "../config/achievements";
import { themes, type ThemeId } from "../config/themes";
import type { Settings, Statistics } from "../persistence/storage";
import type { Difficulty } from "../sudoku/types";
import { Icon, type IconName } from "./Icon";
const difficultyInfo: Record<
  Difficulty,
  { index: string; copy: string; level: number; accent: string }
> = {
  easy: {
    index: "I",
    copy: "Clear singles · Relaxed pace",
    level: 1,
    accent: "#68c8e8",
  },
  medium: {
    index: "II",
    copy: "Patterns emerge · Balanced",
    level: 2,
    accent: "#65d5aa",
  },
  hard: {
    index: "III",
    copy: "Pairs interact · Focused",
    level: 3,
    accent: "#e3b147",
  },
  expert: {
    index: "IV",
    copy: "Advanced logic · Relentless",
    level: 4,
    accent: "#ed755f",
  },
};
export function NewGame({
  start,
  back,
}: {
  start: (
    difficulty: Difficulty,
    mode: "classic" | "zen" | "time-attack",
  ) => void;
  back: () => void;
}) {
  return (
    <main className="panel-page ultra-panel">
      <Top title="Select a grid" kicker="NEW GAME" back={back} />
      <section className="panel-intro">
        <span className="eyebrow">CLASSIC DIFFICULTY</span>
        <h2>How sharp are you feeling?</h2>
        <p>Every board is unique, verified and ready offline.</p>
      </section>
      <div className="difficulty-list ultra-difficulty-list">
        {(["easy", "medium", "hard", "expert"] as Difficulty[]).map(
          (difficulty) => {
            const info = difficultyInfo[difficulty];
            return (
              <button
                key={difficulty}
                onClick={() => {
                  void playSound("select");
                  start(difficulty, "classic");
                }}
                style={
                  { "--difficulty-accent": info.accent } as React.CSSProperties
                }
              >
                <span className="difficulty-medal">{info.index}</span>
                <div>
                  <small>LEVEL {info.level}</small>
                  <strong>{difficulty}</strong>
                  <p>{info.copy}</p>
                  <i>
                    {Array.from({ length: 4 }, (_, index) => (
                      <b
                        key={index}
                        className={index < info.level ? "filled" : ""}
                      />
                    ))}
                  </i>
                </div>
                <Icon name="arrow" />
              </button>
            );
          },
        )}
      </div>
      <span className="section-label">SPECIAL MODES</span>
      <div className="mode-cards">
        <button onClick={() => start("medium", "zen")}>
          <span>
            <Icon name="hint" />
          </span>
          <div>
            <strong>Zen</strong>
            <small>No pressure. Pure flow.</small>
          </div>
          <Icon name="arrow" />
        </button>
        <button onClick={() => start("easy", "time-attack")}>
          <span className="hot">
            <Icon name="clock" />
          </span>
          <div>
            <strong>Time Attack</strong>
            <small>Five minutes. Maximum pace.</small>
          </div>
          <Icon name="arrow" />
        </button>
      </div>
      <div className="master-tease">
        <span>V</span>
        <div>
          <strong>Master tier</strong>
          <small>Advanced-chain grading is being forged.</small>
        </div>
        <b>LOCKED</b>
      </div>
    </main>
  );
}
export function SettingsPanel({
  settings,
  change,
  back,
  reset,
}: {
  settings: Settings;
  change: (settings: Settings) => void;
  back: () => void;
  reset: () => void;
}) {
  const update = (next: Settings, cue = true) => {
    change(next);
    if (cue) void playSound("select");
  };
  return (
    <main className="panel-page ultra-panel settings-page">
      <Top title="Club settings" kicker="PERSONALISE" back={back} />
      <Setting
        title="Sound lounge"
        subtitle="Locally synthesised casino ambience"
      >
        <div className="sound-console">
            <button
              className={`sound-orb ${settings.soundEnabled ? "on" : ""}`}
              aria-label={settings.soundEnabled ? "Disable sounds" : "Enable sounds"}
              onClick={() =>
              update({ ...settings, soundEnabled: !settings.soundEnabled })
            }
          >
            <Icon
              name={settings.soundEnabled ? "sound" : "volume-off"}
              size={25}
            />
            <span>{settings.soundEnabled ? "ON" : "OFF"}</span>
          </button>
          <div className="volume-control">
            <div>
              <span>Effects volume</span>
              <b>{Math.round(settings.soundVolume * 100)}%</b>
            </div>
            <input
              aria-label="Effects volume"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.soundVolume}
              disabled={!settings.soundEnabled}
              onChange={(event) =>
                update(
                  { ...settings, soundVolume: Number(event.target.value) },
                  false,
                )
              }
              onPointerUp={() => void playSound("achievement")}
            />
            <small>Gold chimes, crisp tiles and victory fanfares.</small>
          </div>
        </div>
      </Setting>
      <Setting title="Club atmosphere" subtitle="Choose your table">
        <div className="theme-picker ultra-theme-picker">
          {themes.map((theme) => (
            <button
              className={settings.theme === theme.id ? "selected" : ""}
              key={theme.id}
              onClick={() =>
                update({ ...settings, theme: theme.id as ThemeId })
              }
            >
              <i className={`theme-preview ${theme.id}`}>
                <span />
                <b />
                <em />
              </i>
              <span>
                <strong>{theme.name}</strong>
                <small>{theme.description}</small>
              </span>
              {settings.theme === theme.id && <Icon name="check" size={16} />}
            </button>
          ))}
        </div>
      </Setting>
      <Setting title="Play style" subtitle="Tune input and validation">
        <Segmented
          label="Input order"
          value={settings.inputMode}
          options={[
            ["cell-first", "Cell first"],
            ["number-first", "Number first"],
          ]}
          set={(value) =>
            update({ ...settings, inputMode: value as Settings["inputMode"] })
          }
        />
        <Segmented
          label="Mistake rules"
          value={settings.mistakeMode}
          options={[
            ["relaxed", "Relaxed"],
            ["three-strikes", "3 strikes"],
            ["off", "Conflicts only"],
          ]}
          set={(value) =>
            update({
              ...settings,
              mistakeMode: value as Settings["mistakeMode"],
            })
          }
        />
      </Setting>
      <Setting title="Smart assistance">
        <Toggle
          icon="note"
          label="Prevent impossible notes"
          detail="Blocks candidates that cannot fit"
          value={settings.preventImpossibleNotes}
          set={(value) =>
            update({ ...settings, preventImpossibleNotes: value })
          }
        />
        <Toggle
          icon="grid"
          label="Auto-remove notes"
          detail="Cleans peers after placements"
          value={settings.autoRemoveNotes}
          set={(value) => update({ ...settings, autoRemoveNotes: value })}
        />
      </Setting>
      <button className="danger-zone" onClick={reset}>
        Reset all local data
      </button>
    </main>
  );
}
export function StatisticsPanel({
  statistics,
  unlocked,
  back,
}: {
  statistics: Statistics;
  unlocked: string[];
  back: () => void;
}) {
  const rate = statistics.started
      ? Math.round((statistics.completed / statistics.started) * 100)
      : 0,
    recent = [...statistics.iqHistory].reverse().slice(0, 8),
    scores = statistics.iqHistory.slice(-10).map((result) => result.score),
    minimum = Math.min(...scores, 70),
    maximum = Math.max(...scores, 130),
    range = Math.max(1, maximum - minimum),
    trend = scores.length > 1 ? scores.at(-1)! - scores.at(-2)! : 0;
  return (
    <main className="panel-page ultra-panel stats-page">
      <Top title="Performance" kicker="TOMDUKO IQ" back={back} />
      <section className="iq-dashboard">
        <div
          className="iq-gauge"
          style={
            {
              "--iq-angle": `${Math.max(0, Math.min(1, ((statistics.currentIq ?? 70) - 70) / 90)) * 270}deg`,
            } as React.CSSProperties
          }
        >
          <div>
            <small>CURRENT</small>
            <strong>{statistics.currentIq ?? "—"}</strong>
            <span>{statistics.currentIq ? "IQ RATING" : "UNRANKED"}</span>
          </div>
        </div>
        <div className="iq-dashboard-copy">
          <span className="eyebrow">PERSONAL FORM</span>
          <h2>
            {statistics.currentIq
              ? rankName(statistics.currentIq)
              : "Complete your first grid"}
          </h2>
          <p>
            Personal best <b>{statistics.bestIq ?? "—"}</b>
          </p>
          {scores.length > 1 && (
            <span className={`trend ${trend >= 0 ? "up" : "down"}`}>
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)} from last solve
            </span>
          )}
        </div>
      </section>
      <p className="rating-note">
        <Icon name="info" size={14} /> A private game-performance rating, not a
        clinical IQ assessment.
      </p>
      {scores.length > 1 && (
        <section className="trend-card">
          <header>
            <span>FORM · LAST {scores.length} GRIDS</span>
            <b>
              {trend >= 0 ? "+" : ""}
              {trend}
            </b>
          </header>
          <div className="sparkline">
            {scores.map((score, index) => (
              <i
                key={index}
                style={{ height: `${24 + ((score - minimum) / range) * 56}%` }}
              >
                <span>{score}</span>
              </i>
            ))}
          </div>
        </section>
      )}
      <div className="stats-grid ultra-stats-grid">
        <Metric value={statistics.completed} label="Solved" />
        <Metric value={`${rate}%`} label="Completion" />
        <Metric value={statistics.currentStreak} label="Streak" />
        <Metric
          value={`${Math.floor(statistics.totalSeconds / 60)}m`}
          label="Play time"
        />
      </div>
      {recent.length > 0 && (
        <>
          <SectionTitle title="Recent rounds" detail="Latest IQ scores" />
          <div className="iq-history ultra-iq-history">
            {recent.map((result, index) => (
              <div key={result.id}>
                <span className="round-rank">{index + 1}</span>
                <strong>{result.score}</strong>
                <span>
                  <b>{result.difficulty}</b>
                  <small>
                    {format(result.seconds)} · {result.mistakes}M ·{" "}
                    {result.hints}H
                  </small>
                </span>
                <i
                  className={
                    result.score === (statistics.bestIq ?? -1) ? "best" : ""
                  }
                >
                  {result.score === (statistics.bestIq ?? -1) ? "BEST" : ""}
                </i>
              </div>
            ))}
          </div>
        </>
      )}
      <SectionTitle
        title="Cabinet"
        detail={`${unlocked.length}/${achievements.length} earned`}
      />
      <div className="achievement-list ultra-achievements">
        {achievements.map((achievement) => {
          const earned = unlocked.includes(achievement.id);
          return (
            <div key={achievement.id} className={earned ? "earned" : ""}>
              <i>
                <Icon name={earned ? "trophy" : "hint"} size={20} />
              </i>
              <span>
                <strong>{achievement.name}</strong>
                <small>{achievement.description}</small>
              </span>
              {earned && <b>EARNED</b>}
            </div>
          );
        })}
      </div>
    </main>
  );
}
export function HowTo({ back }: { back: () => void }) {
  return (
    <main className="panel-page ultra-panel how-page">
      <Top title="The playbook" kicker="HOW TO PLAY" back={back} />
      <section className="rules-hero">
        <div className="mini-board">
          {[5, "", 9, 7, 3, "", 2, 6, 1].map((value, index) => (
            <i key={index}>{value}</i>
          ))}
        </div>
        <div>
          <span className="eyebrow">THE OBJECTIVE</span>
          <h2>Every digit. Once.</h2>
          <p>Fill each row, column and 3×3 box with 1–9. No repeats.</p>
        </div>
      </section>
      <div className="rule-list">
        <Rule number="01" icon="play" title="Place with intent">
          Choose a cell then a number, or switch to number-first mode for rapid
          entry.
        </Rule>
        <Rule number="02" icon="note" title="Think in candidates">
          Notes preserve possibilities. Smart cleanup keeps the board precise.
        </Rule>
        <Rule number="03" icon="hint" title="Learn the logic">
          Hints explain the simplest valid technique before they ever reveal a
          value.
        </Rule>
        <Rule number="04" icon="trophy" title="Raise your IQ">
          Difficulty, pace, mistakes and hints combine into your Tomduko
          performance rating.
        </Rule>
        <Rule number="05" icon="home" title="Install the club">
          In iPhone Safari, tap Share then Add to Home Screen for full-screen
          offline play.
        </Rule>
      </div>
    </main>
  );
}
function Top({
  title,
  kicker,
  back,
}: {
  title: string;
  kicker: string;
  back: () => void;
}) {
  return (
    <header className="panel-head ultra-panel-head">
      <button
        className="icon-button glass-button"
        onClick={back}
        aria-label="Back"
      >
        <Icon name="back" />
      </button>
      <div>
        <span>{kicker}</span>
        <h1>{title}</h1>
      </div>
      <span className="panel-crest">T</span>
    </header>
  );
}
function Setting({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="setting ultra-setting">
      <header>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}
function Segmented({
  label,
  value,
  options,
  set,
}: {
  label: string;
  value: string;
  options: string[][];
  set: (value: string) => void;
}) {
  return (
    <div className="segmented-setting">
      <span>{label}</span>
      <div>
        {options.map(([id, name]) => (
          <button
            key={id}
            className={value === id ? "active" : ""}
            onClick={() => set(id)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
function Toggle({
  icon,
  label,
  detail,
  value,
  set,
}: {
  icon: IconName;
  label: string;
  detail: string;
  value: boolean;
  set: (value: boolean) => void;
}) {
  return (
    <label className="toggle ultra-toggle">
      <Icon name={icon} />
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      <input
        type="checkbox"
        checked={value}
        onChange={(event) => set(event.target.checked)}
      />
      <i />
    </label>
  );
}
function Metric({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
function SectionTitle({ title, detail }: { title: string; detail: string }) {
  return (
    <header className="section-title">
      <h2>{title}</h2>
      <span>{detail}</span>
    </header>
  );
}
function Rule({
  number,
  icon,
  title,
  children,
}: {
  number: string;
  icon: IconName;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article>
      <b>{number}</b>
      <i>
        <Icon name={icon} />
      </i>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </article>
  );
}
const format = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
const rankName = (iq: number) =>
  iq >= 145
    ? "Grandmaster form"
    : iq >= 130
      ? "Elite form"
      : iq >= 115
        ? "Sharp form"
        : iq >= 100
          ? "Rising form"
          : "Building form";
