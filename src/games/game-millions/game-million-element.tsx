import { useEffect, useId } from 'react';

import { useLang } from '@/hooks';

import { i18n } from './const/const';
import { useGameMillionContext } from './game-million-context';
import { CorrectIcon, WrongIcon } from './icons_/icons';

import css from './game-millions.module.css';

type GameMillionElementProps = {
  id: string;
  label: string;
  state: 'success' | 'wrong';
  name: string;
};

export const GameMillionElement = ({ id, state, label, name, ...props }: GameMillionElementProps) => {
  const reactId = useId();
  const lang = useLang();
  const { activity, solved, handleStateClass, addRadioElementsId, addRadiosValues, restoreSolved, handleChange } =
    useGameMillionContext();

  const uid = id || reactId;
  const radioName = `radio-group-${name}`;
  const status = handleStateClass(uid, state);

  /**
   * Maneja el evento onChange.
   */
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    addRadiosValues({ id: uid, name: radioName, state, label });
    handleChange(event);
  };

  useEffect(() => {
    addRadioElementsId(uid);
  }, [uid, addRadioElementsId]);

  // Pregunta ya resuelta (el estudiante volvió a ella): la respuesta correcta aparece marcada y comprobada
  useEffect(() => {
    if (solved && state === 'success') restoreSolved({ id: uid, name: radioName, state, label });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <label className={css['answer']} data-state={status}>
      <input
        id={uid}
        type="radio"
        className={css['answer-input']}
        name={radioName}
        onChange={onChange}
        // Controlado: al reintentar, la respuesta anterior deja de estar marcada y se puede volver a elegir
        checked={activity.selects.includes(uid)}
        disabled={activity.isVerify}
        {...props}
      />

      {/* Aro de foco, marco y relleno: decorativos (la letra A, B, C… sale de un contador CSS) */}
      <span className={css.halo} aria-hidden="true" />
      <span className={css.frame} aria-hidden="true" />
      <span className={css.letter} aria-hidden="true" />

      <span className={css.text}>
        {label}
        {/* El resultado no depende del color ni del icono: también se lee */}
        {(status === 'success' || status === 'wrong') && (
          <span className={css['sr-only']}> — {status === 'success' ? i18n[lang].Correct : i18n[lang].Wrong}</span>
        )}
      </span>

      <WrongIcon />
      <CorrectIcon />
    </label>
  );
};
