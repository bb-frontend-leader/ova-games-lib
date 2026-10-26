import { useEffect, useMemo, useReducer, useRef } from 'react';
import gsap from 'gsap';

import { burst, centerIn, focusInView, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { DEFAULT_PRIZES, FX_COLORS, GOLD_MULTIPLIER, i18n, STREAK_BALL } from './lib/constant';
import { aimRange, buildLayout, frameCount, PEG_R, PLAYBACK_FPS, type Sim, simulate, slotCenter } from './lib/physics';
import { PlinkoBoard } from './plinko-board';
import { PlinkoCard } from './plinko-card';
import { PlinkoDrop } from './plinko-drop';
import { PlinkoIcon } from './plinko-icons';
import { PlinkoInit } from './plinko-init';
import { PlinkoSummaryCard } from './plinko-summary';

import type { PlinkoPrize, PlinkoQuestion, PlinkoResult, PlinkoSummary, State } from './types/types';

import css from './game-plinko.module.css';

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];

const shuffled = (question: PlinkoQuestion) => gsap.utils.shuffle(question.answers.map((_, k) => k));

const createState = (questions: PlinkoQuestion[], aim: number): State => ({
  phase: 'question',
  index: 0,
  order: questions[0] ? shuffled(questions[0]) : [],
  selected: null,
  solved: [],
  fails: {},
  discarded: {},
  score: 0,
  streak: 0,
  bestStreak: 0,
  firstTry: 0,
  attempts: 0,
  queue: [],
  aim,
  dropId: 0,
  balls: 0,
  bestPrize: 0,
  last: null,
  drop: null,
  notice: ''
});

