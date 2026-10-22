import { useEffect } from 'react';

import { SOUNDS } from '@/constants';
import { useLang, usePlaySound } from '@/hooks';
import { cn } from '@/utils';

import type { ModalCoreProps } from './modal';
import { Modal } from './modal';

import css from './modal-feedback.module.css';

interface Props extends ModalCoreProps {
  type?: 'wrong' | 'success';
  label?: string;
}

const i18n = {
  es: { success: '¡Correcto!', wrong: '¡Incorrecto!' },
  en: { success: 'Correct!', wrong: 'Incorrect!' }
};

/** Modal con el resultado de una actividad: ícono, título (acierto o error) y el contenido que se le pase. */
export const ModalFeedback: React.FC<Props> = ({
  type = 'success',
  label,
  addClass,
  children,
  size = 'sm',
  isOpen,
  ...props
}) => {
  const lang = useLang();
  const playSound = usePlaySound();

  useEffect(() => {
    if (isOpen) playSound(type === 'success' ? SOUNDS.CORRECT : SOUNDS.WRONG);
  }, [isOpen, type, playSound]);

  return (
    <Modal {...props} isOpen={isOpen} size={size} addClass={cn(css.modal, addClass)}>
      <div className={cn('u-flow', css.wrapper)} data-type={type}>
        <div className={css.icon} aria-hidden="true">
          {type === 'success' ? '✓' : '✕'}
        </div>
        <div className={cn('u-flow', css.response)}>
          <p className={css.title} data-title>
            {label || i18n[lang][type]}
          </p>
          {children}
        </div>
      </div>
    </Modal>
  );
};
