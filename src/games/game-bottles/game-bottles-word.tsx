import { useRef } from 'react';
import gsap from 'gsap';

import { SOUNDS } from '@/constants';
import { burst, centerIn, FLIGHT_S, ring } from '@/games/lib/fx';
import { useLang, usePlaySound } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { useGameBottleContext } from './game-bottles-context';
import { i18n } from './lib/i18n';
import { CorrectIcon, WrongIcon } from './lib/icons';
import { CELEBRATION_COLORS, RING_COLOR } from './lib/palette';

import css from './styles/level.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

export const Word = () => {
  const {
    spaces,
    removeLetter,
    setSelectIndex,
    selectIndex,
    openModal,
    PARCIAL_WORD,
    containerRef,
    fxRef,
    canAnimate
  } = useGameBottleContext();
  const lang = useLang();
  const playSound = usePlaySound();
  const t = i18n[lang];

  const trayRef = useRef<HTMLDivElement>(null);
  const filled = spaces.filter(Boolean).length;

  /**
   * Celebración al acertar: ondas y una lluvia de burbujas que suben desde la bandeja.
   * (El error se muestra con un temblor de CSS: no necesita JS.)
   */
  useGSAP(
    () => {
      const fx = fxRef.current;
      const tray = trayRef.current;
      if (openModal !== 'success' || !canAnimate || !fx || !tray) return;

      const layerRect = fx.getBoundingClientRect();
      const trayRect = tray.getBoundingClientRect();
      const center = centerIn(trayRect, layerRect);

      [-0.3, 0, 0.3].forEach((offset, i) => {
        gsap.delayedCall(i * 0.12, () => {
          const at = { x: center.x + trayRect.width * offset, y: center.y };

          ring(fx, at, css.ripple, RING_COLOR, 0.45);
          burst(fx, at, {
            className: css.shard,
            colors: CELEBRATION_COLORS,
            count: 14,
            reach: [50, 150],
            size: [8, 17],
            gravity: -120
          });
        });
      });
    },
    { scope: containerRef, dependencies: [openModal, canAnimate] }
  );

  const handleSlotClick = (index: number) => {
    if (index !== selectIndex) playSound(SOUNDS.TICK);
    setSelectIndex(index);
  };

  const handleSlotKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key !== 'Backspace' && event.key !== 'Delete') return;
    if (!spaces[index]) return;

    event.preventDefault();
    removeLetter(index);
  };

  const status = [
    t.assembled(PARCIAL_WORD),
    openModal === 'success' ? t.correct : openModal === 'wrong' ? t.wrongHint : ''
  ]
    .filter(Boolean)
    .join('. ');

  return (
    <div ref={trayRef} className={css.tray} data-state={openModal ?? undefined}>
      <span className={css.sheen} aria-hidden="true" />

      {/* Se anuncia lo que se arma y el resultado, sin interrumpir (antes era `assertive`) */}
      <p role="status" className="u-sr-only">
        {status}
      </p>

      <div className={css.tray__head} aria-hidden="true">
        <span className={css.tag}>{t.wordTag}</span>
        <span className={css.counter}>
          {pad(filled)}/{pad(spaces.length)}
        </span>
        {openModal && (openModal === 'wrong' ? <WrongIcon /> : <CorrectIcon />)}
      </div>

      <div className={css.slots} role="group" aria-label={t.slots}>
        {spaces.map((obj, i) => {
          const isSelected = selectIndex === i;
          const canRemove = !!obj && isSelected && openModal === null;

          return (
            <div key={i} className={css.slot__wrap} style={{ '--i': i } as React.CSSProperties}>
              <button
                type="button"
                className={css.slot}
                data-slot={i}
                disabled={!!openModal}
                data-empty={obj ? undefined : true}
                data-selected={!openModal && isSelected ? true : undefined}
                aria-current={isSelected ? 'true' : undefined}
                aria-label={obj ? t.slotFilled(i + 1, obj.letter) : t.slotEmpty(i + 1)}
                onClick={() => handleSlotClick(i)}
                onKeyDown={(event) => handleSlotKeyDown(event, i)}
              >
                {obj && (
                  <span
                    key={obj.index}
                    className={css.slot__letter}
                    style={canAnimate ? ({ '--land-delay': `${FLIGHT_S}s` } as React.CSSProperties) : undefined}
                  >
                    {obj.letter}
                  </span>
                )}
                <span className={css.slot__cursor} aria-hidden="true" />
              </button>

              {canRemove && (
                <button
                  type="button"
                  className={css.slot__remove}
                  onClick={() => removeLetter(i)}
                  aria-label={t.remove(i + 1, obj.letter)}
                >
                  <span aria-hidden="true">&#10005;</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