interface Props {
  /** Las preguntas, en orden. Cada acierto gana una ficha. Pásalas como constante: no cambian mientras se juega. */
  questions: PlinkoQuestion[];
  /** Premios del fondo, de izquierda a derecha; `'bonus'` da una ficha extra. Por defecto: 500-100-50-20-extra-20-50-100-500. */
  prizes?: readonly PlinkoPrize[];
  /** Se llama un instante después de comprobar, para que se vea el veredicto antes de abrir la retroalimentación. */
  onResult?: (result: PlinkoResult) => void;
  /** Se llama al reintentar tras un fallo (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al abrir los resultados, cuando todas las preguntas están acertadas y las fichas soltadas. */
  onFinish?: (summary: PlinkoSummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof PlinkoInit;
};

/**
 * Plinko con preguntas: cada respuesta correcta gana una ficha que se suelta sobre un tablero de clavos.
 *
 * - Fallar descarta esa respuesta; hay que acertar para ganar la ficha.
 * - Acertar a la primera da una ficha dorada (premio x2). Cada tres aciertos seguidos se gana una ficha extra.
 * - La casilla «Extra» del fondo regala otra ficha. Los premios grandes están en los bordes, donde cuesta más caer.
 * - Termina cuando todas las preguntas están acertadas y todas las fichas se soltaron.
 */
const GamePlinko: React.FC<Props> & SubComponents = ({
  questions,
  prizes = DEFAULT_PRIZES,
  onResult,
  onReset,
  onFinish,
  addClass
}) => {
  const lang = useLang();
  const t = i18n[lang];

  const canAnimate = useCanAnimate();
  const { defer, flush } = useDeferredResult();

  const layout = useMemo(() => buildLayout(prizes.length), [prizes.length]);
  const range = useMemo(() => aimRange(layout), [layout]);
  const positions = range.max - range.min + 1;
  const centerAim = Math.floor((positions - 1) / 2);
  const total = questions.length;

  const [state, patch] = useReducer(
    (prev: State, next: Partial<State>) => ({ ...prev, ...next }),
    null,
    () => createState(questions, centerAim)
  );
  const stateRef = useRef(state); // Los callbacks leen el estado de ahora, no el de cuando se programaron
  stateRef.current = state;

  const rootRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const ballRef = useRef<SVGCircleElement>(null);
  const pegRefs = useRef<(SVGCircleElement | null)[]>([]);
  const simRef = useRef<Sim | null>(null); // Recorrido de la ficha en el aire: se consume al caer
  const moved = useRef(false); // El foco solo se mueve cuando la fase cambia por una acción, no al montar

  const question = questions[state.index];
  const aimSlot = range.min + state.aim;
  const aimX = slotCenter(layout, aimSlot);
  const stateOf = (item: PlinkoQuestion) =>
    state.solved.includes(item.id) ? 'solved' : state.fails[item.id] ? 'review' : 'pending';

  const select = (answer: number) => {
    if (stateRef.current.phase !== 'question') return;

    patch({ selected: answer });
  };

  const check = () => {
    const current = stateRef.current;
    const item = questions[current.index];

    if (current.phase !== 'question' || current.selected === null || !item) return;

    const ok = item.answers[current.selected].state === 'success';
    const fails = current.fails[item.id] ?? 0;
    const firstTry = ok && fails === 0;
    const streak = ok ? current.streak + 1 : 0;
    const extra = ok && streak % STREAK_BALL === 0;
    const attempts = fails + 1;

    patch({
      phase: 'checked',
      last: { ok, firstTry },
      streak,
      bestStreak: Math.max(current.bestStreak, streak),
      attempts: current.attempts + 1,
      firstTry: firstTry ? current.firstTry + 1 : current.firstTry,
      solved: ok ? [...current.solved, item.id] : current.solved,
      fails: ok ? current.fails : { ...current.fails, [item.id]: attempts },
      discarded: ok
        ? current.discarded
        : { ...current.discarded, [item.id]: [...(current.discarded[item.id] ?? []), current.selected] },
      queue: ok
        ? [...current.queue, firstTry ? 'gold' : 'normal', ...(extra ? (['normal'] as const) : [])]
        : current.queue,
      notice: ok ? `${firstTry ? t.live.okGold : t.live.ok}${extra ? ` ${t.live.okExtra}` : ''}` : t.live.ko
    });

    const deliver = () => onResult?.({ result: ok, question: item.id, streak, attempts });

    // Sin movimiento no hay espera, pero se deja un instante para que el foco llegue al botón antes del modal de la página
    defer(() => (canAnimate ? deliver() : void setTimeout(deliver, 60)), ok);
  };

  /** Tras comprobar: reintentar la pregunta (fallo) o pasar a apuntar la ficha (acierto). */
  const afterCheck = () => {
    flush(); // Si aún esperaba entregar el resultado, se entrega ya

    const current = stateRef.current;

    if (current.phase !== 'checked') return;

    if (current.last && !current.last.ok) {
      onReset?.();
      patch({ phase: 'question', selected: null, last: null, notice: '' });
      return;
    }

    patch({ phase: 'aim', aim: centerAim, dropId: current.dropId + 1, last: null, notice: '' });
  };

  const aim = (value: number) => {
    if (stateRef.current.phase !== 'aim') return;

    patch({ aim: Math.min(positions - 1, Math.max(0, value)) });
  };

  const pickOnBoard = (x: number) => aim(Math.floor(x / layout.slotW) - range.min);

  /** Suelta la ficha: el recorrido entero se decide ya, y el dibujo solo lo reproduce. */
  const dropBall = () => {
    const current = stateRef.current;

    if (current.phase !== 'aim' || !current.queue.length) return;

    simRef.current = simulate(layout, slotCenter(layout, range.min + current.aim));
    patch({ phase: 'dropping', balls: current.balls + 1, notice: t.live.dropping });
  };

  /** La ficha llegó al fondo: se cobra el premio de la casilla. */
  const land = () => {
    const sim = simRef.current;
    const current = stateRef.current;

    if (!sim || current.phase !== 'dropping') return;

    simRef.current = null;

    const prize = prizes[sim.slot];
    const kind = current.queue[0] ?? 'normal';
    const bonus = prize === 'bonus';
    const points = bonus ? 0 : prize * (kind === 'gold' ? GOLD_MULTIPLIER : 1);

    patch({
      phase: 'landed',
      drop: { slot: sim.slot, prize, points, kind },
      score: current.score + points,
      bestPrize: Math.max(current.bestPrize, points),
      queue: [...current.queue.slice(1), ...(bonus ? (['normal'] as const) : [])],
      notice: bonus ? t.live.landedBonus(sim.slot + 1) : t.live.landedPrize(sim.slot + 1, points)
    });
  };

  const afterLanding = () => {
    const current = stateRef.current;

    if (current.phase !== 'landed') return;

    if (current.queue.length) {
      patch({ phase: 'aim', dropId: current.dropId + 1, drop: null, notice: '' });
      return;
    }

    if (current.solved.length === total) {
      patch({ phase: 'done', drop: null, notice: '' });
      onFinish?.({
        score: current.score,
        total,
        firstTry: current.firstTry,
        bestStreak: current.bestStreak,
        attempts: current.attempts,
        balls: current.balls,
        bestPrize: current.bestPrize
      });
      return;
    }

    const index = current.index + 1;

    patch({
      phase: 'question',
      index,
      order: shuffled(questions[index]),
      selected: null,
      drop: null,
      last: null,
      notice: ''
    });
  };

  const restart = () => {
    flush();
    simRef.current = null;
    patch(createState(questions, centerAim));
  };

  // La ficha cae: se reproduce el recorrido ya calculado y cada clavo golpeado brilla
  useEffect(() => {
    const sim = simRef.current;
    const ball = ballRef.current;

    if (state.phase !== 'dropping' || !sim || !ball) return;

    const count = frameCount(sim);
    const pegs = pegRefs.current;
    const place = (frame: number) => {
      ball.setAttribute('cx', String(sim.frames[frame * 2]));
      ball.setAttribute('cy', String(sim.frames[frame * 2 + 1]));
    };

    if (!canAnimate) {
      place(count - 1);
      land();
      return;
    }

    const start = performance.now();
    let hit = 0;
    let raf = 0;

    const tick = (now: number) => {
      const frame = Math.min(count - 1, Math.floor(((now - start) / 1000) * PLAYBACK_FPS));

      place(frame);

      while (hit < sim.hits.length && sim.hits[hit].frame <= frame) {
        const peg = pegs[sim.hits[hit++].peg];

        if (peg) {
          gsap.fromTo(
            peg,
            { attr: { r: PEG_R * 2 }, fill: '#ffffff' },
            { attr: { r: PEG_R }, duration: 0.3, ease: 'power2.out', clearProps: 'fill', overwrite: 'auto' }
          );
        }
      }

      if (frame >= count - 1) {
        land();
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      gsap.killTweensOf(pegs.filter(Boolean));
    };
    // `land` y `canAnimate` se leen al empezar la caída; reiniciarla a mitad de camino no tiene sentido
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.dropId]);

  // Veredicto: acierto con aro y confeti, fallo con un temblor
  useGSAP(
    () => {
      const fx = fxRef.current;
      const verdict = verdictRef.current;
      const last = state.last;

      if (!last || !canAnimate || !fx || !verdict) return;

      if (last.ok) {
        const at = centerIn(verdict.getBoundingClientRect(), fx.getBoundingClientRect());

        ring(fx, at, css.ring, last.firstTry ? '#ffd23f' : '#5cc8ff', 0.5);
        burst(fx, at, {
          className: css.spark,
          colors: FX_COLORS,
          shapes: CONFETTI_SHAPES,
          count: last.firstTry ? 22 : 12,
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

  // Ficha en el fondo: aro, confeti y los puntos suben desde donde cayó
  useGSAP(
    () => {
      const fx = fxRef.current;
      const ball = ballRef.current;
      const drop = state.drop;

      if (state.phase !== 'landed' || !drop || !canAnimate || !fx || !ball) return;

      const at = centerIn(ball.getBoundingClientRect(), fx.getBoundingClientRect());
      const bonus = drop.prize === 'bonus';
      const float = document.createElement('span');

      ring(fx, at, css.ring, bonus ? '#5cf0d6' : '#ffd23f', 0.5);
      burst(fx, at, {
        className: css.spark,
        colors: FX_COLORS,
        shapes: CONFETTI_SHAPES,
        count: bonus ? 22 : Math.min(30, 10 + Math.round(drop.points / 25)),
        reach: [50, 150],
        size: [7, 13],
        gravity: 40
      });

      float.className = css.float;
      float.textContent = bonus ? t.bonus : `+${drop.points}`;
      fx.appendChild(float);
      gsap.fromTo(
        float,
        { x: at.x, y: at.y - 20, xPercent: -50, yPercent: -50, scale: 0.6, opacity: 1 },
        { y: at.y - 100, scale: 1.2, opacity: 0, duration: 1.2, ease: 'power2.out', onComplete: () => float.remove() }
      );

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [state.phase, state.drop, canAnimate] }
  );

  // El foco acompaña a la fase: pregunta, botón de seguir, control de apuntar, resultados…
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }

    const frame = requestAnimationFrame(() => {
      const target = {
        question: headingRef,
        checked: nextRef,
        aim: rangeRef,
        dropping: headingRef,
        landed: nextRef,
        done: summaryRef
      }[state.phase];

      focusInView(target.current);
    });

    return () => cancelAnimationFrame(frame);
  }, [state.phase, state.dropId]);

  if (!total) return null;

  const { phase } = state;
  const summary: PlinkoSummary = {
    score: state.score,
    total,
    firstTry: state.firstTry,
    bestStreak: state.bestStreak,
    attempts: state.attempts,
    balls: state.balls,
    bestPrize: state.bestPrize
  };
  const inPlay = phase === 'aim' || phase === 'dropping' || phase === 'landed';
  // Al caer, la ficha ya salió de la cola: la que se ve en el tablero es la que acaba de caer
  const currentBall = phase === 'landed' && state.drop ? state.drop.kind : (state.queue[0] ?? 'normal');
  const nextLabel = state.queue.length ? t.nextBall : state.solved.length === total ? t.results : t.nextQuestion;

  const hud = [
    { id: 'score', label: t.hud.score, icon: 'star' as const, value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame' as const, value: state.streak },
    { id: 'balls', label: t.hud.balls, icon: 'ball' as const, value: state.queue.length },
    { id: 'solved', label: t.hud.solved, icon: 'check' as const, value: `${state.solved.length}/${total}` }
  ];

  return (
    <div ref={rootRef} className={`${css.plinko} ${addClass ?? ''}`} data-phase={phase}>
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
            <PlinkoIcon name={icon} className={css['hud-icon']} />
            <span className={css['hud-label']}>{label}</span>
            <span className={css['hud-value']}>{value}</span>
          </li>
        ))}
      </ul>

      <div className={css.play}>
        <div className={css['board-wrap']} data-idle={inPlay ? undefined : ''}>
          <PlinkoBoard
            layout={layout}
            prizes={prizes}
            pegRefs={pegRefs}
            ballRef={ballRef}
            ball={inPlay ? { kind: currentBall, x: aimX, id: state.dropId } : null}
            guide={phase === 'aim'}
            landed={phase === 'landed' && state.drop ? state.drop.slot : null}
            onPick={phase === 'aim' ? pickOnBoard : undefined}
            label={t.boardLabel}
          />
        </div>

        <div className={css.side}>
          {(phase === 'question' || phase === 'checked') && question && (
            <PlinkoCard
              question={question}
              number={state.index + 1}
              total={total}
              order={state.order}
              selected={state.selected}
              discarded={state.discarded[question.id] ?? []}
              verdict={state.last}
              headingRef={headingRef}
              verdictRef={verdictRef}
              nextRef={nextRef}
              onSelect={select}
              onCheck={check}
              onNext={afterCheck}
            />
          )}

          {inPlay && (
            <PlinkoDrop
              phase={phase}
              kind={currentBall}
              left={state.queue.length}
              positions={positions}
              aim={state.aim}
              drop={state.drop}
              nextLabel={nextLabel}
              headingRef={headingRef}
              rangeRef={rangeRef}
              nextRef={nextRef}
              onAim={aim}
              onDrop={dropBall}
              onNext={afterLanding}
            />
          )}

          {phase === 'done' && <PlinkoSummaryCard summary={summary} headingRef={summaryRef} onRestart={restart} />}
        </div>
      </div>

      <ol className={css.track} aria-label={t.track.label}>
        {questions.map((item, i) => (
          <li key={item.id} className={css['track-item']} data-state={stateOf(item)}>
            <span aria-hidden="true">{stateOf(item) === 'solved' ? <PlinkoIcon name="check" /> : i + 1}</span>
            <span className="u-sr-only">
              {t.question} {i + 1}: {t.track[stateOf(item)]}
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

GamePlinko.Init = PlinkoInit;

export { GamePlinko };
