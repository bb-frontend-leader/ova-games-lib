import { forwardRef } from 'react';

import { HERO_COLS, HERO_PIXELS, HERO_ROWS } from './lib/constant';

import css from './game-castle.module.css';

/** El héroe, dibujado píxel a píxel. Es decorativo: lo que importa se anuncia con el texto del juego. */
export const GameCastleHero = forwardRef<HTMLDivElement, { sprite: React.Ref<HTMLSpanElement> }>(({ sprite }, ref) => (
  <div ref={ref} className={css.hero} aria-hidden="true">
    <span ref={sprite} className={css['hero-sprite']}>
      <svg viewBox={`0 0 ${HERO_COLS} ${HERO_ROWS}`} shapeRendering="crispEdges" focusable="false">
        {HERO_PIXELS.map(({ x, y, fill }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
        ))}
      </svg>
    </span>
    <span className={css['hero-shadow']} />
  </div>
));

GameCastleHero.displayName = 'GameCastleHero';
