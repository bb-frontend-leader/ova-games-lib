import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import type { IconName } from './lib/icons';
import { ParquesIcon } from './parques-icons';

import type { Option, Phase, Piece, Roll, Side, Stop } from './types/types';

import css from './game-parques.module.css';

const STOP_ICON: Record<Stop['kind'], IconName> = {
  capture: 'target',
  captured: 'lock',
  home: 'star',
  rivalHome: 'flag',
  stuck: 'lock'
};

interface Props {
  phase: Phase;
  turn: Side;
  bonus: boolean;
  /** Intentos de salir de la cárcel ya gastados en este turno. */
  tries: number;
  roll: Roll;
  pieces: Piece[];
  options: Option[];
  stop: Stop | null;
  rollRef: React.Ref<HTMLButtonElement>;
  nextRef: React.Ref<HTMLButtonElement>;
  firstPickRef: React.Ref<HTMLButtonElement>;
  onRoll: () => void;
  onNext: () => void;
  onPick: (option: number) => void;
}

/**
 * Lo que toca hacer al jugador en su asiento: esperar la pregunta, tirar los dados, elegir ficha, ver cómo avanza o
 * leer una parada (captura, cielo…) con su botón de seguir. Mientras juega el rival solo dice de quién es el turno.
 */
export const ParquesDock: React.FC<Props> = ({
  phase,
  turn,
  bonus,
  tries,
  roll,
  pieces,
  options,
  stop,
  rollRef,
  nextRef,
  firstPickRef,
  onRoll,
  onNext,
  onPick
}) => {
  const lang = useLang();
  const t = i18n[lang];

  if (phase === 'stop' && stop) {
    const text = t.stops[stop.kind];
    const tone = stop.kind === 'capture' || stop.kind === 'home' ? 'ok' : stop.kind === 'captured' ? 'ko' : 'miss';

    return (
      <div className={css['dock-stop']}>
        <div
          className={css.verdict}
          data-ok={tone === 'ok' ? '' : undefined}
          data-kind={tone === 'miss' ? 'miss' : undefined}
        >
          <p className={css['verdict-title']}>
            <ParquesIcon name={STOP_ICON[stop.kind]} />
            {text.title}
            {stop.points > 0 && <span className={css.points}>+{stop.points}</span>}
          </p>
          <p className={css['verdict-hint']}>{text.text}</p>
        </div>

        <button ref={nextRef} type="button" className={css.btn} onClick={onNext}>
          <ParquesIcon name="arrow" />
          {stop.again ? t.rollBonus : t.follow}
        </button>
      </div>
    );
  }

  if (turn === 'rival' && phase !== 'question' && phase !== 'checked' && phase !== 'done') {
    return (
      <div className={css['dock-body']}>
        <h3 className={css['dock-title']}>{t.live.rival}</h3>
        <p className={css['dock-text']}>{t.rival.moving}</p>
      </div>
    );
  }

  if (phase === 'roll' || phase === 'rolling') {
    const retry = tries > 0;

    return (
      <div className={css['dock-roll']}>
        <div className={css['dock-body']}>
          <h3 className={css['dock-title']}>{retry ? t.stuckTitle : bonus ? t.bonusTitle : t.rollTitle}</h3>
          <p className={css['dock-text']}>{retry ? t.stuckText(tries) : bonus ? t.bonusText : t.rollText}</p>
        </div>

        <button
          ref={rollRef}
          type="button"
          className={css.btn}
          onClick={onRoll}
          disabled={phase === 'rolling'}
          aria-disabled={phase === 'rolling'}
        >
          <ParquesIcon name="dice" />
          {phase === 'rolling' ? t.rolling : bonus || retry ? t.rollBonus : t.roll}
        </button>
      </div>
    );
  }

  if (phase === 'choose') {
    return (
      <div className={css['dock-body']}>
        <h3 className={css['dock-title']}>{t.chooseTitle}</h3>
        <p className={css['dock-text']}>{t.chooseText(roll.a + roll.b)}</p>

        <ul className={css.picks}>
          {options.map((option, k) => {
            const piece = pieces[option.piece];
            const steps = option.to - piece.p;
            const hint = [
              option.exit ? t.option.exit : t.option.move(steps),
              option.captures.length ? t.option.capture : '',
              option.home ? t.option.home : ''
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <li key={option.piece}>
                <button
                  ref={k === 0 ? firstPickRef : undefined}
                  type="button"
                  className={css.pick}
                  data-capture={option.captures.length ? '' : undefined}
                  onClick={() => onPick(k)}
                >
                  <span className={css['seat-dot']} aria-hidden="true">
                    {piece.n + 1}
                  </span>
                  <span>
                    {t.piece(piece.n + 1, '')}
                    {hint}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  if (phase === 'moving') {
    return (
      <div className={css['dock-body']}>
        <p className={css['dock-text']}>{t.live.moving}</p>
      </div>
    );
  }

  return (
    <div className={css['dock-body']}>
      <h3 className={css['dock-title']}>{t.wait.title}</h3>
      <p className={css['dock-text']}>{t.wait.text}</p>
    </div>
  );
};
