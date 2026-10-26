import { useEffect, useReducer, useRef } from 'react';
import gsap from 'gsap';

import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import {
  BLAST_COLORS,
  DEBRIS_COLORS,
  FX_COLORS,
  i18n,
  MAX_STEADY,
  SCORE,
  SPOTS,
  STREAK_STEADY,
  WOBBLE
} from './lib/constant';
import { aimPercent, aimPoint, burntMechas, HAND, landing, mechaPoints, resolveThrow, spotPoint } from './lib/layout';
import { TejoAim } from './tejo-aim';
import { TejoCard } from './tejo-card';
import { TejoIcon } from './tejo-icons';
import { TejoInit } from './tejo-init';
import { TejoResultCard } from './tejo-result';
import { TejoStage } from './tejo-stage';
import { TejoSummaryCard } from './tejo-summary';

import type { Phase, Point, State, TejoQuestion, TejoResult, TejoSummary, ThrowKind } from './types/types';

import css from './game-tejo.module.css';

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];

const shuffled = (question: TejoQuestion) => gsap.utils.shuffle(question.answers.map((_, k) => k));

/** Sitio del próximo bocín: distinto del anterior, para que haya que volver a apuntar. */
const pickSpot = (previous?: number) =>
  gsap.utils.random(SPOTS.map((_, k) => k).filter((k) => k !== previous)) as number;

/** Puntos base según dónde cae el tejo. */
const BASE: Record<ThrowKind, number> = {
  monona: SCORE.monona,
  embocinada: SCORE.embocinada,
  mecha: SCORE.mecha,
  mano: SCORE.mano,
  clay: 0,
  out: 0
};

