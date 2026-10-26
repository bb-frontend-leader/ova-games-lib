import { useEffect, useReducer, useRef } from 'react';
import gsap from 'gsap';

import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import {
  ALT_STEP,
  CAMP_EVERY,
  ENERGY_MAX,
  FX_COLORS,
  i18n,
  SCORE,
  SNOW_COLORS,
  STREAK_ENERGY,
  SUMMIT_COLORS
} from './lib/constant';
import { isCamp, lastCamp, nextStop, pointAt } from './lib/layout';
import { MountainCard } from './mountain-card';
import { MountainIcon } from './mountain-icons';
import { MountainInit } from './mountain-init';
import { MountainResultCard } from './mountain-result';
import { MountainStage } from './mountain-stage';
import { MountainSummaryCard } from './mountain-summary';

import type { Arrival, MountainQuestion, MountainResult, MountainSummary, Phase, State } from './types/types';

import css from './game-mountain-climb.module.css';

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];

const shuffled = (question: MountainQuestion) => gsap.utils.shuffle(question.answers.map((_, k) => k));

interface Props {
  /** Las preguntas: cada acierto sube un tramo. Pásalas como constante: no cambian mientras se juega. */
  questions: MountainQuestion[];
  /** Se llama un instante después de comprobar, para que se vea el veredicto antes de abrir la retroalimentación. */
  onResult?: (result: MountainResult) => void;
  /** Se llama al reintentar una pregunta tras un fallo (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al abrir los resultados, al llegar a la cumbre. */
  onFinish?: (summary: MountainSummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof MountainInit;
};

/**
 * Escalada de montaña con preguntas: cada pregunta acertada sube un tramo del sendero hasta la cumbre.
 *
 * - Fallar descarta la respuesta y quita una de las tres fuerzas: hay que reintentar, sin acierto no se sube.
 * - Cada tres tramos hay un campamento: al llegar se recuperan todas las fuerzas y se gana un bonus.
 * - Quedarse sin fuerzas hace caer hasta el último campamento: las preguntas de los tramos perdidos se vuelven a contestar.
 * - Cada tres aciertos seguidos se recupera una de fuerzas.
 * - Termina al llegar a la cumbre.
 */
const GameMountainClimb: React.FC<Props> & SubComponents = ({ questions, onResult, onReset, onFinish, addClass }) => {
  const lang = useLang();
  const t = i18n[lang];

  const canAnimate = useCanAnimate();
  const { defer, flush } = useDeferredResult();
  const total = questions.length;

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
      energy: ENERGY_MAX,
      falls: 0,
      retraced: 0,
      last: null,
      arrival: null,
      fall: null,
      motion: null,
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
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // El foco solo se mueve cuando la fase cambia por una acción, no al montar
  const landed = useRef(-1); // Último movimiento ya resuelto: evita resolverlo dos veces si el efecto se repite

  const item = questions[state.queue[0]] as MountainQuestion | undefined;
  const stateOf = (q: MountainQuestion) =>
    state.solved.includes(q.id) ? 'solved' : state.fails[q.id] ? 'review' : 'pending';

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
    const retry = fails > 0 || now.seen.includes(q.id); // Repetir una pregunta tras una caída puntúa como un reintento
    const firstTry = ok && !retry;
    const points = ok
      ? (retry ? SCORE.retry : SCORE.answer) + Math.min(now.streak, SCORE.streakCap) * SCORE.streakStep
      : 0;
    const streak = ok ? now.streak + 1 : 0;
    const rested = ok && streak % STREAK_ENERGY === 0 && now.energy < ENERGY_MAX;
    const energy = Math.max(0, ok ? now.energy + (rested ? 1 : 0) : now.energy - 1);
    const fall = !ok && energy === 0;
    const lost = fall ? now.pos - lastCamp(now.pos) : 0;

    patch({
      phase: 'checked',
      last: { ok, firstTry, points, rested, fall, lost },
      score: now.score + points,
      streak,
      bestStreak: Math.max(now.bestStreak, streak),
      attempts: now.attempts + 1,
      firstTry: firstTry ? now.firstTry + 1 : now.firstTry,
      energy,
      solved: ok ? [...now.solved, q.id] : now.solved,
      seen: ok && !now.seen.includes(q.id) ? [...now.seen, q.id] : now.seen,
      fails: ok ? now.fails : { ...now.fails, [q.id]: fails + 1 },
      discarded: ok ? now.discarded : { ...now.discarded, [q.id]: [...(now.discarded[q.id] ?? []), now.selected] },
      notice: ok
        ? [t.live.ok(points), rested ? t.live.okRested : ''].filter(Boolean).join(' ')
        : fall
          ? t.live.koFall
          : t.live.ko(energy, ENERGY_MAX)
    });

    const deliver = () => onResult?.({ result: ok, question: q.id, streak, attempts: fails + 1, points });

    // Sin movimiento no hay espera, pero se deja un instante para que el foco llegue al botón antes del modal de la página
    defer(() => (canAnimate ? deliver() : void setTimeout(deliver, 60)), ok);
  };

