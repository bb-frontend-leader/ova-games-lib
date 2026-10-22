import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { BALL_R, drawnPegs, H, type Layout, slotCenter, START_Y, W } from './lib/physics';

import type { BallKind, PlinkoPrize } from './types/types';

import css from './game-plinko.module.css';

/** Nivel visual de un premio: así los colores no dependen de los valores concretos que ponga el autor. */
const tierOf = (prize: PlinkoPrize, max: number) => {
  if (prize === 'bonus') return 'bonus';
  if (prize >= max) return 'top';
  if (prize >= max / 5) return 'high';
  if (prize >= max / 10) return 'mid';

  return 'low';
};

interface Props {
  layout: Layout;
  prizes: readonly PlinkoPrize[];
  svgRef?: React.Ref<SVGSVGElement>;
  /** Cada clavo dibujado se registra aquí para que la reproducción lo haga brillar al golpearlo. */
  pegRefs?: React.MutableRefObject<(SVGCircleElement | null)[]>;
  ballRef?: React.Ref<SVGCircleElement>;
  /** Con ficha: tipo de ficha y casilla desde la que se suelta. Sin ella no se dibuja ficha. */
  ball?: { kind: BallKind; x: number; id: number } | null;
  /** Línea guía desde la ficha hasta el fondo (solo al apuntar). */
  guide?: boolean;
  /** Casilla donde cayó la última ficha. */
  landed?: number | null;
  /** Al pulsar el tablero se pasa la x (en unidades del tablero). */
  onPick?: (x: number) => void;
  /** Etiqueta accesible: sin ella el tablero se oculta a los lectores de pantalla. */
  label?: string;
}

/**
 * El tablero de clavos y las casillas de premio. Solo dibuja: quien lo usa mueve la ficha (`ballRef`) y hace
 * brillar los clavos (`pegRefs`).
 */
export const PlinkoBoard: React.FC<Props> = ({
  layout,
  prizes,
  svgRef,
  pegRefs,
  ballRef,
  ball = null,
  guide,
  landed = null,
  onPick,
  label
}) => {
  const lang = useLang();
  const t = i18n[lang];
  const { slots, slotW, slotTop, floor } = layout;
  const maxPrize = Math.max(...prizes.map((prize) => (prize === 'bonus' ? 0 : prize)));
  const fontSize = slotW < 36 ? 11 : 14;

  return (
    <svg
      ref={svgRef}
      className={css.board}
      viewBox={`0 0 ${W} ${H}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-pickable={onPick ? '' : undefined}
      onClick={
        onPick
          ? (event) => {
              const box = event.currentTarget.getBoundingClientRect();

              onPick(((event.clientX - box.left) / box.width) * W);
            }
          : undefined
      }
    >
      <rect className={css['board-bg']} x="0" y="0" width={W} height={H} rx="14" />

      {layout.pegs.slice(0, drawnPegs(layout)).map((peg, i) => (
        <circle
          key={i}
          ref={(el) => {
            if (pegRefs) pegRefs.current[i] = el;
          }}
          className={css.peg}
          cx={peg.x}
          cy={peg.y}
          r={peg.r}
        />
      ))}

      {prizes.map((prize, i) => (
        <g key={i} className={css.slot} data-tier={tierOf(prize, maxPrize)} data-landed={landed === i ? '' : undefined}>
          <rect x={i * slotW + 1.5} y={slotTop} width={slotW - 3} height={floor - slotTop + 6} rx="5" />
          <text x={slotCenter(layout, i)} y={slotTop + 28} fontSize={fontSize}>
            {prize === 'bonus' ? t.bonus : prize}
          </text>
        </g>
      ))}

      {Array.from({ length: slots + 1 }, (_, k) => (
        <rect key={k} className={css.divider} x={k * slotW - 1.5} y={slotTop} width="3" height={floor - slotTop + 6} />
      ))}

      {ball && guide && (
        <line className={css.guide} x1={ball.x} y1={START_Y + BALL_R + 4} x2={ball.x} y2={slotTop - 8} />
      )}

      {ball && (
        <circle
          key={ball.id}
          ref={ballRef}
          className={css.ball}
          data-kind={ball.kind}
          cx={ball.x}
          cy={START_Y}
          r={BALL_R}
        />
      )}
    </svg>
  );
};
