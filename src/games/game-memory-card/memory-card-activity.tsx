import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import { SOUNDS } from '@/constants';
import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useLang, usePlaySound } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { CardBack, CardFront, CardItem } from './card-item';
import { i18n } from './lib/constant';
import { MemoryBoard } from './memory-board';
import { MemoryCardButton } from './memory-card-button';
import { MemoryActivityProvider } from './memory-card-context';

import type { CardType } from './types/types';

import css from './memory-card.module.css';

interface Props {
  /** Entrega `true` cuando las 4 parejas están descubiertas al pulsar Comprobar. */
  onResult: (result: boolean) => void;
  children?: React.ReactNode;
}

// El juego admite exactamente 8 cartas: 4 parejas
const TOTAL_CARDS = 8;
// Lo que se ven las dos cartas distintas antes de volver boca abajo (ms)
const MISS_MS = 1000;

const SPARKS = ['#2a9d8f', '#e8710a', '#ffffff', '#8fd3d1'] as const;
const GOLD = ['#ffd35a', '#ffe9a3', '#ffffff', '#e8710a', '#2a9d8f'] as const;
const SHARD_SHAPES = [
  'circle(50%)',
  'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
  'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
];

export const MemoryCardActivity: React.FC<Props> & {
  Board: typeof MemoryBoard;
  Button: typeof MemoryCardButton;
  Card: typeof CardItem;
  CardFront: typeof CardFront;
  CardBack: typeof CardBack;
} = ({ onResult, children }) => {
  const lang = useLang();
  const t = i18n[lang];
  const playSound = usePlaySound();
  const canAnimate = useCanAnimate();

  const [cards, setCards] = useState<CardType[]>([]);
  // Carta ya volteada que espera a su pareja
  const [pending, setPending] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState('');
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [isReset, setIsReset] = useState(true);

  const boardRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const { contextSafe } = useGSAP({ scope: boardRef });

  const done = cards.length === TOTAL_CARDS && cards.every((card) => card.matched);

  useEffect(() => {
    return () => {
      setCards([]);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const registerCard = useCallback((card: Omit<CardType, 'flipped' | 'matched'>) => {
    setCards((prev) => {
      if (prev.length >= TOTAL_CARDS) return prev;

      const isAlreadyAdded = prev.some((c) => c.id === card.id && c.backContent === card.backContent);

      if (isAlreadyAdded) return prev;

      return [...prev, { ...card, flipped: false, matched: false }];
    });
  }, []);

  const cardEl = (index: number) => boardRef.current?.querySelector<HTMLElement>(`[data-card="${index}"]`) ?? null;

  /** El texto de la cara visible de una carta (para anunciar qué se descubrió). */
  const faceText = (index: number) => cardEl(index)?.querySelector('[data-face="front"]')?.textContent?.trim() ?? '';

  /**
   * Pareja encontrada (solo con movimiento permitido): las dos cartas saltan con un destello cuando termina el giro;
   * con la última pareja, todo el tablero celebra.
   */
  const celebrate = contextSafe((first: number, second: number, finished: boolean) => {
    playSound(finished ? SOUNDS.UNLOCK : SOUNDS.POP);

    const fx = fxRef.current;
    if (!canAnimate || !fx) return;

    // Cuando termina de girar la segunda carta
    gsap.delayedCall(0.45, () => {
      const layerRect = fx.getBoundingClientRect();

      [first, second].forEach((index) => {
        const el = cardEl(index);
        if (!el) return;

        const at = centerIn(el.getBoundingClientRect(), layerRect);

        gsap.fromTo(el, { scale: 1.1 }, { scale: 1, duration: 0.6, ease: 'back.out(3)' });
        ring(fx, at, css.ring, '#2a9d8f');
        burst(fx, at, {
          className: css.shard,
          colors: SPARKS,
          shapes: SHARD_SHAPES,
          count: 10,
          reach: [50, 110],
          size: [6, 12]
        });
      });
    });

    if (!finished) return;

    gsap.delayedCall(0.95, () => {
      const layerRect = fx.getBoundingClientRect();
      const board = boardRef.current;
      if (!board) return;

      const at = centerIn(board.getBoundingClientRect(), layerRect);

      ring(fx, at, css.ring, '#ffd35a');
      burst(fx, at, {
        className: css.shard,
        colors: GOLD,
        shapes: SHARD_SHAPES,
        count: 28,
        reach: [140, 320],
        size: [8, 16]
      });
      gsap.fromTo(
        board.querySelectorAll('[data-card]'),
        { y: 0 },
        { y: -12, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out', stagger: 0.06 }
      );
    });
  });

  /** Las dos cartas que no coinciden se sacuden un momento antes de volver boca abajo. */
  const shake = contextSafe((first: number, second: number) => {
    if (!canAnimate) return;

    [first, second].forEach((index) => {
      const el = cardEl(index);
      if (el) gsap.fromTo(el, { x: -9 }, { x: 0, duration: 0.55, delay: 0.55, ease: 'elastic.out(1.2, 0.3)' });
    });
  });

  const handleCardClick = (index: number) => {
    const card = cards[index];

    // Mientras se devuelve una pareja que no coincide no se puede voltear otra carta
    if (!card || locked || card.flipped || card.matched) return;

    playSound(SOUNDS.FLIP);

    const flipped = cards.map((c, i) => (i === index ? { ...c, flipped: true } : c));

    if (!pending.length) {
      setCards(flipped);
      setPending([index]);
      setMessage(t.flipMsg(faceText(index)));
      return;
    }

    const [first] = pending;

    setPending([]);
    setMoves((prev) => prev + 1);
    setButtonsDisabled(false);

    if (flipped[first].id === flipped[index].id) {
      const matched = flipped.map((c, i) => (i === first || i === index ? { ...c, matched: true } : c));
      const finished = matched.length === TOTAL_CARDS && matched.every((c) => c.matched);

      setCards(matched);
      setMessage(`${t.matchMsg(faceText(first), faceText(index))}${finished ? ` ${t.doneMsg}` : ''}`);
      celebrate(first, index, finished);
      return;
    }

    setCards(flipped);
    setLocked(true);
    setMessage(t.missMsg(faceText(first), faceText(index)));
    shake(first, index);

    timerRef.current = window.setTimeout(() => {
      // Las dos cartas vuelven boca abajo: un solo sonido para el par.
      playSound(SOUNDS.FLIP);
      setCards((prev) => prev.map((c, i) => (i === first || i === index ? { ...c, flipped: false } : c)));
      setLocked(false);
    }, MISS_MS);
  };

  const checkGameStatus = () => {
    if (!done) setIsReset(false);
    setButtonsDisabled(true);
    // Un frame después, cuando el foco ya pasó del botón (ver MemoryCardButton): así el modal del padre lo devuelve bien
    requestAnimationFrame(() => onResult?.(done));
  };

  const restartGame = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);

    setCards((prev) => prev.map((c) => ({ ...c, flipped: false, matched: false })));
    setPending([]);
    setLocked(false);
    setMoves(0);
    setMessage(t.resetMsg);
    setButtonsDisabled(true);
    setIsReset(true);

    // El botón de reiniciar se deshabilita y suelta el foco: pasa a la primera carta
    requestAnimationFrame(() => {
      const active = document.activeElement as HTMLElement | null;

      if (!active || active === document.body || (active as HTMLButtonElement).disabled) {
        boardRef.current?.querySelector<HTMLElement>('[data-card="0"]')?.focus({ preventScroll: true });
      }
    });
  };

  return (
    <MemoryActivityProvider
      value={{
        cards,
        buttonsDisabled,
        isReset,
        lang,
        moves,
        locked,
        done,
        message,
        boardRef,
        fxRef,
        handleCardClick,
        checkGameStatus,
        restartGame,
        registerCard
      }}
    >
      {children}
    </MemoryActivityProvider>
  );
};

// Asignación de los sub-componentes al objeto principal
MemoryCardActivity.Board = MemoryBoard;
MemoryCardActivity.Button = MemoryCardButton;
MemoryCardActivity.Card = CardItem;
MemoryCardActivity.CardFront = CardFront; // Acceso directo: MemoryCardActivity.CardFront
MemoryCardActivity.CardBack = CardBack; // Acceso directo: MemoryCardActivity.CardBack
