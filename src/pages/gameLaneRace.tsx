import { useState } from 'react';

import type { ResultState } from '@/components';
import { GamePage, ResultModals, Stage } from '@/components';
import { Panel } from '@/components/ui';
import type { LaneRaceQuestion } from '@/games/game-lane-race';
import { GameLaneRace } from '@/games/game-lane-race';

const QUESTIONS: LaneRaceQuestion[] = [
  {
    id: 'lane-1',
    question: '¿Cuántos lados tiene un triángulo?',
    answers: [
      { label: 'Tres', state: 'success' },
      { label: 'Cuatro', state: 'wrong' },
      { label: 'Cinco', state: 'wrong' }
    ]
  },
  {
    id: 'lane-2',
    question: '¿Cuál es el planeta más cercano al Sol?',
    answers: [
      { label: 'Mercurio', state: 'success' },
      { label: 'Venus', state: 'wrong' },
      { label: 'Marte', state: 'wrong' }
    ]
  },
  {
    id: 'lane-3',
    question: '¿De qué color es el cielo en un día despejado?',
    answers: [
      { label: 'Azul', state: 'success' },
      { label: 'Verde', state: 'wrong' },
      { label: 'Rojo', state: 'wrong' }
    ]
  },
  {
    id: 'lane-4',
    question: '¿Cuántos meses tiene un año?',
    answers: [
      { label: 'Doce', state: 'success' },
      { label: 'Diez', state: 'wrong' },
      { label: 'Catorce', state: 'wrong' }
    ]
  },
  {
    id: 'lane-5',
    question: '¿Qué necesitan las plantas para crecer?',
    answers: [
      { label: 'Agua y luz', state: 'success' },
      { label: 'Solo oscuridad', state: 'wrong' },
      { label: 'Plástico', state: 'wrong' }
    ]
  }
];

export default function GameLaneRacePage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/carrera-de-carriles"
      description={
        <>
          <p>
            Una pista con un carril por cada respuesta y un coche que corre por el que elija el estudiante. Si el carril
            es el correcto, se abre la puerta y el coche avanza un tramo.
          </p>
          <p>
            Tres rivales avanzan con cada respuesta comprobada: mientras el estudiante no choque, llega siempre primero.
            Al final se reparte el podio.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Se abre la puerta y el coche avanza un tramo.</li>
          <li>Tres aciertos seguidos dan un turbo (medio tramo extra).</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>El coche choca y el carril queda bloqueado.</li>
          <li>Se pierde terreno frente a los rivales.</li>
          <li>Se abre el modal de error y se reintenta con otro carril.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 5, máximo 8. Con más preguntas la carrera se alarga.
          </li>
          <li>
            <strong>Cada pregunta:</strong> un enunciado corto y claro, que se pueda responder sin ayuda externa.
          </li>
          <li>
            <strong>Respuestas:</strong> 2 a 5 respuestas (lo mejor son 3 o 4); cada una es un carril por pregunta, con{' '}
            <strong>una sola correcta</strong> (márcala). Escríbelas cortas, de longitud parecida y sin repetirlas.
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
            <GameLaneRace.Init textInit="Elige el carril con la respuesta correcta y llega primero a la meta." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameLaneRace questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Se abrió la puerta y tu coche avanza un tramo."
        wrong="¡Choque! Ese no era el carril correcto. Queda bloqueado: prueba con otro."
      />
    </GamePage>
  );
}
