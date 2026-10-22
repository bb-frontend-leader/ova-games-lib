import { useId } from 'react';

import { useLang } from '@/hooks';

import { AIM_RANGE, i18n } from './lib/constant';
import { TowerIcon } from './tower-icons';

import css from './game-tower-blocks.module.css';

interface Props {
  /** Posición apuntada (casillas respecto a la torre) y viento de este bloque. */
  aim: number;
  wind: number;
  calmOn: boolean;
  /** El bloque ya está cayendo: no se puede tocar nada. */
  dropping: boolean;
  rangeRef: React.Ref<HTMLInputElement>;
  onAim: (aim: number) => void;
  onDrop: () => void;
}

/**
 * El panel de la grúa: dónde está el viento, el control para mover el bloque y «Soltar». El control es un
 * deslizador normal, así que también se maneja con las flechas del teclado.
 */
export const TowerAim: React.FC<Props> = ({ aim, wind, calmOn, dropping, rangeRef, onAim, onDrop }) => {
  const lang = useLang();
  const t = i18n[lang].guide;
  const uid = useId();
  const rangeId = `${uid}-aim`;

  const legend = [
    { kind: 'perfect', text: t.legend.perfect },
    { kind: 'partial', text: t.legend.partial },
    { kind: 'miss', text: t.legend.miss }
  ];

  return (
    <section className={css.card} aria-labelledby={`${uid}-title`}>
      <h3 id={`${uid}-title`} className={css['guide-title']}>
        {t.title}
      </h3>

      <p className={css['guide-text']}>{t.text}</p>

      <p className={css.boom} data-kind={calmOn || !wind ? 'calm' : 'wind'}>
        <TowerIcon name="wind" />
        {calmOn ? t.calm : t.wind(wind)}
      </p>

      <div className={css.aim}>
        <label htmlFor={rangeId} className={css['aim-label']}>
          {t.aimLabel}: <strong>{t.aimValue(aim)}</strong>
        </label>

        <input
          ref={rangeRef}
          id={rangeId}
          type="range"
          className={css.range}
          min={-AIM_RANGE}
          max={AIM_RANGE}
          step={1}
          value={aim}
          disabled={dropping}
          aria-valuetext={t.aimValue(aim)}
          onChange={(event) => onAim(Number(event.target.value))}
        />
      </div>

      <div className={css.actions}>
        <button type="button" className={css.btn} disabled={dropping} onClick={onDrop}>
          <TowerIcon name="block" />
          {i18n[lang].drop}
        </button>
      </div>

      <ul className={css.legend}>
        {legend.map(({ kind, text }) => (
          <li key={kind}>
            <span className={css['legend-icon']} data-kind={kind} aria-hidden="true" />
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
};
