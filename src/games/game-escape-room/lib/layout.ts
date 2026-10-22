import { ROOM_ICONS } from './constant';

import type { Obj } from '../types/types';

type Random = () => number;

const shuffle = <T>(items: readonly T[], random: Random) => {
  const list = [...items];

  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));

    [list[i], list[j]] = [list[j], list[i]];
  }

  return list;
};

/** Cuántas salas salen de `total` preguntas con `perRoom` objetos en cada una (la última puede tener menos). */
export const roomCount = (total: number, perRoom: number) => Math.ceil(total / Math.max(1, perRoom));

/**
 * Reparte las preguntas por las salas (en orden aleatorio) y le da a cada objeto un dígito al azar y una posición
 * en el código de su puerta: las posiciones de cada sala son un orden aleatorio de 1 a n.
 */
export const createObjects = (total: number, perRoom: number, random: Random = Math.random): Obj[] => {
  const order = shuffle(
    Array.from({ length: total }, (_, q) => q),
    random
  );
  const objs: Obj[] = [];

  for (let room = 0; room * perRoom < total; room++) {
    const questions = order.slice(room * perRoom, (room + 1) * perRoom);
    const slots = shuffle(
      questions.map((_, k) => k + 1),
      random
    );
    const icons = ROOM_ICONS[room % ROOM_ICONS.length];

    questions.forEach((q, k) => {
      objs.push({
        id: objs.length,
        q,
        room,
        slot: slots[k],
        digit: Math.floor(random() * 10),
        icon: icons[k % icons.length],
        open: false
      });
    });
  }

  return objs;
};

/** El código de la puerta de una sala: los dígitos de sus objetos puestos en orden de posición. */
export const roomCode = (objs: Obj[], room: number) =>
  objs
    .filter((obj) => obj.room === room)
    .sort((a, b) => a.slot - b.slot)
    .map((obj) => obj.digit);
