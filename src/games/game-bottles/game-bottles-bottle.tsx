import { useEffect, useState } from 'react';

import { useLang } from '@/hooks';

import { IMAGENES_BOTELLA } from './lib/constant';
import { i18n } from './lib/i18n';

import css from './styles/bottle.module.css';

interface Props {
  letter: string;
  index: string;
  enable: boolean;
  /** Posición de la botella en la fila: escalona la entrada y reparte el vaivén y el corcho. */
  order: number;
  /** Retardo (s) de la reaparición cuando todas las botellas vuelven a la vez. */
  respawnDelay?: number;
  onPick: (button: HTMLButtonElement) => void;
}

/**
 * Botella con una letra. Toda su animación es CSS: entra cayendo, se mece, reacciona al puntero y, al elegirla, el
 * corcho sale disparado y la botella se hunde (los efectos de JS los lanza `GameBottle` desde `onPick`).
 */
const Bottle: React.FC<Props> = ({ letter, index, enable, order, respawnDelay = 0, onPick }) => {
  const t = i18n[useLang()];
  // Solo las botellas que ya se usaron "reaparecen" con rebote; en el primer montaje basta con la entrada.
  const [used, setUsed] = useState(false);

  useEffect(() => {
    if (!enable) setUsed(true);
  }, [enable]);

  const style = {
    '--enter': `${order * 0.09}s`,
    '--respawn': `${respawnDelay}s`,
    '--bob-delay': `${-((order * 0.7) % 3)}s`,
    '--bob-dur': `${3.2 + (order % 3) * 0.5}s`,
    '--tilt': `${order % 2 ? -3 : 3}deg`,
    '--cork-x': `${24 + (order % 4) * 10}px`,
    '--cork-spin': `${order % 2 ? -480 : 480}deg`
  } as React.CSSProperties;

  return (
    <button
      type="button"
      className={css.container}
      style={style}
      data-bottle={index}
      data-used={used || undefined}
      disabled={!enable}
      aria-label={t.bottle(letter)}
      aria-hidden={!enable || undefined}
      onClick={(event) => onPick(event.currentTarget)}
    >
      <span className={css.float}>
        <span className={css.art} data-part="art" data-open={!enable || undefined}>
          <img src={enable ? IMAGENES_BOTELLA.botella : IMAGENES_BOTELLA.botella_sin_corcho} alt="" draggable={false} />
          <span className={css.letter} data-part="letter">
            {letter}
          </span>
        </span>
        {!enable && <img src={IMAGENES_BOTELLA.corcho} className={css.cork} alt="" draggable={false} />}
      </span>
    </button>
  );
};

export default Bottle;
