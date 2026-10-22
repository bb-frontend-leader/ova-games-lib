import { useReduceMotion } from './use-reduce-motion';

/**
 * Indica si un componente puede mover cosas con JavaScript (GSAP, efectos): false cuando el sistema pide reducir
 * el movimiento (`prefers-reduced-motion`). El CSS se rige por la misma condición.
 */
export const useCanAnimate = () => !useReduceMotion();