interface Props {
  /** Las preguntas: cada acierto da un tejo. Pásalas como constante: no cambian mientras se juega. */
  questions: TejoQuestion[];
  /** Se llama un instante después de comprobar, para que se vea el veredicto antes de abrir la retroalimentación. */
  onResult?: (result: TejoResult) => void;
  /** Se llama al reintentar una pregunta tras un fallo (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al abrir los resultados, cuando todas las preguntas están acertadas y se lanzó el último tejo. */
  onFinish?: (summary: TejoSummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof TejoInit;
};

/**
 * Tejo con preguntas: cada pregunta acertada da un tejo para lanzar a la caja de arcilla, vista desde arriba.
 *
 * - Fallar descarta la respuesta y hay que reintentar: sin acierto no hay tejo.
 * - Con el tejo se elige dónde cae (tocando la arcilla o con los deslizadores). El bocín cambia de sitio en cada
 *   pregunta y el tejo siempre se desvía un poco: el círculo punteado de la mira muestra cuánto.
 * - Embocinar, reventar una mecha o quedar cerca del bocín (la «mano») da puntos; una moñona (embocinar y reventar una
 *   mecha a la vez) da más, y encadenar tejos que puntúan suma un extra.
 * - Cada tres aciertos seguidos se gana un pulso firme: el tejo casi no se desvía.
 * - Termina cuando todas las preguntas están acertadas y se lanzó el último tejo.
 */
const GameTejo: React.FC<Props> & SubComponents = ({ questions, onResult, onReset, onFinish, addClass }) => {
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
      bocines: 0,
      mechas: 0,
      combo: 0,
      bestCombo: 0,
      steady: 0,
      steadyOn: false,
      aimX: 50,
      aimY: 45,
      spot: pickSpot(),
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
  const xRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // El foco solo se mueve cuando la fase cambia por una acción, no al montar
  const landed = useRef(-1); // Último lanzamiento ya resuelto: evita resolverlo dos veces si el efecto se repite

  const item = questions[state.queue[state.at]] as TejoQuestion | undefined;
  const stateOf = (q: TejoQuestion) =>
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

  /** Tras comprobar: a tomar el tejo (acierto) o a reintentar la misma pregunta (fallo). */
  const afterCheck = () => {
    flush(); // Si aún esperaba entregar el resultado, se entrega ya

    const now = stateRef.current;

    if (now.phase !== 'checked' || !now.last) return;

    if (now.last.ok) {
      patch({ phase: 'aim', steadyOn: false, notice: t.live.aim });
      return;
    }

    onReset?.();
    patch({ phase: 'question', selected: null, last: null, notice: '' });
  };

  const setAim = (aimX: number, aimY: number) => {
    if (stateRef.current.phase !== 'aim') return;

    patch({ aimX: Math.max(0, Math.min(100, aimX)), aimY: Math.max(0, Math.min(100, aimY)) });
  };

  const toggleSteady = () => {
    const now = stateRef.current;

    if (now.phase !== 'aim' || (!now.steadyOn && !now.steady)) return;

    patch({ steadyOn: !now.steadyOn, notice: t.live.mode(!now.steadyOn) });
  };

  /** Lanzar: el punto de caída es el apuntado más el desvío al azar (casi nulo con pulso firme). */
  const throwDisc = () => {
    const now = stateRef.current;

    if (now.phase !== 'aim') return;

    const aim = aimPoint(now.aimX, now.aimY);

    patch({
      phase: 'throwing',
      launch: {
        id: now.launches + 1,
        aim,
        land: landing(aim, now.steadyOn, [Math.random(), Math.random()]),
        steady: now.steadyOn
      },
      launches: now.launches + 1,
      steady: now.steadyOn ? now.steady - 1 : now.steady,
      steadyOn: false,
      notice: t.live.throwing
    });
  };

  /** El tejo ya cayó (o no hay animación): se resuelve dónde quedó. */
  const land = () => {
    const now = stateRef.current;
    const launch = now.launch;

    if (now.phase !== 'throwing' || !launch || landed.current === launch.id) return;

    landed.current = launch.id;

    const { kind, cm } = resolveThrow(launch.land, spotPoint(now.spot));
    const good = BASE[kind] > 0;
    const combo = good ? now.combo + 1 : 0;
    const points = good ? BASE[kind] + Math.min(combo, SCORE.comboCap) * SCORE.combo : 0;
    const notice = {
      monona: t.live.monona(points),
      embocinada: t.live.embocinada(points),
      mecha: t.live.mecha(points),
      mano: t.live.mano(points),
      clay: t.live.clay(cm),
      out: t.live.out
    }[kind];

    patch({
      phase: 'result',
      launch: null,
      shot: { n: launch.id, aim: launch.aim, land: launch.land, steady: launch.steady, kind, cm, points, combo },
      score: now.score + points,
      throws: now.throws + 1,
      scored: good ? now.scored + 1 : now.scored,
      bocines: kind === 'monona' || kind === 'embocinada' ? now.bocines + 1 : now.bocines,
      mechas: kind === 'monona' || kind === 'mecha' ? now.mechas + 1 : now.mechas,
      combo,
      bestCombo: Math.max(now.bestCombo, combo),
      notice
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
        bocines: now.bocines,
        mechas: now.mechas,
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
      spot: pickSpot(now.spot),
      notice: t.live.question(at + 1)
    });
  };

  const restart = () => {
    flush();
    landed.current = -1;
    patch(createState());
  };

  // Apuntar tocando la arcilla (o arrastrando con el ratón): se traduce a los mismos porcentajes de los deslizadores
  useEffect(() => {
    const svg = svgRef.current;

    if (!svg) return;

    let dragging = false;

    const aimAt = (event: PointerEvent) => {
      const matrix = svg.getScreenCTM();

      if (!matrix || stateRef.current.phase !== 'aim') return;

      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());

      patch(aimPercent({ x: point.x, y: point.y }));
    };
    const down = (event: PointerEvent) => {
      if (stateRef.current.phase !== 'aim') return;

      dragging = true;
      svg.setPointerCapture(event.pointerId);
      aimAt(event);
    };
    const move = (event: PointerEvent) => {
      if (dragging) aimAt(event);
    };
    const up = (event: PointerEvent) => {
      dragging = false;

      if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
    };

    svg.addEventListener('pointerdown', down);
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', up);

    return () => {
      svg.removeEventListener('pointerdown', down);
      svg.removeEventListener('pointermove', move);
      svg.removeEventListener('pointerup', up);
      svg.removeEventListener('pointercancel', up);
    };
  }, []);

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

