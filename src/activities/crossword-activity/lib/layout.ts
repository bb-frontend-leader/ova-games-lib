import type { Cell, CrosswordWord, Direction, Layout, PlacedWord } from '../types/types';

export const cellKey = (row: number, col: number) => `${row},${col}`;

export const otherDirection = (direction: Direction): Direction => (direction === 'across' ? 'down' : 'across');

/** `true` si es una sola letra (cualquier alfabeto). */
export const isLetter = (value: string): boolean => /^\p{L}$/u.test(value);

/**
 * Compara letras sin tener en cuenta mayúsculas ni tildes, pero distinguiendo la Ñ de la N
 * ("año" y "ano" son palabras distintas).
 */
export const normalizeLetter = (value: string): string => {
  const upper = value.toLocaleUpperCase('es');
  return upper === 'Ñ' ? upper : upper.normalize('NFD').replace(/\p{M}/gu, '');
};

const lettersOf = (answer: string): string[] => Array.from(answer).filter((char) => !/\s/u.test(char));

/**
 * Ubica las palabras en una cuadrícula a partir de su fila, columna y dirección.
 * Calcula sola la numeración (por filas, de arriba abajo y de izquierda a derecha, como en un crucigrama
 * impreso), los cruces (una casilla compartida es una sola) y la longitud de cada pista.
 * Los problemas de los datos no lanzan error: se devuelven en `conflicts` para avisar en desarrollo.
 */
export const buildLayout = (input: CrosswordWord[]): Layout => {
  const cells = new Map<string, Cell>();
  const conflicts: string[] = [];

  const draft = input.map((word) => {
    const chars = lettersOf(word.answer);
    const keys = chars.map((_, index) =>
      cellKey(word.row + (word.direction === 'down' ? index : 0), word.col + (word.direction === 'across' ? index : 0))
    );
    return { word, chars, keys };
  });

  for (const { word, chars, keys } of draft) {
    if (!chars.length) {
      conflicts.push(`La palabra con pista "${word.clue}" no tiene respuesta.`);
      continue;
    }
    if (word.row < 0 || word.col < 0) {
      conflicts.push(`"${word.answer}": la fila y la columna no pueden ser negativas.`);
    }

    chars.forEach((char, index) => {
      const key = keys[index];
      const [row, col] = key.split(',').map(Number);
      const solution = normalizeLetter(char);
      const existing = cells.get(key);

      if (!existing) {
        cells.set(key, { key, row, col, solution, words: {} });
      } else if (existing.solution !== solution) {
        conflicts.push(
          `"${word.answer}" choca en la fila ${row + 1}, columna ${col + 1}: ya había "${existing.solution}" y esta palabra pone "${solution}".`
        );
      }
    });
  }

  // Numeración: una casilla recibe número si alguna palabra empieza en ella.
  const starts = [...new Set(draft.filter((item) => item.keys.length).map((item) => item.keys[0]))]
    .map((key) => cells.get(key) as Cell)
    .sort((a, b) => a.row - b.row || a.col - b.col);
  const numberByKey = new Map(starts.map((cell, index) => [cell.key, index + 1]));
  starts.forEach((cell) => {
    cell.number = numberByKey.get(cell.key);
  });

  const words: PlacedWord[] = [];
  for (const { word, chars, keys } of draft) {
    if (!chars.length) continue;

    const number = numberByKey.get(keys[0]) as number;
    const id = `${number}-${word.direction}`;

    if (words.some((placed) => placed.id === id)) {
      conflicts.push(`Hay dos palabras en la misma dirección que empiezan en la casilla ${number}.`);
      continue;
    }
    if (keys.some((key) => (cells.get(key) as Cell).words[word.direction])) {
      conflicts.push(`"${word.answer}" comparte casillas con otra palabra en su misma dirección.`);
      continue;
    }

    words.push({
      id,
      number,
      direction: word.direction,
      clue: word.clue,
      answer: chars.map(normalizeLetter).join(''),
      lengthHint: word.answer
        .trim()
        .split(/\s+/u)
        .map((part) => Array.from(part).length)
        .join(', '),
      cells: keys
    });
    keys.forEach((key) => {
      (cells.get(key) as Cell).words[word.direction] = id;
    });
  }

  words.sort((a, b) => a.number - b.number || (a.direction === 'across' ? -1 : 1));

  const all = [...cells.values()];
  return {
    rows: all.length ? Math.max(...all.map((cell) => cell.row)) + 1 : 0,
    cols: all.length ? Math.max(...all.map((cell) => cell.col)) + 1 : 0,
    cells,
    words,
    wordsById: new Map(words.map((word) => [word.id, word])),
    conflicts
  };
};
