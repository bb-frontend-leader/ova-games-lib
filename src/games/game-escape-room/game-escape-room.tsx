import { useEffect, useReducer, useRef } from 'react';
import gsap from 'gsap';

import { burst, centerIn, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { EscapeCard } from './escape-card';
import { EscapeDoor } from './escape-door';
import { EscapeGuide } from './escape-guide';
import { EscapeIcon } from './escape-icons';
import { EscapeInit } from './escape-init';
import { EscapeResultCard } from './escape-result';
import { EscapeScene } from './escape-scene';
import { EscapeSummaryCard } from './escape-summary';
import {
  DEFAULT_PER_ROOM,
  FX_COLORS,
  i18n,
  MAX_HINTS,
  OPEN_COLORS,
  SCORE,
  START_HINTS,
  STREAK_HINT
} from './lib/constant';
import { createObjects, roomCode, roomCount } from './lib/layout';

import type { EscapeQuestion, EscapeResult, EscapeSummary, Phase, State } from './types/types';

import css from './game-escape-room.module.css';

const CONFETTI_SHAPES = ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'circle(50%)'];

const shuffled = (question: EscapeQuestion) => gsap.utils.shuffle(question.answers.map((_, k) => k));

interface Props {
  /** Las preguntas: cada objeto de cada sala esconde una. Pásalas como constante: no cambian mientras se juega. */
  questions: EscapeQuestion[];
  /** Objetos (y dígitos del código) por sala. Las salas salen de dividir las preguntas entre este número. */
  perRoom?: number;
  /** Se llama un instante después de comprobar, para que se vea el veredicto antes de abrir la retroalimentación. */
  onResult?: (result: EscapeResult) => void;
  /** Se llama al volver a la sala tras un fallo (equivale a «Reintentar»: pásale `notifyReset`). */
  onReset?: () => void;
  /** Se llama al abrir los resultados, cuando se abrió la puerta de la última sala. */
  onFinish?: (summary: EscapeSummary) => void;
  addClass?: string;
}

type SubComponents = {
  Init: typeof EscapeInit;
};

/**
 * Escape room con preguntas: salas con objetos cerrados con candado y una puerta con código.
 *
 * - Cada objeto esconde una pregunta; al acertar se abre y deja un dígito y su posición en la libreta.
 * - Con todos los objetos abiertos, el código de la puerta son esos dígitos puestos en orden de posición.
 * - Fallar descarta la respuesta y el objeto sigue cerrado. La pista descarta respuestas incorrectas; cada tres
 *   aciertos seguidos se gana otra. Un código equivocado resta puntos.
 * - Termina al abrir la puerta de la última sala; las pistas que sobran suman al final.
 */
