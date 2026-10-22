export type Lang = 'es' | 'en';

/** Idioma de la interfaz, tomado del atributo `lang` del documento (español por defecto). */
export const useLang = (): Lang => (document.documentElement.lang.startsWith('en') ? 'en' : 'es');
