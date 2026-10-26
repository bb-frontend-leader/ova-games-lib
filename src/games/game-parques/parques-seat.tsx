import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import type { IconName } from './lib/icons';
import { COLOR_OF, HOME } from './lib/layout';
import { ParquesDie } from './parques-die';
import { ParquesIcon } from './parques-icons';

import type { Piece, Roll, Side } from './types/types';

import css from './game-parques.module.css';

interface Props {
  side: Side;
  /** Solo las fichas de este lado. */
  pieces: Piece[];
  dice: Roll;
  /** Es su turno. */
  active: boolean;
  children: React.ReactNode;
}

const PLACE_ICON = { jail: 'lock', home: 'star', road: 'flag' } as const satisfies Record<string, IconName>;

const placeOf = (piece: Piece) => (piece.p < 0 ? 'jail' : piece.p >= HOME ? 'home' : 'road');

/**
 * El asiento de un jugador, frente a frente en la mesa: quién es, dónde está cada una de sus fichas, sus dados y, a la
 * derecha, lo que toca hacer (el rival solo cuenta lo que hace; el jugador tiene aquí los botones).
 */
export const ParquesSeat: React.FC<Props> = ({ side, pieces, dice, active, children }) => {
  const lang = useLang();
  const t = i18n[lang];
  const rolled = dice.a > 0;

  return (
    <section
      className={css.seat}
      data-side={side}
      data-color={COLOR_OF[side]}
      data-active={active ? '' : undefined}
      aria-label={side === 'you' ? t.youName : t.rivalName}
    >
      <div className={css['seat-id']}>
        <span className={css['seat-name']}>
          <span className={css['seat-token']} aria-hidden="true">
            <ParquesIcon name="pawn" />
          </span>
          {side === 'you' ? t.youName : t.rivalName}
        </span>

        <ul className={css['seat-pieces']}>
          {pieces.map((piece) => (
            <li key={piece.n} className={css['seat-piece']} data-place={placeOf(piece)}>
              <span aria-hidden="true" className={css['seat-dot']}>
                {piece.n + 1}
              </span>
              <ParquesIcon name={PLACE_ICON[placeOf(piece)]} />
              <span className="u-sr-only">{t.piece(piece.n + 1, t.place[placeOf(piece)])}</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className={css.dice}
        data-dice={side}
        role="img"
        aria-label={rolled ? t.dieLabel(dice.a, dice.b) : t.dieIdle}
      >
        <ParquesDie face={dice.a} />
        <ParquesDie face={dice.b} />
      </div>

      <div className={css['seat-body']}>{children}</div>
    </section>
  );
};
