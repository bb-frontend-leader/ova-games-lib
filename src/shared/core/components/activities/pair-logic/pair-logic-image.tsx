import React, { useEffect, useRef } from 'react';
import { Image } from 'books-ui';
import gsap from 'gsap';

import { IconArrow, IconImage } from './icons/icons';
import { useGameJoinContext } from './pair-logic-context';

import css from './pair-logic.module.css';

export const PairLogicImage = ({ children }: { children: React.ReactNode }) => {
  const { imageSelected, lockedJoins, updateActivity, validation, endActivity } = useGameJoinContext();
  const imageRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const interactionLocked = validation !== null || endActivity;
  const handleSelectImage = (child: React.ReactElement) => {
    const join = child.props.id;

    const buttonChildren = React.Children.toArray(child.props.children);
    const imageChild = buttonChildren.find((c) => React.isValidElement(c) && 'src' in c.props && 'alt' in c.props) as
      | React.ReactElement
      | undefined;

    updateActivity({ imageSelected: { src: imageChild?.props.src ?? null, alt: imageChild?.props.alt ?? null, join } });
  };

  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const join = child.props.id;
    const isLocked = lockedJoins.includes(join);

    return React.cloneElement(child, {
      disabled: isLocked || interactionLocked,
      onClick: interactionLocked || isLocked ? undefined : () => handleSelectImage(child)
    });
  });

  useEffect(() => {
    if (!imageSelected.src || !imageRef.current) return;

    gsap.fromTo(
      imageRef.current,
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
  }, [imageSelected.src]);
  useEffect(() => {
    if (!containerRef.current) return;

    if (validation !== null || endActivity) {
      containerRef.current.setAttribute('inert', '');
    } else {
      containerRef.current.removeAttribute('inert');
    }
  }, [validation, endActivity]);

  return (
    <div className={css.containerImage}>
      <div
        ref={containerRef}
        aria-label="acontinuacion encontrara elementos tendra que seleccionar uno presionando enter sobre el que quieras."
        className={css.images}>
        {enhancedChildren}
      </div>

      <div className={css.flecha} aria-label="flecha">
        <IconArrow idIcon="arrowImage" />
      </div>

      <div
        ref={imageRef}
        className={`${css.imageSeleccionado}`}
        aria-label="contenedor donde se aloja la imagen seleccionada">
        {validation !== null && (
          <div className={css.validation} data-validation={validation}>
            <div className={css.stampCircle} aria-label="Sello">
              <span>{validation ? 'Correcto' : 'Incorrecto'}</span>
            </div>
          </div>
        )}

        {endActivity ? (
          <div className={css.containerTrophy}>
            <span className={css.spanTrophy}>
              <svg
                className={css.trophy}
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#FFF">
                <path d="M280-120v-80h160v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80v-80h400v80h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h160v80H280zm0-408v-152h-80v40q0 38 22 68.5t58 43.5zm285 93q35-35 35-85v-240H360v240q0 50 35 85t85 35q50 0 85-35zm115-93q36-13 58-43.5t22-68.5v-40h-80v152zm-200-52z" />
              </svg>
            </span>
          </div>
        ) : imageSelected.src === null ? (
          <>
            <IconImage />
            <p>
              <strong>Selecciona una imagen</strong>
            </p>
          </>
        ) : (
          <div className={css.imageSelected} ref={imageRef}>
            <Image noCaption src={imageSelected.src} alt={imageSelected.alt ?? ''} />
          </div>
        )}
      </div>
    </div>
  );
};
