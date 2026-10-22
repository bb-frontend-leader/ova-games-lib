import { useState } from 'react';

import { SelectsGroup } from '@/activities/select-group-activity';
import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';

import css from './activity-layout.module.css';

// Los ids de ambas columnas deben ser únicos: una opción elegida se deshabilita en todos los menús.
const ANIMALS = [
  { id: 'animal-1', option: 'Perro' },
  { id: 'animal-2', option: 'Gato' },
  { id: 'animal-3', option: 'Vaca' }
];

const SOUNDS = [
  { id: 'sound-1', option: 'Ladra' },
  { id: 'sound-2', option: 'Maúlla' },
  { id: 'sound-3', option: 'Muge' }
];

// Cada fila es una pareja [columna A, columna B] válida; el orden de las filas no importa.
const CORRECT_ANSWERS: [string, string][] = [
  ['animal-1', 'sound-1'],
  ['animal-2', 'sound-2'],
  ['animal-3', 'sound-3']
];

export default function ActivitySelectGroupPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/actividades/parejas-con-listas"
      description={
        <>
          <p>
            Dos columnas de menús desplegables. En cada fila el estudiante elige un elemento de la columna A y, a su
            lado, el elemento de la columna B que se relaciona con él.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Cada fila tiene una pareja válida.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>Las filas con una pareja equivocada se marcan.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede volver a elegir con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>Entre 3 y 5 filas, con el mismo número de elementos en las dos columnas.</li>
          <li>
            Los <code>id</code> de todas las opciones (de las dos columnas) deben ser distintos entre sí.
          </li>
          <li>
            Primero van todos los menús de la columna A y luego todos los de la columna B: así la actividad sabe a qué
            columna pertenece cada uno.
          </li>
          <li>
            Describe las parejas válidas en <code>correctAnswers</code>; el orden de las filas no importa.
          </li>
        </ul>
      }
    >
      <Stage>
        <p className="u-font-bold u-text-center">En cada fila elige un animal y, a su derecha, el sonido que hace.</p>
        <SelectsGroup correctAnswers={CORRECT_ANSWERS} onResult={handleResult}>
          <div className={css.group}>
            <div className="u-flow">
              <p className="u-font-bold">Animal</p>
              {ANIMALS.map((_, index) => (
                <SelectsGroup.Select
                  key={`animal-${index}`}
                  name={`animal-${index + 1}`}
                  label={`Animal de la fila ${index + 1}`}
                  placeholder="Seleccionar"
                  options={ANIMALS}
                />
              ))}
            </div>
            <div className="u-flow">
              <p className="u-font-bold">Sonido</p>
              {SOUNDS.map((_, index) => (
                <SelectsGroup.Select
                  key={`sound-${index}`}
                  name={`sonido-${index + 1}`}
                  label={`Sonido de la fila ${index + 1}`}
                  placeholder="Seleccionar"
                  options={SOUNDS}
                />
              ))}
            </div>
          </div>
          <GameActions>
            <SelectsGroup.Button>
              <Button label="Comprobar" />
            </SelectsGroup.Button>
            <SelectsGroup.Button type="reset">
              <Button label="Reintentar" />
            </SelectsGroup.Button>
          </GameActions>
          <SelectsGroup.Feedback />
        </SelectsGroup>
      </Stage>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Excelente! El perro ladra, el gato maúlla y la vaca muge."
        wrong="Alguna pareja no coincide. Revisa las filas marcadas e inténtalo otra vez."
      />
    </GamePage>
  );
}
