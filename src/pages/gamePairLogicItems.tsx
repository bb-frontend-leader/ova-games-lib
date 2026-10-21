import { useState } from "react";
import { Col, Row } from "books-ui";

import { Breadcrumbs } from "@/components";
import type {
  OnResultData,
  PairLogicPair,
} from '@/shared/components/activities/pair-logic-activity';
import { PairLogicActivity } from '@/shared/components/activities/pair-logic-activity';
import { ModalFeedback } from '@/shared/components/features/modal-feedback';
import { Button } from '@/shared/components/ui';

const MODALS = {
  TRUE: "modal-correct-activity",
};

// La imagen y el texto de una pareja van juntos; la actividad mezcla el orden de los textos.
const PAIRS: PairLogicPair[] = [
  {
    id: "caballo",
    image: {
      src: "assets/images/imagesGameJoinItems/caballo.webp",
      alt: "Caballo galopando",
    },
    text: "caballo",
  },
  {
    id: "elefante",
    image: {
      src: "assets/images/imagesGameJoinItems/elefante.webp",
      alt: "Elefante",
    },
    text: "elefante",
  },
  {
    id: "gato",
    image: {
      src: "assets/images/imagesGameJoinItems/gato.webp",
      alt: "Gato acostado",
    },
    text: "gato",
  },
  {
    id: "jirafa",
    image: {
      src: "assets/images/imagesGameJoinItems/jirafa.webp",
      alt: "Jirafa acostada",
    },
    text: "jirafa",
  },
  {
    id: "perro",
    image: { src: "assets/images/imagesGameJoinItems/perro.webp", alt: "Perro" },
    text: "perro",
  },
  {
    id: "tigre",
    image: { src: "assets/images/imagesGameJoinItems/tigre.webp", alt: "Tigre" },
    text: "tigre",
  },
];
export default function GamePairLogicItemsPage() {
  const [isOpen, setIsOpen] = useState<string | null>(null);
  /**
   * Se ejecuta con cada comprobación. El veredicto de cada intento se muestra en el tablero;
   * el modal de felicitación se abre al resolver la última pareja.
   */
  const handleResult = ({ complete }: OnResultData) => {
    if (complete) setIsOpen(MODALS.TRUE);
  };

  const closeModal = () => setIsOpen(null);
  return (
    <>
      <Breadcrumbs />
      <Row addClass="containerGame" justifyContent="center" alignItems="center">
        <Col xs="12" mm="12" md="8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="title font-display text-secondary  uppercase">
              Conexiones Lógicas
            </h2>
            <div className="w-full h-2 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="bg-white  rounded-4xl  border border-slate-200    w-full  shadow-xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-10">
            <div className="md:col-span-2   p-3 rounded-2xl flex items-start gap-4 mb-8">
              <div className="bg-orange-100  p-3 rounded-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#EA3323"
                >
                  <path d="M320-240h320v-80H320v80zm0-160h320v-80H320v80zM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240zm280-520v-200H240v640h480v-440H520zM240-800v200-200 640-640z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 titleDescription">
                  Descripción de la actividad:
                </h3>
                <p>
                  Es una actividad interactiva diseñada para fortalecer el
                  pensamiento analítico y la capacidad de asociación. En este
                  juego, el estudiante debe observar cuidadosamente distintos
                  elementos y relacionarlos con su pareja correcta según la
                  lógica que los une.
                </p>
                <p>
                  Cada elemento tiene un complemento específico. El objetivo es
                  identificar correctamente las relaciones y establecer todas
                  las conexiones sin cometer errores.
                </p>
                <p>
                  El docente puede configurar la cantidad de pares que desee
                  trabajar, adaptando la dificultad según el nivel o el
                  contenido académico.
                </p>
              </div>
            </div>

            <div className="bg-green-50  p-6 rounded-2xl border border-green-100 dark:border-green-900/30 flex gap-4">
              <div className=" text-green-500 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#48752C"
                >
                  <path d="M424-296l282-282-56-56-226 226-114-114-56 56 170 170zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93zm0-320z" />
                </svg>
              </div>
              <div className="text-green-800">
                <p>
                  Si la respuesta es <strong>correcta </strong>:
                </p>
                <ul className="list-disc">
                  <li>La pareja queda resuelta y sus tarjetas se deshabilitan.</li>
                  <li>El tablero muestra un mensaje de acierto.</li>
                  <li>
                    El estudiante continúa hasta completar todas las parejas y
                    se abre un modal de felicitación.
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-rose-50  p-6 rounded-2xl border border-rose-100 dark:border-rose-900/30 flex gap-4">
              <div className=" text-rose-500 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#EA3323"
                >
                  <path d="M296-270h75l107-164 108 164h78L519-488l133-202h-75l-98 152-98-152h-77l135 203-143 217zm28 158.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5zM480-160q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160zm0-320z" />
                </svg>
              </div>
              <div>
                <p className="text-rose-800">
                  Si la respuesta es <strong>incorrecta</strong>:
                </p>
                <ul className="list-disc">
                  <li>El tablero muestra un mensaje indicando que no es la pareja.</li>
                  <li>
                    El estudiante puede cambiar la imagen o el texto elegido y
                    volver a comprobar.
                  </li>
                  <li>
                    Al resolver todas las parejas se habilita Reiniciar para
                    volver a jugar.
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-2 p-4 u-text-center">
              <p className="u-font-bold">
                Seleccione una imagen y el texto que le corresponde; después
                pulse Comprobar.
              </p>
              <PairLogicActivity pairs={PAIRS} onResult={handleResult}>
                <PairLogicActivity.Board />
                <Row
                  justifyContent="center"
                  alignItems="center"
                  addClass="u-gap-x-4 u-mt-2"
                >
                  <PairLogicActivity.Button>
                    <Button label="Comprobar" />
                  </PairLogicActivity.Button>
                  {/* Se habilita al resolver todas las parejas. */}
                  <PairLogicActivity.Button type="reset">
                    <Button label="Reiniciar" />
                  </PairLogicActivity.Button>
                </Row>
              </PairLogicActivity>
            </div>
          </div>
        </Col>
        <ModalFeedback
          type="success"
          isOpen={isOpen === MODALS.TRUE}
          onClose={closeModal}
          audio="assets/audios/aud_ova-2_g2_sld-17 (Correcto).mp3"
          finalFocusRef="#main"
          interpreter={{
            contentURL: "vid_int_ova-2_sld-17_chulito.mp4",
          }}
        >
          <p className="mb-4">
            ¡Muy bien! Es correcta la respuesta. Cada componente eléctrico tiene
            un único fin.
          </p>
        </ModalFeedback>
      </Row>
    </>
  );
}
