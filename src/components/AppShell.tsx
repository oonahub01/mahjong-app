"use client";

import { THEMES } from "@/lib/themes";
import { useGame } from "@/store/GameProvider";
import { GameScreen } from "./GameScreen";
import {
  ChallengeScreen,
  DailyScreen,
  GalleryScreen,
  GoalsScreen,
  HomeScreen,
  LevelSelect,
  MapScreen,
  ShopScreen,
} from "./screens";

export function AppShell() {
  const { screen, persist } = useGame();
  const theme = THEMES[persist.settings.theme];

  return (
    <main className="app-shell" style={{ background: theme.bg, color: theme.ink }}>
      {screen === "home" ? <HomeScreen /> : null}
      {screen === "levels" ? <LevelSelect /> : null}
      {screen === "game" ? <GameScreen /> : null}
      {screen === "goals" ? <GoalsScreen /> : null}
      {screen === "gallery" ? <GalleryScreen /> : null}
      {screen === "shop" ? <ShopScreen /> : null}
      {screen === "daily" ? <DailyScreen /> : null}
      {screen === "map" ? <MapScreen /> : null}
      {screen === "challenges" ? <ChallengeScreen /> : null}
    </main>
  );
}
