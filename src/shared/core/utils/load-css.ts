/**
 * Carga un módulo CSS dinámicamente, intentando primero desde una URL remota y, si falla, usando un archivo local.
 *
 * @param {Object} param - Configuración para las rutas CSS.
 * @param {string} param.ui - URL remota del archivo CSS.
 * @param {string} param.local - Ruta local del archivo CSS.
 * @returns {Promise<CSSModuleClasses>} - Promesa que resuelve las clases del módulo CSS.
 *
 * @example
 * const css = await loadCSS({
 *   ui: 'modal-feedback-ui/modal-feedback.module.css',
 *   local: 'modal-feedback-local/modal-feedback.module.css',
 * });
 */
export async function loadCSS({ ui, local }: { ui: string; local: string }): Promise<CSSModuleClasses> {
  // Cargar todos los módulos CSS remotos y locales en tiempo de compilación
  const remoteModules = import.meta.glob('../../ui/components/styles/**/*.css');
  const localModules = import.meta.glob('../components/**/*.css');

  try {
    // Intentar cargar el CSS desde la ruta remota
    const remotePath = `../../ui/components/styles/${ui}`;
    return await loadModule(remotePath, remoteModules, `La ruta remota no existe: ${remotePath}`);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(' Error al cargar CSS remoto:', error);
    }

    try {
      // Intentar cargar el CSS desde la ruta local
      const localPath = `../components/${local}`;
      return await loadModule(localPath, localModules, `La ruta local no existe: ${localPath}`);
    } catch (localError) {
      if (import.meta.env.DEV) {
        console.error('Error al cargar CSS local:', localError);
      }
      throw new Error('No se pudo cargar el CSS ni de forma remota ni local.');
    }
  }
}

const loadModule = async (
  path: string,
  modules: Record<string, () => Promise<unknown>>,
  errorMessage: string
): Promise<CSSModuleClasses> => {
  if (modules[path]) {
    const module = await modules[path]();

    return (module as { default: CSSModuleClasses }).default;
  } else {
    throw new Error(errorMessage);
  }
};
