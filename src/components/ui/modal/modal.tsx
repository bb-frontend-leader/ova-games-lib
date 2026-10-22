import type { ModalProps } from 'books-ui';
import { Modal as ModalUI } from 'books-ui';

import { useLang } from '@/hooks';
import { cn } from '@/utils';

import { CloseIcon } from '../icons';

import css from './modal.module.css';

export interface ModalCoreProps extends ModalProps {
  addClass?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const i18n = {
  es: { close: 'Cerrar ventana' },
  en: { close: 'Close dialog' }
};

/** Ventana modal con botón de cierre. El foco queda atrapado y se cierra con Escape (lo resuelve `books-ui`). */
export const Modal: React.FC<ModalCoreProps> = ({ addClass, children, isOpen, onClose, size, ...props }) => {
  const lang = useLang();

  return (
    <ModalUI {...props} isOpen={isOpen} onClose={onClose}>
      <ModalUI.Overlay addClass={css.overlay} />
      <ModalUI.Content addClass={cn(css.modal, addClass)} {...(size && { ['data-size']: size })}>
        <button type="button" className={css.close} aria-label={i18n[lang].close} onClick={onClose}>
          <CloseIcon />
        </button>
        <>{children}</>
      </ModalUI.Content>
    </ModalUI>
  );
};
