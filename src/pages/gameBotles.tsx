import { useState } from 'react';

import type { FieldsConfig, FieldsItem, ResultState } from '@/components';
import { FieldsEditor, GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';
import { GameBottle } from '@/games/game-bottles';
import { useGameEditor } from '@/hooks';

const DEFAULT_ITEMS: FieldsItem[] = [{ word: 'PERRO', hint: '' }];

const CONFIG: FieldsConfig = {
  noun: 'palabra',
  min: 1,
  max: 1,
  intro:
    'Escribe la palabra escondida: cada letra va en una botella y el estudiante debe ordenarlas. Si quieres, agrega una pista que se muestra antes del juego.',
  fields: [
    { key: 'word', label: 'Palabra', hint: 'De 4 a 8 letras, sin espacios.', maxLength: 8 },
    { key: 'hint', label: 'Pista', optional: true, maxLength: 120 }
  ],
  validate: ([item]) =>
    /^\p{L}{4,8}$/u.test(item.word) ? null : 'La palabra debe tener de 4 a 8 letras, sin espacios ni símbolos.'
};

export default function GameBotlesPage() {
  const editor = useGameEditor(DEFAULT_ITEMS);
  const word = editor.content[0].word.toUpperCase();
  const hint = editor.content[0].hint;
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = (result: boolean) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/rescate-submarino"
      editor={editor}
      editorNoun="palabras"
      editorDialog={<FieldsEditor editor={editor} config={CONFIG} />}
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
        {hint && <p className="u-font-bold">Pista: {hint}</p>}
        <GameBottle onResult={handleResult}>
          <GameBottle.Letters word={word} />
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
        success={`¡Muy bien! Formaste la palabra ${word}.`}
        wrong="Esa no es la palabra. Ordena las letras y vuelve a intentarlo."
      />
    </GamePage>
  );
}
