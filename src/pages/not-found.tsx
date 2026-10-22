import { Link } from 'react-router-dom';

import css from './home.module.css';

export default function NotFound() {
  return (
    <div className={css.empty}>
      <h1>Página no encontrada</h1>
      <p>Lo que buscas no existe o cambió de dirección.</p>
      <Link to="/" className={css.chip}>
        Volver al catálogo
      </Link>
    </div>
  );
}
