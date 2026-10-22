import { SOUNDS } from '@/constants';
import { usePlaySound } from '@/hooks';
import { cn } from '@/utils';

import css from './button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Texto del botón; si no hay `children`, es también lo que se muestra. */
  label: string;
  variant?: ButtonVariant;
  addClass?: string;
  children?: React.ReactNode;
}

export const Button: React.FC<Props> = ({
  label,
  variant = 'primary',
  addClass,
  children,
  type = 'button',
  onClick,
  ...props
}) => {
  const playSound = usePlaySound();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    playSound(SOUNDS.BUTTON);
    onClick?.(event);
  };

  return (
    <button
      type={type}
      aria-label={children === undefined ? undefined : label}
      {...props}
      className={cn(css.button, addClass)}
      data-variant={variant}
      onClick={handleClick}
    >
      {children ?? label}
    </button>
  );
};
