import {
  hasChest,
  islandKind,
  type MapLayout,
  type Point,
  PORT,
  PORT_ART,
  routePath,
  TREASURE,
  TREASURE_ART
} from './lib/layout';
import { CompassRose, IslandArt, PortArt, ShipArt, TreasureArt } from './treasure-art';
import { TreasureIcon } from './treasure-icons';

import type { Phase } from './types/types';

import css from './game-treasure-map.module.css';

interface Labels {
  map: string;
  port: string;
  treasure: string;
  ship: string;
  island: (n: number) => string;
  state: { visited: string; open: string; locked: string; chest: string };
}

interface Props {
  mapRef: React.Ref<HTMLDivElement>;
  shipRef: React.Ref<HTMLDivElement>;
  layout: MapLayout;
  /** Ids de las islas (las preguntas) en orden: el número de la isla es su posición más uno. */
  ids: string[];
  names: string[];
  visited: string[];
  /** Islas con ruta abierta, a las que se puede navegar. */
  open: string[];
  target: string | null;
  at: string;
  face: 1 | -1;
  phase: Phase;
  wide: boolean;
  labels: Labels;
  onChoose: (id: string) => void;
}

const pos = (p: Point): React.CSSProperties => ({ left: `${p.x * 100}%`, top: `${p.y * 100}%` });
const place = (layout: MapLayout, id: string) => pos(layout.points[id]);

/**
 * El mapa: un mar con las rutas, las islas (botones: solo las de ruta abierta se pueden elegir), el puerto, la isla del
 * tesoro y el barco. Las posiciones son porcentajes del mapa, así que las rutas, las islas y el barco coinciden a
 * cualquier tamaño.
 */
export const TreasureMap: React.FC<Props> = ({
  mapRef,
  shipRef,
  layout,
  ids,
  names,
  visited,
  open,
  target,
  at,
  face,
  phase,
  wide,
  labels,
  onChoose
}) => {
  const known = new Set([PORT, ...visited]);
  const finale = phase === 'finale' || phase === 'done';
  const last = visited[visited.length - 1] ?? PORT;

  return (
    <div
      ref={mapRef}
      className={css.sea}
      style={{ '--scale': ids.length > 14 ? 0.75 : ids.length > 10 ? 0.9 : 1 } as React.CSSProperties}
      data-map=""
      data-wide={wide ? '' : undefined}
      role="group"
      aria-label={labels.map}
    >
      <svg className={css.routes} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {layout.edges.map(([a, b]) => {
          const state = known.has(a) && known.has(b) ? 'sailed' : known.has(a) !== known.has(b) ? 'open' : 'faint';

          return <path key={`${a}-${b}`} d={routePath(layout, a, b)} className={css.route} data-state={state} />;
        })}
        {finale && (
          <path
            d={routePath(layout, last, TREASURE)}
            className={css.route}
            data-state={phase === 'done' ? 'sailed' : 'open'}
          />
        )}
      </svg>

      <CompassRose />

      <div className={css.port} style={pos(PORT_ART)} role="img" aria-label={labels.port}>
        <PortArt />
        <span className={css['place-name']}>{labels.port}</span>
      </div>

      <div
        className={css.treasure}
        data-treasure=""
        style={pos(TREASURE_ART)}
        data-lit={finale ? '' : undefined}
        data-open={phase === 'done' ? '' : undefined}
        role="img"
        aria-label={labels.treasure}
      >
        <TreasureArt />
        <span className={css['place-name']}>{labels.treasure}</span>
      </div>

      {ids.map((id, k) => {
        const isVisited = visited.includes(id);
        const isOpen = open.includes(id);
        const chest = hasChest(id);
        const state = isVisited ? 'visited' : isOpen ? 'open' : 'locked';

        return (
          <button
            key={id}
            type="button"
            className={css.island}
            style={place(layout, id)}
            data-island={id}
            data-state={state}
            data-target={target === id ? '' : undefined}
            disabled={phase !== 'route' || !isOpen}
            onClick={() => onChoose(id)}
          >
            <IslandArt kind={islandKind(id)} visited={isVisited} />
            <span className={css['island-num']} aria-hidden="true">
              {k + 1}
            </span>
            {chest && (
              <TreasureIcon name="chest" className={css['island-chest']} data-done={isVisited ? '' : undefined} />
            )}
            <span className={css['island-name']}>
              <span className="u-sr-only">{labels.island(k + 1)}: </span>
              {names[k]}
              <span className="u-sr-only">
                {' '}
                ({labels.state[state]}
                {chest ? `, ${labels.state.chest}` : ''})
              </span>
            </span>
          </button>
        );
      })}

      <div
        ref={shipRef}
        className={css.ship}
        style={place(layout, at)}
        data-ship=""
        data-face={face}
        data-sailing={phase === 'sailing' || phase === 'finale' ? '' : undefined}
        role="img"
        aria-label={labels.ship}
      >
        <ShipArt />
      </div>

      <div className={css.storm} aria-hidden="true">
        <svg viewBox="0 0 40 60" className={css.bolt}>
          <path
            d="M26 0 6 34h12l-4 26L36 22H23Z"
            fill="#fff3a0"
            stroke="#ffd24a"
            strokeWidth="1.500"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
