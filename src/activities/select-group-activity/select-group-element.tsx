import { useEffect, useId, useMemo, useState } from 'react';
import type { Key } from 'react-stately';
import { Item } from 'react-stately';
import type { SelectProps as SelectPropsUI } from 'books-ui';
import { Select } from 'books-ui';

import { SOUNDS } from '@/constants';
import { usePlaySound } from '@/hooks';
import { cn } from '@/utils';

import { useSelectGroupActivityContext } from './select-group-activity-context';

// El select es el mismo de select-activity: comparte su módulo CSS (control, lista desplegable y estados)
// para que ambas actividades se vean siempre igual.
import css from '../select-activity/select.module.css';

type OptionType = {
  id: string;
  option: string;
};

interface Props extends SelectPropsUI {
  id?: string;
  addClass?: string;
  options: OptionType[];
  name: string;
  placeholder?: string;
}

export const SelectElement: React.FC<Props> = ({ id, addClass, options, placeholder = '', name, ...props }) => {
  const reactId = useId();
  const uid = id || reactId;
  const playSound = usePlaySound();

  const { addSelectedValues, selectedOptions, addSelectElementsId, validation, answers } =
    useSelectGroupActivityContext();
  const [currentSelectedOption, setCurrentSelectedOption] = useState<{ key: Key | null; state: string | null }>({
    key: null,
    state: null
  });

  /**
   * Maneja el evento onSelectionChange.
   * @param selectedOption - Opción seleccionada
   */
  const handleSelectionChange = (selectedOption: Key | null) => {
    playSound(SOUNDS.TICK);
    addSelectedValues({ id: uid, answer: selectedOption as string });
    setCurrentSelectedOption({ key: selectedOption, state: null });
  };

  /**
   * Opciones ya elegidas en OTROS selects: se deshabilitan. La de este select no se tacha, se muestra como la elegida.
   */
  const disabledKeys = useMemo(
    () => selectedOptions.filter((option) => option !== currentSelectedOption.key),
    [selectedOptions, currentSelectedOption.key]
  );

  useEffect(() => {
    // Limpia el Select si todas las opciones seleccionadas son removidas
    if (selectedOptions.length === 0 && !!currentSelectedOption.key) {
      setCurrentSelectedOption({ key: null, state: null });
    }
  }, [selectedOptions, currentSelectedOption]);

  useEffect(() => {
    if (!currentSelectedOption.key && !validation) return;

    // Busca la opción correspondiente en las respuestas
    const matchingOption = answers.find(({ option }) => option.includes(currentSelectedOption.key as string));
    if (!matchingOption) return;

    // Actualiza el estado de la opción seleccionada con el estado encontrado
    setCurrentSelectedOption((prev) => ({ ...prev, state: matchingOption.state }));
  }, [answers, validation, currentSelectedOption.key]);

  useEffect(() => {
    addSelectElementsId(uid);
  }, [uid, addSelectElementsId]);

  return (
    <Select
      value={currentSelectedOption.key}
      addClass={cn(
        css['select'],
        !currentSelectedOption.key && css['select--empty'],
        validation && css[`select--${currentSelectedOption.state}`],
        addClass
      )}
      disabledKeys={disabledKeys}
      isDisabled={validation}
      onChange={handleSelectionChange}
      placeholder={placeholder}
      name={name}
      {...props}
    >
      {options.map(({ id, option }) => (
        <Item key={id} textValue={option}>
          <span id={name} dangerouslySetInnerHTML={{ __html: option }}></span>
        </Item>
      ))}
    </Select>
  );
};
