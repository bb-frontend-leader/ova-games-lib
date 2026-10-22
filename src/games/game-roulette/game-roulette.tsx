import { useEffect, useMemo, useReducer, useRef } from 'react';
import gsap from 'gsap';

import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { DEFAULT_SPECIALS, FX_COLORS, i18n, PALETTE, SCORE, SPECIAL_COLORS } from './lib/constant';
import { buildWedges, CENTER, spinTarget, wedgeAt } from './lib/wheel';
import { RouletteCard } from './roulette-card';
import { RouletteIcon } from './roulette-icons';
import { RouletteInit } from './roulette-init';
import { RouletteSummaryCard } from './roulette-summary';
import { RouletteWheel } from './roulette-wheel';

import type {
  RouletteQuestion,
  RouletteResult,
  RouletteSpecial,
  RouletteSummary,
  State,
  WedgeView
} from './types/types';

import css from './game-roulette.module.css';

const INITIAL_STATE: State = {
  phase: 'idle',
  landed: null,
  order: [],
  selected: null,
  hidden: [],
  jokerUsed: false,
  solved: [],
  spent: [],
  fails: {},
  discarded: {},
  score: 0,
  streak: 0,
  bestStreak: 0,
  jokers: 0,
  doubleArmed: false,
  firstTry: 0,
  attempts: 0,
  last: null,
  notice: ''
};

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];
const FLICK_DEG = 28;

