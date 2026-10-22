import { useLang } from '@/hooks';

import { Chip } from './game-casino-chips';
import { useGameCasinoProvider } from './game-casino-context';
import { chipKind } from './lib/chips';
import { i18n } from './lib/constant';

import css from './game-casino.module.css';

interface Props {
  id: string;
  name: string;
  label: string;
  state: 'success' | 'wrong';
  bullet: string;
}

export const CasinoElement = ({ id, name, label, state, bullet }: Props) => {
  const lang = useLang();
  const t = i18n[lang];
  const { pickAnswer, answer, chip, validation, result } = useGameCasinoProvider();

  const isSelected = answer?.id === id;
  const amount = isSelected && chip ? chip : 0;
  const status = isSelected && validation ? state : '';

  return (
    <label className={css.card} data-selected={isSelected || undefined} data-state={status || undefined}>
      <input
        type="radio"
        className={css['card-input']}
        name={`casino-${name}`}
        value={id}
        checked={isSelected}
        disabled={validation}
        onChange={() => pickAnswer({ id, name, label, state, bullet })}
      />

      <span className={css.badge} aria-hidden="true">
        {bullet}
      </span>

      <span className={css['card-text']}>
        {label}
        {/* El resultado no depende del color ni del icono: también se lee */}
        {status && <span className={css['sr-only']}> — {status === 'success' ? t.correct : t.wrong}</span>}
      </span>

      {/* Casilla de apuesta: aquí se posa la ficha. Es decorativa, la apuesta se lee en el aviso del juego. */}
      <span
        className={css.spot}
        data-spot={id}
        data-need={isSelected && !chip && !validation ? '' : undefined}
        aria-hidden="true"
      >
        {amount > 0 && !validation && <Chip key={amount} kind={chipKind(amount)} className={css['spot-chip']} />}
        {amount > 0 && validation && (
          <span className={css.tag} data-won={result || undefined}>
            {result ? '+' : '−'}${amount}
          </span>
        )}
      </span>
    </label>
  );
};
