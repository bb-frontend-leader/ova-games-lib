import { Audio, Button } from 'books-ui';

import { usePhraseAndImageContext } from './game-phrase-context';

import css from './phrase-and-image.module.css';
type ImgType = {
  id: number;
  join: number;
  urlAudio: string;
};
export const AudioElement = ({ id, join, urlAudio, ...props }: ImgType) => {
  const { handleSelectAudio } = usePhraseAndImageContext();
  console.log('urlAudio', urlAudio);
  return (
    <div className={`${css.card} ${css.cardAudioModal}`}>
      <Audio src={urlAudio} type="button" addClass={css.audioButton} />
      <Button {...props} id={`image_${id}`} data-join={join} onClick={() => handleSelectAudio(urlAudio, join || 0)}>
        Seleccione
      </Button>
    </div>
  );
};
