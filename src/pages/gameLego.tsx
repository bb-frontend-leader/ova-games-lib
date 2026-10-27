import { useState } from 'react';

import type { EditableQuestion, QuestionLimits, ResultState } from '@/components';
import { GameActions, GamePage, QuestionsEditor, ResultModals, Stage, useQuestionsEditor } from '@/components';
import { Button, Panel } from '@/components/ui';
import { GameLego } from '@/games/game-lego';

const DEFAULT_QUESTIONS: EditableQuestion[] = [
  {
    question: '¿Cuántos lados tiene un triángulo?',
    answers: [
      { label: 'Dos', state: 'wrong' },
      { label: 'Tres', state: 'success' },
      { label: 'Cuatro', state: 'wrong' },
      { label: 'Cinco', state: 'wrong' }
    ],
    explanation: '¡Correcto! Un triángulo tiene tres lados y la pieza encaja en el modelo.'
  }
];

const LIMITS: QuestionLimits = {
  minQuestions: 1,
  maxQuestions: 1,
  minAnswers: 3,
  maxAnswers: 4,
  explanation: true
};

export default function GameLegoPage() {
  const editor = useQuestionsEditor(DEFAULT_QUESTIONS, 'lego');
  const [item] = editor.questions;
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/construye-la-respuesta"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
      description={
        <>
          <p>
            Un modelo armado con piezas de colores al que le falta una. Cada respuesta es una pieza: el estudiante elige
            la que cree correcta y vuela hasta su espacio. Con «Comprobar» se sabe si encaja.
          </p>
          <p>El juego empieza con una pantalla de inicio con las reglas y el botón «¡A construir!».</p>
        </>
      }
      correct={
        <ul>
          <li>La pieza encaja y se ilumina.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La pieza se rompe y cae.</li>
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
            <strong>Respuestas:</strong> 3 o 4 respuestas, cada una en una pieza: textos cortos que quepan dentro de la
            pieza, con <strong>una sola correcta</strong> (márcala). Escríbelas cortas y de longitud parecida.
          </li>
          <li>
            <strong>Letra:</strong> empieza cada respuesta con su letra (A., B., C.…); la letra se muestra en la pieza.
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
            <GameLego.Init textInit="Elige la pieza con la respuesta correcta y complétala para terminar el modelo." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameLego onResult={handleResult}>
              <GameLego.Question label={item.question}>
                {item.answers.map((answer, index) => (
                  <GameLego.Option
                    key={answer.label}
                    id={`lego-${index + 1}`}
                    name="lego"
                    label={`${String.fromCharCode(65 + index)}. ${answer.label}`}
                    state={answer.state}
                  />
                ))}
              </GameLego.Question>
              <GameActions>
                <GameLego.Button>
                  <Button label="Comprobar" />
                </GameLego.Button>
                <GameLego.Button type="reset">
                  <Button label="Reintentar" />
                </GameLego.Button>
              </GameActions>
            </GameLego>
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success={item.explanation || '¡Correcto! La pieza encaja en el modelo.'}
        wrong={
          editor.customized
            ? 'Esa pieza no encaja. Lee la pregunta con calma e inténtalo otra vez.'
            : 'Esa pieza no encaja. Cuenta los lados de un triángulo e inténtalo otra vez.'
        }
      />
    </GamePage>
  );
}
