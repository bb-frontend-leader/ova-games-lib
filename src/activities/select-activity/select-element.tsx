import { useEffect, useId, useMemo, useState } from 'react';
import type { Key } from 'react-stately';
import { Item } from 'react-stately';
import type { SelectProps as SelectPropsUI } from 'books-ui';
import { Select } from 'books-ui';

import { SOUNDS } from '@/constants';
import { usePlaySound } from '@/hooks';
import { cn } from '@/utils';

import { useSelectActivityContext } from './select-activity-context';

import { States } from './types/types';

import css from './select.module.css';

type OptionType = {
  id: string;
  option: string;
};

interface Props extends SelectPropsUI {
  id?: string;
  addClass?: string;
  correctAnswer: string | string[];
  options: OptionType[];
  name: string;
  placeholder?: string;
}

export const SelectElement: React.FC<Props> = ({
  id,
  correctAnswer,
  addClass,
  options,
  placeholder = '',
  name,
  ...props
}) => {
  const reactId = useId();
  const uid = id || reactId;
  const playSound = usePlaySound();

  const { addSelectedValues, selectedOptions, allowRepeatOptions, addSelectElementsId, validation } =
    useSelectActivityContext();
  const [currentSelectedOption, setCurrentSelectedOption] = useState<{ key: Key | null; state: string | null }>({
    key: null,
    state: null
  });

  /**
   * Maneja el evento onSelectionChange.
   * @param selectedOption - Opción seleccionada
   */
  const handleSelectionChange = (selectedOption: Key | null) => {
    if (!selectedOption) return;

    playSound(SOUNDS.TICK);

    const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];

    const selectionState = correctAnswers.includes(selectedOption as string) ? States.SUCCESS : States.WRONG;

    addSelectedValues({
      id: uid,
      answer: selectedOption as string,
      state: selectionState
    });

    setCurrentSelectedOption({
      key: selectedOption,
      state: selectionState
    });
  };

  /**
   * Genera la lista de opciones ya elegidas en OTROS selects para deshabilitarlas.
   * La opción de este select no se tacha: se muestra como la elegida.
   */
  const disabledKeys = useMemo(() => {
    if (allowRepeatOptions) return [];
    return selectedOptions.filter(({ id }) => id !== uid).map(({ answer }) => answer);
  }, [allowRepeatOptions, selectedOptions, uid]);

  useEffect(() => {
    // Limpia el Select si todas las opciones seleccionadas son removidas
    if (selectedOptions.length === 0 && !!currentSelectedOption.key) {
      setCurrentSelectedOption({ key: null, state: null });
    }
  }, [selectedOptions, currentSelectedOption]);

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
