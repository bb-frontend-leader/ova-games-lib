import { useState } from 'react';

import type { EditableQuestion, QuestionLimits, ResultState } from '@/components';
import { GameActions, GamePage, QuestionsEditor, ResultModals, Stage, useQuestionsEditor } from '@/components';
import { Button, Panel } from '@/components/ui';
import { GameCastle } from '@/games/game-castle';

const DEFAULT_QUESTIONS: EditableQuestion[] = [
  {
    question: '¿Cuál es el planeta más cercano al Sol?',
    answers: [
      { label: 'Venus', state: 'wrong' },
      { label: 'Mercurio', state: 'success' },
      { label: 'Marte', state: 'wrong' },
      { label: 'Júpiter', state: 'wrong' }
    ],
    explanation: '¡Correcto! Mercurio es el planeta más cercano al Sol y la puerta del castillo se abre.'
  }
];

const LIMITS: QuestionLimits = {
  minQuestions: 1,
  maxQuestions: 1,
  minAnswers: 3,
  maxAnswers: 4,
  explanation: true
};

export default function GameCastlePage() {
  const editor = useQuestionsEditor(DEFAULT_QUESTIONS, 'castle');
  const [item] = editor.questions;
  const QUESTION = {
    question: item.question,
    answers: item.answers.map((answer) => answer.label),
    correct: item.answers.find((answer) => answer.state === 'success')?.label ?? ''
  };
  const [feedback, setFeedback] = useState<ResultState>(null);

  return (
    <GamePage
      link="/juegos/castillo"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
      description={
        <>
          <p>
            Un héroe frente a la puerta de un castillo. La pregunta aparece en una placa y cada respuesta es un bloque
            que el estudiante puede tocar. Con el bloque elegido pulsa «Comprobar».
          </p>
          <p>
            El juego empieza con una pantalla de inicio con las reglas. Cada pregunta va en su propio castillo: el
            docente puede poner una o varias seguidas.
          </p>
        </>
      }
      correct={
        <ul>
          <li>El héroe corre hasta la puerta y la puerta se abre.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>El héroe recibe el golpe y la puerta sigue cerrada.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede volver a elegir con «Reintentar».</li>
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
            <strong>Respuestas:</strong> 3 o 4 respuestas, cada una en un bloque del castillo: de una o dos palabras,
            con <strong>una sola correcta</strong> (márcala). Escríbelas cortas y de longitud parecida.
          </li>
          <li>
            <strong>Cuidado:</strong> no repitas respuestas: cada bloque se identifica por su texto.
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
      <Panel>
        <Panel.Section>
          <Stage center>
            <GameCastle.Init textInit="Elige el bloque con la respuesta correcta y abre la puerta del castillo." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameCastle question={QUESTION} onResult={(result) => setFeedback(result ? 'success' : 'wrong')}>
              <GameCastle.Level
                alt={`Castillo con la puerta cerrada y ${QUESTION.answers.length} bloques con respuestas.`}
              />
              <GameActions>
                <GameCastle.Button>
                  <Button label="Comprobar" />
                </GameCastle.Button>
                <GameCastle.Button type="reset">
                  <Button label="Reintentar" />
                </GameCastle.Button>
              </GameActions>
            </GameCastle>
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success={item.explanation || '¡Correcto! La puerta del castillo se abre.'}
        wrong={
          editor.customized
            ? 'Ese bloque no abre la puerta. Lee la pregunta con calma e inténtalo otra vez.'
            : 'Ese bloque no abre la puerta. Piensa en el planeta que está más cerca del Sol e inténtalo otra vez.'
        }
      />
    </GamePage>
  );
}
