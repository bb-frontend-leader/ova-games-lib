import { useEffect, useMemo, useReducer, useRef } from 'react';
import gsap from 'gsap';

import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { BOOM_COLORS, DEFAULT_COLUMNS, FX_COLORS, i18n, MAX_SHIELDS, SCORE, STREAK_RADAR } from './lib/constant';
import { createCells, gridSize } from './lib/layout';
import { MinesBoard } from './mines-board';
import { MinesCard } from './mines-card';
import { MinesGuide } from './mines-guide';
import { MinesIcon } from './mines-icons';
import { MinesInit } from './mines-init';
import { MinesSummaryCard } from './mines-summary';

import type { Cell, MinesQuestion, MinesResult, MinesSummary, State } from './types/types';

import css from './game-minesweeper.module.css';

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];

const shuffled = (question: MinesQuestion) => gsap.utils.shuffle(question.answers.map((_, k) => k));

const createState = (total: number, cols: number, rows: number): State => ({
  phase: 'board',
  cells: createCells(total, cols, rows),
  currentId: null,
  order: [],
  selected: null,
  solved: [],
  fails: {},
  discarded: {},
  score: 0,
  streak: 0,
  bestStreak: 0,
  firstTry: 0,
  attempts: 0,
  shields: 0,
  minesHit: 0,
  bonus: 0,
  flagMode: false,
  last: null,
  event: null,
  notice: ''
});

const withCell = (cells: Cell[], id: number, changes: Partial<Cell>) =>
  cells.map((cell) => (cell.id === id ? { ...cell, ...changes } : cell));

