import { useEffect, useMemo, useReducer, useRef } from 'react';
import gsap from 'gsap';

import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { JeopardyBoard } from './jeopardy-board';
import { JeopardyCard } from './jeopardy-card';
import { JeopardyIcon } from './jeopardy-icons';
import { JeopardyInit } from './jeopardy-init';
import { JeopardySummaryCard } from './jeopardy-summary';
import { JeopardyWager } from './jeopardy-wager';
import { DEFAULT_DOUBLES, DEFAULT_LIFELINES, FX_COLORS, i18n, SCORE } from './lib/constant';

import type { Cell, CellState, JeopardyCategory, JeopardyResult, JeopardySummary, State } from './types/types';

import css from './game-jeopardy.module.css';

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];

/** Elige al azar las casillas de apuesta doble, evitando las más baratas de cada categoría. */
const pickDoubles = (cells: Cell[], count: number) => {
  const dear = cells.filter((cell) => cell.q > 0);

  return gsap.utils.shuffle((dear.length >= count ? dear : cells).map((cell) => cell.id)).slice(0, count);
};

const createState = (cells: Cell[], lifelines: number, doubles: number): State => ({
  phase: 'board',
  currentId: null,
  doubles: pickDoubles(cells, doubles),
  isDouble: false,
  wager: null,
  order: [],
  selected: null,
  hidden: [],
  jokerUsed: false,
  solved: [],
  fails: {},
  discarded: {},
  score: 0,
  streak: 0,
  bestStreak: 0,
  lifelines,
  firstTry: 0,
  attempts: 0,
  last: null,
  notice: ''
});

