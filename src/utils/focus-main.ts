/** Enfoca el contenido principal de la página. */
export const focusMainElement = () => {
  document.querySelector<HTMLElement>('main#main')?.focus();
};
