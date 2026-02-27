export function parseLabel(label: string): { letter: string | null; text: string } {
  const trimmed = label.trim();

  // Busca el primer punto
  const dotIndex = trimmed.indexOf('.');

  // Si no hay punto o el punto está al inicio o al final, no hay "letter" válido
  if (dotIndex <= 0 || dotIndex === trimmed.length - 1) {
    return { letter: null, text: trimmed };
  }

  const left = trimmed.slice(0, dotIndex).trim();
  const right = trimmed.slice(dotIndex + 1).trim();

  // Solo consideramos "letter" si realmente hay algo a la derecha
  if (!right) return { letter: null, text: trimmed };

  return { letter: left || null, text: right };
}
