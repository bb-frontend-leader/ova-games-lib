/**
 * Tipo que define los idiomas soportados.
 * 'en' para inglés y 'es' para español.
 */
export type Language = 'en' | 'es';

/**
 * Tipos de página que puede tener una OVA.
 * Define el propósito de cada página dentro del flujo de la ruta de aprendizaje.
 */
export enum OvaPageKind {
  /** Página de bienvenida/inicio de la OVA. */
  START = 'start',
  /** Página que presenta los objetivos de aprendizaje. */
  OBJECTIVE = 'objective',
  /** Página de presentación en video previa a un video principal. */
  VIDEO_PRESENTATION = 'video_presentation',
  /** Quiz diagnóstico previo (presaberes). */
  QUIZ_PRESABER = 'quiz_presaber',
  /** Quiz de evaluación general. */
  QUIZ = 'quiz',
  /** Quiz embebido dentro de una página de contenido. */
  QUIZ_CONTENT = 'quiz_content',
  /** Página de contenido teórico/textual. */
  CONTENT = 'content',
  /** Página de resumen de lo aprendido. */
  RESUME = 'resume'
}

export type OvaPageType = {
  path: string;
  title: string;
  visited: boolean;
  kind: OvaPageKind;
};


/**
 * Tipo para las rutas de la OVA.
 * Cada ruta tiene un título y un componente asociado.
 */
export type RouteType = {
  title: string;
  component: JSX.Element;
  kind: OvaPageKind;
};
/**
 * Tipo que define la estructura del contexto de la OVA (Objeto Virtual de Aprendizaje).
 */
export type OvaContextType = {
  lang: Language;
};
