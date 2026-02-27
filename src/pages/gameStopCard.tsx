
import { useState } from "react";
import {  Col, Row } from "books-ui";
import { ModalFeedback } from '@core/components';
import {StopCard} from "@core/components/games";
import { Panel } from "@ui/components";
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';


const MODALS = {
  TRUE: "modal-correct-activity",
  FALSE: "modal-wrong-activity",
};

export default function  GameStopCardPage() {
  const [isOpen, setIsOpen] = useState<string | null>(null);

  /**
   * Función que se encarga de validar
   * el valor proporcionado por Selects.
   * @param {object[]} result
   */
  const handleValidate = ({ result }: { result: boolean }) => {
    const activityResult = result.toString().toUpperCase();
    setIsOpen(MODALS[activityResult as keyof typeof MODALS]);
  };

  const closeModal = () => setIsOpen(null);

  return (
    <>
      <Breadcrumbs />
      <Panel>
        <StopCard questionCount={2}>
          <Panel.Section>
            <Row justifyContent="center" alignItems="center">
              <Col
                xs="11"
                mm="10"
                md="9"
                lg="8"
                hd="6"
                addClass="u-flow u-text-center"
              >
                <div className="text-center mb-16 space-y-4">
                  <h2 className="title font-display text-secondary  uppercase">
                    Paradas del Saber
                  </h2>
                  <div className="w-full h-2 bg-primary mx-auto rounded-full" />
                </div>
                <div className="bg-white  rounded-4xl  border border-slate-200    w-full  shadow-xl grid grid-cols-1 md:grid-cols-2 gap-4 p-10">
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
                        es una actividad interactiva basada en un recorrido
                        progresivo a través de un mapa. El estudiante debe
                        avanzar por un camino compuesto por diferentes puntos de
                        referencia, cada uno representando una pregunta.
                      </p>
                      <p>
                        Sobre el camino aparece un punto destacado con una
                        animación tipo bounce, indicando la parada activa que
                        debe resolverse para continuar.
                      </p>
                      <p>
                        <strong>Dinámica del juego</strong>
                      </p>
                      <ul className="list-disc">
                        <li>
                          El estudiante inicia en el primer punto del camino.
                        </li>
                        <li>Cada punto corresponde a una pregunta.</li>
                        <li>
                          Para avanzar al siguiente tramo, debe responder
                          correctamente la pregunta actual.
                        </li>
                        <li>
                          El progreso es secuencial: no se puede avanzar sin
                          superar la parada activa.
                        </li>
                      </ul>
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
                        <li>
                          Se muestra un modal de éxito con retroalimentación
                          positiva.
                        </li>
                        <li>El punto actual queda marcado como superado.</li>
                        <li>
                          Se habilita el avance al siguiente punto del camino.
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
                      <ul className="list-disc gap-3.5">
                        <li>
                          Se muestra un modal de error con el mensaje
                          correspondiente.
                        </li>
                        <li>El estudiante permanece en la misma parada.</li>
                        <li>Se habilita la opción de Reintentar.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="md:col-span-2 p-4">
                    <StopCard.Init textInitial="En la siguiente ruta encontrarán cuatro paradas y en cada una de ellas, una pregunta de selección con única respuesta. El objetivo es llegar a la meta: una paradisiaca playa de la costa colombiana." />
                  </div>
                </div>
              </Col>
            </Row>
          </Panel.Section>

          <Panel.Section>
            <Row justifyContent="center" alignItems="center">
              <Col
                xs="11"
                mm="10"
                md="9"
                lg="8"
                hd="7"
                addClass="u-flow u-text-center"
              >
                <div className="text-center mb-16 space-y-4">
                  <h2 className="title font-display text-secondary  uppercase">
                    Paradas del Saber
                  </h2>
                  <div className="w-full h-2 bg-primary mx-auto rounded-full"></div>
                </div>
                <div className="bg-white  rounded-4xl  border border-slate-200    w-full  shadow-xl grid grid-cols-1 gap-4 p-10">
                  <div className="md:col-span-2 p-4">
                    <StopCard.Scene
                      id="question-svg-1"
                      question="<strong>Primera parada</strong> - La intención del texto expositivo es:"
                      onResult={handleValidate}
                    >
                      <StopCard.Radio
                        label="1. Convencer-persuadir"
                        state="wrong"
                        id="1-1"
                        name="option-1"
                      />
                      <StopCard.Radio
                        label="2. Explicar-exponer"
                        state="success"
                        id="1-2"
                        name="option-1"
                      />
                    </StopCard.Scene>
                  </div>
                </div>
              </Col>
            </Row>
          </Panel.Section>

          <Panel.Section>
            <Row justifyContent="center" alignItems="center">
              <Col
                xs="11"
                mm="10"
                md="9"
                lg="8"
                hd="7"
                addClass="u-flow u-text-center"
              >
                <div className="text-center mb-16 space-y-4">
                  <h2 className="title font-display text-secondary  uppercase">
                    Paradas del Saber
                  </h2>
                  <div className="w-full h-2 bg-primary mx-auto rounded-full" />
                </div>
                <div className="bg-white  rounded-4xl  border border-slate-200    w-full  shadow-xl grid grid-cols-1 gap-4 p-10">
                  <div className="md:col-span-2 p-4">
                    <StopCard.Scene
                      id="question-svg-2"
                      question="<strong>Segunda parada</strong> - La definición del texto expositivo es:"
                      onResult={handleValidate}
                    >
                      <StopCard.Radio
                        label="1. Transmite información, pero no se limita simplemente a proporcionar datos, sino que además agrega explicaciones, describe con ejemplos y analogías. La intención informativa hace que en los textos predomine la función referencial."
                        state="success"
                        id="2-1"
                        name="option-2"
                      />
                      <StopCard.Radio
                        label="2. Permite que un autor exprese y sustente su punto de vista con respecto a un determinado asunto, problema o pregunta."
                        state="wrong"
                        id="2-2"
                        name="option-2"
                      />
                    </StopCard.Scene>
                  </div>
                </div>
              </Col>
            </Row>
          </Panel.Section>
          <Panel.Section>
            <Row justifyContent="center" alignItems="center">
              <Col
                xs="11"
                mm="10"
                md="9"
                lg="8"
                hd="7"
                addClass="u-flow u-text-center"
              >
                <div className="text-center mb-16 space-y-4">
                  <h2 className="title font-display text-secondary  uppercase">
                    Paradas del Saber
                  </h2>
                  <div className="w-full h-2 bg-primary mx-auto rounded-full" />
                </div>
                <div className="bg-white  rounded-4xl  border border-slate-200    w-full  shadow-xl grid grid-cols-1 gap-4 p-10">
                  <div className="md:col-span-2 p-4">
                    <StopCard.Scene
                      id="question-svg-2"
                      question="<strong>Segunda parada</strong> - La definición del texto expositivo es:"
                      onResult={handleValidate}
                    >
                      <StopCard.Radio
                        label="1. Transmite información, pero no se limita simplemente a proporcionar datos, sino que además agrega explicaciones, describe con ejemplos y analogías. La intención informativa hace que en los textos predomine la función referencial."
                        state="success"
                        id="2-1"
                        name="option-2"
                      />
                      <StopCard.Radio
                        label="2. Permite que un autor exprese y sustente su punto de vista con respecto a un determinado asunto, problema o pregunta."
                        state="wrong"
                        id="2-2"
                        name="option-2"
                      />
                    </StopCard.Scene>
                  </div>
                </div>
              </Col>
            </Row>
          </Panel.Section>
        </StopCard>

        <ModalFeedback
          audio="assets/audios/aud_ova-27_g1_sld-4.1_Correcto.mp3"
          type="success"
          isOpen={isOpen === MODALS.TRUE}
          onClose={closeModal}
          finalFocusRef="#main"
        ></ModalFeedback>

        <ModalFeedback
          audio="assets/audios/aud_ova-27_g1_sld-4.1_Incorrecto.mp3"
          type="wrong"
          isOpen={isOpen === MODALS.FALSE}
          onClose={closeModal}
          finalFocusRef=".js-modal-wrong"
        ></ModalFeedback>
      </Panel>
    </>
  );
}
