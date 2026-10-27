import { useState } from 'react';

import type { EditableQuestion, QuestionLimits, ResultState } from '@/components';
import { GameActions, GamePage, QuestionsEditor, ResultModals, Stage, useQuestionsEditor } from '@/components';
import { Button } from '@/components/ui';
import { GameQuestion } from '@/games/game-question';

// La página muestra una sola pregunta; `explanation` es el texto del modal de acierto.
const DEFAULT_QUESTIONS: EditableQuestion[] = [
  {
    question: 'Si tengo 15 manzanas y le doy 7 a mi amigo, me quedan ______ manzanas.',
    answers: [
      { label: '5', state: 'wrong' },
      { label: '10', state: 'wrong' },
      { label: '7', state: 'wrong' },
      { label: '8', state: 'success' }
    ],
    explanation: '¡Correcto! 15 − 7 = 8, así que te quedan 8 manzanas.'
  }
];

const LIMITS: QuestionLimits = {
  minQuestions: 1,
  maxQuestions: 1,
  minAnswers: 3,
  maxAnswers: 4,
  explanation: true
};

export default function GameQuestionPage() {
  const editor = useQuestionsEditor(DEFAULT_QUESTIONS, 'question');
  const [item] = editor.questions;
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/desafio-de-conocimiento"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
      description={
        <>
          <p>
            Una tarjeta de pregunta con varias opciones de respuesta. El estudiante lee el enunciado, elige una opción y
            pulsa «Comprobar».
          </p>
          <p>Es el formato más sencillo de la biblioteca: sirve para repasar un concepto sin distracciones.</p>
        </>
      }
      correct={
        <ul>
          <li>La opción elegida se marca como correcta.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La opción elegida se marca como incorrecta.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede volver a responder con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 1, máximo 1: cada actividad contiene una sola pregunta. Si
            quieres más, envíalas todas y las ponemos en secciones distintas.
          </li>
          <li>
            <strong>Cada pregunta:</strong> un enunciado corto y claro, que se pueda responder sin ayuda externa.
          </li>
          <li>
            <strong>Respuestas:</strong> 3 o 4 respuestas, de longitud parecida para que la correcta no destaque por ser
            más larga, con <strong>una sola correcta</strong> (márcala). Escríbelas cortas y de longitud parecida.
          </li>
          <li>
            <strong>Frase por completar:</strong> si quieres un espacio en blanco, escríbelo con guiones bajos (
            <code>______</code>).
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Pregunta 1: ¿Cuál es la capital de Francia?
A) París (correcta)
B) Roma
C) Madrid`}</pre>
          </li>
        </ul>
      }
    >
      <Stage>
        <GameQuestion onResult={handleResult}>
          <GameQuestion.Card question={item.question} questionNumber="1">
            {item.answers.map((answer, index) => (
              <GameQuestion.Radio
                key={answer.label}
                label={answer.label}
                state={answer.state}
                id={`question-${index + 1}`}
                name="question"
              />
            ))}
          </GameQuestion.Card>
          <GameActions>
            <GameQuestion.Button>
              <Button label="Comprobar" />
            </GameQuestion.Button>
            <GameQuestion.Button type="reset">
              <Button label="Reintentar" />
            </GameQuestion.Button>
          </GameActions>
        </GameQuestion>
      </Stage>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success={item.explanation || '¡Correcto! Elegiste la respuesta acertada.'}
        wrong={
          editor.customized
            ? 'Esa no es la respuesta. Léela con calma e inténtalo otra vez.'
            : 'Esa no es la respuesta. Haz la resta con calma e inténtalo otra vez.'
        }
      />
    </GamePage>
  );
}
