import { useState } from 'react';

import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button, Panel } from '@/components/ui';
import { GameCastle } from '@/games/game-castle';

const QUESTION = {
  question: '¿Cuál es el planeta más cercano al Sol?',
  answers: ['Venus', 'Mercurio', 'Marte', 'Júpiter'],
  correct: 'Mercurio'
};

export default function GameCastlePage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  return (
    <GamePage
      link="/juegos/castillo"
      description={
        <>
          <p>
            Un héroe frente a la puerta de un castillo. La pregunta aparece en una placa y cada respuesta es un bloque
            que el estudiante puede tocar. Con el bloque elegido pulsa «Comprobar».
          </p>
          <p>
            El juego empieza con una pantalla de inicio con las reglas. Cada pregunta va en su propio castillo: el
            docente puede poner una o varias seguidas.
          </p>
        </>
      }
      correct={
        <ul>
          <li>El héroe corre hasta la puerta y la puerta se abre.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>El héroe recibe el golpe y la puerta sigue cerrada.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede volver a elegir con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            La pregunta lleva <code>question</code>, <code>answers</code> y <code>correct</code>: la respuesta correcta
            debe ser <strong>idéntica</strong> a una de las opciones.
          </li>
          <li>Usa entre 3 y 4 respuestas: cada una es un bloque y con más se apelmazan.</li>
          <li>Escribe respuestas cortas (una o dos palabras): el texto va dentro del bloque.</li>
          <li>Evita respuestas repetidas: el bloque se identifica por su texto.</li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <GameCastle.Init textInit="Elige el bloque con la respuesta correcta y abre la puerta del castillo." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameCastle question={QUESTION} onResult={(result) => setFeedback(result ? 'success' : 'wrong')}>
              <GameCastle.Level alt="Castillo con la puerta cerrada y cuatro bloques con respuestas." />
              <GameActions>
                <GameCastle.Button>
                  <Button label="Comprobar" />
                </GameCastle.Button>
                <GameCastle.Button type="reset">
                  <Button label="Reintentar" />
                </GameCastle.Button>
              </GameActions>
            </GameCastle>
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Mercurio es el planeta más cercano al Sol y la puerta del castillo se abre."
        wrong="Ese bloque no abre la puerta. Piensa en el planeta que está más cerca del Sol e inténtalo otra vez."
      />
    </GamePage>
  );
}
