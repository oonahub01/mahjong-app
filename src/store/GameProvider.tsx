"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  playSfx,
  startAmbient,
  startMusic,
  stopAmbient,
  stopMusic,
  unlockAudio,
} from "@/lib/audio";
import { findMatchPair, freeTiles, isTileFree, remainingPairs } from "@/lib/free";
import { generateSolvableBoard, hasMove, shuffleRemaining } from "@/lib/generate";
import { hashString, todayKey } from "@/lib/rng";
import { LAYOUT_BY_ID } from "@/lib/layouts";
import { LEVELS } from "@/lib/levels";
import { applyDailyLogin, isFirstSession, loadPersist, savePersist } from "@/lib/persist";
import type {
  GameSnapshot,
  PersistState,
  Screen,
  Settings,
  TileInstance,
} from "@/lib/types";

type Overlay = "none" | "win" | "lose" | "pause" | "boosters" | "ad";

type GameContextValue = {
  persist: PersistState;
  screen: Screen;
  setScreen: (screen: Screen) => void;
  tiles: TileInstance[];
  selectedId: string | null;
  hintIds: string[];
  combo: number;
  shake: boolean;
  wiggleId: string | null;
  sparkleIds: string[];
  overlay: Overlay;
  levelId: number | "daily";
  elapsed: number;
  pairsLeft: number;
  onboardingStep: number;
  adKind: "reward" | "interstitial";
  pendingReward: "hint" | "shuffle" | "undo" | "coins" | null;
  selectTile: (id: string) => void;
  startLevel: (id: number) => void;
  startDaily: () => void;
  useHint: () => void;
  useShuffle: () => void;
  useUndo: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  claimShop: (kind: "coins" | "ads" | "sub" | "theme", extra?: string) => void;
  watchAd: (reward: "hint" | "shuffle" | "undo" | "coins") => void;
  closeOverlay: () => void;
  pauseGame: () => void;
  retry: () => void;
  nextLevel: () => void;
  bump: (id: string, amount?: number) => void;
  finishOnboarding: () => void;
  setOnboardingStep: (step: number) => void;
};

const GameContext = createContext<GameContextValue | null>(null);

