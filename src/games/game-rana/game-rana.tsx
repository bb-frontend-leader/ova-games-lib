import { useEffect, useReducer, useRef } from 'react';
import gsap from 'gsap';

import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import {
  BOUNCE_COLORS,
  FX_COLORS,
  GLINT_COLORS,
  HOLE_IDS,
  HOLES,
  i18n,
  MAX_STEADY,
  SCORE,
  STREAK_STEADY
} from './lib/constant';
import { chanceOf, HAND, HOLE_AT, targetOf } from './lib/layout';
import { RanaAim } from './rana-aim';
import { RanaCard } from './rana-card';
import { RanaIcon } from './rana-icons';
import { RanaInit } from './rana-init';
import { RanaResultCard } from './rana-result';
import { RanaStage } from './rana-stage';
import { RanaSummaryCard } from './rana-summary';

import type { HoleId, Phase, RanaQuestion, RanaResult, RanaSummary, State } from './types/types';

import css from './game-rana.module.css';

/** Por dónde sale la moneda que no entra: un poco más abajo del borde inferior del escenario. */
const VIEW_BOTTOM = 430;

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];

const shuffled = (question: RanaQuestion) => gsap.utils.shuffle(question.answers.map((_, k) => k));

/** Hoyo doble del próximo turno: distinto del anterior, para que haya que volver a decidir. */
const pickHot = (previous?: HoleId) => gsap.utils.random(HOLE_IDS.filter((id) => id !== previous)) as HoleId;

