import { useState } from 'react';

import type { EditableQuestion, QuestionLimits, ResultState } from '@/components';
import { GamePage, QuestionsEditor, ResultModals, Stage, useQuestionsEditor } from '@/components';
import { Panel } from '@/components/ui';
import { GameTowerBlocks } from '@/games/game-tower-blocks';

const DEFAULT_QUESTIONS: EditableQuestion[] = [
  {
    id: 'tower-1',
    question: '¿Qué estación del año sigue al invierno?',
    answers: [
      { label: 'Primavera', state: 'success' },
      { label: 'Verano', state: 'wrong' },
      { label: 'Otoño', state: 'wrong' }
    ]
  },
  {
    id: 'tower-2',
    question: '¿Cuántos meses tiene un año?',
    answers: [
      { label: 'Doce', state: 'success' },
      { label: 'Diez', state: 'wrong' },
      { label: 'Catorce', state: 'wrong' }
    ]
  },
  {
    id: 'tower-3',
    question: '¿A qué temperatura hierve el agua?',
    answers: [
      { label: '100 °C', state: 'success' },
      { label: '50 °C', state: 'wrong' },
      { label: '0 °C', state: 'wrong' }
    ]
  },
  {
    id: 'tower-4',
    question: '¿Quién escribió «Cien años de soledad»?',
    answers: [
      { label: 'Gabriel García Márquez', state: 'success' },
      { label: 'Jorge Isaacs', state: 'wrong' },
      { label: 'Pablo Neruda', state: 'wrong' }
    ]
  },
  {
    id: 'tower-5',
    question: '¿Cuántos jugadores de un equipo hay en la cancha en un partido de fútbol?',
    answers: [
      { label: 'Once', state: 'success' },
      { label: 'Nueve', state: 'wrong' },
      { label: 'Siete', state: 'wrong' }
    ]
  }
];

const LIMITS: QuestionLimits = {
  minQuestions: 5,
  maxQuestions: 8,
  minAnswers: 3,
  maxAnswers: 4
};

export default function GameTowerBlocksPage() {
  const editor = useQuestionsEditor(DEFAULT_QUESTIONS, 'tower');
  const QUESTIONS = editor.questions;
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/torre-de-bloques"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
      description={
        <>
          <p>
            Una torre que crece con cada respuesta correcta. El estudiante recibe un bloque que cuelga de una grúa, lo
            mueve con un deslizador y lo suelta sobre la torre. El viento lo empuja mientras cae.
          </p>
          <p>
            Lo que sobresale de la torre se corta y el siguiente bloque es más estrecho; encajar justo da bonus. El
            juego empieza con una pantalla de inicio con las reglas.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Se gana un bloque para colocar en la torre.</li>
          <li>Encajarlo justo da bonus; cada tres encajes seguidos la torre se ensancha.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La respuesta elegida queda descartada.</li>
          <li>Sin acierto no hay bloque.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 5, máximo 8. Cada pregunta es un bloque de la torre.
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
            <GameTowerBlocks.Init textInit="Cada respuesta correcta te da un bloque: suéltalo con la grúa y construye la torre más alta." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameTowerBlocks questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Ganaste un bloque: colócalo sobre la torre."
        wrong="Esa no es la respuesta. La opción queda descartada: ¡inténtalo de nuevo para ganar el bloque!"
      />
    </GamePage>
  );
}
