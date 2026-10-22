import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

import { FullScreenAlert } from '@/components/ui';
import { SOUNDS } from '@/constants';
import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useLang, usePlaySound } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { useGameMoneyActivityContext } from './game-money-context';
import { BACKGROUND, CHARACTER, i18n, MONEY } from './lib/constant';

import css from './game-money.module.css';

interface Props {
  children: JSX.Element | JSX.Element[];
  addClass?: string;
  label: string;
}

const GOLD = ['#ffd35a', '#ffe9a3', '#ffffff', '#f5a524'] as const;
const DUST = ['#8a6a4a', '#c9a77c', '#4a3322', '#e3cfae'] as const;
const SHARD_SHAPES = [
  'circle(50%)',
  'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
  'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
];
const COINS = 18;

/**
 * Lluvia de monedas desde arriba de la capa de efectos, alrededor de `cx` (px), repartidas en `spread` px a cada lado.
 */
const coinRain = (fx: HTMLElement, cx: number, count: number, spread: number) => {
  const layer = fx.getBoundingClientRect();

  for (let i = 0; i < count; i++) {
    const coin = document.createElement('span');
    const duration = gsap.utils.random(0.8, 1.2);
    const delay = i * 0.045;

    coin.className = css.coin;
    coin.textContent = '$';
    fx.appendChild(coin);

    gsap.set(coin, {
      x: cx + gsap.utils.random(-spread, spread),
      y: -30,
      xPercent: -50,
      rotation: gsap.utils.random(-40, 40)
    });
    gsap.to(coin, {
      y: layer.height * gsap.utils.random(0.6, 0.88),
      rotation: `+=${gsap.utils.random(-180, 180)}`,
      duration,
      delay,
      ease: 'power1.in',
      onComplete: () => coin.remove()
    });
    // Giro de la moneda sobre su eje
    gsap.to(coin, { scaleX: 0.2, duration: 0.18, yoyo: true, repeat: 5, delay, ease: 'sine.inOut' });
    gsap.to(coin, { opacity: 0, duration: 0.2, delay: delay + duration - 0.2 });
  }
};

