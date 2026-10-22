import { useLang } from '@/hooks';

import { EscapeNotes } from './escape-notes';
import { i18n } from './lib/constant';

import type { Obj } from './types/types';

import css from './game-escape-room.module.css';

interface Props {
  room: number;
  objs: Obj[];
}

/**
 * El panel de cuando toca elegir objeto: el nombre de la sala, cómo se juega y la libreta con lo descubierto.
 */
export const EscapeGuide: React.FC<Props> = ({ room, objs }) => {
  const lang = useLang();
  const t = i18n[lang];

  return (
    <section className={css.card} aria-labelledby="escape-guide-title">
      <h3 id="escape-guide-title" className={css['guide-title']}>
        {t.rooms[room % t.rooms.length]}
      </h3>

      <p className={css['guide-text']}>{t.guide.text}</p>

      <EscapeNotes objs={objs} />
    </section>
  );
};
