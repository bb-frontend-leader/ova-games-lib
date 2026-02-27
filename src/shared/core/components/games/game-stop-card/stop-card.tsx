import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { getActiveSceneIdFromInputId } from './lib/get-active-scene-id';
import { disableGroup, enableAndClearGroup, setGroupStateAttr } from './lib/select-group';
import { InitialState, Radio, States } from './types/types';
import { StopGameContextProvider } from './stop-card-context';
import { StopCardInitial } from './stop-card-initial';
import { StopCardRadio } from './stop-card-radio';
import { StopCardScene } from './stop-card-scene';

const INITIAL_GAME: InitialState = {
  validation: false,
  button: true,
  result: false,
  options: [],

  activeSceneId: null,
  lastValidatedSceneId: null,
  validatedTick: 0,

  validatedByScene: {},
  resultByScene: {}
};

interface StopCardProps {
  children: React.ReactNode;
  questionCount: number;
}

type SubComponents = {
  Scene: typeof StopCardScene;
  Init: typeof StopCardInitial;
  Radio: typeof StopCardRadio;
};

const gameReducer = (prev: InitialState, next: Partial<InitialState>): InitialState => ({
  ...prev,
  ...next
});

const StopCard: React.FC<StopCardProps> & SubComponents = ({ children, questionCount }) => {
  const [game, updateGame] = useReducer(gameReducer, INITIAL_GAME);

  // lista de stops SIEMPRE del tamaño questionCount
  const [listStop, setLisStop] = useState<(string | null)[]>(() => Array.from({ length: questionCount }, () => null));

  const elementsId = useRef<string[]>([]); // ids registrados (orden de registro define índice)
  const lastAnsweredRef = useRef<Radio | null>(null);

  /**
   * Ajusta el tamaño de la lista de paradas cuando cambia questionCount.
   */
  useEffect(() => {
    setLisStop((prev) => {
      const next = Array.from({ length: questionCount }, (_, i) => prev[i] ?? null);
      return next;
    });

    elementsId.current = elementsId.current.slice(0, questionCount);
  }, [questionCount]);


  /**
   * Establece el ID de la escena activa.
   * @param {string} id - ID de la escena activa
   * @return {void}
   */
  const setActiveSceneId = useCallback((id: string) => {
    updateGame({ activeSceneId: id });
  }, []);


  /**
   * Agrega un valor de radio seleccionado al estado de la actividad.
   * - Actualiza el ref `lastAnsweredRef` con el valor del radio seleccionado.
   * - Obtiene el id de la escena activa a partir del id del input.
   * - Actualiza el estado de la actividad con el valor del radio.
   * - Deshabilita el botón de reinicio.
   * - Deshabilita el botón de validación.
   * - Actualiza el estado de la actividad.
   * @param {Radio} radio - objeto radio con id, nombre y estado.
   */
  const addRadiosValues = ({ id, name, state }: Radio) => {
    lastAnsweredRef.current = { id, name, state };

    const sceneId = getActiveSceneIdFromInputId(id);

    updateGame({
      options: [...game.options.filter((option) => option.name !== name), { id, name, state }],
      button: false,
      result: false,
      activeSceneId: sceneId
    });
  };


  /**
   * Agrega un ID a la lista de elementos registrados.
   * No hace nada si el ID ya existe en la lista o si la lista ya tiene el tamaño
   * definido por questionCount.
   * @param {string} id - El ID a agregar a la lista.
   */
  const adduuidList = (id: string) => {
    if (elementsId.current.includes(id)) return;
    if (elementsId.current.length >= questionCount) return;

    elementsId.current.push(id);
  };


  /**
   * Actualiza la lista de elementos registrados con el valor del radio seleccionado.
   * - No hace nada si el ID ya existe en la lista o si la lista ya tiene el tamaño
   * definido por questionCount.
   * - Si el ID ya estaba seteado, no re-renderiza innecesariamente.
   * @param {string} value - El valor del radio seleccionado.
   */
  const updateListStop = (value: string) => {
    setLisStop((prev) => {
      const uuidIndex = elementsId.current.findIndex((id) => id === value);
      if (uuidIndex < 0) return prev;
      if (uuidIndex >= questionCount) return prev;

      // si ya estaba seteado, no re-renderices innecesariamente
      if (prev[uuidIndex] === value) return prev;

      const next = [...prev];
      next[uuidIndex] = value;
      return next;
    });
  };


  /**
   * Maneja la validación de la actividad.
   * - Bloquea el grupo y marca visual.
   * - Actualiza la lista de elementos registrados con el valor del radio seleccionado.
   * - Actualiza el estado de la actividad con el resultado.
   * - Revisa si todas las opciones seleccionadas son correctas y actualiza el estado con el resultado.
   */
  const handleValidation = () => {
    const last = lastAnsweredRef.current;
    const sceneId = game.activeSceneId;

    if (!last) return;

    const groupName = last.name;
    const isCorrect = last.state === States.SUCCESS;

    // ✅ Bloquea el grupo y marca visual
    disableGroup(groupName);
    setGroupStateAttr(groupName, isCorrect ? 'correct' : 'incorrect');

    const questionIds = elementsId.current.slice(0, questionCount);

    const selectedByQuestion = new Map<string, Radio>();
    for (const r of game.options) selectedByQuestion.set(r.name, r);

    const nextListStop: (string | null)[] = questionIds.map((qid) => {
      const selected = selectedByQuestion.get(qid);
      const isCorrect = selected?.state === States.SUCCESS;
      return isCorrect ? qid : null;
    });

    setLisStop(nextListStop);

    const allAnswered = questionIds.every((qid) => selectedByQuestion.has(qid));
    const allCorrect = allAnswered && nextListStop.every((x) => x !== null);

    updateGame({
      validation: true,
      result: allCorrect,
      button: true,
      lastValidatedSceneId: sceneId,
      validatedTick: game.validatedTick + 1,
      validatedByScene: { ...game.validatedByScene, [sceneId ?? '']: true },
      resultByScene: { ...game.resultByScene, [sceneId ?? '']: isCorrect }
    });
  };


  /**
   * Reestablece el estado de la actividad.
   * - Habilita el grupo y limpia la marca visual.
   * - Borra la selección de ese grupo.
   * - Actualiza el estado de la actividad con el resultado.
   * - Borrar la ultima respuesta registrada.
   */
  const handleReset = () => {
    const sceneId = game.activeSceneId;
    const last = lastAnsweredRef.current;
    if (!sceneId || !last) return;

    enableAndClearGroup(last.name);

    updateGame({
      button: true,

      // borra la selección de ese grupo
      options: game.options.filter((r) => r.name !== last.name),

      validatedByScene: { ...game.validatedByScene, [sceneId]: false },
      resultByScene: { ...game.resultByScene, [sceneId]: false }
    });

    lastAnsweredRef.current = null;
  };

  return (
    <StopGameContextProvider
      value={{
        updateListStop,
        addRadiosValues,
        adduuidList,
        handleReset,
        handleValidation,
        listStop,
        questionCount,
        setActiveSceneId,
        game: game
      }}>
      {children}
    </StopGameContextProvider>
  );
};

StopCard.Radio = StopCardRadio;
StopCard.Init = StopCardInitial;
StopCard.Scene = StopCardScene;

export { StopCard };
