import type { ReactNode } from 'react';
import { useReducer, useRef } from 'react';
import gsap from 'gsap';

import { SOUNDS } from '@/constants';
import { burst, centerIn, flyChip, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, usePlaySound } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { GameCasinoButton } from './game-casino-button';
import { GameCasinoProvider } from './game-casino-context';
import { CasinoElement } from './game-casino-element';
import { GameCasinoInit } from './game-casino-init';
import { GameCasinoLevel } from './game-casino-level';
import { chipKind, MIN_BET, START_POINTS } from './lib/chips';

import type { GameResult, InitialState, Option } from './types/types';

import css from './game-casino.module.css';

const INITIAL_STATE: InitialState = {
  validation: false,
  button: true,
  result: false,
  options: [],
  point: START_POINTS,
  answer: null,
  chip: null,
  landed: true,
  reloaded: false,
  wins: 0,
  losses: 0,
  cashout: false
};

const GOLD = ['#ffd35a', '#ffe9a3', '#ffffff', '#f59a23'] as const;
const RING_COLOR = '#ffd35a';
// Fichas, destellos en rombo y estrellas
const SHARD_SHAPES = [
  'circle(50%)',
  'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
  'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
];
const DUST = ['#0a3d38', '#10635b', '#88d8c3', '#3b153a'] as const;

interface Props {
  children: ReactNode;
  onResult?: (data: GameResult) => void;
}

/** La apuesta completa (opción + ficha) o, si falta algo, ninguna. */
const betOf = (answer: Option | null, chip: number | null) =>
  answer && chip ? { options: [{ ...answer, amount: chip }], button: false } : { options: [], button: true };

