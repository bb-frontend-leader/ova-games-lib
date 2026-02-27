import { useCallback, useState } from 'react';
import { useLocalStorage } from 'books-ui';
import { KEY_LOCAL_STORAGE_A11Y } from '@core/consts';

import { INITIAL_STATE, INVALID_VALUES } from '../consts';
import type { ConfigA11y } from '../types/types';

type toggleHTMLDataAttributeType = (property: keyof ConfigA11y, value?: string) => void;

type useA11y = {
  config: ConfigA11y;
  setConfig: toggleHTMLDataAttributeType;
  updateHTMLAttributesFromLocalStorage: () => void;
};

export const useA11y = (): useA11y => {
  //TODO: Arreglar ese useLocalStorage, usar este hook (useA11y) en otro lado el este hook 👇 vuelve a meter el localStorage con el INITIAL_STATE
  const [configLocalStorage, setConfigLocalStorage] = useLocalStorage(KEY_LOCAL_STORAGE_A11Y, INITIAL_STATE);
  const [config, setConfig] = useState<ConfigA11y>(() => ({ ...configLocalStorage }));

  /**
   * Convierte una propiedad camelCase en un atributo data-*.
   *
   * @param {string} property - La propiedad camelCase que se convertirá.
   * @return {string} - El atributo data-* correspondiente.
   */
  const convertToDataAttribute = (property: string) => {
    return `data-${property
      .split(/(?<!^)(?=[A-Z])/)
      .map((str) => str.toLowerCase())
      .join('-')}`;
  };

  /**
   * Función utilizada para alternar una propiedad de la configuración de accesiblidad.
   * @param {keyof Config} property - Propiedad a alternar.
   */
  const toggleHTMLDataAttribute: toggleHTMLDataAttributeType = (property: keyof ConfigA11y, value?: string) => {
    const HTML_SELECTOR = document.querySelector('html');
    if (!HTML_SELECTOR) return;

    let propertyValue = value || !config[property];

    // Reestablece al valor inicial si el valor actual es igual al almacenado
    if (value === config[property]) {
      propertyValue = INITIAL_STATE[property];
    }

    // Convierte la propiedad camelCase a data-attribute
    const propertyDataSet = convertToDataAttribute(property);

    // Establece o elimina el atributo data-* en <html> según el valor
    if (!INVALID_VALUES.includes(propertyValue)) {
      HTML_SELECTOR.setAttribute(propertyDataSet, String(propertyValue));
    } else {
      HTML_SELECTOR.removeAttribute(propertyDataSet);
    }

    setConfigLocalStorage({ ...configLocalStorage, [property]: propertyValue });
    setConfig({ ...config, [property]: propertyValue });
  };

  /**
   * Función utilizada para actualizar el los atributos del HTML
   * con configuración de accesibilidad almacenada en el
   * local storage.
   */
  const updateHTMLAttributesFromLocalStorage = useCallback(() => {
    const HTML_SELECTOR = document.querySelector('html');
    if (!HTML_SELECTOR) return;

    Object.keys(configLocalStorage || {}).forEach((config) => {
      const value = configLocalStorage[config as keyof ConfigA11y];
      if (INVALID_VALUES.includes(value)) return;

      // Convierte la propiedad camelCase a data-attribute
      const property = convertToDataAttribute(config);
      HTML_SELECTOR.setAttribute(property, String(value));
    });
  }, [configLocalStorage]);

  return {
    config,
    setConfig: toggleHTMLDataAttribute,
    updateHTMLAttributesFromLocalStorage
  };
};
