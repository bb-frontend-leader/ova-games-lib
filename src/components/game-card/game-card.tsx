import { Link } from 'react-router-dom';

import type { Game } from '@/data/dataGames';
import { getCategoryLabel, getKindSingular } from '@/data/dataGames';

import css from './game-card.module.css';

export const GameCard = ({ link, kind, title, description, url, alt, category }: Game) => (
  <article className={css.card} data-kind={kind}>
    <img className={css.card__image} src={url} alt={alt} loading="lazy" />

    <div className={css.card__body}>
      <span className={css.card__category}>
        {getKindSingular(kind)} · {getCategoryLabel(category)}
      </span>
      <h3 className={css.card__title}>
        {/* El enlace cubre toda la tarjeta (::after): un solo destino por juego para teclado y lector de pantalla. */}
        <Link to={link} className={css.card__link}>
          {title}
        </Link>
      </h3>
      <p className={css.card__description}>{description}</p>
      <span className={css.card__action} aria-hidden="true">
        Probar
      </span>
    </div>
  </article>
);
