import { useState } from 'react';

import { Checkboxs } from '@/activities/checkbox-activity';
import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';

import css from './activity-layout.module.css';

// Número de opciones que deben marcarse. Se pasa a `minSelected` para habilitar «Comprobar».
const CORRECT_OPTIONS = 3;

export default function ActivityCheckboxPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/actividades/seleccion-multiple"
      description={
        <>
          <p>
            Una pregunta con varias opciones de las que se pueden marcar una o más. El estudiante debe marcar todas las
            correctas y ninguna incorrecta.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Las opciones marcadas son todas correctas.</li>
          <li>Se muestra la retroalimentación y se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>Alguna de las opciones marcadas es incorrecta.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede volver a marcar con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de preguntas:</strong> mínimo 1, máximo 1 por actividad. Si quieres más, envíalas todas y
            las ponemos en secciones distintas.
          </li>
          <li>
            <strong>Respuestas:</strong> mínimo 4, máximo 6 opciones, con <strong>2 o 3 correctas</strong> (márcalas
            todas).
          </li>
          <li>
            <strong>Enunciado:</strong> di cuántas opciones debe marcar («Marca las tres opciones…»): así se evita
            adivinar la cantidad.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Pregunta: Marca los dos números pares.
A) 2 (correcta)
B) 3
C) 4 (correcta)
D) 7`}</pre>
          </li>
        </ul>
      }
    >
      <Stage>
        <p className="u-font-bold u-text-center">Marca las tres opciones que son frutas.</p>
        <p className={css.question}>
          <strong>Pregunta 1.</strong> ¿Cuáles de estos alimentos son frutas?
        </p>
        <Checkboxs onResult={handleResult} minSelected={CORRECT_OPTIONS}>
          <div className={css.options_list}>
            <Checkboxs.Checkbox id="check-1" name="frutas" label="a. Manzana" state="success" />
            <Checkboxs.Checkbox id="check-2" name="frutas" label="b. Zanahoria" state="wrong" />
            <Checkboxs.Checkbox id="check-3" name="frutas" label="c. Banano" state="success" />
            <Checkboxs.Checkbox id="check-4" name="frutas" label="d. Lechuga" state="wrong" />
            <Checkboxs.Checkbox id="check-5" name="frutas" label="e. Naranja" state="success" />
          </div>
          <GameActions>
            <Checkboxs.Button>
              <Button label="Comprobar" />
            </Checkboxs.Button>
            <Checkboxs.Button type="reset">
              <Button label="Reintentar" />
            </Checkboxs.Button>
          </GameActions>
          <Checkboxs.Feedback />
        </Checkboxs>
      </Stage>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Muy bien! La manzana, el banano y la naranja son frutas."
        wrong="Alguna de las opciones marcadas no es una fruta. Revísalas e inténtalo otra vez."
      />
    </GamePage>
  );
}
