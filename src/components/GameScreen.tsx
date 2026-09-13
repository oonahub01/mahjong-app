"use client";

import { t } from "@/lib/i18n";
import { THEMES } from "@/lib/themes";
import { LEVELS } from "@/lib/levels";
import { useGame } from "@/store/GameProvider";
import { useState } from "react";
import { MahjongBoard } from "./MahjongBoard";
import { SettingsSheet } from "./SettingsSheet";

export function GameScreen() {
  const game = useGame();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const locale = game.persist.settings.locale;
  const theme = THEMES[game.persist.settings.theme];
  const level = typeof game.levelId === "number" ? LEVELS[game.levelId - 1] : null;

  return (
    <section className="game-page" style={{ background: theme.bg, color: theme.ink }}>
      <header className="hud" style={{ background: theme.hud }}>
        <button onClick={() => game.setScreen("home")}>{t(locale, "home")}</button>
        <div className="hud-mid">
          <b>{game.levelId === "daily" ? "Daily" : `Level ${game.levelId}`}</b>
          <span>
            {t(locale, "pairs")} {game.pairsLeft}
            {game.persist.settings.showTimer ? ` · ${formatTime(game.elapsed)}` : ""}
          </span>
        </div>
        <button onClick={game.pauseGame}>{t(locale, "pause")}</button>
      </header>

      <MahjongBoard
        tiles={game.tiles}
        selectedId={game.selectedId}
        hintIds={game.hintIds}
        sparkleIds={game.sparkleIds}
        wiggleId={game.wiggleId}
        shake={game.shake}
        tileTheme={game.persist.settings.tileTheme}
        onSelect={game.selectTile}
      />

      <footer className="booster-bar" style={{ background: theme.hud }}>
        <Booster
          label={t(locale, "hint")}
          count={game.persist.boosters.hint}
          onClick={game.useHint}
        />
        <Booster
          label={t(locale, "shuffle")}
          count={game.persist.boosters.shuffle}
          onClick={game.useShuffle}
        />
        <Booster
          label={t(locale, "undo")}
          count={game.persist.boosters.undo}
          onClick={game.useUndo}
        />
      </footer>

      {game.onboardingStep > 0 ? (
        <div className="overlay">
          <div className="card">
            <p>
              {game.onboardingStep === 1
                ? t(locale, "tutorial1")
                : game.onboardingStep === 2
                  ? t(locale, "tutorial2")
                  : t(locale, "tutorial3")}
            </p>
            <button
              className="cta"
              onClick={() => {
                if (game.onboardingStep >= 3) game.finishOnboarding();
                else game.setOnboardingStep(game.onboardingStep + 1);
              }}
            >
              {t(locale, "continue")}
            </button>
          </div>
        </div>
      ) : null}

      {game.overlay === "pause" ? (
        <div className="overlay">
          <div className="card">
            <h2>{t(locale, "pause")}</h2>
            <div className="row">
              <button onClick={game.closeOverlay}>{t(locale, "resume")}</button>
              <button onClick={() => setSettingsOpen(true)}>{t(locale, "settings")}</button>
              <button onClick={() => game.setScreen("home")}>{t(locale, "home")}</button>
            </div>
          </div>
        </div>
      ) : null}

      {game.overlay === "win" ? (
        <div className="overlay">
          <div className="card">
            <h2>{t(locale, "win")}</h2>
            <p className="stars-lg">
              {"★".repeat(game.persist.stars[String(game.levelId)] ?? 1)}
            </p>
            <p>
              {level
                ? `Par ${formatTime(level.parSec)} · your time ${formatTime(game.elapsed)}`
                : "Daily table complete"}
            </p>
            <div className="row">
              <button onClick={game.retry}>{t(locale, "retry")}</button>
              <button className="cta" onClick={game.nextLevel}>
                {t(locale, "next")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {game.overlay === "lose" ? (
        <div className="overlay">
          <div className="card">
            <h2>{t(locale, "lose")}</h2>
            <p>Shuffle to keep a solvable table, or retry. Ads never play mid-level.</p>
            <div className="row">
              <button onClick={game.useShuffle}>{t(locale, "shuffle")}</button>
              <button onClick={() => game.watchAd("shuffle")}>{t(locale, "watchAd")}</button>
              <button className="cta" onClick={game.retry}>
                {t(locale, "retry")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {game.overlay === "boosters" ? (
        <div className="overlay">
          <div className="card">
            <h2>Out of boosters</h2>
            <p>Helpers only. Every board is beatable without them.</p>
            <div className="row">
              <button onClick={() => game.watchAd("hint")}>{t(locale, "watchAd")}</button>
              <button onClick={game.closeOverlay}>Close</button>
            </div>
          </div>
        </div>
      ) : null}

      {game.overlay === "ad" ? (
        <div className="overlay">
          <div className="card">
            <h2>{game.adKind === "reward" ? "Rewarded video" : "Interstitial"}</h2>
            <p>
              {game.adKind === "interstitial"
                ? "Between levels only. Never mid-table."
                : "Demo reward grant after a short hold."}
            </p>
            <div className="ad-box">Playing ad…</div>
          </div>
        </div>
      ) : null}

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </section>
  );
}

function Booster({
  label,
  count,
  onClick,
}: {
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button className="booster" onClick={onClick}>
      <b>{label}</b>
      <span>{count}</span>
    </button>
  );
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
