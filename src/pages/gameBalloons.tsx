import { useState } from 'react';

import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';
import { GameBalloons } from '@/games/game-balloons';

export default function GameBalloonsPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/globos"
      description={
        <>
          <p>
            Una oración desordenada flota en globos. El estudiante debe explotarlos en el orden correcto para armar la
            oración completa.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Los globos explotan en el orden correcto y se arma la oración.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La oración queda en un orden distinto al esperado.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede volver a ordenar con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de oraciones:</strong> mínimo 1, máximo 1 por actividad. Si quieres más, envíalas todas y
            las ponemos en secciones distintas.
          </li>
          <li>
            <strong>Cantidad de globos:</strong> mínimo 4, máximo 8 fragmentos por oración: con más, el cielo se llena y
            cuesta leer cada uno.
          </li>
          <li>
            <strong>Cada oración:</strong> escríbela completa, con tildes y puntuación, y con un solo orden posible para
            que no haya respuestas válidas distintas.
          </li>
          <li>
            <strong>Fragmentos:</strong> agrupa en un mismo globo las palabras que van juntas («alrededor del Sol»); así
            ordenar es más natural.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Oración: La Tierra gira alrededor del Sol.
Globos: La Tierra | gira | alrededor del Sol.`}</pre>
          </li>
        </ul>
      }
    >
      <GameBalloons onResult={handleResult}>
        <Stage size="wide">
          <GameBalloons.Level
            words={['y tarda', 'La Tierra', 'en dar una vuelta.', 'alrededor del Sol', 'un año', 'gira']}
            sentence="La Tierra gira alrededor del Sol y tarda un año en dar una vuelta."
          />
          <GameActions>
            <GameBalloons.Button>
              <Button label="Comprobar" />
            </GameBalloons.Button>
            <GameBalloons.Button type="reset">
              <Button label="Reintentar" />
            </GameBalloons.Button>
          </GameActions>
        </Stage>
      </GameBalloons>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Excelente! Armaste la oración: la Tierra gira alrededor del Sol y tarda un año en dar una vuelta."
        wrong="El orden no es el correcto. Lee la oración con calma y vuelve a intentarlo."
      />
    </GamePage>
  );
}
