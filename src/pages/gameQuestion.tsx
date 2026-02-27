import {  Col, Row } from "books-ui"
import { Button } from "@ui/components";
import css from "../styles/stylesheet/phraseAndImage.module.css";
import {
  GameQuestion,
  ModalFeedback,
} from "@core/components";
import { useState } from "react";
import { Breadcrumbs } from "@/components";

export default function GameQuestionPage() {
    const [isOpen, setIsOpen] = useState<string | null>(null);

    /**
     * Función que se encarga de validar
     * el valor proporcionado por Selects.
     * @param {object[]} result
     */
    const MODALS = {
      TRUE: "modal-correct-activity",
      FALSE: "modal-wrong-activity",
    };
    const handleValidate = ({ result }: { result: boolean }) => {
      console.log(result);
      const activityResult = result.toString().toUpperCase();
      setIsOpen(MODALS[activityResult as keyof typeof MODALS]);
    };

    const closeModal = () => setIsOpen(null);
  return (
    <>
      <Breadcrumbs/>
      <Row addClass="containerGame" justifyContent="center">
        <Col xs="12" mm="8" md="6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="title font-display text-secondary  uppercase">
              Desafía tu Conocimiento
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
                  Es una actividad interactiva diseñada para evaluar la
                  comprensión y el análisis del estudiante de manera visual y
                  dinámica.
                </p>
                <p>
                  En la parte superior se presenta una pregunta clara y directa.
                  Debajo, el estudiante encontrará una imagen alusiva que sirve
                  como apoyo visual o pista contextual relacionada con la
                  posible respuesta. Posteriormente, se muestran varias opciones
                  entre las cuales deberá elegir la correcta.
                </p>
                <p>
                  Una vez seleccionada la opción, el estudiante debe presionar
                  el botón "Comprobar" para confirmar su respuesta.
                </p>
                <p>
                  El instructor puede configurar la cantidad de opciones que
                  considere conveniente, adaptando el nivel de dificultad según
                  el contenido o grado académico.
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
                  <li>
                    Se muestra un ícono de ✔ (check) sobre la opción
                    seleccionada.
                  </li>
                  <li>Se despliega un modal de felicitación.</li>
                  <li>Si lo desea se puede incluir retroalimentación.</li>
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
                    Se muestra un ícono de (X) sobre la opción seleccionada.
                  </li>
                  <li>Se despliega un modal con retroalimentación.</li>
                  <li>
                    Se habilita la opción de reintentar.
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-2 p-4">
              {/* aqui van las preguntas */}
              <GameQuestion onResult={handleValidate}>
                <figure className="u-flow">
                  <GameQuestion.Card
                    question="Si tengo 15 manzanas y le doy 7 a mi amigo, me quedan ______ manzanas."
                    questionNumber="1"
                  >
                    <GameQuestion.Radio
                      label="5"
                      state="wrong"
                      id="2-1"
                      name="option-2"
                    />
                    <GameQuestion.Radio
                      label="10"
                      state="wrong"
                      id="2-2"
                      name="option-2"
                    />
                    <GameQuestion.Radio
                      label="7"
                      state="wrong"
                      id="2-3"
                      name="option-2"
                    />
                    <GameQuestion.Radio
                      label="8"
                      state="success"
                      id="2-4"
                      name="option-2"
                    />
                  </GameQuestion.Card>
                </figure>
                <div className={`mt-4 ${css.btnActions}`}>
                  <GameQuestion.Button>
                    <Button label="Comprobar" id="button-comprobar" />
                  </GameQuestion.Button>
                  <GameQuestion.Button type="reset">
                    <Button label="Reintentar" />
                  </GameQuestion.Button>
                </div>
              </GameQuestion>
            </div>
          </div>
        </Col>
      </Row>

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
    </>
  );
}