  /** Tras comprobar: a subir el tramo (acierto), a reintentar la pregunta (fallo) o a caer al campamento (sin fuerzas). */
  const afterCheck = () => {
    flush(); // Si aún esperaba entregar el resultado, se entrega ya

    const now = stateRef.current;

    if (now.phase !== 'checked' || !now.last) return;

    if (now.last.ok) {
      patch({
        phase: 'climbing',
        motion: { id: now.moves + 1, kind: 'climb', from: now.pos, to: now.pos + 1 },
        moves: now.moves + 1,
        notice: t.live.climbing
      });
      return;
    }

    onReset?.();

    if (now.last.fall) {
      patch({
        phase: 'falling',
        motion: { id: now.moves + 1, kind: 'fall', from: now.pos, to: lastCamp(now.pos) },
        moves: now.moves + 1,
        notice: t.live.falling
      });
      return;
    }

    patch({ phase: 'question', selected: null, last: null, notice: '' });
  };

  /** El escalador ya subió el tramo (o no hay animación): se resuelve dónde está. */
  const land = () => {
    const now = stateRef.current;
    const move = now.motion;

    if (!move || move.kind !== 'climb' || landed.current === move.id) return;

    landed.current = move.id;

    const pos = move.to;
    const queue = now.queue.slice(1);
    let arrival: Arrival | null = null;

    if (pos >= total) arrival = { kind: 'summit', n: pos, points: SCORE.summit };
    else if (isCamp(pos, total)) arrival = { kind: 'camp', n: pos / CAMP_EVERY, points: SCORE.camp };

    if (arrival) {
      patch({
        phase: 'camp',
        pos,
        queue,
        motion: null,
        arrival,
        energy: ENERGY_MAX,
        score: now.score + arrival.points,
        notice: arrival.kind === 'summit' ? t.live.summit(arrival.points) : t.live.camp(arrival.n, arrival.points)
      });
      return;
    }

    patch({
      phase: 'question',
      pos,
      queue,
      motion: null,
      order: shuffled(questions[queue[0]]),
      selected: null,
      last: null,
      notice: t.live.question(pos + 1)
    });
  };

  /** El escalador ya cayó al campamento (o ya estaba en él): las preguntas de los tramos perdidos vuelven a la cola. */
  const landFall = () => {
    const now = stateRef.current;
    const move = now.motion;

    if (!move || move.kind !== 'fall' || landed.current === move.id) return;

    landed.current = move.id;

    const lost = now.pos - move.to;
    const fallen = now.solved.slice(move.to);
    const back = fallen.map((id) => questions.findIndex((q) => q.id === id));
    const discarded = { ...now.discarded };

    fallen.forEach((id) => delete discarded[id]);

    patch({
      phase: 'fell',
      pos: move.to,
      queue: [now.queue[0], ...gsap.utils.shuffle(back), ...now.queue.slice(1)],
      solved: now.solved.slice(0, move.to),
      discarded,
      energy: ENERGY_MAX,
      falls: lost > 0 ? now.falls + 1 : now.falls,
      retraced: now.retraced + lost,
      fall: { lost, to: move.to },
      motion: null,
      notice: t.live.fell(lost)
    });
  };

