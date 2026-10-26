import { Link, Navigate } from 'react-router-dom';

import { getCategoryLabel, getGame, getKindSingular } from '@/data/dataGames';

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
  /** El juego o la actividad en funcionamiento (y sus modales). */
  children: React.ReactNode;
}

export const GamePage: React.FC<Props> = ({ link, description, correct, incorrect, recommendations, children }) => {
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

      <section className={css.demo} aria-label={`${kindLabel}: ${game.title}`}>
        {children}
      </section>

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
