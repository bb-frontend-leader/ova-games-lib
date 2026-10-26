import { useState } from 'react';

import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';
import { GameThisOrThat } from '@/games/game-this-or-that';

export default function GameThisOrThatPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/cual-prefieres"
      description={
        <>
          <p>
            Un duelo entre dos opciones. El estudiante lee el enunciado y elige entre «esto» o «aquello»: solo una de
            las dos es correcta.
          </p>
        </>
      }
      correct={
        <ul>
          <li>La opción elegida se marca como correcta.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La opción elegida se marca como incorrecta.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede volver a elegir con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 3, máximo 6. Como hay un 50 % de acierto al azar, úsalo con
            varias preguntas seguidas.
          </li>
          <li>
            <strong>Cada pregunta:</strong> un concepto que se confunde con otro (mamífero o reptil, sustantivo o verbo,
            vertebrado o invertebrado).
          </li>
          <li>
            <strong>Respuestas:</strong> <strong>exactamente 2 opciones</strong>, una correcta (márcala), de longitud
            parecida.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Pregunta 1: ¿La ballena es…?
A) Mamífero (correcta)
B) Pez

Pregunta 2: ...`}</pre>
          </li>
        </ul>
      }
    >
      <Stage>
        <GameThisOrThat onResult={handleResult}>
          <GameThisOrThat.Level
            question="Los animales que alimentan a sus crías con leche se llaman…"
            questionNumber={1}
          >
            <GameThisOrThat.Radio label="a. Mamíferos" state="success" id="tot-1" name="tot" />
            <GameThisOrThat.Radio label="b. Reptiles" state="wrong" id="tot-2" name="tot" />
          </GameThisOrThat.Level>
          <GameActions>
            <GameThisOrThat.Button>
              <Button label="Comprobar" />
            </GameThisOrThat.Button>
            <GameThisOrThat.Button type="reset">
              <Button label="Reintentar" />
            </GameThisOrThat.Button>
          </GameActions>
        </GameThisOrThat>
      </Stage>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! Los mamíferos alimentan a sus crías con leche."
        wrong="Esa no es la opción correcta. Piensa qué animales dan leche y vuelve a intentarlo."
      />
    </GamePage>
  );
}