  // El lanzamiento: el tejo sale de la mano, sube y baja (crece y se achica) y su sombra recorre el suelo hasta caer
  useGSAP(
    () => {
      const launch = state.launch;

      if (!launch) return;

      const disc = rootRef.current?.querySelector<SVGGElement>('[data-disc]');
      const shadow = rootRef.current?.querySelector<SVGEllipseElement>('[data-shadow]');

      if (!canAnimate || !disc || !shadow) {
        land(); // Sin movimiento (o si falta el dibujo) no hay nada que esperar
        return;
      }

      const from: Point = { x: HAND.x, y: HAND.y - 6 };
      const flight = { s: 0 };
      const place = (s: number) => {
        const e = 1 - (1 - s) ** 2; // Sale rápido y llega frenando
        const h = Math.sin(Math.PI * s); // Altura: 0 en la mano y al caer, máxima a mitad de vuelo
        const x = from.x + (launch.land.x - from.x) * e;
        const y = from.y + (launch.land.y - from.y) * e;

        disc.setAttribute(
          'transform',
          `translate(${x.toFixed(1)} ${(y - h * 64).toFixed(1)}) rotate(${(s * 540).toFixed(0)}) scale(${(1 + h * 0.8).toFixed(3)})`
        );
        shadow.setAttribute(
          'transform',
          `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(1 - h * 0.25).toFixed(3)})`
        );
      };

      place(0);

      const tl = gsap.timeline({ onComplete: land });

      tl.to(flight, { s: 1, duration: 0.95, ease: 'none', onUpdate: () => place(flight.s) });

      return () => {
        tl.kill();
      };
    },
    { scope: rootRef, dependencies: [state.launch, canAnimate] }
  );

