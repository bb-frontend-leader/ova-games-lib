import { useEffect, useReducer, useRef } from 'react';
import gsap from 'gsap';

import { burst, centerIn, focusInView, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import {
  DEFAULT_FLEET,
  DEFAULT_SIZE,
  FX_COLORS,
  HIT_COLORS,
  i18n,
  MAX_SONAR,
  SCORE,
  SPLASH_COLORS,
  STREAK_SONAR
} from './lib/constant';
import { createBoard, nearShips } from './lib/layout';
import { NavalBoard } from './naval-board';
import { NavalCard } from './naval-card';
import { NavalGuide } from './naval-guide';
import { NavalIcon } from './naval-icons';
import { NavalInit } from './naval-init';
import { NavalShotCard } from './naval-shot';
import { NavalSummaryCard } from './naval-summary';

import type { Cell, NavalQuestion, NavalResult, NavalSummary, Phase, State } from './types/types';

import css from './game-naval-battle.module.css';

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];
const DROP_SHAPES = ['circle(50%)'];

/** Lo que tarda el proyectil en llegar a su casilla (s). */
const FLIGHT = 0.55;

const shuffled = (question: NavalQuestion) => gsap.utils.shuffle(question.answers.map((_, k) => k));

const withCell = (cells: Cell[], id: number, changes: Partial<Cell>) =>
  cells.map((cell) => (cell.id === id ? { ...cell, ...changes } : cell));