interface Props {
  /** Una casilla por pregunta. Máximo recomendado: 16 (más casillas no caben con su texto). */
  questions: RouletteQuestion[];
  /** Casillas especiales que se reparten por la ruleta (cada una sale una sola vez). `[]` las quita. */
  specials?: readonly RouletteSpecial[];
  /** Se llama un instante después de comprobar, para que se vea el veredicto antes de abrir la retroalimentación. */
  onResult?: (result: RouletteResult) => void;
  /** Se llama cuando el estudiante sigue girando tras un fallo (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al abrir los resultados, cuando todas las preguntas están acertadas. */
  onFinish?: (summary: RouletteSummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof RouletteInit;
};

/**
 * Ruleta de preguntas: se gira, la ruleta elige una casilla al azar y se responde su pregunta.
 *
 * - Un acierto cierra su casilla; un fallo la deja en la ruleta (con la respuesta elegida descartada) hasta acertarla.
 * - Puntos: base que baja con cada fallo previo, más bonus por racha. Un comodín 50:50 la recorta a la mitad.
 * - Casillas especiales: Comodín 50:50 (elimina respuestas incorrectas) y Doble (la próxima pregunta vale x2).
 * - Termina cuando todas las preguntas están acertadas.
 */
const GameRoulette: React.FC<Props> & SubComponents = ({
  questions,
  specials = DEFAULT_SPECIALS,
  onResult,
  onReset,
  onFinish,
  addClass
}) => {
  const lang = useLang();
  const t = i18n[lang];

  const canAnimate = useCanAnimate();
  const { defer, flush } = useDeferredResult();

  const [state, patch] = useReducer((prev: State, next: Partial<State>) => ({ ...prev, ...next }), INITIAL_STATE);
  const stateRef = useRef(state); // Los callbacks de GSAP leen el estado de ahora, no el de cuando se programaron
  stateRef.current = state;

  const rootRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<SVGGElement>(null);
  const pointerRef = useRef<SVGGElement>(null);
  const hubRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const rotation = useRef(0);
  const moved = useRef(false); // El foco solo se mueve cuando la fase cambia por una acción, no al montar

  const wedges = useMemo(() => buildWedges(questions, specials), [questions, specials]);
  const count = wedges.length;
  const total = questions.length;

  const views = useMemo<WedgeView[]>(
    () =>
      wedges.map((wedge, i) => {
        if (wedge.kind !== 'question') {
          return {
            id: wedge.id,
            kind: wedge.kind,
            state: state.spent.includes(wedge.id) ? 'spent' : 'pending',
            ...SPECIAL_COLORS[wedge.kind]
          };
        }

        const question = questions[wedge.index];
        // Dos casillas vecinas nunca comparten color (la última con la primera, tampoco)
        const color = PALETTE[i === count - 1 && i % PALETTE.length === 0 ? 3 : i % PALETTE.length];

        return {
          id: wedge.id,
          kind: wedge.kind,
          state: state.solved.includes(question.id) ? 'solved' : state.fails[question.id] ? 'review' : 'pending',
          number: wedge.index + 1,
          label: question.category,
          ...color
        };
      }),
    [wedges, questions, count, state.spent, state.solved, state.fails]
  );

  const { contextSafe } = useGSAP({ scope: rootRef });

  /** Estallido dorado desde el botón central (casillas especiales). */
  const celebrate = contextSafe(() => {
    const fx = fxRef.current;
    const hub = hubRef.current;

    if (!canAnimate || !fx || !hub) return;

    const at = centerIn(hub.getBoundingClientRect(), fx.getBoundingClientRect());

    ring(fx, at, css.ring, '#ffd23f');
    burst(fx, at, {
      className: css.spark,
      colors: FX_COLORS,
      shapes: CONFETTI_SHAPES,
      count: 18,
      reach: [60, 130],
      size: [7, 12]
    });
  });

  /** La ruleta se detuvo en la casilla `index`. */
  const landOn = (index: number) => {
    const current = stateRef.current;
    const wedge = wedges[index];

    if (wedge.kind === 'question') {
      const question = questions[wedge.index];

      patch({
        phase: 'question',
        landed: index,
        order: gsap.utils.shuffle(question.answers.map((_, k) => k)),
        selected: null,
        hidden: [],
        jokerUsed: false,
        last: null,
        notice: t.live.landed(wedge.index + 1, question.category)
      });
      return;
    }

    const isJoker = wedge.kind === 'joker';

    patch({
      phase: 'idle',
      landed: index,
      spent: [...current.spent, wedge.id],
      jokers: isJoker ? current.jokers + 1 : current.jokers,
      doubleArmed: isJoker ? current.doubleArmed : true,
      notice: isJoker ? t.live.joker(current.jokers + 1) : t.live.double
    });
    celebrate();
  };

  /** Gira: elige al azar entre las casillas que siguen pendientes (sin repetir la anterior si hay otra). */
  const spin = contextSafe(() => {
    const current = stateRef.current;
    const wheel = wheelRef.current;

    if (current.phase !== 'idle' || !wheel) return;

    const pending = wedges
      .map((wedge, i) => ({ wedge, i }))
      .filter(({ wedge }) =>
        wedge.kind === 'question' ? !current.solved.includes(wedge.id) : !current.spent.includes(wedge.id)
      );
    const pool = pending.length > 1 ? pending.filter(({ i }) => i !== current.landed) : pending;
    const target = gsap.utils.random(
      pool.map(({ i }) => i),
      true
    )();
    const to = spinTarget(rotation.current, target, count);

    rotation.current = to;
    patch({ landed: null, last: null });

    if (!canAnimate) {
      gsap.set(wheel, { rotation: to, svgOrigin: `${CENTER} ${CENTER}` });
      landOn(target);
      return;
    }

    patch({ phase: 'spinning', notice: t.live.spinning });

    let under = wedgeAt(gsap.getProperty(wheel, 'rotation') as number, count);

    gsap.to(wheel, {
      rotation: to,
      svgOrigin: `${CENTER} ${CENTER}`,
      duration: gsap.utils.random(4.4, 5.2),
      ease: 'power3.out',
      onUpdate: () => {
        const now = wedgeAt(gsap.getProperty(wheel, 'rotation') as number, count);

        if (now === under) return;
        under = now;

        // Cada clavija que pasa golpea el puntero hacia un lado, y vuelve
        gsap.fromTo(
          pointerRef.current,
          { rotation: -FLICK_DEG, svgOrigin: `${CENTER} 19` },
          { rotation: 0, svgOrigin: `${CENTER} 19`, duration: 0.14, ease: 'power2.out', overwrite: true }
        );
      },
      onComplete: () => landOn(target)
    });
  });

  const select = (answer: number) => {
    const current = stateRef.current;

    if (current.phase !== 'question') return;

    patch({ selected: answer });
  };

  /** Comodín 50:50: deja la respuesta correcta y una sola incorrecta. */
  const useLifeline = () => {
    const current = stateRef.current;
    const question = current.landed !== null ? questions[wedges[current.landed].index] : null;

    if (current.phase !== 'question' || current.jokers < 1 || current.jokerUsed || !question) return;

    const wrong = gsap.utils.shuffle(
      question.answers
        .map((answer, i) => ({ answer, i }))
        .filter(({ answer, i }) => answer.state === 'wrong' && !(current.discarded[question.id] ?? []).includes(i))
        .map(({ i }) => i)
    );

    if (wrong.length < 2) return;

    const hidden = wrong.slice(1);

    patch({
      jokers: current.jokers - 1,
      jokerUsed: true,
      hidden,
      selected: current.selected !== null && hidden.includes(current.selected) ? null : current.selected,
      notice: t.live.jokerUsed
    });
  };

  const check = () => {
    const current = stateRef.current;

    if (current.phase !== 'question' || current.selected === null || current.landed === null) return;

    const question = questions[wedges[current.landed].index];
    const ok = question.answers[current.selected].state === 'success';
    const fails = current.fails[question.id] ?? 0;
    const halved = current.jokerUsed;
    const base = Math.round(Math.max(SCORE.base - SCORE.failPenalty * fails, SCORE.minBase) * (halved ? 0.5 : 1));
    const bonus = ok ? Math.min(current.streak, SCORE.streakCap) * SCORE.streakStep : 0;
    const doubled = current.doubleArmed;
    const points = ok ? (base + bonus) * (doubled ? 2 : 1) : 0;
    const streak = ok ? current.streak + 1 : 0;
    const attempts = fails + 1;

    patch({
      phase: 'checked',
      last: { ok, points, base, bonus, doubled: ok && doubled, halved },
      score: current.score + points,
      streak,
      bestStreak: Math.max(current.bestStreak, streak),
      doubleArmed: false,
      attempts: current.attempts + 1,
      firstTry: ok && fails === 0 ? current.firstTry + 1 : current.firstTry,
      solved: ok ? [...current.solved, question.id] : current.solved,
      fails: ok ? current.fails : { ...current.fails, [question.id]: attempts },
      discarded: ok
        ? current.discarded
        : { ...current.discarded, [question.id]: [...(current.discarded[question.id] ?? []), current.selected] },
      notice: ok ? t.live.ok(points, streak) : t.live.ko
    });

    const deliver = () => onResult?.({ result: ok, question: question.id, points, streak, attempts });

    // Sin movimiento no hay espera, pero se deja un instante para que el foco llegue al botón antes del modal de la página
    defer(() => (canAnimate ? deliver() : void setTimeout(deliver, 60)), ok);
  };

  const next = () => {
    flush(); // Si aún esperaba entregar el resultado, se entrega ya

    const current = stateRef.current;

    if (current.last && !current.last.ok) onReset?.();

    if (current.solved.length === total) {
      patch({ phase: 'done', notice: '' });
      onFinish?.({
        score: current.score,
        total,
        firstTry: current.firstTry,
        bestStreak: current.bestStreak,
        attempts: current.attempts
      });
      return;
    }

    patch({ phase: 'idle', landed: null, last: null, notice: '' });
  };

  const restart = contextSafe(() => {
    flush();
    rotation.current = 0;
    if (wheelRef.current) gsap.set(wheelRef.current, { rotation: 0, svgOrigin: `${CENTER} ${CENTER}` });
    patch(INITIAL_STATE);
  });

  // Acierto: aro, confeti y los puntos suben desde el veredicto. Fallo: la tarjeta tiembla.
  useGSAP(
    () => {
      const fx = fxRef.current;
      const verdict = verdictRef.current;
      const last = state.last;

      if (!last || !canAnimate || !fx || !verdict) return;

      if (last.ok) {
        const at = centerIn(verdict.getBoundingClientRect(), fx.getBoundingClientRect());
        const float = document.createElement('span');

        ring(fx, at, css.ring, '#ffd23f', 0.5);
        burst(fx, at, {
          className: css.spark,
          colors: FX_COLORS,
          shapes: CONFETTI_SHAPES,
          count: 22,
          reach: [50, 140],
          size: [7, 13],
          gravity: 40
        });

        float.className = css.float;
        float.textContent = `+${last.points}`;
        fx.appendChild(float);
        gsap.fromTo(
          float,
          { x: at.x, y: at.y, xPercent: -50, yPercent: -50, scale: 0.6, opacity: 1 },
          { y: at.y - 80, scale: 1.2, opacity: 0, duration: 1.1, ease: 'power2.out', onComplete: () => float.remove() }
        );
      } else {
        gsap.fromTo(verdict.closest('section'), { x: -10 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.25)' });
      }

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [state.last, canAnimate] }
  );

  // El foco acompaña a la fase: pregunta, botón de seguir, resultados o de nuevo el botón de girar
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }

    const target = {
      idle: hubRef,
      spinning: null,
      question: headingRef,
      checked: nextRef,
      done: summaryRef
    }[state.phase];

    if (!target) return;

    const frame = requestAnimationFrame(() => target.current?.focus({ preventScroll: true }));

    return () => cancelAnimationFrame(frame);
  }, [state.phase]);

  if (!total) return null;

  const { phase } = state;
  const landedWedge = state.landed !== null ? wedges[state.landed] : null;
  const question = landedWedge?.kind === 'question' ? questions[landedWedge.index] : null;
  const landedView = state.landed !== null ? views[state.landed] : null;
  const wrongLeft = question
    ? question.answers.filter(
        (answer, i) =>
          answer.state === 'wrong' && !state.hidden.includes(i) && !(state.discarded[question.id] ?? []).includes(i)
      ).length
    : 0;
  const summary: RouletteSummary = {
    score: state.score,
    total,
    firstTry: state.firstTry,
    bestStreak: state.bestStreak,
    attempts: state.attempts
  };

  const hud = [
    { id: 'score', label: t.hud.score, icon: 'star' as const, value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame' as const, value: state.streak },
    { id: 'jokers', label: t.hud.jokers, icon: 'card' as const, value: state.jokers },
    { id: 'solved', label: t.hud.solved, icon: 'check' as const, value: `${state.solved.length}/${total}` }
  ];

  return (
    <div ref={rootRef} className={`${css.roulette} ${addClass ?? ''}`} data-phase={phase}>
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
            <RouletteIcon name={icon} className={css['hud-icon']} />
            <span className={css['hud-label']}>{label}</span>
            <span className={css['hud-value']}>{value}</span>
          </li>
        ))}
      </ul>

      <div className={css.stage}>
        <div className={css.board}>
          <RouletteWheel
            views={views}
            wheelRef={wheelRef}
            pointerRef={pointerRef}
            winIndex={phase === 'spinning' || phase === 'done' ? null : state.landed}
            spinning={phase === 'spinning'}
            label={t.wheelLabel}
          />

          <button
            ref={hubRef}
            type="button"
            className={css.hub}
            disabled={phase !== 'idle'}
            aria-label={t.spinLabel}
            onClick={spin}
          >
            <span aria-hidden="true">{phase === 'spinning' ? '…' : t.spin}</span>
          </button>
        </div>

        <div className={css.side}>
          {(phase === 'idle' || phase === 'spinning') && (
            <section className={css.idle} aria-label={t.idle.title}>
              <h3 className={css['idle-title']}>{phase === 'spinning' ? t.spinning : t.idle.title}</h3>
              <p className={css['idle-text']}>{phase === 'spinning' ? '' : state.notice || t.idle.text}</p>

              {(state.jokers > 0 || state.doubleArmed) && (
                <ul className={css.perks}>
                  {state.jokers > 0 && (
                    <li className={css.perk}>
                      <RouletteIcon name="card" /> {t.joker} <strong>x{state.jokers}</strong>
                    </li>
                  )}
                  {state.doubleArmed && (
                    <li className={css.perk}>
                      <RouletteIcon name="star" /> {t.hud.double}
                    </li>
                  )}
                </ul>
              )}
            </section>
          )}

          {(phase === 'question' || phase === 'checked') && question && landedWedge && landedView && (
            <RouletteCard
              question={question}
              number={landedWedge.index + 1}
              total={total}
              bg={landedView.bg}
              ink={landedView.ink}
              order={state.order}
              selected={state.selected}
              hidden={state.hidden}
              discarded={state.discarded[question.id] ?? []}
              verdict={state.last}
              jokers={state.jokers}
              canJoker={phase === 'question' && state.jokers > 0 && !state.jokerUsed && wrongLeft >= 2}
              doubleArmed={state.doubleArmed}
              finishing={state.solved.length === total}
              headingRef={headingRef}
              verdictRef={verdictRef}
              nextRef={nextRef}
              onSelect={select}
              onCheck={check}
              onJoker={useLifeline}
              onNext={next}
            />
          )}

          {phase === 'done' && <RouletteSummaryCard summary={summary} headingRef={summaryRef} onRestart={restart} />}
        </div>
      </div>

      <ol className={css.track} aria-label={t.track.label}>
        {views
          .filter((view) => view.kind === 'question')
          .map((view) => (
            <li
              key={view.id}
              className={css['track-item']}
              data-state={view.state}
              style={{ '--w': view.bg, '--ink': view.ink } as React.CSSProperties}
            >
              <span aria-hidden="true">{view.state === 'solved' ? <RouletteIcon name="check" /> : view.number}</span>
              <span className="u-sr-only">
                {t.question} {view.number}:{' '}
                {view.state === 'solved' ? t.track.solved : view.state === 'review' ? t.track.review : t.track.pending}
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

GameRoulette.Init = RouletteInit;

export { GameRoulette };
