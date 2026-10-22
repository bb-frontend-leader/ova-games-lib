import css from './game-actions.module.css';

/** Fila centrada para los botones de un juego (Comprobar, Reintentar…). */
export const GameActions: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={css.actions}>{children}</div>
);
