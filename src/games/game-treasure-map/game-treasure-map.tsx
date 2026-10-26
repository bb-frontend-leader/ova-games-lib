import { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import gsap from 'gsap';

import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { COIN_COLORS, FOAM_COLORS, FX_COLORS, i18n, islandName, SAIL_MS, SCORE, STORM_COLORS } from './lib/constant';
import type { IconName } from './lib/icons';
import {
  buildLayout,
  hasChest,
  type MapLayout,
  openIslands,
  type Point,
  PORT,
  rankOf,
  sailPoint,
  TREASURE
} from './lib/layout';
import { TreasureIcon } from './treasure-icons';
import { TreasureInit } from './treasure-init';
import { TreasureMap } from './treasure-map';
import { type NextKind, TreasurePanel } from './treasure-panel';
import { TreasureSummaryCard } from './treasure-summary';

import type { State, TreasureQuestion, TreasureResult, TreasureSummary } from './types/types';

import css from './game-treasure-map.module.css';

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];
const ROUND = ['circle(50%)'];
const LEGEND: { kind: 'open' | 'visited' | 'chest' | 'storm'; icon: IconName }[] = [
  { kind: 'open', icon: 'compass' },
  { kind: 'visited', icon: 'flag' },
  { kind: 'chest', icon: 'chest' },
  { kind: 'storm', icon: 'bolt' }
];

/** Ancho del mapa (px) a partir del cual se usa la disposición apaisada. */
const WIDE_FROM = 560;

