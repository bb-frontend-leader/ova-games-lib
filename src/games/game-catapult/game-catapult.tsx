import { useEffect, useReducer, useRef } from 'react';
import gsap from 'gsap';

import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { CatapultAim } from './catapult-aim';
import { CatapultCard } from './catapult-card';
import { CatapultIcon } from './catapult-icons';
import { CatapultInit } from './catapult-init';
import { CatapultResultCard } from './catapult-result';
import { CatapultStage } from './catapult-stage';
import { CatapultSummaryCard } from './catapult-summary';
import {
  ANGLE,
  DEBRIS_COLORS,
  FIRE_COLORS,
  FX_COLORS,
  i18n,
  MAX_FIRE,
  POWER,
  SCORE,
  STREAK_FIRE,
  TARGETS
} from './lib/constant';
import { arcPoint, ARM_ROT, armTip, GROUND, PIVOT, rangeOf, resolveShot, towerX, UNIT, VIEW_W, X0 } from './lib/layout';

import type { CatapultQuestion, CatapultResult, CatapultSummary, Phase, State } from './types/types';

import css from './game-catapult.module.css';

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];

const shuffled = (question: CatapultQuestion) => gsap.utils.shuffle(question.answers.map((_, k) => k));

/** Distancia de la próxima torre: distinta de la anterior, para que haya que volver a apuntar. */
const pickTarget = (previous?: number) => gsap.utils.random(TARGETS.filter((d) => d !== previous)) as number;

interface Props {
  /** Las preguntas: cada acierto da una piedra. Pásalas como constante: no cambian mientras se juega. */
  questions: CatapultQuestion[];
  /** Se llama un instante después de comprobar, para que se vea el veredicto antes de abrir la retroalimentación. */
  onResult?: (result: CatapultResult) => void;
  /** Se llama al reintentar una pregunta tras un fallo (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al abrir los resultados, cuando todas las preguntas están acertadas y se lanzó la última piedra. */
  onFinish?: (summary: CatapultSummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof CatapultInit;
};

/**
 * Catapulta con preguntas: cada pregunta acertada da una piedra que se lanza contra una torre enemiga.
 *
 * - Fallar descarta la respuesta y hay que reintentar: sin acierto no hay piedra.
 * - Con la piedra se elige el ángulo y la fuerza. La torre está cada vez a una distancia distinta; si el disparo
 *   falla, el juego dice cuánto se quedó corto o se pasó.
 * - Dar en el centro de la torre da bonus y encadenar torres derribadas suma más.
 * - Cada tres aciertos seguidos se gana una bola de fuego: derriba la torre aunque no se dé justo.
 * - Termina cuando todas las preguntas están acertadas y se lanzó la última piedra.
 */
const GameCatapult: React.FC<Props> & SubComponents = ({ questions, onResult, onReset, onFinish, addClass }) => {
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
      hits: 0,
      shots: 0,
      directs: 0,
      combo: 0,
      bestCombo: 0,
      fire: 0,
      fireOn: false,
      angle: ANGLE.start,
      power: POWER.start,
      target: pickTarget(),
      downed: [],
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
  const angleRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // El foco solo se mueve cuando la fase cambia por una acción, no al montar
  const landed = useRef(-1); // Último disparo ya resuelto: evita resolverlo dos veces si el efecto se repite

  const item = questions[state.queue[state.at]] as CatapultQuestion | undefined;
  const stateOf = (q: CatapultQuestion) =>
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
    const fire = ok && streak % STREAK_FIRE === 0 && now.fire < MAX_FIRE;

    patch({
      phase: 'checked',
      last: { ok, firstTry, points, fire },
      score: now.score + points,
      streak,
      bestStreak: Math.max(now.bestStreak, streak),
      attempts: now.attempts + 1,
      firstTry: firstTry ? now.firstTry + 1 : now.firstTry,
      fire: fire ? now.fire + 1 : now.fire,
      solved: ok ? [...now.solved, q.id] : now.solved,
      fails: ok ? now.fails : { ...now.fails, [q.id]: fails + 1 },
      discarded: ok ? now.discarded : { ...now.discarded, [q.id]: [...(now.discarded[q.id] ?? []), now.selected] },
      notice: ok ? [t.live.ok(points), fire ? t.live.okFire : ''].filter(Boolean).join(' ') : t.live.ko
    });

    const deliver = () => onResult?.({ result: ok, question: q.id, streak, attempts: fails + 1, points });

    // Sin movimiento no hay espera, pero se deja un instante para que el foco llegue al botón antes del modal de la página
    defer(() => (canAnimate ? deliver() : void setTimeout(deliver, 60)), ok);
  };

