import { cn } from '@/utils';

import css from './stage.module.css';

interface Props {
  children: React.ReactNode;
  /** Ancho máximo: `wide` para juegos con escena panorámica (carreras, pecera, mapa). */
  size?: 'default' | 'wide';
  /** Centra los textos (pantallas de inicio). */
  center?: boolean;
  addClass?: string;
}

/** Contenedor centrado de ancho fijo que reemplaza la cuadrícula `Row`/`Col`: no cambia de tamaño según el viewport. */
export const Stage: React.FC<Props> = ({ children, size = 'default', center = false, addClass }) => (
  <div className={cn(css.stage, 'u-flow', addClass)} data-size={size} data-align={center ? 'center' : undefined}>
    {children}
  </div>
);
