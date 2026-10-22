import { useLang } from '@/hooks';

import { EscapeIcon } from './escape-icons';
import { EscapeNotes } from './escape-notes';
import { i18n } from './lib/constant';

import type { Obj } from './types/types';

import css from './game-escape-room.module.css';

interface Props {
  objs: Obj[];
  /** Dígitos escritos hasta ahora. */
  entry: number[];
  headingRef: React.Ref<HTMLHeadingElement>;
  onDigit: (digit: number) => void;
  onErase: () => void;
  onOpen: () => void;
}

/**
 * El teclado de la puerta, con la libreta al lado para leer los dígitos. Además de los botones, acepta el teclado
 * del ordenador: los números escriben, Retroceso borra y Intro abre.
 */
export const EscapeDoor: React.FC<Props> = ({ objs, entry, headingRef, onDigit, onErase, onOpen }) => {
  const lang = useLang();
  const t = i18n[lang].keypad;
  const full = entry.length === objs.length;

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (/^\d$/.test(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      onDigit(Number(event.key));
    } else if (event.key === 'Backspace') {
      event.preventDefault();
      onErase();
    }
  };

  return (
    <section className={css.card} aria-labelledby="escape-door-title" onKeyDown={onKeyDown}>
      <h3 id="escape-door-title" ref={headingRef} tabIndex={-1} className={css['guide-title']}>
        {t.title}
      </h3>

      <p className={css['guide-text']}>{t.text}</p>

      <EscapeNotes objs={objs} />

      <p className={css.typed} aria-hidden="true">
        {objs.map((obj, k) => (
          <span key={obj.id} className={css['typed-digit']} data-filled={entry[k] !== undefined ? '' : undefined}>
            {entry[k] ?? '·'}
          </span>
        ))}
      </p>

      <div role="group" aria-label={t.label} className={css.keypad}>
        {Array.from({ length: 10 }, (_, k) => (k + 1) % 10).map((digit) => (
          <button
            key={digit}
            type="button"
            className={css.key}
            aria-label={t.digit(digit)}
            disabled={full}
            onClick={() => onDigit(digit)}
          >
            {digit}
          </button>
        ))}

        <button type="button" className={css.key} data-wide="" disabled={!entry.length} onClick={onErase}>
          {t.erase}
        </button>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.btn} disabled={!full} onClick={onOpen}>
          <EscapeIcon name="unlock" />
          {t.open}
        </button>
      </div>
    </section>
  );
};
