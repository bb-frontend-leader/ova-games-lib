export class SectionNavigation {
  /**
   * Navega a la siguiente sección del panel
   */
  static next() {
    const elements = document.querySelector('.js-panel-next-button') as HTMLButtonElement | null;
    if (!elements) return;
    elements.click();
  }

  /**
   * Navega a la sección anterior del panel
   */
  static previous() {
    const elements = document.querySelector('.js-panel-previous-button') as HTMLButtonElement | null;
    if (!elements) return;
    elements.click();
  }
}
