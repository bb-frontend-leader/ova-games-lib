import { createElement, ElementType, ReactNode } from 'react';

import css from './img-container.module.css';

type ImgContainerProps = {
  children?: ReactNode;
  addClass?: string;
  height?: string;
  width?: string;
  background?: string;
  backgroundSize?: string;
  element?: ElementType;
  padding?: string;
  zIndex?: string;
} & React.HTMLAttributes<HTMLElement>;

export const ImgContainer = ({
  children,
  addClass,
  height,
  width,
  padding,
  background,
  backgroundSize,
  element: Component = 'div',
  zIndex,
  ...props
}: ImgContainerProps) => {
  const validationProperties = () => {
    const customProperties: Record<string, string> = {};

    if (height) customProperties['--height'] = height;
    if (width) customProperties['--width'] = width;
    if (padding) customProperties['--border-size'] = padding;
    if (zIndex) customProperties['z-index'] = zIndex;
    if (background) customProperties['--img-background'] = `url(${background})`;
    if (backgroundSize) customProperties['borderImageWidth'] = backgroundSize;

    return customProperties;
  };

  return createElement(
    Component,
    {
      className: `${css['c-image-container']} ${addClass ?? ''}`,
      style: validationProperties(),
      ...props
    },
    children
  );
};
