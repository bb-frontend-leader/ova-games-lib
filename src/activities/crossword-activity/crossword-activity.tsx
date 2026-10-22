import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

import { CrosswordActivityProvider } from './crossword-activity-context';
import { CrosswordBoard } from './crossword-board';
import { CrosswordButton } from './crossword-button';
import { CrosswordClues } from './crossword-clues';
import { CrosswordFeedback } from './crossword-feedback';
import { buildLayout, normalizeLetter, otherDirection } from './lib/layout';

import type {
  Cell,
  CellState,
  CrosswordAction,
  CrosswordState,
  CrosswordWord,
  Direction,
  PlacedWord,
  WordResult
} from './types/types';

const INITIAL_STATE: CrosswordState = Object.freeze({
  letters: {},
  activeKey: null,
  direction: 'across',
  validation: false
});

const reducer = (state: CrosswordState, action: CrosswordAction): CrosswordState => {
  switch (action.type) {
    case 'select':
      return { ...state, activeKey: action.key, direction: action.direction };
    case 'letter': {
      const letters = { ...state.letters };
      if (action.value) letters[action.key] = action.value;
      else delete letters[action.key];
      return { ...state, letters };
    }
    case 'validate':
      return { ...state, validation: true };
    case 'reset':
      return { ...state, letters: {}, validation: false };
    default:
      return state;
  }
};

interface Props {
  children: React.ReactNode;
  /** Palabras del crucigrama. La numeración, los cruces y la cuadrícula se calculan solos. */
  words: CrosswordWord[];
  onResult?: ({ result, words }: { result: boolean; words: WordResult[] }) => void;
}

type SubComponents = {
  Board: typeof CrosswordBoard;
  Clues: typeof CrosswordClues;
  Button: typeof CrosswordButton;
  Feedback: typeof CrosswordFeedback;
};

