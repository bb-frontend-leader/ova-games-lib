import { Col, Row, Image, Button } from "books-ui";
import { useState } from "react";

import { Button as ButtonActions } from "@ui/components";
import { ModalFeedback } from "@/shared/core/components";
import css from "../styles/stylesheet/gamePairLogic.module.css";
import {
  RamdomSplitAnimation,
  RandomImagesAnimation,
} from "@core/components/activities/pair-logic/animations/RandomImagesAnimation";
import { PairLogicItems } from "@/shared/core/components/activities/pair-logic/pair-logic-items";
import { Breadcrumbs } from "@/components";

const MODALS = {
  TRUE: "modal-correct-activity",
  FALSE: "modal-wrong-activity",
};
export default function GamePairLogicItemsPage() {
  const [isOpen, setIsOpen] = useState<string | null>(null);
  const handleResult = (result: boolean /*id: string | null*/) => {
    const activityResult = result.toString().toUpperCase();
    setIsOpen(MODALS[activityResult as keyof typeof MODALS]);
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
                  <li>Se desabilita los elemento seleccionados.</li>
                  <li>Se muestra una animación o efecto positivo.</li>
                  <li>
                    El estudiante continúa hasta completar todas las parejas.
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
                  <li>
                    Los items quedan nuevamente habilitados para un nuevo
                    intento.
                  </li>
                  <li>Se abre un modal y se muestra una retroalimentación.</li>
                  <li>
                    El estudiante vuelve a intentarlo hasta acertar todas las
                    parejas para finalizar.
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-2 p-4">
              {/* aqui van las preguntas */}
              <PairLogicItems onResult={handleResult}>
                <PairLogicItems.Images>
                  <RandomImagesAnimation />
                  <Button className={`${css.buttonImage} gsap-item`} id="1">
                    <Image
                      addClass={`${css.imageButton} `}
                      noCaption
                      alt="imagen de un caballo  galopando"
                      src="assets/images/imagesGameJoinItems/caballo.webp"
                      size="100%"
                    />
                  </Button>
                  <Button className={`${css.buttonImage} gsap-item`} id="2">
                    <Image
                      addClass={`${css.imageButton} `}
                      noCaption
                      alt="imagen de un elefante"
                      src="assets/images/imagesGameJoinItems/elefante.webp"
                      size="100%"
                    />
                  </Button>
                  <Button className={`${css.buttonImage} gsap-item`} id="3">
                    <Image
                      addClass={`${css.imageButton} `}
                      noCaption
                      alt="imagen gato acostado"
                      src="assets/images/imagesGameJoinItems/gato.webp"
                      size="100%"
                    />
                  </Button>
                  <Button className={`${css.buttonImage} gsap-item`} id="4">
                    <Image
                      addClass={`${css.imageButton} `}
                      noCaption
                      alt="imagen jirafa acostada"
                      src="assets/images/imagesGameJoinItems/jirafa.webp"
                      size="100%"
                    />
                  </Button>
                  <Button className={`${css.buttonImage} gsap-item`} id="5">
                    <Image
                      addClass={`${css.imageButton} `}
                      noCaption
                      alt="imagen de un perro"
                      src="assets/images/imagesGameJoinItems/perro.webp"
                      size="100%"
                    />
                  </Button>
                  <Button className={`${css.buttonImage} gsap-item`} id="6">
                    <Image
                      addClass={`${css.imageButton} `}
                      noCaption
                      alt="imagen de un tigre"
                      src="assets/images/imagesGameJoinItems/tigre.webp"
                      size="100%"
                    />
                  </Button>
                </PairLogicItems.Images>
                <PairLogicItems.Items>
                  <RamdomSplitAnimation mode="lines" />
                  <Button className={`${css.buttonTexto} gsap-text`} id="5">
                    <p>perro</p>
                  </Button>
                  <Button className={`${css.buttonTexto} gsap-text`} id="3">
                    <p>gato</p>
                  </Button>
                  <Button className={`${css.buttonTexto} gsap-text`} id="1">
                    <p>caballo</p>
                  </Button>
                  <Button className={`${css.buttonTexto} gsap-text`} id="2">
                    <p>elefante</p>
                  </Button>
                  <Button className={`${css.buttonTexto} gsap-text`} id="4">
                    <p>jirafa</p>
                  </Button>
                  <Button className={`${css.buttonTexto} gsap-text`} id="6">
                    <p>tigre</p>
                  </Button>
                </PairLogicItems.Items>
                {/* Ejemplo de disparadores */}
                <div className={css.containerButtons}>
                  <PairLogicItems.Button>
                    <ButtonActions label="Comprobar" />
                  </PairLogicItems.Button>
                  <PairLogicItems.Button type="reset">
                    <ButtonActions label="Reiniciar" />
                  </PairLogicItems.Button>
                </div>
              </PairLogicItems>
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

        <ModalFeedback
          type="wrong"
          isOpen={isOpen === MODALS.FALSE}
          onClose={closeModal}
          audio="assets/audios/aud_ova-2_g2_sld-17 (Incorrecto).mp3"
          finalFocusRef=".js-modal-wrong"
          interpreter={{
            contentURL: "vid_int_ova-2_sld-17_equis.mp4",
          }}
        >
          <p className="mb-4">¡Ups! Al parecer algo no quedo bien.</p>
        </ModalFeedback>
      </Row>
    </>
  );
}
