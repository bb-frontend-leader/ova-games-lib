import { useState } from 'react';

import type { EditableQuestion, QuestionLimits } from '@/components';
import { GameActions, GamePage, QuestionsEditor, ResultModals, Stage, useQuestionsEditor } from '@/components';
import { Button, Panel } from '@/components/ui';
import { GameFish } from '@/games/game-fish';

const DEFAULT_QUESTIONS: EditableQuestion[] = [
  {
    question: '¿Cuál de estos animales es un mamífero?',
    answers: [
      { label: 'Tiburón', state: 'wrong' },
      { label: 'Delfín', state: 'success' },
      { label: 'Pulpo', state: 'wrong' },
      { label: 'Cangrejo', state: 'wrong' },
      { label: 'Medusa', state: 'wrong' },
      { label: 'Atún', state: 'wrong' }
    ],
    explanation: '¡Muy bien! El delfín es un mamífero: respira aire y alimenta a sus crías con leche.'
  },
  {
    question: '¿Cuál es el animal más grande del mundo?',
    answers: [
      { label: 'Elefante', state: 'wrong' },
      { label: 'Jirafa', state: 'wrong' },
      { label: 'Ballena azul', state: 'success' },
      { label: 'Tiburón blanco', state: 'wrong' },
      { label: 'Oso polar', state: 'wrong' },
      { label: 'Hipopótamo', state: 'wrong' }
    ],
    explanation: '¡Correcto! La ballena azul es el animal más grande que existe: puede medir más de 25 metros.'
  },
  {
    question: 'Las gallinas ponen ___.',
    answers: [
      { label: 'Leche', state: 'wrong' },
      { label: 'Miel', state: 'wrong' },
      { label: 'Huevos', state: 'success' },
      { label: 'Lana', state: 'wrong' },
      { label: 'Seda', state: 'wrong' },
      { label: 'Queso', state: 'wrong' }
    ],
    explanation: '¡Excelente! Las gallinas ponen huevos, un alimento que comemos a diario.'
  }
];

const LIMITS: QuestionLimits = {
  minQuestions: 1,
  maxQuestions: 6,
  minAnswers: 4,
  maxAnswers: 6,
  explanation: true
};

type Feedback = { type: 'success' | 'wrong'; question: number } | null;

export default function GameFishPage() {
  const editor = useQuestionsEditor(DEFAULT_QUESTIONS, 'fish');
  const QUESTIONS = editor.questions;
  const [feedback, setFeedback] = useState<Feedback>(null);

  // Con preguntas nuevas se descarta el modal que estuviera abierto.
  const [seenVersion, setSeenVersion] = useState(editor.version);
  if (seenVersion !== editor.version) {
    setSeenVersion(editor.version);
    setFeedback(null);
  }

  const handleResult =
    (question: number) =>
    ({ result }: { result: boolean }) =>
      setFeedback({ type: result ? 'success' : 'wrong', question });

  return (
    <GamePage
      link="/juegos/pesca"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
      description={
        <>
          <p>
            Una pecera con varios peces que nadan. Cada pez lleva una respuesta y el estudiante debe pescar el que tiene
            la respuesta correcta.
          </p>
          <p>
            El juego empieza con una pantalla de inicio con la instrucción y el botón «¡Empezar!». Cada pregunta tiene
            su propia pecera: el docente puede poner una o varias seguidas.
          </p>
        </>
      }
      correct={
        <ul>
          <li>El pez correcto es atrapado con una animación.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>El pez elegido se escapa.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede volver a pescar con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 1, máximo 6. Cada pregunta tiene su propia pecera.
          </li>
          <li>
            <strong>Cada pregunta:</strong> una pregunta directa («¿cuál es…?») o una frase por completar con{' '}
            <code>___</code>.
          </li>
          <li>
            <strong>Respuestas:</strong> de <strong>4 a 6 peces</strong> por pregunta, con{' '}
            <strong>una sola correcta</strong> (márcala). De una o dos palabras, bien distintas entre sí: con menos
            peces es fácil acertar al azar y con más la pecera se llena.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Pregunta 1: El agua hierve a ___ grados Celsius.
A) 100 (correcta)
B) 50
C) 80
D) 120

Pregunta 2: ...`}</pre>
          </li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <GameFish.Init
              labelButton="¡Empezar!"
              labelInstruction="Selecciona el pez que tiene la respuesta correcta para ganar."
            />
          </Stage>
        </Panel.Section>

        {QUESTIONS.map((question, q) => (
          <Panel.Section key={question.id}>
            <Stage size="wide">
              <GameFish onResult={handleResult(q)}>
                <GameFish.Level label={question.question}>
                  {question.answers.map((answer, i) => (
                    <GameFish.Fish
                      key={answer.label}
                      id={`fish-${q + 1}-${i + 1}`}
                      name={`fish-${q + 1}`}
                      label={answer.label}
                      state={answer.state}
                    />
                  ))}
                </GameFish.Level>
                <GameActions>
                  <GameFish.Button>
                    <Button label="Comprobar" />
                  </GameFish.Button>
                  <GameFish.Button type="reset">
                    <Button label="Reintentar" />
                  </GameFish.Button>
                </GameActions>
              </GameFish>
            </Stage>
          </Panel.Section>
        ))}
      </Panel>

      <ResultModals
        open={feedback?.type ?? null}
        onClose={() => setFeedback(null)}
        success={
          QUESTIONS[feedback?.question ?? 0]?.explanation || '¡Muy bien! Pescaste el pez con la respuesta correcta.'
        }
        wrong="Ese pez no tiene la respuesta correcta. ¡Sigue pescando!"
      />
    </GamePage>
  );
}
