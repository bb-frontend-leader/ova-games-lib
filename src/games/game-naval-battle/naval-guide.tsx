import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import type { IconName } from './lib/icons';
import { NavalIcon } from './naval-icons';

import type { Ping } from './types/types';

import css from './game-naval-battle.module.css';

interface Props {
  /** El sonar está armado: el próximo toque escanea en lugar de disparar. */
  pingMode: boolean;
  /** Lo último que dijo el sonar; el lector de pantalla ya lo oye por la región de estado. */
  ping: Ping | null;
}

/**
 * El panel de cuando toca apuntar: cómo se dispara, el aviso del sonar si lo hay y la leyenda del mar.
 */
export const NavalGuide: React.FC<Props> = ({ pingMode, ping }) => {
  const lang = useLang();
  const t = i18n[lang].guide;

  const legend: { icon: IconName | null; kind: string; text: string }[] = [
    { icon: 'drop', kind: 'miss', text: t.legend.miss },
    { icon: 'flame', kind: 'hit', text: t.legend.hit },
    { icon: 'ship', kind: 'sunk', text: t.legend.sunk },
    { icon: null, kind: 'ping', text: t.legend.ping }
  ];

  return (
    <section className={css.card} aria-labelledby="naval-guide-title">
      <h3 id="naval-guide-title" className={css['guide-title']}>
        {pingMode ? t.pingTitle : t.title}
      </h3>

      {ping && !pingMode && (
        <p className={css.boom} data-kind="ping" aria-hidden="true">
          <NavalIcon name="radar" />
          {t.pinged(ping.near)}
        </p>
      )}

      <p className={css['guide-text']}>{pingMode ? t.pingText : t.text}</p>

      <ul className={css.legend}>
        {legend.map(({ icon, kind, text }) => (
          <li key={kind}>
            <span className={css['legend-icon']} data-kind={kind} aria-hidden="true">
              {icon ? <NavalIcon name={icon} /> : 2}
            </span>
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
};
