import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { PlinkoIcon } from './plinko-icons';

import type { BallKind, Drop } from './types/types';

import css from './game-plinko.module.css';

interface Props {
  /** `aim`: apuntando; `dropping`: la ficha cae; `landed`: ya cayó. */
  phase: 'aim' | 'dropping' | 'landed';
  kind: BallKind;
  /** Fichas por soltar, contando la que está en juego. */
  left: number;
  /** Posiciones desde las que se puede soltar: de 0 a `positions - 1`. */
  positions: number;
  aim: number;
  drop: Drop | null;
  /** Texto del botón que sigue a una ficha caída. */
  nextLabel: string;
  headingRef: React.Ref<HTMLHeadingElement>;
  rangeRef: React.Ref<HTMLInputElement>;
  nextRef: React.Ref<HTMLButtonElement>;
  onAim: (aim: number) => void;
  onDrop: () => void;
  onNext: () => void;
}

/**
 * El panel de la ficha: apuntar (control de posición y «¡Soltar!»), esperar a que caiga y, al final, el premio.
 */
export const PlinkoDrop: React.FC<Props> = ({
  phase,
  kind,
  left,
  positions,
  aim,
  drop,
  nextLabel,
  headingRef,
  rangeRef,
  nextRef,
  onAim,
  onDrop,
  onNext
}) => {
  const lang = useLang();
  const t = i18n[lang];

  if (phase === 'landed' && drop) {
    const bonus = drop.prize === 'bonus';

    return (
      <section className={css.card} aria-labelledby="plinko-landed-title" data-landed>
        <h3 id="plinko-landed-title" ref={headingRef} tabIndex={-1} className={css['drop-title']}>
          {bonus ? t.landed.bonus : t.landed.prize(drop.points)}
        </h3>

        <div className={css['drop-chips']}>
          {drop.kind === 'gold' && !bonus && (
            <span className={css.chip} data-gold>
              <PlinkoIcon name="star" /> {t.landed.gold}
            </span>
          )}
          <span className={css.chip}>
            {t.landed.slot} {drop.slot + 1}
          </span>
        </div>

        {bonus && <p className={css['drop-text']}>{t.landed.bonusText}</p>}

        <div className={css.actions}>
          <button ref={nextRef} type="button" className={css.btn} onClick={onNext}>
            {nextLabel}
          </button>
        </div>
      </section>
    );
  }

  const dropping = phase === 'dropping';

  return (
    <section className={css.card} aria-labelledby="plinko-aim-title">
      <h3 id="plinko-aim-title" ref={headingRef} tabIndex={-1} className={css['drop-title']}>
        {t.aim.title}
      </h3>

      <div className={css['drop-chips']}>
        <span className={css.chip} data-gold={kind === 'gold' ? '' : undefined}>
          <PlinkoIcon name={kind === 'gold' ? 'star' : 'ball'} /> {kind === 'gold' ? t.aim.gold : t.aim.normal}
        </span>
        <span className={css.chip}>{t.aim.left(left)}</span>
      </div>

      <p className={css['drop-text']}>{t.aim.hint}</p>

      <label className={css.aim}>
        <span className={css['aim-label']}>{t.aim.label}</span>
        <input
          ref={rangeRef}
          type="range"
          className={css['aim-input']}
          min={0}
          max={positions - 1}
          step={1}
          value={aim}
          disabled={dropping}
          aria-valuetext={t.aim.value(aim + 1, positions)}
          onChange={(event) => onAim(Number(event.target.value))}
        />
      </label>

      <div className={css.actions}>
        <button type="button" className={css.btn} disabled={dropping} onClick={onDrop}>
          {dropping ? t.aim.dropping : t.aim.drop}
        </button>
      </div>
    </section>
  );
};
