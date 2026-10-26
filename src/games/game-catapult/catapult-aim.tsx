import { useId } from 'react';

import { useLang } from '@/hooks';

import { CatapultIcon } from './catapult-icons';
import { ANGLE, i18n, POWER } from './lib/constant';

import css from './game-catapult.module.css';

interface Props {
  /** Ángulo (grados) y fuerza (%) apuntados. */
  angle: number;
  power: number;
  /** Distancia (m) a la torre enemiga. */
  target: number;
  /** Bolas de fuego que quedan y si el disparo usa una. */
  fire: number;
  fireOn: boolean;
  /** La piedra ya vuela: no se puede tocar nada. */
  firing: boolean;
  /** Qué pasó en el disparo anterior (vacío en el primero). */
  lastText: string;
  angleRef: React.Ref<HTMLInputElement>;
  onAngle: (angle: number) => void;
  onPower: (power: number) => void;
  onToggleFire: () => void;
  onFire: () => void;
}

/**
 * La consola de puntería: dos deslizadores (ángulo y fuerza), la bola de fuego y «Disparar». Los deslizadores son
 * nativos, así que también se manejan con las flechas del teclado.
 */
export const CatapultAim: React.FC<Props> = ({
  angle,
  power,
  target,
  fire,
  fireOn,
  firing,
  lastText,
  angleRef,
  onAngle,
  onPower,
  onToggleFire,
  onFire
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
        <span className={css['target-chip']}>
          <CatapultIcon name="target" />
          {t.tower(target)}
        </span>
      </div>

      <p className={css['guide-text']}>{t.aim.text}</p>

      <div className={css.sliders}>
        <div className={css.slider}>
          <label htmlFor={`${uid}-angle`} className={css['slider-label']}>
            {t.aim.angle}: <strong>{angle}°</strong>
          </label>
          <input
            ref={angleRef}
            id={`${uid}-angle`}
            type="range"
            className={css.range}
            min={ANGLE.min}
            max={ANGLE.max}
            step={1}
            value={angle}
            disabled={firing}
            aria-valuetext={t.aim.angleValue(angle)}
            onChange={(event) => onAngle(Number(event.target.value))}
          />
        </div>

        <div className={css.slider}>
          <label htmlFor={`${uid}-power`} className={css['slider-label']}>
            {t.aim.power}: <strong>{power} %</strong>
          </label>
          <input
            id={`${uid}-power`}
            type="range"
            className={css.range}
            min={POWER.min}
            max={POWER.max}
            step={1}
            value={power}
            disabled={firing}
            aria-valuetext={t.aim.powerValue(power)}
            onChange={(event) => onPower(Number(event.target.value))}
          />
        </div>
      </div>

      {lastText && <p className={css['last-shot']}>{t.aim.last(lastText)}</p>}

      <div className={css['aim-actions']}>
        <button
          type="button"
          className={css.tool}
          aria-pressed={fireOn}
          disabled={firing || (!fireOn && !fire)}
          onClick={onToggleFire}
        >
          <CatapultIcon name="flame" />
          {t.aim.fireball} ({fire})
        </button>
        <p className={css['tool-hint']}>{fireOn ? t.aim.fireballOn : t.aim.fireballHint}</p>

        <button type="button" className={css.btn} disabled={firing} onClick={onFire}>
          <CatapultIcon name="ball" />
          {t.fire}
        </button>
      </div>
    </section>
  );
};