interface Props {
  /** Las preguntas: cada una es una isla del mapa. Pásalas como constante: no cambian mientras se juega. */
  questions: TreasureQuestion[];
  /** Se llama un instante después de comprobar, para que se vea la llegada (o la tormenta) antes de abrir la retroalimentación. */
  onResult?: (result: TreasureResult) => void;
  /** Se llama al reintentar o cambiar de rumbo tras una tormenta (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al llegar a la isla del tesoro, cuando se muestran los resultados. */
  onFinish?: (summary: TreasureSummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof TreasureInit;
};

/**
 * Mapa del tesoro con preguntas: cada isla esconde una pregunta y el estudiante elige a qué isla navegar.
 *
 * - Solo se puede ir a las islas con una ruta abierta desde el puerto o desde una isla ya explorada.
 * - Acertar lleva el barco a la isla y planta la bandera. Fallar es una tormenta: el barco no llega, la respuesta queda
 *   descartada y se puede reintentar la isla o cambiar de rumbo.
 * - Algunas islas guardan un cofre (bono de puntos) y los aciertos seguidos suman racha.
 * - Al explorar todas las islas el barco navega a la isla del tesoro y se abre el cofre.
 */
const GameTreasureMap: React.FC<Props> & SubComponents = ({ questions, onResult, onReset, onFinish, addClass }) => {
  const lang = useLang();
  const t = i18n[lang];

  const canAnimate = useCanAnimate();
  const { defer, flush } = useDeferredResult();
  const total = questions.length;
  const ids = questions.map((q) => q.id);
  const key = ids.join('|');
  const byId = Object.fromEntries(questions.map((q) => [q.id, q]));
  const names = ids.map((_, k) => islandName(lang, k + 1));
  const chestTotal = ids.filter(hasChest).length;

  const createState = (): State => ({
    phase: 'route',
    at: PORT,
    face: 1,
    target: null,
    order: [],
    selected: null,
    visited: [],
    solved: [],
    fails: {},
    discarded: {},
    score: 0,
    streak: 0,
    bestStreak: 0,
    firstTry: 0,
    attempts: 0,
    storms: 0,
    chests: 0,
    last: null,
    notice: ''
  });

  const [state, patch] = useReducer((prev: State, next: Partial<State>) => ({ ...prev, ...next }), null, createState);
  const stateRef = useRef(state); // Los callbacks leen el estado de ahora, no el de cuando se programaron
  stateRef.current = state;

  const rootRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const shipRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // El foco solo se mueve cuando la fase cambia por una acción, no al montar
  const sailed = useRef(-1); // Último intento ya animado: evita animarlo dos veces si el efecto se repite

  // El mapa es apaisado o estrecho según su ancho; las islas y las rutas se reparten distinto en cada uno
  const [wide, setWide] = useState(true);
  const layout = useMemo(() => buildLayout(key ? key.split('|') : [], wide), [key, wide]);
  const layoutRef = useRef<MapLayout>(layout);
  layoutRef.current = layout;

  useLayoutEffect(() => {
    const el = mapRef.current;

    if (!el) return;

    const watch = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;

      if (width > 0) setWide(width >= WIDE_FROM);
    });

    watch.observe(el);

    return () => watch.disconnect();
  }, [total]);

  const open = openIslands(layout, ids, state.visited);
  const target = state.target ? (byId[state.target] as TreasureQuestion | undefined) : undefined;

  const summaryOf = (now: State): TreasureSummary => ({
    score: now.score,
    total,
    firstTry: now.firstTry,
    bestStreak: now.bestStreak,
    attempts: now.attempts,
    storms: now.storms,
    chests: now.chests,
    chestTotal,
    rank: rankOf(now.firstTry, total)
  });

  const choose = (id: string) => {
    const now = stateRef.current;
    const q = byId[id];

    if (now.phase !== 'route' || !q || !openIslands(layoutRef.current, ids, now.visited).includes(id)) return;

    const n = ids.indexOf(id) + 1;
    const from = layoutRef.current.points[now.at];
    const to = layoutRef.current.points[id];

    patch({
      phase: 'question',
      target: id,
      order: gsap.utils.shuffle(q.answers.map((_, k) => k)),
      selected: null,
      face: to.x >= from.x ? 1 : -1,
      notice: t.live.island(n, names[n - 1], hasChest(id))
    });
  };

  const select = (answer: number) => {
    if (stateRef.current.phase !== 'question') return;

    patch({ selected: answer });
  };

  /** Antes de comprobar: volver al mapa para elegir otra isla (sin penalización). */
  const changeRoute = () => {
    if (stateRef.current.phase !== 'question') return;

    patch({ phase: 'route', target: null, selected: null, notice: t.live.route });
  };

  const check = () => {
    const now = stateRef.current;
    const q = now.target ? byId[now.target] : undefined;

    if (now.phase !== 'question' || now.selected === null || !q) return;

    const ok = q.answers[now.selected].state === 'success';
    const fails = now.fails[q.id] ?? 0;
    const firstTry = ok && fails === 0;
    const streak = ok ? now.streak + 1 : 0;
    const last = ok && now.solved.length + 1 === total;
    const chest = ok && hasChest(q.id);
    const points = ok
      ? (fails > 0 ? SCORE.retry : SCORE.answer) +
        Math.min(now.streak, SCORE.streakCap) * SCORE.streakStep +
        (chest ? SCORE.chest : 0)
      : 0;
    // Sin movimiento el barco llega (o no) al instante; con movimiento lo hace la animación
    const arrived = ok && !canAnimate;

    patch({
      phase: canAnimate ? 'sailing' : 'checked',
      last: { ok, firstTry, points, chest, last, island: q.id, answer: now.selected },
      score: now.score + points,
      streak,
      bestStreak: Math.max(now.bestStreak, streak),
      attempts: now.attempts + 1,
      firstTry: firstTry ? now.firstTry + 1 : now.firstTry,
      storms: ok ? now.storms : now.storms + 1,
      chests: chest ? now.chests + 1 : now.chests,
      solved: ok ? [...now.solved, q.id] : now.solved,
      fails: ok ? now.fails : { ...now.fails, [q.id]: fails + 1 },
      discarded: ok ? now.discarded : { ...now.discarded, [q.id]: [...(now.discarded[q.id] ?? []), now.selected] },
      at: arrived ? q.id : now.at,
      visited: arrived ? [...now.visited, q.id] : now.visited,
      notice: ok
        ? [t.live.ok(points), chest ? t.live.chest : '', last ? t.live.last : ''].filter(Boolean).join(' ')
        : t.live.ko
    });

    const deliver = () => onResult?.({ result: ok, question: q.id, streak, attempts: fails + 1, points });

    // El resultado llega cuando el barco ya está en la isla (o la tormenta ha pasado); sin movimiento, casi de inmediato
    defer(() => (canAnimate ? deliver() : void setTimeout(deliver, 60)), ok, ok ? SAIL_MS.ok : SAIL_MS.ko);
  };

  /** Tras comprobar: seguir navegando (acierto), rumbo al tesoro (última isla) o reintentar / cambiar de rumbo (fallo). */
  const afterCheck = (kind: NextKind) => {
    flush(); // Si aún esperaba entregar el resultado, se entrega ya

    const now = stateRef.current;
    const verdict = now.last;

    if (now.phase !== 'checked' || !verdict) return;

    if (!verdict.ok) {
      onReset?.();

      if (kind === 'route') patch({ phase: 'route', target: null, selected: null, last: null, notice: t.live.route });
      else patch({ phase: 'question', selected: null, last: null, notice: '' });

      return;
    }

    if (verdict.last) {
      const score = now.score + SCORE.treasure;

      if (canAnimate) {
        const from = layoutRef.current.points[now.at];
        const to = layoutRef.current.points[TREASURE];

        patch({
          phase: 'finale',
          score,
          target: null,
          selected: null,
          last: null,
          face: to.x >= from.x ? 1 : -1,
          notice: t.finaleText
        });
      } else {
        const next: State = {
          ...now,
          phase: 'done',
          at: TREASURE,
          score,
          target: null,
          selected: null,
          last: null,
          notice: t.live.treasure
        };

        patch(next);
        onFinish?.(summaryOf(next));
      }

      return;
    }

    patch({ phase: 'route', target: null, selected: null, last: null, notice: t.live.route });
  };

  const onNext = (kind: NextKind) =>
    kind === 'route' && stateRef.current.phase === 'question' ? changeRoute() : afterCheck(kind);

  const restart = () => {
    flush();
    sailed.current = -1;
    patch(createState());
  };

  // La travesía: el barco navega a la isla elegida (llega y planta la bandera, o la tormenta lo frena y vuelve)
  // y, al explorar todo, a la isla del tesoro, cuyo cofre se abre
  useGSAP(
    () => {
      const now = stateRef.current;
      const { phase } = now;

      if (phase !== 'sailing' && phase !== 'finale') return;

      const verdict = now.last;

      if (phase === 'sailing' && (!verdict || sailed.current === now.attempts)) return;

      const map = mapRef.current;
      const ship = shipRef.current;
      const fx = fxRef.current;
      const lay = layoutRef.current;
      const from = now.at;
      const to = phase === 'finale' ? TREASURE : (verdict?.island ?? from);

      if (!map || !ship || !fx) {
        if (phase === 'sailing') {
          sailed.current = now.attempts;
          patch({ phase: 'checked' });
        }

        return;
      }

      const put = (p: Point) => {
        ship.style.left = `${p.x * 100}%`;
        ship.style.top = `${p.y * 100}%`;
      };
      const fxBox = () => fx.getBoundingClientRect();
      const shipAt = () => centerIn(ship.getBoundingClientRect(), fxBox());
      const spot = to === TREASURE ? map.querySelector<HTMLElement>('[data-treasure]') : null;
      const islandEl = [...map.querySelectorAll<HTMLElement>('[data-island]')].find((el) => el.dataset.island === to);
      const spotAt = () => centerIn((spot ?? islandEl ?? ship).getBoundingClientRect(), fxBox());
      const along = { t: 0 };
      const sail = () => put(sailPoint(lay, from, to, along.t));
      const foam = () =>
        burst(fx, shipAt(), {
          className: css.spark,
          colors: FOAM_COLORS,
          shapes: ROUND,
          count: 3,
          reach: [12, 34],
          size: [5, 9],
          gravity: 6
        });
      const cleanup = () => {
        gsap.set(ship, { clearProps: 'transform' });
        delete map.dataset.storm;
      };

      if (phase === 'finale') {
        const tl = gsap.timeline({
          onComplete: () => {
            cleanup();

            const next: State = { ...stateRef.current, phase: 'done', at: TREASURE, notice: t.live.treasure };

            patch(next);
            onFinish?.(summaryOf(next));
          }
        });

        tl.to(along, { t: 1, duration: 2.1, ease: 'power1.inOut', onUpdate: sail });
        [0.3, 0.8, 1.3, 1.8].forEach((at) => tl.add(foam, at));
        tl.add(() => {
          map.dataset.open = '';

          const center = spotAt();

          ring(fx, center, css.ring, '#ffd24a', 0.8);
          burst(fx, center, {
            className: css.spark,
            colors: COIN_COLORS,
            shapes: ROUND,
            count: 30,
            reach: [60, 190],
            size: [8, 14],
            gravity: 70
          });
          burst(fx, center, {
            className: css.spark,
            colors: FX_COLORS,
            shapes: CONFETTI_SHAPES,
            count: 30,
            reach: [90, 240],
            size: [7, 13],
            gravity: 90
          });
        }, '>-0.05');
        tl.to({}, { duration: 1.3 });

        return () => {
          tl.kill();
        };
      }

      if (!verdict) return;

      const finish = () => {
        sailed.current = now.attempts;
        cleanup();
        patch({ phase: 'checked' });
      };
      const tl = gsap.timeline({ onComplete: finish });

      if (verdict.ok) {
        tl.to(along, { t: 1, duration: 1.5, ease: 'power1.inOut', onUpdate: sail });
        [0.25, 0.65, 1.05].forEach((at) => tl.add(foam, at));
        tl.add(() => {
          // Llegada: la bandera sube, aro y confeti en la isla (y monedas si había cofre)
          patch({ at: to, visited: [...stateRef.current.visited, to] });

          const center = spotAt();

          ring(fx, center, css.ring, '#7fe3a5', 0.8);
          burst(fx, center, {
            className: css.spark,
            colors: FX_COLORS,
            shapes: CONFETTI_SHAPES,
            count: 16,
            reach: [40, 120],
            size: [6, 11],
            gravity: 40
          });

          if (verdict.chest) {
            burst(fx, center, {
              className: css.spark,
              colors: COIN_COLORS,
              shapes: ROUND,
              count: 14,
              reach: [50, 130],
              size: [8, 13],
              gravity: 60
            });
          }
        }, '>-0.05');
        tl.to({}, { duration: 0.7 });
      } else {
        tl.to(along, { t: 0.5, duration: 0.9, ease: 'power1.in', onUpdate: sail });
        tl.add(() => {
          map.dataset.storm = '';

          const center = shipAt();

          ring(fx, center, css.ring, '#ff6b5e', 0.8);
          burst(fx, center, {
            className: css.spark,
            colors: STORM_COLORS,
            shapes: ROUND,
            count: 14,
            reach: [30, 90],
            size: [6, 12],
            gravity: 50
          });
        });
        tl.fromTo(
          ship,
          { x: 0, rotation: 0 },
          { x: 6, rotation: 5, duration: 0.07, repeat: 9, yoyo: true, ease: 'sine.inOut' },
          '<'
        );
        tl.to(ship, { x: 0, rotation: 0, duration: 0.06 });
        tl.to(along, { t: 0, duration: 0.8, ease: 'power2.out', onUpdate: sail }, '>');
        tl.add(() => void delete map.dataset.storm, '-=0.35');
        tl.to({}, { duration: 0.2 });
      }

      return () => {
        tl.kill();
      };
    },
    { scope: rootRef, dependencies: [state.phase, canAnimate] }
  );

  // El foco acompaña a la fase: el título del pergamino (elegir ruta o pregunta), el botón de seguir o los resultados
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }

    const frame = requestAnimationFrame(() => {
      const target = { route: headingRef, question: headingRef, checked: nextRef, done: summaryRef }[
        state.phase as 'route' | 'question' | 'checked' | 'done'
      ];

      target?.current?.focus({ preventScroll: true });
      target?.current?.scrollIntoView({ block: 'nearest' });
    });

    return () => cancelAnimationFrame(frame);
  }, [state.phase]);

  if (!total) return null;

  const { phase } = state;

  const hud: { id: string; label: string; icon: IconName; value: React.ReactNode }[] = [
    { id: 'score', label: t.hud.score, icon: 'star', value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame', value: state.streak },
    { id: 'islands', label: t.hud.islands, icon: 'flag', value: `${state.visited.length}/${total}` },
    { id: 'chests', label: t.hud.chests, icon: 'chest', value: `${state.chests}/${chestTotal}` }
  ];

  return (
    <div ref={rootRef} className={`${css.hunt} ${addClass ?? ''}`} data-phase={phase}>
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
            <TreasureIcon name={icon} className={css['hud-icon']} />
            <span className={css['hud-label']}>{label}</span>
            <span className={css['hud-value']}>{value}</span>
          </li>
        ))}
      </ul>

      <TreasureMap
        mapRef={mapRef}
        shipRef={shipRef}
        layout={layout}
        ids={ids}
        names={names}
        visited={state.visited}
        open={open}
        target={state.target}
        at={state.at}
        face={state.face}
        phase={phase}
        wide={wide}
        labels={{
          map: t.map,
          port: t.port,
          treasure: t.treasure,
          ship: t.ship,
          island: t.island,
          state: t.state
        }}
        onChoose={choose}
      />

      {phase === 'done' ? (
        <TreasureSummaryCard summary={summaryOf(state)} headingRef={summaryRef} onRestart={restart} />
      ) : (
        <TreasurePanel
          phase={phase}
          question={target ?? null}
          number={state.target ? ids.indexOf(state.target) + 1 : 0}
          islandName={state.target ? names[ids.indexOf(state.target)] : ''}
          left={total - state.visited.length}
          order={state.order}
          selected={state.selected}
          discarded={state.target ? (state.discarded[state.target] ?? []) : []}
          verdict={state.last}
          headingRef={headingRef}
          verdictRef={verdictRef}
          nextRef={nextRef}
          onSelect={select}
          onCheck={check}
          onNext={onNext}
        />
      )}

      <ul className={css.legend} aria-label={t.legend.label}>
        {LEGEND.map(({ kind, icon }) => (
          <li key={kind} className={css['legend-item']} data-kind={kind}>
            <TreasureIcon name={icon} />
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

GameTreasureMap.Init = TreasureInit;

export { GameTreasureMap };
