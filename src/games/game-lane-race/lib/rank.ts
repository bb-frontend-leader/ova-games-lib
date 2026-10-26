/** Puesto del jugador entre los coches: los rivales que van estrictamente por delante, más uno (en empate gana el jugador). */
export const rankOf = (progress: number, rivals: number[]) => 1 + rivals.filter((r) => r > progress).length;
