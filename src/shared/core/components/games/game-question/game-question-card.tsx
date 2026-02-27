import { useEffect, useId, useRef, useState } from 'react';

import { BACKGROUND, POSTER } from './const';
import { useGameQuestionContext } from './game-question-context';

import css from './game-question.module.css';

interface Props extends React.ButtonHTMLAttributes<HTMLInputElement> {
  addClass?: string;
  questionNumber?: string;
  background?: string;
  imagen?: string;
  question: string;
  children: React.ReactNode;
}

/**
 * Funcion para reemplaza el primer bloque de 3 o más "_" por el valor
 * @param question - Pregunta que se va a cambiar
 * @param value - valor que se va a reemplazar
 * @returns string
 */
function fillBlank(question: string, value: string) {
  return question.replace(/_{3,}/, value);
}


export const GameQuestionCard: React.FC<Props> = ({
  question,
  imagen,
  questionNumber,
  background,
  children,
  addClass,
  ...props
}) => {
  const { result, validation } = useGameQuestionContext();
  const optionsRef = useRef<HTMLDivElement>(null);

  const safeSrc = (rawSrc: string): string => rawSrc.replace(/\s/g, '');
  const bg = background ? background : safeSrc(BACKGROUND);
  const image = imagen ? imagen : safeSrc(POSTER);

  const liveId = useId();

  const [questionComplete, setQuestionComplete] = useState<string>(question); // Estado para almacenar la pregunta autocompletada

  /**
   * Cambia el enunciado de la pregunta con la opcion seleccionada y verificada
   */
  useEffect(() => {
    // ✅ Reset cuando no hay validación
    if (!validation) {
      setQuestionComplete(question);
      return;
    }

    const root = optionsRef.current;
    if (!root) return;

    // ✅ 1) input checked
    const checked = root.querySelector<HTMLInputElement>('input[type="radio"]:checked');
    if (!checked?.id) {
      setQuestionComplete(question);
      return;
    }

    // ✅ 2) label asociado
    const labelEl = root.querySelector<HTMLLabelElement>(`label[for="${checked.id}"]`);
    const selectedText = labelEl?.textContent?.trim() ?? '';

    // ✅ 3) replace
    const completed = selectedText ? fillBlank(question, selectedText) : question;
    setQuestionComplete(completed);
  }, [validation, question]);

  /**
   * Reinicia la pregunta y la selección cuando cambian la validación o el resultado.
   */
  useEffect(() => {
    if (!validation && !result) {
      setQuestionComplete(question);
    }
  }, [validation, result, question]);

  return (
    <div
      className={`${css['container-element']} ${addClass ?? ''}`}
      style={{ '--bg-image': `url("${bg}")` } as React.CSSProperties}
      {...props}>
      <div data-id="card" className={css['card-element']}>
        {questionNumber && (
          <div className={css['number-question-container']} data-id="number-question">
            <p className={css['number-question']}>{questionNumber}</p>
          </div>
        )}
        {/* ✅ Región live para anunciar el enunciado final cuando cambia */}
        <p id={liveId} className="u-sr-only" aria-live="polite" aria-atomic="true">
          {validation ? `Respuesta en el enunciado: ${questionComplete}` : ''}
        </p>
        <div className={`${css['question']}`} data-id="question">
          <p className="u-font-bold u-text-center">{questionComplete}</p>
          <img src={image} alt="Imagen descriptiva de la pregunta" />
        </div>
        <div className={css['container-options']} ref={optionsRef}>
          {children}
        </div>
      </div>
    </div>
  );
};
