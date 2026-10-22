export type ChipId = 'orange' | 'red' | 'blue' | 'white';

export interface ChipKind {
  id: ChipId;
  value: number;
}

/** Fichas con las que se apuesta: cuanto más seguro está el estudiante, más grande la ficha. */
export const BET_CHIPS: readonly ChipKind[] = [
  { id: 'orange', value: 10 },
  { id: 'red', value: 15 },
  { id: 'blue', value: 25 }
];

/** La ficha de $5 solo sirve para dar el cambio: no se apuesta, pero aparece en la mano si sobra. */
export const CHANGE_CHIP: ChipKind = { id: 'white', value: 5 };

/** Fichas con las que se empieza y a las que la banca recarga si el estudiante se queda sin poder apostar. */
export const START_POINTS = 25;
export const MIN_BET = 10;

const ALL_CHIPS = [...BET_CHIPS, CHANGE_CHIP];

export const chipKind = (value: number): ChipKind => ALL_CHIPS.find((chip) => chip.value === value) ?? CHANGE_CHIP;

/**
 * Descompone un monto en fichas (primero las más grandes) para dibujar las pilas de la mano.
 * Con `small` se usan solo fichas pequeñas ($10 y $5): al cobrar se ven más fichas y se cuentan mejor.
 */
export const toChips = (amount: number, small = false): { kind: ChipKind; count: number }[] => {
  const stacks: { kind: ChipKind; count: number }[] = [];
  let left = Math.max(0, amount);
  const kinds = small ? ALL_CHIPS.filter((chip) => chip.value <= 10) : ALL_CHIPS;

  [...kinds]
    .sort((x, y) => y.value - x.value)
    .forEach((kind) => {
      const count = Math.floor(left / kind.value);

      if (count > 0) stacks.push({ kind, count });
      left -= count * kind.value;
    });

  return stacks;
};
