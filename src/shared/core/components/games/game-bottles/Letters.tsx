import { useEffect } from 'react';

import Bottle from './Bottle';
import { useGameBottle } from './useGameBottle';

import css from './styles/level.module.css';

interface Props {
  word?: string;
}

export const Letters = ({ word }: Props) => {
  const { setTargetWord, words, addLetter } = useGameBottle();
  useEffect(() => {
    setTargetWord(word || '');
  }, [word, setTargetWord]);
  return (
    <div className={css.container__bottles}>
      {words.map((props) => (
        <Bottle
          key={props.index}
          letter={props.letter}
          enable={props.enable}
          index={props.index}
          onClick={() => addLetter(props)}
        />
      ))}
    </div>
  );
};
