import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import type { IconName } from './lib/icons';
import { MinesIcon } from './mines-icons';

import type { MineEvent } from './types/types';

import css from './game-minesweeper.module.css';

interface Props {
  /** Lo último que pasó al pisar una mina; el lector de pantalla ya lo oye por la región de estado. */
  event: MineEvent | null;
}

/**
 * El panel de cuando toca elegir casilla: cómo se juega, la leyenda de los iconos y, si acaba de explotar
 * una mina, qué pasó.
 */
export const MinesGuide: React.FC<Props> = ({ event }) => {
  const lang = useLang();
  const t = i18n[lang].guide;

  const legend: { icon: IconName; text: string }[] = [
    { icon: 'flag', text: t.flag },
    { icon: 'shield', text: t.shield },
    { icon: 'radar', text: t.radar }
  ];

  return (
    <section className={css.card} aria-labelledby="mines-guide-title">
      <h3 id="mines-guide-title" className={css['guide-title']}>
        {t.title}
      </h3>

      {event && (
        <p className={css.boom} data-kind={event.kind} aria-hidden="true">
          <MinesIcon name={event.kind === 'shielded' ? 'shield' : 'mine'} />
          {event.kind === 'shielded' ? t.shielded : event.points ? t.boom(event.points) : t.boomNone}
        </p>
      )}

      <p className={css['guide-text']}>{t.text}</p>

      <ul className={css.legend}>
        <li>
          <span className={css['legend-icon']} data-n="2" aria-hidden="true">
            2
          </span>
          {t.number}
        </li>
        {legend.map(({ icon, text }) => (
          <li key={icon}>
            <MinesIcon name={icon} className={css['legend-icon']} />
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
};
