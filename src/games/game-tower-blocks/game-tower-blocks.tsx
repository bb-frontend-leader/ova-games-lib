import { useEffect, useReducer, useRef } from 'react';
import gsap from 'gsap';

import { burst, centerIn, focusInView, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import {
  AIM_RANGE,
  DUST_COLORS,
  FX_COLORS,
  GROW_EVERY,
  i18n,
  MAX_CALM,
  SCORE,
  SPARK_COLORS,
  STREAK_CALM,
  WINDS
} from './lib/constant';
import {
  BASE_WIDTH,
  cameraShift,
  colLeft,
  COLS,
  createBase,
  levelBottom,
  MAX_ROWS,
  resolveDrop,
  SKY_ROWS,
  widen
} from './lib/layout';
import { TowerAim } from './tower-aim';
import { TowerCard } from './tower-card';
import { TowerIcon } from './tower-icons';
import { TowerInit } from './tower-init';
import { TowerResultCard } from './tower-result';
import { TowerStage } from './tower-stage';
import { TowerSummaryCard } from './tower-summary';

import type { Phase, State, TowerQuestion, TowerResult, TowerSummary } from './types/types';

import css from './game-tower-blocks.module.css';

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];

/** Lo que tarda el bloque en caer sobre la torre (s). */
const FALL = 0.6;

const shuffled = (question: TowerQuestion) => gsap.utils.shuffle(question.answers.map((_, k) => k));
const pickWind = () => gsap.utils.random([...WINDS]) as number;

interface Props {
  /** Las preguntas: cada acierto da un bloque. Pásalas como constante: no cambian mientras se juega. */
  questions: TowerQuestion[];
  /** Se llama un instante después de comprobar, para que se vea el veredicto antes de abrir la retroalimentación. */
  onResult?: (result: TowerResult) => void;
  /** Se llama al reintentar una pregunta tras un fallo (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al abrir los resultados, cuando todas las preguntas están acertadas y se colocó el último bloque. */
  onFinish?: (summary: TowerSummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof TowerInit;
};

/**
 * Torre de bloques con preguntas: cada pregunta acertada da un bloque que se coloca con una grúa sobre la torre.
 *
 * - Fallar descarta la respuesta y hay que reintentar: sin acierto no hay bloque.
 * - El bloque cuelga de la grúa: se mueve con un deslizador y se suelta. El viento lo empuja mientras cae.
 * - Lo que sobresale de la torre se corta y el siguiente bloque es más estrecho; si cae del todo fuera, se pierde.
 * - Encajar justo da bonus; cada tres encajes seguidos la torre se ensancha una casilla.
 * - Cada tres aciertos seguidos se gana una carga de calma, que apaga el viento en un bloque.
 * - Termina cuando todas las preguntas están acertadas y se colocó el último bloque.
 */
const GameTowerBlocks: React.FC<Props> & SubComponents = ({ questions, onResult, onReset, onFinish, addClass }) => {
  const lang = useLang();
  const t = i18n[lang];

  const canAnimate = useCanAnimate();
  const { defer, flush } = useDeferredResult();
  const total = questions.length;
  const rows = Math.min(MAX_ROWS, total + SKY_ROWS);

  const createState = (): State => {
    const queue = gsap.utils.shuffle(questions.map((_, k) => k));

    return {
      phase: 'question',
      blocks: [createBase()],
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
      perfects: 0,
      combo: 0,
      bestCombo: 0,
      fallen: 0,
      calm: 0,
      calmOn: false,
      wind: 0,
      aim: 0,
      last: null,
      drop: null,
      target: null,
      drops: 0,
      notice: ''
    };
  };

  const [state, patch] = useReducer((prev: State, next: Partial<State>) => ({ ...prev, ...next }), null, createState);
  const stateRef = useRef(state); // Los callbacks leen el estado de ahora, no el de cuando se programaron
  stateRef.current = state;

  const rootRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // El foco solo se mueve cuando la fase cambia por una acción, no al montar
  const landed = useRef(-1); // Último bloque ya resuelto: evita resolverlo dos veces si el efecto se repite

  const item = questions[state.queue[state.at]] as TowerQuestion | undefined;
  const stateOf = (q: TowerQuestion) =>
    state.solved.includes(q.id) ? 'solved' : state.fails[q.id] ? 'review' : 'pending';
  const top = state.blocks[state.blocks.length - 1];
  const height = state.blocks.length - 1;

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
    const calm = ok && streak % STREAK_CALM === 0 && now.calm < MAX_CALM;

    patch({
      phase: 'checked',
      last: { ok, firstTry, points, calm },
      score: now.score + points,
      streak,
      bestStreak: Math.max(now.bestStreak, streak),
      attempts: now.attempts + 1,
      firstTry: firstTry ? now.firstTry + 1 : now.firstTry,
      calm: calm ? now.calm + 1 : now.calm,
      solved: ok ? [...now.solved, q.id] : now.solved,
      fails: ok ? now.fails : { ...now.fails, [q.id]: fails + 1 },
      discarded: ok ? now.discarded : { ...now.discarded, [q.id]: [...(now.discarded[q.id] ?? []), now.selected] },
      notice: ok ? [t.live.ok(points), calm ? t.live.okCalm : ''].filter(Boolean).join(' ') : t.live.ko
    });

    const deliver = () => onResult?.({ result: ok, question: q.id, streak, attempts: fails + 1, points });

    // Sin movimiento no hay espera, pero se deja un instante para que el foco llegue al botón antes del modal de la página
    defer(() => (canAnimate ? deliver() : void setTimeout(deliver, 60)), ok);
  };

