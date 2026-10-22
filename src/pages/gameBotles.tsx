import { useState } from 'react';

import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';
import { GameBottle } from '@/games/game-bottles';

export default function GameBotlesPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = (result: boolean) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/rescate-submarino"
      description={
        <>
          <p>
            Cada botella guarda una letra. El estudiante debe tomar las letras y ordenarlas para formar la palabra
            escondida.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Las letras quedan en el orden de la palabra.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La palabra formada no coincide con la esperada.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede volver a empezar con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            Cada botella es una letra: usa palabras de entre 4 y 8 letras para que quepan las botellas en pantalla.
          </li>
          <li>
            Escribe <code>word</code> en mayúsculas y sin espacios.
          </li>
          <li>Elige palabras conocidas y sin letras repetidas en exceso: así el reto es ordenar, no adivinar.</li>
          <li>Si la palabra responde a una pista, escríbela en el enunciado de tu OVA, antes del juego.</li>
        </ul>
      }
    >
      <Stage size="wide">
        <GameBottle onResult={handleResult}>
          <GameBottle.Letters word="PERRO" />
          <GameBottle.Word />
          <GameActions>
            <GameBottle.Actions type="validation">
              <Button label="Comprobar" />
            </GameBottle.Actions>
            <GameBottle.Actions type="reset">
              <Button label="Reintentar" />
            </GameBottle.Actions>
          </GameActions>
        </GameBottle>
      </Stage>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Muy bien! Formaste la palabra PERRO."
        wrong="Esa no es la palabra. Ordena las letras y vuelve a intentarlo."
      />
    </GamePage>
  );
}
