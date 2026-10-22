import React, { useCallback, useReducer, useRef } from 'react';

import { DEFAULT_CAR } from './lib/cars';
import { getActiveSceneIdFromInputId } from './lib/get-active-scene-id';
import { disableGroup, enableAndClearGroup, setGroupStateAttr } from './lib/select-group';
import type { TimeOfDaySetting } from './lib/time-of-day';
import { useTimeOfDay } from './lib/time-of-day';
import { ContextGame } from './race-card-context';
import { RaceCardInitial } from './race-card-initial';
import { RaceCardInput } from './race-card-input';
import { RaceCardRender } from './race-card-render';

import type { RaceCardStateType, Radio, RadioStates } from './types/types';

const POINTS_FOR_CORRECT_ANSWER = 100;
const MOVE_DISTANCE = Math.floor(Math.random() * (70 - 40 + 1)) + 40;
const PASSING_PERCENTAGE = 0.6;

const INITIAL_GAME: RaceCardStateType = {
  pointplayer1: 0,
  pointplayer2: 0,
  move1: 0,
  move2: 0,
  answeredCount: 0,
  rightAnswers: 0,

  validation: false,
  button: true,
  result: false,
  radios: [],

  activeSceneId: null,
  lastValidatedSceneId: null,

  playerName: '',
  carId: DEFAULT_CAR,
  resultsOpen: false
};

interface RaceCardProviderProps {
  children: React.ReactNode;
  questionCount: number;
  correctAnswerPoints?: number;
  /** Fondo de la carrera: `auto` sigue la hora local; también se puede fijar `dawn`, `day`, `sunset` o `night`. */
  timeOfDay?: TimeOfDaySetting;
}

type SubComponents = {
  Scene: typeof RaceCardRender;
  Init: typeof RaceCardInitial;
  Radio: typeof RaceCardInput;
};

const gameReducer = (prev: RaceCardStateType, next: Partial<RaceCardStateType>): RaceCardStateType => ({
  ...prev,
  ...next
});

