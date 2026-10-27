import { useState } from 'react';

import type { EditableQuestion, QuestionLimits, ResultState } from '@/components';
import { GameActions, GamePage, QuestionsEditor, ResultModals, Stage, useQuestionsEditor } from '@/components';
import { Button, Panel } from '@/components/ui';
import { GameMilions } from '@/games/game-millions';

const DEFAULT_QUESTIONS: EditableQuestion[] = [
  {
    question: '¿Cuál es la capital de Francia?',
    answers: [
      { label: 'Roma', state: 'wrong' },
      { label: 'París', state: 'success' },
      { label: 'Madrid', state: 'wrong' },
      { label: 'Lisboa', state: 'wrong' }
    ],
    explanation: '¡Correcto! París es la capital de Francia.'
  },
  {
    question: 'El agua hierve a ___ grados centígrados.',
    answers: [
      { label: '50', state: 'wrong' },
      { label: '80', state: 'wrong' },
      { label: '100', state: 'success' },
      { label: '150', state: 'wrong' }
    ],
    explanation: '¡Correcto! A nivel del mar, el agua hierve a 100 grados centígrados.'
  },
  {
    question: '¿Cuántos continentes hay en el mundo?',
    answers: [
      { label: 'Cinco', state: 'wrong' },
      { label: 'Seis', state: 'wrong' },
      { label: 'Siete', state: 'success' },
      { label: 'Ocho', state: 'wrong' }
    ],
    explanation: '¡Correcto! Los continentes son siete, según la división más usada.'
  }
];

const LIMITS: QuestionLimits = {
  minQuestions: 5,
  maxQuestions: 10,
  minAnswers: 3,
  maxAnswers: 5,
  explanation: true
};

export default function GameMillionsPage() {
  const editor = useQuestionsEditor(DEFAULT_QUESTIONS, 'millions');
  const QUESTIONS = editor.questions;
  const [feedback, setFeedback] = useState<ResultState>(null);
  const [current, setCurrent] = useState(0);
  const [money, setMoney] = useState(0);
  const [solved, setSolved] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [round, setRound] = useState(0);

  // Con preguntas nuevas el concurso empieza de cero.
  const [seenVersion, setSeenVersion] = useState(editor.version);
  if (seenVersion !== editor.version) {
    setSeenVersion(editor.version);
    setCurrent(0);
    setMoney(0);
    setSolved([]);
    setFinished(false);
    setFeedback(null);
  }

  const isLast = current === QUESTIONS.length - 1;

  const handleResult = ({ result }: { result: boolean }) => {
    if (result) setSolved((prev) => (prev.includes(current) ? prev : [...prev, current]));
    setFeedback(result ? 'success' : 'wrong');
  };

  const restart = () => {
    setCurrent(0);
    setMoney(0);
    setSolved([]);
    setFinished(false);
    setRound((value) => value + 1);
  };

  return (
    <GamePage
      link="/juegos/quien-quiere-ser-millonario"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
      description={
        <>
          <p>
            Un concurso de preguntas con un contador de dinero. Cada respuesta correcta suma un millón al dinero
            acumulado y el contador sube con una lluvia de monedas.
          </p>
          <p>
            El juego empieza con una pantalla de inicio con las reglas. Las preguntas van una tras otra con «Siguiente»
            y, al terminar la última, aparece una pantalla final con el total y los aciertos.
          </p>
        </>
      }
      correct={
        <ul>
          <li>La respuesta se marca como correcta y suma el premio al dinero acumulado.</li>
          <li>Se abre el modal de acierto.</li>
          <li>Se habilita «Siguiente» (o «Finalizar» en la última pregunta).</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La respuesta se marca como incorrecta y el dinero no cambia.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede volver a responder con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 5, máximo 10. El estudiante suma un millón por acierto.
          </li>
          <li>
            <strong>Cada pregunta:</strong> un enunciado corto y claro, que se pueda responder sin ayuda externa.
          </li>
          <li>
            <strong>Respuestas:</strong> 3 a 5 respuestas por pregunta, con <strong>una sola correcta</strong>{' '}
            (márcala). Escríbelas cortas, de longitud parecida y sin repetirlas.
          </li>
          <li>
            <strong>Redacción:</strong> puedes escribir la pregunta como una frase por completar con <code>___</code>:
            la respuesta elegida cae en el espacio.
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
            <GameMilions.Init textInit="Responde bien y suma un millón por cada acierto: ¿cuánto dinero te llevarás?" />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            {finished ? (
              <GameMilions.End money={money} correct={solved.length} total={QUESTIONS.length} onRestart={restart} />
            ) : (
              <GameMilions
                key={`${round}-${current}`}
                question={QUESTIONS[current].question}
                money={money}
                alt={`Pregunta ${current + 1} de ${QUESTIONS.length}.`}
                solved={solved.includes(current)}
                autoFocus={current > 0}
                onResult={handleResult}
                onMoneyChange={setMoney}
                onPrevious={current > 0 ? () => setCurrent(current - 1) : undefined}
                onNext={isLast ? undefined : () => setCurrent(current + 1)}
                onFinish={isLast ? () => setFinished(true) : undefined}
              >
                {QUESTIONS[current].answers.map((answer, i) => (
                  <GameMilions.Element
                    key={answer.label}
                    id={`millions-${current + 1}-${i + 1}`}
                    name={`millions-${current + 1}`}
                    label={answer.label}
                    state={answer.state}
                  />
                ))}
                <GameActions>
                  <GameMilions.Button type="check">
                    <Button label="Comprobar" />
                  </GameMilions.Button>
                  <GameMilions.Button type="reset">
                    <Button label="Reintentar" />
                  </GameMilions.Button>
                </GameActions>
              </GameMilions>
            )}
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success={QUESTIONS[current]?.explanation || '¡Correcto! Sumas un millón más.'}
        wrong="Esa no es la respuesta. Lee la pregunta con calma y elige otra."
      />
    </GamePage>
  );
}
