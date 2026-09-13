"use client";

import { ACHIEVEMENTS, CATEGORIES } from "@/lib/achievements";
import { t } from "@/lib/i18n";
import { LAYOUTS } from "@/lib/layouts";
import { LEVELS, WORLD_NODES } from "@/lib/levels";
import { IAP_PACKS, THEMES, TILE_THEMES } from "@/lib/themes";
import { todayKey } from "@/lib/rng";
import { useGame } from "@/store/GameProvider";
import { useState } from "react";

export function HomeScreen() {
  const { persist, setScreen, startLevel } = useGame();
  const locale = persist.settings.locale;
  return (
    <section className="page home-page">
      <div className="logo-3d">Jade Solitaire</div>
      <p className="lede">Calm mahjong matching. Big tiles. Quiet table.</p>
      <div className="stat-row">
        <Stat label="Stars" value={persist.stats.totalStars} />
        <Stat label="Streak" value={persist.stats.streak} />
        <Stat label="Coins" value={persist.coins} />
      </div>
      <button className="cta" onClick={() => startLevel(persist.highestUnlocked)}>
        {t(locale, "play")} · Level {persist.highestUnlocked}
      </button>
      <nav className="home-nav">
        {(
          [
            ["levels", "levels"],
            ["daily", "daily"],
            ["map", "map"],
            ["goals", "goals"],
            ["gallery", "gallery"],
            ["shop", "shop"],
            ["challenges", "challenges"],
          ] as const
        ).map(([screen, key]) => (
          <button key={screen} onClick={() => setScreen(screen)}>
            {t(locale, key)}
          </button>
        ))}
      </nav>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export function LevelSelect() {
  const { persist, startLevel, setScreen } = useGame();
  return (
    <section className="page">
      <header className="page-head">
        <button onClick={() => setScreen("home")}>Back</button>
        <h1>Levels</h1>
      </header>
      <div className="level-grid">
        {LEVELS.map((level) => {
          const locked = level.id > persist.highestUnlocked;
          const stars = persist.stars[String(level.id)] ?? 0;
          return (
            <button
              key={level.id}
              className="level-card"
              disabled={locked}
              onClick={() => startLevel(level.id)}
            >
              <b>{level.id}</b>
              <small>D{level.difficulty}</small>
              <span className="stars">{locked ? "•" : "★".repeat(stars) + "☆".repeat(3 - stars)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function GoalsScreen() {
  const { persist, setScreen } = useGame();
  return (
    <section className="page">
      <header className="page-head">
        <button onClick={() => setScreen("home")}>Back</button>
        <h1>Goals</h1>
      </header>
      {CATEGORIES.map((cat) => (
        <div key={cat.id} className="goal-group">
          <h3>{cat.title}</h3>
          {ACHIEVEMENTS.filter((item) => item.category === cat.id).map((item) => {
            const value = Math.min(item.target, persist.achievementProgress[item.id] ?? 0);
            return (
              <div key={item.id} className="goal-row">
                <div>
                  <b>{item.title}</b>
                  <p>{item.detail}</p>
                </div>
                <div className="bar">
                  <i style={{ width: `${(value / item.target) * 100}%` }} />
                </div>
                <small>
                  {value}/{item.target}
                </small>
              </div>
            );
          })}
        </div>
      ))}
    </section>
  );
}

export function GalleryScreen() {
  const { persist, setScreen, startLevel } = useGame();
  return (
    <section className="page">
      <header className="page-head">
        <button onClick={() => setScreen("home")}>Back</button>
        <h1>Board gallery</h1>
      </header>
      <div className="gallery-grid">
        {LAYOUTS.map((layout) => {
          const sample = LEVELS.find((level) => level.layoutId === layout.id);
          return (
            <button
              key={layout.id}
              className="gallery-card"
              onClick={() => sample && startLevel(sample.id)}
            >
              <MiniPreview count={layout.tileCount} difficulty={layout.difficulty} />
              <b>{layout.name}</b>
              <small>
                {layout.tileCount} tiles · D{layout.difficulty}
              </small>
            </button>
          );
        })}
      </div>
      <p className="fine">{persist.stats.gamesPlayed} tables played</p>
    </section>
  );
}

function MiniPreview({ count, difficulty }: { count: number; difficulty: number }) {
  const cells = Math.min(24, 8 + difficulty * 3);
  return (
    <div className="mini">
      {Array.from({ length: cells }, (_, i) => (
        <i key={i} style={{ opacity: i < count / 12 ? 1 : 0.25 }} />
      ))}
    </div>
  );
}

export function ShopScreen() {
  const { persist, setScreen, claimShop } = useGame();
  return (
    <section className="page">
      <header className="page-head">
        <button onClick={() => setScreen("home")}>Back</button>
        <h1>Shop · {persist.coins} coins</h1>
      </header>
      <p className="lede">Demo purchases credit locally. First session stays ad-free.</p>
      <div className="shop-grid">
        {IAP_PACKS.map((pack) => (
          <button key={pack.id} className="shop-card" onClick={() => claimShop("coins", pack.id.split("-")[1])}>
            <b>{pack.label}</b>
            <span>{pack.coins} coins</span>
            <em>{pack.price}</em>
          </button>
        ))}
        <button className="shop-card gold" onClick={() => claimShop("ads")}>
          <b>Remove ads</b>
          <em>$7.99 once</em>
        </button>
        <button className="shop-card gold" onClick={() => claimShop("sub")}>
          <b>Calm Club</b>
          <span>Daily coins, extra undo</span>
          <em>$4.99 / mo</em>
        </button>
        {TILE_THEMES.filter((item) => item.premium).map((item) => (
          <button key={item.id} className="shop-card" onClick={() => claimShop("theme", item.id)}>
            <b>{item.label}</b>
            <em>{item.price} coins</em>
          </button>
        ))}
      </div>
    </section>
  );
}

export function DailyScreen() {
  const { persist, setScreen, startDaily } = useGame();
  const today = todayKey();
  const played = persist.dailySeedPlayed === today;
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 13 + i);
    return d.toISOString().slice(0, 10);
  });
  return (
    <section className="page">
      <header className="page-head">
        <button onClick={() => setScreen("home")}>Back</button>
        <h1>Daily puzzle</h1>
      </header>
      <p className="lede">A unique board each day. Streak forgives one missed morning.</p>
      <div className="calendar">
        {days.map((day) => (
          <span key={day} className={persist.loginDates.includes(day) ? "is-on" : ""}>
            {Number(day.slice(-2))}
          </span>
        ))}
      </div>
      <p>Streak {persist.stats.streak} · rewards climb with each login</p>
      <button className="cta" disabled={played} onClick={startDaily}>
        {played ? "Already cleared today" : "Play today"}
      </button>
    </section>
  );
}

export function MapScreen() {
  const { setScreen, startLevel } = useGame();
  return (
    <section className="page">
      <header className="page-head">
        <button onClick={() => setScreen("home")}>Back</button>
        <h1>World map</h1>
      </header>
      <p className="lede">Thousands of reverse-solved boards. Easy breathers every 5–8 tables.</p>
      <div className="worlds">
        {WORLD_NODES.map((world) => (
          <button
            key={world.id}
            className="world-card"
            disabled={!world.unlocked}
            onClick={() => startLevel(1)}
          >
            <b>{world.name}</b>
            <small>{world.levels} generated levels</small>
          </button>
        ))}
      </div>
    </section>
  );
}

export function ChallengeScreen() {
  const { persist, setScreen, bump } = useGame();
  const [joined, setJoined] = useState(false);
  return (
    <section className="page">
      <header className="page-head">
        <button onClick={() => setScreen("home")}>Back</button>
        <h1>Weekly table</h1>
      </header>
      <div className="leader">
        <p>Your score {persist.weeklyScore}</p>
        {[
          ["Mei", 2840],
          ["Helen", 2610],
          ["You", persist.weeklyScore],
          ["Rosa", 1980],
          ["Asha", 1760],
        ]
          .sort((a, b) => Number(b[1]) - Number(a[1]))
          .map((row, i) => (
            <div key={String(row[0])} className="lead-row">
              <span>{i + 1}</span>
              <b>{row[0]}</b>
              <em>{row[1]}</em>
            </div>
          ))}
      </div>
      <button
        className="cta"
        onClick={() => {
          bump("challenge");
          setJoined(true);
        }}
      >
        {joined ? "Challenge joined · jade tile back" : "Join weekly challenge"}
      </button>
    </section>
  );
}
