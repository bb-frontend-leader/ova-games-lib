import { useState } from 'react';

import type { EditableQuestion, QuestionLimits, ResultState } from '@/components';
import { GameActions, GamePage, QuestionsEditor, ResultModals, Stage, useQuestionsEditor } from '@/components';
import { Button, Panel } from '@/components/ui';
import { GameSpace } from '@/games/game-space';

const DEFAULT_QUESTIONS: EditableQuestion[] = [
  {
    question: '¿Cuál es el planeta más cercano al Sol?',
    answers: [
      { label: 'Mercurio', state: 'success' },
      { label: 'Venus', state: 'wrong' },
      { label: 'La Tierra', state: 'wrong' },
      { label: 'Marte', state: 'wrong' }
    ],
    explanation: '¡Misión cumplida! Mercurio es el planeta más cercano al Sol.'
  }
];

const LIMITS: QuestionLimits = {
  minQuestions: 1,
  maxQuestions: 5,
  minAnswers: 2,
  maxAnswers: 4,
  explanation: true
};

export default function GameSpacePage() {
  const editor = useQuestionsEditor(DEFAULT_QUESTIONS, 'space');
  const QUESTIONS = editor.questions;
  const [feedback, setFeedback] = useState<ResultState>(null);
  const [lastQuestion, setLastQuestion] = useState(0);

  // Con preguntas nuevas se descarta el modal que estuviera abierto.
  const [seenVersion, setSeenVersion] = useState(editor.version);
  if (seenVersion !== editor.version) {
    setSeenVersion(editor.version);
    setFeedback(null);
    setLastQuestion(0);
  }

  const handleResult =
    (question: number) =>
    ({ result }: { result: boolean }) => {
      setLastQuestion(question);
      setFeedback(result ? 'success' : 'wrong');
    };

  return (
    <GamePage
      link="/juegos/mision-espacial"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
      description={
        <>
          <p>
            Una misión espacial de preguntas. El estudiante pilota una nave por la galaxia y la lleva hasta el planeta
            que tiene la respuesta correcta.
          </p>
          <p>El juego empieza con una pantalla de bienvenida y después muestra la galaxia con las opciones.</p>
        </>
      }
      correct={
        <ul>
          <li>La nave llega al planeta correcto.</li>
          <li>Se muestra un modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La nave se aleja del destino.</li>
          <li>Se muestra un modal de error.</li>
          <li>Se puede volver a intentar con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 1, máximo 5: cada pregunta es una galaxia. Si prefieres una
            sola por sección, envíalas todas y las repartimos.
          </li>
          <li>
            <strong>Respuestas:</strong> <strong>2 a 4</strong> por pregunta (cada una es un planeta), con{' '}
            <strong>una sola correcta</strong> (márcala). Muy cortas: una o dos palabras.
          </li>
          <li>
            <strong>Temas:</strong> funciona muy bien para ciencias, pero sirve para cualquier tema.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Pregunta 1: ¿Cuál es el planeta más cercano al Sol?
A) Mercurio (correcta)
B) Venus
C) La Tierra
D) Marte`}</pre>
          </li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <p className="u-font-bold">Bienvenido a bordo. Prepárate para la misión galáctica.</p>
            <GameSpace.Init universeType="1" textInit="¡Hola, viajero! Responde bien y llegaremos a nuestro destino." />
          </Stage>
        </Panel.Section>

        {QUESTIONS.map((item, q) => (
          <Panel.Section key={item.id}>
            <Stage center>
              <p className="u-font-bold">Viaja por la galaxia hasta la respuesta correcta.</p>
              <GameSpace onResult={handleResult(q)}>
                <GameSpace.Galaxy question={item.question} universeType="1">
                  {item.answers.map((answer, index) => (
                    <GameSpace.Radio
                      key={answer.label}
                      label={answer.label}
                      state={answer.state}
                      id={`space-${q + 1}-${index + 1}`}
                      name={`space-${q + 1}`}
                    />
                  ))}
                </GameSpace.Galaxy>
                <GameActions>
                  <GameSpace.Button>
                    <Button label="Comprobar" />
                  </GameSpace.Button>
                  <GameSpace.Button type="reset">
                    <Button label="Reintentar" />
                  </GameSpace.Button>
                </GameActions>
              </GameSpace>
            </Stage>
          </Panel.Section>
        ))}
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success={QUESTIONS[lastQuestion]?.explanation || '¡Misión cumplida! Llegaste al planeta correcto.'}
        wrong="Ese no es el planeta correcto. ¡Vuelve a intentarlo!"
      />
    </GamePage>
  );
}