  /** Tras comprobar: a cargar la catapulta (acierto) o a reintentar la misma pregunta (fallo). */
  const afterCheck = () => {
    flush(); // Si aún esperaba entregar el resultado, se entrega ya

    const now = stateRef.current;

    if (now.phase !== 'checked' || !now.last) return;

    if (now.last.ok) {
      patch({ phase: 'aim', fireOn: false, notice: t.live.aim(now.target) });
      return;
    }

    onReset?.();
    patch({ phase: 'question', selected: null, last: null, notice: '' });
  };

  const setAngle = (angle: number) => {
    if (stateRef.current.phase !== 'aim') return;

    patch({ angle: Math.max(ANGLE.min, Math.min(ANGLE.max, angle)) });
  };

  const setPower = (power: number) => {
    if (stateRef.current.phase !== 'aim') return;

    patch({ power: Math.max(POWER.min, Math.min(POWER.max, power)) });
  };

  const toggleFire = () => {
    const now = stateRef.current;

    if (now.phase !== 'aim' || (!now.fireOn && !now.fire)) return;

    patch({ fireOn: !now.fireOn, notice: t.live.mode(!now.fireOn) });
  };

  /** Disparar: la piedra sale con el ángulo y la fuerza elegidos. */
  const fire = () => {
    const now = stateRef.current;

    if (now.phase !== 'aim') return;

    patch({
      phase: 'firing',
      launch: { id: now.launches + 1, angle: now.angle, power: now.power, fireball: now.fireOn },
      launches: now.launches + 1,
      fire: now.fireOn ? now.fire - 1 : now.fire,
      fireOn: false,
      notice: t.live.firing
    });
  };

  /** La piedra ya cayó (o no hay animación): se resuelve si derribó la torre. */
  const land = () => {
    const now = stateRef.current;
    const launch = now.launch;

    if (now.phase !== 'firing' || !launch || landed.current === launch.id) return;

    landed.current = launch.id;

    const res = resolveShot(launch.angle, launch.power, now.target, launch.fireball);
    const hit = res.kind === 'direct' || res.kind === 'hit';
    const combo = hit ? now.combo + 1 : 0;
    const points = hit
      ? SCORE.hit + (res.kind === 'direct' ? SCORE.direct : 0) + Math.min(combo, SCORE.comboCap) * SCORE.combo
      : 0;
    const meters = Math.round(Math.abs(res.delta));
    const notice = {
      direct: t.live.direct(points),
      hit: t.live.hit(points),
      short: t.live.short(meters),
      long: t.live.long(meters)
    }[res.kind];

    patch({
      phase: 'result',
      launch: null,
      shot: {
        n: launch.id,
        angle: launch.angle,
        power: launch.power,
        fireball: launch.fireball,
        range: res.range,
        distance: now.target,
        delta: res.delta,
        kind: res.kind,
        points,
        combo
      },
      score: now.score + points,
      hits: hit ? now.hits + 1 : now.hits,
      shots: now.shots + 1,
      directs: res.kind === 'direct' ? now.directs + 1 : now.directs,
      combo,
      bestCombo: Math.max(now.bestCombo, combo),
      downed: hit ? [...now.downed, now.target] : now.downed,
      notice
    });
  };

  /** Tras el disparo: la siguiente pregunta o los resultados. */
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
        hits: now.hits,
        shots: now.shots,
        directs: now.directs,
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
      target: pickTarget(now.target),
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

        ring(fx, at, css.ring, '#ffc233', 0.5);
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

