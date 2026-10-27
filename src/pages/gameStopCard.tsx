import { useState } from 'react';

import type { EditableQuestion, QuestionLimits, ResultState } from '@/components';
import { GameActions, GamePage, QuestionsEditor, ResultModals, Stage, useQuestionsEditor } from '@/components';
import { Button, Panel } from '@/components/ui';
import { StopCard } from '@/games/game-stop-card';

// Una pregunta por parada. La página antepone el nombre de la parada a cada enunciado.
const DEFAULT_QUESTIONS: EditableQuestion[] = [
  {
    id: 'stop-1',
    question: '¿Cuál es la capital de Colombia?',
    answers: [
      { label: 'Bogotá', state: 'success' },
      { label: 'Medellín', state: 'wrong' },
      { label: 'Cali', state: 'wrong' }
    ]
  },
  {
    id: 'stop-2',
    question: '¿Cuántos días tiene una semana?',
    answers: [
      { label: 'Cinco días', state: 'wrong' },
      { label: 'Siete días', state: 'success' },
      { label: 'Diez días', state: 'wrong' }
    ]
  },
  {
    id: 'stop-3',
    question: '¿Qué planeta se conoce como el planeta rojo?',
    answers: [
      { label: 'Venus', state: 'wrong' },
      { label: 'Júpiter', state: 'wrong' },
      { label: 'Marte', state: 'success' }
    ]
  },
  {
    id: 'stop-4',
    question: '¿Cuál es el océano más grande del mundo?',
    answers: [
      { label: 'Océano Pacífico', state: 'success' },
      { label: 'Océano Atlántico', state: 'wrong' },
      { label: 'Océano Índico', state: 'wrong' }
    ]
  },
  {
    id: 'stop-5',
    question: '¿Qué gas necesitamos respirar para vivir?',
    answers: [
      { label: 'Helio', state: 'wrong' },
      { label: 'Oxígeno', state: 'success' },
      { label: 'Nitrógeno', state: 'wrong' }
    ]
  }
];

const ORDINALS = [
  'Primera',
  'Segunda',
  'Tercera',
  'Cuarta',
  'Quinta',
  'Sexta',
  'Séptima',
  'Octava',
  'Novena',
  'Décima'
];

const LIMITS: QuestionLimits = {
  minQuestions: 4,
  maxQuestions: 10,
  minAnswers: 2,
  maxAnswers: 3
};

export default function GameStopCardPage() {
  const editor = useQuestionsEditor(DEFAULT_QUESTIONS, 'stop');
  const QUESTIONS = editor.questions;
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/paradas-del-saber"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
      description={
        <>
          <p>
            Un recorrido por un camino con paradas. Cada parada es una pregunta de selección con única respuesta y el
            viajero solo avanza cuando la responde bien. La meta es llegar al final del camino.
          </p>
          <ul>
            <li>El estudiante empieza en la primera parada.</li>
            <li>Cada parada tiene su propia pregunta y su botón «Comprobar».</li>
            <li>El avance es secuencial: no se puede saltar a la siguiente parada sin superar la actual.</li>
          </ul>
        </>
      }
      correct={
        <ul>
          <li>Se abre un modal de acierto.</li>
          <li>El viajero avanza hasta la siguiente parada.</li>
          <li>Al superar la última parada, el viajero llega a la meta.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>Se abre un modal de error y el viajero retrocede un tramo.</li>
          <li>La opción elegida queda descartada para el siguiente intento.</li>
          <li>Con tres tropiezos seguidos, el viajero vuelve a la parada anterior.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 4, máximo 10. Cada pregunta es una parada de la ruta; para un
            OVA, entre 4 y 6 mantienen el ritmo.
          </li>
          <li>
            <strong>Cada pregunta:</strong> un enunciado corto y claro, que se pueda responder sin ayuda externa.
          </li>
          <li>
            <strong>Respuestas:</strong> 2 o 3 respuestas por pregunta, con <strong>una sola correcta</strong>{' '}
            (márcala). Escríbelas cortas, de longitud parecida y sin repetirlas.
          </li>
          <li>
            <strong>Orden:</strong> de la más fácil a la más difícil: el estudiante gana confianza mientras avanza.
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
        <StopCard questionCount={QUESTIONS.length}>
          <Panel.Section>
            <Stage center>
              <StopCard.Init
                textInitial={`En la ruta encontrarás ${QUESTIONS.length} paradas y, en cada una, una pregunta con una sola respuesta correcta. Tu objetivo es llegar a la meta: una playa de la costa colombiana.`}
              />
            </Stage>
          </Panel.Section>

          {QUESTIONS.map((item, index) => (
            <Panel.Section key={item.id}>
              <Stage size="wide" center>
                <StopCard.Scene
                  id={item.id}
                  question={`<strong>${ORDINALS[index]} parada</strong> - ${item.question}`}
                  onResult={handleResult}
                >
                  {item.answers.map((answer, index) => (
                    <StopCard.Radio
                      key={`${item.id}-${index}`}
                      id={`${item.id}-${index}`}
                      name={item.id}
                      label={answer.label}
                      state={answer.state}
                    />
                  ))}
                </StopCard.Scene>
                <GameActions>
                  <StopCard.Button sceneId={item.id}>
                    <Button label="Comprobar" />
                  </StopCard.Button>
                  <StopCard.Button type="reset" sceneId={item.id}>
                    <Button label="Reintentar" />
                  </StopCard.Button>
                </GameActions>
              </Stage>
            </Panel.Section>
          ))}
        </StopCard>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Respuesta correcta! El viajero sigue por el camino."
        wrong="Esa no es la respuesta correcta: el viajero retrocede un tramo. ¡Inténtalo de nuevo!"
      />
    </GamePage>
  );
}
