import { useLang } from '@/hooks';
import { cn } from '@/utils';

import { useCrosswordActivityContext } from './crossword-activity-context';
import { i18n } from './lib/constant';
import { isLetter, otherDirection } from './lib/layout';

import type { Cell, Direction } from './types/types';

import css from './crossword.module.css';

interface Props {
  cell: Cell;
}

export const CrosswordCell: React.FC<Props> = ({ cell }) => {
  const lang = useLang();
  const t = i18n[lang];
  const {
    layout,
    letters,
    activeKey,
    activeWord,
    direction,
    validation,
    states,
    tabStopKey,
    registerInput,
    selectCell,
    toggleDirection,
    typeLetter,
    clearLetter,
    move
  } = useCrosswordActivityContext();

  const letter = letters[cell.key] ?? '';
  const state = states[cell.key];
  const isActive = activeKey === cell.key;
  const inActiveWord = Boolean(activeWord?.cells.includes(cell.key));

  // "Letra 3 de 9, 1 horizontal; letra 1 de 8, 2 vertical, correcta". La dirección activa va primero.
  const directions: Direction[] = [direction, otherDirection(direction)];
  const label =
    directions
      .flatMap((dir) => {
        const word = cell.words[dir] ? layout.wordsById.get(cell.words[dir] as string) : undefined;
        return word
          ? [
              `${t.letter} ${word.cells.indexOf(cell.key) + 1} ${t.of} ${word.cells.length}, ${word.number} ${t[word.direction]}`
            ]
          : [];
      })
      .join('; ') + (state ? `, ${t[state]}` : '');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Si la casilla ya tenía letra, el valor trae dos: la que vale es la última escrita.
    const typed = Array.from(event.target.value).pop();

    if (!typed) return clearLetter(cell.key);
    if (!isLetter(typed)) return;
    typeLetter(cell.key, typed.toLocaleUpperCase('es'));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // No se interceptan los atajos del navegador ni los de la app (Ctrl+Alt+…).
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const keys: Record<string, () => void> = {
      ArrowLeft: () => move(cell.key, 0, -1),
      ArrowRight: () => move(cell.key, 0, 1),
      ArrowUp: () => move(cell.key, -1, 0),
      ArrowDown: () => move(cell.key, 1, 0),
      Backspace: () => clearLetter(cell.key, { back: true }),
      Delete: () => clearLetter(cell.key),
      ' ': () => toggleDirection(cell.key)
    };

    const action = keys[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };

  return (
    <div
      role="gridcell"
      aria-colindex={cell.col + 1}
      className={cn(css['cell'], state && css[`cell--${state}`])}
      data-active={isActive || undefined}
      data-in-word={inActiveWord || undefined}
      data-state={state}
    >
      {cell.number !== undefined ? (
        <span className={css['cell__number']} aria-hidden="true">
          {cell.number}
        </span>
      ) : null}

      <input
        ref={(element) => registerInput(cell.key, element)}
        type="text"
        className={css['cell__input']}
        value={letter}
        aria-label={label}
        aria-invalid={state === 'wrong' ? true : undefined}
        tabIndex={cell.key === tabStopKey ? 0 : -1}
        readOnly={validation}
        autoComplete="off"
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        data-row={cell.row}
        data-col={cell.col}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={(event) => {
          selectCell(cell.key);
          event.currentTarget.select();
        }}
        // Pulsar otra vez la casilla ya activa cambia de dirección en los cruces.
        onPointerDown={(event) => {
          if (document.activeElement === event.currentTarget) toggleDirection(cell.key);
        }}
      />
    </div>
  );
};
