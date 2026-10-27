import { useMemo, useState } from 'react';

import type { FieldsConfig, FieldsItem, ResultState } from '@/components';
import { FieldsEditor, GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';
import { GameBalloons } from '@/games/game-balloons';
import { useGameEditor } from '@/hooks';

const DEFAULT_ITEMS: FieldsItem[] = [
  { pieces: 'La Tierra | gira | alrededor del Sol | y tarda | un año | en dar una vuelta.' }
];

const splitPieces = (text: string) =>
  text
    .split('|')
    .map((piece) => piece.trim())
    .filter(Boolean);

/** Desordena los fragmentos; si el azar los deja en el orden correcto, los rota un lugar. */
const scramble = (pieces: string[]) => {
  const out = [...pieces];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.every((piece, i) => piece === pieces[i]) ? [...out.slice(1), out[0]] : out;
};

const CONFIG: FieldsConfig = {
  noun: 'oración',
  min: 1,
  max: 1,
  intro:
    'Escribe la oración dividida en fragmentos, en el orden correcto y separados con «|». El juego los desordena y los reparte en los globos.',
  fields: [
    {
      key: 'pieces',
      label: 'Fragmentos de la oración',
      hint: 'Ejemplo: La Tierra | gira | alrededor del Sol.',
      multiline: true
    }
  ],
  validate: ([item]) => {
    const count = splitPieces(item.pieces).length;
    return count < 4 || count > 8
      ? `La oración debe tener de 4 a 8 fragmentos separados con «|»; tiene ${count}.`
      : null;
  }
};

export default function GameBalloonsPage() {
  const editor = useGameEditor(DEFAULT_ITEMS);
  const pieces = splitPieces(editor.content[0].pieces);
  const sentence = pieces.join(' ');
  // Se desordena una sola vez por contenido: si cambiara en cada render, el juego reiniciaría los globos.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const words = useMemo(() => scramble(pieces), [editor.content]);
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/globos"
      editor={editor}
      editorNoun="oraciones"
      editorDialog={<FieldsEditor editor={editor} config={CONFIG} />}
      description={
        <>
          <p>
            Una oración desordenada flota en globos. El estudiante debe explotarlos en el orden correcto para armar la
            oración completa.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Los globos explotan en el orden correcto y se arma la oración.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La oración queda en un orden distinto al esperado.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede volver a ordenar con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de oraciones:</strong> mínimo 1, máximo 1 por actividad. Si quieres más, envíalas todas y
            las ponemos en secciones distintas.
          </li>
          <li>
            <strong>Cantidad de globos:</strong> mínimo 4, máximo 8 fragmentos por oración: con más, el cielo se llena y
            cuesta leer cada uno.
          </li>
          <li>
            <strong>Cada oración:</strong> escríbela completa, con tildes y puntuación, y con un solo orden posible para
            que no haya respuestas válidas distintas.
          </li>
          <li>
            <strong>Fragmentos:</strong> agrupa en un mismo globo las palabras que van juntas («alrededor del Sol»); así
            ordenar es más natural.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Oración: La Tierra gira alrededor del Sol.
Globos: La Tierra | gira | alrededor del Sol.`}</pre>
          </li>
        </ul>
      }
    >
      <GameBalloons onResult={handleResult}>
        <Stage size="wide">
          <GameBalloons.Level words={words} sentence={sentence} />
          <GameActions>
            <GameBalloons.Button>
              <Button label="Comprobar" />
            </GameBalloons.Button>
            <GameBalloons.Button type="reset">
              <Button label="Reintentar" />
            </GameBalloons.Button>
          </GameActions>
        </Stage>
      </GameBalloons>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success={`¡Excelente! Armaste la oración: ${sentence}`}
        wrong="El orden no es el correcto. Lee la oración con calma y vuelve a intentarlo."
      />
    </GamePage>
  );
}
