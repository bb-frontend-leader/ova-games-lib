import { useEffect, useId, useMemo } from 'react';

import { SOUNDS } from '@/constants';
import { usePlaySound } from '@/hooks';

import { useGameQuestionCardContext, useGameQuestionContext } from './game-question-context';

import type { RadioStates } from './types/types';

import css from './game-question.module.css';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  addClass?: string;
  label: string;
  state: RadioStates;
}

/**
 * Una respuesta: una nota adhesiva con su letra (A, B, C…). La letra sale de un contador de CSS, así que el
 * componente no necesita saber su posición.
 */
export const GameQuestionRadio: React.FC<Props> = ({ id, addClass, state, label, name, ...props }) => {
  const reactId = useId();

  const { addRadiosValues, addElementsId, validation, options } = useGameQuestionContext();
  const card = useGameQuestionCardContext();
  const playSound = usePlaySound();

  const uid = id || reactId;
  const radioName = `radio-group-question-${name}`;

  // ✅ seleccionado sale del CONTEXTO
  const isSelected = useMemo(() => {
    return options?.some((opt) => opt.name === radioName && opt.id === uid);
  }, [options, radioName, uid]);

  // idle · chosen (elegida, sin comprobar) · correct / wrong (la elegida, ya comprobada) · dimmed (las demás, comprobada)
  const visual = isSelected
    ? validation
      ? state === 'success'
        ? 'correct'
        : 'wrong'
      : 'chosen'
    : validation
      ? 'dimmed'
      : 'idle';

  const handleChange = () => {
    playSound(SOUNDS.TICK);
    addRadiosValues({ id: uid, name: radioName, state, label });
  };

  /**
   * Registra el ID de la respuesta en la actividad y en su tarjeta.
   */
  useEffect(() => {
    addElementsId(uid);
    card.register(uid);
  }, [uid, addElementsId, card]);

  return (
    <div className={`${css.option} ${addClass ?? ''}`} data-visual={visual}>
      <input
        {...props}
        type="radio"
        id={uid}
        value={uid}
        name={radioName}
        disabled={validation}
        className={css.radioOption}
        checked={isSelected}
        onChange={handleChange}
      />
      <label htmlFor={uid}>
        <span>{label}</span>
      </label>
    </div>
  );
};
