import { useState } from 'react';

import type { ResultState } from '@/components';
import { GamePage, ResultModals, Stage } from '@/components';
import { Panel } from '@/components/ui';
import type { JeopardyCategory } from '@/games/game-jeopardy';
import { GameJeopardy } from '@/games/game-jeopardy';

const CATEGORIES: JeopardyCategory[] = [
  {
    id: 'geo',
    title: 'Geografía',
    questions: [
      {
        id: 'geo-1',
        question: '¿Cuál es la capital de Colombia?',
        answers: [
          { label: 'Bogotá', state: 'success' },
          { label: 'Medellín', state: 'wrong' },
          { label: 'Cali', state: 'wrong' }
        ]
      },
      {
        id: 'geo-2',
        question: '¿Cuál es el continente más grande?',
        answers: [
          { label: 'Asia', state: 'success' },
          { label: 'África', state: 'wrong' },
          { label: 'Europa', state: 'wrong' }
        ]
      },
      {
        id: 'geo-3',
        question: '¿Cuál es el río más largo de Colombia?',
        answers: [
          { label: 'Río Magdalena', state: 'success' },
          { label: 'Río Cauca', state: 'wrong' },
          { label: 'Río Atrato', state: 'wrong' }
        ]
      }
    ]
  },
  {
    id: 'sci',
    title: 'Ciencias',
    questions: [
      {
        id: 'sci-1',
        question: '¿Qué planeta se conoce como el planeta rojo?',
        answers: [
          { label: 'Marte', state: 'success' },
          { label: 'Venus', state: 'wrong' },
          { label: 'Júpiter', state: 'wrong' }
        ]
      },
      {
        id: 'sci-2',
        question: '¿Qué gas necesitamos respirar para vivir?',
        answers: [
          { label: 'Oxígeno', state: 'success' },
          { label: 'Helio', state: 'wrong' },
          { label: 'Nitrógeno', state: 'wrong' }
        ]
      },
      {
        id: 'sci-3',
        question: '¿Qué órgano bombea la sangre por el cuerpo?',
        answers: [
          { label: 'Corazón', state: 'success' },
          { label: 'Pulmón', state: 'wrong' },
          { label: 'Estómago', state: 'wrong' }
        ]
      }
    ]
  },
  {
    id: 'math',
    title: 'Matemáticas',
    questions: [
      {
        id: 'math-1',
        question: '¿Cuánto es 8 + 5?',
        answers: [
          { label: '13', state: 'success' },
          { label: '12', state: 'wrong' },
          { label: '14', state: 'wrong' }
        ]
      },
      {
        id: 'math-2',
        question: '¿Cuántos lados tiene un hexágono?',
        answers: [
          { label: 'Seis', state: 'success' },
          { label: 'Cinco', state: 'wrong' },
          { label: 'Ocho', state: 'wrong' }
        ]
      },
      {
        id: 'math-3',
        question: '¿Cuánto es 9 × 6?',
        answers: [
          { label: '54', state: 'success' },
          { label: '56', state: 'wrong' },
          { label: '63', state: 'wrong' }
        ]
      }
    ]
  }
];

export default function GameJeopardyPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/tablero-de-preguntas"
      description={
        <>
          <p>
            Un tablero con categorías en columnas y casillas con puntos. El estudiante elige una casilla, responde su
            pregunta y suma los puntos que vale: cuantos más puntos, más difícil la pregunta.
          </p>
          <p>
            Una casilla escondida es «Apuesta doble»: el estudiante elige cuánto arriesgar antes de ver la pregunta.
            También tiene comodines 50:50. El juego empieza con una pantalla de inicio con las reglas.
          </p>
        </>
      }
      correct={
        <ul>
          <li>La casilla se apaga y suma sus puntos.</li>
          <li>Las rachas de aciertos seguidos dan un extra.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La casilla sigue en el tablero con la respuesta descartada y vale la mitad.</li>
          <li>En una apuesta doble, se resta lo apostado.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de categorías:</strong> mínimo 3, máximo 6.
          </li>
          <li>
            <strong>Preguntas por categoría:</strong> mínimo 3, máximo 5. Para un OVA, 3 categorías de 3 preguntas se
            juegan muy bien.
          </li>
          <li>
            <strong>Orden:</strong> dentro de cada categoría, de la pregunta más fácil a la más difícil: la primera es
            la que menos puntos vale.
          </li>
          <li>
            <strong>Respuestas:</strong> 3 o 4 por pregunta, con <strong>una sola correcta</strong> (márcala), cortas y
            de longitud parecida.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Categoría: Geografía
  Pregunta 1 (fácil): ¿Cuál es la capital de Colombia?
  A) Bogotá (correcta)
  B) Medellín
  C) Cali
  Pregunta 2 (media): ...
  Pregunta 3 (difícil): ...

Categoría: Ciencias
  ...`}</pre>
          </li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <GameJeopardy.Init textInit="Elige una casilla del tablero, responde y suma puntos. ¡Cuidado con la apuesta doble!" />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameJeopardy categories={CATEGORIES} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! La casilla se apaga y suma sus puntos."
        wrong="Esa no es la respuesta. La casilla sigue en el tablero y vale la mitad: ¡inténtalo de nuevo!"
      />
    </GamePage>
  );
}
