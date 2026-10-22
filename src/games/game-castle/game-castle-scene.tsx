import { forwardRef } from 'react';

import fondoCielo from './images/Fondo_cielo.webp';
import fondoMontanas from './images/Fondo_montanas.webp';
import fondoNubes from './images/Fondo_nubes.webp';
import fondoPrimerPlano from './images/Fondo_primer_plano.webp';

import css from './game-castle.module.css';

/**
 * El mundo del juego: cielo, nubes, montañas y el castillo con su puerta. Todo mide lo mismo (1067×500) y va
 * anclado a la derecha, así la puerta siempre queda sobre el castillo aunque el escenario se recorte en pantallas
 * estrechas. La puerta (rejilla de píxeles) se levanta cuando el escenario está en `data-mood="win"`.
 */
export const GameCastleScene = forwardRef<HTMLDivElement>((_, gateRef) => (
  <div className={css.scene} aria-hidden="true">
    <div className={css.world}>
      <img src={fondoCielo} className={css.layer} alt="" />
      <img src={fondoNubes} className={`${css.layer} ${css.cloud}`} alt="" />
      <img src={fondoNubes} className={`${css.layer} ${css.cloud}`} alt="" style={{ animationDelay: '-9s' }} />
      <img src={fondoMontanas} className={css.layer} alt="" />
      <img src={fondoPrimerPlano} className={css.layer} alt="" />

      <div ref={gateRef} className={css.door}>
        <div className={css.gate} />
      </div>
    </div>
  </div>
));

GameCastleScene.displayName = 'GameCastleScene';
