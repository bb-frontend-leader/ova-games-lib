// Define la interfaz para el contexto de actividad
export interface GameCastleContextType {
  addSelectAnswer: (uid: string) => void;
  checkAnswers: () => void;
  resetActivity: () => void;
  selectAnswers: string | null;
  openModal: 'success' | 'wrong' | null;
  question?: {
    question: string;
    correct: string;
    answers?: string[];
  };
}
