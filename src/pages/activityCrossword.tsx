import { useState } from 'react';

import type { CrosswordWord, WordResult } from '@/activities/crossword-activity';
import { Crossword } from '@/activities/crossword-activity';
import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';

// Cada palabra se ubica con su fila, columna y dirección; la numeración, los cruces y la cuadrícula se calculan solos.
// Las palabras que se cruzan deben compartir la letra de la celda donde se encuentran.
const WORDS: CrosswordWord[] = [
  {
    answer: 'Luna',
    clue: 'Satélite natural de la Tierra: brilla en el cielo de noche.',
    row: 0,
    col: 5,
    direction: 'down'
  },
  {
    answer: 'Marte',
    clue: 'Planeta conocido como el planeta rojo.',
    row: 1,
    col: 3,
    direction: 'down'
  },
  {
    answer: 'Tierra',
    clue: 'Planeta en el que vivimos.',
    row: 3,
    col: 0,
    direction: 'across'
  }
];

const DIRECTIONS = { across: 'horizontal', down: 'vertical' };

export default function ActivityCrosswordPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);
  const [wrongWords, setWrongWords] = useState<WordResult[]>([]);

  const handleResult = ({ result, words }: { result: boolean; words: WordResult[] }) => {
    setWrongWords(words.filter((word) => !word.correct));
    setFeedback(result ? 'success' : 'wrong');
  };

  return (
    <GamePage
      link="/actividades/crucigrama"
      description={
        <>
          <p>
            Un crucigrama con pistas horizontales y verticales. El estudiante lee cada pista y escribe la palabra en la
            cuadrícula; las palabras se cruzan y se ayudan entre sí.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Todas las palabras están bien escritas.</li>
          <li>Se muestra la retroalimentación y se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>Las palabras con error se marcan en la cuadrícula.</li>
          <li>El modal dice qué pistas revisar (por ejemplo, «2 vertical»).</li>
          <li>Se puede volver a escribir con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de palabras:</strong> mínimo 3, máximo 6: con más, la cuadrícula crece y se vuelve difícil
            de ver en el celular.
          </li>
          <li>
            <strong>Cada palabra:</strong> una respuesta sin espacios y una <strong>pista corta</strong> que no contenga
            la respuesta.
          </li>
          <li>
            <strong>Cruces:</strong> procura que algunas palabras compartan letras; donde se crucen, la letra debe ser
            la misma en ambas. Nosotros armamos la cuadrícula y la numeración.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`1) Pista: Planeta rojo. → MARTE
2) Pista: Satélite de la Tierra. → LUNA
3) ...`}</pre>
          </li>
        </ul>
      }
    >
      <Stage>
        <p className="u-font-bold u-text-center">Completa el crucigrama con los nombres de los astros.</p>
        <Crossword words={WORDS} onResult={handleResult}>
          <Crossword.Board />
          <Crossword.Clues />
          <GameActions>
            <Crossword.Button>
              <Button label="Comprobar" />
            </Crossword.Button>
            <Crossword.Button type="reset">
              <Button label="Reintentar" />
            </Crossword.Button>
          </GameActions>
          <Crossword.Feedback />
        </Crossword>
      </Stage>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Muy bien! Completaste el crucigrama: Luna, Marte y Tierra."
        wrong={`Hay palabras por revisar${
          wrongWords.length > 0
            ? `: ${wrongWords.map((word) => `${word.number} ${DIRECTIONS[word.direction]}`).join(', ')}`
            : ''
        }. Vuelve a leer las pistas.`}
      />
    </GamePage>
  );
}