interface Props {
  /** Las preguntas: cada casilla segura esconde una. Pásalas como constante: no cambian mientras se juega. */
  questions: MinesQuestion[];
  /** Columnas del campo. Las filas salen del número de preguntas y minas. */
  columns?: number;
  /** Mínimo de minas escondidas (por defecto, un tercio de las preguntas). Si el campo no cuadra, sobran más. */
  mines?: number;
  /** Se llama un instante después de comprobar, para que se vea el veredicto antes de abrir la retroalimentación. */
  onResult?: (result: MinesResult) => void;
  /** Se llama al volver al campo tras un fallo (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al abrir los resultados, cuando todas las casillas seguras están despejadas. */
  onFinish?: (summary: MinesSummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof MinesInit;
};

/**
 * Buscaminas con preguntas: un campo de casillas, unas seguras (cada una con su pregunta) y otras minadas.
 *
 * - Abrir una casilla segura abre su pregunta; al acertar se despeja y su número dice cuántas minas la rodean.
 * - Fallar descarta la respuesta y deja la casilla cerrada. Abrir una mina la hace explotar: pierdes puntos.
 * - Acertar a la primera da un escudo que absorbe una mina. Cada tres aciertos seguidos el radar marca una mina.
 * - Termina cuando todas las casillas seguras están despejadas. Las minas marcadas y los escudos suman al final.
 */
const GameMinesweeper: React.FC<Props> & SubComponents = ({
  questions,
  columns = DEFAULT_COLUMNS,
  mines,
  onResult,
  onReset,
  onFinish,
  addClass
}) => {
  const lang = useLang();
  const t = i18n[lang];

  const canAnimate = useCanAnimate();
  const { defer, flush } = useDeferredResult();
  const total = questions.length;
  const size = useMemo(
    () => gridSize(total, columns, mines ?? Math.max(2, Math.round(total / 3))),
    [total, columns, mines]
  );

  const [state, patch] = useReducer(
    (prev: State, next: Partial<State>) => ({ ...prev, ...next }),
    null,
    () => createState(total, size.cols, size.rows)
  );
  const stateRef = useRef(state); // Los callbacks leen el estado de ahora, no el de cuando se programaron
  stateRef.current = state;

  const rootRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // El foco solo se mueve cuando la fase cambia por una acción, no al montar

  const cellEl = (id: number) => rootRef.current?.querySelector<HTMLElement>(`[data-cell="${id}"]`) ?? null;

  const current = state.currentId !== null ? state.cells[state.currentId] : null;
  const question = current?.q != null ? questions[current.q] : null;
  const stateOf = (item: MinesQuestion) =>
    state.solved.includes(item.id) ? 'solved' : state.fails[item.id] ? 'review' : 'pending';
  const reviewIds = state.cells
    .filter((cell) => cell.q !== null && cell.status === 'closed' && state.fails[questions[cell.q].id])
    .map((cell) => cell.id);
  const flagged = state.cells.filter((cell) => cell.flag).length;
  const exploded = state.cells.filter((cell) => cell.status === 'boom').length;

  const toggleFlag = (id: number) => {
    const now = stateRef.current;
    const cell = now.cells[id];

    if (now.phase !== 'board' || !cell || cell.status !== 'closed') return;

    if (cell.radar) {
      patch({ notice: t.live.radarBlock });
      return;
    }

    patch({ cells: withCell(now.cells, id, { flag: !cell.flag }), notice: cell.flag ? t.live.flagOff : t.live.flagOn });
  };

  const open = (id: number) => {
    const now = stateRef.current;
    const cell = now.cells[id];

    if (now.phase !== 'board' || !cell || cell.status !== 'closed') return;

    if (now.flagMode) {
      toggleFlag(id);
      return;
    }

    if (cell.radar || cell.flag) {
      patch({ notice: cell.radar ? t.live.radarBlock : t.live.flaggedBlock });
      return;
    }

    if (cell.mine) {
      // El escudo absorbe la mina; sin escudo se pierden puntos (nunca por debajo de cero) y se pierde la racha
      const shielded = now.shields > 0;
      const lost = shielded ? 0 : Math.min(now.score, SCORE.mine);

      patch({
        cells: withCell(now.cells, id, { status: 'boom' }),
        shields: shielded ? now.shields - 1 : now.shields,
        score: now.score - lost,
        streak: shielded ? now.streak : 0,
        minesHit: now.minesHit + 1,
        event: { n: (now.event?.n ?? 0) + 1, id, kind: shielded ? 'shielded' : 'hit', points: lost },
        notice: shielded ? t.live.shielded : lost ? t.live.boom(lost) : t.live.boomNone
      });
      return;
    }

    const item = questions[cell.q as number];

    patch({
      phase: 'question',
      currentId: id,
      order: shuffled(item),
      selected: null,
      last: null,
      event: null,
      notice: t.live.opened(cell.row + 1, cell.col + 1)
    });
  };

  const select = (answer: number) => {
    if (stateRef.current.phase !== 'question') return;

    patch({ selected: answer });
  };

  const check = () => {
    const now = stateRef.current;
    const cell = now.currentId !== null ? now.cells[now.currentId] : null;
    const item = cell?.q != null ? questions[cell.q] : null;

    if (now.phase !== 'question' || now.selected === null || !cell || !item) return;

    const ok = item.answers[now.selected].state === 'success';
    const fails = now.fails[item.id] ?? 0;
    const retry = fails > 0;
    const firstTry = ok && !retry;
    const points = ok
      ? (retry ? SCORE.retry : SCORE.cell) + Math.min(now.streak, SCORE.streakCap) * SCORE.streakStep
      : 0;
    const streak = ok ? now.streak + 1 : 0;
    const attempts = fails + 1;
    const shield = firstTry && now.shields < MAX_SHIELDS;
    // Cada tres aciertos seguidos, el radar marca una mina que siga escondida
    const radar =
      ok && streak % STREAK_RADAR === 0
        ? (gsap.utils.shuffle(now.cells.filter((c) => c.mine && c.status === 'closed' && !c.radar))[0]?.id ?? null)
        : null;

    let cells = ok ? withCell(now.cells, cell.id, { status: 'open' }) : now.cells;

    if (radar !== null) cells = withCell(cells, radar, { flag: true, radar: true });

    patch({
      phase: 'checked',
      cells,
      last: { ok, firstTry, points, adj: cell.adj, shield, radar },
      score: now.score + points,
      streak,
      bestStreak: Math.max(now.bestStreak, streak),
      attempts: now.attempts + 1,
      firstTry: firstTry ? now.firstTry + 1 : now.firstTry,
      shields: shield ? now.shields + 1 : now.shields,
      solved: ok ? [...now.solved, item.id] : now.solved,
      fails: ok ? now.fails : { ...now.fails, [item.id]: attempts },
      discarded: ok
        ? now.discarded
        : { ...now.discarded, [item.id]: [...(now.discarded[item.id] ?? []), now.selected] },
      notice: ok
        ? [t.live.ok(points), shield ? t.live.okShield : '', radar !== null ? t.live.okRadar : '']
            .filter(Boolean)
            .join(' ')
        : t.live.ko
    });

    const deliver = () => onResult?.({ result: ok, question: item.id, streak, attempts, points });

    // Sin movimiento no hay espera, pero se deja un instante para que el foco llegue al botón antes del modal de la página
    defer(() => (canAnimate ? deliver() : void setTimeout(deliver, 60)), ok);
  };

  /** Tras comprobar: volver al campo o, si era la última casilla segura, a los resultados. */
  const next = () => {
    flush(); // Si aún esperaba entregar el resultado, se entrega ya

    const now = stateRef.current;

    if (now.phase !== 'checked') return;

    if (now.last && !now.last.ok) onReset?.();

    if (now.solved.length === total) {
      const flagsOk = now.cells.filter((cell) => cell.mine && cell.status === 'closed' && cell.flag).length;
      const bonus = flagsOk * SCORE.flag + now.shields * SCORE.shield;
      const score = now.score + bonus;

      patch({ phase: 'done', score, bonus, notice: '' });
      onFinish?.({
        score,
        total,
        firstTry: now.firstTry,
        bestStreak: now.bestStreak,
        attempts: now.attempts,
        minesHit: now.minesHit,
        flagsOk,
        bonus
      });
      return;
    }

    patch({ phase: 'board', selected: null, last: null, notice: '' });
  };

  const toggleMode = () => {
    const now = stateRef.current;

    if (now.phase !== 'board') return;

    patch({ flagMode: !now.flagMode, notice: t.live.mode(!now.flagMode) });
  };

  const restart = () => {
    flush();
    patch(createState(total, size.cols, size.rows));
  };

  // Acierto: aro y confeti desde el veredicto, y aro en la casilla donde el radar marcó una mina. Fallo: temblor.
  useGSAP(
    () => {
      const fx = fxRef.current;
      const verdict = verdictRef.current;
      const last = state.last;

      if (!last || !canAnimate || !fx || !verdict) return;

      const box = fx.getBoundingClientRect();

      if (last.ok) {
        const at = centerIn(verdict.getBoundingClientRect(), box);

        ring(fx, at, css.ring, '#ffc933', 0.5);
        burst(fx, at, {
          className: css.spark,
          colors: FX_COLORS,
          shapes: CONFETTI_SHAPES,
          count: 16,
          reach: [50, 130],
          size: [7, 12],
          gravity: 40
        });

        const radar = last.radar !== null ? cellEl(last.radar) : null;

        if (radar) ring(fx, centerIn(radar.getBoundingClientRect(), box), css.ring, '#7fe3c8', 1);
      } else {
        gsap.fromTo(verdict, { x: -10 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.25)' });
      }

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [state.last, canAnimate] }
  );

  // Una mina explota: estallido en su casilla, el campo se sacude y los puntos perdidos suben
  useGSAP(
    () => {
      const fx = fxRef.current;
      const event = state.event;
      const target = event ? cellEl(event.id) : null;

      if (!event || !canAnimate || !fx || !target) return;

      const at = centerIn(target.getBoundingClientRect(), fx.getBoundingClientRect());
      const hit = event.kind === 'hit';

      ring(fx, at, css.ring, hit ? '#ff8a3d' : '#7fe3c8', 1);
      burst(fx, at, {
        className: css.spark,
        colors: hit ? BOOM_COLORS : FX_COLORS,
        shapes: CONFETTI_SHAPES,
        count: hit ? 26 : 12,
        reach: [40, 120],
        size: [6, 12],
        gravity: 50
      });

      if (hit) {
        gsap.fromTo(fieldRef.current, { x: -7 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.25)' });

        if (event.points) {
          const float = document.createElement('span');

          float.className = css.float;
          float.textContent = `−${event.points}`;
          fx.appendChild(float);
          gsap.fromTo(
            float,
            { x: at.x, y: at.y - 10, xPercent: -50, yPercent: -50, scale: 0.6, opacity: 1 },
            {
              y: at.y - 70,
              scale: 1.2,
              opacity: 0,
              duration: 1.1,
              ease: 'power2.out',
              onComplete: () => float.remove()
            }
          );
        }
      }

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [state.event, canAnimate] }
  );

  // El foco acompaña a la fase: la casilla que se jugó, la pregunta, el botón de seguir o los resultados
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }

    const frame = requestAnimationFrame(() => {
      if (state.phase === 'board') {
        const back = state.currentId !== null ? cellEl(state.currentId) : null;

        (back ?? rootRef.current?.querySelector<HTMLElement>('[data-cell]:not(:disabled)'))?.focus({
          preventScroll: true
        });
        return;
      }

      const target = { question: headingRef, checked: nextRef, done: summaryRef }[state.phase];

      target.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  if (!total) return null;

  const { phase } = state;
  const summary: MinesSummary = {
    score: state.score,
    total,
    firstTry: state.firstTry,
    bestStreak: state.bestStreak,
    attempts: state.attempts,
    minesHit: state.minesHit,
    flagsOk: state.cells.filter((cell) => cell.mine && cell.status === 'closed' && cell.flag).length,
    bonus: state.bonus
  };

  const hud = [
    { id: 'score', label: t.hud.score, icon: 'star' as const, value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame' as const, value: state.streak },
    { id: 'shields', label: t.hud.shields, icon: 'shield' as const, value: state.shields },
    { id: 'solved', label: t.hud.solved, icon: 'check' as const, value: `${state.solved.length}/${total}` }
  ];

  return (
    <div ref={rootRef} className={`${css.mines} ${addClass ?? ''}`} data-phase={phase}>
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
            <MinesIcon name={icon} className={css['hud-icon']} />
            <span className={css['hud-label']}>{label}</span>
            <span className={css['hud-value']}>{value}</span>
          </li>
        ))}
      </ul>

      <div className={css.play}>
        <div className={css['field-wrap']}>
          <div className={css.toolbar}>
            <span className={css.counter}>
              <MinesIcon name="mine" />
              {t.minesLeft(Math.max(0, size.mines - flagged - exploded))}
            </span>

            <button
              type="button"
              className={css.tool}
              aria-pressed={state.flagMode}
              disabled={phase !== 'board'}
              onClick={toggleMode}
            >
              <MinesIcon name="flag" />
              {t.flagMode}
            </button>
          </div>

          <div ref={fieldRef}>
            <MinesBoard
              cells={state.cells}
              columns={size.cols}
              interactive={phase === 'board'}
              reveal={phase === 'done'}
              review={reviewIds}
              current={phase === 'question' || phase === 'checked' ? state.currentId : null}
              onPress={open}
              onFlag={toggleFlag}
            />
          </div>
        </div>

        <div className={css.side}>
          {phase === 'board' && <MinesGuide event={state.event} />}

          {(phase === 'question' || phase === 'checked') && question && current && (
            <MinesCard
              question={question}
              number={(current.q ?? 0) + 1}
              total={total}
              order={state.order}
              selected={state.selected}
              discarded={state.discarded[question.id] ?? []}
              verdict={state.last}
              finishing={state.solved.length === total}
              headingRef={headingRef}
              verdictRef={verdictRef}
              nextRef={nextRef}
              onSelect={select}
              onCheck={check}
              onNext={next}
            />
          )}

          {phase === 'done' && <MinesSummaryCard summary={summary} headingRef={summaryRef} onRestart={restart} />}
        </div>
      </div>

      <ol className={css.track} aria-label={t.track.label}>
        {questions.map((item, i) => (
          <li key={item.id} className={css['track-item']} data-state={stateOf(item)}>
            <span aria-hidden="true">{stateOf(item) === 'solved' ? <MinesIcon name="check" /> : i + 1}</span>
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

GameMinesweeper.Init = MinesInit;

export { GameMinesweeper };
