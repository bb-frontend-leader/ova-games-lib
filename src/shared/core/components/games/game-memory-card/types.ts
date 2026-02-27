import { ReactNode } from 'react';

export type CardType = {
  id: number;
  frontContent: ReactNode;
  backContent: ReactNode;
  flipped: boolean;
  matched: boolean;
};
