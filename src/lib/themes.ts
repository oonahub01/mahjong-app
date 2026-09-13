import type { AmbientId, ThemeId } from "./types";

export const THEMES: Record<ThemeId, { label: string; bg: string; hud: string; ink: string }> = {
  jade: { label: "Jade", bg: "#1a4d3e", hud: "#12382d", ink: "#f4efe4" },
  sand: { label: "Sand", bg: "#c4a574", hud: "#9b7d4e", ink: "#2b2114" },
  dusk: { label: "Dusk", bg: "#4a3f6b", hud: "#352c4d", ink: "#f6f0ff" },
  ocean: { label: "Ocean", bg: "#1e5f6e", hud: "#154651", ink: "#eef8fa" },
  rose: { label: "Rose", bg: "#8b4d5a", hud: "#6a3843", ink: "#fff4f6" },
  ink: { label: "Ink", bg: "#1c2333", hud: "#121722", ink: "#f3efe6" },
};

export const AMBIENTS: { id: AmbientId; label: string; icon: string }[] = [
  { id: "zen", label: "Zen", icon: "♪" },
  { id: "river", label: "River", icon: "≈" },
  { id: "rain", label: "Rain", icon: "☔" },
  { id: "fire", label: "Fire", icon: "✦" },
  { id: "ocean", label: "Ocean", icon: "○" },
  { id: "forest", label: "Forest", icon: "♣" },
  { id: "silence", label: "Silence", icon: "—" },
];

export const TILE_THEMES = [
  { id: "classic", label: "Classic Ivory", premium: false },
  { id: "jade", label: "Jade Inlay", premium: true, price: 400 },
  { id: "night", label: "Night Gold", premium: true, price: 600 },
];

export const IAP_PACKS = [
  { id: "coins-99", label: "Pouch", coins: 200, price: "$0.99" },
  { id: "coins-299", label: "Bundle", coins: 700, price: "$2.99" },
  { id: "coins-999", label: "Chest", coins: 2600, price: "$9.99" },
  { id: "coins-1999", label: "Vault", coins: 6000, price: "$19.99" },
];
