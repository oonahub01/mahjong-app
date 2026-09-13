import { todayKey, yesterdayKey } from "./rng";
import type { PersistState, Settings } from "./types";

export const STORAGE_KEY = "jade-solitaire-v1";

export const DEFAULT_SETTINGS: Settings = {
  theme: "jade",
  ambient: "zen",
  musicVol: 0.55,
  sfxVol: 0.75,
  musicMute: false,
  sfxMute: false,
  showTimer: true,
  notifications: false,
  locale: "en",
  adsRemoved: false,
  subscribed: false,
  tileTheme: "classic",
};

export const DEFAULT_PERSIST: PersistState = {
  stars: {},
  highestUnlocked: 1,
  coins: 120,
  boosters: { hint: 3, shuffle: 2, undo: 5 },
  settings: DEFAULT_SETTINGS,
  stats: {
    gamesPlayed: 0,
    matches: 0,
    wins: 0,
    bestCombo: 0,
    streak: 0,
    lastPlayDate: null,
    totalStars: 0,
    dailyWins: 0,
  },
  achievementProgress: {},
  claimedAchievements: [],
  onboardingDone: false,
  firstOpenedAt: 0,
  loginDates: [],
  lastBoosterGrant: null,
  dailySeedPlayed: null,
  weeklyScore: 0,
  ownedThemes: ["classic"],
  ownedBgs: ["jade"],
};

export function loadPersist(): PersistState {
  if (typeof window === "undefined") return structuredClone(DEFAULT_PERSIST);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_PERSIST);
    return {
      ...structuredClone(DEFAULT_PERSIST),
      ...JSON.parse(raw),
      settings: {
        ...DEFAULT_SETTINGS,
        ...(JSON.parse(raw).settings ?? {}),
      },
    };
  } catch {
    return structuredClone(DEFAULT_PERSIST);
  }
}

export function savePersist(state: PersistState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function applyDailyLogin(state: PersistState): PersistState {
  const today = todayKey();
  const next = structuredClone(state);
  if (!next.firstOpenedAt) next.firstOpenedAt = Date.now();
  if (!next.loginDates.includes(today)) {
    next.loginDates.push(today);
    const yesterday = yesterdayKey();
    if (next.stats.lastPlayDate === yesterday || next.stats.lastPlayDate === today) {
      next.stats.streak += next.stats.lastPlayDate === yesterday ? 1 : 0;
    } else if (next.stats.lastPlayDate === yesterdayKey(new Date(Date.now() - 86400000))) {
      next.stats.streak = Math.max(1, next.stats.streak);
    } else if (next.stats.lastPlayDate && next.stats.lastPlayDate !== yesterday) {
      next.stats.streak = 1;
    } else {
      next.stats.streak = Math.max(1, next.stats.streak || 1);
    }
    if (!next.stats.lastPlayDate) next.stats.streak = 1;
    next.stats.lastPlayDate = today;
    const reward = Math.min(80, 15 + next.loginDates.length * 3);
    next.coins += reward;
  }
  if (next.lastBoosterGrant !== today) {
    next.boosters.hint += 1;
    next.boosters.shuffle += 1;
    next.boosters.undo += 1;
    next.lastBoosterGrant = today;
  }
  return next;
}

export function isFirstSession(state: PersistState) {
  return Date.now() - state.firstOpenedAt < 1000 * 60 * 40;
}
