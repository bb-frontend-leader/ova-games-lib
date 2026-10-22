import { useState } from 'react';

import type { ResultState } from '@/components';
import { GamePage, ResultModals, Stage } from '@/components';
import { Panel } from '@/components/ui';
import type { RouletteQuestion } from '@/games/game-roulette';
import { GameRoulette } from '@/games/game-roulette';

const QUESTIONS: RouletteQuestion[] = [
  {
    id: 'roulette-1',
    category: 'Geografía',
    question: '¿Cuál es el océano más grande del mundo?',
    answers: [
      { label: 'Océano Pacífico', state: 'success' },
      { label: 'Océano Atlántico', state: 'wrong' },
      { label: 'Océano Índico', state: 'wrong' }
    ]
  },
  {
    id: 'roulette-2',
    category: 'Matemáticas',
    question: '¿Cuánto es 6 × 7?',
    answers: [
      { label: '42', state: 'success' },
      { label: '36', state: 'wrong' },
      { label: '48', state: 'wrong' }
    ]
  },
  {
    id: 'roulette-3',
    category: 'Animales',
    question: '¿Cuál es el animal terrestre más alto?',
    answers: [
      { label: 'Jirafa', state: 'success' },
      { label: 'Elefante', state: 'wrong' },
      { label: 'Caballo', state: 'wrong' }
    ]
  },
  {
    id: 'roulette-4',
    category: 'Geografía',
    question: '¿En qué continente está Colombia?',
    answers: [
      { label: 'América', state: 'success' },
      { label: 'Europa', state: 'wrong' },
      { label: 'África', state: 'wrong' }
    ]
  },
  {
    id: 'roulette-5',
    category: 'Lengua',
    question: '¿Cuál de estas palabras es un sustantivo?',
    answers: [
      { label: 'Mesa', state: 'success' },
      { label: 'Correr', state: 'wrong' },
      { label: 'Rápido', state: 'wrong' }
    ]
  },
  {
    id: 'roulette-6',
    category: 'Ciencias',
    question: '¿Cuántos planetas tiene el sistema solar?',
    answers: [
      { label: 'Ocho', state: 'success' },
      { label: 'Seis', state: 'wrong' },
      { label: 'Diez', state: 'wrong' }
    ]
  }
];

export default function GameRoulettePage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/ruleta"
      description={
        <>
          <p>
            Una ruleta con una casilla por cada pregunta. El estudiante la gira, la ruleta elige una casilla al azar y
            debe responder la pregunta que le toque.
          </p>
          <p>
            Hay casillas especiales: un comodín 50:50 que elimina respuestas incorrectas y un «Doble» que hace valer el
            doble la próxima pregunta. El juego empieza con una pantalla de inicio con las reglas.
          </p>
        </>
      }
      correct={
        <ul>
          <li>La casilla se cierra y suma puntos.</li>
          <li>Las rachas de aciertos seguidos dan puntos extra.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La casilla vuelve a la ruleta y la respuesta elegida queda descartada.</li>
          <li>La próxima vez que salga, la pregunta vale menos.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            Se gana cuando <strong>todas las preguntas están acertadas</strong>: el estudiante no termina si deja una
            casilla pendiente.
          </li>
          <li>
            Usa entre 6 y 10 preguntas; el máximo recomendado es 16, porque con más casillas el texto no cabe en la
            ruleta.
          </li>
          <li>
            Escribe en <code>category</code> el tema de cada pregunta (una palabra): aparece sobre su casilla.
          </li>
          <li>
            Usa 3 o 4 opciones por pregunta: al fallar se descarta la elegida y con 2 opciones la otra sería obvia.
          </li>
          <li>
            Cada pregunta necesita un <code>id</code> único y estable.
          </li>
          <li>
            Con <code>specials={[]}</code> quitas el comodín y el doble.
          </li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <GameRoulette.Init textInit="Gira la ruleta y responde la pregunta que te toque. ¡Los comodines y las rachas suman puntos!" />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameRoulette questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Esa casilla queda cerrada y suma puntos."
        wrong="Esa no es la respuesta. La casilla vuelve a la ruleta: ¡gira y vuelve a intentarlo!"
      />
    </GamePage>
  );
}
