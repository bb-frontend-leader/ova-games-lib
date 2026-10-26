import { useState } from 'react';

import type { ResultState } from '@/components';
import { GamePage, ResultModals, Stage } from '@/components';
import { Panel } from '@/components/ui';
import type { CatapultQuestion } from '@/games/game-catapult';
import { GameCatapult } from '@/games/game-catapult';

const QUESTIONS: CatapultQuestion[] = [
  {
    id: 'catapult-1',
    question: '¿Cuántos días tiene una semana?',
    answers: [
      { label: 'Siete', state: 'success' },
      { label: 'Cinco', state: 'wrong' },
      { label: 'Diez', state: 'wrong' }
    ]
  },
  {
    id: 'catapult-2',
    question: '¿Qué color resulta de mezclar azul con amarillo?',
    answers: [
      { label: 'Verde', state: 'success' },
      { label: 'Naranja', state: 'wrong' },
      { label: 'Morado', state: 'wrong' }
    ]
  },
  {
    id: 'catapult-3',
    question: '¿Cuál es el animal más grande del mundo?',
    answers: [
      { label: 'Ballena azul', state: 'success' },
      { label: 'Elefante', state: 'wrong' },
      { label: 'Jirafa', state: 'wrong' }
    ]
  },
  {
    id: 'catapult-4',
    question: '¿Con qué sentido percibimos los sonidos?',
    answers: [
      { label: 'Oído', state: 'success' },
      { label: 'Vista', state: 'wrong' },
      { label: 'Olfato', state: 'wrong' }
    ]
  },
  {
    id: 'catapult-5',
    question: '¿Cuál es la capital de Francia?',
    answers: [
      { label: 'París', state: 'success' },
      { label: 'Roma', state: 'wrong' },
      { label: 'Madrid', state: 'wrong' }
    ]
  }
];

export default function GameCatapultPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/catapulta"
      description={
        <>
          <p>
            Una catapulta frente a una torre enemiga. Cada respuesta correcta gana una piedra: el estudiante elige el
            ángulo y la fuerza, la lanza y, si acierta el tiro, derriba la torre.
          </p>
          <p>
            La torre está cada vez a una distancia distinta. El juego empieza con una pantalla de inicio con las reglas
            y al final muestra un resumen con los puntos, las torres derribadas y los impactos directos.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Se gana una piedra para la catapulta.</li>
          <li>El estudiante apunta (ángulo y fuerza) y dispara.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La respuesta elegida queda descartada.</li>
          <li>Sin acierto no hay piedra: hay que reintentar.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            Se termina cuando <strong>todas las preguntas están acertadas</strong> y se lanzó la última piedra.
          </li>
          <li>Cada pregunta es un disparo: con 5 a 8 preguntas la partida dura lo justo.</li>
          <li>
            Cada tres aciertos seguidos se gana una bola de fuego que derriba la torre aunque el tiro no sea exacto.
          </li>
          <li>Usa 3 o 4 opciones por pregunta: al fallar se descarta la elegida.</li>
          <li>
            Cada pregunta necesita un <code>id</code> único y estable, y debes pasarlas como constante: no deben cambiar
            mientras se juega.
          </li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <GameCatapult.Init textInit="Responde bien para ganar piedras, apunta la catapulta y derriba la torre enemiga." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameCatapult questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Ganaste una piedra: apunta la catapulta y derriba la torre."
        wrong="Esa no es la respuesta. La opción queda descartada: ¡inténtalo de nuevo para ganar la piedra!"
      />
    </GamePage>
  );
}
