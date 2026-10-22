import gsap from 'gsap';

/**
 * Efectos de "juice" compartidos por los juegos (GSAP sobre nodos del DOM efímeros).
 *
 * Los nodos viven en una capa propia (`layer`: absoluta, `aria-hidden`, `pointer-events: none`) encima del juego,
 * así no alteran el layout ni reciben eventos, y se eliminan solos al terminar. El aspecto lo pone cada juego con
 * la clase que pasa en `className`; aquí solo se mueven. Llamar siempre dentro de un `contextSafe` de `useGSAP`
 * (o de un `useGSAP`) para que se cancelen al desmontar, y solo si `useCanAnimate()` es true.
 */

/** Duración (s) del vuelo de una pieza desde su origen hasta su espacio. */
export const FLIGHT_S = 0.46;

export type FxPoint = { x: number; y: number };

interface BurstOptions {
  /** Clase del fragmento: debe ser `position: absolute; top: 0; left: 0` y pintarse con `var(--fx-color)`. */
  className: string;
  colors: readonly string[];
  count?: number;
  /** Alcance mínimo y máximo (px) de los fragmentos. */
  reach?: [number, number];
  /** Tamaño mínimo y máximo (px) de los fragmentos. */
  size?: [number, number];
  /** `clip-path` posibles de cada fragmento (sin ellos, la clase decide la forma). */
  shapes?: readonly string[];
  /** Px que caen al final (positivo) o que suben (negativo, p. ej. burbujas). */
  gravity?: number;
}

/**
 * Centro de `rect` en coordenadas de la capa de efectos (`layer`).
 */
export const centerIn = (rect: DOMRect, layer: DOMRect): FxPoint => ({
  x: rect.left - layer.left + rect.width / 2,
  y: rect.top - layer.top + rect.height / 2
});

/**
 * Estallido de fragmentos que salen en abanico, caen (o suben) un poco y se desvanecen.
 */
export const burst = (
  layer: HTMLElement,
  at: FxPoint,
  { className, colors, count = 10, reach = [40, 90], size = [6, 11], shapes, gravity = 28 }: BurstOptions
) => {
  const { random } = gsap.utils;

  for (let i = 0; i < count; i++) {
    const shard = document.createElement('span');
    const side = random(size[0], size[1]);
    const angle = (i / count) * Math.PI * 2 + random(-0.35, 0.35);
    const distance = random(reach[0], reach[1]);

    shard.className = className;
    shard.style.width = `${side}px`;
    shard.style.height = `${side}px`;
    shard.style.setProperty('--fx-color', random([...colors]) as string);
    if (shapes?.length) shard.style.clipPath = random([...shapes]) as string;
    layer.appendChild(shard);

    gsap
      .timeline({ onComplete: () => shard.remove() })
      .fromTo(
        shard,
        { x: at.x, y: at.y, xPercent: -50, yPercent: -50, scale: 0.2, rotation: random(0, 360) },
        {
          x: at.x + Math.cos(angle) * distance,
          y: at.y + Math.sin(angle) * distance,
          scale: 1,
          rotation: `+=${random(-240, 240)}`,
          duration: random(0.3, 0.45),
          ease: 'power3.out'
        }
      )
      .to(shard, { y: `+=${gravity}`, scale: 0, opacity: 0, duration: random(0.4, 0.6), ease: 'power1.in' });
  }
};

/**
 * Onda expansiva: un aro (la clase decide su forma y borde) que crece y se desvanece.
 * `flat` (0-1) lo aplasta en vertical: 0.45 da la elipse de una onda sobre el agua.
 */
export const ring = (layer: HTMLElement, at: FxPoint, className: string, color: string, flat = 1) => {
  const el = document.createElement('span');

  el.className = className;
  el.style.borderColor = color;
  layer.appendChild(el);

  gsap.set(el, { x: at.x, y: at.y, xPercent: -50, yPercent: -50 });
  gsap.fromTo(
    el,
    { scaleX: 0.2, scaleY: 0.2 * flat, opacity: 0.9 },
    { scaleX: 2.6, scaleY: 2.6 * flat, opacity: 0, duration: 0.55, ease: 'power2.out', onComplete: () => el.remove() }
  );
};

/**
 * Una pieza (copia del texto elegido) vuela en arco desde su origen hasta su espacio, dejando una estela de dos
 * copias tenues. Es solo decorativa: el estado real ya cambió y los lectores de pantalla lo anuncian sin esperar.
 *
 * @param layer - capa de efectos (posicionada; `layerRect` es su caja)
 * @param from - caja de la pieza en su origen (define el tamaño del vuelo)
 * @param to - caja del espacio de destino
 * @param className - clase de la pieza voladora (absoluta, mismo aspecto que la pieza real)
 * @param onLand - se llama al aterrizar la copia principal
 */
export const flyChip = (
  layer: HTMLElement,
  layerRect: DOMRect,
  from: DOMRect,
  to: DOMRect,
  text: string,
  className: string,
  onLand: () => void
) => {
  const start = centerIn(from, layerRect);
  const end = centerIn(to, layerRect);
  const apexY = Math.min(start.y, end.y) - Math.min(90, Math.abs(end.y - start.y) * 0.3 + 36);
  const endScale = gsap.utils.clamp(0.85, 1.2, (to.width / from.width) * 0.8);

  [0, 1, 2].forEach((k) => {
    const el = document.createElement('span');

    el.className = className;
    el.textContent = text;
    el.style.width = `${from.width}px`;
    el.style.height = `${from.height}px`;
    layer.appendChild(el);

    gsap.set(el, { x: start.x, y: start.y, xPercent: -50, yPercent: -50, opacity: k === 0 ? 1 : 0.4 / k });

    gsap
      .timeline({
        delay: k * 0.045,
        onComplete: () => {
          el.remove();
          if (k === 0) onLand();
        }
      })
      .fromTo(
        el,
        { rotation: gsap.utils.random(-14, 14) },
        { rotation: 0, scale: endScale, duration: FLIGHT_S, ease: 'power1.out' },
        0
      )
      .to(el, { x: end.x, duration: FLIGHT_S, ease: 'power2.inOut' }, 0)
      .to(el, { y: apexY, duration: FLIGHT_S * 0.45, ease: 'power2.out' }, 0)
      .to(el, { y: end.y, duration: FLIGHT_S * 0.55, ease: 'power2.in' }, FLIGHT_S * 0.45);
  });
};
