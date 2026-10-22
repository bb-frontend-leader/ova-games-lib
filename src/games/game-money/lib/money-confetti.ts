import confetti from 'canvas-confetti';

const SCALAR = 1.25;

// La forma del emoji se dibuja una sola vez: crearla en cada acierto cuesta varios fotogramas
let money: confetti.Shape | null = null;

/**
 * Calienta el confeti (crea la forma y el lienzo) con una pieza fuera de pantalla, para que el primer acierto no
 * se atasque. Se llama cuando el navegador está libre, al montar el juego.
 */
export function warmMoneyConfetti() {
  money ??= confetti.shapeFromText({ text: '💵', scalar: SCALAR });

  confetti({ particleCount: 1, ticks: 1, origin: { x: -1, y: -1 }, shapes: [money], scalar: SCALAR });
}

export function moneyConfetti() {
  // emoji 💵 / 💰 (puedes cambiarlo)
  money ??= confetti.shapeFromText({ text: '💵', scalar: SCALAR });

  // 2 ráfagas para que se note más (pocas piezas: la lluvia de monedas del juego pone el resto)
  confetti({
    particleCount: 24,
    spread: 70,
    startVelocity: 35,
    ticks: 140,
    gravity: 1.1,
    origin: { x: 0.5, y: 0.2 },
    shapes: [money],
    scalar: SCALAR
  });

  confetti({
    particleCount: 18,
    spread: 95,
    startVelocity: 28,
    ticks: 160,
    gravity: 1.15,
    origin: { x: 0.5, y: 0.15 },
    shapes: [money],
    scalar: SCALAR
  });
}
