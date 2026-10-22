import { useEffect, useId } from 'react';
import type { TextFieldProps } from 'books-ui';
import { TextField } from 'books-ui';

import { cn } from '@/utils';

import { useInputActivityContext } from './input-activity-context';
import { isCorrectAnswer } from './lib/answer';

import css from './input-activity.module.css';

/**
 * `value`, `defaultValue` y `state` los controla la actividad (el campo se bloquea y muestra
 * el resultado al comprobar), por eso no se reciben desde fuera. El resto de props de `TextField`
 * (`label`, `hint`, `inline`, `isLabelVisible`, `size`, `maxLength`, ...) se pasan tal cual.
 */
interface Props extends Omit<TextFieldProps, 'value' | 'defaultValue' | 'state' | 'name'> {
  correctAnswers: string[];
  name: string;
}

export const InputElement: React.FC<Props> = ({ id, correctAnswers, name, addClass, onChange, ...props }) => {
  const { inputs, validation, registerInput, unregisterInput, changeInput } = useInputActivityContext();
  const reactId = useId();

  const uid = id || reactId;

  // `correctAnswers` suele llegar como un literal nuevo en cada render: se registra por su contenido.
  const correctKey = JSON.stringify(correctAnswers);

  // La actividad conoce el campo mientras esté montado: así sabe cuántos hay y cuáles siguen vacíos.
  useEffect(() => {
    registerInput({ id: uid, name, correctAnswer: JSON.parse(correctKey) as string[] });
  }, [uid, name, correctKey, registerInput]);

  useEffect(() => () => unregisterInput(uid), [uid, unregisterInput]);

  // La respuesta vive en la actividad: al reiniciar basta con que ella la limpie.
  const userAnswer = inputs.find((input) => input.id === uid)?.userAnswer ?? '';

  const state = validation ? (isCorrectAnswer(userAnswer, correctAnswers) ? 'right' : 'wrong') : 'normal';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeInput(uid, e.target.value);
    onChange?.(e);
  };

  return (
    <TextField
      {...props}
      id={uid}
      name={name}
      value={userAnswer}
      onChange={handleChange}
      disabled={validation}
      state={state}
      addClass={cn(css['field'], addClass)}
    />
  );
};
