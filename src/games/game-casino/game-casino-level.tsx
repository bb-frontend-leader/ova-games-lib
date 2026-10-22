import { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';

import { ValidationStatus } from '@/components/ui';
import { SOUNDS } from '@/constants';
import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useLang, usePlaySound } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { Chip, ChipStack } from './game-casino-chips';
import { useGameCasinoProvider } from './game-casino-context';
import { BET_CHIPS, chipKind, MIN_BET, START_POINTS, toChips } from './lib/chips';
import { BG, i18n } from './lib/constant';

import css from './game-casino.module.css';

interface Props {
  children: React.ReactNode;
  label: string;
  background?: string;
  /** Ronda siguiente: se muestra dentro del juego después de ganar. La página cambia la pregunta (con `key`). */
  onNextRound?: () => void;
  /** Es la última ronda: en vez de "Siguiente ronda" aparece "Cobrar fichas", que muestra todas las fichas ganadas. */
  last?: boolean;
}

const SHARD_SHAPES = [
  'circle(50%)',
  'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
  'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
];
const GOLD = ['#ffd35a', '#ffe9a3', '#ffffff', '#f59a23'] as const;

/** Cifra de fichas que cuenta hacia arriba cuando cambia. El número animado es decorativo: se lee el monto final. */
const RackCounter = ({ value, from, className = '' }: { value: number; from?: number; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(from ?? value);
  const canAnimate = useCanAnimate();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (!canAnimate) {
        shown.current = value;
        el.textContent = `$${value}`;
        return;
      }

      const obj = { v: shown.current };

      gsap.to(obj, {
        v: value,
        duration: from === undefined ? 0.6 : 1.2,
        ease: 'power2.out',
        onUpdate: () => {
          shown.current = obj.v;
          el.textContent = `$${Math.round(obj.v)}`;
        },
        onComplete: () => {
          shown.current = value;
          el.textContent = `$${value}`;
        }
      });
    },
    { dependencies: [value, canAnimate] }
  );

  return <span ref={ref} className={`${css['rack-total']} ${className}`} aria-hidden="true" />;
};

/** Mesa cerrada: todas las fichas que el estudiante se lleva, con lo que ganó respecto al inicio. */
const Cashout = () => {
  const lang = useLang();
  const t = i18n[lang];
  const titleId = useId();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const playSound = usePlaySound();
  const { point, wins, losses, fxRef, levelRef, canAnimate } = useGameCasinoProvider();

  const profit = point - START_POINTS;
  const profitText = profit > 0 ? t.profitUp(profit) : profit < 0 ? t.profitDown(-profit) : t.profitEven;

  // Llega el foco y, con movimiento, una lluvia de fichas y destellos
  useGSAP(
    () => {
      titleRef.current?.focus({ preventScroll: true });
      playSound(SOUNDS.LEVEL_COMPLETE);

      const fx = fxRef.current;
      const panel = panelRef.current;
      if (!canAnimate || !fx || !panel) return;

      const layerRect = fx.getBoundingClientRect();
      const at = centerIn(panel.getBoundingClientRect(), layerRect);

      ring(fx, at, css.ring, '#ffd35a');
      burst(fx, at, {
        className: css.shard,
        colors: GOLD,
        shapes: SHARD_SHAPES,
        count: 24,
        reach: [110, 260],
        size: [8, 16]
      });

      // Si el efecto se cancela a mitad (p. ej. el doble montaje de desarrollo) los fragmentos no se quedan en la capa
      return () => fx.replaceChildren();
    },
    { scope: levelRef }
  );

  return (
    <section ref={panelRef} className={css.cashout} aria-labelledby={titleId}>
      <h3 id={titleId} ref={titleRef} tabIndex={-1} className={css['cashout-title']}>
        {t.cashTitle}
      </h3>
      <p className={css['cashout-sub']}>{t.cashSub}</p>

      {/* Todas las fichas, en pilas grandes que caen una por una */}
      <div className={css['final-stacks']} aria-hidden="true">
        {toChips(point, true).map(({ kind, count }) => (
          <ChipStack key={kind.id} kind={kind} count={count} max={14} />
        ))}
      </div>

      <p className={css['cashout-total']}>
        <span className={css['sr-only']}>
          {t.cashTotal}: ${point}
        </span>
        <RackCounter value={point} from={0} className={css['cashout-amount']} />
      </p>
      <p className={css['cashout-profit']} data-loss={profit < 0 || undefined}>
        {profitText}
      </p>
      <p className={css['cashout-bets']}>{t.betsSummary(wins, wins + losses)}</p>
    </section>
  );
};

