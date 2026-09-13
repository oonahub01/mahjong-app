export const LOCALES = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "fr", label: "Français" },
  { id: "de", label: "Deutsch" },
  { id: "it", label: "Italiano" },
  { id: "pt", label: "Português" },
  { id: "ja", label: "日本語" },
  { id: "zh", label: "中文" },
] as const;

const EN = {
  play: "Play",
  levels: "Levels",
  settings: "Settings",
  goals: "Goals",
  gallery: "Boards",
  shop: "Shop",
  daily: "Daily",
  map: "Worlds",
  challenges: "Weekly",
  pairs: "Pairs",
  hint: "Hint",
  shuffle: "Shuffle",
  undo: "Undo",
  pause: "Pause",
  resume: "Resume",
  retry: "Try again",
  next: "Next level",
  home: "Home",
  win: "Table cleared",
  lose: "No more moves",
  stars: "Stars",
  coins: "Coins",
  theme: "Background",
  ambient: "Ambience",
  music: "Music",
  sfx: "Sound",
  timer: "Show timer",
  notify: "Notifications",
  privacy: "Privacy policy",
  watchAd: "Watch Ad",
  removeAds: "Remove ads · $7.99",
  subscribe: "Calm Club · extras",
  tutorial1: "Tap a free tile. Free tiles have an open left or right side and nothing stacked on top.",
  tutorial2: "Match two identical free tiles. Blocked tiles stay dimmed so the table stays readable.",
  tutorial3: "Hints, shuffles, and undo are helpers — every board can be cleared without spending.",
  continue: "Continue",
  firstSession: "First session is ad-free",
};

export type CopyKey = keyof typeof EN;

const PACKS: Record<string, Partial<typeof EN>> = {
  es: { play: "Jugar", levels: "Niveles", settings: "Ajustes", goals: "Metas", shop: "Tienda", daily: "Diario", win: "Mesa limpia" },
  fr: { play: "Jouer", levels: "Niveaux", settings: "Réglages", goals: "Objectifs", shop: "Boutique", daily: "Quotidien" },
  de: { play: "Spielen", levels: "Level", settings: "Einstellungen", goals: "Ziele", shop: "Shop", daily: "Täglich" },
  it: { play: "Gioca", levels: "Livelli", settings: "Impostazioni", goals: "Obiettivi", shop: "Negozio" },
  pt: { play: "Jogar", levels: "Níveis", settings: "Ajustes", goals: "Metas", shop: "Loja" },
  ja: { play: "プレイ", levels: "レベル", settings: "設定", goals: "目標", shop: "ショップ", daily: "デイリー" },
  zh: { play: "开始", levels: "关卡", settings: "设置", goals: "成就", shop: "商店", daily: "每日" },
};

export function t(locale: string, key: CopyKey) {
  return PACKS[locale]?.[key] ?? EN[key];
}
