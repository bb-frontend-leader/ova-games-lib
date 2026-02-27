interface ImageForSelect {
  join: number;
  url: string;
  alt: string;
}
interface AudioForSelect {
  join: number;
  url: string;
}

export const imageForSelect: ImageForSelect[] = [
  {
    join: 1,
    url: "assets/images/cardSelectImage/Texto_01.png",
    alt: "Proporciona la energía necesaria para el funcionamiento del circuito.",
  },
  {
    join: 2,
    url: "assets/images/cardSelectImage/Texto_02.png",
    alt: "Materiales que permiten el flujo de corriente eléctrica.",
  },
  {
    join: 3,
    url: "assets/images/cardSelectImage/Texto_03.png",
    alt: "Dispositivos que consumen energía para realizar trabajo",
  },
  {
    join: 4,
    url: "assets/images/cardSelectImage/Texto_04.png",
    alt: "Permite abrir o cerrar el circuito, controlando el flujo de corriente.",
  },
  {
    join: 5,
    url: "assets/images/cardSelectImage/Texto_05.png",
    alt: "Limita el flujo de corriente en el circuito.",
  },
  {
    join: 6,
    url: "assets/images/cardSelectImage/Texto_06.png",
    alt: "Almacena energía eléctrica temporalmente.",
  },
  {
    join: 7,
    url: "assets/images/cardSelectImage/Texto_07.png",
    alt: "Permite que la corriente fluya en una sola dirección.",
  },
  {
    join: 8,
    url: "assets/images/cardSelectImage/Texto_08.png",
    alt: "Actúa como un interruptor o amplificador de corriente",
  },
  {
    join: 9,
    url: "assets/images/cardSelectImage/Texto_09.png",
    alt: "Protege el circuito al interrumpir la corriente en caso de sobrecarga.",
  },
  {
    join: 10,
    url: "assets/images/cardSelectImage/Texto_10.png",
    alt: "Proporciona un camino seguro para la corriente en caso de falla.",
  },
];
export const audioForSelect: AudioForSelect[] = [
  {
    join: 1,
    url: "assets/audios/cardSelectAudio/myAudio.mp3",
  },
  {
    join: 2,
    url: "assets/audios/cardSelectAudio/yourAudio.mp3",
  },
  {
    join: 3,
    url: "assets/audios/cardSelectAudio/hisAudio.mp3",
  },
  {
    join: 4,
    url: "assets/audios/cardSelectAudio/herAudio.mp3",
  },
  {
    join: 5,
    url: "assets/audios/cardSelectAudio/itsAudio.mp3",
  },
  {
    join: 6,
    url: "assets/audios/cardSelectAudio/ourAudio.mp3",
  },
  {
    join: 7,
    url: "assets/audios/cardSelectAudio/theirAudio.mp3",
  },
];
export const INITIAL_STATE_ROUND_1 = [
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Walter White ",
    join: 1,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Jesse Pinkman",
    join: 2,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Gus Fring",
    join: 3,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Jane Margolis",
    join: 4,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Saul Goodman",
    join: 5,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Hank Schrader",
    join: 6,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Todd Alquist",
    join: 7,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Mike Ehrmantraut",
    join: 8,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Skyler White",
    join: 9,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Tuco Salamanca",
    join: 10,
    state: null,
  },
];

export const INITIAL_STATE_ROUND_2 = [
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Estado",
    join: 1,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Componente",
    join: 2,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Contexto",
    join: 3,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Evento",
    join: 4,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Validación",
    join: 5,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Referencia",
    join: 6,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Renderizado",
    join: 7,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Lógica",
    join: 8,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Interacción",
    join: 9,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "Persistencia",
    join: 10,
    state: null,
  },
];
export const INITIAL_STATE_ROUND_3 = [
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "my",
    join: 1,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "your",
    join: 2,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "his",
    join: 3,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "her",
    join: 4,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "its",
    join: 5,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "our",
    join: 6,
    state: null,
  },
  {
    url: "assets/images/cardSelectImage/question.png",
    alt: "imagen de un signo de interrogación.",
    text: "their",
    join: 7,
    state: null,
  },
];
