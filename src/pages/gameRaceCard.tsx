import { GamePage, Stage } from '@/components';
import { Panel } from '@/components/ui';
import { RaceCard } from '@/games/game-race-card';

type Answer = { label: string; state: 'success' | 'wrong' };

const QUESTIONS: { id: string; question: string; answers: Answer[] }[] = [
  {
    id: 'q1',
    question: 'Pregunta 1: ¿Cuántos lados tiene un triángulo?',
    answers: [
      { label: 'Tres', state: 'success' },
      { label: 'Cuatro', state: 'wrong' },
      { label: 'Cinco', state: 'wrong' }
    ]
  },
  {
    id: 'q2',
    question: 'Pregunta 2: ¿Cuánto es 15 − 7?',
    answers: [
      { label: '6', state: 'wrong' },
      { label: '8', state: 'success' },
      { label: '9', state: 'wrong' }
    ]
  },
  {
    id: 'q3',
    question: 'Pregunta 3: ¿Qué color resulta de mezclar azul con amarillo?',
    answers: [
      { label: 'Naranja', state: 'wrong' },
      { label: 'Morado', state: 'wrong' },
      { label: 'Verde', state: 'success' }
    ]
  },
  {
    id: 'q4',
    question: 'Pregunta 4: ¿Cuál es el río más largo de Colombia?',
    answers: [
      { label: 'Río Magdalena', state: 'success' },
      { label: 'Río Cauca', state: 'wrong' },
      { label: 'Río Atrato', state: 'wrong' }
    ]
  },
  {
    id: 'q5',
    question: 'Pregunta 5: ¿Cuántos continentes hay en el mundo?',
    answers: [
      { label: 'Cinco', state: 'wrong' },
      { label: 'Siete', state: 'success' },
      { label: 'Nueve', state: 'wrong' }
    ]
  }
];

export default function GameRaceCardPage() {
  return (
    <GamePage
      link="/juegos/carrera"
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
            Se gana la carrera con <strong>al menos el 60 % de respuestas correctas</strong>. Con 5 preguntas, hay que
            acertar 3.
          </li>
          <li>
            Pasa a <code>questionCount</code> el mismo número de preguntas que tengas: el podio aparece solo cuando se
            responden todas.
          </li>
          <li>
            Los <code>id</code> de las escenas deben empezar por <code>question-svg-</code> y terminar en su número.
          </li>
          <li>Entre 4 y 6 preguntas dan una carrera con ritmo; más de 8 se vuelve larga.</li>
          <li>Usa 3 o 4 opciones por pregunta y textos cortos, para que se lean bien sobre la pista.</li>
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
                <RaceCard.Scene id={`question-svg-${index + 1}`} question={item.question}>
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