  // El disparo: el brazo se suelta y la piedra recorre su parábola; al caer se resuelve dónde dio
  useGSAP(
    () => {
      const launch = state.launch;

      if (!launch) return;

      const fx = fxRef.current;
      const arm = rootRef.current?.querySelector<SVGGElement>('[data-arm]');
      const ball = rootRef.current?.querySelector<SVGGElement>('[data-ball]');

      if (!canAnimate || !fx || !arm || !ball) {
        land(); // Sin movimiento (o si falta el dibujo) no hay nada que esperar
        return;
      }

      const range = rangeOf(launch.angle, launch.power);
      const swing = { rot: ARM_ROT.cocked };
      const flight = { s: 0 };
      let sparked = 0;

      const tl = gsap.timeline({ onComplete: land });

      tl.to(swing, {
        rot: ARM_ROT.released,
        duration: 0.28,
        ease: 'power2.in',
        onUpdate: () => {
          const tip = armTip(swing.rot);

          arm.setAttribute('transform', `translate(${PIVOT.x} ${PIVOT.y}) rotate(${swing.rot.toFixed(2)})`);
          ball.setAttribute('transform', `translate(${tip.x.toFixed(2)} ${tip.y.toFixed(2)})`);
        }
      }).to(flight, {
        s: 1,
        duration: gsap.utils.clamp(0.8, 1.7, 0.7 + range / 70),
        ease: 'none',
        onUpdate: () => {
          const p = arcPoint(flight.s, launch.angle, launch.power);

          ball.setAttribute('transform', `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`);

          // La bola de fuego deja una estela de chispas
          if (launch.fireball && flight.s - sparked > 0.04) {
            sparked = flight.s;
            burst(fx, centerIn(ball.getBoundingClientRect(), fx.getBoundingClientRect()), {
              className: css.spark,
              colors: FIRE_COLORS,
              shapes: ['circle(50%)'],
              count: 2,
              reach: [4, 16],
              size: [3, 7],
              gravity: 10
            });
          }
        }
      });

      return () => {
        tl.kill();
      };
    },
    { scope: rootRef, dependencies: [state.launch, canAnimate] }
  );

