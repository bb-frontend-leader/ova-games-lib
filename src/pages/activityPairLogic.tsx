import { useState } from 'react';

import type { OnResultData, PairLogicPair } from '@/activities/pair-logic-activity';
import { PairLogicActivity } from '@/activities/pair-logic-activity';
import { GameActions, GamePage, Stage } from '@/components';
import { Button, ModalFeedback } from '@/components/ui';

// La imagen y el texto de una pareja van juntos; la actividad mezcla el orden de los textos.
const PAIRS: PairLogicPair[] = [
  {
    id: 'caballo',
    image: { src: 'assets/images/imagesGameJoinItems/caballo.webp', alt: 'Caballo galopando' },
    text: 'caballo'
  },
  {
    id: 'elefante',
    image: { src: 'assets/images/imagesGameJoinItems/elefante.webp', alt: 'Elefante' },
    text: 'elefante'
  },
  { id: 'gato', image: { src: 'assets/images/imagesGameJoinItems/gato.webp', alt: 'Gato acostado' }, text: 'gato' },
  {
    id: 'jirafa',
    image: { src: 'assets/images/imagesGameJoinItems/jirafa.webp', alt: 'Jirafa acostada' },
    text: 'jirafa'
  },
  { id: 'perro', image: { src: 'assets/images/imagesGameJoinItems/perro.webp', alt: 'Perro' }, text: 'perro' },
  { id: 'tigre', image: { src: 'assets/images/imagesGameJoinItems/tigre.webp', alt: 'Tigre' }, text: 'tigre' }
];

export default function ActivityPairLogicPage() {
  const [isOpen, setIsOpen] = useState(false);

  /** Cada intento se califica en el tablero; el modal de felicitación se abre al resolver la última pareja. */
  const handleResult = ({ complete }: OnResultData) => {
    if (complete) setIsOpen(true);
  };

  return (
    <GamePage
      link="/actividades/conexiones-logicas"
      description={
        <>
          <p>
            Cada imagen tiene un texto que le corresponde. El estudiante selecciona una imagen y el texto que cree que
            la nombra, y comprueba la pareja.
          </p>
        </>
      }
      correct={
        <ul>
          <li>La pareja queda fija en el tablero.</li>
          <li>Al completar todas las parejas se abre el modal de felicitación.</li>
        </ul>
      }
      incorrect={
        <ul>
          <li>El tablero marca el intento como incorrecto y la selección se libera.</li>
          <li>El estudiante puede probar otra combinación sin perder las parejas ya resueltas.</li>
        </ul>
      }
      recommendations={
        <ul>
          <li>
            <strong>Cantidad de parejas:</strong> mínimo 4, máximo 6: con más, el tablero se vuelve largo en el celular.
          </li>
          <li>
            <strong>Cada pareja:</strong> una imagen y un texto corto. Usa imágenes del mismo tamaño y estilo, para que
            la forma no delate la respuesta.
          </li>
          <li>
            <strong>Imágenes:</strong> envía cada imagen como archivo, con una breve descripción para lectores de
            pantalla.
          </li>
          <li>
            <strong>Orden:</strong> no te preocupes por desordenarlas: la actividad mezcla los textos sola.
          </li>
          <li>
            <strong>Envíanoslo así:</strong>
            <pre>{`Pareja 1: imagen-gato.png (Un gato) — «Gato»
Pareja 2: ...`}</pre>
          </li>
        </ul>
      }
    >
      <Stage size="wide">
        <p className="u-font-bold u-text-center">
          Selecciona una imagen y el texto que le corresponde; después pulsa Comprobar.
        </p>
        <PairLogicActivity pairs={PAIRS} onResult={handleResult}>
          <PairLogicActivity.Board />
          <GameActions>
            <PairLogicActivity.Button>
              <Button label="Comprobar" />
            </PairLogicActivity.Button>
            {/* Se habilita al resolver todas las parejas. */}
            <PairLogicActivity.Button type="reset">
              <Button label="Reiniciar" />
            </PairLogicActivity.Button>
          </GameActions>
        </PairLogicActivity>
      </Stage>

      <ModalFeedback type="success" isOpen={isOpen} onClose={() => setIsOpen(false)} finalFocusRef="#main">
        <p className="u-text-center">¡Muy bien! Relacionaste cada animal con su nombre.</p>
      </ModalFeedback>
    </GamePage>
  );
}
