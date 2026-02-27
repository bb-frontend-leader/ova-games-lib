import { Button } from 'books-ui';

import { usePhraseAndImageContext } from './game-phrase-context';

import css from './phrase-and-image.module.css';
interface Props {
  children?: JSX.Element | JSX.Element[];
  join: number;
}

export const TextElement = ({ children, join }: Props) => {
  const { handleSelectText } = usePhraseAndImageContext();
  return (
    <Button className={css.cardText} onClick={() => handleSelectText(join, children || null)}>
      <div className={css.textElemet}>{children}</div>
    </Button>
  );
};
