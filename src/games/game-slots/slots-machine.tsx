import { useLang } from '@/hooks';

import { i18n, PAY, SYMBOLS } from './lib/constant';
import { SlotSymbol } from './slots-icons';

import type { SlotsSymbol, Tier } from './types/types';

import css from './game-slots.module.css';

interface Props {
  /** Tira de símbolos de cada carrete (los visibles son los de las posiciones `length - 4` a `length - 2`). */
  strips: readonly (readonly SlotsSymbol[])[];
  /** Cambia con cada tirada: así las tiras se montan de nuevo y empiezan desde arriba. */
  spinId: number;
  /** Cada tira se registra aquí para que el juego la haga girar. */
  stripRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>;
  leverRef?: React.Ref<HTMLDivElement>;
  armRef?: React.Ref<HTMLSpanElement>;
  ballRef?: React.Ref<HTMLSpanElement>;
  /** Cómo salió la última tirada: ilumina la línea central y los focos. */
  win?: Tier | null;
  /** Descripción accesible de los carretes. */
  label: string;
  /** Si se puede tirar de la palanca con el puntero (el botón del panel hace lo mismo con el teclado). */
  onLever?: () => void;
}

/**
 * La máquina: marquesina, tres carretes con la línea de premio, palanca y tabla de premios. Solo dibuja: quien la
 * usa hace girar las tiras (`stripRefs`) y mueve la palanca.
 */
export const SlotsMachine: React.FC<Props> = ({
  strips,
  spinId,
  stripRefs,
  leverRef,
  armRef,
  ballRef,
  win = null,
  label,
  onLever
}) => {
  const lang = useLang();
  const t = i18n[lang];

  return (
    <div className={css.machine} data-win={win ?? undefined}>
      <div className={css.bulbs} aria-hidden="true" />
      <p className={css['machine-title']}>{t.title}</p>

      <div className={css['machine-body']}>
        <div className={css.window} role="img" aria-label={label}>
          {strips.map((strip, r) => (
            <div key={r} className={css.reel} aria-hidden="true">
              <div
                key={spinId}
                ref={(el) => {
                  if (stripRefs) stripRefs.current[r] = el;
                }}
                className={css.strip}
              >
                {strip.map((symbol, i) => (
                  <div key={i} className={css.sym}>
                    <SlotSymbol name={symbol} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <span className={css.payline} aria-hidden="true" />
        </div>

        <div
          ref={leverRef}
          className={css.lever}
          data-active={onLever ? '' : undefined}
          aria-hidden="true"
          onClick={onLever}
        >
          <span className={css['lever-base']} />
          <span ref={armRef} className={css['lever-arm']} />
          <span ref={ballRef} className={css['lever-ball']} />
        </div>
      </div>

      <ul className={css.paytable} aria-label={t.paytable.label}>
        {SYMBOLS.map((symbol) => (
          <li key={symbol} className={css['pay-item']}>
            <span className={css['pay-symbol']} aria-hidden="true">
              <SlotSymbol name={symbol} />
            </span>
            <span className={css['pay-values']} aria-hidden="true">
              <span>
                <b>×3</b> {PAY[symbol].triple}
              </span>
              <span>
                <b>×2</b> {PAY[symbol].pair}
              </span>
            </span>
            <span className="u-sr-only">{t.paytable.row(t.symbols[symbol], PAY[symbol].triple, PAY[symbol].pair)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
