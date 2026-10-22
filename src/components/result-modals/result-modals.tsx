import { ModalFeedback } from '@/components/ui';

export type ResultState = 'success' | 'wrong' | null;

interface Props {
  /** Qué modal está abierto. */
  open: ResultState;
  onClose: () => void;
  /** Texto cuando la respuesta es correcta. */
  success: React.ReactNode;
  /** Texto cuando la respuesta es incorrecta. */
  wrong: React.ReactNode;
}

/** Par de modales «correcto / incorrecto» que usan casi todos los juegos y actividades. */
export const ResultModals: React.FC<Props> = ({ open, onClose, success, wrong }) => (
  <>
    <ModalFeedback type="success" isOpen={open === 'success'} onClose={onClose} finalFocusRef="#main">
      <p className="u-text-center">{success}</p>
    </ModalFeedback>
    <ModalFeedback type="wrong" isOpen={open === 'wrong'} onClose={onClose} finalFocusRef=".js-modal-wrong">
      <p className="u-text-center">{wrong}</p>
    </ModalFeedback>
  </>
);
