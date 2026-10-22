/**
 * Indica si la respuesta del usuario coincide con alguna de las respuestas correctas.
 * Se ignoran los espacios al inicio y al final; las mayúsculas sí cuentan.
 *
 * @param userAnswer - Texto escrito por el usuario.
 * @param correctAnswers - Respuestas que se consideran correctas.
 */
export const isCorrectAnswer = (userAnswer: string, correctAnswers: string[]): boolean =>
  correctAnswers.some((answer) => answer.trim() === userAnswer.trim());
