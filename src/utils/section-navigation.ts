/** Mueve el `Panel` de una página de juego a otra sección haciendo clic en sus botones de navegación. */
export class SectionNavigation {
  /** Navega a la siguiente sección del panel. */
  static next() {
    document.querySelector<HTMLButtonElement>('.js-panel-next-button')?.click();
  }

  /** Navega a la sección anterior del panel. */
  static previous() {
    document.querySelector<HTMLButtonElement>('.js-panel-previous-button')?.click();
  }
}
