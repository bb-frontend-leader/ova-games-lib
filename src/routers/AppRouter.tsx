import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/components';

import Home from '../pages/home';
import NotFound from '../pages/not-found';

// Rutas anteriores de la galería, que algún OVA pudo haber enlazado. La lista completa ahora es la portada y
// «Conexiones lógicas» pasó a ser actividad.
const LEGACY_ROUTES: Record<string, string> = {
  '/allGames': '/',
  '/gamePairLogicItems': '/actividades/conexiones-logicas',
  '/gameBalloons': '/juegos/globos',
  '/gameBasketball': '/juegos/baloncesto',
  '/gameBotles': '/juegos/rescate-submarino',
  '/gameMoney': '/juegos/elige-y-gana',
  '/gameQuestion': '/juegos/desafio-de-conocimiento',
  '/gameRaceCard': '/juegos/carrera',
  '/gameSpace': '/juegos/mision-espacial',
  '/gameThisOrThat': '/juegos/cual-prefieres',
  '/gameCasino': '/juegos/apuesta-inteligente',
  '/gameFish': '/juegos/pesca',
  '/gameMemoryCard': '/juegos/memoria',
  '/gameStopCard': '/juegos/paradas-del-saber',
  '/activityRadio': '/actividades/seleccion-unica',
  '/activityCheckbox': '/actividades/seleccion-multiple',
  '/activityTrueFalse': '/actividades/verdadero-o-falso',
  '/activityTableTrueFalse': '/actividades/verdadero-o-falso-con-retroalimentacion',
  '/activitySelect': '/actividades/listas-desplegables',
  '/activityInput': '/actividades/completar-con-texto',
  '/activityCrossword': '/actividades/crucigrama',
  '/activityDnd': '/actividades/arrastrar-y-soltar',
  '/activityRelationConcept': '/actividades/vincular-conceptos',
  '/activitySelectGroup': '/actividades/parejas-con-listas',
  '/activityPairLogic': '/actividades/conexiones-logicas'
};

// Cada juego y cada actividad se descarga solo cuando el docente la abre.
const GameBalloonsPage = lazy(() => import('../pages/gameBalloons'));
const GameBasketballPage = lazy(() => import('../pages/gameBasketball'));
const GameBotles = lazy(() => import('../pages/gameBotles'));
const GameCasinoPage = lazy(() => import('../pages/gameCasino'));
const GameFishPage = lazy(() => import('../pages/gameFish'));
const GameMemoryCardPage = lazy(() => import('../pages/gameMemoryCard'));
const GameMoneyPage = lazy(() => import('../pages/gameMoney'));
const GameQuestionPage = lazy(() => import('../pages/gameQuestion'));
const GameRaceCardPage = lazy(() => import('../pages/gameRaceCard'));
const GameSpacePage = lazy(() => import('../pages/gameSpace'));
const GameStopCardPage = lazy(() => import('../pages/gameStopCard'));
const GameThisOrThatPage = lazy(() => import('../pages/gameThisOrThat'));
const GameRoulettePage = lazy(() => import('../pages/gameRoulette'));
const GameJeopardyPage = lazy(() => import('../pages/gameJeopardy'));
const GamePlinkoPage = lazy(() => import('../pages/gamePlinko'));
const GameCastlePage = lazy(() => import('../pages/gameCastle'));
const GameLegoPage = lazy(() => import('../pages/gameLego'));
const GameMillionsPage = lazy(() => import('../pages/gameMillions'));
const GameCatapultPage = lazy(() => import('../pages/gameCatapult'));
const GameCometaPage = lazy(() => import('../pages/gameCometa'));
const GameLaneRacePage = lazy(() => import('../pages/gameLaneRace'));
const GameLoteriaPage = lazy(() => import('../pages/gameLoteria'));
const GameMountainClimbPage = lazy(() => import('../pages/gameMountainClimb'));
const GameParquesPage = lazy(() => import('../pages/gameParques'));
const GameRanaPage = lazy(() => import('../pages/gameRana'));
const GameSnakesLaddersPage = lazy(() => import('../pages/gameSnakesLadders'));
const GameTejoPage = lazy(() => import('../pages/gameTejo'));
const GameTreasureMapPage = lazy(() => import('../pages/gameTreasureMap'));
const GameSlotsPage = lazy(() => import('../pages/gameSlots'));
const GameMinesweeperPage = lazy(() => import('../pages/gameMinesweeper'));
const GameNavalBattlePage = lazy(() => import('../pages/gameNavalBattle'));
const GameTowerBlocksPage = lazy(() => import('../pages/gameTowerBlocks'));
const GameEscapeRoomPage = lazy(() => import('../pages/gameEscapeRoom'));

