import { DATA_fishs } from './data/data';

import css from './game-castle.module.css';

interface Props {
  id: number;
  question: string;
  isDisabled: boolean;
  isPressed: boolean;
  isCorrect: boolean;
  addSelectAnswer: (question: string) => void;
}

/** Texto sin etiquetas: la respuesta puede traer HTML (p. ej. `<sup>`), pero el nombre accesible debe ser texto. */
const toPlain = (html: string) => html.replace(/<[^>]*>/g, '');

/** Un bloque «?» con una respuesta. Al comprobar, el elegido muestra si acertó y los demás se apagan. */
export const Box: React.FC<Props> = ({ id, question, isDisabled, isPressed, isCorrect, addSelectAnswer }) => {
  const state = isPressed ? (isDisabled ? (isCorrect ? 'correct' : 'wrong') : 'picked') : isDisabled ? 'off' : 'idle';

  return (
    <button
      type="button"
      className={css.block}
      data-block={id}
      data-state={state}
      aria-pressed={isPressed}
      aria-label={toPlain(question)}
      disabled={isDisabled}
      onClick={() => addSelectAnswer(question)}
    >
      <span className={css['block-box']}>
        <img src={DATA_fishs[id % DATA_fishs.length].image} alt="" />
        {isDisabled && isPressed && (
          <span className={css.badge} aria-hidden="true">
            {isCorrect ? '✔' : '✖'}
          </span>
        )}
      </span>
      <span className={css['block-tag']}>
        <span dangerouslySetInnerHTML={{ __html: question }} />
      </span>
    </button>
  );
};
