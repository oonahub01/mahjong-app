export type Achievement = {
  id: string;
  category: "play" | "skill" | "collection" | "daily" | "mastery";
  title: string;
  detail: string;
  target: number;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-match", category: "play", title: "First Pair", detail: "Match your first pair", target: 1 },
  { id: "matches-50", category: "play", title: "Getting Warm", detail: "Match 50 pairs", target: 50 },
  { id: "matches-200", category: "play", title: "Tile Whisperer", detail: "Match 200 pairs", target: 200 },
  { id: "games-5", category: "play", title: "Settling In", detail: "Finish 5 games", target: 5 },
  { id: "games-25", category: "play", title: "Regular", detail: "Finish 25 games", target: 25 },
  { id: "win-1", category: "play", title: "Clear Mind", detail: "Win a level", target: 1 },
  { id: "win-10", category: "play", title: "Steady Hands", detail: "Win 10 levels", target: 10 },
  { id: "stars-15", category: "play", title: "Constellation", detail: "Earn 15 stars", target: 15 },
  { id: "no-hint", category: "skill", title: "Self Reliant", detail: "Win without a hint", target: 1 },
  { id: "fast-win", category: "skill", title: "Quick Eye", detail: "Beat a par time", target: 1 },
  { id: "three-star", category: "skill", title: "Perfect Table", detail: "Earn 3 stars", target: 1 },
  { id: "combo-3", category: "skill", title: "In Flow", detail: "Reach a 3 combo", target: 3 },
  { id: "combo-6", category: "skill", title: "Deep Flow", detail: "Reach a 6 combo", target: 6 },
  { id: "undo-less", category: "skill", title: "Sure Touch", detail: "Win with unused undos", target: 1 },
  { id: "hard-win", category: "skill", title: "Fortress Key", detail: "Clear a difficulty 4 board", target: 1 },
  { id: "expert-win", category: "skill", title: "Turtle Rider", detail: "Clear a difficulty 5 board", target: 1 },
  { id: "own-theme", category: "collection", title: "Dressed Table", detail: "Unlock a tile theme", target: 1 },
  { id: "coins-500", category: "collection", title: "Silk Purse", detail: "Hold 500 coins", target: 500 },
  { id: "layouts-5", category: "collection", title: "Gallery Walk", detail: "Play 5 layouts", target: 5 },
  { id: "all-layouts", category: "collection", title: "Board Scholar", detail: "Play every layout", target: 10 },
  { id: "shop-look", category: "collection", title: "Window Shopper", detail: "Open the shop", target: 1 },
  { id: "daily-1", category: "daily", title: "Morning Tile", detail: "Clear a daily puzzle", target: 1 },
  { id: "daily-5", category: "daily", title: "Week of Calm", detail: "Clear 5 dailies", target: 5 },
  { id: "streak-3", category: "daily", title: "Three Mornings", detail: "Keep a 3-day streak", target: 3 },
  { id: "streak-7", category: "daily", title: "Full Week", detail: "Keep a 7-day streak", target: 7 },
  { id: "login-5", category: "daily", title: "Welcome Back", detail: "Log in 5 days", target: 5 },
  { id: "challenge", category: "daily", title: "Weekly Guest", detail: "Join a weekly challenge", target: 1 },
  { id: "levels-20", category: "mastery", title: "Path Walker", detail: "Unlock level 20", target: 20 },
  { id: "levels-50", category: "mastery", title: "Fifty Tables", detail: "Unlock the last rotation", target: 50 },
  { id: "stars-80", category: "mastery", title: "Sky Full", detail: "Earn 80 stars", target: 80 },
  { id: "wins-36", category: "mastery", title: "Crash-Free Club", detail: "Win 36 levels", target: 36 },
  { id: "map", category: "mastery", title: "World Traveler", detail: "Open the world map", target: 1 },
];

export const CATEGORIES = [
  { id: "play", title: "Play" },
  { id: "skill", title: "Skill" },
  { id: "collection", title: "Collection" },
  { id: "daily", title: "Daily" },
  { id: "mastery", title: "Mastery" },
] as const;