interface Props {
  /** Las preguntas: cada acierto da un disparo. Pásalas como constante: no cambian mientras se juega. */
  questions: NavalQuestion[];
  /** Lado del mar en casillas (el mar es cuadrado). */
  size?: number;
  /** Longitud de cada barco de la flota enemiga. Por defecto un crucero y dos patrulleros. */
  fleet?: number[];
  /** Se llama un instante después de comprobar, para que se vea el veredicto antes de abrir la retroalimentación. */
  onResult?: (result: NavalResult) => void;
  /** Se llama al volver a intentar una pregunta tras un fallo (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al abrir los resultados, cuando todas las preguntas están acertadas y se usó el último disparo. */
  onFinish?: (summary: NavalSummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof NavalInit;
};

/**
 * Batalla naval con preguntas: una flota enemiga se esconde en el mar y cada pregunta acertada da un disparo.
 *
 * - Fallar descarta la respuesta y hay que reintentar: sin acierto no hay disparo.
 * - Tocar un barco da otro disparo; el agua pasa a la siguiente pregunta. Al hundir un barco (o toda la flota)
 *   se ganan puntos extra, y si cae la flota entera llega otra nueva.
 * - Cada tres aciertos seguidos se gana una carga de sonar, que dice cuántos barcos hay cerca de una casilla sin
 *   gastar el disparo.
 * - Termina cuando todas las preguntas están acertadas y se usó el último disparo.
 */
const GameNavalBattle: React.FC<Props> & SubComponents = ({
  questions,
  size = DEFAULT_SIZE,
  fleet = DEFAULT_FLEET,
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
  const side = Math.max(3, Math.floor(size));
  const ships = fleet.map((length) => Math.min(side, Math.max(1, Math.floor(length))));

  const createState = (): State => {
    const queue = gsap.utils.shuffle(questions.map((_, k) => k));

    return {
      phase: 'question',
      ...createBoard(side, ships),
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
      shots: 0,
      hits: 0,
      shipsSunk: 0,
      fleetsSunk: 0,
      sonar: 0,
      pingMode: false,
      last: null,
      shot: null,
      ping: null,
      target: null,
      notice: ''
    };
  };

  const [state, patch] = useReducer((prev: State, next: Partial<State>) => ({ ...prev, ...next }), null, createState);
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
  const prevPhase = useRef<Phase>(state.phase);
  const landed = useRef(-1); // Disparos ya resueltos: evita resolver dos veces el mismo si el efecto se repite

  const cellEl = (id: number) => rootRef.current?.querySelector<HTMLElement>(`[data-cell="${id}"]`) ?? null;

  const item = questions[state.queue[state.at]] as NavalQuestion | undefined;
  const stateOf = (q: NavalQuestion) =>
    state.solved.includes(q.id) ? 'solved' : state.fails[q.id] ? 'review' : 'pending';
  const shipsLeft = state.ships.filter((ship) => ship.cells.some((id) => state.cells[id].status !== 'sunk')).length;

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
    const sonar = ok && streak % STREAK_SONAR === 0 && now.sonar < MAX_SONAR;

    patch({
      phase: 'checked',
      last: { ok, firstTry, points, sonar },
      score: now.score + points,
      streak,
      bestStreak: Math.max(now.bestStreak, streak),
      attempts: now.attempts + 1,
      firstTry: firstTry ? now.firstTry + 1 : now.firstTry,
      sonar: sonar ? now.sonar + 1 : now.sonar,
      solved: ok ? [...now.solved, q.id] : now.solved,
      fails: ok ? now.fails : { ...now.fails, [q.id]: fails + 1 },
      discarded: ok ? now.discarded : { ...now.discarded, [q.id]: [...(now.discarded[q.id] ?? []), now.selected] },
      notice: ok ? [t.live.ok(points), sonar ? t.live.okSonar : ''].filter(Boolean).join(' ') : t.live.ko
    });

    const deliver = () => onResult?.({ result: ok, question: q.id, streak, attempts: fails + 1, points });

    // Sin movimiento no hay espera, pero se deja un instante para que el foco llegue al botón antes del modal de la página
    defer(() => (canAnimate ? deliver() : void setTimeout(deliver, 60)), ok);
  };

  /** Tras comprobar: a apuntar (acierto) o a reintentar la misma pregunta (fallo). */
  const afterCheck = () => {
    flush(); // Si aún esperaba entregar el resultado, se entrega ya

    const now = stateRef.current;

    if (now.phase !== 'checked' || !now.last) return;

    if (now.last.ok) {
      patch({ phase: 'aim', pingMode: false, notice: t.live.aim });
      return;
    }

    onReset?.();
    patch({ phase: 'question', selected: null, last: null, notice: '' });
  };

  /** El proyectil ya llegó (o no hay animación): se resuelve el disparo. */
  const land = (id: number) => {
    const now = stateRef.current;
    const cell = now.cells[id];

    if (!cell || landed.current === now.shots || (now.phase !== 'firing' && now.phase !== 'aim')) return;

    landed.current = now.shots;

    let cells = withCell(now.cells, id, { status: 'miss' });
    let kind: 'miss' | 'hit' | 'sunk' = 'miss';
    let length = 0;
    let points = 0;
    let fleetDown = false;

    if (cell.ship !== null) {
      const ship = now.ships[cell.ship];

      cells = withCell(now.cells, id, { status: 'hit' });

      const sunk = ship.cells.every((c) => cells[c].status === 'hit');

      if (sunk) {
        cells = cells.map((c) => (ship.cells.includes(c.id) ? { ...c, status: 'sunk' } : c));
        fleetDown = now.ships.every((s) => s.cells.every((c) => cells[c].status === 'sunk'));
      }

      kind = sunk ? 'sunk' : 'hit';
      length = sunk ? ship.size : 0;
      points = SCORE.hit + (sunk ? SCORE.sunk : 0) + (fleetDown ? SCORE.fleet : 0);
    }

    const again = kind !== 'miss' && !(fleetDown && now.solved.length === total);
    const notice = {
      miss: t.live.miss,
      hit: again ? t.live.hit : t.live.hitLast,
      sunk: t.live.sunk(length, points)
    }[kind];

    patch({
      phase: 'shot',
      cells,
      target: null,
      shot: { n: (now.shot?.n ?? 0) + 1, id, kind, size: length, points, fleet: fleetDown, again },
      score: now.score + points,
      shots: now.shots + 1,
      hits: kind === 'miss' ? now.hits : now.hits + 1,
      shipsSunk: kind === 'sunk' ? now.shipsSunk + 1 : now.shipsSunk,
      fleetsSunk: fleetDown ? now.fleetsSunk + 1 : now.fleetsSunk,
      notice: fleetDown ? `${notice} ${t.live.fleet}` : notice
    });
  };

  const ping = (id: number) => {
    const now = stateRef.current;

    if (now.cells[id].ping !== null) {
      patch({ notice: t.live.pingTaken });
      return;
    }

    const near = nearShips(now.cells, id, side);

    patch({
      cells: withCell(now.cells, id, { ping: near }),
      sonar: now.sonar - 1,
      pingMode: false,
      ping: { n: (now.ping?.n ?? 0) + 1, id, near },
      notice: t.live.pinged(near)
    });
  };

  const press = (id: number) => {
    const now = stateRef.current;
    const cell = now.cells[id];

    if (now.phase !== 'aim' || !cell) return;

    if (cell.status !== 'water') {
      patch({ notice: t.live.shotTaken });
      return;
    }

    if (now.pingMode) {
      ping(id);
      return;
    }

    if (!canAnimate) {
      land(id);
      return;
    }

    patch({ phase: 'firing', target: id, notice: t.live.firing(cell.row + 1, cell.col + 1) });
  };

  const toggleSonar = () => {
    const now = stateRef.current;

    if (now.phase !== 'aim' || (!now.pingMode && !now.sonar)) return;

    patch({ pingMode: !now.pingMode, notice: t.live.mode(!now.pingMode) });
  };

  /** Tras el disparo: otro disparo si tocaste; si no, la siguiente pregunta o los resultados. */
  const afterShot = () => {
    const now = stateRef.current;

    if (now.phase !== 'shot' || !now.shot) return;

    if (now.shot.again) {
      // Si cayó toda la flota, llega otra nueva antes del siguiente disparo
      patch({ phase: 'aim', pingMode: false, notice: t.live.aim, ...(now.shot.fleet ? createBoard(side, ships) : {}) });
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
        shots: now.shots,
        hits: now.hits,
        shipsSunk: now.shipsSunk,
        fleetsSunk: now.fleetsSunk
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
    landed.current = -1;
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
      } else {
        gsap.fromTo(verdict, { x: -10 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.25)' });
      }

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [state.last, canAnimate] }
  );

  // El proyectil sale del borde de abajo del mar, vuela en arco hasta la casilla y entonces se resuelve el disparo
  useGSAP(
    () => {
      const fx = fxRef.current;
      const field = fieldRef.current;
      const id = state.target;
      const target = id !== null ? cellEl(id) : null;

      if (id === null) return;

      if (!canAnimate || !fx || !field || !target) {
        land(id); // Sin movimiento (o si cambió a mitad de vuelo) no hay nada que esperar
        return;
      }

      const box = fx.getBoundingClientRect();
      const to = centerIn(target.getBoundingClientRect(), box);
      const rect = field.getBoundingClientRect();
      const from = { x: rect.left - box.left + rect.width / 2, y: rect.bottom - box.top + 24 };
      const height = Math.max(70, Math.abs(from.y - to.y) * 0.45);
      const ball = document.createElement('span');
      const progress = { k: 0 };

      ball.className = css.ball;
      fx.appendChild(ball);
      gsap.set(ball, { xPercent: -50, yPercent: -50 });

      const tween = gsap.to(progress, {
        k: 1,
        duration: FLIGHT,
        ease: 'power1.in',
        onUpdate: () => {
          const { k } = progress;

          gsap.set(ball, {
            x: from.x + (to.x - from.x) * k,
            y: from.y + (to.y - from.y) * k - 4 * height * k * (1 - k),
            scale: 0.8 + Math.sin(Math.PI * k) * 0.7,
            rotation: k * 360
          });
        },
        onComplete: () => {
          ball.remove();
          land(id);
        }
      });

      return () => {
        tween.kill();
        ball.remove();
      };
    },
    { scope: rootRef, dependencies: [state.target, canAnimate] }
  );

  // Impacto: chapoteo en el agua, estallido en el barco (más grande si se hunde) y los puntos que suben
  useGSAP(
    () => {
      const fx = fxRef.current;
      const shot = state.shot;
      const target = shot ? cellEl(shot.id) : null;

      if (!shot || !canAnimate || !fx || !target || stateRef.current.phase !== 'shot') return;

      const at = centerIn(target.getBoundingClientRect(), fx.getBoundingClientRect());

      if (shot.kind === 'miss') {
        ring(fx, at, css.ring, '#bfe8ff', 0.55);
        burst(fx, at, {
          className: css.spark,
          colors: SPLASH_COLORS,
          shapes: DROP_SHAPES,
          count: 12,
          reach: [25, 70],
          size: [5, 9],
          gravity: 34
        });
      } else {
        const sunk = shot.kind === 'sunk';

        ring(fx, at, css.ring, '#ff8a3d', 1);
        if (sunk) ring(fx, at, css.ring, '#ffc933', 1);
        burst(fx, at, {
          className: css.spark,
          colors: HIT_COLORS,
          shapes: CONFETTI_SHAPES,
          count: sunk ? 34 : 20,
          reach: [40, sunk ? 150 : 110],
          size: [6, 12],
          gravity: 50
        });
        gsap.fromTo(fieldRef.current, { x: sunk ? -9 : -6 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.25)' });
      }

      if (shot.points) {
        const float = document.createElement('span');

        float.className = css.float;
        float.textContent = `+${shot.points}`;
        fx.appendChild(float);
        gsap.fromTo(
          float,
          { x: at.x, y: at.y - 10, xPercent: -50, yPercent: -50, scale: 0.6, opacity: 1 },
          { y: at.y - 70, scale: 1.2, opacity: 0, duration: 1.1, ease: 'power2.out', onComplete: () => float.remove() }
        );
      }

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [state.shot, canAnimate] }
  );

  // Sonar: aro verde en la casilla escaneada
  useGSAP(
    () => {
      const fx = fxRef.current;
      const sonar = state.ping;
      const target = sonar ? cellEl(sonar.id) : null;

      if (!sonar || !canAnimate || !fx || !target) return;

      ring(fx, centerIn(target.getBoundingClientRect(), fx.getBoundingClientRect()), css.ring, '#7fe3c8', 1);

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [state.ping, canAnimate] }
  );

  // El foco acompaña a la fase: la pregunta, el botón de seguir, el mar (la casilla del último disparo) o los resultados
  useEffect(() => {
    const before = prevPhase.current;

    prevPhase.current = state.phase;

    if (!moved.current) {
      moved.current = true;
      return;
    }

    const frame = requestAnimationFrame(() => {
      if (state.phase === 'aim') {
        const back = before === 'shot' && state.shot ? cellEl(state.shot.id) : null;

        focusInView(
          back ?? rootRef.current?.querySelector<HTMLElement>('[data-cell]:is([data-view="water"], [data-view="ping"])')
        );
        return;
      }

      const target = { question: headingRef, checked: nextRef, shot: nextRef, done: summaryRef }[
        state.phase as 'question' | 'checked' | 'shot' | 'done'
      ];

      focusInView(target?.current);
    });

    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  if (!total || !item) return null;

  const { phase } = state;
  const summary: NavalSummary = {
    score: state.score,
    total,
    firstTry: state.firstTry,
    bestStreak: state.bestStreak,
    attempts: state.attempts,
    shots: state.shots,
    hits: state.hits,
    shipsSunk: state.shipsSunk,
    fleetsSunk: state.fleetsSunk
  };

  const hud = [
    { id: 'score', label: t.hud.score, icon: 'star' as const, value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame' as const, value: state.streak },
    { id: 'sonar', label: t.hud.sonar, icon: 'radar' as const, value: state.sonar },
    { id: 'solved', label: t.hud.solved, icon: 'check' as const, value: `${state.solved.length}/${total}` }
  ];

  return (
    <div ref={rootRef} className={`${css.naval} ${addClass ?? ''}`} data-phase={phase}>
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
            <NavalIcon name={icon} className={css['hud-icon']} />
            <span className={css['hud-label']}>{label}</span>
            <span className={css['hud-value']}>{value}</span>
          </li>
        ))}
      </ul>

      <div className={css.play}>
        <div className={css['field-wrap']}>
          <div className={css.toolbar}>
            <span className={css.counter}>
              <NavalIcon name="ship" />
              {t.fleetLeft(shipsLeft)}
            </span>

            <button
              type="button"
              className={css.tool}
              aria-pressed={state.pingMode}
              disabled={phase !== 'aim' || (!state.pingMode && !state.sonar)}
              onClick={toggleSonar}
            >
              <NavalIcon name="radar" />
              {t.sonarMode}
            </button>
          </div>

          <div ref={fieldRef}>
            <NavalBoard cells={state.cells} size={side} interactive={phase === 'aim'} onPress={press} />
          </div>
        </div>

        <div className={css.side}>
          {(phase === 'question' || phase === 'checked') && (
            <NavalCard
              question={item}
              number={state.at + 1}
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
          )}

          {(phase === 'aim' || phase === 'firing') && <NavalGuide pingMode={state.pingMode} ping={state.ping} />}

          {phase === 'shot' && state.shot && (
            <NavalShotCard
              shot={state.shot}
              finishing={state.solved.length === total}
              nextRef={nextRef}
              onNext={afterShot}
            />
          )}

          {phase === 'done' && <NavalSummaryCard summary={summary} headingRef={summaryRef} onRestart={restart} />}
        </div>
      </div>

      <ol className={css.track} aria-label={t.track.label}>
        {questions.map((q, i) => (
          <li key={q.id} className={css['track-item']} data-state={stateOf(q)}>
            <span aria-hidden="true">{stateOf(q) === 'solved' ? <NavalIcon name="check" /> : i + 1}</span>
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

GameNavalBattle.Init = NavalInit;

export { GameNavalBattle };
