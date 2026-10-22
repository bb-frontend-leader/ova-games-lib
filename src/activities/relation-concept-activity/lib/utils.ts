import type { Link, Option } from '../types/types';

const IMAGE_EXTENSION = /\.(jpg|jpeg|png|svg|gif|webp)$/i;

/** Un `label` que termina en una extensión de imagen se dibuja como imagen. */
export const isImageLabel = (label: string) => IMAGE_EXTENSION.test(label);

/** Nombre que se anuncia de una tarjeta: su texto, o el `alt` (o uno genérico) si es una imagen. */
export const getOptionName = ({ label, alt }: Option, imageFallback: string) =>
  isImageLabel(label) ? (alt ?? imageFallback) : label;

/** Letra visible de un vínculo (1 → A). Pasadas las 26 se usa el número. */
export const slotLetter = (slot: number) => (slot <= 26 ? String.fromCharCode(64 + slot) : String(slot));

/** Menor posición libre entre los vínculos actuales. */
export const freeSlot = (links: Link[]) => {
  let slot = 1;
  while (links.some((link) => link.slot === slot)) slot += 1;

  return slot;
};

export const findLink = (links: Link[], id: string) =>
  links.find(({ first, second }) => first.id === id || second.id === id);
