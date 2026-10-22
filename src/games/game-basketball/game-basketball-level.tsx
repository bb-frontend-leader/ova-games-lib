import { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';

import { ValidationStatus } from '@/components/ui';
import { SOUNDS } from '@/constants';
import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useLang, usePlaySound } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { useRadioBasketActivityContext } from './game-basketball-context';
import { BACKGROUND, BALL, i18n } from './lib/constant';
import { accuracyOf, rankOf } from './lib/score';

import css from './game-basketball.module.css';

interface PropsGameBasketballLevel {
  addClass?: string;
  question: string;
  children: JSX.Element | JSX.Element[];
  /** Siguiente tiro: se muestra dentro del juego después de encestar. La página cambia la pregunta (con `key`). */
  onNextShot?: () => void;
  /** Es el último tiro: en vez de "Siguiente tiro" aparece "Ver marcador final". */
  last?: boolean;
}

const CONFETTI = ['#ffb627', '#ffffff', '#e8591a', '#ffd98a'] as const;
const SHARD_SHAPES = [
  'circle(50%)',
  'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
  'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
];

const safeSrc = (rawSrc: string): string => rawSrc.replace(/\s/g, ''); // Elimina espacios en blanco accidentales

/** Cifra del marcador que cuenta hacia arriba cuando cambia. El número animado es decorativo: se lee el valor final. */
const Digits = ({ value, from, className = '', ...rest }: { value: number; from?: number; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(from ?? value);
  const canAnimate = useCanAnimate();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (!canAnimate) {
        shown.current = value;
        el.textContent = String(value);
        return;
      }

      const obj = { v: shown.current };

      gsap.to(obj, {
        v: value,
        duration: from === undefined ? 0.5 : 1.3,
        ease: 'power2.out',
        onUpdate: () => {
          shown.current = obj.v;
          el.textContent = String(Math.round(obj.v));
        },
        onComplete: () => {
          shown.current = value;
          el.textContent = String(value);
        }
      });
    },
    { dependencies: [value, canAnimate] }
  );

  return <span ref={ref} className={`${css.digits} ${className}`} aria-hidden="true" {...rest} />;
};

/** Fin del partido: el marcador final con los puntos, las canastas, la mejor racha y el título del jugador. */
const Final = () => {
  const lang = useLang();
  const t = i18n[lang];
  const titleId = useId();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const ballRef = useRef<HTMLImageElement>(null);
  const playSound = usePlaySound();
  const { score, made, missed, bestStreak, fxRef, levelRef, canAnimate } = useRadioBasketActivityContext();

  const attempts = made + missed;
  const rank = rankOf(made, attempts);

  // Llega el foco y, con movimiento, el balón bota tres veces y estalla el confeti
  useGSAP(
    () => {
      titleRef.current?.focus({ preventScroll: true });
      playSound(SOUNDS.LEVEL_COMPLETE);

      const fx = fxRef.current;
      const panel = panelRef.current;
      if (!canAnimate || !fx || !panel) return;

      const at = centerIn(panel.getBoundingClientRect(), fx.getBoundingClientRect());

      ring(fx, at, css.ring, '#ffb627');
      burst(fx, at, {
        className: css.shard,
        colors: CONFETTI,
        shapes: SHARD_SHAPES,
        count: 26,
        reach: [120, 280],
        size: [8, 16]
      });
      gsap.fromTo(ballRef.current, { y: -70 }, { y: 0, duration: 0.42, ease: 'bounce.out', delay: 0.15 });

      // Si el efecto se cancela a mitad (p. ej. el doble montaje de desarrollo) los fragmentos no se quedan en la capa
      return () => fx.replaceChildren();
    },
    { scope: levelRef }
  );

  return (
    <section ref={panelRef} className={css.final} aria-labelledby={titleId}>
      <p className={css['final-sub']}>{t.finalSub}</p>
      <h3 id={titleId} ref={titleRef} tabIndex={-1} className={css['final-title']}>
        {t.finalTitle}
      </h3>

      <div className={css['final-hero']}>
        <img ref={ballRef} src={safeSrc(BALL)} alt="" className={css['final-ball']} />
        <p className={css['final-score']}>
          <span className={css['sr-only']}>
            {t.score}: {score}
          </span>
          <Digits value={score} from={0} className={css['final-digits']} />
        </p>
      </div>

      <p className={css['final-rank']}>{t.ranks[rank]}</p>

      <dl className={css['final-stats']}>
        <div>
          <dt>{t.baskets}</dt>
          <dd>{t.basketsOf(made, attempts)}</dd>
        </div>
        <div>
          <dt>{t.bestStreak}</dt>
          <dd>{bestStreak}</dd>
        </div>
        <div>
          <dt>{t.accuracy}</dt>
          <dd>{accuracyOf(made, attempts)} %</dd>
        </div>
      </dl>
    </section>
  );
};

