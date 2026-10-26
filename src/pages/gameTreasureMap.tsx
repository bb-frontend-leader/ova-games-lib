import { useState } from 'react';

import type { ResultState } from '@/components';
import { GamePage, ResultModals, Stage } from '@/components';
import { Panel } from '@/components/ui';
import type { TreasureQuestion } from '@/games/game-treasure-map';
import { GameTreasureMap } from '@/games/game-treasure-map';

const QUESTIONS: TreasureQuestion[] = [
  {
    id: 'treasure-1',
    question: '¿Qué color resulta de mezclar azul con amarillo?',
    answers: [
      { label: 'Verde', state: 'success' },
      { label: 'Naranja', state: 'wrong' },
      { label: 'Morado', state: 'wrong' }
    ]
  },
  {
    id: 'treasure-2',
    question: '¿Cuál es el animal más grande del mundo?',
    answers: [
      { label: 'Ballena azul', state: 'success' },
      { label: 'Elefante', state: 'wrong' },
      { label: 'Jirafa', state: 'wrong' }
    ]
  },
  {
    id: 'treasure-3',
    question: '¿Con qué sentido percibimos los sonidos?',
    answers: [
      { label: 'Oído', state: 'success' },
      { label: 'Vista', state: 'wrong' },
      { label: 'Olfato', state: 'wrong' }
    ]
  },
  {
    id: 'treasure-4',
    question: '¿Cuál es la capital de Francia?',
    answers: [
      { label: 'París', state: 'success' },
      { label: 'Roma', state: 'wrong' },
      { label: 'Madrid', state: 'wrong' }
    ]
  },
  {
    id: 'treasure-5',
    question: '¿Cuántos lados tiene un triángulo?',
    answers: [
      { label: 'Tres', state: 'success' },
      { label: 'Cuatro', state: 'wrong' },
      { label: 'Cinco', state: 'wrong' }
    ]
  },
  {
    id: 'treasure-6',
    question: '¿Cuál es el planeta más cercano al Sol?',
    answers: [
      { label: 'Mercurio', state: 'success' },
      { label: 'Venus', state: 'wrong' },
      { label: 'Marte', state: 'wrong' }
    ]
  }
];

export default function GameTreasureMapPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/mapa-del-tesoro"
      description={
        <>
          <p>
            Un mapa con islas conectadas por rutas. Cada isla esconde una pregunta y el estudiante elige a cuál navegar,
            siempre por una ruta abierta desde el puerto o desde una isla ya explorada.
          </p>
          <p>
            Al explorar todas las islas, el barco navega a la isla del tesoro y se abre el cofre. Algunas islas guardan
            un cofre con bono de puntos.
          </p>
        </>
      }
      correct={
        <ul>
          <li>El barco llega a la isla y planta la bandera.</li>
          <li>Se abren nuevas rutas.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>Una tormenta frena el barco y la respuesta queda descartada.</li>
          <li>Se puede reintentar la isla o cambiar de rumbo.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>Cada pregunta es una isla: con 5 a 8 preguntas el mapa queda equilibrado.</li>
          <li>
            Se termina cuando <strong>todas las islas están exploradas</strong>.
          </li>
          <li>Usa de 2 a 5 respuestas por pregunta (3 o 4 queda mejor), con una sola correcta.</li>
          <li>
            Cada pregunta necesita un <code>id</code> único y estable, y debes pasarlas como constante.
          </li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <GameTreasureMap.Init textInit="Navega de isla en isla respondiendo preguntas hasta llegar a la isla del tesoro." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameTreasureMap questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Tu barco llega a la isla y planta la bandera."
        wrong="¡Tormenta! Esa no es la respuesta: puedes reintentar la isla o cambiar de rumbo."
      />
    </GamePage>
  );
}
