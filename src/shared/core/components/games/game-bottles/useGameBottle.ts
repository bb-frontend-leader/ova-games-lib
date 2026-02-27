import { useContext } from 'react';

import { GameBottleContext } from './GameBottle'; // o del mismo archivo

export function useGameBottle() {
  const context = useContext(GameBottleContext);

  if (!context) {
    throw new Error('Los componentes de GameBottle deben usarse dentro de <GameBottle>');
  }

  return context;
}
