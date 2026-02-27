import { useMemo, useRef } from 'react';

import { GameFishStates } from './types/types';
// 1. Importamos el objeto BG
import { BG } from './const';
import { useGameFishActivityContext } from './game-fish-context';

import css from './game-fish.module.css';

interface Props {
  label: string;
  id: string;
  name: string;
  state: GameFishStates;
}

const fishState = { count: 0 };

export const GameFishElement = ({ label, id, name, state }: Props) => {
  const { addSelectedOption, options, validation } = useGameFishActivityContext();
  const fishNumber = useRef<number | null>(null);

  if (fishNumber.current === null) {
    // Esto genera un número del 1 al 7
    fishState.count = (fishState.count % 7) + 1;
    fishNumber.current = fishState.count;
  }

  // Verifica si este pez específico es el seleccionado
  const isSelected = useMemo(() => options.some((opt) => opt.id === id), [options, id]);

  // Verifica si el usuario ya hizo clic en cualquier pez del nivel
  const isAnythingSelected = options.length > 0;

  const getStatusClass = () => {
    // LÓGICA DE ESCALA DE GRISES:
    // Si hay algo seleccionado pero NO es este pez, aplicamos la clase de gris
    if (isAnythingSelected && !isSelected) {
      return css['is-not-selected'];
    }

    // LÓGICA DE VALIDACIÓN (Tu código original):
    if (!validation) return isSelected ? css.selected : '';

    if (isSelected && state === 'success') return css.success;
    if (isSelected && state === 'wrong') return css.wrong;

    return '';
  };

  return (
    <div className={css['fishs-element-container']}>
      <button
        onClick={() => addSelectedOption({ id, name, state, label })}
        // Bloqueamos el botón si ya se validó O si ya se eligió otra opción
        disabled={validation || (isAnythingSelected && !isSelected)}
        className={`${css['fish-item']} ${getStatusClass()}`}>
        <img src={BG.peces[fishNumber.current - 1]} className={css['fish-image']} alt="Pez" />

        <div className={css['fish-answer-box']}>
          {/* Iconos de validación en la esquina */}
          {validation && isSelected && (
            <div className={css['status-icon']}>
              {state === 'success' ? (
                <span className={css['icon-check']}>✔</span>
              ) : (
                <span className={css['icon-x']}>✖</span>
              )}
            </div>
          )}
          <label style={{ cursor: 'inherit' }}>{label}</label>
        </div>
      </button>
    </div>
  );
};
