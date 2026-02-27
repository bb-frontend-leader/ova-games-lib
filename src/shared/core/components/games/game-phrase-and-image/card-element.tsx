import { Audio, Button, Image } from 'books-ui';

import { usePhraseAndImageContext } from './game-phrase-context';

import css from './phrase-and-image.module.css';

type card = {
  id: number;
  join: number;
  phrase: string;
  img?: string;
  state: boolean | null;
  alt?: string | null;
  urlAudio?: string | null;
  type: 'image' | 'text' | 'audio';
  textChildren?: JSX.Element | JSX.Element[] | null;
};
export const CardElement: React.FC<card> = ({
  id,
  join,
  phrase,
  state,
  img,
  urlAudio,
  type,
  textChildren,
  ...props
}) => {
  const { handleOpenModal, validation, button } = usePhraseAndImageContext();

  const handleAudioClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };
  return (
    <Button
      disabled={button}
      {...props}
      className={type === 'audio' ? css.cardAudioSlide : css.card}
      id={`card_${id} `}
      data-join={join}
      onClick={() => handleOpenModal(id, join)}>
      {type === 'text' &&
        (textChildren ? (
          <div className={css.textChildren}>{textChildren}</div>
        ) : (
          <Image
            size="100%"
            addClass={css.imageQuestion}
            noCaption
            src="assets/images/cardSelectImage/question.png"
            alt="Imagen de un signo de interrogación."
          />
        ))}
      {type === 'audio' &&
        (state != null ? (
          <div onClick={handleAudioClick} className={css.containerAudio}>
            <Audio src={urlAudio || ''} type="button" />
          </div>
        ) : (
          <Image
            size="100%"
            addClass={css.imageQuestion}
            noCaption
            src="assets/images/cardSelectImage/question.png"
            alt="Imagen de un signo de interrogación."
          />
        ))}
      {type === 'image' && <Image size="100%" addClass={css.imageQuestion} noCaption src={img || ''} />}
      {/* <img src={img} alt={alt} /> */}
      <p data-value={validation ? state : null} className={css.textCard}>
        {phrase}
      </p>
    </Button>
  );
};
