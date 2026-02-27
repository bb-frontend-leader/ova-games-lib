import { useEffect, useId, useState } from 'react';

import { useThisOrThatActivityContext } from './this-or-that-activity-context';

import css from './this-or-that.module.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  addClass?: string;
  selects: { id: string; text: string; state: 'wrong' | 'success', img?: string }[];
  question: string;
  questionNumber?: number;
  background?: string;
}

export const ThisOrThatElement: React.FC<Props> = ({
  selects,
  question,
  questionNumber,
  background,
  addClass,
  ...props
}) => {
  const { addRadiosValues, addElementsId, validation, selectedId, setSelectedId, options, result } =
    useThisOrThatActivityContext();
  const reactId = useId();
  const uid = reactId;
  const radioName = `radio-group-name-${uid}`;

  const [ariaPressed, setAriaPressed] = useState<{ [key: string]: boolean }>({});

  /**
   * Maneja el evento de clic en un botón.
   * Añade el valor seleccionado al estado de la actividad y establece el ID seleccionado.
   * @param selectId - El ID del botón seleccionado.
   * @param state - El estado del botón seleccionado ('wrong' o 'success').
   */
  const handleClick = (selectId: string, state: 'wrong' | 'success') => {
    addRadiosValues({ id: selectId, name: radioName, state });
    setSelectedId(selectId);

    setAriaPressed((prev) => {
      // Crear un nuevo objeto con todos los valores en false
      const newAriaPressed = Object.keys(prev).reduce(
        (acc, key) => {
          acc[key] = false;
          return acc;
        },
        {} as { [key: string]: boolean }
      );

      // Establecer el valor true para el elemento seleccionado
      newAriaPressed[selectId] = true;
      return newAriaPressed;
    });
  };

  /**
   * Obtiene la clase CSS para un botón según su estado y si está seleccionado.
   * @param selectId - El ID del botón.
   * @returns La clase CSS correspondiente.
   */
  const getClassName = (selectId: string) => {
    if (validation && selectedId === selectId) {
      const selectedOption = options.find((option) => option.id === selectId);
      return selectedOption?.state === 'success' ? css['card-success'] : css['card-wrong'];
    }
    return selectedId === selectId ? css['card-selected'] : '';
  };

  const getDataId = (selectId: string) => {
    if (validation && selectedId === selectId) {
      const selectedOption = options.find((option) => option.id === selectId);
      return selectedOption?.state === 'success' ? 'card-success' : 'card-wrong';
    }
    return selectedId === selectId ? 'card-selected' : 'card-element';
  }

  /**
   * Obtiene la clase CSS para la pregunta según el resultado de la validación.
   * @returns La clase CSS correspondiente.
   */
  const getClassQuestion = () => {
    if (validation) {
      return result ? css['success'] : css['wrong'];
    }
    return '';
  };

  /**
   * Efecto para añadir el ID del elemento al estado de la actividad cuando el componente se monta.
   */
  useEffect(() => {
    addElementsId(uid);
  }, [uid, addElementsId]);

  return (
    <div
      className={`${css['container-element']} ${addClass ? addClass : ''}`}
      style={{
        background: background
          ? `url(${background}), linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9))`
          : `url('../../../../public/assets/svgs/Ova_012_sld_16.svg'), linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9))`
      }}>
      <div data-id="card" role="group" aria-labelledby="question" className={css['card-element']}>
        <div className={css['number-question-container']}>
          {questionNumber && <p className={css['number-question']}>{questionNumber}</p>}
        </div>
        <div className={`${css['question']} ${getClassQuestion()}`} data-id="question">
          <p className="u-font-bold u-text-center" dangerouslySetInnerHTML={{ __html: question }} />
        </div>
        <div className={css['container-options']} data-id="options" role="radiogroup" aria-labelledby="question">
          {selects.map((select) => (
            <button
              key={select.id}
              id={select.id}
              name={radioName}
              data-id={getDataId(select.id)}
              className={`${css['radio-element']} ${getClassName(select.id)}`}
              onClick={() => handleClick(select.id, select.state)}
              disabled={validation}
              role="radio"
              aria-checked={ariaPressed[select.id] ? 'true' : 'false'}
              aria-pressed={ariaPressed[select.id] ? 'true' : 'false'}
              {...props}>
              <div className={css['circle']}>{select.id}</div>
              {select.img && <img src={select.img} alt={select.text} />}
              <span className="u-font-bold">{select.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
