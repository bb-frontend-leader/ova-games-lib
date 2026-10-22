/**
 * Returns the id of the closest ancestor element with an id that starts with "question-svg-".
 * If no such element is found, returns null.
 * @param inputId - The id of the element to start searching from.
 * @returns The id of the closest ancestor element with an id that starts with "question-svg-", or null if no such element is found.
 */
export const getActiveSceneIdFromInputId = (inputId: string): string | null => {
  const el = document.getElementById(inputId);
  if (!el) return null;

  // Busca el contenedor de la escena por arriba (ajusta el selector a tu markup real)
  const wrapper = el.closest('[id^="question-svg-"]') as HTMLElement | null;
  return wrapper?.id ?? null;
};
