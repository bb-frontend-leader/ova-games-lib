import { useState } from 'react';

import { Radios } from '@/activities/radio-activity';
import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';

import css from './activity-layout.module.css';

export default function ActivityRadioPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/actividades/seleccion-unica"
      description={
        <>
          <p>
            Una pregunta con opciones de respuesta de las que solo se puede elegir una. Es la actividad básica de
            selección única: ideal para verificar un concepto concreto.
          </p>
        </>
      }
      correct={
        <ul>
          <li>La opción elegida se marca como correcta.</li>
          <li>Se muestra la retroalimentación junto a la actividad.</li>
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
          <li>
            Entre 2 y 4 opciones por pregunta, con una sola correcta (la marcas con{' '}
            <code>state=&quot;success&quot;</code>).
          </li>
          <li>Para falso o verdadero, deja solo dos opciones.</li>
          <li>Una pregunta por actividad: si necesitas varias, repite la actividad en secciones distintas.</li>
          <li>Escribe en el modal por qué la respuesta es correcta: ahí está lo que el estudiante aprende.</li>
        </ul>
      }
    >
      <Stage center>
        <p className="u-font-bold">Selecciona la respuesta correcta.</p>
        <p className={css.question}>
          <strong>Pregunta 1.</strong> ¿Cuál es el animal más rápido de la tierra?
        </p>
        <Radios onResult={handleResult}>
          <div className={css.options}>
            <Radios.Radio id="radio-1" label="a. El guepardo" name="radio" state="success" />
            <Radios.Radio id="radio-2" label="b. El elefante" name="radio" state="wrong" />
            <Radios.Radio id="radio-3" label="c. La tortuga" name="radio" state="wrong" />
          </div>
          <GameActions>
            <Radios.Button>
              <Button label="Comprobar" />
            </Radios.Button>
            <Radios.Button type="reset">
              <Button label="Reintentar" />
            </Radios.Button>
          </GameActions>
          <Radios.Feedback />
        </Radios>
      </Stage>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Correcto! El guepardo es el animal terrestre más veloz: alcanza más de 100 km/h."
        wrong="Esa no es la respuesta correcta. Piensa en qué animal corre más rápido e inténtalo otra vez."
      />
    </GamePage>
  );
}
