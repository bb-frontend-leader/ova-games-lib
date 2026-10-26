import { useState } from 'react';

import type { ResultState } from '@/components';
import { GamePage, ResultModals, Stage } from '@/components';
import { Panel } from '@/components/ui';
import type { CometaQuestion } from '@/games/game-cometa';
import { GameCometa } from '@/games/game-cometa';

const QUESTIONS: CometaQuestion[] = [
  {
    id: 'cometa-1',
    question: '¿Con qué sentido percibimos los sonidos?',
    answers: [
      { label: 'Oído', state: 'success' },
      { label: 'Vista', state: 'wrong' },
      { label: 'Olfato', state: 'wrong' }
    ]
  },
  {
    id: 'cometa-2',
    question: '¿Cuál es la capital de Francia?',
    answers: [
      { label: 'París', state: 'success' },
      { label: 'Roma', state: 'wrong' },
      { label: 'Madrid', state: 'wrong' }
    ]
  },
  {
    id: 'cometa-3',
    question: '¿Cuántos lados tiene un triángulo?',
    answers: [
      { label: 'Tres', state: 'success' },
      { label: 'Cuatro', state: 'wrong' },
      { label: 'Cinco', state: 'wrong' }
    ]
  },
  {
    id: 'cometa-4',
    question: '¿Cuál es el planeta más cercano al Sol?',
    answers: [
      { label: 'Mercurio', state: 'success' },
      { label: 'Venus', state: 'wrong' },
      { label: 'Marte', state: 'wrong' }
    ]
  },
  {
    id: 'cometa-5',
    question: '¿De qué color es el cielo en un día despejado?',
    answers: [
      { label: 'Azul', state: 'success' },
      { label: 'Verde', state: 'wrong' },
      { label: 'Rojo', state: 'wrong' }
    ]
  }
];

export default function GameCometaPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/cometas"
      description={
        <>
          <p>
            Una cometa que sube por el cielo. Cada pregunta acertada la lleva un peldaño más arriba y, si se acierta a
            la primera, le añade un lazo de color a la cola.
          </p>
          <p>
            Si el estudiante falla, una ráfaga de viento baja la cometa y debe reintentar la pregunta para recuperar la
            altura. Al llegar a la cima se muestra el puesto en el festival.
          </p>
        </>
      }
      correct={
        <ul>
          <li>La cometa sube un peldaño.</li>
          <li>Si fue a la primera, gana un lazo de color en la cola.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La respuesta elegida queda descartada.</li>
          <li>Una ráfaga baja la cometa.</li>
          <li>Se abre el modal de error y se reintenta la pregunta.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 5, máximo 8. Cada pregunta hace subir la cometa; con 5 a 8 la
            partida dura lo justo.
          </li>
          <li>
            <strong>Cada pregunta:</strong> un enunciado corto y claro, que se pueda responder sin ayuda externa.
          </li>
          <li>
            <strong>Respuestas:</strong> 3 o 4 respuestas por pregunta, con <strong>una sola correcta</strong>{' '}
            (márcala). Escríbelas cortas, de longitud parecida y sin repetirlas.
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
            <GameCometa.Init textInit="Responde bien para subir la cometa hasta la cima y llenar su cola de lazos de colores." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameCometa questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Tu cometa sube un peldaño hacia la cima."
        wrong="Esa no es la respuesta: una ráfaga de viento bajó tu cometa. ¡Inténtalo otra vez para recuperar la altura!"
      />
    </GamePage>
  );
}
