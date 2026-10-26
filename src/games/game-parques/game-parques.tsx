import { useEffect, useReducer, useRef } from 'react';
import gsap from 'gsap';

import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import {
  CAPTURE_COLORS,
  FX_COLORS,
  HOME_COLORS,
  i18n,
  MAX_TRIES,
  RIVAL_BLUNDER,
  RIVAL_PAUSE,
  SCORE
} from './lib/constant';
import type { IconName } from './lib/icons';
import {
  applyOption,
  canMove,
  HOME,
  homeCount,
  isPair,
  newPieces,
  optionsOf,
  percentOf,
  pickOption,
  PIECES,
  pointOf,
  rollDie,
  standing,
  stepsBetween
} from './lib/layout';
import { ParquesBoard } from './parques-board';
import { ParquesCard } from './parques-card';
import { ParquesDock } from './parques-dock';
import { ParquesIcon } from './parques-icons';
import { ParquesInit } from './parques-init';
import { ParquesSeat } from './parques-seat';
import { ParquesSummaryCard } from './parques-summary';

import type { Option, ParquesQuestion, ParquesResult, ParquesSummary, Phase, Piece, State } from './types/types';

import css from './game-parques.module.css';

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];
const LEGEND: { kind: 'safe' | 'five' | 'pair' | 'capture'; icon: IconName }[] = [
  { kind: 'safe', icon: 'star' },
  { kind: 'five', icon: 'lock' },
  { kind: 'pair', icon: 'pair' },
  { kind: 'capture', icon: 'target' }
];

const shuffled = (question: ParquesQuestion) => gsap.utils.shuffle(question.answers.map((_, k) => k));

const placeOf = (piece: Piece) => (piece.p < 0 ? 'jail' : piece.p >= HOME ? 'home' : 'road');

