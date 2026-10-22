import { useId, useRef } from 'react';
import gsap from 'gsap';

import { ValidationStatus } from '@/components/ui';
import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { useThisOrThatGameContext } from './game-this-or-that-context';
import { BACKGROUND } from './lib/constant';

import css from './this-or-that.module.css';

interface GameThisOrThatLevelProps {
  children: React.ReactNode;
  addClass?: string;
  backgroundImage?: string;
  questionNumber?: number;
  question: string;
}

const PICK = ['#00828c', '#6072a5', '#f9f8db', '#ffffff'] as const;
const PRAISE = ['#2fbf8f', '#ffd35a', '#ffffff', '#f9f8db', '#00828c'] as const;
const DUST = ['#c9d3e0', '#8c95a8', '#e07a6f', '#ffffff'] as const;
const SHARD_SHAPES = [
  'circle(50%)',
  'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
  'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
];

export const GameThisOrThatLevel: React.FC<GameThisOrThatLevelProps> = ({
  children,
  addClass,
  backgroundImage,
  questionNumber,
  question,
  ...props
}) => {
  const safeSrc = (rawSrc: string): string => rawSrc.replace(/\s/g, ''); // Elimina espacios en blanco accidentales
  const bg = backgroundImage ? backgroundImage : safeSrc(BACKGROUND); // Fondo de pantalla
  const questionId = useId();
  const { validation, result, options, rootRef } = useThisOrThatGameContext();
  const canAnimate = useCanAnimate(); // Falso con "reducir movimiento" o "detener animaciones"

  const numberRef = useRef<HTMLParagraphElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);

  const selectedId = options[options.length - 1]?.id ?? null;
  const mood = validation ? (result ? 'success' : 'wrong') : selectedId ? 'picked' : 'idle';
  const state = validation ? (result ? 'success' : 'wrong') : undefined;

  /**
   * Las cartas reaccionan al juego (solo con movimiento permitido): al elegir la carta rebota y suelta una onda;
   * al acertar festeja con destellos y el número de la pregunta da la vuelta; al fallar se sacude y levanta polvo.
   */
  useGSAP(
    () => {
      const root = rootRef.current;
      const fx = fxRef.current;
      const number = numberRef.current;

      if (!root || !fx) return;

      const labels = Array.from(root.querySelectorAll<HTMLElement>('label[data-state]'));

      // Vuelven a su sitio (reintento o sin animaciones)
      gsap.set([...labels, ...(number ? [number] : [])], { clearProps: 'transform' });
      if (!canAnimate || mood === 'idle') return;

      const at = (el: Element) => centerIn(el.getBoundingClientRect(), fx.getBoundingClientRect());
      // Si el efecto se cancela a mitad (p. ej. el doble montaje de desarrollo) los fragmentos no se quedan en la capa
      const cleanup = () => fx.replaceChildren();

      if (mood === 'picked') {
        const card = root.querySelector<HTMLElement>(`#${CSS.escape(selectedId ?? '')} + label`);

        if (!card) return;

        gsap.fromTo(card, { scale: 1.06 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });

        const letter = card.querySelector('[data-id="letter"]');

        if (letter)
          gsap.fromTo(
            letter,
            { rotation: -180, scale: 0.6 },
            { rotation: 0, scale: 1, duration: 0.45, ease: 'back.out(2)' }
          );

        ring(fx, at(card), css.ring, '#00828c', 0.5);
        burst(fx, at(card), {
          className: css.shard,
          colors: PICK,
          shapes: SHARD_SHAPES,
          count: 8,
          reach: [40, 90],
          size: [6, 11],
          gravity: 18
        });

        return cleanup;
      }

      if (mood === 'success') {
        labels.forEach((card) => {
          gsap.fromTo(card, { scale: 1 }, { scale: 1.06, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1 });
          ring(fx, at(card), css.ring, '#2fbf8f', 0.5);
          burst(fx, at(card), {
            className: css.shard,
            colors: PRAISE,
            shapes: SHARD_SHAPES,
            count: 16,
            reach: [70, 170],
            size: [7, 14]
          });
        });

        if (number) {
          gsap.fromTo(number, { rotationY: 0 }, { rotationY: 360, duration: 0.7, ease: 'power2.inOut' });
          burst(fx, at(number), {
            className: css.shard,
            colors: PRAISE,
            shapes: SHARD_SHAPES,
            count: 10,
            reach: [40, 100],
            size: [6, 12],
            gravity: 14
          });
        }

        return cleanup;
      }

      // wrong: se sacuden solo las cartas equivocadas
      labels
        .filter((card) => card.dataset.state === 'wrong')
        .forEach((card) => {
          gsap
            .timeline({ defaults: { duration: 0.09 } })
            .to(card, { x: -10, rotation: -1.5 })
            .to(card, { x: 10, rotation: 1.5, duration: 0.11 })
            .to(card, { x: -6, rotation: -1, duration: 0.11 })
            .to(card, { x: 0, rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.35)' });
          burst(fx, at(card), {
            className: css.shard,
            colors: DUST,
            count: 8,
            reach: [40, 90],
            size: [6, 11],
            gravity: 18
          });
        });

      if (number) {
        gsap
          .timeline({ defaults: { duration: 0.09 } })
          .to(number, { rotation: -14 })
          .to(number, { rotation: 14, duration: 0.11 })
          .to(number, { rotation: -8, duration: 0.11 })
          .to(number, { rotation: 0, duration: 0.35, ease: 'elastic.out(1, 0.4)' });
      }

      return cleanup;
    },
    { scope: rootRef, dependencies: [mood, selectedId, canAnimate] }
  );

  return (
    <div
      ref={rootRef}
      className={`${css['container-element']} ${addClass ? addClass : ''}`}
      style={{ '--bg-image': `url("${bg}")` } as React.CSSProperties}
      {...props}
    >
      <div data-id="card" role="group" aria-labelledby={questionId} className={css['card-element']}>
        <div className={css['number-question-container']}>
          {questionNumber && (
            <p ref={numberRef} className={css['number-question']} data-state={state}>
              {questionNumber}
            </p>
          )}
        </div>
        <div className={`${css['question']}`} data-id="question" data-state={state} id={questionId}>
          <p className="u-font-bold u-text-center" dangerouslySetInnerHTML={{ __html: question }} />
        </div>
        <ValidationStatus validated={validation} correct={result} />
        <div className={css['container-options']} data-id="options" role="radiogroup" aria-labelledby={questionId}>
          {children}
        </div>
      </div>

      {/* Capa de efectos: ondas y destellos */}
      <div ref={fxRef} className={css.fx} aria-hidden="true" />
    </div>
  );
};