interface Props {
  /** Las categorías del tablero (una columna cada una). Máximo recomendado: 6 categorías de hasta 5 preguntas. */
  categories: JeopardyCategory[];
  /** Comodines 50:50 con los que empieza el estudiante. */
  lifelines?: number;
  /** Cuántas casillas escondidas son «Apuesta doble». `0` las quita. */
  dailyDoubles?: number;
  /** Se llama un instante después de comprobar, para que se vea el veredicto antes de abrir la retroalimentación. */
  onResult?: (result: JeopardyResult) => void;
  /** Se llama al volver al tablero tras un fallo (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al abrir los resultados, cuando todas las casillas están acertadas. */
  onFinish?: (summary: JeopardySummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof JeopardyInit;
};

/**
 * Tablero de preguntas tipo concurso: categorías en columnas y casillas con puntos.
 *
 * - Un acierto apaga su casilla; un fallo la deja en el tablero (con la respuesta descartada y a mitad de puntos).
 * - Puntos: los de la casilla más un bonus por racha. El comodín 50:50 y la repesca los reducen a la mitad.
 * - «Apuesta doble»: una casilla escondida deja apostar 1x, 2x o 3x antes de ver la pregunta; fallar resta lo apostado.
 * - Termina cuando todas las casillas están acertadas.
 */
const GameJeopardy: React.FC<Props> & SubComponents = ({
  categories,
  lifelines = DEFAULT_LIFELINES,
  dailyDoubles = DEFAULT_DOUBLES,
  onResult,
  onReset,
  onFinish,
  addClass
}) => {
  const lang = useLang();
  const t = i18n[lang];

  const canAnimate = useCanAnimate();
  const { defer, flush } = useDeferredResult();

  const cells = useMemo<Cell[]>(
    () =>
      categories.flatMap((category, c) =>
        category.questions.map((question, q) => ({
          id: question.id,
          c,
          q,
          categoryId: category.id,
          category: category.title,
          points: question.points ?? (q + 1) * SCORE.defaultStep,
          question
        }))
      ),
    [categories]
  );
  const byId = useMemo(() => new Map(cells.map((cell) => [cell.id, cell])), [cells]);
  const columns = useMemo(
    () =>
      categories.map((category, c) => ({
        id: category.id,
        title: category.title,
        cells: cells.filter((cell) => cell.c === c)
      })),
    [categories, cells]
  );
  const total = cells.length;

  const [state, patch] = useReducer(
    (prev: State, next: Partial<State>) => ({ ...prev, ...next }),
    null,
    () => createState(cells, lifelines, dailyDoubles)
  );
  const stateRef = useRef(state); // Los callbacks leen el estado de ahora, no el de cuando se programaron
  stateRef.current = state;

  const rootRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const origin = useRef<DOMRect | null>(null); // Caja de la casilla pulsada: de ahí «vuela» la tarjeta
  const moved = useRef(false); // El foco solo se mueve cuando la fase cambia por una acción, no al montar

  const stateOf = (cell: Cell): CellState =>
    state.solved.includes(cell.id) ? 'solved' : state.fails[cell.id] ? 'review' : 'pending';

  const open = (cell: Cell, rect: DOMRect) => {
    const current = stateRef.current;

    if (current.phase !== 'board' || current.solved.includes(cell.id)) return;

    const double = current.doubles.includes(cell.id);

    origin.current = rect;
    patch({
      phase: double ? 'wager' : 'question',
      currentId: cell.id,
      doubles: current.doubles.filter((id) => id !== cell.id),
      isDouble: double,
      wager: null,
      order: gsap.utils.shuffle(cell.question.answers.map((_, k) => k)),
      selected: null,
      hidden: [],
      jokerUsed: false,
      last: null,
      notice: double ? t.live.wager : t.live.opened(cell.category, cell.points)
    });
  };

  const chooseWager = (multiplier: number) => {
    if (stateRef.current.phase !== 'wager') return;

    patch({ phase: 'question', wager: multiplier, notice: '' });
  };

  const select = (answer: number) => {
    if (stateRef.current.phase !== 'question') return;

    patch({ selected: answer });
  };

  /** Comodín 50:50: deja la respuesta correcta y una sola incorrecta. */
  const lifeline = () => {
    const current = stateRef.current;
    const cell = current.currentId ? byId.get(current.currentId) : null;

    if (current.phase !== 'question' || current.lifelines < 1 || current.jokerUsed || !cell) return;

    const wrong = gsap.utils.shuffle(
      cell.question.answers
        .map((answer, i) => ({ answer, i }))
        .filter(({ answer, i }) => answer.state === 'wrong' && !(current.discarded[cell.id] ?? []).includes(i))
        .map(({ i }) => i)
    );

    if (wrong.length < 2) return;

    const hidden = wrong.slice(1);

    patch({
      lifelines: current.lifelines - 1,
      jokerUsed: true,
      hidden,
      selected: current.selected !== null && hidden.includes(current.selected) ? null : current.selected,
      notice: t.live.jokerUsed
    });
  };

  const check = () => {
    const current = stateRef.current;
    const cell = current.currentId ? byId.get(current.currentId) : null;

    if (current.phase !== 'question' || current.selected === null || !cell) return;

    const ok = cell.question.answers[current.selected].state === 'success';
    const fails = current.fails[cell.id] ?? 0;
    const retry = fails > 0;
    const wager = current.isDouble ? current.wager : null;
    // En la apuesta doble el comodín no resta: ya se arriesga lo apostado
    const halved = current.jokerUsed && wager === null;

    let base: number;
    let bonus = 0;
    let points: number;

    if (wager) {
      base = cell.points * wager;
      points = ok ? base : -Math.min(current.score, base);
    } else {
      base = Math.round(cell.points * (retry ? SCORE.retry : 1) * (halved ? SCORE.joker : 1));
      bonus = ok ? Math.round(Math.min(current.streak, SCORE.streakCap) * SCORE.streakStep * cell.points) : 0;
      points = ok ? base + bonus : 0;
    }

    const streak = ok ? current.streak + 1 : 0;
    const attempts = fails + 1;

    patch({
      phase: 'checked',
      last: { ok, points, base, bonus, halved, retry: retry && !wager, wager },
      score: current.score + points,
      streak,
      bestStreak: Math.max(current.bestStreak, streak),
      attempts: current.attempts + 1,
      firstTry: ok && !retry ? current.firstTry + 1 : current.firstTry,
      solved: ok ? [...current.solved, cell.id] : current.solved,
      fails: ok ? current.fails : { ...current.fails, [cell.id]: attempts },
      discarded: ok
        ? current.discarded
        : { ...current.discarded, [cell.id]: [...(current.discarded[cell.id] ?? []), current.selected] },
      notice: ok ? t.live.ok(points, streak) : points < 0 ? t.live.koLost(-points) : t.live.ko
    });

    const deliver = () =>
      onResult?.({ result: ok, question: cell.id, category: cell.categoryId, points, streak, attempts, wager });

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

    patch({ phase: 'board', last: null, wager: null, isDouble: false, notice: '' });
  };

  const restart = () => {
    flush();
    patch(createState(cells, lifelines, dailyDoubles));
  };

  // La tarjeta sale de la casilla pulsada: parte de su caja y crece hasta su sitio
  useGSAP(
    () => {
      const card = cardRef.current;
      const from = origin.current;

      origin.current = null;

      if ((state.phase !== 'question' && state.phase !== 'wager') || !canAnimate || !card || !from) return;

      const to = card.getBoundingClientRect();

      gsap.from(card, {
        x: from.left + from.width / 2 - (to.left + to.width / 2),
        y: from.top + from.height / 2 - (to.top + to.height / 2),
        scaleX: from.width / to.width,
        scaleY: from.height / to.height,
        opacity: 0.2,
        duration: 0.55,
        ease: 'power3.out',
        clearProps: 'transform,opacity'
      });

      // La apuesta doble anuncia su hallazgo con un estallido dorado
      const fx = fxRef.current;

      if (state.phase === 'wager' && fx) {
        const at = centerIn(to, fx.getBoundingClientRect());

        ring(fx, at, css.ring, '#ffd23f', 0.5);
        burst(fx, at, {
          className: css.spark,
          colors: FX_COLORS,
          shapes: CONFETTI_SHAPES,
          count: 16,
          reach: [70, 150],
          size: [7, 12]
        });
      }
    },
    { scope: rootRef, dependencies: [state.phase, state.currentId, canAnimate] }
  );

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
        gsap.fromTo(cardRef.current, { x: -10 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.25)' });
      }

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [state.last, canAnimate] }
  );

  // El foco acompaña a la fase: apuesta o pregunta, botón de seguir, resultados o de vuelta al tablero
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }

    const frame = requestAnimationFrame(() => {
      const root = rootRef.current;

      if (state.phase === 'board') {
        // Vuelve a la casilla que se jugó (si sigue abierta) o a la primera disponible
        const back = state.currentId
          ? root?.querySelector<HTMLElement>(`button[data-cell="${CSS.escape(state.currentId)}"]:not(:disabled)`)
          : null;

        (back ?? root?.querySelector<HTMLElement>('button[data-cell]:not(:disabled)'))?.focus({ preventScroll: true });
        return;
      }

      const target = {
        wager: headingRef,
        question: headingRef,
        checked: nextRef,
        done: summaryRef
      }[state.phase];

      target.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [state.phase, state.currentId]);

  if (!total) return null;

  const { phase } = state;
  const cell = state.currentId ? byId.get(state.currentId) : null;
  const answered = cell ? (state.discarded[cell.id] ?? []) : [];
  const wrongLeft = cell
    ? cell.question.answers.filter(
        (answer, i) => answer.state === 'wrong' && !state.hidden.includes(i) && !answered.includes(i)
      ).length
    : 0;
  const summary: JeopardySummary = {
    score: state.score,
    total,
    firstTry: state.firstTry,
    bestStreak: state.bestStreak,
    attempts: state.attempts
  };

  const hud = [
    { id: 'score', label: t.hud.score, icon: 'star' as const, value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame' as const, value: state.streak },
    { id: 'lifelines', label: t.hud.lifelines, icon: 'card' as const, value: state.lifelines },
    { id: 'solved', label: t.hud.solved, icon: 'check' as const, value: `${state.solved.length}/${total}` }
  ];

  return (
    <div ref={rootRef} className={`${css.jeopardy} ${addClass ?? ''}`} data-phase={phase}>
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
            <JeopardyIcon name={icon} className={css['hud-icon']} />
            <span className={css['hud-label']}>{label}</span>
            <span className={css['hud-value']}>{value}</span>
          </li>
        ))}
      </ul>

      <div className={css.stage}>
        {phase === 'board' && (
          <>
            <p className={css.hint}>{t.hint}</p>
            <JeopardyBoard columns={columns} stateOf={stateOf} onOpen={open} />
          </>
        )}

        {phase === 'wager' && cell && (
          <JeopardyWager points={cell.points} headingRef={headingRef} cardRef={cardRef} onChoose={chooseWager} />
        )}

        {(phase === 'question' || phase === 'checked') && cell && (
          <JeopardyCard
            cell={cell}
            order={state.order}
            selected={state.selected}
            hidden={state.hidden}
            discarded={answered}
            verdict={state.last}
            wager={state.isDouble ? state.wager : null}
            lifelines={state.lifelines}
            canJoker={
              phase === 'question' && state.lifelines > 0 && !state.jokerUsed && !state.isDouble && wrongLeft >= 2
            }
            finishing={state.solved.length === total}
            cardRef={cardRef}
            headingRef={headingRef}
            verdictRef={verdictRef}
            nextRef={nextRef}
            onSelect={select}
            onCheck={check}
            onJoker={lifeline}
            onNext={next}
          />
        )}

        {phase === 'done' && <JeopardySummaryCard summary={summary} headingRef={summaryRef} onRestart={restart} />}
      </div>

      <ol className={css.track} aria-label={t.track.label}>
        {cells.map((item) => (
          <li key={item.id} className={css['track-item']} data-state={stateOf(item)}>
            <span aria-hidden="true">{stateOf(item) === 'solved' ? <JeopardyIcon name="check" /> : item.points}</span>
            <span className="u-sr-only">
              {item.category} {item.points}:{' '}
              {stateOf(item) === 'solved' ? t.solved : stateOf(item) === 'review' ? t.review : ''}
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

GameJeopardy.Init = JeopardyInit;

export { GameJeopardy };
