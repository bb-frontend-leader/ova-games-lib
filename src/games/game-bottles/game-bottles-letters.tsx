import { useEffect } from 'react';

import { useLang } from '@/hooks';

import Bottle from './game-bottles-bottle';
import { useGameBottleContext } from './game-bottles-context';
import { i18n } from './lib/i18n';

import css from './styles/level.module.css';

interface Props {
  word?: string;
}

export const Letters = ({ word }: Props) => {
  const { setTargetWord, words, addLetter, resetWave } = useGameBottleContext();
  const t = i18n[useLang()];

  useEffect(() => {
    setTargetWord(word || '');
  }, [word, setTargetWord]);

  return (
    <div className={css.bottles} role="group" aria-label={t.bottles}>
      {words.map((props, i) => (
        <Bottle
          key={props.index}
          letter={props.letter}
          enable={props.enable}
          index={props.index}
          order={i}
          respawnDelay={resetWave ? i * 0.06 : 0}
          onPick={(button) => addLetter(props, button)}
        />
      ))}
    </div>
  );
};
