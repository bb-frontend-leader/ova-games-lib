import { useEffect, useMemo, useReducer, useRef } from 'react';
import gsap from 'gsap';

import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { FX_COLORS, GOAL_COLORS, i18n, SCORE, SNAKE_COLORS, STREAK_SHIELD } from './lib/constant';
import type { IconName } from './lib/icons';
import { buildBoard, cellsFor, gridOf, linkAt, pawnAt, tileAt } from './lib/layout';
import { SnakesBoard } from './snakes-board';
import { SnakesCard } from './snakes-card';
import { SnakesDock } from './snakes-dock';
import { SnakesIcon } from './snakes-icons';
import { SnakesInit } from './snakes-init';
import { SnakesSummaryCard } from './snakes-summary';

import type { Phase, SnakesQuestion, SnakesResult, SnakesSummary, State } from './types/types';

import css from './game-snakes-ladders.module.css';

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];
const LEGEND: { kind: 'ladder' | 'snake' | 'six' | 'shield'; icon: IconName }[] = [
  { kind: 'ladder', icon: 'ladder' },
  { kind: 'snake', icon: 'snake' },
  { kind: 'six', icon: 'dice' },
  { kind: 'shield', icon: 'shield' }
];

const shuffled = (question: SnakesQuestion) => gsap.utils.shuffle(question.answers.map((_, k) => k));

/** Casillas por las que pasa la ficha al ir de `from` a `to` (sin contar la de salida). */
const between = (from: number, to: number) => {
  const dir = to > from ? 1 : -1;

  return Array.from({ length: Math.abs(to - from) }, (_, k) => from + dir * (k + 1));
};

