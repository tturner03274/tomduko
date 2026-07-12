import type { GameMode, GameState } from "../game/types";
import type { Difficulty } from "../sudoku/types";
import { Icon } from "./Icon";
interface Props {
  game: GameState | null;
  streak: number;
  currentIq: number | null;
  bestIq: number | null;
  start: (difficulty: Difficulty, mode: GameMode) => void;
  navigate: (screen: string) => void;
}
export function Home({
  game,
  streak,
  currentIq,
  bestIq,
  start,
  navigate,
}: Props) {
  const progress = game
    ? Math.round(
        ((game.values.filter(Boolean).length -
          game.original.filter(Boolean).length) /
          (81 - game.original.filter(Boolean).length)) *
          100,
      )
    : 0;
  return (
    <main className="home ultra-home">
      <div className="ambient-orb orb-one" />
      <div className="ambient-orb orb-two" />
      <header className="home-head">
        <div className="wordmark">
          <span className="mini-crest">T</span>
          <span>
            <strong>TOMDUKO</strong>
            <small>PRIVATE SUDOKU CLUB</small>
          </span>
        </div>
        <button
          className="icon-button glass-button"
          onClick={() => navigate("settings")}
          aria-label="Settings"
        >
          <Icon name="settings" />
        </button>
      </header>
      <section className="hero ultra-hero">
        <div className="hero-brand">
          <img src="/branding/tomduko-hero.png" alt="" />
          <div className="hero-vignette" />
        </div>
        <div className="hero-copy">
          <span className="eyebrow">
            <i />
            THE DAILY MIND SPORT
          </span>
          <h1>
            Own the
            <br />
            <em>grid.</em>
          </h1>
          <p>Precision, pace and pure logic. Built exclusively for Tom.</p>
        </div>
        <div className="hero-seal">
          <Icon name="trophy" size={15} />
          <span>
            NO ADS
            <br />
            NO LIMITS
          </span>
        </div>
      </section>
      <button
        className="iq-card ultra-iq-card"
        onClick={() => navigate("statistics")}
        aria-label={`Tomduko IQ ${currentIq ?? "not yet scored"}, personal best ${bestIq ?? "not yet scored"}`}
      >
        <span className="iq-rank">
          <small>CURRENT IQ</small>
          <strong>{currentIq ?? "—"}</strong>
          <i>{currentIq ? "FORM RATING" : "COMPLETE A GRID"}</i>
        </span>
        <span className="iq-divider" />
        <span className="iq-best">
          <small>PERSONAL BEST</small>
          <b>{bestIq ?? "Unranked"}</b>
          <i>{bestIq ? "CHASE THE RECORD" : "YOUR SCORE AWAITS"}</i>
        </span>
        <span className="iq-arrow">
          <Icon name="arrow" size={18} />
        </span>
      </button>
      {game && game.status !== "complete" && (
        <button
          className="continue ultra-continue"
          onClick={() => navigate("game")}
        >
          <span
            className="continue-ring"
            style={
              { "--progress": `${progress * 3.6}deg` } as React.CSSProperties
            }
          >
            <b>{progress}%</b>
          </span>
          <div>
            <small>CONTINUE {game.mode.replace("-", " ").toUpperCase()}</small>
            <strong>{game.difficulty} grid</strong>
            <span>
              {game.mistakes} mistakes · {formatTime(game.elapsedSeconds)}
            </span>
          </div>
          <Icon name="play" size={19} />
        </button>
      )}
      <section className="launch-grid" aria-label="Start a game">
        <button className="launch-primary" onClick={() => navigate("new")}>
          <span className="launch-icon">
            <Icon name="grid" />
          </span>
          <span>
            <small>CHOOSE YOUR CHALLENGE</small>
            <strong>New Game</strong>
          </span>
          <Icon name="arrow" />
        </button>
        <button onClick={() => start("easy", "quick")}>
          <span className="launch-icon">
            <Icon name="play" />
          </span>
          <span>
            <strong>Quick Play</strong>
            <small>Instant grid</small>
          </span>
        </button>
        <button onClick={() => start("medium", "daily")}>
          <span className="launch-icon gold">
            <Icon name="calendar" />
          </span>
          <span>
            <strong>Daily</strong>
            <small>Today’s test</small>
          </span>
        </button>
      </section>
      <nav className="home-dock">
        <button onClick={() => navigate("statistics")}>
          <Icon name="stats" />
          <span>Statistics</span>
        </button>
        <div className="streak-medallion">
          <b>{streak}</b>
          <span>
            DAY
            <br />
            STREAK
          </span>
        </div>
        <button onClick={() => navigate("how")}>
          <Icon name="info" />
          <span>How to play</span>
        </button>
      </nav>
    </main>
  );
}
const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
