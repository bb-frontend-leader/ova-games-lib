import css from '../game-millions.module.css';

// Decorativos: el estado lo dice el texto oculto de la respuesta, no el icono.
export const CorrectIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48.6 48.6"
    aria-hidden="true"
    focusable="false"
    className={`${css.icon} ${css['icon--success']}`}
  >
    <circle cx={24.3} cy={24.3} r={23.5} fill="#6f9c39" stroke="#fff" strokeWidth={1.6} strokeMiterlimit={10} />
    <path d="m5.2 25.2 17.7 13.1 15.9-27.4-19 17.6z" fill="#fff" />
  </svg>
);

export const WrongIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48.6 48.6"
    aria-hidden="true"
    focusable="false"
    className={`${css.icon} ${css['icon--wrong']}`}
  >
    <circle cx={24.3} cy={24.3} r={23.5} fill="#bc4124" stroke="#fff" strokeWidth={1.6} strokeMiterlimit={10} />
    <path
      d="M35.9 35.9c-1 1-2.6 1-3.7 0L12.6 16.3c-1-1-1-2.6 0-3.7 1-1 2.6-1 3.7 0l19.6 19.6c1.1 1.1 1.1 2.7 0 3.7z"
      fill="#fff"
    />
    <path
      d="M12.7 35.9c1 1 2.6 1 3.7 0L36 16.3c1-1 1-2.6 0-3.7-1-1-2.6-1-3.7 0L12.7 32.2c-1 1.1-1 2.7 0 3.7z"
      fill="#fff"
    />
  </svg>
);