interface Props {
  /** Las preguntas: cada acierto da una tirada de dado. Pásalas como constante: no cambian mientras se juega. */
  questions: SnakesQuestion[];
  /** Se llama un instante después de comprobar, para que se vea el veredicto antes de abrir la retroalimentación. */
  onResult?: (result: SnakesResult) => void;
  /** Se llama al reintentar una pregunta tras un fallo (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al abrir los resultados, al cruzar la meta. */
  onFinish?: (summary: SnakesSummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof SnakesInit;
};

/**
 * Serpientes y escaleras con preguntas: cada pregunta acertada da una tirada de dado para avanzar por el tablero.
 *
 * - Fallar descarta la respuesta: hay que reintentar, sin acierto no hay tirada.
 * - Escalera: al caer en su pie se sube hasta su extremo. Serpiente: al caer en su cabeza se resbala hasta su cola.
 * - Un 6 en el dado da otra tirada sin pregunta. Tres aciertos seguidos dan un escudo que frena la próxima serpiente.
 * - La meta se cruza al acertar la última pregunta: ese acierto lleva la ficha hasta ella. Antes, la casilla
 *   anterior a la meta es un muro: si el dado se pasa, la ficha rebota hacia atrás.
 */
const GameSnakesLadders: React.FC<Props> & SubComponents = ({ questions, onResult, onReset, onFinish, addClass }) => {
  const lang = useLang();
  const t = i18n[lang];

  const canAnimate = useCanAnimate();
  const { defer, flush } = useDeferredResult();
  const total = questions.length;
  const goal = cellsFor(total);
  const { cells: board, links } = useMemo(() => buildBoard(goal), [goal]);

  const createState = (): State => {
    const queue = gsap.utils.shuffle(questions.map((_, k) => k));

    return {
      phase: 'question',
      queue,
      order: questions[queue[0]] ? shuffled(questions[queue[0]]) : [],
      selected: null,
      pos: 0,
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
      ladders: 0,
      snakes: 0,
      shields: 0,
      shield: 0,
      bonus: false,
      die: 0,
      dieKey: 0,
      last: null,
      motion: null,
      stop: null,
      moves: 0,
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
  const dieRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // El foco solo se mueve cuando la fase cambia por una acción, no al montar
  const landed = useRef(-1); // Último movimiento ya resuelto: evita resolverlo dos veces si el efecto se repite
  const rolled = useRef(-1); // Última tirada ya resuelta, por lo mismo

  const item = questions[state.queue[0]] as SnakesQuestion | undefined;
  const stateOf = (q: SnakesQuestion) =>
    state.solved.includes(q.id) ? 'solved' : state.fails[q.id] ? 'review' : 'pending';

  const summaryOf = (now: State): SnakesSummary => ({
    score: now.score,
    total,
    firstTry: now.firstTry,
    bestStreak: now.bestStreak,
    attempts: now.attempts,
    rolls: now.rolls,
    ladders: now.ladders,
    snakes: now.snakes,
    shields: now.shields
  });

  /** Siguiente pregunta de la cola, con las respuestas en orden nuevo. */
  const toQuestion = (now: State, extra: Partial<State> = {}) => {
    const queue = extra.queue ?? now.queue;

    patch({
      phase: 'question',
      queue,
      order: questions[queue[0]] ? shuffled(questions[queue[0]]) : [],
      selected: null,
      last: null,
      motion: null,
      stop: null,
      notice: t.live.question(now.solved.length + 1),
      ...extra
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
    const shield = ok && !last && streak % STREAK_SHIELD === 0 && now.shield < 1;

    patch({
      phase: 'checked',
      last: { ok, firstTry, points, shield, last },
      score: now.score + points,
      streak,
      bestStreak: Math.max(now.bestStreak, streak),
      attempts: now.attempts + 1,
      firstTry: firstTry ? now.firstTry + 1 : now.firstTry,
      shield: shield ? now.shield + 1 : now.shield,
      solved: ok ? [...now.solved, q.id] : now.solved,
      seen: ok && !now.seen.includes(q.id) ? [...now.seen, q.id] : now.seen,
      fails: ok ? now.fails : { ...now.fails, [q.id]: fails + 1 },
      discarded: ok ? now.discarded : { ...now.discarded, [q.id]: [...(now.discarded[q.id] ?? []), now.selected] },
      notice: !ok ? t.live.ko : last ? t.live.okLast(points) : shield ? t.live.okShield(points) : t.live.ok(points)
    });

    const deliver = () => onResult?.({ result: ok, question: q.id, streak, attempts: fails + 1, points });

    // Sin movimiento no hay espera, pero se deja un instante para que el foco llegue al botón antes del modal de la página
    defer(() => (canAnimate ? deliver() : void setTimeout(deliver, 60)), ok);
  };

  /** Tras comprobar: al dado (acierto), a la meta (última pregunta) o a reintentar (fallo). */
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

    if (verdict.last) {
      patch({
        phase: 'moving',
        queue,
        last: null,
        motion: { id: now.moves + 1, kind: 'final', from: now.pos, to: goal, peak: null, again: false },
        moves: now.moves + 1,
        notice: t.live.moving
      });
      return;
    }

    patch({ phase: 'roll', queue, last: null, bonus: false, notice: t.live.roll });
  };

  const roll = () => {
    const now = stateRef.current;

    if (now.phase !== 'roll') return;

    patch({
      phase: 'rolling',
      die: 1 + Math.floor(Math.random() * 6),
      dieKey: now.dieKey + 1,
      rolls: now.rolls + 1,
      notice: ''
    });
  };

  /** El dado ya rodó (o no hay animación): la ficha avanza lo que salió, rebotando si se pasa del muro antes de la meta. */
  const afterRoll = () => {
    const now = stateRef.current;

    if (now.phase !== 'rolling' || rolled.current === now.dieKey) return;

    rolled.current = now.dieKey;

    const cap = goal - 1;
    const raw = now.pos + now.die;
    const over = raw > cap;
    const target = over ? Math.max(1, 2 * cap - raw) : raw;

    patch({
      phase: 'moving',
      bonus: false,
      motion: {
        id: now.moves + 1,
        kind: 'hop',
        from: now.pos,
        to: target,
        peak: over ? cap : null,
        again: now.die === 6
      },
      moves: now.moves + 1,
      notice: [t.live.rolled(now.die), t.live.moving].join(' ')
    });
  };

  /** La ficha ya llegó a su casilla (o no hay animación): se resuelve qué pasa ahí. */
  const land = () => {
    const now = stateRef.current;
    const move = now.motion;

    if (!move || landed.current === move.id) return;

    landed.current = move.id;

    const pos = move.to;

    if (move.kind === 'final') {
      patch({
        phase: 'stop',
        pos,
        motion: null,
        stop: { kind: 'final', at: pos, to: null, points: SCORE.goal, again: false },
        score: now.score + SCORE.goal,
        notice: t.live.stop(t.stops.final.title, t.stops.final.text)
      });
      return;
    }

    const link = move.kind === 'hop' ? linkAt(links, pos) : null; // Subir o resbalar no vuelve a activar casillas

    if (link) {
      const ladder = link.kind === 'ladder';
      const shielded = !ladder && now.shield > 0;
      const stop = shielded
        ? { kind: 'shield' as const, at: pos, to: null, points: 0, again: move.again }
        : { kind: link.kind, at: pos, to: link.to, points: ladder ? SCORE.ladder : 0, again: move.again };
      const text = shielded ? t.stops.shield.text : t.stops[link.kind].text(pos, link.to);

      patch({
        phase: 'stop',
        pos,
        motion: null,
        stop,
        score: now.score + stop.points,
        ladders: ladder ? now.ladders + 1 : now.ladders,
        snakes: !ladder && !shielded ? now.snakes + 1 : now.snakes,
        shield: shielded ? now.shield - 1 : now.shield,
        shields: shielded ? now.shields + 1 : now.shields,
        notice: t.live.stop(t.stops[stop.kind].title, text)
      });
      return;
    }

    if (move.peak !== null) {
      patch({
        phase: 'stop',
        pos,
        motion: null,
        stop: { kind: 'bounce', at: pos, to: null, points: 0, again: move.again },
        notice: t.live.stop(t.stops.bounce.title, t.stops.bounce.text)
      });
      return;
    }

    // Un 6 da otra tirada, sin pregunta
    if (move.again) {
      patch({ phase: 'roll', pos, motion: null, bonus: true, notice: t.live.roll });
      return;
    }

    toQuestion(now, { pos });
  };

  /** Tras una parada: la meta lleva a los resultados; una escalera o serpiente mueve la ficha; si no, sigue el juego. */
  const afterStop = () => {
    const now = stateRef.current;
    const stop = now.stop;

    if (now.phase !== 'stop' || !stop) return;

    if (stop.kind === 'final') {
      patch({ phase: 'done', stop: null, notice: '' });
      onFinish?.(summaryOf(now));
      return;
    }

    if (stop.to !== null) {
      patch({
        phase: 'moving',
        stop: null,
        motion: {
          id: now.moves + 1,
          kind: stop.kind === 'ladder' ? 'climb' : 'slide',
          from: stop.at,
          to: stop.to,
          peak: null,
          again: stop.again
        },
        moves: now.moves + 1,
        notice: t.live.moving
      });
      return;
    }

    if (stop.again) {
      patch({ phase: 'roll', stop: null, bonus: true, notice: t.live.roll });
      return;
    }

    toQuestion(now);
  };

  const restart = () => {
    flush();
    landed.current = -1;
    rolled.current = -1;
    patch(createState());
  };

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

  // El dado rueda cambiando de cara y, al parar, deja la que salió; entonces la ficha se pone en marcha
  useGSAP(
    () => {
      const die = dieRef.current;

      if (state.phase !== 'rolling') return;

      if (!canAnimate || !die) {
        if (die) die.dataset.face = String(state.die);
        afterRoll();
        return;
      }

      const progress = { k: 0 };
      let shown = 0;

      die.dataset.face = String(1 + Math.floor(Math.random() * 6)); // No se ve la cara final antes de rodar

      const tween = gsap.to(progress, {
        k: 1,
        duration: 0.95,
        ease: 'power1.out',
        onUpdate: () => {
          const step = Math.floor(progress.k * 11);

          if (step === shown) return;

          shown = step;
          die.dataset.face = String(1 + ((step * 5 + (step % 3)) % 6));
        },
        onComplete: () => {
          die.dataset.face = String(stateRef.current.die);
          afterRoll();
        }
      });
      const spin = gsap.fromTo(
        die,
        { rotation: 0, y: 0 },
        { rotation: 720, y: -18, duration: 0.95, ease: 'power2.out' }
      );
      const drop = gsap.fromTo(
        die,
        { scale: 1 },
        { scale: 1.15, duration: 0.2, repeat: 3, yoyo: true, ease: 'sine.inOut' }
      );

      return () => {
        tween.kill();
        spin.kill();
        drop.kill();
        gsap.set(die, { rotation: 0, y: 0, scale: 1 });
        die.dataset.face = String(stateRef.current.die || 1);
      };
    },
    { scope: rootRef, dependencies: [state.phase, state.dieKey, canAnimate] }
  );

  // La ficha avanza casilla a casilla, sube la escalera o resbala por la serpiente; al llegar se resuelve dónde queda
  useGSAP(
    () => {
      const move = state.motion;

      if (!move) return;

      const pawn = rootRef.current?.querySelector<HTMLElement>('[data-pawn]');
      const body = rootRef.current?.querySelector<HTMLElement>('[data-pawn-body]');

      if (!canAnimate || !pawn || move.from === move.to) {
        land(); // Sin movimiento (o si no hay camino que recorrer) no hay nada que esperar
        return;
      }

      const direct = move.kind === 'climb' || move.kind === 'slide';
      const cells = direct
        ? [move.to]
        : move.peak !== null
          ? [...between(move.from, move.peak), ...between(move.peak, move.to)]
          : between(move.from, move.to);
      const per = direct ? (move.kind === 'climb' ? 1 : 0.8) : Math.min(0.2, 1.8 / cells.length);
      const tl = gsap.timeline({ onComplete: land });

      cells.forEach((cell) => {
        const at = pawnAt(cell, goal);

        tl.to(pawn, {
          left: at.left,
          top: at.top,
          duration: per,
          ease: move.kind === 'slide' ? 'power2.in' : direct ? 'power1.inOut' : 'power1.inOut'
        });

        if (body && !direct) {
          tl.fromTo(body, { y: 0 }, { y: -10, duration: per / 2, repeat: 1, yoyo: true, ease: 'sine.out' }, '<');
        }
      });

      // Subir la escalera es un trepar con sacudidas; bajar por la serpiente, una voltereta
      if (body && move.kind === 'climb') {
        tl.fromTo(
          body,
          { rotation: -10 },
          { rotation: 10, duration: 0.12, repeat: 7, yoyo: true, ease: 'sine.inOut' },
          0
        );
      } else if (body && move.kind === 'slide') {
        tl.fromTo(body, { rotation: 0 }, { rotation: 360 * 2, duration: per, ease: 'none' }, 0);
      }

      return () => {
        tl.kill();
        if (body) gsap.set(body, { y: 0, rotation: 0 });
      };
    },
    { scope: rootRef, dependencies: [state.motion, canAnimate] }
  );

  // Escalera, serpiente, escudo o meta: aro y confeti sobre la ficha (verde y blanco si es serpiente)
  useGSAP(
    () => {
      const fx = fxRef.current;
      const pawn = rootRef.current?.querySelector<HTMLElement>('[data-pawn]');
      const stop = state.stop;

      if (!canAnimate || !fx || !pawn || !stop || stop.kind === 'bounce') return;

      const at = centerIn(pawn.getBoundingClientRect(), fx.getBoundingClientRect());
      const snake = stop.kind === 'snake';
      const final = stop.kind === 'final';

      if (snake) {
        burst(fx, at, {
          className: css.spark,
          colors: SNAKE_COLORS,
          shapes: ['circle(50%)'],
          count: 12,
          reach: [16, 55],
          size: [5, 10],
          gravity: 16
        });
      } else {
        ring(fx, at, css.ring, final ? '#fff3b0' : stop.kind === 'shield' ? '#9fd8ff' : '#ffd24a', 0.6);
        burst(fx, at, {
          className: css.spark,
          colors: final ? GOAL_COLORS : FX_COLORS,
          shapes: CONFETTI_SHAPES,
          count: final ? 32 : 14,
          reach: final ? [70, 200] : [36, 100],
          size: [6, 12],
          gravity: 40
        });
      }

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [state.stop, canAnimate] }
  );

  // El foco acompaña a la fase: la pregunta, el dado, el botón de seguir o los resultados
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }

    const frame = requestAnimationFrame(() => {
      const target = {
        question: headingRef,
        checked: nextRef,
        roll: rollRef,
        stop: nextRef,
        done: summaryRef
      }[state.phase as Exclude<Phase, 'rolling' | 'moving'>];

      target?.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [state.phase]);

  if (!total) return null;

  const { phase, pos } = state;
  const { cols, rows } = gridOf(goal);
  const side = tileAt(pos, cols).row < rows / 2 ? 'top' : 'bottom'; // La tarjeta pequeña se apoya lejos de la ficha
  const overlay =
    phase === 'question' || phase === 'checked' || phase === 'done'
      ? 'card'
      : phase === 'roll' || phase === 'rolling' || phase === 'moving' || phase === 'stop'
        ? 'dock'
        : null;
  const ladderCount = links.filter((l) => l.kind === 'ladder').length;

  const hud: { id: string; label: string; icon: IconName; value: React.ReactNode }[] = [
    { id: 'score', label: t.hud.score, icon: 'star', value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame', value: state.streak },
    { id: 'cell', label: t.hud.cell, icon: 'flag', value: `${pos}/${goal}` },
    { id: 'solved', label: t.hud.solved, icon: 'check', value: `${state.solved.length}/${total}` },
    {
      id: 'shield',
      label: t.hud.shield,
      icon: 'shield',
      value: (
        <>
          <span aria-hidden="true">{state.shield ? '✓' : '—'}</span>
          <span className="u-sr-only">{t.shieldOf(state.shield)}</span>
        </>
      )
    }
  ];

  return (
    <div ref={rootRef} className={`${css.snakes} ${addClass ?? ''}`} data-phase={phase}>
      <p role="status" className="u-sr-only">
        {state.notice}
      </p>

      <ul className={css.hud}>
        {hud.map(({ id, label, icon, value }) => (
          <li
            key={id}
            className={css['hud-item']}
            data-id={id}
            data-hot={(id === 'streak' && state.streak > 1) || (id === 'shield' && state.shield) ? '' : undefined}
          >
            <SnakesIcon name={icon} className={css['hud-icon']} />
            <span className={css['hud-label']}>{label}</span>
            <span className={css['hud-value']}>{value}</span>
          </li>
        ))}
      </ul>

      <div className={css.table} data-overlay={overlay ?? undefined}>
        <div className={css['board-layer']}>
          <SnakesBoard
            board={board}
            links={links}
            pos={pos}
            label={t.board(pos, goal, ladderCount, links.length - ladderCount)}
          />
        </div>

        {overlay === 'card' && (
          <div className={css.overlay} data-kind="card">
            {phase === 'done' ? (
              <SnakesSummaryCard summary={summaryOf(state)} headingRef={summaryRef} onRestart={restart} />
            ) : (
              item && (
                <SnakesCard
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

        {overlay === 'dock' && (phase === 'roll' || phase === 'rolling' || phase === 'moving' || phase === 'stop') && (
          <div className={css.overlay} data-kind="dock" data-side={side}>
            <SnakesDock
              phase={phase}
              die={state.die}
              bonus={state.bonus}
              stop={state.stop}
              dieRef={dieRef}
              rollRef={rollRef}
              nextRef={nextRef}
              onRoll={roll}
              onNext={afterStop}
            />
          </div>
        )}
      </div>

      <ul className={css.legend} aria-label={t.legend.label}>
        {LEGEND.map(({ kind, icon }) => (
          <li key={kind} className={css['legend-item']} data-kind={kind}>
            <SnakesIcon name={icon} />
            {t.legend[kind]}
          </li>
        ))}
      </ul>

      <ol className={css.track} aria-label={t.track.label}>
        {questions.map((q, i) => (
          <li key={q.id} className={css['track-item']} data-state={stateOf(q)}>
            <span aria-hidden="true">{stateOf(q) === 'solved' ? <SnakesIcon name="check" /> : i + 1}</span>
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

GameSnakesLadders.Init = SnakesInit;

export { GameSnakesLadders };
