import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import type { IconName } from './lib/icons';
import { SnakesDie } from './snakes-die';
import { SnakesIcon } from './snakes-icons';

import type { Phase, Stop } from './types/types';

import css from './game-snakes-ladders.module.css';

const STOP_ICON: Record<Stop['kind'], IconName> = {
  ladder: 'ladder',
  snake: 'snake',
  shield: 'shield',
  bounce: 'flag',
  final: 'trophy'
};

interface Props {
  phase: Extract<Phase, 'roll' | 'rolling' | 'moving' | 'stop'>;
  /** Última tirada (0 si aún no se tiró) y tirada extra gratis pendiente. */
  die: number;
  bonus: boolean;
  stop: Stop | null;
  dieRef: React.Ref<HTMLDivElement>;
  rollRef: React.Ref<HTMLButtonElement>;
  nextRef: React.Ref<HTMLButtonElement>;
  onRoll: () => void;
  onNext: () => void;
}

/**
 * Tarjeta pequeña que se apoya sobre el tablero (no lo tapa): el dado y su botón, el aviso «Avanzando» mientras se
 * mueve la ficha, o la parada en una escalera, una serpiente, el rebote o la meta con lo que ha pasado.
 */
export const SnakesDock: React.FC<Props> = ({ phase, die, bonus, stop, dieRef, rollRef, nextRef, onRoll, onNext }) => {
  const lang = useLang();
  const t = i18n[lang];

  const dieNode = <SnakesDie ref={dieRef} face={die || 1} label={die ? t.dieLabel(die) : t.dieIdle} />;

  if (phase === 'stop' && stop) {
    const text = t.stops[stop.kind];
    const good = stop.kind !== 'snake' && stop.kind !== 'bounce';
    const hint =
      stop.kind === 'ladder' || stop.kind === 'snake'
        ? t.stops[stop.kind].text(stop.at, stop.to ?? stop.at)
        : t.stops[stop.kind].text;
    const label =
      stop.kind === 'final'
        ? t.results
        : stop.kind === 'ladder'
          ? t.climb
          : stop.kind === 'snake'
            ? t.slide
            : stop.again
              ? t.rollBonus
              : t.follow;

    return (
      <section className={css.dock} aria-labelledby="snakes-stop-title" data-kind="stop">
        <div className={css.verdict} data-ok={good ? '' : undefined} data-kind={good ? undefined : 'miss'}>
          <p id="snakes-stop-title" className={css['verdict-title']}>
            <SnakesIcon name={STOP_ICON[stop.kind]} />
            {text.title}
            {stop.points > 0 && <span className={css.points}>+{stop.points}</span>}
          </p>
          <p className={css['verdict-hint']}>{hint}</p>
        </div>

        <div className={css.actions}>
          <button ref={nextRef} type="button" className={css.btn} onClick={onNext}>
            <SnakesIcon name="arrow" />
            {label}
          </button>
        </div>
      </section>
    );
  }

  if (phase === 'moving') {
    return (
      <div className={css.dock} data-kind="moving">
        {dieNode}
        <p className={css['dock-text']}>{t.live.moving}</p>
      </div>
    );
  }

  return (
    <section className={css.dock} aria-labelledby="snakes-roll-title" data-kind="roll">
      {dieNode}

      <div className={css['dock-body']}>
        <h3 id="snakes-roll-title" className={css['dock-title']}>
          {bonus ? t.bonusTitle : t.rollTitle}
        </h3>
        <p className={css['dock-text']}>{bonus ? t.bonusText : t.rollText}</p>
      </div>

      <button
        ref={rollRef}
        type="button"
        className={css.btn}
        onClick={onRoll}
        disabled={phase === 'rolling'}
        aria-disabled={phase === 'rolling'}
      >
        {phase === 'rolling' ? t.rolling : bonus ? t.rollBonus : t.roll}
      </button>
    </section>
  );
};
