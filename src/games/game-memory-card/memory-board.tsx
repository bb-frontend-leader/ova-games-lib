import { Card } from './card';
import { i18n } from './lib/constant';
import { useMemoryActivityContext } from './memory-card-context';

import css from './memory-card.module.css';

interface BoardProps {
  background?: string;
  addClass?: string;
}

export const MemoryBoard = ({ background, addClass }: BoardProps) => {
  const { cards, handleCardClick, lang, moves, done, message, boardRef, fxRef } = useMemoryActivityContext();
  const t = i18n[lang];

  const total = cards.length;
  const pairs = total / 2;
  const found = cards.filter((card) => card.matched).length / 2;

  return (
    <div ref={boardRef} className={css.board}>
      {/* Marcador: parejas encontradas e intentos */}
      <div className={css.hud} role="group" aria-label={t.board}>
        <div className={css['hud-cell']}>
          <span className={css['hud-label']}>{t.pairs}</span>
          <span className={css['sr-only']}>
            {found}/{pairs}
          </span>
          <span className={css.pips} aria-hidden="true">
            {Array.from({ length: pairs }, (_, i) => (
              <span key={i} className={css.pip} data-on={i < found || undefined} />
            ))}
          </span>
        </div>

        {done && (
          <p className={css['all-found']} aria-hidden="true">
            {t.allFound}
          </p>
        )}

        <div className={css['hud-cell']}>
          <span className={css['hud-label']}>{t.tries}</span>
          <span className={css['hud-value']}>{moves}</span>
        </div>
      </div>

      <div
        style={background ? { backgroundImage: `url(${background})` } : undefined}
        className={`${css.container} u-grid u-p-2 ${addClass ?? ''}`}
      >
        {cards.map((card, index) => (
          <Card card={card} key={index} index={index} total={total} handleCardClick={() => handleCardClick(index)} />
        ))}
      </div>

      <p className={css['sr-only']} role="status">
        {message}
      </p>

      {/* Capa de efectos: destellos y ondas sobre las cartas */}
      <div className={css.fx} ref={fxRef} aria-hidden="true" />
    </div>
  );
};
