/** Quita tildes y pasa a minúsculas: "Órdena" y "ordena" se consideran iguales al buscar. */
export const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
