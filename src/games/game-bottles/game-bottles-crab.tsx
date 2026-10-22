import { useGameBottleContext } from './game-bottles-context';
import { IMAGENES_CANGREJO } from './lib/constant';

import css from './styles/crab.module.css';

/**
 * Cangrejo decorativo que camina de lado por la arena. Todo es CSS (sin JS): se detiene solo con "reducir movimiento"
 * o "detener animaciones", y da un salto cuando la palabra es correcta.
 */
export default function Crab() {
  const { openModal } = useGameBottleContext();

  return (
    <div className={css.lane} aria-hidden="true">
      <div className={css.walk}>
        <div className={css.hop} data-hop={openModal === 'success' ? true : undefined}>
          <div className={css.crab}>
            <img src={IMAGENES_CANGREJO.cangrejo_1_pat_izq} className={css.pat_izq} alt="" />
            <img src={IMAGENES_CANGREJO.Cangrejo1_torso} className={css.torso} alt="" />
            <img src={IMAGENES_CANGREJO.cangrejo_1_pat_der} className={css.pat_der} alt="" />
            <img src={IMAGENES_CANGREJO.cangrejo_1_tenaza} className={css.tenaza_izq} alt="" />
            <img src={IMAGENES_CANGREJO.cangrejo_1_tenaza} className={css.tenaza_der} alt="" />
            <img src={IMAGENES_CANGREJO.Cangrejos_sombras} className={css.shadow} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
