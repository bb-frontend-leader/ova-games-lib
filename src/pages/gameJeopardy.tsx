import { useMemo, useState } from 'react';

import type { EditableQuestion, QuestionLimits, ResultState } from '@/components';
import { GamePage, QuestionsEditor, ResultModals, Stage } from '@/components';
import { Panel } from '@/components/ui';
import type { JeopardyCategory } from '@/games/game-jeopardy';
import { GameJeopardy } from '@/games/game-jeopardy';
import { useGameEditor } from '@/hooks';

const DEFAULT_CATEGORIES: JeopardyCategory[] = [
  {
    id: 'geo',
    title: 'Geografía',
    questions: [
      {
        id: 'geo-1',
        question: '¿Cuál es la capital de Colombia?',
        answers: [
          { label: 'Bogotá', state: 'success' },
          { label: 'Medellín', state: 'wrong' },
          { label: 'Cali', state: 'wrong' }
        ]
      },
      {
        id: 'geo-2',
        question: '¿Cuál es el continente más grande?',
        answers: [
          { label: 'Asia', state: 'success' },
          { label: 'África', state: 'wrong' },
          { label: 'Europa', state: 'wrong' }
        ]
      },
      {
        id: 'geo-3',
        question: '¿Cuál es el río más largo de Colombia?',
        answers: [
          { label: 'Río Magdalena', state: 'success' },
          { label: 'Río Cauca', state: 'wrong' },
          { label: 'Río Atrato', state: 'wrong' }
        ]
      }
    ]
  },
  {
    id: 'sci',
    title: 'Ciencias',
    questions: [
      {
        id: 'sci-1',
        question: '¿Qué planeta se conoce como el planeta rojo?',
        answers: [
          { label: 'Marte', state: 'success' },
          { label: 'Venus', state: 'wrong' },
          { label: 'Júpiter', state: 'wrong' }
        ]
      },
      {
        id: 'sci-2',
        question: '¿Qué gas necesitamos respirar para vivir?',
        answers: [
          { label: 'Oxígeno', state: 'success' },
          { label: 'Helio', state: 'wrong' },
          { label: 'Nitrógeno', state: 'wrong' }
        ]
      },
      {
        id: 'sci-3',
        question: '¿Qué órgano bombea la sangre por el cuerpo?',
        answers: [
          { label: 'Corazón', state: 'success' },
          { label: 'Pulmón', state: 'wrong' },
          { label: 'Estómago', state: 'wrong' }
        ]
      }
    ]
  },
  {
    id: 'math',
    title: 'Matemáticas',
    questions: [
      {
        id: 'math-1',
        question: '¿Cuánto es 8 + 5?',
        answers: [
          { label: '13', state: 'success' },
          { label: '12', state: 'wrong' },
          { label: '14', state: 'wrong' }
        ]
      },
      {
        id: 'math-2',
        question: '¿Cuántos lados tiene un hexágono?',
        answers: [
          { label: 'Seis', state: 'success' },
          { label: 'Cinco', state: 'wrong' },
          { label: 'Ocho', state: 'wrong' }
        ]
      },
      {
        id: 'math-3',
        question: '¿Cuánto es 9 × 6?',
        answers: [
          { label: '54', state: 'success' },
          { label: '56', state: 'wrong' },
          { label: '63', state: 'wrong' }
        ]
      }
    ]
  }
];

// El editor trabaja con una lista plana de preguntas; cada una dice a qué categoría (columna) pertenece.
const DEFAULT_QUESTIONS: EditableQuestion[] = DEFAULT_CATEGORIES.flatMap((category) =>
  category.questions.map((item) => ({ question: item.question, category: category.title, answers: item.answers }))
);

const toCategories = (questions: EditableQuestion[]): JeopardyCategory[] => {
  const groups = new Map<string, EditableQuestion[]>();
  for (const item of questions) groups.set(item.category ?? '', [...(groups.get(item.category ?? '') ?? []), item]);

  return [...groups].map(([title, items], c) => ({
    id: `cat-${c + 1}`,
    title,
    questions: items.map((item, q) => ({ id: `cat-${c + 1}-${q + 1}`, question: item.question, answers: item.answers }))
  }));
};

const LIMITS: QuestionLimits = {
  minQuestions: 9,
  maxQuestions: 30,
  minAnswers: 3,
  maxAnswers: 4,
  category: true,
  categoryLabel: 'Categoría',
  categoryMaxLength: 24,
  note: 'El tablero lleva de 3 a 6 categorías con 3 a 5 preguntas cada una. Las preguntas que tengan la misma categoría quedan en la misma columna, de la más fácil (la primera) a la más difícil (la última), y de 3 a 4 respuestas por pregunta.',
  validate: (questions) => {
    const columns = toCategories(questions);
    if (columns.length < 3 || columns.length > 6) {
      return `El tablero necesita de 3 a 6 categorías distintas; tienes ${columns.length}.`;
    }
    const wrong = columns.find((column) => column.questions.length < 3 || column.questions.length > 5);
    return wrong ? `La categoría «${wrong.title}» necesita de 3 a 5 preguntas; tiene ${wrong.questions.length}.` : null;
  }
};

export default function GameJeopardyPage() {
  const editor = useGameEditor(DEFAULT_QUESTIONS);
  const CATEGORIES = useMemo(() => toCategories(editor.content), [editor.content]);
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/tablero-de-preguntas"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
      description={
        <>
          <p>
            Un tablero con categorías en columnas y casillas con puntos. El estudiante elige una casilla, responde su
            pregunta y suma los puntos que vale: cuantos más puntos, más difícil la pregunta.
          </p>
          <p>
            Una casilla escondida es «Apuesta doble»: el estudiante elige cuánto arriesgar antes de ver la pregunta.
            También tiene comodines 50:50. El juego empieza con una pantalla de inicio con las reglas.
          </p>
        </>
      }
      correct={
        <ul>
          <li>La casilla se apaga y suma sus puntos.</li>
          <li>Las rachas de aciertos seguidos dan un extra.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La casilla sigue en el tablero con la respuesta descartada y vale la mitad.</li>
          <li>En una apuesta doble, se resta lo apostado.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de categorías:</strong> mínimo 3, máximo 6.
          </li>
          <li>
            <strong>Preguntas por categoría:</strong> mínimo 3, máximo 5. Para un OVA, 3 categorías de 3 preguntas se
            juegan muy bien.
          </li>
          <li>
            <strong>Orden:</strong> dentro de cada categoría, de la pregunta más fácil a la más difícil: la primera es
            la que menos puntos vale.
          </li>
          <li>
            <strong>Respuestas:</strong> 3 o 4 por pregunta, con <strong>una sola correcta</strong> (márcala), cortas y
            de longitud parecida.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Categoría: Geografía
  Pregunta 1 (fácil): ¿Cuál es la capital de Colombia?
  A) Bogotá (correcta)
  B) Medellín
  C) Cali
  Pregunta 2 (media): ...
  Pregunta 3 (difícil): ...

Categoría: Ciencias
  ...`}</pre>
          </li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <GameJeopardy.Init textInit="Elige una casilla del tablero, responde y suma puntos. ¡Cuidado con la apuesta doble!" />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameJeopardy categories={CATEGORIES} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! La casilla se apaga y suma sus puntos."
        wrong="Esa no es la respuesta. La casilla sigue en el tablero y vale la mitad: ¡inténtalo de nuevo!"
      />
    </GamePage>
  );
}
