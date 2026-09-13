export type Screen =
  | "home"
  | "levels"
  | "game"
  | "goals"
  | "gallery"
  | "shop"
  | "daily"
  | "map"
  | "challenges";

export type ThemeId =
  | "jade"
  | "sand"
  | "dusk"
  | "ocean"
  | "rose"
  | "ink";

export type AmbientId =
  | "zen"
  | "river"
  | "rain"
  | "fire"
  | "ocean"
  | "forest"
  | "silence";

export type Slot = {
  x: number;
  y: number;
  z: number;
};

export type TileInstance = {
  id: string;
  typeId: string;
  x: number;
  y: number;
  z: number;
  removed: boolean;
};

export type LayoutDef = {
  id: string;
  name: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  tileCount: number;
  slots: Slot[];
};

export type LevelDef = {
  id: number;
  layoutId: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  parSec: number;
};

export type GameSnapshot = {
  tiles: TileInstance[];
};

export type Boosters = {
  hint: number;
  shuffle: number;
  undo: number;
};

export type Settings = {
  theme: ThemeId;
  ambient: AmbientId;
  musicVol: number;
  sfxVol: number;
  musicMute: boolean;
  sfxMute: boolean;
  showTimer: boolean;
  notifications: boolean;
  locale: string;
  adsRemoved: boolean;
  subscribed: boolean;
  tileTheme: string;
};

export type PersistState = {
  stars: Record<string, number>;
  highestUnlocked: number;
  coins: number;
  boosters: Boosters;
  settings: Settings;
  stats: {
    gamesPlayed: number;
    matches: number;
    wins: number;
    bestCombo: number;
    streak: number;
    lastPlayDate: string | null;
    totalStars: number;
    dailyWins: number;
  };
  achievementProgress: Record<string, number>;
  claimedAchievements: string[];
  onboardingDone: boolean;
  firstOpenedAt: number;
  loginDates: string[];
  lastBoosterGrant: string | null;
  dailySeedPlayed: string | null;
  weeklyScore: number;
  ownedThemes: string[];
  ownedBgs: string[];
};
