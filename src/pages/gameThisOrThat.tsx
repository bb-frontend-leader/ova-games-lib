import { useState } from 'react';

import type { EditableQuestion, QuestionLimits, ResultState } from '@/components';
import { GameActions, GamePage, QuestionsEditor, ResultModals, Stage, useQuestionsEditor } from '@/components';
import { Button, Panel } from '@/components/ui';
import { GameThisOrThat } from '@/games/game-this-or-that';

const DEFAULT_QUESTIONS: EditableQuestion[] = [
  {
    question: 'Los animales que alimentan a sus crías con leche se llaman…',
    answers: [
      { label: 'Mamíferos', state: 'success' },
      { label: 'Reptiles', state: 'wrong' }
    ],
    explanation: '¡Correcto! Los mamíferos alimentan a sus crías con leche.'
  }
];

const LIMITS: QuestionLimits = {
  minQuestions: 1,
  maxQuestions: 6,
  minAnswers: 2,
  maxAnswers: 2,
  explanation: true
};

export default function GameThisOrThatPage() {
  const editor = useQuestionsEditor(DEFAULT_QUESTIONS, 'tot');
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
      link="/juegos/cual-prefieres"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
      description={
        <>
          <p>
            Un duelo entre dos opciones. El estudiante lee el enunciado y elige entre «esto» o «aquello»: solo una de
            las dos es correcta.
          </p>
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
          <li>Se puede volver a elegir con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 3, máximo 6. Como hay un 50 % de acierto al azar, úsalo con
            varias preguntas seguidas.
          </li>
          <li>
            <strong>Cada pregunta:</strong> un concepto que se confunde con otro (mamífero o reptil, sustantivo o verbo,
            vertebrado o invertebrado).
          </li>
          <li>
            <strong>Respuestas:</strong> <strong>exactamente 2 opciones</strong>, una correcta (márcala), de longitud
            parecida.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Pregunta 1: ¿La ballena es…?
A) Mamífero (correcta)
B) Pez

Pregunta 2: ...`}</pre>
          </li>
        </ul>
      }
    >
      <Panel>
        {QUESTIONS.map((item, q) => (
          <Panel.Section key={item.id}>
            <Stage>
              <GameThisOrThat onResult={handleResult(q)}>
                <GameThisOrThat.Level question={item.question} questionNumber={q + 1}>
                  {item.answers.map((answer, index) => (
                    <GameThisOrThat.Radio
                      key={answer.label}
                      label={`${String.fromCharCode(97 + index)}. ${answer.label}`}
                      state={answer.state}
                      id={`tot-${q + 1}-${index + 1}`}
                      name={`tot-${q + 1}`}
                    />
                  ))}
                </GameThisOrThat.Level>
                <GameActions>
                  <GameThisOrThat.Button>
                    <Button label="Comprobar" />
                  </GameThisOrThat.Button>
                  <GameThisOrThat.Button type="reset">
                    <Button label="Reintentar" />
                  </GameThisOrThat.Button>
                </GameActions>
              </GameThisOrThat>
            </Stage>
          </Panel.Section>
        ))}
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success={QUESTIONS[lastQuestion]?.explanation || '¡Correcto! Elegiste la opción acertada.'}
        wrong={
          editor.customized
            ? 'Esa no es la opción correcta. Lee con calma y vuelve a intentarlo.'
            : 'Esa no es la opción correcta. Piensa qué animales dan leche y vuelve a intentarlo.'
        }
      />
    </GamePage>
  );
}