interface Props {
  /** Las preguntas: cada acierto da una tirada de dados. Pásalas como constante: no cambian mientras se juega. */
  questions: ParquesQuestion[];
  /** Se llama un instante después de comprobar, para que se vea el veredicto antes de abrir la retroalimentación. */
  onResult?: (result: ParquesResult) => void;
  /** Se llama al reintentar una pregunta tras un fallo (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al terminar la partida, cuando se muestran los resultados. */
  onFinish?: (summary: ParquesSummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof ParquesInit;
};

/**
 * Parqués con preguntas, jugador contra un rival que mueve solo (amarillo contra rojo, dos fichas cada uno).
 *
 * - Cada pregunta acertada da una tirada de dos dados; fallar descarta la respuesta y hay que reintentar.
 * - Las fichas empiezan en la cárcel: un 5 en un dado (o una suma de 5) deja salir una. Si no sale, hay tres intentos.
 * - Con la suma se mueve una ficha por el circuito y, al dar la vuelta, por su pasillo hasta el cielo.
 * - Caer sobre una ficha rival fuera de un seguro (estrella) la captura: vuelve a su cárcel.
 * - Un par da otra tirada sin pregunta. Tras cada turno del jugador, mueve el rival.
 * - La partida acaba al acertar todas las preguntas: gana quien tenga sus fichas más cerca del cielo.
 */
const GameParques: React.FC<Props> & SubComponents = ({ questions, onResult, onReset, onFinish, addClass }) => {
  const lang = useLang();
  const t = i18n[lang];

  const canAnimate = useCanAnimate();
  const { defer, flush } = useDeferredResult();
  const total = questions.length;

  const createState = (): State => {
    const queue = gsap.utils.shuffle(questions.map((_, k) => k));

    return {
      phase: 'question',
      turn: 'you',
      queue,
      order: questions[queue[0]] ? shuffled(questions[queue[0]]) : [],
      selected: null,
      pieces: newPieces(),
      dice: { you: { a: 0, b: 0 }, rival: { a: 0, b: 0 } },
      dieKey: 0,
      tries: 0,
      bonus: false,
      options: [],
      solved: [],
      seen: [],
      fails: {},
      discarded: {},
      score: 0,
      streak: 0,
      bestStreak: 0,
      firstTry: 0,
      attempts: 0,
      rolls: 0,
      captures: 0,
      captured: 0,
      last: null,
      motion: null,
      stop: null,
      moves: 0,
      rivalNote: '',
      notice: ''
    };
  };

  const [state, patch] = useReducer((prev: State, next: Partial<State>) => ({ ...prev, ...next }), null, createState);
  const stateRef = useRef(state); // Los callbacks leen el estado de ahora, no el de cuando se programaron
  stateRef.current = state;

  const rootRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const rollRef = useRef<HTMLButtonElement>(null);
  const pickRef = useRef<HTMLButtonElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // El foco solo se mueve cuando la fase cambia por una acción, no al montar
  const landed = useRef(-1); // Último movimiento ya resuelto: evita resolverlo dos veces si el efecto se repite
  const rolled = useRef(-1); // Última tirada ya resuelta, por lo mismo

  const item = questions[state.queue[0]] as ParquesQuestion | undefined;
  const stateOf = (q: ParquesQuestion) =>
    state.solved.includes(q.id) ? 'solved' : state.fails[q.id] ? 'review' : 'pending';

  const summaryOf = (now: State): ParquesSummary => ({
    score: now.score,
    total,
    firstTry: now.firstTry,
    bestStreak: now.bestStreak,
    attempts: now.attempts,
    rolls: now.rolls,
    home: homeCount(now.pieces, 'you'),
    rivalHome: homeCount(now.pieces, 'rival'),
    captures: now.captures,
    captured: now.captured,
    won: standing(now.pieces, 'you') >= standing(now.pieces, 'rival')
  });

  /** Siguiente pregunta de la cola, con las respuestas en orden nuevo. */
  const toQuestion = (now: State, extra: Partial<State> = {}) => {
    const queue = extra.queue ?? now.queue;

    patch({
      phase: 'question',
      turn: 'you',
      queue,
      order: questions[queue[0]] ? shuffled(questions[queue[0]]) : [],
      selected: null,
      last: null,
      motion: null,
      stop: null,
      options: [],
      tries: 0,
      bonus: false,
      notice: t.live.question(now.solved.length + 1),
      ...extra
    });
  };

  /** Acaba la partida: gana quien tenga sus fichas más cerca del cielo (en empate, el jugador). */
  const finishGame = (now: State) => {
    const won = standing(now.pieces, 'you') >= standing(now.pieces, 'rival');
    const next: State = {
      ...now,
      phase: 'done',
      turn: 'you',
      score: now.score + (won ? SCORE.win : 0),
      last: null,
      motion: null,
      stop: null,
      options: [],
      notice: ''
    };

    patch(next);
    onFinish?.(summaryOf(next));
  };

  /** Fin del turno de ambos: otra pregunta, o los resultados si ya no quedan. */
  const finishTurn = (now: State) => {
    if (now.queue.length === 0) {
      finishGame(now);
      return;
    }

    toQuestion(now, { pieces: now.pieces, rivalNote: now.rivalNote, captures: now.captures, captured: now.captured });
  };

  /** Empieza el turno del rival (o lo salta si todas sus fichas ya están en el cielo). */
  const rivalTurn = (now: State) => {
    if (!canMove(now.pieces, 'rival')) {
      finishTurn({ ...now, rivalNote: t.rival.allHome });
      return;
    }

    patch({
      phase: 'roll',
      turn: 'rival',
      bonus: false,
      tries: 0,
      options: [],
      last: null,
      stop: null,
      motion: null,
      rivalNote: t.rival.rolling,
      notice: t.live.rival
    });
  };

  const select = (answer: number) => {
    if (stateRef.current.phase !== 'question') return;

    patch({ selected: answer });
  };

  const check = () => {
    const now = stateRef.current;
    const q = questions[now.queue[0]];

    if (now.phase !== 'question' || now.selected === null || !q) return;

    const ok = q.answers[now.selected].state === 'success';
    const fails = now.fails[q.id] ?? 0;
    const retry = fails > 0 || now.seen.includes(q.id);
    const firstTry = ok && !retry;
    const points = ok
      ? (retry ? SCORE.retry : SCORE.answer) + Math.min(now.streak, SCORE.streakCap) * SCORE.streakStep
      : 0;
    const streak = ok ? now.streak + 1 : 0;
    const last = ok && now.queue.length === 1;
    const skip = ok && !canMove(now.pieces, 'you');

    patch({
      phase: 'checked',
      last: { ok, firstTry, points, last, skip },
      score: now.score + points,
      streak,
      bestStreak: Math.max(now.bestStreak, streak),
      attempts: now.attempts + 1,
      firstTry: firstTry ? now.firstTry + 1 : now.firstTry,
      solved: ok ? [...now.solved, q.id] : now.solved,
      seen: ok && !now.seen.includes(q.id) ? [...now.seen, q.id] : now.seen,
      fails: ok ? now.fails : { ...now.fails, [q.id]: fails + 1 },
      discarded: ok ? now.discarded : { ...now.discarded, [q.id]: [...(now.discarded[q.id] ?? []), now.selected] },
      notice: !ok ? t.live.ko : last ? t.live.okLast(points) : t.live.ok(points)
    });

    const deliver = () => onResult?.({ result: ok, question: q.id, streak, attempts: fails + 1, points });

    // Sin movimiento no hay espera, pero se deja un instante para que el foco llegue al botón antes del modal de la página
    defer(() => (canAnimate ? deliver() : void setTimeout(deliver, 60)), ok);
  };

  /** Tras comprobar: a los dados (acierto), al rival (si no hay fichas que mover) o a reintentar (fallo). */
  const afterCheck = () => {
    flush(); // Si aún esperaba entregar el resultado, se entrega ya

    const now = stateRef.current;
    const verdict = now.last;

    if (now.phase !== 'checked' || !verdict) return;

    if (!verdict.ok) {
      onReset?.();
      patch({ phase: 'question', selected: null, last: null, notice: '' });
      return;
    }

    const queue = now.queue.slice(1);

    if (verdict.skip) {
      patch({ queue, last: null }); // La cola avanza ya: el turno del rival solo toca los campos de su fase
      rivalTurn({ ...now, queue, last: null });
      return;
    }

    patch({
      phase: 'roll',
      turn: 'you',
      queue,
      last: null,
      bonus: false,
      tries: 0,
      options: [],
      notice: t.live.roll
    });
  };

  const roll = () => {
    const now = stateRef.current;

    if (now.phase !== 'roll') return;

    patch({
      phase: 'rolling',
      dice: { ...now.dice, [now.turn]: { a: rollDie(), b: rollDie() } },
      dieKey: now.dieKey + 1,
      tries: now.tries + 1,
      rolls: now.turn === 'you' ? now.rolls + 1 : now.rolls,
      notice: '',
      rivalNote: now.turn === 'rival' ? t.rival.rolling : now.rivalNote
    });
  };

  /** Arranca el movimiento de una ficha: el efecto de abajo la lleva casilla a casilla y luego se resuelve en `land`. */
  const beginMove = (now: State, option: Option, said: string) => {
    const piece = now.pieces[option.piece];
    const rival = now.turn === 'rival';
    const note = option.captures.length
      ? t.rival.capture
      : option.home
        ? t.rival.home
        : option.exit
          ? t.rival.exit
          : t.rival.move(option.to - piece.p);

    patch({
      phase: 'moving',
      options: [],
      tries: 0,
      bonus: false,
      motion: {
        id: now.moves + 1,
        side: now.turn,
        option,
        again: isPair(now.dice[now.turn])
      },
      moves: now.moves + 1,
      rivalNote: rival ? `${t.rival.rolled(now.dice.rival.a, now.dice.rival.b)} ${note}` : now.rivalNote,
      notice: `${said} ${t.live.moving}`
    });
  };

  /** Los dados ya rodaron (o no hay animación): se ven las jugadas posibles y se mueve, o se vuelve a intentar. */
  const afterRoll = () => {
    const now = stateRef.current;

    if (now.phase !== 'rolling' || rolled.current === now.dieKey) return;

    rolled.current = now.dieKey;

    const dice = now.dice[now.turn];
    const options = optionsOf(now.pieces, now.turn, dice);
    const said = t.live.rolled(dice.a, dice.b);
    const rival = now.turn === 'rival';

    if (options.length === 0) {
      if (now.tries < MAX_TRIES) {
        patch({
          phase: 'roll',
          options: [],
          notice: said,
          rivalNote: rival ? `${t.rival.rolled(dice.a, dice.b)} ${t.rival.stuck}` : now.rivalNote
        });
      } else if (rival) {
        finishTurn({ ...now, rivalNote: t.rival.stuck });
      } else {
        patch({
          phase: 'stop',
          options: [],
          stop: { kind: 'stuck', points: 0, again: false, piece: '' },
          notice: t.live.stop(t.stops.stuck.title, t.stops.stuck.text)
        });
      }

      return;
    }

    if (rival || options.length === 1) {
      // El rival piensa un momento antes de mover; el jugador con una sola jugada la hace sin preguntar
      if (rival) {
        patch({
          phase: 'choose',
          options,
          rivalNote: `${t.rival.rolled(dice.a, dice.b)} ${t.rival.moving}`,
          notice: said
        });
        return;
      }

      beginMove(now, options[0], said);
      return;
    }

    patch({ phase: 'choose', options, notice: `${said} ${t.live.choose}` });
  };

  const pick = (k: number) => {
    const now = stateRef.current;

    if (now.phase !== 'choose' || now.turn !== 'you' || !now.options[k]) return;

    beginMove(now, now.options[k], '');
  };

  /** Sigue tras una jugada: otra tirada si salió un par, el turno del rival o el final del turno. */
  const afterMove = (now: State, again: boolean) => {
    if (again && canMove(now.pieces, now.turn)) {
      patch({
        phase: 'roll',
        bonus: true,
        tries: 0,
        options: [],
        motion: null,
        stop: null,
        notice: now.turn === 'you' ? t.live.roll : t.live.rival
      });
      return;
    }

    if (now.turn === 'you') {
      rivalTurn(now);
      return;
    }

    finishTurn(now);
  };

  /** La ficha ya llegó (o no hay animación): se aplica la jugada y se resuelve qué pasó. */
  const land = () => {
    const now = stateRef.current;
    const move = now.motion;

    if (!move || landed.current === move.id) return;

    landed.current = move.id;

    const { option, side, again } = move;
    const you = side === 'you';
    const captures = option.captures.length;
    const points = you ? captures * SCORE.capture + (option.home ? SCORE.home : 0) : 0;
    const next: State = {
      ...now,
      pieces: applyOption(now.pieces, option),
      motion: null,
      options: [],
      score: now.score + points,
      captures: you ? now.captures + captures : now.captures,
      captured: you ? now.captured : now.captured + captures
    };
    const kind = captures ? (you ? 'capture' : 'captured') : option.home ? (you ? 'home' : 'rivalHome') : null;

    if (!kind) {
      // Se guarda lo que cambió antes de seguir: lo que viene solo toca los campos de su fase
      patch({
        pieces: next.pieces,
        motion: null,
        options: [],
        score: next.score,
        captures: next.captures,
        captured: next.captured
      });
      afterMove(next, again);
      return;
    }

    patch({
      ...next,
      phase: 'stop',
      stop: { kind, points, again, piece: `${side}-${now.pieces[option.piece].n}` },
      notice: t.live.stop(t.stops[kind].title, t.stops[kind].text)
    });
  };

  /** Tras una parada, el botón de seguir. */
  const afterStop = () => {
    const now = stateRef.current;
    const stop = now.stop;

    if (now.phase !== 'stop' || !stop) return;

    afterMove({ ...now, stop: null }, stop.again);
  };

  const restart = () => {
    flush();
    landed.current = -1;
    rolled.current = -1;
    patch(createState());
  };

  // El rival tira solo, tras una pausa para que se vea que le toca
  useEffect(() => {
    if (state.turn !== 'rival' || state.phase !== 'roll') return;

    const id = window.setTimeout(roll, canAnimate ? RIVAL_PAUSE : RIVAL_PAUSE / 2);

    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.turn, state.phase, state.dieKey, canAnimate]);

  // ...y elige su jugada tras otra pausa, para que se vean los dados antes de que mueva
  useEffect(() => {
    if (state.turn !== 'rival' || state.phase !== 'choose') return;

    const id = window.setTimeout(
      () => {
        const now = stateRef.current;

        if (now.phase !== 'choose' || now.turn !== 'rival' || !now.options.length) return;

        beginMove(
          now,
          pickOption(now.pieces, now.options, RIVAL_BLUNDER),
          t.live.rolled(now.dice.rival.a, now.dice.rival.b)
        );
      },
      canAnimate ? RIVAL_PAUSE : RIVAL_PAUSE / 2
    );

    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.turn, state.phase, canAnimate]);

  // Acierto: aro y confeti desde el veredicto. Fallo: temblor
  useGSAP(
    () => {
      const fx = fxRef.current;
      const verdict = verdictRef.current;
      const last = state.last;

      if (!last || !canAnimate || !fx || !verdict) return;

      if (last.ok) {
        const at = centerIn(verdict.getBoundingClientRect(), fx.getBoundingClientRect());

        ring(fx, at, css.ring, '#ffd24a', 0.5);
        burst(fx, at, {
          className: css.spark,
          colors: FX_COLORS,
          shapes: CONFETTI_SHAPES,
          count: 16,
          reach: [50, 130],
          size: [7, 12],
          gravity: 40
        });
      } else {
        gsap.fromTo(verdict, { x: -10 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.25)' });
      }

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [state.last, canAnimate] }
  );

  // Los dos dados ruedan cambiando de cara y, al parar, dejan las que salieron; entonces se ven las jugadas
  useGSAP(
    () => {
      if (state.phase !== 'rolling') return;

      const dice = Array.from(
        rootRef.current?.querySelectorAll<HTMLElement>(`[data-dice="${state.turn}"] [data-die]`) ?? []
      );
      const finals = stateRef.current.dice[state.turn];

      if (!canAnimate || dice.length < 2) {
        dice.forEach((die, k) => (die.dataset.face = String(k ? finals.b : finals.a)));
        afterRoll();
        return;
      }

      const progress = { k: 0 };
      let shown = 0;

      dice.forEach((die) => (die.dataset.face = String(1 + Math.floor(Math.random() * 6)))); // No se ven las caras finales antes de rodar

      const tween = gsap.to(progress, {
        k: 1,
        duration: 0.95,
        ease: 'power1.out',
        onUpdate: () => {
          const step = Math.floor(progress.k * 11);

          if (step === shown) return;

          shown = step;
          dice.forEach((die, k) => (die.dataset.face = String(1 + ((step * 5 + (step % 3) + k * 2) % 6))));
        },
        onComplete: () => {
          dice.forEach((die, k) => (die.dataset.face = String(k ? finals.b : finals.a)));
          afterRoll();
        }
      });
      const spin = gsap.fromTo(
        dice,
        { rotation: 0, y: 0 },
        { rotation: (k: number) => (k ? -540 : 720), y: -14, duration: 0.95, ease: 'power2.out', stagger: 0.06 }
      );
      const drop = gsap.fromTo(
        dice,
        { scale: 1 },
        { scale: 1.15, duration: 0.2, repeat: 3, yoyo: true, ease: 'sine.inOut' }
      );

      return () => {
        tween.kill();
        spin.kill();
        drop.kill();
        gsap.set(dice, { rotation: 0, y: 0, scale: 1 });
        dice.forEach((die, k) => (die.dataset.face = String(k ? finals.b : finals.a)));
      };
    },
    { scope: rootRef, dependencies: [state.phase, state.dieKey, canAnimate] }
  );

  // La ficha recorre el camino casilla a casilla; si captura, la ficha comida vuela a su cárcel. Al llegar, se resuelve
  useGSAP(
    () => {
      const move = state.motion;

      if (!move) return;

      const { option, side } = move;
      const pieces = stateRef.current.pieces;
      const piece = pieces[option.piece];
      const find = (p: Piece) => rootRef.current?.querySelector<HTMLElement>(`[data-piece="${p.side}-${p.n}"]`);
      const el = find(piece);

      if (!canAnimate || !el) {
        land(); // Sin animación no hay nada que esperar
        return;
      }

      const body = el.querySelector<HTMLElement>(`.${css['piece-body']}`);
      const steps = option.exit ? [0] : stepsBetween(piece.p, option.to);
      const per = option.exit ? 0.7 : Math.min(0.22, 2.2 / Math.max(steps.length, 1));
      // La ficha en marcha va por encima de las demás; al llegar vuelve a su capa (esta limpieza no puede esperar a la del efecto)
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(el, { clearProps: 'zIndex' });
          land();
        }
      });

      gsap.set(el, { zIndex: 6 });

      steps.forEach((p) => {
        const at = percentOf(pointOf(side, p, piece.n));

        tl.to(el, { left: at.left, top: at.top, duration: per, ease: 'power1.inOut' });

        if (body) {
          tl.fromTo(
            body,
            { y: 0 },
            { y: option.exit ? -18 : -10, duration: per / 2, repeat: 1, yoyo: true, ease: 'sine.out' },
            '<'
          );
        }
      });

      option.captures.forEach((k) => {
        const victim = pieces[k];
        const victimEl = find(victim);
        const home = percentOf(pointOf(victim.side, -1, victim.n));

        if (!victimEl) return;

        tl.to(victimEl, { left: home.left, top: home.top, duration: 0.8, ease: 'power2.in' }, '>0.05');
        tl.fromTo(
          victimEl.querySelector(`.${css['piece-body']}`),
          { rotation: 0 },
          { rotation: 360, duration: 0.8, ease: 'none' },
          '<'
        );
      });

      return () => {
        tl.kill();
        if (body) gsap.set(body, { y: 0, rotation: 0 });
      };
    },
    { scope: rootRef, dependencies: [state.motion, canAnimate] }
  );

  // Captura, cielo: aro y confeti sobre la ficha que acaba de llegar
  useGSAP(
    () => {
      const fx = fxRef.current;
      const stop = state.stop;
      const target = stop?.piece ? rootRef.current?.querySelector<HTMLElement>(`[data-piece="${stop.piece}"]`) : null;

      if (!canAnimate || !fx || !stop || !target) return;

      const at = centerIn(target.getBoundingClientRect(), fx.getBoundingClientRect());
      const capture = stop.kind === 'capture' || stop.kind === 'captured';
      const home = stop.kind === 'home';

      ring(fx, at, css.ring, capture ? '#ff5a4a' : '#ffd24a', 0.6);
      burst(fx, at, {
        className: css.spark,
        colors: capture ? CAPTURE_COLORS : home ? HOME_COLORS : FX_COLORS,
        shapes: CONFETTI_SHAPES,
        count: home ? 28 : 16,
        reach: home ? [60, 170] : [36, 100],
        size: [6, 12],
        gravity: capture ? 24 : 40
      });

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [state.stop, canAnimate] }
  );

  // El foco acompaña a la fase: la pregunta, los dados, la ficha a elegir, el botón de seguir o los resultados
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }

    const frame = requestAnimationFrame(() => {
      const mine = state.turn === 'you';
      const target = {
        question: headingRef,
        checked: nextRef,
        roll: mine ? rollRef : undefined,
        choose: mine ? pickRef : undefined,
        stop: nextRef,
        done: summaryRef
      }[state.phase as Exclude<Phase, 'rolling' | 'moving'>];

      target?.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [state.phase, state.turn]);

  if (!total) return null;

  const { phase, turn, pieces } = state;
  const overlay = phase === 'question' || phase === 'checked' || phase === 'done';
  const mine = pieces.filter((piece) => piece.side === 'you');
  const theirs = pieces.filter((piece) => piece.side === 'rival');
  const describe = (list: Piece[]) => list.map((piece) => t.piece(piece.n + 1, t.place[placeOf(piece)])).join('; ');
  const pieceLabel = (piece: Piece, option?: Option) => {
    const base = `${piece.side === 'you' ? t.youName : t.rivalName}. ${t.piece(piece.n + 1, t.place[placeOf(piece)])}`;

    if (!option) return base;

    return `${base}. ${option.exit ? t.option.exit : t.option.move(option.to - piece.p)}${option.captures.length ? ` ${t.option.capture}` : ''}`;
  };

  const hud: { id: string; label: string; icon: IconName; value: React.ReactNode }[] = [
    { id: 'score', label: t.hud.score, icon: 'star', value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame', value: state.streak },
    { id: 'home', label: t.hud.home, icon: 'flag', value: `${homeCount(pieces, 'you')}/${PIECES}` },
    { id: 'captures', label: t.hud.captures, icon: 'target', value: state.captures },
    { id: 'solved', label: t.hud.solved, icon: 'check', value: `${state.solved.length}/${total}` }
  ];

  return (
    <div ref={rootRef} className={`${css.parques} ${addClass ?? ''}`} data-phase={phase} data-turn={turn}>
      <p role="status" className="u-sr-only">
        {state.notice}
      </p>

      <ul className={css.hud}>
        {hud.map(({ id, label, icon, value }) => (
          <li
            key={id}
            className={css['hud-item']}
            data-id={id}
            data-hot={id === 'streak' && state.streak > 1 ? '' : undefined}
          >
            <ParquesIcon name={icon} className={css['hud-icon']} />
            <span className={css['hud-label']}>{label}</span>
            <span className={css['hud-value']}>{value}</span>
          </li>
        ))}
      </ul>

      <div className={css.table}>
        <ParquesSeat side="rival" pieces={theirs} dice={state.dice.rival} active={turn === 'rival' && !overlay}>
          <div className={css['dock-body']}>
            <p className={css['dock-text']}>{state.rivalNote || t.rival.idle}</p>
          </div>
        </ParquesSeat>

        <div className={css.stage} data-overlay={overlay ? '' : undefined}>
          <div className={css['board-layer']}>
            <ParquesBoard
              pieces={pieces}
              label={t.board(describe(mine), describe(theirs))}
              options={turn === 'you' && phase === 'choose' ? state.options : []}
              pieceLabel={pieceLabel}
              onPick={pick}
            />
          </div>

          {overlay && (
            <div className={css.overlay} data-kind="card">
              {phase === 'done' ? (
                <ParquesSummaryCard summary={summaryOf(state)} headingRef={summaryRef} onRestart={restart} />
              ) : (
                item && (
                  <ParquesCard
                    question={item}
                    number={state.solved.length + (phase === 'checked' && state.last?.ok ? 0 : 1)}
                    total={total}
                    order={state.order}
                    selected={state.selected}
                    discarded={state.discarded[item.id] ?? []}
                    verdict={state.last}
                    headingRef={headingRef}
                    verdictRef={verdictRef}
                    nextRef={nextRef}
                    onSelect={select}
                    onCheck={check}
                    onNext={afterCheck}
                  />
                )
              )}
            </div>
          )}
        </div>

        <ParquesSeat side="you" pieces={mine} dice={state.dice.you} active={turn === 'you' && !overlay}>
          <ParquesDock
            phase={phase}
            turn={turn}
            bonus={state.bonus}
            tries={state.tries > 0 && phase === 'roll' ? state.tries : 0}
            roll={state.dice.you}
            pieces={pieces}
            options={state.options}
            stop={state.stop}
            rollRef={rollRef}
            nextRef={nextRef}
            firstPickRef={pickRef}
            onRoll={roll}
            onNext={afterStop}
            onPick={pick}
          />
        </ParquesSeat>
      </div>

      <ul className={css.legend} aria-label={t.legend.label}>
        {LEGEND.map(({ kind, icon }) => (
          <li key={kind} className={css['legend-item']} data-kind={kind}>
            <ParquesIcon name={icon} />
            {t.legend[kind]}
          </li>
        ))}
      </ul>

      <ol className={css.track} aria-label={t.track.label}>
        {questions.map((q, i) => (
          <li key={q.id} className={css['track-item']} data-state={stateOf(q)}>
            <span aria-hidden="true">{stateOf(q) === 'solved' ? <ParquesIcon name="check" /> : i + 1}</span>
            <span className="u-sr-only">
              {t.question} {i + 1}: {t.track[stateOf(q)]}
            </span>
          </li>
        ))}
      </ol>

      <div ref={fxRef} className={css.fx} aria-hidden="true" />
    </div>
  );
};

/** Puntos con cuenta animada. El número real va en texto para lectores de pantalla (la cuenta es solo visual). */
const Score = ({ value }: { value: number }) => {
  const canAnimate = useCanAnimate();
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(0);

  useGSAP(
    () => {
      const el = ref.current;

      if (!el) return;

      if (!canAnimate) {
        shown.current = value;
        el.textContent = String(value);
        return;
      }

      const counter = { value: shown.current };

      gsap.to(counter, {
        value,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: () => {
          shown.current = counter.value;
          el.textContent = String(Math.round(counter.value));
        }
      });
    },
    { dependencies: [value, canAnimate] }
  );

  return (
    <>
      <span ref={ref} aria-hidden="true" />
      <span className="u-sr-only">{value}</span>
    </>
  );
};

GameParques.Init = ParquesInit;

export { GameParques };