export const GameBasketballLevel: React.FC<PropsGameBasketballLevel> = ({
  question,
  addClass,
  children,
  onNextShot,
  last = false,
  ...props
}) => {
  const lang = useLang();
  const t = i18n[lang];
  const questionId = useId();
  const playSound = usePlaySound();
  const {
    validation,
    revealed,
    result,
    options,
    score,
    streak,
    gained,
    made,
    missed,
    landed,
    finished,
    levelRef,
    fxRef,
    handleReset,
    openFinal
  } = useRadioBasketActivityContext();

  const bg = safeSrc(BACKGROUND.cover); // Fondo de pantalla
  const attempts = made + missed;
  // Después de encestar y de que los puntos llegan al marcador, el camino sigue dentro del juego
  const canContinue = validation && result && landed && !finished && (last || !!onNextShot);
  // Hasta que los puntos del tiro llegan, el marcador sigue en lo anterior
  const pending = validation && result && !landed;
  const shownScore = pending ? score - gained : score;
  const shownStreak = pending ? streak - 1 : streak;
  const aimed = options[0]?.letter;
  // Para quien usa lector de pantalla: lo que pasó en la cancha, dicho una sola vez
  const message = finished
    ? t.finalMsg(score, made, attempts)
    : validation
      ? result
        ? t.made(gained, streak, score)
        : t.missed(score)
      : aimed
        ? t.aim(aimed)
        : '';

  const goNext = () => {
    playSound(SOUNDS.BUTTON);

    if (last) {
      openFinal();
    } else {
      handleReset();
      onNextShot?.();
    }
  };

  // El botón aparece cuando el puntaje llega al marcador: el foco pasa a él para seguir con el teclado
  useEffect(() => {
    if (!canContinue) return;

    const frame = requestAnimationFrame(() => {
      const active = document.activeElement as HTMLElement | null;
      const lost = !active || active === document.body || (active as HTMLButtonElement).disabled;

      if (lost) levelRef.current?.querySelector<HTMLElement>('[data-next-shot]')?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [canContinue, levelRef]);

  return (
    <div ref={levelRef} className={`${css.radios__container} ${addClass ?? ''}`} {...props}>
      {/* Marcador del partido */}
      <div className={css.scoreboard} role="group" aria-label={t.scoreboard}>
        <div className={css['score-cell']}>
          <span className={css['score-label']}>{t.score}</span>
          <span className={css['sr-only']}>{shownScore}</span>
          <Digits value={shownScore} className={css['score-digits']} data-score />
        </div>
        <div className={css['score-cell']} data-hot={shownStreak > 1 || undefined}>
          <span className={css['score-label']}>{t.streak}</span>
          <span className={css['sr-only']}>{shownStreak}</span>
          <span className={css['score-digits']} aria-hidden="true">
            <svg viewBox="0 0 24 24" className={css.flame} focusable="false">
              <path d="M12 2c1 4-2 5-2 8 0 1.5.8 2.5 2 2.5 0-2 2-3 3-5 2 2 4 4.5 4 7.5a7 7 0 0 1-14 0c0-3 2-5 3.5-7 .5 1.5 1 2 1.5 2C11 7.5 12 5 12 2z" />
            </svg>
            {shownStreak}
          </span>
        </div>
        <div className={css['score-cell']}>
          <span className={css['score-label']}>{t.shots}</span>
          <span className={css['score-digits']}>
            {made}/{attempts}
          </span>
        </div>
      </div>

      <div className={css.radio__options} style={{ '--bg-image': `url("${bg}")` } as React.CSSProperties}>
        {finished ? (
          <Final />
        ) : (
          <>
            <div className={css.radio__options_container} role="radiogroup" aria-labelledby={questionId}>
              {children}
            </div>

            {/* De aquí sale el balón; después de encestar, aquí mismo aparece el botón para seguir */}
            <div className={css.launch}>
              <img
                src={safeSrc(BALL)}
                alt=""
                className={css['launch-ball']}
                data-launch
                data-gone={validation || undefined}
              />
              {canContinue && (
                <button type="button" className={css['next-shot']} data-next-shot onClick={goNext}>
                  {last ? t.finalButton : t.nextShot}
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={css['next-shot-arrow']}>
                    <path d="m9 5 7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {!finished && (
        <div className={css.radio__question}>
          <div className={css.radio__question_container}>
            <img src={safeSrc(BACKGROUND.left)} alt="" />
            <span id={questionId} dangerouslySetInnerHTML={{ __html: question }} />
            <img src={safeSrc(BACKGROUND.right)} alt="" />
          </div>
        </div>
      )}

      <p className={css['sr-only']} role="status">
        {message}
      </p>

      <ValidationStatus validated={validation && revealed} correct={result} />

      {/* Capa de efectos: el balón en vuelo, ondas, confeti y los puntos que viajan al marcador */}
      <div className={css.fx} ref={fxRef} aria-hidden="true" />
    </div>
  );
};
