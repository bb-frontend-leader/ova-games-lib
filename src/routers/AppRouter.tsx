import {  Route,Routes } from "react-router-dom";

import { OvaProvider } from "../context/ova-context";
import AllGames from "../pages/allGames";
import GameBalloonsPage from "../pages/gameBalloons";
import GameBasketballPage from "../pages/gameBasketball";
import GameBotles from "../pages/gameBotles";
import GameCasinoPage from "../pages/gameCasino";
import GameFishPage from "../pages/gameFish";
import GameMemoryCardPage from "../pages/gameMemoryCard";
import GameMoneyPage from "../pages/gameMoney";
import GamePairLogicItemsPage from "../pages/gamePairLogicItems";
import GameQuestionPage from "../pages/gameQuestion";
import GameRaceCardPage from "../pages/gameRaceCard";
import GameSpacePage from "../pages/gameSpace";
import GameStopCardPage from "../pages/gameStopCard";
import GameThisOrThatPage from "../pages/gameThisOrThat";
import Home from "../pages/Home";

import type { Language } from "../types/types";
export default function AppRouter() {
  function getPageLanguage() {
    const lang = document.documentElement?.lang;
    return lang as Language;
  }
  const language = getPageLanguage();
  return (
      <OvaProvider value={{ lang: language }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gameBalloons" element={<GameBalloonsPage />} />
          <Route path="/gameBasketball" element={<GameBasketballPage />} />
          <Route path="/gameBotles" element={<GameBotles />} />
          <Route path="/gameMoney" element={<GameMoneyPage />} />
          <Route
            path="/gamePairLogicItems"
            element={<GamePairLogicItemsPage />}
          />
          <Route path="/gameQuestion" element={<GameQuestionPage />} />
          <Route path="/gameRaceCard" element={<GameRaceCardPage />} />
          <Route path="/gameSpace" element={<GameSpacePage />} />
          <Route path="/gameThisOrThat" element={<GameThisOrThatPage />} />
          <Route path="/gameFish" element={<GameFishPage />} />
          <Route path="/gameCasino" element={<GameCasinoPage />} />
          <Route path="/gameMemoryCard" element={<GameMemoryCardPage />} />
          <Route path="/gameStopCard" element={<GameStopCardPage />} />
          <Route path="/allGames" element={<AllGames />} />
        </Routes>
      </OvaProvider>
  );
}
