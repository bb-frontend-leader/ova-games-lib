import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { centerOf, gridOf, pawnAt, tileAt } from './lib/layout';
import { SnakesIcon } from './snakes-icons';

import type { CellKind, Link } from './types/types';

import css from './game-snakes-ladders.module.css';

const SNAKE_SKINS = [
  { body: '#2e9e5b', edge: '#14532d' },
  { body: '#e07b2a', edge: '#6b2f05' },
  { body: '#8a4fc7', edge: '#3b1a63' },
  { body: '#d6455d', edge: '#5e1020' },
  { body: '#2c8fbf', edge: '#0c3a52' }
];

interface DrawProps {
  link: Link;
  goal: number;
  index: number;
}

/** Escalera: dos largueros de madera entre el pie y el extremo, con peldaños cada poco. */
const Ladder: React.FC<DrawProps> = ({ link, goal }) => {
  const a = centerOf(link.from, goal);
  const b = centerOf(link.to, goal);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const u = { x: dx / len, y: dy / len };
  const n = { x: -u.y, y: u.x };
  const off = 0.14;
  const rungs = Math.max(2, Math.floor(len / 0.42));
  const at = (t: number, side: number) => ({
    x: a.x + dx * t + n.x * off * side,
    y: a.y + dy * t + n.y * off * side
  });

  return (
    <g strokeLinecap="round">
      {[-1, 1].map((side) => (
        <line
          key={side}
          x1={at(0, side).x}
          y1={at(0, side).y}
          x2={at(1, side).x}
          y2={at(1, side).y}
          stroke="#6b3f17"
          strokeWidth={0.1}
        />
      ))}
      {Array.from({ length: rungs }, (_, k) => {
        const t = (k + 1) / (rungs + 1);

        return (
          <line
            key={k}
            x1={at(t, -1).x}
            y1={at(t, -1).y}
            x2={at(t, 1).x}
            y2={at(t, 1).y}
            stroke="#a8702f"
            strokeWidth={0.07}
          />
        );
      })}
      {[-1, 1].map((side) => (
        <line
          key={`l${side}`}
          x1={at(0, side).x}
          y1={at(0, side).y}
          x2={at(1, side).x}
          y2={at(1, side).y}
          stroke="#c98d46"
          strokeWidth={0.04}
        />
      ))}
    </g>
  );
};

/** Serpiente: cuerpo ondulado de la cabeza (arriba) a la cola (abajo), con dibujo en el lomo, ojos y lengua. */
const Snake: React.FC<DrawProps> = ({ link, goal, index }) => {
  const head = centerOf(link.from, goal);
  const tail = centerOf(link.to, goal);
  const skin = SNAKE_SKINS[index % SNAKE_SKINS.length];
  const dx = tail.x - head.x;
  const dy = tail.y - head.y;
  const len = Math.hypot(dx, dy);
  const n = { x: -dy / len, y: dx / len };
  const waves = Math.max(1.5, len / 1.4);
  const steps = 40;
  const points = Array.from({ length: steps + 1 }, (_, k) => {
    const t = k / steps;
    const wave = Math.sin(t * waves * Math.PI * 2) * 0.3 * Math.min(1, t * 5) * (1 - t * 0.35);

    return { x: head.x + dx * t + n.x * wave, y: head.y + dy * t + n.y * wave };
  });
  const d = points.map(({ x, y }, k) => `${k ? 'L' : 'M'}${x.toFixed(3)} ${y.toFixed(3)}`).join(' ');
  const angle = (Math.atan2(points[0].y - points[2].y, points[0].x - points[2].x) * 180) / Math.PI;

  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={d} stroke={skin.edge} strokeWidth={0.4} />
      <path d={d} stroke={skin.body} strokeWidth={0.3} />
      <path d={d} stroke="#ffffff" strokeOpacity={0.55} strokeWidth={0.09} strokeDasharray="0.1 0.26" />
      <g transform={`translate(${head.x} ${head.y}) rotate(${angle})`}>
        <path d="M0.2 0 0.42 -0.06M0.2 0 0.42 0.06" stroke="#e5243b" strokeWidth={0.04} />
        <ellipse rx={0.26} ry={0.21} fill={skin.body} stroke={skin.edge} strokeWidth={0.05} />
        <circle cx={0.07} cy={-0.1} r={0.065} fill="#ffffff" />
        <circle cx={0.07} cy={0.1} r={0.065} fill="#ffffff" />
        <circle cx={0.09} cy={-0.1} r={0.03} fill="#111111" />
        <circle cx={0.09} cy={0.1} r={0.03} fill="#111111" />
      </g>
    </g>
  );
};

interface Props {
  board: CellKind[];
  links: Link[];
  /** Casilla en la que está la ficha. La ficha se coloca ahí; el juego la mueve con la animación. */
  pos: number;
  label: string;
}

/**
 * El tablero: casillas en serpentina de la salida (abajo a la izquierda) a la meta (arriba), con las escaleras y las
 * serpientes dibujadas encima. Es una imagen para lectores de pantalla (`label` dice dónde está la ficha y cuántas
 * escaleras y serpientes hay); lo que pasa al caer en ellas lo dice el aviso de la parada.
 */
export const SnakesBoard: React.FC<Props> = ({ board, links, pos, label }) => {
  const lang = useLang();
  const t = i18n[lang];

  const goal = board.length - 1;
  const { cols, rows } = gridOf(goal);
  const style = { '--cols': cols, '--rows': rows, '--ratio': `${cols} / ${rows}` } as React.CSSProperties;
  const snakes = links.filter((l) => l.kind === 'snake');

  return (
    <div className={css.board} role="img" aria-label={label} style={style}>
      {board.map((kind, i) => {
        const { row, col } = tileAt(i, cols);

        return (
          <div
            key={i}
            className={css.tile}
            data-kind={kind}
            data-odd={i % 2 ? '' : undefined}
            data-here={i === pos ? '' : undefined}
            style={{ gridColumn: col + 1, gridRow: rows - row }}
          >
            <span className={css['tile-n']}>{kind === 'start' ? t.start : kind === 'goal' ? t.goal : i}</span>
            {kind === 'goal' && <SnakesIcon name="trophy" className={css['tile-icon']} />}
          </div>
        );
      })}

      <svg className={css.links} viewBox={`0 0 ${cols} ${rows}`} aria-hidden="true" focusable="false">
        {links
          .filter((l) => l.kind === 'ladder')
          .map((link) => (
            <Ladder key={`l${link.from}`} link={link} goal={goal} index={0} />
          ))}
        {snakes.map((link, k) => (
          <Snake key={`s${link.from}`} link={link} goal={goal} index={k} />
        ))}
      </svg>

      <div className={css.pawn} data-pawn style={pawnAt(pos, goal)}>
        <span className={css['pawn-body']} data-pawn-body>
          <SnakesIcon name="pawn" />
        </span>
      </div>
    </div>
  );
};
