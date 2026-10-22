import { useState } from 'react';
import { DragAndDrop } from 'books-ui';

import { DndActivity } from '@/activities/dnd-activity';
import type { ResultState } from '@/components';
import { GameActions, GamePage, ResultModals, Stage } from '@/components';
import { Button } from '@/components/ui';

import css from './activity-layout.module.css';

// Cada elemento se arrastra a la descripción que le corresponde (`validate` de la zona).
const ITEMS = [
  { id: 'sol', label: 'Sol', description: 'Estrella que nos da luz y calor.' },
  { id: 'luna', label: 'Luna', description: 'Satélite natural que gira alrededor de la Tierra.' },
  { id: 'tierra', label: 'Tierra', description: 'Planeta en el que vivimos.' },
  { id: 'marte', label: 'Marte', description: 'Planeta rojo, vecino de la Tierra.' }
];

// Orden en el que aparecen las fichas para arrastrar.
const DRAG_ORDER = ['tierra', 'sol', 'marte', 'luna'];

export default function ActivityDndPage() {
  const [feedback, setFeedback] = useState<ResultState>(null);

  const handleResult = ({ result }: { result: boolean }) => setFeedback(result ? 'success' : 'wrong');

  return (
    <GamePage
      link="/actividades/arrastrar-y-soltar"
      description={
        <>
          <p>
            Arrastrar y soltar: el estudiante toma cada ficha y la suelta en la zona de la descripción que le
            corresponde. También funciona con teclado: cada ficha ofrece un menú para moverla a una zona.
          </p>
        </>
      }
      correct={
        <ul>
          <li>Todas las fichas están en su zona correcta.</li>
          <li>Se abre el modal de acierto.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>Hay fichas en una zona equivocada.</li>
          <li>Se abre el modal de error.</li>
          <li>Se puede volver a empezar con «Reintentar».</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>Entre 3 y 5 fichas: en pantallas pequeñas arrastrar cuesta más cuando hay muchas.</li>
          <li>
            Pasa a <code>minCorrectDrags</code> el número de fichas que deben quedar bien.
          </li>
          <li>
            Cada zona indica con <code>validate</code> el <code>id</code> de la ficha que acepta.
          </li>
          <li>Pon las fichas en un orden distinto al de las zonas, para que no se resuelva de arriba abajo.</li>
        </ul>
      }
    >
      <Stage>
        <p className="u-font-bold u-text-center">Arrastra cada astro a la descripción que le corresponde.</p>
        <DndActivity id="demo-dnd" minCorrectDrags={ITEMS.length} onResult={handleResult}>
          <DragAndDrop.Container id="astros" label="Astros">
            {DRAG_ORDER.map((itemId) => {
              const item = ITEMS.find(({ id }) => id === itemId)!;
              return (
                <DragAndDrop.Drag key={item.id} id={item.id} label={item.label}>
                  {item.label}
                </DragAndDrop.Drag>
              );
            })}
          </DragAndDrop.Container>
          <ol className={css.dnd_list}>
            {ITEMS.map((item, index) => (
              <li key={item.id} className={css.dnd_item}>
                <p id={`descripcion-${item.id}`}>{item.description}</p>
                <DragAndDrop.Drop
                  id={`zona-${item.id}`}
                  validate={[item.id]}
                  label={`Descripción ${index + 1}`}
                  aria-describedby={`descripcion-${item.id}`}
                />
              </li>
            ))}
          </ol>
          <GameActions>
            <DndActivity.Button>
              <Button label="Comprobar" />
            </DndActivity.Button>
            <DndActivity.Button type="reset">
              <Button label="Reintentar" />
            </DndActivity.Button>
          </GameActions>
        </DndActivity>
      </Stage>

      <ResultModals
        open={feedback}
        onClose={() => setFeedback(null)}
        success="¡Excelente! Cada astro quedó en su descripción."
        wrong="Hay fichas en la zona equivocada. Lee de nuevo cada descripción e inténtalo otra vez."
      />
    </GamePage>
  );
}
