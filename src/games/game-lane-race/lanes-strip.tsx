import { useLang } from '@/hooks';

import { LanesCar } from './lanes-car';
import { LanesIcon } from './lanes-icons';
import { i18n, NITRO_BONUS, PLAYER_COLOR, RIVALS } from './lib/constant';

import css from './game-lane-race.module.css';

interface Props {
  /** Preguntas acertadas y turbos del jugador. */
  solved: number;
  nitros: number;
  rivals: number[];
  total: number;
}

/**
 * Marcador de la carrera: una pista fina por coche con su avance, de la salida a la meta. Es una imagen de apoyo: la
 * misma información va en texto para lectores de pantalla.
 */
export const LanesStrip: React.FC<Props> = ({ solved, nitros, rivals, total }) => {
  const lang = useLang();
  const t = i18n[lang];

  const you = solved + nitros * NITRO_BONUS;
  const cars = [
    { id: 'you', name: t.you, color: PLAYER_COLOR, progress: you },
    ...rivals.map((progress, i) => ({ id: `rival-${i}`, name: t.rivalName(i + 1), color: RIVALS[i].color, progress }))
  ];

  return (
    <div className={css.strip}>
      <div className={css['strip-ends']} aria-hidden="true">
        <span />
        <span className={css['strip-ends-lane']}>
          <span>{t.strip.start}</span>
          <span>
            <LanesIcon name="flag" /> {t.strip.goal}
          </span>
        </span>
      </div>

      <ul className={css['strip-list']} aria-label={t.strip.label}>
        {cars.map((car) => {
          const p = Math.min(car.progress / total, 1) * 100;

          return (
            <li key={car.id} className={css['strip-row']} data-you={car.id === 'you' ? '' : undefined}>
              <span className={css['strip-name']}>{car.name}</span>
              <span className={css['strip-lane']} aria-hidden="true">
                <LanesCar className={css['strip-car']} color={car.color} style={{ '--p': p } as React.CSSProperties} />
              </span>
              <span className="u-sr-only">{t.strip.car(car.name, t.strip.tramos(car.progress, total))}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