  /** Tras el campamento o la caída: la siguiente pregunta, o los resultados si se llegó a la cumbre. */
  const afterStop = () => {
    const now = stateRef.current;

    if (now.phase === 'camp' && now.arrival) {
      if (now.arrival.kind === 'summit') {
        patch({ phase: 'done', arrival: null, notice: '' });
        onFinish?.({
          score: now.score,
          total,
          firstTry: now.firstTry,
          bestStreak: now.bestStreak,
          attempts: now.attempts,
          falls: now.falls,
          retraced: now.retraced
        });
        return;
      }

      patch({
        phase: 'question',
        arrival: null,
        order: shuffled(questions[now.queue[0]]),
        selected: null,
        last: null,
        notice: t.live.question(now.pos + 1)
      });
      return;
    }

    if (now.phase === 'fell') {
      // Sigue la pregunta que se falló, con sus respuestas descartadas
      patch({ phase: 'question', fall: null, selected: null, last: null, notice: t.live.question(now.pos + 1) });
    }
  };

  const restart = () => {
    flush();
    landed.current = -1;
    patch(createState());
  };

  // Acierto: aro y confeti desde el veredicto. Fallo: temblor, y el escalador resbala levantando nieve.
  useGSAP(
    () => {
      const fx = fxRef.current;
      const verdict = verdictRef.current;
      const last = state.last;

      if (!last || !canAnimate || !fx || !verdict) return;

      if (last.ok) {
        const at = centerIn(verdict.getBoundingClientRect(), fx.getBoundingClientRect());

        ring(fx, at, css.ring, '#ffb347', 0.5);
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

        const climber = rootRef.current?.querySelector<SVGGElement>('[data-climber]');
        const body = rootRef.current?.querySelector<SVGGElement>('[data-body]');

        if (climber && body) {
          const at = centerIn(climber.getBoundingClientRect(), fx.getBoundingClientRect());

          burst(fx, at, {
            className: css.spark,
            colors: SNOW_COLORS,
            shapes: ['circle(50%)'],
            count: 8,
            reach: [14, 40],
            size: [4, 8],
            gravity: 14
          });
          gsap.fromTo(
            body,
            { rotation: -26, y: 3, transformOrigin: '50% 100%' },
            { rotation: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' }
          );
        }
      }

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [state.last, canAnimate] }
  );

  // El escalador sube un tramo o cae por el sendero hasta el campamento; al llegar se resuelve dónde queda
  useGSAP(
    () => {
      const move = state.motion;

      if (!move) return;

      const climber = rootRef.current?.querySelector<SVGGElement>('[data-climber]');
      const body = rootRef.current?.querySelector<SVGGElement>('[data-body]');
      const finish = move.kind === 'climb' ? land : landFall;

      if (!canAnimate || !climber || move.from === move.to) {
        finish(); // Sin movimiento (o si no hay camino que recorrer) no hay nada que esperar
        return;
      }

      const progress = { f: move.from };
      const distance = Math.abs(move.to - move.from);
      const place = () => {
        const { x, y } = pointAt(progress.f, total);

        climber.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      };

      const tween = gsap.to(progress, {
        f: move.to,
        duration: move.kind === 'climb' ? 0.9 : 0.5 + 0.22 * distance,
        ease: move.kind === 'climb' ? 'power1.inOut' : 'power2.in',
        onUpdate: place,
        onComplete: finish
      });

      // Esfuerzo al subir, voltereta al caer
      const motion = body
        ? move.kind === 'climb'
          ? gsap.fromTo(
              body,
              { rotation: -5, transformOrigin: '50% 100%' },
              { rotation: 5, duration: 0.15, repeat: 5, yoyo: true, ease: 'sine.inOut' }
            )
          : gsap.to(body, {
              rotation: 360 * Math.min(2, distance),
              duration: tween.duration(),
              transformOrigin: '50% 50%',
              ease: 'none'
            })
        : null;

      return () => {
        tween.kill();
        motion?.kill();
        if (body) gsap.set(body, { rotation: 0 });
      };
    },
    { scope: rootRef, dependencies: [state.motion, canAnimate] }
  );

  // Campamento, cumbre o caída: confeti de colores, destellos dorados en la cumbre o nieve levantada
  useGSAP(
    () => {
      const fx = fxRef.current;
      const climber = rootRef.current?.querySelector<SVGGElement>('[data-climber]');

      if (!canAnimate || !fx || !climber || (!state.arrival && !state.fall)) return;

      const at = centerIn(climber.getBoundingClientRect(), fx.getBoundingClientRect());

      if (state.arrival) {
        const summit = state.arrival.kind === 'summit';

        ring(fx, at, css.ring, summit ? '#ffe066' : '#ffb347', 0.6);
        burst(fx, at, {
          className: css.spark,
          colors: summit ? SUMMIT_COLORS : FX_COLORS,
          shapes: CONFETTI_SHAPES,
          count: summit ? 30 : 16,
          reach: summit ? [70, 190] : [40, 100],
          size: [6, 12],
          gravity: 40
        });
      } else if (state.fall && state.fall.lost > 0) {
        burst(fx, at, {
          className: css.spark,
          colors: SNOW_COLORS,
          shapes: ['circle(50%)'],
          count: 14,
          reach: [20, 70],
          size: [5, 10],
          gravity: 18
        });
      }

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [state.arrival, state.fall, canAnimate] }
  );

  // El foco acompaña a la fase: la pregunta, el botón de seguir o los resultados
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }

    const frame = requestAnimationFrame(() => {
      const target = {
        question: headingRef,
        checked: nextRef,
        camp: nextRef,
        fell: nextRef,
        done: summaryRef
      }[state.phase as Exclude<Phase, 'climbing' | 'falling'>];

      target?.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [state.phase]);

  if (!total) return null;

  const { phase, pos } = state;
  const summit = pos >= total;
  const stop = nextStop(pos, total);
  const summary: MountainSummary = {
    score: state.score,
    total,
    firstTry: state.firstTry,
    bestStreak: state.bestStreak,
    attempts: state.attempts,
    falls: state.falls,
    retraced: state.retraced
  };

  const hud = [
    { id: 'score', label: t.hud.score, icon: 'star' as const, value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame' as const, value: state.streak },
    {
      id: 'energy',
      label: t.hud.energy,
      icon: 'bolt' as const,
      value: (
        <>
          <span className={css.pips} aria-hidden="true">
            {Array.from({ length: ENERGY_MAX }, (_, k) => (
              <span key={k} className={css.pip} data-on={k < state.energy ? '' : undefined} />
            ))}
          </span>
          <span className="u-sr-only">{t.energyOf(state.energy, ENERGY_MAX)}</span>
        </>
      )
    },
    { id: 'solved', label: t.hud.solved, icon: 'check' as const, value: `${pos}/${total}` }
  ];

  return (
    <div ref={rootRef} className={`${css.climb} ${addClass ?? ''}`} data-phase={phase}>
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
            data-low={id === 'energy' && state.energy === 1 ? '' : undefined}
          >
            <MountainIcon name={icon} className={css['hud-icon']} />
            <span className={css['hud-label']}>{label}</span>
            <span className={css['hud-value']}>{value}</span>
          </li>
        ))}
      </ul>

      <div className={css.play}>
        <div className={css['field-wrap']}>
          <div className={css.toolbar}>
            <span className={css.counter}>
              <MountainIcon name="mountain" />
              {t.altitude(pos * ALT_STEP)}
            </span>

            {!summit && (
              <span className={css.stop}>
                <MountainIcon name={stop === total ? 'flag' : 'tent'} />
                {t.nextStop(stop - pos, stop === total)}
              </span>
            )}
          </div>

          <MountainStage total={total} pos={pos} label={t.stage(pos, total, pos * ALT_STEP)} />
        </div>

        <div className={css.side}>
          {(phase === 'question' || phase === 'checked') && item && (
            <MountainCard
              question={item}
              number={pos + 1}
              total={total}
              order={state.order}
              selected={state.selected}
              discarded={state.discarded[item.id] ?? []}
              verdict={state.last}
              energy={state.energy}
              headingRef={headingRef}
              verdictRef={verdictRef}
              nextRef={nextRef}
              onSelect={select}
              onCheck={check}
              onNext={afterCheck}
            />
          )}

          {(phase === 'camp' || phase === 'fell') && (
            <MountainResultCard arrival={state.arrival} fall={state.fall} nextRef={nextRef} onNext={afterStop} />
          )}

          {phase === 'done' && <MountainSummaryCard summary={summary} headingRef={summaryRef} onRestart={restart} />}
        </div>
      </div>

      <ol className={css.track} aria-label={t.track.label}>
        {questions.map((q, i) => (
          <li key={q.id} className={css['track-item']} data-state={stateOf(q)}>
            <span aria-hidden="true">{stateOf(q) === 'solved' ? <MountainIcon name="check" /> : i + 1}</span>
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

GameMountainClimb.Init = MountainInit;

export { GameMountainClimb };