export const GameCasinoLevel = ({ children, label, background = BG.background, onNextRound, last = false }: Props) => {
  const lang = useLang();
  const t = i18n[lang];
  const questionId = useId();
  const playSound = usePlaySound();
  const {
    point,
    rack,
    validation,
    result,
    landed,
    options,
    answer,
    chip,
    reloaded,
    cashout,
    levelRef,
    fxRef,
    pickChip,
    handleReset,
    openCashout
  } = useGameCasinoProvider();

  const bet = options[0];
  // Sin fichas para otra apuesta (también justo después de perder la última): hay que pedirle fichas a la banca
  const broke = point < MIN_BET;
  // Después de ganar y cobrar el pago, el camino sigue dentro del juego
  const canContinue = validation && result && landed && !cashout && (last || !!onNextRound);
  // Para quien usa lector de pantalla: lo que pasó en la mesa, dicho una sola vez
  const message = cashout
    ? t.cashMsg(point)
    : validation
      ? result
        ? t.youWon(bet?.amount ?? 0, point)
        : t.youLost(bet?.amount ?? 0, point)
      : bet
        ? t.placed(bet.amount ?? 0, bet.bullet ?? '', bet.label)
        : reloaded
          ? t.reloadedMsg(point)
          : '';
  const hint = broke
    ? t.hintBroke
    : validation
      ? ''
      : !answer && !chip
        ? t.hintBoth
        : answer && !chip
          ? t.hintChip
          : !answer && chip
            ? t.hintAnswer
            : t.hintReady;

  const goNext = () => {
    playSound(SOUNDS.BUTTON);

    if (last) {
      openCashout();
    } else {
      handleReset();
      onNextRound?.();
    }
  };

  // El botón de la ronda aparece al cobrar el pago: el foco pasa a él para seguir con el teclado
  useEffect(() => {
    if (!canContinue) return;

    const frame = requestAnimationFrame(() => {
      const active = document.activeElement as HTMLElement | null;
      const lost = !active || active === document.body || (active as HTMLButtonElement).disabled;

      if (lost) levelRef.current?.querySelector<HTMLElement>('[data-next-round]')?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [canContinue, levelRef]);

  return (
    <div
      ref={levelRef}
      className={css.casino}
      style={{ '--casino-bg': `url(${background})`, '--casino-dice': `url(${BG.casinodc})` } as React.CSSProperties}
    >
      <div className={css.bar}>
        {/* La banca: de aquí sale el pago y aquí va la ficha de quien pierde */}
        <div className={css.bank} data-bank>
          <span className={css['tray-label']}>{t.bank}</span>
          <span className={css.stacks} aria-hidden="true">
            <ChipStack kind={chipKind(10)} count={6} />
            <ChipStack kind={chipKind(25)} count={8} />
            <ChipStack kind={chipKind(15)} count={5} />
          </span>
        </div>

        {/* La mano del jugador: sus fichas, sin la que está apostada sobre la mesa */}
        <div className={css.rack} data-rack>
          <span className={css['tray-label']}>{t.rack}</span>
          <span className={css['sr-only']}>
            {t.rack}: ${rack}
          </span>
          <span className={css.stacks} aria-hidden="true">
            {rack >= chipKind(5).value ? (
              toChips(rack).map(({ kind, count }) => <ChipStack key={kind.id} kind={kind} count={count} />)
            ) : (
              <span className={css['no-chips']}>{t.noChips}</span>
            )}
          </span>
          <RackCounter value={rack} />
        </div>
      </div>

      {cashout ? (
        <Cashout />
      ) : (
        <>
          <div className={css['casino-question']}>
            <div className={css['casino-questino-background']}>
              <p id={questionId}>{label}</p>
            </div>
          </div>

          <div className={css['casino-elements-wrapper']} role="radiogroup" aria-labelledby={questionId}>
            {children}
          </div>

          {/* Bandeja de fichas: cuanto más seguro, más grande la ficha */}
          <fieldset className={css.tray}>
            <legend className={css['tray-title']}>{t.chipsTitle}</legend>
            <div className={css['tray-chips']}>
              {BET_CHIPS.map((kind) => (
                <label key={kind.id} className={css['tray-chip']} data-tray-chip={kind.value}>
                  <input
                    type="radio"
                    className={css['tray-input']}
                    name="casino-chip"
                    value={kind.value}
                    checked={chip === kind.value}
                    disabled={validation || point < kind.value}
                    onChange={() => pickChip(kind.value)}
                  />
                  <Chip kind={kind} className={css['tray-chip-art']} />
                  <span className={css['tray-caption']}>
                    <span className={css['sr-only']}>${kind.value}: </span>
                    {t.chipNames[kind.value]}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {canContinue ? (
            <button type="button" className={css['next-round']} data-next-round onClick={goNext}>
              {last ? t.cashOut : t.nextRound}
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={css['next-round-arrow']}>
                <path d="m9 5 7 7-7 7" />
              </svg>
            </button>
          ) : (
            <p className={css.hint} data-empty={hint ? undefined : ''}>
              {hint}
            </p>
          )}
        </>
      )}

      <p className={css['sr-only']} role="status">
        {message}
      </p>

      <ValidationStatus validated={validation} correct={result} />

      {/* Capa de efectos: fichas en vuelo, ondas y destellos */}
      <div className={css.fx} ref={fxRef} aria-hidden="true" />
    </div>
  );
};
