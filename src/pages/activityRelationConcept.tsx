import { useState } from 'react';

import { RelationConcept } from '@/activities/relation-concept-activity';
import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';

// Dos tarjetas forman una pareja cuando comparten el mismo `pair`. Cualquier tarjeta puede vincularse con cualquier otra.
// Un `label` que termina en una extensión de imagen se dibuja como imagen y necesita un `alt`.
const PAIRS = [
  { id: 'concept-1', label: 'Capital de Colombia', pair: 1 },
  { id: 'concept-2', label: 'El planeta rojo', pair: 2 },
  { id: 'concept-3', label: 'Animal que da leche', pair: 3 },
  { id: 'concept-4', label: 'El océano más grande', pair: 4 },
  { id: 'answer-3', label: 'La vaca', pair: 3 },
  { id: 'answer-1', label: 'Bogotá', pair: 1 },
  { id: 'answer-4', label: 'Océano Pacífico', pair: 4 },
  { id: 'answer-2', label: 'Marte', pair: 2 }
];

export default function ActivityRelationConceptPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);
  const [score, setScore] = useState({ correctCount: 0, total: 0 });

  const handleResult = ({ result, correctCount, total }: { result: boolean; correctCount: number; total: number }) => {
    setScore({ correctCount, total });
    setFeedback(result ? 'success' : 'wrong');
  };

  return (
    <GamePage
      link="/actividades/vincular-conceptos"
      description={
        <>
          <p>
            Tarjetas para relacionar. El estudiante selecciona dos tarjetas para vincularlas, por ejemplo un concepto y
            su definición, y cuando todas están vinculadas comprueba.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Todas las parejas vinculadas son correctas.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>El modal indica cuántas parejas son correctas.</li>
          <li>Con «Reintentar» se conservan las correctas y se pueden volver a vincular las demás.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>Entre 3 y 6 parejas (6 a 12 tarjetas).</li>
          <li>
            Dos tarjetas forman una pareja cuando comparten el mismo <code>pair</code>; cada tarjeta lleva un{' '}
            <code>id</code> único.
          </li>
          <li>
            Una tarjeta puede ser una imagen: usa un <code>label</code> que termine en <code>.svg</code>,{' '}
            <code>.webp</code> o <code>.png</code> y agrega su <code>alt</code>.
          </li>
          <li>Escribe textos cortos: las tarjetas son pequeñas.</li>
        </ul>
      }
    >
      <Stage size="wide">
        <p className="u-font-bold u-text-center">
          Selecciona dos tarjetas para vincular cada concepto con su respuesta. Cuando todas estén vinculadas, pulsa
          Comprobar.
        </p>
        <RelationConcept pairs={PAIRS} onResult={handleResult}>
          <RelationConcept.Card pairs={PAIRS} />
          <GameActions>
            <RelationConcept.Button>
              <Button label="Comprobar" />
            </RelationConcept.Button>
            <RelationConcept.Button type="reset">
              <Button label="Reintentar" />
            </RelationConcept.Button>
          </GameActions>
          <RelationConcept.Feedback />
        </RelationConcept>
      </Stage>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Excelente! Relacionaste correctamente todas las parejas."
        wrong={`${score.correctCount} de ${score.total} parejas son correctas. Pulsa Reintentar: las correctas se conservan y puedes vincular las demás.`}
      />
    </GamePage>
  );
}
