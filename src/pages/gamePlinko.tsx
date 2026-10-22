import { useState } from 'react';

import type { ResultState } from '@/components';
import { GamePage, ResultModals, Stage } from '@/components';
import { Panel } from '@/components/ui';
import type { PlinkoQuestion } from '@/games/game-plinko';
import { GamePlinko } from '@/games/game-plinko';

const QUESTIONS: PlinkoQuestion[] = [
  {
    id: 'plinko-1',
    question: '¿Cuántos días tiene una semana?',
    answers: [
      { label: 'Siete', state: 'success' },
      { label: 'Cinco', state: 'wrong' },
      { label: 'Diez', state: 'wrong' }
    ]
  },
  {
    id: 'plinko-2',
    question: '¿Qué color resulta de mezclar azul con amarillo?',
    answers: [
      { label: 'Verde', state: 'success' },
      { label: 'Naranja', state: 'wrong' },
      { label: 'Morado', state: 'wrong' }
    ]
  },
  {
    id: 'plinko-3',
    question: '¿Cuál es el animal más grande del mundo?',
    answers: [
      { label: 'Ballena azul', state: 'success' },
      { label: 'Elefante', state: 'wrong' },
      { label: 'Jirafa', state: 'wrong' }
    ]
  },
  {
    id: 'plinko-4',
    question: '¿Con qué sentido percibimos los sonidos?',
    answers: [
      { label: 'Oído', state: 'success' },
      { label: 'Vista', state: 'wrong' },
      { label: 'Olfato', state: 'wrong' }
    ]
  },
  {
    id: 'plinko-5',
    question: '¿Cuál es la capital de Francia?',
    answers: [
      { label: 'París', state: 'success' },
      { label: 'Roma', state: 'wrong' },
      { label: 'Madrid', state: 'wrong' }
    ]
  }
];

export default function GamePlinkoPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/plinko"
      description={
        <>
          <p>
            Un tablero de clavos con premios al fondo. Cada respuesta correcta gana una ficha: el estudiante la apunta,
            la suelta y los clavos la hacen rebotar hasta un premio.
          </p>
          <p>
            Acertar a la primera da una ficha dorada con premio doble, y cada tres aciertos seguidos se gana una ficha
            extra. El juego empieza con una pantalla de inicio con las reglas.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Se gana una ficha (dorada si fue a la primera).</li>
          <li>El estudiante la suelta y suma el premio donde caiga.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La respuesta elegida queda descartada.</li>
          <li>No hay ficha hasta acertar.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            Se gana cuando <strong>todas las preguntas están acertadas</strong> y todas las fichas se soltaron.
          </li>
          <li>Cada pregunta da una ficha: con 5 a 8 preguntas la partida dura lo justo.</li>
          <li>
            Con <code>prizes</code> cambias los premios del fondo, de izquierda a derecha;{' '}
            <code>&apos;bonus&apos;</code> da una ficha extra.
          </li>
          <li>Los premios grandes están en los bordes, donde es más difícil caer.</li>
          <li>
            Cada pregunta necesita un <code>id</code> único y estable.
          </li>
          <li>Usa 3 o 4 opciones por pregunta: al fallar se descarta la elegida.</li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <GamePlinko.Init textInit="Responde bien para ganar fichas, suéltalas sobre los clavos y consigue los premios más altos." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GamePlinko questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Ganaste una ficha: apúntala y suéltala sobre los clavos."
        wrong="Esa no es la respuesta. La opción queda descartada: ¡inténtalo de nuevo para ganar la ficha!"
      />
    </GamePage>
  );
}
