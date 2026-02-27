import { useState } from "react";
import { Col, Row } from "books-ui";
import { SectionNavigation } from "@core/utils/section-navigation";

import { GameCasino, ModalFeedback } from "@/shared/core/components";
import { Button, Panel } from "@/shared/ui/components";
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';

export default function GameCasinoPage() {
   const [isOpen, setIsOpen] = useState<string | null>(null);

   const handleValidate = ({ options }: { options: { id: string }[] }) => {
     // Al validar, el estado isOpen toma el ID de la respuesta seleccionada
     if (options.length > 0) setIsOpen(options[0].id);
   };

   const closeModal = () => setIsOpen(null);
  return (
    <>
      <Breadcrumbs />
      <Panel>
        <GameCasino onResult={handleValidate}>
          {/* SECCIÓN 1: INTRODUCCIÓN */}
          <Panel.Section>
            <Row
              addClass="containerGame"
              justifyContent="center"
              alignItems="center"
            >
              <Col xs="11" mm="10" md="9" lg="8" hd="7" addClass="u-flow">
                <div className="text-center mb-16 space-y-4">
                  <h2 className="title font-display text-secondary  uppercase">
                    Apuesta Inteligente
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
                        Es una actividad interactiva ambientada en un entorno
                        tipo casino, donde el estudiante pone a prueba su
                        conocimiento tomando decisiones estratégicas.
                      </p>
                      <p>
                        En cada ronda se presenta una pregunta acompañada de
                        múltiples opciones de respuesta, configurables por el
                        instructor según el nivel o contenido académico.
                      </p>
                      <p>
                        Cada opción de respuesta incluye fichas de apuesta con
                        valores de $10, $15 y $25. El estudiante debe
                        seleccionar:
                      </p>
                      <ol className="list-decimal list-inside">
                        <li>La opción de respuesta que considera correcta.</li>
                        <li>La ficha con el valor que desea apostar.</li>
                      </ol>
                      <p>
                        El juego inicia con un capital base de $25. Según la
                        decisión tomada, el dinero puede aumentar o disminuir.
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
                        Si la respuesta es <strong>correcta</strong>:
                      </p>
                      <ul className="list-disc">
                        <li>
                          Se muestra un ✔ (check) sobre la opción seleccionada.
                        </li>
                        <li>Se actualiza el saldo sumando la apuesta.</li>
                        <li>
                          Se despliega un modal de felicitación, y de
                          retroalimentación si desea el instructor.
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
                          Se muestra una ✖ (X) sobre la opción seleccionada.
                        </li>
                        <li>Se descuenta la cantidad apostada del saldo.</li>
                        <li>Se despliega un modal de retroalimentación.</li>
                        <li>
                          Puede volver a intentar mientras tenga dinero
                          disponible.
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="md:col-span-2 p-4">
                    {/* aqui van las preguntas */}
                    <GameCasino.Init textInit="Responde correctamente cinco preguntas y gana algo de dinero." />
                  </div>
                </div>
              </Col>
            </Row>
          </Panel.Section>

          {/* SECCIÓN 2: PREGUNTA 1 */}
          <Panel.Section>
            <Row
              addClass="containerGame"
              justifyContent="center"
              alignItems="center"
            >
              <Col xs="11" mm="10" md="9" lg="8" hd="7" addClass="u-flow">
                <div className="text-center mb-16 space-y-4">
                  <h2 className="title font-display text-secondary  uppercase">
                    Apuesta Inteligente
                  </h2>
                  <div className="w-full h-2 bg-primary mx-auto rounded-full"></div>
                </div>
                <div className="bg-white  rounded-4xl  border border-slate-200    w-full  shadow-xl grid grid-cols-1 gap-4 p-10">
                  <div className="md:col-span-2 p-4">
                    <GameCasino.Level label="¿Pregunta # 1?">
                      <GameCasino.Element
                        bullet="A"
                        id="Q1_A1"
                        name="q1"
                        label="1-1"
                        state="wrong"
                      />
                      <GameCasino.Element
                        bullet="B"
                        id="Q1_A2"
                        name="q1"
                        label="1-2"
                        state="success"
                      />
                      <GameCasino.Element
                        bullet="C"
                        id="Q1_A3"
                        name="q1"
                        label="1-3"
                        state="wrong"
                      />
                      <GameCasino.Element
                        bullet="D"
                        id="Q1_A4"
                        name="q1"
                        label="1-4"
                        state="wrong"
                      />
                    </GameCasino.Level>
                  </div>
                  <div className="flex justify-center items-center gap-4 mt-4 ">
                    <GameCasino.Button>
                      <Button label="Apostar" />
                    </GameCasino.Button>
                    <GameCasino.Button type="reset">
                      <Button label="Reiniciar" />
                    </GameCasino.Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Panel.Section>
        </GameCasino>

        {/* --- MODALES POR CADA OPCIÓN DE RESPUESTA --- */}

        {/* Opción A */}
        <ModalFeedback
          type="wrong"
          isOpen={isOpen === "Q1_A1"}
          onClose={closeModal}
          finalFocusRef=".js-modal-wrong"
          audio="assets/audios/wrong.mp3"
        >
          <p>Incorrecto. La opción A no es válida. Perdiste tus fichas.</p>
        </ModalFeedback>

        {/* Opción B */}
        <ModalFeedback
          type="success"
          isOpen={isOpen === "Q1_A2"}
          onClose={() => {
            closeModal();
            SectionNavigation.next();
          }}
          finalFocusRef=".js-modal-success"
          audio="assets/audios/correct.mp3"
        >
          <p>¡Correcto! Ganaste la apuesta con la opción B.</p>
        </ModalFeedback>

        {/* Opción C */}
        <ModalFeedback
          type="wrong"
          isOpen={isOpen === "Q1_A3"}
          onClose={closeModal}
          finalFocusRef=".js-modal-wrong"
          audio="assets/audios/wrong.mp3"
        >
          <p>Incorrecto. La opción C es incorrecta. Perdiste tus fichas.</p>
        </ModalFeedback>

        {/* Opción D */}
        <ModalFeedback
          type="wrong"
          isOpen={isOpen === "Q1_A4"}
          onClose={closeModal}
          finalFocusRef=".js-modal-wrong"
          audio="assets/audios/wrong.mp3"
        >
          <p>
            Incorrecto. La opción D no es la respuesta. Perdiste tus fichas.
          </p>
        </ModalFeedback>
      </Panel>
    </>
  );
}
