import { useState } from "react";
import type { JSX } from "react";
import { Audio,  Col, Row } from "books-ui";
import { Panel, Button } from "@ui/components";
import { ModalFeedback, PhraseAndImage } from "@/shared/core/components";
import css from "../styles/stylesheet/phraseAndImage.module.css";

import {
  audioForSelect,
  imageForSelect,
  INITIAL_STATE_ROUND_1,
  INITIAL_STATE_ROUND_2,
  INITIAL_STATE_ROUND_3,
} from "@/data/ova-02-p17-data";
import { Breadcrumbs } from "@/components";

export interface Card {
  url: string;
  alt: string;
  text: string;
  join: number;
  state: boolean | null;
  textChildren?: JSX.Element | JSX.Element[] | null;
}

const MODALS = {
  TRUE: "modal-correct-activity",
  FALSE: "modal-wrong-activity",
};

export default function GamePhraseAndImagePage() {
  const [isOpen, setIsOpen] = useState<string | null>(null);

  const handleResult = (result: boolean) => {
    const activityResult = result.toString().toUpperCase();
    setIsOpen(MODALS[activityResult as keyof typeof MODALS]);
  };
  const closeModal = () => setIsOpen(null);
  return (
    <>
    <Breadcrumbs />
      <Panel>
        <Panel.Section>
          <Row
            addClass="containerGame"
            justifyContent="center"
            alignItems="flex-start"
          >
            <Col xs="11" mm="11" hd="8" addClass="u-flow m-4">
              <div className="text-center mb-16 space-y-4">
                <h2 className="title font-display text-secondary  uppercase">
                  Descubre la Imagen Correcta
                </h2>
                <div className="w-full h-2 bg-primary mx-auto rounded-full"></div>
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
                      relacionar correctamente una descripción textual con su
                      imagen correspondiente.
                    </p>
                    <p>
                      En pantalla se presentan varias cartas, cada una con un
                      texto en la parte inferior. Al hacer clic sobre una carta,
                      se abre un modal que muestra múltiples opciones de imagen.
                      El estudiante debe seleccionar la imagen que considere
                      adecuada según el texto.
                    </p>
                    <p>
                      Una vez seleccionada, la imagen elegida se muestra
                      automáticamente en la carta previamente seleccionada. El
                      proceso continúa hasta completar todas las cartas.
                    </p>
                    <p>
                      El docente puede agregar la actividad tantas veces como
                      desee en la misma página, adaptándola a distintos
                      contenidos.
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
                      Si la respuesta es <strong> correcta </strong>,
                    </p>
                    <ul className="list-disc">
                      <li>Todas las cartas se resaltan en color verde.</li>
                      <li>Se abre un modal de felicitación.</li>
                      <li>Se muestra retroalimentación positiva.</li>
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
                      <li>Las cartas correctas se muestran en verde.</li>
                      <li>Las cartas incorrectas se muestran en rojo.</li>
                      <li>Se abre un modal con una retroalimentación.</li>
                      <li>Se permite reintentar la actividad.</li>
                    </ul>
                  </div>
                </div>

                <div className="md:col-span-2 p-4">
                  {/* aqui van las preguntas */}
                  <PhraseAndImage
                    numCorrects={10}
                    onResult={(value) => handleResult(value)}
                    type="image"
                    initialCards={INITIAL_STATE_ROUND_1}
                  >
                    <div className={css.containerCards}>
                      <PhraseAndImage.Modal>
                        <div className={css.containerImages}>
                          {imageForSelect.map((item, index) => (
                            <PhraseAndImage.selectImage
                              key={index}
                              id={index}
                              url={item.url}
                              alt={item.alt}
                              join={item.join}
                            />
                          ))}
                        </div>
                      </PhraseAndImage.Modal>
                    </div>

                    <div className={`mt-4 ${css.btnActions}`}>
                      <PhraseAndImage.Button>
                        <Button label="Comprobar" />
                      </PhraseAndImage.Button>

                      <PhraseAndImage.Button type="reset">
                        <Button label="Reintentar" addClass="js-modal-wrong" />
                      </PhraseAndImage.Button>
                    </div>
                  </PhraseAndImage>
                </div>
              </div>
            </Col>
          </Row>
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
            <p>
              ¡Muy bien! Es correcta la respuesta. Cada componente eléctrico
              tiene un único fin.
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
            <p>¡Ups! Al parecer algo no quedo bien.</p>
          </ModalFeedback>
        </Panel.Section>
        <Panel.Section>
          <Row
            addClass="containerGame"
            justifyContent="center"
            alignItems="flex-start"
          >
            <Col xs="11" mm="11" hd="8" addClass="u-flow m-4">
              <div className="text-center mb-16 space-y-4">
                <h2 className="title font-display text-secondary  uppercase">
                  Descubre el texto Correcto
                </h2>
                <div className="w-full h-2 bg-primary mx-auto rounded-full"></div>
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
                      relacionar correctamente un enunciado principal con el
                      texto que mejor lo complementa o explica.
                    </p>
                    <p>
                      En pantalla se presentan varias cartas con una consigna,
                      pregunta o frase base. Al hacer clic sobre una carta, se
                      abre un modal que contiene varias opciones de texto. El
                      estudiante debe analizar cuidadosamente y seleccionar la
                      opción que corresponda correctamente.
                    </p>
                    <p>
                      Una vez elegida, el texto seleccionado se muestra
                      automáticamente en la carta correspondiente. El proceso
                      continúa hasta completar todas las cartas.
                    </p>
                    <p>
                      El docente puede agregar la actividad tantas veces como
                      desee en la misma página, adaptándola a distintos
                      contenidos.
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
                      <li>Todas las cartas se resaltan en color verde.</li>
                      <li>Se abre un modal con retroalimentación.</li>
                      <li>Se muestra retroalimentación positiva.</li>
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
                      <li>Las cartas correctas se muestran en verde.</li>
                      <li>Las cartas incorrectas se resaltan en rojo.</li>
                      <li>Se abre un modal con retroalimentación.</li>
                      <li>Se habilita la opción de reintentar.</li>
                    </ul>
                  </div>
                </div>

                <div className="md:col-span-2 p-4">
                  <PhraseAndImage
                    numCorrects={10}
                    onResult={(value) => handleResult(value)}
                    initialCards={INITIAL_STATE_ROUND_2}
                    type="text"
                  >
                    <div className={css.containerCards}>
                      <PhraseAndImage.Modal>
                        <div className={css.containerImages}>
                          <PhraseAndImage.selectText join={1}>
                            <p>
                              Información que representa la situación actual de
                              algo en un momento determinado.
                            </p>
                          </PhraseAndImage.selectText>
                          <PhraseAndImage.selectText join={2}>
                            <p>
                              Parte independiente y reutilizable que forma un
                              sistema más grande.
                            </p>
                          </PhraseAndImage.selectText>
                          <PhraseAndImage.selectText join={3}>
                            <p>
                              Conjunto de circunstancias o información que
                              rodean una situación y le dan sentido
                            </p>
                          </PhraseAndImage.selectText>
                          <PhraseAndImage.selectText join={4}>
                            <p>
                              Acción o suceso que ocurre como resultado de una
                              interacción o proceso.
                            </p>
                          </PhraseAndImage.selectText>
                          <PhraseAndImage.selectText join={5}>
                            <p>
                              Proceso para comprobar si algo cumple con una
                              condición o regla definida.
                            </p>
                          </PhraseAndImage.selectText>
                          <PhraseAndImage.selectText join={6}>
                            <p>
                              Enlace directo a un objeto, elemento o dato
                              específico para poder acceder a él.
                            </p>
                          </PhraseAndImage.selectText>
                          <PhraseAndImage.selectText join={7}>
                            <p>
                              Proceso de mostrar visualmente información en
                              pantalla.
                            </p>
                          </PhraseAndImage.selectText>
                          <PhraseAndImage.selectText join={8}>
                            <p>
                              Conjunto de reglas o decisiones que determinan el
                              comportamiento de un sistema.
                            </p>
                          </PhraseAndImage.selectText>
                          <PhraseAndImage.selectText join={9}>
                            <p>
                              Acción mediante la cual un usuario se comunica o
                              actúa sobre una interfaz.
                            </p>
                          </PhraseAndImage.selectText>
                          <PhraseAndImage.selectText join={10}>
                            <p>
                              Capacidad de mantener información guardada incluso
                              después de cerrar o reiniciar un sistema.
                            </p>
                          </PhraseAndImage.selectText>
                        </div>
                      </PhraseAndImage.Modal>
                    </div>

                    <div className={`mt-4 ${css.btnActions}`}>
                      <PhraseAndImage.Button>
                        <Button label="Comprobar" />
                      </PhraseAndImage.Button>

                      <PhraseAndImage.Button type="reset">
                        <Button label="Reintentar" addClass="js-modal-wrong" />
                      </PhraseAndImage.Button>
                    </div>
                  </PhraseAndImage>
                </div>
              </div>
            </Col>
          </Row>
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
            <p>
              ¡Muy bien! Es correcta la respuesta. Cada componente eléctrico
              tiene un único fin.
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
            <p>¡Ups! Al parecer algo no quedo bien.</p>
          </ModalFeedback>
        </Panel.Section>
        <Panel.Section>
          <Audio a11y src="assets/audios/slide1-acc-1.mp3" />
          <Row
            addClass="containerGame"
            justifyContent="center"
            alignItems="flex-start"
          >
            <Col xs="11" mm="11" hd="8" addClass="u-flow m-4">
              <div className="text-center mb-16 space-y-4">
                <h2 className="title font-display text-secondary  uppercase">
                  {" "}
                  Descubre el audio correcto
                </h2>
                <div className="w-full h-2 bg-primary mx-auto rounded-full"></div>
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
                      Es una actividad interactiva donde el estudiante debe
                      relacionar correctamente un enunciado principal con el
                      audio que mejor lo complementa o explica.
                    </p>
                    <p>
                      En pantalla se presentan varias cartas con una consigna,
                      pregunta o frase base. Al hacer clic sobre una carta, se
                      abre un modal que contiene varias opciones de texto. El
                      estudiante debe analizar cuidadosamente y seleccionar la
                      opción que corresponda correctamente.
                    </p>
                    <p>
                      Una vez elegida, el texto seleccionado se muestra
                      automáticamente en la carta correspondiente. El proceso
                      continúa hasta completar todas las cartas.
                    </p>
                    <p>
                      El docente puede agregar la actividad tantas veces como
                      desee en la misma página, adaptándola a distintos
                      contenidos.
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
                      <li>Todas las cartas se resaltan en color verde.</li>
                      <li>Se abre un modal de felicitación.</li>
                      <li>Se muestra retroalimentación positiva.</li>
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
                        <li>Las cartas correctas se muestran en verde.</li>
                        <li>Las cartas incorrectas se resaltan en rojo.</li>
                        <li>Se abre un modal con retroalimentación.</li>
                        <li>Se habilita la opción de reintentar.</li>
                    </ul>
                  </div>
                </div>

                <div className="md:col-span-2 p-4">
                  <PhraseAndImage
                    numCorrects={7}
                    onResult={(value) => handleResult(value)}
                    initialCards={INITIAL_STATE_ROUND_3}
                    type="audio"
                  >
                    <div className={css.containerCards}>
                      <PhraseAndImage.Modal>
                        <div className={css.containerImages}>
                          {audioForSelect.map((item, index) => (
                            <PhraseAndImage.selectAudio
                              key={index}
                              id={index}
                              urlAudio={item.url}
                              join={item.join}
                            />
                          ))}
                        </div>
                      </PhraseAndImage.Modal>
                    </div>
                    <div className={`mt-4 ${css.btnActions}`}>
                      <PhraseAndImage.Button>
                        <Button label="Comprobar" />
                      </PhraseAndImage.Button>

                      <PhraseAndImage.Button type="reset">
                        <Button label="Reintentar" addClass="js-modal-wrong" />
                      </PhraseAndImage.Button>
                    </div>
                  </PhraseAndImage>
                </div>
              </div>
            </Col>
          </Row>
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
            <p>
              ¡Muy bien! Es correcta la respuesta. Cada componente eléctrico
              tiene un único fin.
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
            <p>¡Ups! Al parecer algo no quedo bien.</p>
          </ModalFeedback>
        </Panel.Section>
      </Panel>
    </>
  );
}
