import { useEffect, useReducer, useRef } from 'react';
import gsap from 'gsap';

import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { LanesCard } from './lanes-card';
import { LanesIcon } from './lanes-icons';
import { LanesInit } from './lanes-init';
import { LanesStrip } from './lanes-strip';
import { LanesSummaryCard } from './lanes-summary';
import {
  DRIVE_MS,
  FX_COLORS,
  GOAL_COLORS,
  i18n,
  NITRO_BONUS,
  RIVALS,
  SCORE,
  SMOKE_COLORS,
  STREAK_NITRO
} from './lib/constant';
import type { IconName } from './lib/icons';
import { rankOf } from './lib/rank';

import type { LaneRaceQuestion, LaneRaceResult, LaneRaceSummary, State } from './types/types';

import css from './game-lane-race.module.css';

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];
const SMOKE_SHAPES = ['circle(50%)'];
const LEGEND: { kind: 'lane' | 'ok' | 'ko' | 'nitro'; icon: IconName }[] = [
  { kind: 'lane', icon: 'car' },
  { kind: 'ok', icon: 'check' },
  { kind: 'ko', icon: 'cone' },
  { kind: 'nitro', icon: 'bolt' }
];

const shuffled = (question: LaneRaceQuestion) => gsap.utils.shuffle(question.answers.map((_, k) => k));

interface Props {
  /** Las preguntas: cada una es una puerta con un carril por respuesta. Pásalas como constante: no cambian mientras se juega. */
  questions: LaneRaceQuestion[];
  /** Se llama un instante después de comprobar, para que se vea el veredicto antes de abrir la retroalimentación. */
  onResult?: (result: LaneRaceResult) => void;
  /** Se llama al reintentar una pregunta tras un fallo (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al terminar la carrera, cuando se muestran los resultados. */
  onFinish?: (summary: LaneRaceSummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof LanesInit;
};

/**
 * Carrera de carriles con preguntas: cada respuesta es un carril de la pista y el coche corre por el que elijas.
 *
 * - Acertar abre la puerta: el coche pasa y avanza un tramo. Fallar es un choque: el carril queda bloqueado y se
 *   reintenta con otro.
 * - Tres aciertos seguidos dan un turbo (medio tramo extra).
 * - Tres rivales avanzan con cada respuesta comprobada, acierte o no (nunca más de un tramo): sin choques el jugador
 *   llega siempre primero; con cada choque pierde terreno.
 * - La carrera acaba al acertar todas las preguntas: el último acierto cruza la meta y se reparte el podio.
 */
const GameLaneRace: React.FC<Props> & SubComponents = ({ questions, onResult, onReset, onFinish, addClass }) => {
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
      solved: [],
      seen: [],
      fails: {},
      discarded: {},
      score: 0,
      streak: 0,
      bestStreak: 0,
      firstTry: 0,
      attempts: 0,
      crashes: 0,
      nitros: 0,
      rivals: RIVALS.map(() => 0),
      last: null,
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
  const drove = useRef(-1); // Último trayecto ya resuelto: evita resolverlo dos veces si el efecto se repite

  const item = questions[state.queue[0]] as LaneRaceQuestion | undefined;
  const stateOf = (q: LaneRaceQuestion) =>
    state.solved.includes(q.id) ? 'solved' : state.fails[q.id] ? 'review' : 'pending';

  const progress = state.solved.length + state.nitros * NITRO_BONUS;
  const rank = rankOf(progress, state.rivals);
  const cars = RIVALS.length + 1;

  const summaryOf = (now: State): LaneRaceSummary => {
    const place = rankOf(now.solved.length + now.nitros * NITRO_BONUS, now.rivals);

    return {
      score: now.score,
      total,
      firstTry: now.firstTry,
      bestStreak: now.bestStreak,
      attempts: now.attempts,
      crashes: now.crashes,
      nitros: now.nitros,
      rank: place,
      cars,
      won: place === 1
    };
  };

  const select = (answer: number) => {
    if (stateRef.current.phase !== 'question') return;

    patch({ selected: answer, notice: t.live.lane(stateRef.current.order.indexOf(answer) + 1) });
  };

  const check = () => {
    const now = stateRef.current;
    const q = questions[now.queue[0]];

    if (now.phase !== 'question' || now.selected === null || !q) return;

    const ok = q.answers[now.selected].state === 'success';
    const fails = now.fails[q.id] ?? 0;
    const retry = fails > 0 || now.seen.includes(q.id);
    const firstTry = ok && !retry;
    const streak = ok ? now.streak + 1 : 0;
    const last = ok && now.queue.length === 1;
    const nitro = ok && !last && streak % STREAK_NITRO === 0;
    const points = ok
      ? (retry ? SCORE.retry : SCORE.answer) +
        Math.min(now.streak, SCORE.streakCap) * SCORE.streakStep +
        (nitro ? SCORE.nitro : 0)
      : 0;
    // Los rivales avanzan con cada respuesta comprobada: su ritmo medio, con algo de suerte, sin pasar de un tramo
    const rivals = now.rivals.map((r, i) => r + Math.min(1, RIVALS[i].pace * gsap.utils.random(0.8, 1.15)));
    const progressNow = now.solved.length + (ok ? 1 : 0) + (now.nitros + (nitro ? 1 : 0)) * NITRO_BONUS;

    patch({
      phase: canAnimate ? 'driving' : 'checked',
      last: { ok, firstTry, points, nitro, last, lane: now.selected },
      score: now.score + points,
      streak,
      bestStreak: Math.max(now.bestStreak, streak),
      attempts: now.attempts + 1,
      firstTry: firstTry ? now.firstTry + 1 : now.firstTry,
      crashes: ok ? now.crashes : now.crashes + 1,
      nitros: nitro ? now.nitros + 1 : now.nitros,
      rivals,
      solved: ok ? [...now.solved, q.id] : now.solved,
      seen: ok && !now.seen.includes(q.id) ? [...now.seen, q.id] : now.seen,
      fails: ok ? now.fails : { ...now.fails, [q.id]: fails + 1 },
      discarded: ok ? now.discarded : { ...now.discarded, [q.id]: [...(now.discarded[q.id] ?? []), now.selected] },
      notice: [
        !ok ? t.live.ko : last ? t.live.okLast(points) : nitro ? t.live.okNitro(points) : t.live.ok(points),
        t.live.rank(rankOf(progressNow, rivals), cars)
      ].join(' ')
    });

    const deliver = () => onResult?.({ result: ok, question: q.id, streak, attempts: fails + 1, points });

    // El resultado llega cuando el coche ya ha pasado la puerta (o chocado); sin movimiento, casi de inmediato
    defer(() => (canAnimate ? deliver() : void setTimeout(deliver, 60)), ok, DRIVE_MS);
  };

  /** Tras comprobar: la pregunta siguiente (acierto), los resultados (última pregunta) o reintentar (fallo). */
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
      const won = rankOf(now.solved.length + now.nitros * NITRO_BONUS, now.rivals) === 1;
      const next: State = {
        ...now,
        phase: 'done',
        queue,
        score: now.score + (won ? SCORE.win : 0),
        last: null,
        notice: ''
      };

      patch(next);
      onFinish?.(summaryOf(next));
      return;
    }

