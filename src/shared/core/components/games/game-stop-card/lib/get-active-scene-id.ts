/**
 * Devuelve el ID del contenedor de la escena activa que contiene
 * el elemento con el ID proporcionado.
 * @param inputId - ID del elemento
 * @returns El ID del contenedor de la escena activa, o null si no se encuentra
 */
export const getActiveSceneIdFromInputId = (inputId: string): string | null => {
  const el = document.getElementById(inputId);
  if (!el) return null;

  // Busca el contenedor de la escena por arriba (ajusta el selector a tu markup real)
  const wrapper = el.closest('[data-scene-id]') as HTMLElement | null;
  return wrapper?.dataset.sceneId ?? null;
};
