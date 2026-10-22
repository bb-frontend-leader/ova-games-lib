import type { ReactNode } from 'react';
import { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';

import { ValidationStatus } from '@/components/ui';
import { SOUNDS } from '@/constants';
import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, usePlaySound } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { Box } from './game-castle-box';
import { useGameCastleContext } from './game-castle-context';
import { GameCastleHero } from './game-castle-hero';
import { GameCastleScene } from './game-castle-scene';
import { FX_COLORS } from './lib/constant';

import css from './game-castle.module.css';

interface propsLevel {
  content?: ReactNode;
  title?: string;
  alt?: string;
}

const RUN_S = 0.55;

export function GameCastleLevel({ title, alt, content }: propsLevel) {
  const uid = useId();
  const questionId = useId();
  const { addSelectAnswer, selectAnswers, openModal, question } = useGameCastleContext();

  const canAnimate = useCanAnimate(); // Falso con "reducir movimiento" o "detener animaciones"
  const playSound = usePlaySound();

  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLSpanElement>(null);
  const doorRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const prevModal = useRef(openModal);

  // Lo que pasa en el escenario: a la espera, con un bloque elegido, o con el resultado
  const mood = openModal ? (openModal === 'success' ? 'win' : 'lose') : selectAnswers ? 'picked' : 'idle';

  // Al reintentar el foco vuelve al primer bloque: el botón «Reintentar» queda desactivado
  useEffect(() => {
    if (prevModal.current === 'wrong' && openModal === null) {
      stageRef.current?.querySelector<HTMLElement>('[data-block]')?.focus({ preventScroll: true });
    }

    prevModal.current = openModal;
  }, [openModal]);

  /**
   * El héroe corre hasta el bloque elegido y salta; al comprobar lo golpea: si acierta sale una moneda y corre a la
   * puerta del castillo (que se abre sola por CSS); si falla, el bloque se rompe, el héroe rebota y suelta polvo.
   * Sin movimiento permitido solo se coloca en su sitio (bloque o puerta).
   */
  useGSAP(
    () => {
      const stage = stageRef.current;
      const hero = heroRef.current;
      const sprite = spriteRef.current;
      const door = doorRef.current;
      const fx = fxRef.current;

      if (!stage || !hero || !sprite || !door || !fx) return;

      gsap.killTweensOf([hero, sprite]);

      const picked = stage.querySelector<HTMLElement>('[data-block][aria-pressed="true"]');
      const box = picked?.querySelector<HTMLElement>('img') ?? null;
      const layer = fx.getBoundingClientRect();
      const x0 = Number(gsap.getProperty(hero, 'x'));
      const home = hero.getBoundingClientRect().left + hero.offsetWidth / 2 - x0; // Dónde está el héroe sin moverse
      const toX = (target: HTMLElement) => target.getBoundingClientRect().left + target.offsetWidth / 2 - home;
      const clearFx = () => fx.replaceChildren();

      /** Corre hasta `x` (dando saltitos) y devuelve lo que dura la carrera. */
      const goTo = (x: number) => {
        if (!canAnimate) {
          gsap.set(hero, { x, y: 0 });
          return 0;
        }

        const dist = Math.abs(x - x0);
        const t = Math.min(1, dist / 320 + 0.25) * RUN_S * 1.4;

        gsap.set(sprite, { scaleX: x < x0 ? -1 : 1 });
        gsap.to(sprite, {
          y: -4,
          duration: 0.11,
          repeat: Math.max(1, Math.round(t / 0.11)),
          yoyo: true,
          ease: 'sine.inOut'
        });
        gsap.to(hero, { x, duration: t, ease: 'power1.inOut' });

        return t;
      };

      if (mood === 'idle') {
        gsap.set(sprite, { scaleX: 1, y: 0 });
        goTo(0);
        return;
      }

      if (!picked || !box) return;

      const blockX = toX(picked);

      if (mood === 'picked') {
        const run = goTo(blockX);

        if (canAnimate) {
          playSound(SOUNDS.TICK);
          gsap
            .timeline({ delay: run })
            .set(sprite, { scaleX: 1 })
            .to(hero, { y: -26, duration: 0.18, ease: 'power2.out' })
            .to(hero, { y: 0, duration: 0.22, ease: 'bounce.out' })
            .fromTo(box, { y: 0 }, { y: -8, duration: 0.1, yoyo: true, repeat: 1 }, 0.1);
        }
        return;
      }

      const at = () => centerIn(box.getBoundingClientRect(), fx.getBoundingClientRect());

      if (mood === 'win') {
        if (!canAnimate) {
          goTo(toX(door));
          return;
        }

        gsap.set(hero, { x: blockX });
        gsap
          .timeline()
          .to(hero, { y: -30, duration: 0.2, ease: 'power2.out' })
          .call(() => {
            playSound(SOUNDS.POP);
            ring(fx, at(), css.ring, '#ffd23f');
            burst(fx, at(), {
              className: css.shard,
              colors: FX_COLORS.gold,
              count: 14,
              reach: [40, 110],
              size: [6, 11]
            });
          })
          .fromTo(box, { y: 0 }, { y: -10, duration: 0.1, yoyo: true, repeat: 1 }, '<0.1')
          .to(hero, { y: 0, duration: 0.25, ease: 'bounce.out' })
          .call(() => {
            playSound(SOUNDS.UNLOCK);
            gsap.set(hero, { x: blockX }); // La carrera parte del bloque
            goTo(toX(door));
          })
          .to({}, { duration: 1.1 })
          .call(() => {
            const gate = centerIn(door.getBoundingClientRect(), layer);

            ring(fx, gate, css.ring, '#ffd23f');
            burst(fx, gate, {
              className: css.shard,
              colors: FX_COLORS.gold,
              count: 22,
              reach: [70, 170],
              size: [7, 14]
            });
          })
          .to(hero, { y: -22, duration: 0.16, yoyo: true, repeat: 3, ease: 'power2.out' });

        return clearFx;
      }

      // lose
      if (!canAnimate) return;

      playSound(SOUNDS.DROP);
      burst(fx, at(), {
        className: css.shard,
        colors: FX_COLORS.dust,
        count: 10,
        reach: [30, 80],
        size: [6, 11],
        gravity: 22
      });
      gsap
        .timeline({ defaults: { transformOrigin: '50% 100%' } })
        .to(hero, { y: -22, duration: 0.14, ease: 'power2.out' })
        .to(hero, { y: 0, rotation: -12, duration: 0.2, ease: 'bounce.out' })
        .to(hero, { rotation: 8, x: `+=${6}`, duration: 0.1 })
        .to(hero, { rotation: 0, x: `-=${6}`, duration: 0.3, ease: 'elastic.out(1, 0.4)' });
      gsap.fromTo(box, { x: -5 }, { x: 5, duration: 0.06, repeat: 5, yoyo: true, clearProps: 'x' });

      return clearFx;
    },
    { scope: stageRef, dependencies: [mood, selectAnswers, canAnimate] }
  );

  return (
    <div id={uid} className="u-flow">
      {content}
      <div className="u-flow">
        <div className={css.frame}>
          <div ref={stageRef} className={css.stage} data-mood={mood}>
            <GameCastleScene ref={doorRef} />

            <p id={questionId} className={`${css.plaque} ${css.question}`} data-mood={mood}>
              {question?.question}
            </p>

            <ValidationStatus validated={openModal !== null} correct={openModal === 'success'} />

            <div className={css.blocks} role="group" aria-labelledby={questionId}>
              {question?.answers?.map((q, i) => (
                <Box
                  key={q + i}
                  id={i}
                  question={q}
                  isDisabled={!!openModal}
                  isPressed={q === selectAnswers}
                  isCorrect={openModal === 'success'}
                  addSelectAnswer={addSelectAnswer}
                />
              ))}
            </div>

            <GameCastleHero ref={heroRef} sprite={spriteRef} />

            {/* Capa de efectos: monedas, estrellas y polvo */}
            <div ref={fxRef} className={css.fx} aria-hidden="true" />
          </div>
        </div>

        <p className="u-text-center">
          <strong>{title}</strong> {alt}
        </p>
      </div>
    </div>
  );
}