  // Impacto: polvo donde cae el tejo y, según dónde, estallido de mecha, aro dorado de embocinada y puntos
  useGSAP(
    () => {
      const fx = fxRef.current;
      const svg = svgRef.current;
      const shot = state.shot;

      if (!shot || !canAnimate || !fx || !svg || stateRef.current.phase !== 'result') return;

      const matrix = svg.getScreenCTM();
      const box = fx.getBoundingClientRect();

      if (!matrix) return;

      const toFx = (p: Point) => {
        const point = new DOMPoint(p.x, p.y).matrixTransform(matrix);

        return { x: point.x - box.left, y: point.y - box.top };
      };
      const center = spotPoint(stateRef.current.spot);
      const good = BASE[shot.kind] > 0;
      const blown = burntMechas(shot.kind, shot.land, center);
      const fuses = mechaPoints(center);

      burst(fx, toFx(shot.land), {
        className: css.spark,
        colors: DEBRIS_COLORS,
        shapes: ['circle(50%)'],
        count: good ? 10 : 8,
        reach: [14, 46],
        size: [5, 10],
        gravity: -6
      });

      if (blown.length) {
        blown.forEach((k) => {
          burst(fx, toFx(fuses[k]), {
            className: css.spark,
            colors: BLAST_COLORS,
            shapes: ['circle(50%)'],
            count: 14,
            reach: [24, 90],
            size: [5, 11],
            gravity: 10
          });
        });
        ring(fx, toFx(blown.length > 1 ? center : fuses[blown[0]]), css.ring, '#ff7a1a', 0.7);
        gsap.fromTo(svg, { x: -6 }, { x: 0, duration: 0.7, ease: 'elastic.out(1, 0.25)' });

        const boom = document.createElement('span');
        const at = toFx(center);

        boom.className = css.boom;
        boom.textContent = t.boom;
        fx.appendChild(boom);
        gsap.fromTo(
          boom,
          { x: at.x, y: at.y - 24, xPercent: -50, yPercent: -50, scale: 0.4, rotate: -10, opacity: 1 },
          {
            y: at.y - 78,
            scale: 1.3,
            rotate: 6,
            opacity: 0,
            duration: 1.1,
            ease: 'power2.out',
            onComplete: () => boom.remove()
          }
        );
      }

      if (shot.kind === 'embocinada' || shot.kind === 'monona') {
        const at = toFx(center);

        ring(fx, at, css.ring, '#fcd116', 0.7);
        burst(fx, at, {
          className: css.spark,
          colors: FX_COLORS,
          shapes: CONFETTI_SHAPES,
          count: 22,
          reach: [50, 130],
          size: [6, 12],
          gravity: 40
        });
      }

      if (shot.points) {
        const point = toFx(shot.land);
        const float = document.createElement('span');

        float.className = css.float;
        float.textContent = `+${shot.points}`;
        fx.appendChild(float);
        gsap.fromTo(
          float,
          { x: point.x, y: point.y - 26, xPercent: -50, yPercent: -50, scale: 0.6, opacity: 1 },
          {
            y: point.y - 86,
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

  // El foco acompaña a la fase: la pregunta, el botón de seguir, el primer control de puntería o los resultados
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }

    const frame = requestAnimationFrame(() => {
      const target = {
        question: headingRef,
        checked: nextRef,
        aim: xRef,
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
  const center = spotPoint(state.spot);
  const summary: TejoSummary = {
    score: state.score,
    total,
    firstTry: state.firstTry,
    bestStreak: state.bestStreak,
    attempts: state.attempts,
    throws: state.throws,
    scored: state.scored,
    bocines: state.bocines,
    mechas: state.mechas,
    bestCombo: state.bestCombo
  };
  const lastText = shot ? `${t.result[shot.kind]} (${shot.cm} cm)` : '';

  const hud = [
    { id: 'score', label: t.hud.score, icon: 'star' as const, value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame' as const, value: state.streak },
    { id: 'steady', label: t.hud.steady, icon: 'target' as const, value: state.steady },
    { id: 'scored', label: t.hud.scored, icon: 'disc' as const, value: `${state.scored}/${total}` }
  ];

  return (
    <div ref={rootRef} className={`${css.tejo} ${addClass ?? ''}`} data-phase={phase}>
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
              <TejoIcon name={icon} className={css['hud-icon']} />
              <span className={css['hud-label']}>{label}</span>
              <span className={css['hud-value']}>{value}</span>
            </li>
          ))}
        </ul>

        <TejoStage
          svgRef={svgRef}
          label={t.stage(state.throws)}
          spot={state.spot}
          aim={phase === 'aim' ? aimPoint(state.aimX, state.aimY) : null}
          wobble={state.steadyOn ? WOBBLE.steady : WOBBLE.normal}
          loaded={phase === 'aim'}
          flying={throwing}
          landed={showShot ? shot.land : null}
          burnt={showShot ? burntMechas(shot.kind, shot.land, center) : []}
          roundKey={state.at}
        />
      </div>

      <div className={css.console}>
        {(phase === 'question' || phase === 'checked') && (
          <TejoCard
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
          <TejoAim
            aimX={state.aimX}
            aimY={state.aimY}
            steady={state.steady}
            steadyOn={state.steadyOn}
            throwing={throwing}
            lastText={lastText}
            xRef={xRef}
            onAim={setAim}
            onToggleSteady={toggleSteady}
            onThrow={throwDisc}
          />
        )}

        {phase === 'result' && shot && (
          <TejoResultCard
            shot={shot}
            finishing={state.solved.length === total}
            nextRef={nextRef}
            onNext={afterResult}
          />
        )}

        {phase === 'done' && <TejoSummaryCard summary={summary} headingRef={summaryRef} onRestart={restart} />}
      </div>

      <ol className={css.track} aria-label={t.track.label}>
        {questions.map((q, i) => (
          <li key={q.id} className={css['track-item']} data-state={stateOf(q)}>
            <span aria-hidden="true">{stateOf(q) === 'solved' ? <TejoIcon name="check" /> : i + 1}</span>
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

GameTejo.Init = TejoInit;

export { GameTejo };
