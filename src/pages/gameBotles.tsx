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
            <strong>Cantidad de palabras:</strong> mínimo 1, máximo 1 por actividad. Si quieres más, envíalas todas y
            las ponemos en secciones distintas.
          </li>
          <li>
            <strong>Longitud de la palabra:</strong> mínimo 4 letras, máximo 8: cada botella es una letra y deben caber
            en pantalla.
          </li>
          <li>
            <strong>Cada palabra:</strong> conocida por el estudiante, sin espacios y sin muchas letras repetidas: el
            reto es ordenar, no adivinar.
          </li>
          <li>
            <strong>Pista:</strong> si la palabra responde a una pista o pregunta, envíala también para ponerla antes
            del juego.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Pista: Satélite natural de la Tierra.
Palabra: LUNA`}</pre>
          </li>
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
