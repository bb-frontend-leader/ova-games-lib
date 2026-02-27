import { FullScreenAlert, /*FullScreenButton */} from '@core/components';

import { useRelationConceptActivityContext } from './relation-concept-activity-context';

import css from './relation-concept.module.css';

interface CardProps {
  addClass?: string;
  title: string;
  pairs: { id: string; label: string; pair: number }[];
}

export const RelationConceptCard: React.FC<CardProps> = ({ pairs, title, addClass, ...props }) => {
  const { addSelectedPair, selectedPairs, correctPairs } = useRelationConceptActivityContext();

  /**
   * Maneja el evento de clic en una tarjeta.
   * @param id - ID de la tarjeta.
   * @param label - Texto de la tarjeta.
   * @param pair - Número de par de la tarjeta.
   */
  const handleClick = (id: string, label: string, pair: number) => {
    addSelectedPair({ id, label, pair });
  };

  /**
   * Obtiene el nombre de la clase CSS para una tarjeta específica basado en su estado.
   * @param id - ID de la tarjeta.
   * @param label - Texto de la tarjeta.
   * @returns Nombre de la clase CSS.
   */
  const getClassName = (id: string, label: string) => {
    const selected = selectedPairs.find((pair) => pair.id === id && pair.label === label);
    const correct = correctPairs.find((pair) => pair.id === id && !pair.isIncorrect);
    const incorrect = correctPairs.find((pair) => pair.id === id && pair.isIncorrect);

    if (selected) return `${css.card} ${css.selected}`;
    if (incorrect) return `${css.card} ${css.incorrect}`;
    if (correct) return `${css.card} ${css.correct}`;

    return `${css.card}`;
  };

  /**
   * Obtiene el valor del atributo data-id para una tarjeta específica basado en su estado.
   * @param id - ID de la tarjeta.
   * @param label - Texto de la tarjeta.
   * @returns Valor del atributo data-id.
   */
  const getDataId = (id: string, label: string) => {
    const selected = selectedPairs.find((pair) => pair.id === id && pair.label === label);
    const correct = correctPairs.find((pair) => pair.id === id && !pair.isIncorrect);
    const incorrect = correctPairs.find((pair) => pair.id === id && pair.isIncorrect);

    if (incorrect) return 'incorrect';
    if (correct) return 'correct';
    if (selected) return 'selected';
  };

  return (
    <>
      <FullScreenAlert />
      <div className={`${css['grid-wrapper']} ${addClass ?? ''}`} id="relation-concept">
        {/* <FullScreenButton elementId="relation-concept" addClass={css['fullScreen__button']} /> */}
        <div className={`${css['grid-title']}`}>
          <h2>{title}</h2>
        </div>
        <div className={`${css['grid-container']}`} data-id="card-container">
          {pairs.map((pair) => (
            <button
              key={pair.id}
              id={pair.id}
              onClick={() => handleClick(pair.id, pair.label, pair.pair)}
              className={`${getClassName(pair.id, pair.label)} ${css['grid-item']}`}
              data-id={getDataId(pair.id, pair.label)}
              {...props}>
              <span>
                {/.(jpg|jpeg|png|svg|gif|webp)$/i.test(pair.label) ? (
                  <img src={pair.label} alt={`Opción ${pair.id}`} />
                ) : (
                  pair.label
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