    patch({
      phase: 'question',
      queue,
      order: questions[queue[0]] ? shuffled(questions[queue[0]]) : [],
      selected: null,
      last: null,
      notice: t.live.question(now.solved.length + 1)
    });
  };

  const restart = () => {
    flush();
    drove.current = -1;
    patch(createState());
  };

  // El coche acelera hasta la puerta de su carril: si acierta, la cruza; si falla, choca y vuelve a la salida
  useGSAP(
    () => {
      const now = stateRef.current;
      const verdict = now.last;

      if (now.phase !== 'driving' || !verdict || drove.current === now.attempts) return;

      const root = rootRef.current;
      const fx = fxRef.current;
      const car = root?.querySelector<HTMLElement>('[data-car]');
      const lane = root?.querySelector<HTMLElement>(`[data-lane="${verdict.lane}"]`);
      const gate = lane?.querySelector<HTMLElement>('[data-gate]');
      const lanes = root?.querySelector<HTMLElement>('[data-lanes]');
      const finish = () => {
        drove.current = now.attempts;
        if (root) delete root.dataset.speed;
        patch({ phase: 'checked' });
      };

      if (!root || !fx || !car || !gate || !lanes) {
        finish();
        return;
      }

      const carBox = car.getBoundingClientRect();
      const gateBox = gate.getBoundingClientRect();
      const stop = gateBox.left - carBox.right - 2;
      const out = lanes.getBoundingClientRect().right - carBox.left + 16;
      const fxBox = () => fx.getBoundingClientRect();
      const tl = gsap.timeline({ onComplete: finish });

      root.dataset.speed = '';

      if (verdict.ok) {
        tl.to(car, { x: stop, duration: 0.85, ease: 'power2.in' });
        tl.add(() => {
          const at = centerIn(gate.getBoundingClientRect(), fxBox());

          ring(fx, at, css.ring, '#7fe3a5', 0.55);
          burst(fx, at, {
            className: css.spark,
            colors: verdict.last ? GOAL_COLORS : FX_COLORS,
            shapes: CONFETTI_SHAPES,
            count: verdict.last ? 34 : 16,
            reach: verdict.last ? [70, 200] : [40, 120],
            size: [6, 12],
            gravity: 40
          });
        });
        tl.to(car, { x: out, duration: 0.5, ease: 'none' });
        tl.set(car, { x: 0, opacity: 0 });
        tl.to(car, { opacity: 1, duration: 0.3 });
      } else {
        tl.to(car, { x: stop, duration: 0.8, ease: 'power2.in' });
        tl.add(() => {
          // El humo sale del punto de impacto: la barrera, a la altura del carril
          const hit = gate.getBoundingClientRect(); // Medida de ahora: la página pudo desplazarse mientras tanto
          const at = centerIn(new DOMRect(hit.left, hit.top, 0, hit.height), fxBox());

          burst(fx, at, {
            className: css.spark,
            colors: SMOKE_COLORS,
            shapes: SMOKE_SHAPES,
            count: 14,
            reach: [20, 70],
            size: [10, 20],
            gravity: -26
          });
        });
        tl.fromTo(car, { rotation: 0 }, { rotation: 28, duration: 0.14, repeat: 3, yoyo: true, ease: 'sine.inOut' });
        tl.fromTo(gate, { x: 0 }, { x: 8, duration: 0.07, repeat: 5, yoyo: true, ease: 'sine.inOut' }, '<');
        tl.to(car, { x: 0, rotation: 0, duration: 0.7, ease: 'power2.out' });
      }

      return () => {
        tl.kill();
        delete root.dataset.speed;
        gsap.set([car, gate], { clearProps: 'transform,opacity' });
      };
    },
    { scope: rootRef, dependencies: [state.phase, canAnimate] }
  );

  // El foco acompaña a la fase: la pregunta, el botón de seguir o los resultados
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }

    const frame = requestAnimationFrame(() => {
      const target = { question: headingRef, checked: nextRef, done: summaryRef }[
        state.phase as 'question' | 'checked' | 'done'
      ];

      target?.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [state.phase]);

  if (!total) return null;

  const { phase } = state;

  const hud: { id: string; label: string; icon: IconName; value: React.ReactNode }[] = [
    { id: 'score', label: t.hud.score, icon: 'star', value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame', value: state.streak },
    { id: 'rank', label: t.hud.rank, icon: 'flag', value: t.rankOf(rank, cars) },
    { id: 'nitro', label: t.hud.nitro, icon: 'bolt', value: state.nitros },
    { id: 'solved', label: t.hud.solved, icon: 'check', value: `${state.solved.length}/${total}` }
  ];

  return (
    <div ref={rootRef} className={`${css.race} ${addClass ?? ''}`} data-phase={phase}>
      <p role="status" className="u-sr-only">
        {state.notice}
      </p>

      <ul className={css.hud}>
        {hud.map(({ id, label, icon, value }) => (
          <li
            key={id}
            className={css['hud-item']}
            data-id={id}
            data-hot={(id === 'streak' && state.streak > 1) || (id === 'rank' && rank === 1) ? '' : undefined}
          >
            <LanesIcon name={icon} className={css['hud-icon']} />
            <span className={css['hud-label']}>{label}</span>
            <span className={css['hud-value']}>{value}</span>
          </li>
        ))}
      </ul>

      <LanesStrip solved={state.solved.length} nitros={state.nitros} rivals={state.rivals} total={total} />

      {phase === 'done' ? (
        <LanesSummaryCard summary={summaryOf(state)} headingRef={summaryRef} onRestart={restart} />
      ) : (
        item && (
          <LanesCard
            question={item}
            number={state.solved.length + (phase !== 'question' && state.last?.ok ? 0 : 1)}
            total={total}
            phase={phase}
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

      <ul className={css.legend} aria-label={t.legend.label}>
        {LEGEND.map(({ kind, icon }) => (
          <li key={kind} className={css['legend-item']} data-kind={kind}>
            <LanesIcon name={icon} />
            {t.legend[kind]}
          </li>
        ))}
      </ul>

      <ol className={css.track} aria-label={t.track.label}>
        {questions.map((q, i) => (
          <li key={q.id} className={css['track-item']} data-state={stateOf(q)}>
            <span aria-hidden="true">{stateOf(q) === 'solved' ? <LanesIcon name="check" /> : i + 1}</span>
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

GameLaneRace.Init = LanesInit;

export { GameLaneRace };
