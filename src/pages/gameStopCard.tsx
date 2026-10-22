import { useState } from 'react';

import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button, Panel } from '@/components/ui';
import { StopCard } from '@/games/game-stop-card';

type Answer = { label: string; state: 'success' | 'wrong' };

// Una pregunta por parada. El máximo del juego es de 10 paradas.
const QUESTIONS: { id: string; question: string; answers: Answer[] }[] = [
  {
    id: 'stop-1',
    question: '<strong>Primera parada</strong> - ¿Cuál es la capital de Colombia?',
    answers: [
      { label: 'Bogotá', state: 'success' },
      { label: 'Medellín', state: 'wrong' },
      { label: 'Cali', state: 'wrong' }
    ]
  },
  {
    id: 'stop-2',
    question: '<strong>Segunda parada</strong> - ¿Cuántos días tiene una semana?',
    answers: [
      { label: 'Cinco días', state: 'wrong' },
      { label: 'Siete días', state: 'success' },
      { label: 'Diez días', state: 'wrong' }
    ]
  },
  {
    id: 'stop-3',
    question: '<strong>Tercera parada</strong> - ¿Qué planeta se conoce como el planeta rojo?',
    answers: [
      { label: 'Venus', state: 'wrong' },
      { label: 'Júpiter', state: 'wrong' },
      { label: 'Marte', state: 'success' }
    ]
  },
  {
    id: 'stop-4',
    question: '<strong>Cuarta parada</strong> - ¿Cuál es el océano más grande del mundo?',
    answers: [
      { label: 'Océano Pacífico', state: 'success' },
      { label: 'Océano Atlántico', state: 'wrong' },
      { label: 'Océano Índico', state: 'wrong' }
    ]
  },
  {
    id: 'stop-5',
    question: '<strong>Quinta parada</strong> - ¿Qué gas necesitamos respirar para vivir?',
    answers: [
      { label: 'Helio', state: 'wrong' },
      { label: 'Oxígeno', state: 'success' },
      { label: 'Nitrógeno', state: 'wrong' }
    ]
  }
];

export default function GameStopCardPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/paradas-del-saber"
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
            <strong>El máximo es de 10 preguntas</strong> (10 paradas). Para un OVA, entre 4 y 6 mantienen el ritmo del
            recorrido.
          </li>
          <li>
            Pasa a <code>questionCount</code> el mismo número de paradas que escribas: si no coinciden, el camino no
            termina bien.
          </li>
          <li>
            Los <code>id</code> de las paradas deben terminar en su número (<code>stop-1</code>, <code>stop-2</code>…).
          </li>
          <li>Usa entre 2 y 3 opciones por pregunta, con una sola correcta y respuestas cortas.</li>
          <li>Ordena las preguntas de la más fácil a la más difícil: el estudiante gana confianza mientras avanza.</li>
        </ul>
      }
    >
      <Panel>
        <StopCard questionCount={QUESTIONS.length}>
          <Panel.Section>
            <Stage center>
              <StopCard.Init textInitial="En la ruta encontrarás cinco paradas y, en cada una, una pregunta con una sola respuesta correcta. Tu objetivo es llegar a la meta: una playa de la costa colombiana." />
            </Stage>
          </Panel.Section>

          {QUESTIONS.map((item) => (
            <Panel.Section key={item.id}>
              <Stage size="wide" center>
                <StopCard.Scene id={item.id} question={item.question} onResult={handleResult}>
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
