import { useState } from 'react';

import { TableTrueFalseActivity } from '@/activities/table-true-false-activity';
import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';

// La actividad recibe los enunciados con su respuesta para validar; cada `Option` los muestra.
const STATEMENTS = [
  {
    id: '1',
    label: 'La Tierra es el tercer planeta desde el Sol.',
    correct: true,
    success: 'Correcto: la Tierra es el tercer planeta, después de Mercurio y Venus.',
    wrong: 'Incorrecto: la Tierra sí es el tercer planeta desde el Sol.'
  },
  {
    id: '2',
    label: 'Las ballenas son peces.',
    correct: false,
    success: 'Correcto: las ballenas son mamíferos, no peces.',
    wrong: 'Incorrecto: las ballenas son mamíferos; respiran aire y amamantan a sus crías.'
  },
  {
    id: '3',
    label: 'El corazón bombea la sangre por todo el cuerpo.',
    correct: true,
    success: 'Correcto: el corazón es el músculo que impulsa la sangre.',
    wrong: 'Incorrecto: bombear la sangre es justamente la función del corazón.'
  }
];

const OPTIONS = STATEMENTS.map(({ id, label, correct }) => ({ id, label, correct }));

export default function ActivityTableTrueFalsePage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/actividades/verdadero-o-falso-con-retroalimentacion"
      description={
        <>
          <p>
            Una tabla con enunciados y las columnas «Verdadero» y «Falso». Después de comprobar, cada fila muestra su
            propia retroalimentación: el estudiante ve exactamente en cuáles se equivocó.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Cada fila correcta muestra su mensaje de acierto.</li>
          <li>Si todas son correctas, se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>Cada fila incorrecta muestra su mensaje de error con la explicación.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede volver a responder con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>Entre 3 y 6 filas: la tabla se lee de un vistazo.</li>
          <li>
            Escribe una retroalimentación distinta para cada fila (<code>success</code> y <code>wrong</code>): explica
            por qué, no solo si acertó.
          </li>
          <li>
            Usa <code>variant=&quot;yesno&quot;</code> en una fila si prefieres las etiquetas «Sí / No».
          </li>
          <li>Mezcla filas verdaderas y falsas.</li>
        </ul>
      }
    >
      <Stage>
        <p className="u-font-bold u-text-center">Selecciona verdadero o falso según corresponda.</p>
        <TableTrueFalseActivity onResult={handleResult} options={OPTIONS}>
          {STATEMENTS.flatMap(({ id, label, correct, success, wrong }) => [
            <TableTrueFalseActivity.Option key={`option-${id}`} id={id} label={label} correct={correct} />,
            <TableTrueFalseActivity.Feedback
              key={`feedback-${id}`}
              id={id}
              success={{ feedback: success }}
              wrong={{ feedback: wrong }}
            />
          ])}
          <GameActions>
            <TableTrueFalseActivity.Button>
              <Button label="Comprobar" />
            </TableTrueFalseActivity.Button>
            <TableTrueFalseActivity.Button type="reset">
              <Button label="Reintentar" />
            </TableTrueFalseActivity.Button>
          </GameActions>
        </TableTrueFalseActivity>
      </Stage>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Excelente! Identificaste correctamente todos los enunciados."
        wrong="Revisa la retroalimentación de cada fila e inténtalo otra vez."
      />
    </GamePage>
  );
}
