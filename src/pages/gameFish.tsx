
import { useState } from "react";
import { Col, Row } from "books-ui";

import { Breadcrumbs } from "@/components";
import { ModalFeedback } from '@/shared/components/features/modal-feedback';
import { GameFish } from '@/shared/components/games/game-fish';
import { Panel } from '@/shared/components/layouts';
import { Button } from '@/shared/components/ui';
import { SectionNavigation } from '@/shared/utils/section-navigation';

export  default function GameFishPage () {
    const [isOpen, setIsOpen] = useState<string | null>(null);
     const handleValidate = ({ options }: { options: { id: string }[] }) => {
       if (options.length > 0) {
         // Al decir que options es un array de objetos con 'id', el error de 'any' desaparece
         setIsOpen(options[0].id);
       }
     };
     const closeModal = () => setIsOpen(null);
return (
  <>
  <Breadcrumbs/>
  <Panel>
    <Panel.Section>
      <Row
        addClass="containerGame"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Col xs="11" mm="10" md="9" lg="8" hd="7" addClass="u-flow">
          <div className="text-center mb-16 space-y-4">
            <h2 className="title font-display text-secondary  uppercase">
              Pesca Correcta
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
                  Es una actividad interactiva ambientada en el fondo del mar,
                  donde el estudiante debe completar una frase seleccionando la
                  palabra adecuada entre varias opciones representadas por
                  peces.
                </p>
                <p>
                  En la parte superior de la pantalla se muestra una oración
                  incompleta. El espacio faltante aparece como una línea en
                  blanco. En la zona inferior o central, diferentes peces
                  contienen posibles palabras de respuesta.
                </p>
                <ul className="list-disc">
                  <li>El estudiante analiza la frase incompleta.</li>
                  <li>
                    Selecciona uno de los peces (cada pez contiene una palabra).
                  </li>
                  <li>
                    Al hacer clic, la palabra seleccionada reemplaza la línea en
                    blanco.
                  </li>
                  <li>
                    Luego puede presionar el botón Comprobar para validar su
                    respuesta.
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
                  +
                  <path d="M424-296l282-282-56-56-226 226-114-114-56 56 170 170zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93zm0-320z" />
                </svg>
              </div>
              <div className="text-green-800">
                <p>
                  Si la respuesta es <strong>correcta</strong>:
                </p>
                <ul className="list-disc">
                  <li>Se muestra un modal de éxito.</li>
                  <li>Se confirma visualmente la selección correcta.</li>
                  <li>
                    Se permite avanzar o continuar según la configuración de la
                    actividad.
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
                  <li>Se muestra un modal indicando el error.</li>
                  <li>Se activa el botón Reintentar.</li>
                  <li>
                    El estudiante puede volver a seleccionar otra palabra.
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:col-span-2 p-4">
              <figure>
                <GameFish.Init
                  labelButton="¡Empezar!"
                  labelInstruction="Selecciona el pez que tiene la respuesta correcta para ganar."
                />
              </figure>
            </div>
          </div>
        </Col>
      </Row>
    </Panel.Section>

    <Panel.Section title="Actividad de Peces">
      <Row justifyContent="center" alignItems="flex-start">
        <Col xs="11" mm="10" md="9" lg="8" hd="7">
          <div className="text-center mb-16 space-y-4">
            <h2 className="title font-display text-secondary  uppercase">
              Pesca Correcta
            </h2>
            <div className="w-full h-2 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="bg-white  rounded-4xl  border border-slate-200    w-full  shadow-xl grid grid-cols-1 gap-4 p-10">
            <div className="md:col-span-2 p-4">
              <GameFish onResult={handleValidate}>
                <GameFish.Level label="1. ¿Qué componente se utiliza para almacenar carga eléctrica? ___">
                  {/* Definimos IDs claros para los modales */}
                  <GameFish.Fish
                    id="Q1_A1"
                    name="q1"
                    label="Condensador"
                    state="wrong"
                  />
                  <GameFish.Fish
                    id="Q1_A2"
                    name="q1"
                    label="Diodo"
                    state="wrong"
                  />
                  <GameFish.Fish
                    id="Q1_A4"
                    name="q1"
                    label="Capacitor"
                    state="wrong"
                  />
                  <GameFish.Fish
                    id="Q1_A5"
                    name="q1"
                    label="Resistencia"
                    state="wrong"
                  />
                  <GameFish.Fish
                    id="Q1_A3"
                    name="q1"
                    label="Interruptor"
                    state="wrong"
                  />
                  <GameFish.Fish
                    id="Q1_A6"
                    name="q1"
                    label="Inductor"
                    state="success"
                  />
                </GameFish.Level>
                <div className="flex justify-center items-center gap-3  mt-4">
                  <GameFish.Button>
                    <Button label="Comprobar" id="button-comprobar" />
                  </GameFish.Button>
                  <GameFish.Button type="reset">
                    <Button label="Reintentar" />
                  </GameFish.Button>
                </div>
              </GameFish>
            </div>
          </div>
        </Col>
      </Row>
    </Panel.Section>

    {/* --- MODALES PERSONALIZADOS POR RESPUESTA --- */}

    {/* Respuesta 1-1 */}
    <ModalFeedback
      type="wrong"
      isOpen={isOpen === "Q1_A1"}
      onClose={closeModal}
      finalFocusRef=".js-modal-wrong"
      audio="assets/audios/aud_ova-29_g1_sld-8_2 (Incorrecto).mp3"
      interpreter={{ contentURL: "vid_int_ova-55_sld-4_2_incorrecto.mp4" }}
    >
      <p className="u-text-center">Modal respuesta 1-1 (Condensador).</p>
    </ModalFeedback>

    {/* Respuesta 1-2 */}
    <ModalFeedback
      type="wrong"
      isOpen={isOpen === "Q1_A2"}
      onClose={closeModal}
      finalFocusRef=".js-modal-wrong"
      audio="assets/audios/aud_ova-29_g1_sld-8_2 (Incorrecto).mp3"
      interpreter={{ contentURL: "vid_int_ova-55_sld-4_2_incorrecto.mp4" }}
    >
      <p className="u-text-center">Modal respuesta 1-2 (Diodo).</p>
    </ModalFeedback>

    {/* Respuesta 1-3 */}
    <ModalFeedback
      type="wrong"
      isOpen={isOpen === "Q1_A3"}
      onClose={closeModal}
      finalFocusRef=".js-modal-wrong"
      audio="assets/audios/aud_ova-29_g1_sld-8_2 (Incorrecto).mp3"
      interpreter={{ contentURL: "vid_int_ova-55_sld-4_2_incorrecto.mp4" }}
    >
      <p className="u-text-center">Modal respuesta 1-3 (Interruptor).</p>
    </ModalFeedback>

    {/* Respuesta 1-4 */}
    <ModalFeedback
      type="wrong"
      isOpen={isOpen === "Q1_A4"}
      onClose={closeModal}
      finalFocusRef=".js-modal-wrong"
      audio="assets/audios/aud_ova-29_g1_sld-8_2 (Incorrecto).mp3"
      interpreter={{ contentURL: "vid_int_ova-55_sld-4_2_incorrecto.mp4" }}
    >
      <p className="u-text-center">Modal respuesta 1-4 (Capacitor).</p>
    </ModalFeedback>

    {/* Respuesta 1-5 */}
    <ModalFeedback
      type="wrong"
      isOpen={isOpen === "Q1_A5"}
      onClose={closeModal}
      finalFocusRef=".js-modal-wrong"
      audio="assets/audios/aud_ova-29_g1_sld-8_2 (Incorrecto).mp3"
      interpreter={{ contentURL: "vid_int_ova-55_sld-4_2_incorrecto.mp4" }}
    >
      <p className="u-text-center">Modal respuesta 1-5 (Resistencia).</p>
    </ModalFeedback>

    {/* Respuesta 1-6 (CORRECTA) */}
    <ModalFeedback
      type="success"
      isOpen={isOpen === "Q1_A6"}
      onClose={() => {
        closeModal();
        SectionNavigation.next();
      }}
      finalFocusRef="#main"
      audio="assets/audios/aud_ova-29_g1_sld-8_2 (Correcto).mp3"
      interpreter={{ contentURL: "vid_int_ova-55_sld-4_2_correcto.mp4" }}
    >
      <p className="u-text-center">
        ¡Muy bien! Has identificado la respuesta correcta (Inductor).
      </p>
    </ModalFeedback>
  </Panel>
  </>
);
}
