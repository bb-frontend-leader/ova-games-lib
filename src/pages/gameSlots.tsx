import { useState } from 'react';

import type { EditableQuestion, QuestionLimits, ResultState } from '@/components';
import { GamePage, QuestionsEditor, ResultModals, Stage, useQuestionsEditor } from '@/components';
import { Panel } from '@/components/ui';
import { GameSlots } from '@/games/game-slots';

const DEFAULT_QUESTIONS: EditableQuestion[] = [
  {
    id: 'slots-1',
    question: '¿Cuánto es 15 − 7?',
    answers: [
      { label: '8', state: 'success' },
      { label: '6', state: 'wrong' },
      { label: '9', state: 'wrong' }
    ]
  },
  {
    id: 'slots-2',
    question: '¿Cuántos continentes hay en el mundo?',
    answers: [
      { label: 'Siete', state: 'success' },
      { label: 'Cinco', state: 'wrong' },
      { label: 'Nueve', state: 'wrong' }
    ]
  },
  {
    id: 'slots-3',
    question: '¿Qué planeta se conoce como el planeta rojo?',
    answers: [
      { label: 'Marte', state: 'success' },
      { label: 'Venus', state: 'wrong' },
      { label: 'Júpiter', state: 'wrong' }
    ]
  },
  {
    id: 'slots-4',
    question: '¿Cuál es el río más largo de Colombia?',
    answers: [
      { label: 'Río Magdalena', state: 'success' },
      { label: 'Río Cauca', state: 'wrong' },
      { label: 'Río Atrato', state: 'wrong' }
    ]
  },
  {
    id: 'slots-5',
    question: '¿Qué gas necesitamos respirar para vivir?',
    answers: [
      { label: 'Oxígeno', state: 'success' },
      { label: 'Helio', state: 'wrong' },
      { label: 'Nitrógeno', state: 'wrong' }
    ]
  }
];

const LIMITS: QuestionLimits = {
  minQuestions: 5,
  maxQuestions: 8,
  minAnswers: 3,
  maxAnswers: 4
};

export default function GameSlotsPage() {
  const editor = useQuestionsEditor(DEFAULT_QUESTIONS, 'slots');
  const QUESTIONS = editor.questions;
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/tragamonedas"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
      description={
        <>
          <p>
            Una máquina tragamonedas con tres carretes. Cada respuesta correcta gana una tirada: el estudiante tira de
            la palanca y los carretes se detienen uno a uno.
          </p>
          <p>
            Dos símbolos iguales en la línea central dan un premio pequeño, tres iguales uno grande y tres diamantes el
            jackpot. Acertar a la primera da una palanca dorada con premio doble. El juego empieza con una pantalla de
            inicio con las reglas.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Se gana una tirada (dorada si fue a la primera).</li>
          <li>El estudiante tira de la palanca y suma el premio de la línea central.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La respuesta elegida queda descartada.</li>
          <li>No hay tirada hasta acertar.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 5, máximo 8. Cada pregunta da una tirada.
          </li>
          <li>
            <strong>Cada pregunta:</strong> un enunciado corto y claro, que se pueda responder sin ayuda externa.
          </li>
          <li>
            <strong>Respuestas:</strong> 3 o 4 respuestas por pregunta, con <strong>una sola correcta</strong>{' '}
            (márcala). Escríbelas cortas, de longitud parecida y sin repetirlas.
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
            <GameSlots.Init textInit="Responde bien para ganar tiradas, tira de la palanca y busca los tres diamantes del jackpot." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameSlots questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Ganaste una tirada: tira de la palanca."
        wrong="Esa no es la respuesta. La opción queda descartada: ¡inténtalo de nuevo para ganar la tirada!"
      />
    </GamePage>
  );
}
