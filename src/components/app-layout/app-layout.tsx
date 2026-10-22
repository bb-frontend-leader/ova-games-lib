import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { setSoundEnabled, useSoundEnabled } from '@/hooks';

import css from './app-layout.module.css';

export const AppLayout = () => {
  const { pathname } = useLocation();
  const soundEnabled = useSoundEnabled();

  // Al cambiar de página se vuelve al inicio y el foco pasa al contenido principal.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className={css.layout}>
      <a
        className={css.skip}
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Saltar al contenido
      </a>

      <header className={css.header}>
        <div className={css.header__inner}>
          <Link to="/" className={css.brand} aria-label="Biblioteca de juegos, ir al inicio">
            <span className={css.brand__mark} aria-hidden="true">
              OVA
            </span>
            <span className={css.brand__name}>Biblioteca de juegos</span>
          </Link>

          <button
            type="button"
            className={css.sound}
            aria-pressed={soundEnabled}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? '🔊 Sonido activado' : '🔇 Sonido desactivado'}
          </button>
        </div>
      </header>

      <main id="main" className={css.main} tabIndex={-1}>
        <Outlet />
      </main>

      <footer className={css.footer}>
        <p>Juegos y actividades para Objetos Virtuales de Aprendizaje (OVA)</p>
      </footer>
    </div>
  );
};
