import type { Cell, Ship } from '../types/types';

type Random = () => number;

const pick = (max: number, random: Random) => Math.floor(random() * max);

/** Casillas de alrededor de `id` (las 8 vecinas) dentro de un campo de `size` x `size`. */
const around = (id: number, size: number) => {
  const row = Math.floor(id / size);
  const col = id % size;
  const list: number[] = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = row + dr;
      const c = col + dc;

      if ((dr || dc) && r >= 0 && r < size && c >= 0 && c < size) list.push(r * size + c);
    }
  }

  return list;
};

/**
 * Coloca la flota al azar: cada barco en horizontal o vertical y, si cabe, sin tocar a otro (como en el juego de
 * siempre). Si tras muchos intentos no cuadra, se permite que se toquen.
 */
const place = (size: number, fleet: number[], spaced: boolean, random: Random): number[][] | null => {
  const taken = new Set<number>();
  const blocked = new Set<number>();
  const placed: number[][] = [];

  for (const length of fleet) {
    let found: number[] | null = null;

    for (let attempt = 0; attempt < 80 && !found; attempt++) {
      const horizontal = random() < 0.5;
      const row = pick(horizontal ? size : size - length + 1, random);
      const col = pick(horizontal ? size - length + 1 : size, random);
      const cells = Array.from({ length }, (_, k) => (horizontal ? row * size + col + k : (row + k) * size + col));

      if (cells.every((id) => !taken.has(id) && (!spaced || !blocked.has(id)))) found = cells;
    }

    if (!found) return null;

    placed.push(found);
    found.forEach((id) => {
      taken.add(id);
      around(id, size).forEach((near) => blocked.add(near));
    });
  }

  return placed;
};

/**
 * Crea un campo de `size` x `size` con la flota escondida. `fleet` son las longitudes de los barcos.
 */
export const createBoard = (size: number, fleet: number[], random: Random = Math.random) => {
  const sorted = [...fleet].sort((a, b) => b - a);
  const layout = place(size, sorted, true, random) ?? place(size, sorted, false, random) ?? [];
  const ships: Ship[] = layout.map((cells, id) => ({ id, size: cells.length, cells }));
  const owner = new Map<number, number>();

  ships.forEach((ship) => ship.cells.forEach((id) => owner.set(id, ship.id)));

  const cells: Cell[] = Array.from({ length: size * size }, (_, id) => ({
    id,
    row: Math.floor(id / size),
    col: id % size,
    ship: owner.get(id) ?? null,
    status: 'water',
    ping: null
  }));

  return { cells, ships };
};

/** Barcos sin tocar en las 9 casillas centradas en `id` (la propia incluida). */
export const nearShips = (cells: Cell[], id: number, size: number) =>
  [id, ...around(id, size)].filter((near) => cells[near].ship !== null && cells[near].status === 'water').length;
