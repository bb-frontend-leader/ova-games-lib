import { useId } from 'react';

import { SOUNDS } from '@/constants';
import { useLang, usePlaySound } from '@/hooks';

import { i18n } from './lib/constant';
import { useStopScene } from './stop-card-context';

import type { RadioStates } from './types/types';

import css from './stop-card.module.css';

interface PropsStopCardRadio extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> {
  id?: string;
  /** Grupo de la pregunta (una por parada): el input se llama `game-stop-group-<name>`. */
  name?: string;
  addClass?: string;
  label: string;
  state: RadioStates;
}

/**
 * Una respuesta: un letrero con su letra (A, B, C…). Una vez comprobada, la elegida muestra si fue correcta y las
 * incorrectas quedan descartadas (tachadas) aunque se reintente.
 */
export const StopCardRadio: React.FC<PropsStopCardRadio> = ({ id, label, state, name, addClass, ...props }) => {
  const reactId = useId();
  const lang = useLang();
  const playSound = usePlaySound();
  const scene = useStopScene();

  const radioID = id || reactId;
  const radioName = `game-stop-group-${name}`;

  const selected = scene.choice?.id === radioID;
  const discarded = scene.discarded.includes(radioID);
  const answered = scene.status !== 'idle';

  // correct / wrong (la elegida y comprobada) · discarded (incorrecta de un intento anterior) · chosen · idle
  const visual =
    selected && answered
      ? scene.status === 'correct'
        ? 'correct'
        : 'wrong'
      : discarded
        ? 'discarded'
        : selected
          ? 'chosen'
          : 'idle';

  const handleChange = () => {
    playSound(SOUNDS.TICK);
    scene.choose({ id: radioID, name: radioName, state });
  };

  return (
    <div className={`${css.sign} ${addClass ?? ''}`} data-visual={visual} {...props}>
      <input
        id={radioID}
        type="radio"
        name={radioName}
        value={state}
        onChange={handleChange}
        checked={selected}
        disabled={scene.locked || answered || discarded}
        data-state={state}
        data-input="svg"
      />
      <label htmlFor={radioID}>
        <span dangerouslySetInnerHTML={{ __html: label }} />
        {visual === 'wrong' || visual === 'discarded' ? (
          <span className="u-sr-only"> ({i18n[lang].say.discarded})</span>
        ) : null}
      </label>
    </div>
  );
};
