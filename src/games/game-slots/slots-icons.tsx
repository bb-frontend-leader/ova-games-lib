import { ICON_PATHS, type IconName } from './lib/icons';

import type { SlotsSymbol } from './types/types';

const STROKED: IconName[] = ['check', 'cross'];

interface Props extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
}

export const SlotsIcon: React.FC<Props> = ({ name, ...props }) => {
  const stroked = STROKED.includes(name);

  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      fill={stroked ? 'none' : 'currentColor'}
      stroke={stroked ? 'currentColor' : 'none'}
      strokeWidth={stroked ? 2.4 : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
};

/**
 * Símbolo de un carrete. Cada uno tiene forma propia además de color, así se distinguen sin depender del color.
 */
export const SlotSymbol: React.FC<{ name: SlotsSymbol }> = ({ name }) => (
  <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" strokeLinecap="round" strokeLinejoin="round">
    {name === 'cherry' && (
      <>
        <path d="M24 8c-2 8-8 14-10 22M24 8c2 8 8 14 10 22" fill="none" stroke="#2f7d2c" strokeWidth="2.6" />
        <path d="M24 8c4-4 10-4 14-1-4 4-10 5-14 1Z" fill="#3fa23a" stroke="#2f7d2c" strokeWidth="1.5" />
        <circle cx="13" cy="34" r="8" fill="#d11a3c" stroke="#7a0a1f" strokeWidth="2" />
        <circle cx="35" cy="34" r="8" fill="#d11a3c" stroke="#7a0a1f" strokeWidth="2" />
        <circle cx="10.5" cy="31" r="2" fill="#ffffff" opacity="0.8" />
        <circle cx="32.5" cy="31" r="2" fill="#ffffff" opacity="0.8" />
      </>
    )}
    {name === 'bell' && (
      <>
        <path
          d="M24 6a3 3 0 0 1 3 3v1c6 2 9 7 9 14v5l4 4v2H8v-2l4-4v-5c0-7 3-12 9-14V9a3 3 0 0 1 3-3Z"
          fill="#ffb81c"
          stroke="#9a5f00"
          strokeWidth="2"
        />
        <path d="M17 18c1-3 3-5 6-6" fill="none" stroke="#fff3b0" strokeWidth="2.4" />
        <circle cx="24" cy="40" r="4" fill="#9a5f00" />
      </>
    )}
    {name === 'star' && (
      <path
        transform="translate(0 1) scale(2)"
        d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2 2 9.3l6.9-1Z"
        fill="#ffd23f"
        stroke="#a56a00"
        strokeWidth="1.1"
      />
    )}
    {name === 'seven' && <path d="M10 9h28v6L21 41h-9l16-26H10Z" fill="#e0182d" stroke="#6f0713" strokeWidth="2.4" />}
    {name === 'diamond' && (
      <>
        <path d="M24 42 5 18l8-10h22l8 10Z" fill="#4fd0ff" stroke="#0a6e9a" strokeWidth="2.2" />
        <path d="M5 18h38M13 8l5 10 6 24 6-24 5-10" fill="none" stroke="#0a6e9a" strokeWidth="1.6" />
        <path d="M13 8h8l-3 10H5Z" fill="#c9f1ff" opacity="0.8" />
      </>
    )}
  </svg>
);
