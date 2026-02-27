import { silverAmount } from './types/types';
import { BG } from './const';
import { useGameCasinoProvider } from './game-casino-context';

import css from './game-casino.module.css';

interface Props {
  id: string;
  name: string;
  label: string;
  state: 'success' | 'wrong';
  bullet: string;
}

export const CasinoElement = ({ id, name, label, state, bullet }: Props) => {
  const { addSelectedOption, options, validation, point } = useGameCasinoProvider();

  const selectedOption = options[0];
  const isSelected = selectedOption?.id === id;

  return (
    <div className={css['casino-element']}>
      <article
        data-label={bullet} // <--- Atributo clave para el CSS
        className={`
        ${isSelected && validation && state === 'success' ? css.success : ''}
        ${isSelected && validation && state === 'wrong' ? css.wrong : ''}
      `}>
        <label>{label}</label>
        <div className={css['casino-element-amount']}>
          {silverAmount.map((amt) => (
            <button
              key={amt}
              type="button"
              disabled={validation || (options.length > 0 && !isSelected) || point < amt}
              className={isSelected && selectedOption?.amount === amt ? css.selected : ''}
              onClick={() => addSelectedOption({ id, name, label, state, amount: amt })}>
              <span>${amt}</span>
              <img src={amt === 10 ? BG.moneda1 : amt === 15 ? BG.moneda2 : BG.moneda3} alt="" />
            </button>
          ))}
        </div>
      </article>
    </div>
  );
};
