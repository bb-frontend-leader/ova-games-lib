import { useEffect, useRef } from "react";
import gsap from "gsap";
import  type { JSX } from "react";

// import { useA11yAttribute, useReduceMotion } from "@core/hooks";
import { useA11yAttribute, useReduceMotion } from "../../../../core/hooks";

import { BUSH, CLOUDS, MOUNTAINS, SKY } from "./const";

import css from "./game-balloons.module.css";
// import { FullScreenButton } from "../../ui";

const ANIMATION_CLOUD = 45;

interface Props {
  children: JSX.Element[] | JSX.Element;
}

export const GameBalloonsParallax: React.FC<Props> = ({ children }) => {
  const cancelAnimation = useReduceMotion();
  const { stopAnimations } = useA11yAttribute();

  const refDeph1 = useRef<HTMLImageElement>(null);
  const refDeph2 = useRef<HTMLImageElement>(null);
  const refDeph3 = useRef<HTMLImageElement>(null);
  const refDeph4 = useRef<HTMLImageElement>(null);
  const refClouds = useRef<HTMLImageElement>(null);
  const refClouds2 = useRef<HTMLImageElement>(null);

  /**
   * Inicia la animación de las nubes.
   */
  useEffect(() => {
    const animated1 = gsap.fromTo(
      refClouds.current,
      { left: "100%" },
      {
        left: "-100%",
        duration: ANIMATION_CLOUD,
        repeat: Infinity,
        ease: "none",
      },
    );
    const animated2 = gsap.fromTo(
      refClouds2.current,
      { left: "100%" },
      {
        left: "-100%",
        duration: ANIMATION_CLOUD,
        repeat: Infinity,
        ease: "none",
        delay: ANIMATION_CLOUD / 2,
      },
    );

    setTimeout(() => {
      if (cancelAnimation || stopAnimations) {
        animated1.pause();
        animated2.pause();
      }
    }, 100);
  }, [cancelAnimation, stopAnimations]);

  /**
   * Función que se encarga de mover las nubes en función de la posición del usuario en la pantalla.
   * Se utiliza para darle un efecto de profundidad a las nubes.
   * @param {React.MouseEvent} e - El evento que se desencadena al mover el ratón.
   */
  const handleDepthMove: React.MouseEventHandler = (e) => {
    if (!cancelAnimation && !stopAnimations) {
      const offsetX = window.innerWidth / 2 - e.nativeEvent.clientX;
      const offsetY = window.innerHeight / 2 - e.nativeEvent.clientY;

      if (refDeph1.current) refDeph1.current.style.left = offsetX / 50 + "px";
      if (refDeph2.current) refDeph2.current.style.left = offsetX / 75 + "px";

      if (refDeph3.current) refDeph3.current.style.left = offsetX / 150 + "px";
      if (refDeph4.current) refDeph4.current.style.left = offsetX / 200 + "px";

      if (refDeph1.current) refDeph1.current.style.top = offsetY / 50 + "px";
      if (refDeph2.current) refDeph2.current.style.top = offsetY / 75 + "px";

      if (refDeph3.current) refDeph3.current.style.top = offsetY / 150 + "px";
      if (refDeph4.current) refDeph4.current.style.top = offsetY / 200 + "px";
    }
  };

  const safeSrc = (rawSrc: string): string => rawSrc.replace(/\s/g, ""); // Elimina espacios en blanco accidentales
  const bg = safeSrc(SKY); // Fondo de pantalla
  const refDiv = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={refDiv}
      className={css.wrapper_depths}
      onMouseMove={handleDepthMove}
      style={{ "--bg-image": `url("${bg}")` } as React.CSSProperties}
    >
      {/* Animacion de Profundidad*/}
      <img
        src={safeSrc(SKY)}
        className={css.image_depth}
        ref={refDeph4}
        alt="Cielo"
      />
      <img
        src={safeSrc(MOUNTAINS.mountain2)}
        className={css.image_depth}
        ref={refDeph3}
        alt="Montaña numero dos"
      />

      {/* Nubes */}
      <img
        src={safeSrc(CLOUDS)}
        className={css.image_depth_clouds}
        ref={refClouds}
        alt="Nubes"
      />
      <img
        src={safeSrc(CLOUDS)}
        className={css.image_depth_clouds}
        ref={refClouds2}
        alt="Nubes"
      />
      <img
        src={safeSrc(MOUNTAINS.mountain1)}
        alt="Montaña numero uno"
        ref={refDeph2}
        className={css.image_depth}
      />

      {/* Bush  */}
      <img
        src={safeSrc(BUSH)}
        className={css.image_depth}
        ref={refDeph1}
        alt="Arboles"
      />
      {/* <FullScreenButton elementRef={refDiv} addClass={css.fullScreen__button} /> */}

      {children}
    </div>
  );
};
