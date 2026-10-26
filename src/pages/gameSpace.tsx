import { useState } from 'react';

import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button, Panel } from '@/components/ui';
import { GameSpace } from '@/games/game-space';

export default function GameSpacePage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/mision-espacial"
      description={
        <>
          <p>
            Una misión espacial de preguntas. El estudiante pilota una nave por la galaxia y la lleva hasta el planeta
            que tiene la respuesta correcta.
          </p>
          <p>El juego empieza con una pantalla de bienvenida y después muestra la galaxia con las opciones.</p>
        </>
      }
      correct={
        <ul>
          <li>La nave llega al planeta correcto.</li>
          <li>Se muestra un modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La nave se aleja del destino.</li>
          <li>Se muestra un modal de error.</li>
          <li>Se puede volver a intentar con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 1, máximo 5: cada pregunta es una galaxia. Si prefieres una
            sola por sección, envíalas todas y las repartimos.
          </li>
          <li>
            <strong>Respuestas:</strong> <strong>2 a 4</strong> por pregunta (cada una es un planeta), con{' '}
            <strong>una sola correcta</strong> (márcala). Muy cortas: una o dos palabras.
          </li>
          <li>
            <strong>Temas:</strong> funciona muy bien para ciencias, pero sirve para cualquier tema.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Pregunta 1: ¿Cuál es el planeta más cercano al Sol?
A) Mercurio (correcta)
B) Venus
C) La Tierra
D) Marte`}</pre>
          </li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <p className="u-font-bold">Bienvenido a bordo. Prepárate para la misión galáctica.</p>
            <GameSpace.Init universeType="1" textInit="¡Hola, viajero! Responde bien y llegaremos a nuestro destino." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage center>
            <p className="u-font-bold">Viaja por la galaxia hasta la respuesta correcta.</p>
            <GameSpace onResult={handleResult}>
              <GameSpace.Galaxy question="¿Cuál es el planeta más cercano al Sol?" universeType="1">
                <GameSpace.Radio label="Mercurio" state="success" id="space-1" name="space" />
                <GameSpace.Radio label="Venus" state="wrong" id="space-2" name="space" />
                <GameSpace.Radio label="La Tierra" state="wrong" id="space-3" name="space" />
                <GameSpace.Radio label="Marte" state="wrong" id="space-4" name="space" />
              </GameSpace.Galaxy>
              <GameActions>
                <GameSpace.Button>
                  <Button label="Comprobar" />
                </GameSpace.Button>
                <GameSpace.Button type="reset">
                  <Button label="Reintentar" />
                </GameSpace.Button>
              </GameActions>
            </GameSpace>
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Misión cumplida! Mercurio es el planeta más cercano al Sol."
        wrong="Ese no es el planeta correcto. ¡Vuelve a intentarlo!"
      />
    </GamePage>
  );
}
