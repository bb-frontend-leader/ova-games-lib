import { useState } from 'react';

import type { ResultState } from '@/components';
import { GamePage, ResultModals, Stage } from '@/components';
import { Panel } from '@/components/ui';
import type { RanaQuestion } from '@/games/game-rana';
import { GameRana } from '@/games/game-rana';

const QUESTIONS: RanaQuestion[] = [
  {
    id: 'rana-1',
    question: '¿Cuál es el animal más grande del mundo?',
    answers: [
      { label: 'Ballena azul', state: 'success' },
      { label: 'Elefante', state: 'wrong' },
      { label: 'Jirafa', state: 'wrong' }
    ]
  },
  {
    id: 'rana-2',
    question: '¿Con qué sentido percibimos los sonidos?',
    answers: [
      { label: 'Oído', state: 'success' },
      { label: 'Vista', state: 'wrong' },
      { label: 'Olfato', state: 'wrong' }
    ]
  },
  {
    id: 'rana-3',
    question: '¿Cuál es la capital de Francia?',
    answers: [
      { label: 'París', state: 'success' },
      { label: 'Roma', state: 'wrong' },
      { label: 'Madrid', state: 'wrong' }
    ]
  },
  {
    id: 'rana-4',
    question: '¿Cuántos lados tiene un triángulo?',
    answers: [
      { label: 'Tres', state: 'success' },
      { label: 'Cuatro', state: 'wrong' },
      { label: 'Cinco', state: 'wrong' }
    ]
  },
  {
    id: 'rana-5',
    question: '¿Cuál es el planeta más cercano al Sol?',
    answers: [
      { label: 'Mercurio', state: 'success' },
      { label: 'Venus', state: 'wrong' },
      { label: 'Marte', state: 'wrong' }
    ]
  }
];

export default function GameRanaPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/rana"
      description={
        <>
          <p>
            La mesa de rana vista de frente. Cada pregunta acertada da una moneda: el estudiante elige el hoyo al que la
            lanza, tocándolo en la mesa o en la lista.
          </p>
          <p>
            La rana da más puntos que el molino, el puente, la tortuga o los hoyos, pero es más difícil que la moneda
            entre. Las probabilidades se ven antes de lanzar.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Se gana una moneda.</li>
          <li>El estudiante elige el hoyo y la lanza.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La respuesta elegida queda descartada.</li>
          <li>Sin acierto no hay moneda: hay que reintentar.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            Termina cuando <strong>todas las preguntas están acertadas</strong> y se lanzó la última moneda.
          </li>
          <li>En cada turno un hoyo vale el doble; la racha y la «mano firme» suben la probabilidad.</li>
          <li>Con 5 a 8 preguntas la partida dura lo justo.</li>
          <li>
            Usa 3 o 4 opciones por pregunta, con un <code>id</code> único y estable.
          </li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <GameRana.Init textInit="Responde bien para ganar monedas y lánzalas a los hoyos de la mesa de rana." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameRana questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Ganaste una moneda: elige un hoyo y lánzala."
        wrong="Esa no es la respuesta. La opción queda descartada: ¡inténtalo de nuevo para ganar la moneda!"
      />
    </GamePage>
  );
}
