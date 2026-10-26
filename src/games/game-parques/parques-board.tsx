import {
  ARM,
  COLOR_OF,
  COLORS,
  HOME,
  houseOrigin,
  LANE,
  MID,
  percentOf,
  pointOf,
  RING,
  SAFE,
  SIZE,
  slotIn,
  START
} from './lib/layout';
import { ParquesIcon } from './parques-icons';

import type { Color, Option, Piece } from './types/types';

import css from './game-parques.module.css';

interface Tile {
  x: number;
  y: number;
  /** Casilla del circuito o del pasillo de color hacia el cielo. */
  kind: 'ring' | 'lane';
  color?: Color;
  safe: boolean;
  /** Salida de un color. */
  start: boolean;
}

/** Casillas del tablero, calculadas una vez: el circuito, sus seguros y salidas, y los cuatro pasillos. */
const TILES: Tile[] = [
  ...RING.map<Tile>(({ x, y }, i) => {
    const color = COLORS.find((c) => START[c] === i);

    return { x, y, kind: 'ring', color, safe: SAFE.has(i), start: color !== undefined };
  }),
  ...Array.from({ length: LANE }, (_, k): Tile[] => [
    { x: MID, y: 1 + k, kind: 'lane', color: 'red', safe: false, start: false },
    { x: SIZE - 2 - k, y: MID, kind: 'lane', color: 'green', safe: false, start: false },
    { x: MID, y: SIZE - 2 - k, kind: 'lane', color: 'yellow', safe: false, start: false },
    { x: 1 + k, y: MID, kind: 'lane', color: 'blue', safe: false, start: false }
  ]).flat()
];

/** Desplazamientos (en tamaños de ficha) para que varias fichas en una misma casilla se vean todas. */
const STACK: [number, number][] = [
  [-0.24, -0.24],
  [0.24, 0.24],
  [0.24, -0.24],
  [-0.24, 0.24]
];

interface Props {
  pieces: Piece[];
  label: string;
  /** Jugadas posibles del jugador: sus fichas se pueden pulsar y se marca a dónde llegarían. */
  options?: Option[];
  pieceLabel: (piece: Piece, option?: Option) => string;
  onPick?: (option: number) => void;
}

/**
 * El tablero de parqués en forma de cruz: cuatro cárceles en las esquinas, el circuito (con salidas y seguros), los
 * pasillos de color y el cielo en el centro. Las fichas se colocan encima con `left` y `top` en %, y el juego las
 * mueve con GSAP; si hay jugadas posibles, las fichas del jugador son botones.
 */
export const ParquesBoard: React.FC<Props> = ({ pieces, label, options = [], pieceLabel, onPick }) => {
  // Fichas que comparten casilla se reparten en pequeño; las de la cárcel y las del cielo nunca se apilan en sus huecos
  const groups = new Map<string, number[]>();

  pieces.forEach((piece, k) => {
    const at = pointOf(piece.side, piece.p, piece.n);
    const key = piece.p < 0 ? `jail-${piece.side}-${piece.n}` : `${at.x},${at.y}`;

    groups.set(key, [...(groups.get(key) ?? []), k]);
  });

  return (
    <div className={css.board} role="group" aria-label={label} style={{ '--size': SIZE } as React.CSSProperties}>
      {COLORS.map((color) => {
        const origin = houseOrigin(color);
        const active = color === 'yellow' || color === 'red';

        return (
          <div
            key={color}
            className={css.house}
            data-color={color}
            data-idle={active ? undefined : ''}
            style={{ gridArea: `${origin.y + 1} / ${origin.x + 1} / span ${ARM} / span ${ARM}` }}
            aria-hidden="true"
          >
            {active &&
              pieces
                .filter((piece) => COLOR_OF[piece.side] === color)
                .map((piece) => {
                  const slot = slotIn(color, piece.n);

                  return (
                    <span
                      key={piece.n}
                      className={css.slot}
                      style={{
                        left: `${((slot.x - origin.x) / ARM) * 100}%`,
                        top: `${((slot.y - origin.y) / ARM) * 100}%`
                      }}
                    />
                  );
                })}
          </div>
        );
      })}

      {TILES.map(({ x, y, kind, color, safe, start }) => (
        <div
          key={`${x}-${y}`}
          className={css.tile}
          data-kind={kind}
          data-color={color}
          data-safe={safe ? '' : undefined}
          data-start={start ? '' : undefined}
          style={{ gridArea: `${y + 1} / ${x + 1}` }}
          aria-hidden="true"
        >
          {safe && <ParquesIcon name="star" className={css['tile-star']} />}
        </div>
      ))}

      {/* El centro: el cielo, un triángulo por color */}
      <svg
        className={css.core}
        viewBox="0 0 3 3"
        style={{ gridArea: `${ARM + 1} / ${ARM + 1} / span 3 / span 3` }}
        aria-hidden="true"
        focusable="false"
      >
        <polygon points="0,0 3,0 1.5,1.5" data-color="red" />
        <polygon points="3,0 3,3 1.5,1.5" data-color="green" />
        <polygon points="0,3 3,3 1.5,1.5" data-color="yellow" />
        <polygon points="0,0 0,3 1.5,1.5" data-color="blue" />
        <circle cx="1.5" cy="1.5" r="0.28" className={css['core-dot']} />
      </svg>

      {options.map((option) => {
        const piece = pieces[option.piece];
        const at = percentOf(pointOf(piece.side, option.to, piece.n));

        return (
          <span
            key={`ghost-${option.piece}`}
            className={css.ghost}
            data-capture={option.captures.length ? '' : undefined}
            data-home={option.home ? '' : undefined}
            style={at}
            aria-hidden="true"
          >
            {option.captures.length > 0 && <ParquesIcon name="target" />}
            {option.home && <ParquesIcon name="star" />}
          </span>
        );
      })}

      {pieces.map((piece, k) => {
        const at = pointOf(piece.side, piece.p, piece.n);
        const key = piece.p < 0 ? `jail-${piece.side}-${piece.n}` : `${at.x},${at.y}`;
        const group = groups.get(key) ?? [k];
        const slot = group.length > 1 ? STACK[group.indexOf(k) % STACK.length] : [0, 0];
        const optionIndex = options.findIndex((option) => option.piece === k);
        const option = options[optionIndex];
        const style = {
          ...percentOf(at),
          '--ox': slot[0],
          '--oy': slot[1],
          '--ps': group.length > 1 ? 0.78 : 1
        } as React.CSSProperties;
        const data = {
          'data-piece': `${piece.side}-${piece.n}`,
          'data-color': COLOR_OF[piece.side],
          'data-home': piece.p >= HOME ? '' : undefined,
          'data-movable': option ? '' : undefined
        };
        const body = <span className={css['piece-body']}>{piece.n + 1}</span>;

        return option && onPick ? (
          <button
            key={`${piece.side}-${piece.n}`}
            type="button"
            className={css.piece}
            style={style}
            aria-label={pieceLabel(piece, option)}
            onClick={() => onPick(optionIndex)}
            {...data}
          >
            {body}
          </button>
        ) : (
          <span
            key={`${piece.side}-${piece.n}`}
            className={css.piece}
            style={style}
            role="img"
            aria-label={pieceLabel(piece)}
            {...data}
          >
            {body}
          </span>
        );
      })}
    </div>
  );
};
