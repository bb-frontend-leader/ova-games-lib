import { useState } from 'react';

import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';
import { MemoryCardActivity } from '@/games/game-memory-card';

// Cada pareja son dos tarjetas con el mismo `id`: un país y su capital.
const PAIRS = [
  { id: 1, cards: ['Colombia', 'Bogotá'] },
  { id: 2, cards: ['Francia', 'París'] },
  { id: 3, cards: ['Italia', 'Roma'] },
  { id: 4, cards: ['España', 'Madrid'] }
];

export default function GameMemoryCardPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = (result: boolean) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/memoria"
      description={
        <>
          <p>
            Un juego de memoria con tarjetas boca abajo. El estudiante voltea dos tarjetas por turno y debe encontrar
            las parejas que se corresponden.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Las tarjetas de una pareja se quedan descubiertas.</li>
          <li>Al encontrar todas las parejas se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>Las tarjetas que no hacen pareja vuelven a taparse.</li>
          <li>Si al comprobar faltan parejas, se abre el modal de error.</li>
          <li>Se puede volver a jugar con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de parejas:</strong> exactamente <strong>4 parejas</strong> (8 tarjetas): ni más ni menos.
          </li>
          <li>
            <strong>Cada pareja:</strong> dos tarjetas que se completan entre sí: país y capital, palabra y definición
            corta, término y símbolo.
          </li>
          <li>
            <strong>Textos:</strong> una o dos palabras por tarjeta, para que se lean al voltearlas.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Pareja 1: Colombia — Bogotá
Pareja 2: Francia — París
Pareja 3: ...
Pareja 4: ...`}</pre>
          </li>
        </ul>
      }
    >
      <Stage size="wide">
        <MemoryCardActivity onResult={handleResult}>
          <MemoryCardActivity.Board />

          {PAIRS.flatMap(({ id, cards }) =>
            cards.map((text) => (
              <MemoryCardActivity.Card key={`${id}-${text}`} id={id}>
                <MemoryCardActivity.CardBack>
                  <div aria-hidden="true">?</div>
                </MemoryCardActivity.CardBack>
                <MemoryCardActivity.CardFront>
                  <div>{text}</div>
                </MemoryCardActivity.CardFront>
              </MemoryCardActivity.Card>
            ))
          )}

          <GameActions>
            <MemoryCardActivity.Button>
              <Button label="Comprobar" />
            </MemoryCardActivity.Button>
            <MemoryCardActivity.Button type="reset">
              <Button label="Reintentar" />
            </MemoryCardActivity.Button>
          </GameActions>
        </MemoryCardActivity>
      </Stage>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Genial! Encontraste todas las parejas de países y capitales."
        wrong="Todavía faltan parejas por encontrar. ¡Vuelve a intentarlo!"
      />
    </GamePage>
  );
}
