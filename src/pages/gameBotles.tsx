import { Row, Col  } from "books-ui";
import { GameBottle, ModalFeedback } from "@/shared/core/components";
import { Button } from "@ui/components";
import { useState } from "react";
import { Breadcrumbs } from "@/components";

const MODALS = {
  MODAL_1_CORRECT: "MODAL_1_CORRECT",
  MODAL_1_INCORRECT: "MODAL_1_INCORRECT",
};
type Props = {
  result: boolean;
  modal_number: string;
};
export default function GameBotlesPage() {

  const [isOpen, setIsOpen] = useState<string | null>(null);

  const handleValidate = ({ result, modal_number }: Props) => {
    console.log("handleValidate");
    console.log({ result, modal_number });
    const activity = result
      ? `MODAL_${modal_number}_CORRECT`
      : `MODAL_${modal_number}_INCORRECT`;
    setIsOpen(activity);
  };
  const closeModal = () => setIsOpen(null);
  return (
    <>
      <Breadcrumbs />
      <Row addClass="containerGame" justifyContent="center">
        <Col xs="12" mm="12" md="8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="title font-display text-secondary  uppercase">
              Rescate Submarino de Letras
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
                  es una actividad interactiva ambientada en el fondo del mar,
                  donde el estudiante debe formar palabras rescatando letras
                  dentro de botellas submarinas.
                </p>
                <p>
                  Cada botella contiene una letra. El objetivo es seleccionar
                  las letras en el orden correcto para construir la palabra
                  indicada. A medida que el estudiante selecciona una letra,
                  esta desaparece del escenario y se coloca en el espacio
                  correspondiente en la parte inferior de la pantalla,
                  representado inicialmente por rayas.
                </p>
                <p>
                  El docente puede configurar la cantidad de palabras que desee
                  trabajar. Cada palabra se presenta como una sección
                  independiente dentro de la actividad.
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
                  <ul className="list-disc">
                    <li>La palabra completa cambia a color verde.</li>
                    <li>
                      Se abre un modal de felicitación. con feedck si lo desea.
                    </li>
                    <li>avanza a la siguiente palabra.</li>
                  </ul>
                </p>
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
                    La palabra cambia de color (puede mantenerse en rojo o color
                    de error).
                  </li>
                  <li>
                    Se abre un modal indicando que la respuesta no es correcta y
                    feedback si lo desea.
                  </li>
                  <li>Se habilita la opción de reiniciar.</li>
                  <li>El estudiante puede reorganizar o volver a intentar.</li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-2 p-4">
              {/* aqui van las preguntas */}
              <GameBottle
                onResult={(result) =>
                  handleValidate({ result, modal_number: "1" })
                }
              >
                <GameBottle.Letters word="PERRO" />
                <GameBottle.Word />

                <GameBottle.Actions type="validation">
                  <Button label="Comprobar" />
                </GameBottle.Actions>

                <GameBottle.Actions type="reset">
                  <Button label="Reintentar" />
                </GameBottle.Actions>
              </GameBottle>
            </div>
          </div>
        </Col>
        <ModalFeedback
          audio="assets/audios/aud_ova-27_g1_sld-4.1_Correcto.mp3"
          type="success"
          isOpen={isOpen === MODALS.MODAL_1_CORRECT}
          onClose={closeModal}
          finalFocusRef="#main"
        ></ModalFeedback>

        <ModalFeedback
          audio="assets/audios/aud_ova-27_g1_sld-4.1_Incorrecto.mp3"
          type="wrong"
          isOpen={isOpen === MODALS.MODAL_1_INCORRECT}
          onClose={closeModal}
          finalFocusRef=".js-modal-wrong"
        ></ModalFeedback>
      </Row>
    </>
  );
}
