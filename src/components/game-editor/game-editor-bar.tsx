import { Button } from '@/components/ui';
import type { GameEditor } from '@/hooks';

import css from './game-editor.module.css';

interface Props {
  editor: Pick<GameEditor<unknown>, 'customized' | 'open' | 'reset'>;
  /** Qué agrega el docente: «preguntas» por defecto. */
  noun?: string;
  /** Otras acciones sobre el juego, a continuación del botón del editor. */
  children?: React.ReactNode;
}

/** Botón «Agregar preguntas» que va sobre el juego, con un aviso cuando se están viendo las del docente. */
export const GameEditorBar: React.FC<Props> = ({ editor, noun = 'preguntas', children }) => (
  <div className={css.bar}>
    <Button
      label={editor.customized ? `Editar mis ${noun}` : `Agregar ${noun}`}
      variant="secondary"
      onClick={editor.open}
    />
    {editor.customized && (
      <>
        <span className={css.status} role="status">
          Estás viendo tus {noun}, no el ejemplo.
        </span>
        <Button label="Volver al ejemplo" variant="outline" onClick={editor.reset} />
      </>
    )}
    {children}
  </div>
);