function starsFor(elapsed: number, parSec: number, hintsUsed: number, leftoverUndo: boolean) {
  let stars = 1;
  if (elapsed <= parSec) stars += 1;
  if (hintsUsed === 0 && leftoverUndo) stars += 1;
  return Math.min(3, stars);
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [persist, setPersist] = useState<PersistState>(() => applyDailyLogin(loadPersist()));
  const [screen, setScreen] = useState<Screen>("home");
  const [tiles, setTiles] = useState<TileInstance[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hintIds, setHintIds] = useState<string[]>([]);
  const [combo, setCombo] = useState(0);
  const [shake, setShake] = useState(false);
  const [wiggleId, setWiggleId] = useState<string | null>(null);
  const [sparkleIds, setSparkleIds] = useState<string[]>([]);
  const [overlay, setOverlay] = useState<Overlay>("none");
  const [levelId, setLevelId] = useState<number | "daily">(1);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [adKind, setAdKind] = useState<"reward" | "interstitial">("reward");
  const [pendingReward, setPendingReward] = useState<"hint" | "shuffle" | "undo" | "coins" | null>(
    null,
  );
  const undoStack = useRef<GameSnapshot[]>([]);
  const hintsUsed = useRef(0);
  const lastMatchAt = useRef(0);
  const levelsSinceAd = useRef(0);
  const playedLayouts = useRef(new Set<string>());

  useEffect(() => {
    savePersist(persist);
  }, [persist]);

  useEffect(() => {
    if (screen !== "game" || overlay !== "none") return;
    const timer = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 250);
    return () => window.clearInterval(timer);
  }, [screen, overlay, startedAt]);

  useEffect(() => {
    const settings = persist.settings;
    const musicVol = settings.musicMute ? 0 : settings.musicVol;
    const ambVol = settings.musicMute ? 0 : settings.musicVol * 0.8;
    startMusic(musicVol);
    startAmbient(settings.ambient, ambVol);
    return () => {
      stopMusic();
      stopAmbient();
    };
  }, [persist.settings]);

  const sfx = (name: Parameters<typeof playSfx>[0]) => {
    const vol = persist.settings.sfxMute ? 0 : persist.settings.sfxVol;
    playSfx(name, vol);
  };

  const bump = (id: string, amount = 1) => {
    setPersist((prev) => {
      const current = (prev.achievementProgress[id] ?? 0) + amount;
      return {
        ...prev,
        achievementProgress: { ...prev.achievementProgress, [id]: current },
      };
    });
  };

  const beginBoard = (layoutId: string, seed: number, id: number | "daily") => {
    const layout = LAYOUT_BY_ID[layoutId];
    const board = generateSolvableBoard(layout.slots, seed);
    setTiles(board);
    setSelectedId(null);
    setHintIds([]);
    setCombo(0);
    setOverlay("none");
    setLevelId(id);
    setStartedAt(Date.now());
    setElapsed(0);
    undoStack.current = [];
    hintsUsed.current = 0;
    lastMatchAt.current = 0;
    playedLayouts.current.add(layoutId);
    setPersist((prev) => ({
      ...prev,
      stats: { ...prev.stats, gamesPlayed: prev.stats.gamesPlayed + 1 },
    }));
    setPersist((prev) => ({
      ...prev,
      achievementProgress: {
        ...prev.achievementProgress,
        "layouts-5": playedLayouts.current.size,
        "all-layouts": playedLayouts.current.size,
      },
    }));
    setScreen("game");
    if (!persist.onboardingDone) setOnboardingStep(1);
  };

  const startLevel = (id: number) => {
    void unlockAudio();
    const level = LEVELS[id - 1];
    beginBoard(level.layoutId, id * 7919, id);
  };

  const startDaily = () => {
    void unlockAudio();
    beginBoard("pavilion", hashString(todayKey()), "daily");
  };

  const pushUndo = (current: TileInstance[]) => {
    undoStack.current = [...undoStack.current, { tiles: current.map((tile) => ({ ...tile })) }].slice(
      -10,
    );
  };

  const winBoard = (nextTiles: TileInstance[]) => {
    const level = typeof levelId === "number" ? LEVELS[levelId - 1] : null;
    const time = Math.floor((Date.now() - startedAt) / 1000);
    const stars = starsFor(
      time,
      level?.parSec ?? 300,
      hintsUsed.current,
      persist.boosters.undo > 0,
    );
    sfx("win");
    setOverlay("win");
    setPersist((prev) => {
      const key = String(levelId);
      const prevStars = prev.stars[key] ?? 0;
      const starsMap = { ...prev.stars, [key]: Math.max(prevStars, stars) };
      const totalStars = Object.values(starsMap).reduce((sum, n) => sum + n, 0);
      const highest =
        typeof levelId === "number"
          ? Math.max(prev.highestUnlocked, Math.min(50, levelId + 1))
          : prev.highestUnlocked;
      return {
        ...prev,
        stars: starsMap,
        highestUnlocked: highest,
        coins: prev.coins + 20 + stars * 10,
        weeklyScore: prev.weeklyScore + 100 + stars * 25,
        dailySeedPlayed: levelId === "daily" ? todayKey() : prev.dailySeedPlayed,
        stats: {
          ...prev.stats,
          wins: prev.stats.wins + 1,
          totalStars,
          dailyWins: prev.stats.dailyWins + (levelId === "daily" ? 1 : 0),
        },
        achievementProgress: {
          ...prev.achievementProgress,
          "win-1": 1,
          "win-10": prev.stats.wins + 1,
          "wins-36": prev.stats.wins + 1,
          "stars-15": totalStars,
          "stars-80": totalStars,
          "three-star": Math.max(prev.achievementProgress["three-star"] ?? 0, stars === 3 ? 1 : 0),
          "fast-win": Math.max(
            prev.achievementProgress["fast-win"] ?? 0,
            level && time <= level.parSec ? 1 : 0,
          ),
          "no-hint": Math.max(prev.achievementProgress["no-hint"] ?? 0, hintsUsed.current === 0 ? 1 : 0),
          "undo-less": Math.max(prev.achievementProgress["undo-less"] ?? 0, 1),
          "hard-win": Math.max(
            prev.achievementProgress["hard-win"] ?? 0,
            (level?.difficulty ?? 0) >= 4 ? 1 : 0,
          ),
          "expert-win": Math.max(
            prev.achievementProgress["expert-win"] ?? 0,
            (level?.difficulty ?? 0) >= 5 ? 1 : 0,
          ),
          "daily-1": levelId === "daily" ? 1 : prev.achievementProgress["daily-1"] ?? 0,
          "daily-5": prev.stats.dailyWins + (levelId === "daily" ? 1 : 0),
          "levels-20": highest,
          "levels-50": highest,
        },
      };
    });
    void nextTiles;
  };

  const selectTile = (id: string) => {
    void unlockAudio();
    if (overlay !== "none" || onboardingStep > 0) return;
    const tile = tiles.find((item) => item.id === id);
    if (!tile || tile.removed || !isTileFree(tile, tiles)) return;
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(12);
    sfx("tap");
    if (!selectedId || selectedId === id) {
      setSelectedId(id);
      return;
    }
    const first = tiles.find((item) => item.id === selectedId);
    if (!first) {
      setSelectedId(id);
      return;
    }
    if (first.typeId !== tile.typeId) {
      sfx("mismatch");
      setWiggleId(id);
      window.setTimeout(() => setWiggleId(null), 420);
      setSelectedId(null);
      return;
    }
    pushUndo(tiles);
    const now = Date.now();
    const nextCombo = now - lastMatchAt.current < 2600 ? combo + 1 : 1;
    lastMatchAt.current = now;
    setCombo(nextCombo);
    if (nextCombo >= 2) {
      setShake(true);
      window.setTimeout(() => setShake(false), 380);
      sfx(nextCombo >= 5 ? "combo3" : nextCombo >= 3 ? "combo2" : "combo1");
    } else {
      sfx("match");
    }
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(22);
    setSparkleIds([first.id, tile.id]);
    window.setTimeout(() => setSparkleIds([]), 700);
    const nextTiles = tiles.map((item) =>
      item.id === first.id || item.id === tile.id ? { ...item, removed: true } : item,
    );
    setTiles(nextTiles);
    setSelectedId(null);
    setHintIds([]);
    setPersist((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        matches: prev.stats.matches + 1,
        bestCombo: Math.max(prev.stats.bestCombo, nextCombo),
      },
      achievementProgress: {
        ...prev.achievementProgress,
        "first-match": 1,
        "matches-50": prev.stats.matches + 1,
        "matches-200": prev.stats.matches + 1,
        "combo-3": Math.max(prev.achievementProgress["combo-3"] ?? 0, nextCombo),
        "combo-6": Math.max(prev.achievementProgress["combo-6"] ?? 0, nextCombo),
      },
    }));
    if (nextTiles.every((item) => item.removed)) {
      winBoard(nextTiles);
      return;
    }
    if (!hasMove(nextTiles)) setOverlay("lose");
  };

  const useHint = () => {
    if (persist.boosters.hint <= 0) {
      setOverlay("boosters");
      return;
    }
    const pair = findMatchPair(tiles);
    if (!pair) return;
    sfx("hint");
    hintsUsed.current += 1;
    setHintIds([pair[0].id, pair[1].id]);
    setPersist((prev) => ({
      ...prev,
      boosters: { ...prev.boosters, hint: prev.boosters.hint - 1 },
    }));
  };

  const useShuffle = () => {
    if (persist.boosters.shuffle <= 0) {
      setOverlay("boosters");
      return;
    }
    sfx("shuffle");
    pushUndo(tiles);
    setTiles(shuffleRemaining(tiles, Date.now()));
    setSelectedId(null);
    setHintIds([]);
    setPersist((prev) => ({
      ...prev,
      boosters: { ...prev.boosters, shuffle: prev.boosters.shuffle - 1 },
    }));
  };

  const useUndo = () => {
    if (undoStack.current.length === 0) return;
    if (persist.boosters.undo <= 0) {
      setOverlay("boosters");
      return;
    }
    const snap = undoStack.current.pop();
    if (!snap) return;
    sfx("ui");
    setTiles(snap.tiles);
    setSelectedId(null);
    setHintIds([]);
    setPersist((prev) => ({
      ...prev,
      boosters: { ...prev.boosters, undo: prev.boosters.undo - 1 },
    }));
  };

  const updateSettings = (patch: Partial<Settings>) => {
    void unlockAudio();
    setPersist((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  };

  const claimShop = (kind: "coins" | "ads" | "sub" | "theme", extra?: string) => {
    sfx("ui");
    setPersist((prev) => {
      if (kind === "ads") return { ...prev, settings: { ...prev.settings, adsRemoved: true }, coins: prev.coins };
      if (kind === "sub") return { ...prev, settings: { ...prev.settings, subscribed: true }, coins: prev.coins + 200 };
      if (kind === "theme" && extra) {
        return {
          ...prev,
          coins: Math.max(0, prev.coins - 400),
          ownedThemes: [...new Set([...prev.ownedThemes, extra])],
          settings: { ...prev.settings, tileTheme: extra },
          achievementProgress: { ...prev.achievementProgress, "own-theme": 1, "shop-look": 1 },
        };
      }
      const pack =
        extra === "1999" || extra === "vault"
          ? 6000
          : extra === "999" || extra === "chest"
            ? 2600
            : extra === "299" || extra === "bundle"
              ? 700
              : 200;
      return {
        ...prev,
        coins: prev.coins + pack,
        achievementProgress: {
          ...prev.achievementProgress,
          "shop-look": 1,
          "coins-500": prev.coins + pack,
        },
      };
    });
  };

  const watchAd = (reward: "hint" | "shuffle" | "undo" | "coins") => {
    if (isFirstSession(persist) || persist.settings.adsRemoved) {
      grantReward(reward);
      return;
    }
    setPendingReward(reward);
    setAdKind("reward");
    setOverlay("ad");
    window.setTimeout(() => {
      grantReward(reward);
      setOverlay("none");
      setPendingReward(null);
    }, 2200);
  };

  const grantReward = (reward: "hint" | "shuffle" | "undo" | "coins") => {
    setPersist((prev) => {
      if (reward === "coins") return { ...prev, coins: prev.coins + 40 };
      return { ...prev, boosters: { ...prev.boosters, [reward]: prev.boosters[reward] + 1 } };
    });
  };

  const maybeInterstitial = () => {
    levelsSinceAd.current += 1;
    if (
      persist.settings.adsRemoved ||
      persist.settings.subscribed ||
      isFirstSession(persist) ||
      levelsSinceAd.current < 3
    ) {
      return false;
    }
    levelsSinceAd.current = 0;
    setAdKind("interstitial");
    setOverlay("ad");
    window.setTimeout(() => setOverlay("none"), 1800);
    return true;
  };

  const closeOverlay = () => setOverlay("none");
  const pauseGame = () => setOverlay("pause");

  const retry = () => {
    if (levelId === "daily") startDaily();
    else startLevel(levelId);
  };

  const nextLevel = () => {
    if (maybeInterstitial()) {
      window.setTimeout(() => {
        if (typeof levelId === "number") startLevel(Math.min(50, levelId + 1));
        else setScreen("home");
      }, 1900);
      return;
    }
    if (typeof levelId === "number") startLevel(Math.min(50, levelId + 1));
    else setScreen("home");
  };

  const go = (next: Screen) => {
    void unlockAudio();
    sfx("ui");
    if (next === "shop") bump("shop-look");
    if (next === "map") bump("map");
    if (next === "challenges") bump("challenge");
    setScreen(next);
  };

  const value = useMemo<GameContextValue>(
    () => ({
      persist,
      screen,
      setScreen: go,
      tiles,
      selectedId,
      hintIds,
      combo,
      shake,
      wiggleId,
      sparkleIds,
      overlay,
      levelId,
      elapsed,
      pairsLeft: remainingPairs(tiles),
      onboardingStep,
      adKind,
      pendingReward,
      selectTile,
      startLevel,
      startDaily,
      useHint,
      useShuffle,
      useUndo,
      updateSettings,
      claimShop,
      watchAd,
      closeOverlay,
      pauseGame,
      retry,
      nextLevel,
      bump,
      finishOnboarding: () => {
        setOnboardingStep(0);
        setPersist((prev) => ({ ...prev, onboardingDone: true }));
      },
      setOnboardingStep,
    }),
    [
      persist,
      screen,
      tiles,
      selectedId,
      hintIds,
      combo,
      shake,
      wiggleId,
      sparkleIds,
      overlay,
      levelId,
      elapsed,
      onboardingStep,
      adKind,
      pendingReward,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame");
  return ctx;
}

export function useFreeIds(tiles: TileInstance[]) {
  return new Set(freeTiles(tiles).map((tile) => tile.id));
}
