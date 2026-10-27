import type { EditableQuestion, QuestionLimits } from '@/components';
import { GamePage, QuestionsEditor, Stage, useQuestionsEditor } from '@/components';
import { Panel } from '@/components/ui';
import { RaceCard } from '@/games/game-race-card';

// La página antepone «Pregunta N:» a cada enunciado.
const DEFAULT_QUESTIONS: EditableQuestion[] = [
  {
    id: 'q1',
    question: '¿Cuántos lados tiene un triángulo?',
    answers: [
      { label: 'Tres', state: 'success' },
      { label: 'Cuatro', state: 'wrong' },
      { label: 'Cinco', state: 'wrong' }
    ]
  },
  {
    id: 'q2',
    question: '¿Cuánto es 15 − 7?',
    answers: [
      { label: '6', state: 'wrong' },
      { label: '8', state: 'success' },
      { label: '9', state: 'wrong' }
    ]
  },
  {
    id: 'q3',
    question: '¿Qué color resulta de mezclar azul con amarillo?',
    answers: [
      { label: 'Naranja', state: 'wrong' },
      { label: 'Morado', state: 'wrong' },
      { label: 'Verde', state: 'success' }
    ]
  },
  {
    id: 'q4',
    question: '¿Cuál es el río más largo de Colombia?',
    answers: [
      { label: 'Río Magdalena', state: 'success' },
      { label: 'Río Cauca', state: 'wrong' },
      { label: 'Río Atrato', state: 'wrong' }
    ]
  },
  {
    id: 'q5',
    question: '¿Cuántos continentes hay en el mundo?',
    answers: [
      { label: 'Cinco', state: 'wrong' },
      { label: 'Siete', state: 'success' },
      { label: 'Nueve', state: 'wrong' }
    ]
  }
];

const LIMITS: QuestionLimits = {
  minQuestions: 4,
  maxQuestions: 8,
  minAnswers: 3,
  maxAnswers: 4
};

export default function GameRaceCardPage() {
  const editor = useQuestionsEditor(DEFAULT_QUESTIONS, 'q');
  const QUESTIONS = editor.questions;

  return (
    <GamePage
      link="/juegos/carrera"
      editor={editor}
      editorDialog={<QuestionsEditor editor={editor} limits={LIMITS} />}
      description={
        <>
          <p>
            Una carrera entre el auto del estudiante y el de la máquina. Cada pregunta es una vuelta: acertar adelanta
            el auto del estudiante y fallar adelanta al rival.
          </p>
          <p>
            El estudiante lee la pregunta, elige una opción y pulsa «Comprobar». Al responder todas las preguntas, el
            juego muestra el podio con el resultado de la carrera.
          </p>
        </>
      }
      correct={
        <ul>
          <li>El auto del estudiante toma la delantera con una animación de avance.</li>
          <li>Se suman puntos al marcador.</li>
          <li>Se pasa a la siguiente pregunta.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>El auto rival avanza.</li>
          <li>No se suman puntos.</li>
          <li>Se pasa a la siguiente pregunta: no hay segundo intento por pregunta.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 4, máximo 8. Entre 4 y 6 dan una carrera con ritmo; más de 8
            se vuelve larga.
          </li>
          <li>
            <strong>Cada pregunta:</strong> un enunciado corto y claro, que se pueda responder sin ayuda externa.
          </li>
          <li>
            <strong>Respuestas:</strong> 3 o 4 respuestas por pregunta, con <strong>una sola correcta</strong>{' '}
            (márcala). Escríbelas cortas, de longitud parecida y sin repetirlas.
          </li>
          <li>
            <strong>Para ganar:</strong> hay que acertar al menos el 60 % de las preguntas (3 de 5).
          </li>
          <li>
            <strong>Redacción:</strong> textos cortos, para que se lean bien sobre la pista.
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
        <RaceCard questionCount={QUESTIONS.length}>
          <Panel.Section>
            <Stage size="wide" center>
              <RaceCard.Init messageInitial="Responde bien las preguntas para superar al auto rival. Lee cada pregunta con calma, elige la opción correcta y pulsa «Comprobar». ¡Buena suerte!" />
            </Stage>
          </Panel.Section>

          {QUESTIONS.map((item, index) => (
            <Panel.Section key={item.id}>
              <Stage size="wide" center>
                <RaceCard.Scene id={`question-svg-${index + 1}`} question={`Pregunta ${index + 1}: ${item.question}`}>
                  {item.answers.map((answer, answerIndex) => (
                    <RaceCard.Radio
                      key={`${item.id}-${answerIndex}`}
                      id={`${item.id}-${answerIndex}`}
                      name={item.id}
                      label={answer.label}
                      state={answer.state}
                    />
                  ))}
                </RaceCard.Scene>
              </Stage>
            </Panel.Section>
          ))}
        </RaceCard>
      </Panel>
    </GamePage>
  );
}
