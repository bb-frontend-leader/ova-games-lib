import { useGameFishActivityContext } from './game-fish-context';
import { BG } from './lib/constant';

import type { GameFishStates } from './types/types';

import css from './game-fish.module.css';

interface Props {
  label: string;
  id: string;
  name: string;
  state: GameFishStates;
  /** Lo pone `GameFish.Level` (posición del pez): decide su dibujo. */
  variant?: number;
}

/** Un pez con una respuesta. Se puede cambiar de pez hasta comprobar; después solo el elegido muestra su resultado. */
export const GameFishElement = ({ label, id, name, state, variant = 0 }: Props) => {
  const { addSelectedOption, options, validation } = useGameFishActivityContext();

  const isSelected = options.some((opt) => opt.id === id);
  const isAnythingSelected = options.length > 0;

  const status = validation
    ? isSelected
      ? state === 'success'
        ? 'success'
        : 'wrong'
      : 'off'
    : isSelected
      ? 'selected'
      : isAnythingSelected
        ? 'dim'
        : 'idle';

  return (
    <div
      className={css['fishs-element-container']}
      data-fish-wrap
      data-picked={isSelected || undefined}
      data-state={status}
    >
      <button
        type="button"
        aria-pressed={isSelected}
        disabled={validation}
        data-fish-btn
        className={`${css['fish-item']} ${css[status]}`}
        onClick={() => addSelectedOption({ id, name, state, label })}
      >
        <img src={BG.peces[variant % BG.peces.length]} className={css['fish-image']} alt="" />

        <span className={css['fish-answer-box']}>
          {/* Icono de validación en la esquina */}
          {validation && isSelected && (
            <span className={css['status-icon']} aria-hidden="true">
              {state === 'success' ? (
                <span className={css['icon-check']}>✔</span>
              ) : (
                <span className={css['icon-x']}>✖</span>
              )}
            </span>
          )}
          {label}
        </span>
      </button>
    </div>
  );
};