const RaceCard: React.FC<RaceCardProviderProps> & SubComponents = ({
  children,
  questionCount,
  correctAnswerPoints = POINTS_FOR_CORRECT_ANSWER,
  timeOfDay: timeOfDaySetting = 'auto'
}) => {
  const [game, updateGame] = useReducer(gameReducer, INITIAL_GAME);
  const timeOfDay = useTimeOfDay(timeOfDaySetting);

  const finished = !!questionCount && game.answeredCount === questionCount && game.validation;
  const isWinner = !!questionCount && game.rightAnswers / questionCount >= PASSING_PERCENTAGE;

  const elementsId = useRef<string[]>([]); // useRef para almacenar los IDs de los elementos
  const lastAnsweredRef = useRef<Radio | null>(null);

  /**
   * Agrega un valor de radio seleccionado al estado de la actividad.
   * - Actualiza el ref `lastAnsweredRef` con el valor del radio seleccionado.
   * - Obtiene el id de la escena activa a partir del id del input.
   * - Actualiza el estado de la actividad con el valor del radio.
   * - Habilita el botón de reinicio.
   * - Habilita el botón de validación.
   * - Actualiza el estado de la actividad.
   * @param {Radio} radio - objeto radio con id, nombre y estado.
   */
  const addRadiosValues = ({ id, name, state }: Radio) => {
    lastAnsweredRef.current = { id, name, state };

    const sceneId = getActiveSceneIdFromInputId(id);

    updateGame({
      radios: [...game.radios.filter((option) => option.name !== name), { id, name, state }],
      button: false,
      result: false,
      activeSceneId: sceneId
    });
  };

  /**
   * Agrega un ID al array de elementos.
   * @param {string} id - ID del elemento a agregar.
   * @returns {void}
   */
  const addElementId = useCallback((id: string) => {
    if (!elementsId.current.includes(id)) {
      elementsId.current = [...elementsId.current, id];
    }
  }, []);

  /**
   * Valida la actividad.
   * - Bloquea y marca visual las opciones seleccionadas.
   * - Actualiza el estado de la actividad.
   * - Habilita el botón de reinicio.
   * - Habilita el botón de validación.
   * - Actualiza el estado de la actividad.
   *
   * @returns {void}
   */
  const handleValidation = useCallback(() => {
    const last = lastAnsweredRef.current;
    const sceneId = game.activeSceneId;

    if (!last) return;

    const selected: RadioStates = last.state; // 'success' | 'wrong'
    const groupName = last.name;

    // Bloquea y marca visual
    disableGroup(groupName);
    setGroupStateAttr(groupName, selected === 'success' ? 'correct' : 'incorrect');

    if (selected === 'success') {
      updateGame({
        pointplayer1: game.pointplayer1 + correctAnswerPoints,
        move1: game.move1 + MOVE_DISTANCE,
        answeredCount: game.answeredCount + 1,
        rightAnswers: game.rightAnswers + 1,

        validation: true, // inputs disabled
        button: true, // validar disabled
        result: true, // correcta => reset disabled (por tu ternario)

        lastValidatedSceneId: sceneId
      });
    } else {
      updateGame({
        pointplayer2: game.pointplayer2 + correctAnswerPoints,
        move2: game.move2 + MOVE_DISTANCE,
        answeredCount: game.answeredCount + 1,

        validation: true, // inputs disabled
        button: true, // validar disabled
        result: false, // incorrecta => reset enabled (por tu ternario)

        lastValidatedSceneId: sceneId
      });
    }
  }, [game, correctAnswerPoints]);

  /**
   * Resetea la actividad al estado inicial.
   * - Desmarca visual las opciones seleccionadas.
   * - Habilita el botón de validación.
   * - Actualiza el estado de la actividad.
   *
   * @returns {void}
   */
  const handleReset = useCallback(() => {
    const last = lastAnsweredRef.current;
    if (!last) return;

    const selected: RadioStates = last.state;
    const groupName = last.name;

    enableAndClearGroup(groupName);

    if (selected === 'success') {
      updateGame({
        pointplayer1: Math.max(0, game.pointplayer1 - correctAnswerPoints),
        move1: Math.max(0, game.move1 - MOVE_DISTANCE),
        answeredCount: Math.max(0, game.answeredCount - 1),
        rightAnswers: Math.max(0, game.rightAnswers - 1),

        validation: false, // inputs habilitados
        button: true, // validar deshabilitado hasta nueva selección
        result: false,
        resultsOpen: false,
        radios: game.radios.filter((r) => r.name !== groupName)
      });
    } else {
      updateGame({
        pointplayer2: Math.max(0, game.pointplayer2 - correctAnswerPoints),
        move2: Math.max(0, game.move2 - MOVE_DISTANCE),
        answeredCount: Math.max(0, game.answeredCount - 1),

        validation: false,
        button: true,
        result: false,
        resultsOpen: false,
        radios: game.radios.filter((r) => r.name !== groupName)
      });
    }

    lastAnsweredRef.current = null;
  }, [game, correctAnswerPoints]);

  /**
   * Abre el podio. Solo tiene sentido cuando ya se respondieron todas las preguntas.
   */
  const openResults = useCallback(() => {
    if (finished) updateGame({ resultsOpen: true });
  }, [finished]);

  return (
    <ContextGame
      value={{
        game,
        updateGame,
        questionCount,
        addRadiosValues,
        addElementId,
        handleValidation,
        handleReset,
        openResults,
        validation: game.validation,
        button: game.button,
        result: game.result,
        radios: game.radios,
        finished,
        isWinner,
        timeOfDay
      }}
    >
      {children}
    </ContextGame>
  );
};

RaceCard.Scene = RaceCardRender;
RaceCard.Radio = RaceCardInput;
RaceCard.Init = RaceCardInitial;

export { RaceCard };
