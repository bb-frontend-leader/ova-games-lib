import { useEffect, useReducer, useRef } from 'react';
import gsap from 'gsap';

import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { FX_COLORS, GOLD_MULTIPLIER, i18n, REELS, START_STRIPS, STREAK_PULL } from './lib/constant';
import { buildStrip, finalOffset, rollSpin, visible } from './lib/reels';
import { SlotsCard } from './slots-card';
import { SlotsIcon } from './slots-icons';
import { SlotsInit } from './slots-init';
import { SlotsMachine } from './slots-machine';
import { SlotsPull } from './slots-pull';
import { SlotsSummaryCard } from './slots-summary';

import type { SlotsQuestion, SlotsResult, SlotsSummary, State } from './types/types';

import css from './game-slots.module.css';

const CONFETTI_SHAPES = ['circle(50%)', 'circle(50%)', 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)'];

const shuffled = (question: SlotsQuestion) => gsap.utils.shuffle(question.answers.map((_, k) => k));

const createState = (questions: SlotsQuestion[]): State => ({
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
  spinId: 0,
  strips: START_STRIPS.map((strip) => [...strip]),
  pulls: 0,
  bestWin: 0,
  jackpots: 0,
  last: null,
  spin: null,
  notice: ''
});

interface Props {
  /** Las preguntas, en orden. Cada acierto gana una tirada. Pásalas como constante: no cambian mientras se juega. */
  questions: SlotsQuestion[];
  /** Se llama un instante después de comprobar, para que se vea el veredicto antes de abrir la retroalimentación. */
  onResult?: (result: SlotsResult) => void;
  /** Se llama al reintentar tras un fallo (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al abrir los resultados, cuando todas las preguntas están acertadas y las tiradas hechas. */
  onFinish?: (summary: SlotsSummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof SlotsInit;
};

/**
 * Tragamonedas con preguntas: cada respuesta correcta gana una tirada de la máquina.
 *
 * - Fallar descarta esa respuesta; hay que acertar para ganar la tirada.
 * - Acertar a la primera da una palanca dorada (premio x2). Cada tres aciertos seguidos se gana una tirada extra.
 * - Dos símbolos iguales en la línea central dan un premio pequeño, tres iguales uno grande, y tres diamantes el
 *   jackpot (con una tirada extra de regalo).
 * - Termina cuando todas las preguntas están acertadas y todas las tiradas hechas.
 */
const GameSlots: React.FC<Props> & SubComponents = ({ questions, onResult, onReset, onFinish, addClass }) => {
  const lang = useLang();
  const t = i18n[lang];

  const canAnimate = useCanAnimate();
  const { defer, flush } = useDeferredResult();
  const total = questions.length;

  const [state, patch] = useReducer(
    (prev: State, next: Partial<State>) => ({ ...prev, ...next }),
    null,
    () => createState(questions)
  );
  const stateRef = useRef(state); // Los callbacks leen el estado de ahora, no el de cuando se programaron
  stateRef.current = state;

  const rootRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const pullRef = useRef<HTMLButtonElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leverRef = useRef<HTMLDivElement>(null);
  const armRef = useRef<HTMLSpanElement>(null);
  const ballRef = useRef<HTMLSpanElement>(null);
  const landedFor = useRef(-1); // Tirada ya cobrada: el modo estricto de React repite los efectos
  const moved = useRef(false); // El foco solo se mueve cuando la fase cambia por una acción, no al montar

  const question = questions[state.index];
  const stateOf = (item: SlotsQuestion) =>
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
    const extra = ok && streak % STREAK_PULL === 0;
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

  /** Tras comprobar: reintentar la pregunta (fallo) o pasar a la palanca (acierto). */
  const afterCheck = () => {
    flush(); // Si aún esperaba entregar el resultado, se entrega ya

    const current = stateRef.current;

    if (current.phase !== 'checked') return;

    if (current.last && !current.last.ok) {
      onReset?.();
      patch({ phase: 'question', selected: null, last: null, notice: '' });
      return;
    }

    patch({ phase: 'ready', last: null, notice: '' });
  };

  /** Tira de la palanca: el resultado se decide ya y los carretes solo lo muestran. */
  const pull = () => {
    const current = stateRef.current;

    if (current.phase !== 'ready' || !current.queue.length) return;

    const kind = current.queue[0];
    const roll = rollSpin();

    patch({
      phase: 'spinning',
      spinId: current.spinId + 1,
      // Cada carrete sigue desde lo que se veía y gira más que el anterior, así se paran uno a uno
      strips: current.strips.map((strip, r) => buildStrip(visible(strip), roll.middle[r], 8 + r * 5)),
      pulls: current.pulls + 1,
      spin: { ...roll, points: roll.base * (kind === 'gold' ? GOLD_MULTIPLIER : 1), kind },
      notice: t.live.spinning
    });
  };

  /** Los carretes se detuvieron: se cobra el premio. */
  const land = () => {
    const current = stateRef.current;
    const spin = current.spin;

    if (!spin || current.phase !== 'spinning') return;

    const jackpot = spin.tier === 'jackpot';
    const names = spin.middle.map((symbol) => t.symbols[symbol]);
    const text = jackpot ? t.live.jackpot(spin.points) : spin.points ? t.live.won(spin.points) : t.live.none;

    patch({
      phase: 'landed',
      score: current.score + spin.points,
      bestWin: Math.max(current.bestWin, spin.points),
      jackpots: current.jackpots + (jackpot ? 1 : 0),
      queue: [...current.queue.slice(1), ...(jackpot ? (['normal'] as const) : [])],
      notice: t.live.landed(names, text)
    });
  };

  const afterLanding = () => {
    const current = stateRef.current;

    if (current.phase !== 'landed') return;

    if (current.queue.length) {
      patch({ phase: 'ready', notice: '' });
      return;
    }

    if (current.solved.length === total) {
      patch({ phase: 'done', notice: '' });
      onFinish?.({
        score: current.score,
        total,
        firstTry: current.firstTry,
        bestStreak: current.bestStreak,
        attempts: current.attempts,
        pulls: current.pulls,
        bestWin: current.bestWin,
        jackpots: current.jackpots
      });
      return;
    }

    const index = current.index + 1;

    patch({
      phase: 'question',
      index,
      order: shuffled(questions[index]),
      selected: null,
      last: null,
      notice: ''
    });
  };

  const restart = () => {
    flush();
    landedFor.current = -1;
    patch(createState(questions));
  };

  // Los carretes giran y se detienen uno a uno; el tercero tarda más si los dos primeros ya coinciden
  useGSAP(
    () => {
      const current = stateRef.current;
      const spin = current.spin;
      const { spinId } = current;

      if (current.phase !== 'spinning' || !spin) return;

      const finish = () => {
        if (landedFor.current === spinId) return;

        landedFor.current = spinId;
        land();
      };
      const strips = stripRefs.current.slice(0, REELS);

      if (!canAnimate) {
        strips.forEach((el, r) => el && gsap.set(el, { yPercent: finalOffset(current.strips[r].length) }));
        finish();
        return;
      }

      const tease = spin.middle[0] === spin.middle[1];
      const timeline = gsap.timeline({ onComplete: finish });

      strips.forEach((el, r) => {
        if (!el) return;

        timeline.fromTo(
          el,
          { yPercent: 0 },
          {
            yPercent: finalOffset(current.strips[r].length),
            duration: 1.5 + r * 0.45 + (r === REELS - 1 && tease ? 0.9 : 0),
            ease: 'power3.out'
          },
          r * 0.2
        );
      });

      // La palanca baja y vuelve a su sitio
      const lever = leverRef.current;
      const arm = armRef.current;
      const ball = ballRef.current;

      if (lever && arm && ball) {
        const down = lever.offsetHeight * 0.55;
        const shrink = (arm.offsetHeight - down) / arm.offsetHeight;

        gsap
          .timeline()
          .to(ball, { y: down, duration: 0.2, ease: 'power2.in' }, 0)
          .to(arm, { scaleY: shrink, duration: 0.2, ease: 'power2.in' }, 0)
          .to(ball, { y: 0, duration: 0.6, ease: 'elastic.out(1, 0.45)' }, 0.2)
          .to(arm, { scaleY: 1, duration: 0.6, ease: 'elastic.out(1, 0.45)' }, 0.2);
      }
    },
    { scope: rootRef, dependencies: [state.spinId] }
  );

  // Veredicto: acierto con aro y monedas, fallo con un temblor
  useGSAP(
    () => {
      const fx = fxRef.current;
      const verdict = verdictRef.current;
      const last = state.last;

      if (!last || !canAnimate || !fx || !verdict) return;

      if (last.ok) {
        const at = centerIn(verdict.getBoundingClientRect(), fx.getBoundingClientRect());

        ring(fx, at, css.ring, last.firstTry ? '#ffd23f' : '#ff7a90', 0.5);
        burst(fx, at, {
          className: css.spark,
          colors: FX_COLORS,
          shapes: CONFETTI_SHAPES,
          count: last.firstTry ? 20 : 12,
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

  // Premio: lluvia de monedas desde la línea central y los puntos suben desde ella
  useGSAP(
    () => {
      const fx = fxRef.current;
      const reels = rootRef.current?.querySelector<HTMLElement>('[role="img"]');
      const spin = state.spin;

      if (state.phase !== 'landed' || !spin || !spin.points || !canAnimate || !fx || !reels) return;

      const at = centerIn(reels.getBoundingClientRect(), fx.getBoundingClientRect());
      const jackpot = spin.tier === 'jackpot';
      const float = document.createElement('span');

      ring(fx, at, css.ring, '#ffd23f', 0.5);
      burst(fx, at, {
        className: css.coin,
        colors: FX_COLORS,
        shapes: CONFETTI_SHAPES,
        count: jackpot ? 44 : Math.min(30, 10 + Math.round(spin.points / 10)),
        reach: jackpot ? [80, 220] : [50, 150],
        size: [9, 15],
        gravity: jackpot ? 120 : 60
      });

      float.className = css.float;
      float.textContent = `+${spin.points}`;
      fx.appendChild(float);
      gsap.fromTo(
        float,
        { x: at.x, y: at.y - 10, xPercent: -50, yPercent: -50, scale: 0.6, opacity: 1 },
        {
          y: at.y - 110,
          scale: jackpot ? 1.6 : 1.2,
          opacity: 0,
          duration: 1.3,
          ease: 'power2.out',
          onComplete: () => float.remove()
        }
      );

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [state.phase, state.spin, canAnimate] }
  );

  // El foco acompaña a la fase: pregunta, botón de seguir, palanca, resultados…
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }

    const frame = requestAnimationFrame(() => {
      const target = {
        question: headingRef,
        checked: nextRef,
        ready: pullRef,
        spinning: headingRef,
        landed: nextRef,
        done: summaryRef
      }[state.phase];

      target.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [state.phase, state.spinId]);

  if (!total) return null;

  const { phase } = state;
  const summary: SlotsSummary = {
    score: state.score,
    total,
    firstTry: state.firstTry,
    bestStreak: state.bestStreak,
    attempts: state.attempts,
    pulls: state.pulls,
    bestWin: state.bestWin,
    jackpots: state.jackpots
  };
  const inPlay = phase === 'ready' || phase === 'spinning' || phase === 'landed';
  const kind = state.queue[0] ?? 'normal';
  const nextLabel = state.queue.length ? t.nextPull : state.solved.length === total ? t.results : t.nextQuestion;
  const machineLabel =
    phase === 'spinning'
      ? t.machine.spinning
      : state.spin
        ? t.machine.result(state.spin.middle.map((symbol) => t.symbols[symbol]))
        : t.machine.idle;

  const hud = [
    { id: 'score', label: t.hud.score, icon: 'star' as const, value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame' as const, value: state.streak },
    { id: 'pulls', label: t.hud.pulls, icon: 'coin' as const, value: state.queue.length },
    { id: 'solved', label: t.hud.solved, icon: 'check' as const, value: `${state.solved.length}/${total}` }
  ];

  return (
    <div ref={rootRef} className={`${css.slots} ${addClass ?? ''}`} data-phase={phase}>
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
            <SlotsIcon name={icon} className={css['hud-icon']} />
            <span className={css['hud-label']}>{label}</span>
            <span className={css['hud-value']}>{value}</span>
          </li>
        ))}
      </ul>

      <div className={css.play}>
        <div className={css['machine-wrap']}>
          <SlotsMachine
            strips={state.strips}
            spinId={state.spinId}
            stripRefs={stripRefs}
            leverRef={leverRef}
            armRef={armRef}
            ballRef={ballRef}
            win={phase === 'landed' && state.spin ? state.spin.tier : null}
            label={machineLabel}
            onLever={phase === 'ready' ? pull : undefined}
          />
        </div>

        <div className={css.side}>
          {(phase === 'question' || phase === 'checked') && question && (
            <SlotsCard
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
            <SlotsPull
              phase={phase}
              kind={kind}
              left={state.queue.length}
              spin={state.spin}
              nextLabel={nextLabel}
              headingRef={headingRef}
              pullRef={pullRef}
              nextRef={nextRef}
              onPull={pull}
              onNext={afterLanding}
            />
          )}

          {phase === 'done' && <SlotsSummaryCard summary={summary} headingRef={summaryRef} onRestart={restart} />}
        </div>
      </div>

      <ol className={css.track} aria-label={t.track.label}>
        {questions.map((item, i) => (
          <li key={item.id} className={css['track-item']} data-state={stateOf(item)}>
            <span aria-hidden="true">{stateOf(item) === 'solved' ? <SlotsIcon name="check" /> : i + 1}</span>
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

GameSlots.Init = SlotsInit;

export { GameSlots };
