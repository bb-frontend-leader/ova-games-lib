export const i18n = {
  es: {
    ['Check']: 'Comprobar',
    ['Reset']: 'Reiniciar',
    ['Finish']: 'Finalizar',
    ['Next']: 'Siguiente',
    ['Back']: 'Atrás',
    ['Logo']: 'Logotipo del programa Who Wants to Be a Millionaire',
    ['Prize']: 'Dinero acumulado',
    ['Correct']: 'Correcta',
    ['Wrong']: 'Incorrecta',
    ['CorrectAnswer']: 'Respuesta correcta',
    ['WrongAnswer']: 'Respuesta incorrecta',
    ['Blank']: 'espacio en blanco',
    ['Init']: {
      title: 'Who wants to be a millionaire?',
      prize: (prize: string) => `Gane ${prize} por cada respuesta correcta`,
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Lea la pregunta y elija una de las respuestas.',
        'Pulse «Comprobar»: si acierta, suma el premio a su dinero acumulado.',
        'Si falla, pulse «Reintentar» y elija otra. Pase a la siguiente pregunta con «Siguiente».'
      ],
      back: 'Volver',
      start: '¡Empezar!'
    },
    ['End']: {
      title: '¡Fin del juego!',
      text: (prize: string) => `Se lleva ${prize}.`,
      hits: 'Aciertos',
      of: (hits: number, total: number) => `${hits} de ${total}`,
      again: 'Jugar de nuevo'
    }
  },
  en: {
    ['Check']: 'Check',
    ['Reset']: 'Reset',
    ['Finish']: 'Finish',
    ['Next']: 'Next',
    ['Back']: 'Back',
    ['Logo']: 'Who Wants to Be a Millionaire logo',
    ['Prize']: 'Money earned',
    ['Correct']: 'Correct',
    ['Wrong']: 'Incorrect',
    ['CorrectAnswer']: 'Correct answer',
    ['WrongAnswer']: 'Incorrect answer',
    ['Blank']: 'blank',
    ['Init']: {
      title: 'Who wants to be a millionaire?',
      prize: (prize: string) => `Win ${prize} for every correct answer`,
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'Read the question and choose one of the answers.',
        'Press "Check": if you are right, the prize is added to your money.',
        'If you are wrong, press "Retry" and choose another. Move on with "Next".'
      ],
      back: 'Back',
      start: 'Start!'
    },
    ['End']: {
      title: 'Game over!',
      text: (prize: string) => `You take home ${prize}.`,
      hits: 'Correct answers',
      of: (hits: number, total: number) => `${hits} of ${total}`,
      again: 'Play again'
    }
  }
};