interface Props {
  /** Las preguntas: cada acierto da una moneda. Pásalas como constante: no cambian mientras se juega. */
  questions: RanaQuestion[];
  /** Se llama un instante después de comprobar, para que se vea el veredicto antes de abrir la retroalimentación. */
  onResult?: (result: RanaResult) => void;
  /** Se llama al reintentar una pregunta tras un fallo (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al abrir los resultados, cuando todas las preguntas están acertadas y se lanzó la última moneda. */
  onFinish?: (summary: RanaSummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof RanaInit;
};

/**
 * Rana con preguntas: cada pregunta acertada da una moneda para lanzar a la mesa de rana, vista de frente.
 *
 * - Fallar descarta la respuesta y hay que reintentar: sin acierto no hay moneda.
 * - Con la moneda se elige el hoyo (tocándolo en la mesa o en la lista): la rana da más puntos que el molino, el
 *   puente, la tortuga o los hoyos, pero es más difícil que la moneda entre. Las probabilidades se ven antes de lanzar.
 * - En cada turno un hoyo vale el doble. La racha y la mano firme suben la probabilidad.
 * - Termina cuando todas las preguntas están acertadas y se lanzó la última moneda.
 */
const GameRana: React.FC<Props> & SubComponents = ({ questions, onResult, onReset, onFinish, addClass }) => {
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
      throws: 0,
      scored: 0,
      ranas: 0,
      hots: 0,
      combo: 0,
      bestCombo: 0,
      steady: 0,
      steadyOn: false,
      aim: 'tortuga',
      hot: pickHot(),
      last: null,
      launch: null,
      shot: null,
      launches: 0,
      notice: ''
    };
  };

  const [state, patch] = useReducer((prev: State, next: Partial<State>) => ({ ...prev, ...next }), null, createState);
  const stateRef = useRef(state); // Los callbacks leen el estado de ahora, no el de cuando se programaron
  stateRef.current = state;

  const rootRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const aimRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // El foco solo se mueve cuando la fase cambia por una acción, no al montar
  const landed = useRef(-1); // Última moneda ya resuelta: evita resolverla dos veces si el efecto se repite

  const item = questions[state.queue[state.at]] as RanaQuestion | undefined;
  const stateOf = (q: RanaQuestion) =>
    state.solved.includes(q.id) ? 'solved' : state.fails[q.id] ? 'review' : 'pending';

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
    const steady = ok && streak % STREAK_STEADY === 0 && now.steady < MAX_STEADY;

    patch({
      phase: 'checked',
      last: { ok, firstTry, points, steady },
      score: now.score + points,
      streak,
      bestStreak: Math.max(now.bestStreak, streak),
      attempts: now.attempts + 1,
      firstTry: firstTry ? now.firstTry + 1 : now.firstTry,
      steady: steady ? now.steady + 1 : now.steady,
      solved: ok ? [...now.solved, q.id] : now.solved,
      fails: ok ? now.fails : { ...now.fails, [q.id]: fails + 1 },
      discarded: ok ? now.discarded : { ...now.discarded, [q.id]: [...(now.discarded[q.id] ?? []), now.selected] },
      notice: ok ? [t.live.ok(points), steady ? t.live.okSteady : ''].filter(Boolean).join(' ') : t.live.ko
    });

    const deliver = () => onResult?.({ result: ok, question: q.id, streak, attempts: fails + 1, points });

    // Sin movimiento no hay espera, pero se deja un instante para que el foco llegue al botón antes del modal de la página
    defer(() => (canAnimate ? deliver() : void setTimeout(deliver, 60)), ok);
  };

  /** Tras comprobar: a tomar la moneda (acierto) o a reintentar la misma pregunta (fallo). */
  const afterCheck = () => {
    flush(); // Si aún esperaba entregar el resultado, se entrega ya

    const now = stateRef.current;

    if (now.phase !== 'checked' || !now.last) return;

    if (now.last.ok) {
      patch({ phase: 'aim', steadyOn: false, notice: t.live.aim(t.holes[now.hot]) });
      return;
    }

    onReset?.();
    patch({ phase: 'question', selected: null, last: null, notice: '' });
  };

  const pick = (hole: HoleId) => {
    const now = stateRef.current;

    if (now.phase !== 'aim') return;

    patch({
      aim: hole,
      notice: t.live.picked(
        t.holes[hole],
        HOLES[hole].points * (hole === now.hot ? SCORE.hot : 1),
        chanceOf(hole, now.streak, now.steadyOn)
      )
    });
  };

  const toggleSteady = () => {
    const now = stateRef.current;

    if (now.phase !== 'aim' || (!now.steadyOn && !now.steady)) return;

    patch({ steadyOn: !now.steadyOn, notice: t.live.mode(!now.steadyOn) });
  };

  /** Lanzar: el azar se decide aquí con la probabilidad que se veía; la animación solo lo cuenta. */
  const throwCoin = () => {
    const now = stateRef.current;

    if (now.phase !== 'aim') return;

    const chance = chanceOf(now.aim, now.streak, now.steadyOn);

    patch({
      phase: 'throwing',
      launch: {
        id: now.launches + 1,
        hole: now.aim,
        hit: Math.random() < chance,
        chance,
        slot: gsap.utils.random(0, 4, 1)
      },
      launches: now.launches + 1,
      steady: now.steadyOn ? now.steady - 1 : now.steady,
      steadyOn: false,
      notice: t.live.throwing
    });
  };

  /** La moneda ya cayó (o no hay animación): se cuenta si entró. */
  const land = () => {
    const now = stateRef.current;
    const launch = now.launch;

    if (now.phase !== 'throwing' || !launch || landed.current === launch.id) return;

    landed.current = launch.id;

    const { hole, hit, chance } = launch;
    const hot = hole === now.hot;
    const combo = hit ? now.combo + 1 : 0;
    const points = hit ? HOLES[hole].points * (hot ? SCORE.hot : 1) + Math.min(combo, SCORE.comboCap) * SCORE.combo : 0;

    patch({
      phase: 'result',
      launch: null,
      shot: { n: launch.id, hole, hit, hot, chance, points, combo },
      score: now.score + points,
      throws: now.throws + 1,
      scored: hit ? now.scored + 1 : now.scored,
      ranas: hit && hole === 'rana' ? now.ranas + 1 : now.ranas,
      hots: hit && hot ? now.hots + 1 : now.hots,
      combo,
      bestCombo: Math.max(now.bestCombo, combo),
      notice: hit ? t.live.hit(t.holes[hole], points) : t.live.miss(t.holes[hole])
    });
  };

  /** Tras el lanzamiento: la siguiente pregunta o los resultados. */
  const afterResult = () => {
    const now = stateRef.current;

    if (now.phase !== 'result') return;

    if (now.solved.length === total) {
      patch({ phase: 'done', notice: '' });
      onFinish?.({
        score: now.score,
        total,
        firstTry: now.firstTry,
        bestStreak: now.bestStreak,
        attempts: now.attempts,
        throws: now.throws,
        scored: now.scored,
        ranas: now.ranas,
        hots: now.hots,
        bestCombo: now.bestCombo
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
      shot: null,
      hot: pickHot(now.hot),
      notice: t.live.question(at + 1)
    });
  };

  const restart = () => {
    flush();
    landed.current = -1;
    patch(createState());
  };

  // Elegir el hoyo tocándolo en la mesa: equivale a marcarlo en la lista
  useEffect(() => {
    const svg = svgRef.current;

    if (!svg) return;

    const onClick = (event: MouseEvent) => {
      const art = (event.target as Element).closest<SVGElement>('[data-hole-art]');

      if (art && stateRef.current.phase === 'aim') pick(art.dataset.holeArt as HoleId);
    };

    svg.addEventListener('click', onClick);

    return () => svg.removeEventListener('click', onClick);
    // `pick` solo lee `stateRef` y el idioma, que cambia sin remontar el escenario
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // Acierto: aro y confeti desde el veredicto. Fallo: temblor.
  useGSAP(
    () => {
      const fx = fxRef.current;
      const verdict = verdictRef.current;
      const last = state.last;

      if (!last || !canAnimate || !fx || !verdict) return;

      if (last.ok) {
        const at = centerIn(verdict.getBoundingClientRect(), fx.getBoundingClientRect());

        ring(fx, at, css.ring, '#fcd116', 0.5);
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

  // El lanzamiento: la moneda sube y se aleja hasta el hoyo; si entra se hunde, y si no, rebota y se cae de la mesa
  useGSAP(
    () => {
      const launch = state.launch;

      if (!launch) return;

      const coin = rootRef.current?.querySelector<SVGGElement>('[data-coin]');
      const mouth = rootRef.current?.querySelector<SVGGElement>('[data-mouth]');

      if (!canAnimate || !coin) {
        land(); // Sin movimiento (o si falta el dibujo) no hay nada que esperar
        return;
      }

      const to = targetOf(launch.hole, launch.slot);
      const from: { x: number; y: number } = { x: HAND.x, y: HAND.y - 12 };
      const flight = { s: 0, x: from.x, y: from.y, scale: 1.3, spin: 0 };
      const place = () =>
        coin.setAttribute(
          'transform',
          `translate(${flight.x.toFixed(1)} ${flight.y.toFixed(1)}) rotate(${flight.spin.toFixed(0)}) scale(${flight.scale.toFixed(3)})`
        );

      place();

      const tl = gsap.timeline({ onComplete: land });

      // Vuelo: sale rápido, sube en arco y se achica al alejarse de quien lanza
      tl.to(flight, {
        s: 1,
        duration: 0.95,
        ease: 'none',
        onUpdate: () => {
          const e = 1 - (1 - flight.s) ** 2;
          const h = Math.sin(Math.PI * flight.s);

          flight.x = from.x + (to.x - from.x) * e;
          flight.y = from.y + (to.y - from.y) * e - h * 70;
          flight.scale = (1.3 + (0.62 - 1.3) * e) * (1 + h * 0.25);
          flight.spin = flight.s * 540;
          place();
        }
      });

      if (launch.hit) {
        // Entra: la moneda se hunde en el hoyo (y la rana se la traga)
        tl.to(flight, {
          scale: 0,
          y: to.y + 4,
          duration: 0.2,
          ease: 'power2.in',
          onUpdate: place
        });

        if (launch.hole === 'rana' && mouth) {
          tl.fromTo(
            mouth,
            { scaleY: 1 },
            { scaleY: 0.35, duration: 0.14, yoyo: true, repeat: 3, transformOrigin: '50% 50%', ease: 'sine.inOut' },
            '<'
          );
        }
      } else {
        // No entra: da en el borde, rebota hacia arriba y rueda por la mesa hasta caer fuera
        const side = gsap.utils.random([-1, 1]) as number;

        tl.to(flight, {
          x: to.x + side * 38,
          y: to.y - 30,
          spin: `+=${side * 160}`,
          duration: 0.22,
          ease: 'power2.out',
          onUpdate: place
        }).to(flight, {
          x: to.x + side * 120,
          y: VIEW_BOTTOM,
          scale: 1,
          spin: `+=${side * 520}`,
          duration: 0.7,
          ease: 'power2.in',
          onUpdate: place
        });
      }

      return () => {
        tl.kill();
      };
    },
    { scope: rootRef, dependencies: [state.launch, canAnimate] }
  );

  // Resultado: destellos si entró (más si es la rana o el hoyo doble), chispas y «¡CLANC!» si rebotó, y los puntos
  useGSAP(
    () => {
      const fx = fxRef.current;
      const svg = svgRef.current;
      const shot = state.shot;

      if (!shot || !canAnimate || !fx || !svg || stateRef.current.phase !== 'result') return;

      const matrix = svg.getScreenCTM();
      const box = fx.getBoundingClientRect();

      if (!matrix) return;

      const at = (p: { x: number; y: number }) => {
        const point = new DOMPoint(p.x, p.y).matrixTransform(matrix);

        return { x: point.x - box.left, y: point.y - box.top };
      };
      const hole = at(shot.hole === 'hoyo' ? { x: 320, y: HOLE_AT.hoyo.y } : HOLE_AT[shot.hole]);

      if (shot.hit) {
        burst(fx, hole, {
          className: css.spark,
          colors: GLINT_COLORS,
          shapes: ['circle(50%)'],
          count: 14,
          reach: [24, 80],
          size: [5, 10],
          gravity: 10
        });
        ring(fx, hole, css.ring, '#7fe3a8', 0.6);

        if (shot.hole === 'rana' || shot.hot) {
          ring(fx, hole, css.ring, '#fcd116', 0.8);
          burst(fx, hole, {
            className: css.spark,
            colors: FX_COLORS,
            shapes: CONFETTI_SHAPES,
            count: 22,
            reach: [60, 140],
            size: [6, 12],
            gravity: 40
          });
        }
      } else {
        burst(fx, hole, {
          className: css.spark,
          colors: BOUNCE_COLORS,
          shapes: ['circle(50%)'],
          count: 10,
          reach: [20, 60],
          size: [4, 8],
          gravity: 30
        });
        gsap.fromTo(svg, { x: -4 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.25)' });

        const clang = document.createElement('span');

        clang.className = css.boom;
        clang.textContent = t.boom;
        fx.appendChild(clang);
        gsap.fromTo(
          clang,
          { x: hole.x, y: hole.y - 16, xPercent: -50, yPercent: -50, scale: 0.4, rotate: -8, opacity: 1 },
          {
            y: hole.y - 62,
            scale: 1.15,
            rotate: 5,
            opacity: 0,
            duration: 0.9,
            ease: 'power2.out',
            onComplete: () => clang.remove()
          }
        );
      }

      if (shot.points) {
        const float = document.createElement('span');

        float.className = css.float;
        float.textContent = `+${shot.points}`;
        fx.appendChild(float);
        gsap.fromTo(
          float,
          { x: hole.x, y: hole.y - 20, xPercent: -50, yPercent: -50, scale: 0.6, opacity: 1 },
          {
            y: hole.y - 80,
            scale: 1.2,
            opacity: 0,
            duration: 1.1,
            ease: 'power2.out',
            onComplete: () => float.remove()
          }
        );
      }

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [state.shot, canAnimate] }
  );

  // El foco acompaña a la fase: la pregunta, el botón de seguir, el hoyo elegido o los resultados
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }

    const frame = requestAnimationFrame(() => {
      const target = {
        question: headingRef,
        checked: nextRef,
        aim: aimRef,
        result: nextRef,
        done: summaryRef
      }[state.phase as Exclude<Phase, 'throwing'>];

      target?.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [state.phase]);

  if (!total || !item) return null;

  const { phase, shot } = state;
  const throwing = phase === 'throwing';
  const showShot = !!shot && (phase === 'result' || phase === 'done');
  const summary: RanaSummary = {
    score: state.score,
    total,
    firstTry: state.firstTry,
    bestStreak: state.bestStreak,
    attempts: state.attempts,
    throws: state.throws,
    scored: state.scored,
    ranas: state.ranas,
    hots: state.hots,
    bestCombo: state.bestCombo
  };
  const lastText = shot ? `${t.holes[shot.hole]}: ${shot.hit ? t.result.hit : t.result.miss}` : '';

  const hud = [
    { id: 'score', label: t.hud.score, icon: 'star' as const, value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame' as const, value: state.streak },
    { id: 'steady', label: t.hud.steady, icon: 'target' as const, value: state.steady },
    { id: 'scored', label: t.hud.scored, icon: 'disc' as const, value: `${state.scored}/${total}` }
  ];

  return (
    <div ref={rootRef} className={`${css.rana} ${addClass ?? ''}`} data-phase={phase}>
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
              <RanaIcon name={icon} className={css['hud-icon']} />
              <span className={css['hud-label']}>{label}</span>
              <span className={css['hud-value']}>{value}</span>
            </li>
          ))}
        </ul>

        <RanaStage
          svgRef={svgRef}
          label={t.stage(state.throws, t.holes[state.hot])}
          aim={phase === 'aim' ? state.aim : null}
          hot={state.hot}
          loaded={phase === 'aim'}
          flying={throwing}
          result={showShot ? { hole: shot.hole, hit: shot.hit } : null}
          roundKey={state.at}
        />
      </div>

      <div className={css.console}>
        {(phase === 'question' || phase === 'checked') && (
          <RanaCard
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

        {(phase === 'aim' || throwing) && (
          <RanaAim
            aim={state.aim}
            hot={state.hot}
            streak={state.streak}
            steady={state.steady}
            steadyOn={state.steadyOn}
            throwing={throwing}
            lastText={lastText}
            aimRef={aimRef}
            onPick={pick}
            onToggleSteady={toggleSteady}
            onThrow={throwCoin}
          />
        )}

        {phase === 'result' && shot && (
          <RanaResultCard
            shot={shot}
            finishing={state.solved.length === total}
            nextRef={nextRef}
            onNext={afterResult}
          />
        )}

        {phase === 'done' && <RanaSummaryCard summary={summary} headingRef={summaryRef} onRestart={restart} />}
      </div>

      <ol className={css.track} aria-label={t.track.label}>
        {questions.map((q, i) => (
          <li key={q.id} className={css['track-item']} data-state={stateOf(q)}>
            <span aria-hidden="true">{stateOf(q) === 'solved' ? <RanaIcon name="check" /> : i + 1}</span>
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

GameRana.Init = RanaInit;

export { GameRana };
