import { useState } from "react";
import { playSound } from "../audio/audio";
import { Icon, type IconName } from "./Icon";
const pages: [string, string, string, IconName][] = [
  [
    "WELCOME TO THE CLUB",
    "Tomduko",
    "Sudoku elevated. No adverts, no subscriptions—just a beautifully focused game made for Tom.",
    "trophy",
  ],
  [
    "PRECISION INPUT",
    "Every move, tactile",
    "Tap a cell then a number. Switch on Notes when the solve demands deeper logic.",
    "grid",
  ],
  [
    "YOUR PERFORMANCE",
    "Build your Tomduko IQ",
    "Difficulty, pace, mistakes and hints shape a private rating you can chase every day.",
    "stats",
  ],
  [
    "READY FOR IPHONE",
    "Take the club with you",
    "In Safari, tap Share then Add to Home Screen. Your grids, scores and sounds work offline.",
    "home",
  ],
];
export function Onboarding({ finish }: { finish: () => void }) {
  const [step, setStep] = useState(0),
    [kicker, title, text, icon] = pages[step],
    next = () => {
      void playSound(step === pages.length - 1 ? "complete" : "select");
      if (step === pages.length - 1) finish();
      else setStep((value) => value + 1);
    };
  return (
    <main className="onboarding ultra-onboarding">
      <div className="onboard-aurora" />
      <button className="skip" onClick={finish} aria-label="Skip">
        Skip introduction
      </button>
      <div className="onboard-top">
        <span className="mini-crest">T</span>
        <strong>TOMDUKO</strong>
      </div>
      <section className="onboard-visual">
        {step === 0 ? (
          <div className="onboard-logo-frame">
            <img src="/branding/tomduko-pwa-source.png" alt="Tomduko crest" />
            <i />
            <b />
          </div>
        ) : step === 1 ? (
          <div className="onboard-mini-grid">
            {[5, "", 9, 7, 3, "", 2, 6, 1].map((value, index) => (
              <i key={index} className={index === 4 ? "active" : ""}>
                {value}
              </i>
            ))}
          </div>
        ) : step === 2 ? (
          <div className="onboard-iq">
            <span>IQ</span>
            <strong>127</strong>
            <div>
              {[38, 52, 47, 65, 74, 81].map((height, index) => (
                <i key={index} style={{ height }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="onboard-phone">
            <div>
              <img src="/icons/icon-192.png" alt="" />
              <span>
                <strong>Tomduko</strong>
                <small>Installed · Offline ready</small>
              </span>
            </div>
            <Icon name="check" />
          </div>
        )}
        <div className="visual-badge">
          <Icon name={icon} />
        </div>
      </section>
      <section className="onboard-copy">
        <span className="eyebrow">{kicker}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </section>
      <footer>
        <button className="onboard-cta" onClick={next}>
          {step === pages.length - 1 ? "Enter Tomduko" : "Continue"}
          <Icon name="arrow" />
        </button>
        <div className="dots">
          {pages.map((_, index) => (
            <button
              aria-label={`Go to introduction page ${index + 1}`}
              key={index}
              onClick={() => setStep(index)}
              className={index === step ? "active" : ""}
            />
          ))}
        </div>
        <span>{String(step + 1).padStart(2, "0")} / 04</span>
      </footer>
    </main>
  );
}
