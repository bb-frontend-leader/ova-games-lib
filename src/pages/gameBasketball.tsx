import { useState } from 'react';

import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button, Panel } from '@/components/ui';
import { GameBasketball } from '@/games/game-basketball';

type Answer = { label: string; state: 'success' | 'wrong' };

const SHOTS: { id: string; question: string; answers: Answer[] }[] = [
  {
    id: 's1',
    question: '¿Qué animal es conocido como el rey de la selva?',
    answers: [
      { label: 'El león', state: 'success' },
      { label: 'El delfín', state: 'wrong' },
      { label: 'El pingüino', state: 'wrong' }
    ]
  },
  {
    id: 's2',
    question: '¿Cuántos meses tiene un año?',
    answers: [
      { label: 'Diez', state: 'wrong' },
      { label: 'Doce', state: 'success' },
      { label: 'Catorce', state: 'wrong' }
    ]
  },
  {
    id: 's3',
    question: '¿De qué color se ve el cielo en un día despejado?',
    answers: [
      { label: 'Rojo', state: 'wrong' },
      { label: 'Verde', state: 'wrong' },
      { label: 'Azul', state: 'success' }
    ]
  }
];

export default function GameBasketballPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);
  const [current, setCurrent] = useState(0);

  const shot = SHOTS[current];
  const isLast = current === SHOTS.length - 1;

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/baloncesto"
      description={
        <>
          <p>
            Un partido de baloncesto de preguntas. Cada tiro es una pregunta: el estudiante elige la canasta con la
            respuesta que cree correcta y lanza el balón.
          </p>
          <p>El marcador acumula los puntos de todo el partido y premia las rachas de canastas seguidas.</p>
        </>
      }
      correct={
        <ul>
          <li>El balón entra en la canasta y se suman puntos al marcador.</li>
          <li>Las canastas seguidas dan puntos extra por racha.</li>
          <li>Con el botón del juego se pasa al siguiente tiro; tras el último se ve el resumen del partido.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>El balón rebota en el aro y se pierde la racha.</li>
          <li>El tiro no suma puntos.</li>
          <li>Se puede volver a tirar la misma pregunta con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>Entre 3 y 5 tiros hacen un partido corto; más de 8 se vuelve repetitivo.</li>
          <li>Usa 3 opciones por tiro (cada una es una canasta) y una sola correcta.</li>
          <li>
            Cambia la <code>key</code> de <code>GameBasketball.Provider</code> en cada tiro: así el juego se reinicia
            con la pregunta nueva.
          </li>
          <li>
            Marca el último tiro con <code>last</code>: es el que muestra el resumen final del partido.
          </li>
          <li>Redacta preguntas cortas; el texto se muestra sobre la cancha.</li>
        </ul>
      }
    >
      <Panel>
        {/* El juego envuelve las dos secciones para que el marcador sea el mismo en todo el partido. */}
        <GameBasketball onResult={handleResult}>
          <Panel.Section>
            <Stage center>
              <p className="u-font-bold">
                Encesta el balón en la canasta con la respuesta correcta y suma puntos con tu racha.
              </p>
              <GameBasketball.Init section={1} />
            </Stage>
          </Panel.Section>

          <Panel.Section>
            <Stage center>
              <p className="u-font-bold">
                Tiro {current + 1} de {SHOTS.length}: elige la canasta con la respuesta correcta.
              </p>
              <GameBasketball.Provider
                key={shot.id}
                question={shot.question}
                last={isLast}
                onNextShot={() => setCurrent((prev) => prev + 1)}
              >
                {shot.answers.map((answer, index) => (
                  <GameBasketball.Radio
                    key={`${shot.id}-${index}`}
                    label={`${String.fromCharCode(65 + index)}. ${answer.label}`}
                    state={answer.state}
                    id={`${shot.id}-${index}`}
                    name={shot.id}
                  />
                ))}
              </GameBasketball.Provider>
              <GameActions>
                <GameBasketball.Button>
                  <Button label="Tirar" />
                </GameBasketball.Button>
                <GameBasketball.Button type="reset">
                  <Button label="Reintentar" />
                </GameBasketball.Button>
              </GameActions>
            </Stage>
          </Panel.Section>
        </GameBasketball>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Canasta! Pulsa «Siguiente tiro» dentro del juego para continuar."
        wrong="El balón rebotó. Revisa las opciones y vuelve a intentarlo."
      />
    </GamePage>
  );
}
