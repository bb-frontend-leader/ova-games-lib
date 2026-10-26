import { useState } from 'react';

import type { ResultState } from '@/components';
import { GamePage, ResultModals, Stage } from '@/components';
import { Panel } from '@/components/ui';
import type { SnakesQuestion } from '@/games/game-snakes-ladders';
import { GameSnakesLadders } from '@/games/game-snakes-ladders';

const QUESTIONS: SnakesQuestion[] = [
  {
    id: 'snakes-1',
    question: '¿En qué continente está Colombia?',
    answers: [
      { label: 'América', state: 'success' },
      { label: 'Europa', state: 'wrong' },
      { label: 'Asia', state: 'wrong' }
    ]
  },
  {
    id: 'snakes-2',
    question: '¿Cuál es el océano más grande del mundo?',
    answers: [
      { label: 'Pacífico', state: 'success' },
      { label: 'Atlántico', state: 'wrong' },
      { label: 'Índico', state: 'wrong' }
    ]
  },
  {
    id: 'snakes-3',
    question: '¿Cuánto es 5 + 3?',
    answers: [
      { label: '8', state: 'success' },
      { label: '7', state: 'wrong' },
      { label: '9', state: 'wrong' }
    ]
  },
  {
    id: 'snakes-4',
    question: '¿Cuántos días tiene una semana?',
    answers: [
      { label: 'Siete', state: 'success' },
      { label: 'Cinco', state: 'wrong' },
      { label: 'Diez', state: 'wrong' }
    ]
  },
  {
    id: 'snakes-5',
    question: '¿Qué color resulta de mezclar azul con amarillo?',
    answers: [
      { label: 'Verde', state: 'success' },
      { label: 'Naranja', state: 'wrong' },
      { label: 'Morado', state: 'wrong' }
    ]
  }
];

export default function GameSnakesLaddersPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/serpientes-y-escaleras"
      description={
        <>
          <p>
            El clásico tablero de serpientes y escaleras. Cada pregunta acertada da una tirada de dado para avanzar: las
            escaleras suben la ficha y las serpientes la hacen resbalar.
          </p>
          <p>
            Un 6 da otra tirada sin pregunta y tres aciertos seguidos dan un escudo que frena la próxima serpiente. La
            meta se cruza al acertar la última pregunta.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Se gana una tirada de dado.</li>
          <li>La ficha avanza, sube una escalera o resbala por una serpiente.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La respuesta elegida queda descartada.</li>
          <li>Sin acierto no hay tirada: hay que reintentar.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 5, máximo 8. El tablero crece con las preguntas (unas 5
            casillas por pregunta).
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
            <GameSnakesLadders.Init textInit="Responde bien para lanzar el dado, sube por las escaleras y llega a la meta." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameSnakesLadders questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Ganaste una tirada de dado: ¡avanza por el tablero!"
        wrong="Esa no es la respuesta. La opción queda descartada: ¡inténtalo de nuevo para ganar la tirada!"
      />
    </GamePage>
  );
}
