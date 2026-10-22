import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

import { SOUNDS } from '@/constants';
import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useLang, usePlaySound } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { i18n } from './const/const';
import mainIcon from './public/assets/main_icon.webp';
import { convertNumber } from './utils/convert-number';

import css from './game-millions.module.css';

interface GameMillionsEndProps {
  addClass?: string;
  /** Dinero acumulado: el contador sube hasta él. */
  money: number;
  /** Respuestas correctas y preguntas del juego (opcionales): muestran «Aciertos: 3 de 3». */
  correct?: number;
  total?: number;
  /** Botón «Jugar de nuevo»; la página reinicia su estado. Sin él no se muestra. */
  onRestart?: () => void;
}

const COIN_COLORS = ['#fccc19', '#ffe27a', '#f5a623', '#ffffff'] as const;
const COIN_SHAPES = [
  'circle(50%)',
  'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
  'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
];

/**
 * Pantalla final: el premio sube en el contador entre estallidos de monedas. El foco entra en el título.
 */
export const GameMillionsEnd: React.FC<GameMillionsEndProps> = ({ addClass, money, correct, total, onRestart }) => {
  const lang = useLang();
  const text = i18n[lang];
  const t = text.End;
  const canAnimate = useCanAnimate(); // Falso con "reducir movimiento" o "detener animaciones"
  const playSound = usePlaySound();

  const containerRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLParagraphElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const showHits = correct !== undefined && total !== undefined;

  useEffect(() => {
    playSound(SOUNDS.LEVEL_COMPLETE);
    titleRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // El número animado es decorativo (`aria-hidden`): el lector de pantalla lee el monto final
  useLayoutEffect(() => {
    if (valueRef.current) valueRef.current.textContent = convertNumber(canAnimate ? 0 : money);
  }, [money, canAnimate]);

  useGSAP(
    () => {
      const el = valueRef.current;
      const fx = fxRef.current;
      const box = boxRef.current;

      if (!canAnimate || !el || !fx || !box) return;

      const obj = { value: 0 };

      gsap.to(obj, {
        value: money,
        duration: 1.6,
        delay: 0.3,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = convertNumber(Math.floor(obj.value));
        },
        onComplete: () => {
          el.textContent = convertNumber(money);
        }
      });

      const at = centerIn(box.getBoundingClientRect(), fx.getBoundingClientRect());

      // Tres estallidos seguidos mientras el contador sube
      [0.3, 0.8, 1.4].forEach((delay, i) =>
        gsap.delayedCall(delay, () => {
          ring(fx, at, css.ring, '#fccc19');
          burst(fx, at, {
            className: css.shard,
            colors: COIN_COLORS,
            shapes: COIN_SHAPES,
            count: 14 + i * 4,
            reach: [90, 220],
            size: [8, 16]
          });
        })
      );

      // Si el efecto se cancela a mitad (p. ej. el doble montaje de desarrollo) los fragmentos no se quedan en la capa
      return () => fx.replaceChildren();
    },
    { scope: containerRef, dependencies: [money, canAnimate] }
  );

  return (
    <div className={`${css.container} ${css.screen} ${addClass ?? ''}`} ref={containerRef}>
      <div className={css['logo-wrap']}>
        <img className={css.logo} src={mainIcon} alt={text.Logo} />
      </div>

      <div className={`${css.plaque} ${css['plaque--title']}`}>
        <span className={css.frame} aria-hidden="true" />
        <h2 ref={titleRef} tabIndex={-1} className={css['plaque-text']}>
          {t.title}
        </h2>
      </div>

      <p ref={boxRef} className={css.counter}>
        <span className={css['sr-only']}>
          {text.Prize}: {convertNumber(money)}
        </span>
        <span ref={valueRef} aria-hidden="true" />
      </p>

      <p className={css['screen-text']}>
        {t.text(convertNumber(money))}
        {showHits && (
          <>
            {' '}
            <strong className={css.blank}>
              {t.hits}: {t.of(correct, total)}
            </strong>
          </>
        )}
      </p>

      {onRestart && (
        <div className={css['screen-actions']}>
          <button type="button" className={`${css['nav-button']} ${css['nav-button--gold']}`} onClick={onRestart}>
            <span className={css.halo} aria-hidden="true" />
            <span className={css.frame} aria-hidden="true" />
            <span className={css['nav-label']}>{t.again}</span>
          </button>
        </div>
      )}

      {/* Capa de efectos: monedas y ondas */}
      <div className={css.fx} ref={fxRef} aria-hidden="true" />
    </div>
  );
};
