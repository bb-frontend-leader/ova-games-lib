import { useState } from 'react';

import type { ResultState } from '@/components';
import { GamePage, ResultModals, Stage } from '@/components';
import { Panel } from '@/components/ui';
import type { LoteriaQuestion } from '@/games/game-loteria';
import { GameLoteria } from '@/games/game-loteria';

const QUESTIONS: LoteriaQuestion[] = [
  { id: 'loteria-1', question: 'Vuela y canta en los árboles.', card: { label: 'Pájaro', emoji: '🐦' } },
  { id: 'loteria-2', question: 'Nos da luz y calor durante el día.', card: { label: 'Sol', emoji: '☀️' } },
  { id: 'loteria-3', question: 'Es el mejor amigo del ser humano.', card: { label: 'Perro', emoji: '🐶' } },
  { id: 'loteria-4', question: 'Se bebe y es esencial para la vida.', card: { label: 'Agua', emoji: '💧' } },
  { id: 'loteria-5', question: 'Brilla en el cielo por la noche.', card: { label: 'Luna', emoji: '🌙' } },
  { id: 'loteria-6', question: 'Es una fruta roja que crece en los árboles.', card: { label: 'Manzana', emoji: '🍎' } },
  {
    id: 'loteria-7',
    question: 'Es un vehículo de dos ruedas que se pedalea.',
    card: { label: 'Bicicleta', emoji: '🚲' }
  },
  { id: 'loteria-8', question: 'Da leche y hace «muuu».', card: { label: 'Vaca', emoji: '🐮' } }
];

export default function GameLoteriaPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/loteria"
      description={
        <>
          <p>
            Una tabla de lotería con cartas ilustradas. El cantor lee una pista y el estudiante toca, en su tabla, la
            carta que la responde.
          </p>
          <p>
            Acertar pone un frijol en la carta; completar una fila o una columna da un bono. El juego acaba cuando la
            tabla se llena: ¡Lotería!
          </p>
        </>
      }
      correct={
        <ul>
          <li>Se pone un frijol en la carta.</li>
          <li>Completar una fila o columna da un bono.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La carta tocada queda descartada para esa pista.</li>
          <li>Con dos fallos seguidos, el cantor deja solo dos cartas posibles.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            Aquí cada pregunta no lleva opciones: lleva una <strong>pista</strong> y la <code>card</code> que la
            responde (nombre y <code>emoji</code> o <code>image</code>).
          </li>
          <li>La tabla se arma con las cartas de todas las preguntas: usa entre 6 y 12 para que se vea bien.</li>
          <li>
            Escribe pistas que solo describan una carta de la tabla; si dos cartas pueden responder, el estudiante se
            confunde.
          </li>
          <li>Los nombres de las cartas deben ser cortos (una palabra) y distintos entre sí.</li>
          <li>
            Cada pregunta necesita un <code>id</code> único y estable, y debes pasarlas como constante.
          </li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <GameLoteria.Init textInit="Escucha la pista del cantor y marca en tu tabla la carta que la responde." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameLoteria questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Buena! Esa es la carta: el cantor pone un frijol en tu tabla."
        wrong="Esa carta no responde a la pista. Queda descartada: ¡prueba con otra!"
      />
    </GamePage>
  );
}
