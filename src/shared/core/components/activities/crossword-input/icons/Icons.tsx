import React from 'react';

interface Props {
  styles?: React.CSSProperties;
}

export const ArrowForward = ({ styles }: Props) => {
  return (
    <svg
      style={styles}
      xmlns="http://www.w3.org/2000/svg"
      height="36px"
      viewBox="0 -960 960 960"
      width="48px"
      fill="#0f4f80">
      <path d="M321-80l-71-71 329-329-329-329 71-71 400 400L321-80z" />
    </svg>
  );
};

export const ArrowBack = ({ styles }: Props) => {
  return (
    <svg
      style={styles}
      xmlns="http://www.w3.org/2000/svg"
      height="36px"
      viewBox="0 -960 960 960"
      width="48px"
      fill="#0f4f80">
      <path d="M400-80L0-480l400-400 71 71-329 329 329 329-71 71z" />
    </svg>
  );
};
