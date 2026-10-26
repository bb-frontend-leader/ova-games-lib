import { useId } from 'react';

import { useLang } from '@/hooks';

import { i18n, SCORE } from './lib/constant';
import { TejoIcon } from './tejo-icons';

import css from './game-tejo.module.css';

interface Props {
  /** Punto apuntado, en porcentaje del ancho y del fondo de la arcilla. */
  aimX: number;
  aimY: number;
  /** Pulsos firmes que quedan y si el lanzamiento usa uno. */
  steady: number;
  steadyOn: boolean;
  /** El tejo ya vuela: no se puede tocar nada. */
  throwing: boolean;
  /** Qué pasó en el lanzamiento anterior (vacío en el primero). */
  lastText: string;
  xRef: React.Ref<HTMLInputElement>;
  onAim: (aimX: number, aimY: number) => void;
  onToggleSteady: () => void;
  onThrow: () => void;
}

/**
 * La consola de puntería: dos deslizadores (izquierda-derecha y cerca-lejos; el escenario también se toca), el pulso
 * firme, la tabla de puntos y «¡Lanzar!». Los deslizadores son nativos, así que también se manejan con el teclado.
 */
export const TejoAim: React.FC<Props> = ({
  aimX,
  aimY,
  steady,
  steadyOn,
  throwing,
  lastText,
  xRef,
  onAim,
  onToggleSteady,
  onThrow
}) => {
  const lang = useLang();
  const t = i18n[lang];
  const uid = useId();

  const zones = [
    { id: 'monona', label: t.zones.monona, points: SCORE.monona },
    { id: 'embocinada', label: t.zones.embocinada, points: SCORE.embocinada },
    { id: 'mecha', label: t.zones.mecha, points: SCORE.mecha },
    { id: 'mano', label: t.zones.mano, points: SCORE.mano }
  ];

  return (
    <section className={css.card} aria-labelledby={`${uid}-title`}>
      <div className={css['aim-head']}>
        <h3 id={`${uid}-title`} className={css['guide-title']}>
          {t.aim.title}
        </h3>
      </div>

      <p className={css['guide-text']}>{t.aim.text}</p>

      <div className={css.sliders}>
        <div className={css.slider}>
          <label htmlFor={`${uid}-x`} className={css['slider-label']}>
            {t.aim.x}: <strong>{aimX} %</strong>
          </label>
          <input
            ref={xRef}
            id={`${uid}-x`}
            type="range"
            className={css.range}
            min={0}
            max={100}
            step={1}
            value={aimX}
            disabled={throwing}
            aria-valuetext={t.aim.value(aimX)}
            onChange={(event) => onAim(Number(event.target.value), aimY)}
          />
        </div>

        <div className={css.slider}>
          <label htmlFor={`${uid}-y`} className={css['slider-label']}>
            {t.aim.y}: <strong>{aimY} %</strong>
          </label>
          <input
            id={`${uid}-y`}
            type="range"
            className={css.range}
            min={0}
            max={100}
            step={1}
            value={aimY}
            disabled={throwing}
            aria-valuetext={t.aim.value(aimY)}
            onChange={(event) => onAim(aimX, Number(event.target.value))}
          />
        </div>
      </div>

      <div>
        <p className={css['zones-title']}>{t.aim.zones}</p>
        <ul className={css.zones}>
          {zones.map(({ id, label, points }) => (
            <li key={id} className={css.zone} data-zone={id}>
              <span>{label}</span>
              <strong>{points}</strong>
            </li>
          ))}
        </ul>
      </div>

      {lastText && <p className={css['last-shot']}>{t.aim.last(lastText)}</p>}

      <div className={css['aim-actions']}>
        <button
          type="button"
          className={css.tool}
          aria-pressed={steadyOn}
          disabled={throwing || (!steadyOn && !steady)}
          onClick={onToggleSteady}
        >
          <TejoIcon name="flame" />
          {t.aim.steady} ({steady})
        </button>
        <p className={css['tool-hint']}>{steadyOn ? t.aim.steadyOn : t.aim.steadyHint}</p>

        <button type="button" className={css.btn} disabled={throwing} onClick={onThrow}>
          <TejoIcon name="disc" />
          {t.fire}
        </button>
      </div>
    </section>
  );
};
