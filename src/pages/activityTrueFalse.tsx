import { useState } from 'react';

import { TrueFalseActivity } from '@/activities/true-false-activity';
import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';

import css from './activity-layout.module.css';

const STATEMENTS = [
  { text: 'El Sol es una estrella.', answer: true },
  { text: 'Los peces respiran aire con pulmones.', answer: false },
  { text: 'El agua hierve a 100 °C al nivel del mar.', answer: true }
];

export default function ActivityTrueFalsePage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/actividades/verdadero-o-falso"
      description={
        <>
          <p>
            Una lista de enunciados. El estudiante decide, uno por uno, si cada afirmación es verdadera o falsa, y
            comprueba todas a la vez.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Todos los enunciados tienen la respuesta correcta.</li>
          <li>Se muestra la retroalimentación y se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>Al menos un enunciado tiene la respuesta equivocada.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede volver a responder con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de enunciados:</strong> mínimo 3, máximo 5 por actividad.
          </li>
          <li>
            <strong>Cada enunciado:</strong> una afirmación corta, sin dobles negaciones. Mezcla verdaderos y falsos: si
            todos son verdaderos, el estudiante lo notará.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`1) La Tierra es plana. → Falso
2) El agua hierve a 100 °C al nivel del mar. → Verdadero
3) ...`}</pre>
          </li>
        </ul>
      }
    >
      <Stage>
        <p className="u-font-bold u-text-center">Indica si cada enunciado es verdadero o falso.</p>
        <TrueFalseActivity onResult={handleResult} minSelected={STATEMENTS.length}>
          {STATEMENTS.map((statement, index) => (
            <div key={statement.text} className={css.statement}>
              <p>
                <strong>{index + 1}.</strong> {statement.text}
              </p>
              <div className={css.options}>
                <TrueFalseActivity.Option
                  name={`enunciado-${index + 1}`}
                  label="Verdadero"
                  state={statement.answer ? 'success' : 'wrong'}
                />
                <TrueFalseActivity.Option
                  name={`enunciado-${index + 1}`}
                  label="Falso"
                  state={statement.answer ? 'wrong' : 'success'}
                />
              </div>
            </div>
          ))}
          <GameActions>
            <TrueFalseActivity.Button>
              <Button label="Comprobar" />
            </TrueFalseActivity.Button>
            <TrueFalseActivity.Button type="reset">
              <Button label="Reintentar" />
            </TrueFalseActivity.Button>
          </GameActions>
          <TrueFalseActivity.Feedback />
        </TrueFalseActivity>
      </Stage>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Excelente! El Sol es una estrella, los peces respiran por branquias y el agua hierve a 100 °C."
        wrong="Hay enunciados por revisar. Léelos con calma e inténtalo otra vez."
      />
    </GamePage>
  );
}
