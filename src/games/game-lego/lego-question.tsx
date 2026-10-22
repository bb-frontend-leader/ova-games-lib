import { Children, cloneElement, isValidElement, useId, useRef } from 'react';
import gsap from 'gsap';

import { ValidationStatus } from '@/components/ui';
import { SOUNDS } from '@/constants';
import { burst, centerIn, flyChip, ring } from '@/games/lib/fx';
import { useCanAnimate, useLang, usePlaySound } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { useGameLegoContext } from './game-lego-context';
import { LegoModel } from './lego-model';
import { BACKGROUND, FX_COLORS, i18n } from './lib/constant';
import { parseLabel } from './lib/parse-label';

import css from './game-lego.module.css';

interface Props {
  label: string;
  children: JSX.Element | JSX.Element[];
  addClass?: string;
}

/** Texto sin etiquetas: la respuesta puede traer HTML (p. ej. `<sup>`). */
const toPlain = (html: string) => html.replace(/<[^>]*>/g, '');

export const LegoQuestion: React.FC<Props> = ({ children, addClass, label, ...props }) => {
  const { validation, options } = useGameLegoContext();
  const lang = useLang();
  const t = i18n[lang];

  const canAnimate = useCanAnimate(); // Falso con "reducir movimiento" o "detener animaciones"
  const playSound = usePlaySound();
  const questionId = useId();

  const rootRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);

  const safeSrc = (rawSrc: string): string => rawSrc.replace(/\s/g, ''); // Elimina espacios en blanco accidentales
  const bg = safeSrc(BACKGROUND); // Fondo de pantalla

  const selectedOption = options?.[0];
  const success = selectedOption?.state === 'success';

  const letter = selectedOption?.label ? parseLabel(selectedOption.label).letter : null;
  const slotState = !selectedOption ? 'empty' : validation ? (success ? 'correct' : 'wrong') : 'picked';

  /**
   * Obtiene la clase CSS para la pregunta según el resultado.
   * @returns {string} La clase CSS correspondiente
   */
  const questionClass = !validation ? '' : success ? css.correct : css.incorrect;

  /** Al elegir, la pieza vuela desde su sitio hasta el hueco del modelo y encaja con un pequeño golpe. */
  useGSAP(
    () => {
      const fx = fxRef.current;
      const slot = slotRef.current;
      const from = rootRef.current?.querySelector<HTMLElement>('[data-lego-option][data-state="picked"]');

      if (!canAnimate || validation || !selectedOption || !fx || !slot || !from) return;

      const { letter: l, text } = parseLabel(selectedOption.label ?? '');

      flyChip(
        fx,
        fx.getBoundingClientRect(),
        from.getBoundingClientRect(),
        slot.getBoundingClientRect(),
        `${l ?? ''} ${toPlain(text)}`.trim(),
        css.flyer,
        () => gsap.fromTo(slot, { scale: 1.18 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' })
      );

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [selectedOption?.id, canAnimate] }
  );

  /**
   * Al comprobar: si encaja, el modelo se completa (las filas saltan en ola y salen piezas de colores); si no,
   * la pieza no entra, se cae, el modelo se sacude y suelta polvo.
   */
  useGSAP(
    () => {
      const fx = fxRef.current;
      const slot = slotRef.current;
      const model = modelRef.current;

      if (!validation || !selectedOption || !fx || !slot || !model) return;

      const at = () => centerIn(slot.getBoundingClientRect(), fx.getBoundingClientRect());

      if (success) {
        playSound(SOUNDS.POP);
        if (!canAnimate) return;

        ring(fx, at(), css.ring, '#f9a825');
        burst(fx, at(), { className: css.shard, colors: FX_COLORS.bricks, count: 20, reach: [70, 170], size: [8, 14] });
        gsap.fromTo(
          model.querySelectorAll('[data-row]'),
          { y: 0 },
          { y: -10, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out', stagger: { each: 0.09, from: 'end' } }
        );
      } else {
        playSound(SOUNDS.DROP);
        if (!canAnimate) return;

        burst(fx, at(), {
          className: css.shard,
          colors: FX_COLORS.debris,
          count: 10,
          reach: [30, 80],
          size: [6, 11],
          gravity: 26
        });
        gsap.fromTo(model, { x: -6 }, { x: 6, duration: 0.07, repeat: 5, yoyo: true, clearProps: 'x' });
        gsap.to(slot.querySelector('[data-piece]'), {
          y: 40,
          rotation: 14,
          opacity: 0,
          duration: 0.5,
          delay: 0.25,
          ease: 'power2.in'
        });
      }

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [validation, selectedOption?.id, canAnimate] }
  );

  return (
    <div
      ref={rootRef}
      className={` ${css.lego__container}   ${addClass ?? ''} `}
      style={{ '--bg-image': `url(${bg})` } as React.CSSProperties}
      {...props}
    >
      <h2 id={questionId} className={`${css.lego__question} ${questionClass}`}>
        {label}
      </h2>

      <ValidationStatus validated={validation} correct={success} />

      {/* El modelo: le falta una pieza y la respuesta elegida encaja ahí. Es decorativo: el estado ya lo dicen las opciones */}
      <div className={css.build} aria-hidden="true">
        <span className={css['build-caption']}>{t.missingPiece}</span>

        <LegoModel
          modelRef={modelRef}
          slotRef={slotRef}
          slotState={slotState}
          color={selectedOption?.color}
          letter={letter}
          filled={!!selectedOption}
        />
      </div>

      <div className={css.lego__options} role="radiogroup" aria-labelledby={questionId}>
        {Children.map(children, (child, i) =>
          isValidElement(child) ? cloneElement(child, { brick: i } as object) : child
        )}
      </div>

      {/* Capa de efectos: la pieza que vuela y los fragmentos */}
      <div ref={fxRef} className={css.fx} aria-hidden="true" />
    </div>
  );
};
