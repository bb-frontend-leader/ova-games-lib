import { Image as ImageUI } from 'books-ui';

import css from './image.module.css';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  title?: string;
  size: string;
  hasHtml?: boolean;
  addClass?: string;
  noCaption?: boolean;
}

export const Image: React.FC<Props> = ({ src, title = '', alt = '', size, hasHtml, noCaption, ...props }) => {
  const parsedAlt = hasHtml ? alt.replace(/<[^>]*>/g, '') : alt;
  const Element = noCaption ? 'div' : 'figure';

  return (
    <Element className="u-my-0.5">
      <ImageUI src={src} alt={`${title} ${parsedAlt}`} size={size} noCaption {...props} />
      {!noCaption ? (
        <figcaption className={css['image__figcaption']}>
          <p className="u-font-bold">{title}</p>&nbsp;
          <p dangerouslySetInnerHTML={{ __html: alt }}></p>
        </figcaption>
      ) : null}
    </Element>
  );
};
