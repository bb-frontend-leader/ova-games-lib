import { useState } from 'react';

import type { EditableQuestion, QuestionLimits, ResultState } from '@/components';
import { GamePage, QuestionsEditor, ResultModals, Stage, useQuestionsEditor } from '@/components';
import { Panel } from '@/components/ui';
import { GameEscapeRoom } from '@/games/game-escape-room';

const DEFAULT_QUESTIONS: EditableQuestion[] = [
  {
    id: 'escape-1',
    question: '¿Cuántas horas tiene un día?',
    answers: [
      { label: 'Veinticuatro', state: 'success' },
      { label: 'Doce', state: 'wrong' },
      { label: 'Treinta', state: 'wrong' }
    ]
  },
  {
    id: 'escape-2',
    question: '¿Qué usamos para medir el tiempo?',
    answers: [
      { label: 'Reloj', state: 'success' },
      { label: 'Regla', state: 'wrong' },
      { label: 'Balanza', state: 'wrong' }
    ]
  },
  {
    id: 'escape-3',
    question: '¿Cuál de estos es un instrumento de viento?',
    answers: [
      { label: 'Flauta', state: 'success' },
      { label: 'Tambor', state: 'wrong' },
      { label: 'Violín', state: 'wrong' }
    ]
  },
  {
    id: 'escape-4',
    question: '¿Qué se obtiene al congelar el agua?',
    answers: [
      { label: 'Hielo', state: 'success' },
      { label: 'Vapor', state: 'wrong' },
      { label: 'Arena', state: 'wrong' }
    ]
  }
];

const LIMITS: QuestionLimits = {
  minQuestions: 4,
  maxQuestions: 8,
  minAnswers: 3,
  maxAnswers: 4
};

export default function GameEscapeRoomPage() {
  const editor = useQuestionsEditor(DEFAULT_QUESTIONS, 'escape');
  const QUESTIONS = editor.questions;
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/escape-room"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
      description={
        <>
          <p>
            Una sala con objetos cerrados con candado y una puerta con código. Cada objeto esconde una pregunta: al
            acertarla se abre y deja un papel con un dígito y su posición en el código.
          </p>
          <p>
            Con todos los objetos abiertos, el estudiante escribe el código de la puerta siguiendo el orden de las
            posiciones. Dispone de pistas que descartan respuestas incorrectas. El juego empieza con una pantalla de
            inicio con las reglas.
          </p>
        </>
      }
      correct={
        <ul>
          <li>El objeto se abre y su dígito queda anotado en la libreta.</li>
          <li>Cada tres aciertos seguidos se gana otra pista.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La respuesta elegida queda descartada y el objeto sigue cerrado.</li>
          <li>Un código equivocado en la puerta resta puntos.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 4, máximo 8. Cada sala tiene 4 preguntas: envía 4 para una
            sala u 8 para dos (siempre múltiplos de 4).
          </li>
          <li>
            <strong>Cada pregunta:</strong> un enunciado corto y claro, que se pueda responder sin ayuda externa.
          </li>
          <li>
            <strong>Respuestas:</strong> 3 o 4 respuestas por pregunta, con <strong>una sola correcta</strong>{' '}
            (márcala). Escríbelas cortas, de longitud parecida y sin repetirlas.
          </li>
          <li>
            <strong>Redacción:</strong> cada pregunta abre un candado: que sean independientes, sin depender de otra.
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
            <GameEscapeRoom.Init textInit="Estás encerrado en una sala. Responde para abrir los candados y descubre el código de la puerta." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameEscapeRoom questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! El candado se abre: anota el dígito que encontraste."
        wrong="Esa no es la respuesta. El objeto sigue cerrado: ¡inténtalo de nuevo!"
      />
    </GamePage>
  );
}
