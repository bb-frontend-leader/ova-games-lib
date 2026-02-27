import { useState } from "react";
import {  Col, Row } from "books-ui";
import { Button } from "@/shared/ui/components";
import { MemoryCardActivity } from "@/shared/core/components/games";
import { ModalFeedback } from "@/shared/core/components";
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';

export default function GameMemoryCardPage() {
  const [openModal, setOpenModal] = useState<boolean | null>(null);

  const onResult = (result: boolean) => {
    setOpenModal(result);
  };

  const closeModal = () => {
    setOpenModal(null);
  };
  return (
    <>
      <Breadcrumbs/>
      <Row addClass="containerGame" justifyContent="center" alignItems="center">
        <Col xs="11" mm="10" md="9" lg="8" hd="6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="title font-display text-secondary  uppercase">
              Desafío de Memoria
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
                  es una actividad interactiva donde el estudiante debe
                  relacionar correctamente pares de cartas utilizando pistas
                  visuales y textuales.
                </p>
                <p>
                  Cada carta tiene dos caras, <strong> la cara frontal:</strong>{" "}
                  muestra un signo de interrogación junto con una palabra o
                  frase que sirve como pista, y la{" "}
                  <strong>cara posterior:</strong> contiene una imagen que debe
                  relacionarse con su pareja correcta.
                </p>
                <p>
                  <strong>Dinámica del juego:</strong>
                </p>
                <ol className="list-decimal list-inside">
                  <li>
                    El estudiante hace clic en una carta para voltearla y
                    descubrir la imagen oculta.
                  </li>
                  <li>
                    Luego selecciona una segunda carta para intentar formar una
                    pareja correcta.
                  </li>
                  <li>
                    La relación se basa en el significado de la pista presentada
                    en la parte frontal.
                  </li>
                </ol>
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
                    Ambas cartas permanecen volteadas mostrando sus imágenes.
                  </li>
                  <li>Se muestra un ícono de check ✔ sobre las cartas.</li>
                  <li>
                    La pareja queda bloqueada y ya no puede volver a
                    seleccionarse.
                  </li>
                  <li>El estudiante continúa buscando las demás relaciones.</li>
                  <li>
                    Al dar clic en el botón Comprobar, se despliega un modal con
                    la retroalimentación y mensaje de felicitaciones.
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
                  <li>Las cartas permanecen visibles unos segundos.</li>
                  <li>
                    Luego se voltean nuevamente mostrando el signo de
                    interrogación.
                  </li>
                  <li>No se bloquean y pueden volver a intentarse.</li>
                  <li>
                    El estudiante puede seguir buscando la combinación correcta.
                  </li>
                  <li>
                    Al dar clic en el botón Comprobar, se despliega un modal con
                    la retroalimentación y mensaje de debe intentarlo
                    nuevamente.
                  </li>
                  <li>Se habilita el botón de reiniciar.</li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-2 p-4">
              {/* aqui van las preguntas */}
              <MemoryCardActivity onResult={onResult}>
                <MemoryCardActivity.Board background="assets/images/ova_45_sld_19_fondo.webp" />

                {/* PAREJA 1: Trabajo en equipo */}
                <MemoryCardActivity.Card id={1}>
                  <MemoryCardActivity.CardBack>
                    <div>
                      <img src="assets/images/fondo.webp" alt="?" />
                    </div>
                    <div>
                      <p>Trabajo en equipo</p>
                    </div>
                  </MemoryCardActivity.CardBack>
                  <MemoryCardActivity.CardFront>
                    <div>
                      <img
                        src="assets/images/ova-45-sld-19_cuadro_success_1.webp"
                        alt="Trabajo en equipo"
                      />
                    </div>
                    <div>
                      <p>Trabajo en equipo</p>
                    </div>
                  </MemoryCardActivity.CardFront>
                </MemoryCardActivity.Card>

                <MemoryCardActivity.Card id={1}>
                  <MemoryCardActivity.CardBack>
                    <div>
                      <img src="assets/images/fondo.webp" alt="?" />
                    </div>
                    <div>
                      <p>Prácticas inclusivas</p>
                    </div>
                  </MemoryCardActivity.CardBack>
                  <MemoryCardActivity.CardFront>
                    <div>
                      <img
                        src="assets/images/ova-45-sld-19_cuadro_success_1.webp"
                        alt="Prácticas inclusivas"
                      />
                    </div>
                    <div>
                      <p>Prácticas inclusivas</p>
                    </div>
                  </MemoryCardActivity.CardFront>
                </MemoryCardActivity.Card>

                {/* PAREJA 2: Grupos y Saber */}
                <MemoryCardActivity.Card id={2}>
                  <MemoryCardActivity.CardBack>
                    <div>
                      <img src="assets/images/fondo.webp" alt="?" />
                    </div>
                    <div>
                      <p>Grupo poblacional</p>
                    </div>
                  </MemoryCardActivity.CardBack>
                  <MemoryCardActivity.CardFront>
                    <div>
                      <img
                        src="assets/images/ova-45-sld-19_cuadro_success_1.webp"
                        alt="Grupo poblacional"
                      />
                    </div>
                    <div>
                      <p>Grupo poblacional</p>
                    </div>
                  </MemoryCardActivity.CardFront>
                </MemoryCardActivity.Card>

                <MemoryCardActivity.Card id={2}>
                  <MemoryCardActivity.CardBack>
                    <div>
                      <img src="assets/images/fondo.webp" alt="?" />
                    </div>
                    <div>
                      <p>Lo que sé</p>
                    </div>
                  </MemoryCardActivity.CardBack>
                  <MemoryCardActivity.CardFront>
                    <div>
                      <img
                        src="assets/images/ova-45-sld-19_cuadro_success_1.webp"
                        alt="Lo que sé"
                      />
                    </div>
                    <div>
                      <p>Lo que sé</p>
                    </div>
                  </MemoryCardActivity.CardFront>
                </MemoryCardActivity.Card>

                {/* PAREJA 3: Modalidades y Consejería */}
                <MemoryCardActivity.Card id={3}>
                  <MemoryCardActivity.CardBack>
                    <div>
                      <img src="assets/images/fondo.webp" alt="?" />
                    </div>
                    <div>
                      <p>Modalidades</p>
                    </div>
                  </MemoryCardActivity.CardBack>
                  <MemoryCardActivity.CardFront>
                    <div>
                      <img
                        src="assets/images/ova-45-sld-19_cuadro_success_1.webp"
                        alt="Modalidades"
                      />
                    </div>
                    <div>
                      <p>Modalidades</p>
                    </div>
                  </MemoryCardActivity.CardFront>
                </MemoryCardActivity.Card>

                <MemoryCardActivity.Card id={3}>
                  <MemoryCardActivity.CardBack>
                    <div>
                      <img src="assets/images/fondo.webp" alt="?" />
                    </div>
                    <div>
                      <p>Equipo de consejería</p>
                    </div>
                  </MemoryCardActivity.CardBack>
                  <MemoryCardActivity.CardFront>
                    <div>
                      <img
                        src="assets/images/ova-45-sld-19_cuadro_success_1.webp"
                        alt="Equipo de consejería"
                      />
                    </div>
                    <div>
                      <p>Equipo de consejería</p>
                    </div>
                  </MemoryCardActivity.CardFront>
                </MemoryCardActivity.Card>

                {/* PAREJA 4: Experiencias y Cierre */}
                <MemoryCardActivity.Card id={4}>
                  <MemoryCardActivity.CardBack>
                    <div>
                      <img src="assets/images/fondo.webp" alt="?" />
                    </div>
                    <div>
                      <p>Experiencias estudiantes</p>
                    </div>
                  </MemoryCardActivity.CardBack>
                  <MemoryCardActivity.CardFront>
                    <div>
                      <img
                        src="assets/images/ova-45-sld-19_cuadro_success_1.webp"
                        alt="Experiencias estudiantes"
                      />
                    </div>
                    <div>
                      <p>Experiencias estudiantes</p>
                    </div>
                  </MemoryCardActivity.CardFront>
                </MemoryCardActivity.Card>

                <MemoryCardActivity.Card id={4}>
                  <MemoryCardActivity.CardBack>
                    <div>
                      <img src="assets/images/fondo.webp" alt="?" />
                    </div>
                    <div>
                      <p>Cierre</p>
                    </div>
                  </MemoryCardActivity.CardBack>
                  <MemoryCardActivity.CardFront>
                    <div>
                      <img
                        src="assets/images/ova-45-sld-19_cuadro_success_1.webp"
                        alt="Cierre"
                      />
                    </div>
                    <div>
                      <p>Cierre</p>
                    </div>
                  </MemoryCardActivity.CardFront>
                </MemoryCardActivity.Card>

                {/* Botones de control */}

                <div className="flex justify-center gap-4 mt-4">
                  <MemoryCardActivity.Button>
                    <Button label="Comprobar" id="button-comprobar" />
                  </MemoryCardActivity.Button>

                  <MemoryCardActivity.Button type="reset">
                    <Button label="Reintentar" />
                  </MemoryCardActivity.Button>
                </div>
              </MemoryCardActivity>
            </div>
          </div>
        </Col>
      </Row>
      <ModalFeedback
        type="success"
        isOpen={openModal === true}
        onClose={closeModal}
        audio="assets/audios/aud_ova-45_g1_sld-19 (Correcto).mp3"
        finalFocusRef="#main"
        interpreter={{ contentURL: "vid_int_ova-45_sld-19_(Correcto).mp4" }}
      >
        <p>
          Genial. Gracias por participar. Recuerda que puedes participar cuando
          lo desees.
        </p>
      </ModalFeedback>

      <ModalFeedback
        type="wrong"
        isOpen={openModal === false}
        onClose={closeModal}
        audio="assets/audios/aud_ova-45_g1_sld-19 (Incorrecto).mp3"
        finalFocusRef="#main"
        interpreter={{ contentURL: "vid_int_ova-45_sld-19(Correcto).mp4" }}
      >
        <p>
          ¡OOPS! Gracias por participar. No olvides consultar nuestro material y
          vuelve a intentarlo.
        </p>
      </ModalFeedback>
    </>
  );
}
