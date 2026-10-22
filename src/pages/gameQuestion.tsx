import { useState } from 'react';

import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';
import { GameQuestion } from '@/games/game-question';

export default function GameQuestionPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/desafio-de-conocimiento"
      description={
        <>
          <p>
            Una tarjeta de pregunta con varias opciones de respuesta. El estudiante lee el enunciado, elige una opción y
            pulsa «Comprobar».
          </p>
          <p>Es el formato más sencillo de la biblioteca: sirve para repasar un concepto sin distracciones.</p>
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
          <li>Se puede volver a responder con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>Usa entre 3 y 4 opciones, con una sola correcta.</li>
          <li>
            Pasa a <code>questionNumber</code> el número de la pregunta si tu OVA tiene varias en seguidilla.
          </li>
          <li>
            Los espacios en blanco se escriben con guiones bajos (<code>______</code>): el enunciado queda como una
            frase por completar.
          </li>
          <li>Escribe las opciones con una longitud parecida, para que la correcta no destaque por ser más larga.</li>
        </ul>
      }
    >
      <Stage>
        <GameQuestion onResult={handleResult}>
          <GameQuestion.Card
            question="Si tengo 15 manzanas y le doy 7 a mi amigo, me quedan ______ manzanas."
            questionNumber="1"
          >
            <GameQuestion.Radio label="5" state="wrong" id="question-1" name="question" />
            <GameQuestion.Radio label="10" state="wrong" id="question-2" name="question" />
            <GameQuestion.Radio label="7" state="wrong" id="question-3" name="question" />
            <GameQuestion.Radio label="8" state="success" id="question-4" name="question" />
          </GameQuestion.Card>
          <GameActions>
            <GameQuestion.Button>
              <Button label="Comprobar" />
            </GameQuestion.Button>
            <GameQuestion.Button type="reset">
              <Button label="Reintentar" />
            </GameQuestion.Button>
          </GameActions>
        </GameQuestion>
      </Stage>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! 15 − 7 = 8, así que te quedan 8 manzanas."
        wrong="Esa no es la respuesta. Haz la resta con calma e inténtalo otra vez."
      />
    </GamePage>
  );
}
