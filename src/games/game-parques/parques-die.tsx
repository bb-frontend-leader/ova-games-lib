import css from './game-parques.module.css';

interface Props {
  /** Cara que se ve (1 a 6); sin valor, el dado se ve en reposo con la cara 1. */
  face: number;
}

/**
 * Dado de seis caras hecho con nueve puntos en rejilla: `data-face` decide cuáles se encienden. El juego cambia
 * `data-face` directamente mientras rueda, para no volver a pintar React en cada cambio. Es decorativo: el par de
 * dados lleva su nombre en el contenedor (`ParquesSeat`).
 */
export const ParquesDie: React.FC<Props> = ({ face }) => (
  <div className={css.die} data-die="" data-face={face || 1}>
    {Array.from({ length: 9 }, (_, k) => (
      <span key={k} className={css.pip} />
    ))}
  </div>
);
