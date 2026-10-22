import { useState } from 'react';

import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button, Panel } from '@/components/ui';
import { GameCasino } from '@/games/game-casino';

type Answer = { label: string; state: 'success' | 'wrong' };

const ROUNDS: { id: string; question: string; answers: Answer[] }[] = [
  {
    id: 'r1',
    question: '¿Cuántas patas tiene una araña?',
    answers: [
      { label: 'Seis', state: 'wrong' },
      { label: 'Ocho', state: 'success' },
      { label: 'Diez', state: 'wrong' }
    ]
  },
  {
    id: 'r2',
    question: '¿Cuál es el animal terrestre más grande?',
    answers: [
      { label: 'El elefante', state: 'success' },
      { label: 'El caballo', state: 'wrong' },
      { label: 'El oso', state: 'wrong' }
    ]
  },
  {
    id: 'r3',
    question: '¿Con qué parte del cuerpo olemos?',
    answers: [
      { label: 'Con las orejas', state: 'wrong' },
      { label: 'Con los ojos', state: 'wrong' },
      { label: 'Con la nariz', state: 'success' }
    ]
  }
];

export default function GameCasinoPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);
  const [current, setCurrent] = useState(0);
  const [bet, setBet] = useState(0);
  const [points, setPoints] = useState(0);

  const round = ROUNDS[current];
  const isLast = current === ROUNDS.length - 1;

  /** `totalPoints` es el saldo de fichas después de la apuesta. */
  const handleResult = ({
    result,
    totalPoints,
    options
  }: {
    result: boolean;
    totalPoints: number;
    options: { amount?: number }[];
  }) => {
    setPoints(totalPoints);
    setBet(options[0]?.amount ?? 0);
    setFeedback(result ? 'success' : 'wrong');
  };

  return (
    <GamePage
      link="/juegos/apuesta-inteligente"
      description={
        <>
          <p>
            Un casino educativo donde se apuestan fichas a lo que se sabe. En cada ronda hay una pregunta: el estudiante
            elige una respuesta y cuántas fichas apuesta a ella.
          </p>
          <p>Las fichas pasan de una ronda a otra. Al final, el estudiante cobra todo lo que ganó.</p>
        </>
      }
      correct={
        <ul>
          <li>La banca paga lo apostado y el saldo de fichas sube.</li>
          <li>Con «Siguiente ronda» se pasa a la siguiente pregunta.</li>
          <li>En la última ronda aparece «Cobrar fichas» con el resumen.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La banca se queda con la apuesta y el saldo baja.</li>
          <li>La misma pregunta se puede reintentar con el saldo que queda.</li>
          <li>Si el estudiante se queda sin fichas, la banca le presta para seguir jugando.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>Entre 3 y 5 rondas mantienen el interés; cada ronda es una pregunta.</li>
          <li>Usa 3 opciones por ronda, con una sola correcta.</li>
          <li>
            La apuesta mínima es de 10 fichas, así que una pregunta fallada nunca deja al estudiante sin poder
            continuar.
          </li>
          <li>
            Marca la última ronda con <code>last</code> y cambia la <code>key</code> de cada <code>Level</code> para que
            el juego muestre la pregunta nueva.
          </li>
          <li>
            Funciona mejor con preguntas que el estudiante sepa con distinto grado de seguridad: así decide cuánto
            apostar.
          </li>
        </ul>
      }
    >
      <Panel>
        {/* El juego envuelve las dos secciones: comparten las fichas. */}
        <GameCasino onResult={handleResult}>
          <Panel.Section>
            <Stage center>
              <p className="u-font-bold">Bienvenido al casino educativo. Apuesta con sabiduría.</p>
              <GameCasino.Init textInit="Apuesta fichas a lo que sabes y gana contra la banca." />
            </Stage>
          </Panel.Section>

          <Panel.Section>
            <Stage center>
              <p className="u-font-bold">
                Ronda {current + 1} de {ROUNDS.length}: elige una opción y la ficha según qué tan seguro estés.
              </p>
              <GameCasino.Level
                key={round.id}
                label={round.question}
                last={isLast}
                onNextRound={() => setCurrent((prev) => prev + 1)}
              >
                {round.answers.map((answer, index) => (
                  <GameCasino.Element
                    key={`${round.id}-${index}`}
                    bullet={String.fromCharCode(65 + index)}
                    id={`${round.id}-${index}`}
                    name={round.id}
                    label={answer.label}
                    state={answer.state}
                  />
                ))}
              </GameCasino.Level>
              <GameActions>
                <GameCasino.Button>
                  <Button label="Apostar" />
                </GameCasino.Button>
                <GameCasino.Button type="reset">
                  <Button label="Reintentar" />
                </GameCasino.Button>
              </GameActions>
            </Stage>
          </Panel.Section>
        </GameCasino>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success={`¡Ganaste la apuesta! La banca te paga ${bet} fichas y ahora tienes ${points}. ${isLast ? 'Pulsa «Cobrar fichas» para ver el resumen.' : 'Pulsa «Siguiente ronda» para continuar.'}`}
        wrong={`Esa no es la respuesta correcta y la banca se lleva tus ${bet} fichas. Te quedan ${points}. ¡Inténtalo otra vez!`}
      />
    </GamePage>
  );
}