  // Impacto: polvo donde cae la piedra y, si derriba la torre, escombros, aro y puntos (y confeti en el centro)
  useGSAP(
    () => {
      const fx = fxRef.current;
      const svg = svgRef.current;
      const shot = state.shot;

      if (!shot || !canAnimate || !fx || !svg || stateRef.current.phase !== 'result') return;

      const matrix = svg.getScreenCTM();
      const box = fx.getBoundingClientRect();

      if (!matrix) return;

      const toFx = (x: number, y: number) => {
        const point = new DOMPoint(x, y).matrixTransform(matrix);

        return { x: point.x - box.left, y: point.y - box.top };
      };
      const hit = shot.kind === 'direct' || shot.kind === 'hit';
      const landX = X0 + shot.range * UNIT;

      if (landX <= VIEW_W) {
        burst(fx, toFx(landX, GROUND), {
          className: css.spark,
          colors: shot.fireball ? FIRE_COLORS : DEBRIS_COLORS,
          shapes: ['circle(50%)'],
          count: hit ? 10 : 8,
          reach: [18, 52],
          size: [5, 10],
          gravity: -6
        });
      }

      if (hit) {
        const at = toFx(towerX(shot.distance), GROUND - 30);

        burst(fx, at, {
          className: css.spark,
          colors: DEBRIS_COLORS,
          shapes: CONFETTI_SHAPES,
          count: 16,
          reach: [30, 90],
          size: [6, 12],
          gravity: 50
        });
        ring(fx, at, css.ring, shot.fireball ? '#ff7a1a' : '#ffc233', 0.7);

        if (shot.kind === 'direct') {
          burst(fx, at, {
            className: css.spark,
            colors: FX_COLORS,
            shapes: CONFETTI_SHAPES,
            count: 18,
            reach: [60, 140],
            size: [6, 11],
            gravity: 40
          });
        }

        gsap.fromTo(svg, { x: -5 }, { x: 0, duration: 0.7, ease: 'elastic.out(1, 0.25)' });
      }

      if (shot.points) {
        const point = toFx(towerX(shot.distance), GROUND - 70);
        const float = document.createElement('span');

        float.className = css.float;
        float.textContent = `+${shot.points}`;
        fx.appendChild(float);
        gsap.fromTo(
          float,
          { x: point.x, y: point.y, xPercent: -50, yPercent: -50, scale: 0.6, opacity: 1 },
          {
            y: point.y - 56,
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
        aim: angleRef,
        result: nextRef,
        done: summaryRef
      }[state.phase as Exclude<Phase, 'firing'>];

      target?.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [state.phase]);

  if (!total || !item) return null;

  const { phase, shot } = state;
  const firing = phase === 'firing';
  const hitShot = !!shot && (shot.kind === 'direct' || shot.kind === 'hit');
  const towerDown = hitShot && shot.distance === state.target && (phase === 'result' || phase === 'done');
  const loaded = phase === 'aim' || firing;
  const summary: CatapultSummary = {
    score: state.score,
    total,
    firstTry: state.firstTry,
    bestStreak: state.bestStreak,
    attempts: state.attempts,
    hits: state.hits,
    shots: state.shots,
    directs: state.directs,
    bestCombo: state.bestCombo
  };
  const lastText = shot
    ? `${
        {
          direct: t.result.direct,
          hit: t.result.hit,
          short: t.result.short(Math.round(Math.abs(shot.delta))),
          long: t.result.long(Math.round(Math.abs(shot.delta)))
        }[shot.kind]
      } (${shot.angle}°, ${shot.power} %)`
    : '';

  const hud = [
    { id: 'score', label: t.hud.score, icon: 'star' as const, value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame' as const, value: state.streak },
    { id: 'fire', label: t.hud.fire, icon: 'ball' as const, value: state.fire },
    { id: 'towers', label: t.hud.towers, icon: 'tower' as const, value: `${state.hits}/${total}` }
  ];

  return (
    <div ref={rootRef} className={`${css.catapult} ${addClass ?? ''}`} data-phase={phase}>
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
              <CatapultIcon name={icon} className={css['hud-icon']} />
              <span className={css['hud-label']}>{label}</span>
              <span className={css['hud-value']}>{value}</span>
            </li>
          ))}
        </ul>

        <CatapultStage
          svgRef={svgRef}
          label={t.stage(state.target, state.downed.length)}
          target={state.target}
          towerDown={towerDown}
          downed={state.downed}
          angle={state.angle}
          power={state.power}
          guide={phase === 'aim'}
          loaded={loaded}
          fireball={firing ? !!state.launch?.fireball : state.fireOn}
          arm={phase === 'result' || phase === 'done' ? 'released' : 'cocked'}
          ghost={shot && !firing ? { angle: shot.angle, power: shot.power } : null}
          shotKey={state.launches}
          towerKey={state.at}
        />
      </div>

      <div className={css.console}>
        {(phase === 'question' || phase === 'checked') && (
          <CatapultCard
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

        {(phase === 'aim' || firing) && (
          <CatapultAim
            angle={state.angle}
            power={state.power}
            target={state.target}
            fire={state.fire}
            fireOn={state.fireOn}
            firing={firing}
            lastText={lastText}
            angleRef={angleRef}
            onAngle={setAngle}
            onPower={setPower}
            onToggleFire={toggleFire}
            onFire={fire}
          />
        )}

        {phase === 'result' && shot && (
          <CatapultResultCard
            shot={shot}
            finishing={state.solved.length === total}
            nextRef={nextRef}
            onNext={afterResult}
          />
        )}

        {phase === 'done' && <CatapultSummaryCard summary={summary} headingRef={summaryRef} onRestart={restart} />}
      </div>

      <ol className={css.track} aria-label={t.track.label}>
        {questions.map((q, i) => (
          <li key={q.id} className={css['track-item']} data-state={stateOf(q)}>
            <span aria-hidden="true">{stateOf(q) === 'solved' ? <CatapultIcon name="check" /> : i + 1}</span>
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

GameCatapult.Init = CatapultInit;

export { GameCatapult };
