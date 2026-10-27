import { useState } from 'react';

import type { FieldsConfig, FieldsItem, ResultState } from '@/components';
import { FieldsEditor, GamePage, ResultModals, Stage } from '@/components';
import { Panel } from '@/components/ui';
import type { LoteriaQuestion } from '@/games/game-loteria';
import { GameLoteria } from '@/games/game-loteria';
import { useGameEditor } from '@/hooks';

const DEFAULT_CARDS: FieldsItem[] = [
  { hint: 'Vuela y canta en los árboles.', label: 'Pájaro', emoji: '🐦' },
  { hint: 'Nos da luz y calor durante el día.', label: 'Sol', emoji: '☀️' },
  { hint: 'Es el mejor amigo del ser humano.', label: 'Perro', emoji: '🐶' },
  { hint: 'Se bebe y es esencial para la vida.', label: 'Agua', emoji: '💧' },
  { hint: 'Brilla en el cielo por la noche.', label: 'Luna', emoji: '🌙' },
  { hint: 'Es una fruta roja que crece en los árboles.', label: 'Manzana', emoji: '🍎' },
  { hint: 'Es un vehículo de dos ruedas que se pedalea.', label: 'Bicicleta', emoji: '🚲' },
  { hint: 'Da leche y hace «muuu».', label: 'Vaca', emoji: '🐮' }
];

const CONFIG: FieldsConfig = {
  noun: 'pista',
  min: 6,
  max: 12,
  intro:
    'Cada pista describe una sola carta de la tabla. Todas las cartas de la tabla salen de las pistas que escribas.',
  fields: [
    {
      key: 'hint',
      label: 'Pista',
      hint: 'Si dos cartas pueden responderla, el estudiante se confunde.',
      multiline: true
    },
    { key: 'label', label: 'Nombre de la carta', hint: 'Una palabra, distinta a la de las demás.', maxLength: 16 },
    { key: 'emoji', label: 'Emoji de la carta', optional: true, maxLength: 8 }
  ],
  validate: (items) => {
    const labels = items.map((item) => item.label.toLowerCase());
    return new Set(labels).size === labels.length
      ? null
      : 'Hay cartas con el mismo nombre: cada carta debe ser distinta.';
  }
};

export default function GameLoteriaPage() {
  const editor = useGameEditor(DEFAULT_CARDS);
  const QUESTIONS: LoteriaQuestion[] = editor.content.map((item, index) => ({
    id: `loteria-${index + 1}`,
    question: item.hint,
    card: { label: item.label, ...(item.emoji && { emoji: item.emoji }) }
  }));
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/juegos/loteria"
      editor={editor}
      editorNoun="pistas"
      editorDialog={<FieldsEditor editor={editor} config={CONFIG} />}
      description={
        <>
          <p>
            Una tabla de lotería con cartas ilustradas. El cantor lee una pista y el estudiante toca, en su tabla, la
            carta que la responde.
          </p>
          <p>
            Acertar pone un frijol en la carta; completar una fila o una columna da un bono. El juego acaba cuando la
            tabla se llena: ¡Lotería!
          </p>
        </>
      }
      correct={
        <ul>
          <li>Se pone un frijol en la carta.</li>
          <li>Completar una fila o columna da un bono.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>La carta tocada queda descartada para esa pista.</li>
          <li>Con dos fallos seguidos, el cantor deja solo dos cartas posibles.</li>
          <li>Se abre el modal de error.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 6, máximo 12: la tabla se arma con una carta por pregunta.
          </li>
          <li>
            <strong>Cada pregunta:</strong> aquí no hay opciones: es una <strong>pista</strong> que describe una sola
            carta de la tabla. Si dos cartas pueden responderla, el estudiante se confunde.
          </li>
          <li>
            <strong>Cada carta:</strong> un nombre corto (una palabra), distinto al de las demás, y un emoji o una
            imagen que la represente.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Pista 1: Vuela y canta en los árboles.
Carta: Pájaro 🐦

Pista 2: ...`}</pre>
          </li>
        </ul>
      }
    >
      <Panel>
        <Panel.Section>
          <Stage center>
            <GameLoteria.Init textInit="Escucha la pista del cantor y marca en tu tabla la carta que la responde." />
          </Stage>
        </Panel.Section>

        <Panel.Section>
          <Stage size="wide">
            <GameLoteria questions={QUESTIONS} onResult={handleResult} />
          </Stage>
        </Panel.Section>
      </Panel>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Buena! Esa es la carta: el cantor pone un frijol en tu tabla."
        wrong="Esa carta no responde a la pista. Queda descartada: ¡prueba con otra!"
      />
    </GamePage>
  );
}