const ActivityCheckboxPage = lazy(() => import('../pages/activityCheckbox'));
const ActivityCrosswordPage = lazy(() => import('../pages/activityCrossword'));
const ActivityDndPage = lazy(() => import('../pages/activityDnd'));
const ActivityInputPage = lazy(() => import('../pages/activityInput'));
const ActivityPairLogicPage = lazy(() => import('../pages/activityPairLogic'));
const ActivityRadioPage = lazy(() => import('../pages/activityRadio'));
const ActivityRelationConceptPage = lazy(() => import('../pages/activityRelationConcept'));
const ActivitySelectPage = lazy(() => import('../pages/activitySelect'));
const ActivitySelectGroupPage = lazy(() => import('../pages/activitySelectGroup'));
const ActivityTableTrueFalsePage = lazy(() => import('../pages/activityTableTrueFalse'));
const ActivityTrueFalsePage = lazy(() => import('../pages/activityTrueFalse'));

export default function AppRouter() {
  return (
    <Suspense
      fallback={
        <p role="status" style={{ padding: '2rem', textAlign: 'center' }}>
          Cargando…
        </p>
      }
    >
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/juegos/globos" element={<GameBalloonsPage />} />
          <Route path="/juegos/baloncesto" element={<GameBasketballPage />} />
          <Route path="/juegos/rescate-submarino" element={<GameBotles />} />
          <Route path="/juegos/apuesta-inteligente" element={<GameCasinoPage />} />
          <Route path="/juegos/pesca" element={<GameFishPage />} />
          <Route path="/juegos/memoria" element={<GameMemoryCardPage />} />
          <Route path="/juegos/elige-y-gana" element={<GameMoneyPage />} />
          <Route path="/juegos/desafio-de-conocimiento" element={<GameQuestionPage />} />
          <Route path="/juegos/carrera" element={<GameRaceCardPage />} />
          <Route path="/juegos/mision-espacial" element={<GameSpacePage />} />
          <Route path="/juegos/paradas-del-saber" element={<GameStopCardPage />} />
          <Route path="/juegos/cual-prefieres" element={<GameThisOrThatPage />} />
          <Route path="/juegos/ruleta" element={<GameRoulettePage />} />
          <Route path="/juegos/tablero-de-preguntas" element={<GameJeopardyPage />} />
          <Route path="/juegos/plinko" element={<GamePlinkoPage />} />
          <Route path="/juegos/castillo" element={<GameCastlePage />} />
          <Route path="/juegos/construye-la-respuesta" element={<GameLegoPage />} />
          <Route path="/juegos/quien-quiere-ser-millonario" element={<GameMillionsPage />} />
          <Route path="/juegos/catapulta" element={<GameCatapultPage />} />
          <Route path="/juegos/cometas" element={<GameCometaPage />} />
          <Route path="/juegos/carrera-de-carriles" element={<GameLaneRacePage />} />
          <Route path="/juegos/loteria" element={<GameLoteriaPage />} />
          <Route path="/juegos/escalada" element={<GameMountainClimbPage />} />
          <Route path="/juegos/parques" element={<GameParquesPage />} />
          <Route path="/juegos/rana" element={<GameRanaPage />} />
          <Route path="/juegos/serpientes-y-escaleras" element={<GameSnakesLaddersPage />} />
          <Route path="/juegos/tejo" element={<GameTejoPage />} />
          <Route path="/juegos/mapa-del-tesoro" element={<GameTreasureMapPage />} />
          <Route path="/juegos/tragamonedas" element={<GameSlotsPage />} />
          <Route path="/juegos/buscaminas" element={<GameMinesweeperPage />} />
          <Route path="/juegos/batalla-naval" element={<GameNavalBattlePage />} />
          <Route path="/juegos/torre-de-bloques" element={<GameTowerBlocksPage />} />
          <Route path="/juegos/escape-room" element={<GameEscapeRoomPage />} />

          <Route path="/actividades/seleccion-multiple" element={<ActivityCheckboxPage />} />
          <Route path="/actividades/crucigrama" element={<ActivityCrosswordPage />} />
          <Route path="/actividades/arrastrar-y-soltar" element={<ActivityDndPage />} />
          <Route path="/actividades/completar-con-texto" element={<ActivityInputPage />} />
          <Route path="/actividades/conexiones-logicas" element={<ActivityPairLogicPage />} />
          <Route path="/actividades/seleccion-unica" element={<ActivityRadioPage />} />
          <Route path="/actividades/vincular-conceptos" element={<ActivityRelationConceptPage />} />
          <Route path="/actividades/listas-desplegables" element={<ActivitySelectPage />} />
          <Route path="/actividades/parejas-con-listas" element={<ActivitySelectGroupPage />} />
          <Route path="/actividades/verdadero-o-falso-con-retroalimentacion" element={<ActivityTableTrueFalsePage />} />
          <Route path="/actividades/verdadero-o-falso" element={<ActivityTrueFalsePage />} />
          {/* Rutas anteriores (camelCase): redirigen a la ruta nueva. */}
          {Object.entries(LEGACY_ROUTES).map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
