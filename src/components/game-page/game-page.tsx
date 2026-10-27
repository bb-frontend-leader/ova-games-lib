import { useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';

import { getCategoryLabel, getGame, getKindSingular } from '@/data/dataGames';
import type { GameEditor } from '@/hooks';

import { GameEditorBar } from '../game-editor/game-editor-bar';
import { ScreenshotButton } from '../game-editor/screenshot-button';

import css from './game-page.module.css';

interface Props {
  /** Ruta de la página: de ahí salen el título, el resumen y la categoría del catálogo. */
  link: string;
  /** Qué es y cómo se usa. */
  description: React.ReactNode;
  /** Qué pasa cuando el estudiante responde bien. */
  correct: React.ReactNode;
  /** Qué pasa cuando el estudiante responde mal. */
  incorrect: React.ReactNode;
  /** Guía para el docente: mínimo y máximo de preguntas, cómo redactarlas y un ejemplo del formato en que enviarlas. */
  recommendations: React.ReactNode;
  /** Estado del botón «Agregar preguntas». Sin él, la página no deja que el docente cargue su contenido. */
  editor?: Pick<GameEditor<unknown>, 'version' | 'customized' | 'open' | 'reset'>;
  /** Lo que agrega el docente, en plural: «preguntas» por defecto. */
  editorNoun?: string;
  /** La ventana del editor; va fuera del juego para que no se reinicie con él. */
  editorDialog?: React.ReactNode;
  /** El juego o la actividad en funcionamiento (y sus modales). */
  children: React.ReactNode;
}

export const GamePage: React.FC<Props> = ({
  link,
  description,
  correct,
  incorrect,
  recommendations,
  editor,
  editorNoun,
  editorDialog,
  children
}) => {
  const demoRef = useRef<HTMLElement>(null);
  const game = getGame(link);

  if (!game) return <Navigate to="/" replace />;

  const kindLabel = getKindSingular(game.kind);

  return (
    <div className={css.page}>
      <nav aria-label="Navegación de la página">
        <Link to="/" className={css.back}>
          Todo el catálogo
        </Link>
      </nav>

      <header className={css.header}>
        <span className={css.header__tag}>
          {kindLabel} · {getCategoryLabel(game.category)}
        </span>
        <h1 className={css.header__title}>{game.title}</h1>
        <p className={css.header__summary}>{game.description}</p>
      </header>

      {editor && (
        <GameEditorBar editor={editor} noun={editorNoun}>
          <ScreenshotButton targetRef={demoRef} filename={link.split('/').filter(Boolean).pop() ?? 'captura'} />
        </GameEditorBar>
      )}

      {/* La `key` reinicia el juego cuando el docente carga su contenido. */}
      <section ref={demoRef} key={editor?.version ?? 0} className={css.demo} aria-label={`${kindLabel}: ${game.title}`}>
        {children}
      </section>

      {editorDialog}

      <section className={css.info} aria-labelledby="how-it-works">
        <h2 id="how-it-works" className={css.info__title}>
          Cómo funciona
        </h2>

        <div className={css.info__grid}>
          <article className={`${css.panel} ${css.panel_wide}`}>
            <h3 className={css.panel__title}>Descripción</h3>
            <div className={css.panel__content}>{description}</div>
          </article>

          <article className={`${css.panel} ${css.panel_success}`}>
            <h3 className={css.panel__title}>Si la respuesta es correcta</h3>
            <div className={css.panel__content}>{correct}</div>
          </article>

          <article className={`${css.panel} ${css.panel_wrong}`}>
            <h3 className={css.panel__title}>Si la respuesta es incorrecta</h3>
            <div className={css.panel__content}>{incorrect}</div>
          </article>

          <article className={`${css.panel} ${css.panel_wide} ${css.panel_tips}`}>
            <h3 className={css.panel__title}>Recomendaciones docente</h3>
            <div className={css.panel__content}>{recommendations}</div>
          </article>
        </div>
      </section>
    </div>
  );
};
