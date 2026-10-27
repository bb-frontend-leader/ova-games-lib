import { useState } from 'react';

import type { EditableQuestion, QuestionLimits, ResultState } from '@/components';
import { GamePage, QuestionsEditor, ResultModals, Stage, useQuestionsEditor } from '@/components';
import { Panel } from '@/components/ui';
import { GameTejo } from '@/games/game-tejo';

const DEFAULT_QUESTIONS: EditableQuestion[] = [
  {
    id: 'tejo-1',
    question: '¿Cuál es la capital de Francia?',
    answers: [
      { label: 'París', state: 'success' },
      { label: 'Roma', state: 'wrong' },
      { label: 'Madrid', state: 'wrong' }
    ]
  },
  {
    id: 'tejo-2',
    question: '¿Cuántos lados tiene un triángulo?',
    answers: [
      { label: 'Tres', state: 'success' },
      { label: 'Cuatro', state: 'wrong' },
      { label: 'Cinco', state: 'wrong' }
    ]
  },
  {
    id: 'tejo-3',
    question: '¿Cuál es el planeta más cercano al Sol?',
    answers: [
      { label: 'Mercurio', state: 'success' },
      { label: 'Venus', state: 'wrong' },
      { label: 'Marte', state: 'wrong' }
    ]
  },
  {
    id: 'tejo-4',
    question: '¿De qué color es el cielo en un día despejado?',
    answers: [
      { label: 'Azul', state: 'success' },
      { label: 'Verde', state: 'wrong' },
      { label: 'Rojo', state: 'wrong' }
    ]
  },
  {
    id: 'tejo-5',
    question: '¿Cuántos meses tiene un año?',
    answers: [
      { label: 'Doce', state: 'success' },
      { label: 'Diez', state: 'wrong' },
      { label: 'Catorce', state: 'wrong' }
    ]
  }
];

const LIMITS: QuestionLimits = {
  minQuestions: 5,
  maxQuestions: 8,
  minAnswers: 3,
  maxAnswers: 4
};

export default function GameTejoPage() {
  const editor = useQuestionsEditor(DEFAULT_QUESTIONS, 'tejo');
  const QUESTIONS = editor.questions;
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/tejo"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
      description={
        <>
          <p>
            La caja de arcilla de tejo vista desde arriba. Cada pregunta acertada da un tejo: el estudiante elige dónde
            cae, tocando la arcilla o con los deslizadores.
          </p>
          <p>
            El bocín cambia de sitio en cada pregunta y el tejo siempre se desvía un poco; la mira muestra cuánto.
            Embocinar, reventar una mecha o quedar cerca del bocín da puntos.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Se gana un tejo.</li>
          <li>El estudiante apunta y lo lanza para sumar puntos.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La respuesta elegida queda descartada.</li>
          <li>Sin acierto no hay tejo: hay que reintentar.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 5, máximo 8. Cada pregunta da un tejo.
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
            <GameTejo.Init textInit="Responde bien para ganar tejos y lánzalos a la caja de arcilla: ¡embocina y revienta las mechas!" />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameTejo questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Ganaste un tejo: apunta a la caja y lánzalo."
        wrong="Esa no es la respuesta. La opción queda descartada: ¡inténtalo de nuevo para ganar el tejo!"
      />
    </GamePage>
  );
}
