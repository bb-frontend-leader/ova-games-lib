import { useId } from 'react';

import { useLang } from '@/hooks';

import { HOLE_IDS, HOLES, i18n, SCORE } from './lib/constant';
import { chanceOf } from './lib/layout';
import { RanaIcon } from './rana-icons';

import type { HoleId } from './types/types';

import css from './game-rana.module.css';

interface Props {
  /** Hoyo al que se apunta y hoyo doble de este turno. */
  aim: HoleId;
  hot: HoleId;
  /** Racha de aciertos (sube la probabilidad). */
  streak: number;
  /** Manos firmes que quedan y si el lanzamiento usa una. */
  steady: number;
  steadyOn: boolean;
  /** La moneda ya vuela: no se puede tocar nada. */
  throwing: boolean;
  /** Qué pasó con la moneda anterior (vacío en la primera). */
  lastText: string;
  aimRef: React.Ref<HTMLInputElement>;
  onPick: (hole: HoleId) => void;
  onToggleSteady: () => void;
  onThrow: () => void;
}

/**
 * La consola de lanzamiento: la lista de hoyos (cada uno con sus puntos y su probabilidad, que cambia con la racha y
 * la mano firme), la mano firme y «¡Lanzar!». La lista son radios nativos, así que se maneja con las flechas del
 * teclado; tocar un hoyo de la mesa elige el mismo.
 */
export const RanaAim: React.FC<Props> = ({
  aim,
  hot,
  streak,
  steady,
  steadyOn,
  throwing,
  lastText,
  aimRef,
  onPick,
  onToggleSteady,
  onThrow
}) => {
  const lang = useLang();
  const t = i18n[lang];
  const uid = useId();

  return (
    <section className={css.card} aria-labelledby={`${uid}-title`}>
      <div className={css['aim-head']}>
        <h3 id={`${uid}-title`} className={css['guide-title']}>
          {t.aim.title}
        </h3>
      </div>

      <p className={css['guide-text']}>{t.aim.text}</p>

      <fieldset className={css.holes} disabled={throwing}>
        <legend className="u-sr-only">{t.aim.group}</legend>

        {HOLE_IDS.map((id) => {
          const chance = chanceOf(id, streak, steadyOn);
          const isHot = id === hot;
          const points = HOLES[id].points * (isHot ? SCORE.hot : 1);

          return (
            <label
              key={id}
              className={css.hole}
              data-picked={aim === id ? '' : undefined}
              data-hot={isHot ? '' : undefined}
            >
              <input
                ref={aim === id ? aimRef : undefined}
                type="radio"
                name={`${uid}-hole`}
                className={css['answer-input']}
                checked={aim === id}
                onChange={() => onPick(id)}
              />
              <span className={css['hole-name']}>
                {t.holes[id]}
                {isHot && <span className={css['hole-hot']}>{t.aim.hot}</span>}
              </span>
              <span className={css['hole-points']}>{t.aim.points(points)}</span>
              <span className={css['hole-chance']}>
                <span
                  className={css['hole-bar']}
                  style={{ '--chance': `${Math.round(chance * 100)}%` } as React.CSSProperties}
                  aria-hidden="true"
                />
                {t.aim.chance(chance)}
              </span>
            </label>
          );
        })}
      </fieldset>

      {lastText && <p className={css['last-shot']}>{t.aim.last(lastText)}</p>}

      <div className={css['aim-actions']}>
        <button
          type="button"
          className={css.tool}
          aria-pressed={steadyOn}
          disabled={throwing || (!steadyOn && !steady)}
          onClick={onToggleSteady}
        >
          <RanaIcon name="flame" />
          {t.aim.steady} ({steady})
        </button>
        <p className={css['tool-hint']}>{steadyOn ? t.aim.steadyOn : t.aim.steadyHint}</p>

        <button type="button" className={css.btn} disabled={throwing} onClick={onThrow}>
          <RanaIcon name="disc" />
          {t.fire}
        </button>
      </div>
    </section>
  );
};
