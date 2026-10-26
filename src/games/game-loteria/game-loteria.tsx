import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import gsap from 'gsap';

import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { FX_COLORS, HINT_AFTER, i18n, LINE_COLORS, LOTERIA_COLORS, MARK_MS, MISS_COLORS, SCORE } from './lib/constant';
import type { IconName } from './lib/icons';
import { colsFor, lineKey, linesOf, rankOf } from './lib/layout';
import { LoteriaBoard } from './loteria-board';
import { LoteriaCaller } from './loteria-caller';
import { LoteriaIcon } from './loteria-icons';
import { LoteriaInit } from './loteria-init';
import { LoteriaSummaryCard } from './loteria-summary';

import type { LoteriaQuestion, LoteriaResult, LoteriaSummary, State } from './types/types';

import css from './game-loteria.module.css';

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];
const SMOKE_SHAPES = ['circle(50%)'];
const LEGEND: { kind: 'card' | 'ok' | 'ko' | 'line'; icon: IconName }[] = [
  { kind: 'card', icon: 'cards' },
  { kind: 'ok', icon: 'bean' },
  { kind: 'ko', icon: 'cross' },
  { kind: 'line', icon: 'grid' }
];

interface Props {
  /** Las pistas: cada una tiene su carta en la tabla. Pásalas como constante: no cambian mientras se juega. */
  questions: LoteriaQuestion[];
  /** Se llama un instante después de tocar una carta, para que se vea el frijol (o la cruz) antes de abrir la retroalimentación. */
  onResult?: (result: LoteriaResult) => void;
  /** Se llama al probar otra carta tras un fallo (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al llenar la tabla, cuando se muestran los resultados. */
  onFinish?: (summary: LoteriaSummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof LoteriaInit;
};

/**
 * Lotería con preguntas: el cantor lee una pista y el estudiante toca, en su tabla, la carta que la responde.
 *
 * - Acertar pone un frijol en la carta. Fallar descarta esa carta para esta pista; con dos fallos seguidos el cantor
 *   deja solo dos cartas posibles.
 * - Cada fila o columna completa da un bono (¡Buena!) y los aciertos seguidos suman puntos de racha.
 * - La tabla son las cartas de todas las preguntas (el número de columnas se adapta al ancho). El juego acaba al
 *   acertar todas: la tabla llena es la ¡Lotería!
 */
const GameLoteria: React.FC<Props> & SubComponents = ({ questions, onResult, onReset, onFinish, addClass }) => {
  const lang = useLang();
  const t = i18n[lang];

  const canAnimate = useCanAnimate();
  const { defer, flush } = useDeferredResult();
  const total = questions.length;
  const cards = Object.fromEntries(questions.map((q) => [q.id, q.card]));

  const createState = (): State => ({
    phase: 'pick',
    board: gsap.utils.shuffle(questions.map((q) => q.id)),
    queue: gsap.utils.shuffle(questions.map((_, k) => k)),
    solved: [],
    fails: {},
    discarded: {},
    score: 0,
    streak: 0,
    bestStreak: 0,
    firstTry: 0,
    attempts: 0,
    errors: 0,
    hints: 0,
    lines: [],
    last: null,
    notice: ''
  });

  const [state, patch] = useReducer((prev: State, next: Partial<State>) => ({ ...prev, ...next }), null, createState);
  const stateRef = useRef(state); // Los callbacks leen el estado de ahora, no el de cuando se programaron
  stateRef.current = state;

  const rootRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLUListElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // El foco solo se mueve cuando la fase cambia por una acción, no al montar
  const marked = useRef(-1); // Último toque ya animado: evita animarlo dos veces si el efecto se repite

  // Las columnas siguen al ancho de la tabla; las filas y columnas del bono salen de ese reparto
  const [cols, setCols] = useState(() => colsFor(0, total));
  const colsRef = useRef(cols);
  colsRef.current = cols;

  useLayoutEffect(() => {
    const el = boardRef.current;

    if (!el) return;

    const watch = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;

      if (width > 0) setCols(colsFor(width, total));
    });

    watch.observe(el);

    return () => watch.disconnect();
  }, [total]);

  const item = questions[state.queue[0]] as LoteriaQuestion | undefined;
  const discarded = item ? (state.discarded[item.id] ?? []) : [];
  const candidates = state.board.filter((id) => !state.solved.includes(id) && !discarded.includes(id));
  const hinted = !!item && (state.fails[item.id] ?? 0) > 0 && candidates.length === 2;

  const summaryOf = (now: State): LoteriaSummary => ({
    score: now.score,
    total,
    firstTry: now.firstTry,
    bestStreak: now.bestStreak,
    attempts: now.attempts,
    errors: now.errors,
    hints: now.hints,
    lines: now.lines.length,
    rank: rankOf(now.firstTry, total)
  });

  const pick = (id: string) => {
    const now = stateRef.current;
    const q = questions[now.queue[0]];

    if (now.phase !== 'pick' || !q || now.solved.includes(id) || (now.discarded[q.id] ?? []).includes(id)) return;

    const ok = id === q.id;
    const fails = now.fails[q.id] ?? 0;
    const firstTry = ok && fails === 0;
    const streak = ok ? now.streak + 1 : 0;
    const solved = ok ? [...now.solved, id] : now.solved;
    const last = ok && now.queue.length === 1;
    const lines = ok
      ? linesOf(now.board, colsRef.current).filter(
          (line) => line.includes(id) && line.every((c) => solved.includes(c)) && !now.lines.includes(lineKey(line))
        )
      : [];
    const points = ok
      ? (fails > 0 ? SCORE.retry : SCORE.answer) +
        Math.min(now.streak, SCORE.streakCap) * SCORE.streakStep +
        lines.length * SCORE.line
      : 0;

    // Dos fallos seguidos en la misma pista: el cantor deja solo la carta buena y otra al azar
    const taken = [...(now.discarded[q.id] ?? []), id];
    const rest = now.board.filter((c) => c !== q.id && !now.solved.includes(c) && !taken.includes(c));
    const hint = !ok && fails + 1 === HINT_AFTER && rest.length > 1;
    const keep = hint ? (gsap.utils.random(rest) as string) : null;
    const dropped = hint ? rest.filter((c) => c !== keep) : [];
    const label = cards[id].label;

    patch({
      phase: canAnimate ? 'marking' : 'checked',
      last: { ok, firstTry, points, lines, last, hint, picked: id },
      score: now.score + points,
      streak,
      bestStreak: Math.max(now.bestStreak, streak),
      attempts: now.attempts + 1,
      firstTry: firstTry ? now.firstTry + 1 : now.firstTry,
      errors: ok ? now.errors : now.errors + 1,
      hints: hint ? now.hints + 1 : now.hints,
      solved,
      fails: ok ? now.fails : { ...now.fails, [q.id]: fails + 1 },
      discarded: ok ? now.discarded : { ...now.discarded, [q.id]: [...taken, ...dropped] },
      lines: [...now.lines, ...lines.map(lineKey)],
      notice: ok
        ? [t.live.ok(label, points), lines.length ? t.live.line(lines.length) : '', last ? t.live.last : '']
            .filter(Boolean)
            .join(' ')
        : [t.live.ko(label), hint ? t.live.hint : ''].filter(Boolean).join(' ')
    });

    const deliver = () => onResult?.({ result: ok, question: q.id, streak, attempts: fails + 1, points });
    const delay = !ok ? MARK_MS.ko : lines.length || last ? MARK_MS.line : MARK_MS.ok;

    // El resultado llega cuando el frijol ya está puesto (o la carta tachada); sin movimiento, casi de inmediato
    defer(() => (canAnimate ? deliver() : void setTimeout(deliver, 60)), ok, delay);
  };

  /** Tras tocar una carta: la pista siguiente (acierto), los resultados (última) o probar otra carta (fallo). */
  const afterCheck = () => {
    flush(); // Si aún esperaba entregar el resultado, se entrega ya

    const now = stateRef.current;
    const verdict = now.last;

    if (now.phase !== 'checked' || !verdict) return;

    if (!verdict.ok) {
      onReset?.();
      patch({ phase: 'pick', last: null, notice: '' });
      return;
    }

    const queue = now.queue.slice(1);

    if (verdict.last) {
      const next: State = { ...now, phase: 'done', queue, score: now.score + SCORE.loteria, last: null, notice: '' };

      patch(next);
      onFinish?.(summaryOf(next));
      return;
    }

    patch({
      phase: 'pick',
      queue,
      last: null,
      notice: t.live.question(now.solved.length + 1, total)
    });
  };

  const restart = () => {
    flush();
    marked.current = -1;
    patch(createState());
  };

  // Al tocar una carta: el frijol cae sobre ella (con aro y confeti, y un pulso si completa una línea) o la carta tiembla
  useGSAP(
    () => {
      const now = stateRef.current;
      const verdict = now.last;

      if (now.phase !== 'marking' || !verdict || marked.current === now.attempts) return;

      const root = rootRef.current;
      const fx = fxRef.current;
      const board = boardRef.current;
      const all = root ? [...root.querySelectorAll<HTMLElement>('[data-card]')] : [];
      const cardOf = (id: string) => all.find((el) => el.dataset.card === id);
      const card = cardOf(verdict.picked);
      const finish = () => {
        marked.current = now.attempts;
        patch({ phase: 'checked' });
      };

      if (!root || !fx || !board || !card) {
        finish();
        return;
      }

      const fxBox = () => fx.getBoundingClientRect();
      const centerOf = (els: HTMLElement[]) => {
        const boxes = els.map((el) => centerIn(el.getBoundingClientRect(), fxBox()));

        return {
          x: boxes.reduce((sum, p) => sum + p.x, 0) / boxes.length,
          y: boxes.reduce((sum, p) => sum + p.y, 0) / boxes.length
        };
      };
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(all, { clearProps: 'transform' });
          finish();
        }
      });

      if (verdict.ok) {
        const beans = card.querySelectorAll('[data-bean]');

        tl.fromTo(
          beans,
          { y: -80, scale: 2.4, opacity: 0, rotation: -50 },
          { y: 0, scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'bounce.out', stagger: 0.07 }
        );
        tl.add(() => {
          const at = centerOf([card]);

          ring(fx, at, css.ring, '#ffd24a', 0.8);
          burst(fx, at, {
            className: css.spark,
            colors: FX_COLORS,
            shapes: CONFETTI_SHAPES,
            count: 14,
            reach: [40, 110],
            size: [6, 11],
            gravity: 40
          });
        }, '-=0.25');

        verdict.lines.forEach((line) => {
          const els = line.map(cardOf).filter((el): el is HTMLElement => !!el);

          tl.to(els, { scale: 1.07, duration: 0.18, yoyo: true, repeat: 1, stagger: 0.08, ease: 'power1.inOut' });
          tl.add(
            () =>
              burst(fx, centerOf(els), {
                className: css.spark,
                colors: LINE_COLORS,
                shapes: CONFETTI_SHAPES,
                count: 18,
                reach: [60, 160],
                size: [6, 12],
                gravity: 50
              }),
            '<0.15'
          );
        });

        if (verdict.last) {
          tl.add(() => {
            const box = board.getBoundingClientRect();

            burst(fx, centerIn(box, fxBox()), {
              className: css.spark,
              colors: LOTERIA_COLORS,
              shapes: CONFETTI_SHAPES,
              count: 44,
              reach: [80, Math.max(160, box.width / 2)],
              size: [7, 14],
              gravity: 90
            });
          });
        }

        tl.to({}, { duration: 0.35 });
      } else {
        tl.fromTo(card, { x: 0 }, { x: 8, duration: 0.07, repeat: 7, yoyo: true, ease: 'sine.inOut' });
        tl.add(() => {
          const at = centerOf([card]);

          ring(fx, at, css.ring, '#ff6b5e', 0.8);
          burst(fx, at, {
            className: css.spark,
            colors: MISS_COLORS,
            shapes: SMOKE_SHAPES,
            count: 10,
            reach: [20, 60],
            size: [8, 16],
            gravity: -22
          });
        }, '<');
        tl.to(card, { x: 0, duration: 0.07 });
        tl.to({}, { duration: 0.2 });
      }

      return () => {
        tl.kill();
      };
    },
    { scope: rootRef, dependencies: [state.phase, canAnimate] }
  );

  // El foco acompaña a la fase: la pista, el botón de seguir o los resultados
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }

    const frame = requestAnimationFrame(() => {
      const target = { pick: headingRef, checked: nextRef, done: summaryRef }[
        state.phase as 'pick' | 'checked' | 'done'
      ];

      target?.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [state.phase]);

  if (!total) return null;

  const { phase, last } = state;
  const showVerdict = phase !== 'pick' && phase !== 'done' && last !== null;

  const hud: { id: string; label: string; icon: IconName; value: React.ReactNode }[] = [
    { id: 'score', label: t.hud.score, icon: 'star', value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame', value: state.streak },
    { id: 'lines', label: t.hud.lines, icon: 'grid', value: state.lines.length },
    { id: 'beans', label: t.hud.beans, icon: 'bean', value: `${state.solved.length}/${total}` }
  ];

  return (
    <div ref={rootRef} className={`${css.loteria} ${addClass ?? ''}`} data-phase={phase}>
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
            <LoteriaIcon name={icon} className={css['hud-icon']} />
            <span className={css['hud-label']}>{label}</span>
            <span className={css['hud-value']}>{value}</span>
          </li>
        ))}
      </ul>

      {phase === 'done' ? (
        <LoteriaSummaryCard summary={summaryOf(state)} headingRef={summaryRef} onRestart={restart} />
      ) : (
        item && (
          <LoteriaCaller
            question={item}
            number={state.solved.length + (showVerdict && last.ok ? 0 : 1)}
            total={total}
            phase={phase}
            verdict={last}
            hinted={hinted}
            headingRef={headingRef}
            verdictRef={verdictRef}
            nextRef={nextRef}
            onNext={afterCheck}
          />
        )
      )}

      <LoteriaBoard
        boardRef={boardRef}
        board={state.board}
        cards={cards}
        cols={cols}
        solved={state.solved}
        discarded={discarded}
        picked={showVerdict ? { id: last.picked, ok: last.ok } : null}
        active={phase === 'pick'}
        shout={
          showVerdict && last.ok && (last.last || last.lines.length > 0)
            ? last.last
              ? { kind: 'loteria', text: t.shout.loteria }
              : { kind: 'line', text: t.shout.line }
            : null
        }
        label={t.board}
        markedLabel={t.marked}
        discardedLabel={t.discarded}
        onPick={pick}
      />

      <ul className={css.legend} aria-label={t.legend.label}>
        {LEGEND.map(({ kind, icon }) => (
          <li key={kind} className={css['legend-item']} data-kind={kind}>
            <LoteriaIcon name={icon} />
            {t.legend[kind]}
          </li>
        ))}
      </ul>

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

GameLoteria.Init = LoteriaInit;

export { GameLoteria };
