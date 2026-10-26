import { useEffect, useReducer, useRef } from 'react';
import gsap from 'gsap';

import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { CometaCard } from './cometa-card';
import { CometaIcon } from './cometa-icons';
import { CometaInit } from './cometa-init';
import { CometaStage } from './cometa-stage';
import { CometaSummaryCard } from './cometa-summary';
import { FX_COLORS, GUST_COLORS, i18n, MAX_SPOOL, rankOf, SCORE, STREAK_SPOOL } from './lib/constant';
import { fractionOf, kitePoint, stringPath } from './lib/layout';

import type { CometaQuestion, CometaResult, CometaSummary, State } from './types/types';

import css from './game-cometa.module.css';

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];

const shuffled = (question: CometaQuestion) => gsap.utils.shuffle(question.answers.map((_, k) => k));

interface Props {
  /** Las preguntas: cada acierto sube la cometa. Pásalas como constante: no cambian mientras se juega. */
  questions: CometaQuestion[];
  /** Se llama un instante después de comprobar, para que se vea el veredicto antes de abrir la retroalimentación. */
  onResult?: (result: CometaResult) => void;
  /** Se llama al reintentar una pregunta tras un fallo (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al abrir los resultados, cuando todas las preguntas están acertadas y la cometa llegó a la cima. */
  onFinish?: (summary: CometaSummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof CometaInit;
};

/**
 * Cometas de agosto: cada pregunta acertada sube la cometa un peldaño hacia la cima.
 *
 * - Fallar descarta la respuesta, una ráfaga baja la cometa y hay que reintentar la pregunta para recuperar la altura.
 * - Cada acierto a la primera añade un lazo de color a la cola.
 * - Cada tres aciertos seguidos se gana un carrete de reserva: la próxima ráfaga no hace perder altura.
 * - Termina cuando todas las preguntas están acertadas y la cometa llegó a la cima.
 */
const GameCometa: React.FC<Props> & SubComponents = ({ questions, onResult, onReset, onFinish, addClass }) => {
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
      at: 0,
      order: questions[queue[0]] ? shuffled(questions[queue[0]]) : [],
      selected: null,
      solved: [],
      fails: {},
      discarded: {},
      score: 0,
      streak: 0,
      bestStreak: 0,
      firstTry: 0,
      attempts: 0,
      falls: 0,
      saves: 0,
      spool: 0,
      dip: 0,
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
  const shown = useRef(0); // Altura (0–1) con la que está dibujada la cometa ahora mismo

  const item = questions[state.queue[state.at]] as CometaQuestion | undefined;
  const stateOf = (q: CometaQuestion) =>
    state.solved.includes(q.id) ? 'solved' : state.fails[q.id] ? 'review' : 'pending';
  const climbed = Math.max(0, state.solved.length - state.dip);
  const height = fractionOf(climbed, total);

  const select = (answer: number) => {
    if (stateRef.current.phase !== 'question') return;

    patch({ selected: answer });
  };

  const check = () => {
    const now = stateRef.current;
    const q = questions[now.queue[now.at]];

    if (now.phase !== 'question' || now.selected === null || !q) return;

    const ok = q.answers[now.selected].state === 'success';
    const fails = now.fails[q.id] ?? 0;
    const retry = fails > 0;
    const firstTry = ok && !retry;
    const points = ok
      ? (retry ? SCORE.retry : SCORE.answer) + Math.min(now.streak, SCORE.streakCap) * SCORE.streakStep
      : 0;
    const streak = ok ? now.streak + 1 : 0;
    const spool = ok && streak % STREAK_SPOOL === 0 && now.spool < MAX_SPOOL;
    const saved = !ok && now.spool > 0;

    patch({
      phase: 'checked',
      last: { ok, firstTry, points, spool, saved },
      score: now.score + points,
      streak,
      bestStreak: Math.max(now.bestStreak, streak),
      attempts: now.attempts + 1,
      firstTry: firstTry ? now.firstTry + 1 : now.firstTry,
      spool: now.spool + (spool ? 1 : 0) - (saved ? 1 : 0),
      falls: !ok && !saved ? now.falls + 1 : now.falls,
      saves: saved ? now.saves + 1 : now.saves,
      dip: ok ? 0 : saved ? now.dip : 1,
      solved: ok ? [...now.solved, q.id] : now.solved,
      fails: ok ? now.fails : { ...now.fails, [q.id]: fails + 1 },
      discarded: ok ? now.discarded : { ...now.discarded, [q.id]: [...(now.discarded[q.id] ?? []), now.selected] },
      notice: ok
        ? [t.live.ok(points, firstTry), spool ? t.live.okSpool : ''].filter(Boolean).join(' ')
        : saved
          ? t.live.koSaved
          : t.live.ko
    });

    const deliver = () => onResult?.({ result: ok, question: q.id, streak, attempts: fails + 1, points });

    // Sin movimiento no hay espera, pero se deja un instante para que el foco llegue al botón antes del modal de la página
    defer(() => (canAnimate ? deliver() : void setTimeout(deliver, 60)), ok);
  };

  /** Tras comprobar: la siguiente pregunta o los resultados (acierto), o reintentar la misma pregunta (fallo). */
  const afterCheck = () => {
    flush(); // Si aún esperaba entregar el resultado, se entrega ya

    const now = stateRef.current;

    if (now.phase !== 'checked' || !now.last) return;

    if (!now.last.ok) {
      onReset?.();
      patch({ phase: 'question', selected: null, last: null, notice: '' });
      return;
    }

    if (now.solved.length === total) {
      patch({ phase: 'done', notice: '' });
      onFinish?.({
        score: now.score,
        total,
        firstTry: now.firstTry,
        bestStreak: now.bestStreak,
        attempts: now.attempts,
        falls: now.falls,
        saves: now.saves,
        rank: rankOf(now.firstTry, total)
      });
      return;
    }

    const at = now.at + 1;

    patch({
      phase: 'question',
      at,
      order: shuffled(questions[now.queue[at]]),
      selected: null,
      last: null,
      notice: t.live.question(at + 1)
    });
  };

  const restart = () => {
    flush();
    shown.current = 0;
    patch(createState());
  };

  // Acierto: aro y confeti desde el veredicto. Fallo: temblor.
  useGSAP(
    () => {
      const fx = fxRef.current;
      const verdict = verdictRef.current;
      const last = state.last;

      if (!last || !canAnimate || !fx || !verdict) return;

      if (last.ok) {
        const at = centerIn(verdict.getBoundingClientRect(), fx.getBoundingClientRect());

        ring(fx, at, css.ring, '#ffd23f', 0.5);
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

  // La cometa: sube con el viento a favor o cae con la ráfaga (y tiembla aunque el carrete de reserva la salve)
  useGSAP(
    () => {
      const kite = rootRef.current?.querySelector<SVGGElement>('[data-kite]');
      const line = rootRef.current?.querySelector<SVGPathElement>('[data-string]');
      const fx = fxRef.current;
      const last = state.last;
      const from = shown.current;
      const place = (f: number, rot = 0) => {
        const k = kitePoint(f);

        kite?.setAttribute('transform', `translate(${k.x.toFixed(1)} ${k.y.toFixed(1)}) rotate(${rot.toFixed(1)})`);
        line?.setAttribute('d', stringPath(f));
      };

      shown.current = height;

      if (!canAnimate || !kite || !line || !fx || (from === height && !last)) return;

      const gust = !!last && !last.ok;
      const flight = { t: 0 };
      const tl = gsap.timeline();

      tl.to(flight, {
        t: 1,
        duration: gust ? 1 : 1.6,
        ease: 'none',
        onUpdate: () => {
          // Subir: frena al llegar. Caer: arranca despacio y se precipita. La ráfaga la hace girar y temblar.
          const e = gust ? flight.t ** 2 : 1 - (1 - flight.t) ** 3;
          const rot = gust
            ? Math.sin(flight.t * 24) * 16 * (1 - flight.t)
            : Math.sin(flight.t * 8) * 4 * (1 - flight.t);

          place(from + (height - from) * e, rot);
        },
        onComplete: () => place(height)
      });

      // Efectos al terminar: ráfagas de aire si cae, confeti y aro si sube
      tl.add(
        () => {
          const at = centerIn(kite.getBoundingClientRect(), fx.getBoundingClientRect());

          if (gust) {
            burst(fx, at, {
              className: css.streak,
              colors: GUST_COLORS,
              shapes: ['polygon(0 40%, 100% 40%, 100% 60%, 0 60%)'],
              count: 10,
              reach: [50, 120],
              size: [16, 30],
              gravity: 0
            });
          } else if (last?.ok) {
            ring(fx, at, css.ring, '#ffd23f', 0.7);
            burst(fx, at, {
              className: css.spark,
              colors: FX_COLORS,
              shapes: CONFETTI_SHAPES,
              count: 14,
              reach: [40, 110],
              size: [6, 11],
              gravity: 30
            });
          }
        },
        gust ? 0.1 : '>'
      );

      return () => {
        tl.kill();
        place(height);
        fx.replaceChildren();
      };
    },
    { scope: rootRef, dependencies: [height, state.last, canAnimate] }
  );

  // El foco acompaña a la fase: la pregunta, el botón de seguir o los resultados
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }

    const frame = requestAnimationFrame(() => {
      const target = { question: headingRef, checked: nextRef, done: summaryRef }[state.phase];

      target?.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [state.phase]);

  if (!total || !item) return null;

  const { phase } = state;
  const summary: CometaSummary = {
    score: state.score,
    total,
    firstTry: state.firstTry,
    bestStreak: state.bestStreak,
    attempts: state.attempts,
    falls: state.falls,
    saves: state.saves,
    rank: rankOf(state.firstTry, total)
  };

  const hud = [
    { id: 'score', label: t.hud.score, icon: 'star' as const, value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame' as const, value: state.streak },
    { id: 'spool', label: t.hud.spool, icon: 'disc' as const, value: state.spool },
    { id: 'height', label: t.hud.height, icon: 'arrow' as const, value: `${climbed}/${total}` }
  ];

  return (
    <div ref={rootRef} className={`${css.cometa} ${addClass ?? ''}`} data-phase={phase}>
      <p role="status" className="u-sr-only">
        {state.notice}
      </p>

      <div className={css.screen}>
        <ul className={css.hud}>
          {hud.map(({ id, label, icon, value }) => (
            <li
              key={id}
              className={css['hud-item']}
              data-id={id}
              data-hot={id === 'streak' && state.streak > 1 ? '' : undefined}
            >
              <CometaIcon name={icon} className={css['hud-icon']} />
              <span className={css['hud-label']}>{label}</span>
              <span className={css['hud-value']}>{value}</span>
            </li>
          ))}
        </ul>

        <CometaStage
          label={t.stage(climbed, total, state.firstTry)}
          height={height}
          total={total}
          bows={state.firstTry}
        />
      </div>

      <div className={css.console}>
        {(phase === 'question' || phase === 'checked') && (
          <CometaCard
            question={item}
            number={state.at + 1}
            total={total}
            order={state.order}
            selected={state.selected}
            discarded={state.discarded[item.id] ?? []}
            verdict={state.last}
            finishing={state.solved.length === total}
            headingRef={headingRef}
            verdictRef={verdictRef}
            nextRef={nextRef}
            onSelect={select}
            onCheck={check}
            onNext={afterCheck}
          />
        )}

        {phase === 'done' && <CometaSummaryCard summary={summary} headingRef={summaryRef} onRestart={restart} />}
      </div>

      <ol className={css.track} aria-label={t.track.label}>
        {questions.map((q, i) => (
          <li key={q.id} className={css['track-item']} data-state={stateOf(q)}>
            <span aria-hidden="true">{stateOf(q) === 'solved' ? <CometaIcon name="check" /> : i + 1}</span>
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

GameCometa.Init = CometaInit;

export { GameCometa };
