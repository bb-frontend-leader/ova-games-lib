import { useLang } from '@/hooks';

import { EscapeIcon } from './escape-icons';
import { i18n } from './lib/constant';

import type { Obj } from './types/types';

import css from './game-escape-room.module.css';

interface Props {
  /** Los objetos de la sala actual: de cada uno se apunta el dígito en cuanto se abre. */
  objs: Obj[];
}

/**
 * La libreta: una línea por posición del código, con el dígito si ya se descubrió o «sin descubrir».
 * Va ordenada por posición para poder copiar el código tal cual.
 */
export const EscapeNotes: React.FC<Props> = ({ objs }) => {
  const lang = useLang();
  const t = i18n[lang];
  const sorted = [...objs].sort((a, b) => a.slot - b.slot);

  return (
    <div className={css.notes}>
      <h4 className={css['notes-title']}>
        <EscapeIcon name="note" />
        {t.guide.notes}
      </h4>

      <ul className={css['notes-list']}>
        {sorted.map((obj) => (
          <li key={obj.id} className={css['notes-item']} data-open={obj.open ? '' : undefined}>
            <span className={css['notes-slot']}>{t.guide.slot(obj.slot)}</span>
            <strong className={css['notes-digit']}>{obj.open ? obj.digit : '?'}</strong>
            {!obj.open && <span className="u-sr-only">{t.guide.unknown}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};