export const GameMoneyLevel: React.FC<Props> = ({ children, label, addClass, ...props }) => {
  const { validation, options, result, rootRef, finished, attempts, handleRestart } = useGameMoneyActivityContext();
  const lang = useLang();
  const t = i18n[lang];
  const canAnimate = useCanAnimate(); // Falso con "reducir movimiento" o "detener animaciones"
  const playSound = usePlaySound();
  const questionId = useId();
  const endId = useId();
  const againRef = useRef<HTMLButtonElement>(null);

  const safeSrc = (rawSrc: string): string => rawSrc.replace(/\s/g, ''); // Elimina espacios en blanco accidentales
  const bg = safeSrc(BACKGROUND); // Fondo de pantalla

  const optionsRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const [characterLeftPx, setCharacterLeftPx] = useState<number | null>(null);

  // Si solo hay un grupo, basta con el primer seleccionado
  const selectedId = useMemo(() => options[0]?.id ?? null, [options]);
  const mood = validation ? (result ? 'success' : 'wrong') : selectedId ? 'picked' : 'idle';
  const message = finished
    ? t.end.announce(attempts)
    : mood === 'idle'
      ? ''
      : mood === 'picked'
        ? t.picked(options[0]?.label ?? '')
        : t[mood];

  /**
   * Calcula la coordenada x relativa ao contenedor do elemento com o id passado como par metro.
   *
   * @param {string} optionId - Id do elemento.
   * @returns {number | null} Coordenada x relativa ao contenedor ou null se o elemento nao for encontrado.
   */
  const computeCenterX = (optionId: string): number | null => {
    const container = optionsRef.current;
    if (!container) return null;

    const containerRect = container.getBoundingClientRect();
    const el = container.querySelector(`[data-option-id="${optionId}"]`) as HTMLElement | null;
    if (!el) return null;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    return centerX - containerRect.left; // px relativo al contenedor
  };

  /**
   * Recalcula a coordenada x do personagem para o centro do container
   * com base na op o selecionada.
   * Se n o houver nenhuma op o selecionada, retorna null.
   * @returns {number | null} Coordenada x relativa ao contenedor ou null se n o houver nenhuma op o selecionada.
   */
  const recalc = () => {
    const container = optionsRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    // Si el contenedor aún no tiene ancho real, no calcules (reintenta luego)
    if (!containerRect.width) return;

    const fallbackCenter = containerRect.width / 2;

    if (!selectedId) {
      setCharacterLeftPx(fallbackCenter);
      return;
    }

    const x = computeCenterX(selectedId);

    // Si x es null, NaN o 0 (layout aún no listo), usa fallback centro
    if (x == null || Number.isNaN(x) || x <= 1) {
      setCharacterLeftPx(fallbackCenter);
      return;
    }

    setCharacterLeftPx(x);
  };

  /**
   * Recalcula a coordenada x do personagem para o centro do container
   */
  useLayoutEffect(() => {
    let raf1 = 0;
    let raf2 = 0;

    raf1 = requestAnimationFrame(() => {
      recalc();
      raf2 = requestAnimationFrame(() => recalc());
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, children, validation, result]);

  /**
   * Recalcula a coordenada x do personagem para o centro do container
   */
  useEffect(() => {
    const onResize = () => recalc();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  /**
   * El banquero reacciona al juego (solo con movimiento permitido): al elegir camina hasta la opción con pasitos
   * mientras la opción hace un rebote; al acertar salta dos veces entre una lluvia de monedas; al fallar niega
   * con la cabeza y levanta polvo.
   */
  useGSAP(
    () => {
      const body = bodyRef.current;
      const glow = glowRef.current;
      const fx = fxRef.current;
      const root = rootRef.current;

      if (!body || !glow || !fx || !root) return;

      // Vuelve a su sitio (reintento o sin animaciones)
      gsap.set([body, glow], { clearProps: 'transform' });
      if (!canAnimate || mood === 'idle') return;

      const at = () => centerIn(body.getBoundingClientRect(), fx.getBoundingClientRect());
      // Si el efecto se cancela a mitad (p. ej. el doble montaje de desarrollo) los fragmentos no se quedan en la capa
      const cleanup = () => fx.replaceChildren();

      if (mood === 'picked') {
        const card = root.querySelector(`[data-option-id="${CSS.escape(selectedId ?? '')}"] label`);
        if (card) gsap.fromTo(card, { scale: 1.07 }, { scale: 1, duration: 0.55, ease: 'back.out(3)' });

        // Cuatro pasitos mientras se desliza bajo la opción (1 s)
        const walk = gsap.timeline({ defaults: { transformOrigin: '50% 100%' } });

        [-3, 3, -3, 3].forEach((tilt) => {
          walk
            .to(body, { y: -9, rotation: tilt, duration: 0.12, ease: 'power1.out' })
            .to(body, { y: 0, duration: 0.13, ease: 'power1.in' });
        });
        walk.to(body, { rotation: 0, duration: 0.2 });

        return;
      }

      const feet = () => {
        const p = at();
        return { x: p.x, y: p.y + body.getBoundingClientRect().height / 2 - 6 };
      };

      if (mood === 'success') {
        gsap.fromTo(glow, { scale: 0.6 }, { scale: 1, duration: 0.7, ease: 'power2.out' });

        gsap
          .timeline({ defaults: { transformOrigin: '50% 100%' } })
          .to(body, { scaleY: 0.94, scaleX: 1.04, duration: 0.12, ease: 'power2.in' })
          .call(() => {
            playSound(SOUNDS.UNLOCK);
            ring(fx, at(), css.ring, '#ffd35a');
            burst(fx, at(), {
              className: css.shard,
              colors: GOLD,
              shapes: SHARD_SHAPES,
              count: 20,
              reach: [90, 210],
              size: [7, 15]
            });

            coinRain(fx, at().x, COINS, 170);
          })
          .to(body, { scaleY: 1.04, scaleX: 0.98, y: -38, duration: 0.28, ease: 'power2.out' })
          .to(body, { scaleY: 1, scaleX: 1, y: 0, duration: 0.35, ease: 'bounce.out' })
          .to(body, { y: -20, duration: 0.2, ease: 'power2.out' }, '+=0.05')
          .to(body, { y: 0, duration: 0.3, ease: 'bounce.out' });

        return cleanup;
      }

      // wrong
      playSound(SOUNDS.DROP);
      gsap.fromTo(glow, { scale: 0.7 }, { scale: 1, duration: 0.5, ease: 'power2.out' });
      burst(fx, feet(), { className: css.shard, colors: DUST, count: 10, reach: [40, 90], size: [6, 12], gravity: 18 });
      gsap
        .timeline({ defaults: { transformOrigin: '50% 100%' } })
        .to(body, { x: -9, rotation: -3, duration: 0.09 })
        .to(body, { x: 9, rotation: 3, duration: 0.11 })
        .to(body, { x: -6, rotation: -2, duration: 0.11 })
        .to(body, { x: 0, rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.35)' });

      return cleanup;
    },
    { scope: rootRef, dependencies: [mood, selectedId, canAnimate] }
  );

  /**
   * Pantalla final: el foco pasa a «Jugar de nuevo» y, con movimiento permitido, la tarjeta suelta una onda, destellos
   * y una segunda lluvia de monedas.
   */
  useGSAP(
    () => {
      const fx = fxRef.current;
      const card = againRef.current?.parentElement;

      if (!finished || !fx || !card) return;

      againRef.current?.focus({ preventScroll: true });
      if (!canAnimate) return;

      const at = centerIn(card.getBoundingClientRect(), fx.getBoundingClientRect());

      ring(fx, at, css.ring, '#ffd35a');
      burst(fx, at, {
        className: css.shard,
        colors: GOLD,
        shapes: SHARD_SHAPES,
        count: 18,
        reach: [90, 200],
        size: [7, 15]
      });
      coinRain(fx, at.x, COINS, 220);

      // Si el efecto se cancela a mitad (p. ej. el doble montaje de desarrollo) los fragmentos no se quedan en la capa
      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [finished, canAnimate] }
  );

  const characterImage = validation ? (result ? CHARACTER.success : CHARACTER.wrong) : CHARACTER.normal;

  return (
    <div className="u-flow">
      <FullScreenAlert />
      <div
        ref={rootRef}
        className={` ${css['background']} u-flow ${addClass ? addClass : ''}`}
        {...props}
        style={{ '--bg-image': `url("${bg}")` } as React.CSSProperties}
      >
        <div className={css['options-container']} ref={optionsRef} role="radiogroup" aria-labelledby={questionId}>
          {children}
        </div>
        <div className={css['character-container']} data-mood={mood} aria-hidden="true">
          {/* El banquero camina hasta la opción elegida (`left` con transición) y reacciona (`body`, animado con gsap) */}
          <div className={css.hero} style={characterLeftPx !== null ? { left: `${characterLeftPx}px` } : undefined}>
            <span ref={glowRef} className={css.glow} />
            <div ref={bodyRef} className={css['hero-body']}>
              <img src={safeSrc(characterImage)} alt="" className={css['character']} />
            </div>
          </div>
          {result && canAnimate && (
            <img
              key={`money-${validation}-${result}`} // fuerza remount si cambian flags
              src={safeSrc(MONEY)}
              alt=""
              className={`${css.money} ${css.moneyFall}`}
              style={{
                left: characterLeftPx !== null ? `${characterLeftPx}px` : '50%' // o donde lo quieras
              }}
            />
          )}
        </div>
        <p id={questionId} className={`${css['question-text']}`}>
          {label}
        </p>

        <p className={css['sr-only']} role="status">
          {message}
        </p>

        {finished && (
          <div className={css.end} role="group" aria-labelledby={endId}>
            <div className={css['end-card']}>
              <img src={safeSrc(MONEY)} alt="" className={css['end-money']} />
              <p id={endId} className={css['end-title']}>
                {t.end.title}
              </p>
              <p>{t.end.text}</p>
              <dl className={css['end-stats']}>
                <dt>{t.end.attemptsLabel}</dt>
                <dd>{t.end.attempts(attempts)}</dd>
              </dl>
              <button ref={againRef} type="button" className={css['gold-button']} onClick={handleRestart}>
                {t.end.again}
              </button>
            </div>
          </div>
        )}

        {/* Capa de efectos: monedas, destellos y polvo */}
        <div ref={fxRef} className={css.fx} aria-hidden="true" />
      </div>
    </div>
  );
};
