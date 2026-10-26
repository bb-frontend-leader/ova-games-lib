import { useState } from 'react';

import type { ResultState } from '@/components';
import { GamePage, ResultModals, Stage } from '@/components';
import { Panel } from '@/components/ui';
import type { TejoQuestion } from '@/games/game-tejo';
import { GameTejo } from '@/games/game-tejo';

const QUESTIONS: TejoQuestion[] = [
  {
    id: 'tejo-1',
    question: '¿Cuál es la capital de Francia?',
    answers: [
      { label: 'París', state: 'success' },
      { label: 'Roma', state: 'wrong' },
      { label: 'Madrid', state: 'wrong' }
    ]
  },
  {
    id: 'tejo-2',
    question: '¿Cuántos lados tiene un triángulo?',
    answers: [
      { label: 'Tres', state: 'success' },
      { label: 'Cuatro', state: 'wrong' },
      { label: 'Cinco', state: 'wrong' }
    ]
  },
  {
    id: 'tejo-3',
    question: '¿Cuál es el planeta más cercano al Sol?',
    answers: [
      { label: 'Mercurio', state: 'success' },
      { label: 'Venus', state: 'wrong' },
      { label: 'Marte', state: 'wrong' }
    ]
  },
  {
    id: 'tejo-4',
    question: '¿De qué color es el cielo en un día despejado?',
    answers: [
      { label: 'Azul', state: 'success' },
      { label: 'Verde', state: 'wrong' },
      { label: 'Rojo', state: 'wrong' }
    ]
  },
  {
    id: 'tejo-5',
    question: '¿Cuántos meses tiene un año?',
    answers: [
      { label: 'Doce', state: 'success' },
      { label: 'Diez', state: 'wrong' },
      { label: 'Catorce', state: 'wrong' }
    ]
  }
];

export default function GameTejoPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/tejo"
      description={
        <>
          <p>
            La caja de arcilla de tejo vista desde arriba. Cada pregunta acertada da un tejo: el estudiante elige dónde
            cae, tocando la arcilla o con los deslizadores.
          </p>
          <p>
            El bocín cambia de sitio en cada pregunta y el tejo siempre se desvía un poco; la mira muestra cuánto.
            Embocinar, reventar una mecha o quedar cerca del bocín da puntos.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Se gana un tejo.</li>
          <li>El estudiante apunta y lo lanza para sumar puntos.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La respuesta elegida queda descartada.</li>
          <li>Sin acierto no hay tejo: hay que reintentar.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            Termina cuando <strong>todas las preguntas están acertadas</strong> y se lanzó el último tejo.
          </li>
          <li>
            Una «moñona» (embocinar y reventar una mecha a la vez) da más puntos; cada tres aciertos seguidos se gana un
            pulso firme.
          </li>
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
            <GameTejo.Init textInit="Responde bien para ganar tejos y lánzalos a la caja de arcilla: ¡embocina y revienta las mechas!" />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameTejo questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Ganaste un tejo: apunta a la caja y lánzalo."
        wrong="Esa no es la respuesta. La opción queda descartada: ¡inténtalo de nuevo para ganar el tejo!"
      />
    </GamePage>
  );
}
