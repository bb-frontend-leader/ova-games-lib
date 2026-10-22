import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { SlotsIcon } from './slots-icons';

import type { PullKind, Spin } from './types/types';

import css from './game-slots.module.css';

interface Props {
  /** `ready`: lista para tirar; `spinning`: los carretes giran; `landed`: ya se detuvieron. */
  phase: 'ready' | 'spinning' | 'landed';
  kind: PullKind;
  /** Tiradas por hacer, contando la que está en juego. */
  left: number;
  spin: Spin | null;
  /** Texto del botón que sigue a una tirada. */
  nextLabel: string;
  headingRef: React.Ref<HTMLHeadingElement>;
  pullRef: React.Ref<HTMLButtonElement>;
  nextRef: React.Ref<HTMLButtonElement>;
  onPull: () => void;
  onNext: () => void;
}

/**
 * El panel de la palanca: tirar, esperar a que giren los carretes y, al final, el premio.
 */
export const SlotsPull: React.FC<Props> = ({
  phase,
  kind,
  left,
  spin,
  nextLabel,
  headingRef,
  pullRef,
  nextRef,
  onPull,
  onNext
}) => {
  const lang = useLang();
  const t = i18n[lang];

  if (phase === 'landed' && spin) {
    const title = {
      jackpot: t.result.jackpot(spin.points),
      triple: t.result.triple(spin.points),
      pair: t.result.pair(spin.points),
      none: t.result.none
    }[spin.tier];

    return (
      <section className={css.card} aria-labelledby="slots-landed-title" data-landed data-tier={spin.tier}>
        <h3 id="slots-landed-title" ref={headingRef} tabIndex={-1} className={css['pull-title']}>
          {title}
        </h3>

        <div className={css['pull-chips']}>
          {spin.kind === 'gold' && spin.points > 0 && (
            <span className={css.chip} data-gold>
              <SlotsIcon name="star" /> {t.result.gold}
            </span>
          )}
          {spin.tier === 'jackpot' && (
            <span className={css.chip} data-gold>
              <SlotsIcon name="coin" /> {t.result.extra}
            </span>
          )}
        </div>

        {spin.tier === 'jackpot' && <p className={css['pull-text']}>{t.result.jackpotText}</p>}
        {spin.tier === 'none' && <p className={css['pull-text']}>{t.result.noneText}</p>}

        <div className={css.actions}>
          <button ref={nextRef} type="button" className={css.btn} onClick={onNext}>
            {nextLabel}
          </button>
        </div>
      </section>
    );
  }

  const spinning = phase === 'spinning';

  return (
    <section className={css.card} aria-labelledby="slots-pull-title">
      <h3 id="slots-pull-title" ref={headingRef} tabIndex={-1} className={css['pull-title']}>
        {t.pull.title}
      </h3>

      <div className={css['pull-chips']}>
        <span className={css.chip} data-gold={kind === 'gold' ? '' : undefined}>
          <SlotsIcon name={kind === 'gold' ? 'star' : 'coin'} /> {kind === 'gold' ? t.pull.gold : t.pull.normal}
        </span>
        <span className={css.chip}>{t.pull.left(left)}</span>
      </div>

      <p className={css['pull-text']}>{t.pull.hint}</p>

      <div className={css.actions}>
        <button ref={pullRef} type="button" className={css.btn} disabled={spinning} onClick={onPull}>
          {spinning ? t.pull.spinning : t.pull.pull}
        </button>
      </div>
    </section>
  );
};
