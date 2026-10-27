import { useState } from 'react';

import type { FieldsConfig, FieldsItem, ResultState } from '@/components';
import { FieldsEditor, GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';
import { MemoryCardActivity } from '@/games/game-memory-card';
import { useGameEditor } from '@/hooks';

// Cada pareja son dos tarjetas que se completan entre sí: un país y su capital.
const DEFAULT_PAIRS: FieldsItem[] = [
  { first: 'Colombia', second: 'Bogotá' },
  { first: 'Francia', second: 'París' },
  { first: 'Italia', second: 'Roma' },
  { first: 'España', second: 'Madrid' }
];

const CONFIG: FieldsConfig = {
  noun: 'pareja',
  min: 4,
  max: 4,
  intro: 'Cada pareja son dos tarjetas que se completan entre sí (país y capital, palabra y definición corta…).',
  fields: [
    { key: 'first', label: 'Primera tarjeta', hint: 'Una o dos palabras.', maxLength: 24 },
    { key: 'second', label: 'Su pareja', hint: 'Una o dos palabras.', maxLength: 24 }
  ],
  validate: (items) => {
    const texts = items.flatMap((item) => [item.first, item.second]).map((text) => text.toLowerCase());
    return new Set(texts).size === texts.length
      ? null
      : 'Hay tarjetas con el mismo texto: cada tarjeta debe ser distinta.';
  }
};

export default function GameMemoryCardPage() {
  const editor = useGameEditor(DEFAULT_PAIRS);
  const PAIRS = editor.content.map((item, index) => ({ id: index + 1, cards: [item.first, item.second] }));
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = (result: boolean) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/memoria"
      editor={editor}
      editorNoun="parejas"
      editorDialog={<FieldsEditor editor={editor} config={CONFIG} />}
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
        success={
          editor.customized
            ? '¡Genial! Encontraste todas las parejas.'
            : '¡Genial! Encontraste todas las parejas de países y capitales.'
        }
        wrong="Todavía faltan parejas por encontrar. ¡Vuelve a intentarlo!"
      />
    </GamePage>
  );
}
