import { useState } from 'react';

import type { EditableQuestion, QuestionLimits, ResultState } from '@/components';
import { GamePage, QuestionsEditor, ResultModals, Stage, useQuestionsEditor } from '@/components';
import { Panel } from '@/components/ui';
import { GameTreasureMap } from '@/games/game-treasure-map';

const DEFAULT_QUESTIONS: EditableQuestion[] = [
  {
    id: 'treasure-1',
    question: '¿Qué color resulta de mezclar azul con amarillo?',
    answers: [
      { label: 'Verde', state: 'success' },
      { label: 'Naranja', state: 'wrong' },
      { label: 'Morado', state: 'wrong' }
    ]
  },
  {
    id: 'treasure-2',
    question: '¿Cuál es el animal más grande del mundo?',
    answers: [
      { label: 'Ballena azul', state: 'success' },
      { label: 'Elefante', state: 'wrong' },
      { label: 'Jirafa', state: 'wrong' }
    ]
  },
  {
    id: 'treasure-3',
    question: '¿Con qué sentido percibimos los sonidos?',
    answers: [
      { label: 'Oído', state: 'success' },
      { label: 'Vista', state: 'wrong' },
      { label: 'Olfato', state: 'wrong' }
    ]
  },
  {
    id: 'treasure-4',
    question: '¿Cuál es la capital de Francia?',
    answers: [
      { label: 'París', state: 'success' },
      { label: 'Roma', state: 'wrong' },
      { label: 'Madrid', state: 'wrong' }
    ]
  },
  {
    id: 'treasure-5',
    question: '¿Cuántos lados tiene un triángulo?',
    answers: [
      { label: 'Tres', state: 'success' },
      { label: 'Cuatro', state: 'wrong' },
      { label: 'Cinco', state: 'wrong' }
    ]
  },
  {
    id: 'treasure-6',
    question: '¿Cuál es el planeta más cercano al Sol?',
    answers: [
      { label: 'Mercurio', state: 'success' },
      { label: 'Venus', state: 'wrong' },
      { label: 'Marte', state: 'wrong' }
    ]
  }
];

const LIMITS: QuestionLimits = {
  minQuestions: 5,
  maxQuestions: 8,
  minAnswers: 2,
  maxAnswers: 5
};

export default function GameTreasureMapPage() {
  const editor = useQuestionsEditor(DEFAULT_QUESTIONS, 'treasure');
  const QUESTIONS = editor.questions;
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/mapa-del-tesoro"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
      description={
        <>
          <p>
            Un mapa con islas conectadas por rutas. Cada isla esconde una pregunta y el estudiante elige a cuál navegar,
            siempre por una ruta abierta desde el puerto o desde una isla ya explorada.
          </p>
          <p>
            Al explorar todas las islas, el barco navega a la isla del tesoro y se abre el cofre. Algunas islas guardan
            un cofre con bono de puntos.
          </p>
        </>
      }
      correct={
        <ul>
          <li>El barco llega a la isla y planta la bandera.</li>
          <li>Se abren nuevas rutas.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>Una tormenta frena el barco y la respuesta queda descartada.</li>
          <li>Se puede reintentar la isla o cambiar de rumbo.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 5, máximo 8. Cada pregunta es una isla del mapa.
          </li>
          <li>
            <strong>Cada pregunta:</strong> un enunciado corto y claro, que se pueda responder sin ayuda externa.
          </li>
          <li>
            <strong>Respuestas:</strong> 2 a 5 respuestas (lo mejor son 3 o 4) por pregunta, con{' '}
            <strong>una sola correcta</strong> (márcala). Escríbelas cortas, de longitud parecida y sin repetirlas.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Pregunta 1: ¿Cuál es la capital de Francia?
A) París (correcta)
B) Roma
C) Madrid

Pregunta 2: ...`}</pre>
          </li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <GameTreasureMap.Init textInit="Navega de isla en isla respondiendo preguntas hasta llegar a la isla del tesoro." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameTreasureMap questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Tu barco llega a la isla y planta la bandera."
        wrong="¡Tormenta! Esa no es la respuesta: puedes reintentar la isla o cambiar de rumbo."
      />
    </GamePage>
  );
}
