import { useMemo, useState } from 'react';

import { GameCard } from '@/components';
import type { GameCategory, GameKind } from '@/data/dataGames';
import { categories, games, getCategoryLabel, kinds } from '@/data/dataGames';
import { normalize } from '@/utils/normalize';

import css from './home.module.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<GameKind | 'all'>('all');
  const [category, setCategory] = useState<GameCategory | 'all'>('all');

  // Solo se ofrecen las categorías del tipo elegido.
  const visibleCategories = categories.filter((item) => kind === 'all' || item.kind === kind);
  const countOf = (id: GameKind) => games.filter((game) => game.kind === id).length;

  const changeKind = (next: GameKind | 'all') => {
    setKind(next);
    setCategory('all');
  };

  const visibleGames = useMemo(() => {
    const text = normalize(query.trim());

    return games.filter(
      (game) =>
        (kind === 'all' || game.kind === kind) &&
        (category === 'all' || game.category === category) &&
        (!text || normalize(`${game.title} ${game.description} ${getCategoryLabel(game.category)}`).includes(text))
    );
  }, [query, kind, category]);

  const clearFilters = () => {
    setQuery('');
    setKind('all');
    setCategory('all');
  };

  return (
    <div className={css.home}>
      <header className={css.hero}>
        <span className={css.hero__tag}>
          {countOf('game')} juegos · {countOf('activity')} actividades
        </span>
        <h1 className={css.hero__title}>Elige el juego o la actividad para tu OVA</h1>
        <p className={css.hero__text}>
          Pruébalos, revisa cómo funcionan y qué recomendamos al usarlos en tu recurso educativo.
        </p>
      </header>

      <search className={css.filters}>
        <div className={css.search}>
          <label htmlFor="search-games" className={css.search__label}>
            Buscar
          </label>
          <input
            id="search-games"
            className={css.search__input}
            type="search"
            placeholder="Escribe un nombre o una palabra…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
        </div>

        <div className={css.chips} role="group" aria-label="Filtrar por tipo">
          {[{ id: 'all' as const, label: 'Todo', hint: 'Ver juegos y actividades' }, ...kinds].map((item) => (
            <button
              key={item.id}
              type="button"
              className={css.chip}
              aria-pressed={kind === item.id}
              title={item.hint}
              onClick={() => changeKind(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className={css.chips} role="group" aria-label="Filtrar por categoría">
          {[{ id: 'all' as const, label: 'Todas las categorías', hint: 'Sin filtrar' }, ...visibleCategories].map(
            (item) => (
              <button
                key={item.id}
                type="button"
                className={css.chip}
                data-small="true"
                aria-pressed={category === item.id}
                title={item.hint}
                onClick={() => setCategory(item.id)}
              >
                {item.label}
              </button>
            )
          )}
        </div>
      </search>

      <p className={css.count} role="status">
        {visibleGames.length === games.length
          ? `Mostrando los ${games.length} del catálogo`
          : `${visibleGames.length} de ${games.length}`}
      </p>

      {visibleGames.length > 0 ? (
        <ul className={css.grid} role="list">
          {visibleGames.map((game) => (
            <li key={game.link}>
              <GameCard {...game} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={css.empty}>
          <p>No encontramos nada con esa búsqueda.</p>
          <button type="button" className={css.chip} onClick={clearFilters}>
            Ver todo el catálogo
          </button>
        </div>
      )}
    </div>
  );
}
