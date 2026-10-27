import { useState } from 'react';

import type { EditableQuestion, QuestionLimits, ResultState } from '@/components';
import { GameActions, GamePage, QuestionsEditor, ResultModals, Stage, useQuestionsEditor } from '@/components';
import { Button, Panel } from '@/components/ui';
import { GameMoney } from '@/games/game-money';

const DEFAULT_QUESTIONS: EditableQuestion[] = [
  {
    question: '¿Cuál es la capital de Francia?',
    answers: [
      { label: 'París', state: 'success' },
      { label: 'Roma', state: 'wrong' },
      { label: 'Madrid', state: 'wrong' }
    ],
    explanation: '¡Muy bien! París es la capital de Francia y el banquero abre la caja fuerte.'
  }
];

const LIMITS: QuestionLimits = {
  minQuestions: 1,
  maxQuestions: 1,
  minAnswers: 3,
  maxAnswers: 3,
  explanation: true
};

export default function GameMoneyPage() {
  const editor = useQuestionsEditor(DEFAULT_QUESTIONS, 'money');
  const [item] = editor.questions;
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/elige-y-gana"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
      description={
        <>
          <p>
            Un banquero avaro guarda su dinero en una caja fuerte. El estudiante debe convencerlo respondiendo bien la
            pregunta para que abra la caja.
          </p>
          <p>El juego empieza con una pantalla de inicio y después muestra la pregunta con sus opciones.</p>
        </>
      }
      correct={
        <ul>
          <li>El banquero reacciona y abre la caja fuerte.</li>
          <li>Cae una lluvia de monedas y billetes.</li>
          <li>Se muestra la pantalla final con la opción «Jugar de nuevo».</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>El banquero se burla y la caja sigue cerrada.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede intentar de nuevo con «Reintentar».</li>
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
            <strong>Respuestas:</strong> 3 respuestas, cortas, con <strong>una sola correcta</strong> (márcala).
            Escríbelas cortas y de longitud parecida.
          </li>
          <li>
            <strong>Texto de inicio:</strong> una frase breve que diga al estudiante qué se espera de él.
          </li>
          <li>
            <strong>Cuidado:</strong> la pregunta debe poder responderse sin ayuda externa: el juego no ofrece pistas.
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
            <p className="u-font-bold">Bienvenido a la caja fuerte. Convence al banquero de soltar su dinero.</p>
            <GameMoney.Init textInit="Responde bien y el banquero avaro abrirá su caja fuerte." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage center>
            <p className="u-font-bold">Selecciona la respuesta correcta.</p>
            <GameMoney onResult={handleResult}>
              <GameMoney.Level label={item.question}>
                {item.answers.map((answer, index) => (
                  <GameMoney.Radio
                    key={answer.label}
                    label={answer.label}
                    state={answer.state}
                    id={`money-${index + 1}`}
                    name="money"
                  />
                ))}
              </GameMoney.Level>
              <GameActions>
                <GameMoney.Button>
                  <Button label="Comprobar" />
                </GameMoney.Button>
                <GameMoney.Button type="reset">
                  <Button label="Reintentar" />
                </GameMoney.Button>
              </GameActions>
            </GameMoney>
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success={item.explanation || '¡Muy bien! Respondiste bien y el banquero abre la caja fuerte.'}
        wrong="Esa no es la respuesta correcta. ¡Inténtalo otra vez!"
      />
    </GamePage>
  );
}
