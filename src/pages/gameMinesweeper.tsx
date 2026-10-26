import { useState } from 'react';

import type { ResultState } from '@/components';
import { GamePage, ResultModals, Stage } from '@/components';
import { Panel } from '@/components/ui';
import type { MinesQuestion } from '@/games/game-minesweeper';
import { GameMinesweeper } from '@/games/game-minesweeper';

const QUESTIONS: MinesQuestion[] = [
  {
    id: 'mines-1',
    question: '¿Cuántos lados tiene un triángulo?',
    answers: [
      { label: 'Tres', state: 'success' },
      { label: 'Cuatro', state: 'wrong' },
      { label: 'Cinco', state: 'wrong' }
    ]
  },
  {
    id: 'mines-2',
    question: '¿Qué parte de la planta absorbe el agua del suelo?',
    answers: [
      { label: 'Raíz', state: 'success' },
      { label: 'Hoja', state: 'wrong' },
      { label: 'Flor', state: 'wrong' }
    ]
  },
  {
    id: 'mines-3',
    question: '¿Cuál es el país más grande de Sudamérica?',
    answers: [
      { label: 'Brasil', state: 'success' },
      { label: 'Argentina', state: 'wrong' },
      { label: 'Chile', state: 'wrong' }
    ]
  },
  {
    id: 'mines-4',
    question: '¿Cuántos minutos tiene una hora?',
    answers: [
      { label: '60', state: 'success' },
      { label: '100', state: 'wrong' },
      { label: '30', state: 'wrong' }
    ]
  },
  {
    id: 'mines-5',
    question: '¿Qué instrumento usamos para ver las estrellas de cerca?',
    answers: [
      { label: 'Telescopio', state: 'success' },
      { label: 'Microscopio', state: 'wrong' },
      { label: 'Termómetro', state: 'wrong' }
    ]
  },
  {
    id: 'mines-6',
    question: '¿Cuál es la capital de España?',
    answers: [
      { label: 'Madrid', state: 'success' },
      { label: 'Barcelona', state: 'wrong' },
      { label: 'Sevilla', state: 'wrong' }
    ]
  }
];

export default function GameMinesweeperPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/buscaminas"
      description={
        <>
          <p>
            Un campo de casillas: unas seguras, cada una con su pregunta, y otras minadas. El estudiante abre una
            casilla; si es segura, responde su pregunta y, al acertar, la casilla se despeja y su número dice cuántas
            minas la rodean.
          </p>
          <p>
            Con el modo bandera marca las casillas que cree minadas. El juego empieza con una pantalla de inicio con las
            reglas.
          </p>
        </>
      }
      correct={
        <ul>
          <li>La casilla se despeja y muestra cuántas minas hay alrededor.</li>
          <li>Acertar a la primera da un escudo que absorbe una mina.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La respuesta elegida queda descartada y la casilla sigue cerrada.</li>
          <li>Abrir una mina la hace explotar y resta puntos.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 6, máximo 9. Cada pregunta es una casilla segura; se esconde
            una mina por cada tres preguntas.
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
            <GameMinesweeper.Init textInit="Abre las casillas seguras respondiendo bien y deduce dónde están las minas." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameMinesweeper questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! La casilla se despeja: mira su número para deducir dónde están las minas."
        wrong="Esa no es la respuesta. La casilla sigue cerrada: ¡inténtalo de nuevo!"
      />
    </GamePage>
  );
}
