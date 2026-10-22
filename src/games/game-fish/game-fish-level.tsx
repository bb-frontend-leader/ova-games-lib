import type { ReactNode } from 'react';
import { Children, cloneElement, isValidElement, useEffect, useId, useRef } from 'react';
import gsap from 'gsap';

import { ValidationStatus } from '@/components/ui';
import { SOUNDS } from '@/constants';
import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useLang, usePlaySound } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { useGameFishActivityContext } from './game-fish-context';
import { GameParallax } from './game-parallax';
import { BG, FX_COLORS, i18n } from './lib/constant';

import css from './game-fish.module.css';

interface Props {
  children: ReactNode;
  label: string;
}

const STAR = 'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';

export const GameFishLevel = ({ children, label }: Props) => {
  const { selectedLabel, validation, result, options } = useGameFishActivityContext();
  const lang = useLang();
  const t = i18n[lang];

  const canAnimate = useCanAnimate(); // Falso con "reducir movimiento" o "detener animaciones"
  const playSound = usePlaySound();
  const questionId = useId();

  const sceneRef = useRef<HTMLDivElement>(null);
  const rodRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const wasValidated = useRef(validation);

  const picked = options[0]?.id;
  const mood = validation ? (result ? 'win' : 'lose') : picked ? 'picked' : 'idle';

  // Al reintentar el foco vuelve al primer pez (el botón «Reintentar» queda desactivado)
  useEffect(() => {
    if (wasValidated.current && !validation) {
      sceneRef.current?.querySelector<HTMLElement>('[data-fish-btn]')?.focus({ preventScroll: true });
    }

    wasValidated.current = validation;
  }, [validation]);

  /**
   * Un anzuelo baja desde la superficie hasta el pez elegido (y lo sigue si cambia de pez). Al comprobar: si acierta,
   * el pez sube tirado por el sedal hasta el hueco de la frase y lo rellena entre destellos; si falla, se sacude,
   * se suelta del anzuelo y se escapa nadando entre burbujas. Sin movimiento permitido no hay anzuelo: solo cambian
   * los estados del pez.
   */
  useGSAP(
    () => {
      const scene = sceneRef.current;
      const rod = rodRef.current;
      const fx = fxRef.current;

      if (!scene || !rod || !fx) return;

      const wraps = Array.from(scene.querySelectorAll<HTMLElement>('[data-fish-wrap]'));

      gsap.killTweensOf([rod, ...wraps]);

      // Sin selección (o tras reintentar): todo vuelve a su sitio
      if (mood === 'idle') {
        gsap.set(wraps, { clearProps: 'all' });
        gsap.set(rod, { clearProps: 'all' });
        return;
      }

      const wrap = scene.querySelector<HTMLElement>('[data-fish-wrap][data-picked]');
      const img = wrap?.querySelector<HTMLElement>('img');

      if (!canAnimate || !wrap || !img) return;

      const box = scene.getBoundingClientRect();
      const rect = img.getBoundingClientRect();
      const fishX = rect.left + rect.width / 2 - box.left; // Centro del pez en el escenario
      const mouthY = rect.top - box.top + rect.height * 0.3; // Hasta dónde baja el anzuelo
      const at = () => centerIn(img.getBoundingClientRect(), fx.getBoundingClientRect());
      const bubbles = (point: { x: number; y: number }, count: number) =>
        burst(fx, point, {
          className: css.bubbleFx,
          colors: FX_COLORS.bubbles,
          count,
          reach: [20, 70],
          size: [6, 14],
          gravity: -40
        });

      if (mood === 'picked') {
        const hooked = gsap.getProperty(rod, 'height') !== 0;

        playSound(SOUNDS.POP);
        if (!hooked) gsap.set(rod, { x: fishX, height: 0, opacity: 1 });

        gsap.to(rod, { x: fishX, height: mouthY, duration: hooked ? 0.45 : 0.7, ease: 'power2.out' });
        gsap.fromTo(wrap, { rotation: -7 }, { rotation: 0, duration: 0.8, delay: 0.5, ease: 'elastic.out(1, 0.35)' });
        gsap.delayedCall(hooked ? 0.4 : 0.65, () => bubbles(at(), 5));

        return () => fx.replaceChildren();
      }

      if (mood === 'win') {
        const blank = scene.querySelector<HTMLElement>('[data-blank]');
        // En las frases con hueco el pez sube hasta él; en una pregunta normal, hasta la pregunta
        const question = questionRef.current;
        const goal = blank ?? question;
        const target = goal ? centerIn(goal.getBoundingClientRect(), box) : { x: fishX, y: Math.max(20, mouthY * 0.3) };
        const dx = target.x - fishX;
        const dy = target.y - (rect.top - box.top + rect.height / 2);

        wrap.style.zIndex = '12';
        playSound(SOUNDS.WHOOSH);

        gsap
          .timeline()
          .to(wrap, { rotation: 10, duration: 0.08, repeat: 3, yoyo: true })
          .to(wrap, { rotation: 0, duration: 0.08 })
          .to(wrap, { x: dx, y: dy, duration: 0.9, ease: 'power2.inOut' })
          .to(rod, { x: fishX + dx, height: mouthY + dy, duration: 0.9, ease: 'power2.inOut' }, '<')
          .call(() => {
            const spot = goal ? centerIn(goal.getBoundingClientRect(), fx.getBoundingClientRect()) : at();

            playSound(SOUNDS.POP);
            ring(fx, spot, css.ring, '#ffd23f');
            burst(fx, spot, {
              className: css.spark,
              colors: FX_COLORS.sparks,
              shapes: [STAR, 'circle(50%)'],
              count: 18,
              reach: [50, 130],
              size: [8, 16]
            });
          })
          .to(wrap, { scale: 0.3, opacity: 0, duration: 0.25, ease: 'power2.in' })
          .to(rod, { height: 0, duration: 0.35, ease: 'power2.in' }, '-=0.1');

        return () => fx.replaceChildren();
      }

      // lose
      const away = rect.left + rect.width / 2 - box.left < box.width / 2 ? -1 : 1; // Se escapa hacia su lado

      gsap
        .timeline()
        .to(wrap, { x: 7, rotation: 9, duration: 0.07, repeat: 7, yoyo: true })
        .to(rod, { height: mouthY - 14, duration: 0.12, yoyo: true, repeat: 1 }, '<')
        .call(() => {
          playSound(SOUNDS.DROP);
          bubbles(at(), 10);
        })
        .to(wrap, { x: away * 320, y: -30, rotation: away * 12, opacity: 0, duration: 0.55, ease: 'power2.in' })
        .to(rod, { height: 0, duration: 0.4, ease: 'power2.in' }, '-=0.25');

      return () => fx.replaceChildren();
    },
    { scope: sceneRef, dependencies: [mood, picked, canAnimate] }
  );

  const renderQuestion = () => {
    // Si la etiqueta no contiene el marcador de completar, se muestra normal
    if (!label.includes('___')) return <strong id={questionId}>{label}</strong>;

    const parts = label.split('___');
    return (
      <strong id={questionId}>
        {parts[0]}
        <span className={css['fill-blank']} data-blank data-result={validation ? (result ? 'ok' : 'ko') : undefined}>
          {selectedLabel || (
            <>
              <span aria-hidden="true">____</span>
              <span className={css['sr-only']}>{t.blank}</span>
            </>
          )}
        </span>
        {parts[1]}
      </strong>
    );
  };

  return (
    <div ref={sceneRef} className={css['init-container']}>
      <GameParallax />
      <div className={css['init-content']}>
        <div ref={questionRef} className={css['init-message-box']}>
          <img src={BG.ancla} className={css['anchor-icon']} alt="" />
          <div className={css['question-text']}>{renderQuestion()}</div>
          <img src={BG.ancla} className={css['anchor-icon']} alt="" />
        </div>
        <div className={css['fish-elements-wrapper']} role="group" aria-labelledby={questionId}>
          {Children.map(children, (child, i) =>
            isValidElement(child) ? cloneElement(child, { variant: i } as object) : child
          )}
        </div>
      </div>
      <ValidationStatus validated={validation} correct={result} />

      {/* Sedal y anzuelo: bajan desde la superficie hasta el pez elegido */}
      <div ref={rodRef} className={css.rod} aria-hidden="true">
        <span className={css.hook} />
      </div>

      {/* Capa de efectos: burbujas y destellos */}
      <div ref={fxRef} className={css.fx} aria-hidden="true" />
    </div>
  );
};
