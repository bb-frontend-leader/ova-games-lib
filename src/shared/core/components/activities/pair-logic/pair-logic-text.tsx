import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

import { IconArrow, IconText } from './icons/icons';
import { useGameJoinContext } from './pair-logic-context';

import css from './pair-logic.module.css';

interface Props {
  children: React.ReactNode;
}

export const PairLogicText = ({ children, ...props }: Props) => {
  const { text, updateActivity, lockedJoins, validation, endActivity } = useGameJoinContext();
  const textRef = useRef<HTMLDivElement>(null);

  const handleSelectText = (child: React.ReactElement) => {
    const join = child.props.id;
    const textValue = child.props.children?.props?.children;

    updateActivity({ text: { text: textValue, join } });
  };
  const enhancedChildren = React.Children.map(children, (child) => {
    const interactionLocked = validation !== null || endActivity;
    if (!React.isValidElement(child)) return child;
    const isLocked = lockedJoins.includes(child.props.id);
    return React.cloneElement(child, {
      disabled: isLocked || interactionLocked,
      'aria-checked': isLocked || interactionLocked,
      onClick: isLocked ? undefined : () => handleSelectText(child)
    });
  });
  useEffect(() => {
    if (!text.text || !textRef.current) return;
    gsap.fromTo(
      textRef.current,
      {
        scale: 0.2,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'back.out(1.7)'
      }
    );
    const buttonsCount = React.Children.toArray(children).filter(
      (child): child is React.ReactElement => React.isValidElement(child) && !!child.props?.id
    ).length;
    updateActivity({ buttonsCount: buttonsCount });
  }, [text.text, textRef, updateActivity, children]);

  return (
    <div className={css.containerTexto} {...props}>
      <div
        aria-label="contenedor de textos disponibles, Selecciona un texto que crea que pertenezca a la imagen anterior mente seleccionada."
        className={css.texto}>
        {enhancedChildren}
      </div>

      <div
        aria-label="flecha apuntando hacia el contenedor donde se encuentran el texto seleccionado"
        className={css.flecha}>
        <IconArrow idIcon="arrowText" />
      </div>

      <div className={`${css.textoSeleccionadoContainer} `}>
        {validation !== null && (
          <div className={css.validation} data-validation={validation}>
            <div className={css.stampCircle} aria-label="Sello">
              <span>{validation ? 'Correcto' : 'Incorrecto'}</span>
            </div>
          </div>
        )}
        {endActivity ? (
          <>
            <h2 className={css.titleFinal}>
              ¡Felicidades,
              <br />
              lo lograste!
            </h2>
            <p className={css.textFinal}>
              ¡Muy bien hecho! Lograste completar el objetivo con éxito. Sigue así, estás haciendo un gran trabajo.
            </p>
          </>
        ) : text.text ? (
          <p className={css.textoSeleccionado} aria-label="texto seleccionado" ref={textRef}>
            {text.text}
          </p>
        ) : (
          <>
            <IconText aria-label="Icono de texto" />

            <p className={css.prompt}>
              <strong>Seleccione el item que corresponda a la imagen anteriormente seleccionada</strong>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