  /** Tras comprobar: a colocar el bloque (acierto) o a reintentar la misma pregunta (fallo). */
  const afterCheck = () => {
    flush(); // Si aún esperaba entregar el resultado, se entrega ya

    const now = stateRef.current;

    if (now.phase !== 'checked' || !now.last) return;

    if (now.last.ok) {
      const wind = pickWind();

      patch({
        phase: 'aim',
        aim: 0,
        wind,
        calmOn: false,
        notice: t.live.aim(t.guide.wind(wind))
      });
      return;
    }

    onReset?.();
    patch({ phase: 'question', selected: null, last: null, notice: '' });
  };

  const setAim = (aim: number) => {
    const now = stateRef.current;

    if (now.phase !== 'aim') return;

    patch({ aim: Math.max(-AIM_RANGE, Math.min(AIM_RANGE, aim)) });
  };

  const toggleCalm = () => {
    const now = stateRef.current;

    if (now.phase !== 'aim' || (!now.calmOn && !now.calm)) return;

    patch({ calmOn: !now.calmOn, notice: t.live.mode(!now.calmOn) });
  };

  /** Soltar el bloque: cae con el viento que haga (o sin él, si la calma está activada). */
  const release = () => {
    const now = stateRef.current;

    if (now.phase !== 'aim') return;

    patch({
      phase: 'dropping',
      target: now.aim + (now.calmOn ? 0 : now.wind),
      drops: now.drops + 1,
      calm: now.calmOn ? now.calm - 1 : now.calm,
      calmOn: false,
      notice: t.live.dropping
    });
  };

  /** El bloque ya llegó (o no hay animación): se resuelve dónde queda. */
  const land = (offset: number) => {
    const now = stateRef.current;

    if (now.phase !== 'dropping' || landed.current === now.drops) return;

    landed.current = now.drops;

    const base = now.blocks[now.blocks.length - 1];
    const res = resolveDrop(base, offset);
    const level = now.blocks.length;
    let blocks = now.blocks;
    let combo = 0;
    let points = 0;
    let grew = false;
    let id: number | null = null;
    let width = 0;

    if (res.kind !== 'miss') {
      const perfect = res.kind === 'perfect';
      let { left } = res;

      width = res.width;
      combo = perfect ? now.combo + 1 : 0;

      if (perfect && combo % GROW_EVERY === 0 && width < BASE_WIDTH) {
        ({ left, width } = widen(left, width));
        grew = true;
      }

      id = level;
      blocks = [...now.blocks, { id, level, left, width, perfect }];
      points = perfect ? SCORE.perfect + Math.min(combo, SCORE.comboCap) * SCORE.combo : res.width * SCORE.block;
    }

    const notice = {
      perfect: t.live.perfect(points),
      partial: t.live.partial(res.cut, points),
      miss: t.live.miss
    }[res.kind];

    patch({
      phase: 'placed',
      blocks,
      target: null,
      drop: { n: (now.drop?.n ?? 0) + 1, kind: res.kind, level, id, offset, cut: res.cut, width, points, combo, grew },
      score: now.score + points,
      combo,
      bestCombo: Math.max(now.bestCombo, combo),
      perfects: res.kind === 'perfect' ? now.perfects + 1 : now.perfects,
      fallen: res.kind === 'miss' ? now.fallen + 1 : now.fallen,
      notice: grew ? `${notice} ${t.live.grew}` : notice
    });
  };