const Crossword: React.FC<Props> & SubComponents = ({ children, words, onResult }) => {
  const layout = useMemo(() => buildLayout(words), [words]);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const inputs = useRef(new Map<string, HTMLInputElement>());

  useEffect(() => {
    if (import.meta.env.DEV && layout.conflicts.length) {
      console.error(`[Crossword] Hay problemas con las palabras:\n- ${layout.conflicts.join('\n- ')}`);
    }
  }, [layout]);

  const firstKey = layout.words[0]?.cells[0] ?? '';
  const tabStopKey = state.activeKey ?? firstKey;

  const registerInput = useCallback((key: string, element: HTMLInputElement | null) => {
    if (element) inputs.current.set(key, element);
    else inputs.current.delete(key);
  }, []);

  const focusCell = (key: string) => inputs.current.get(key)?.focus();

  /** Dirección con la que se trabaja en una casilla: la actual si pasa una palabra por ella, si no la otra. */
  const resolveDirection = (cell: Cell, preferred: Direction): Direction =>
    cell.words[preferred] ? preferred : otherDirection(preferred);

  const wordAt = (key: string, direction: Direction): PlacedWord | undefined => {
    const cell = layout.cells.get(key);
    if (!cell) return undefined;
    const id = cell.words[resolveDirection(cell, direction)];
    return id ? layout.wordsById.get(id) : undefined;
  };

  const activeCell = state.activeKey ? layout.cells.get(state.activeKey) : undefined;
  const direction = activeCell ? resolveDirection(activeCell, state.direction) : state.direction;
  const activeWord = state.activeKey ? (wordAt(state.activeKey, direction) ?? null) : null;

  const selectCell = (key: string) => {
    const cell = layout.cells.get(key);
    if (!cell) return;
    dispatch({ type: 'select', key, direction: resolveDirection(cell, state.direction) });
  };

  /** En un cruce, alterna entre horizontal y vertical. */
  const toggleDirection = (key: string) => {
    const cell = layout.cells.get(key);
    if (!cell) return;
    const next = cell.words[otherDirection(direction)] ? otherDirection(direction) : direction;
    dispatch({ type: 'select', key, direction: next });
  };

  /** Va a la primera casilla vacía de la palabra (o a la primera si ya está completa). */
  const selectWord = (id: string) => {
    const word = layout.wordsById.get(id);
    if (!word) return;
    const target = word.cells.find((key) => !state.letters[key]) ?? word.cells[0];
    dispatch({ type: 'select', key: target, direction: word.direction });
    focusCell(target);
  };

  const typeLetter = (key: string, value: string) => {
    if (state.validation) return;
    dispatch({ type: 'letter', key, value });

    const word = wordAt(key, direction);
    const next = word?.cells[word.cells.indexOf(key) + 1];
    if (next) focusCell(next);
  };

  const clearLetter = (key: string, { back = false }: { back?: boolean } = {}) => {
    if (state.validation) return;

    if (state.letters[key] || !back) {
      dispatch({ type: 'letter', key, value: '' });
      return;
    }

    // Casilla vacía + retroceso: borra y vuelve a la anterior de la palabra.
    const word = wordAt(key, direction);
    const previous = word?.cells[word.cells.indexOf(key) - 1];
    if (previous) {
      dispatch({ type: 'letter', key: previous, value: '' });
      focusCell(previous);
    }
  };

  /** Mueve el foco a la siguiente casilla existente en esa dirección, saltando los huecos. */
  const move = (key: string, deltaRow: number, deltaCol: number) => {
    const cell = layout.cells.get(key);
    if (!cell) return;

    let row = cell.row + deltaRow;
    let col = cell.col + deltaCol;
    while (row >= 0 && col >= 0 && row < layout.rows && col < layout.cols) {
      const candidate = `${row},${col}`;
      if (layout.cells.has(candidate)) {
        focusCell(candidate);
        return;
      }
      row += deltaRow;
      col += deltaCol;
    }
  };

  const all = [...layout.cells.values()];
  const allFilled = all.length > 0 && all.every((cell) => state.letters[cell.key]);

  const states = useMemo(() => {
    const result: Record<string, CellState> = {};
    if (!state.validation) return result;
    for (const cell of layout.cells.values()) {
      result[cell.key] = normalizeLetter(state.letters[cell.key] ?? '') === cell.solution ? 'right' : 'wrong';
    }
    return result;
  }, [state.validation, state.letters, layout]);

  const wordResults = useMemo(() => {
    const result: Record<string, boolean> = {};
    if (!state.validation) return result;
    for (const word of layout.words) result[word.id] = word.cells.every((key) => states[key] === 'right');
    return result;
  }, [state.validation, layout, states]);

  const result = state.validation && all.every((cell) => states[cell.key] === 'right');

  /**
   * Comprueba toda la actividad. Compara por letra (sin tildes ni mayúsculas) y avisa con `onResult`.
   * El foco pasa a la primera casilla incorrecta (o a la activa): el botón de comprobar se deshabilita y,
   * sin este movimiento, el foco se perdería.
   */
  const handleValidation = () => {
    const nextStates: Record<string, CellState> = {};
    for (const cell of all) {
      nextStates[cell.key] = normalizeLetter(state.letters[cell.key] ?? '') === cell.solution ? 'right' : 'wrong';
    }

    const wordsResult: WordResult[] = layout.words.map((word) => ({
      number: word.number,
      direction: word.direction,
      clue: word.clue,
      answer: word.answer,
      userAnswer: word.cells.map((key) => state.letters[key] ?? '').join(''),
      correct: word.cells.every((key) => nextStates[key] === 'right')
    }));
    const allCorrect = all.every((cell) => nextStates[cell.key] === 'right');

    dispatch({ type: 'validate' });
    onResult?.({ result: allCorrect, words: wordsResult });

    const firstWrong = all.find((cell) => nextStates[cell.key] === 'wrong');
    focusCell(firstWrong?.key ?? state.activeKey ?? firstKey);
  };

  /** Reinicia la actividad y devuelve el foco al tablero: el botón de reintentar se deshabilita al hacerlo. */
  const handleReset = () => {
    dispatch({ type: 'reset' });
    focusCell(state.activeKey ?? firstKey);
  };

  return (
    <CrosswordActivityProvider
      value={{
        layout,
        letters: state.letters,
        activeKey: state.activeKey,
        activeWord,
        direction,
        validation: state.validation,
        result,
        button: !allFilled || state.validation,
        states,
        wordResults,
        tabStopKey,
        registerInput,
        selectCell,
        toggleDirection,
        selectWord,
        typeLetter,
        clearLetter,
        move,
        handleValidation,
        handleReset
      }}
    >
      {children}
    </CrosswordActivityProvider>
  );
};

Crossword.Board = CrosswordBoard;
Crossword.Clues = CrosswordClues;
Crossword.Button = CrosswordButton;
Crossword.Feedback = CrosswordFeedback;

export { Crossword };
