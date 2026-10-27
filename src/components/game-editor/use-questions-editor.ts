import type { GameEditor } from '@/hooks';
import { useGameEditor } from '@/hooks';

export interface EditableAnswer {
  label: string;
  state: 'success' | 'wrong';
}

export interface EditableQuestion {
  /** Si falta se genera al leer las preguntas (`prefijo-1`, `prefijo-2`…). */
  id?: string;
  question: string;
  /** Solo para los juegos que muestran un tema por pregunta (la ruleta). */
  category?: string;
  /** Texto del modal de acierto; solo en los juegos que explican la respuesta. */
  explanation?: string;
  answers: EditableAnswer[];
}

export interface QuestionLimits {
  minQuestions: number;
  maxQuestions: number;
  minAnswers: number;
  maxAnswers: number;
  /** Pide también un tema por pregunta. */
  category?: boolean;
  /** Reemplaza el aviso de cuántas preguntas y respuestas admite el juego. */
  note?: string;
  /** Cómo se llama el tema en este juego: «Tema (una palabra)» por defecto. */
  categoryLabel?: string;
  categoryMaxLength?: number;
  /** Reglas propias del juego que no caben en los mínimos y máximos; devuelve el aviso o `null`. */
  validate?: (questions: EditableQuestion[]) => string | null;
  /** Pide también la explicación que se muestra al acertar (opcional). */
  explanation?: boolean;
  /** Cómo se llama cada elemento en este juego: «pregunta» por defecto. */
  noun?: string;
}

export type QuestionsEditorState = GameEditor<EditableQuestion[]> & {
  /** Las preguntas listas para el juego, cada una con su `id`. */
  questions: (EditableQuestion & { id: string })[];
};

/** Estado del editor de un juego de preguntas y respuestas: `questions` es lo que debe recibir el juego. */
export function useQuestionsEditor(defaults: EditableQuestion[], idPrefix: string): QuestionsEditorState {
  const editor = useGameEditor(defaults);
  const questions = editor.content.map((item, index) => ({ ...item, id: item.id ?? `${idPrefix}-${index + 1}` }));

  return { ...editor, questions };
}
