import { useLang } from '@/hooks';

import { EscapeIcon } from './escape-icons';
import { i18n } from './lib/constant';

import type { Obj } from './types/types';

import css from './game-escape-room.module.css';

type View = 'locked' | 'review' | 'open' | 'current';

/** Columnas de la rejilla de objetos: las flechas arriba y abajo saltan esta cantidad. */
const COLUMNS = 2;

interface Props {
  /** Sala que se dibuja (cambia el color de las paredes) y su nombre. */
  room: number;
  /** Los objetos de la sala. */
  objs: Obj[];
  /** Objetos cuya pregunta se falló y siguen por repasar, y el que se está respondiendo. */
  review?: number[];
  current?: number | null;
  /** Solo se puede pulsar un objeto cuando toca elegir. */
  interactive?: boolean;
  /** Dígitos escritos en la puerta (los huecos que faltan salen vacíos). */
  entry?: number[];
  /** La puerta ya está abierta. */
  opened?: boolean;
  label: string;
  onPress?: (id: number) => void;
  doorRef?: React.Ref<HTMLDivElement>;
}

/**
 * La sala: las paredes con los objetos que se pueden abrir y, a un lado, la puerta con los huecos del código.
 * Solo dibuja: quien lo usa decide qué pasa al pulsar un objeto.
 */
export const EscapeScene: React.FC<Props> = ({
  room,
  objs,
  review = [],
  current = null,
  interactive = false,
  entry = [],
  opened = false,
  label,
  onPress,
  doorRef
}) => {
  const lang = useLang();
  const t = i18n[lang];

  const viewOf = (obj: Obj): View => {
    if (obj.open) return 'open';
    if (current === obj.id) return 'current';

    return review.includes(obj.id) ? 'review' : 'locked';
  };

  const describe = (obj: Obj, view: View) => {
    const status = view === 'open' ? t.obj.open(obj.slot, obj.digit) : view === 'review' ? t.obj.review : t.obj.locked;

    return `${t.objects[obj.icon]}: ${status}`;
  };

  const move = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -COLUMNS, ArrowDown: COLUMNS }[event.key];

    if (!step) return;

    const next = index + step;

    if (next < 0 || next >= objs.length) return;

    event.preventDefault();
    event.currentTarget.closest('[data-objects]')?.querySelector<HTMLElement>(`[data-obj="${objs[next].id}"]`)?.focus();
  };

  return (
    <div className={css.scene} data-theme={room % 3} role="group" aria-label={label}>
      <div data-objects="" className={css.objects}>
        {objs.map((obj, index) => {
          const view = viewOf(obj);

          return (
            <button
              key={obj.id}
              type="button"
              className={css.obj}
              data-obj={obj.id}
              data-view={view}
              disabled={!interactive}
              aria-disabled={interactive && obj.open ? true : undefined}
              aria-label={describe(obj, view)}
              onClick={onPress && interactive ? () => onPress(obj.id) : undefined}
              onKeyDown={interactive ? (event) => move(event, index) : undefined}
            >
              <span aria-hidden="true" className={css['obj-face']}>
                <EscapeIcon name={obj.icon} className={css['obj-icon']} />
                <span className={css['obj-name']}>{t.objects[obj.icon]}</span>
              </span>

              <span aria-hidden="true" className={css['obj-badge']} data-open={obj.open ? '' : undefined}>
                {obj.open ? (
                  <>
                    <span className={css['badge-slot']}>{obj.slot}</span>
                    {obj.digit}
                  </>
                ) : (
                  <EscapeIcon name="lock" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div ref={doorRef} className={css.door} data-state={opened ? 'open' : 'locked'}>
        <span className="u-sr-only">
          {t.door.label}: {opened ? t.door.open : t.door.locked}
        </span>

        <span aria-hidden="true" className={css['door-light']} />

        <ol className={css['door-code']} aria-hidden="true">
          {objs.map((obj, k) => (
            <li key={obj.id} className={css['door-slot']} data-filled={entry[k] !== undefined ? '' : undefined}>
              {entry[k] ?? ''}
            </li>
          ))}
        </ol>

        <span aria-hidden="true" className={css['door-leaf']}>
          <EscapeIcon name={opened ? 'unlock' : 'door'} />
        </span>
      </div>
    </div>
  );
};