const GameEscapeRoom: React.FC<Props> & SubComponents = ({
  questions,
  perRoom = DEFAULT_PER_ROOM,
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
  const roomsTotal = roomCount(total, perRoom);

  const createState = (): State => ({
    phase: 'room',
    objs: createObjects(total, perRoom),
    room: 0,
    currentId: null,
    order: [],
    selected: null,
    solved: [],
    fails: {},
    discarded: {},
    hinted: {},
    score: 0,
    streak: 0,
    bestStreak: 0,
    firstTry: 0,
    attempts: 0,
    hints: START_HINTS,
    hintsUsed: 0,
    rooms: 0,
    badCodes: 0,
    bonus: 0,
    entry: [],
    last: null,
    door: null,
    notice: ''
  });

  const [state, patch] = useReducer((prev: State, next: Partial<State>) => ({ ...prev, ...next }), null, createState);
  const stateRef = useRef(state); // Los callbacks leen el estado de ahora, no el de cuando se programaron
  stateRef.current = state;

  const rootRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const doorRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const doorHeadingRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // El foco solo se mueve cuando la fase cambia por una acción, no al montar

  const objEl = (id: number) => rootRef.current?.querySelector<HTMLElement>(`[data-obj="${id}"]`) ?? null;

  const roomObjs = state.objs.filter((obj) => obj.room === state.room);
  const current = state.currentId !== null ? state.objs[state.currentId] : null;
  const item = current ? questions[current.q] : null;
  const stateOf = (q: EscapeQuestion) =>
    state.solved.includes(q.id) ? 'solved' : state.fails[q.id] ? 'review' : 'pending';
  const reviewIds = roomObjs.filter((obj) => !obj.open && state.fails[questions[obj.q].id]).map((obj) => obj.id);
  const roomName = t.rooms[state.room % t.rooms.length];

  /** Respuestas incorrectas de la pregunta que la pista puede descartar (siempre queda una incorrecta). */
  const hintable = (q: EscapeQuestion, discarded: number[]) => {
    const wrong = q.answers.map((_, k) => k).filter((k) => q.answers[k].state === 'wrong' && !discarded.includes(k));

    return wrong.length > 1 ? wrong : [];
  };

  const press = (id: number) => {
    const now = stateRef.current;
    const obj = now.objs[id];

    if (now.phase !== 'room' || !obj || obj.open) return;

    patch({
      phase: 'question',
      currentId: id,
      order: shuffled(questions[obj.q]),
      selected: null,
      last: null,
      notice: t.live.opened(t.objects[obj.icon])
    });
  };

  const select = (answer: number) => {
    if (stateRef.current.phase !== 'question') return;

    patch({ selected: answer });
  };

  const askHint = () => {
    const now = stateRef.current;
    const obj = now.currentId !== null ? now.objs[now.currentId] : null;
    const q = obj ? questions[obj.q] : null;

    if (now.phase !== 'question' || !q || now.hinted[q.id]) return;

    if (now.hints <= 0) {
      patch({ notice: t.live.hintNone });
      return;
    }

    const before = now.discarded[q.id] ?? [];
    const wrong = hintable(q, before);
    const removed = gsap.utils.shuffle(wrong).slice(0, Math.min(2, wrong.length - 1));

    if (!removed.length) return;

    patch({
      hints: now.hints - 1,
      hintsUsed: now.hintsUsed + 1,
      hinted: { ...now.hinted, [q.id]: true },
      discarded: { ...now.discarded, [q.id]: [...before, ...removed] },
      selected: now.selected !== null && removed.includes(now.selected) ? null : now.selected,
      notice: t.live.hint
    });

    // El botón queda deshabilitado: el foco pasa al enunciado para no perderse en el <body>.
    headingRef.current?.focus();
  };

  const check = () => {
    const now = stateRef.current;
    const obj = now.currentId !== null ? now.objs[now.currentId] : null;
    const q = obj ? questions[obj.q] : null;

    if (now.phase !== 'question' || now.selected === null || !obj || !q) return;

    const ok = q.answers[now.selected].state === 'success';
    const fails = now.fails[q.id] ?? 0;
    const hinted = Boolean(now.hinted[q.id]);
    const firstTry = ok && !fails && !hinted;
    const points = ok
      ? (fails || hinted ? SCORE.retry : SCORE.answer) + Math.min(now.streak, SCORE.streakCap) * SCORE.streakStep
      : 0;
    const streak = ok ? now.streak + 1 : 0;
    const hintGain = ok && streak % STREAK_HINT === 0 && now.hints < MAX_HINTS;
    const cleared = ok && now.objs.filter((o) => o.room === obj.room && o.id !== obj.id).every((o) => o.open);

    patch({
      phase: 'checked',
      objs: ok ? now.objs.map((o) => (o.id === obj.id ? { ...o, open: true } : o)) : now.objs,
      last: { ok, firstTry, points, hinted, hintGain, cleared, slot: obj.slot, digit: obj.digit },
      score: now.score + points,
      streak,
      bestStreak: Math.max(now.bestStreak, streak),
      attempts: now.attempts + 1,
      firstTry: firstTry ? now.firstTry + 1 : now.firstTry,
      hints: hintGain ? now.hints + 1 : now.hints,
      solved: ok ? [...now.solved, q.id] : now.solved,
      fails: ok ? now.fails : { ...now.fails, [q.id]: fails + 1 },
      discarded: ok ? now.discarded : { ...now.discarded, [q.id]: [...(now.discarded[q.id] ?? []), now.selected] },
      notice: ok
        ? [t.live.ok(points), hintGain ? t.live.okHintGain : '', cleared ? t.live.okCleared : '']
            .filter(Boolean)
            .join(' ')
        : t.live.ko
    });

    const deliver = () => onResult?.({ result: ok, question: q.id, streak, attempts: fails + 1, points });

    // Sin movimiento no hay espera, pero se deja un instante para que el foco llegue al botón antes del modal de la página
    defer(() => (canAnimate ? deliver() : void setTimeout(deliver, 60)), ok);
  };

  /** Tras comprobar: a la puerta (sala despejada) o de vuelta a la sala. */
  const afterCheck = () => {
    flush(); // Si aún esperaba entregar el resultado, se entrega ya

    const now = stateRef.current;

    if (now.phase !== 'checked' || !now.last) return;

    if (!now.last.ok) onReset?.();

    if (now.last.ok && now.last.cleared) {
      patch({ phase: 'door', entry: [], notice: t.live.door });
      return;
    }

    patch({ phase: 'room', selected: null, last: null, notice: '' });
  };

  const addDigit = (digit: number) => {
    const now = stateRef.current;
    const count = now.objs.filter((obj) => obj.room === now.room).length;

    if (now.phase !== 'door' || now.entry.length >= count) return;

    patch({ entry: [...now.entry, digit], notice: t.live.digit(digit, now.entry.length + 1, count) });
  };

  const erase = () => {
    const now = stateRef.current;

    if (now.phase !== 'door' || !now.entry.length) return;

    patch({ entry: now.entry.slice(0, -1), notice: t.live.erased });
  };

  const openDoor = () => {
    const now = stateRef.current;
    const code = roomCode(now.objs, now.room);

    if (now.phase !== 'door' || now.entry.length !== code.length) return;

    const n = (now.door?.n ?? 0) + 1;

    if (now.entry.join() === code.join()) {
      patch({
        phase: 'opened',
        score: now.score + SCORE.room,
        rooms: now.rooms + 1,
        door: { n, ok: true, points: SCORE.room },
        notice: t.live.right(SCORE.room)
      });
      return;
    }

    const lost = Math.min(now.score, SCORE.badCode);

    patch({
      score: now.score - lost,
      badCodes: now.badCodes + 1,
      entry: [],
      door: { n, ok: false, points: lost },
      notice: t.live.wrong(lost)
    });
  };

  /** Tras abrir la puerta: la siguiente sala o los resultados. */
  const afterOpened = () => {
    const now = stateRef.current;

    if (now.phase !== 'opened') return;

    if (now.room + 1 >= roomsTotal) {
      const bonus = now.hints * SCORE.hint;
      const score = now.score + bonus;

      patch({ phase: 'done', score, bonus, notice: '' });
      onFinish?.({
        score,
        total,
        firstTry: now.firstTry,
        bestStreak: now.bestStreak,
        attempts: now.attempts,
        rooms: now.rooms,
        hintsUsed: now.hintsUsed,
        badCodes: now.badCodes,
        bonus
      });
      return;
    }

    patch({
      phase: 'room',
      room: now.room + 1,
      currentId: null,
      entry: [],
      selected: null,
      last: null,
      door: null,
      notice: t.live.room(now.room + 2, t.rooms[(now.room + 1) % t.rooms.length])
    });
  };

  const restart = () => {
    flush();
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

  // La puerta: si se abre, destellos; si el código era otro, tiembla y suben los puntos que se pierden
  useGSAP(
    () => {
      const fx = fxRef.current;
      const door = doorRef.current;
      const event = state.door;

      if (!event || !canAnimate || !fx || !door) return;

      const at = centerIn(door.getBoundingClientRect(), fx.getBoundingClientRect());

      if (event.ok) {
        ring(fx, at, css.ring, '#fff3b0', 1);
        burst(fx, at, {
          className: css.spark,
          colors: OPEN_COLORS,
          shapes: CONFETTI_SHAPES,
          count: 24,
          reach: [50, 140],
          size: [6, 12],
          gravity: 40
        });
        return () => fx.replaceChildren();
      }

      gsap.fromTo(door, { x: -8 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.25)' });

      if (event.points) {
        const float = document.createElement('span');

        float.className = css.float;
        float.textContent = `−${event.points}`;
        fx.appendChild(float);
        gsap.fromTo(
          float,
          { x: at.x, y: at.y - 10, xPercent: -50, yPercent: -50, scale: 0.6, opacity: 1 },
          { y: at.y - 70, scale: 1.2, opacity: 0, duration: 1.1, ease: 'power2.out', onComplete: () => float.remove() }
        );
      }

      return () => fx.replaceChildren();
    },
    { scope: rootRef, dependencies: [state.door, canAnimate] }
  );

  // El foco acompaña a la fase: el objeto que se jugó, la pregunta, el botón de seguir, la puerta o los resultados
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }

    const frame = requestAnimationFrame(() => {
      if (state.phase === 'room') {
        const back = state.currentId !== null ? objEl(state.currentId) : null;
        const fallback = rootRef.current?.querySelector<HTMLElement>('[data-obj]:not([data-view="open"])');

        (back && back.dataset.view !== 'open' ? back : fallback)?.focus({ preventScroll: true });
        return;
      }

      const target = {
        question: headingRef,
        checked: nextRef,
        door: doorHeadingRef,
        opened: nextRef,
        done: summaryRef
      }[state.phase as Exclude<Phase, 'room'>];

      target?.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  if (!total) return null;

  const { phase } = state;
  const summary: EscapeSummary = {
    score: state.score,
    total,
    firstTry: state.firstTry,
    bestStreak: state.bestStreak,
    attempts: state.attempts,
    rooms: state.rooms,
    hintsUsed: state.hintsUsed,
    badCodes: state.badCodes,
    bonus: state.bonus
  };

  const hud = [
    { id: 'score', label: t.hud.score, icon: 'star' as const, value: <Score value={state.score} /> },
    { id: 'streak', label: t.hud.streak, icon: 'flame' as const, value: state.streak },
    { id: 'hints', label: t.hud.hints, icon: 'lamp' as const, value: state.hints },
    { id: 'solved', label: t.hud.solved, icon: 'check' as const, value: `${state.solved.length}/${total}` }
  ];

  return (
    <div ref={rootRef} className={`${css.escape} ${addClass ?? ''}`} data-phase={phase}>
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
            <EscapeIcon name={icon} className={css['hud-icon']} />
            <span className={css['hud-label']}>{label}</span>
            <span className={css['hud-value']}>{value}</span>
          </li>
        ))}
      </ul>

      <div className={css.play}>
        <div className={css['field-wrap']}>
          <div className={css.toolbar}>
            <span className={css.counter}>
              <EscapeIcon name="door" />
              {t.roomCounter(state.room + 1, roomsTotal)}
            </span>

            <span className={css.counter}>
              <EscapeIcon name="key" />
              {t.openCounter(roomObjs.filter((obj) => obj.open).length, roomObjs.length)}
            </span>
          </div>

          <EscapeScene
            room={state.room}
            objs={roomObjs}
            review={reviewIds}
            current={phase === 'question' || phase === 'checked' ? state.currentId : null}
            interactive={phase === 'room'}
            entry={state.entry}
            opened={phase === 'opened'}
            label={t.sceneLabel(state.room + 1, roomsTotal, roomName)}
            onPress={press}
            doorRef={doorRef}
          />
        </div>

        <div className={css.side}>
          {phase === 'room' && <EscapeGuide room={state.room} objs={roomObjs} />}

          {(phase === 'question' || phase === 'checked') && item && current && (
            <EscapeCard
              question={item}
              object={t.objects[current.icon]}
              number={state.solved.length + (state.last?.ok ? 0 : 1)}
              total={total}
              order={state.order}
              selected={state.selected}
              discarded={state.discarded[item.id] ?? []}
              verdict={state.last}
              hints={state.hints}
              canHint={!state.hinted[item.id] && hintable(item, state.discarded[item.id] ?? []).length > 0}
              headingRef={headingRef}
              verdictRef={verdictRef}
              nextRef={nextRef}
              onSelect={select}
              onHint={askHint}
              onCheck={check}
              onNext={afterCheck}
            />
          )}

          {phase === 'door' && (
            <EscapeDoor
              objs={roomObjs}
              entry={state.entry}
              headingRef={doorHeadingRef}
              onDigit={addDigit}
              onErase={erase}
              onOpen={openDoor}
            />
          )}

          {phase === 'opened' && (
            <EscapeResultCard
              points={state.door?.points ?? 0}
              finishing={state.room + 1 >= roomsTotal}
              nextRef={nextRef}
              onNext={afterOpened}
            />
          )}

          {phase === 'done' && <EscapeSummaryCard summary={summary} headingRef={summaryRef} onRestart={restart} />}
        </div>
      </div>

      <ol className={css.track} aria-label={t.track.label}>
        {questions.map((q, i) => (
          <li key={q.id} className={css['track-item']} data-state={stateOf(q)}>
            <span aria-hidden="true">{stateOf(q) === 'solved' ? <EscapeIcon name="check" /> : i + 1}</span>
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

GameEscapeRoom.Init = EscapeInit;

export { GameEscapeRoom };
