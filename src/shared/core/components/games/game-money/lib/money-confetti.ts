import confetti from "canvas-confetti";

export function moneyConfetti() {
  // emoji 💵 / 💰 (puedes cambiarlo)
  const scalar = 1.25;
  const money = confetti.shapeFromText({ text: "💵", scalar });

  // 2 ráfagas para que se note más
  confetti({
    particleCount: 45,
    spread: 70,
    startVelocity: 35,
    ticks: 140,
    gravity: 1.1,
    origin: { x: 0.5, y: 0.2 },
    shapes: [money],
    scalar,
  });

  confetti({
    particleCount: 35,
    spread: 95,
    startVelocity: 28,
    ticks: 160,
    gravity: 1.15,
    origin: { x: 0.5, y: 0.15 },
    shapes: [money],
    scalar,
  });
}