  /** Tras colocar el bloque: la siguiente pregunta o los resultados. */
  const afterPlaced = () => {
    const now = stateRef.current;

    if (now.phase !== 'placed') return;

    if (now.solved.length === total) {
      patch({ phase: 'done', notice: '' });
      onFinish?.({
        score: now.score,
        total,
        firstTry: now.firstTry,
        bestStreak: now.bestStreak,
        attempts: now.attempts,
        height: now.blocks.length - 1,
        perfects: now.perfects,
        bestCombo: now.bestCombo,
        fallen: now.fallen
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

  // El bloque cae desde la grúa: el viento lo empuja de lado mientras baja y, al llegar, se resuelve dónde queda
  useGSAP(
    () => {
      const offset = state.target;
      const carry = rootRef.current?.querySelector<HTMLElement>('[data-carry]');

      if (offset === null) return;

      if (!canAnimate || !carry) {
        land(offset); // Sin movimiento (o si cambió a mitad de caída) no hay nada que esperar
        return;
      }

      const { blocks } = stateRef.current;
      const base = blocks[blocks.length - 1];
      const shift = cameraShift(blocks.length - 1, rows);

      const tween = gsap.to(carry, {
        left: colLeft(base.left + offset),
        bottom: levelBottom(blocks.length, rows, shift),
        duration: FALL,
        ease: 'power2.in',
        onComplete: () => land(offset)
      });

      return () => {
        tween.kill();
      };
    },
    { scope: rootRef, dependencies: [state.target, canAnimate] }
  );

  // Impacto: polvo, el trozo cortado que cae, chispas si encajó justo y la torre que se tambalea
  useGSAP(
    () => {
      const fx = fxRef.current;
      const layer = layerRef.current;
      const drop = state.drop;

      if (!drop || !canAnimate || !fx || !layer || stateRef.current.phase !== 'placed') return;

      const { blocks } = stateRef.current;
      const below = blocks[drop.level - 1];
      const shift = cameraShift(blocks.length - 1, rows);
      const box = fx.getBoundingClientRect();
      const area = layer.getBoundingClientRect();
      const unit = area.width / COLS;
      const rowPx = area.height / rows;
      const topY = area.top - box.top + area.height * (1 - (drop.level - shift + 1) / rows);
      const lefts = area.left - box.left;

      const piece = (left: number, width: number) => {
        const el = document.createElement('span');

        el.className = css.piece;
        el.dataset.c = String(drop.level % 6);
        el.style.width = `${width * unit}px`;
        el.style.height = `${rowPx}px`;
        fx.appendChild(el);
        gsap.set(el, { x: lefts + left * unit, y: topY });
        gsap.to(el, {
          y: topY + area.height * 0.85,
          x: `+=${drop.offset > 0 ? 24 : -24}`,
          rotation: drop.offset > 0 ? 55 : -55,
          opacity: 0,
          duration: 0.9,
          ease: 'power2.in',
          onComplete: () => el.remove()
        });
      };

      // Lo que sobresale (o el bloque entero si cayó fuera) se cae de la torre
      if (drop.kind === 'miss') piece(below.left + drop.offset, below.width);
      else if (drop.kind === 'partial') {
        piece(drop.offset > 0 ? below.left + below.width : below.left + drop.offset, drop.cut);
      }

      const landed = drop.id !== null ? blocks[drop.id] : null;
      const at = landed
        ? { x: lefts + (landed.left + landed.width / 2) * unit, y: topY + rowPx }
        : { x: lefts + (below.left + drop.offset + below.width / 2) * unit, y: topY + rowPx };

      burst(fx, at, {
        className: css.spark,
        colors: DUST_COLORS,
        shapes: ['circle(50%)'],
        count: drop.kind === 'miss' ? 6 : 10,
        reach: [20, 60],
        size: [5, 10],
        gravity: -6
      });

      if (drop.kind === 'perfect') {
        ring(fx, { x: at.x, y: at.y - rowPx / 2 }, css.ring, '#ffe066', 0.6);
        burst(
          fx,
          { x: at.x, y: at.y - rowPx / 2 },
          {
            className: css.spark,
            colors: SPARK_COLORS,
            shapes: CONFETTI_SHAPES,
            count: 14,
            reach: [40, 100],
            size: [5, 9],
            gravity: 30
          }
        );
      }

      // La torre se tambalea más cuanto más se salió el bloque
      gsap.fromTo(
        layer,
        { rotation: drop.kind === 'perfect' ? 0.6 : drop.cut > 1 ? 2.4 : 1.4, transformOrigin: '50% 100%' },
        { rotation: 0, duration: 0.9, ease: 'elastic.out(1, 0.2)' }
      );

      if (drop.points) {
        const float = document.createElement('span');

        float.className = css.float;
        float.textContent = `+${drop.points}`;
        fx.appendChild(float);
        gsap.fromTo(
          float,
          { x: at.x, y: topY - 6, xPercent: -50, yPercent: -50, scale: 0.6, opacity: 1 },
          { y: topY - 66, scale: 1.2, opacity: 0, duration: 1.1, ease: 'power2.out', onComplete: () => float.remove() }
        );
      }

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [state.drop, canAnimate] }
  );

  // El foco acompaña a la fase: la pregunta, el botón de seguir, el control de la grúa o los resultados
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
        placed: nextRef,
        done: summaryRef
      }[state.phase as Exclude<Phase, 'dropping'>];

      focusInView(target?.current);
    });

    return () => cancelAnimationFrame(frame);
  }, [state.phase]);

  if (!total || !item) return null;

  const { phase } = state;
  const hanging = phase === 'aim' || phase === 'dropping';
  const summary: TowerSummary = {
    score: state.score,
    total,
    firstTry: state.firstTry,
    bestStreak: state.bestStreak,
    attempts: state.attempts,
    height,
    perfects: state.perfects,
    bestCombo: state.bestCombo,
    fallen: state.fallen
  };

  const hud = [
    { id: 'score', label: t.hud.score, icon: 'star' as const, value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame' as const, value: state.streak },
    { id: 'calm', label: t.hud.calm, icon: 'wind' as const, value: state.calm },
    { id: 'solved', label: t.hud.solved, icon: 'check' as const, value: `${state.solved.length}/${total}` }
  ];

  return (
    <div ref={rootRef} className={`${css.tower} ${addClass ?? ''}`} data-phase={phase}>
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
            <TowerIcon name={icon} className={css['hud-icon']} />
            <span className={css['hud-label']}>{label}</span>
            <span className={css['hud-value']}>{value}</span>
          </li>
        ))}
      </ul>

      <div className={css.play}>
        <div className={css['field-wrap']}>
          <div className={css.toolbar}>
            <span className={css.counter}>
              <TowerIcon name="tower" />
              {t.height(height)}
            </span>

            <button
              type="button"
              className={css.tool}
              aria-pressed={state.calmOn}
              disabled={phase !== 'aim' || (!state.calmOn && !state.calm)}
              onClick={toggleCalm}
            >
              <TowerIcon name="wind" />
              {t.calmMode}
            </button>
          </div>

          <TowerStage
            blocks={state.blocks}
            rows={rows}
            label={t.stage(height)}
            carry={hanging ? { offset: state.aim, width: top.width } : null}
            wind={hanging ? (state.calmOn ? 0 : state.wind) : null}
            freshId={phase === 'placed' ? (state.drop?.id ?? null) : null}
            layerRef={layerRef}
          />
        </div>

        <div className={css.side}>
          {(phase === 'question' || phase === 'checked') && (
            <TowerCard
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

          {hanging && (
            <TowerAim
              aim={state.aim}
              wind={state.wind}
              calmOn={state.calmOn}
              dropping={phase === 'dropping'}
              rangeRef={rangeRef}
              onAim={setAim}
              onDrop={release}
            />
          )}

          {phase === 'placed' && state.drop && (
            <TowerResultCard
              drop={state.drop}
              finishing={state.solved.length === total}
              nextRef={nextRef}
              onNext={afterPlaced}
            />
          )}

          {phase === 'done' && <TowerSummaryCard summary={summary} headingRef={summaryRef} onRestart={restart} />}
        </div>
      </div>

      <ol className={css.track} aria-label={t.track.label}>
        {questions.map((q, i) => (
          <li key={q.id} className={css['track-item']} data-state={stateOf(q)}>
            <span aria-hidden="true">{stateOf(q) === 'solved' ? <TowerIcon name="check" /> : i + 1}</span>
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

GameTowerBlocks.Init = TowerInit;

export { GameTowerBlocks };
