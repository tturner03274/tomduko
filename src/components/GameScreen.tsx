import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { playSound } from "../audio/audio";
import { calculateTomdukoIq } from "../game/iqScore";
import type { Action } from "../game/reducer";
import type { GameState } from "../game/types";
import { nextLogicalHint } from "../sudoku/techniques";
import type { Digit } from "../sudoku/types";
import { Icon } from "./Icon";
import { SudokuGrid } from "./SudokuGrid";
const format = (seconds: number) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
export function GameScreen({
  game,
  dispatch,
  home,
  next,
}: {
  game: GameState;
  dispatch: (action: Action) => void;
  home: () => void;
  next: () => void;
}) {
  const [hintOpen, setHintOpen] = useState(false),
    hint = useMemo(() => nextLogicalHint(game.values), [game.values]),
    previousStatus = useRef(game.status),
    filled = game.values.filter(Boolean).length,
    givens = game.original.filter(Boolean).length,
    progress = Math.round(((filled - givens) / (81 - givens)) * 100),
    iq = calculateTomdukoIq({
      difficulty: game.difficulty,
      seconds: game.elapsedSeconds,
      mistakes: game.mistakes,
      hints: game.hintsUsed,
    });
  const select = useCallback(
    (index: number) => {
      dispatch({ type: "select", index });
      void playSound("select");
    },
    [dispatch],
  );
  const enter = useCallback(
    (digit: Digit) => {
      const index = game.selected;
      if (index === null || game.original[index] || game.status !== "playing")
        return;
    const cue = game.notesMode
      ? "note"
      : game.mistakeMode !== "off" && digit !== game.solution[index]
        ? "error"
        : "place";
      dispatch({ type: "input", digit });
      void playSound(cue);
    },
    [
      dispatch,
    game.notesMode,
    game.mistakeMode,
      game.original,
      game.selected,
      game.solution,
      game.status,
    ],
  );
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (/^[1-9]$/.test(event.key)) enter(Number(event.key) as Digit);
      else if (event.key === "Backspace" || event.key === "Delete") {
        dispatch({ type: "clear" });
        void playSound("undo");
      } else if (event.key.toLowerCase() === "n") {
        dispatch({ type: "toggle-notes" });
        void playSound("note");
      } else if (event.key.startsWith("Arrow") && game.selected !== null) {
        const delta =
          event.key === "ArrowLeft"
            ? -1
            : event.key === "ArrowRight"
              ? 1
              : event.key === "ArrowUp"
                ? -9
                : 9;
        select((game.selected + delta + 81) % 81);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [dispatch, enter, game.selected, select]);
  useEffect(() => {
    if (previousStatus.current !== "complete" && game.status === "complete")
      void playSound("complete");
    previousStatus.current = game.status;
  }, [game.status]);
  const pause = () => {
    dispatch({ type: game.status === "paused" ? "resume" : "pause" });
    void playSound("pause");
  };
  return (
    <main className="game-screen ultra-game">
      <div className="game-aurora" />
      <header className="game-header ultra-game-header">
        <button
          className="icon-button glass-button"
          onClick={home}
          aria-label="Home"
        >
          <Icon name="back" />
        </button>
        <div className="game-title">
          <span>
            {game.mode === "daily"
              ? "TODAY’S CHALLENGE"
              : game.mode.replace("-", " ").toUpperCase()}
          </span>
          <strong>{game.difficulty}</strong>
        </div>
        <button
          className="game-time"
          onClick={pause}
          aria-label={game.status === "paused" ? "Resume game" : "Pause game"}
        >
          <Icon name={game.status === "paused" ? "play" : "pause"} size={14} />
          <span>
            {game.mode === "zen"
              ? "ZEN"
              : format(game.countdownSeconds ?? game.elapsedSeconds)}
          </span>
        </button>
      </header>
      <div className="game-status-strip">
        <span>
          <i className="status-gem" />
          IQ PACE <b>{iq.score}</b>
        </span>
        <span>{progress}% SOLVED</span>
        <span className={game.mistakes ? "has-mistakes" : ""}>
          {game.mistakes} {game.mistakes === 1 ? "MISTAKE" : "MISTAKES"}
        </span>
      </div>
      <div className="board-stage">
        <div className="board-halo" />
        <div className="board-corner top-left" />
        <div className="board-corner top-right" />
        <div className="board-corner bottom-left" />
        <div className="board-corner bottom-right" />
        <SudokuGrid game={game} select={select} />
      </div>
      <div className="number-pad ultra-number-pad" aria-label="Number pad">
        {([1, 2, 3, 4, 5, 6, 7, 8, 9] as Digit[]).map((digit) => {
          const count = game.values.filter((value) => value === digit).length,
            done = count === 9;
          return (
            <button
              key={digit}
              onClick={() => enter(digit)}
              disabled={done}
              aria-label={`${digit}${done ? ", completed" : ""}`}
            >
              <span>{digit}</span>
              <i>{done ? <Icon name="check" size={10} /> : 9 - count}</i>
            </button>
          );
        })}
      </div>
      <nav className="game-actions ultra-actions">
        <button
          onClick={() => {
            dispatch({ type: "undo" });
            void playSound("undo");
          }}
          disabled={!game.history.length}
        >
          <Icon name="undo" />
          <span>Undo</span>
        </button>
        <button
          onClick={() => {
            dispatch({ type: "redo" });
            void playSound("undo");
          }}
          disabled={!game.future.length}
        >
          <Icon name="redo" />
          <span>Redo</span>
        </button>
        <button
          className={game.notesMode ? "active" : ""}
          onClick={() => {
            dispatch({ type: "toggle-notes" });
            void playSound("note");
          }}
        >
          <Icon name="note" />
          <span>Notes</span>
          <i>{game.notesMode ? "ON" : ""}</i>
        </button>
        <button
          onClick={() => {
            dispatch({ type: "clear" });
            void playSound("undo");
          }}
        >
          <Icon name="erase" />
          <span>Erase</span>
        </button>
        <button
          onClick={() => {
            setHintOpen(true);
            void playSound("hint");
          }}
        >
          <Icon name="hint" />
          <span>Hint</span>
        </button>
      </nav>
      {game.status === "paused" && (
        <div className="overlay ultra-overlay">
          <section className="pause-card">
            <div className="modal-crest">
              <span>T</span>
            </div>
            <span className="eyebrow">MIND AT REST</span>
            <h2>Game paused</h2>
            <p>
              Your time is frozen. The grid will be exactly where you left it.
            </p>
            <button onClick={pause}>
              <Icon name="play" />
              Return to the grid
            </button>
            <button className="text-button" onClick={home}>
              Save &amp; go home
            </button>
          </section>
        </div>
      )}
      {hintOpen && (
        <div className="overlay ultra-overlay" role="dialog" aria-label="Hint">
          <section className="hint-card">
            <div className="modal-icon">
              <Icon name="hint" />
            </div>
            <span className="eyebrow">LOGIC COACH</span>
            <h2>{hint?.title ?? "Scan the possibilities"}</h2>
            <p>
              {hint?.explanation ??
                "Review the candidates in each box. There is no simple single available yet."}
            </p>
            {hint?.targetCell && (
              <div className="hint-location">
                <span>FOCUS CELL</span>
                <strong>
                  R{hint.targetCell.row + 1} · C{hint.targetCell.col + 1}
                </strong>
              </div>
            )}
            <button
              onClick={() => {
                if (hint?.targetCell && hint.targetDigit) {
                  dispatch({
                    type: "select",
                    index: hint.targetCell.row * 9 + hint.targetCell.col,
                  });
                  dispatch({
                    type: "hint",
                    index: hint.targetCell.row * 9 + hint.targetCell.col,
                    digit: hint.targetDigit,
                  });
                  void playSound("place");
                }
                setHintOpen(false);
              }}
              disabled={!hint}
            >
              Apply logical step
            </button>
            <button className="text-button" onClick={() => setHintOpen(false)}>
              Keep solving myself
            </button>
          </section>
        </div>
      )}
      {game.status === "complete" && (
        <div className="overlay ultra-overlay completion">
          <section className="completion-card">
            <div className="victory-rays" />
            <div className="completion-trophy">
              <Icon name="trophy" size={34} />
            </div>
            <span className="eyebrow">GRID MASTERED</span>
            <h2>Exceptional solve.</h2>
            <p className="completion-sub">
              Precision rewarded. Your new performance rating is in.
            </p>
            <div className="completion-iq">
              <small>TOMDUKO IQ</small>
              <strong>{iq.score}</strong>
              <span
                className={iq.speedAdjustment >= 0 ? "positive" : "negative"}
              >
                {iq.speedAdjustment >= 0 ? "+" : ""}
                {iq.speedAdjustment} pace
              </span>
            </div>
            <div className="summary">
              <div>
                <strong>{format(game.elapsedSeconds)}</strong>
                <span>Time</span>
              </div>
              <div>
                <strong>{game.mistakes}</strong>
                <span>Mistakes</span>
              </div>
              <div>
                <strong>{game.hintsUsed}</strong>
                <span>Hints</span>
              </div>
            </div>
            <div className="completion-actions">
              <button onClick={next}>
                Next grid <Icon name="arrow" />
              </button>
              <button className="text-button" onClick={home}>
                Return home
              </button>
            </div>
          </section>
        </div>
      )}
      {game.status === "failed" && (
        <div className="overlay ultra-overlay">
          <section>
            <div className="modal-icon danger">
              <Icon name="clock" />
            </div>
            <h2>
              {game.countdownSeconds === 0 ? "Time is up" : "Three strikes"}
            </h2>
            <p>This run is over, but the next grid is waiting.</p>
            <button onClick={home}>Return to club</button>
          </section>
        </div>
      )}
      <div aria-live="polite" className="sr-only">
        {game.status === "complete"
          ? `Puzzle complete. Tomduko IQ ${iq.score}.`
          : ""}
      </div>
    </main>
  );
}
