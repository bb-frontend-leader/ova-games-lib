import { useState } from 'react';

import { Selects } from '@/activities/select-activity';
import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';

import css from './activity-layout.module.css';

// Las mismas opciones sirven para todas las filas: la actividad no deja repetir una ya elegida (salvo que se permita).
const OPTIONS = [
  { id: 'option-1', option: 'Ave' },
  { id: 'option-2', option: 'Pez' },
  { id: 'option-3', option: 'Mamífero' },
  { id: 'option-4', option: 'Reptil' }
];

const ROWS = [
  { name: 'animal-1', text: 'Vuela y tiene el cuerpo cubierto de plumas.', answer: 'option-1' },
  { name: 'animal-2', text: 'Vive en el agua y respira por branquias.', answer: 'option-2' },
  { name: 'animal-3', text: 'Alimenta a sus crías con leche.', answer: 'option-3' }
];

export default function ActivitySelectPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/actividades/listas-desplegables"
      description={
        <>
          <p>
            Una lista de descripciones, cada una con un menú desplegable. El estudiante elige en cada menú el concepto
            que corresponde a la descripción.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Todos los menús tienen la opción correcta.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>Los menús con una opción equivocada se marcan.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede volver a elegir con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>Entre 3 y 5 filas. Ofrece una o dos opciones más que filas, para que no se resuelva por descarte.</li>
          <li>
            Cada fila indica su respuesta con <code>correctAnswer</code>, que es el <code>id</code> de la opción.
          </li>
          <li>Escribe las descripciones en la columna del texto y deja las opciones como términos cortos.</li>
          <li>
            Dale a cada menú una <code>label</code> clara: la leen los lectores de pantalla.
          </li>
        </ul>
      }
    >
      <Stage>
        <p className="u-font-bold u-text-center">Une cada descripción con el grupo de animales al que corresponde.</p>
        <Selects onResult={handleResult}>
          <ul className={css.select_list}>
            {ROWS.map((row) => (
              <li key={row.name} className={css.select_item}>
                <p>{row.text}</p>
                <Selects.Select
                  options={OPTIONS}
                  correctAnswer={row.answer}
                  label={`Selecciona el grupo para: ${row.text}`}
                  name={row.name}
                  placeholder="Seleccionar"
                />
              </li>
            ))}
          </ul>
          <GameActions>
            <Selects.Button>
              <Button label="Comprobar" />
            </Selects.Button>
            <Selects.Button type="reset">
              <Button label="Reintentar" />
            </Selects.Button>
          </GameActions>
        </Selects>
      </Stage>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Muy bien! Las aves vuelan, los peces respiran por branquias y los mamíferos dan leche."
        wrong="Alguna descripción no coincide con su grupo. Revísalas e inténtalo otra vez."
      />
    </GamePage>
  );
}