export const GameCasino = ({ children, onResult }: Props) => {
  const [state, dispatch] = useReducer(
    (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
    INITIAL_STATE
  );
  const levelRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const playSound = usePlaySound();
  const canAnimate = useCanAnimate();
  // El resultado se entrega tras el pago o el barrido de la banca, antes del modal del padre
  const { defer, flush } = useDeferredResult();
  const { contextSafe } = useGSAP({ scope: levelRef });

  /**
   * Fichas que se ven en la mano. La ficha apostada ya salió de la mano y está sobre la mesa; si se gana, el
   * pago (apuesta + premio) vuelve a la mano solo cuando las fichas terminan de viajar (`landed`).
   */
  const staged = state.options[0]?.amount ?? 0;
  const rack = !state.validation
    ? state.point - staged
    : state.result && !state.landed
      ? state.point - 2 * staged
      : state.point;

  const query = <T extends HTMLElement>(selector: string) => levelRef.current?.querySelector<T>(selector) ?? null;

  /**
   * Mueve el foco en el siguiente frame, cuando React ya aplicó el cambio de estado, solo si el foco se perdió.
   */
  const focusSoon = (find: () => Element | null | undefined) => {
    requestAnimationFrame(() => {
      const active = document.activeElement as HTMLElement | null;
      const lost = !active || active === document.body || (active as HTMLButtonElement).disabled;

      if (lost) (find() as HTMLElement | null | undefined)?.focus({ preventScroll: true });
    });
  };

  const chipFlyerClass = (value: number) => `${css.flyer} ${css[`flyer--${chipKind(value).id}`]}`;

  /**
   * La ficha elegida vuela de la bandeja a la casilla de apuesta de la opción (solo con movimiento permitido).
   * En la casilla aparece la ficha real justo al llegar (ver `chip-land` en el CSS).
   */
  const flyBet = contextSafe((value: number, answerId: string) => {
    const fx = fxRef.current;
    const from = query(`[data-tray-chip="${value}"] [data-chip]`);
    const to = query(`[data-spot="${CSS.escape(answerId)}"]`);

    if (!canAnimate || !fx || !from || !to) {
      playSound(SOUNDS.DROP);
      return;
    }

    const layerRect = fx.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();

    flyChip(
      fx,
      layerRect,
      from.getBoundingClientRect(),
      toRect,
      `$${value}`,
      chipFlyerClass(value),
      contextSafe(() => {
        playSound(SOUNDS.DROP);
        ring(fx, centerIn(toRect, layerRect), css.ring, RING_COLOR, 0.5);
      })
    );
  });

  const pickAnswer = (option: Option) => {
    if (state.validation) return;

    playSound(SOUNDS.TICK);
    dispatch({ answer: option, reloaded: false, ...betOf(option, state.chip) });
    if (state.chip) flyBet(state.chip, option.id);
  };

  const pickChip = (value: number) => {
    if (state.validation || value > state.point) return;

    playSound(SOUNDS.POP);
    dispatch({ chip: value, reloaded: false, ...betOf(state.answer, value) });
    if (state.answer) flyBet(value, state.answer.id);
  };

  /**
   * La banca resuelve la apuesta (solo con movimiento permitido): si se gana, la ficha apostada vuela a la mano y
   * la banca paga otra igual; si se pierde, la ficha vuela a la banca. Devuelve true si empezó la animación.
   */
  const settle = contextSafe((selected: Option, win: boolean, amount: number) => {
    const fx = fxRef.current;
    const spot = query(`[data-spot="${CSS.escape(selected.id)}"]`);
    const rackEl = query('[data-rack]');
    const bank = query('[data-bank]');

    if (!canAnimate || !fx || !spot || !rackEl || !bank) return false;

    const layerRect = fx.getBoundingClientRect();
    const spotRect = spot.getBoundingClientRect();
    const rackRect = rackEl.getBoundingClientRect();
    const bankRect = bank.getBoundingClientRect();
    // Las fichas salen con el tamaño de una ficha y llegan al centro de su destino
    const asChip = (r: DOMRect) => new DOMRect(r.left + r.width / 2 - 24, r.top + r.height / 2 - 24, 48, 48);
    const toPoint = (r: DOMRect) => new DOMRect(r.left + r.width / 2, r.top + r.height / 2, 0, 0);
    const text = `$${amount}`;
    const cls = chipFlyerClass(amount);
    const at = centerIn(spotRect, layerRect);

    if (win) {
      playSound(SOUNDS.UNLOCK);
      ring(fx, at, css.ring, RING_COLOR);
      burst(fx, at, {
        className: css.shard,
        colors: GOLD,
        shapes: SHARD_SHAPES,
        count: 14,
        reach: [60, 150],
        size: [7, 14]
      });

      flyChip(fx, layerRect, asChip(spotRect), toPoint(rackRect), text, cls, () => undefined);
      flyChip(
        fx,
        layerRect,
        asChip(bankRect),
        toPoint(rackRect),
        text,
        cls,
        contextSafe(() => {
          playSound(SOUNDS.DROP);
          gsap.fromTo(rackEl, { scale: 1.1 }, { scale: 1, duration: 0.55, ease: 'back.out(3)' });
          burst(fx, centerIn(rackRect, layerRect), {
            className: css.shard,
            colors: GOLD,
            shapes: SHARD_SHAPES,
            count: 10,
            reach: [30, 80],
            size: [6, 11],
            gravity: 18
          });
          dispatch({ landed: true });
        })
      );
    } else {
      flyChip(
        fx,
        layerRect,
        asChip(spotRect),
        toPoint(bankRect),
        text,
        cls,
        contextSafe(() => {
          playSound(SOUNDS.DROP);
          gsap.fromTo(bank, { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1.4, 0.3)' });
          burst(fx, centerIn(bankRect, layerRect), {
            className: css.shard,
            colors: DUST,
            count: 8,
            reach: [24, 60],
            size: [6, 12],
            gravity: 20
          });
        })
      );
    }

    return true;
  });

  const handleValidation = () => {
    const selected = state.options[0];
    if (!selected) return;

    const isCorrect = selected.state === 'success';
    const betAmount = selected.amount ?? 0;
    const newPoints = isCorrect ? state.point + betAmount : state.point - betAmount;
    // Hay que leer dónde están las fichas antes de que React cambie la mesa
    const animated = settle(selected, isCorrect, betAmount);

    dispatch({
      validation: true,
      result: isCorrect,
      point: newPoints,
      landed: !animated || !isCorrect,
      wins: state.wins + (isCorrect ? 1 : 0),
      losses: state.losses + (isCorrect ? 0 : 1)
    });

    // Se entrega tras el pago o el barrido. Siempre después de mover el foco (ver GameCasinoButton).
    defer(() => {
      requestAnimationFrame(() => {
        onResult?.({ result: isCorrect, options: state.options, totalPoints: newPoints });
      });
    }, isCorrect);
  };

  const handleReset = () => {
    // Si todavía hay un resultado en espera (reintento inmediato), se entrega ya: no se pierde ni llega tarde.
    flush();

    // Sin fichas para apostar, la banca presta las del inicio
    const reload = state.point < MIN_BET;

    // Las apuestas ganadas y perdidas siguen contando: se muestran al cobrar
    dispatch({
      ...INITIAL_STATE,
      point: reload ? START_POINTS : state.point,
      reloaded: reload,
      wins: state.wins,
      losses: state.losses
    });
    focusSoon(() => query('input[type="radio"]:not(:disabled)'));
  };

  /** Empieza de cero: las fichas del inicio y ninguna apuesta. */
  const handleRestart = () => {
    flush();
    dispatch({ ...INITIAL_STATE });
    focusSoon(() => query('input[type="radio"]:not(:disabled)'));
  };

  const openCashout = () => dispatch({ cashout: true });

  return (
    <GameCasinoProvider
      value={{
        ...state,
        rack,
        canAnimate,
        levelRef,
        fxRef,
        pickAnswer,
        pickChip,
        handleValidation,
        handleReset,
        handleRestart,
        openCashout
      }}
    >
      {children}
    </GameCasinoProvider>
  );
};

GameCasino.Init = GameCasinoInit;
GameCasino.Level = GameCasinoLevel;
GameCasino.Element = CasinoElement;
GameCasino.Button = GameCasinoButton;
