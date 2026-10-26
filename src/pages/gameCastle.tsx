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
            <strong>Cantidad de preguntas:</strong> mínimo 1, máximo 1: cada actividad contiene una sola pregunta. Si
            quieres más, envíalas todas y las ponemos en secciones distintas.
          </li>
          <li>
            <strong>Cada pregunta:</strong> un enunciado corto y claro, que se pueda responder sin ayuda externa.
          </li>
          <li>
            <strong>Respuestas:</strong> 3 o 4 respuestas, cada una en un bloque del castillo: de una o dos palabras,
            con <strong>una sola correcta</strong> (márcala). Escríbelas cortas y de longitud parecida.
          </li>
          <li>
            <strong>Cuidado:</strong> no repitas respuestas: cada bloque se identifica por su texto.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Pregunta 1: ¿Cuál es la capital de Francia?
A) París (correcta)
B) Roma
C) Madrid`}</pre>
          </li>
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
